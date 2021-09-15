# gitlab cicd dashboard

<!-- ABOUT THE PROJECT -->
## About The Project

Description:
* A cicd dashboard, displaying active jobs of a given group
* Uses Gitlab API to obtain projects and jobs

Purpose:
* Visualize jobs queuing, grouped by their status

<img alt="Screenshot 2021-09-15 at 4 08 29 PM" src="https://user-images.githubusercontent.com/85364009/133396033-c93a0fbc-b17c-48d9-a260-fa308f5a900d.png" height="216px" width="384px">
Oursky example: (https://gitlab-cicd-dashboard.pandawork.com/groups/794774/jobs)


## Functionality:
* Show "Created", "Pending" and "Running" job cards in different columns
  * Each card contains:
    - Project Name
    - Job's ID
    - Created Time (converted to user IP timezone, default: Asia/Hong_Kong)
    - Started Time (converted to user IP timezone, default: Asia/Hong_Kong)
    - Tags (Machine Type)
* Grouping by job's info : by machine type, project name

* handles response: 
  * /groups/`groupID`/jobs
  * /groups/`groupID`/jobs?groupby=`catagory`
* Requires gitlab login
  * OAuth framework
  * Request Gitlab APIs

* Cache
  * Project IDs ttl: 30 seconds
  * Job IDs ttl: 5 seconds

* Each column refreshes every 5 seconds
  * Will pause refresh if user is inactive for 30 seconds (mouse movement)

* Login token expires every 24 hours

* Obtain user IP and get timezone 

<!-- GETTING STARTED -->
## Getting Started

1. Create a .env file
2. Add required lines and values (See .env-example)

```
yarn
yarn build-tailwindcss
node src/app.js
```

If using docker to enable db logging:

1. Add required ENV values to dockerfile
   e.g. ENV APP_ID=<APP ID> (See .env-example)

```
docker build -t gitlab-cicd-dashboard .
docker-compose up
```

<!-- USAGE EXAMPLES -->
## Usage

1. http://localhost:8081/groups/groupID/jobs
2. Login gitlab




