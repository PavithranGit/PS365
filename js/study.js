//==================================================
// PS365 Study Journal V3
// Part 1 - Initialization
//==================================================

//------------------------------------
// Global Variables
//------------------------------------

let studyTopics = [];
let studySessions = [];

let totalSeconds = 0;

let timer = null;

let timerRunning = false;

// Current Session
let sessionStartTime = null;
let sessionStartTimestamp = null;
let pausedSeconds = 0;

//------------------------------------
// DOM Elements
//------------------------------------

const studyDate = document.getElementById("studyDate");
const topicInput = document.getElementById("topicInput");
const topicList = document.getElementById("topicList");
const notes = document.getElementById("notes");

const completedCount =
document.getElementById("completedCount");

const topicProgress =
document.getElementById("topicProgress");

//------------------------------------
// Initial Load
//------------------------------------

window.addEventListener(

    "DOMContentLoaded",

    initializeStudy

);

function initializeStudy(){

    const today =

        new Date()

        .toISOString()

        .split("T")[0];

    studyDate.value = today;

    bindEvents();

    loadStudy(today);

    renderTopics();

    renderSessionHistory();

}

//------------------------------------
// Events
//------------------------------------

function bindEvents(){

    document
    .getElementById("addTopicBtn")
    .addEventListener("click",addTopic);

    document
    .getElementById("saveBtn")
    .addEventListener("click",saveTodayStudy);

    document
    .getElementById("emailBtn")
    .addEventListener("click",sendEmailReport);

    document
    .getElementById("startBtn")
    .addEventListener("click",startStudy);

    document
    .getElementById("pauseBtn")
    .addEventListener("click",pauseStudy);

    document
    .getElementById("resumeBtn")
    .addEventListener("click",resumeStudy);

    document
    .getElementById("stopBtn")
    .addEventListener("click",stopStudy);

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
// Topic
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

function toggleTopic(id){

    studyTopics.forEach(topic=>{

        if(topic.id===id){

            topic.completed=!topic.completed;

        }

    });

    renderTopics();

    autoSave();

}

function deleteTopic(id){

    if(!confirm("Delete this topic?"))

        return;

    studyTopics=

        studyTopics.filter(

            t=>t.id!==id

        );

    renderTopics();

    autoSave();

}

function renderTopics(){

    topicList.innerHTML="";

    if(studyTopics.length===0){

        topicList.innerHTML=`

        <div class="empty-state">

            <i class="fa-solid fa-book"></i>

            <p>No Topics Added</p>

        </div>

        `;

        updateProgress();

        return;

    }

    studyTopics.forEach(topic=>{

        topicList.innerHTML+=`

        <div class="topic-item">

            <label>

                <input

                    type="checkbox"

                    ${topic.completed?"checked":""}

                    onchange="toggleTopic(${topic.id})">

                ${topic.title}

            </label>

            <button

                onclick="deleteTopic(${topic.id})">

                <i class="fa-solid fa-trash"></i>

            </button>

        </div>

        `;

    });

    updateProgress();

}

function updateProgress(){

    const completed=

        studyTopics.filter(

            t=>t.completed

        ).length;

    completedCount.innerHTML=

        completed+

        " / "+

        studyTopics.length;

    const percent=

        studyTopics.length===0

        ?0

        :

        (completed/studyTopics.length)*100;

    topicProgress.style.width=

        percent+"%";

}

//==================================================
// Part 2 - Smart Timer Engine
//==================================================

//------------------------------------
// Start Study
//------------------------------------

function startStudy(){

    if(timerRunning)
        return;

    sessionStartTime = new Date();

    sessionStartTimestamp = Date.now();

    pausedSeconds = 0;

    timerRunning = true;

    document.getElementById("studyStatus").innerHTML =
        "🟢 Studying";

    document.getElementById("startTime").innerHTML =
        formatTime(sessionStartTime);

    document.getElementById("endTime").innerHTML = "--";

    updateLiveTimer();

    timer = setInterval(updateLiveTimer,1000);

}

//------------------------------------
// Pause
//------------------------------------

function pauseStudy(){

    if(!timerRunning)
        return;

    pausedSeconds += Math.floor(

        (Date.now()-sessionStartTimestamp)/1000

    );

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

    sessionStartTimestamp = Date.now();

    timerRunning = true;

    document.getElementById("studyStatus").innerHTML =
        "🟢 Studying";

    timer = setInterval(updateLiveTimer,1000);

}

//------------------------------------
// Stop
//------------------------------------

function stopStudy(){

    if(sessionStartTime==null)
        return;

    clearInterval(timer);

    timerRunning = false;

    const elapsed = pausedSeconds +

        Math.floor(

            (Date.now()-sessionStartTimestamp)/1000

        );

    totalSeconds += elapsed;

    const endTime = new Date();

    studySessions.push({

        start:formatTime(sessionStartTime),

        end:formatTime(endTime),

        duration:elapsed

    });

    document.getElementById("studyStatus").innerHTML =
        "✅ Session Completed";

    document.getElementById("endTime").innerHTML =
        formatTime(endTime);

    sessionStartTime = null;

    sessionStartTimestamp = null;

    pausedSeconds = 0;

    renderSessionHistory();

    updateTimerDisplay();

    autoSave();

}

//------------------------------------
// Live Timer
//------------------------------------

function updateLiveTimer(){

    if(!timerRunning)
        return;

    const elapsed = pausedSeconds +

        Math.floor(

            (Date.now()-sessionStartTimestamp)/1000

        );

    updateTimerDisplay(

        totalSeconds + elapsed

    );

}

//------------------------------------
// Update Timer
//------------------------------------

function updateTimerDisplay(seconds = totalSeconds){

    document.getElementById("timerDisplay").innerHTML =
        secondsToTime(seconds);

    document.getElementById("todayTotal").innerHTML =
        secondsToTime(seconds);

    updateGoal(seconds);

}

//------------------------------------
// Goal
//------------------------------------

function updateGoal(seconds){

    const goal = 8 * 3600;

    const percent = Math.min(

        (seconds/goal)*100,

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

    const hrs = Math.floor(seconds/3600);

    const mins = Math.floor(

        (seconds%3600)/60

    );

    const secs = seconds%60;

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
// Part 3 - Persistent Timer
//==================================================

//------------------------------------
// Save Timer State
//------------------------------------

function saveTimerState(){

    localStorage.setItem(

        "ps365Timer",

        JSON.stringify({

            timerRunning,

            totalSeconds,

            pausedSeconds,

            sessionStartTimestamp,

            sessionStartTime

        })

    );

}

//------------------------------------
// Restore Timer
//------------------------------------

function restoreTimerState(){

    const data = JSON.parse(

        localStorage.getItem("ps365Timer")

    );

    if(!data)
        return;

    timerRunning = data.timerRunning || false;

    totalSeconds = data.totalSeconds || 0;

    pausedSeconds = data.pausedSeconds || 0;

    sessionStartTimestamp =
        data.sessionStartTimestamp;

    sessionStartTime = data.sessionStartTime
        ? new Date(data.sessionStartTime)
        : null;

    //--------------------------------

    // Resume Running Timer

    //--------------------------------

    if(

        timerRunning &&

        sessionStartTimestamp

    ){

        timer = setInterval(

            updateLiveTimer,

            1000

        );

        document.getElementById("studyStatus").innerHTML =
            "🟢 Studying";

    }

    updateTimerDisplay();

}

//------------------------------------
// Clear Timer
//------------------------------------

function clearTimerState(){

    localStorage.removeItem(

        "ps365Timer"

    );

}

//------------------------------------
// Update Live Timer
//------------------------------------

const originalUpdateLiveTimer =
    updateLiveTimer;

updateLiveTimer = function(){

    originalUpdateLiveTimer();

    saveTimerState();

};

//------------------------------------
// Save On Visibility Change
//------------------------------------

document.addEventListener(

    "visibilitychange",

    function(){

        if(

            document.hidden

        ){

            saveTimerState();

        }

    }

);

//------------------------------------
// Save Before Closing

//------------------------------------

window.addEventListener(

    "beforeunload",

    function(){

        saveTimerState();

    }

);

//------------------------------------
// Restore Automatically

//------------------------------------

window.addEventListener(

    "load",

    restoreTimerState

);

//------------------------------------
// Stop Cleanup

//------------------------------------

const originalStopStudy =
    stopStudy;

stopStudy = function(){

    originalStopStudy();

    clearTimerState();

};

//==================================================
// Part 4 - Save / Load
//==================================================

//------------------------------------
// Save Today's Study
//------------------------------------

function saveTodayStudy(){

    const currentTimer = timerRunning

        ? pausedSeconds +

          Math.floor(

            (Date.now()-sessionStartTimestamp)/1000

          )

        :0;

    const study={

        date:studyDate.value,

        totalSeconds:totalSeconds + currentTimer,

        totalHours:Number(

            ((totalSeconds+currentTimer)/3600)

            .toFixed(2)

        ),

        topics:studyTopics,

        sessions:studySessions,

        notes:notes.value,

        lastUpdated:new Date().toISOString()

    };

    saveStudy(study);

    showToast(

        "Study Saved Successfully",

        "success"

    );

    refreshApplication();

}

//------------------------------------
// Load Study
//------------------------------------

function loadStudy(date){

    const study =

        getStudyByDate(date);

    if(!study){

        studyTopics=[];

        studySessions=[];

        totalSeconds=0;

        notes.value="";

        refreshStudyPage();

        return;

    }

    studyTopics=

        study.topics || [];

    studySessions=

        study.sessions || [];

    totalSeconds=

        study.totalSeconds || 0;

    notes.value=

        study.notes || "";

    refreshStudyPage();

}

//------------------------------------
// Auto Save
//------------------------------------

function autoSave(){

    if(timerRunning){

        saveTimerState();

    }

    const currentTimer = timerRunning

        ? pausedSeconds +

          Math.floor(

            (Date.now()-sessionStartTimestamp)/1000

          )

        :0;

    saveStudy({

        date:studyDate.value,

        totalSeconds:

            totalSeconds + currentTimer,

        totalHours:Number(

            (

                (totalSeconds+currentTimer)

                /3600

            ).toFixed(2)

        ),

        topics:studyTopics,

        sessions:studySessions,

        notes:notes.value,

        lastUpdated:new Date().toISOString()

    });

}

//------------------------------------
// Auto Save Every 30 Seconds
//------------------------------------

setInterval(function(){

    autoSave();

},30000);

//------------------------------------
// Save Before Leaving
//------------------------------------

window.addEventListener(

    "beforeunload",

    autoSave

);

//------------------------------------
// Export Study
//------------------------------------

function exportStudy(){

    autoSave();

    const data =

        getStudyByDate(

            studyDate.value

        );

    const blob =

        new Blob(

            [

                JSON.stringify(

                    data,

                    null,

                    2

                )

            ],

            {

                type:"application/json"

            }

        );

    const link =

        document.createElement("a");

    link.href=

        URL.createObjectURL(blob);

    link.download=

        "PS365_Study_"

        +studyDate.value+

        ".json";

    link.click();

}

//------------------------------------
// Import Study
//------------------------------------

function importStudy(file){

    const reader=

        new FileReader();

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

//------------------------------------
// Simple Toast
//------------------------------------

function showToast(

    message,

    type="success"

){

    alert(message);

}



//==================================================
// Part 5 - Email & Application Sync
//==================================================

//------------------------------------
// Email Report
//------------------------------------

function sendEmailReport(){

    autoSave();

    const currentTimer = timerRunning

        ? pausedSeconds +

          Math.floor(

            (Date.now()-sessionStartTimestamp)/1000

          )

        :0;

    const total = totalSeconds + currentTimer;

    const completed = studyTopics
        .filter(t=>t.completed)
        .map(t=>"✅ "+t.title)
        .join("\n");

    const pending = studyTopics
        .filter(t=>!t.completed)
        .map(t=>"❌ "+t.title)
        .join("\n");

    const sessions = studySessions.map((s,index)=>{

        return `Session ${index+1}
${s.start} → ${s.end}
Duration : ${secondsToTime(s.duration)}
`;

    }).join("\n");

    const subject =
        `📚 PS365 Study Report - ${studyDate.value}`;

    const body =

`PS365 DAILY STUDY REPORT

📅 Date
${studyDate.value}

==================================

⏱ Total Study Time
${secondsToTime(total)}

==================================

📚 Topics Completed
${getCompletedTopics()}

📖 Topics Pending
${getPendingTopics()}

==================================

Completed Topics

${completed || "None"}

==================================

Pending Topics

${pending || "None"}

==================================

Study Sessions

${sessions || "No Sessions"}

==================================

Notes

${notes.value || "-"}

==================================

Generated by PS365 ❤️`;

    const email="pavithrandevo@gmail.com";

    window.location.href=

`mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

}

//==================================================
// Dashboard Sync
//==================================================

function refreshApplication(){

    localStorage.setItem(

        "dashboardRefresh",

        Date.now()

    );

    localStorage.setItem(

        "calendarRefresh",

        Date.now()

    );

    localStorage.setItem(

        "statsRefresh",

        Date.now()

    );

}

//==================================================
// Keyboard Shortcut
//==================================================

document.addEventListener(

    "keydown",

    function(e){

        if(

            e.ctrlKey &&

            e.key==="s"

        ){

            e.preventDefault();

            saveTodayStudy();

        }

    }

);

//==================================================
// Refresh Other Pages
//==================================================

window.addEventListener(

    "storage",

    function(){

        refreshStudyPage();

    }

);

//==================================================
// Restore Running Timer
//==================================================

window.addEventListener(

    "load",

    function(){

        restoreTimerState();

    }

);

//==================================================
// Final UI Refresh
//==================================================

refreshStudyPage();

console.log(

    "✅ PS365 Study Journal Loaded"

);
