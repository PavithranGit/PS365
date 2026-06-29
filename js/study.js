//==========================================
// PS365 STUDY MODULE
// Part 1 - Load & Save
//==========================================

window.addEventListener("load", function () {

    const today = new Date().toISOString().split("T")[0];

    document.getElementById("studyDate").value = today;

    loadStudy(today);

});

//==========================================
// Load Study
//==========================================

document.getElementById("studyDate")
.addEventListener("change", function () {

    loadStudy(this.value);

});

function loadStudy(date){

    const study = getStudyByDate(date);

    if(!study){

        clearForm();

        document.getElementById("studyDate").value = date;

        return;

    }

    document.getElementById("studyHours").value =
        study.studyHours || "";

    document.getElementById("subject").value =
        study.subject || "";

    document.getElementById("thirukkural").value =
        study.thirukkural || "";

    document.getElementById("sa").value =
        study.sa || "";

    document.getElementById("pv").value =
        study.pv || "";

    document.getElementById("hh").value =
        study.hh || "";

    document.getElementById("grammar").value =
        study.grammar || "";

    document.getElementById("history").value =
        study.history || "";

    document.getElementById("polity").value =
        study.polity || "";

    document.getElementById("currentAffairTopic").value =
        study.currentAffairTopic || "";

    document.getElementById("revision").checked =
        study.revision || false;

    document.getElementById("currentAffairs").checked =
        study.currentAffairs || false;

    document.getElementById("mentalAbility").checked =
        study.mentalAbility || false;

    document.getElementById("notes").value =
        study.notes || "";

}

//==========================================
// Save
//==========================================

document.getElementById("saveBtn")
.addEventListener("click", saveTodayStudy);

function saveTodayStudy(){

    const study = {

        date:
            document.getElementById("studyDate").value,

        studyHours:
            Number(document.getElementById("studyHours").value),

        subject:
            document.getElementById("subject").value,

        thirukkural:
            document.getElementById("thirukkural").value,

        sa:
            document.getElementById("sa").value,

        pv:
            document.getElementById("pv").value,

        hh:
            document.getElementById("hh").value,

        grammar:
            document.getElementById("grammar").value,

        history:
            document.getElementById("history").value,

        polity:
            document.getElementById("polity").value,

        currentAffairTopic:
            document.getElementById("currentAffairTopic").value,

        revision:
            document.getElementById("revision").checked,

        currentAffairs:
            document.getElementById("currentAffairs").checked,

        mentalAbility:
            document.getElementById("mentalAbility").checked,

        notes:
            document.getElementById("notes").value

    };

    if(study.studyHours<=0){

        alert("Please enter Study Hours.");

        return;

    }

    if(study.subject===""){

        alert("Please select Subject.");

        return;

    }

    saveStudy(study);

    alert("Study Saved Successfully.");

}


//==========================================
// Reset Form
//==========================================

document.getElementById("resetBtn")
.addEventListener("click", function () {

    if (!confirm("Clear today's study details?"))
        return;

    clearForm();

});

function clearForm() {

    document.getElementById("studyHours").value = "";

    document.getElementById("subject").selectedIndex = 0;

    document.getElementById("thirukkural").value = "";

    document.getElementById("sa").value = "";

    document.getElementById("pv").value = "";

    document.getElementById("hh").value = "";

    document.getElementById("grammar").value = "";

    document.getElementById("history").value = "";

    document.getElementById("polity").value = "";

    document.getElementById("currentAffairTopic").value = "";

    document.getElementById("revision").checked = false;

    document.getElementById("currentAffairs").checked = false;

    document.getElementById("mentalAbility").checked = false;

    document.getElementById("notes").value = "";

}

//==========================================
// Helper Functions
//==========================================

function getTodayDate() {

    return new Date().toISOString().split("T")[0];

}

function isEmpty(value) {

    return value === null ||
           value === undefined ||
           value.trim() === "";

}

//==========================================
// Auto Save (Optional)
//==========================================

const autoSaveFields = [

    "studyHours",
    "subject",
    "thirukkural",
    "sa",
    "pv",
    "hh",
    "grammar",
    "history",
    "polity",
    "currentAffairTopic",
    "notes"

];

autoSaveFields.forEach(id => {

    const element = document.getElementById(id);

    if (!element) return;

    element.addEventListener("change", function () {

        console.log("Field Updated :", id);

    });

});

//==========================================
// Checkbox Events
//==========================================

["revision","currentAffairs","mentalAbility"]

.forEach(id => {

    document.getElementById(id)

    .addEventListener("change", function () {

        console.log(id + " changed");

    });

});


//==========================================
// Email Today's Report
//==========================================

document.getElementById("emailBtn")
.addEventListener("click", sendEmailReport);

function sendEmailReport() {

    const study = {

        date:
            document.getElementById("studyDate").value,

        studyHours:
            document.getElementById("studyHours").value,

        subject:
            document.getElementById("subject").value,

        thirukkural:
            document.getElementById("thirukkural").value,

        sa:
            document.getElementById("sa").value,

        pv:
            document.getElementById("pv").value,

        hh:
            document.getElementById("hh").value,

        grammar:
            document.getElementById("grammar").value,

        history:
            document.getElementById("history").value,

        polity:
            document.getElementById("polity").value,

        currentAffairTopic:
            document.getElementById("currentAffairTopic").value,

        revision:
            document.getElementById("revision").checked
                ? "Completed"
                : "Pending",

        currentAffairs:
            document.getElementById("currentAffairs").checked
                ? "Completed"
                : "Pending",

        mentalAbility:
            document.getElementById("mentalAbility").checked
                ? "Completed"
                : "Pending",

        notes:
            document.getElementById("notes").value

    };

    const email = "pavithrandevo@gmail.com";

    const subject =
        `PS365 Daily Report - ${study.date}`;

    const body =

`PS365 DAILY STUDY REPORT

━━━━━━━━━━━━━━━━━━━━━━━━━━

Date
${study.date}

Study Hours
${study.studyHours} Hours

Main Subject
${study.subject}

━━━━━━━━━━━━━━━━━━━━━━━━━━

TODAY'S FOCUS

📖 Thirukkural
${study.thirukkural}

📘 SA (Synonyms & Antonyms)
${study.sa}

📗 PV (Phrasal Verbs)
${study.pv}

📙 HH (Homonyms / Homophones)
${study.hh}

📚 Grammar
${study.grammar}

🏛 History
${study.history}

⚖ Polity
${study.polity}

📰 Current Affairs
${study.currentAffairTopic}

━━━━━━━━━━━━━━━━━━━━━━━━━━

ACTIVITIES

Revision
${study.revision}

Current Affairs
${study.currentAffairs}

Mental Ability
${study.mentalAbility}

━━━━━━━━━━━━━━━━━━━━━━━━━━

NOTES

${study.notes || "-"}

━━━━━━━━━━━━━━━━━━━━━━━━━━

Generated Automatically
From PS365 TNPSC Tracker`;

    window.location.href =
        `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

}

//==========================================
// End of Study Module
//==========================================

console.log("PS365 Study Module Loaded Successfully.");