import React from "react";
import AppHeader from "./_components/AppHeader";
import HistoryList from "./_components/HistoryList";
import { Button } from "@/components/ui/button";
import DoctorsAgentList from "./_components/DoctorsAgentList";

const Dashboard = () => {
  return (
    <>
      <div className="flex justify-between items-center">
        <h2 className="font-bold text-2xl">My Dashboard</h2>
        <Button>+ Consult with Doctor</Button>
      </div>
      <HistoryList />
      <DoctorsAgentList />
    </>
  );
};

export default Dashboard;
