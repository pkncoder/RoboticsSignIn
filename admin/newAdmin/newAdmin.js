const url = "http://127.0.0.1:5000/"


/* Startup functions */


$(document).ready(function() {

    checkUserIn()

    $.ajax({
        type: "GET",
        url: url + "logDates",

        contentType: "application/json",

        success: function(response) {

            let dates = response

            $('#datepicker').datepicker({                
                dateFormat: 'yy-mm-dd',
                beforeShowDay: highlightDays,
                showOtherMonths: true,
                numberOfMonths: 1,
            });
        
            function highlightDays(date) {
                for (var i = 0; i < dates.length; i++) {
                    if (new Date(`${dates[i]}T00:00:00`).toString() == date.toString()) {              
                        return [true, 'highlight'];
                    }
                }

                return [true, ''];
            } 
        },
        error: function() {
            alert("ERROR")
        }
    })

    

});

// Used to check to see if user is signedin
function checkUserIn() {

    $("#login-screen")[0].style.display = "none"
    $("#data-screen")[0].style.display = "none"
    $("#ticket-screen")[0].style.display = "none"

    // Cookie is alive
    if (getCookie("uname") != "") {
        $("#login-screen")[0].style.display = "none"
        $("#data-screen")[0].style.display = "block"
        $("#ticket-screen")[0].style.display = "none"

        sendGetRequests()
    }

    // Cookie not alive - have signin
    else {
        $("#login-screen")[0].style.display = "block"
        $("#data-screen")[0].style.display = "none"
        $("#ticket-screen")[0].style.display = "none"
    }
}


/* User functions */


// Logs the user in and checks correct data
function loginUser() {

    let postData = {
        "uname": $("#usernameLogin")[0].value,
        "password": $("#passwordLogin")[0].value,
        "loginType": "admin"
    }

    $.ajax({
        type: "POST",
        url: url + "checkAuth",

        data: JSON.stringify(postData),

        contentType: "application/json",

        success: function(response) {
            if (response == "True") {
                createCookie()
            }

            else {
                alert("Username is invalid, try again or notify someone.")
            }
        },

        error: function() {
            alert("ERROR")
        },

    });
}


function showTicketScreen() {
    $("#login-screen")[0].style.display = "none"
    $("#data-screen")[0].style.display = "none"
    $("#ticket-screen")[0].style.display = "block"
}


/* API functions */


// Main method that gets the api data
function sendGetRequests() {

    /*
     * Route: /files
     * Job: Create the select element with all the dates that have data in them
     * Args: None
    */
    $.ajax({
        type: "GET",
        url: url + "logDates",

        contentType: "application/json",

        success: function(response) {
            let postData = {
                date: response.includes($("#datepicker")[0].value) ? $("#datepicker")[0].value : "1892-04-28"
            }

            /*
            * Route: /admin
            * Job: Get the user's sign in/out data and append it to the site
            * Args: The filename (by the date)
            */
            $.ajax({
                type: "POST",
                url: url + "admin",
                
                data: JSON.stringify(postData),

                contentType: "application/json",

                success: function(response) {
                    useApiData(JSON.parse(response))
                },
                error: function() {
                    alert("ERROR")
                }

            });
        },
        error: function() {
            alert("ERROR")
        }
    })
}

// Append data to the website givin by the api to append to the site
// Not to do with select menu
function useApiData(data) {

    // The activity log from the data
    const activityLog = data["activityLog"]
    const totalTimes = data["totalTimes"]
    const currentlySignedIn = data["currentlySignedIn"]

    // Reset the table bodies if their is stuff to be added (since currently it is a "nothing here" message)
    if (activityLog.length > 0) {
        document.getElementById("activityLogTableBody").innerHTML = ""
    }
    if (Object.keys(totalTimes).length > 0) {
        document.getElementById("totalTimeTableBody").innerHTML = ""
    }
    if (currentlySignedIn.length > 0) {
        document.getElementById("currentSignedInTableBody").innerHTML = ""
    }

    // Loop all the activities in the data
    for (logNum in activityLog) {

        // Create a tr to group the table sections
        let activityLogTr = document.createElement("tr")

        // Create three tds for each part of the table
        let name = document.createElement("td")
        let action = document.createElement("td")
        let time = document.createElement("td")

        // Set the text for each table item
        name.innerHTML = activityLog[logNum]["name"]
        action.innerHTML = activityLog[logNum]["instr"]
        time.innerHTML = activityLog[logNum]["time"]

        // Add them to the tr
        activityLogTr.appendChild(name)
        activityLogTr.appendChild(action)
        activityLogTr.appendChild(time)

        // Add the tr to the table body
        document.getElementById("activityLogTableBody").appendChild(activityLogTr)
    }

    // Loop all the total times in the data
    for (person in totalTimes) {

        // Create a tr to group the table sections
        let totalTimesTr = document.createElement("tr")

        // Create two tds for each part of the table
        let name = document.createElement("td")
        let time = document.createElement("td")

        // Set the text for each table item
        name.innerHTML = person
        time.innerHTML = totalTimes[person]

        // Add them to the tr
        totalTimesTr.appendChild(name)
        totalTimesTr.appendChild(time)

        // Add the tr to the table body
        document.getElementById("totalTimeTableBody").appendChild(totalTimesTr)
    }

    // Loop all the total times in the data
    for (personIndex in currentlySignedIn) {

        // Create a tr to group the table sections
        let currentlySignedInTr = document.createElement("tr")

        // Create a td for the name
        let name = document.createElement("td")

        // Set the text for each table item
        name.innerHTML = currentlySignedIn[personIndex]

        // Add it to the table
        currentlySignedInTr.appendChild(name)

        // Add the tr to the table body
        document.getElementById("currentSignedInTableBody").appendChild(currentlySignedInTr)
    }
}

/* Time Functions */


function getDate() {
    // Just return today
    const date = new Date()
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
}

function getTime() {

    // Return now
    const date = new Date()
    return `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
}


/* Cookie Helper functions */

// Reset cookie and reload
function deleteCookie(name) {
    document.cookie = name + "=;"
    location.reload()
}

// Creates a cookie for the user
function createCookie() {
    document.cookie = "uname=" + $("#usernameLogin")[0].value
    location.reload()
}

// W3schools
// Get a cookie
function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i <ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
}