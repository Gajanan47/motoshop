import { useCart } from "../context/CartContext"

export default function Navbar() {
  const { cartCount, setIsCartOpen, setIsFeedbackOpen } = useCart()

  return (
    <nav className="sticky top-0 z-50 bg-[white] border-b border-[black] px-5 h-14 flex items-center justify-between">
      
      <span className="text-lg text-bold font-medium tracking-tight">
        MOTO<span className="text-orange" >SHOP</span>
      </span>

      <div className="flex items-center gap-2">
        <button
          onClick={() => setIsFeedbackOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-black-400 border border-[#2a2f4] rounded-md hover:border-orange-500 hover:text-orange transition cursor-pointer"
        >
          💬 Feedback
        </button>
        
        <button
          onClick={() => setIsCartOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-black-400 border border-[#2a2f4] rounded-md hover:border-orange-500 hover:text-orange transition cursor-pointer"
        >
          🛒 Cart
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