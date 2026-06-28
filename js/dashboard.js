// ===============================
// PS365 Dashboard
// ===============================

window.addEventListener("load", function () {

    loadGreeting();
    loadCountdown();
    loadTodayProgress();

});

// ===============================
// Greeting
// ===============================

function loadGreeting() {

    const hour = new Date().getHours();

    let message = "Good Evening";

    if (hour < 12) {
        message = "Good Morning";
    }
    else if (hour < 17) {
        message = "Good Afternoon";
    }

    document.getElementById("greeting").innerHTML =
        `🌸 ${message}, ${APP.userName} 👋`;

    document.getElementById("welcomeMessage").innerHTML =
        "Stay consistent. Every study session counts.";

}

// ===============================
// Exam Countdown
// ===============================

function loadCountdown() {

    document.getElementById("group1Days").innerHTML =
        getDaysLeft(APP.group1Exam) + " Days";

    document.getElementById("group2Days").innerHTML =
        getDaysLeft(APP.group2Exam) + " Days";

}

function getDaysLeft(date) {

    const today = new Date();

    const examDate = new Date(date);

    const diff = examDate - today;

    return Math.ceil(diff / (1000 * 60 * 60 * 24));

}

// ===============================
// Today's Progress
// ===============================

function loadTodayProgress() {

    const study = getTodayStudy();

    if (!study) {

        document.getElementById("studyHours").innerHTML =
            `0 / ${APP.dailyHours} hrs`;

        document.getElementById("mcqCount").innerHTML =
            `0 / ${APP.dailyMcqs}`;

        document.querySelector(".hours-fill").style.width = "0%";
        document.querySelector(".mcq-fill").style.width = "0%";

        return;

    }

    // Hours

    document.getElementById("studyHours").innerHTML =
        `${study.studyHours} / ${APP.dailyHours} hrs`;

    // MCQs

    document.getElementById("mcqCount").innerHTML =
        `${study.mcqs} / ${APP.dailyMcqs}`;

    // Progress %

    const hourPercent =
        Math.min((study.studyHours / APP.dailyHours) * 100, 100);

    const mcqPercent =
        Math.min((study.mcqs / APP.dailyMcqs) * 100, 100);

    document.querySelector(".hours-fill").style.width =
        hourPercent + "%";

    document.querySelector(".mcq-fill").style.width =
        mcqPercent + "%";

    // Status

    const status = document.querySelectorAll(".pending");

    if (status.length >= 2) {

        status[0].innerHTML =
            study.revision ? "✅ Completed" : "Pending";

        status[1].innerHTML =
            study.currentAffairs ? "✅ Completed" : "Pending";

    }

}