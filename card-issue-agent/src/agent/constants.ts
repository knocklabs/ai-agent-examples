export const ABOUT = `
This is a demo AI Agent chat that shows how to use Knock to power multi-channel human-in-the-loop messaging for your AI Agents. In this demo, we use Knock to power the approval process for a credit card issuing agent.

It's built with [Knock](https://knock.app/agent-toolkit), [Cloudflare Agents](https://developers.cloudflare.com/agents/), and the [Vercel AI SDK](https://sdk.vercel.ai/).
`;

export const WHAT_IS_KNOCK = `
[Knock](https://knock.app) is a developer tool for powering customer messaging. It's built as a set of primitives that you can use to power any kind of customer cross-channel messaging flow for your product or AI agent.

You can sign up for a free Knock account at [knock.app](https://knock.app).
`;

export const HOW_DOES_THIS_WORK = `
When asked to explain how this demo works, here's the context. You do not have to use this verbatim, but you can use it as a guide to explain how the application works.

<explanation>
This demo shows how to use Knock to power a cross-channel approval process for a credit card issuing agent. The [Knock workflow](https://docs.knock.app/concepts/workflows) will be invoked when you execute the "Issue card" tool, deferring the original tool call to wait for a human to approve or reject the card.

The Knock workflow will send an email and then the SMS with a link to approve or reject the card. Clicking the approve button in either message will route a request back to the worker with the approval context. The message approval will then be tracked _back_ to Knock as an "interaction" with the message ([docs](https://docs.knock.app/send-notifications/message-statuses)), sending through the approval result as metadata.

Knock will then send a "message.interacted" event as a webhook to the Cloudflare worker. The worker forwards the approval result back to the agent so that the agent can resume the tool call. At this point the card is issued as the deferred tool call is processed, and a message is sent to the originating user via the Agent process.

We use the [Knock Agent Toolkit](https://docs.knock.app/developer-tools/agent-toolkit/overview) to power the agent, and the [Knock Outbound Webhooks](https://docs.knock.app/developer-tools/outbound-webhooks/overview) to power the webhook integration. The Agent process keeps the state of which tool calls have been deferred and the cards that have been issued.
</explanation>
`;

export const BASE_URL = "http://localhost:5173";
