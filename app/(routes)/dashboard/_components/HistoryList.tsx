"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import React, { useState } from "react";
import DoctorsAgentList from "./DoctorsAgentList";
import AddSessionDialog from "./AddSessionDialog";

const HistoryList = () => {
  const [historyList, setHistoryList] = useState([]);
  return (
    <div>
      {historyList.length === 0 ? (
        <div className="flex items-center flex-col justify-center p-7 border border-dashed rounded-2xl mt-5">
          <Image
            src={"/medical-assistance.png"}
            alt={"empty"}
            width={150}
            height={150}
          />
          <h2 className="font-bold text-xl mt-2">No Recent Consultations</h2>
          <p>It looks like you haven't consulted with any doctor yet.</p>
          <AddSessionDialog />
        </div>
      ) : (
        <div>List</div>
      )}
    </div>
  );
};

export default HistoryList;
