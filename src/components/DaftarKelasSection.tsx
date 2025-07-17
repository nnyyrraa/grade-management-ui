"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import FilterSidebar from "@/components/FilterSidebar";
import ClassCard from "@/components/ClassCard";
import { mockClasses } from "@/lib/mockClasses";
import SearchIcon from "@mui/icons-material/Search";

export default function DaftarKelasSection() {
  const [filter, setFilter] = useState("Semua Kelas");
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(searchTerm);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  const getKonfigurasiStatus = (classId: string) => {
    if (typeof window !== "undefined") {
        const status = localStorage.getItem(`status-konfigurasi-${classId}`);
        return status === '"sudah"' ? "Sudah Konfigurasi" : "Belum Konfigurasi";
    }
    return "Belum Konfigurasi";
  };

  const [configStatusMap, setConfigStatusMap] = useState<Record<string, string>>({});
  
  const filtered = mockClasses.filter((kelas) => {
    const status = configStatusMap[kelas.id] || "Belum Konfigurasi";

    const matchFilter =
      filter === "Semua Kelas" ||
      (filter === "Sudah Konfigurasi" && status === "Sudah Konfigurasi") ||
      (filter === "Belum Konfigurasi" && status === "Belum Konfigurasi");

    const matchSearch = kelas.name.toLowerCase().includes(debouncedSearch.toLowerCase());

    return matchFilter && matchSearch;
  });

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginatedData = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  useEffect(() => {
    const statusMap: Record<string, string> = {};
    mockClasses.forEach((kelas) => {
      const status = localStorage.getItem(`status-konfigurasi-${kelas.id}`);
      statusMap[kelas.id] = status === '"sudah"' ? "Sudah Konfigurasi" : "Belum Konfigurasi";
    });
    setConfigStatusMap(statusMap);
  }, []);

  return (
    <section id="daftar-kelas" className="py-10 scroll-mt-28">
      <div className="max-w-screen-xl mx-auto px-6">
        {/* Judul */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-center text-2xl font-bold">DAFTAR KELAS</h2>
          <p className="text-center text-gray-500 mb-8">
            Pilih kelas untuk mengelola nilai mahasiswa.
          </p>
        </motion.div>

        {/* Search Box */}
        <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.7 }}
            className="mb-6 relative w-full md:w-1/2"
        >
          <SearchIcon className="absolute left-1 top-2.5 text-[#114D91]-500" />
          <input
            type="text"
            placeholder="Cari kelas..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-50%ll pl-10 pr-4 py-2 border-b-2 border-gray-300 text-[#DEDEDE] focus:outline-none focus:border-[#114D91] focus:text-[#114D91] bg-transparent text-sm"
          />
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filter Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.7 }}
            className="lg:w-1/4 w-full order-2 lg:order-1"
          >
            <FilterSidebar selected={filter} onChange={(val) => {
              setFilter(val);
              setCurrentPage(1);
            }} />
          </motion.div>

          {/* Daftar Kelas Cards */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.8 }}
            className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 w-full order-1 lg:order-2"
          >
            {paginatedData.length > 0 ? (
                paginatedData.map((kelas) => (
                  <ClassCard
                    key={kelas.id}
                    {...kelas}
                    isConfigured={configStatusMap[kelas.id] === "Sudah Konfigurasi"}
                  />
                ))
            ) : (
                <p className="text-center text-gray-500 col-span-full">Kelas tidak ditemukan.</p>
            )}
          </motion.div>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-10 gap-2">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-4 py-1 rounded border text-sm font-medium
                  ${currentPage === i + 1 ? "bg-[#114D91] text-white" : "bg-white text-[#114D91] border-[#114D91]"}
                `}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}