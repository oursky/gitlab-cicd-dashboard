APP_NAME = gitlab-cicd-dashboard

.PHONY: all
build: build-image push-image deploy

.PHONY: test
test:
	yarn
	yarn lint

.PHONY: build-image
build-image:
	docker build -t $(APP_NAME) .
