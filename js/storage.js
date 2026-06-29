// ===============================
// PS365 Storage Manager
// ===============================

const STORAGE_KEY = "ps365Data";

// ===============================
// Default Data
// ===============================

const defaultData = {

    studyLogs: [],

    settings: {

        darkMode: false,

        dailyReminder: true

    }

};

// ===============================
// Initialize
// ===============================

function initializeStorage() {

    if (!localStorage.getItem(STORAGE_KEY)) {

        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(defaultData)
        );

    }

}

// ===============================
// Get Complete Data
// ===============================

function getData() {

    return JSON.parse(localStorage.getItem(STORAGE_KEY));

}

// ===============================
// Save Complete Data
// ===============================

function saveData(data) {

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(data)
    );

}

// ===============================
// Save Study
// ===============================

function saveStudy(study) {

    const data = getData();

    const index =
        data.studyLogs.findIndex(x => x.date === study.date);

    if (index >= 0) {

        data.studyLogs[index] = study;

    }
    else {

        data.studyLogs.push(study);

    }

    saveData(data);

}

// ===============================
// Get Study By Date
// ===============================

function getStudyByDate(date) {

    const data = getData();

    return data.studyLogs.find(x => x.date === date);

}

// ===============================
// Today's Study
// ===============================

function getTodayStudy() {

    const today =
        new Date().toISOString().split("T")[0];

    return getStudyByDate(today);

}

// ===============================
// All Studies
// ===============================

function getAllStudies() {

    return getData().studyLogs;

}

// ===============================
// Reset
// ===============================

function resetData() {

    localStorage.removeItem(STORAGE_KEY);

    initializeStorage();

}

// ===============================
// Statistics Helpers
// ===============================

function getTotalStudyHours() {

    return getAllStudies().reduce(
        (sum, item) => sum + (item.studyHours || 0),
        0
    );

}

function getRevisionDays() {

    return getAllStudies().filter(
        x => x.revision
    ).length;

}

function getMentalAbilityDays() {

    return getAllStudies().filter(
        x => x.mentalAbility &&
             x.mentalAbility.trim() !== ""
    ).length;

}

function getCurrentAffairsDays() {

    return getAllStudies().filter(
        x => x.currentAffairs &&
             x.currentAffairs.trim() !== ""
    ).length;

}

// ===============================
// Initialize
// ===============================

initializeStorage();