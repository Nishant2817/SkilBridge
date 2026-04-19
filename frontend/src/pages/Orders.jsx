import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getBuyerOrders } from "../api/orders";
import { createRazorpayOrder, verifyRazorpayPayment } from "../api/payment";

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

  const handlePayment = async (orderId) => {
    try {
      // 1. Create order tracking bounds safely across backend configs
      const rzpData = await createRazorpayOrder(orderId, token);

      // 2. Launch Native Gateway bounds
      const options = {
        key: rzpData.key,
        amount: rzpData.amount,
        currency: "USD",
        name: "SkillBridge Marketplace",
        description: `Fulfillment for Order #${orderId}`,
        order_id: rzpData.razorpayOrderId,
        handler: async function (response) {
          try {
            // 3. Complete structural binds tracking success tokens
            await verifyRazorpayPayment({
               razorpay_order_id: response.razorpay_order_id,
               razorpay_payment_id: response.razorpay_payment_id,
               razorpay_signature: response.razorpay_signature,
               orderId
            }, token);

            alert("Checkout verified successfully!");
            
            // Re-render local array cleanly updating UI into completed forms
            setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: "completed" } : o));
          } catch (err) {
            alert(err.message);
          }
        },
        theme: { color: "#1dbf73" }
      };

      const razorpayInstance = new window.Razorpay(options);
      razorpayInstance.on("payment.failed", function (response) {
        alert(response.error.description);
      });
      razorpayInstance.open();

    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 py-24 px-6 pt-32">
      <div className="max-w-7xl mx-auto flex flex-col gap-8">
        
        {/* Header Module */}
        <div className="border-b border-slate-800 pb-6">
          <h1 className="text-4xl font-bold text-white mb-2">My Orders</h1>
          <p className="text-gray-400">Track and manage your active freelance purchases.</p>
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
             <span className="text-5xl opacity-40 mb-4 block">📦</span>
             <h2 className="text-xl text-white font-semibold">No orders yet</h2>
             <p className="text-gray-400 mt-2">Browse the marketplace to find the perfect gig.</p>
           </div>
        ) : (
          <div className="overflow-x-auto bg-slate-800 rounded-2xl border border-slate-700 shadow-md">
            <table className="w-full text-left text-sm text-gray-400">
              <thead className="text-xs text-gray-300 uppercase bg-slate-900 border-b border-slate-700">
                <tr>
                  <th scope="col" className="px-6 py-4">Gig</th>
                  <th scope="col" className="px-6 py-4">Status</th>
                  <th scope="col" className="px-6 py-4">Price</th>
                  <th scope="col" className="px-6 py-4">Date Ordered</th>
                  <th scope="col" className="px-6 py-4 text-right">Action</th>
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
                    <td className="px-6 py-5">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-5 text-right">
                       {order.status === "pending" ? (
                          <button 
                            onClick={() => handlePayment(order.id)}
                            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-bold transition-colors shadow-lg shadow-green-500/20"
                          >
                            Pay Now
                          </button>
                       ) : (
                          <span className="text-gray-500 font-semibold italic text-sm">Paid</span>
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
