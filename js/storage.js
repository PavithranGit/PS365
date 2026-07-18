//======================================================
// PS365 Storage Manager V3
// Part 1 - Core Storage (Updated)
//======================================================

const STORAGE_KEY = "ps365Data";

const STORAGE_VERSION = 3;

//======================================================
// Default Data
//======================================================

const DEFAULT_DATA = {

    version: STORAGE_VERSION,

    profile: {

        name: "Saaruja",

        exam: "TNPSC Group 1",

        createdOn: new Date().toISOString()

    },

    studyLogs: [],

    weeklyPlanner: {

        Monday: [],

        Tuesday: [],

        Wednesday: [],

        Thursday: [],

        Friday: [],

        Saturday: [],

        Sunday: []

    },

    runningTimer: null,

    statistics: {

        totalStudySeconds: 0,

        totalSessions: 0,

        totalCompletedTopics: 0,

        streak: 0,

        bestDay: "",

        weeklyStudySeconds: 0,

        monthlyStudySeconds: 0

    },

    achievements: {

        unlocked: [],

        lastUnlocked: null

    },

    settings: {

        darkMode: false,

        notification: true,

        sound: true,

        autoSave: true,

        dailyGoal: 8

    }

};

//======================================================
// Initialize Storage
//======================================================

function initializeStorage() {

    const raw = localStorage.getItem(STORAGE_KEY);

    if (!raw) {

        saveData(structuredClone(DEFAULT_DATA));

        return;

    }

    try {

        const existing = JSON.parse(raw);

        const merged = {

            ...DEFAULT_DATA,

            ...existing,

            profile: {

                ...DEFAULT_DATA.profile,

                ...(existing.profile || {})

            },

            statistics: {

                ...DEFAULT_DATA.statistics,

                ...(existing.statistics || {})

            },

            settings: {

                ...DEFAULT_DATA.settings,

                ...(existing.settings || {})

            },

            achievements: {

                ...DEFAULT_DATA.achievements,

                ...(existing.achievements || {})

            },

            weeklyPlanner: {

                ...DEFAULT_DATA.weeklyPlanner,

                ...(existing.weeklyPlanner || {})

            }

        };

        merged.version = STORAGE_VERSION;

        localStorage.setItem(

            STORAGE_KEY,

            JSON.stringify(merged)

        );

    }

    catch {

        console.warn(

            "Corrupted Storage. Resetting..."

        );

        saveData(structuredClone(DEFAULT_DATA));

    }

}

//======================================================
// Core Functions
//======================================================

function getData() {

    initializeStorage();

    return JSON.parse(

        localStorage.getItem(STORAGE_KEY)

    );

}

function saveData(data) {

    data.version = STORAGE_VERSION;

    localStorage.setItem(

        STORAGE_KEY,

        JSON.stringify(data)

    );

}

function resetStorage() {

    localStorage.removeItem(STORAGE_KEY);

    initializeStorage();

}

function exportStorage() {

    return JSON.stringify(

        getData(),

        null,

        2

    );

}

function importStorage(json) {

    const imported = JSON.parse(json);

    saveData(imported);

}

//======================================================
// Date Helpers
//======================================================

function getTodayDate() {

    return new Date()

        .toISOString()

        .split("T")[0];

}

function getTodayDay() {

    return new Date()

        .toLocaleDateString(

            "en-US",

            {

                weekday: "long"

            }

        );

}

function now() {

    return new Date().toISOString();

}

//======================================================
// Utility
//======================================================

function deepClone(obj) {

    return JSON.parse(

        JSON.stringify(obj)

    );

}

//======================================================
// Initialize
//======================================================

initializeStorage();

console.log(

    "✅ PS365 Storage V3 Initialized"

);


//======================================================
// Part 2 - Study Logs API
//======================================================

//======================================================
// Get All Study Logs
//======================================================

function getAllStudyLogs(){

    return getData().studyLogs;

}

