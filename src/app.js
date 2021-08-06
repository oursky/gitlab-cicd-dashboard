const express = require("express");
const path = require("path");
const URL = require("url").URL;
const cookieParser = require("cookie-parser");
const getJobs = require("./getJobs");
const getToken = require("./getToken");

require("dotenv").config();
const config = require("./config");

const app = express();

const { origin, AppID, APP_SECRET, redirect_url, cookieAge } = config;
if([origin, AppID, APP_SECRET, redirect_url, cookieAge].includes("")){
  console.log("[WARNING] config.js has at least one empty property.")
}
const port = new URL(origin).port;

app.use(express.static(path.join(__dirname)));
app.set("views", __dirname + "/views");

app.set("view engine", "ejs");

app.use(cookieParser());

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

app.get("/groups/:id/jobs", function (req, res) {
  if (req.cookies.access_token === "" || req.cookies.access_token == null) {
    res.redirect(`${origin}/redirect/` + encodeURIComponent(req.originalUrl));
    return;
  }
  getJobs
    .getJobs(req.params.id, req.cookies.access_token)
    .then((data) =>
      res.render("pages/index", {
        created: data.filter((data) => data.status === "created"),
        pending: data.filter((data) => data.status === "pending"),
        running: data.filter((data) => data.status === "running"),
      })
    )
    .catch((err) =>
      res.render("pages/error", {
        error: `Cannot obtain Jobs. Pleae make sure the group ID is valid and being authorized to access it.`,
      })
    );
});

app.get("/error", (req, res) => {
  res.render("pages/error");
});

app.listen(port, () => {
  console.log(`listening at ${origin}`);
});
