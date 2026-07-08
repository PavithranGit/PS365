//==================================================
// PS365 V5 Study Module
// Part 1 - Initialization
//==================================================

//------------------------------------------
// Pomodoro Modes
//------------------------------------------

const MODES = {

    25:{study:25,break:5},

    50:{study:50,break:10},

    90:{study:90,break:15}

};

//------------------------------------------
// Application State
//------------------------------------------

let selectedMode = 25;

let timer = null;

let isRunning = false;

let isBreak = false;

let remainingSeconds = MODES[25].study * 60;

let completedSessions = 0;

let totalStudySeconds = 0;

let todayStudy = null;

let todayTopics = [];

let currentTopic = null;

//------------------------------------------
// DOM
//------------------------------------------

const todayDate=document.getElementById("todayDate");

const topicInput=document.getElementById("topicInput");

const topicList=document.getElementById("topicList");

const timerDisplay=document.getElementById("timerDisplay");

const sessionStatus=document.getElementById("sessionStatus");

const currentTopicLabel=document.getElementById("currentTopic");

const notes=document.getElementById("notes");

const sessionCount=document.getElementById("sessionCount");

const studyTime=document.getElementById("studyTime");

const completedTopics=document.getElementById("completedTopics");

const goalProgress=document.getElementById("goalProgress");

const goalLabel=document.getElementById("goalLabel");

//------------------------------------------
// Initialize
//------------------------------------------

document.addEventListener(

    "DOMContentLoaded",

    initializeStudy

);

function initializeStudy(){

    loadToday();

    bindEvents();

    selectMode(25);

    renderTopics();

    updateDashboard();

    loadQuote();

}

//------------------------------------------
// Today's Date
//------------------------------------------

function loadToday(){

    const today=new Date();

    const date=today.toISOString().split("T")[0];

    todayDate.innerHTML=

        today.toLocaleDateString(

            "en-IN",

            {

                day:"2-digit",

                month:"long",

                year:"numeric"

            }

        );

    //--------------------------------------

    // Read Existing Data

    //--------------------------------------

    todayStudy=

        getStudyByDate(date);

    if(todayStudy){

        todayTopics=

            todayStudy.topics||[];

        totalStudySeconds=

            todayStudy.totalSeconds||0;

        completedSessions=

            todayStudy.sessions||0;

        notes.value=

            todayStudy.notes||"";

    }

    else{

        todayTopics=[];

        completedSessions=0;

        totalStudySeconds=0;

    }

}

//------------------------------------------
// Events
//------------------------------------------

function bindEvents(){

    document

    .getElementById("addTopicBtn")

    .addEventListener(

        "click",

        addTopic

    );

    document

    .getElementById("startBtn")

    .addEventListener(

        "click",

        startTimer

    );

    document

    .getElementById("pauseBtn")

    .addEventListener(

        "click",

        pauseTimer

    );

    document

    .getElementById("resetBtn")

    .addEventListener(

        "click",

        resetTimer

    );

    document

    .getElementById("saveBtn")

    .addEventListener(

        "click",

        saveTodayStudy

    );

    document

    .getElementById("emailBtn")

    .addEventListener(

        "click",

        sendEmailReport

    );

    document

    .getElementById("finishDayBtn")

    .addEventListener(

        "click",

        finishDay

    );

    //----------------------------------

    // Pomodoro Modes

    //----------------------------------

    document

    .querySelectorAll(".mode-btn")

    .forEach(btn=>{

        btn.addEventListener(

            "click",

            function(){

                selectMode(

                    parseInt(

                        this.dataset.study

                    )

                );

            }

        );

    });

}

//------------------------------------------
// Select Mode
//------------------------------------------

function selectMode(mode){

    selectedMode=mode;

    isBreak=false;

    remainingSeconds=

        MODES[mode].study*60;

    document

    .querySelectorAll(".mode-btn")

    .forEach(btn=>{

        btn.classList.remove(

            "active"

        );

        if(

            parseInt(

                btn.dataset.study

            )===mode

        ){

            btn.classList.add(

                "active"

            );

        }

    });

    updateTimer();

}

//------------------------------------------
// Update Timer
//------------------------------------------

function updateTimer(){

    const mins=

        Math.floor(

            remainingSeconds/60

        );

    const secs=

        remainingSeconds%60;

    timerDisplay.innerHTML=

        String(mins).padStart(2,"0")

        +":"

        +

        String(secs).padStart(2,"0");

}

//==================================================
// Part 2 - Topics & Save
//==================================================

//--------------------------------------
// Add Topic
//--------------------------------------

