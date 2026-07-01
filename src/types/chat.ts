/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Attachment {
  name: string;
  mimeType: string;
  data: string; // Base64 encoded string
}

export interface ChatMessage {
  id: string;
  role: "user" | "model";
  text: string;
  isStreaming?: boolean;
  attachments?: Attachment[];
  parentId?: string; // For branching conversational history
}

export interface ChatSession {
  id: string;
  title: string;
  messages: ChatMessage[];
  currentLeafId?: string; // Point to the active leaf node in the conversational tree
  updatedAt: number;
}

export interface Suggestion {
  title: string;
  prompt: string;
}

export interface VoiceOption {
  name: string;
  lang: string;
  desc: string;
}
