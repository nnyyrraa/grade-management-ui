"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";

export default function Navbar() {
    const pathname = usePathname();
    const [scrolled, setScrolled] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    const navItems = [
        { label: "dashboard", href: "/" },
        { label: "preview", href: "/preview" },
    ];

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 10);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <motion.nav
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className={`sticky top-0 z-50 -mt-3 w-full transition-all duration-300 ${
                scrolled ? "bg-white shadow-md" : "bg-transparent" 
            }`}
        >
            <div className="flex flex-wrap md:flex-nowrap items-center justify-between max-w-screen-xl mx-auto px-4 sm:px-6 py-4 gap-4">
                {/* Logo */}
                <div className="flex items-center gap-3 font-semibold">
                    <img src="/logo-udinus.png" alt="Logo" className="w-50" />
                </div>

                {/* Hamburger Icon for Mobile */}
                <div className="md:hidden">
                    <button onClick={() => setIsOpen(!isOpen)}>
                        {isOpen ? (
                        <CloseIcon className="text-[#114D91]" />
                        ) : (
                        <MenuIcon className="text-[#114D91]" />
                        )}
                    </button>
                </div>

                {/* Menu */}
                <ul className="hidden md:flex flex gap-4 md:gap-6 font-medium text-sm md:text-base">
                    {navItems.map((item) => (
                        <li key={item.href}>
                            <Link
                                href={item.href}
                                className={`px-4 py-1.5 rounded-full transition-all duration-200 cursor-pointer ${
                                    pathname === item.href
                                    ? "bg-[#114D91] text-white shadow-md shadow-black/30"
                                    : "hover:text-white hover:bg-[#114D91] hover:shadow-md hover:shadow-black/30"
                                }`}
                            >
                                {item.label}
                            </Link>
                        </li>
                    ))}
                </ul>

                {/* Icon Profile */}
                <div className="hidden md:flex">
                    <AccountCircleIcon className="text-[#114D91]-700" fontSize="medium" />
                </div>
            </div>

            {/* Dropdown Menu Mobile */}
            {isOpen && (
                <div className="md:hidden px-4 pb-4">
                    <ul className="flex flex-col gap-2 bg-white shadow rounded-md p-4">
                        {navItems.map((item) => (
                            <li key={item.href}>
                                <Link
                                    href={item.href}
                                    className={`block px-4 py-2 rounded text-sm font-medium ${
                                        pathname === item.href
                                        ? "bg-[#114D91] text-white"
                                        : "hover:bg-[#114D91]/10"
                                    }`}
                                    onClick={() => setIsOpen(false)}
                                >
                                    {item.label}
                                </Link>
                            </li>
                        ))}
                        <hr />
                        <div className="flex items-center gap-2 px-4 text-[#114D91]">
                            <AccountCircleIcon fontSize="small" />
                            <span className="text-sm">Profil</span>
                        </div>
                    </ul>
                </div>
            )}
        </motion.nav>
    );
}