function addTopic(){

    const title = topicInput.value.trim();

    if(title===""){

        topicInput.focus();

        return;

    }

    todayTopics.push({

        id:Date.now(),

        title:title,

        completed:false,

        created:new Date().toISOString()

    });

    topicInput.value="";

    if(currentTopic===null){

        currentTopic=todayTopics[0];

    }

    renderTopics();

    updateDashboard();

    saveTodayStudy();

}

//--------------------------------------
// Render Topics
//--------------------------------------

function renderTopics(){

    topicList.innerHTML="";

    if(todayTopics.length===0){

        topicList.innerHTML=`

        <div class="empty-state">

            <i class="fa-solid fa-book-open"></i>

            <p>

                No topics added today.

            </p>

        </div>

        `;

        currentTopicLabel.innerHTML="No Topic Selected";

        return;

    }

    todayTopics.forEach(topic=>{

        topicList.innerHTML+=`

        <div class="topic-item">

            <label>

                <input

                    type="checkbox"

                    ${topic.completed?"checked":""}

                    onchange="toggleTopic(${topic.id})">

                <span class="${
                    topic.completed?"completed":""
                }">

                    ${topic.title}

                </span>

            </label>

            <button

                class="delete-btn"

                onclick="deleteTopic(${topic.id})">

                <i class="fa-solid fa-trash"></i>

            </button>

        </div>

        `;

    });

    if(currentTopic){

        currentTopicLabel.innerHTML=

            currentTopic.title;

    }

}

//--------------------------------------
// Complete Topic
//--------------------------------------

function toggleTopic(id){

    const topic=

        todayTopics.find(

            t=>t.id===id

        );

    if(!topic)
        return;

    topic.completed=

        !topic.completed;

    //----------------------------------

    // Next Topic

    //----------------------------------

    if(topic.completed){

        const next=

            todayTopics.find(

                t=>!t.completed

            );

        currentTopic=

            next||null;

    }

    renderTopics();

    updateDashboard();

    saveTodayStudy();

}

//--------------------------------------
// Delete Topic
//--------------------------------------

function deleteTopic(id){

    if(!confirm(

        "Delete this topic?"

    )) return;

    todayTopics=

        todayTopics.filter(

            t=>t.id!==id

        );

    if(

        currentTopic &&

        currentTopic.id===id

    ){

        currentTopic=

            todayTopics.find(

                t=>!t.completed

            )||null;

    }

    renderTopics();

    updateDashboard();

    saveTodayStudy();

}

//--------------------------------------
// Save Today's Study
//--------------------------------------

function saveTodayStudy(){

    const today=

        new Date()

        .toISOString()

        .split("T")[0];

    saveStudy({

        date:today,

        totalSeconds:totalStudySeconds,

        totalHours:

        Number(

            (

                totalStudySeconds

                /3600

            ).toFixed(2)

        ),

        sessions:completedSessions,

        topics:todayTopics,

        notes:notes.value,

        updatedOn:

        new Date()

        .toISOString()

    });

    syncApplication();

}

//--------------------------------------
// Dashboard
//--------------------------------------

function updateDashboard(){

    const completed=

        todayTopics.filter(

            t=>t.completed

        ).length;

    completedTopics.innerHTML=

        completed;

    sessionCount.innerHTML=

        completedSessions;

    studyTime.innerHTML=

        formatDuration(

            totalStudySeconds

        );

    const percent=

        todayTopics.length===0

        ?0

        :Math.round(

            (

                completed/

                todayTopics.length

            )*100

        );

    goalProgress.style.width=

        percent+"%";

    goalLabel.innerHTML=

        completed+

        " / "+

        todayTopics.length+

        " Topics";

    const remaining=

        document.getElementById(

            "remainingTopics"

        );

    if(remaining){

        remaining.innerHTML=

            todayTopics.length-

            completed;

    }

    const summary=

        document.getElementById(

            "summaryTopic"

        );

    if(summary){

        summary.innerHTML=

            currentTopic

            ?currentTopic.title

            :"🎉 All Completed";

    }

    updateProductivity();

}

//==================================================
// Part 3 - Pomodoro Engine
//==================================================

//--------------------------------------
// Start Timer
//--------------------------------------

function startTimer(){

    if(isRunning)
        return;

    if(todayTopics.length===0){

        alert("Please add a study topic first.");

        return;

    }

    if(currentTopic===null){

        currentTopic=

            todayTopics.find(

                t=>!t.completed

            );

        if(!currentTopic){

            alert("All topics are completed.");

            return;

        }

    }

    currentTopicLabel.innerHTML=

        currentTopic.title;

    sessionStatus.innerHTML=

        isBreak

        ? "☕ Break Time"

        : "🍅 Focus Session";

    isRunning=true;

    document

        .querySelector(".timer-circle")

        .classList.add("running");

    timer=setInterval(

        timerTick,

        1000

    );

}

