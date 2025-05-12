import { createKnockToolkit } from "@knocklabs/agent-toolkit/ai-sdk";
import { tool } from "ai";
import { z } from "zod";

import { AIAgent } from "./index";
import { issueCard } from "./api";
import { BASE_URL } from "./constants";

async function initializeToolkit(agent: AIAgent) {
  const toolkit = await createKnockToolkit({
    serviceToken: agent.env.KNOCK_SERVICE_TOKEN,
    permissions: {
      users: {
        manage: true,
      },
    },
    userId: agent.name,
  });

  const issueCardTool = tool({
    description:
      "Issue a new credit card to a customer. Use this tool when you're requested to issue a new card.",
    parameters: z.object({
      customerId: z.string(),
      name: z.string(),
    }),
    execute: async ({ customerId, name }) => {
      const card = await issueCard(customerId, name);
      agent.addIssuedCard(card);
      return card;
    },
  });

  const listCardsTool = tool({
    description:
      "List all of the cards issued to the user. Use this tool when you're requested to list cards.",
    parameters: z.object({
      customerId: z.string(),
    }),
    execute: async ({ customerId }) => {
      return agent.getIssuedCards();
    },
  });

  const tools = toolkit.requireHumanInput(
    { issueCard: issueCardTool },
    {
      onBeforeCallKnock: async (toolCall) => {
        if (toolCall.extra?.toolCallId) {
          agent.setToolCallStatus(
            toolCall.extra.toolCallId as string,
            "pending"
          );
        }
      },
      onAfterCallKnock: async (toolCall) => {
        if (toolCall.extra?.toolCallId) {
          agent.setToolCallStatus(
            toolCall.extra.toolCallId as string,
            "requested"
          );
        }
      },
      workflow: "approve-issued-card",
      actor: { id: agent.name },
      recipients: ["admin_user_1"],
      metadata: {
        approve_url: `${BASE_URL}/card-issued/approve`,
        reject_url: `${BASE_URL}/card-issued/reject`,
      },
    }
  );

  return {
    toolkit,
    tools: { ...tools, listCards: listCardsTool, ...toolkit.getTools("users") },
  };
}

export { initializeToolkit };
