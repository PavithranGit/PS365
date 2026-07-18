//======================================================
// PS365 Study Module V8
// Part 1 - Foundation
//======================================================

"use strict";

//======================================================
// Pomodoro Modes
//======================================================

const MODES={

    1:{study:1,break:1},

    25:{study:25,break:5},

    50:{study:50,break:10},

    90:{study:90,break:15}

};

//======================================================
// Global State
//======================================================

let selectedMode=25;

let timer=null;

let isRunning=false;

let isPaused=false;

let isBreak=false;

let remainingSeconds=

    MODES[25].study*60;

let timerDuration=

    MODES[25].study*60;

let timerStartedAt=null;

let completedSessions=0;

let totalStudySeconds=0;

let todayStudy=null;

let todayTopics=[];

let currentTopic=null;

let weeklyPlanner={};

let selectedWeekDay="Monday";

//======================================================
// DOM
//======================================================

const todayDate=

    document.getElementById("todayDate");

const topicInput=

    document.getElementById("topicInput");

const topicList=

    document.getElementById("topicList");

const timerDisplay=

    document.getElementById("timerDisplay");

const sessionStatus=

    document.getElementById("sessionStatus");

const currentTopicLabel=

    document.getElementById("currentTopic");

const notes=

    document.getElementById("notes");

const sessionCount=

    document.getElementById("sessionCount");

const studyTime=

    document.getElementById("studyTime");

const completedTopics=

    document.getElementById("completedTopics");

const goalProgress=

    document.getElementById("goalProgress");

const goalLabel=

    document.getElementById("goalLabel");

const summaryTopic=

    document.getElementById("summaryTopic");

const remainingTopics=

    document.getElementById("remainingTopics");

const productivity=

    document.getElementById("productivity");

const breakTimer=

    document.getElementById("breakTimer");

const breakStatus=

    document.getElementById("breakStatus");

const weeklyTaskInput=

    document.getElementById("weeklyTaskInput");

const weeklyTaskList=

    document.getElementById("weeklyTaskList");

const selectedDayLabel=

    document.getElementById("selectedDay");

const bellSound=

    document.getElementById("bellSound");

const motivationSound=

    document.getElementById("motivationSound");

const breakEndSound=

    document.getElementById("breakEndSound");

const notificationModal=

    document.getElementById("notificationModal");

const notificationTitle=

    document.getElementById("notificationTitle");

const notificationMessage=

    document.getElementById("notificationMessage");

//======================================================
// Initialize
//======================================================

document.addEventListener(

    "DOMContentLoaded",

    initializeStudy

);

//======================================================
// Greeting
//======================================================

function loadGreeting(){

    const hour=

        new Date().getHours();

    let greeting=

        "Good Evening";

    if(hour<12)

        greeting="Good Morning";

    else if(hour<17)

        greeting="Good Afternoon";

    const greetingEl=

        document.getElementById("greeting");

    if(greetingEl){

        greetingEl.innerHTML=

            greeting+" 👋";

    }

}

//======================================================
// Initialize Study
//======================================================

function initializeStudy(){

    loadGreeting();

    loadToday();

    loadWeeklyPlanner();

    bindEvents();

    selectMode(25);

    renderTopics();

    renderWeeklyPlanner();

    updateDashboard();

    restoreCurrentTopic();

    restoreRunningTimer();

    loadQuote();

    updateGoal();

    updateProductivity();

    updateTimer();

}

//======================================================
// Load Today's Study
//======================================================

function loadToday(){

    const today=

        getTodayDate();

    todayStudy=

        getStudyLog(today);

    if(!todayStudy){

        todayStudy={

            date:today,

            topics:[],

            sessions:0,

            totalSeconds:0,

            notes:""

        };

    }

    todayTopics=

        todayStudy.topics||[];

    completedSessions=

        todayStudy.sessions||0;

    totalStudySeconds=

        todayStudy.totalSeconds||0;

    if(notes)

        notes.value=

            todayStudy.notes||"";

    if(todayDate){

        todayDate.innerHTML=

            new Date()

            .toLocaleDateString(

                "en-IN",

                {

                    day:"2-digit",

                    month:"long",

                    year:"numeric"

                }

            );

    }

}

