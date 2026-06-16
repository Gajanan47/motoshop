import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import {
  fetchProducts,
  addProduct,
  updateProduct,
  deleteProduct
} from "../api/products"
import { fetchOrders, updateOrderStatus } from "../api/orders"

const emptyForm = {
  name: "", company: "", type: 2, cc: 0,
  fuel: "Petrol", use_case: "Commuter",
  price: "", rating: 0, reviews: 0, badge: "", image: ""
}

export default function AdminDashboard() {
  const navigate = useNavigate()
  const adminEmail = localStorage.getItem("adminEmail")

  const [tab, setTab] = useState("products")  // "products" or "orders"
  const [products, setProducts] = useState([])
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [formLoading, setFormLoading] = useState(false)
  const [message, setMessage] = useState("")

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    setLoading(true)
    try {
      const [prodRes, orderRes] = await Promise.all([
        fetchProducts(),
        fetchOrders()
      ])
      setProducts(prodRes.data.data)
      setOrders(orderRes.data.data)
    } catch (err) {
      console.log("Load error:", err.message)
    } finally {
      setLoading(false)
    }
  }

  function handleLogout() {
    localStorage.removeItem("adminToken")
    localStorage.removeItem("adminEmail")
    navigate("/admin/login")
  }

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  function openAddForm() {
    setForm(emptyForm)
    setEditingProduct(null)
    setShowForm(true)
  }

  function openEditForm(product) {
    setForm({
      name: product.name,
      company: product.company,
      type: product.type,
      cc: product.cc,
      fuel: product.fuel,
      use_case: product.use_case,
      price: product.price,
      rating: product.rating,
      reviews: product.reviews,
      badge: product.badge,
      image: product.image
    })
    setEditingProduct(product)
    setShowForm(true)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setFormLoading(true)
    try {
      if (editingProduct) {
        await updateProduct(editingProduct.id, form)
        setMessage("Product updated successfully!")
      } else {
        await addProduct(form)
        setMessage("Product added successfully!")
      }
      setShowForm(false)
      setForm(emptyForm)
      setEditingProduct(null)
      loadData()
    } catch (err) {
      setMessage(err.response?.data?.message || "Something went wrong")
    } finally {
      setFormLoading(false)
      setTimeout(() => setMessage(""), 3000)
    }
  }

  async function handleDelete(id, name) {
    if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return
    try {
      await deleteProduct(id)
      setMessage("Product deleted!")
      loadData()
    } catch (err) {
      setMessage("Delete failed")
    } finally {
      setTimeout(() => setMessage(""), 3000)
    }
  }

  async function handleStatusChange(orderId, status) {
    try {
      await updateOrderStatus(orderId, status)
      setMessage("Order status updated!")
      loadData()
    } catch (err) {
      setMessage("Status update failed")
    } finally {
      setTimeout(() => setMessage(""), 3000)
    }
  }

  const statusColors = {
    Confirmed:  "bg-blue-100 text-blue-600",
    Processing: "bg-yellow-100 text-yellow-600",
    Shipped:    "bg-purple-100 text-purple-600",
    Delivered:  "bg-green-100 text-green-600",
    Cancelled:  "bg-red-100 text-red-600",
  }

  return (
    <div className="min-h-screen bg-slate-100">

      {/* Navbar */}
      <nav className="bg-white border-b border-slate-200 px-6 h-14 flex items-center justify-between sticky top-0 z-10">
        <h1 className="text-lg font-medium">
          MOTO<span className="text-orange-500">SHOP</span>
          <span className="text-slate-400 text-sm font-normal ml-2">Admin</span>
        </h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-slate-400">{adminEmail}</span>
          <button
            onClick={handleLogout}
            className="text-sm px-3 py-1.5 border border-slate-200 rounded-lg text-slate-500 hover:border-red-400 hover:text-red-500 transition cursor-pointer"
          >
            Logout
          </button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-6">

        {/* Success/error message */}
        {message && (
          <div className="bg-green-50 border border-green-200 text-green-600 text-sm rounded-xl px-4 py-3 mb-4">
            {message}
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setTab("products")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition cursor-pointer
              ${tab === "products"
                ? "bg-orange-500 text-white"
                : "bg-white text-slate-500 hover:border-orange-400 border border-slate-200"
              }`}
          >
            🏍 Products ({products.length})
          </button>
          <button
            onClick={() => setTab("orders")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition cursor-pointer
              ${tab === "orders"
                ? "bg-orange-500 text-white"
                : "bg-white text-slate-500 hover:border-orange-400 border border-slate-200"
              }`}
          >
            📦 Orders ({orders.length})
          </button>
        </div>

        {/* PRODUCTS TAB */}
        {tab === "products" && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-slate-900">All Products</h2>
              <button
                onClick={openAddForm}
                className="bg-orange-500 hover:bg-orange-600 text-white text-sm px-4 py-2 rounded-lg transition cursor-pointer font-medium"
              >
                + Add Product
              </button>
            </div>

            {loading ? (
              <p className="text-slate-400 text-sm">Loading...</p>
            ) : (
              <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 border-b border-slate-100">
                    <tr>
                      <th className="text-left px-4 py-3 text-slate-500 font-medium">Product</th>
                      <th className="text-left px-4 py-3 text-slate-500 font-medium">Type</th>
                      <th className="text-left px-4 py-3 text-slate-500 font-medium">Fuel</th>
                      <th className="text-left px-4 py-3 text-slate-500 font-medium">Price</th>
                      <th className="text-left px-4 py-3 text-slate-500 font-medium">Badge</th>
                      <th className="text-left px-4 py-3 text-slate-500 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((p) => (
                      <tr key={p.id} className="border-b border-slate-50 hover:bg-slate-50 transition">
                        <td className="px-4 py-3">
                          <div className="font-medium text-slate-900">{p.name}</div>
                          <div className="text-xs text-slate-400">{p.company}</div>
                        </td>
                        <td className="px-4 py-3 text-slate-500">
                          {p.type === 2 ? "🏍 2W" : "🚗 4W"}
                        </td>
                        <td className="px-4 py-3 text-slate-500">{p.fuel}</td>
                        <td className="px-4 py-3 font-medium text-orange-500">₹{p.price}L</td>
                        <td className="px-4 py-3">
                          {p.badge ? (
                            <span className="bg-orange-100 text-orange-500 text-xs px-2 py-0.5 rounded-full font-medium">
                              {p.badge}
                            </span>
                          ) : (
                            <span className="text-slate-300">—</span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex gap-2">
                            <button
                              onClick={() => openEditForm(p)}
                              className="text-xs px-3 py-1.5 border border-slate-200 rounded-lg text-slate-500 hover:border-orange-400 hover:text-orange-500 transition cursor-pointer"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(p.id, p.name)}
                              className="text-xs px-3 py-1.5 border border-slate-200 rounded-lg text-slate-500 hover:border-red-400 hover:text-red-500 transition cursor-pointer"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ORDERS TAB */}
        {tab === "orders" && (
          <div>
            <h2 className="font-semibold text-slate-900 mb-4">All Orders</h2>

            {loading ? (
              <p className="text-slate-400 text-sm">Loading...</p>
            ) : orders.length === 0 ? (
              <div className="bg-white rounded-2xl p-10 text-center text-slate-400">
                <div className="text-4xl mb-2">📦</div>
                <p>No orders yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {orders.map((order) => (
                  <div key={order.id} className="bg-white rounded-2xl shadow-sm p-5">
                    <div className="flex items-start justify-between gap-4 flex-wrap">

                      {/* Order info */}
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-slate-900">{order.order_id}</span>
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[order.status]}`}>
                            {order.status}
                          </span>
                        </div>
                        <p className="text-sm text-slate-500">{order.customer_name} · {order.customer_email}</p>
                        <p className="text-sm text-slate-500">{order.customer_phone}</p>
                        <p className="text-xs text-slate-400 mt-1">{order.delivery_address}</p>
                      </div>

                      {/* Price + status update */}
                      <div className="text-right">
                        <p className="font-bold text-orange-500 text-lg">
                          ₹{(parseFloat(order.total) + parseFloat(order.gst)).toFixed(2)}L
                        </p>
                        <p className="text-xs text-slate-400 mb-2">
                          {new Date(order.created_at).toLocaleDateString()}
                        </p>
                        <select
                          value={order.status}
                          onChange={(e) => handleStatusChange(order.id, e.target.value)}
                          className="text-xs border border-slate-200 rounded-lg px-2 py-1.5 text-slate-600 cursor-pointer focus:outline-none focus:border-orange-400"
                        >
                          <option>Confirmed</option>
                          <option>Processing</option>
                          <option>Shipped</option>
                          <option>Delivered</option>
                          <option>Cancelled</option>
                        </select>
                      </div>
                    </div>

                    {/* Order items */}
                    <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap gap-2">
                      {order.items.map((item, i) => (
                        <span key={i} className="bg-slate-50 border border-slate-100 text-slate-500 text-xs px-3 py-1 rounded-full">
                          {item.type === 2 ? "🏍" : "🚗"} {item.name} × {item.qty}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ADD / EDIT PRODUCT MODAL */}
      {showForm && (
        <div
          className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-5"
          onClick={() => setShowForm(false)}
        >
          <div
            className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h2 className="font-semibold text-slate-900">
                {editingProduct ? "Edit Product" : "Add New Product"}
              </h2>
              <button
                onClick={() => setShowForm(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 transition cursor-pointer"
              >✕</button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Field label="Name"    name="name"    value={form.name}    onChange={handleChange} placeholder="e.g. Duke 390" required />
                <Field label="Company" name="company" value={form.company} onChange={handleChange} placeholder="e.g. KTM" required />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-slate-500 font-medium block mb-1">Type</label>
                  <select name="type" value={form.type} onChange={handleChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-orange-400">
                    <option value={2}>Two-wheeler</option>
                    <option value={4}>Four-wheeler</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-slate-500 font-medium block mb-1">Fuel</label>
                  <select name="fuel" value={form.fuel} onChange={handleChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-orange-400">
                    <option>Petrol</option>
                    <option>Electric</option>
                    <option>Diesel</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Field label="Engine CC" name="cc"    value={form.cc}    onChange={handleChange} placeholder="e.g. 373" type="number" />
                <Field label="Price (₹L)" name="price" value={form.price} onChange={handleChange} placeholder="e.g. 3.15" type="number" required />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-slate-500 font-medium block mb-1">Use case</label>
                  <select name="use_case" value={form.use_case} onChange={handleChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-orange-400">
                    <option>Commuter</option>
                    <option>Sport</option>
                    <option>Adventure</option>
                    <option>Family</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-slate-500 font-medium block mb-1">Badge</label>
                  <select name="badge" value={form.badge} onChange={handleChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-orange-400">
                    <option value="">None</option>
                    <option value="new">New</option>
                    <option value="hot">Hot</option>
                    <option value="sale">Sale</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Field label="Rating (0-5)" name="rating"  value={form.rating}  onChange={handleChange} placeholder="e.g. 4.5" type="number" />
                <Field label="Reviews"      name="reviews" value={form.reviews} onChange={handleChange} placeholder="e.g. 650"  type="number" />
              </div>

              <Field label="Image URL" name="image" value={form.image} onChange={handleChange} placeholder="https://..." />

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)}
                  className="flex-1 py-2.5 border border-slate-200 text-slate-500 rounded-xl text-sm hover:border-orange-400 transition cursor-pointer">
                  Cancel
                </button>
                <button type="submit" disabled={formLoading}
                  className="flex-1 py-2.5 bg-orange-500 hover:bg-orange-600 disabled:bg-slate-200 text-white font-semibold rounded-xl text-sm transition cursor-pointer">
                  {formLoading ? "Saving..." : editingProduct ? "Update Product" : "Add Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

function Field({ label, name, value, onChange, placeholder, type = "text", required }) {
  return (
    <div>
      <label className="text-xs text-slate-500 font-medium block mb-1">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-orange-400 transition"
      />
    </div>
  )
}