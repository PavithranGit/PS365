// Load Profile
window.onload = function () {

    const profile = getProfile();

    document.getElementById("name").value = profile.name;
    document.getElementById("exam").value = profile.exam;
    document.getElementById("targetHours").value = profile.targetHours;
    document.getElementById("targetMcqs").value = profile.targetMcqs;

};

// Save Profile

document.getElementById("saveProfile").addEventListener("click", function () {

    const profile = {

        name: document.getElementById("name").value.trim(),
        exam: document.getElementById("exam").value,
        targetHours: Number(document.getElementById("targetHours").value),
        targetMcqs: Number(document.getElementById("targetMcqs").value)

    };

    if (profile.name === "") {

        alert("Please enter your name.");

        return;

    }

    saveProfile(profile);

    alert("Profile Saved Successfully!");

});