//======================================================
// Load Weekly Planner
//======================================================

function loadWeeklyPlanner(){

    weeklyPlanner=

        getWeeklyPlanner();

}

//======================================================
// Save Today's Study
//======================================================

function saveTodayStudy(){

    todayStudy.topics=

        todayTopics;

    todayStudy.sessions=

        completedSessions;

    todayStudy.totalSeconds=

        totalStudySeconds;

    todayStudy.notes=

        notes

        ?notes.value

        :"";

    saveStudyLog(

        todayStudy

    );

    syncApplication();

}

//======================================================
// Helpers
//======================================================

function formatDuration(seconds){

    const hrs=

        Math.floor(

            seconds/3600

        );

    const mins=

        Math.floor(

            (

                seconds%3600

            )/60

        );

    return(

        String(hrs)

        .padStart(2,"0")

        +

        ":"

        +

        String(mins)

        .padStart(2,"0")

    );

}

console.log(

    "✅ Study V8 Part 1 Loaded"

);

//======================================================
// Part 2A
// Event Binding
//======================================================

function bindEvents(){

    //----------------------------------
    // Topics
    //----------------------------------

    document

    .getElementById("addTopicBtn")

    ?.addEventListener(

        "click",

        addTopic

    );

    topicInput?.addEventListener(

        "keydown",

        function(e){

            if(e.key==="Enter"){

                e.preventDefault();

                addTopic();

            }

        }

    );

    //----------------------------------
    // Timer
    //----------------------------------

    document

    .getElementById("startBtn")

    ?.addEventListener(

        "click",

        startTimer

    );

    document

    .getElementById("pauseBtn")

    ?.addEventListener(

        "click",

        pauseTimer

    );

    document

    .getElementById("resetBtn")

    ?.addEventListener(

        "click",

        resetTimer

    );

    //----------------------------------
    // Save
    //----------------------------------

    document

    .getElementById("saveBtn")

    ?.addEventListener(

        "click",

        saveTodayStudy

    );

    document

    .getElementById("finishDayBtn")

    ?.addEventListener(

        "click",

        finishDay

    );

    document

    .getElementById("emailBtn")

    ?.addEventListener(

        "click",

        sendEmailReport

    );

    //----------------------------------
    // Notes
    //----------------------------------

    notes?.addEventListener(

        "input",

        function(){

            saveTodayStudy();

        }

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

                if(isRunning)

                    return;

                selectMode(

                    Number(

                        this.dataset.study

                    )

                );

            }

        );

    });

    //----------------------------------
    // Weekly Planner Days
    //----------------------------------

    document

    .querySelectorAll(".planner-day")

    .forEach(btn=>{

        btn.addEventListener(

            "click",

            function(){

                document

                .querySelectorAll(

                    ".planner-day"

                )

                .forEach(

                    x=>x.classList.remove(

                        "active"

                    )

                );

                this.classList.add(

                    "active"

                );

                selectedWeekDay=

                    this.dataset.day;

                renderWeeklyPlanner();

            }

        );

    });

    //----------------------------------
    // Weekly Add
    //----------------------------------

    document

    .getElementById(

        "addWeeklyTaskBtn"

    )

    ?.addEventListener(

        "click",

        addWeeklyTaskUI

    );

}

//======================================================
// Part 2B
// Topic Management
//======================================================

//======================================================
// Add Topic
//======================================================

function addTopic(){

    const title=

        topicInput.value.trim();

    if(title===""){

        topicInput.focus();

        return;

    }

    const topic={

        id:Date.now(),

        title:title,

        completed:false,

        createdOn:now(),

        completedOn:null,

        sessions:0

    };

    todayTopics.push(topic);

    topicInput.value="";

    if(!currentTopic){

        currentTopic=topic;

    }

    saveTodayStudy();

    renderTopics();

    updateDashboard();

}

//======================================================
// Render Topics
//======================================================

