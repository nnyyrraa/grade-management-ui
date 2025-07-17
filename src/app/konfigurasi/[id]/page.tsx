"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { useParams } from "next/navigation";
import { mockClasses } from "@/lib/mockClasses";
import KonfigurasiTable from "./components/KonfigurasiTable";
import KontribusiBabTable from "./components/KontribusiBabTable";
import SimulasiNilai from "./components/SimulasiNilai";
import toast, { Toaster } from "react-hot-toast";

const komponenList = ["Tugas", "UTS", "UAS", "Proyek", "Kuis"];
const babList = ["Bab 1", "Bab 2", "Bab 3", "Bab 4", "Bab 5"];

export default function KonfigurasiNilaiPage() {
  const { id } = useParams();
  const kelas = mockClasses.find((k) => k.id === id);

  const [persentase, setPersentase] = useState<number[]>(Array(komponenList.length).fill(0));
  const [kontribusi, setKontribusi] = useState<boolean[][]>(
    Array(komponenList.length).fill(Array(babList.length).fill(false))
  );
  const totalBobot = persentase.reduce((a, b) => a + b, 0);
  const [lastToast, setLastToast] = useState("");
  const [hasMounted, setHasMounted] = useState(false);
  const [isSaved, setIsSaved] = useState(true);

  // Ambil dari localStorage setelah mounted
  useEffect(() => {
    // Ambil data persentase
    const saved = localStorage.getItem(`persentase-${id}`);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setPersentase(parsed);
        }
      } catch (e) {
        console.error("Gagal parse data konfigurasi:", e);
      }
    }

    // Ambil data kontribusi
    const savedKontribusi = localStorage.getItem(`kontribusi-${id}`);
    if (savedKontribusi) {
      try {
        const parsed = JSON.parse(savedKontribusi);
        if (Array.isArray(parsed)) {
          setKontribusi(parsed);
        }
      } catch (e) {
        console.error("Gagal parse kontribusi:", e);
      }
    }

    setHasMounted(true);
  }, [id]);

  // Notifikasi Bobot Persentase
  useEffect(() => {
    if (!hasMounted) return;

    if (totalBobot > 100 && lastToast !== "over") {
      toast.error("Total bobot tidak boleh lebih dari 100%");
      setLastToast("over");
    } else if (totalBobot < 100 && lastToast !== "under") {
      toast("Total bobot belum mencapai 100%", {
        icon: "⚠️",
        style: { background: "#fef3c7", color: "#92400e" },
      });
      setLastToast("under");
    } else if (totalBobot === 100 && lastToast !== "ok") {
      toast.success("Total bobot pas 100%");
      setLastToast("ok");
    }
  }, [totalBobot, hasMounted, lastToast]);

  const handleSave = () => {
    localStorage.setItem(`persentase-${id}`, JSON.stringify(persentase));
    localStorage.setItem(`status-konfigurasi-${id}`, JSON.stringify("sudah"));
    setIsSaved(true);
    toast.success("Konfigurasi berhasil disimpan ✅");
  };

  // Track perubahan persentase untuk warning sebelum keluar
  useEffect(() => {
<<<<<<< HEAD
=======
    const saved = localStorage.getItem(`persentase-${id}`);
>>>>>>> 51c7e691aac5eb9563fbe4dd34d45ea464041069

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!isSaved) {
        e.preventDefault();
        e.returnValue = "Konfigurasi nilai belum disimpan.";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [isSaved]);

  // Reset Persentase
  const handleReset = () => {
    const defaultValue = Array(komponenList.length).fill(0);
    setPersentase(defaultValue);
    localStorage.removeItem(`persentase-${id}`);
    localStorage.removeItem(`status-konfigurasi-${id}`);
    toast("Konfigurasi berhasil di-reset", {
      icon: "♻️",
      style: { background: "#eef2ff", color: "#1e3a8a" },
    });
  };

  // Kontribusi Bab
  const handleCheckboxChange = (i: number, j: number) => {
    const newMatrix = kontribusi.map((row, rowIndex) =>
      row.map((val, colIndex) =>
        rowIndex === i && colIndex === j ? !val : val
      )
    );
    setKontribusi(newMatrix);

    // Simpan ke localStorage langsung
    localStorage.setItem(`kontribusi-${id}`, JSON.stringify(newMatrix));
  };

  const hasAnyCheckboxChecked = kontribusi.some((row) => row.some((val) => val === true));

  return (
    <main className="text-[#0C3C82] font-sans min-h-screen">
      {/* Navbar */}
      <Navbar />

      <Toaster position="top-right" />
      
      <section className="py-10 px-6 max-w-screen-xl mx-auto">
        {/* Background Miring */}
        <div className="absolute inset-0 -z-10 bg-[#EDF3FB]" style={{ clipPath: "polygon(0 20%, 100% -12%, 100% 78%, 0 100%)" }} />
        
        {/* Navigasi Breadcrumb */}
        <div className="flex justify-end mb-4">
          <div className="text-sm text-gray-500 font-semibold">
            <a href="/" className="hover:underline hover:text-[#0E4584] text-[#114D91]">Dashboard</a> / Konfigurasi
          </div>
        </div>

        <h1 className="text-3xl font-bold mb-2">Konfigurasi Nilai - Kelas {kelas?.name || id}</h1>
        <p className="text-gray-600 mb-6">
          Geser slider untuk mengatur bobot (%) masing-masing komponen. Total bobot harus 100%.
        </p>

        {/* Konfigurasi Nilai */}
        <KonfigurasiTable
          persentase={persentase}
          onSliderChange={(i, val) => {
            const newValues = [...persentase];
            newValues[i] = val;
            setPersentase(newValues);
            setIsSaved(false);
          }}
          totalBobot={totalBobot}
          onSave={handleSave}
          onReset={handleReset}
        />

        {/* Kontribusi Bab */}
        <KontribusiBabTable
          kontribusi={kontribusi}
          onCheckboxChange={handleCheckboxChange}
        />

        {/* Simulasi Nilai */}
        <SimulasiNilai persentase={persentase} />

        {/* Button Input Nilai */}
        <div className="flex justify-end mt-10">
          <a
            href={`/nilai/${id}`}
            className={`px-6 py-3 rounded font-semibold text-sm transition ${
              totalBobot === 100 && hasAnyCheckboxChecked
                ? "bg-[#114D91] text-white hover:shadow-md hover:-translate-y-0.5"
                : "bg-gray-300 text-gray-600 cursor-not-allowed"
            }`}
            onClick={(e) => {
              if (totalBobot !== 100) {
                e.preventDefault();
                toast.error("Selesaikan konfigurasi bobot nilai terlebih dahulu.");
              } else if (!hasAnyCheckboxChecked) {
                e.preventDefault();
                toast.error("Checklist minimal satu kontribusi bab sebelum lanjut.");
              }
            }}
          >
            Mulai Input Nilai
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center text-sm text-gray-500 py-4 border-t mt-10">
        Copyright © 2025 | Tsaniya Zhahiran Septiani
      </footer>
    </main>
  );
}
