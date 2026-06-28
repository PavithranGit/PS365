// ===============================
// PS365 Storage Manager
// ===============================

const STORAGE_KEY = "ps365Data";

// Default Application Data
const defaultData = {

    studyLogs: [],

    settings: {

        darkMode: false,

        dailyReminder: true

    }

};

// Initialize Storage
function initializeStorage() {

    if (!localStorage.getItem(STORAGE_KEY)) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultData));
    }

}

// Get Complete Data
function getData() {
    return JSON.parse(localStorage.getItem(STORAGE_KEY));
}

// Save Complete Data
function saveData(data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}



// Save Study Log
function saveStudy(study) {

    const data = getData();

    const index = data.studyLogs.findIndex(item => item.date === study.date);

    if (index >= 0) {

        data.studyLogs[index] = study;

    } else {

        data.studyLogs.push(study);

    }

    saveData(data);

}

// Get Study By Date
function getStudyByDate(date) {

    const data = getData();

    return data.studyLogs.find(item => item.date === date);

}

// Get All Study Logs
function getAllStudies() {

    return getData().studyLogs;

}

// Reset All Data
function resetData() {

    localStorage.removeItem(STORAGE_KEY);

    initializeStorage();

}

// Initialize when file loads
initializeStorage();


function getTodayStudy() {

    const today = new Date().toISOString().split("T")[0];

    return getStudyByDate(today);

}