function renderTopics(){

    if(!topicList)

        return;

    topicList.innerHTML="";

    if(todayTopics.length===0){

        topicList.innerHTML=

        `

        <div class="empty-state">

            <i class="fa-solid fa-book-open"></i>

            <p>No Topics Added</p>

        </div>

        `;

        currentTopicLabel.innerHTML=

            "No Topic Selected";

        return;

    }

    todayTopics.forEach(topic=>{

        const div=

            document.createElement("div");

        div.className="topic-item";

        div.innerHTML=

        `

        <label>

            <input

                type="checkbox"

                ${topic.completed?"checked":""}

            >

            <span class="${topic.completed?"completed":""}">

                ${topic.title}

            </span>

        </label>

        <button class="delete-btn">

            <i class="fa-solid fa-trash"></i>

        </button>

        `;

        div

        .querySelector("input")

        .addEventListener(

            "change",

            ()=>toggleTopic(topic.id)

        );

        div

        .querySelector(".delete-btn")

        .addEventListener(

            "click",

            ()=>deleteTopic(topic.id)

        );

        topicList.appendChild(div);

    });

    restoreCurrentTopic();

}

//======================================================
// Render Weekly Planner
//======================================================

function renderWeeklyPlanner(){

    if(selectedDayLabel){

        selectedDayLabel.innerHTML=

            selectedWeekDay+" Plan";

    }

    if(!weeklyTaskList)

        return;

    const tasks=

        getWeeklyTasks(selectedWeekDay);

    weeklyTaskList.innerHTML="";

    if(tasks.length===0){

        weeklyTaskList.innerHTML=

        `

        <div class="empty-state">

            <i class="fa-solid fa-calendar-day"></i>

            <p>No Tasks Planned</p>

        </div>

        `;

        return;

    }

    tasks.forEach(task=>{

        const div=

            document.createElement("div");

        div.className="topic-item";

        div.innerHTML=

        `

        <label>

            <input

                type="checkbox"

                ${task.completed?"checked":""}

            >

            <span class="${task.completed?"completed":""}">

                ${task.title}

            </span>

        </label>

        <button class="delete-btn">

            <i class="fa-solid fa-trash"></i>

        </button>

        `;

        div

        .querySelector("input")

        .addEventListener(

            "change",

            function(){

                updateWeeklyTask(

                    selectedWeekDay,

                    task.id,

                    this.checked

                );

                renderWeeklyPlanner();

            }

        );

        div

        .querySelector(".delete-btn")

        .addEventListener(

            "click",

            function(){

                if(

                    !confirm(

                        "Delete this task?"

                    )

                )

                return;

                deleteWeeklyTask(

                    selectedWeekDay,

                    task.id

                );

                renderWeeklyPlanner();

            }

        );

        weeklyTaskList.appendChild(div);

    });

}

//======================================================
// Add Weekly Task (UI)
//======================================================

function addWeeklyTaskUI(){

    if(!weeklyTaskInput)

        return;

    const title=

        weeklyTaskInput.value.trim();

    if(title===""){

        weeklyTaskInput.focus();

        return;

    }

    addWeeklyTask(

        selectedWeekDay,

        title

    );

    weeklyTaskInput.value="";

    renderWeeklyPlanner();

}

//======================================================
// Toggle Topic
//======================================================

function toggleTopic(id){

    const topic=

        todayTopics.find(

            x=>x.id===id

        );

    if(!topic)

        return;

    topic.completed=

        !topic.completed;

    topic.completedOn=

        topic.completed

        ?now()

        :null;

    restoreCurrentTopic();

    saveTodayStudy();

    renderTopics();

    updateDashboard();

}

//======================================================
// Delete Topic
//======================================================

function deleteTopic(id){

    if(

        !confirm(

            "Delete this topic?"

        )

    )

    return;

    todayTopics=

        todayTopics.filter(

            x=>x.id!==id

        );

    restoreCurrentTopic();

    saveTodayStudy();

    renderTopics();

    updateDashboard();

}

//======================================================
// Restore Current Topic
//======================================================

function restoreCurrentTopic(){

    currentTopic=

        todayTopics.find(

            x=>!x.completed

        ) || null;

    if(currentTopicLabel){

        currentTopicLabel.innerHTML=

            currentTopic

            ?currentTopic.title

            :"🎉 All Topics Completed";

    }

}

