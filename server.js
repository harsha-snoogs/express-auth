require("dotenv").config();
const express = require("express");
const authorizeRole = require("./authorize");
const auth = require("./routes/auth");
const authenticate = require("./middleware/authenticate");
const user = require("./routes/user");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());


app.get("/", authenticate, authorizeRole(["staff"]), (req, res) => {
  res.json({ status: "ok", message: "Reaching server succesfully" });
});

app.use("/auth", auth);

app.use("/user", user);

app.listen(3000, () => {
  console.log("App listening on port 3000");
});
