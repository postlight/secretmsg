#!/bin/bash

TMP=".tmp"

# fresh build
npm install
npm run build

hash () {
  local FOLDER="${TMP}/js"
  local FILENAME="${2%.*}"
  local EXT="${2##*.}"
  local HASH=$(md5 -q "${1}/${2}")
  TRUNC_HASH=${HASH:0:10}
  mkdir -p $FOLDER
  cp "${1}/${2}" "${FOLDER}/${FILENAME}.${TRUNC_HASH}.${EXT}"
}

# prep assets
rm -rf .tmp
hash "dist" "client.js"
cp -r  js/ "${TMP}/js/"
cp -r css/ "${TMP}/css/"
cp -r images/ "${TMP}/images/"

# push assets to s3
aws s3 cp .tmp/ "${BUCKET}/assets" --only-show-errors --recursive --exclude ".DS_Store" --acl public-read

# set hash to env var on worker for rendering
METADATA=$(sed -e "s/\${TRUNC_HASH}/$TRUNC_HASH/" worker-metadata.json)

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
