# Hoarder
A shopping list and todo list app 

- using lit-element. 
- uses pouchdb/couchdb and 
- follows an offline first approach - in fact it is supposed to be used
offline rather than online. 
check it out: https://sleepy-easley-c64c05.netlify.app

## cloning this
this project needs a credentials.ts in src/app/store. src/app/store/db.ts imports username and password needed to access the remote couch-db.

## how to install the app for the first time
  - Hoarder is a progressive web app. 
  That means it can run without an internet connection, 
  can be installed on the local device more or less like an app
  and saves its data locally (until the data gets synchronized with a server)
  - to install it on iOS you navigate to the url and once the page is loaded use the share button
  to add it as a bookmark to the homescreen 
  - to install it on windows or macOS use chrome because chrome
  offers the tools to add the app to the operating system. The necessary
  tools pop up somewhere near the address 

## how to update the app
  That is still tricky because these apps are not handled like native apps by the operating systems.
  - if you know that there is a new release you have to delete an old installation first
  - on iOS you first delete the bookmark from the homescreen by going into wiggle mode.
  - make sure you close all running instances of the app (really close it by swiping it away in the gallery of running apps) 
  - on windows you delete the app from the start menu and on macOS just get rid of the icon
  - now comes the important part for iOS: You have to empty safari's cache
  - to do that go to the settings, choose safari, go all the way down to advanced and there to Website Data.
  - in Website data search for "sleepy". You should find the hoarder url. 
  - swipe the line left to delete it.
  - after that is done, hoarder is deinstalled and you can just go to safari and 
  reinstall it as described under "how to install".  
  - on other operating systems you have to make sure to empty the browser's cache as well before you can install a new instance.
  - on windows in firefox and chrome you use ctrl + shift + del and delete website data and everything cached. With a subsequent
  reload using ctrl+F5 you make sure the entire app is loaded without using anything cached (there are so many caches in Browsers)
  - I am not sure how to do that on macOS, but Safari needs to empty its cache and offline data as well. 
     
