const acknowledgement = require("../controllers/ack")

const express = require("express");
const Router = express.Router();

Router.get("/", acknowledgement);

module.exports = Router;