"use client";

import Navbar from "@/components/Navbar";
import HomeSection from "@/components/HomeSection";
import DaftarKelasSection from "@/components/DaftarKelasSection";


export default function DashboardPage() {
  return (
    <main className="text-[#0C3C82] min-h-screen font-sans">
      {/* Navbar */}
      <Navbar />
      
      <section className="relative isolate">
        {/* Background Miring */}
        <div className="absolute inset-0 -z-10 bg-[#EDF3FB]" style={{ clipPath: "polygon(0 -12%, 100% 20%, 100% 100%, 0% 78%)" }} />

        {/* Home Section */}
        <HomeSection />
      </section>

      {/* Daftar Kelas */}
      <DaftarKelasSection />

      {/* Footer */}
      <footer className="text-center text-sm text-gray-500 py-4 border-t mt-10">
        Copyright © 2025 | Tsaniya Zhahiran Septiani
      </footer>
    </main>
  );
}
