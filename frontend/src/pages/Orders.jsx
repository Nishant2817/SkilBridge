import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getBuyerOrders } from "../api/orders";
import { handlePayment } from "../utils/paymentUtils";

export default function Orders() {
  const { token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const data = await getBuyerOrders(token);
        setOrders(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [token]);

  const onPaymentClick = (orderId) => {
    handlePayment(orderId, token, () => {
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: "completed" } : o));
    });
  };

  return (
    <div className="min-h-screen bg-[#fafafa] py-24 px-6 pt-32">
      <div className="max-w-7xl mx-auto flex flex-col gap-8">
        
        {/* Header Module */}
        <div className="border-b border-gray-200 pb-6">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">My Orders</h1>
          <p className="text-gray-600">Track and manage your active freelance purchases.</p>
        </div>

        {/* State Rendering */}
        {loading ? (
           <div className="space-y-4">
             {[...Array(3)].map((_, i) => (
                <div key={i} className="h-24 bg-white border border-gray-100 rounded-xl animate-pulse shadow-sm" />
             ))}
           </div>
        ) : error ? (
           <div className="bg-red-50 border border-red-200 text-red-600 p-6 rounded-xl shadow-sm">
             {error}
           </div>
        ) : orders.length === 0 ? (
           <div className="py-24 text-center bg-white border border-gray-200 rounded-2xl shadow-sm">
             <span className="text-5xl opacity-40 mb-4 block filter grayscale mix-blend-multiply">📦</span>
             <h2 className="text-xl text-gray-900 font-bold">No orders yet</h2>
             <p className="text-gray-500 mt-2">Browse the marketplace to find the perfect gig.</p>
           </div>
        ) : (
          <div className="overflow-x-auto bg-white rounded-2xl border border-gray-200 shadow-sm">
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b border-gray-200">
                <tr>
                  <th scope="col" className="px-6 py-4 font-bold border-r border-gray-200">Gig</th>
                  <th scope="col" className="px-6 py-4 font-bold border-r border-gray-200">Status</th>
                  <th scope="col" className="px-6 py-4 font-bold border-r border-gray-200">Price</th>
                  <th scope="col" className="px-6 py-4 font-bold border-r border-gray-200">Date Ordered</th>
                  <th scope="col" className="px-6 py-4 font-bold text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-5 font-medium text-gray-900 flex items-center gap-4 border-r border-gray-100">
                       <img src={order.gig.image || "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=200&auto=format"} alt="Gig thumbnail" className="w-12 h-12 rounded object-cover shadow-sm border border-gray-200" />
                       <span className="line-clamp-2 max-w-[300px]">{order.gig.title}</span>
                    </td>
                    <td className="px-6 py-5 border-r border-gray-100">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                         order.status === "pending" ? "bg-amber-100 text-amber-700 border border-amber-200" :
                         order.status === "completed" ? "bg-green-100 text-green-700 border border-green-200" :
                         "bg-gray-100 text-gray-700 border border-gray-200"
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-[#059669] font-bold text-lg border-r border-gray-100">
                      ${order.price}
                    </td>
                    <td className="px-6 py-5 border-r border-gray-100 text-gray-600 font-medium">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-5 text-right">
                       {order.status === "pending" ? (
                          <button 
                            onClick={() => onPaymentClick(order.id)}
                            className="bg-[#059669] hover:bg-[#047857] text-white px-5 py-2.5 rounded-full font-bold transition-colors shadow-md shadow-green-500/10"
                          >
                            Pay Now
                          </button>
                       ) : (
                          <span className="text-gray-400 font-semibold italic text-sm">Paid ✓</span>
                       )}
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