//======================================================
// Get Today's Study
//======================================================

function getTodayStudy(){

    return getStudyLog(getTodayDate());

}

function getStudyLog(date){

    const data=getData();

    return data.studyLogs.find(

        x=>x.date===date

    ) || null;

}

//======================================================
// Save Study Log
//======================================================

function saveStudyLog(study){

    const data=getData();

    const index=

        data.studyLogs.findIndex(

            x=>x.date===study.date

        );

    study.updatedOn=now();

    if(index===-1){

        study.createdOn=now();

        data.studyLogs.push(study);

    }

    else{

        study.createdOn=

            data.studyLogs[index]

            .createdOn;

        data.studyLogs[index]=study;

    }

    saveData(data);

    updateStatistics();

}

//======================================================
// Delete Study Log
//======================================================

function deleteStudyLog(date){

    const data=getData();

    data.studyLogs=

        data.studyLogs.filter(

            x=>x.date!==date

        );

    saveData(data);

    updateStatistics();

}

//======================================================
// Save Notes
//======================================================

function saveStudyNotes(

    date,

    notes

){

    let study=

        getStudyLog(date);

    if(!study){

        study={

            date:date,

            topics:[],

            sessions:0,

            totalSeconds:0,

            notes:""

        };

    }

    study.notes=notes;

    saveStudyLog(study);

}

//======================================================
// Save Topics
//======================================================

function saveStudyTopics(

    date,

    topics

){

    let study=

        getStudyLog(date);

    if(!study){

        study={

            date,

            notes:"",

            sessions:0,

            totalSeconds:0,

            topics:[]

        };

    }

    study.topics=topics;

    saveStudyLog(study);

}

//======================================================
// Save Session
//======================================================

function addStudySession(

    date,

    seconds

){

    let study=

        getStudyLog(date);

    if(!study){

        study={

            date,

            topics:[],

            notes:"",

            sessions:0,

            totalSeconds:0

        };

    }

    study.sessions++;

    study.totalSeconds+=seconds;

    saveStudyLog(study);

}

//======================================================
// Completed Topics
//======================================================

function getCompletedTopics(

    date

){

    const study=

        getStudyLog(date);

    if(!study)

        return 0;

    return study.topics.filter(

        x=>x.completed

    ).length;

}

//======================================================
// Pending Topics
//======================================================

function getPendingTopics(

    date

){

    const study=

        getStudyLog(date);

    if(!study)

        return [];

    return study.topics.filter(

        x=>!x.completed

    );

}

//======================================================
// Total Hours
//======================================================

function getStudyHours(

    date

){

    const study=

        getStudyLog(date);

    if(!study)

        return 0;

    return Number(

        (

            study.totalSeconds

            /3600

        ).toFixed(2)

    );

}

//======================================================
// Search Logs
//======================================================

function searchStudyLogs(

    keyword

){

    keyword=

        keyword.toLowerCase();

    return getAllStudyLogs().filter(

        log=>

        log.topics.some(

            t=>

            t.title

            .toLowerCase()

            .includes(keyword)

        )

    );

}

//======================================================
// Latest Study
//======================================================

function getLatestStudy(){

    const logs=

        getAllStudyLogs();

    if(logs.length===0)

        return null;

    return logs.sort(

        (a,b)=>

        b.date.localeCompare(a.date)

    )[0];

}

console.log(

    "✅ Study Logs API Loaded"

);

//======================================================
// Part 3 - Statistics & Weekly Planner API
//======================================================

//======================================================
// Statistics
//======================================================

function getStatistics(){

    return getData().statistics;

}

function saveStatistics(stats){

    const data=getData();

    data.statistics=stats;

    saveData(data);

}

