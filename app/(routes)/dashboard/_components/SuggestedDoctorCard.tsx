"use client";

import { Button } from "@/components/ui/button";
import { IconArrowRight } from "@tabler/icons-react";
import Image from "next/image";
import React from "react";
import { DoctorAgent } from "./DoctorAgentCard";

type props = {
  doctorAgent: DoctorAgent;
  setSelectedDoctor: any;
};

const SuggestedDoctorCard = ({ doctorAgent, setSelectedDoctor }: props) => {
  return (
    <div
      className="flex flex-col items-center border rounded-2xl shadow p-5 hover:border-blue-500 cursor:pointer"
      onClick={() => setSelectedDoctor(doctorAgent)}
    >
      <Image
        src={doctorAgent.image}
        alt={doctorAgent.specialist}
        width={70}
        height={70}
        className="w-[50px] h-[50px] object-cover rounded-4xl cursor-pointer transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-lg"
      />

      <h2 className="font-bold text-sm text-center mt-1">
        {doctorAgent.specialist}
      </h2>
      <p className="line-clamp-2 text-sm text-center text-gray-500">
        {doctorAgent.description}
      </p>
      {/* <Button className="w-full mt-2">
        Start Consultation <IconArrowRight />
      </Button> */}
    </div>
  );
};

export default SuggestedDoctorCard;
