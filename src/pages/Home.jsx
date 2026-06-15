import { useState, useMemo } from "react"
import { products } from "../data/products"
import Navbar from "../components/Navbar"
import Hero from "../components/Hero"
import ProductGrid from "../components/ProductGrid"
import Slidebar from "../components/SlideBar"
import CartModal from "../components/CartModal"
import FeedbackModal from "../components/FeedbackModal"


const defaultFilters = {
  type: "all",
  cc: "all",
  brand: "all",
  price: 30,
  fuel: "all",
  use: "all",
}

function App() {
  const [filters, setFilters] = useState(defaultFilters)

  const filtered = useMemo(() => {
    return products.filter((p) => {
      if (filters.type !== "all" && String(p.type) !== filters.type) return false
      if (filters.cc !== "all") {
        const cc = parseInt(filters.cc)
        if (cc === 150 && p.cc > 150)             return false
        if (cc === 250 && (p.cc < 151 || p.cc > 250)) return false
        if (cc === 500 && (p.cc < 251 || p.cc > 500)) return false
        if (cc === 501 && p.cc <= 500)            return false
      }
      if (filters.brand !== "all" && p.company !== filters.brand) return false
      if (p.price > filters.price)                return false
      if (filters.fuel !== "all" && p.fuel !== filters.fuel) return false
      if (filters.use !== "all" && p.use !== filters.use)   return false
      return true
    })
  }, [filters])

  return (
    
      <div className="min-h-screen bg-[slate-100] text-black">
        <Navbar />
        <Hero />
        <div className="flex">
          <Slidebar filters={filters} setFilters={setFilters}/>
          <ProductGrid products={filtered} />
        </div>
        <CartModal />
        <FeedbackModal />
      </div>
    
  )
}

export default App