import { createKnockToolkit } from "@knocklabs/agent/ai-sdk";
import { tool } from "ai";
import { z } from "zod";

type Env = {
  KNOCK_SERVICE_TOKEN: string;
};

const addTool = tool({
  description: "Add two numbers together. ALWAYS use this tool when you are asked to do addition DO NOT assume the result.",
  parameters: z.object({
    a: z.number(),
    b: z.number(),
  }),
  execute: async ({ a, b }) => {
    return a + b;
  },
});

const subtractTool = tool({
  description: "Subtract two numbers together. ALWAYS use this tool when you are asked to do subtraction DO NOT assume the result.",
  parameters: z.object({
    a: z.number(),
    b: z.number(),
  }),
  execute: async ({ a, b }) => {
    return a - b;
  },
});

async function initializeToolkit(env: Env) {
  const toolkit = await createKnockToolkit({
    serviceToken: env.KNOCK_SERVICE_TOKEN,
    permissions: {},
  });

  const tools = toolkit.requireHumanInput({ add: addTool }, {
    workflow: "approve-tool-call",
    recipients: ["admin_user_1"],
  });

  return { toolkit, tools: { ...tools, subtract: subtractTool } };
}

export { initializeToolkit };
