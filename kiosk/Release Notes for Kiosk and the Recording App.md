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
 
### ❄️ All Field Projects: Release notes for Kiosk 1.5.26 and the Recording App 15.15 ❄️

📣 Our Pre-Spring rollout in 2024 is all about Harris Matrices! 

✏️ As always: The release notes are best viewed on GitHub https://github.com/arch-kiosk/arch-kiosk-office/issues/1434

#### 🪻 News for Kiosk 🪻
- 🪻 There is a new module in the menu: Stratigraphic Studio. That's where you can marvel at your stratigraphy VISUALLY!     
- 🪻 Stratigraphic Studio will also analyze your stratigraphic relations and tell you about cycles, contradictions, excess relations and other issues in your archaeological record that you should look into
- 🪻 You can look at whole units or at single loci. In the latter case you get the same results as in the recoding app (see below) 
- 🪻 you have access to a bunch of "layout" options. Try them and find your preferred view on your archaeological data. 
- 🪻 you can colour the stratigraphic units in the matrix according to tags you applied to loci in the recording.   

#### 🪻️ News for the Recording App 🪻
- 🪻 We can even offer the same Harris Matrix view in FileMaker! Simply click on the new button next to the stratigraphic relations.
- 🪻 In the Recording App you get the immediate relations of the current locus (context, SU) so that you can check your results during recording in the trench
 

#### 🪻️ Outlook 🪻
Wilhelm Busch once said "Ein jeder Wunsch wenn er erfüllt, kriegt augenblicklich Junge", which literally means: Each desire once fulfilled will soon have offspring.
That's for sure true for Stratigraphic Studio as well. This is work in progress, and we simply could not wait any longer to share this first version with you. 
Now you might want phasing, adding relations, jumping to the loci, etc.

Let us know! 

### 🌷 All Field Projects: Release notes for Kiosk 1.5.29 🌷
✏️ As always: The release notes are best viewed on GitHub https://github.com/arch-kiosk/arch-kiosk-office/issues/1434

📣 **Full Text Search** allows you to search your entire data in a search-engine kind of way IN KIOSK:  

- 🌷 Query And View has a new query "Full Text Search". It allows you to search your entire archaeological record.
- 🌷 Instead of just searching for a single word you can search for phrases and even for records that don't contain a certain word.
- 🌷 Search results are presented with excerpts of the match, and they are sorted by relevance.
- 🌷 You can jump from a search result straight to the View that shows the record in Kiosk.
- 🔧 A more technical point: Kiosk now uses the latest PostgreSQL Version 16. That's the database engine that powers Kiosk. Please tell us if you encounter any oddities in your data.
#### 📅 Kiosk will be on the **ARCE conference in Pittsburgh**
- 💐 Meet us at the Kiosk booth in the Exhibitor's Hall.  

### 🍸 All Field Projects: Release notes for Kiosk 1.6 and the recording app 15.20 🍸
✏️ As always: The release notes are best viewed on GitHub https://github.com/arch-kiosk/arch-kiosk-office/issues/1434

The highlights of this year's summer release:
- 🍸 Charts in Query and View: Look at the pie and bar charts in query "What materials were found in ... " to explore Q&Vs new chart feature. Export chars in situ. 
- 🍸 You can have mutliple charts per query, depending on what you want to focus on. 
- 📈 That just the beginning: What charts and queries would you want for your project? 
- 🍸 Excel and CSV export in Query and View: Look at the query "What materials were found in ... " to explore Q&Vs new graph feature. 
- 🍸 Query and View improved navigation: Quick scroll up to the results or view header, navigation from full text search match to the match in the view   
- 🍸 Stratigraphy Studio: Now better in finding and erasing erroneous records in the recording data
- 🍸 Maintenance: Even when in the field you can now easily install new queries, reports and even whole new Kiosk versions.
- ✏️ recording app: sortable headers for collected material lists everywhere
- ✏️ smaller sequence qr codes for object photography and easier focus 

🍸 And there is so much more: About 200 little and not so little improvements and bug fixes throughout the system.

### ⌚🕰️⏰ Release Notes for Kiosk 1.6.16 and the Recording App 16.8 ⏰🕰️⌚

✏️ As always: The release notes are best viewed on GitHub https://github.com/arch-kiosk/arch-kiosk-office/issues/1434

The big improvement this Kiosk version brings doesn't really look like much, 
but it is actually a big deal, and it was quite hard to get it right: 

📣 Kiosk is now time zone safe. 📣

Now you can have your team members spread across the globe, each of them working 
in different time zones, and you don't need to worry about synchronization.   

And there is a bit more in this release:

