const gitlabAPI = require("./gitlabAPI");

module.exports.getProjectIDs = function getProjectIDs(requestedGroupID, token) {
  const apiToken = token;
  const groupID = requestedGroupID;
  const getProjectSearchParams = new URLSearchParams("");
  getProjectSearchParams.append("order_by", "last_activity_at");

  console.log(`Getting jobs of group: ${groupID}`);

  return gitlabAPI
    .getProjectsByGroupID(apiToken, groupID, getProjectSearchParams)

    .then((projects) => {
      const projectList = [];
      projects.map((project) => {
        const projectObj = {
          id: project.id,
          name: project.name,
        };
        projectList.push(projectObj);
        return projectList;
      });
      return projectList;
    });
};

module.exports.getJobs = function getJobs(requestedGroupID, token, projects, timezoneOffset) {
  const jobPromises = projects.map((project) => {
    return gitlabAPI.getJobsByProjectID(token, project.id).then((jobs) => {
      return jobs.map((job) => {
        const zuluCreatedTime = new Date(job.created_at.replace('Z', ''))
        const localCreatedTime = new Date(zuluCreatedTime.getTime() + (parseInt(timezoneOffset) * 36000))
        const createdMonth = localCreatedTime.getMonth() + 1
        const createdTimeStr = `${localCreatedTime.getFullYear()}`+
        `/${createdMonth}`+
        `/${localCreatedTime.getHours()}`+
        ` ${localCreatedTime.getHours()}`+
        `:${localCreatedTime.getMinutes()}`+
        `:${localCreatedTime.getSeconds()}`

        var startedTimeStr = "Not yet started"
        if(job.started_at != null){
          const zuluStartedTime = new Date(job.started_at.replace('Z',''))
          const localStartedTime = new Date(zuluStartedTime.getTime() + (parseInt(timezoneOffset) * 36000))
          const startedMonth = localStartedTime.getMonth() + 1
          startedTimeStr = `${localStartedTime.getFullYear()}`+
          `/${startedMonth}`+
          `/${localStartedTime.getHours()}`+
          ` ${localStartedTime.getHours()}`+
          `:${localStartedTime.getMinutes()}`+
          `:${localStartedTime.getSeconds()}`
        }
        return {...job, 
          project_name: project.name,
          created_at: createdTimeStr,
          started_at: startedTimeStr,
        }
      });
    });
  });
  return Promise.all(jobPromises).then((data) => {
    const flattenedJobArray = data.flat();
    const sortedData = flattenedJobArray.sort(
      (a, b) => a.created_at - b.created_at
    );
    let outputJobs = sortedData.filter((data) => {
      if (
        data.status === "running" ||
        data.status === "pending" ||
        data.status === "created"
      ) {
        return true;
      }
    });
    return outputJobs;
  });
};
