//
const express = require("express");
const mustacheExpress = require("mustache-express");
const mongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectID;
const path = require("path");
const app = express();
const port = process.env.PORT || 8000;
const dbUrl = "mongodb://localhost:27017/robots";

let DB;
let USERS;

mongoClient.connect(dbUrl, function(err, db) {
  if (err) {
    console.warn("Error connecting to database", err);
  }

  DB = db;
  USERS = db.collection("users");
});

app.engine("mustache", mustacheExpress());
app.set("view engine", "mustache");
app.set("views", "./public");

app.use(express.static("public"));

app.get("/", function(req, res) {
  USERS.find({}).toArray(function(err, foundUsers) {
    if (err) {
      res.status(500).send(err);
    }
    res.render("index", { users: foundUsers });
  });
});

app.get("/unemployed", function(req, res) {
  USERS.find({ job: { $eq: null } }).toArray(function(err, unemployed) {
    if (err) {
      res.status(500).send(err);
    }
    res.render("index", { users: unemployed });
  });
});

app.get("/employed", function(req, res) {
  USERS.find({ job: { $ne: null } }).toArray(function(err, employed) {
    if (err) {
      res.status(500).send(err);
    }
    res.render("index", { users: employed });
  });
});

app.get("/profile/:id", function(req, res) {
  USERS.findOne({ id: parseInt(req.params.id) }, function(err, foundPerson) {
    if (err) {
      res.status(500).send(err);
    }
    console.log("foundPerson: ", foundPerson);
    res.render("profile", { users: foundPerson });
  });
});

app.listen(port, function() {
  console.log("Starting app on PORT: " + port + "...");
});
