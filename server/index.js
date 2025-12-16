const jsonServer = require("json-server");
const auth = require("json-server-auth");
const express = require("express");
const path = require("path");

const app = express();
const router = jsonServer.router(path.join(__dirname, "db.json"));
const rules = auth.rewriter(require("./routes.json"));

app.db = router.db;

app.use(rules);
app.use(auth);
app.use(router);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`JSON Server Auth running on http://localhost:${PORT}`);
});
