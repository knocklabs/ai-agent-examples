import { AIChatAgent } from "agents/ai-chat-agent";
import { openai } from "@ai-sdk/openai";
import { createDataStreamResponse, generateText, streamText } from "ai";

import { initializeToolkit } from "./tools";
import { responseToAssistantMessage } from "./helper";
import app from "./app";
import { IssuedCard } from "./api";
import { ABOUT, WHAT_IS_KNOCK } from "./constants";

export type Env = {
  KNOCK_SERVICE_TOKEN: string;
  KNOCK_API_KEY: string;
  AIAgent: AIAgent;
};

export interface AgentState {
  issuedCards: IssuedCard[];
  toolCalls: Record<string, "pending" | "requested" | "approved" | "rejected">;
}

export class AIAgent extends AIChatAgent<Env, AgentState> {
  env: Env;

  initialState: AgentState = {
    issuedCards: [],
    toolCalls: {},
  };

  async onChatMessage(onFinish) {
    const { tools } = await initializeToolkit(this);

    return createDataStreamResponse({
      execute: async (dataStream) => {
        try {
          const stream = streamText({
            model: openai("gpt-4o-mini"),
            system: `You are a helpful assistant for a financial services company. You help customers with credit card issuing. The current user is ${this.name}.
            
            When you're asked about what this application is, you should respond with: ${ABOUT}.
            
            When you're asked about what Knock is, you should respond with: ${WHAT_IS_KNOCK}.`,
            messages: this.messages,
            onFinish, // call onFinish so that messages get saved
            tools: tools,
            maxSteps: 5,
          });

          stream.mergeIntoDataStream(dataStream);
        } catch (error) {
          console.error(error);
        }
      },
    });
  }

  // API for storing state on this agent process

  resetState() {
    this.setState(this.initialState);
  }

  getIssuedCards() {
    return this.state.issuedCards;
  }

  setToolCallStatus(
    toolCallId: string,
    status: "pending" | "requested" | "approved" | "rejected"
  ) {
    this.setState({
      ...this.state,
      toolCalls: { ...this.state.toolCalls, [toolCallId]: status },
    });
  }

  addIssuedCard(card: IssuedCard) {
    this.setState({
      ...this.state,
      issuedCards: [...this.state.issuedCards, card],
    });
  }

  async handleIncomingWebhook(body: any) {
    const { toolkit } = await initializeToolkit(this);

    const result = toolkit.handleMessageInteraction(body);

    if (!result) {
      return { error: "No result" };
    }

    const toolCallId = result.toolCall.id;

    // Guard against duplicate tool call requests
    if (this.state.toolCalls[toolCallId] !== "requested") {
      return { error: "Tool call is not requested" };
    }

    if (result.interaction.status === "approved") {
      const toolCallResult = await toolkit.resumeToolExecution(result.toolCall);

      this.setToolCallStatus(toolCallId, "approved");

      const { response } = await generateText({
        model: openai("gpt-4o-mini"),
        prompt: `You were asked to issue a card for a customer. The card is now approved. The result was: ${JSON.stringify(
          toolCallResult
        )}.`,
      });

      const message = responseToAssistantMessage(
        response.messages[0],
        result.toolCall,
        toolCallResult
      );

      this.persistMessages([...this.messages, message]);
    }

    return { status: "success" };
  }
}

export default app;
