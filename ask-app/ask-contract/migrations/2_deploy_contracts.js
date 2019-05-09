var Airlines = artifacts.require("Airlines");
var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://localhost:27017';



module.exports = function(deployer) {
  deployer.deploy(Airlines);
};


