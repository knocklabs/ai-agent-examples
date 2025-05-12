import { createKnockToolkit } from "@knocklabs/agent-toolkit/ai-sdk";
import { tool } from "ai";
import { z } from "zod";

import { AIAgent } from "./index";
import { issueCard } from "./api";
import { BASE_URL, HOW_DOES_THIS_WORK } from "./constants";

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
      "Issue a new credit card to a customer. Use this tool when you're requested to issue a new card. When this tool is used, the card will only be issued once an admin has approved the card.",
    parameters: z.object({
      customerId: z.string(),
      name: z.string().describe("The name of the card. This is REQUIRED."),
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

  const explainTool = tool({
    description:
      "Explain how this demo works. Use this tool if you're asked to explain how this demo application works.",
    parameters: z.object({}),
    execute: async () => {
      return HOW_DOES_THIS_WORK;
    },
  });

  const tools = toolkit.requireHumanInput(
    { issueCard: issueCardTool },
    {
      onBeforeCallKnock: async (toolCall) => {
        agent.setToolCallStatus(toolCall.id, "pending");
      },
      onAfterCallKnock: async (toolCall) => {
        agent.setToolCallStatus(toolCall.id, "requested");
      },
      workflow: "approve-issued-card",
      actor: {
        id: agent.name,
        email: `user_${agent.name}@example.com`,
        name: "Jane Doe",
      },
      recipients: ["admin_user_1"],
      metadata: {
        approve_url: `${BASE_URL}/card-issued/approve`,
        reject_url: `${BASE_URL}/card-issued/reject`,
      },
    }
  );

  return {
    toolkit,
    tools: {
      ...tools,
      listCards: listCardsTool,
      explainTool,
      ...toolkit.getTools("users"),
    },
  };
}

export { initializeToolkit };
