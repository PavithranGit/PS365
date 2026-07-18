// ===============================
// PS365 Application Configuration
// ===============================

const APP = {

    userName: "Saaruja",

    appName: "PS365",

    slogan: "Prepare • Study • Succeed",

    examName: "TNPSC Group 1",

    group1Exam: "2026-09-27",

    group2Exam: "2026-10-22",

    dailyHours: 8,

    dream:
        "Become a TNPSC Group 1 Officer and build a bright future."

};

// ===============================
// Global Initialization
// ===============================

document.addEventListener("DOMContentLoaded", function () {

    applySavedTheme();

});

// ===============================
// Apply Saved Theme
// ===============================

function applySavedTheme() {

    // storage.js might not be loaded yet
    if (typeof getData !== "function")
        return;

    const data = getData();

    if (!data || !data.settings)
        return;

    if (data.settings.darkMode) {

        document.body.classList.add("dark");

    }
    else {

        document.body.classList.remove("dark");

    }

}