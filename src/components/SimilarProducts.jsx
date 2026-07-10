import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

const SimilarProducts = ({products}) => {
    const navigate = useNavigate()
    if(!products.length )return null
    const handleClick = (productId) => {
        navigate(`/products/${productId}`)
        window.scrollTo({top:0,behavior: 'smooth'})
    }
  return (
    <div className='mt-16 px-8'>
        <h2 className='font-bold text-2xl mb-6'>Similar Products</h2>

        <div className='grid grid-cols-2 md:grid-cols-3 gap-2 lg:grid-cols-4'>
            {products.map(product => (
                <div className='cursor-pointer shadow-inner shadow-black/20 relative  rounded-xl hover:shadow-orange-600 hover:shadow-inner  transition overfolw-hidden bg-white' key={product.id} onClick={()=>handleClick(product.id)}>
                    <img src={product.image} className='h-52 w-full object-contain p-4'  />
                    <div className='p-4'>
                        <p className='text-xs text-grey-500 uppercase'>
                           ( {product.company})
                        </p>
                        <h3 className='font-semibold mt-1 line-clamp-2'>{product.name}</h3>
                        <div className='flex flex-row items-center gap-3 mt-2'>
                             <span className='bg-green-600 text-white text-xs px-2 py-1 rounded'>
                            ({product.rating})
                        </span>
                        <span className='text-sm text-grey-400'>
                            ({product.reviews})
                        </span>
                        <p className='text-orange-600 font-bold text-lg mt-3'>
                            ₹{Number(product.price).toLocaleString()}L
                        </p>
                        </div>
                       
                    </div>
                </div>
            ))}

        </div>
    </div>
  )
}

export default SimilarProducts