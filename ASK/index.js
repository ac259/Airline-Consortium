var express = require('express'); 								//Requiring express dependency to create a server
var router = express.Router();
var app = express();
var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://localhost:27017';
const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(express.static('src'));
app.use(express.static('../ask-contract/build/contracts'));
const path = require('path');
const db = require("./db");
const collection = "AirlineB";

var flag = false;
// app.get('/getProposals', function (req, res) {
//   MongoClient.connect('mongodb://localhost:27017', { useNewUrlParser: true }, (err, client) => {
//   // Client returned
//   var db = client.db('dogs');
//   db.collection("dogs").find({}).toArray(function(err, result) {
//   if (err) throw err;
//    console.log(result);
//    client.close();
//    res.send(result);			//On getting a request we render our base html page
//   	});
//   });
// });

app.get('/home',(req,res)=>{
  res.sendFile(path.join(__dirname,'somefile.html'));
});

app.get('/getInfo',(req,res)=>{
  console.log("inside");
  db.getDB().collection(collection).find({}).toArray((err,documents)=>{
    if(err)
      console.log(err);
    else{
      var doc = documents; 
      console.log(doc[0]);
      res.json(documents);
    }
  })
});


// without this the bodyParser doesn't work!
app.use(bodyParser.urlencoded({
  extended: true
}));

app.get('/submit',(req,res)=>{
  res.sendFile(path.join(__dirname,'src/submit.html'));
});
// Ticket exchange check 
app.post('/reqForm', function(req, res, next) {
  //var req_source = req.body.fromCity;
  //console.log(req_source);
  console.log("Inside Post request");
  db.getDB().collection(collection).find({}).toArray((err,documents)=>{
    if(err)
      console.log(err);
    else{
      var doc = documents;
      console.log(doc.length);
      for(i=0; i<doc.length; i++)
      {
        if(doc[i].fromCity == req.body.fromCity && doc[i].toCity == req.body.toCity && doc[i].nSeats >= req.body.noSeats )
        {
          console.log("Ticket exchange possible");
          flag = true;
        }
      }
      if(flag == false)
      {
        console.log('No tickets available, sorry');
      }
      else{
        res.sendFile(path.join(__dirname,'src/submit.html'),{data: req.body});
      }      
    }
  })
});

db.connect((err)=>{
  if(err){
    console.log('unable to connect to database');
    process.exit(1);
  }
else{
  app.listen(3000, ()=>{
    console.log('Connected to database, app listening on port 3000');
    
  });
}
})
  




// function getNextSequenceValue(sequenceName){

//    var sequenceDocument = db.counter.findAndModify({
//       query:{_id: sequenceName },
//       update: {$inc:{sequence_value: NumberInt(1)}},
//       new:true
//    });
	
//    return sequenceDocument.sequence_value;
// }

// db.dogs.insert({
//    "_id":NumberInt(getNextSequenceValue("id")),
//    "name":"Riley",
//    "image":"images/Riley.png"
// })