//======================================================
// Helpers
//======================================================

function getCompletedTopicCount(){

    return todayTopics.filter(

        x=>x.completed

    ).length;

}

function getRemainingTopicCount(){

    return todayTopics.filter(

        x=>!x.completed

    ).length;

}

console.log(

    "✅ Part 2B Loaded"

);

//======================================================
// Part 2C
// Dashboard Engine
//======================================================

//======================================================
// Dashboard
//======================================================

function updateDashboard(){

    //----------------------------------

    // Sessions

    //----------------------------------

    if(sessionCount){

        sessionCount.innerHTML=

            completedSessions;

    }

    //----------------------------------

    // Study Time

    //----------------------------------

    if(studyTime){

        studyTime.innerHTML=

            formatDuration(

                totalStudySeconds

            );

    }

    //----------------------------------

    // Completed Topics

    //----------------------------------

    const completed=

        getCompletedTopicCount();

    const remaining=

        getRemainingTopicCount();

    if(completedTopics){

        completedTopics.innerHTML=

            completed;

    }

    //----------------------------------

    // Remaining

    //----------------------------------

    if(remainingTopics){

        remainingTopics.innerHTML=

            remaining;

    }

    //----------------------------------

    // Summary

    //----------------------------------

    if(summaryTopic){

        summaryTopic.innerHTML=

            currentTopic

            ?

            currentTopic.title

            :

            "🎉 All Topics Completed";

    }

    //----------------------------------

    updateGoal();

    updateProductivity();

}

//======================================================
// Goal
//======================================================

function updateGoal(){

    const total=

        todayTopics.length;

    const completed=

        getCompletedTopicCount();

    let percent=0;

    if(total>0){

        percent=Math.round(

            (

                completed/

                total

            )*100

        );

    }

    if(goalProgress){

        goalProgress.style.width=

            percent+"%";

    }

    const goalText=

        document.querySelector(

            ".goal-text span:first-child"

        );

    if(goalText){

        goalText.innerHTML=

            percent+"%";

    }

    if(goalLabel){

        goalLabel.innerHTML=

            completed+

            " / "+

            total+

            " Topics";

    }

}

//======================================================
// Productivity
//======================================================

function updateProductivity(){

    if(!productivity)

        return;

    const percent=

        todayTopics.length===0

        ?0

        :Math.round(

            (

                getCompletedTopicCount()

                /

                todayTopics.length

            )*100

        );

    let text=

        "🌱 Getting Started";

    if(percent>=25)

        text="🙂 Good";

    if(percent>=50)

        text="💪 Great";

    if(percent>=75)

        text="🚀 Excellent";

    if(percent===100)

        text="🏆 Outstanding";

    productivity.innerHTML=text;

}

//======================================================
// Quote
//======================================================

const DAILY_QUOTES=[

    "Success is built one Pomodoro at a time.",

    "Discipline beats motivation.",

    "Consistency creates champions.",

    "Small daily improvements create big results.",

    "One session today is success tomorrow.",

    "Stay focused.",

    "Never skip today's study.",

    "Consistency wins every exam."

];

function loadQuote(){

    const box=

        document.getElementById(

            "dailyQuote"

        );

    if(!box)

        return;

    const index=

        new Date().getDate()

        %

        DAILY_QUOTES.length;

    box.innerHTML=

        DAILY_QUOTES[index];

}

//======================================================
// Finish Day
//======================================================

function finishDay(){

    saveTodayStudy();

    showNotification(

        "🎉 Great Work!",

        "Today's study has been saved."

    );

}

//======================================================
// Send Email Report
//======================================================

