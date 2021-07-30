const gitlabAPI = require("./gitlabAPI");


module.exports.getJobs = function getJobs(requestedGroupID, token) {
  const apiToken = token;
  const groupID = requestedGroupID;
  const getProjectSearchParams = new URLSearchParams("");
  getProjectSearchParams.append("order_by", "last_activity_at");

  console.log(`Getting jobs of group: ${groupID}`);
  return gitlabAPI
    .getProjectsByGroupID(apiToken, groupID, getProjectSearchParams)

    .then((projects) => {
      const ids = projects.map((project) => project.id);
      return ids;
    })
    .then((projectIDs) => {
      const jobPromises = projectIDs.map((projectID) =>
        gitlabAPI.getJobsByProjectID(apiToken, projectID)
      );
      return Promise.all(jobPromises);
    })

    .then((data) => {
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
