"use client";

type Props = {
  persentase: number[];
  onSliderChange: (i: number, val: number) => void;
  totalBobot: number;
  onSave: () => void;
  onReset: () => void;
};

const komponenList = ["Tugas", "UTS", "UAS", "Proyek", "Kuis"];

export default function KonfigurasiTable({ persentase, onSliderChange, totalBobot, onSave, onReset }: Props) {
  return (
    <div className="bg-white rounded shadow p-6 overflow-x-auto">
      <h2 className="font-bold mb-4 text-lg">Konfigurasi Komponen Nilai</h2>
      <table className="w-full mb-4">
        <thead className="bg-[#0C3C82] text-white">
          <tr>
            <th className="text-left p-2">Komponen</th>
            <th className="text-left p-2">Bobot (%)</th>
          </tr>
        </thead>
        <tbody>
          {komponenList.map((komp, i) => (
            <tr key={komp} className="border-b">
              <td className="p-2">{komp}</td>
              <td className="p-2">
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={persentase[i]}
                  onChange={(e) => onSliderChange(i, +e.target.value)}
                  className="w-2/3 accent-blue-600"
                />
                <span className="ml-3">{persentase[i]}%</span>
              </td>
            </tr>
          ))}
          <tr>
            <td className="font-bold p-2">Total</td>
            <td
                className={`font-bold p-2 ${
                    totalBobot > 100
                    ? "text-red-600"
                    : totalBobot < 100
                    ? "text-yellow-600"
                    : ""
                }`}
            >
                {totalBobot}%
            </td>
          </tr>
        </tbody>
      </table>

      <div className="flex justify-end gap-3">
        <button
            className="bg-gray-300 text-[#0C3C82] px-4 py-2 rounded disabled:opacity-50 hover:bg-[#114D91] hover:text-white hover:shadow-lg hover:shadow-black/30"
            disabled={totalBobot !== 100}
            onClick={onSave}
        >
            Simpan
        </button>
        <button
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            onClick={onReset}
        >
            Reset
        </button>
      </div>
    </div>
  );
}
