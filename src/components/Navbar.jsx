import { useState, useEffect } from 'react'
import { useCart } from "../context/CartContext"
import { useNavigate, useLocation, useSearchParams } from "react-router-dom"

export default function Navbar() {
  const { cartCount, setIsCartOpen } = useCart()
  const [isAccountOpen, setIsAccountOpen] = useState(false)
  const [searchInput, setSearchInput] = useState("")
  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams] = useSearchParams()

  const name = localStorage.getItem("userName")
  const isLoginPage = location.pathname === '/login'
  const isHomePage = location.pathname === '/'

  // sync search input with URL param when on home page
  useEffect(() => {
    if (isHomePage) {
      setSearchInput(searchParams.get("search") || "")
    } else {
      setSearchInput("")
    }
  }, [location])

  function handleSearch(e) {
    e.preventDefault()
    const q = searchInput.trim()
    if (q) {
      navigate(`/?search=${encodeURIComponent(q)}`)
    } else {
      navigate("/")
    }
  }

  function clearSearch() {
    setSearchInput("")
    if (isHomePage) navigate("/")
  }

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-slate-200 px-3 sm:px-5 h-14 flex items-center gap-3 justify-between">

      {/* Logo */}
      <span
        onClick={() => { navigate('/'); setSearchInput("") }}
        className="text-lg font-bold tracking-tight cursor-pointer shrink-0"
      >
        MOTO<span className="text-orange-500">SHOP</span>
      </span>

      {/* Search bar — Amazon style, takes up center space */}
      {!isLoginPage && (
          <form onSubmit={handleSearch} className="flex-1 max-w-2xl flex items-center">
        <div className="relative w-full">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search vehicles by name or brand..."
            className="w-full bg-slate-50 border border-slate-200 rounded-l-lg pl-4 pr-10 py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-orange-400 focus:bg-white transition h-9"
          />
          {searchInput && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-lg leading-none cursor-pointer"
            >
              ✕
            </button>
          )}
        </div>
        <button
          type="submit"
          className="bg-orange-500 hover:bg-orange-600 text-white px-3 h-9 rounded-r-lg shrink-0 flex items-center justify-center transition cursor-pointer"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
          </svg>
        </button>
      </form>
      )}
      

      {/* Right — Account + Cart */}
      <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
        <div className="relative">
          {name ? (
            <div onMouseEnter={() => setIsAccountOpen(true)} onMouseLeave={() => setIsAccountOpen(false)}>
              <button className="px-2 sm:px-3 py-1.5 text-left text-sm border border-slate-200 rounded-md hover:border-orange-500 max-w-35 sm:max-w-none transition">
                <span className="text-[10px] sm:text-xs block text-slate-500 truncate">
                  Hi, {name}
                  <span className="text-slate-900 font-medium hidden sm:inline"> Accounts & List </span>
                  <span className="inline sm:hidden font-medium text-slate-900"> ▾</span>
                </span>
              </button>

              {isAccountOpen && (
                <div className="absolute right-0 mt-0 w-48 bg-white border border-slate-200 rounded-xl shadow-lg z-50 overflow-hidden">
                  <button
                    onClick={() => { setIsAccountOpen(false); navigate("/profile") }}
                    className="w-full text-left px-4 py-3 text-sm text-slate-700 hover:bg-orange-50 hover:text-orange-600 transition"
                  >
                    Profile
                  </button>
                  <button
                    className="w-full px-4 text-left py-3 text-sm text-slate-700 hover:bg-orange-50 hover:text-orange-600 transition"
                    onClick={() => { setIsAccountOpen(false); navigate('/my-orders') }}
                  >
                    Your orders
                  </button>
                  <button
                    className="w-full px-4 text-left py-3 text-sm text-slate-700 hover:bg-orange-50 hover:text-orange-600 transition"
                    onClick={() => {
                      localStorage.removeItem("userToken")
                      localStorage.removeItem("userName")
                      localStorage.removeItem("userEmail")
                      setIsAccountOpen(false)
                      navigate("/login")
                      window.location.reload()
                    }}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => navigate(isLoginPage ? '/register' : '/login')}
              className="px-3 py-1.5 text-sm border border-slate-200 rounded-md hover:border-orange-500 hover:text-orange-500 transition"
            >
              {isLoginPage ? "Register" : "Login"}
            </button>
          )}
        </div>

        <button
          onClick={() => setIsCartOpen(true)}
          className="flex items-center gap-1 sm:gap-1.5 sm:px-3 px-2 py-1.5 text-sm text-black-400 border border-slate-200 rounded-md hover:border-orange-500 hover:text-orange transition cursor-pointer shrink-0"
        >
          <span>🛒</span>
          <span className="hidden xs:inline">Cart</span>
          {cartCount > 0 && (
            <span className="bg-orange-500 text-white text-xs font-medium rounded-full px-1.5 py-0.5">
              {cartCount}
            </span>
          )}
        </button>
      </div>
    </nav>
  )
}