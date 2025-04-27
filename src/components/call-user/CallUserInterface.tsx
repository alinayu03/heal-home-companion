"use client";

import React, { useEffect, useState } from "react";
import Vapi from "@vapi-ai/web";

const VAPI_API_KEY = import.meta.env.VITE_VAPI_API_KEY;
const VAPI_AGENT_ID = import.meta.env.VITE_VAPI_AGENT_ID;

const CallUserInterface = () => {
  const [callActive, setCallActive] = useState(false);
  const [callTranscript, setCallTranscript] = useState(null);
  const [currCall, setCurrCall] = useState(null);
  const [callId, setCallId] = useState(null);

  const vapi = new Vapi("1bffad7f-e116-42d8-945f-ec228f931ae8");

  const handleStartCall = async () => {
    if (!vapi) {
      console.error("Vapi client not initialized yet.");
      return;
    }

    try {
      const call = await vapi.start("f7427f54-f0dd-4161-8153-c32850e8c5b9");
      setCurrCall(call);
      setCallId(call.id);
      setCallActive(true);
    } catch (error) {
      console.error("Failed to start call:", error);
    }
  };

  const handleDropCall = async () => {
    vapi.stop();
    vapi.setMuted(true);
    console.log(vapi);
    if (callId) {
      try {
        const response = await fetch(`https://api.vapi.ai/call/${callId}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer 54287884-df07-4d49-8dfa-dda81da4cf28`,
            "Content-Type": "application/json",
          },
        });

        const callDetails = await response.json();
        console.log("Call details:", callDetails.transcript);
      } catch (error) {
        console.error("Error fetching call details:", error);
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white p-8">
      <h1 className="text-3xl font-bold mb-6">📞 Call the Nurse</h1>

      {!callActive ? (
        <button
          className="px-6 py-3 bg-blue-500 text-white rounded-md shadow-md hover:bg-blue-600 focus:outline-none"
          onClick={handleStartCall}
        >
          Start Call with Nurse
        </button>
      ) : (
        <>
          <p className="text-xl text-green-600 font-semibold">
            Call in progress...
          </p>
          <button
            className="mt-4 px-6 py-3 bg-red-500 text-white rounded-md shadow-md hover:bg-red-600 focus:outline-none"
            onClick={handleDropCall}
          >
            Drop Call
          </button>
        </>
      )}
    </div>
  );
};

export default CallUserInterface;
