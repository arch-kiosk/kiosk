### 🌸  Release Notes for Kiosk FileMaker Recording 14.6 (29 April 2023) 🌸
This and older release notes are on https://github.com/arch-kiosk/arch-kiosk-office/issues/1434

The following features are rolling out right now to online servers and field servers:

- 🌸 Coordinates from GIS/RTK can be transferred to the recording system #1986   
  You can manage control points in the new "Coordinates" UI in the specialists tab on the start page. This feature is meant to find you control points easily again on the ground. There is a corresponding "point repository" in Kiosk where you can also import points from a CSV or Excel file.
- 🌸 You can search for coordinates with the search function that is available on the start page and in burger menus elsewhere.
- 🌸 Reduced Configuration Mode (#1546)   
The configuration ui under admin/configuration shows a reduced set of configuration keys that have been marked most relevant for the field. A button in the Burger menu allows you to switch to the full set of configuration keys.
- 🌸 Search in Configuration (#2002)   
Configuration was notoriously hard to navigate. The new search mechanism now makes it easier to find the right configuration key. Just type in a value you want to change or a part of a key you remember or try whatever might be a hint to the right key.
- 🌸 Simple elevations interface: expand text box size. (#2042)    
Projects using descriptive elevations rather than the numeric elevations will find the layout improved.
- 🧯 New safety catch: If your local server is in an earlier time zone than an ipad the FileMaker database will refuse to start. Always make sure your local server and your ipads are all on the same time and in the same time zone. 
- 🌸 registration ui to track collected materials: The new checkbox popup is so improved that we don't need the registration codes as an input field anymore.   
- 🌸 collected material by unit/area: when coming back from a collected material the active row in the list is now moved into view (#1990)
- 🌸 locus/context ui: soil compaction type has a reasonable sorting order. 