function sendEmailReport(){

    saveTodayStudy();

    const profile=

        getData().profile||{};

    const topicLines=

        todayTopics.length===0

        ?"No topics added today."

        :todayTopics.map(t=>

            (t.completed?"[Done] ":"[Pending] ")

            +t.title

            +" - "

            +t.sessions

            +" session(s)"

        ).join("\n");

    const subject=

        "PS365 Study Report - "

        +getTodayDate();

    const body=

        "Name: "+(profile.name||"-")+"\n"+

        "Exam: "+(profile.exam||"-")+"\n\n"+

        "Sessions Completed: "+completedSessions+"\n"+

        "Total Study Time: "+

            formatDuration(totalStudySeconds)+"\n\n"+

        "Topics:\n"+topicLines;

    const mailtoLink=

        "mailto:?subject="

        +encodeURIComponent(subject)

        +"&body="

        +encodeURIComponent(body);

    window.location.href=

        mailtoLink;

}

//======================================================
// Auto Save
//======================================================

setInterval(function(){

    saveTodayStudy();

},60000);

window.addEventListener(

    "beforeunload",

    saveTodayStudy

);

console.log(

    "✅ Part 2C Loaded"

);

//======================================================
// Part 3A
// Timer Foundation
//======================================================

//======================================================
// Select Pomodoro Mode
//======================================================

function selectMode(mode){

    if(isRunning)

        return;

    selectedMode=mode;

    isBreak=false;

    timerDuration=

        MODES[mode].study*60;

    remainingSeconds=

        timerDuration;

    document

        .querySelectorAll(".mode-btn")

        .forEach(btn=>{

            btn.classList.remove("active");

            if(

                Number(btn.dataset.study)

                ===mode

            ){

                btn.classList.add("active");

            }

        });

    updateTimer();

}

//======================================================
// Update Timer Display
//======================================================

function updateTimer(){

    const mins=

        Math.floor(

            remainingSeconds/60

        );

    const secs=

        remainingSeconds%60;

    if(timerDisplay){

        timerDisplay.innerHTML=

            String(mins)

            .padStart(2,"0")

            +

            ":"

            +

            String(secs)

            .padStart(2,"0");

    }

    //----------------------------------
    // Break Timer
    //----------------------------------

    if(breakTimer){

        if(isBreak){

            breakTimer.innerHTML=

                String(mins)

                .padStart(2,"0")

                +

                ":"

                +

                String(secs)

                .padStart(2,"0");

        }

        else{

            breakTimer.innerHTML=

                "00:00";

        }

    }

    //----------------------------------
    // Circle Progress
    //----------------------------------

    const circle=

        document.querySelector(

            ".timer-circle"

        );

    if(circle){

        const percent=

            (

                remainingSeconds/

                timerDuration

            )*100;

        circle.style.background=

        `conic-gradient(
            #6C63FF ${percent}%,
            #E5E7EB ${percent}%
        )`;

    }

}

//======================================================
// Start Timer
//======================================================

function startTimer(){

    unlockAudio();

    if(isRunning)

        return;

    if(

        todayTopics.length===0

    ){

        alert(

            "Please add a study topic."

        );

        return;

    }

    if(currentTopic===null){

        restoreCurrentTopic();

        if(currentTopic===null){

            alert(

                "All topics completed."

            );

            return;

        }

    }

    currentTopicLabel.innerHTML=

        currentTopic.title;

    sessionStatus.innerHTML=

        isBreak

        ?

        "☕ Break Time"

        :

        "🍅 Focus Session";

    isRunning=true;

    isPaused=false;

    timerStartedAt=

        Date.now()

        -

        (

            (

                timerDuration

                -

                remainingSeconds

            )

            *1000

        );

    document

        .querySelector(

            ".timer-circle"

        )

        ?.classList

        .add("running");

    clearInterval(timer);

    timer=

        setInterval(

            timerTick,

            1000

        );

    saveRunningTimer({

        mode:selectedMode,

        isBreak:isBreak,

        remainingSeconds:remainingSeconds,

        timerDuration:timerDuration,

        timerStartedAt:timerStartedAt,

        currentTopic:

            currentTopic

            ?currentTopic.id

            :null

    });

}

console.log(

    "✅ Part 3A Loaded"

);


//======================================================
// Part 3B
// Timer Engine
//======================================================

//======================================================
// Timer Tick
//======================================================

