import { toast } from "react-hot-toast";
import { Mahasiswa } from "@/lib/mockMahasiswa";

type Props = {
  babList: string[];
  komponenList: string[];
  kontribusi: boolean[][];
  mahasiswa: Mahasiswa[];
  setMahasiswa: (m: Mahasiswa[]) => void;
};

export default function BulkInput({ babList, komponenList, kontribusi, mahasiswa, setMahasiswa }: Props) {
  const getIndex = (komponen: string) =>
    ["Tugas", "UTS", "UAS", "Proyek", "Kuis"].indexOf(komponen);

  return (
    <section className="bg-white p-6 rounded-lg shadow-md mb-8">
      <h2 className="text-xl font-semibold text-[#0C3C82]">Bulk Input Nilai</h2>
      <p className="text-gray-400 mb-6">Mempercepat pengisian nilai yang sama untuk semua mahasiswa.</p>
      <div className="overflow-x-auto">
        <table className="table-auto w-full text-sm border border-gray-300">
          <thead className="bg-[#114D91] text-white">
            <tr>
              <th className="p-2 text-left">Komponen</th>
              {babList.map((bab) => (
                <th key={bab} className="p-2 text-left">{bab}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {komponenList.map((komponen) => {
              const index = getIndex(komponen);
              return (
                <tr key={komponen}>
                  <td className="p-2 text-[#0C3C82] font-medium">{komponen}</td>
                  {babList.map((bab, bIndex) =>
                    kontribusi[index]?.[bIndex] ? (
                      <td key={`${komponen}-${bab}`} className="p-2">
                        <input
                          type="number"
                          className="border border-gray-300 rounded px-2 py-1 w-full text-[#0C3C82]"
                          placeholder="Nilai"
                          onChange={(e) => {
                            const val = parseFloat(e.target.value);
                            if (val < 0 || val > 100) {
                              toast.error("Nilai harus 0 - 100");
                              return;
                            }

                            const updated = mahasiswa.map((m) => ({
                              ...m,
                              nilai: {
                                ...m.nilai,
                                [`${komponen}-${bab}`]: isNaN(val) ? "" : val,
                              },
                            }));
                            setMahasiswa(updated);
                          }}
                        />
                      </td>
                    ) : (
                      <td key={`${komponen}-${bab}`} className="text-center text-gray-300">–</td>
                    )
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