- ⌚ mark images in the file repository and assign them to an archaeological context all at once
- ⌚ query and view (especially the View part) got a few usability improvements
- ⌚ there's a query that shows the todo points for your project
- ⌚ manage todos with the recording app (#2414)
- ⌚ completely new "archive & storage" layout in the recording app lets you manage your archive.
- ⌚ new user interface to manage team members (#2920)
- ⌚ create new context while recording stratigraphy (#2908)
- ⌚ move collected material to a different locus (#2976)
- ⌚ improved context selector in context relations (#2961)
- 🕊️ unlock your recording app to gain full control over it in FileMaker. (#3003)
- 🛠️ many improvements under the hood that simplify future maintenance (e.g. #2966) 
- 🛠️ many improvements under the hood that secure Kiosk operations (e.g. #2846, #3024) 
- 🐞a handful of misc bugfixes

🎥 We have already published a video tutorial that describes many of the new features from 2024:

https://sites.brown.edu/kiosk/videos/

But since this release here introduces even newer features, more tutorials are about to come. Promised. 


---
### 🥽 👓 🔍  Released for all field projects: Kiosk 1.6.18 - New Image Viewer  🥽 👓 🔍
✏️ As always: The release notes are best viewed on GitHub: https://github.com/arch-kiosk/arch-kiosk-office/issues/1434#issuecomment-2619828150
We can't wait for the next major release to let you know about this new feature because we think it is really cool and helpful: 

📣 Kiosk has a new image viewer and it can deep zoom 📣

- no need anymore to download an image to look at its details. You can 
- zoom in and out of details, pan and 
- rotate in situ
- the viewer is showing your images full screen (well, full browser rather)
- Use your mouse scroll wheel or your fingers. Both touch gestures and mouse operations are supported
- you can flip through images and their meta data in the file repository without having to close the viewer
- there is a menu button down at the lower edge of the browser: click it to slide in the meta data, where you can download and upload images, change contexts and the description and do everything you are used to do from the old image viewer
- query & view supports the new image viewer as well

🚧 one caveat: The new viewer cannot show vectors, yet. If you have an SVG file, you can only see it in detail if you download it.

---

### 📣 Release Notes for Kiosk 1.7.22 📣
✏️ As always: The release notes are best viewed on GitHub https://github.com/arch-kiosk/arch-kiosk-office/issues/1434

It has been a while since the last major rollout and more than 200 small and medium-sized improvements have accumulated
not last due to feedback and requests from this year's field seasons. As of today all Kiosk field projects will receive
the benefits of our collaboration with now 18 archaeological projects.
And these are the noteworthy improvements in Kiosk and the Recording App:

#### **📍 Director's View**
- Buttons to jump between days on which anything actually happened (referred to as "work days").
- Work days are now marked with a circle.
- Selector to limit the visible widgets to your needs.
- All the benefits of the new file viewer when clicking on an image in DV.
- New widget that shows if something has been deleted on a day.
- New widget for archival records.
- Improved time zone support (previously inconsistent, see #3309).
- Site notes now appear in the narrative and file widget if a site note or site note file is changed or added.

#### **📍 Query and View**
- A filter field helps navigate the growing list of queries: type to reduce the list.
- Sort image galleries by date and time when the photo was shot (currently limited to unit/trench/area/OP photos).
- Collected material list in units shows the number of files and images attached to any collected material.
- Query results have an improved grid: column widths match their contents and are adjustable via mouse.
- Query to-do list: improved (no longer requires selecting a team member).
- Clicking on an image opens the new file viewer introduced in the file repository.
- Step through images in an open gallery using the new file viewer.
- Supports archival records.
- **New Queries:**
  - OPs by time range.
  - List collected materials by type.
  - List archaeological entities recorded by a specific team member.
  - List archaeological entities recorded within a time span.

#### **📍 New File and Image Viewer**
- Download file size is displayed in the download menu.
- "Best" resolution automatically selects the most detailed available resolution in the viewer.
- Open PDF files directly in a new browser tab.
- Improved SVG support (though not yet perfect).

#### **📍 File Repository**
- The tag filter now allows filtering out files with specific tags by adding a `-` (EN dash) to the tag name. ([see #3178](https://github.com/arch-kiosk/arch-kiosk-office/issues/3178#issuecomment-2839659164))
- File repository archives: move images out of the regular repository into an "archive" (useful for private photos or non-recording data).
- "Limit to site" option in the menu restricts file repository operations to a specific site.
- Pagination supports projects with thousands of images.
- The download menu allows downloading various file sizes and opening files in a new browser tab.
- New sort option: "Recently modified first."
- File import now supports time zones.
- Supports archival records.

#### **📍 Recording App**
- New locus type: "locus_type_structure" for inputting architecture (alternative to "locus_type_ac").
- List of units displayed per archival entity row.
- Fixed bugs related to decimal values and international formatting differences.

#### **📍 Administration**
- "Users," "privileges," and other configuration options are now under "Settings" to reduce menu clutter.

#### **📍 Landing Page**
Kiosk can now display a custom landing page after login (instead of the hub or file repository).
The landing page supports large images, plans, text, and links to jump directly into the file repository or specific units in "Query and View."
