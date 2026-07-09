import { useState, useEffect, useMemo } from "react"
import { fetchProducts } from "../api/products"
import searchIcon from "../assets/search.png"
import Hero from "../components/Hero"
import SlideBar from "../components/SlideBar"
import ProductGrid from "../components/ProductGrid"

const defaultFilters = {
  type: "all",
  cc: "all",
  brand: "all",
  price: 30,
  fuel: "all",
  use: "all",
  search: "",
}

export default function Home() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filters, setFilters] = useState(defaultFilters)

  // fetch products from backend on page load
  useEffect(() => {
    async function loadProducts() {
      try {
        const res = await fetchProducts()
        setProducts(res.data.data)  // { success: true, data: [...] }
      } catch (err) {
        setError("Failed to load products. Please try again.")
      } finally {
        setLoading(false)
      }
    }
    loadProducts()
  }, [])

  const filtered = useMemo(() => {
     
    return products.filter((p) => {
      if (filters.search.trim()) {
  const q = filters.search.trim().toLowerCase()
  if (!p.name.toLowerCase().includes(q) && !p.company.toLowerCase().includes(q)) return false
}
      if (filters.type !== "all" && String(p.type) !== filters.type) return false
      if (filters.cc !== "all") {
        const cc = parseInt(filters.cc)
        if (cc === 150 && p.cc > 150) return false
        if (cc === 250 && (p.cc < 151 || p.cc > 250)) return false
        if (cc === 500 && (p.cc < 251 || p.cc > 500)) return false
        if (cc === 501 && p.cc <= 500) return false
      }
      if (filters.brand !== "all" && p.company !== filters.brand) return false
      if (p.price > filters.price) return false
      if (filters.fuel !== "all" && p.fuel !== filters.fuel) return false
      if (filters.use !== "all" && p.use_case !== filters.use) return false
      return true
    })
   
  }, [filters, products])

  // loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-3">🏍</div>
          <p className="text-slate-500">Loading vehicles...</p>
        </div>
      </div>
    )
  }

  // error state
  if (error) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-3">⚠️</div>
          <p className="text-red-500">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-orange-500 text-white rounded-lg"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      
      <Hero />

      <div className="max-w-7xl mx-auto px-4 sm:px-5 lg:px-6 pt-5">
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-3 sm:p-4">
          <label htmlFor="vehicle-search" className="sr-only">
            Search vehicles
          </label>
          <div className="relative">
            <img
              src={searchIcon}
              alt=""
              className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none opacity-60"
            />
            <input
              id="vehicle-search"
              type="text"
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              placeholder="Search vehicles by name or brand..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-24 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-orange-400 transition"
            />
            {filters.search && (
              <button
                type="button"
                onClick={() => setFilters(prev => ({ ...prev, search: "" }))}
                className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-500 hover:bg-orange-50 hover:text-orange-500 transition"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row px-4 sm:px-5 lg:px-6 pt-5">
        <SlideBar filters={filters} setFilters={setFilters} />
        <ProductGrid products={filtered} />
      </div>
      
    </div>
  )
}
