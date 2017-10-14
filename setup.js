var express = require('express');

var bodyParser = require('body-parser'); // Required if we need to use HTTP query or post parameters
var validator = require('validator');
var path = require('path');
var app = express();
// See https://stackoverflow.com/questions/5710358/how-to-get-post-query-in-express-node-js
app.use(bodyParser.json());
// See https://stackoverflow.com/questions/25471856/express-throws-error-as-body-parser-deprecated-undefined-extended
app.use(bodyParser.urlencoded({ extended: true }));

var mongoUri = process.env.MONGODB_URI || process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'mongodb://localhost/travie2017';
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
var city;

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

app.post('/addLocations', function(request, response) {

        locations = request.body.locations;
        city = request.body.city;
        console.log(locations);


});

app.get('/getLocations', function(request, response) {
        response.send(locations);
});

app.get('/getCity', function(request, response) {
        response.send(city);
});

app.post('/userLocations', function(request, response) {

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

});

app.get('/getMatches', function(request, response) {
        var matches = [];
        var numSharedLocations = 0;
        var numSharedInterests = 0;
        db.collection("userInfo", function(error, coll) {
                var currUser = coll.find({isCurrentUser: true});
                coll.find().toArray(function(error, users){
                        for (var i = 0; i < users.length; i++) {
                                if (users[i].username != currUser.username) {

                                        for (var j = 0; j < 3; j++) {
                                                var currLocation = currUser.userLocations[j];
                                                for (var k = 0; k < 3; k++) {
                                                        if (currLocation == users[i].userLocations[k]) {
                                                                numSharedLocations++;
                                                                break;
                                                        }
                                                }
                                        }

                                        for (var j = 0; j < currUser.interests.length; j++) {
                                                var currInterest = currUser.interests[j];
                                                 for (var k = 0; k < users[i].interests.length; k++) {
                                                        if (currInterest == users[i].interests[k]) {
                                                                numInterests++;
                                                                break;
                                                        }
                                                }
                                        }

                                        var name = users[i].name;
                                        var percent = (60 * (numSharedLocations/3)) + (40 * (numSharedInterests/8));

                                        var toInsert = {
                                                "name": name,
                                                "percent": percent
                                        };
                                        matches.push(toInsert);
                                }
                        }

                });

        });

        currUser.isCurrentUser = false;
        matches.sort(function (a, b) {
                return a.percent - b.percent;
        });

        matches = matches.slice(0, 10);

        response.send(matches);

});


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

app.get('/matches.html', function(request, response) {
        response.sendFile(path.resolve('./matches.html'));
});

app.listen(process.env.PORT || 3000);


