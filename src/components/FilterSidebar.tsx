type Props = {
  selected: string;
  onChange: (val: string) => void;
};

export default function FilterSidebar({ selected, onChange }: Props) {
  const filters = ["Semua Kelas", "Sudah Konfigurasi", "Belum Konfigurasi"];

  return (
    <div className="bg-white shadow-md p-4 rounded-lg space-y-2 w-full lg:w-60">
      {filters.map((item) => (
        <button
          key={item}
          onClick={() => onChange(item)}
          className={`w-full text-left px-4 py-2 rounded ${
            selected === item ? "bg-[#0C3C82] text-white" : "hover:bg-gray-100"
          }`}
        >
          {item}
        </button>
      ))}
    </div>
  );
}
