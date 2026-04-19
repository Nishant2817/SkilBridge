import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  getAllUsers, deleteUser,
  getAllGigs, deleteGig,
  getAllOrders, deleteOrder
} from "../api/admin";

export default function AdminDashboard() {
  const { token, isAdmin } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("users");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Prevent generic users rendering
  useEffect(() => {
    if (!isAdmin) {
      navigate("/");
    }
  }, [isAdmin, navigate]);

  const fetchData = async () => {
    setLoading(true);
    setError("");
    try {
      if (activeTab === "users") {
        setData(await getAllUsers(token));
      } else if (activeTab === "gigs") {
        setData(await getAllGigs(token));
      } else if (activeTab === "orders") {
        setData(await getAllOrders(token));
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) fetchData();
  }, [activeTab, isAdmin, token]); // Re-fetch cleanly on tab swap

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure? This delete is permanent and will cascade into destruction.")) return;
    try {
      if (activeTab === "users") await deleteUser(id, token);
      if (activeTab === "gigs") await deleteGig(id, token);
      if (activeTab === "orders") await deleteOrder(id, token);

      // Update locally seamlessly avoiding hard flickers
      setData(prev => prev.filter(item => item.id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  if (!isAdmin) return null; // Avoid render flash

  return (
    <div className="min-h-screen bg-slate-900 py-24 px-6 pt-32">
      <div className="max-w-7xl mx-auto flex flex-col gap-8">

        {/* Header Module */}
        <div className="border-b border-slate-800 pb-6 flex justify-between items-end">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Admin Dashboard</h1>
            <p className="text-gray-400">Complete architectural oversight bounds over SkillBridge.</p>
          </div>
          <span className="bg-red-500/10 text-red-500 border border-red-500/20 px-4 py-1.5 rounded-full font-bold text-sm tracking-widest uppercase">
            Root Access
          </span>
        </div>

        {/* Tab Controls */}
        <div className="flex gap-4">
          {['users', 'gigs', 'orders'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2.5 rounded-lg font-semibold capitalize transition-all ${activeTab === tab
                  ? "bg-green-500 text-white shadow-md shadow-green-500/20"
                  : "bg-slate-800 text-gray-400 hover:text-white border border-slate-700"
                }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* State Rendering */}
        {loading ? (
          <div className="h-64 bg-slate-800 rounded-xl animate-pulse" />
        ) : error ? (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-6 rounded-xl">
            {error}
          </div>
        ) : data.length === 0 ? (
          <div className="py-24 text-center bg-slate-800 border border-slate-700 rounded-2xl">
            <h2 className="text-xl text-white font-semibold">No data found</h2>
            <p className="text-gray-400 mt-2">The table is currently empty.</p>
          </div>
        ) : (
          <div className="overflow-x-auto bg-slate-800 rounded-2xl border border-slate-700 shadow-md">
            <table className="w-full text-left text-sm text-gray-300">
              <thead className="text-xs text-gray-400 uppercase bg-slate-900 border-b border-slate-700">
                <tr>
                  <th className="px-6 py-4">ID</th>

                  {activeTab === "users" && (
                    <>
                      <th className="px-6 py-4">Username</th>
                      <th className="px-6 py-4">Email</th>
                      <th className="px-6 py-4">Role</th>
                    </>
                  )}

                  {activeTab === "gigs" && (
                    <>
                      <th className="px-6 py-4">Title</th>
                      <th className="px-6 py-4">Seller</th>
                      <th className="px-6 py-4">Price</th>
                    </>
                  )}

                  {activeTab === "orders" && (
                    <>
                      <th className="px-6 py-4">Target Gig</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4">Price</th>
                    </>
                  )}

                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item) => (
                  <tr key={item.id} className="border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors">
                    <td className="px-6 py-4 font-mono text-gray-500">#{item.id}</td>

                    {activeTab === "users" && (
                      <>
                        <td className="px-6 py-4 font-medium text-white">{item.username}</td>
                        <td className="px-6 py-4">{item.email}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded-md text-xs font-bold ${item.role === 'admin' ? 'bg-red-500/20 text-red-400' :
                              item.isSeller ? 'bg-green-500/20 text-green-400' : 'bg-slate-700 text-gray-300'
                            }`}>
                            {item.role === 'admin' ? 'ADMIN' : (item.isSeller ? 'SELLER' : 'BUYER')}
                          </span>
                        </td>
                      </>
                    )}

                    {activeTab === "gigs" && (
                      <>
                        <td className="px-6 py-4 font-medium text-white truncate max-w-[300px]">{item.title}</td>
                        <td className="px-6 py-4">{item.user?.username || "Unknown"}</td>
                        <td className="px-6 py-4 text-green-400 font-bold">${item.price}</td>
                      </>
                    )}

                    {activeTab === "orders" && (
                      <>
                        <td className="px-6 py-4 font-medium text-white truncate max-w-[300px]">{item.gig?.title || `Gig #${item.gigId}`}</td>
                        <td className="px-6 py-4 capitalize">{item.status}</td>
                        <td className="px-6 py-4 text-green-400 font-bold">${item.price}</td>
                      </>
                    )}

                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="px-4 py-1.5 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-md font-semibold transition-colors"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
