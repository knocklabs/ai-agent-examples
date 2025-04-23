import { CoreAssistantMessage, CoreToolMessage, Message } from "ai";
import { deferredToolCallToToolInvocation } from "@knocklabs/agent/ai-sdk";
import { type DeferredToolCall } from "@knocklabs/agent/types";

type ResponseMessage = (CoreAssistantMessage | CoreToolMessage) & {
  id: string;
};

/**
 * Returns a new assistant message that includes the deferred tool call and the result so it can be
 * shown in the UI.
 *
 * @param toolCall
 */
export function responseToAssistantMessage(
  responseMessage: ResponseMessage,
  deferredToolCall: DeferredToolCall,
  toolResult: any
): Message {
  const toolInvocation = deferredToolCallToToolInvocation(
    deferredToolCall,
    toolResult
  );

  let textContent = "";

  for (const part of responseMessage.content) {
    if (typeof part === "string") {
      textContent += part;
    } else if (part.type === "text") {
      textContent += part.text;
    }
  }

  return {
    role: "assistant",
    id: responseMessage.id,
    createdAt: new Date(),
    content: textContent,
    parts: [
      { type: "step-start" },
      { type: "tool-invocation", toolInvocation },
      { type: "step-start" },
      { type: "text", text: textContent },
    ],
    toolInvocations: [toolInvocation],
  };
}
