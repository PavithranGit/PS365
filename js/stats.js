// ===============================
// PS365 Statistics Module
// ===============================

window.addEventListener("load", function () {

    loadStatistics();

});

// ===============================
// Load Statistics
// ===============================

function loadStatistics() {

    const studies = getAllStudies();

    let totalHours = 0;

    let revisionDays = 0;

    let thirukkuralCount = 0;

    let englishCount = 0;

    let gsCount = 0;

    let currentAffairsCount = 0;

    let mentalAbilityCount = 0;

    const subjectMap = {};

    studies.forEach(study => {

        totalHours += Number(study.studyHours || 0);

        if (study.revision)
            revisionDays++;

        if (study.thirukkural &&
            study.thirukkural.trim() !== "")
            thirukkuralCount++;

        if (
            study.sa ||
            study.pv ||
            study.hh ||
            study.grammar
        )
            englishCount++;

        if (
            study.history ||
            study.polity
        )
            gsCount++;

        if (
            study.currentAffairs &&
            study.currentAffairs.trim() !== ""
        )
            currentAffairsCount++;

        if (
            study.mentalAbility &&
            study.mentalAbility.trim() !== ""
        )
            mentalAbilityCount++;

        if (!subjectMap[study.subject]) {

            subjectMap[study.subject] = 0;

        }

        subjectMap[study.subject] +=
            Number(study.studyHours || 0);

    });

    // ===============================
    // Overview
    // ===============================

    document.getElementById("studyDays").innerHTML =
        studies.length;

    document.getElementById("totalHours").innerHTML =
        totalHours;

    document.getElementById("revisionDays").innerHTML =
        revisionDays;

    // Goal %

    let goal = 0;

    if (studies.length > 0) {

        goal =
            Math.round(
                (totalHours / (studies.length * APP.dailyHours)) * 100
            );

    }

    if (goal > 100)
        goal = 100;

    document.getElementById("goalPercent").innerHTML =
        goal + "%";

    // ===============================
    // Practice Summary
    // ===============================

    document.getElementById("thirukkuralCount").innerHTML =
        thirukkuralCount;

    document.getElementById("englishCount").innerHTML =
        englishCount;

    document.getElementById("gsCount").innerHTML =
        gsCount;

    document.getElementById("currentAffairsCount").innerHTML =
        currentAffairsCount;

    document.getElementById("mentalAbilityCount").innerHTML =
        mentalAbilityCount;

    loadSubjectStats(subjectMap);

}

// ===============================
// Subject Summary
// ===============================

function loadSubjectStats(subjectMap) {

    const container =
        document.getElementById("subjectStats");

    container.innerHTML = "";

    const subjects =
        Object.keys(subjectMap);

    if (subjects.length === 0) {

        container.innerHTML =
            "<p>No Study Records Found.</p>";

        return;

    }

    subjects
        .sort()
        .forEach(subject => {

            container.innerHTML += `

            <div class="subject-item">

                <span>${subject}</span>

                <strong>${subjectMap[subject]} hrs</strong>

            </div>

            `;

        });

}