//====================================================
// PS365 Study Journal V2
//====================================================

let studyTopics = [];

let studySessions = [];

let totalSeconds = 0;

let sessionSeconds = 0;

let timer = null;

let timerRunning = false;

let sessionStartTime = null;

//====================================================
// Page Load
//====================================================

window.addEventListener("load", () => {

    const today = new Date().toISOString().split("T")[0];

    document.getElementById("studyDate").value = today;

    document.getElementById("addTopicBtn")
        .addEventListener("click", addTopic);

    document.getElementById("saveBtn")
        .addEventListener("click", saveStudy);

    document.getElementById("emailBtn")
        .addEventListener("click", sendEmail);

    loadStudy(today);

});

//====================================================
// Add Topic
//====================================================

function addTopic(){

    const input = document.getElementById("topicInput");

    const value = input.value.trim();

    if(value===""){

        alert("Enter a study topic.");

        return;

    }

    studyTopics.push({

        id:Date.now(),

        title:value,

        completed:false

    });

    input.value="";

    renderTopics();

}

//====================================================
// Render Topics
//====================================================

function renderTopics(){

    const container = document.getElementById("topicList");

    container.innerHTML="";

    if(studyTopics.length===0){

        container.innerHTML=

        `<div class="empty-session">

            No topics added.

        </div>`;

        updateProgress();

        return;

    }

    studyTopics.forEach(topic=>{

        const row=document.createElement("div");

        row.className="topic-item";

        row.innerHTML=`

            <label>

                <input

                    type="checkbox"

                    ${topic.completed?"checked":""}

                    onchange="toggleTopic(${topic.id})">

                <span>

                    ${topic.title}

                </span>

            </label>

            <button

                onclick="deleteTopic(${topic.id})">

                <i class="fa-solid fa-trash"></i>

            </button>

        `;

        container.appendChild(row);

    });

    updateProgress();

}

//====================================================
// Toggle Topic
//====================================================

function toggleTopic(id){

    studyTopics=studyTopics.map(topic=>{

        if(topic.id===id){

            topic.completed=!topic.completed;

        }

        return topic;

    });

    updateProgress();

}

//====================================================
// Delete Topic
//====================================================

function deleteTopic(id){

    if(!confirm("Delete this topic?"))

        return;

    studyTopics=

        studyTopics.filter(

            topic=>topic.id!==id

        );

    renderTopics();

}

//====================================================
// Update Progress
//====================================================

function updateProgress(){

    const total=studyTopics.length;

    const completed=

        studyTopics.filter(

            t=>t.completed

        ).length;

    document.getElementById("completedCount").innerHTML=

        completed+" / "+total;

    const percent=

        total===0

        ?0

        :(completed/total)*100;

    document.getElementById("topicProgress").style.width=

        percent+"%";

}

//====================================================
// Study Session Timer
//====================================================

document.getElementById("startBtn")
    .addEventListener("click", startSession);

document.getElementById("pauseBtn")
    .addEventListener("click", pauseSession);

document.getElementById("resumeBtn")
    .addEventListener("click", resumeSession);

document.getElementById("stopBtn")
    .addEventListener("click", stopSession);

//====================================================
// Start Session
//====================================================

function startSession(){

    if(timerRunning)
        return;

    sessionSeconds = 0;

    sessionStartTime = new Date();

    document.getElementById("startTime").innerHTML =
        formatClock(sessionStartTime);

    document.getElementById("endTime").innerHTML = "--";

    document.getElementById("studyStatus").innerHTML =
        "🟢 Studying";

    timerRunning = true;

    timer = setInterval(function(){

        sessionSeconds++;

        totalSeconds++;

        updateTimer();

        updateGoalProgress();

    },1000);

}

//====================================================
// Pause
//====================================================

function pauseSession(){

    if(!timerRunning)
        return;

    clearInterval(timer);

    timerRunning = false;

    document.getElementById("studyStatus").innerHTML =
        "🟡 Paused";

}

//====================================================
// Resume
//====================================================

