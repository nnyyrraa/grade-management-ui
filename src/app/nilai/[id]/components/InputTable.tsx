import { Mahasiswa } from "@/lib/mockMahasiswa";
import { toast } from "react-hot-toast";

type Props = {
  mahasiswa: Mahasiswa[];
  setMahasiswa: (data: Mahasiswa[]) => void;
  komponenList: string[];
  kontribusi: boolean[][];
  persentase: number[];
  babList: string[];
  filterKomponen: string;
};

export default function InputTable({
  mahasiswa,
  setMahasiswa,
  komponenList,
  kontribusi,
  persentase,
  babList,
  filterKomponen,
}: Props) {
  const getIndexAsli = (komponen: string) =>
    ["Tugas", "UTS", "UAS", "Proyek", "Kuis"].indexOf(komponen);

  const komponenDitampilkan =
    filterKomponen === "Semua Komponen"
      ? komponenList
      : komponenList.filter((k) => k === filterKomponen);

  const getProgress = () => {
    const totalField = mahasiswa.length * komponenList.reduce((sum, komponen) => {
      const index = getIndexAsli(komponen);
      return sum + (kontribusi[index]?.filter(Boolean).length || 0);
    }, 0);

    const filledField = mahasiswa.reduce((sum, mhs) => {
      return (
        sum +
        Object.entries(mhs.nilai).filter(([_, v]) => v !== "" && v !== null && v !== undefined).length
      );
    }, 0);

    return totalField > 0 ? (filledField / totalField) * 100 : 0;
  };

  const hitungTotal = (nilai: Record<string, number>) => {
    return komponenDitampilkan.reduce((total, komponen) => {
      const indexAsli = getIndexAsli(komponen);
      const bobot = persentase[indexAsli] || 0;

      const nilaiBab: number[] = babList.reduce((arr, bab, j) => {
        if (kontribusi[indexAsli]?.[j]) {
          const n = nilai[`${komponen}-${bab}`] ?? null;
          if (n !== null) arr.push(n);
        }
        return arr;
      }, [] as number[]);

      const avg = nilaiBab.length > 0 ? nilaiBab.reduce((a, b) => a + b, 0) / nilaiBab.length : 0;

      return total + (avg * bobot) / 100;
    }, 0).toFixed(2);
  };

  const handleNilaiChange = (mIndex: number, key: string, value: string) => {
    const parsed = value === "" ? "" : parseFloat(value);

    if (value === "") {
      const updated = [...mahasiswa];
      updated[mIndex].nilai[key] = "";
      setMahasiswa(updated);
      return;
    }

    if (parsed < 0 || parsed > 100) {
      toast.error("Nilai harus berada dalam rentang 0 - 100");
      return;
    }

    const updated = [...mahasiswa];
    updated[mIndex].nilai[key] = parsed;
    setMahasiswa(updated);
  };

  return (
    <div>
      {/* Progress Indicator */}
      <div className="mb-4 flex items-center justify-between gap-4 flex-wrap">
        <h2 className="text-xl font-semibold text-[#0C3C82] pt-6">Input Nilai Per Mahasiswa</h2>
        <div className="flex flex-col items-end">
          <div className="w-[240px] h-3 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#0C3C82] transition-all"
              style={{ width: `${getProgress()}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-500 mt-1">{getProgress().toFixed(0)}% selesai</p>
        </div>
      </div>

      {/* Table Nilai */}
      <table className="table-auto w-full border border-gray-300">
        <thead className="bg-[#114D91] text-white text-sm">
          <tr>
            <th rowSpan={2} className="p-2 text-left align-middle min-w-[160px]">
              Nama Mahasiswa
            </th>
            {komponenDitampilkan.map((komponen) => {
              const indexAsli = getIndexAsli(komponen);
              const jumlahBab = kontribusi[indexAsli]?.filter(Boolean).length;
              return jumlahBab > 0 ? (
                <th key={komponen} colSpan={jumlahBab} className="p-2 text-left">
                  {komponen}
                </th>
              ) : null;
            })}
            <th rowSpan={2} className="p-2 text-left align-middle min-w-[120px]">
              Total Akhir
            </th>
          </tr>
          <tr>
            {komponenDitampilkan.flatMap((komponen) =>
              babList.map((bab, bIndex) =>
                kontribusi[getIndexAsli(komponen)]?.[bIndex] ? (
                  <th key={`${komponen}-${bab}`} className="p-2 text-left">
                    {bab}
                  </th>
                ) : null
              )
            )}
          </tr>
        </thead>
        <tbody>
          {mahasiswa.map((mhs, mIndex) => (
            <tr key={mIndex} className="border-t border-gray-300">
              <td className="p-2 min-w-[160px]">{mhs.nama}</td>
              {komponenDitampilkan.map((komponen) =>
                babList.map((bab, bIndex) =>
                  kontribusi[getIndexAsli(komponen)]?.[bIndex] ? (
                    <td key={`${komponen}-${bab}`} className="p-2">
                      <input
                        type="number"
                        className="border px-2 py-1 w-full rounded text-[#0C3C82] border-gray-300 focus:border-[#114D91] focus:outline-none"
                        value={mhs.nilai[`${komponen}-${bab}`] ?? ""}
                        onChange={(e) =>
                          handleNilaiChange(mIndex, `${komponen}-${bab}`, e.target.value)
                        }
                      />
                    </td>
                  ) : null
                )
              )}
              <td className="p-2 font-semibold text-right min-w-[120px]">
                {hitungTotal(mhs.nilai)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <p className="mt-4 text-sm text-gray-500">* Nilai akan tersimpan otomatis saat Anda mengisi.</p>
    </div>
  );
}
