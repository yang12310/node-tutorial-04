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
//url이 없으면 항상 작동 
app.use(cors(corsOptions));


// built-in middleware to handle urlencoded data
// in other words, form data:
// 'content-type: application/x-www-form-urlencoded'
app.use(express.urlencoded({ extended: false }));
// built-in middleware for json
app.use(express.json());

// server static file
//static folder를 지정하는게 중요 
//url이 있으면 거기서 끝나서 밑으로 가지않음. 즉 그 밑은 다 무시
app.use('/', express.static(path.join(__dirname, '/public')));

//routes
//router를 선언하는 것이 중요
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
}); //반드시 필요한 것 무한루프를 돌기위함
