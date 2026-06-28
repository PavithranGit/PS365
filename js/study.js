// ===============================
// PS365 Study Module
// ===============================

// Set today's date automatically
window.onload = function () {

    const today = new Date().toISOString().split("T")[0];

    document.getElementById("studyDate").value = today;

    loadTodayStudy();

};

// Load today's saved study if available
function loadTodayStudy() {

    const date = document.getElementById("studyDate").value;

    const study = getStudyByDate(date);

    if (!study) return;

    document.getElementById("studyHours").value = study.studyHours;
    document.getElementById("subject").value = study.subject;
    document.getElementById("mcqs").value = study.mcqs;
    document.getElementById("revision").checked = study.revision;
    document.getElementById("currentAffairs").checked = study.currentAffairs;
    document.getElementById("mockTest").checked = study.mockTest;
    document.getElementById("notes").value = study.notes;

}

// Save Study
document.getElementById("saveBtn").addEventListener("click", function () {

    const study = {

        date: document.getElementById("studyDate").value,

        studyHours: Number(document.getElementById("studyHours").value),

        subject: document.getElementById("subject").value,

        mcqs: Number(document.getElementById("mcqs").value),

        revision: document.getElementById("revision").checked,

        currentAffairs: document.getElementById("currentAffairs").checked,

        mockTest: document.getElementById("mockTest").checked,

        notes: document.getElementById("notes").value

    };

    if (study.studyHours <= 0) {

        alert("Please enter study hours.");

        return;

    }

    if (study.subject === "") {

        alert("Please select a subject.");

        return;

    }

   console.log("Before Save:", getData());

saveStudy(study);

console.log("After Save:", getData());

    alert("Today's Study Saved Successfully!");

});

// Reset Form
document.getElementById("resetBtn").addEventListener("click", function () {

    document.getElementById("studyHours").value = "";
    document.getElementById("subject").selectedIndex = 0;
    document.getElementById("mcqs").value = "";
    document.getElementById("revision").checked = false;
    document.getElementById("currentAffairs").checked = false;
    document.getElementById("mockTest").checked = false;
    document.getElementById("notes").value = "";

});