var timerActive = false;
var timerCounter;

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

	//test for a web url
	  var pattern = /[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/
	  if (pattern.test(str)) {
		  if (!str.startsWith("http")) str = "https://" + str
		  loadURL(str);
		  return true;
	  }
}

//==================== CHALLENGE COMMANDS ==========================
var hookCommands = [
    'chan',
    'date',
    'dice',
    'reddit',
    'time',
    'timer',
    'screenfetch',
    'weather',
];

var bookmarks = [
    ['drive', "https://drive.google.com/drive/u/0/my-drive"],
    ['foobar', 'https://www.google.com/foobar/'],
    ['listentothis', "https://www.reddit.com/r/listentothis/"],
    ['messenger', "https://www.messenger.com/"],
    ['play', 'https://play.google.com/music/listen?hl=en&u=0#/wmp'],,
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

    //first check if the localStorage version is more than 20 minutes old
    if (localStorage.getItem("cachedWeatherData") != null) {
        var weatherData = JSON.parse(localStorage.getItem("cachedWeatherData"));
        var now = new Date()
        var then = weatherData.timestamp;
        var diff = Math.abs(((now - then) / 1000)/60)
        if (diff < 20) {
            displayWeather(weatherData);
            console.log("using cached weather data")
            return;
        }
    }

    var json_url = "http://api.openweathermap.org/data/2.5/weather?q=Morningside+Heights,ny&appid=6e131a2916d5d45d8367b72a4675be0a";
    $.when(
        $.getJSON(json_url)
    ).done(function(json_obj) {
        displayWeather(json_obj)
        //cache the new, updated weather data
        json_obj.timestamp = new Date();
        localStorage.setItem("cachedWeatherData", JSON.stringify(json_obj))
	})
}

