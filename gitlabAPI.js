const fetch = require("node-fetch");

exports.getProjectsByGroupID = function getProjectsByGroupID(
  GroupID,
  key,
  searchParam
) {
  const projects = fetch(
    `https://gitlab.com/api/v4/groups/${GroupID}/projects?${searchParam}`,
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

exports.getJobsByProjectID = function getJobsByProjectID(ProjectID, key) {
  const jobs = fetch(`https://gitlab.com/api/v4/projects/${ProjectID}/jobs`, {
    headers: {
      "PRIVATE-TOKEN": key,
    },
  });
  return jobs.then((response) => {
    const data = response.json();
    return data;
  });
};
