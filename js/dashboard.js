//==============================================
// PS365 Dashboard V2
//==============================================

window.addEventListener("load", () => {

    loadGreeting();

    loadDateTime();

    loadCountdown();

    loadDashboard();

    setInterval(loadDateTime, 1000);

});

//==============================================
// Greeting
//==============================================

function loadGreeting() {

    const hour = new Date().getHours();

    let greeting = "Good Evening";

    if (hour < 12)
        greeting = "Good Morning";
    else if (hour < 17)
        greeting = "Good Afternoon";

    document.getElementById("greeting").innerHTML =
        greeting + ", " + APP.userName + " 👋";

}

//==============================================
// Date & Time
//==============================================

function loadDateTime() {

    const now = new Date();

    document.getElementById("currentDate").innerHTML =
        now.toLocaleDateString("en-IN", {

            weekday: "long",

            day: "numeric",

            month: "long",

            year: "numeric"

        });

    document.getElementById("currentTime").innerHTML =
        now.toLocaleTimeString("en-IN", {

            hour: "2-digit",

            minute: "2-digit",

            second: "2-digit"

        });

}

//==============================================
// Countdown
//==============================================

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
        0,
        Math.ceil(diff / (1000 * 60 * 60 * 24))
    );

}

//==============================================
// Dashboard
//==============================================

function loadDashboard() {

    const study = getTodayStudy();

    if (!study) {

        document.getElementById("studyHours").innerHTML =
            "00h 00m";

        document.getElementById("studyStatus").innerHTML =
            "Ready";

        document.getElementById("completedTopics").innerHTML =
            "0";

        document.getElementById("topicCount").innerHTML =
            "0 / 0";

        document.getElementById("todayTopics").innerHTML =
            `
            <div class="empty-topics">

                <i class="fa-solid fa-book-open"></i>

                <p>No study topics added today.</p>

            </div>
            `;

        document.querySelector(".hours-fill").style.width = "0%";

        document.getElementById("topicProgressBar").style.width = "0%";

        return;

    }

    //-----------------------------------
    // Study Time
    //-----------------------------------

    const totalSeconds = study.studySeconds || 0;

    const hrs = Math.floor(totalSeconds / 3600);

    const mins = Math.floor((totalSeconds % 3600) / 60);

    document.getElementById("studyHours").innerHTML =

        String(hrs).padStart(2, "0") +

        "h " +

        String(mins).padStart(2, "0") +

        "m";

    //-----------------------------------
    // Goal Progress
    //-----------------------------------

    const hourPercent =

        Math.min(

            (study.studyHours / APP.dailyHours) * 100,

            100

        );

    document.querySelector(".hours-fill").style.width =
        hourPercent + "%";

    //-----------------------------------
    // Topics
    //-----------------------------------

    const topics = study.topics || [];

    const completed =
        topics.filter(t => t.completed).length;

    document.getElementById("completedTopics").innerHTML =
        completed;

    document.getElementById("topicCount").innerHTML =
        completed + " / " + topics.length;

    const topicPercent =

        topics.length === 0

        ? 0

        : (completed / topics.length) * 100;

    document.getElementById("topicProgressBar").style.width =
        topicPercent + "%";

    //-----------------------------------
    // Status
    //-----------------------------------

    let status = "🟢 Ready";

    if (totalSeconds > 0)
        status = "📚 Studied";

    if (completed === topics.length && topics.length > 0)
        status = "✅ Completed";

    document.getElementById("studyStatus").innerHTML =
        status;

    //-----------------------------------
    // Topic List
    //-----------------------------------

    let html = "";

    topics.forEach(topic => {

        html += `

        <div class="topic-row">

            <span>

                ${topic.completed ? "✅" : "⬜"}

                ${topic.title}

            </span>

        </div>

        `;

    });

    document.getElementById("todayTopics").innerHTML = html;

}