//--------------------------------------
// Timer Tick
//--------------------------------------

function timerTick(){

    if(remainingSeconds>0){

        remainingSeconds--;

        updateTimer();

        return;

    }

    clearInterval(timer);

    isRunning=false;

    document

        .querySelector(".timer-circle")

        .classList.remove("running");

    completeSession();

}

//--------------------------------------
// Pause
//--------------------------------------

function pauseTimer(){

    if(!isRunning)
        return;

    clearInterval(timer);

    isRunning=false;

    document

        .querySelector(".timer-circle")

        .classList.remove("running");

    sessionStatus.innerHTML=

        "⏸ Paused";

}

//--------------------------------------
// Reset
//--------------------------------------

function resetTimer(){

    clearInterval(timer);

    isRunning=false;

    document

        .querySelector(".timer-circle")

        .classList.remove("running");

    if(isBreak){

        remainingSeconds=

            MODES[selectedMode]

            .break*60;

    }

    else{

        remainingSeconds=

            MODES[selectedMode]

            .study*60;

    }

    updateTimer();

    sessionStatus.innerHTML=

        "Ready";

}

//--------------------------------------
// Session Complete
//--------------------------------------

function completeSession(){

    playBell();

    //----------------------------------

    // Focus Completed

    //----------------------------------

    if(!isBreak){

        completedSessions++;

        totalStudySeconds+=

            MODES[selectedMode]

            .study*60;

        updateDashboard();

        saveTodayStudy();

        showNotification(

            "🎉 Session Completed",

            "Time for a break."

        );

        //--------------------------------

        // Start Break

        //--------------------------------

        isBreak=true;

        remainingSeconds=

            MODES[selectedMode]

            .break*60;

        sessionStatus.innerHTML=

            "☕ Break Time";

    }

    //----------------------------------

    // Break Finished

    //----------------------------------

    else{

        showNotification(

            "☕ Break Finished",

            "Ready for the next session?"

        );

        isBreak=false;

        remainingSeconds=

            MODES[selectedMode]

            .study*60;

        sessionStatus.innerHTML=

            "🍅 Focus Session";

    }

    updateTimer();

}

//--------------------------------------
// Notification
//--------------------------------------

function showNotification(

    title,

    message

){

    notificationTitle.innerHTML=

        title;

    notificationMessage.innerHTML=

        message;

    notificationModal

        .classList

        .add("show");

}

//--------------------------------------
// Close Notification
//--------------------------------------

document

.getElementById(

    "notificationBtn"

)

.addEventListener(

    "click",

    function(){

        notificationModal

            .classList

            .remove("show");

    }

);

//--------------------------------------
// Bell
//--------------------------------------

function playBell(){

    if(!bellSound)
        return;

    bellSound.currentTime=0;

    bellSound.play()

    .catch(()=>{});

}

//--------------------------------------
// Format Duration
//--------------------------------------

function formatDuration(

    seconds

){

    const hrs=

        Math.floor(

            seconds/3600

        );

    const mins=

        Math.floor(

            (seconds%3600)/60

        );

    return(

        String(hrs).padStart(2,"0")

        +":"

        +

        String(mins).padStart(2,"0")

    );

}

//==================================================
// Part 4 - Save, Restore & Email
//==================================================

//--------------------------------------
// Auto Save Notes
//--------------------------------------

notes.addEventListener(

    "input",

    function(){

        saveTodayStudy();

    }

);

//--------------------------------------
// Finish Day
//--------------------------------------

function finishDay(){

    saveTodayStudy();

    alert(

        "🎉 Excellent!\n\nToday's study has been saved successfully."

    );

}

//--------------------------------------
// Email Report
//--------------------------------------

