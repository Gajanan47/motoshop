function FilterBtn({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-3 py-1.5 text-sm rounded-md border transition cursor-pointer
        ${active
          ? "border-orange-500 bg-orange-500/10 text-black"
          : "border-[#2a2f45] text-black-400 hover:border-orange-500 hover:text-orange"
        }`}
    >
      {children}
    </button>
  )
}

function Section({ label, children }) {
  return (
    <div className="mb-5">
      <p className="text-[11px] text-black-700 uppercase tracking-widest font-medium mb-2">
        {label}
      </p>
      <div className="flex flex-col gap-1" >{children}</div>
    </div>
  )
}

export default function Slidebar({ filters, setFilters }) {
  function set(key, value) {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  return (
    <aside className="w-56 bg-[slate-300] text-black border-r border-[#2a2f45] p-4 sticky top-14 h-[calc(100vh-3.5rem)] overflow-y-auto shrink-0">

      <Section label="Vehicle type" >
        {[
          { value: "all", label: "All vehicles" },
          { value: "2",   label: "🏍 Two-wheelers" },
          { value: "4",   label: "🚗 Four-wheelers" },
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
        {["all","Honda","Yamaha","Royal Enfield","KTM","Bajaj","Tata","Hyundai"].map((brand) => (
          <FilterBtn key={brand} active={filters.brand === brand} onClick={() => set("brand", brand)}>
            {brand === "all" ? "All brands" : brand}
          </FilterBtn>
        ))}
      </Section>

      <Section label={`Budget: ≤ ₹${filters.price}L`}>
        <input
          type="range" min="1" max="30" step="1"
          value={filters.price}
          onChange={(e) => set("price", Number(e.target.value))}
          className="w-full accent-orange-500"
        />
      </Section>

      <Section label="Fuel type">
        {["all","Petrol","Electric","Diesel"].map((f) => (
          <FilterBtn key={f} active={filters.fuel === f} onClick={() => set("fuel", f)}>
            {f === "all" ? "All" : f}
          </FilterBtn>
        ))}
      </Section>

      <Section label="Use case">
        {["all","Commuter","Sport","Adventure","Family"].map((u) => (
          <FilterBtn key={u} active={filters.use === u} onClick={() => set("use", u)}>
            {u === "all" ? "All" : u}
          </FilterBtn>
        ))}
      </Section>

    </aside>
  )
}