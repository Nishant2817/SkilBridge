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
    <div className="min-h-screen pb-24" style={{
      /* Underlying light gradient background matching the new Civi theme */
      background: "linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%)",
      paddingTop: "100px",
      paddingLeft: "1.5rem",
      paddingRight: "1.5rem",
    }}>
      <div className="max-w-7xl mx-auto flex flex-col gap-8">

        {/* Header Module */}
        <div className="border-b border-gray-200 pb-6 flex justify-between items-end">
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900 mb-2 tracking-tight">Admin Dashboard</h1>
            <p className="text-gray-500 font-medium">Complete architectural oversight bounds over SkillBridge.</p>
          </div>
          <span className="bg-red-50 text-red-600 border border-red-200 px-4 py-1.5 rounded-full font-bold text-sm tracking-widest uppercase shadow-sm">
            Root Access
          </span>
        </div>

        {/* Tab Controls */}
        <div className="flex gap-4">
          {['users', 'gigs', 'orders'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2.5 rounded-xl font-semibold capitalize transition-all ${
                activeTab === tab
                  ? "bg-[#059669] text-white shadow-md shadow-emerald-500/20 transform -translate-y-0.5"
                  : "bg-white text-gray-600 hover:text-gray-900 border border-gray-200 hover:border-gray-300 hover:bg-gray-50 shadow-sm"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* State Rendering */}
        {loading ? (
          <div className="h-64 bg-white rounded-2xl border border-gray-200 shadow-sm animate-pulse" />
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-600 p-6 rounded-2xl shadow-sm">
            {error}
          </div>
        ) : data.length === 0 ? (
          <div className="py-24 text-center bg-white border border-gray-200 rounded-2xl shadow-sm">
            <h2 className="text-xl text-gray-700 font-bold">No data found</h2>
            <p className="text-gray-500 mt-2">The table is currently empty.</p>
          </div>
        ) : (
          <div className="overflow-x-auto bg-white rounded-2xl border border-gray-300 shadow-xl shadow-gray-200/40">
            <table className="w-full text-left text-sm text-gray-700">
              <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b border-gray-300">
                <tr>
                  <th className="px-6 py-4 font-bold border-r border-gray-200 last:border-r-0">ID</th>

                  {activeTab === "users" && (
                    <>
                      <th className="px-6 py-4 font-bold border-r border-gray-200 last:border-r-0">Username</th>
                      <th className="px-6 py-4 font-bold border-r border-gray-200 last:border-r-0">Email</th>
                      <th className="px-6 py-4 font-bold border-r border-gray-200 last:border-r-0">Role</th>
                    </>
                  )}

                  {activeTab === "gigs" && (
                    <>
                      <th className="px-6 py-4 font-bold border-r border-gray-200 last:border-r-0">Title</th>
                      <th className="px-6 py-4 font-bold border-r border-gray-200 last:border-r-0">Seller</th>
                      <th className="px-6 py-4 font-bold border-r border-gray-200 last:border-r-0">Price</th>
                    </>
                  )}

                  {activeTab === "orders" && (
                    <>
                      <th className="px-6 py-4 font-bold border-r border-gray-200 last:border-r-0">Target Gig</th>
                      <th className="px-6 py-4 font-bold border-r border-gray-200 last:border-r-0">Status</th>
                      <th className="px-6 py-4 font-bold border-r border-gray-200 last:border-r-0">Price</th>
                    </>
                  )}

                  <th className="px-6 py-4 text-right font-bold">Action</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item) => (
                  <tr key={item.id} className="border-b border-gray-300 hover:bg-gray-50 transition-colors last:border-0">
                    <td className="px-6 py-4 font-mono text-gray-500 text-xs border-r border-gray-200 last:border-r-0">#{item.id}</td>

                    {activeTab === "users" && (
                      <>
                        <td className="px-6 py-4 font-bold text-gray-900 border-r border-gray-200 last:border-r-0">{item.username}</td>
                        <td className="px-6 py-4 text-gray-600 border-r border-gray-200 last:border-r-0">{item.email}</td>
                        <td className="px-6 py-4 border-r border-gray-200 last:border-r-0">
                          <span className={`px-2.5 py-1 rounded-md text-xs font-bold border ${
                            item.role === 'admin' 
                              ? 'bg-red-50 text-red-600 border-red-200' 
                              : item.isSeller 
                                ? 'bg-emerald-50 text-[#059669] border-[#059669]/20' 
                                : 'bg-gray-100 text-gray-600 border-gray-200'
                          }`}>
                            {item.role === 'admin' ? 'ADMIN' : (item.isSeller ? 'SELLER' : 'BUYER')}
                          </span>
                        </td>
                      </>
                    )}

                    {activeTab === "gigs" && (
                      <>
                        <td className="px-6 py-4 font-semibold text-gray-900 truncate max-w-[300px] border-r border-gray-200 last:border-r-0">{item.title}</td>
                        <td className="px-6 py-4 text-gray-600 border-r border-gray-200 last:border-r-0">{item.user?.username || "Unknown"}</td>
                        <td className="px-6 py-4 text-[#059669] font-bold border-r border-gray-200 last:border-r-0">${item.price}</td>
                      </>
                    )}

                    {activeTab === "orders" && (
                      <>
                        <td className="px-6 py-4 font-semibold text-gray-900 truncate max-w-[300px] border-r border-gray-200 last:border-r-0">{item.gig?.title || `Gig #${item.gigId}`}</td>
                        <td className="px-6 py-4 text-gray-600 capitalize border-r border-gray-200 last:border-r-0">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-gray-100 border border-gray-200">
                            {item.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-[#059669] font-bold border-r border-gray-200 last:border-r-0">${item.price}</td>
                      </>
                    )}

                    <td className="px-6 py-4 text-right border-r border-gray-200 last:border-r-0">
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="px-4 py-1.5 bg-white text-red-600 border border-red-200 hover:bg-red-50 hover:border-red-300 rounded-lg font-semibold text-sm transition-colors shadow-sm"
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
