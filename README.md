# SENG2021
## Theme: Camping Website

## NODE setup
To run the website now, Node.js is required. Install it if you don't have it.

Install npm if you don't have it, which is the Node package manager.
Install nodemon using `npm install -g nodemon`
Navigate to the /SENG2021 directory and run `nodemon` and access http://localhost:3000 to view the website.
Use Ctrl+C to close the app

If you guys have problems (steve advice)
ps aux | grep 3000
kill -9 "pid" (which node is occupied) or just do "killall -9 node"

## TODO
* **Home:** Feedback pls
* **Campsite Search:** Pins need information when clicked (Title of camping ground, summary, maybe address and phone number, directions, maybe distance, and external link for more information)
* **Campsite Search:** Information for each campsite should be displayed below the map (????)
* **Campsite Search:** Search menu with a nice appearance
* **Campsite Search:** Minor map issues (pin icons, distance, directions) (mostly done- just need to fix distance and add some sexy icons)
* **Campsite Search:** Some AngularJS stuff
* **Campsite Details:** Everything - Need Node.js
* **Equipment:** Everything - Need Node.js
* **Guides:** Everything - not important
* **Other:** Powerpoint (done)
* **Everything:** Nice CSS
* **Everything:** Nice code (probably need a redone after tuesday)



## Bugs
* **Campsite Search: When moving map shows a blue selected section(can't reproduce- just daniel computer apparently)
* **Campsite Search: Need to do something when the campsites are close together(can't click on icon)-> (steve sugguestion: increase the zoom if number of markers exceeds a certain number or have some fancy alogrithm to predict how many places in a radius then increase the zoom?)
* **Campsite Search: Screen just randomly whites out sometimes when zooming in and out fast (it is normal, just load time)





## Decision
* **Campsite Search: Decide on marker to use
* **Campsite Search: Marker popup position needs to be fixed
* **Campsite Search: Zoom in and out
* **Campsite Search: Disable some default Google map features
* **Campsite Search: Radius?
* **Campsite Search: Dragging feature (Horrendous amount of bugs)
* **Campsite Search: Icons
* **Campsite Search: Positioning of the map








