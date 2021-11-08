// Assumes an array "shows" is in scope.

var ohio = -4;
function getTimeIntForTZ(tz) {
    var i = (new Date().getETCHours() * 100 + tz * 100) + new Date().getMinutes();
    return i < 0 ? 2400 + i : i;
}

/* shows */

function getSortedShowsForDay(day) {
    return shows.filter(function(show) {
        return show.days.includes(day);
    }).sort(function(a, b) {
        a.startTime - b.startTime;
    });
}

function timeIntToStr(i) {
    var d = new Date();
    d.setHours((i - (i % 100)) / 100, i % 100);
    return d.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true, minute: 'numeric' });
}

function currentShow() {
    var now = getTimeIntForTZ(ohio);
    for(var i = 0; i < shows.length; i++) {
        show = shows[i];
        if(show.days.includes(new Date().getDay()) && show.startTime <= now && now < show.endTime) {
            return show;
        }
    }
}

function nextShow() {
    var now = getTimeIntForTZ(ohio);
    var today = new Date().getDay();

    var todaysShows = getSortedShowsForDay(today);

    if(todaysShows[todaysShows.length - 1].startTime <= now) {
        return getSortedShowsForDay(today+1)[0];
    } else {
        return todaysShows.filter(function(show) {
            return now < show.startTime;
        }).reduce(function(a, b) {
            return Math.abs(a.startTime - now) < Math.abs(b.startTime - now) ? a : b;
        });
    }
}

function updateCurrentShow() {
    var show = currentShow();
    show = show ? show : {title: "Doobie Mix", dj: "Doobie DJs", startTime: "Now", endTime: "Later"};

    document.getElementById("current-show").textContent = show.title;
    document.getElementById("current-dj").textContent = show.dj;
    // Should be time from previous show?
    document.getElementById("current-start").textContent = show.startTime == "Now" ? timeIntToStr(getTimeIntForTZ(ohio)) : timeIntToStr(show.startTime);
    document.getElementById("current-end").textContent = show.endTime == "Later" ? timeIntToStr(nextShow().startTime) : timeIntToStr(show.endTime);

    document.getElementById("jumbotron").setAttribute("style", "background: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('images/" + (show.image === undefined ? 'bg/default.jpg' : show.image) + "') center center no-repeat; background-size: cover;");
}

function updateNextShow() {
    var show = nextShow();

    document.getElementById("next-show").textContent = show.title;
    document.getElementById("next-dj").textContent = show.dj;
    document.getElementById("next-start").textContent = timeIntToStr(show.startTime);
}

function updateShows() {
    updateCurrentShow();
    updateNextShow();
}

/* schedule */

function showElement(show) {
    var node = document.createElement("div");
    node.setAttribute("class", "p-2 schedule-show");
    node.setAttribute("style", "height: 60px; background: " + (show.color === undefined ? '#007BFF' : show.color)); //supports IE?
    node.textContent = show.title + "\n" + show.dj + "\n" + timeIntToStr(show.startTime) + " - " + timeIntToStr(show.endTime) + "";
    return node;
}

// Assumes an array "djs" is in scope.

/* djs */

function djbyDjId(id) {
    return djs.find(function(dj) {
        return dj.id == id;
    });
}
