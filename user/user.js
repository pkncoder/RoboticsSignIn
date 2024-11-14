const url = "http://127.0.0.1:5000/"

$(function () {
    $("#timePicker")[0].value = ""
    $("#timePicker")[0].value = getTime()
});

// Used to check to see if user is signedin
function checkUserIn() {

    // Cookie is alive
    if (getCookie("uname") != "") {

        $("#helloUserIn")[0].innerHTML = "Hello, " + getCookie("uname")
        $("#helloUserOut")[0].innerHTML = "Hello, " + getCookie("uname")

        $(".login-screen")[0].style.display = "none"
        $(".signout-screen")[0].style.display = "none"
        $(".signout-screen")[0].style.display = "none"


        var postData = {
            uname: getCookie("uname")
        }

        // Send the post request
        $.ajax({
            type: "POST",
            url: url + "isSignedIn",

            data: JSON.stringify(postData),

            contentType: "application/json",

            success: function(response) {

                if (JSON.parse(response)["isSignedIn"] == "True") {
                    $(".login-screen")[0].style.display = "none"
                    $(".signin-screen")[0].style.display = "none"
                    $(".signout-screen")[0].style.display = "block"

                    let date = JSON.parse(response)["date"]
                    let time = JSON.parse(response)["time"]

                    let timeThen = new Date(Date.parse(`${date} ${time}Z`))
                    let timeNow = new Date(Date.now())

                    let timeDiff = new Date(timeNow - timeThen)

                    let finalTimeString = `${timeDiff.getHours()}:${timeDiff.getMinutes()}:${timeDiff.getSeconds()}`

                    let days = timeNow.toString().split(" ")[2] - timeThen.toString().split(" ")[2]

                    if (timeNow.getHours() > timeThen.getHours()) {
                        days++
                    }

                    else if (timeNow.getHours() == timeThen.getHours() && timeNow.getMinutes() > timeThen.getMinutes()) {
                        days++
                    }

                    else if (timeNow.getHours() == timeThen.getHours() && timeNow.getMinutes() == timeThen.getMinutes() && timeNow.getSeconds() > timeThen.getSeconds()) {
                        days++
                    }

                    if (days > 0) {finalTimeString = days + " day(s), " + finalTimeString}

                    $("#timeOutFor")[0].innerHTML = "Time signed out for: " + finalTimeString
                }

                else {
                    $(".login-screen")[0].style.display = "none"
                    $(".signin-screen")[0].style.display = "block"
                    $(".signout-screen")[0].style.display = "none"
                }
            },

            error: function() {
                alert("ERROR")
            },

        });
    }

    // Cookie not alive - have signin
    else {
        $(".login-screen")[0].style.display = "block"
        $(".signin-screen")[0].style.display = "none"
        $(".signout-screen")[0].style.display = "none"
    }
}

// Reset cookie and reload
function checkUserOut() {
    document.cookie = "uname=;"
    location.reload()
}

// Creates a cookie for the user
function createCookie() {
    document.cookie = "uname=" + $("#usernameLogin")[0].value
    location.reload()
}

// Logs the user in and checks correct data
function loginUser() {

    let postData = {
        "uname": $("#usernameLogin")[0].value,
        "password": "",
        "loginType": "user"
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

// Sign in
function signIn() {

    // Get the name
    const name = getCookie("uname");

    // Get the post data
    const postData = {
       name: name, // name
       instr: "SIGNIN", // instruction
       date: getDate(), // current date dd-mm-yyyy
       time: getTime() // current time in hh:mm:ss
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

// Sign out
function signOut() {
    const name = getCookie("uname"); // Name of the user

    // Post data
    const postData = {
       name: name, // name
       instr: "SIGNOUT", // instruction
       date: getDate(), // current date dd-mm-yyyy
       time: getTime() // current time in hh:mm:ss
    }
    
    // Post request send
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

function getDate() {
    const date = new Date()
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
}

function getTime() {

    // Get the time picker
    const timePicker = $("#timePicker")[0].value

    // If it's empty
    if (timePicker == "") {
        // Return now
        const date = new Date()
        return `${
            date.getHours() < 10 ? "0" + date.getHours() : date.getHours()
        }:${
            date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes()
        }:${
            date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds()
        }`
    }

    else {
        // Return the specified time
        return timePicker
    }
}

// W3schools
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