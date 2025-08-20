import { Stethoscope } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const menuOptions = [
  {
    id: 1,
    name: "Home",
    path: "/dashboard",
  },
  {
    id: 2,
    name: "History",
    path: "/dashboard/history",
  },
  {
    id: 3,
    name: "Pricing",
    path: "/dashboard/pricing",
  },
  {
    id: 4,
    name: "Profile",
    path: "/profile",
  },
];

const AppHeader = () => {
  return (
    <div className="flex items-center justify-between p-4 shadow px-10 md:px-20 lg:px-40">
      <Link
        href="/dashboard"
        className="flex items-center gap-3 cursor-pointer"
      >
        {/* Medical Icon */}
        <Stethoscope className="w-8 h-8 text-gray-700" /> {/* Icon styling */}
        {/* Logo Text */}
        <span className="text-2xl font-bold transition-all">
          <span className="text-green-700">Health</span>
          <span className="text-gray-700">Talk</span>{" "}
          <span className="text-gray-700">AI</span>
        </span>
      </Link>
      <div className="hidden md:flex gap-12 items-center">
        {menuOptions.map((option) => (
          <Link key={option.id} href={option.path}>
            <h2 className="hover:font-bold cursor-pointer transition-all">
              {option.name}
            </h2>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default AppHeader;
