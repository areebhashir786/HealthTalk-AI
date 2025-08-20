"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import AddSessionDialog from "./AddSessionDialog";
import axios from "axios";
import HistoryTable from "./HistoryTable";

const HistoryList = () => {
  const [historyList, setHistoryList] = useState<any>([]); // Added type for state
  const [loading, setLoading] = useState<boolean>(true); // Added loading state
  const [error, setError] = useState<string | null>(null); // Added error state

  const getHistoryList = async () => {
    try {
      setLoading(true);
      const res: any = await axios.get("/api/session-chat?sessionId=all");
      setHistoryList(res.data);
      setError(null); // Clear any previous errors
    } catch (err) {
      console.error("Error fetching history list:", err);
      setError("Failed to fetch history. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getHistoryList();
  }, []);

  return (
    <div>
      {loading ? (
        <div className="flex items-center justify-center p-7">
          <h2 className="font-bold text-xl">Loading...</h2>
        </div>
      ) : error ? (
        <div className="flex items-center flex-col justify-center p-7 border border-dashed rounded-2xl mt-5">
          <Image src={"/error.png"} alt={"error"} width={150} height={150} />
          <h2 className="font-bold text-xl mt-2">Error</h2>
          <p>{error}</p>
          <Button onClick={getHistoryList}>Retry</Button>
        </div>
      ) : historyList.length === 0 ? (
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
        <div>
          <HistoryTable historyList={historyList} />
        </div>
      )}
    </div>
  );
};

export default HistoryList;