function updateStatistics(){

    const data=getData();

    const logs=data.studyLogs;

    const stats=data.statistics;

    stats.totalStudySeconds=0;

    stats.totalSessions=0;

    stats.totalCompletedTopics=0;

    stats.weeklyStudySeconds=0;

    stats.monthlyStudySeconds=0;

    let streak=0;

    const today=new Date();

    const weekStart=new Date(today);

    weekStart.setDate(today.getDate()-6);

    const month=today.getMonth();

    logs.forEach(log=>{

        stats.totalStudySeconds+=

            log.totalSeconds||0;

        stats.totalSessions+=

            log.sessions||0;

        stats.totalCompletedTopics+=

            (log.topics||[])

            .filter(

                t=>t.completed

            ).length;

        const logDate=

            new Date(log.date);

        if(

            logDate>=weekStart

        ){

            stats.weeklyStudySeconds+=

                log.totalSeconds||0;

        }

        if(

            logDate.getMonth()===month &&

            logDate.getFullYear()===today.getFullYear()

        ){

            stats.monthlyStudySeconds+=

                log.totalSeconds||0;

        }

    });

    //--------------------------------------------------

    // Streak

    //--------------------------------------------------

    let cursor=new Date(today);

    while(true){

        const date=

            cursor

            .toISOString()

            .split("T")[0];

        const found=

            logs.find(

                x=>x.date===date

            );

        if(

            found &&

            found.totalSeconds>0

        ){

            streak++;

            cursor.setDate(

                cursor.getDate()-1

            );

        }

        else{

            break;

        }

    }

    stats.streak=streak;

    //--------------------------------------------------

    // Best Day

    //--------------------------------------------------

    let best=null;

    logs.forEach(log=>{

        if(

            !best ||

            log.totalSeconds>

            best.totalSeconds

        ){

            best=log;

        }

    });

    stats.bestDay=

        best

        ?best.date

        :"";

    saveStatistics(stats);

}

//======================================================
// Weekly Planner
//======================================================

function getProfile(){

    return getData().profile;

}

function getWeeklyPlanner(){

    return getData().weeklyPlanner;

}

function saveWeeklyPlanner(planner){

    const data=getData();

    data.weeklyPlanner=planner;

    saveData(data);

}

function getWeeklyTasks(day){

    return getWeeklyPlanner()[day]||[];

}

function addWeeklyTask(

    day,

    title,

    priority="Medium"

){

    if(

        !title ||

        title.trim()===""

    ) return;

    const planner=

        getWeeklyPlanner();

    planner[day].push({

        id:Date.now(),

        title:title.trim(),

        priority,

        completed:false,

        createdOn:now()

    });

    saveWeeklyPlanner(planner);

}

function updateWeeklyTask(

    day,

    id,

    completed

){

    const planner=

        getWeeklyPlanner();

    const task=

        planner[day].find(

            x=>x.id===id

        );

    if(task){

        task.completed=

            completed;

        saveWeeklyPlanner(planner);

    }

}

function deleteWeeklyTask(

    day,

    id

){

    const planner=

        getWeeklyPlanner();

    planner[day]=

        planner[day].filter(

            x=>x.id!==id

        );

    saveWeeklyPlanner(planner);

}

function getWeeklyTaskCount(day){

    return getWeeklyTasks(day).length;

}

function getCompletedWeeklyTaskCount(day){

    return getWeeklyTasks(day)

    .filter(

        x=>x.completed

    ).length;

}

function carryForwardTasks(){

    const planner=

        getWeeklyPlanner();

    const days=[

        "Monday",

        "Tuesday",

        "Wednesday",

        "Thursday",

        "Friday",

        "Saturday",

        "Sunday"

    ];

    for(

        let i=0;

        i<days.length-1;

        i++

    ){

        const pending=

            planner[days[i]]

            .filter(

                x=>!x.completed

            );

        pending.forEach(task=>{

            planner[days[i+1]]

            .push({

                ...task,

                id:Date.now()+Math.random()

            });

        });

    }

    saveWeeklyPlanner(planner);

}

//======================================================
// Dashboard Sync
//======================================================

