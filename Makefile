## install: fetch and install dependencies
install:
	@echo "> Installing dependencies"
	go get

## build: output wasm binary to web folder
build:
	@echo "> Building binary"
	GOARCH=wasm GOOS=js go build -o web/assets/secretmsg.wasm cmd/secretmsg/*.go

## serve: run dev server
serve:
	@echo "> Starting dev server"
	@go run cmd/devserver/main.go --dir web

## deploy: push web folder up to s3
deploy: build
	@echo "> Deploying website"
	@aws s3 cp web/ s3://secretmsg.app --recursive --exclude ".DS_Store" --acl public-read
	@aws s3 cp s3://secretmsg.app/assets/secretmsg.wasm s3://secretmsg.app/assets/secretmsg.wasm --acl public-read --metadata-directive REPLACE --content-type "application/wasm"

help: Makefile
	@echo
	@echo " Choose a command:"
	@echo
	@sed -n 's/^##//p' $< | column -t -s ':' |  sed -e 's/^/ /'
	@echo
