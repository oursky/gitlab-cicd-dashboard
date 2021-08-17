const gitlabAPI = require("./gitlabAPI");
const NodeCache = require("node-cache");
const projectIDsCache = new NodeCache();
const jobsCache = new NodeCache();

module.exports.getProjectIDs = function getProjectIDs(requestedGroupID, token) {
  const apiToken = token;
  const groupID = requestedGroupID;
  const getProjectSearchParams = new URLSearchParams("");
  getProjectSearchParams.append("order_by", "last_activity_at");

  console.log(`Getting jobs of group: ${groupID}`); 

  return gitlabAPI
    .getProjectsByGroupID(apiToken, groupID, getProjectSearchParams)

    .then((projects) => {
      const ids = projects.map((project) => project.id);
      projectIDsCache.set(`${groupID}`, ids, 1800);
      return ids;
    })
};

module.exports.getJobs = function getJobs(requestedGroupID, token, projectIDs){
  const jobPromises = projectIDs.map((projectID) =>
    gitlabAPI.getJobsByProjectID(token, projectID)
  )
  return Promise.all(jobPromises)
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
    jobsCache.set(`${requestedGroupID}`, outputJobs, 30);
    return outputJobs;
  });
}

// module.exports.getCachedProjectIDs = function getCachedProjectIDs(requestedGroupID, token) {
// const projectIDs = projectIDsCache.get(`${requestedGroupID}`)
//   if(projectIDs != null){
//     return new Promise((resolve, reject) => 
//     resolve(projectIDs))
//   }
//   return this.getProjectIDs(requestedGroupID, token)
// }

// module.exports.getCachedJobs = function getCachedJobs(requestedGroupID, token, projectIDs) {
//   const jobs = jobsCache.get(`${requestedGroupID}`)
//     if(jobs != null){
//       return new Promise((resolve, reject) => 
//       resolve(jobs))
//     }
//     return this.getJobs(requestedGroupID, projectIDs, token)
//   }

module.exports.getCachedData = function getCachedData(callback, requestedGroupID, token, projectIDs){
  var neededCache
  if(callback == this.getJobs){var neededCache = jobsCache.get(`${requestedGroupID}`)}
  if(callback == this.getProjectIDs){var neededCache = projectIDsCache.get(`${requestedGroupID}`)}
  if(neededCache != null){return new Promise((resolve, reject) => resolve(neededCache))}
  return callback(requestedGroupID, token, projectIDs)
}