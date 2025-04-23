import { useAgent } from "agents/react";
import { useAgentChat } from "agents/ai-react";
import Notifications from "./Notifications";
import { KnockProvider } from "@knocklabs/react";
import { KnockFeedProvider } from "@knocklabs/react";

function ChatInterface() {
  // Connect to the agent
  const agent = useAgent({
    agent: "AIAgent",
  });

  // Set up the chat interaction
  const { messages, input, handleInputChange, handleSubmit, clearHistory } =
    useAgentChat({
      agent,
      maxSteps: 5,
    });

  return (
    <KnockProvider
      apiKey={"pk_test_ahHZtGukq93uynfxDIIwENgKybrj1qnKqaK8zQSAXz4"}
      userId="admin_user_1"
    >
      <KnockFeedProvider feedId={"63f9d5d6-0ec7-46fc-aaf8-a568b981bfc4"}>
        <div className="chat-interface">
          <Notifications />

          <div className="message-flow">
            {messages.map((message) => (
              <div key={message.id} className="message">
                <div className="role">{message.role}</div>
                <div className="content">{message.content}</div>
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="input-area">
            <input
              value={input}
              onChange={handleInputChange}
              placeholder="Type your message..."
              className="message-input"
              style={{ width: "100%", height: "30px", padding: "10px" }}
            />

            <button type="submit" className="send-button">
              Go
            </button>
          </form>

          <button onClick={clearHistory} className="clear-button">
            Clear Chat
          </button>
        </div>
      </KnockFeedProvider>
    </KnockProvider>
  );
}

export default ChatInterface;
