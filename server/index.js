// index.js
const express = require("express");
const jsonServer = require("json-server");
const auth = require("json-server-auth");
const fs = require("fs");
const path = require("path");

const app = express();
const router = jsonServer.router("db.json");

// ==============================
// MIDDLEWARE
// ==============================
app.use(express.json());
app.use(auth); // auth должен идти ДО кастомных маршрутов

// ==============================
// КАСТОМНЫЕ МАРШРУТЫ
// ==============================

// Инициализация вопросов пользователя
app.post("/initUserQuestions", (req, res) => {
  const user = req.user;
  if (!user) return res.status(403).json({ error: "Unauthorized" });

  const userFile = path.join(__dirname, `user-${user.id}.json`);
  if (!fs.existsSync(userFile)) {
    const standardQuestions = router.db.get("questions").value();
    const userQuestions = standardQuestions.map((q) => ({
      ...q,
      answer: "",
      ownerId: user.id,
    }));
    fs.writeFileSync(
      userFile,
      JSON.stringify({ questions: userQuestions }, null, 2)
    );
  }

  res.json({ success: true });
});

// PATCH вопроса пользователя
app.patch("/questions/:id", (req, res) => {
  const user = req.user;
  if (!user) return res.status(403).json({ error: "Unauthorized" });

  const questionId = Number(req.params.id);
  const userFile = path.join(__dirname, `user-${user.id}.json`);

  let userData = { questions: [] };
  if (fs.existsSync(userFile)) {
    userData = JSON.parse(fs.readFileSync(userFile, "utf-8"));
  }

  const idx = userData.questions.findIndex((q) => q.id === questionId);
  if (idx >= 0) userData.questions[idx].answer = req.body.answer;
  else userData.questions.push({ id: questionId, answer: req.body.answer });

  fs.writeFileSync(userFile, JSON.stringify(userData, null, 2));
  return res.json({ success: true });
});

// GET вопросы с объединением общих и пользовательских
app.get("/questions", (req, res) => {
  const commonData = router.db.get("questions").value();
  const user = req.user;

  if (!user) return res.json({ questions: commonData });

  const userFile = path.join(__dirname, `user-${user.id}.json`);
  let userData = { questions: [] };
  if (fs.existsSync(userFile)) {
    userData = JSON.parse(fs.readFileSync(userFile, "utf-8"));
  }

  const merged = commonData.map((q) => {
    const userQ = userData.questions.find((uq) => uq.id === q.id);
    return userQ ? { ...q, answer: userQ.answer } : q;
  });

  res.json({ questions: merged });
});

// ==============================
// ROUTER JSON-SERVER
// ==============================
app.use(router);

// ==============================
// SERVER LISTEN
// ==============================
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
