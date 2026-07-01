//==================================================
// PS365 Study Journal V2
// Part 1 - Initialization & Topic Manager
//==================================================

//------------------------------------
// Global Variables
//------------------------------------

let studyTopics = [];
let studySessions = [];

let totalSeconds = 0;
let sessionSeconds = 0;

let timer = null;
let timerRunning = false;

let sessionStartTime = null;

//------------------------------------
// DOM
//------------------------------------

const studyDate = document.getElementById("studyDate");

const topicInput = document.getElementById("topicInput");

const topicList = document.getElementById("topicList");

const notes = document.getElementById("notes");

const completedCount = document.getElementById("completedCount");

const topicProgress = document.getElementById("topicProgress");

//------------------------------------
// Page Load
//------------------------------------

window.addEventListener("DOMContentLoaded", initializeStudy);

function initializeStudy(){

    const today = new Date()
        .toISOString()
        .split("T")[0];

    studyDate.value = today;

    bindEvents();

    loadStudy(today);

}

//------------------------------------
// Events
//------------------------------------

function bindEvents(){

    document
        .getElementById("addTopicBtn")
        .addEventListener("click", addTopic);

    document
        .getElementById("saveBtn")
        .addEventListener("click", saveTodayStudy);

    document
        .getElementById("emailBtn")
        .addEventListener("click", sendEmailReport);

    studyDate.addEventListener(

        "change",

        function(){

            loadStudy(this.value);

        }

    );

    notes.addEventListener(

        "keyup",

        autoSave

    );

}

//------------------------------------
// Add Topic
//------------------------------------

function addTopic(){

    const value = topicInput.value.trim();

    if(value===""){

        topicInput.focus();

        return;

    }

    studyTopics.push({

        id:Date.now(),

        title:value,

        completed:false

    });

    topicInput.value="";

    renderTopics();

    autoSave();

}

//------------------------------------
// Render Topics
//------------------------------------

