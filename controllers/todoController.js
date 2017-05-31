'use strict';

const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// Connect to the database
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://user1990:admin@ds157641.mlab.com:57641/todo-node');

// Create a schema - this is like a blueprint for data
let todoSchema = new mongoose.Schema({
  item: String
});

// Create todo model
let Todo = mongoose.model('Todo', todoSchema);

let data = [{item: 'get food'}, {item: 'walk dog'}, {item: 'read a book'}];
let urlencodedParser = bodyParser.urlencoded({ extended: false });

module.exports = (app) => {

  app.get('/todo', (req, res) => {
    // Get data from mongodb and pass it to view
    Todo.find({}, (err, data) => {
      if (err) { throw err; }
      res.render('todo', { todos: data });
    });
  });

  app.post('/todo', urlencodedParser, (req, res) => {
    // Get data from the view and add it to mongodb
    var newTodo = Todo(req.body).save((err, data) => {
      if (err) { throw err; }
      res.json(data);
    });
  });

  app.delete('/todo/:item', (req, res) => {
    // Delete the requested item from mongodb
    Todo.find({item: req.params.item.replace(/\-/g, ' ')}).remove((err, data) => {
      if (err) { throw err; }
      res.json(data);
    });
  });
};
