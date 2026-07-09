import { useCart } from "../context/CartContext"
import {useNavigate} from "react-router-dom"
const badgeStyle = {
  new: "bg-green-500/10 text-green-400 border border-green-500/30",
  hot: "bg-orange-500/10 text-orange-400 border border-orange-500/30",
  sale: "bg-red-500/10 text-red-400 border border-red-500/30",
}

export default function ProductCard({ product }) {
  const { addToCart, cart, removeFromCart } = useCart()

  const cartItem = cart.find((item) => item.id === product.id)
  const qty = cartItem ? cartItem.qty : 0
  const navigate=useNavigate()
  const stars = "★".repeat(Math.round(product.rating)) +
    "☆".repeat(5 - Math.round(product.rating))

  return (
    <div className="bg-white border border-slate-200 shadow-sm rounded-xl overflow-hidden hover:border-orange-500 hover-shadow-xl hover:-translate-y-1 transition-all duration-200">
      <div
        onClick={() => navigate(`/products/${product.id}`)}
        className="cursor-pointer"
      >

        <div className=" relative h-48 bg-linear-to-b from-slate-50 to-white flex items-center justify-center">
          <span className="text-5xl">{product.type === 2 ? <img src={product.image} alt={product.name}
            className="w-full h-full object-contain p-2"
          /> : <img src={product.image} alt={product.name} />} </span>
          {product.badge && (
            <span className={`absolute top-2 left-2 text-[10px] font-medium px-2 py-0.5 rounded-full ${badgeStyle[product.badge]}`}>
              {product.badge}
            </span>
          )}
        </div>


        <div className="p-3">
          <p className="text-[10px] text-black-500 uppercase tracking-wider font-medium">
            {product.company}
          </p>
          <h3 className="text-sm font-medium text-black mt-0.5 mb-1.5 leading-snug">
            {product.name}
          </h3>


          <div className="flex items-center gap-1.5 mb-2">
            <span className="text-orange-400 text-xs">{stars}</span>
            <span className="text-[11px] text-gray-500">
              ({product.reviews.toLocaleString()})
            </span>
          </div>

          {/* Spec pills */}
          <div className="flex flex-wrap gap-1 mb-3">
            {[
              product.type === 2 ? "2W" : "4W",
              product.fuel === "Electric" ? "EV" : `${product.cc}cc`,
              product.use_case
            ].map((spec, index) => (
              <span key={index} className="px-3 py-1
                                          rounded-full
                                          text-xs
                                          font-medium
                                          bg-slate-100
                                          text-slate-700">
                {spec}
              </span>
            ))}
          </div>

          {/* Price + button */}
          <div className="flex items-center justify-between">
            <span className="text-orange-500 font-medium">₹{product.price}L</span>
            {qty === 0 ?
              (
                <button
                  onClick={(e) => {e.stopPropagation(); addToCart(product)}}
                  className="bg-orange-500 hover:bg-orange-600 text-white text-xs px-3 py-1.5 rounded-md transition cursor-pointer"
                >
                  + ADD
                </button>) : (<div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {e.stopPropagation(); removeFromCart(product.id)}}
                    className="w-6 h-6 rounded-md bg-slate-200 hover:bg-red-100 hover:text-red-500 text-slate-700 font-bold text-sm flex items-center justify-center transition cursor-pointer"
                  >
                    −
                  </button>
                  <span className="text-sm font-semibold text-slate-900 min-w-4 text-center">
                    {qty}
                  </span>
                  <button
                    onClick={(p) =>{p.stopPropagation();  addToCart(product)}}
                    className="w-6 h-6 rounded-md bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm flex items-center justify-center transition cursor-pointer"
                  >
                    +
                  </button>
                </div>
              )
            }
          </div>
        </div>
      </div>
    </div>
  )
}