"use client";
import Countdown from "react-countdown";

const StartCountDown = ({ startTime }: { startTime: Date }) => {
  return (
    <div>
      <Countdown date={startTime} className="h1 text-lg font-bold" />
    </div>
  );
};

export default StartCountDown;
