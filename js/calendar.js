//====================================================
// PS365 Calendar V2
//====================================================

let currentMonth = new Date();

//====================================================
// Initialize
//====================================================

window.addEventListener("load", () => {

    renderCalendar();

    document.getElementById("prevMonth")
        .addEventListener("click", previousMonth);

    document.getElementById("nextMonth")
        .addEventListener("click", nextMonth);

});

//====================================================
// Month Navigation
//====================================================

function previousMonth(){

    currentMonth.setMonth(

        currentMonth.getMonth()-1

    );

    renderCalendar();

}

function nextMonth(){

    currentMonth.setMonth(

        currentMonth.getMonth()+1

    );

    renderCalendar();

}

//====================================================
// Render Calendar
//====================================================

function renderCalendar(){

    const grid =
        document.getElementById("calendarGrid");

    grid.innerHTML="";

    const year =
        currentMonth.getFullYear();

    const month =
        currentMonth.getMonth();

    document.getElementById("monthYear").innerHTML=

        currentMonth.toLocaleString("default",{

            month:"long",

            year:"numeric"

        });

    const firstDay=
        new Date(year,month,1).getDay();

    const totalDays=
        new Date(year,month+1,0).getDate();

    //------------------------------------

    // Empty Cells

    //------------------------------------

    for(let i=0;i<firstDay;i++){

        const div=document.createElement("div");

        div.className="empty";

        grid.appendChild(div);

    }

    //------------------------------------

    // Days

    //------------------------------------

    const today=new Date();

    for(let day=1;day<=totalDays;day++){

        const cell=document.createElement("div");

        cell.className="day";

        cell.innerHTML=day;

        const date=

`${year}-${String(month+1).padStart(2,"0")}-${String(day).padStart(2,"0")}`;

        //------------------------------------

        // Today

        //------------------------------------

        if(

            day===today.getDate() &&

            month===today.getMonth() &&

            year===today.getFullYear()

        ){

            cell.classList.add("today");

        }

        //------------------------------------

        // Study Record

        //------------------------------------

        const study=getStudyByDate(date);

        if(study){

            const completed=

                study.topics.filter(

                    t=>t.completed

                ).length;

            if(completed===study.topics.length

                && study.topics.length>0){

                cell.classList.add("completed");

            }

            else{

                cell.classList.add("partial");

            }

        }

        //------------------------------------

        // Click

        //------------------------------------

        cell.addEventListener("click",()=>{

            showStudy(date);

        });

        grid.appendChild(cell);

    }

}


//====================================================
// Show Study Details
//====================================================

function showStudy(date){

    const title =
        document.getElementById("selectedDate");

    const details =
        document.getElementById("studyDetails");

    title.innerHTML =
        "📅 " + date;

    const study =
        getStudyByDate(date);

    //-------------------------------------

    // No Record

    //-------------------------------------

    if(!study){

        details.innerHTML = `

        <div class="empty-session">

            <i class="fa-regular fa-calendar-xmark"></i>

            <p>

                No study record found.

            </p>

        </div>

        `;

        return;

    }

    //-------------------------------------

    // Calculate

    //-------------------------------------

    const topics = study.topics || [];

    const sessions = study.sessions || [];

    const completed =
        topics.filter(t=>t.completed).length;

    const pending =
        topics.length - completed;

    const percent =
        topics.length===0

        ?0

        :Math.round((completed/topics.length)*100);

    //-------------------------------------

    // Topics

    //-------------------------------------

    let topicHtml="";

    topics.forEach(topic=>{

        topicHtml += `

        <div class="topic-item">

            <span>

                ${topic.completed ? "✅" : "⬜"}

                ${topic.title}

            </span>

        </div>

        `;

    });

    //-------------------------------------

    // Sessions

    //-------------------------------------

    let sessionHtml="";

    sessions.forEach((session,index)=>{

        sessionHtml += `

        <div class="session-item">

            <div>

                <strong>

                    Session ${index+1}

                </strong>

                <br>

                <small>

                    ${session.start}

                    →

                    ${session.end}

                </small>

            </div>

            <strong>

                ${formatDuration(session.duration)}

            </strong>

        </div>

        `;

    });

    if(sessionHtml===""){

        sessionHtml =

        "<p>No study sessions.</p>";

    }

    //-------------------------------------

    // Display

    //-------------------------------------

    details.innerHTML = `

    <div class="progress-row">

        <span>

            ⏱ Study Time

        </span>

        <strong>

            ${formatDuration(study.totalSeconds || 0)}

        </strong>

    </div>

    <div class="progress-row">

        <span>

            📋 Topics

        </span>

        <strong>

            ${completed} / ${topics.length}

        </strong>

    </div>

    <div class="progress">

        <div

            class="progress-fill"

            style="width:${percent}%">

        </div>

    </div>

    <br>

    <h4>

        📚 Topics

    </h4>

    ${topicHtml}

    <br>

    <h4>

        ⏱ Session History

    </h4>

    ${sessionHtml}

    <br>

    <h4>

        📝 Notes

    </h4>

    <p>

        ${study.notes || "-"}

    </p>

    `;

}

//====================================================
// Monthly Summary
//====================================================

function loadMonthlySummary(){

    const studies = getAllStudies();

    const year = currentMonth.getFullYear();

    const month = currentMonth.getMonth();

    let totalStudySeconds = 0;

    let totalTopics = 0;

    let completedTopics = 0;

    let studyDays = 0;

    let bestDay = null;

    let bestDuration = 0;

    studies.forEach(study=>{

        const date = new Date(study.date);

        if(

            date.getFullYear() !== year ||

            date.getMonth() !== month

        ){

            return;

        }

        studyDays++;

        totalStudySeconds +=

            study.totalSeconds || 0;

        if(study.topics){

            totalTopics += study.topics.length;

            completedTopics +=

                study.topics.filter(

                    t=>t.completed

                ).length;

        }

        if(

            (study.totalSeconds || 0)

            > bestDuration

        ){

            bestDuration =

                study.totalSeconds || 0;

            bestDay = study.date;

        }

    });

    //----------------------------------

    // Current Streak

    //----------------------------------

    const streak = calculateStreak(studies);

    //----------------------------------

    // Console (Future Dashboard Widget)

    //----------------------------------

    console.log({

        studyDays,

        totalStudySeconds,

        completedTopics,

        totalTopics,

        streak,

        bestDay

    });

}

//====================================================
// Current Streak
//====================================================

function calculateStreak(studies){

    if(studies.length===0)

        return 0;

    const dates = studies

        .map(x=>x.date)

        .sort()

        .reverse();

    let streak = 0;

    let current = new Date();

    current.setHours(0,0,0,0);

    for(const date of dates){

        const d = new Date(date);

        d.setHours(0,0,0,0);

        const diff =

            (current-d)

            /(1000*60*60*24);

        if(diff===0 || diff===1){

            streak++;

            current=d;

        }else{

            break;

        }

    }

    return streak;

}

//====================================================
// Best Study Day
//====================================================

function getBestStudyDay(){

    const studies = getAllStudies();

    let best = null;

    studies.forEach(study=>{

        if(

            !best ||

            (study.totalSeconds||0)

            >

            (best.totalSeconds||0)

        ){

            best = study;

        }

    });

    return best;

}

//====================================================
// Refresh Calendar
//====================================================

function refreshCalendar(){

    renderCalendar();

    loadMonthlySummary();

}

//====================================================
// Initial Summary
//====================================================

loadMonthlySummary();

