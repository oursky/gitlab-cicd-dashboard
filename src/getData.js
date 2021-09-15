const gitlabAPI = require("./gitlabAPI");
const getLocalTime = require("./getLocalTime");

module.exports.getProjectIDs = function getProjectIDs(requestedGroupID, token) {
  const apiToken = token;
  const groupID = requestedGroupID;
  const getProjectSearchParams = new URLSearchParams("");
  getProjectSearchParams.append("order_by", "last_activity_at");

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

module.exports.getJobs = function getJobs(
  requestedGroupID,
  token,
  projects,
  timezone
) {
  console.log(timezone);
  const jobPromises = projects.map((project) => {
    return gitlabAPI.getJobsByProjectID(token, project.id).then((jobs) => {
      return jobs.map((job) => {
        const createdTimeStr = getLocalTime.getTimeByTimezone(
          job.created_at,
          timezone
        );
        const startedTimeStr =
          getLocalTime.getTimeByTimezone(job.started_at, timezone) ||
          "Not yet started";
        return {
          ...job,
          project_name: project.name,
          created_at: createdTimeStr,
          started_at: startedTimeStr,
        };
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
