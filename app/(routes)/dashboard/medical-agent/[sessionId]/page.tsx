"use client";
import axios from "axios";
import Vapi from "@vapi-ai/web";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { DoctorAgent } from "../../_components/DoctorAgentCard";
import { Circle, Loader, PhoneCall, PhoneOff } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export type SessionDetail = {
  id: number;
  notes: string;
  sessionId: string;
  report: JSON;
  selectedDoctor: DoctorAgent;
  createdOn: string;
};

type messages = {
  role: string;
  text: string;
};

const MedicalVoiceAgent = () => {
  const { sessionId } = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [sessionDetail, setSessionDetail] = useState<SessionDetail>();
  const [callStarted, setCallStarted] = useState(false);
  const [vapiInstance, setVapiInstance] = useState<any>();
  const [currentRole, setCurrentRole] = useState<string | null>();
  const [liveTranscript, setLiveTranscript] = useState<string>();
  const [messages, setMessages] = useState<messages[]>([]);

  const getSessionDetails = async () => {
    const result = await axios.get(`/api/session-chat?sessionId=${sessionId}`);
    setSessionDetail(result.data);
  };

  useEffect(() => {
    sessionId && getSessionDetails();
  }, [sessionId]);

  const startCall = () => {
    setLoading(true);
    const vapi = new Vapi(process.env.NEXT_PUBLIC_VAPI_API_KEY!);
    setVapiInstance(vapi);

    const VapiAgentConfig = {
      name: "AI MediCare Voice Agent",
      firstMessage:
        "Hi there! I'm your AI Medical Assistant. I'm here to help you with any health questions or concerns you might have today. How are you feeling?",
      transcriber: {
        provider: "assembly-ai",
        language: "en",
      },
      voice: {
        provider: "vapi",
        voiceId: sessionDetail?.selectedDoctor?.voiceId,
      },
      model: {
        provider: "openai",
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: sessionDetail?.selectedDoctor?.agentPrompt,
          },
        ],
      },
    };

    // Start voice conversation
    // @ts-ignore
    vapi.start(VapiAgentConfig);
    // Listen for events
    vapi.on("call-start", () => {
      setLoading(false);
      setCallStarted(true);
      console.log("Call started");
    });
    vapi.on("call-end", () => {
      setLoading(false);
      setCallStarted(false);
      console.log("Call ended");
    });
    vapi.on("message", (message) => {
      setLoading(false);
      if (message.type === "transcript") {
        const { role, transcriptType, transcript } = message;
        console.log(`${message.role}: ${message.transcript}`);
        if (transcriptType == "partial") {
          setLiveTranscript(transcript);
          setCurrentRole(role);
        } else if (transcriptType == "final") {
          // Final Transcript
          setMessages((prev: messages[] = []) => [
            ...prev,
            { role: role, text: transcript },
          ]);
          setLiveTranscript("");
          setCurrentRole(null);
        }
      }
    });

    // Real-time conversation events
    vapi.on("speech-start", () => {
      setLoading(false);
      console.log("User started speaking");
      setCurrentRole("assistant");
    });
    vapi.on("speech-end", () => {
      setLoading(false);
      console.log("User stopped speaking");
      setCurrentRole("user");
    });
  };

  const endCall = async () => {
    setLoading(true);
    if (!vapiInstance) return;
    // Stop the call
    vapiInstance.stop();

    // Optionally Remove the listeners
    vapiInstance.off("call-start");
    vapiInstance.off("call-end");
    vapiInstance.off("message");

    // Reset call state
    setCallStarted(false);
    setVapiInstance(null);

    const result = await generateReport();
    setLoading(false);
    toast.success("Your report is generated!");
    router.replace("/dashboard");
  };

  const generateReport = async () => {
    const result = await axios.post("/api/medical-report", {
      messages: messages,
      sessionDetail: sessionDetail,
      sessionId: sessionId,
    });
    return result.data;
  };

  return (
    <div className="p-10 border rounded-3xl bg-secondary">
      <div className="flex justify-between items-center">
        <h2 className="p-1 px-2 border rounded-md flex gap-2 items-center">
          <Circle
            className={`w-4 h-4 rounded-full ${
              callStarted ? "bg-green-500" : "bg-red-500"
            }`}
          />{" "}
          {callStarted ? "Call Started..." : "Not Connected"}
        </h2>
        <h2 className="font-bol text-xl text-gray-400">00:00</h2>
      </div>
      {sessionDetail && (
        <div className="flex items-center flex-col mt-10">
          <Image
            src={sessionDetail?.selectedDoctor?.image}
            alt={sessionDetail?.selectedDoctor?.specialist}
            width={120}
            height={120}
            className="w-[100px] h-[100px] object-cover rounded-full"
          />
          <h2 className="mt-2 text-lg">
            {sessionDetail?.selectedDoctor?.specialist}
          </h2>
          <p className="text-sm text-gray-400">AI Medical Voice Agent</p>
          <div className="mt-32 overflow-y-auto flex flex-col items-center px-10 md:px-28 lg:px-52 xl:px-72">
            {messages?.slice(-4).map((msg: messages, index) => (
              <h2 className="text-gray-400 p-2" key={index}>
                {msg.role}: {msg.text}
              </h2>
            ))}

            {liveTranscript && liveTranscript?.length > 0 && (
              <h2 className="text-lg">
                {currentRole}: {liveTranscript}
              </h2>
            )}
          </div>
          {!callStarted ? (
            <Button className="mt-20" onClick={startCall} disabled={loading}>
              {" "}
              {loading ? (
                <Loader className="animate-spin" />
              ) : (
                <PhoneCall />
              )}{" "}
              Start Call
            </Button>
          ) : (
            <Button
              variant={"destructive"}
              onClick={endCall}
              disabled={loading}
            >
              {loading ? <Loader className="animate-spin" /> : <PhoneOff />}{" "}
              Disconnect
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default MedicalVoiceAgent;
