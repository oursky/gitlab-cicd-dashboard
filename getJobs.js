module.exports.getJobs = function getJobs(requestedGroupID) {
  return new Promise((resolve) => {

    const apiToken = process.env.API_TOKEN; 
    const gitlabAPI = require("./gitlabAPI");
    const groupID = requestedGroupID;

    const getProjectSearchParams = new URLSearchParams("");
    getProjectSearchParams.append("order_by", "last_activity_at");

    console.log(`Getting jobs of group: ${groupID}`);
    gitlabAPI
      .getProjectsByGroupID(groupID, apiToken, getProjectSearchParams)

      .then((data) => {
        const ids = [];
        for (let i = 0; i < data.length; i += 1) {
          const item = data[i];
          ids[i] = item.id;
        }
        return ids;
      })
      .then((projectIDs) => {
        const data = [];
        for (let i = 0; i < projectIDs.length; i += 1) {
          data[i] = gitlabAPI.getJobsByProjectID(projectIDs[i], apiToken);
        }
        return Promise.all(data);
      })
      .then((data) => {
        const outputJobs = [];
        const flattenedJobArray = data.flat();
        const sortedData = flattenedJobArray.sort(
          (a, b) => a.created_at - b.created_at
        );
        for (let i = 0, j = 0; i < sortedData.length; i += 1) {
          const jobStatus = sortedData[i].status;

          if (
            jobStatus === "success" ||
            jobStatus === "canceled" ||
            jobStatus === "failed" ||
            jobStatus === "skipped"
          ) {
          } else {
            outputJobs[j] = sortedData[i];
            j++;
          }
        }
        resolve(outputJobs);
      });
  });
};
