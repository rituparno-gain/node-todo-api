var express = require('express');
var bodyParser = require('body-parser');
const fs = require('fs');

var {ObjectID} = require('mongodb');
var {mongoose} = require('./db/mongoose');
var {Todo} = require('./model/todo');
var {User} = require('./model/user');

var port = process.env.PORT || 5555;
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
    response.status(400).send(err);
  });
});

app.get('/todos', (request,response) => {
  Todo.find().then((todos) => {
    response.send({todos});
  }, (err) => {
    response.status(400).send(err);
  });
});

app.get('/todos/:id', (request,response) => {
  var id = request.params.id;

  if(!ObjectID.isValid(id)){
    return response.status(404).send();
  }

  Todo.findById(id).then((todoObj) => {
    if(todoObj){
      response.send({todoObj});
    }else{
      return response.status(404).send();
    }
  }, (err) => {
    response.status(400).send(err);
  });
});

app.listen(port,() => {
  console.log(`API started on port ${port}`);
});

module.exports = {app};
