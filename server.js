require('dotenv').config();
var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var cors = require('cors')

var app = express();

app.use(cors())

app.use(express.static('public'));

app.use(bodyParser.urlencoded({extended: false}));

app.use(bodyParser.json());

mongoose.connect('mongodb://localhost/clothes');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('Database conntected!')
});

//SCHEMA
var Schema = mongoose.Schema;

var dressSchema = new Schema({
  style: String,
  color: String,
  size:  Schema.Types.Mixed,
});

//MODEL
var Dress = mongoose.model('Dress', dressSchema);

//API GET REQUEST
app.get('/dress/:id?', function(req, res){
  var queryObj = {};
  if (req.params.id){
    queryObj._id = req.params.id
  }
  Dress.find(queryObj).exec(function(err, dress){
    if (err) return res.status(500).send(err);
    res.status(200).json(dress);
  });
});

//API POST REQUEST
app.post('/dress', function(req, res){
  console.log(req.body);
  var dressData = req.body;
  var newDress =  new Dress(dressData);
  newDress.save(function(err, dress){
    if (err) return res.status(500).send(err);
    res.sendStatus(201);
  });
});

//API PUT REQUEST
app.put('/dress/:id', function(req, res){
  var updateableDressId = req.params.id;
  Dress.update({ _id: updateableDressId }, req.body, function (err, raw) {
      if (err) return handleError(err);
      if(raw.nModified === 0 ) return res.sendStatus(404);
      console.log('The raw response from Mongo was ', raw);
      return res.sendStatus(200);
  });
});

//API DELETE REQUEST
app.delete('/dress/:id', function(req, res){
  console.log('Dress to be deleted: ', req.params.id);
  var deletableDressId = req.params.id;
  Dress.remove({_id: deletableDressId}, function(err, deletedDress){
    if(err) return res.status(500).send(err);
    res.status(204).json(deletedDress);
  });

});


app.listen(3000, function(){
  console.log("Server listening");
});