function resumeSession(){

    if(timerRunning)
        return;

    document.getElementById("studyStatus").innerHTML =
        "🟢 Studying";

    timerRunning = true;

    timer = setInterval(function(){

        sessionSeconds++;

        totalSeconds++;

        updateTimer();

        updateGoalProgress();

    },1000);

}

//====================================================
// Stop
//====================================================

function stopSession(){

    if(!sessionStartTime)
        return;

    clearInterval(timer);

    timerRunning = false;

    const end = new Date();

    document.getElementById("endTime").innerHTML =
        formatClock(end);

    document.getElementById("studyStatus").innerHTML =
        "✅ Session Completed";

    studySessions.push({

        start: formatClock(sessionStartTime),

        end: formatClock(end),

        duration: sessionSeconds

    });

    renderSessions();

    sessionSeconds = 0;

}

//====================================================
// Update Timer
//====================================================

function updateTimer(){

    document.getElementById("timerDisplay").innerHTML =
        formatDuration(totalSeconds);

    document.getElementById("todayTotal").innerHTML =
        formatDuration(totalSeconds);

}

//====================================================
// Daily Goal
//====================================================

function updateGoalProgress(){

    const goalSeconds = APP.dailyHours * 3600;

    const percent = Math.min(

        (totalSeconds / goalSeconds) * 100,

        100

    );

    document.getElementById("goalProgress").style.width =
        percent + "%";

    document.getElementById("goalPercent").innerHTML =
        Math.floor(percent) + "%";

}

//====================================================
// Helpers
//====================================================

function formatDuration(sec){

    const h = Math.floor(sec / 3600);

    const m = Math.floor((sec % 3600) / 60);

    const s = sec % 60;

    return (

        String(h).padStart(2,"0") + ":" +

        String(m).padStart(2,"0") + ":" +

        String(s).padStart(2,"0")

    );

}

function formatClock(date){

    return date.toLocaleTimeString([],{

        hour:"2-digit",

        minute:"2-digit"

    });

}


//====================================================
// Session History
//====================================================

function renderSessions(){

    const container =
        document.getElementById("sessionHistory");

    container.innerHTML = "";

    if(studySessions.length === 0){

        container.innerHTML = `

        <div class="empty-session">

            <i class="fa-regular fa-clock"></i>

            <p>No study sessions yet.</p>

        </div>

        `;

        return;

    }

    studySessions.forEach((session,index)=>{

        const card = document.createElement("div");

        card.className = "session-item";

        card.innerHTML = `

            <div>

                <strong>

                    Session ${index + 1}

                </strong>

                <br>

                <small>

                    ${session.start}

                    →

                    ${session.end}

                </small>

            </div>

            <div>

                <strong>

                    ${formatDuration(session.duration)}

                </strong>

            </div>

        `;

        container.appendChild(card);

    });

    calculateTodayTotal();

}

//====================================================
// Today's Total
//====================================================

function calculateTodayTotal(){

    let total = 0;

    studySessions.forEach(session=>{

        total += session.duration;

    });

    totalSeconds = total;

    document.getElementById("todayTotal").innerHTML =

        formatDuration(total);

    document.getElementById("timerDisplay").innerHTML =

        formatDuration(total);

    updateGoalProgress();

}

//====================================================
// Delete Session
//====================================================

function deleteSession(index){

    if(!confirm("Delete this study session?"))

        return;

    studySessions.splice(index,1);

    renderSessions();

}

//====================================================
// Clear All Sessions
//====================================================

function clearSessions(){

    if(!confirm("Clear today's session history?"))

        return;

    studySessions = [];

    totalSeconds = 0;

    sessionSeconds = 0;

    renderSessions();

    updateTimer();

    updateGoalProgress();

    document.getElementById("studyStatus").innerHTML =
        "⚪ Ready to Study";

    document.getElementById("startTime").innerHTML = "--";

    document.getElementById("endTime").innerHTML = "--";

}

//====================================================
// Restore Session History
//====================================================

function restoreSessions(savedSessions){

    studySessions = savedSessions || [];

    renderSessions();

}

//====================================================
// Save Study
//====================================================

