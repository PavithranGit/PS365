// ===============================
// PS365 Calendar Module
// ===============================

let currentDate = new Date();

window.addEventListener("load", function () {

    renderCalendar();

    document.getElementById("prevMonth").addEventListener("click", function () {

        currentDate.setMonth(currentDate.getMonth() - 1);

        renderCalendar();

    });

    document.getElementById("nextMonth").addEventListener("click", function () {

        currentDate.setMonth(currentDate.getMonth() + 1);

        renderCalendar();

    });

});

// ===============================
// Render Calendar
// ===============================

function renderCalendar() {

    const monthYear = document.getElementById("monthYear");
    const calendarGrid = document.getElementById("calendarGrid");

    calendarGrid.innerHTML = "";

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    monthYear.innerHTML = currentDate.toLocaleString("default", {
        month: "long",
        year: "numeric"
    });

    const firstDay = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();

    // Empty Cells

    for (let i = 0; i < firstDay; i++) {

        const empty = document.createElement("div");
        empty.className = "empty";

        calendarGrid.appendChild(empty);

    }

    const today = new Date();

    // Calendar Days

    for (let day = 1; day <= totalDays; day++) {

        const cell = document.createElement("div");

        cell.className = "day";

        cell.innerHTML = day;

        const date =
            `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

        // Highlight Today

        if (
            day === today.getDate() &&
            month === today.getMonth() &&
            year === today.getFullYear()
        ) {

            cell.classList.add("today");

        }

        // Study Record

        const study = getStudyByDate(date);

        if (study) {

            const completed =
                study.studyHours >= APP.dailyHours &&
                study.mcqs >= APP.dailyMcqs;

            if (completed) {

                cell.classList.add("completed");

            } else {

                cell.classList.add("partial");

            }

        }

        cell.addEventListener("click", function () {

            showStudy(date);

        });

        calendarGrid.appendChild(cell);

    }

}

// ===============================
// Show Study Details
// ===============================

function showStudy(date) {

    const selectedDate = document.getElementById("selectedDate");
    const details = document.getElementById("studyDetails");

    selectedDate.innerHTML = "📅 " + date;

    const study = getStudyByDate(date);

    if (!study) {

        details.innerHTML = `
            <p>No study record found.</p>
        `;

        return;

    }

    details.innerHTML = `

        <p><strong>📚 Subject:</strong> ${study.subject}</p>

        <p><strong>⏰ Study Hours:</strong> ${study.studyHours}</p>

        <p><strong>📝 MCQs:</strong> ${study.mcqs}</p>

        <p><strong>📖 Revision:</strong>
            ${study.revision ? "✅ Yes" : "❌ No"}
        </p>

        <p><strong>📰 Current Affairs:</strong>
            ${study.currentAffairs ? "✅ Yes" : "❌ No"}
        </p>

        <p><strong>🎯 Mock Test:</strong>
            ${study.mockTest ? "✅ Yes" : "❌ No"}
        </p>

        <p><strong>🗒️ Notes:</strong></p>

        <p>${study.notes || "-"}</p>

    `;

}