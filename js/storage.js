//==============================================
// PS365 Storage Manager V2
//==============================================

const STORAGE_KEY = "ps365Data";

//==============================================
// Default Data
//==============================================

const defaultData = {

    studyLogs: [],

    settings: {

        darkMode: false,

        dailyReminder: true

    }

};

//==============================================
// Initialize Storage
//==============================================

function initializeStorage(){

    if(!localStorage.getItem(STORAGE_KEY)){

        localStorage.setItem(

            STORAGE_KEY,

            JSON.stringify(defaultData)

        );

    }

}

//==============================================
// Get Data
//==============================================

function getData(){

    return JSON.parse(

        localStorage.getItem(STORAGE_KEY)

    );

}

//==============================================
// Save Data
//==============================================

function saveData(data){

    localStorage.setItem(

        STORAGE_KEY,

        JSON.stringify(data)

    );

}

//==============================================
// Save Study
//==============================================

function saveStudy(study){

    const data = getData();

    const index = data.studyLogs.findIndex(

        item => item.date === study.date

    );

    if(index >= 0){

        data.studyLogs[index] = study;

    }
    else{

        data.studyLogs.push(study);

    }

    saveData(data);

}

//==============================================
// Get Study By Date
//==============================================

function getStudyByDate(date){

    const data = getData();

    return data.studyLogs.find(

        item => item.date === date

    );

}

//==============================================
// Get All Studies
//==============================================

function getAllStudies(){

    return getData().studyLogs;

}

//==============================================
// Get Today's Study
//==============================================

function getTodayStudy(){

    const today = new Date()

        .toISOString()

        .split("T")[0];

    return getStudyByDate(today);

}

//==============================================
// Delete Study
//==============================================

function deleteStudy(date){

    const data = getData();

    data.studyLogs =

        data.studyLogs.filter(

            item => item.date !== date

        );

    saveData(data);

}

//==============================================
// Reset All Data
//==============================================

function resetData(){

    localStorage.removeItem(

        STORAGE_KEY

    );

    initializeStorage();

}

//==============================================
// Export Data
//==============================================

function exportData(){

    return JSON.stringify(

        getData(),

        null,

        2

    );

}

//==============================================
// Import Data
//==============================================

function importData(json){

    saveData(

        JSON.parse(json)

    );

}

//==============================================
// Get Total Study Time
//==============================================

function getTotalStudySeconds(){

    const studies = getAllStudies();

    let total = 0;

    studies.forEach(study=>{

        total += study.studySeconds || 0;

    });

    return total;

}

//==============================================
// Get Total Completed Topics
//==============================================

function getCompletedTopics(){

    const studies = getAllStudies();

    let completed = 0;

    studies.forEach(study=>{

        if(!study.topics)
            return;

        study.topics.forEach(topic=>{

            if(topic.completed)

                completed++;

        });

    });

    return completed;

}

//==============================================
// Get Total Topics
//==============================================

function getTotalTopics(){

    const studies = getAllStudies();

    let total = 0;

    studies.forEach(study=>{

        total += study.topics
            ? study.topics.length
            : 0;

    });

    return total;

}

//==============================================
// Initialize
//==============================================

initializeStorage();

console.log("PS365 Storage V2 Loaded.");