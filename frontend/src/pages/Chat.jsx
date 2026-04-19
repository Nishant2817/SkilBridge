import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getConversation } from "../api/messages";
import { getSocket, disconnectSocket } from "../socket";

export default function Chat() {
  const { userId: targetId } = useParams();
  const { token, user } = useAuth();

  const [messages, setMessages]   = useState([]);
  const [text, setText]           = useState("");
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState("");
  const bottomRef                 = useRef(null);
  const myId                      = user?.id;

  // ── Load history & connect socket ─────────────────────────────────────────
  useEffect(() => {
    if (!token || !targetId) return;

    // 1. Fetch chat history from REST endpoint
    getConversation(targetId, token)
      .then((data) => setMessages(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));

    // 2. Connect socket
    const socket = getSocket(token);

    // 3. Listen for incoming messages
    socket.on("receiveMessage", (msg) => {
      // Only append if this message belongs to this conversation
      const isRelevant =
        (msg.senderId === Number(targetId) && msg.receiverId === myId) ||
        (msg.senderId === myId && msg.receiverId === Number(targetId));

      if (isRelevant) {
        setMessages((prev) => {
          // De-duplicate — server echoes back to sender too
          if (prev.find((m) => m.id === msg.id)) return prev;
          return [...prev, msg];
        });
      }
    });

    return () => {
      socket.off("receiveMessage");
      disconnectSocket();
    };
  }, [token, targetId, myId]);

  // ── Auto-scroll to bottom ─────────────────────────────────────────────────
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ── Send handler ──────────────────────────────────────────────────────────
  const sendMessage = (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    const socket = getSocket(token);
    socket.emit("sendMessage", { receiverId: Number(targetId), text });
    setText("");
  };

  // ── Helpers ───────────────────────────────────────────────────────────────
  const formatTime = (ts) =>
    new Date(ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col pt-20">
      {/* Header */}
      <div className="border-b border-slate-800 bg-slate-900/95 backdrop-blur-sm sticky top-16 z-10 px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-green-500 flex items-center justify-center text-slate-900 font-bold text-sm">
            #{targetId}
          </div>
          <div>
            <p className="text-white font-semibold">User #{targetId}</p>
            <p className="text-gray-500 text-xs">Direct Message</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        <div className="max-w-3xl mx-auto flex flex-col gap-3">

          {loading && (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className={`h-10 rounded-2xl animate-pulse bg-slate-800 ${
                    i % 2 === 0 ? "w-2/3" : "w-1/2 self-end"
                  }`}
                />
              ))}
            </div>
          )}

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-center">
              {error}
            </div>
          )}

          {!loading && !error && messages.length === 0 && (
            <div className="text-center py-16 text-gray-500">
              <p className="text-4xl mb-3">💬</p>
              <p className="font-medium">No messages yet.</p>
              <p className="text-sm mt-1">Say hello to get the conversation started!</p>
            </div>
          )}

          {messages.map((msg) => {
            const isMine = msg.senderId === myId;
            return (
              <div
                key={msg.id}
                className={`flex flex-col gap-1 ${isMine ? "items-end" : "items-start"}`}
              >
                <div
                  className={`max-w-[70%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                    isMine
                      ? "bg-green-500 text-white rounded-br-sm"
                      : "bg-slate-800 text-gray-200 border border-slate-700 rounded-bl-sm"
                  }`}
                >
                  {msg.text}
                </div>
                <span className="text-[11px] text-gray-600 px-1">
                  {formatTime(msg.createdAt)}
                </span>
              </div>
            );
          })}

          <div ref={bottomRef} />
        </div>
      </div>

      {/* Input */}
      <div className="border-t border-slate-800 bg-slate-900/95 backdrop-blur-sm sticky bottom-0 px-6 py-4">
        <form
          onSubmit={sendMessage}
          className="max-w-3xl mx-auto flex items-center gap-3"
        >
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-green-500 transition-colors text-sm"
          />
          <button
            type="submit"
            disabled={!text.trim()}
            className="bg-green-500 hover:bg-green-600 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold px-5 py-3 rounded-xl transition-colors"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
