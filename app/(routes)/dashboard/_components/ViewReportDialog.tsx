import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { SessionDetail } from "../medical-agent/[sessionId]/page";
import { formatDistanceToNow } from "date-fns";

type Props = {
  record: SessionDetail;
};

const ViewReportDialog = ({ record }: Props) => {
  return (
    <div>
      <Dialog>
        <DialogTrigger>
          <Button variant="link" size="sm">
            View Report
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle asChild>
              <h2 className="text-center text-2xl font-semibold">
                🩺 Medical AI Voice Agent Report
              </h2>
            </DialogTitle>
            <DialogDescription>
              {/* Session Info */}
              <div className="mt-4">
                <h2 className="font-bold text-blue-500 text-lg mb-2">
                  Session Info
                </h2>
                <div className="grid grid-cols-2 gap-2">
                  <h2>
                    <strong>Doctor:</strong> {record.selectedDoctor.specialist}
                  </h2>
                  <h2>
                    <strong>User:</strong> Anonymous
                  </h2>
                  <h2>
                    <strong>Consulted On:</strong>{" "}
                    {formatDistanceToNow(new Date(record.createdOn), {
                      addSuffix: true,
                    })}
                  </h2>
                  <h2>
                    <strong>Agent:</strong> General Physician AI
                  </h2>
                </div>
              </div>

              {/* Chief Complaint */}
              {/* <div className="mt-4">
                <h2 className="font-bold text-blue-500 text-lg">
                  Chief Complaint
                </h2>
                <p className="mt-1 text-gray-700">
                  {record.chiefComplaint || "User reports sharp back pain."}
                </p>
              </div> */}

              {/* Summary */}
              <div className="mt-4">
                <h2 className="font-bold text-blue-500 text-lg">Summary</h2>
                <p className="mt-1 text-gray-700 leading-relaxed">
                  {JSON.stringify(record?.report) ||
                    `The user is experiencing sharp back pain. The AI assistant 
                    recommended over-the-counter pain relievers like ibuprofen 
                    or acetaminophen, emphasizing the importance of following 
                    dosage instructions. It also advised consulting a healthcare 
                    provider if the pain persists or worsens.`}
                </p>
              </div>

              {/* Symptoms */}
              {/* <div className="mt-4">
                <h2 className="font-bold text-blue-500 text-lg">Symptoms</h2>
                <ul className="list-disc list-inside mt-1 text-gray-700">
                  {record.symptoms?.length ? (
                    record.symptoms.map((symptom, idx) => (
                      <li key={idx}>{symptom}</li>
                    ))
                  ) : (
                    <>
                      <li>back pain</li>
                      <li>sharp pain</li>
                    </>
                  )}
                </ul>
              </div> */}
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ViewReportDialog;
