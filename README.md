# SENG2021

# NEXT ASSESSMENT: WEEK 12

## NODE setup
To run the website now, Node.js is required. Install it if you don't have it.

Install npm if you don't have it, which is the Node package manager.
Install nodemon using `npm install -g nodemon`
Navigate to the /SENG2021 directory, run `nodemon` and access http://localhost:3000 to view the website.

Use Ctrl+C to close the app.

If you guys have problems (steve advice)

ps aux | grep 3000

kill -9 "pid" (which node is occupied) or just do "killall -9 node"

## TODO
In the week 12 assessment, we need to present two things:
* The website
* ~~Design report~~ (can be ignored for a while)

For the website, each section requires knowledge of different frameworks:

___

### Home
#### Completion: 75%+
#### Requirements
* **HTML**
* **CSS + Bootstrap**
* **AngularJS**

#### Assigned to: No one needs to do this right now

This page is mostly complete. Minor style changes and changes to the buttons are really all
that needs to be done. Angular is required for moving search results to the campsite search page (mostly done)

___

### Campsite Search
#### Completion: ~30%
#### Requirements
* **HTML**
* **CSS + Bootstrap**
* **AngularJS**
* **Node.js**
* **MongoDB + NoSQL**
* **Google Maps API**

#### Assigned to: STEVE + [INSERT NAME(S) HERE]

Biggest feature of our website requires more attention. Very basic searching works right now, and very basic campsite information generation works. The idea for the future would be that the website asks our database **(requires Node.js + MongoDB knowledge)** for campsite information instead of re-asking Google Maps API for the same campsites. So if a new campsite appears, we ask Google Maps and place that into our database so that next time we don't waste our quota searching the same campsite.

Also, campsite information should have sorting options, such as by distance or rating. **AngularJS** knowledge is required for this.

**Some important things that are to be done:**
* Change map icons to be all the same, or use custom icons
* Disable map features such as satellite, streetview

___

### Campsite Information
#### Completion: 1%
#### Requirements
* **HTML**
* **CSS + Bootstrap**
* **Node.js**
* **MongoDB + NoSQL**
* **Twitter, Facebook API**
* **Weather API**

#### Assigned to: [INSERT NAME(S) HERE]

Very important page. These pages are dynamically generated based on a given ID, which will be used to retrieve information from our database **(requires Node.js + MongoDB knowledge)**. This information will then be generated onto the page (this isn't as difficult as it sounds, just need html), and external data such as the weather or sharing will be added using the three listed APIs.


###use this api: https://openweathermap.org/
###api key: 4d30a475c46e1fc7e5c6d9f7ee6517be
###api doc: http://openweathermap.org/current
###example : http://api.openweathermap.org/data/2.5/weather?q=randwick,au&callback=test&appid=4d30a475c46e1fc7e5c6d9f7ee6517be&mode=html
___

### Popular Campsites
#### Completion: 0%
#### Requirements
* **HTML**
* **CSS + Bootstrap**
* **AngularJS**
* **MongoDB + NoSQL**

#### Assigned to: [INSERT NAME(S) HERE]

Grab campsite information from the database and sort based on rating. Perhaps other methods of sorting as well if possible. Not the most important page.

___

### Browse Equipment
#### Completion: 0%
#### Requirements
* **HTML**
* **CSS + Bootstrap**
* **Node.js**
* **AngularJS**
* **MongoDB + NoSQL (MAYBE)**

#### Assigned to: [INSERT NAME(S) HERE]

There are various ways of going about doing these pages. We could get information off other websites, or we could make up equipment/prices and store them manually in a database.

___

### Guides
#### Completion: 0%
#### Requirements
* **HTML**
* **CSS + Bootstrap**

#### Assigned to: No one

Don't do this. Not important at all

___

## TUTORIALS
There is a lot to learn for every section of this website. These are some decent tutorials but please do your own research and find stuff out for yourself.

### Node.js
* \#17 onwards is the most useful: https://www.youtube.com/playlist?list=PL4cUxeGkcC9gcy9lrvMJ75z9maRw4byYp

### AngularJS
* Tbh haven't watched this but the guy is good: https://www.youtube.com/playlist?list=PL4cUxeGkcC9jqhk5RvBiEwHMKSUXPyng0
* https://docs.angularjs.org/tutorial/step_00

### MongoDB
* \#34-37: https://www.youtube.com/playlist?list=PL4cUxeGkcC9gcy9lrvMJ75z9maRw4byYp
