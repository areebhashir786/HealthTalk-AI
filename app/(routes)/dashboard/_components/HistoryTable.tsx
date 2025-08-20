"use client";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDistanceToNow } from "date-fns";
import { SessionDetail } from "../medical-agent/[sessionId]/page";
import { Button } from "@/components/ui/button";
import ViewReportDialog from "./ViewReportDialog";

type Props = {
  historyList: SessionDetail[] | undefined; // Allow undefined for safety
};

const HistoryTable = ({ historyList }: Props) => {
  console.log("historyList", historyList);
  return (
    <div>
      <Table>
        <TableCaption>Previous Consultation Reports</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>AI Medical Specialist</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {historyList &&
            historyList?.map((record: SessionDetail, index: number) => (
              <TableRow key={index}>
                <TableCell className="font-medium">
                  {record.selectedDoctor.specialist}
                </TableCell>
                <TableCell>{record.notes}</TableCell>
                <TableCell>
                  {formatDistanceToNow(new Date(record.createdOn), {
                    addSuffix: true,
                  })}
                </TableCell>
                <TableCell className="text-right">
                  <ViewReportDialog record={record} />
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default HistoryTable;
