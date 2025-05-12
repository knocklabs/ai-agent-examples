import { useAgent } from "agents/react";
import { useAgentChat } from "agents/ai-react";
import { ArrowUp, Square } from "lucide-react";
import { ChangeEvent, useRef } from "react";

import {
  PromptInput,
  PromptInputTextarea,
  PromptInputActions,
  PromptInputAction,
} from "./components/ui/prompt-input";
import { Button } from "./components/ui/button";
import { ChatContainer } from "./components/ui/chat-container";
import {
  Message,
  MessageAvatar,
  MessageContent,
} from "./components/ui/message";
import { Markdown } from "./components/ui/markdown";
import { PromptSuggestion } from "./components/ui/prompt-suggestion";

function Chat({
  userId,
  resetUserId,
}: {
  userId: string;
  resetUserId: () => void;
}) {
  const agent = useAgent({ agent: "AIAgent", name: userId });
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const { messages, input, handleInputChange, handleSubmit, isLoading } =
    useAgentChat({
      agent,
      maxSteps: 5,
    });

  const setInput = (value: string) => {
    handleInputChange({
      target: { value },
    } as ChangeEvent<HTMLInputElement>);
  };

  return (
    <div className="chat-interface">
      <div className="flex p-2 flex-row items-center gap-2 border-b">
        <img src="/slope-logo.png" alt="Slope logo" className="w-20" />

        <Button
          variant="outline"
          size="sm"
          onClick={resetUserId}
          className="ml-auto"
        >
          New chat
        </Button>
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
                    <div className="bg-secondary text-foreground prose rounded-lg p-3">
                      <Markdown className="chat-message-content">
                        {message.content}
                      </Markdown>
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
          <div className="flex flex-wrap gap-2 my-3 overflow-x-scroll w-full">
            <PromptSuggestion
              variant="outline"
              size="sm"
              onClick={() => setInput(`Can you issue me a new card`)}
            >
              ✅ Issue a new card
            </PromptSuggestion>
            <PromptSuggestion
              variant="outline"
              size="sm"
              onClick={() => setInput(`Can you list all my cards?`)}
            >
              List all cards
            </PromptSuggestion>
            <PromptSuggestion
              variant="outline"
              size="sm"
              onClick={() =>
                setInput(`Can you tell me more about this application?`)
              }
            >
              What is this?
            </PromptSuggestion>
            <PromptSuggestion
              variant="outline"
              size="sm"
              onClick={() => setInput(`What is Knock?`)}
            >
              What is Knock?
            </PromptSuggestion>
            <PromptSuggestion
              variant="outline"
              size="sm"
              onClick={() => setInput(`How does this demo application work?`)}
            >
              How does this work?
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
  );
}

export default Chat;
