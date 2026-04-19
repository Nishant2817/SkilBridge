import axios from "axios";

const api = axios.create({ baseURL: "/api/messages" });

export async function getConversation(targetUserId, token) {
  const { data } = await api.get(`/${targetUserId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
}