function displayWeather(json_obj) {
    var city = json_obj["name"];
    var temp_curr = k_to_f(json_obj["main"]["temp"]);
    var temp_low = k_to_f(json_obj["main"]["temp_min"]);
    var temp_high = k_to_f(json_obj["main"]["temp_max"]);
    var description = json_obj.weather[0].description;
    var weatherCode = Number(json_obj["weather"][0]["id"]);
    var humidity = Number(json_obj["main"]["humidity"])
    var disgusting = (weatherCode > 500
        && weatherCode < 800
        || Number(temp_low) < 30
        || Number(temp_high) > 95
        || humidity > 75);
    description = description.charAt(0).toUpperCase() + description.slice(1)
    var weatherString = "It's " + temp_curr + "&deg; out. " + description + ". "
    disgusting ? weatherString += "Disgusting." : weatherString += "Not bad."
    print(weatherString)
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

function timer(s) {
    if (s == "stop") {
        if (typeof(timerCounter) == "undefined") {
            print("No active timer.")
        } else {
            $("#gradientBar").removeClass("secondTransition")
            $("#gradientBar").css("width", "100%")
            clearInterval(timerCounter)
            setCloseConfirm(false)
            timerActive = false;
            $("#timer").remove();
        }
        return;
    }

    //example: 12h5m30s or 12h5s
    var timerRegex = /^([0-9]+h)?([0-9]+m)?([0-9]+s)?$/

    if (!timerRegex.test(s) || s == "") {
        print("Usage: timer XhXmXs || timer stop")
        return
    }

    //get the total time in seconds. this is gross, but i'm tired.
    var hours, minutes, seconds
    if (s.includes("h")) {
        hours = Number(s.split("h")[0])
        s = s.split("h")[1]
    }
    if (s.includes("m")) {
        minutes = Number(s.split("m")[0])
        s = s.split("m")[1]
    }
    if (s.includes("s")) {
        seconds = Number(s.split("s")[0])
    }
    if (typeof(hours) == "undefined") hours = 0;
    if (typeof(minutes) == "undefined") minutes = 0;
    if (typeof(seconds) == "undefined") seconds = 0;
    seconds = hours * 3600 + minutes * 60 + seconds
    if (seconds <= 0) {
        print("Try an actual number :^)")
        return
    }

    if (timerActive) {
        print("You already have a timer running.")
        return
    }

    var totalSeconds = seconds-1
    $("#gradientBar").addClass("secondTransition")
    setCloseConfirm(true)
    timerActive = true
    seconds--
    $("#gradientBar").css("width", ((seconds-1)/totalSeconds)*100 + "%")
    var timerObject = $("<div id='timer'></div>").insertBefore("#prompt")
    var date = new Date(null);
    date.setSeconds(seconds); // specify value for SECONDS here
    var result = date.toISOString().substr(11, 8);
    $("#timer").html(result)

    timerCounter = setInterval(function() {
        seconds--
        $("#gradientBar").css("width", (seconds-1)/totalSeconds*100 + "%")

        var date = new Date(null);
        date.setSeconds(seconds); // specify value for SECONDS here
        var result = date.toISOString().substr(11, 8)
        $("#timer").html(result)
        if (seconds <= 0) {
            $("#gradientBar").removeClass("secondTransition")
            $("#gradientBar").css("width", "100%")
            clearInterval(timerCounter)
            setCloseConfirm(false)
            timerActive = false
            $("#timer").remove()
            if (document.hidden) playAirhorn()
            fancyRender("time's up", "dodgerblue")
        }
    }, 1000)

}

function screenfetch(args) {
    var spacer = '  '

    var screenfetchBody =  cssColor(userName+'@'+userMachine, 'lightgray')+'\n'+
        cssColor('OS: ', 'lightgray')+getOS()+'\n'+
        cssColor('Browser: ', 'lightgray')+getBrowser()+'\n'+
        cssColor('Engine: ', 'lightgray')+navigator.product+'\n'+
        cssColor('Resolution: ', 'lightgray')+window.screen.width+'x'+window.screen.height+'\n'+
        cssColor('Language: ', 'lightgray')+navigator.language+'\n'+
        cssColor('Plugins: ', 'lightgray')+navigator.plugins.length

    var terminalArt = JSON.parse(localStorage.getItem('textFiles'))['art']
    if (terminalArt == null && !args.includes('t')) {
        terminalArt = ' _________\n'+
        '|  _____  |\\\n'+
        '| |\\ ___| | \\\n'+
        '| | |   | | |\n'+
        '| | |___| | |\n'+
        '\\ | |____\\| |\n'+
        ' \\|_________| '
    } else if (terminalArt == null) {
        terminalArt = ''
        spacer = ''
    }

    //combine it with the screenfetch body
    var artArray = terminalArt.split('\n')
    var bodyArray = screenfetchBody.split('\n')

    //standardize width
    var width=0
    for (var i=0; i<artArray.length; i++) {
        if (artArray[i].length > width) {
            width = artArray[i].length
        }
    }

    for (var i=0; i<artArray.length || i<bodyArray.length; i++) {
        var currentLine = ''
        if (i<artArray.length) {
            //add justifying spaces
            currentLine += cssColor(artArray[i], 'hotpink') + (' '.repeat(width-artArray[i].length))
        }
        if (i<bodyArray.length) {
            currentLine += spacer + bodyArray[i]
        }
        print(currentLine)
    }
}

function getOS() {
    var OSName="Unknown OS"
    if (navigator.appVersion.indexOf("Win")!=-1) OSName="Windows"
    if (navigator.appVersion.indexOf("Mac")!=-1) OSName="MacOS"
    if (navigator.appVersion.indexOf("X11")!=-1) OSName="UNIX"
    if (navigator.appVersion.indexOf("Linux")!=-1) OSName="Linux"
    return OSName
}

function getBrowser() {
    var nVer = navigator.appVersion;
    var nAgt = navigator.userAgent;
    var browserName  = navigator.appName;
    var fullVersion  = ''+parseFloat(navigator.appVersion); 
    var nameOffset,verOffset,ix;

    // In Opera, the true version is after "Opera" or after "Version"
    if ((verOffset=nAgt.indexOf("Opera"))!=-1) {
     browserName = "Opera";
     fullVersion = nAgt.substring(verOffset+6);
     if ((verOffset=nAgt.indexOf("Version"))!=-1) 
       fullVersion = nAgt.substring(verOffset+8);
    }
    // In MSIE, the true version is after "MSIE" in userAgent
    else if ((verOffset=nAgt.indexOf("MSIE"))!=-1) {
     browserName = "Microsoft Internet Explorer";
     fullVersion = nAgt.substring(verOffset+5);
    }
    // In Chrome, the true version is after "Chrome" 
    else if ((verOffset=nAgt.indexOf("Chrome"))!=-1) {
     browserName = "Chrome";
     fullVersion = nAgt.substring(verOffset+7);
    }
    // In Safari, the true version is after "Safari" or after "Version" 
    else if ((verOffset=nAgt.indexOf("Safari"))!=-1) {
     browserName = "Safari";
     fullVersion = nAgt.substring(verOffset+7);
     if ((verOffset=nAgt.indexOf("Version"))!=-1) 
       fullVersion = nAgt.substring(verOffset+8);
    }
    // In Firefox, the true version is after "Firefox" 
    else if ((verOffset=nAgt.indexOf("Firefox"))!=-1) {
     browserName = "Firefox";
     fullVersion = nAgt.substring(verOffset+8);
    }
    // In most other browsers, "name/version" is at the end of userAgent 
    else if ( (nameOffset=nAgt.lastIndexOf(' ')+1) < 
              (verOffset=nAgt.lastIndexOf('/')) ) 
    {
     browserName = nAgt.substring(nameOffset,verOffset);
     fullVersion = nAgt.substring(verOffset+1);
     if (browserName.toLowerCase()==browserName.toUpperCase()) {
      browserName = navigator.appName;
     }
    }
    // trim the fullVersion string at semicolon/space if present
    if ((ix=fullVersion.indexOf(";"))!=-1)
       fullVersion=fullVersion.substring(0,ix);
    if ((ix=fullVersion.indexOf(" "))!=-1)
       fullVersion=fullVersion.substring(0,ix);

    majorVersion = parseInt(''+fullVersion,10);
    if (isNaN(majorVersion)) {
     fullVersion  = ''+parseFloat(navigator.appVersion); 
    }

    return browserName+' '+fullVersion
}