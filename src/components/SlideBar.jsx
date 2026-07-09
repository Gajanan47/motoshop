
import { useState } from 'react'
function FilterBtn({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-3 py-1.5 text-sm rounded-md border transition cursor-pointer
        ${active
          ? "border-orange-500 bg-orange-50/50 text-orange-600 font-medium"
          : "border-slate-200 text-slate-700 hover:border-orange-500 hover:text-orange-500"
        }`}
    >
      {children}
    </button>
  )
}

function Section({ label, children }) {
  return (
    <div className="mb-4 sm:mb-5">
      <p className="text-[11px] text-slate-500 uppercase tracking-widest font-semibold mb-2">
        {label}
      </p>
      <div className="grid grid-cols-2 xs:grid-cols-3 sm:flex sm:flex-col gap-1.5" >{children}</div>
    </div>
  )
}

export default function Slidebar({ filters, setFilters }) {
  const [isOpen, setIsOpen] = useState(false)
  function set(key, value) {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  return (
    <div className="w-full sm:w-56 bg-white text-black sm:border-r border-b sm:border-b-0 border-slate-200 sm:sticky sm:top-14 sm:h-[calc(100vh-3.5rem)] sm:overflow-y-auto shrink-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="sm:hidden w-full flex items-center justify-between px-4 py-3 bg-slate-50 text-sm font-medium text-slate-700 border-b border-slate-200 cursor-pointer"
      >
        <span className="flex items-center gap-1.5">
          <span>⚙️</span> Filter Vehicles
        </span>
        <span className="text-xs transition-transform duration-200" style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>
          ▼
        </span>
      </button>
      <aside className={`${isOpen ? "block" : "hidden sm:block"} p-4`}>
        <Section label="Vehicle type" >
          {[
            { value: "all", label: "All vehicles" },
            { value: "2", label: "🏍 Two-wheelers" },
            { value: "4", label: "🚗 Four-wheelers" },
          ].map((o) => (
            <FilterBtn key={o.value} active={filters.type === o.value} onClick={() => set("type", o.value)}>
              {o.label}
            </FilterBtn>
          ))}
        </Section>

        <Section label="Engine (CC)">
          {[
            { value: "all", label: "All" },
            { value: "150", label: "Up to 150cc" },
            { value: "250", label: "151 – 250cc" },
            { value: "500", label: "251 – 500cc" },
            { value: "501", label: "500cc+" },
          ].map((o) => (
            <FilterBtn key={o.value} active={filters.cc === o.value} onClick={() => set("cc", o.value)}>
              {o.label}
            </FilterBtn>
          ))}
        </Section>

        <Section label="Company">
          {["all", "Honda", "Yamaha", "Royal Enfield", "KTM", "Bajaj", "Tata", "Hyundai"].map((brand) => (
            <FilterBtn key={brand} active={filters.brand === brand} onClick={() => set("brand", brand)}>
              {brand === "all" ? "All brands" : brand}
            </FilterBtn>
          ))}
        </Section>
          <div className="mb-4 sm:mb-5">
            <p className="text-[11px] text-slate-500 uppercase tracking-widest font-semibold mb-2">
              Budget: ≤ ₹{filters.price}L
              </p>
          <input
            type="range" min="1" max="30" step="1"
            value={filters.price}
            onChange={(e) => set("price", Number(e.target.value))}
            className="  sm:w-full accent-orange-500"
          />
          </div>
        

        <Section label="Fuel type">
          {["all", "Petrol", "Electric", "Diesel", "CNG"].map((f) => (
            <FilterBtn key={f} active={filters.fuel === f} onClick={() => set("fuel", f)}>
              {f === "all" ? "All" : f}
            </FilterBtn>
          ))}
        </Section>

        <Section label="Use case">
          {["all", "Commuter", "Sport", "Adventure", "Family"].map((u) => (
            <FilterBtn key={u} active={filters.use === u} onClick={() => set("use", u)}>
              {u === "all" ? "All" : u}
            </FilterBtn>
          ))}
        </Section>

      </aside>

    </div>
  )
}
