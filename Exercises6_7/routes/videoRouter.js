const express = require('express');
const videoRouter = express.Router();

videoRouter.use(express.json());
videoRouter.use(express.urlencoded({ extended: true }));

// Đường dẫn: /videos
videoRouter.route('/')
  .get((req, res) => {
    res.status(200).end('Will send all the videos to you!');
  })
  .post((req, res) => {
    res.status(201).end(`Will add the video: ${req.body.title || ''}`);
  })
  .put((req, res) => {
    res.status(403).end('PUT operation not supported on /videos');
  })
  .delete((req, res) => {
    res.status(200).end('Deleting all videos');
  });

// Đường dẫn: /videos/:id
videoRouter.route('/:id')
  .get((req, res) => {
    res.status(200).end(`Will send details of video: ${req.params.id} to you!`);
  })
  .post((req, res) => {
    res.status(403).end(`POST operation not supported on /videos/${req.params.id}`);
  })
  .put((req, res) => {
    res.status(200).end(`Updating video: ${req.params.id}`);
  })
  .delete((req, res) => {
    res.status(200).end(`Deleting video: ${req.params.id}`);
  });

module.exports = videoRouter;