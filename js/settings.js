// ===============================
// PS365 Settings Module
// ===============================

window.onload = function () {

    loadSettings();

    document.getElementById("darkMode")
        .addEventListener("change", saveSettings);

    document.getElementById("dailyReminder")
        .addEventListener("change", saveSettings);

    document.getElementById("resetData")
        .addEventListener("click", resetApplication);

    document.getElementById("exportData")
        .addEventListener("click", exportApplicationData);

    document.getElementById("importData")
        .addEventListener("click", importApplicationData);

};

// ===============================
// Load
// ===============================

function loadSettings() {

    const data = getData();

    document.getElementById("darkMode").checked =
        data.settings.darkMode;

    document.getElementById("dailyReminder").checked =
        data.settings.dailyReminder;

    applyDarkMode(data.settings.darkMode);

}

// ===============================
// Save
// ===============================

function saveSettings() {

    const data = getData();

    data.settings.darkMode =
        document.getElementById("darkMode").checked;

    data.settings.dailyReminder =
        document.getElementById("dailyReminder").checked;

    saveData(data);

    applyDarkMode(data.settings.darkMode);

}

// ===============================
// Apply Theme
// ===============================

function applyDarkMode(enable) {

    if (enable) {

        document.body.classList.add("dark");

    }
    else {

        document.body.classList.remove("dark");

    }

}

// ===============================
// Reset
// ===============================

function resetApplication() {

    if (!confirm("Reset all application data?"))
        return;

    resetData();

    alert("Application Reset Successfully.");

    location.reload();

}

// ===============================
// Export
// ===============================

function exportApplicationData() {

    const data = JSON.stringify(getData(), null, 2);

    const blob =
        new Blob([data], { type: "application/json" });

    const url =
        URL.createObjectURL(blob);

    const a =
        document.createElement("a");

    a.href = url;

    a.download = "ps365-backup.json";

    a.click();

    URL.revokeObjectURL(url);

}

// ===============================
// Import
// ===============================

function importApplicationData() {

    alert("Coming Soon 🚀");

}