const url = "http://127.0.0.1:5000/"

// Main method that gets the api data
function sendGetRequests() {
    
    $.ajax({
        type: "GET",
        url: url + "logDates",

        contentType: "application/json",

        success: function(response) {
            createDateSelectElement(response)
        },
        error: function() {
            alert("ERROR")
        }
    })

    let postData = {
        date: getSelectedDate()
    }

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
}

// Create a date select element from api's data of files
// NOT MAIN CALL
function createDateSelectElement(data) {

    // Get the select element and reset the options
    let select = document.getElementById("dateSelect")
    select.innerHTML = ""

    // Loop every date in the data
    for (date in data) {
        // Create an option
        option = document.createElement("option");

        // Set the value and text
        option.value = data[date];
        option.innerHTML = data[date];

        // Add it to the select meny
        select.appendChild(option);
    }
}

// Append data to the website givin by the api to append to the site
// Not to do with select menu
function useApiData(data) {

    // The activity log from the data
    const activityLog = data["activityLog"]

    // Create a new ul for the activity log
    let activityLogList = document.createElement("ul")

    // Loop all the activities in the data
    for (i in activityLog) {
        // Append a new li to the main ul list
        activityLogList.appendChild(createRecordItem(activityLog[i]))
    }

    // Reset the activity log div and add the activity log list
    document.getElementById("activityLogDiv").innerHTML = "<p>Activity Log</p>"
    document.getElementById("activityLogDiv").appendChild(activityLogList)

    // Create a new ul for who is currently signed in
    let currentlySignedInList = document.createElement("ul")

    // Loop every person in the users currently signed in
    for (i in data["currentlySignedIn"]) {
        // Create a new list item and set the text to the person and the timestamp
        let listItem = document.createElement("li")
        listItem.innerHTML = data["currentlySignedIn"][i]

        // Add the list item
        currentlySignedInList.appendChild(listItem)
    }

    // Reset the div and add the ul
    document.getElementById("signedInDiv").innerHTML = "<p>Currently Signed In</p>"
    document.getElementById("signedInDiv").appendChild(currentlySignedInList)

    var totalTimes = data["totalTimes"]
    var totalTimesList = document.createElement('ul')

    // Loop every person in the totalTimes
    for (person in totalTimes) {
        // Create a list item and add the name + time
        let listItem = document.createElement("li")
        listItem.innerHTML = `"${person}: ${totalTimes[person]}"`

        // Add the list item
        totalTimesList.appendChild(listItem)
    }

    // Reset the div and add the ul
    document.getElementById("timesDiv").innerHTML = "<p>Total Times</p>"
    document.getElementById("timesDiv").appendChild(totalTimesList)
}

// Returns a list item with a person's data from api
function createRecordItem(data) {

    // Create a new list item
    var listItem = document.createElement("li")

    // Set the text to name: time (instruction)
    listItem.innerHTML = data["name"] + ": " + data["time"] + " (" + data["instr"] + ")"

    // Return the list item
    return listItem
}



function sendTicket() {
    let postData = {
        name: $("#name")[0].value,
        time: $("#timepicker")[0].value,
        instr: $("#ticketInstructionSelect")[0].value,
        date: formatDatePicker($("#datepicker")[0].value)
    }

    // Send the post request
    $.ajax({
        type: "POST",
        url: url + "log",
        data: JSON.stringify(postData),

        contentType: "application/json",

        success: function() {
            // alert("SUCCESS")
        },
        error: function() {
            alert("ERROR")
        },

    });
}

function formatDatePicker(value) {
    let date = value.replaceAll("/", "-").split('-')

    let temp = date[0]
    date[0] = date[2]
    date[2] = temp

    temp = date[1]
    date[1] = date[2]
    date[2] = temp

    return date.join("-")
}


function getCurrentDate() {
    const date = new Date()

    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
}

function getSelectedDate() {
    let selectValue = $("#dateSelect")[0].value

    if (selectValue == "") {selectValue = getCurrentDate()}

    return selectValue
}

function getCurrentTime() {
    const date = new Date()

    return `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
}

function newTicket() {
    $(".data")[0].style.display = "none"
    $(".ticket-screen")[0].style.display = "block"
}