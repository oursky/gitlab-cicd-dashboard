config ?= makefileconfig.env
include $(config)
export $(shell sed 's/=.*//' $(config))

all: build push

build:
	@docker build -t ${APP_NAME}:latest .

push:
	@docker image tag ${APP_NAME}:latest ${REGISTRY}:latest
	@docker push ${REGISTRY}