import { useState, useEffect, useMemo } from "react"
import { fetchProducts } from "../api/products"
import { useSearchParams } from "react-router-dom"
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
}

export default function Home() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filters, setFilters] = useState(defaultFilters)
  const [searchParams] = useSearchParams()

  // search comes from the URL (set by Navbar), not local state
  const searchQuery = searchParams.get("search") || ""

  useEffect(() => {
    async function loadProducts() {
      try {
        const res = await fetchProducts()
        setProducts(res.data.data)
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
      // search from navbar URL param
      if (searchQuery.trim()) {
        const q = searchQuery.trim().toLowerCase()
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
  }, [filters, products, searchQuery])

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

  if (error) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-3">⚠️</div>
          <p className="text-red-500">{error}</p>
          <button onClick={() => window.location.reload()} className="mt-4 px-4 py-2 bg-orange-500 text-white rounded-lg">
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <Hero />

      {/* Search result indicator */}
      {searchQuery && (
        <div className="max-w-7xl mx-auto px-4 sm:px-5 lg:px-6 pt-5">
          <p className="text-sm text-slate-500">
            Showing results for{" "}
            <span className="font-medium text-slate-900">"{searchQuery}"</span>
            {" "}— {filtered.length} vehicle{filtered.length !== 1 ? "s" : ""} found
          </p>
        </div>
      )}

      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row px-4 sm:px-5 lg:px-6 pt-5">
        <SlideBar filters={filters} setFilters={setFilters} />
        <ProductGrid products={filtered} />
      </div>
    </div>
  )
}
