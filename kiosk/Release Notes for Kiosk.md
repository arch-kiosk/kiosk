### 🌷  Release Notes for Kiosk Version 1.5 (22 May 2023) 🌷
This is an overview of the visible improvements since Version 1.2.9 (1. January 2023):
This and older release notes are on https://github.com/arch-kiosk/arch-kiosk-office/issues/1434

:octocat: We recommend viewing them on GitHub.


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
