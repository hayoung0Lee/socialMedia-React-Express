const express = require("express");
const { isLoggedIn, isNotLoggedIn } = require("./middlewares");
const { Post, User } = require("../models");

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

router.get("/", async (req, res, next) => {
  try {
    const posts = await Post.findAll({
      inclue: {
        model: User,
        attributes: ["id", "nick"],
      },
      order: [["createdAt", "DESC"]],
    });

    res.status(200).send({
      title: `Hayoung's Social Media`,
      twits: posts,
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
});

module.exports = router;
