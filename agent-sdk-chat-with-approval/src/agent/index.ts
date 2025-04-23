import { getAgentByName, routeAgentRequest } from "agents";

import { AIChatAgent } from "agents/ai-chat-agent";
import { openai } from "@ai-sdk/openai";
import { createDataStreamResponse, generateText, streamText } from "ai";
import { ExecutionContext } from "hono";
import { initializeToolkit } from "./tools";
import { responseToAssistantMessage } from "./helper";

type Env = {
  KNOCK_SERVICE_TOKEN: string;
  AIAgent: AIAgent;
};

export class AIAgent extends AIChatAgent {
  env: Env;

  async onChatMessage(onFinish) {
    const { tools } = await initializeToolkit(this.env);

    return createDataStreamResponse({
      execute: async (dataStream) => {
        try {
          const stream = streamText({
            model: openai("gpt-4o-mini"),
            system:
              "You are a helpful assistant that can answer questions and help with tasks.",
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

  async handleIncomingWebhook(request: Request) {
    const body = await request.json();

    const { toolkit } = await initializeToolkit(this.env);
    const result = toolkit.handleMessageInteraction(body);

    if (!result) {
      return new Response("Not found", { status: 404 });
    }

    // This is one example on how to handle the result of the deferred tool execution by running a new LLM call with the result.
    // You could also find the past tool call using the `toolCallResult.toolCallId` and append the result to the existing messages.
    if (result.interaction.action === "#approve") {
      const toolCallResult = await toolkit.resumeToolExecution(result.toolCall);

      const { response } = await generateText({
        model: openai("gpt-4o-mini"),
        prompt: `You are a helpful assistant that was asked to defer a tool execution to a human. The response from the tool execution is: ${JSON.stringify(
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

    return Response.json({ status: "success" });
  }
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext) {
    const url = new URL(request.url);

    if (url.pathname.startsWith("/incoming/webhook")) {
      const existingAgent = await getAgentByName(env.AIAgent, "default");

      if (existingAgent) {
        return await existingAgent.handleIncomingWebhook(request);
      } else {
        return new Response("Not found", { status: 404 });
      }
    }

    return (
      // Route the request to our agent or return 404 if not found
      (await routeAgentRequest(request, env)) ||
      new Response("Not found", { status: 404 })
    );
  },
};
