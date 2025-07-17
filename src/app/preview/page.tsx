"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { mockClasses } from "@/lib/mockClasses";
import { mockMahasiswaPerKelas } from "@/lib/mockMahasiswa";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from "chart.js";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export default function PreviewPage() {
    const [selectedClassId, setSelectedClassId] = useState<string>("1");
    const kelas = mockClasses.find(k => k.id === selectedClassId);
    const [mahasiswa, setMahasiswa] = useState(() => mockMahasiswaPerKelas[selectedClassId] || []);
    const [nilaiDistribusi, setNilaiDistribusi] = useState<number[]>([]);

    const [persentase, setPersentase] = useState<number[]>([]);
    const [kontribusi, setKontribusi] = useState<boolean[][]>([]);

    const komponenDefault = ["Tugas", "UTS", "UAS", "Proyek", "Kuis"];
    const babList = ["Bab 1", "Bab 2", "Bab 3", "Bab 4", "Bab 5"];

    const hitungTotalPreview = (nilai: Record<string, number>): string => {
        return komponenDefault.reduce((total, komponen, index) => {
            const bobot = persentase[index] || 0;
            const nilaiBab: number[] = babList.reduce((arr, bab, j) => {
            if (kontribusi[index]?.[j]) {
                const val = nilai[`${komponen}-${bab}`];
                if (typeof val === "number") arr.push(val);
            }
            return arr;
            }, [] as number[]);

            const avg = nilaiBab.length > 0
            ? nilaiBab.reduce((a, b) => a + b, 0) / nilaiBab.length
            : 0;

            return total + (avg * bobot) / 100;
        }, 0).toFixed(2);
    };

    const exportToExcelAdvanced = () => {
        const headerRow1 = ["Nama Mahasiswa"];
        const headerRow2 = [""];
        const rows: any[][] = [];

        // Siapkan struktur header
        komponenDefault.forEach((komponen, indexKomponen) => {
            const jumlahBab = kontribusi[indexKomponen]?.filter(Boolean).length || 0;
            if (jumlahBab > 0) {
            headerRow1.push(...Array(jumlahBab).fill(komponen));
            headerRow2.push(
                ...babList
                .map((bIndex) =>
                    kontribusi[indexKomponen]?.[bIndex] ? `Bab ${bIndex + 1}` : null
                )
                .filter(Boolean)
            );
            }
        });
        headerRow1.push("Nilai Akhir");
        headerRow2.push("");

        // Siapkan isi baris mahasiswa
        mahasiswa.forEach((mhs) => {
            const row = [mhs.nama];

            komponenDefault.forEach((komponen, indexKomponen) => {
            babList.forEach((bab, bIndex) => {
                if (kontribusi[indexKomponen]?.[bIndex]) {
                const key = `${komponen}-${bab}`;
                row.push(mhs.nilai[key] ?? "");
                }
            });
            });

            row.push(hitungTotalPreview(mhs.nilai));
            rows.push(row);
        });

        // Gabungkan header + isi
        const dataToExport = [headerRow1, headerRow2, ...rows];
        const worksheet = XLSX.utils.aoa_to_sheet(dataToExport);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Nilai");

        const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
        const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
        const fileName = `DataMahasiswa_${kelas?.name?.replace(/\s+/g, "") || "Kelas"}.xlsx`;
        saveAs(blob, fileName);
    };

    const exportToCSV = () => {
        const data = mahasiswa.map((mhs) => {
            const row: Record<string, any> = { Nama: mhs.nama };
            komponenDefault.forEach((komponen) => {
            babList.forEach((bab) => {
                const key = `${komponen}-${bab}`;
                if (mhs.nilai.hasOwnProperty(key)) {
                row[key] = mhs.nilai[key];
                }
            });
            });
            row["Nilai Akhir"] = hitungTotalPreview(mhs.nilai);
            return row;
        });

        const worksheet = XLSX.utils.json_to_sheet(data);
        const csv = XLSX.utils.sheet_to_csv(worksheet);
        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        const fileName = `DataMahasiswa_${kelas?.name?.replace(/\s+/g, "") || "Kelas"}.csv`;
        saveAs(blob, fileName);
    };

    useEffect(() => {
        const data = mockMahasiswaPerKelas[selectedClassId] || [];
        setMahasiswa(data);

        const saved = localStorage.getItem(`nilai-${selectedClassId}`);
        if (saved) {
        try {
            const parsed = JSON.parse(saved);
            setMahasiswa(parsed);
        } catch {
            setMahasiswa(data);
        }
        }

        const savedPersen = localStorage.getItem(`persentase-${selectedClassId}`);
        if (savedPersen) {
            try {
            const parsed = JSON.parse(savedPersen);
            setPersentase(parsed);
            } catch {}
        }

        const savedKontribusi = localStorage.getItem(`kontribusi-${selectedClassId}`);
        if (savedKontribusi) {
            try {
            const parsed = JSON.parse(savedKontribusi);
            setKontribusi(parsed);
            } catch {}
        }
    }, [selectedClassId]);

    useEffect(() => {
        const totalNilai = mahasiswa.map((m) =>
            parseFloat(hitungTotalPreview(m.nilai))
        );
        setNilaiDistribusi(totalNilai);
    }, [mahasiswa, persentase, kontribusi]);

    const chartData = {
        labels: mahasiswa.map((m) => m.nama),
        datasets: [
        {
            label: "Nilai Akhir",
            data: nilaiDistribusi,
            backgroundColor: "#0C3C82",
        },
        ],
    };

    return (
        <main className="text-[#0C3C82] font-sans min-h-screen">
            {/* Navbar */}
            <Navbar />

            <section className="py-10 px-6 max-w-screen-xl mx-auto">
                {/* Background Miring */}
                <div className="absolute inset-0 -z-10 bg-[#EDF3FB]" style={{ clipPath: "polygon(0 20%, 100% -12%, 100% 78%, 0 100%)" }} />

                {/* Breadcrumb */}
                <div className="flex justify-end mb-4">
                <div className="text-sm text-gray-500 font-semibold">
                    <a href={`/nilai/${selectedClassId}`} className="hover:underline hover:text-[#0E4584] text-[#114D91]">
                    Nilai
                    </a>{" "}
                    / Preview
                </div>
                </div>

                <h1 className="text-3xl font-bold mb-2">Preview Nilai - {kelas?.name}</h1>
                <p className="text-gray-600 mb-6">Lihat ringkasan nilai akhir dan distribusi kelas secara real-time.</p>

                {/* Dropdown */}
                <div className="mb-6">
                    <label className="block mb-2 font-medium text-[#0C3C82]">Pilih Kelas:</label>
                    <select
                        className="border border-gray-300 px-3 py-2 rounded text-[#0C3C82] bg-white"
                        value={selectedClassId}
                        onChange={(e) => setSelectedClassId(e.target.value)}
                    >
                        {mockClasses.map((kelas) => (
                        <option key={kelas.id} value={kelas.id}>
                            {kelas.name}
                        </option>
                        ))}
                    </select>
                </div>

                {/* Export Excel / CSV */}
                <div className="flex flex-wrap gap-4 mb-6 justify-end">
                    <button
                        onClick={exportToExcelAdvanced}
                        className="bg-[#0C3C82] hover:bg-[#0E4584] text-white px-4 py-2 rounded shadow hover:shadow-lg hover:shadow-black/30 ease-in-out hover:-translate-y-0.5"
                    >
                        Export to Excel
                    </button>
                    <button
                        onClick={exportToCSV}
                        className="bg-[#0C3C82] hover:bg-[#0E4584] text-white px-4 py-2 rounded shadow hover:shadow-lg hover:shadow-black/30 ease-in-out hover:-translate-y-0.5"
                    >
                        Export to CSV
                    </button>
                </div>

                {/* Chart */}
                <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                    <h2 className="text-xl font-semibold mb-4">Distribusi Nilai Akhir</h2>
                    <div className="max-w-3xl mx-auto">
                        <Bar data={chartData} />
                    </div>
                </div>

                {/* Breakdown Nilai */}
                <div className="overflow-x-auto bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold text-[#0C3C82] pt-2 mb-4">Breakdown Nilai</h2>
                    <table className="table-auto w-full border border-gray-300 text-sm">
                        <thead className="bg-[#114D91] text-white">
                        <tr>
                            <th rowSpan={2} className="p-2 text-left align-middle min-w-[160px]">Nama Mahasiswa</th>
                            {["Tugas", "UTS", "UAS", "Proyek", "Kuis"].map((komponen) => {
                            const jumlahBab = Array.from({ length: 5 }).filter((_, i) =>
                                Object.keys(mahasiswa[0]?.nilai || {}).includes(`${komponen}-Bab ${i + 1}`)
                            ).length;
                            return jumlahBab > 0 ? (
                                <th key={komponen} colSpan={jumlahBab} className="p-2 text-left">{komponen}</th>
                            ) : null;
                            })}
                            <th rowSpan={2} className="p-2 text-left align-middle min-w-[120px]">Rata-rata</th>
                        </tr>
                        <tr>
                            {["Tugas", "UTS", "UAS", "Proyek", "Kuis"].flatMap((komponen) =>
                            Array.from({ length: 5 }).map((_, i) => {
                                const key = `${komponen}-Bab ${i + 1}`;
                                return Object.keys(mahasiswa[0]?.nilai || {}).includes(key) ? (
                                <th key={key} className="p-2 text-left">Bab {i + 1}</th>
                                ) : null;
                            })
                            )}
                        </tr>
                        </thead>
                        <tbody>
                        {mahasiswa.map((mhs, i) => {
                            const nilaiPerKomponen: Record<string, number[]> = {};

                            Object.entries(mhs.nilai || {}).forEach(([key, val]) => {
                            const [komponen, bab] = key.split("-");
                            if (!nilaiPerKomponen[komponen]) nilaiPerKomponen[komponen] = [];
                            nilaiPerKomponen[komponen].push(typeof val === "number" ? val : 0);
                            });

                            const rataRata = hitungTotalPreview(mhs.nilai);

                            return (
                            <tr key={i} className="border-t border-gray-300">
                                <td className="p-2 min-w-[160px]">{mhs.nama}</td>
                                {["Tugas", "UTS", "UAS", "Proyek", "Kuis"].flatMap((komponen) =>
                                Array.from({ length: 5 }).map((_, j) => {
                                    const key = `${komponen}-Bab ${j + 1}`;
                                    return Object.keys(mhs.nilai || {}).includes(key) ? (
                                    <td key={key} className="p-2 text-gray-700">{mhs.nilai[key]}</td>
                                    ) : null;
                                })
                                )}
                                <td className="p-2 font-semibold text-right min-w-[120px]">{rataRata}</td>
                            </tr>
                            );
                        })}
                        </tbody>
                    </table>
                </div>
            </section>

            {/* Footer */}
            <footer className="text-center text-sm text-gray-500 py-4 border-t mt-10">
                Copyright © 2025 | Tsaniya Zhahiran Septiani
            </footer>
        </main>
    );
}
