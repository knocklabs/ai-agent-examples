# React Chat with human-in-the-loop approval

This application demonstrates using Knock to power a deferred tool call as part of a human-in-the-loop interaction in an Agent chat.

## Powered by

- [Cloudflare Workers](https://developers.cloudflare.com/workers/)
- [Cloudflare Agents SDK](https://developers.cloudflare.com/agents/api-reference/)
- [Vercel AI SDK](https://sdk.vercel.ai/)
- [Knock Agent Toolkit](https://docs.knock.app/developer-tools/agent-toolkit/overview)

## Prerequisites

- A [Knock account](https://dashboard.knock.app/signup)
  - A service token configured
  - A `approve-tool-call` workflow configured with a single in-app feed channel step
  - A `message.interacted` webhook configured that sends a request back to `http://localhost:5173/incoming/webhook`
- A [Cloudflare developer account](https://dash.cloudflare.com/sign-up/workers?_gl=1*s0kyay*_gcl_au*MTg1MTMyOTk5NS4xNzQ0ODEyNzA3*_ga*MTc1NTAwNzc3NS4xNzQ0ODEyNzA3*_ga_SQCRB0TXZW*MTc0NTQzNjU1NC41LjEuMTc0NTQzNjU1OS41NS4wLjA.)

## Development

Install dependencies:

```bash
npm install
```

Start the development server with:

```bash
npm run dev
```

Your application will be available at [http://localhost:5173](http://localhost:5173).

## Production

Build your project for production:

```bash
npm run build
```

Preview your build locally:

```bash
npm run preview
```

Deploy your project to Cloudflare Workers:

```bash
npx wrangler deploy
```

## Additional Resources

- [Cloudflare Workers Documentation](https://developers.cloudflare.com/workers/)
- [Vite Documentation](https://vitejs.dev/guide/)
- [React Documentation](https://reactjs.org/)
- [Hono Documentation](https://hono.dev/)
