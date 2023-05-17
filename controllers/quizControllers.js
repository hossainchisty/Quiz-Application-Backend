// Create a new quiz
app.post("/quizzes", async (req, res) => {
  try {
    const { question, options, rightAnswer, startDate, endDate } = req.body;
    const quiz = new Quiz({
      question,
      options,
      rightAnswer,
      startDate,
      endDate,
    });
    await quiz.save();
    res.status(201).json(quiz);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to create quiz" });
  }
});

// Get the active quiz
app.get("/quizzes/active", async (req, res) => {
  try {
    const now = moment();
    const quiz = await Quiz.findOne({
      status: "active",
      startDate: { $lte: now },
      endDate: { $gte: now },
    });
    if (quiz) {
      res.json(quiz);
    } else {
      res.status(404).json({ error: "No active quiz found" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to get active quiz" });
  }
});

// Get the result of a quiz by its ID
app.get("/quizzes/:id/result", async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (quiz) {
      if (quiz.status !== "finished") {
        res.status(400).json({ error: "Quiz is not yet finished" });
      } else {
        res.json({ result: quiz.rightAnswer });
      }
    } else {
      res.status(404).json({ error: "Quiz not found" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to get quiz result" });
  }
});

// Get all quizzes
app.get("/quizzes/all", async (req, res) => {
  try {
    const quizzes = await Quiz.find({});
    res.json(quizzes);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to get quizzes" });
  }
});
