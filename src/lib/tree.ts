import { ChatMessage } from "../types/chat";

export function getActiveThread(allMessages: ChatMessage[], leafId?: string): ChatMessage[] {
  if (allMessages.length === 0) return [];

  const hasParents = allMessages.some(m => m.parentId);
  if (!hasParents) return allMessages;

  let currentId = leafId || allMessages[allMessages.length - 1].id;
  const thread: ChatMessage[] = [];
  
  let curr = allMessages.find(m => m.id === currentId);
  while(curr) {
    thread.unshift(curr);
    if (!curr.parentId) break;
    curr = allMessages.find(m => m.id === curr.parentId);
  }
  return thread;
}

export function getSiblings(allMessages: ChatMessage[], messageId: string) {
    const msg = allMessages.find(m => m.id === messageId);
    if (!msg) return [];
    
    return allMessages.filter(m => m.parentId === msg.parentId);
}

export function getLeafOfNode(allMessages: ChatMessage[], nodeId: string): string {
    // Find a path to the deepest leaf starting from nodeId
    // For simplicity, just find the most recently added descendant
    let currentId = nodeId;
    // We want to find a chain
    let foundChild = true;
    while(foundChild) {
        const children = allMessages.filter(m => m.parentId === currentId);
        if (children.length > 0) {
            // Pick the latest child
            currentId = children[children.length - 1].id;
        } else {
            foundChild = false;
        }
    }
    return currentId;
}
