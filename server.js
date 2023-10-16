const express = require("express");
const app = express();
const path = require("path");
const cors = require('cors');
const corsOptions = require('./config/corsOptions');
const logEvents = require('./middleware/logEvents');
const { logger } = require('./middleware/logEvents');
const errorHandler = require('./middleware/errorHandler');
const PORT = process.env.PORT || 3500;

app.use(logger);

//Cross Origin Resource Sharing
app.use(cors(corsOptions));


// built-in middleware to handle urlencoded data
// in other words, form data:
// 'content-type: application/x-www-form-urlencoded'
app.use(express.urlencoded({ extended: false }));
// built-in middleware for json
app.use(express.json());

// server static file
app.use('/', express.static(path.join(__dirname, '/public')));

//routes
app.use('/', require('./routes/root'));
app.use('/employees', require('./routes/api/employees'));


app.all("*", (req, res) => {
  res.status(404).sendFile(path.join(__dirname, "views", "404.html"));
});

app.use(errorHandler);

// app.use(function(err, req, res, next) {
//   console.error(err.stack);
//   res.status(500).send(err.message);
//   })
// 에러처리는 그룹웨어 중에서도 맨 마지막 next()가 없으면 제일 마지막에 실행

app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});