function timerTick(){

    if(!isRunning)
        return;

    const elapsed=

        Math.floor(

            (

                Date.now()

                -

                timerStartedAt

            )/1000

        );

    remainingSeconds=

        timerDuration-

        elapsed;

    //----------------------------------

    if(remainingSeconds<=0){

        remainingSeconds=0;

        updateTimer();

        clearInterval(timer);

        timer=null;

        isRunning=false;

        completeSession();

        return;

    }

    updateTimer();

    saveRunningTimer({

        mode:selectedMode,

        isBreak:isBreak,

        remainingSeconds,

        timerDuration,

        timerStartedAt,

        currentTopic:

            currentTopic

            ?currentTopic.id

            :null

    });

}

//======================================================
// Pause Timer
//======================================================

function pauseTimer(){

    if(!isRunning)

        return;

    clearInterval(timer);

    timer=null;

    isRunning=false;

    isPaused=true;

    sessionStatus.innerHTML=

        "⏸ Paused";

    saveRunningTimer({

        mode:selectedMode,

        isBreak,

        remainingSeconds,

        timerDuration,

        timerStartedAt,

        paused:true,

        currentTopic:

            currentTopic

            ?currentTopic.id

            :null

    });

}

//======================================================
// Reset Timer
//======================================================

function resetTimer(){

    clearInterval(timer);

    timer=null;

    isRunning=false;

    isPaused=false;

    timerStartedAt=null;

    if(isBreak){

        timerDuration=

            MODES[selectedMode].break*60;

    }

    else{

        timerDuration=

            MODES[selectedMode].study*60;

    }

    remainingSeconds=

        timerDuration;

    sessionStatus.innerHTML=

        "Ready";

    updateTimer();

    clearRunningTimer();

}

//======================================================
// Restore Running Timer
//======================================================

function restoreRunningTimer(){

    const running=

        getRunningTimer();

    if(!running)

        return;

    selectedMode=

        running.mode;

    isBreak=

        running.isBreak;

    timerDuration=

        running.timerDuration;

    timerStartedAt=

        running.timerStartedAt;

    remainingSeconds=

        running.remainingSeconds;

    //----------------------------------

    // Restore Topic

    //----------------------------------

    if(

        running.currentTopic

    ){

        currentTopic=

            todayTopics.find(

                x=>

                x.id===

                running.currentTopic

            ) || null;

    }

    //----------------------------------

    if(

        running.paused

    ){

        isPaused=true;

        updateTimer();

        sessionStatus.innerHTML=

            "⏸ Paused";

        return;

    }

    //----------------------------------

    // Continue Running

    //----------------------------------

    const elapsed=

        Math.floor(

            (

                Date.now()

                -

                timerStartedAt

            )/1000

        );

    remainingSeconds=

        timerDuration-

        elapsed;

    if(

        remainingSeconds<=0

    ){

        remainingSeconds=0;

        completeSession();

        return;

    }

    isRunning=true;

    timer=

        setInterval(

            timerTick,

            1000

        );

    updateTimer();

}

//======================================================
// Auto Save Running Timer
//======================================================

setInterval(function(){

    if(isRunning){

        saveRunningTimer({

            mode:selectedMode,

            isBreak,

            remainingSeconds,

            timerDuration,

            timerStartedAt,

            currentTopic:

                currentTopic

                ?currentTopic.id

                :null

        });

    }

},5000);

//======================================================
// Recover After Sleep
//======================================================

window.addEventListener(

    "focus",

    restoreRunningTimer

);

document.addEventListener(

    "visibilitychange",

    function(){

        if(

            !document.hidden

        ){

            restoreRunningTimer();

        }

    }

);

console.log(

    "✅ Part 3B Loaded"

);


//======================================================
// Part 3C
// Session Completion Engine
//======================================================

let pomodoroCycle=0;

//======================================================
// Complete Session
//======================================================

