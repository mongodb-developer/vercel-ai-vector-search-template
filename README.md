<p align="center">
  <a href="https://nextjs-fastapi-starter.vercel.app/">
    <img src="https://assets.vercel.com/image/upload/v1588805858/repositories/vercel/logo.png" height="96">
    <h3 align="center">Vercel and MongoDB Atlas AI chatbot template</h3>
  </a>
</p>

<p align="center">Simple Next.js + MongoDB Atlas AI boilerplate that uses Next.js, OpenAI with Atlas Vector Store for context.</p>

<br/>

## Introduction





## How It Works

The server is mapped into to Next.js app under `/app/api/`.


## Demo

TBD

## Deploy Your Own

You can clone & deploy it to Vercel with one click:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fmongodb-developer%2Fvercel-ai-vector-search-template&env=MONGODB_ATLAS_URI,OPENAI_API_KEY,ADMIN_API_KEY,VERCEL_BASE_URL,NODE_ENV)

## Developing Locally



## Getting Started

Create your MongoDB Deployment and get your connection URI:
- [Atlas quick start](https://www.mongodb.com/docs/atlas/getting-started/)

Set the needed environment variable on `.env.local`:
```bash
NODE_ENV=development
MONGODB_ATLAS_URI=<your_atlas_uri>
OPENAI_API_KEY=<your_openai_key>
ADMIN_API_KEY=<access_key_to_use_on_admin>
VERCEL_BASE_URL=<the_deployed_domain_url>
## Optional

```
First, install the dependencies:

```bash
npm install
# or
yarn
# or
pnpm install
```

Then, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

To load data go to [http://localhost:3000/admin](http://localhost:3000/admin) - Input the configured admin API key as well as upload the source file to be stored as context.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
- [MongoDB NodeJS](https://www.mongodb.com/docs/drivers/node/current/)
- [MongoDB for Artificial Intelligence](https://www.mongodb.com/use-cases/artificial-intelligence) - set of guides and resources to get started with GenAI and MongoDB.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!
