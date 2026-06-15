import ProductCard from "./ProductCard"

export default function ProductGrid({ products }) {
  return (
    <main className="flex-1 p-5">

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
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </main>
  )
}