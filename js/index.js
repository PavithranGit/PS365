// ===============================
// PS365 Landing Page
// ===============================

window.addEventListener("load", function () {

    loadGreeting();
    loadQuote();
    loadCountdown();
    loadMotivationVideo();
    loadPromise();

});

// ===============================
// Greeting
// ===============================

function loadGreeting() {

    let name = "Aspirant";

    if (typeof getProfile === "function") {

        const profile = getProfile();

        if (profile.name && profile.name.trim() !== "") {
            name = profile.name;
        }

    }

    const hour = new Date().getHours();

    let greeting = "Good Evening";

    if (hour < 12)
        greeting = "Good Morning";
    else if (hour < 17)
        greeting = "Good Afternoon";

    document.getElementById("greeting").innerHTML =
        `🌸 ${greeting}, ${name}`;

}

// ===============================
// Random Quote
// ===============================

const quotes = [

    "Success is the sum of small efforts repeated every day.",

    "Discipline is the bridge between goals and achievement.",

    "Dream big. Study hard. Stay humble.",

    "Your future is created by what you do today.",

    "Push yourself because no one else will do it for you.",

    "Consistency beats motivation.",

    "Every page you read today builds your tomorrow.",

    "Stay focused. Stay positive. Stay determined.",

    "One chapter today, one step closer to your dream.",

    "Believe in yourself. You are capable of amazing things."

];

function loadQuote() {

    const random =
        Math.floor(Math.random() * quotes.length);

    document.getElementById("quote").innerHTML =
        `"${quotes[random]}"`;

}

// ===============================
// Countdown
// ===============================

function loadCountdown() {

    const examDate = new Date(APP.group1Exam);

    const today = new Date();

    const totalDays = 365;

    const daysLeft =
        Math.ceil((examDate - today) / (1000 * 60 * 60 * 24));

    document.getElementById("countdown").innerHTML =
        `${daysLeft} Days Left`;

    const progress =
        Math.min(((totalDays - daysLeft) / totalDays) * 100, 100);

    document.getElementById("countdownProgress").style.width =
        progress + "%";

}

// ===============================
// Motivation Videos
// ===============================

const videos = [

    {
        title: "Believe In Yourself",
        url: "https://youtu.be/UNQhuFL6CWg"
    },

    {
        title: "Never Give Up",
        url: "https://youtu.be/tbnzAVRZ9Xc"
    },

    {
        title: "Study Motivation",
        url: "https://youtu.be/TQMbvJNRpLE"
    },

    {
        title: "Success Mindset",
        url: "https://youtu.be/ZXsQAXx_ao0"
    }

];

function loadMotivationVideo() {

    const random =
        Math.floor(Math.random() * videos.length);

    const video = videos[random];

    document.getElementById("videoTitle").innerHTML =
        video.title;

    document.getElementById("watchVideo")
        .onclick = function () {

            window.open(video.url, "_blank");

        };

}

// ===============================
// Daily Promise
// ===============================

function loadPromise() {

    const checkbox =
        document.getElementById("promiseCheck");

    checkbox.addEventListener("change", function () {

        const message =
            document.getElementById("promiseMessage");

        if (checkbox.checked) {

            message.innerHTML =
                "❤️ Excellent! Believe in yourself. Today is your day!";

        } else {

            message.innerHTML = "";

        }

    });

}