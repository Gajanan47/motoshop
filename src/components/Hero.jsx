import {useState, useEffect} from "react"
import { fetchProducts } from "../api/products"
import { useCart } from "../context/CartContext"
export default function Hero() {
  const [products, setproducts] = useState([])
  useEffect(() => {
    async function loadProducts(){
      try{
        const data = await fetchProducts();
        setproducts(data.data.data)

      }catch(err){
        console.log(err)
      }
    }
    
  loadProducts()
    
  }, [])
  

  
  return (
    <div className="bg-[white] border-b border-[black] px-4 sm:px-5 py-5 flex flex-col md:flex-row items-center justify-between md:text-left">


      <div>
        <h1 className="text-xl sm:text-2xl font-medium text-black ">
          Find Your <span className="text-orange-500">Perfect Ride</span>
        </h1>
      </div>

      



      <div className="flex gap-4 sm:gap-6 text-center">
        {[
          { num: "240+", label: "Models" },
          { num: "18", label: "Brands" },
          { num: "5★", label: "Rated" },
        ].map((stat) => (
          <div key={stat.label} className="max-w-15">
            <div className="text-lg sm:text-xl font-medium text-orange-500">{stat.num}</div>
            <div className="text-[10px] sm:text-xs text-gray-500 mt-0.5">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}