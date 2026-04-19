import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getSellerOrders } from "../api/orders";

export default function MySales() {
  const { token, isSeller } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        if (!isSeller) {
           setError("You must be a registered seller to view this portal.");
           setLoading(false);
           return;
        }

        const data = await getSellerOrders(token);
        setOrders(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [token, isSeller]);

  return (
    <div className="min-h-screen bg-slate-900 py-24 px-6 pt-32">
      <div className="max-w-7xl mx-auto flex flex-col gap-8">
        
        {/* Header Module */}
        <div className="border-b border-slate-800 pb-6">
          <h1 className="text-4xl font-bold text-white mb-2">My Sales</h1>
          <p className="text-gray-400">Manage incoming orders mapped directly to your active gigs.</p>
        </div>

        {/* State Rendering */}
        {loading ? (
           <div className="space-y-4">
             {[...Array(3)].map((_, i) => (
                <div key={i} className="h-24 bg-slate-800 rounded-xl animate-pulse" />
             ))}
           </div>
        ) : error ? (
           <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-6 rounded-xl">
             {error}
           </div>
        ) : orders.length === 0 ? (
           <div className="py-24 text-center bg-slate-800 border border-slate-700 rounded-2xl">
             <span className="text-5xl opacity-40 mb-4 block">📈</span>
             <h2 className="text-xl text-white font-semibold">No sales yet</h2>
             <p className="text-gray-400 mt-2">Optimize your gig descriptions and images to attract more buyers.</p>
           </div>
        ) : (
          <div className="overflow-x-auto bg-slate-800 rounded-2xl border border-slate-700 shadow-md">
            <table className="w-full text-left text-sm text-gray-400">
              <thead className="text-xs text-gray-300 uppercase bg-slate-900 border-b border-slate-700">
                <tr>
                  <th scope="col" className="px-6 py-4">Gig Ordered</th>
                  <th scope="col" className="px-6 py-4">Status</th>
                  <th scope="col" className="px-6 py-4">Earned</th>
                  <th scope="col" className="px-6 py-4 text-right">Date Received</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors">
                    <td className="px-6 py-5 font-medium text-white flex items-center gap-4">
                       <img src={order.gig.image || "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=200&auto=format"} alt="Gig thumbnail" className="w-12 h-12 rounded object-cover" />
                       <span className="line-clamp-2 max-w-[300px]">{order.gig.title}</span>
                    </td>
                    <td className="px-6 py-5">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                         order.status === "pending" ? "bg-amber-500/10 text-amber-500 border border-amber-500/20" :
                         order.status === "completed" ? "bg-green-500/10 text-green-500 border border-green-500/20" :
                         "bg-slate-700 text-gray-300"
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-green-400 font-bold">
                      ${order.price}
                    </td>
                    <td className="px-6 py-5 text-right">
                      {new Date(order.createdAt).toLocaleDateString()}
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
