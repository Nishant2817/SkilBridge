import { useEffect, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getConversations, getMessages, sendMessage } from "../api/messages";
import { useSearchParams } from "react-router-dom";

export default function Messages() {
  const { token, user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [activeConvId, setActiveConvId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [loadingConv, setLoadingConv] = useState(true);
  const [loadingMsgs, setLoadingMsgs] = useState(false);
  const bottomRef = useRef(null);
  const myId = user?.id;

  const [searchParams] = useSearchParams();
  const urlConvId = searchParams.get("c");

  // Load conversations
  useEffect(() => {
    if (!token) return;
    getConversations(token)
      .then(data => {
        setConversations(data);
        if (urlConvId && data.find(c => c.id === urlConvId)) {
          setActiveConvId(urlConvId);
        } else if (data.length > 0 && !activeConvId) {
          setActiveConvId(data[0].id);
        }
      })
      .catch(console.error)
      .finally(() => setLoadingConv(false));
  }, [token, urlConvId]);

  // Load messages & poll
  useEffect(() => {
    if (!token || !activeConvId) return;

    const fetchMsgs = () => {
      getMessages(activeConvId, token)
        .then(setMessages)
        .catch(console.error);
    };

    setLoadingMsgs(true);
    fetchMsgs();
    setLoadingMsgs(false);

    const interval = setInterval(fetchMsgs, 3000); // Basic REST polling
    return () => clearInterval(interval);
  }, [token, activeConvId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!text.trim() || !activeConvId) return;
    const txt = text;
    setText(""); 
    try {
      const newMsg = await sendMessage(activeConvId, txt, token);
      setMessages(prev => [...prev, newMsg]);
      // Update sidebar latest message optimistically
      setConversations(prev => prev.map(c => 
         c.id === activeConvId ? { ...c, messages: [newMsg], updatedAt: new Date().toISOString() } : c
      ).sort((a,b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()));
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    } catch (err) {
      console.error(err);
      setText(txt); 
    }
  };

  const formatTime = (ts) => new Date(ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  return (
    <div className="min-h-screen bg-gray-50 flex pt-[66px]">
      <div className="max-w-7xl mx-auto w-full flex h-[calc(100vh-66px)] border-x border-gray-200 bg-white">
        
        {/* Sidebar */}
        <div className="w-1/3 border-r border-gray-200 flex flex-col bg-gray-50/50">
          <div className="p-6 border-b border-gray-200 bg-white">
            <h2 className="text-2xl font-bold text-gray-900">Inbox</h2>
          </div>
          <div className="flex-1 overflow-y-auto">
            {loadingConv ? (
               <div className="p-6 text-gray-500 font-medium text-center">Loading inbox...</div>
            ) : conversations.length === 0 ? (
               <div className="p-6 text-gray-500 text-center font-medium opacity-60">No conversations yet.</div>
            ) : (
               conversations.map(c => {
                 const otherUser = c.buyerId === myId ? c.seller : c.buyer;
                 const isActive = c.id === activeConvId;
                 const lastMsg = c.messages?.[0]?.text || "No messages yet";
                 return (
                   <button 
                     key={c.id} 
                     onClick={() => setActiveConvId(c.id)}
                     className={`w-full flex items-center gap-4 p-4 text-left border-b border-gray-100 transition-all ${isActive ? 'bg-emerald-50 border-emerald-100' : 'hover:bg-white bg-gray-50/30'}`}
                   >
                     <img src={otherUser.image || "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=100"} alt="Avatar" className="w-12 h-12 rounded-full object-cover shadow-sm bg-white border border-gray-200" />
                     <div className="flex-1 min-w-0">
                       <h3 className={`font-bold truncate text-[15px] ${isActive ? 'text-emerald-700' : 'text-gray-900'}`}>{otherUser.username}</h3>
                       <p className={`text-[13px] truncate mt-0.5 ${isActive ? 'text-emerald-600 font-medium' : 'text-gray-500'}`}>{lastMsg}</p>
                     </div>
                   </button>
                 )
               })
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className="w-2/3 flex flex-col bg-white relative">
           {activeConvId ? (
             <>
               {/* Chat Header */}
               <div className="h-[76px] flex items-center px-6 border-b border-gray-200 bg-white sticky top-0 z-10 shadow-sm">
                 <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse shadow-sm"></span>
                    {conversations.find(c => c.id === activeConvId)?.buyerId === myId 
                      ? conversations.find(c => c.id === activeConvId)?.seller?.username 
                      : conversations.find(c => c.id === activeConvId)?.buyer?.username}
                 </h2>
               </div>
               
               {/* Messages List */}
               <div className="flex-1 overflow-y-auto p-6 bg-gray-50/50 scroll-smooth">
                 {loadingMsgs ? (
                   <div className="text-gray-500 text-center font-medium opacity-60">Loading messages...</div>
                 ) : messages.length === 0 ? (
                   <div className="text-center py-20 text-gray-500">
                     <p className="text-5xl mb-4 opacity-40">💬</p>
                     <p className="font-bold text-gray-700 text-lg">No messages yet</p>
                     <p className="text-sm mt-1 text-gray-400">Say hello to get the conversation started!</p>
                   </div>
                 ) : (
                   <div className="flex flex-col gap-3">
                     {messages.map(msg => {
                       const isMine = msg.senderId === myId;
                       return (
                         <div key={msg.id} className={`flex flex-col gap-1 ${isMine ? "items-end" : "items-start"}`}>
                           <div className={`max-w-[70%] px-5 py-3 text-[14.5px] leading-relaxed shadow-sm ${
                             isMine ? "bg-gradient-to-br from-emerald-400 to-emerald-600 text-white rounded-2xl rounded-tr-sm" 
                                    : "bg-white text-gray-800 border border-gray-100 rounded-2xl rounded-tl-sm"
                             }`}>
                             {msg.text}
                           </div>
                           <span className="text-[11px] font-medium text-gray-400 px-1">{formatTime(msg.createdAt)}</span>
                         </div>
                       )
                     })}
                     <div ref={bottomRef} className="h-4" />
                   </div>
                 )}
               </div>

               {/* Composer Input */}
               <div className="p-4 bg-white border-t border-gray-200">
                 <form onSubmit={handleSend} className="flex items-center gap-3 max-w-4xl mx-auto">
                   <input 
                     type="text" 
                     value={text} 
                     onChange={e => setText(e.target.value)} 
                     placeholder="Type a message..." 
                     className="flex-1 bg-gray-50 hover:bg-gray-100/50 border border-gray-200 rounded-full px-6 py-4 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all text-[15px] shadow-sm" 
                   />
                   <button 
                     type="submit" 
                     disabled={!text.trim()} 
                     className="w-14 h-14 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 disabled:from-gray-300 disabled:to-gray-300 disabled:cursor-not-allowed text-white flex items-center justify-center rounded-full transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
                   >
                     <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 2L11 13M22 2L15 22L11 13M11 13L2 9L22 2"/></svg>
                   </button>
                 </form>
               </div>
             </>
           ) : (
             <div className="flex-1 flex flex-col items-center justify-center text-gray-400 bg-gray-50/50">
               <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6 shadow-sm border border-gray-200">
                 <span className="text-4xl opacity-50">📬</span>
               </div>
               <p className="text-xl font-bold text-gray-700">Your Inbox</p>
               <p className="text-sm mt-2 text-gray-500 max-w-xs text-center">Select an existing conversation from the sidebar or start a new one to begin messaging.</p>
             </div>
           )}
        </div>
      </div>
    </div>
  );
}