function completeSession(){

    playBell();

    //----------------------------------
    // Focus Session Completed
    //----------------------------------

    if(!isBreak){

        playMotivation();

        completedSessions++;

        totalStudySeconds+=

            MODES[selectedMode].study*60;

        //----------------------------------

        if(currentTopic){

            currentTopic.sessions++;

        }

        //----------------------------------

        saveTodayStudy();

        updateDashboard();

        refreshAchievements();

        pomodoroCycle++;

        //----------------------------------
        // Long Break
        //----------------------------------

        if(pomodoroCycle>=4){

            pomodoroCycle=0;

            isBreak=true;

            timerDuration=15*60;

            remainingSeconds=timerDuration;

            sessionStatus.innerHTML=

                "🌴 Long Break";

            if(breakStatus){

                breakStatus.innerHTML=

                    "Take a well deserved 15 minute break.";

            }

            showNotification(

                "🎉 Focus Completed",

                "Long Break Started"

            );

        }

        //----------------------------------
        // Normal Break
        //----------------------------------

        else{

            isBreak=true;

            timerDuration=

                MODES[selectedMode].break*60;

            remainingSeconds=

                timerDuration;

            sessionStatus.innerHTML=

                "☕ Break Time";

            if(breakStatus){

                breakStatus.innerHTML=

                    "Relax for a few minutes.";

            }

            showNotification(

                "🎉 Session Completed",

                "Time for a short break."

            );

        }

    }

    //----------------------------------
    // Break Finished
    //----------------------------------

    else{

        playBreakEnd();

        isBreak=false;

        timerDuration=

            MODES[selectedMode].study*60;

        remainingSeconds=

            timerDuration;

        sessionStatus.innerHTML=

            "🍅 Focus Session";

        if(breakStatus){

            breakStatus.innerHTML=

                "Ready for next focus session.";

        }

        showNotification(

            "☕ Break Finished",

            "Ready for the next Pomodoro?"

        );

    }

    updateTimer();

    clearRunningTimer();

}

//======================================================
// Notification
//======================================================

function showNotification(

    title,

    message

){

    if(notificationTitle){

        notificationTitle.innerHTML=

            title;

    }

    if(notificationMessage){

        notificationMessage.innerHTML=

            message;

    }

    if(notificationModal){

        notificationModal.classList.add(

            "show"

        );

    }

    //----------------------------------

    if(

        "Notification" in window

    ){

        if(

            Notification.permission==="granted"

        ){

            new Notification(

                title,

                {

                    body:message

                }

            );

        }

        else if(

            Notification.permission!=="denied"

        ){

            Notification.requestPermission();

        }

    }

}

//======================================================
// Close Notification
//======================================================

document

.getElementById(

    "notificationBtn"

)

?.addEventListener(

    "click",

    function(){

        notificationModal

        ?.classList

        .remove(

            "show"

        );

    }

);

//======================================================
// Unlock Audio (Mobile Autoplay Fix)
//======================================================

let audioUnlocked=false;

function unlockAudio(){

    if(audioUnlocked)

        return;

    [bellSound,motivationSound,breakEndSound].forEach(

        function(el){

            if(!el)

                return;

            el.play()

            .then(function(){

                el.pause();

                el.currentTime=0;

            })

            .catch(function(){});

        }

    );

    audioUnlocked=true;

}

//======================================================
// Bell
//======================================================

function playBell(){

    if(!bellSound)

        return;

    bellSound.currentTime=0;

    bellSound.play()

    .catch(()=>{});

}

//======================================================
// Motivation Song
//======================================================

function playMotivation(){

    if(!motivationSound)

        return;

    motivationSound.currentTime=0;

    motivationSound.play()

    .catch(()=>{});

}

//======================================================
// Break End Song
//======================================================

function playBreakEnd(){

    if(!breakEndSound)

        return;

    breakEndSound.currentTime=0;

    breakEndSound.play()

    .catch(()=>{});

}

//======================================================
// Session History
//======================================================

function saveSessionHistory(){

    const history=

        getData()

        .sessionHistory

        ||[];

    history.unshift({

        date:getTodayDate(),

        topic:

            currentTopic

            ?

            currentTopic.title

            :"No Topic",

        duration:

            MODES[selectedMode].study,

        completedOn:now()

    });

    const data=

        getData();

    data.sessionHistory=

        history.slice(0,200);

    saveData(data);

}

//======================================================
// Auto Session Save
//======================================================

function completeFocusSession(){

    saveSessionHistory();

    completeSession();

}

console.log(

    "✅ Part 3C Loaded"

);