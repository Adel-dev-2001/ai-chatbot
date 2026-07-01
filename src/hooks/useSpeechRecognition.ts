/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * useSpeechRecognition — Custom hook that wraps the browser's Web Speech API.
 * Handles microphone toggle, transcript accumulation, and cleanup on unmount.
 */

import { useState, useRef, useCallback, useEffect } from "react";

interface UseSpeechRecognitionOptions {
  /** The language tag for recognition (e.g. "ar-EG", "en-US"). Empty string = auto-detect. */
  lang?: string;
  /** Called whenever the accumulated transcript updates. */
  onTranscript: (text: string) => void;
}

interface UseSpeechRecognitionReturn {
  isRecording: boolean;
  toggleRecording: () => void;
}

export function useSpeechRecognition({
  lang = "",
  onTranscript,
}: UseSpeechRecognitionOptions): UseSpeechRecognitionReturn {
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef<any>(null);

  // Clean up recognition instance when component using this hook unmounts
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const toggleRecording = useCallback(() => {
    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
      return;
    }

    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Your browser does not support Speech Recognition.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = lang || window.navigator.language;

    // Track the "confirmed" final transcript separately from interim results
    let finalTranscriptAccumulator = "";

    recognition.onresult = (event: any) => {
      let interimTranscript = "";
      let finalChunk = "";

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalChunk += event.results[i][0].transcript;
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }

      if (finalChunk) {
        finalTranscriptAccumulator = (
          finalTranscriptAccumulator +
          " " +
          finalChunk
        ).trim();
      }

      onTranscript(
        (finalTranscriptAccumulator + " " + interimTranscript).trim(),
      );
    };

    recognition.onerror = () => setIsRecording(false);
    recognition.onend = () => setIsRecording(false);

    recognitionRef.current = recognition;
    recognition.start();
    setIsRecording(true);
  }, [isRecording, lang, onTranscript]);

  return { isRecording, toggleRecording };
}
