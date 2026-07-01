//====================================================
// PS365 Statistics V2
//====================================================

window.addEventListener("load",()=>{

    loadStatistics();

});

//====================================================
// Load Statistics
//====================================================

function loadStatistics(){

    const studies = getAllStudies();

    let totalSeconds = 0;

    let totalTopics = 0;

    let completedTopics = 0;

    let totalSessions = 0;

    let bestDay = "";

    let bestSeconds = 0;

    studies.forEach(study=>{

        //--------------------------------

        // Study Time

        //--------------------------------

        totalSeconds +=

            study.totalSeconds || 0;

        //--------------------------------

        // Topics

        //--------------------------------

        if(study.topics){

            totalTopics +=

                study.topics.length;

            completedTopics +=

                study.topics.filter(

                    x=>x.completed

                ).length;

        }

        //--------------------------------

        // Sessions

        //--------------------------------

        if(study.sessions){

            totalSessions +=

                study.sessions.length;

        }

        //--------------------------------

        // Best Day

        //--------------------------------

        if(

            (study.totalSeconds||0)

            > bestSeconds

        ){

            bestSeconds =

                study.totalSeconds || 0;

            bestDay =

                study.date;

        }

    });

    //--------------------------------

    // Study Time

    //--------------------------------

    document.getElementById("totalHours").innerHTML =

        formatDuration(totalSeconds);

    //--------------------------------

    // Topics

    //--------------------------------

    document.getElementById("totalMcqs").innerHTML =

        completedTopics +

        " / " +

        totalTopics;

    //--------------------------------

    // Days

    //--------------------------------

    document.getElementById("studyDays").innerHTML =

        studies.length;

    //--------------------------------

    // Streak

    //--------------------------------

    document.getElementById("currentStreak").innerHTML =

        calculateCurrentStreak(studies);

    //--------------------------------

    // More Details

    //--------------------------------

    loadAchievements(

        totalSessions,

        bestDay,

        completedTopics,

        totalTopics,

        totalSeconds,

        studies.length

    );

}

//====================================================
// Achievements
//====================================================

function loadAchievements(

    totalSessions,

    bestDay,

    completedTopics,

    totalTopics,

    totalSeconds,

    studyDays

){

    //-----------------------------------

    // Completion %

    //-----------------------------------

    const completion =

        totalTopics===0

        ?0

        :Math.round(

            (completedTopics/totalTopics)*100

        );

    //-----------------------------------

    // Average

    //-----------------------------------

    const average =

        studyDays===0

        ?0

        :Math.floor(totalSeconds/studyDays);

    //-----------------------------------

    // Update Cards

    //-----------------------------------

    if(document.getElementById("revisionCount"))

        document.getElementById("revisionCount").innerHTML =

            completion + "%";

    if(document.getElementById("currentAffairsCount"))

        document.getElementById("currentAffairsCount").innerHTML =

            totalSessions;

    if(document.getElementById("mockTestCount"))

        document.getElementById("mockTestCount").innerHTML =

            bestDay || "-";

    //-----------------------------------

    // Topic Statistics

    //-----------------------------------

    loadTopicStatistics();

}

//====================================================
// Topic Statistics
//====================================================

function loadTopicStatistics(){

    const container =

        document.getElementById("subjectStats");

    container.innerHTML = "";

    const studies = getAllStudies();

    const topicMap = {};

    studies.forEach(study=>{

        if(!study.topics)

            return;

        study.topics.forEach(topic=>{

            if(!topicMap[topic.title]){

                topicMap[topic.title]={

                    total:0,

                    completed:0

                };

            }

            topicMap[topic.title].total++;

            if(topic.completed)

                topicMap[topic.title].completed++;

        });

    });

    //-----------------------------------

    // Empty

    //-----------------------------------

    if(Object.keys(topicMap).length===0){

        container.innerHTML=

        "<p>No study records found.</p>";

        return;

    }

    //-----------------------------------

    // Render

    //-----------------------------------

    Object.keys(topicMap)

    .sort()

    .forEach(topic=>{

        const item = topicMap[topic];

        const percent =

            Math.round(

                (item.completed/item.total)*100

            );

        container.innerHTML += `

        <div class="subject-item">

            <div>

                <strong>

                    ${topic}

                </strong>

                <br>

                <small>

                    ${item.completed}

                    /

                    ${item.total}

                    Completed

                </small>

            </div>

            <div>

                ${percent}%

            </div>

        </div>

        `;

    });

}

//====================================================
// Current Streak
//====================================================

function calculateCurrentStreak(studies){

    if(studies.length===0)

        return 0;

    const dates =

        studies

        .map(s=>s.date)

        .sort()

        .reverse();

    let streak = 0;

    let current = new Date();

    current.setHours(0,0,0,0);

    for(const value of dates){

        const d = new Date(value);

        d.setHours(0,0,0,0);

        const diff =

            (current-d)

            /(1000*60*60*24);

        if(diff===0 || diff===1){

            streak++;

            current=d;

        }

        else{

            break;

        }

    }

    return streak;

}

//====================================================
// Format Time
//====================================================

function formatDuration(seconds){

    const hrs =

        Math.floor(seconds/3600);

    const mins =

        Math.floor(

            (seconds%3600)/60

        );

    return

        hrs +

        "h " +

        mins +

        "m";

}