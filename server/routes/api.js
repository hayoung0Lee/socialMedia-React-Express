const express = require("express");
const { isLoggedIn, isNotLoggedIn } = require("./middlewares");
const { Post, User, Hashtag } = require("../models");

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

router.get("/hashtag", async (req, res, next) => {
  const query = req.query.hashtag;
  if (!query) {
    return res.status(200).send("no hashtag");
  }
  try {
    const hashtag = await Hashtag.findOne({ where: { title: query } });
    let posts = [];
    if (hashtag) {
      posts = await hashtag.getPosts({ include: [{ model: User }] });
    }

    return res.status(200).send({
      hashtag: query,
      twits: posts,
    });
  } catch (error) {
    console.error(error);
    return next(error);
  }
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
      followerCount: req.user ? req.user.Followers.length : 0,
      followingCount: req.user ? req.user.Followings.length : 0,
      // FIXME: follower? following..?
      followerIdList: req.user ? req.user.Followers.map((f) => f.id) : [],
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
});

module.exports = router;
