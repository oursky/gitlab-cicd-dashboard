# gitlab-cicd-dashboard

Usage:

1. Create a .env file
2. Add required lines and values (See .env-example)

```
yarn
yarn build-tailwindcss
node src/app.js
```

If using docker:

1. Add required ENV values to dockerfile
   e.g. ENV APP_ID=<APP ID> (See .env-example)

```
docker build -t gitlab-cicd-dashboard .
docker-compose up
```

Browser:

http://localhost:8081/groups/groupID/jobs
