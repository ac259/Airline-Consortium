var express = require('express');
var router = express.Router();

var app = express();
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var url = 'mongodb://localhost:27017/flight';
var mongo = require('mongodb');
var mongoose = require('mongoose');

const bodyParser = require("body-parser");
var urlEncodedParser = bodyParser.urlencoded({ extended: true });

var flag = false;

app.use(bodyParser.json());
app.use(express.static('src'));
app.use(express.static('../ask-contract/build/contracts'));
const path = require('path');



/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Airline Consortium' });
});

router.get('/tweet', function(req, res, next) {
  res.render('tweet', { title: 'Airline Consortium' });
});

router.get('/test/:id', function(req,res, next){
	res.render('test', {output: req.params.id});
});


router.get('/ask', function(req,res, next){
	res.render('ask');
});

router.get('/Payment', function(req,res, next){
  res.render('Payment');
});


router.get('/maps', function(req,res, next){
  res.render('maps');
});

router.get('/flight_info', function(req,res, next){
	res.render('flight_info');
});

router.get('/insert-data', function(req,res, next){
	res.render('insert-data');
});

router.get('/request', function(req,res, next){
	res.render('request');
});

router.get('/airtick', function(req,res, next){
	res.render('airtick');
});

router.get('/blog', function(req,res, next){
  res.render('blog');
});


router.post('/test/submit', function(req, res, next){
	var id = req.body.id;
	res.redirect('/test/' + id);
});


router.get('/get-data', function(req, res, next){
	var resultArray = []
	MongoClient.connect(url,function (err, client) {
  	if (err) throw err;
  	var db = client.db('flight');
	var cursor = db.collection('flightB').find();
	cursor.forEach(function(doc, err){
		assert.equal(null,err);
		resultArray.push(doc);
	}, function(){
		client.close();
		res.render('insert-data', {items: resultArray});
	});
	});
});

router.post('/insert-data',urlEncodedParser , function(req,res, next){
	var item = {
		fromCity : req.body.fromCity,
		toCity : req.body.toCity,
		seats : req.body.seats
	};
	MongoClient.connect(url,function (err, client) {
  	if (err) throw err;
	console.log(req.body.title);
  	var db = client.db('flight');
  	db.collection('flightB').insertOne(item, function(err, result){
			assert.equal(null, err);
			console.log('New Product Inserted');

			client.close();
		});
	}); 
	// mongo.connect(url, function(err, db){
	// 	assert.equal(null,err);
	// 	db.collection('user-req').insertOne(item, function(err, result){
	// 		assert.equal(null, error);
	// 		console.log('Request inserted');
	// 		db.close();
	// 	});
	// });
	res.redirect('insert-data');
});

// without this the bodyParser doesn't work!
// router.use(bodyParser.urlencoded({
//   extended: true
// }));

//Ticket exchange check 

router.post('/request', function(req, res, next) {
  //var req_source = req.body.fromCity;
  //console.log(req_source);
  console.log("Inside Post request");

  MongoClient.connect(url,function (err, client) {
  		if (err) throw err;
		console.log("Connected");
  		var db = client.db('flight');
  		db.collection('flightB').find({}).toArray((err,documents)=>{
		    if(err)
		      console.log(err);
    else{
      var doc = documents;
      console.log(doc.body);
      console.log(doc.length);
      for(i=0; i<doc.length; i++)
      {
        console.log(doc[i].fromCity);
        console.log(req.body.fromCity);
        console.log(doc[i].toCity);
        console.log(req.body.toCity);
        console.log(doc[i].seats);
        console.log(req.body.seats);
        console.log(flag);

        // if(10>3){
        // 	console.log("Return true");	
        // }
        if(doc[i].fromCity == req.body.fromCity){
          console.log('failing')
        }

        if(doc[i].fromCity == req.body.fromCity && doc[i].toCity == req.body.toCity && doc[i].seats >= req.body.seats )
        {
          console.log("Ticket exchange possible");
          flag = true;
          break;
          
        }
      }
      console.log('Outside loop');
      console.log(flag);
      if(flag == false)
      {
        console.log('No tickets available, sorry');
        res.render('no-ticket')

      }
      else{
        //res.send('airtick',{data: req.body});
        res.render('exchange',{data: req.body});

      }      
    }
  })
  });		
});

// db.connect((err)=>{
//   if(err){
//     console.log('unable to connect to database');
//     process.exit(1);
//   }
// else{
//   if(app.listen(3000, ()=>{
//     console.log('Connected to database, app listening on port 3000');
    
//   });
// }
// })


module.exports = router;