function syncDashboard(){

    localStorage.setItem(

        "dashboardRefresh",

        Date.now()

    );

}

function syncStatistics(){

    localStorage.setItem(

        "statsRefresh",

        Date.now()

    );

}

function syncCalendar(){

    localStorage.setItem(

        "calendarRefresh",

        Date.now()

    );

}

function syncApplication(){

    updateStatistics();

    syncDashboard();

    syncStatistics();

    syncCalendar();

}

console.log(

    "✅ Statistics & Weekly Planner API Loaded"

);


//======================================================
// Part 4 - Achievements, Timer & Settings
//======================================================

//======================================================
// Achievement API
//======================================================

function getAchievements(){

    return getData().achievements;

}

function unlockAchievement(name){

    const data=getData();

    if(

        data.achievements.unlocked.includes(name)

    ){

        return;

    }

    data.achievements.unlocked.push(name);

    data.achievements.lastUnlocked=now();

    saveData(data);

}

function hasAchievement(name){

    return getAchievements()

        .unlocked

        .includes(name);

}

//======================================================
// Achievement Validation
//======================================================

function refreshAchievements(){

    const stats=getStatistics();

    if(stats.totalSessions>=1)

        unlockAchievement("First Session");

    if(stats.totalSessions>=10)

        unlockAchievement("10 Sessions");

    if(stats.totalSessions>=50)

        unlockAchievement("50 Sessions");

    if(stats.totalSessions>=100)

        unlockAchievement("100 Sessions");

    if(stats.streak>=7)

        unlockAchievement("7 Day Streak");

    if(stats.streak>=30)

        unlockAchievement("30 Day Streak");

}

//======================================================
// Running Timer
//======================================================

function saveRunningTimer(timer){

    const data=getData();

    data.runningTimer=timer;

    saveData(data);

}

function getRunningTimer(){

    return getData().runningTimer;

}

function clearRunningTimer(){

    const data=getData();

    data.runningTimer=null;

    saveData(data);

}

//======================================================
// Settings
//======================================================

function getSettings(){

    return getData().settings;

}

function saveSettings(settings){

    const data=getData();

    data.settings={

        ...data.settings,

        ...settings

    };

    saveData(data);

}

function updateSetting(

    key,

    value

){

    const settings=

        getSettings();

    settings[key]=value;

    saveSettings(settings);

}

//======================================================
// Backup
//======================================================

function createBackup(){

    const data=getData();

    data.backups=data.backups||[];

    data.backups.push({

        createdOn:now(),

        data:deepClone(data)

    });

    if(data.backups.length>5){

        data.backups.shift();

    }

    saveData(data);

}

function getBackups(){

    return getData().backups||[];

}

function restoreBackup(index){

    const backups=getBackups();

    if(!backups[index])

        return false;

    saveData(

        backups[index].data

    );

    return true;

}

//======================================================
// Export / Import
//======================================================

function exportJSON(){

    return JSON.stringify(

        getData(),

        null,

        2

    );

}

function importJSON(json){

    try{

        const data=

            JSON.parse(json);

        saveData(data);

        return true;

    }

    catch{

        return false;

    }

}

//======================================================
// Maintenance
//======================================================

function clearStudyLogs(){

    const data=getData();

    data.studyLogs=[];

    saveData(data);

}

function clearPlanner(){

    const data=getData();

    data.weeklyPlanner=deepClone(

        DEFAULT_DATA.weeklyPlanner

    );

    saveData(data);

}

//======================================================
// Refresh Everything
//======================================================

function refreshStorage(){

    updateStatistics();

    refreshAchievements();

    syncApplication();

}

//======================================================
// Auto Refresh
//======================================================

refreshStorage();

console.log(

    "✅ Storage Refreshed"

);

//======================================================
// Initialize
//======================================================

initializeStorage();

refreshStorage();

console.log(

    "✅ PS365 Storage V3 Ready"

);