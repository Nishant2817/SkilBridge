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
    <div className="min-h-screen bg-gray-50 py-24 px-6 pt-32">
      <div className="max-w-7xl mx-auto flex flex-col gap-8">
        
        {/* Header Module */}
        <div className="border-b border-gray-200 pb-6">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">My Sales</h1>
          <p className="text-gray-500">Manage incoming orders mapped directly to your active gigs.</p>
        </div>

        {/* State Rendering */}
        {loading ? (
           <div className="space-y-4">
             {[...Array(3)].map((_, i) => (
                <div key={i} className="h-24 bg-gray-200 rounded-xl animate-pulse" />
             ))}
           </div>
        ) : error ? (
           <div className="bg-red-50 border border-red-200 text-red-500 p-6 rounded-xl shadow-sm">
             {error}
           </div>
        ) : orders.length === 0 ? (
           <div className="py-24 text-center bg-white border border-gray-200 rounded-2xl shadow-sm">
             <span className="text-5xl opacity-40 mb-4 block">📈</span>
             <h2 className="text-xl text-gray-900 font-semibold">No sales yet</h2>
             <p className="text-gray-500 mt-2">Optimize your gig descriptions and images to attract more buyers.</p>
           </div>
        ) : (
          <div className="overflow-x-auto bg-white rounded-2xl border border-gray-200 shadow-sm">
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b border-gray-200">
                <tr>
                  <th scope="col" className="px-6 py-4">Gig Ordered</th>
                  <th scope="col" className="px-6 py-4">Status</th>
                  <th scope="col" className="px-6 py-4">Earned</th>
                  <th scope="col" className="px-6 py-4 text-right">Date Received</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-5 font-medium text-gray-900 flex items-center gap-4">
                       <img src={order.gig.image || "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=200&auto=format"} alt="Gig thumbnail" className="w-12 h-12 rounded object-cover shadow-sm border border-gray-100" />
                       <span className="line-clamp-2 max-w-[300px]">{order.gig.title}</span>
                    </td>
                    <td className="px-6 py-5">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold shadow-sm ${
                         order.status === "pending" ? "bg-amber-50 text-amber-600 border border-amber-200" :
                         order.status === "completed" ? "bg-emerald-50 text-emerald-600 border border-emerald-200" :
                         "bg-gray-100 text-gray-600 border border-gray-200"
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-emerald-600 font-bold">
                      ${order.price}
                    </td>
                    <td className="px-6 py-5 text-right text-gray-500">
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
