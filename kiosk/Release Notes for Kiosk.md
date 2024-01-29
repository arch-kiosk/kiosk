### 🌷  Release Notes for Kiosk Version 1.5 (22 May 2023) 🌷
This is an overview of the visible improvements since Version 1.2.9 (1. January 2023):
This and older release notes are on https://github.com/arch-kiosk/arch-kiosk-office/issues/1434

:octocat: We recommend viewing them on GitHub.

🎬 You'll find updated documentation and many new video tutorials on sites.brown.edu/kiosk 🎬 


- 🌷 New Point Repository to manage RTK / GIS points in Kiosk and make them available to FileMaker Recording. (#1986)   
This allows you to import points from a CSV or Excel file as supplied by an RTK or GIS into Kiosk in order to manage your Control Points and make them available to the new "Coordinates" UI in FileMaker Recording.  
- 🌷 KioskBridge: Kiosk is ready for KioskBridge 0.2.2     
The days of downloading FileMaker databases from Kiosk via Browser are over on iPads. Use the new KioskBridge App that is available via TestDrive (https://sites.brown.edu/kiosk/kioskbridge/)  
- 🌷 File Import supports two new qr code strategies: "Peruvian Light" and "August in Italy" to get better recognition rates in Peru and Italy.
- 🌷 "Ton" File Import: move successfully imported files to sub folder "done" #1864  
- 🌷 Director's View has static ("sticky") headers for all tables to improve scrolling. (#1265)
- 🌷 Support of new image file types: now the File Repository understands WebP and JPF (JPEG2000) Files. (#1288 / #846)
- 🏷️ Inventory Images appearing under tag "inventory" (#1940)    
For all those who are using the inventory module in the FileMaker Recording to keep track of your project's assets: You can find the images of your stuff in the file repository by using the tag "inventory" 
- 🌷 hub: Filemaker Recording Docks can now be "renewed" (#1984)    
After certain structural updates to Kiosk it can happen that your FileMaker Docks can not be prepared anymore because some field is reported missing. In this case try using the new "renew" option available in the dock's "advanced options". 
- 🌷 hub: legacy locus relations should now have proper temporal relations (#1402)    
For all of you who recorded locus/context relations before Summer 2022: Kiosk should add the proper temporal relations automatically to those spatial relations. Please check.
- 🌷 synchronization/housekeeping: Non-Image files are not cluttering the synchronization log with errors anymore.    
If you record audio or video (don't) in FileMaker or add a file that isn't an image file, synchronization or rather the housekeeping part of synchronization reported a bunch of scary red lines with all subsequent synchronization runs. They were never errors and have never stopped synchronization. Now they are fewer and they don't reoccur again in the next synchronization round.
- 🌷 many technical improvements behind the scenes (#2037, #2075, #2067, #2128, #2029, #2015, #2010, #1972, #2111, #2073, #1978)
- 🌷 Kiosk 1.5 supports all the features of FileMaker Recording version 15
    
... and ...
- 🪟 Windows 11: Kiosks supports field servers running Windows 11 now.
- 🌷 Use an Opal router to access Kiosk via "http://kiosk" instead of an ip address.


### ❄️ Release Notes for Kiosk Version 1.5.2.1 (04 June 2023) ❄️
This is an overview of the visible improvements since Version 1.5 (22. May 2023):
This and older release notes are on https://github.com/arch-kiosk/arch-kiosk-office/issues/1434

This and older release notes are on https://github.com/arch-kiosk/arch-kiosk-office/issues/1434
:octocat: We recommend viewing release notes on GitHub.

🎬 You'll find updated documentation and many new video tutorials on sites.brown.edu/kiosk 🎬 

- ❄️ brand new life-changing qr-coded file sequence import (#2138)
          You'll find the new "file sequence" import in the file import. 
          It will change your life in the field when the sun is glaring down on your ipad or some shrubbery is casting shadows on your screen
- ❄️ improvements to the reporting engine that support PASU reporting (#1822, #2155, #2159, #2154)

### 🍎 Release notes for Kiosk 1.5.13 (Vague Views)🍎

📣 Query & View is the new module in Kiosk's menu. It allows you to query your data with pre-configured queries and view your archaeological record in Kiosk itself. No FileMaker needed.

You find it in the main menu
Two buttons in the toolbar allow you to either select a query (the board icon) or go straight to a view by selecting an archaeological identifier from a list.
wherever you see an archaeological identifier (particularly if it has 👣 ) you can click on it to open a new view.

🐛 First-Version-Disclaimers

- 💻 At this point this works best on larger screens. If you have the feeling your clicking didn't do anything: scroll down!
- 🏳️ The selection of queries is pretty meagre at this point: Hit us with wishes! E.g. here: 

- data analysis: What do you want to search and analyze in your data post-season? #1788
- Currently the views are still a bit basic: Only sites, loci/contexts, unit/areas and collected materials are covered. But this is just the beginning and we wanted to share it as soon as it has value
- 🥽 Note that this is and will stay read-only. Kiosk is a synchronizing system and allowing for live input of data is not compatible with that approach. But this is only our first step towards FileMaker independence ...

🐞 If you are missing data, see your data misrepresented or have any suggestions, please let us know. E.g. by filing an issue here on GitHub: https://github.com/arch-kiosk/arch-kiosk-office/issues

### ❄️ Release notes for Kiosk 1.5.21 and the Recording App 15.14 ❄️

📣 With the first rollout of 2024 all projects got updated with the latest improvements in Kiosk and its recording app. While the major new features are still in the making, we have been improving usability and added useful details that we want to share with all of you. These are the major news you might want to know about: 

✏️ As always: The release notes are best viewed on GitHub https://github.com/arch-kiosk/arch-kiosk-office/issues/1434

#### ❄️ News for the Recording App ❄️
- ❄️ Month and day get so easily confused in date fields, particularly when inputting legacy data. That's why Kiosk has always shown a Latin representation of your input. NOW it allows you to enter dates in the Latin format almost everywhere where you find a date / date time field. You can even type something short like 2IV89 to get April 2nd 1989 (#2416)
- ❄️ For units/trenches you can record a list of involved people (they don't even have to be team members) and their roles. So far there was only a supervisor. (#2415) 
- ❄️ Lots can be highly customized. E.g. they can be automatically numbered either according to locus or unit.You can even allow duplicates (#2490)
- ❄️ Registration can be configured to show not only the bulk number but also the locus/context and unit/trench (#2472)
- ❄️ Collected materials can have a second field for "material" to further specify the material. (#2464)
- ❄️ The Gallery now shows the time when a photo was shot (which can differ from the time of recording) and allows manipulating it. Image popups in dayplans and loci/context photos allow this, too. (#2441)
- ❄️ Site notes got the identifier navigation that we introduced for other description fields. (#2413)
- 🐞Full text search got fixed (#2485)
 
#### ❄️ News for Kiosk ❄️
- 👺 Orange alert: All images in the file repository that came from importing raw SLR photos had a more or less pronounced orange hue, depending on your camera and environment. While the original files were always unaffected (Kiosk stores but never touches the originals) all other versions of a file would have this colour aberration. It is fixed and all thumbnails for all project's got re-rendered.   
The good side: We can offer now an option to render your thumbnails with a brighter white-balance if you find your thumbnails still too warm. (#2440)  
- ❄️ In the file repository you can find collected materials by their description or material type (#2502)   
- ❄️ The file repository allows you to search photos by date and date range (#2439)
- ❄️ The file repository now sorts undated images to the end unless you sort using the new option "undated, then latest first" (#2404)
- ❄️ Synchronization offers you a more detailed log now even if the run was simply successful. (#2470)   
- ❄️ The Hub shows you when the last synchronization took place (#2445)
- ❄️ The Hub offers a history of events with the new "sync & dock events" menu item (#2445)
- ❄️ The Hub shows a dock's TimeZone whenever there is an explicit TimeZone set (#2442)

#### 🔭 Coming soon: Harris Matrix Generator 🔭
Just to whet your appetites: Coming soon is a Harris Matrix generator built right into Kiosk that will finally allow you to check and visualize your locus relations and phasing. And visualization will be just the first step! Stay tuned!   
 
