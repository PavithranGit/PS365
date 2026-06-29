//======================================
// PS365 PREMIUM DASHBOARD
//======================================

window.addEventListener("load", function () {

    loadGreeting();

    loadCountdown();

    loadTodayProgress();

    startClock();

});

//======================================
// Greeting
//======================================

function loadGreeting() {

    const hour = new Date().getHours();

    let greeting = "Good Evening";

    if (hour < 12)
        greeting = "Good Morning";
    else if (hour < 17)
        greeting = "Good Afternoon";

    document.getElementById("greeting").innerHTML =
        greeting;

    document.getElementById("studentName").innerHTML =
        APP.userName + " 👋";

    document.getElementById("welcomeMessage").innerHTML =
        "Every study session brings you one step closer to becoming a TNPSC Group I Officer.";

}

//======================================
// Live Clock
//======================================

function startClock() {

    updateClock();

    setInterval(updateClock,1000);

}

function updateClock() {

    const now = new Date();

    document.getElementById("currentDate").innerHTML =
        now.toLocaleDateString("en-IN",{

            weekday:"long",

            day:"2-digit",

            month:"long",

            year:"numeric"

        });

    document.getElementById("currentTime").innerHTML =
        now.toLocaleTimeString("en-IN",{

            hour:"2-digit",

            minute:"2-digit",

            second:"2-digit"

        });

}

//======================================
// Countdown
//======================================

function loadCountdown() {

    document.getElementById("group1Days").innerHTML =
        getDays(APP.group1Exam);

    document.getElementById("group2Days").innerHTML =
        getDays(APP.group2Exam);

}

function getDays(date) {

    const today = new Date();

    const exam = new Date(date);

    const diff = exam - today;

    return Math.max(
        Math.ceil(diff / (1000 * 60 * 60 * 24)),
        0
    );

}

//======================================
// Today's Progress
//======================================

function loadTodayProgress() {

    const study = getTodayStudy();

    if (!study) {

        document.getElementById("studyHours").innerHTML =
            "0 / " + APP.dailyHours + " hrs";

        document.querySelector(".hours-fill").style.width =
            "0%";

        setText("thirukkuralValue","-");
        setText("saValue","-");
        setText("pvValue","-");
        setText("hhValue","-");
        setText("grammarValue","-");
        setText("historyValue","-");
        setText("polityValue","-");
        setText("caValue","-");

        setText("mentalValue","Pending");

        setText("revisionValue","Pending");

        return;

    }

    // Study Hours

    document.getElementById("studyHours").innerHTML =
        study.studyHours + " / " + APP.dailyHours + " hrs";

    const percent =
        Math.min(
            (study.studyHours / APP.dailyHours) * 100,
            100
        );

    document.querySelector(".hours-fill").style.width =
        percent + "%";

    // Today's Focus

    setText("thirukkuralValue",study.thirukkural);

    setText("saValue",study.sa);

    setText("pvValue",study.pv);

    setText("hhValue",study.hh);

    setText("grammarValue",study.grammar);

    setText("historyValue",study.history);

    setText("polityValue",study.polity);

    setText("caValue",study.currentAffairs);

    setText(
        "mentalValue",
        study.mentalAbility || "Pending"
    );

    setText(
        "revisionValue",
        study.revision ? "Completed" : "Pending"
    );

}

//======================================
// Helper
//======================================

function setText(id,value){

    document.getElementById(id).innerHTML =
        value && value !== ""
        ? value
        : "-";

}