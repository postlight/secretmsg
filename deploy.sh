#!/bin/bash

TMP=".tmp"

# fresh build
npm install
npm run build

# pass: "location folder" "destination folder" "filename"
hash () {
  local FOLDER="${TMP}/${2}"
  local FILENAME="${3%.*}"
  local EXT="${3##*.}"
  local HASH=$(md5 -q "${1}/${3}")
  local TRUNC_HASH=${HASH:0:10}
  mkdir -p $FOLDER
  cp "${1}/${3}" "${FOLDER}/${FILENAME}.${TRUNC_HASH}.${EXT}"
  echo "$TRUNC_HASH"
}

# prep assets
rm -rf .tmp
JS_HASH=$(hash "dist" "js" "client.js")
CSS_HASH=$(hash "css" "css" "secret.css")
cp -r  js/ "${TMP}/js/"
cp -r images/ "${TMP}/images/"

# push assets to s3
aws s3 cp .tmp/ "${BUCKET}/assets" --only-show-errors --recursive --exclude ".DS_Store" --acl public-read

# set hash to env var on worker for rendering
METADATA=$(sed -e "s/\${JS_HASH}/$JS_HASH/" \
               -e "s/\${CSS_HASH}/$CSS_HASH/" \
               -e "s/\${KV_NAMESPACE}/$KV_NAMESPACE/" \
               worker-metadata.json)

# update worker
curl -s -X PUT "https://api.cloudflare.com/client/v4/zones/${ZONE_ID}/workers/script" \
  -H "X-Auth-Email:${CF_EMAIL}" \
  -H "X-Auth-Key:${CF_KEY}" \
  -F "metadata=${METADATA};type=application/json" \
  -F "script=@dist/worker.js;type=application/javsacript" \
  -o /dev/null

# purge cache
curl -s -X POST "https://api.cloudflare.com/client/v4/zones/${ZONE_ID}/purge_cache" \
  -H "X-Auth-Email:${CF_EMAIL}" \
  -H "X-Auth-Key:${CF_KEY}" \
  -H "Content-Type: application/json" \
  --data '{"purge_everything":true}' \
  -o /dev/null

echo "https://secretmsg.com > Files pushed, worker updated, and cache purged"
