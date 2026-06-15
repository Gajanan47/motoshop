export default function Hero() {
  return (
    <div className="bg-[white] border-b border-[black] px-5 py-7 flex items-center justify-between">
      
      <div>
        <h1 className="text-2xl font-medium text-black ">
          Find Your <span className="text-orange-500">Perfect Ride</span>
        </h1>
      </div>

      <div className="flex gap-6 text-center">
        {[
          { num: "240+", label: "Models" },
          { num: "18",   label: "Brands" },
          { num: "5★",   label: "Rated"  },
        ].map((stat) => (
          <div key={stat.label}>
            <div className="text-xl font-medium text-orange-500">{stat.num}</div>
            <div className="text-xs text-gray-500 mt-0.5">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}