function saveStudy(){

    const study = {

        date: document.getElementById("studyDate").value,

        totalSeconds: totalSeconds,

        totalHours: Number((totalSeconds / 3600).toFixed(2)),

        topics: studyTopics,

        sessions: studySessions,

        notes: document.getElementById("notes").value,

        lastUpdated: new Date().toISOString()

    };

    saveStudy(study);

    alert("✅ Study saved successfully.");

}

//====================================================
// Load Study
//====================================================

function loadStudy(date){

    const study = getStudyByDate(date);

    //----------------------------------

    // New Day

    //----------------------------------

    if(!study){

        studyTopics=[];

        studySessions=[];

        totalSeconds=0;

        sessionSeconds=0;

        renderTopics();

        renderSessions();

        updateTimer();

        updateGoalProgress();

        document.getElementById("notes").value="";

        document.getElementById("studyStatus").innerHTML=
            "⚪ Ready to Study";

        document.getElementById("startTime").innerHTML="--";

        document.getElementById("endTime").innerHTML="--";

        return;

    }

    //----------------------------------

    // Restore

    //----------------------------------

    studyTopics = study.topics || [];

    studySessions = study.sessions || [];

    totalSeconds = study.totalSeconds || 0;

    document.getElementById("notes").value =
        study.notes || "";

    renderTopics();

    renderSessions();

    updateTimer();

    updateGoalProgress();

}

//====================================================
// Change Date
//====================================================

document.getElementById("studyDate")

.addEventListener("change",function(){

    loadStudy(this.value);

});

//====================================================
// Auto Save
//====================================================

function autoSave(){

    const study = {

        date: document.getElementById("studyDate").value,

        totalSeconds: totalSeconds,

        totalHours: Number((totalSeconds / 3600).toFixed(2)),

        topics: studyTopics,

        sessions: studySessions,

        notes: document.getElementById("notes").value,

        lastUpdated: new Date().toISOString()

    };

    saveStudy(study);

}

//====================================================
// Auto Save Events
//====================================================

document.getElementById("notes")

.addEventListener("keyup",autoSave);

window.addEventListener("beforeunload",autoSave);

//====================================================
// Initial Load
//====================================================

loadStudy(

    new Date()

    .toISOString()

    .split("T")[0]

);

//====================================================
// Email Report
//====================================================

document.getElementById("emailBtn")
    .addEventListener("click", sendEmailReport);

function sendEmailReport(){

    const date =
        document.getElementById("studyDate").value;

    const notes =
        document.getElementById("notes").value || "-";

    //-------------------------------------
    // Completed
    //-------------------------------------

    let completed = "";

    let pending = "";

    studyTopics.forEach(topic=>{

        if(topic.completed){

            completed += "✅ " + topic.title + "\n";

        }else{

            pending += "❌ " + topic.title + "\n";

        }

    });

    if(completed==="")
        completed="None\n";

    if(pending==="")
        pending="None\n";

    //-------------------------------------
    // Session History
    //-------------------------------------

    let sessions = "";

    studySessions.forEach((session,index)=>{

        sessions +=

        `Session ${index+1}

${session.start} → ${session.end}

Duration : ${formatDuration(session.duration)}

----------------------------

`;

    });

    if(sessions==="")

        sessions="No Sessions\n";

    //-------------------------------------
    // Statistics
    //-------------------------------------

    const completedCount =

        studyTopics.filter(t=>t.completed).length;

    const totalCount = studyTopics.length;

    //-------------------------------------
    // Email Body
    //-------------------------------------

    const subject =

        `📚 PS365 Study Report - ${date}`;

    const body =

`PS365 DAILY STUDY REPORT

==================================

📅 Date

${date}

==================================

⏱ Total Study Time

${formatDuration(totalSeconds)}

==================================

📊 Progress

Topics Completed

${completedCount} / ${totalCount}

==================================

✅ COMPLETED TOPICS

${completed}

==================================

❌ PENDING TOPICS

${pending}

==================================

📖 SESSION HISTORY

${sessions}

==================================

📝 NOTES

${notes}

==================================

Generated from PS365

Keep Learning ❤️`;

    //-------------------------------------
    // Open Mail
    //-------------------------------------

    window.location.href=

`mailto:YOUR_EMAIL@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

}