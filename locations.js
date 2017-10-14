function getLocations(city) {
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


        var request = new XMLHttpRequest();
        request.open("POST", "http://api.tripadvisor.com/api/partner/2.0/location/" + id + "/attractions?key=9f5acbc1-6233-4162-8a68-31d4e9b6f1c5", true);
        request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        //var data = "username=Xgzbl3n7&lat="+myLat+"&lng="+myLng;

        request.send();

        request.onreadystatechange = function() {
                if (request.readyState == 4 && request.status == 200) {
                        var locationNames = [];
                        var info = JSON.parse(request.responseText).data;
                        for (var i = 0; i < info.length; i++) {
                                console.log(info.name);
                                locationNames.push(info.name);
                        }
                        url = "https://polyhack17.herokuapp.com/addLocations";
                        $.post(url, {locations: locationNames}, function(data){
                                        // this can be empty            
                        });

                        
                }
        };




}