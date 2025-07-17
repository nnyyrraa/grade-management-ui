"use client";

import { useState } from "react";

type Props = {
  persentase: number[];
};

const komponenList = ["Tugas", "UTS", "UAS", "Proyek", "Kuis"];

export default function SimulasiNilai({ persentase }: Props) {
  // Nilai default awal 0 untuk semua komponen
  const [sampleNilai, setSampleNilai] = useState<number[]>(
    Array(komponenList.length).fill(0)
  );

  const handleSampleChange = (i: number, val: number) => {
    const updated = [...sampleNilai];
    updated[i] = val;
    setSampleNilai(updated);
  };

  const totalSimulasi = persentase.reduce(
    (sum, bobot, i) => sum + (bobot / 100) * sampleNilai[i],
    0
  );

  return (
    <div className="mt-10 bg-white rounded shadow p-6">
      <h2 className="font-bold mb-4 text-lg">Simulasi Perhitungan Nilai Akhir</h2>
      <div className="text-sm space-y-2">
        {komponenList.map((komp, i) => (
          <div key={komp} className="flex items-center gap-2">
            <label className="w-20">{komp} :</label>
            <input
              type="number"
              min={0}
              max={100}
              value={sampleNilai[i]}
              onChange={(e) => handleSampleChange(i, +e.target.value)}
              className="border px-2 py-1 rounded w-20 text-sm"
            />
            <span className="text-gray-600 text-sm">
              × {persentase[i]}% ={" "}
              <strong>
                {((persentase[i] / 100) * sampleNilai[i]).toFixed(1)}
              </strong>
            </span>
          </div>
        ))}
        <div className="mt-4 font-bold text-[#E09900]">
          Total Nilai Akhir: {totalSimulasi.toFixed(1)}
        </div>
      </div>
    </div>
  );
}
