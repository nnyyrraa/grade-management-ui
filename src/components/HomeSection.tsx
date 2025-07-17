"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function HomeSection() {
  return (
    <section className="flex flex-col-reverse grid md:grid-cols-2 items-center py-12 -mt-[65px] pt-24 sm:pt-28 md:pt-32 lg:pt-20 gap-10 px-4 sm:px-6">
      <div className="w-full">
        <motion.div
            className="space-y-3 ml-8"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.7 }}
        >
          <p className="text-[#E09900] font-semibold sm:text-lg md:text-base">SISTEM INPUT NILAI OBE</p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold">Halo, Dosen!</h1>
          <p className="text-gray-600 text-sm sm:text-base md:text-sm">
            Lorem ipsum dolor sit amet, possit eligendi vituperata eos et, no assum scripta scaevola mel, has ut integre deleniti incorrupte.
          </p>
          <Link
            href="#daftar-kelas"
            className="inline-block bg-[#E5E5E5] px-5 py-2 text-sm sm:text-base md:text-sm rounded font-semibold mt-6 transition-all duration-300 ease-in-out hover:bg-[#114D91] hover:text-white hover:shadow-lg hover:shadow-black/30 hover:-translate-y-0.5"
          >
            Kelola Nilai
          </Link>
        </motion.div>
      </div>

      <motion.img
        src="/illustration.png"
        alt="Ilustrasi"
        className="w-full max-w-md mx-auto md:max-w-lg"
        initial={{ opacity: 0, x: 50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: false, amount: 0.3 }}
        transition={{ duration: 0.7 }}
      />
    </section>
  );
}
