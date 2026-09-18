const express = require('express');
const app = express();
const port = 3000;

// Import router
const articleRouter = require('./routes/articleRouter');
const videoRouter = require('./routes/videoRouter');

// Gắn route
app.use('/articles', articleRouter);
app.use('/videos', videoRouter);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});