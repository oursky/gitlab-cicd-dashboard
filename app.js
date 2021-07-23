const getJobs = require("./getJobs");
const express = require("express");
const app = express();
const port = 8081;
const path = require("path");

app.use(express.static(path.join(__dirname)));

app.set("view engine", "ejs");

app.get("/groups/:id/jobs", function (req, res) {
  getJobs.getJobs(req.params.id).then((data) => res.render("pages/index"));
});

app.listen(port, () => {
  console.log(`listening at http://localhost:${port}`);
});
