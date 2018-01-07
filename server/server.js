var express = require('express');
var bodyParser = require('body-parser');
const fs = require('fs');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./model/todo');
var {User} = require('./model/user');

var port = 5555;
var app = express();

app.use((request, response, next) => {
  var currentTimestamp = new Date().toString();
  var logLine = `${currentTimestamp} : ${request.method} | ${request.url}`;
  console.log(logLine);
  fs.appendFileSync('server.log', logLine + '\n', (err) => {
    if(err){
      console.log('Unable to append log');
    }
  });
  next();
});

app.use(bodyParser.json());

app.post('/todos',(request, response) => {

  var todo = new Todo({
    text: request.body.text
  });

  todo.save().then((doc) => {
    response.send(doc);
  },(err) => {
    response.send(err);
  });
});

app.listen(port,() => {
  console.log(`API started on port ${port}`);
});
