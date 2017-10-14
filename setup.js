var express = require('express');

var bodyParser = require('body-parser'); // Required if we need to use HTTP query or post parameters
var validator = require('validator');

var mongoUri = process.env.MONGODB_URI || process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'mongodb://localhost/polyhack2017';
var MongoClient = require('mongodb').MongoClient, format = require('util').format;
var db = MongoClient.connect(mongoUri, function(error, databaseConnection) {
        db = databaseConnection;
});

function loadData(){
        // put in interests
        var name = document.getElementById("name").innerHTML;
        var username = document.getElementById("username").innerHTML;
        var age = document.getElementById("age").innerHTML;
        var gender = document.getElementById("gender").innerHTML;
        /*var name = "Michelle";
        var username = "sofaplank";
        var age = 0;
        var gender = "social construct";
        var interests = ["hi", "hello"];*/

        var toInsert = {
                "name": name,
                "username": username,
                "age": age,
                "gender": gender,
                "isCurrentUser": true
               // "interests": interests
        };

        db.collection("userInfo", function(error, coll) {
                db.coll.insert(toInsert);
        });
}
