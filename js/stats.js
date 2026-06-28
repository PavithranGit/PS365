// ===============================
// PS365 Statistics Module
// ===============================

window.addEventListener("load", function () {

    loadStatistics();

});

function loadStatistics() {

    const studies = getAllStudies();

    let totalHours = 0;
    let totalMcqs = 0;
    let revisionCount = 0;
    let currentAffairsCount = 0;
    let mockTestCount = 0;

    const subjectMap = {};

    studies.forEach(study => {

        totalHours += study.studyHours;
        totalMcqs += study.mcqs;

        if (study.revision)
            revisionCount++;

        if (study.currentAffairs)
            currentAffairsCount++;

        if (study.mockTest)
            mockTestCount++;

        if (!subjectMap[study.subject]) {

            subjectMap[study.subject] = 0;

        }

        subjectMap[study.subject] += study.studyHours;

    });

    // Dashboard Numbers

    document.getElementById("totalHours").innerHTML = totalHours;

    document.getElementById("totalMcqs").innerHTML = totalMcqs;

    document.getElementById("studyDays").innerHTML = studies.length;

    document.getElementById("revisionCount").innerHTML = revisionCount;

    document.getElementById("currentAffairsCount").innerHTML = currentAffairsCount;

    document.getElementById("mockTestCount").innerHTML = mockTestCount;

    // Current Streak

    document.getElementById("currentStreak").innerHTML =
        calculateCurrentStreak(studies);

    // Subject Wise

    loadSubjectStats(subjectMap);

}

// ===============================
// Subject Statistics
// ===============================

function loadSubjectStats(subjectMap) {

    const container = document.getElementById("subjectStats");

    container.innerHTML = "";

    const subjects = Object.keys(subjectMap);

    if (subjects.length === 0) {

        container.innerHTML =
            "<p>No Study Records Found.</p>";

        return;

    }

    subjects.forEach(subject => {

        container.innerHTML += `

        <div class="subject-item">

            <span>${subject}</span>

            <strong>${subjectMap[subject]} hrs</strong>

        </div>

        `;

    });

}

// ===============================
// Current Streak
// ===============================

function calculateCurrentStreak(studies) {

    if (studies.length === 0)
        return 0;

    const dates = studies
        .map(s => s.date)
        .sort();

    let streak = 1;

    for (let i = dates.length - 1; i > 0; i--) {

        const current = new Date(dates[i]);

        const previous = new Date(dates[i - 1]);

        const diff =
            (current - previous) / (1000 * 60 * 60 * 24);

        if (diff === 1) {

            streak++;

        }
        else {

            break;

        }

    }

    return streak;

}