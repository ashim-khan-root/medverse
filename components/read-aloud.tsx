"use client";

import { useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { ClayButton } from "./clay";

export function ReadAloud({ text }: { text: string }) {
  const [speaking, setSpeaking] = useState(false);

  function toggle() {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      return;
    }
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    utterance.pitch = 1;
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);
    setSpeaking(true);
    window.speechSynthesis.speak(utterance);
  }

  if (typeof window !== "undefined" && !("speechSynthesis" in window)) return null;

  return (
    <ClayButton
      type="button"
      variant="soft"
      onClick={toggle}
      aria-pressed={speaking}
      aria-label={speaking ? "Stop reading aloud" : "Read aloud"}
    >
      {speaking ? (
        <>
          <VolumeX className="size-4" aria-hidden />
          Stop
        </>
      ) : (
        <>
          <Volume2 className="size-4" aria-hidden />
          Read aloud
        </>
      )}
    </ClayButton>
  );
}
