type Props = {
  komponenList: string[];
  filterKomponen: string;
  setFilterKomponen: (val: string) => void;
};

export default function FilterSelect({ komponenList, filterKomponen, setFilterKomponen }: Props) {
  return (
    <div className="mb-4 flex justify-end">
      <select
        value={filterKomponen}
        onChange={(e) => setFilterKomponen(e.target.value)}
        className="border border-gray-300 text-sm rounded px-3 py-2 text-[#0C3C82] bg-white"
      >
        <option value="Semua Komponen">Semua Komponen</option>
        {komponenList.map((komponen) => (
          <option key={komponen} value={komponen}>{komponen}</option>
        ))}
      </select>
    </div>
  );
}
