"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { mockClasses } from "@/lib/mockClasses";
import { mockMahasiswaPerKelas, Mahasiswa } from "@/lib/mockMahasiswa";
import { Toaster, toast } from "react-hot-toast";

import BulkInput from "./components/BulkInput";
import InputTable from "./components/InputTable";
import FilterSelect from "./components/FilterSelect";

export default function NilaiPage() {
  const { id } = useParams();
  const kelas = mockClasses.find((k) => k.id === id);

  const [komponenList, setKomponenList] = useState<string[]>([]);
  const [persentase, setPersentase] = useState<number[]>([]);
  const [mahasiswa, setMahasiswa] = useState<Mahasiswa[]>([]);
  const [kontribusi, setKontribusi] = useState<boolean[][]>([]);
  const [filterKomponen, setFilterKomponen] = useState("Semua Komponen");

  const babList = ["Bab 1", "Bab 2", "Bab 3", "Bab 4", "Bab 5"];

  useEffect(() => {
    const initialMahasiswa = mockMahasiswaPerKelas[id as string] || [];
    const saved = localStorage.getItem(`nilai-${id}`);
    if (saved) {
      try {
        setMahasiswa(JSON.parse(saved));
      } catch {
        setMahasiswa(initialMahasiswa);
      }
    } else {
      setMahasiswa(initialMahasiswa);
    }

    const savedPersen = localStorage.getItem(`persentase-${id}`);
    if (savedPersen) {
      const parsed = JSON.parse(savedPersen);
      const aktif = ["Tugas", "UTS", "UAS", "Proyek", "Kuis"].filter((_, i) => parsed[i] > 0);
      setPersentase(parsed);
      setKomponenList(aktif);
    }

    const savedKontribusi = localStorage.getItem(`kontribusi-${id}`);
    if (savedKontribusi) setKontribusi(JSON.parse(savedKontribusi));
  }, [id]);

  useEffect(() => {
    localStorage.setItem(`nilai-${id}`, JSON.stringify(mahasiswa));
  }, [mahasiswa, id]);

  return (
    <main className="text-[#0C3C82] font-sans min-h-screen">
      {/* Navbar */}
      <Navbar />

      <Toaster position="top-right" />
      <section className="py-10 px-6 max-w-screen-xl mx-auto">
        <div className="absolute inset-0 -z-10 bg-[#EDF3FB]" style={{ clipPath: "polygon(0 20%, 100% -12%, 100% 78%, 0 100%)" }} />
        
        <div className="flex justify-end mb-4 text-sm text-gray-500 font-semibold">
          <a href={`/konfigurasi/${id}`} className="hover:underline hover:text-[#0E4584] text-[#114D91]">Konfigurasi</a> / Nilai
        </div>

        <h1 className="text-3xl font-bold mb-2">Input Nilai - {kelas?.name || `Kelas ${id}`}</h1>
        <p className="text-gray-600 mb-6">Masukkan nilai komponen untuk setiap mahasiswa.</p>

        {/* Bulk Input Nilai */}
        <BulkInput
          babList={babList}
          komponenList={komponenList}
          kontribusi={kontribusi}
          mahasiswa={mahasiswa}
          setMahasiswa={setMahasiswa}
        />

        {komponenList.length > 0 ? (
          <div className="overflow-x-auto bg-white p-6 rounded-lg shadow-md">
            <>
              {/* Filter Komponen */}
              <FilterSelect
                komponenList={komponenList}
                filterKomponen={filterKomponen}
                setFilterKomponen={setFilterKomponen}
              />

              {/* Input Nilai */}
              <InputTable
                mahasiswa={mahasiswa}
                setMahasiswa={setMahasiswa}
                komponenList={komponenList}
                kontribusi={kontribusi}
                persentase={persentase}
                babList={babList}
                filterKomponen={filterKomponen}
              />
            </>
          </div>
        ) : (
          <p className="text-red-500">Belum ada konfigurasi komponen untuk kelas ini.</p>
        )}
      </section>

      {/* Footer */}
      <footer className="text-center text-sm text-gray-500 py-4 border-t mt-10">
        Copyright © 2025 | Tsaniya Zhahiran Septiani
      </footer>
    </main>
  );
}
