const express = require('express');
const mongoose = require('mongoose');

const articleRouter = require('./routes/articleRouter');
const commentRouter = require('./routes/commentRouter');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Kết nối MongoDB (thay đổi URL nếu DB của bạn tên khác)
mongoose.connect('mongodb://127.0.0.1:27017/node-mongoose')
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Could not connect to MongoDB:', err));

// Mount routers
app.use('/articles', articleRouter);
app.use('/comments', commentRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

module.exports = app;