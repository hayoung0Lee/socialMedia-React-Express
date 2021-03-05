const express = require("express");
const cookieParser = require("cookie-parser"); // for parsing cookie
const morgan = require("morgan"); //logging
const path = require("path");
const session = require("express-session");
const dotenv = require("dotenv");
const passport = require("passport");

dotenv.config();
const apiRouter = require("./routes/api");
const authRouter = require("./routes/auth");
const postRouter = require("./routes/post");
const userRouter = require("./routes/user");
const { sequelize } = require("./models");
const passportConfig = require("./passport");

const app = express();
passportConfig();
app.set("port", process.env.PORT || 8080);

sequelize
  .sync({ force: false })
  .then(() => {
    console.log("Successfully connected to DB");
  })
  .catch((err) => {
    console.error(err);
  });

app.use(morgan("dev"));
app.use("/img", express.static(path.join(__dirname, "uploads")));
app.use(express.json()); //http://expressjs.com/en/api.html#express.json

// app.use(express.urlencoded({extended: false}));

app.use(cookieParser(process.env.COOKIE_SECRET));

// TODO: 파악하기
app.use(
  session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
      httpOnly: true,
      secure: false,
    },
  })
);

// authentication
app.use(passport.initialize());
app.use(passport.session());

app.use("/api", apiRouter);
app.use("/auth", authRouter);
app.use("/post", postRouter);
app.use("/user", userRouter);

app.get("/", (req, res, next) => {
  res.status(200).send("This is Express Server for Hayoung's Social Media");
});

app.use((req, res, next) => {
  const error = new Error(`${req.method} ${req.url} doesn't exist`);
  error.status = 404;
  next(error);
});

app.use((err, req, res, next) => {
  //   res.locals.message = err.message;
  //   res.locals.error = process.env.NODE_ENV !== "production" ? err : {};
  //   console.log(res.locals);
  res.status(err.status || 500).send(`Error Occured - message: ${err.message}`);
});

app.listen(app.get("port"), () => {
  console.log("Listening at Port ", app.get("port"));
});
