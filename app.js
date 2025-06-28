const express = require("express");

const app = express();

const usersRouter = require("./routes/usersRouter");

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use("/", usersRouter);

app.listen(process.env.PORT || 8080, "0.0.0.0", () =>
  console.log(`Express app listening on port ${process.env.PORT || 8080}`)
);
