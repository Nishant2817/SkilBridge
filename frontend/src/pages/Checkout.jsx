import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getGigById } from "../api/gigs";
import { createOrder } from "../api/orders";
import { handlePayment } from "../utils/paymentUtils";
import { useAuth } from "../context/AuthContext";

export default function Checkout() {
  const { gigId } = useParams();
  const { token } = useAuth();
  const navigate = useNavigate();
  
  const [gig, setGig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");

  const [paymentMethod, setPaymentMethod] = useState("card");

  useEffect(() => {
    (async () => {
      try {
        const data = await getGigById(gigId);
        setGig(data);
      } catch (err) {
        setError("Failed to load gig details.");
      } finally {
        setLoading(false);
      }
    })();
  }, [gigId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fafafa] flex items-center justify-center pt-24">
        <div className="w-12 h-12 border-4 border-gray-200 border-t-[#059669] rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !gig) {
    return (
      <div className="min-h-screen bg-[#fafafa] flex items-center justify-center pt-24">
        <p className="text-red-500 font-bold">{error || "Gig not found"}</p>
      </div>
    );
  }

  // Visual calculation to match the UI screenshot while keeping the total = gig.price so Razorpay syncs properly
  const total = Number(gig.price);
  const serviceFee = total * 0.055; // 5.5% arbitrary service fee visual
  const subtotal = total - serviceFee;

  const onConfirmAndPay = async () => {
    try {
      setProcessing(true);
      // 1. Create the pending order in the database
      const order = await createOrder(gig.id, token);
      
      // 2. Trigger Razorpay flow natively using the imported utility
      handlePayment(order.id, token, () => {
        // 3. On success, route safely to the orders dashboard
        navigate("/orders");
      });
    } catch (err) {
      alert(err.message);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] pt-28 pb-20 px-6">
      <div className="max-w-[1100px] mx-auto grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-10 items-start">
        
        {/* LEFT COLUMN: Details & Payment Methods */}
        <div className="space-y-10">
          
          {/* Order Details Panel */}
          <section>
            <h2 className="text-2xl font-extrabold text-gray-900 mb-6">Order details</h2>
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              <div className="flex gap-6">
                <div className="w-40 h-24 shrink-0 rounded-lg overflow-hidden border border-gray-200 bg-gray-100">
                  <img 
                    src={gig.image || "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=300&auto=format"} 
                    alt="Gig" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex flex-col justify-center">
                  <h3 className="font-semibold text-gray-900 text-[1.05rem] leading-snug mb-3">
                    {gig.title}
                  </h3>
                  <div className="text-sm font-semibold text-gray-600 mb-3 uppercase tracking-wide">
                    BASIC <span className="mx-1 text-gray-300">•</span> 1 day delivery <span className="mx-1 text-gray-300">•</span> Unlimited revisions
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs">
                      {gig.user?.username?.slice(0, 1).toUpperCase() || "S"}
                    </div>
                    <span className="font-semibold">{gig.user?.username || "Unknown"}</span>
                    <span className="mx-1 text-gray-300">•</span>
                    <span className="text-yellow-500 font-bold">★ 4.8</span>
                    <span className="mx-1 text-gray-300">•</span>
                    <span className="text-gray-500 font-semibold">Level 2</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Payment Methods Panel */}
          <section>
            <h2 className="text-2xl font-extrabold text-gray-900 mb-6">Payment methods</h2>
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden flex flex-col">

              <label className="flex flex-col gap-4 p-5 cursor-pointer hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-4">
                  <input 
                    type="radio" 
                    name="payment" 
                    checked={paymentMethod === "card"}
                    onChange={() => setPaymentMethod("card")}
                    className="w-5 h-5 accent-[#059669]" 
                  />
                  <span className="font-bold text-[1.05rem] text-gray-800">Credit & Debit Cards (Razorpay)</span>
                </div>
                
                {paymentMethod === "card" && (
                  <div className="ml-9 mt-2 p-1">
                    <div className="bg-[#f0fdf4] border border-[#bbf7d0] rounded-lg p-4 text-sm text-[#166534]">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-lg">🔒</span>
                        <span className="font-bold">Secure Encrypted Checkout</span>
                      </div>
                      <p>To ensure maximum PCI compliance and security, card details are collected directly via Razorpay's encrypted gateway in the next step. Please click <strong>Confirm and pay</strong> to proceed.</p>
                    </div>
                  </div>
                )}
              </label>

            </div>
          </section>
        </div>

        {/* RIGHT COLUMN: Price Summary */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-8 sticky top-24">
          <div className="flex justify-between items-center mb-6">
            <span className="text-xl font-bold text-gray-900">Total</span>
            <span className="text-xl font-extrabold text-gray-900">${total.toFixed(2)}</span>
          </div>

          <button
            onClick={onConfirmAndPay}
            disabled={processing}
            className={`w-full bg-[#111827] text-white font-bold py-4 rounded-xl text-lg mb-4 transition-transform shadow-lg ${processing ? "opacity-70 cursor-not-allowed" : "hover:-translate-y-1 hover:shadow-xl active:translate-y-0"}`}
          >
            {processing ? "Processing..." : "Confirm and pay"}
          </button>

          <p className="text-[0.8rem] text-gray-500 leading-relaxed mb-4">
            By clicking the button, you agree to SkillBridge's <a href="#" className="underline">Terms of Service</a> and <a href="#" className="underline">Payment Terms</a>.
          </p>

          <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-8 border-b border-gray-200 pb-8">
            <span className="text-blue-600">🛡️</span> Safe and secure payment
          </div>

          <h3 className="font-bold text-gray-900 mb-4 text-[1.1rem]">Price summary</h3>
          
          <div className="space-y-3 text-[0.95rem] text-gray-600 border-b border-gray-100 pb-4 mb-4">
            <div className="flex justify-between">
              <span>Selected package</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Service fee ⓘ</span>
              <span>${serviceFee.toFixed(2)}</span>
            </div>
          </div>
          
          <div className="flex justify-between font-bold text-gray-900 text-lg">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>

        </div>

      </div>
    </div>
  );
}
