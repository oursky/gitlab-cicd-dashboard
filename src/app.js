const getJobs = require("./getJobs");
const express = require("express");
const app = express();
const port = 8081;
const path = require("path");

app.use(express.static(path.join(__dirname)));

app.set("view engine", "ejs");

//app.get("redirect", (req,res) => res.render("pages/redirect"))

app.get("/groups/:id/jobs", function (req, res) {
  getJobs.getJobs(req.params.id).then((data) =>
    res.render("pages/index", {
      created: data.filter((data) => data.status === "created"),
      pending: data.filter((data) => data.status === "pending"),
      running: data.filter((data) => data.status === "running"),
    })
  );
  // .then((data) => console.log((data[0]).map(({status, ...rest})=> [status[1], rest])));
});

app.listen(port, () => {
  console.log(`listening at http://localhost:${port}`);
});
