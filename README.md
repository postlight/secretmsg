## [secretmsg.app](https://secretmsg.app)

A [Cloudflare Workers](https://www.cloudflare.com/products/cloudflare-workers/) and [Workers KV](https://www.cloudflare.com/products/workers-kv/) demo that encrypts messages in the browser and stores them in a global key-value store for easy sharing. 

Cloudflare Workers remind me of progressive enhancement on the client. Instead of manipulating the DOM, workers give us full-control of the response using the same [API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API) available in the browser. They're lightweight and easy to deploy to 150+ locations around the world.

Going forward I think we're going to see a lot of applications moving away from a cluster of centrally located servers out to the point-of-delivery. It's fast, cheap and easy to work with. With a little more time to mature, this type of architecture might be hard to beat.

## How it works

### Two entry points
This app runs in two environments — [client](src/client.ts) and [worker](src/worker.ts). The client entry is typical of many single-page, JavaScript apps. The worker is where things are a little different.

Every request is going to hit our worker, so we do a little routing up-front, making sure our static assets are fetched from S3 if they're not cached or if it's an incoming message save it. Finally, if it's a request for a page, we run our app, fetch the needed data from Workers KV and render a html string for our response.

That's it, no origin server. Just some files on S3 and a little JS to handle requests.

### Crypto
All the cryptography is done in the browser using [Triplesec](https://keybase.io/triplesec). A library made by the folks at [Keybase](https://keybase.io/). They do publish an npm module for Node.js. Unfortunately, that doesn't include the browser version of the library, so I've included the latest release in the repo.

### Libraries
[Preact](https://preactjs.com/) handles components and rendering. [Unistore](https://github.com/developit/unistore) helps us manage app state.

### Dev tools
TypeScript compilation and JavaScript bundling are handled by [Parcel](https://parceljs.org/).

The local dev environment consists of two Node.js [servers](server.js). One delivers static assets, like the js bundles, images and css, basically standing in for S3. The other wraps [Cloudworker](https://github.com/dollarshaveclub/cloudworker) — a mock implementation of Cloudflare Workers from the folks at [Dollar Shave Club](https://twitter.com/DSCEngineering). It loads the worker.js bundle and handles requests just like the Cloudflare worker would.

## Build and run

```bash
# run local dev environment
npm run dev

# build worker and client js bundles
npm run build
```

## Deploy

Before running the deploy command, you'll need to setup a few services: [a S3 bucket ready to serve static files](https://docs.aws.amazon.com/AmazonS3/latest/dev/WebsiteHosting.html) (along with a [configured AWS cli](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-configure.html)), a [Cloudflare account with associated domain](https://support.cloudflare.com/hc/en-us/articles/201720164-Step-2-Create-a-Cloudflare-account-and-add-a-website), and a [Workers KV Namespace](https://developers.cloudflare.com/workers/kv/writing-data/#writing-data). Once everything is ready, drop the required values into environment variables and deploy!

```bash
# environment variables

# S3 bucket location
BUCKET=s3://secretmsg.app

# Cloudflare Zone ID identifies your domain
ZONE_ID=X0X0X0X0X0X0X0X0X0X0X0X0X0X0X0

# Cloudflare API auth key
CF_KEY=X0X0X0X0X0X0X0X0X0X0X0X0X0X0X0X0X0X0

# Cloudflare account email
CF_EMAIL=account@email.com

# Cloudflare Workers KV Namespace ID
KV_NAMESPACE=X0X0X0X0X0X0X0X0X0X0X0X0X0X0X0

# run deploy script
npm run deploy
```
