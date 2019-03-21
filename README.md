## [secretmsg.app](https://secretmsg.app)

A [Cloudflare Workers](https://www.cloudflare.com/products/cloudflare-workers/) and [Workers KV](https://www.cloudflare.com/products/workers-kv/) demo that encrypts messages in the browser and stores them in a global key-value store for easy sharing.

(This project was generated with [Cloudflare Worker App Kit](https://github.com/postlight/cloudflare-worker-app-kit))

### Crypto

All the cryptography is done in the browser using [Triplesec](https://keybase.io/triplesec). A library made by the folks at [Keybase](https://keybase.io/). They do publish an npm module for Node.js. Unfortunately, that doesn't include the browser version of the library, so I've included the latest release [in the repo](assets/js/).

## Scripts

```bash
# Start a dev server at http://localhost:3333
npm start

# Run jest tests
npm test

# Output production-ready JS & CSS bundles in dist folder
npm run build

# Build files, copy static assets to S3, and deploy worker to Cloudflare
npm run deploy

# Check source files for common errors
npm run lint
```

## Environment Variables

These environment variables are required to deploy the app.

```bash
BUCKET=bucket-name
AWS_KEY=XXXACCESSKEYXXX
AWS_SECRET=XXXXXXXXXSECRETXXXXXXXXX
AWS_REGION=us-east-1
CF_ZONE_ID=XXXXXXXXXWORKERZONEIDXXXXXXXXX
CF_KEY=XXXXCLOUDFLAREAUTHKEYXXXX
CF_EMAIL=account@email.com
```

If you want to use Workers KV you'll need the `CF_KV_NAMESPACES` environment variable during development and when you deploy.

```bash
# single KV namespace
CF_KV_NAMESPACES="NAME XXXXXXXXXNAMESPACEIDXXXXXXXXX"

# multiple namespace are supported, separate with a comma
CF_KV_NAMESPACES="NS_1 XXXXXXXNAMESPACEIDXXXXXXX, NS_2 XXXXXXXNAMESPACEIDXXXXXXX"
```

Similarly, you can bind any other strings like with `CF_WORKER_BINDINGS`

```bash
CF_WORKER_BINDINGS="KEY_1 value1, KEY_2 value2"
```
