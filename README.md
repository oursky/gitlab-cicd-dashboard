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
```
docker build -t gitlab-cicd-dashboard .
docker-compose up
```

Browser:

http://localhost:8081/groups/ group ID /jobs


