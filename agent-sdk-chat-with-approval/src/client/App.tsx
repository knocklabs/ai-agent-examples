import { useAgent } from "agents/react";
import { useAgentChat } from "agents/ai-react";
import Notifications from "./Notifications";
import { KnockProvider } from "@knocklabs/react";
import { KnockFeedProvider } from "@knocklabs/react";

import {
  PromptInput,
  PromptInputTextarea,
  PromptInputActions,
  PromptInputAction,
} from "../components/ui/prompt-input";
import { ArrowUp, Square } from "lucide-react";
import { ChangeEvent, useRef } from "react";

import { Button } from "../components/ui/button";
import { ChatContainer } from "../components/ui/chat-container";
import {
  Message,
  MessageAvatar,
  MessageContent,
} from "../components/ui/message";
import { Markdown } from "../components/ui/markdown";
import { PromptSuggestion } from "../components/ui/prompt-suggestion";

const KNOCK_USER_ID = "admin_user_1";

function ChatInterface() {
  // Connect to the agent
  const agent = useAgent({
    agent: "AIAgent",
  });

  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Set up the chat interaction
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    clearHistory,
    isLoading,
  } = useAgentChat({
    agent,
    maxSteps: 5,
  });

  return (
    <KnockProvider
      apiKey={import.meta.env.VITE_KNOCK_PUBLIC_KEY}
      userId={KNOCK_USER_ID}
    >
      <KnockFeedProvider feedId={import.meta.env.VITE_KNOCK_FEED_ID}>
        <div className="chat-interface">
          <div className="flex p-2 flex-row items-center gap-2 border-b">
            <span className="text-lg font-bold">AI Assistant</span>

            <Button variant="outline" size="sm" onClick={clearHistory}>
              Clear chat
            </Button>
            <div className="ml-auto">
              <Notifications />
            </div>
          </div>

          <div className="flex h-[calc(100vh-70px)] w-[700px] flex-col overflow-hidden mx-auto">
            <ChatContainer
              className="flex-1 space-y-4 p-4"
              autoScroll
              ref={chatContainerRef}
            >
              {messages.map((message) => {
                const isAssistant = message.role === "assistant";

                return (
                  <Message
                    key={message.id}
                    className={
                      message.role === "user" ? "justify-end" : "justify-start"
                    }
                  >
                    {isAssistant && (
                      <MessageAvatar src="" alt="AI Assistant" fallback="AI" />
                    )}
                    <div className="max-w-[85%] flex-1 sm:max-w-[75%]">
                      {isAssistant ? (
                        <div className="bg-secondary text-foreground prose rounded-lg p-2">
                          <Markdown>{message.content}</Markdown>
                        </div>
                      ) : (
                        <MessageContent className="bg-primary text-primary-foreground">
                          {message.content}
                        </MessageContent>
                      )}
                    </div>
                  </Message>
                );
              })}
            </ChatContainer>

            <form onSubmit={handleSubmit} className="input-area">
              <div className="flex flex-wrap gap-2 my-3">
                <PromptSuggestion
                  onClick={() =>
                    handleInputChange({
                      target: {
                        value: `Add ${Math.floor(
                          Math.random() * 1000
                        )} + ${Math.floor(Math.random() * 1000)}`,
                      },
                    } as ChangeEvent<HTMLInputElement>)
                  }
                >
                  Add two values together
                </PromptSuggestion>
              </div>
              <PromptInput
                value={input}
                onValueChange={(e) =>
                  handleInputChange({
                    target: { value: e },
                  } as ChangeEvent<HTMLInputElement>)
                }
                isLoading={isLoading}
                onSubmit={handleSubmit}
                className="w-full max-w-(--breakpoint-md)"
              >
                <PromptInputTextarea placeholder="Ask me anything..." />
                <PromptInputActions className="justify-end pt-2">
                  <PromptInputAction
                    tooltip={isLoading ? "Stop generation" : "Send message"}
                  >
                    <Button
                      variant="default"
                      size="icon"
                      className="h-8 w-8 rounded-full"
                      onClick={handleSubmit}
                    >
                      {isLoading ? (
                        <Square className="size-5 fill-current" />
                      ) : (
                        <ArrowUp className="size-5" />
                      )}
                    </Button>
                  </PromptInputAction>
                </PromptInputActions>
              </PromptInput>
            </form>
          </div>
        </div>
      </KnockFeedProvider>
    </KnockProvider>
  );
}

export default ChatInterface;
