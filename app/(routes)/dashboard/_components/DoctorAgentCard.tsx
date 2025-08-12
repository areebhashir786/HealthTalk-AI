"use client";

import { Button } from "@/components/ui/button";
import { IconArrowRight } from "@tabler/icons-react";
import Image from "next/image";
import React from "react";

export type DoctorAgent = {
  id: number;
  specialist: string;
  description: string;
  image: string;
  agentPrompt: string;
};

type props = {
  doctorAgent: DoctorAgent;
};

const DoctorAgentCard = ({ doctorAgent }: props) => {
  return (
    <div>
      <Image
        src={doctorAgent.image}
        alt={doctorAgent.specialist}
        width={200}
        height={300}
        className="w-full h-[250px] object-cover rounded-xl cursor-pointer transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-lg"
      />

      <h2 className="font-bold mt-1">{doctorAgent.specialist}</h2>
      <p className="line-clamp-2 text-sm text-gray-500">
        {doctorAgent.description}
      </p>
      <Button className="w-full mt-2">
        Start Consultation <IconArrowRight />
      </Button>
    </div>
  );
};

export default DoctorAgentCard;
