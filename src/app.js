const express = require("express");
const path = require("path");
const URL = require("url").URL;
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const getData = require("./getData");
const getToken = require("./getToken");

require("dotenv").config();
const config = require("./config");
const { origin, AppID, APP_SECRET, redirect_url, cookieAge, DB_URL } = config;

const app = express();

if ([origin, AppID, APP_SECRET, redirect_url, cookieAge].includes("")) {
  console.warn("[WARNING] config.js has at least one empty property.");
}

app.use(express.static(path.join(__dirname)));
app.set("views", __dirname + "/views");

app.set("view engine", "ejs");

app.use(cookieParser());

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
      })
    );
});

const LogItem = require("./models/LogItem");

app.get("/groups/:id/jobs", function (req, res) {
  if (req.cookies.access_token === "" || req.cookies.access_token == null) {
    res.redirect(`${origin}/redirect/` + encodeURIComponent(req.originalUrl));
    return;
  }

  // if (!DB_URL) {
  //   const newLog = new LogItem({
  //     request: encodeURIComponent(req.originalUrl),
  //   });
  //   newLog.save().then((log) => console.log(log));
  // }

  getData
    .getCachedData(
      getData.getProjectIDs,
      req.params.id,
      req.cookies.access_token
    )
    .then((projectIDs) => {
      //ADD Projects to CACHE
      return getData.getCachedData(
        getData.getJobs,
        req.params.id,
        req.cookies.access_token,
        projectIDs
      );
    })
    .then((data) => {
      //ADD req.cookies + groupID to cache
      //ADD Jobs to CACHE
      res.render("pages/index", {
        created: data.filter((data) => data.status === "created"),
        pending: data.filter((data) => data.status === "pending"),
        running: data.filter((data) => data.status === "running"),
      });
    })
    .catch((err) => {
      console.log(err);
      res.render("pages/error", {
        error: `Cannot obtain Jobs. Pleae make sure the group ID is valid and being authorized to access it.`,
      });
    });
});

app.get("/error", (req, res) => {
  res.render("pages/error");
});

app.listen(new URL(origin).port || 8081, () => {
  console.log(`[INFO] listening at ${origin}`);
});
