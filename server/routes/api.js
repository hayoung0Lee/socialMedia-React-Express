const express = require("express");
const { isLoggedIn, isNotLoggedIn } = require("./middlewares");

const router = express.Router();

router.use((req, res, next) => {
  //   res.locals.user = null;
  //   res.locals.followerCount = 0;
  //   res.locals.followingCount = 0;
  //   res.locals.followerIdList = [];
  next();
});

router.get("/profile", isLoggedIn, (req, res) => {
  res.status(200).send({ title: `My Profile` });
});

router.get("/join", isNotLoggedIn, (req, res) => {
  res.status(200).send({ title: `Sign Up` });
});

router.get("/", (req, res) => {
  const twits = [];
  res.status(200).send({ title: `Hayoung's Social Media`, twits });
});

module.exports = router;
