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
      const projectList = []
      projects.map((project) => {
        Project = {
          "id": project.id,
          "name": project.name
        }
        projectList.push(Project)
        return projectList
      });
      return projectList;
    });
};

module.exports.getJobs = function getJobs(requestedGroupID, token, projects) {
  //projects -> {id:xxx, name:xxx}* n
  const jobPromises = projects.map((project) => {
      return gitlabAPI.getJobsByProjectID(token, project.id)
      .then(jobs => {
        return jobs.map(job => ({...job, project_name: project.name}))
      })
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