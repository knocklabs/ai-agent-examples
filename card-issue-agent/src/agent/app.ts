import { getAgentByName, routeAgentRequest } from "agents";
import { Hono } from "hono";
import { Knock } from "@knocklabs/node";
import { Env } from ".";

const app = new Hono();

const knock = new Knock(process.env.KNOCK_API_KEY);

app.get("/card-issued/approve", async (c) => {
  const { messageId } = c.req.query();

  await knock.put(`/v1/messages/${messageId}/interacted`, {
    metadata: {
      status: "approved",
    },
  });

  return c.text("Approved");
});

app.post("/incoming/knock/webhook", async (c) => {
  const body = await c.req.json();
  const env = c.env as Env;

  // Find the user ID from the tool call for the original issuer.
  // TODO: move this to the `body.data.actors[0]` on the Message object.
  // this requires us using the `actor` on the workflow.
  const userId = body?.data?.actors[0];

  if (!userId) {
    return c.text("No user ID found", { status: 400 });
  }

  const existingAgent = await getAgentByName(env.AIAgent, userId);

  if (existingAgent) {
    const result = await existingAgent.handleIncomingWebhook(body);

    return c.json(result);
  } else {
    return c.text("Not found", { status: 404 });
  }
});

app.get("*", async (c) => {
  return (
    // Route the request to our agent or return 404 if not found
    (await routeAgentRequest(c.req.raw, c.env)) ||
    c.text("Not found", { status: 404 })
  );
});

export default app;
