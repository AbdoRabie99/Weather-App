import SearchBar from "./SearchBar";
import UnitToggle from "./UnitToggle";

export default function Header({
  cityData,
  onSearch,
  loading,
  error,
  unit,
  setUnit,
}) {
  return (
    <header className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between lg:gap-8">
      <div className="details">
        <h1 className="font-mono text-xs tracking-widest text-[#8899CC]">
          WEATHER.SYS
        </h1>

        <p className="text-2xl font-bold text-white">
          {cityData?.name || "City"}
        </p>

        <p className="text-sm text-[#8899CC]">
          {cityData?.country || "Search for a city"}
        </p>
      </div>

      <div className="flex flex-1 justify-center">
        <SearchBar onSearch={onSearch} loading={loading} error={error} />
      </div>

      <UnitToggle unit={unit} setUnit={setUnit} />
    </header>
  );
}
