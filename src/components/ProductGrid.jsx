import ProductCard from "./ProductCard"
import React, {useState, useEffect} from "react"
export default function ProductGrid({ products }) {
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 16;
  const indexOfLastItem = itemsPerPage * currentPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const displayedProducts =  products.slice(indexOfFirstItem, indexOfLastItem)

  useEffect(() => {
    setCurrentPage(1)
  }, [products])
  
  return (
    <main className="flex-1 p-4 sm:p-5">

      <div className="flex items-center justify-between mb-4">
        <span className="text-sm text-gray-700">
          Showing <span className="text-black font-medium">{products.length}</span> vehicles
        </span>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-16 text-black-500">
          <div className="text-4xl mb-3">🔍</div>
          <p>No vehicles match your filters</p>
        </div>
      ) : (
        <div  className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {displayedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

       <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 pt-4 border-t border-slate-100">
        <div className="flex justify-between w-full sm:w-auto items-center gap-2 order-2 sm:order-1">
          <button
            className="text-sm px-4 py-2 border border-slate-200 rounded-lg text-slate-600 hover:border-orange-400 hover:text-orange-500 disabled:opacity-40 disabled:hover:border-slate-200 disabled:hover:text-slate-600 disabled:cursor-not-allowed cursor-pointer transition"
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            ← Previous
          </button>

          <button
            className="text-sm px-4 py-2 border border-slate-200 rounded-lg text-slate-600 hover:border-orange-400 hover:text-orange-500 disabled:opacity-40 disabled:hover:border-slate-200 disabled:hover:text-slate-600 disabled:cursor-not-allowed cursor-pointer transition"
            onClick={() => setCurrentPage(prev =>
              Math.min(prev + 1, Math.ceil(products.length / itemsPerPage))
            )}
            disabled={indexOfLastItem >= products.length}
          >
            Next →
          </button>
        </div>

        <div className="flex flex-col items-center sm:items-end gap-0.5 text-sm text-slate-500 order-1 sm:order-2 w-full sm:w-auto">
          <span>
            Page <span className="font-medium text-slate-900">{currentPage}</span> of {Math.max(1, Math.ceil(products.length / itemsPerPage))}
          </span>
          <span className="text-xs text-slate-400">Total products: {products.length}</span>
        </div>
      </div>
    </main>
  )
}