// @ts-nocheck
"use client";
import { useGetCalls } from "@/hooks/useGetCalls";
import { Call, CallRecording } from "@stream-io/video-react-sdk";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import MeetingCard from "./MeetingCard";
import Loader from "./Loader";
import { useToast } from "./ui/use-toast";

const CallList = ({ type }: { type: "ended" | "upcoming" | "recording" }) => {
  const { endedCalls, upcomingCalls, callRecordings, isLoading } =
    useGetCalls();

  const router = useRouter();

  const { toast } = useToast();

  const [recordings, setRecordings] = useState<CallRecording[]>([]);
  const getCalls = () => {
    switch (type) {
      case "ended":
        return endedCalls;
      case "upcoming":
        return upcomingCalls;
      case "recording":
        return recordings;
      default:
        return [];
    }
  };

  const getNoCallsMessage = () => {
    switch (type) {
      case "ended":
        return "No Previous Calls";
      case "upcoming":
        return "No Upcoming Calls";
      case "recording":
        return "No Recordings";
      default:
        return "";
    }
  };

  useEffect(() => {
    const fetchRecordings = async () => {
      try {
        const callData = await Promise.all(
          callRecordings?.map((meeting) => meeting.queryRecordings())
        );
        const recordings = callData
          .filter((call) => call.recordings.length > 0)
          .flatMap((call) => call.recordings);

        setRecordings(recordings);
      } catch (error) {
        toast({
          title: "Try again later",
        });
      }
    };

    if (type === "recording") fetchRecordings();
  }, [type, callRecordings]);
  const calls = getCalls();
  const noCallsMessage = getNoCallsMessage();

  if (isLoading) {
    return <Loader />;
  }
  return (
    <div className="grid girid-cols-1 gap-5 xl:grid-cols-2">
      {calls && calls.length > 0 ? (
        calls.map((meeting: Call | CallRecording) => (
          <MeetingCard
            key={(meeting as Call).id}
            icon={
              type === "ended"
                ? "/icons/previous.svg"
                : type === "upcoming"
                ? "/icons/upcoming.svg"
                : "/icons/recordings.svg"
            }
            title={
              (meeting as Call).state?.custom?.description?.substring(0, 26) ||
              meeting?.filename?.substring(0, 20) ||
              "Personal Meeting"
            }
            date={
              (meeting as Call).state?.startsAt?.toLocaleString() ||
              (meeting as CallRecording).start_time?.toLocaleString()
            }
            RecordingCallRecording
            isPreviousMeeting={type === "ended"}
            buttonIcon1={type === "recording" ? "/icons/play.svg" : undefined}
            handleClick={
              type === "recording"
                ? () => router.push(`${meeting.url}`)
                : () => router.push(`/meeting/${meeting.id}`)
            }
            link={
              type === "recording"
                ? meeting.url
                : `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${meeting.id}`
            }
            buttonText={type === "recording" ? "Play" : "Start"}
          />
        ))
      ) : (
        <h1> {noCallsMessage}</h1>
      )}
    </div>
  );
};

export default CallList;
