var start = {
//backslashes escape newlines
    text:"Your phone alarm is ringing. Maybe you should [bedroom](silence it)."
}

loadScene(start)

//demonstrating onLoad and local variables
var bedroom = {
    text:"You're lying in bed, staring at your phone again. You're \
    [kitchen](hungry), but you need to [bathroom](pee). You also consider\
    [jerk](cranking the hog)."
}

var kitchen = {
    text: "There's nothing in the kitchen. You consider getting back in \
    [bedroom](bed)."
}

var bathroom = {
    text:"The toilet needs cleaning before you can use it. You \
    realize you kinda just want to get back in [bedroom](bed)."
}

var jerk = {
    timesNutted: 0,
    text: "Hog cranked, you feel mildly disgusted. What a way to start the morning. Maybe you should get back into \
    [bedroom](bed).",
    altText: "Your arm, and your hog, are getting sore. Maybe you should get back into \
    [bedroom](bed).",
    onLoad: function() {
        this.timesNutted++;
        if (this.timesNutted > 1) {
            this.text = this.altText + " You've nutted " + this.timesNutted +
            " times today already."
        }
    },
}
