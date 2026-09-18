const express = require('express');
const articleRouter = express.Router();
let articles = require('../articles');

// Middleware đọc body cho router
articleRouter.use(express.json());
articleRouter.use(express.urlencoded({ extended: true }));

// Đường dẫn: /articles
articleRouter.route('/')
  .get((req, res) => {
    res.status(200).json(articles);
  })
  .post((req, res) => {
    const newArticle = {
      id: articles.length + 1,
      title: req.body.title,
      date: req.body.date,
      text: req.body.text
    };
    articles.push(newArticle);
    res.status(201).json(newArticle);
  })
  .put((req, res) => {
    res.status(403).json({ message: 'PUT operation not supported on /articles' });
  })
  .delete((req, res) => {
    articles = [];
    res.status(200).json({ message: 'Deleting all articles' });
  });

// Đường dẫn: /articles/:id
articleRouter.route('/:id')
  .get((req, res) => {
    const id = parseInt(req.params.id);
    const item = articles.find(a => a.id === id);
    if (!item) return res.status(404).send('Article not found');
    res.status(200).json(item);
  })
  .post((req, res) => {
    res.status(403).send(`POST operation not supported on /articles/${req.params.id}`);
  })
  .put((req, res) => {
    const id = parseInt(req.params.id);
    const index = articles.findIndex(a => a.id === id);
    if (index === -1) return res.status(404).send('Article not found');

    articles[index] = { ...articles[index], ...req.body };
    res.status(200).json(articles[index]);
  })
  .delete((req, res) => {
    const id = parseInt(req.params.id);
    const index = articles.findIndex(a => a.id === id);
    if (index === -1) return res.status(404).send('Article not found');

    const deleted = articles.splice(index, 1);
    res.status(200).json(deleted);
  });

module.exports = articleRouter;