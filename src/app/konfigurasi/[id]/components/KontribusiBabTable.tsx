"use client";

type Props = {
  kontribusi: boolean[][];
  onCheckboxChange: (i: number, j: number) => void;
};

const komponenList = ["Tugas", "UTS", "UAS", "Proyek", "Kuis"];
const babList = ["Bab 1", "Bab 2", "Bab 3", "Bab 4", "Bab 5"];

export default function KontribusiBabTable({ kontribusi, onCheckboxChange }: Props) {
  return (
    <div className="mt-10 bg-white rounded shadow p-6 overflow-x-auto">
      <h2 className="font-bold mb-4 text-lg">Kontribusi Bab terhadap Komponen</h2>
      <table className="w-full">
        <thead className="bg-[#0C3C82] text-white">
          <tr>
            <th className="p-2 text-left">Komponen</th>
            {babList.map((bab) => (
              <th className="p-2 text-center" key={bab}>
                {bab}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {komponenList.map((komp, i) => (
            <tr key={komp} className="border-b">
              <td className="p-2">{komp}</td>
              {babList.map((_, j) => (
                <td key={j} className="text-center">
                  <input
                    type="checkbox"
                    checked={kontribusi[i][j]}
                    onChange={() => onCheckboxChange(i, j)}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
