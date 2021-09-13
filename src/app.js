const express = require("express");
const path = require("path");
const URL = require("url").URL;
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const getData = require("./getData");
const getToken = require("./getToken");
const NodeCache = require("node-cache");
const withCache = require("./withCache");
const getTimezoneAPI = require("./getTimezone");
const projectIDsCache = new NodeCache();
const jobsCache = new NodeCache();

const read = require("fs").readFileSync;
const ejs = require("ejs");

require("dotenv").config();
const config = require("./config");
const {
  origin,
  AppID,
  APP_SECRET,
  redirect_url,
  cookieAge,
  DB_URL,
  CACHE_TIMEOUT,
} = config;

const app = express();

const cardTemplate = ejs.compile(
  read("src/views/partials/singleJobCard.ejs", "utf-8")
);

if ([origin, AppID, APP_SECRET, redirect_url, cookieAge].includes("")) {
  console.warn("[WARNING] config.js has at least one empty property.");
}

app.use(express.static(path.join(__dirname)));
app.set("views", __dirname + "/views");

app.set("view engine", "ejs");

app.use(cookieParser());

const getProjectIDs = withCache(getData.getProjectIDs, {
  cacheStorage: projectIDsCache,
  ttl: 1800,
});
const getJobs = withCache(getData.getJobs, {
  cacheStorage: jobsCache,
  ttl: CACHE_TIMEOUT / 1000,
});

if (!DB_URL) {
  mongoose
    .connect(`${DB_URL}`, { useNewUrlParser: true })
    .then(() => console.log("[INFO] MongoDB Connected."))
    .catch((err) => {
      console.warn(
        `[WARNING] MongoDB connection failed, logging feature will be disabled.`
      );
    });
}

app.get("/redirect/:state", (req, res) => {
  res.redirect(
    `https://gitlab.com/oauth/authorize?` +
      `&client_id=${AppID}` +
      `&redirect_uri=${origin}/redirect` +
      `&response_type=code` +
      `&state=${req.params.state}` +
      `&scope=profile+read_api`
  );
});

app.get("/redirect", (req, res) => {
  const code = req.query.code;
  const state = req.query.state;
  getToken
    .getToken(AppID, code, APP_SECRET, redirect_url)
    .then((response) => {
      res.cookie(`access_token`, response.access_token, { maxAge: cookieAge });
      res.redirect(`${origin}${state}`);
    })
    .catch((err) =>
      res.render("pages/error", {
        error:
          `Cannot obtain access token. ` +
          `Please make sure Application ID, Application Secret, Redirect URL are valid`,
        details: err,
      })
    );
});

const LogItem = require("./models/LogItem");

app.get("/groups/:id/jobs", function (req, res) {
  console.log(`${req.headers["x-forwarded-for"] || "Local"}(requested) -> Group: ${req.params.id}`)
  const clientTimezone = getTimezoneAPI.getTimezone(
    req.headers[`x-forwarded-for`]
  );
  if (req.cookies.access_token === "" || req.cookies.access_token == null) {
    res.redirect(`${origin}/redirect/` + encodeURIComponent(req.originalUrl));
    return;
  }

  if (!DB_URL) {
    const newLog = new LogItem({
      request: encodeURIComponent(req.originalUrl),
    });
    newLog.save().then((log) => console.log(log));
  }

  getProjectIDs(req.params.id, req.cookies.access_token)
    .then((projects) => {
      return getJobs(
        req.params.id,
        req.cookies.access_token,
        projects,
        clientTimezone
      );
    })
    .then((data) => {
      const createdJobs = data.filter((data) => data.status === "created");
      const pendingJobs = data.filter((data) => data.status === "pending");
      const runningJobs = data.filter((data) => data.status === "running");

      const createdCards = createdJobs.map((job) => {
        return {
          name: job.project_name,
          tags: job.tag_list,
          html: cardTemplate({ job: job }),
        };
      });
      const pendingCards = pendingJobs.map((job) => {
        return {
          name: job.project_name,
          tags: job.tag_list,
          html: cardTemplate({ job: job }),
        };
      });
      const runningCards = runningJobs.map((job) => {
        return {
          name: job.project_name,
          tags: job.tag_list,
          html: cardTemplate({ job: job }),
        };
      });
      res.render("pages/index", {
        created: createdJobs,
        pending: pendingJobs,
        running: runningJobs,
        created_cards: createdCards,
        pending_cards: pendingCards,
        running_cards: runningCards,
        cache_timeout: CACHE_TIMEOUT,
        groupID: req.params.id,
      });
    })
    .catch((err) => {
      console.log(err);
      res.render("pages/error", {
        error: `Cannot obtain Jobs. Pleae make sure the group ID is valid and being authorized to access it.`,
        details: err,
      });
    });
});

app.get("/error", (req, res) => {
  res.render("pages/error");
});

app.get("/api/groups/:id/jobs", (req, res) => {
  const clientTimezone = getTimezoneAPI.getTimezone(
    req.headers[`x-forwarded-for`]
  );
  getProjectIDs(req.params.id, req.cookies.access_token)
    .then((projectIDs) =>
      getJobs(
        req.params.id,
        req.cookies.access_token,
        projectIDs,
        clientTimezone
      )
    )
    .then((jobs) => {
      return jobs.filter((jobs) => jobs.status === req.query.status);
    })
    .then((filteredJobs) => {
      const jobsArr = filteredJobs.map((job) => {
        return {
          name: job.project_name,
          tags: job.tag_list,
          html: cardTemplate({ job: job }),
        };
      });
      res.send(jobsArr);
    });
});

app.listen(new URL(origin).port || 8081, () => {
  console.log(`[INFO] listening at ${origin}`);
});