function renderTopics(){

    topicList.innerHTML="";

    if(studyTopics.length===0){

        topicList.innerHTML=`

        <div class="empty-state">

            <i class="fa-solid fa-book"></i>

            <p>

                No study topics added.

            </p>

        </div>

        `;

        updateProgress();

        return;

    }

    studyTopics.forEach(topic=>{

        const card=document.createElement("div");

        card.className="topic-item";

        card.innerHTML=`

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

        topicList.appendChild(card);

    });

    updateProgress();

}

//------------------------------------
// Complete Topic
//------------------------------------

function toggleTopic(id){

    studyTopics.forEach(topic=>{

        if(topic.id===id){

            topic.completed=

                !topic.completed;

        }

    });

    renderTopics();

    autoSave();

}

//------------------------------------
// Delete Topic
//------------------------------------

function deleteTopic(id){

    if(

        !confirm(

            "Delete this topic?"

        )

    )

        return;

    studyTopics=

        studyTopics.filter(

            t=>t.id!==id

        );

    renderTopics();

    autoSave();

}

//------------------------------------
// Progress
//------------------------------------

function updateProgress(){

    const total=

        studyTopics.length;

    const completed=

        studyTopics.filter(

            x=>x.completed

        ).length;

    completedCount.innerHTML=

        completed+

        " / "+

        total;

    const percent=

        total===0

        ?0

        :

        (completed/total)*100;

    topicProgress.style.width=

        percent+"%";

}

//==================================================
// Part 2 - Study Timer
//==================================================

//------------------------------------
// Timer Events
//------------------------------------

document
    .getElementById("startBtn")
    .addEventListener("click", startStudy);

document
    .getElementById("pauseBtn")
    .addEventListener("click", pauseStudy);

document
    .getElementById("resumeBtn")
    .addEventListener("click", resumeStudy);

document
    .getElementById("stopBtn")
    .addEventListener("click", stopStudy);

//------------------------------------
// Start Study
//------------------------------------

function startStudy(){

    if(timerRunning)
        return;

    sessionSeconds = 0;

    sessionStartTime = new Date();

    timerRunning = true;

    document.getElementById("studyStatus").innerHTML =
        "🟢 Studying";

    document.getElementById("startTime").innerHTML =
        formatTime(sessionStartTime);

    document.getElementById("endTime").innerHTML =
        "--";

    timer = setInterval(function(){

        sessionSeconds++;

        totalSeconds++;

        updateTimer();

        updateGoal();

    },1000);

}

//------------------------------------
// Pause
//------------------------------------

function pauseStudy(){

    if(!timerRunning)
        return;

    clearInterval(timer);

    timerRunning = false;

    document.getElementById("studyStatus").innerHTML =
        "🟡 Paused";

}

//------------------------------------
// Resume
//------------------------------------

function resumeStudy(){

    if(timerRunning)
        return;

    if(sessionStartTime==null)
        return;

    timerRunning = true;

    document.getElementById("studyStatus").innerHTML =
        "🟢 Studying";

    timer = setInterval(function(){

        sessionSeconds++;

        totalSeconds++;

        updateTimer();

        updateGoal();

    },1000);

}

//------------------------------------
// Stop
//------------------------------------

function stopStudy(){

    if(sessionStartTime==null)
        return;

    clearInterval(timer);

    timerRunning = false;

    const endTime = new Date();

    document.getElementById("studyStatus").innerHTML =
        "✅ Session Completed";

    document.getElementById("endTime").innerHTML =
        formatTime(endTime);

    studySessions.push({

        start:formatTime(sessionStartTime),

        end:formatTime(endTime),

        duration:sessionSeconds

    });

    renderSessionHistory();

    sessionSeconds = 0;

    sessionStartTime = null;

    autoSave();

}

//------------------------------------
// Update Timer
//------------------------------------

function updateTimer(){

    document.getElementById("timerDisplay").innerHTML =
        secondsToTime(totalSeconds);

    document.getElementById("todayTotal").innerHTML =
        secondsToTime(totalSeconds);

}

//------------------------------------
// Daily Goal
//------------------------------------

function updateGoal(){

    const goalHours = 8;

    const goalSeconds = goalHours * 3600;

    const percent = Math.min(

        (totalSeconds / goalSeconds) * 100,

        100

    );

    document.getElementById("goalProgress").style.width =
        percent + "%";

    document.getElementById("goalPercent").innerHTML =
        Math.floor(percent) + "%";

}

//------------------------------------
// Helpers
//------------------------------------

function secondsToTime(seconds){

    const hrs = Math.floor(seconds / 3600);

    const mins = Math.floor(

        (seconds % 3600) / 60

    );

    const secs = seconds % 60;

    return (

        String(hrs).padStart(2,"0") +

        ":" +

        String(mins).padStart(2,"0") +

        ":" +

        String(secs).padStart(2,"0")

    );

}

function formatTime(date){

    return date.toLocaleTimeString([],{

        hour:"2-digit",

        minute:"2-digit"

    });

}


//==================================================
// Part 3 - Session History
//==================================================

//------------------------------------
// Render Session History
//------------------------------------

function renderSessionHistory(){

    const container =

        document.getElementById("sessionHistory");

    container.innerHTML = "";

    //------------------------------------

    // Empty

    //------------------------------------

    if(studySessions.length===0){

        container.innerHTML=`

        <div class="empty-state">

            <i class="fa-regular fa-clock"></i>

            <p>

                No study sessions yet.

            </p>

        </div>

        `;

        updateTimer();

        return;

    }

    //------------------------------------

    // Sessions

    //------------------------------------

    studySessions.forEach((session,index)=>{

        const card=document.createElement("div");

        card.className="session-item";

        card.innerHTML=`

        <div>

            <strong>

                📚 Session ${index+1}

            </strong>

            <br>

            <small>

                ${session.start}

                →

                ${session.end}

            </small>

        </div>

        <div class="text-right">

            <strong>

                ${secondsToTime(session.duration)}

            </strong>

            <br>

            <button

                class="delete-session"

                onclick="deleteSession(${index})">

                <i class="fa-solid fa-trash"></i>

            </button>

        </div>

        `;

        container.appendChild(card);

    });

    calculateTodayTotal();

}

//------------------------------------
// Delete Session
//------------------------------------

function deleteSession(index){

    if(

        !confirm(

            "Delete this session?"

        )

    )

        return;

    studySessions.splice(index,1);

    renderSessionHistory();

    autoSave();

}

//------------------------------------
// Clear Sessions
//------------------------------------

function clearAllSessions(){

    if(

        !confirm(

            "Clear today's sessions?"

        )

    )

        return;

    studySessions=[];

    totalSeconds=0;

    sessionSeconds=0;

    sessionStartTime=null;

    timerRunning=false;

    clearInterval(timer);

    updateTimer();

    updateGoal();

    renderSessionHistory();

    document.getElementById("studyStatus").innerHTML=

        "⚪ Ready";

    document.getElementById("startTime").innerHTML="--";

    document.getElementById("endTime").innerHTML="--";

    autoSave();

}

//------------------------------------
// Calculate Today's Total
//------------------------------------

function calculateTodayTotal(){

    totalSeconds=0;

    studySessions.forEach(session=>{

        totalSeconds+=session.duration;

    });

    updateTimer();

    updateGoal();

}

//------------------------------------
// Restore Sessions
//------------------------------------

function restoreSessions(savedSessions){

    studySessions=savedSessions||[];

    renderSessionHistory();

}

//------------------------------------
// Statistics
//------------------------------------

function getCompletedTopics(){

    return studyTopics.filter(

        topic=>topic.completed

    ).length;

}

function getPendingTopics(){

    return studyTopics.filter(

        topic=>!topic.completed

    ).length;

}

function getStudyHours(){

    return Number(

        (totalSeconds/3600)

        .toFixed(2)

    );

}

//------------------------------------
// Refresh UI
//------------------------------------

function refreshStudyPage(){

    renderTopics();

    renderSessionHistory();

    updateProgress();

    updateTimer();

    updateGoal();

}

//==================================================
// Part 4 - Storage
//==================================================

//------------------------------------
// Save Today's Study
//------------------------------------

function saveTodayStudy(){

    const study={

        date:studyDate.value,

        totalSeconds:totalSeconds,

        totalHours:getStudyHours(),

        topics:studyTopics,

        sessions:studySessions,

        notes:notes.value,

        lastUpdated:new Date().toISOString()

    };

    // storage.js
    saveStudy(study);

    showToast(

        "Study saved successfully",

        "success"

    );

}

//------------------------------------
// Load Study
//------------------------------------

function loadStudy(date){

    const study=

        getStudyByDate(date);

    //--------------------------------

    // New Day

    //--------------------------------

    if(!study){

        studyTopics=[];

        studySessions=[];

        totalSeconds=0;

        sessionSeconds=0;

        timerRunning=false;

        sessionStartTime=null;

        notes.value="";

        refreshStudyPage();

        return;

    }

    //--------------------------------

    // Restore

    //--------------------------------

    studyTopics=

        study.topics||[];

    studySessions=

        study.sessions||[];

    totalSeconds=

        study.totalSeconds||0;

    notes.value=

        study.notes||"";

    refreshStudyPage();

}

//------------------------------------
// Auto Save
//------------------------------------

function autoSave(){

    const study={

        date:studyDate.value,

        totalSeconds:totalSeconds,

        totalHours:getStudyHours(),

        topics:studyTopics,

        sessions:studySessions,

        notes:notes.value,

        lastUpdated:new Date().toISOString()

    };

    saveStudy(study);

}

//------------------------------------
// Save Every Minute
//------------------------------------

setInterval(function(){

    if(

        timerRunning ||

        studyTopics.length>0 ||

        notes.value.trim()!==''

    ){

        autoSave();

    }

},60000);

//------------------------------------
// Save Before Closing
//------------------------------------

window.addEventListener(

    "beforeunload",

    function(){

        autoSave();

    }

);

//------------------------------------
// Export Today's Study
//------------------------------------

function exportStudy(){

    const study={

        date:studyDate.value,

        totalSeconds,

        topics:studyTopics,

        sessions:studySessions,

        notes:notes.value

    };

    const blob=new Blob(

        [

            JSON.stringify(

                study,

                null,

                2

            )

        ],

        {

            type:

            "application/json"

        }

    );

    const url=

        URL.createObjectURL(blob);

    const a=

        document.createElement("a");

    a.href=url;

    a.download=

        studyDate.value+

        "-study.json";

    a.click();

    URL.revokeObjectURL(url);

}

//------------------------------------
// Import Study
//------------------------------------

function importStudy(file){

    const reader=new FileReader();

    reader.onload=function(e){

        const study=

            JSON.parse(

                e.target.result

            );

        saveStudy(study);

        loadStudy(

            study.date

        );

        showToast(

            "Study Imported",

            "success"

        );

    };

    reader.readAsText(file);

}

//==================================================
// Part 5 - Email & Sync
//==================================================

//------------------------------------
// Email Report
//------------------------------------

function sendEmailReport(){

    saveTodayStudy();

    const completed=

        studyTopics

        .filter(t=>t.completed)

        .map(t=>"✅ "+t.title)

        .join("\n");

    const pending=

        studyTopics

        .filter(t=>!t.completed)

        .map(t=>"❌ "+t.title)

        .join("\n");

    const sessions=

        studySessions.map((s,index)=>

`Session ${index+1}

${s.start} → ${s.end}

Duration : ${secondsToTime(s.duration)}

`).join("\n");

    const subject=

`📚 PS365 Study Report - ${studyDate.value}`;

    const body=

`PS365 DAILY REPORT

================================

📅 Date

${studyDate.value}

================================

⏱ Total Study Time

${secondsToTime(totalSeconds)}

================================

📋 Topics

Completed : ${getCompletedTopics()}

Pending : ${getPendingTopics()}

================================

✅ Completed

${completed || "None"}

================================

❌ Pending

${pending || "None"}

================================

📜 Sessions

${sessions || "No Sessions"}

================================

📝 Notes

${notes.value || "-"}

================================

Generated by PS365 ❤️`;

    //--------------------------------

    // Change Your Email Here

    //--------------------------------

    const email =

        "pavithrandevo@gmail.com";

    window.location.href=

`mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

}

//==================================================
// Dashboard Sync
//==================================================

function syncDashboard(){

    localStorage.setItem(

        "dashboardRefresh",

        Date.now()

    );

}

//==================================================
// Calendar Sync
//==================================================

function syncCalendar(){

    localStorage.setItem(

        "calendarRefresh",

        Date.now()

    );

}

//==================================================
// Statistics Sync
//==================================================

function syncStats(){

    localStorage.setItem(

        "statsRefresh",

        Date.now()

    );

}

//==================================================
// Refresh Everything
//==================================================

function refreshApplication(){

    syncDashboard();

    syncCalendar();

    syncStats();

}

//==================================================
// Save + Refresh
//==================================================

function saveEverything(){

    saveTodayStudy();

    refreshApplication();

}

//==================================================
// Keyboard Shortcut
// Ctrl + S
//==================================================

document.addEventListener(

    "keydown",

    function(e){

        if(

            e.ctrlKey &&

            e.key==="s"

        ){

            e.preventDefault();

            saveEverything();

        }

    }

);

//==================================================
// Auto Refresh
//==================================================

window.addEventListener(

    "storage",

    function(){

        refreshStudyPage();

    }

);

//==================================================
// Final Initialization
//==================================================

refreshStudyPage();

console.log(

    "✅ PS365 Study Module Loaded"

);

function showToast(message, type = "success") {

    alert(message);

}