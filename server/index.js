const express = require("express");
const jsonServer = require("json-server");
const auth = require("json-server-auth");

const app = express();
const router = jsonServer.router("db.json");

app.use(express.json());
app.use(auth({ expiresIn: "7d" }));
app.use(router);

app.listen(3000, () => console.log("API http://localhost:3000"));
