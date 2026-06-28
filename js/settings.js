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

function loadSettings() {

    const data = getData();

    document.getElementById("darkMode").checked =
        data.settings.darkMode;

    document.getElementById("dailyReminder").checked =
        data.settings.dailyReminder;

}

function saveSettings() {

    const data = getData();

    data.settings.darkMode =
        document.getElementById("darkMode").checked;

    data.settings.dailyReminder =
        document.getElementById("dailyReminder").checked;

    saveData(data);

    alert("Settings Saved.");

}

function resetApplication() {

    if (!confirm("Reset all application data?"))
        return;

    resetData();

    alert("Application Reset Successfully.");

    location.reload();

}

function exportApplicationData() {

    const data = JSON.stringify(getData(), null, 2);

    const blob = new Blob([data], { type: "application/json" });

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");

    a.href = url;

    a.download = "ps365-backup.json";

    a.click();

    URL.revokeObjectURL(url);

}

function importApplicationData() {

    alert("Import will be implemented in Version 1.1");

}