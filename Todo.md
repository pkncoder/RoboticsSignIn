# Finish Before Release

## User (Not all Nessisairy)
- [ ] ~~Time inputs~~
- [x] Time signed in for
  - Num Days / Months / Years are missing
  - Works, calculated on frontend
  - Try moving to the backend time in for

## Admin
- [x] Fix dates and how they add up
- [x] Fix who's signed in
- [x] Admin Tickets
  - Omg its so bad
- [x] Select date check fix

## Both
- [ ] ~~Clean up code~~
- [x] Refactor API

# Todo:

## User

- [x] A new sign in where you can input the time if you forgot
- [x] The checks for *hey you can't sign in since you already are signed in*
- [ ] ~~Fix the date picker~~
- [x] User acounts
- [x] Make UI nicer
  - Use Bootstrap as much as possible
- [x] Url's changed to not use /log at the end and you have to add the extention
- [x] Time logged in on signout screen

## Admin

- [x] A way to check different logs
- [x] An admin sign in and out
- [x] Total time of people
- [ ] Admin acounts (passwords too)
- [ ] Update the UI
- [ ] Edits to user entries
- [ ] Search feature to the entries
  - [ ] By user
  - [ ] By time there
  - [ ] By arrive/leave time

## Control

- [ ] Top acount editing

## Mix

- [x] The frontend sends the api the day to GET or POST
  - [x] User
  - [x] Admin
- [x] Comments
  - [x] User
  - [x] Admin
- [x] Make it so there are no more search params used and swap to POST requests
- [ ] ~~Url swapper (change one thing to change everything (api & js))~~

# How to run through wifi
- Change app.run(debug=True) in api.py to app.run(host="0.0.0.0", port=5000)
- Set the "Use Local Ip" setting to true
  - Cmd P
  - type >settings
  - hit enter
  - search for liveserver
  - scroll to bottom and go up until you find the setting
- Change the url in admin.js to "http://10.116.216.78:5000/"
- Change the url in user.js to "http://10.116.216.78:5000/log"
- Set the wifi of both computers to PerkinsStaff (password: S3cure$t@ff)