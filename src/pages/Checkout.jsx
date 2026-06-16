import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useCart } from "../context/CartContext"
import { placeOrder } from "../api/orders"
export default function Checkout() {
  const { cart, cartTotal, clearCart } = useCart()
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    name: "", email: "", phone: "", address: ""
  })
  const [paid, setPaid] = useState(false)

  const gst = cartTotal * 0.18
  const total = cartTotal + gst

  useEffect(() => {
    if (cart.length === 0 && step === 0 && !paid) {
      navigate("/")
      
    }
  }, [cart, step,paid])
  

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  function openRazorpay() {
    setLoading(true)

    const options = {
      key: "rzp_test_T0bixIXmrfeVIp", // 👈 your test key
      amount: Math.round(total * 100),
      currency: "INR",
      name: "MotoShop",
      description: `Order for ${cart.length} vehicle(s)`,
      prefill: {
        name: form.name,
        email: form.email,
        contact: form.phone,
      },
      theme: { color: "#f97316" },

handler: async function (response) {
  try {
    // save order to database after successful payment
    await placeOrder({
      customerName: form.name,
      customerEmail: form.email,
      customerPhone: form.phone,
      deliveryAddress: form.address,
      items: cart,
      total: cartTotal,
      gst: gst,
    })
  } catch (err) {
    console.log("Order save failed:", err.message)
    // payment was done so still show success
  }

  setLoading(false)
  setPaid(true)
  setStep(1)
  clearCart()
},
      modal: {
        ondismiss: function () {
          setLoading(false)
        },
      },
    }

    try {
      if (!window.Razorpay) {
        alert("Razorpay failed to load. Please disable ad blocker and refresh.")
        setLoading(false)
        return
      }
      const rzp = new window.Razorpay(options)
      rzp.open()
    } catch (error) {
      console.error("Razorpay error:", error)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-100">

      {/* Navbar */}
      <nav className="bg-white border-b border-slate-200 px-5 h-14 flex items-center justify-between">
        <span
          onClick={() => navigate("/")}
          className="text-lg font-medium tracking-tight cursor-pointer"
        >
          MOTO<span className="text-orange-500">SHOP</span>
        </span>
        <span className="text-sm text-slate-400">Secure Checkout</span>
      </nav>

      <div className="max-w-5xl mx-auto px-5 py-8 grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left — form or success */}
        <div className="lg:col-span-2">

          {step === 0 && (
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-5">
                Delivery Information
              </h2>

              <div className="space-y-4">
                <Field label="Full name"        name="name"    value={form.name}    onChange={handleChange} placeholder="Your Name" />
                <Field label="Email address"    name="email"   value={form.email}   onChange={handleChange} placeholder="you@email.com" type="email" />
                <Field label="Phone number"     name="phone"   value={form.phone}   onChange={handleChange} placeholder="Phone number" type="tel" />
                <Field label="Delivery address" name="address" value={form.address} onChange={handleChange} placeholder="Street, area, city, PIN" />
              </div>

              <button
                onClick={openRazorpay}
                disabled={!form.name || !form.email || !form.phone || loading}
                className="mt-6 w-full py-3 bg-orange-500 hover:bg-orange-600 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition cursor-pointer shadow-lg shadow-orange-100 flex items-center justify-center gap-2"
              >
                {loading
                  ? "Opening payment..."
                  : `Pay ₹${total.toFixed(2)}L via Razorpay`
                }
              </button>

              <button
                onClick={() => navigate("/")}
                className="mt-3 w-full py-2.5 border border-slate-200 text-slate-500 hover:border-orange-400 hover:text-orange-500 rounded-xl text-sm transition cursor-pointer"
              >
                ← Back to shop
              </button>
            </div>
          )}

          {step === 1 && (
            <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
              <div className="text-6xl mb-4">✅</div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">
                Payment Successful!
              </h3>
              <p className="text-slate-500 mb-6">
                Your order is confirmed. Our team will contact you within 24 hours to arrange delivery.
              </p>
              <div className="bg-orange-50 rounded-xl p-4 inline-block mb-6">
                <p className="text-xs text-slate-400 mb-1">Order ID</p>
                <p className="text-lg font-bold text-orange-500">
                  #MTS-{Math.floor(100000 + Math.random() * 900000)}
                </p>
              </div>
              <br />
              <button
                onClick={() => navigate("/")}
                className="px-8 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl transition cursor-pointer"
              >
                Continue Shopping
              </button>
            </div>
          )}
        </div>

        {/* Right — order summary */}
        {step === 0 && (
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm p-5">
              <h3 className="font-semibold text-slate-900 mb-4">
                Order Summary
              </h3>

              <div className="space-y-3 mb-4">
                {cart.map((item) => (
                  <div key={item.id} className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center text-xl shrink-0">
                      {item.type === 2 ? "🏍" : "🚗"}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-900">{item.name}</p>
                      <p className="text-xs text-slate-400">Qty {item.qty}</p>
                    </div>
                    <span className="text-sm font-semibold text-orange-500">
                      ₹{(item.price * item.qty).toFixed(2)}L
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-slate-100 pt-3 space-y-2">
                <div className="flex justify-between text-sm text-slate-500">
                  <span>Subtotal</span>
                  <span className="text-slate-700">₹{cartTotal.toFixed(2)}L</span>
                </div>
                <div className="flex justify-between text-sm text-slate-500">
                  <span>GST (18%)</span>
                  <span className="text-slate-700">₹{gst.toFixed(2)}L</span>
                </div>
                <div className="flex justify-between text-sm text-slate-500">
                  <span>Delivery</span>
                  <span className="text-green-500 font-medium">Free</span>
                </div>
                <div className="border-t border-slate-200 pt-2 flex justify-between">
                  <span className="font-semibold text-slate-900">Total</span>
                  <span className="font-bold text-orange-500 text-lg">
                    ₹{total.toFixed(2)}L
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function Field({ label, name, value, onChange, placeholder, type = "text" }) {
  return (
    <div>
      <label className="text-xs text-slate-500 font-medium block mb-1">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-orange-400 transition"
      />
    </div>
  )
}