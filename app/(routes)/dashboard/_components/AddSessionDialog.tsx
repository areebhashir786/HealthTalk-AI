"use client";

import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { DialogClose } from "@radix-ui/react-dialog";
import { ArrowRight, Loader2 } from "lucide-react";
import axios from "axios";
import { DoctorAgent } from "./DoctorAgentCard";
import SuggestedDoctorCard from "./SuggestedDoctorCard";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";

const AddSessionDialog = () => {
  const { has } = useAuth();
  const router = useRouter();
  const [note, setNote] = useState<string>();
  const [loading, setLoading] = useState(false);
  const [historyList, setHistoryList] = useState<any>([]);
  const [suggestedDoctors, setSuggestedDoctors] = useState<any>();
  const [selectedDoctor, setSelectedDoctor] = useState<DoctorAgent>();
  // @ts-ignore
  const paidUser = has && has({ plan: "pro" });

  const getHistoryList = async () => {
    try {
      setLoading(true);
      const res: any = await axios.get("/api/session-chat?sessionId=all");
      setHistoryList(res.data);
    } catch (err) {
      console.error("Error fetching history list:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getHistoryList();
  }, []);

  const onClickNext = async () => {
    setLoading(true);
    const res: any = await axios.post("/api/suggest-doctors", {
      notes: note,
    });

    // res.data.content is a JSON string, so parse it
    setSuggestedDoctors(res.data);
    setLoading(false);
  };

  const onStartConsultation = async () => {
    // Save all info to Database
    setLoading(true);
    const result = await axios.post("/api/session-chat", {
      notes: note,
      selectedDoctor: selectedDoctor,
    });
    setLoading(false);

    if (result.data?.sessionId) {
      router.push(`dashboard/medical-agent/${result.data?.sessionId}`);
    }
  };

  return (
    <Dialog>
      <DialogTrigger>
        <Button
          className="mt-3"
          disabled={!paidUser && historyList.length >= 1}
        >
          + Start a Consultation
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Basic Details</DialogTitle>
          <DialogDescription asChild>
            {!suggestedDoctors ? (
              <div>
                <h2>Add Symptoms or any other Details</h2>
                <Textarea
                  placeholder="Add Details here..."
                  className="mt-2 h-[200px]"
                  onChange={(e) => setNote(e.target.value)}
                />
              </div>
            ) : (
              <div>
                <h2>Select a Doctor</h2>
                <div className="grid grid-cols-2 gap-5">
                  {suggestedDoctors &&
                    suggestedDoctors.map((doctor: any, index: any) => (
                      <SuggestedDoctorCard
                        doctorAgent={doctor}
                        key={index}
                        setSelectedDoctor={() => setSelectedDoctor(doctor)}
                        // @ts-ignore
                        selectedDoctor={selectedDoctor}
                      />
                    ))}
                </div>
              </div>
            )}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose>
            <Button variant={"outline"}>Cancel</Button>
          </DialogClose>
          {!suggestedDoctors ? (
            <Button disabled={!note || loading} onClick={onClickNext}>
              Next{" "}
              {loading ? <Loader2 className="animate-spin" /> : <ArrowRight />}
            </Button>
          ) : (
            <Button
              disabled={loading || !selectedDoctor}
              onClick={onStartConsultation}
            >
              Start Consultation
            </Button>
          )}
          {loading ? <Loader2 className="animate-spin" /> : <ArrowRight />}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddSessionDialog;
