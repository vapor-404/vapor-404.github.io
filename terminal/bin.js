//initializing commands
$(document).ready(function() {weather()});

function hook(str, args) {

    if (str[0] == '~') {
        eval(str.slice(1, str.length))
        return true
    }

    //check for a subreddit
    if (str.slice(0,3) === "/r/" || str.slice(0,3) === "/u/") {
        loadURL("https://www.reddit.com" + str)
        return true
    }

    //check for a 4chan board
    if(str[0] === "/" && (
        str[str.length-1] === "/" || str.length < 5)) {
        //then it's not guaranteed to be a 4chan board, but let's try it anyway
        //everything but the slash at the beginning
        loadURL("https://boards.4chan.org/" + str.substr(1))
        return true
    }

    if (hookCommands.indexOf(str) > -1) {
        //call it as a function
        //args are an array
        window[str](args.join(" "));
        return true
    }

    if (fileFunctions.indexOf(str) > -1) {
        //call it as a function
        //args are an array
        window[str](args.join(" "));
        return true
    }

    //and now check for bookmarks
    if (typeof bookmarks != "undefined" && bookmarks.length > 0) {
        for (var i=0; i<bookmarks.length; i++) {
            if(bookmarks[i][0] === str) {
                loadURL(bookmarks[i][1])
                return true;
            }
        }

    }

    //regex for dice matching, either straight or with a modifier (+x)
    if (/^[0-9]*[d][0-9]+$/.test(str)) {

        var tempArr = str.split('d')
        var numDice = Number(tempArr[0])
        if (numDice === 0) numDice = 1
        var numSides = Number(tempArr[1])
        var output = ""
        for (var i=0; i<numDice; i++) {
            var outcome = randRange(numSides)
            //highlight max rolls
            if (outcome === numSides) outcome = cssColor(outcome, "#b0b0b0")
            output += outcome + " "
        }
        print(output);
        return true
    } else if (/^[0-9]*[d][0-9]+[+][0-9]+$/.test(str)) {
        var regex = /[+][0-9]+/.exec(str)[0];
        modifier = Number(regex.slice(1)) //remove the + to get the modifier
        console.log(modifier)

        var tempArr = str.split('d')
        var numDice = Number(tempArr[0])
        if (numDice === 0) numDice = 1
        var numSides = Number(tempArr[1].split("+")[0]) //gross, but works
        var output = ""
        for (var i=0; i<numDice; i++) {
            var outcome = randRange(numSides)
            var temp = outcome + modifier
            //highlight max rolls
            if (outcome === numSides) temp = cssColor(temp, "#b0b0b0")
            output += temp + " "
        }
        print(output);
        return true
    }

}

//==================== EXTRA COMMANDS ==========================
var hookCommands = [
    'chan',
    'date',
    'dice',
    'reddit',
    'time',
    'weather',
];

var bookmarks = [
    ['cstheory', 'http://www.cs.columbia.edu/~aho/cs3261/'],
    ['listentothis', "https://www.reddit.com/r/listentothis/"],
    ['pawprint', 'https://pawprtprodmprt1.cuit.columbia.edu/myprintcenter/'],
    ['play', 'https://play.google.com/music/listen?hl=en&u=0#/wmp'],
    ['spotify', 'https://play.spotify.com/collection/songs'],
]

function name(str) {
    setName(str)
}

function machine(str) {
    setMachine(str)
}

function k_to_f(kelvin) {
	return ((9 / 5) * (kelvin - 273) + 32).toFixed(0);
}

function weather() {
    //this might throw a mixed content error, but running it from a local file works
    var json_url = "http://api.openweathermap.org/data/2.5/weather?q=Morningside+Heights,ny&appid=6e131a2916d5d45d8367b72a4675be0a";
    var city;
    var temp_curr;
    var temp_low;
    var temp_high;
    var description;
    var weatherCode;
    var humidity;

    $.when(
        $.getJSON(json_url)
    ).done(function(json_obj) {
		city = json_obj["name"];
		temp_curr = k_to_f(json_obj["main"]["temp"]);
		temp_low = k_to_f(json_obj["main"]["temp_min"]);
		temp_high = k_to_f(json_obj["main"]["temp_max"]);
		description = json_obj.weather[0].description;
        weatherCode = Number(json_obj["weather"][0]["id"]);
        humidity = Number(json_obj["main"]["humidity"])
        var disgusting = (weatherCode > 500
            && weatherCode < 800
            || Number(temp_low) < 30
            || Number(temp_high) > 95
            || humidity > 75);
        description = description.charAt(0).toUpperCase() + description.slice(1)
        var weatherString = "It's " + temp_curr + "&deg; out. " + description + ". "
        disgusting ? weatherString += "Disgusting." : weatherString += "Not bad."
        print(weatherString)
	})
}

function loadURL(url) {
    print("Loading " + url + "...")
    window.location = url
}

function time(str) {
    var today = new Date();
    var h = today.getHours();
    //america
    if (h >= 13) {
        h -= 12;
    } else if (h < 1) {
        h += 12;
    }
    var m = today.getMinutes();
    var s = today.getSeconds();
    m = checkTime(m);
    s = checkTime(s);
    print(h + ":" + m + ":" + s);
}

function checkTime(i) {
    if (i < 10) {i = "0" + i};  // add zero in front of numbers < 10
    return i;
}

function date(s) {
    var monthNames = [
      "January", "February", "March",
      "April", "May", "June", "July",
      "August", "September", "October",
      "November", "December"
    ];
    var days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

    var date = new Date();
    var day = date.getDate();
    var weekday = date.getDay();
    var monthIndex = date.getMonth();
    var year = date.getFullYear();

    print(days[weekday] + ", " + monthNames[monthIndex] + " " + day)
}

function reddit(s) {
    print("Usage: /r/[subreddit] or /u/[user]")
}

function chan(s) {
    print("Usage: /[board] or /[board]/")
}

function dice(s) {
    print("Usage: [number]d[number]+[modifier]")
}
