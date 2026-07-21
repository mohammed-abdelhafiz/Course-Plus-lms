"use client";
import { useConfettiStore } from "@/hooks/use-confetti-store";
import ReactConfetti from "react-confetti";

export const ConfettiProvider = () => {
  const { isOpen, close } = useConfettiStore();
  if (!isOpen) return null;
  return (
    <ReactConfetti
      className="z-100 pointer-events-none"
      recycle={false}
      numberOfPieces={500}
      onConfettiComplete={() => {
        close();
      }}
    />
  );
};
