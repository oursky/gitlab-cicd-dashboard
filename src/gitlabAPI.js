const fetch = require("node-fetch");

exports.getProjectsByGroupID = function getProjectsByGroupID(
  key,
  groupID,
  searchParam
) {
  const projects = fetch(
    `https://gitlab.com/api/v4/groups/${groupID}/projects?${searchParam}`,
    {
      headers: {
        "PRIVATE-TOKEN": key,
      },
    }
  );
  return projects.then((response) => {
    const data = response.json();
    return data;
  });
};

exports.getJobsByProjectID = function getJobsByProjectID(key, projectID) {
  const jobs = fetch(`https://gitlab.com/api/v4/projects/${projectID}/jobs`, {
    headers: {
      "PRIVATE-TOKEN": key,
    },
  });
  return jobs.then((response) => {
    const data = response.json();
    return data;
  });
};
