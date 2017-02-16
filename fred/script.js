var currentSong;
var playing;
var trackDuration;
var firstClick = true;
var track = 0;


function play(song) {
    currentSong.pause();
    currentSong.currentTime = 0;
    currentSong = new Audio(song.audioPath);
    currentSong.play();
    firstClick = false;
    playing = true;
    trackDuration = currentSong.duration;
    setAlbumArt(song.artPath);
    track = songs.indexOf(song)

    $("#songinfo").html(
        song.name +
        "<br> <a target='_blank' href='" + song.link + "'>" +
        song.artist + "</a>"
    )

    document.title = song.name +  " - " + song.artist

    currentSong.onended = function() {
        next();
    }
    $("#play").removeClass("paused")
}

$('body').keyup(function(e){
   if(e.keyCode == 32){
       // user has pressed space
       e.preventDefault();
       pause();
   } else if (e.keyCode == 39) {
       //right arrow
        e.preventDefault();
        next()
   } else if (e.keyCode == 37) {
       e.preventDefault();
       prev();
   }
});

$('body').keydown(function(e){
   if(e.keyCode == 32){
       // doh ho ho
       e.preventDefault();
   }
});

function pause() {
    if (firstClick === true) {
        play(songs[0]);
        firstClick = false;
    } else if (playing) {
        currentSong.pause();
        playing = false;
        $("#play").addClass("paused")
    } else {
        currentSong.play();
        playing = true;
        $("#play").removeClass("paused")
    }
}

function next() {
    //loop if at the end
    var toPlay;
    var wasPlaying = playing;
    if (track != songs.length-1) {
        toPlay = songs[track + 1];
    } else { toPlay = songs[0]; }
    play(toPlay);
    if (!wasPlaying) pause();
}

function prev() {
    var toPlay;
    var wasPlaying = playing;
    if (currentSong.currentTime > 3) { //rewinds if in the middle of a song
        currentSong.currentTime = 0;
        return;
    } else if (track === 0) {
            toPlay = (songs[songs.length-1]);
    } else { toPlay = (songs[track - 1]); }
    play(toPlay);
    if (!wasPlaying) pause();
}

function updateTrackbar() {
	var percent = (currentSong.currentTime / currentSong.duration) * 100
	percent += "%"
	$("#trackbar").css("width", percent)
}

setInterval(updateTrackbar, 20)

$(document).ready(function() {
    currentSong = new Audio(songs[1].audioPath)
    for (var i=0; i<songs.length; i++) {
        $("#tracklist").append(
            //a hack to get html entities from weird characters
            "<p onclick=play(songs["+ i +"])>" + $("<div/>").text(songs[i].name).html() + "</p><br>"
        )
    }
    $("#tracklist").append(
        "<p><a href='songs.zip' target='_blank'> download all</a></p>"
    )
    play(songs[0]);
    pause();
})

function setAlbumArt(path) {
    $("#albumart").attr("src", path);
}

var cherryblossoms = {
    audioPath : "mp3s/｢cherry blossoms explode across the dying horizon｣.mp3",
    artPath : "art/sakuraburst.jpg",
    name : "｢cherry blossoms explode across the dying horizon｣",
    artist : "sakuraburst",
    link : "https://sakuraburst.bandcamp.com",
}

var forestspirits = {
    audioPath : "mp3s/「forest of the spirits」.mp3",
    artPath : "art/sakuraburst.jpg",
    name : "｢forest of the spirits｣",
    artist : "sakuraburst",
    link : "https://sakuraburst.bandcamp.com",
}

var haruko = {
    audioPath : "mp3s/Airøspace - Haruko.mp3",
    artPath : "art/airospace.jpg",
    name : "Haruko",
    artist : "Airøspace",
    link : "https://airospace.bandcamp.com",
}

var allthewaydown = {
    audioPath : "mp3s/All The Way Down.mp3",
    artPath : "art/hexcougar.jpg",
    name : "All The Way Down",
    artist : "Hex Cougar",
    link : "https://soundcloud.com/hex-cougar",
}

var fujitascale = {
    audioPath : "mp3s/Fujita Scale.mp3",
    artPath : "art/fujitascale.jpg",
    name : "Fujita Scale",
    artist : "NxxxxxS",
    link : "https://nbbeats.bandcamp.com",
}

var heartonwave = {
    audioPath : "mp3s/Heart On Wave.mp3",
    artPath : "art/heartonwave.jpg",
    name : "Video Girl (Petriform Remix)",
    artist : "Slime Girls",
    link : "https://slimegirls.bandcamp.com",
}

var kuro = {
    audioPath : "mp3s/Ｋｕｒｏ｜黒 - 面白い.mp3",
    artPath : "art/kuro.jpg",
    name : "面白い",
    artist : "Ｋｕｒｏ",
    link : "https://soundcloud.com/yungkuro",
}

var tracytzu = {
    audioPath : "mp3s/Looking For Tracy Tzu.mp3",
    artPath : "art/trilogy.jpg",
    name : "Looking For Tracy Tzu",
    artist : "Carpenter Brut",
    link : "https://carpenterbrut.bandcamp.com/album/trilogy",
}

var she = {
    audioPath : "mp3s/She.mp3",
    artPath : "art/cocainejesus.jpg",
    name : "ｘ ＳＨＥ ｘ 私にとって重要がある ｘ",
    artist : "COCAINEJESUSxPATROL1993",
    link : "https://cocainejesus.bandcamp.com",
}

var warpstar = {
    audioPath : "mp3s/Warpstar.mp3",
    artPath : "art/nosummernocry.jpg",
    name : "Warpstar (With You)",
    artist : "Slime Girls",
    link : "https://slimegirls.bandcamp.com",
}

var hungryghost = {
    audioPath : "mp3s/Hungry Ghost.mp3",
    artPath : "art/mega.jpg",
    name : "Hungry Ghost",
    artist : "Blank Banshee",
    link : "https://blankbanshee.bandcamp.com",
}

var meteorblade = {
    audioPath : "mp3s/Meteor Blade.mp3",
    artPath : "art/mega.jpg",
    name : "Meteor Blade",
    artist : "Blank Banshee",
    link : "https://blankbanshee.bandcamp.com",
}

var songs = [
    forestspirits,
    she,
    heartonwave,
    warpstar,
    hungryghost,
    meteorblade,
    tracytzu,
    haruko,
    cherryblossoms,
    allthewaydown,
    kuro,
    fujitascale,
]
