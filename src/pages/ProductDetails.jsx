import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { fetchProducts } from '../api/products'
import { useCart } from '../context/CartContext'

import { useNavigate } from 'react-router-dom'
const ProductDetails = () => {
  const { id } = useParams()
  const { addToCart, cart, removeFromCart } = useCart()

  const [product, setProduct] = useState()
  const [selectedImage, setSelectedImage] = useState("")
  const [loading, setLoading] = useState(true)
  const cartItem = product ? cart.find((item) => item.id === product.id) : null
  const qty = cartItem ? cartItem.qty : 0
  const navigate = useNavigate()
  useEffect(() => {
    async function load() {
      try {
        const res = await fetchProducts()
        const found = res.data.data.find((p) => p.id === Number(id))
        setProduct(found)
        setSelectedImage(found?.image)  // set first image as default
      } catch (err) {
        console.log("Error loading product:", err.message)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

  if (loading) return <p className="text-center mt-10 text-slate-400">Loading...</p>
  if (!product) return <p className="text-center mt-10 text-red-400">Product not found</p>

  // parse images — could be array or comma-separated string
  const images = Array.isArray(product.images)
    ? product.images
    : product.image
      ? [product.image]
      : []

  return (<>

    <div className="max-w-7xl mx-auto px-6 py-8">

      <div className="grid md:grid-cols-2 gap-10">

        {/* Left — Images */}
        <div>
          <div className="border rounded-xl p-4 bg-white">
            <img
              src={selectedImage}
              alt={product.name}
              className="w-full h-100 object-contain"
            />

            {/* Thumbnail strip — only shows if multiple images */}
            {images.length > 1 && (
              <div className="flex gap-3 mt-4 flex-wrap">
                {images.map((img, index) => (
                  <img
                    key={index}
                    src={img}
                    alt=""
                    onClick={() => setSelectedImage(img)}
                    className={`w-20 h-20 object-contain border rounded-lg cursor-pointer transition
                      ${selectedImage === img
                        ? "border-orange-500"
                        : "hover:border-orange-400"
                      }`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right — Info */}
        <div className="flex flex-col gap-4">
          <div>
            <p className="text-black uppercase text-sm tracking-wide">
              {product.company}
            </p>
            <h1 className="text-3xl font-bold text-slate-900 mt-1">
              {product.name}
            </h1>
            <div className="flex items-center gap-2 mt-2 text-sm text-slate-500">

              <span className="text-orange-500">★ {product.rating}</span>
              <span>({product.reviews} reviews)</span>
            </div>
          </div>
          <p>{product.description}</p>
          <h2 className="text-3xl font-bold text-orange-500">
            ₹{product.price} L
          </h2>

          <div className="flex gap-2 text-sm text-slate-500">
            <span className="bg-slate-100 px-3 py-1 rounded-full">{product.fuel}</span>
            <span className="bg-slate-100 px-3 py-1 rounded-full">{product.use_case}</span>
            {product.cc > 0 && (
              <span className="bg-slate-100 px-3 py-1 rounded-full">{product.cc}cc</span>
            )}
          </div>


          {qty === 0 ?
            (
              <button
                onClick={(e) => { e.stopPropagation(); addToCart(product) }}
                className="mt-4 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-xl transition cursor-pointer"
              >
                Add to cart
              </button>) : (<div className="flex items-center gap-2">
                <button
                  onClick={(e) => { e.stopPropagation(); removeFromCart(product.id) }}
                  className="w-6 h-6 rounded-md bg-slate-200 hover:bg-red-100 hover:text-red-500 text-slate-700 font-bold text-sm flex items-center justify-center transition cursor-pointer"
                >
                  −
                </button>
                <span className="text-sm font-semibold text-slate-900 min-w-4 text-center">
                  {qty}
                </span>
                <button
                  onClick={(p) => { p.stopPropagation(); addToCart(product) }}
                  className="w-6 h-6 rounded-md bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm flex items-center justify-center transition cursor-pointer"
                >
                  +
                </button>
              </div>
            )}
          <button
            onClick={() => {
              navigate("/checkout", {
                state: {
                  buyNowItem: { ...product, qty: 1 }
                }
              })
            }}
            className="mt-4 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-xl transition cursor-pointer">
            Buy Now
          </button>
        </div>

      </div>
    </div>
  </>
  )
}

export default ProductDetails