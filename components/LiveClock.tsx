"use client";
import { useState, useEffect } from "react";

export default function LiveClock() {
  const [time, setTime] = useState({
    hour: 0,
    minute: 0,
    second: 0,
    ampm: "AM",
  });

  useEffect(() => {
    function updateTime() {
      const d = new Date();
      const hour = d.getHours();
      const minute = d.getMinutes();
      const second = d.getSeconds();
      const ampm = hour >= 12 ? "PM" : "AM";

      // Convert hour from 24-hour to 12-hour format
      const hour12 = hour % 12 || 12;

      setTime({
        hour: hour12,
        minute: minute,
        second: second,
        ampm: ampm,
      });
    }

    const intervalId = setInterval(updateTime, 1000);

    // Initial call to set the time immediately
    updateTime();

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div>
      {time.hour.toString().padStart(2, "0")}:
      {time.minute.toString().padStart(2, "0")} {time.ampm}
    </div>
  );
}
