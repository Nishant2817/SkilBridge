import axios from "axios";

export async function createConversation(participantId, token) {
  try {
    const { data } = await axios.post("/api/conversations", { participantId }, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return data;
  } catch (error) {
    throw new Error(error.response?.data?.error || "Failed to create conversation");
  }
}

export async function getConversations(token) {
  try {
    const { data } = await axios.get("/api/conversations", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return data;
  } catch (error) {
    throw new Error(error.response?.data?.error || "Failed to fetch conversations");
  }
}

export async function getMessages(conversationId, token) {
  try {
    const { data } = await axios.get(`/api/messages/${conversationId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return data;
  } catch (error) {
    throw new Error(error.response?.data?.error || "Failed to fetch messages");
  }
}

export async function sendMessage(conversationId, text, token) {
  try {
    const { data } = await axios.post("/api/messages", { conversationId, text }, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return data;
  } catch (error) {
    throw new Error(error.response?.data?.error || "Failed to send message");
  }
}
