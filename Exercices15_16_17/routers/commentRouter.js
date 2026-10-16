const express = require('express');
const Comment = require('../models/comment');
const commentRouter = express.Router();

commentRouter.use(express.json());
commentRouter.use(express.urlencoded({ extended: true }));

commentRouter.route('/')
  .get(async (req, res) => {
    try {
      const comment = await Comment.find().populate('article');
      res.json(comment);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  })
  .post(async (req, res) => {
    try {
      const comment = new Comment(req.body);
      await comment.save();
      res.status(201).json(comment);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  });

module.exports = commentRouter;