var express = require('express');

var bodyParser = require('body-parser'); // Required if we need to use HTTP query or post parameters
var validator = require('validator');
var path = require('path');
var app = express();
// See https://stackoverflow.com/questions/5710358/how-to-get-post-query-in-express-node-js
app.use(bodyParser.json());
// See https://stackoverflow.com/questions/25471856/express-throws-error-as-body-parser-deprecated-undefined-extended
app.use(bodyParser.urlencoded({ extended: true }));

var mongoUri = process.env.MONGODB_URI || process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'mongodb://localhost/polyhack17';
var MongoClient = require('mongodb').MongoClient, format = require('util').format;
var db = MongoClient.connect(mongoUri, function(error, databaseConnection) {
        db = databaseConnection;
});

app.use(express.static(path.join(__dirname , 'public')));

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

var locations;

app.post('/submit', function(request, response) {
        // put in interests
        console.log("submitting");
        var interests = request.body.interests;
        var name = request.body.name;
        var username = request.body.username;
        var age = request.body.age;
        var gender = request.body.gender;
        console.log("name " + name)

        var toInsert = {
                "name": name,
                "username": username,
                "age": age,
                "gender": gender,
                "interests": interests,
                "isCurrentUser": false
        };

        db.collection("userInfo", function(error, coll) {
                coll.insert(toInsert);
                if (error) {
                        console.log("error");
                        response.send(500);
                }
                else {
                        console.log("good");
                        response.send(200);
                }
        });
});

app.post('/addLocations'), function(request, response) {

        locations = request.body.locations;
        console.log(locations);
        /*db.collection("userInfo", function(error, coll) {
                var currUser = coll.find({isCurrentUser: true});
                console.log(currUser);
                var name = currUser.name;
                coll.update({name: name}, {'$set': {locations: locations}});
                if (error) {
                        console.log("error");
                        response.send(500);
                }
                else {
                        response.send(200);
                }
        });*/

}

app.get('/getLocations'), functions(request, response) {
        response.send(locations);
}

app.post('/userLocations'), function(request, response) {

        var userLocations = request.body.userLocations;
        db.collection("userInfo", function(error, coll) {
                var currUser = coll.find({isCurrentUser: true});
                console.log(currUser);
                var name = currUser.name;
                coll.update({name: name}, {'$set': {userLocations: userLocations}});
                if (error) {
                        console.log("error");
                        response.send(500);
                }
                else {
                        response.send(200);
                }
        });

}

app.get('/', function(request, response) {
        response.sendFile(path.resolve('./splash.html'));
});

app.get('/setup.html', function(request, response) {
        response.sendFile(path.resolve('./setup.html'));
});

app.get('/location.html', function(request, response) {
        response.sendFile(path.resolve('./location.html'));
});

app.get('/attractions.html', function(request, response) {
        response.sendFile(path.resolve('./attractions.html'));
});

app.listen(process.env.PORT || 3000);


