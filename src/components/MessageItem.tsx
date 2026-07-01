import React, { useState, useEffect } from "react";
import {
  Copy,
  Bot,
  User,
  Check,
  Terminal,
  Volume2,
  VolumeX,
  FileText,
  Edit2,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import { MarkdownRenderer } from "./MarkdownRenderer";
import { ChatMessage } from "../types/chat";
import { geminiService } from "../services/GeminiService";
import { cn } from "../lib/utils";

import { motion } from "motion/react";

interface MessageItemProps {
  message: ChatMessage;
  selectedVoiceName?: string;
  onEdit?: (id: string, newText: string) => void;
  // Sibling navigation
  siblingCount?: number;
  siblingIndex?: number;
  onNavigateSibling?: (direction: "prev" | "next") => void;
}

export function MessageItem({
  message,
  selectedVoiceName,
  onEdit,
  siblingCount,
  siblingIndex,
  onNavigateSibling,
}: MessageItemProps) {
  const isUser = message.role === "user";
  const [copied, setCopied] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(message.text);

  useEffect(() => {
    setEditText(message.text);
  }, [message.text]);

  useEffect(() => {
    return () => {
      if (audio) {
        audio.pause();
      }
    };
  }, [audio]);

  const handleCopy = () => {
    navigator.clipboard.writeText(message.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSpeak = async () => {
    if (isSpeaking && audio) {
      audio.pause();
      setIsSpeaking(false);
      return;
    }

    if (!message.text) return;

    setIsSpeaking(true);

    if (audio) {
      audio.play();
      return;
    }

    try {
      const audioDataUrl = await geminiService.generateSpeech(
        message.text,
        selectedVoiceName || "Puck",
      );
      if (audioDataUrl) {
        const newAudio = new Audio(audioDataUrl);
        newAudio.onended = () => setIsSpeaking(false);
        setAudio(newAudio);
        await newAudio.play();
      } else {
        setIsSpeaking(false);
      }
    } catch (e) {
      console.error(e);
      setIsSpeaking(false);
    }
  };

  return (
    <motion.div
      id={`message-${message.id}`}
      data-role={message.role}
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full px-4 md:px-8 transition-colors"
    >
      <div
        className={cn(
          "max-w-4xl mx-auto flex gap-4 my-6 group",
          isUser ? "justify-end" : "justify-start",
        )}
      >
        {!isUser && (
          <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 mt-1 shadow-sm">
            <Terminal size={18} className="text-primary" />
          </div>
        )}

        <div
          className={cn(
            "max-w-[90%] md:max-w-[80%] space-y-3",
            isUser && "flex flex-col items-end",
          )}
        >
          {message.attachments && message.attachments.length > 0 && (
            <div className="flex flex-wrap gap-2 w-full justify-end">
              {message.attachments.map((att, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 p-2 rounded-xl bg-muted/60 border border-border text-xs w-48 max-w-full overflow-hidden"
                >
                  {att.mimeType.startsWith("image/") ? (
                    <img
                      src={`data:${att.mimeType};base64,${att.data}`}
                      alt="attachment"
                      className="w-8 h-8 object-cover rounded-md flex-shrink-0 bg-background"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-md bg-background flex justify-center items-center flex-shrink-0">
                      <FileText size={16} className="text-primary" />
                    </div>
                  )}
                  <span className="truncate flex-1 font-medium text-muted-foreground">
                    {att.name}
                  </span>
                </div>
              ))}
            </div>
          )}

          <div
            dir="auto"
            className={cn(
              isUser
                ? "bg-user-msg px-5 py-3 rounded-2xl rounded-tr-none border border-user-border text-sm leading-relaxed shadow-sm block w-fit"
                : "text-sm leading-relaxed block w-full",
            )}
          >
            {isEditing ? (
              <div className="flex flex-col gap-2 min-w-[250px] md:min-w-[400px]">
                <textarea
                  autoFocus
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  className="w-full bg-background border border-border rounded-xl p-3 text-foreground resize-y min-h-[100px] outline-none focus:ring-1 focus:ring-primary/50"
                />
                <div className="flex justify-end gap-2 mt-2">
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      setEditText(message.text);
                    }}
                    className="px-3 py-1.5 min-w-[80px] text-xs font-medium rounded-full bg-muted text-muted-foreground hover:bg-muted/80 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      if (onEdit && editText !== message.text)
                        onEdit(message.id, editText);
                    }}
                    className="px-3 py-1.5 min-w-[80px] text-xs font-medium rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                  >
                    Save & Submit
                  </button>
                </div>
              </div>
            ) : (
              <div className="prose-container min-w-0 text-foreground">
                {message.text && <MarkdownRenderer content={message.text} isStreaming={message.isStreaming} />}
                {message.isStreaming && (
                  <p className="text-sm text-primary italic mt-2 animate-pulse flex items-center gap-2">
                    <span
                      className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-bounce"
                      style={{ animationDelay: "0ms" }}
                    />
                    <span
                      className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-bounce"
                      style={{ animationDelay: "150ms" }}
                    />
                    <span
                      className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-bounce"
                      style={{ animationDelay: "300ms" }}
                    />
                  </p>
                )}
              </div>
            )}

            {/* Version Navigation (Siblings) */}
            {!isEditing &&
              siblingCount &&
              siblingCount > 1 &&
              typeof siblingIndex === "number" && (
                <div
                  className={cn(
                    "flex items-center gap-2 mt-4 text-xs font-medium",
                    isUser
                      ? "text-muted-foreground justify-end"
                      : "text-muted-foreground",
                  )}
                >
                  <button
                    onClick={() => onNavigateSibling?.("prev")}
                    disabled={siblingIndex === 0}
                    className="p-1 rounded hover:bg-muted/50 disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft size={14} />
                  </button>
                  <span>
                    {siblingIndex + 1} / {siblingCount}
                  </span>
                  <button
                    onClick={() => onNavigateSibling?.("next")}
                    disabled={siblingIndex === siblingCount - 1}
                    className="p-1 rounded hover:bg-muted/50 disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <ChevronRight size={14} />
                  </button>
                </div>
              )}
          </div>
        </div>

        {!isUser && !message.isStreaming && (
          <div className="opacity-0 group-hover:opacity-100 transition-opacity flex flex-col gap-1 mt-1">
            <button
              onClick={handleCopy}
              className="text-muted-foreground hover:text-foreground p-1.5 rounded-md hover:bg-muted transition-colors"
              title="Copy response"
            >
              {copied ? (
                <Check size={14} className="text-emerald-500" />
              ) : (
                <Copy size={14} />
              )}
            </button>
            <button
              onClick={handleSpeak}
              className={cn(
                "p-1.5 rounded-md transition-colors",
                isSpeaking
                  ? "bg-primary/10 text-primary animate-pulse"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted",
              )}
              title={isSpeaking ? "Stop speaking" : "Speak response"}
            >
              {isSpeaking ? <VolumeX size={14} /> : <Volume2 size={14} />}
            </button>
          </div>
        )}

        {isUser && !message.isStreaming && (
          <div className="opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-end gap-1 mt-1">
            <button
              onClick={() => setIsEditing(true)}
              className="text-muted-foreground hover:text-foreground p-1.5 rounded-md hover:bg-muted transition-colors"
              title="تعديل الرسالة"
            >
              <Edit2 size={14} />
            </button>
            <button
              onClick={handleCopy}
              className="text-muted-foreground hover:text-foreground p-1.5 rounded-md hover:bg-muted transition-colors"
              title="نسخ الرسالة"
            >
              {copied ? (
                <Check size={14} className="text-emerald-500" />
              ) : (
                <Copy size={14} />
              )}
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
}