function sendEmailReport(){

    saveTodayStudy();

    const completed=

        todayTopics

        .filter(t=>t.completed)

        .map(t=>"✅ "+t.title)

        .join("\n");

    const pending=

        todayTopics

        .filter(t=>!t.completed)

        .map(t=>"⬜ "+t.title)

        .join("\n");

    const subject=

        "PS365 Daily Study Report";

    const body=

`📚 PS365 DAILY REPORT

📅 Date
${new Date().toLocaleDateString("en-IN")}

🍅 Pomodoro Sessions
${completedSessions}

⏱ Total Focus Time
${formatDuration(totalStudySeconds)}

=================================

✅ Completed Topics

${completed || "None"}

=================================

📖 Remaining Topics

${pending || "None"}

=================================

📝 Notes

${notes.value || "-"}

=================================

Generated from PS365`;

    window.location.href=

`mailto:pavithrandevo@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

}

//--------------------------------------
// Sync Dashboard
//--------------------------------------

function syncDashboard(){

    localStorage.setItem(

        "dashboardRefresh",

        Date.now()

    );

}

//--------------------------------------
// Sync Calendar
//--------------------------------------

function syncCalendar(){

    localStorage.setItem(

        "calendarRefresh",

        Date.now()

    );

}

//--------------------------------------
// Sync Statistics
//--------------------------------------

function syncStats(){

    localStorage.setItem(

        "statsRefresh",

        Date.now()

    );

}

//--------------------------------------
// Sync Everything
//--------------------------------------

function syncApplication(){

    syncDashboard();

    syncCalendar();

    syncStats();

}

//--------------------------------------
// Auto Save Every Minute
//--------------------------------------

setInterval(function(){

    saveTodayStudy();

},60000);

//--------------------------------------
// Save Before Closing
//--------------------------------------

window.addEventListener(

    "beforeunload",

    function(){

        saveTodayStudy();

    }

);

//--------------------------------------
// Restore Current Topic
//--------------------------------------

function restoreCurrentTopic(){

    currentTopic=

        todayTopics.find(

            t=>!t.completed

        ) || null;

    if(currentTopic){

        currentTopicLabel.innerHTML=

            currentTopic.title;

    }

    else{

        currentTopicLabel.innerHTML=

            "🎉 All Topics Completed";

    }

}

restoreCurrentTopic();

//==================================================
// Part 5 - Final Production Setup
//==================================================

//--------------------------------------
// Daily Quotes
//--------------------------------------

const DAILY_QUOTES=[

"Success is built one Pomodoro at a time.",

"Discipline beats motivation.",

"Consistency creates champions.",

"Small daily improvements lead to big results.",

"Today's effort is tomorrow's success.",

"Dream big. Study bigger.",

"Stay focused. Stay unstoppable.",

"Every completed topic brings you closer to TNPSC.",

"One session now is one step closer to your goal."

];

function loadQuote(){

    const quote=

        document.getElementById(

            "dailyQuote"

        );

    if(!quote)
        return;

    const index=

        new Date().getDate()

        %DAILY_QUOTES.length;

    quote.innerHTML=

        DAILY_QUOTES[index];

}

//--------------------------------------
// Productivity
//--------------------------------------

function updateProductivity(){

    const completed=

        todayTopics.filter(

            t=>t.completed

        ).length;

    const total=todayTopics.length;

    const percent=

        total===0

        ?0

        :Math.round(

            (completed/total)*100

        );

    let rating="🌱 Getting Started";

    if(percent>=25)

        rating="👍 Good";

    if(percent>=50)

        rating="💪 Great";

    if(percent>=75)

        rating="🚀 Excellent";

    if(percent===100)

        rating="🏆 Outstanding";

    const box=

        document.getElementById(

            "productivity"

        );

    if(box)

        box.innerHTML=rating;

}

//--------------------------------------
// Keyboard Shortcut
//--------------------------------------

document.addEventListener(

    "keydown",

    function(e){

        if(

            e.code==="Space" &&

            e.target.tagName!=="INPUT" &&

            e.target.tagName!=="TEXTAREA"

        ){

            e.preventDefault();

            if(isRunning)

                pauseTimer();

            else

                startTimer();

        }

    }

);

//--------------------------------------
// Hide Notification
//--------------------------------------

if(notificationModal){

    notificationModal

    .addEventListener(

        "click",

        function(e){

            if(

                e.target===notificationModal

            ){

                notificationModal

                .classList

                .remove("show");

            }

        }

    );

}

//--------------------------------------
// Daily Goal
//--------------------------------------

function updateGoal(){

    const goal=8;

    const percent=Math.min(

        Math.round(

            (

                completedSessions/

                goal

            )*100

        ),

        100

    );

    goalProgress.style.width=

        percent+"%";

    goalLabel.innerHTML=

        completedSessions+

        " / "+

        goal+

        " Sessions";

}

//--------------------------------------
// Refresh UI
//--------------------------------------

function refreshUI(){

    renderTopics();

    restoreCurrentTopic();

    updateDashboard();

    updateGoal();

    updateProductivity();

    loadQuote();

    updateTimer();

}

//--------------------------------------
// Initialize UI
//--------------------------------------

refreshUI();

console.log(

    "✅ PS365 V5 Loaded Successfully"

);
