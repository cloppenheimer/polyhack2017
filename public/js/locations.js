
function getLocations(city) {
        console.log(city);
        var id;
        if (city == "Boston" || city == "boston")
                id = 60745;
        else if (city == "Budapest" || city == "budapest")
                id = 274887;
        else if (city == "Beijing" || city == "beijing")
                id = 294212; 
        else if (city == "Rio de Janeiro" || city == "rio de janeiro" || city == "rio")
                id = 303506;
        else if (city == "Lagos" || city == "lagos")
                id = 304026;
        else if (city == "Delhi" || city == "delhi")
                id = 304551;
        else if (city == "London" || city == "london")
                id = 186338;
        console.log("id is" + id);



        var url1 = "https://api.tripadvisor.com/api/partner/2.0/location/" + id + "/attractions?key=9f5acbc1-6233-4162-8a68-31d4e9b6f1c5";
        $.get(url1, function(responseArray){
                console.log(responseArray);
                var locationNames = [];
                //var info = [];
                responseArray = $.parseJSON(responseArray);
                var info = responseArray.data;
                console.log(responseArray["data"]);
                console.log("hi");
                console.log(info);
                for (var i = 0; i < info.length; i++) {
                        console.log(info[i].name);
                        locationNames.push(info[i].name);
                }
                console.log(locationNames);
                var url2 = "https://travie17.herokuapp.com/addLocations";
                $.post(url2, {locations: locationNames, city: city}, function(data){
                                // this can be empty            
                 });
        });


}