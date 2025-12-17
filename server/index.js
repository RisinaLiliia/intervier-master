const jsonServer = require("json-server");
const auth = require("json-server-auth");
const express = require("express");

const app = express();
const router = jsonServer.router("db.json");

app.use(express.json());

app.db = router.db;

app.use(auth);
app.use(router);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`JSON Server Auth running on http://localhost:${PORT}`);
});
