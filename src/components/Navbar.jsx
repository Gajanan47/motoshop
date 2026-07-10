import {useState} from 'react'
import { useCart } from "../context/CartContext"
import { useNavigate, useLocation } from "react-router-dom"
export default function Navbar() {
  const { cartCount, setIsCartOpen } = useCart()
  const [isAccountOpen, setIsAccountOpen] = useState(false)
  const navigate = useNavigate()
  const name = localStorage.getItem("userName")
  const location = useLocation()
  const isLoginPage = location.pathname === '/login'
 
  return (
    <nav className="sticky top-0 z-50 bg-[white] border-b border-[black]px-3 sm:px-5 h-14 flex items-center justify-between">
      
      <span onClick= {() => navigate('/') } className="text-lg font-bold  tracking-tight cursor-pointer">
        MOTO<span className="text-orange-500" >SHOP</span>
      </span>

      <div className="flex items-center gap-1.5 sm:gap-2">
       <div className="relative" >
         { name ? (
          <div onMouseEnter={()=>setIsAccountOpen(true)} onMouseLeave={()=>setIsAccountOpen(false)}>
          <button 
            className="px-2 sm:px-3 py-1.5 text-left text-sm border border-slate-200 rounded-md hover:border-orange-500 max-w-35 sm:max-w-none transition">
            
          
  <span className="text-[10px] sm:text-xs block text-slate-500 truncate">
    Hi, {name}
    <span className="text-slate-900 font-medium hidden sm:inline"> Accounts & List </span>
      <span className='inline sm:hidden font-medium text-slate-900'> ▾</span>
  </span>
  </button>
    
    {isAccountOpen && (
        <div className="absolute right-0 mt-0 w-48 bg-white border border-slate-200 rounded-xl shadow-lg z-50 overflow-hidden" >
          <button
            onClick={() => {
              setIsAccountOpen(false)
              navigate("/profile")
            }}
            className="w-full text-left px-4 py-3 text-sm text-slate-700 hover:bg-orange-50 hover:text-orange-600 transition"
          >
            Profile
          </button>
          <button
          className = "w-full px-4 text-left py-3 text-sm text-slate-700 hover:bg-orange-50 hover:text-orange-600 transition " 
          onClick={()=> {setIsAccountOpen(false)
           navigate('/my-orders')}}>
            Your orders
            </button> 
            <button 
            className = "w-full px-4 text-left py-3 text-sm text-slate-700 hover:bg-orange-50 hover:text-orange-600 transition"
            onClick={()=>{
              localStorage.removeItem("userToken")
              localStorage.removeItem("userName")
              localStorage.removeItem("userEmail")
              setIsAccountOpen(false)
              navigate("/login")
              window.location.reload()
            }}>
              Logout
              </button>   
              </div>
    )}
    
  </div>
  
  
) : (
  <button
    onClick={() => {navigate(isLoginPage ? '/register' : '/login')}}
    className="px-3 py-1.5 text-sm border border-slate-200 rounded-md hover:border-orange-500 hover:text-orange-500 transition"
  >
    {isLoginPage ? "Register" : "Login"}
  </button>
)}
       </div>
        

        <button
          onClick={() => setIsCartOpen(true)}
          className="flex items-center gap-1 sm:gap-1.5 sm:px-3 px-2 py-1.5 text-sm text-black-400 border border-[#2a2f4] rounded-md hover:border-orange-500 hover:text-orange transition cursor-pointer shink-0"
        >
          <span>🛒 </span><span className='hidden xs:inline'>Cart</span>
          {cartCount > 0 && (
            <span className="bg-orange-500 text-black text-xs font-medium rounded-full px-1.5 py-0.5">
              {cartCount}
            </span>
          )}
        </button>
      </div>
    </nav>
  )
}