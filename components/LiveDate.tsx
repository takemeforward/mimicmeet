"use client";
import { useState, useEffect } from "react";

export default function LiveDate() {
  const [dateString, setDateString] = useState("");

  useEffect(() => {
    function updateDate() {
      const d = new Date();
      const options = {
        weekday: "long" as const,
        day: "numeric" as const,
        month: "long" as const,
        year: "numeric" as const,
      };
      const formattedDate = new Intl.DateTimeFormat("en-GB", options).format(d);
      setDateString(formattedDate);
    }

    // Calculate the milliseconds until the next midnight
    const now = new Date();
    const msUntilMidnight =
      new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1).getTime() -
      now.getTime();

    // Set an initial timeout to update the date at the next midnight
    const initialTimeoutId = setTimeout(() => {
      updateDate();
      // After the initial update, set an interval to update daily at midnight
      const intervalId = setInterval(updateDate, 24 * 60 * 60 * 1000);

      // Cleanup the interval on component unmount
      return () => clearInterval(intervalId);
    }, msUntilMidnight);

    // Initial call to set the date immediately
    updateDate();

    // Cleanup the initial timeout on component unmount
    return () => clearTimeout(initialTimeoutId);
  }, []);

  return <>{dateString}</>;
}
