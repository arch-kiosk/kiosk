
truncate table site;
truncate table unit;
truncate table locus;
truncate table collected_material;
truncate table locus_photo;

INSERT INTO public.unit (id, name, purpose, id_excavator, unit_creation_date, id_site, excavator_full_name,
                         spider_counter, uid, created, modified, modified_by, repl_deleted, repl_tag, coordinates,
                         legacy_unit_id, type, method, arch_context)
VALUES (0, null, 'We started excavating a unit in the barracks Block III to the east of the middle street bordered to the south by one of the blocked off transversing street (that I think was originally another three-room house and later alternated) and to the north by the originally laid out transversing street separating the barraks'' block from the granary to the north. This unit was opened up to clear and document one of the three-room houses in the barracks of the fortress. The unit is defined by the original walls of the house. At the same time a trench was laid out in the dumps on the western side of the west wall where Wheeler likely dumped the material that was coming out of the excavation of the three-room house. The trench in the dump covers part of the western wall and is aligned with the walls of the house. It is a 4x4m trench.

Additional work in 2019 has addressed the stratified section in the north of the unit.', 'MM', '2015-12-26', 'Fortress',
        null, 6, 'c29caa7a-1ee7-f645-9fa4-a7dca04df019', '2015-12-26 21:45:26.000000', '2019-01-19 06:47:08.000000',
        'ldb', false, null, null, null, 'excavation', 'excavation', 'FA');
INSERT INTO public.unit (id, name, purpose, id_excavator, unit_creation_date, id_site, excavator_full_name,
                         spider_counter, uid, created, modified, modified_by, repl_deleted, repl_tag, coordinates,
                         legacy_unit_id, type, method, arch_context)
VALUES (0, null,
        '3.5 x 3.5m in outer fort on northernmost circular feature that Wheeler identified as a pottery oven', 'CMK',
        '2019-01-05', 'Outer Fort', null, 1, '898215bf-de49-4abb-b285-fdda63f5e0f2', '2019-01-05 08:26:22.000000',
        '2019-01-17 08:07:33.000000', 'cmk', false, null, null, null, 'excavation', 'excavation' ,'FH');

INSERT INTO public.site (id, purpose, id_short, uid, created, modified, modified_by, repl_deleted, repl_tag,
                         uid_site_map)
VALUES ('Fortress', null, 'FRT', '2f636baf-f8a8-f34a-a5c4-b1568a7a92cf', '2015-12-21 08:16:51.000000',
        '2019-01-20 10:53:35.000000', 'ldb', false, null, '54a88243-ee06-46f3-90a1-8b7a648f99b8');

INSERT INTO public.locus (uid_unit, id, type, description, date_defined,
                          interpretation, uid, created, modified, modified_by, repl_deleted, repl_tag, colour,
                          date_closed)
VALUES ('898215bf-de49-4abb-b285-fdda63f5e0f2', 1, 'dp',
        'This locus is a sandy loose fill over the entire surface of the unit. The lower it goes the stoniest it becomes. The Stoney material was remained as lot 2.',
        '2019-01-05', 'This is a surface layer of modern date.', '5a67ba24-a385-43e5-a12d-78c1f7dadb6d',
        '2019-01-05 11:13:15.000000', '2019-01-12 08:07:01.000000', 'Christian’s iPad', false, null, 'Gray',
        null);
INSERT INTO public.locus (uid_unit, id, type, description, date_defined,
                          interpretation, uid, created, modified, modified_by, repl_deleted, repl_tag, colour,
                          date_closed)
VALUES ('898215bf-de49-4abb-b285-fdda63f5e0f2', 2, 'ac', 'Exposed architecture consisting of a curved line of mubdrick. The mud brick has been exposed to heat. We have decided to extend the definition of this locus t include a key hole shaped single structure with entry to the south east. The maximum external diameter is 194cm, the maximum internal diameter is approximately 160cm. The maximum preserved height at the rear - north - is 143cm - 13 courses. At the doorway the preservation is only 70cm, around 5 courses. Courses 12 and 13 are stepped back 4cm - as though the kiln is widening at the top slightly
There are 4 struts or protrusions evenly spaced around the circumference. From the western doorway jamb in a clockwise direction theses are struts 1-4. The struts start with second course of bricks from the bottom of the kiln and gradually move outwards to their maximum extent in course 6, although these upper bricks are no longer in place. The width of each strut is one stretcher. The construction of the struts is nearly always the same as far as this can be determined. In strut 1They start with two headers in course 2 that protrude around 3-4cm from the wall. Course 3 is also 2 headers protruding now 8-10cm. Course 4 is a stretcher laying flat. On top of this there is a 2.5cm layer of mortar. Course 4 starts with 2 headers. Course 5 is in distinct but appears to be slightly angled stretcher. On top of this there is a thick layer of mortar and then 2 more headers, course 6. Above this ther is plaster protrusion indicating a Latisha urfaceThe wall above the struts is not fired like the remainder of the wall. Struts 1 and 3 do not line up with each other, but struts 2 and 4 do pretty well.
Distance from strut 1-2 is 68cm, strut 2-3 is 78cm, strut 3-4 is 80cm
Evenly spaced between the struts at course 7are three more protrusions from the wall. These are in the form of stretchers lain at an angle in order to jut circa 4cm out at the top. In upper strut 2 it is clear that stones were used to prop the brick up forward. On upper struts 1 and 3 there are stones on the upper surface. The kiln wall above these struts does not seem to be burnt - perhaps they were the base of a larger structure? Or just diverted the heat? Presumably there was a fourth strut above the entrance, now lost.
door width- 60cm
The kiln was built on sloping ground, so the brick courses slope down towards the entrance. At the east the low3st course is on debris with pot sherds in it. These are locus 20.
Brick size varies up to 18 width - there are some thicker ones near the top where the kiln steps back - in order to maintain the inner line.',
        '2019-01-05', 'Northern section of a rounded oven.', '14351cf1-6603-44af-b089-21768479139c',
        '2019-01-05 11:25:41.000000', '2019-01-17 08:41:55.000000', 'cmk', false, null, 'Red and brown in parts',
        '2019-01-17');
INSERT INTO public.locus (uid_unit, id, type,  description, date_defined,
                          interpretation, uid, created, modified, modified_by, repl_deleted, repl_tag,  colour,
                          date_closed)
VALUES ('898215bf-de49-4abb-b285-fdda63f5e0f2', 3, 'dp',
        'A ring of white loose stones and pottery sherds closely abutting locus 2 around the whole edge of that locus. The pottery includes MK bread moulds and beer jars. There is some charcoal, ash as well as animal poop.',
        '2019-01-06',
        'This may be a slightly more artifact rich part of Locus 1 but we are being more careful with it. There are occasional lenses of ash and larger broken pieces of pottery; however, it was s very loose and messy - there are no internal layers. We are inclined to interpret this as modern slippage of surface debris down on to the levels reached by Wheeler, but we cannot be sure. Some of the pottery is burnt and there are some very low fires sherd material. It is clear that it is not original surface, but it may also be kiln debris allowed to build up around kiln given the high density of burnt and unburnt ceramics. ',
        '388eb9eb-a685-473f-abdc-4818da0534d8', '2019-01-06 07:24:01.000000', '2019-01-12 17:45:44.000000',
        'Urap’s iPad', false, null, null, null);
INSERT INTO public.locus (uid_unit, id, type, description, date_defined,
                          interpretation, uid, created, modified, modified_by, repl_deleted, repl_tag,  colour,
                          date_closed)
VALUES ('898215bf-de49-4abb-b285-fdda63f5e0f2', 4, 'dp',
        'Area of loose sandy material inside the structure labeled locus 2', '2019-01-06', null,
        '3ae3deee-a97f-463a-8524-8b137e8ab689', '2019-01-06 07:29:48.000000', '2019-01-06 07:42:56.000000',
        'Urap’s iPad (2)', false, null,  'Yellow gray', null);

INSERT INTO public.locus (uid_unit, id, type,  description, date_defined,
                          interpretation, uid, created, modified, modified_by, repl_deleted, repl_tag,  colour,
                          date_closed)
VALUES ('898215bf-de49-4abb-b285-fdda63f5e0f2', 5, 'dp', 'Area of amorphous burnt and unburnt mud on northeastern side of locus 2; there are pottery sherds lying directly on the upper surface as well as charcoal

9-1-2019: yesterday we took out the last of this layer that was a few bricks on an angle sloping towards the east',
        '2019-01-06', 'Area of collapse on northeastern side of kiln. We think it is collapse because it has burnt sections mixed with unburnt sections in no discernible pattern, it is not as compact as the surviving brickwork that is in situation and seems to begin_savepoint where the definable brick structure of the kiln ends.

9-1-2019: Christian thinks this might in fact be part of the doorway that collapsed ',
        'fdfb1ba6-c55a-4cb6-88eb-ee3b8bfedf45', '2019-01-06 11:54:00.000000', '2019-01-09 08:00:57.000000',
        'Urap’s iPad (2)', false, null, null, null);
INSERT INTO public.locus (uid_unit, id, type, description, date_defined,
                          interpretation, uid, created, modified, modified_by, repl_deleted, repl_tag,  colour,
                          date_closed)
VALUES ('898215bf-de49-4abb-b285-fdda63f5e0f2', 6, 'ac',
        'Area of mudbricks or mud directly on the top is surface that appears to be the ancient floor level. ',
        '2019-01-07', null, 'ccf98a30-4248-41d6-a9ec-8373252cd511', '2019-01-06 12:35:21.000000',
        '2019-01-07 07:25:32.000000', 'Urap’s iPad', false, null, null, null);

INSERT INTO public.locus (uid_unit, id, type, description, date_defined,
                          interpretation, uid, created, modified, modified_by, repl_deleted, repl_tag,  colour,
                          date_closed)
VALUES ('898215bf-de49-4abb-b285-fdda63f5e0f2', 7, 'dp',
        'Clean, loose sand enclosed by locus 2. This continues into what we think will be the entranceway to the south. At the junction to the chamber from the entranceway there is a slightly higher concentration of pottery and rock at a low level, presumably near the ancient floor level. We will take this off as a new locus.',
        '2019-01-07', 'Modern post wheeler wind blown sand', '0fd0424d-bebb-4998-a354-e15bcb70342a',
        '2019-01-07 07:25:36.000000', '2019-01-07 08:51:40.000000', 'Urap’s iPad', false, null,  null, null);

INSERT INTO public.locus (uid_unit, id, type,  description, date_defined,
                          interpretation, uid, created, modified, modified_by, repl_deleted, repl_tag,  colour,
                          date_closed)
VALUES ('898215bf-de49-4abb-b285-fdda63f5e0f2', 8, 'dp',
        'Loose, gray, ashy layer beneath locus 7. I am not sure whether this extends over entire area defined by kiln. It does. There are some areas of broken surface',
        '2019-01-07', 'This is the floor level of the kiln', '0cfcfeee-abcc-4ae3-bb45-36d5bc5299da',
        '2019-01-07 08:22:24.000000', '2019-01-07 09:31:48.000000', 'Urap’s iPad', false, null, 'Gray', null);
INSERT INTO public.locus (uid_unit, id, type,  description, date_defined,
                          interpretation, uid, created, modified, modified_by, repl_deleted, repl_tag,  colour,
                          date_closed)
VALUES ('898215bf-de49-4abb-b285-fdda63f5e0f2', 9, 'dp',
        'Area of dense concentration of pottery, stone and brick at junction of entrance to locus 2', '2019-01-07',
        null, 'e9695bba-75eb-4006-a0d9-83cac4737ad1', '2019-01-07 08:52:36.000000', '2019-01-07 09:29:52.000000',
        'Urap’s iPad', false, null, null, null);

INSERT INTO public.locus (uid_unit, id, type,  description, date_defined,
                          interpretation, uid, created, modified, modified_by, repl_deleted, repl_tag,  colour,
                          date_closed)
VALUES ('c29caa7a-1ee7-f645-9fa4-a7dca04df019', 1, 'dp',
        'Starting the excavation in the southern part of the three-room apartment, bordered by the secondary wall to the north running diagonally through the southern elongated room and the southern part of the vestibule. Lot 1 was assigned for the southern part of the vestibule and lot 2 for the southern part of the elongated room.',
        '2015-12-28', 'Secondary fill after Wheeler had cleared the room to the floor.',
        'aa6df2e8-efe3-41b4-b199-0b99fa53e697', '2015-12-28 11:44:27.000000', '2015-12-30 17:05:36.000000', 'sys',
        false, null,  null, null);
INSERT INTO public.locus (uid_unit, id, type, description, date_defined,
                          interpretation, uid, created, modified, modified_by, repl_deleted, repl_tag,  colour,
                          date_closed)
VALUES ('c29caa7a-1ee7-f645-9fa4-a7dca04df019', 2, 'ac', 'Original south wall of the house', '2015-12-29',
        null, '3b3a49d1-2fdc-40ab-ab5d-32093f9d8d31', '2015-12-29 08:18:25.000000', '2016-01-10 14:33:49.000000', 'sys',
        false, null,  null, null);
INSERT INTO public.locus (uid_unit, id, type,  description, date_defined,
                          interpretation, uid, created, modified, modified_by, repl_deleted, repl_tag,  colour,
                          date_closed, arch_context)
VALUES ('c29caa7a-1ee7-f645-9fa4-a7dca04df019', 3, 'ac',
        'Secondary wall running diagonally EW and bisecting the southern part of the original house.', '2015-12-29',
        null, 'ec6fdfbc-dd62-4cbe-89a7-3fccfdb3182c', '2015-12-29 08:22:28.000000', '2016-01-02 09:15:58.000000', 'sys',
        false, null,  null, null, 'FA-003');
INSERT INTO public.locus (uid_unit, id, type,  description, date_defined,
                          interpretation, uid, created, modified, modified_by, repl_deleted, repl_tag,  colour,
                          date_closed)
VALUES ('c29caa7a-1ee7-f645-9fa4-a7dca04df019', 4, 'ac',
        'Secondary NS running wall cutting off a corridor of ca.40cm to the original E wall of the house.',
        '2015-12-29', null, 'c5b8b7d0-c715-4c22-b0e4-00a58a882a0d', '2015-12-29 08:46:35.000000',
        '2015-12-31 08:01:21.000000', 'sys', false, null,  null, null);
INSERT INTO public.locus (uid_unit, id, type,  description, date_defined,
                          interpretation, uid, created, modified, modified_by, repl_deleted, repl_tag,  colour,
                          date_closed)
VALUES ('c29caa7a-1ee7-f645-9fa4-a7dca04df019', 5, 'ac',
        'S part of original W wall bisected by the EW running secondary wall.', '2015-12-29', null,
        '367caf33-a044-4e62-a85a-0cd25482ded3', '2015-12-29 09:35:36.000000', '2015-12-31 07:45:38.000000', 'sys',
        false, null,  null, null);
INSERT INTO public.locus (uid_unit, id, type,  description, date_defined,
                          interpretation, uid, created, modified, modified_by, repl_deleted, repl_tag,  colour,
                          date_closed)
VALUES ('c29caa7a-1ee7-f645-9fa4-a7dca04df019', 6, 'ac',
        'N part of the original W wall bisected by the EW running secondary wall.', '2015-12-29', null,
        '1b63c66a-7e3b-4d5e-94a9-b3724bf60fec', '2015-12-29 09:49:02.000000', '2016-01-03 08:08:27.000000', 'sys',
        false, null,  null, null);
INSERT INTO public.locus (uid_unit, id, type,  description, date_defined,
                          interpretation, uid, created, modified, modified_by, repl_deleted, repl_tag,  colour,
                          date_closed)
VALUES ('c29caa7a-1ee7-f645-9fa4-a7dca04df019', 7, 'ac',
        'Mud Floor in the E part of the southern room. Separated from the gebel surface in the W part of the room (locus 8).',
        '2015-12-29', null, '1ab0d863-21f8-4a3e-bd3b-1f61fa2a910a', '2015-12-29 10:16:47.000000',
        '2015-12-31 07:43:23.000000', 'sys', false, null, null, null);
INSERT INTO public.locus (uid_unit, id, type,  description, date_defined,
                          interpretation, uid, created, modified, modified_by, repl_deleted, repl_tag,  colour,
                          date_closed)
VALUES ('c29caa7a-1ee7-f645-9fa4-a7dca04df019', 8, 'ot',
        'Gebel/bedrock continuing in all the rooms in the W part. It looks like the former vestibule wall (locus 31?) was built along that line.',
        '2015-12-29', null, 'd4de82da-b672-47f8-854f-14b031b15cce', '2015-12-29 10:21:00.000000',
        '2016-01-07 12:34:35.000000', 'sys', false, null, null, null);
INSERT INTO public.locus (uid_unit, id, type,  description, date_defined,
                          interpretation, uid, created, modified, modified_by, repl_deleted, repl_tag,  colour,
                          date_closed)
VALUES ('c29caa7a-1ee7-f645-9fa4-a7dca04df019', 9, 'dp',
        'Going down in the next room adjacent to the north of the secondary EW wall.', '2015-12-29', null,
        '7f217b6c-0149-402c-b6e6-276d5446fb6e', '2015-12-29 10:56:06.000000', '2016-01-02 12:17:24.000000', 'sys',
        false, null,  null, null);

INSERT INTO public.locus_photo (uid_locus, description, uid_image, uid, created, modified, modified_by, repl_deleted,
                                repl_tag)
VALUES ('7f217b6c-0149-402c-b6e6-276d5446fb6e', 'CC-60 before sample taken', '31c70ca0-6cb9-4907-8c22-c158485ed23b',
        '4f8db4d5-443d-4c85-a1ae-7559e261fc6d', '2019-01-06 10:36:36.000000', '2019-01-06 10:37:13.000000',
        'Lr’s iPad', false, null);

INSERT INTO public.collected_material (uid_locus, id, uid_lot, type, description, isobject, date, storage,
                                       pottery_remarks, status_done, dearregistrar, uid, created, modified, modified_by,
                                       repl_deleted, repl_tag, external_id, weight, quantity, period, status_todo,
                                       arch_context)
VALUES ('ec6fdfbc-dd62-4cbe-89a7-3fccfdb3182c', 1, '659df775-9cd8-40da-adb0-1c4216884121', 'animal bone', 'delete',
        null, '2015-12-29 09:29:19.000000', null, null, 'R', null, 'bd69e0f0-685d-4d88-b8c3-816c6050157e',
        '2015-12-29 09:29:17.000000', '2016-01-05 20:49:30.000000', 'LK', false, null, null, null, null, null, null,
        'FA-003-1');
INSERT INTO public.collected_material (uid_locus, id, uid_lot, type, description, isobject, date, storage,
                                       pottery_remarks, status_done, dearregistrar, uid, created, modified, modified_by,
                                       repl_deleted, repl_tag, external_id, weight, quantity, period, status_todo,
                                       arch_context)
VALUES ('ec6fdfbc-dd62-4cbe-89a7-3fccfdb3182c', 2, '659df775-9cd8-40da-adb0-1c4216884121', 'ceramic', null, null,
        '2015-12-29 09:39:24.000000', null, null, 'R', null, '47009b5b-eb4f-481e-903d-9ad6602d410d',
        '2015-12-29 09:39:22.000000', '2016-01-05 20:49:30.000000', 'LK', false, null, null, null, null, null, null,
        'FA-003-2');
INSERT INTO public.collected_material (uid_locus, id, uid_lot, type, description, isobject, date, storage,
                                       pottery_remarks, status_done, dearregistrar, uid, created, modified, modified_by,
                                       repl_deleted, repl_tag, external_id, weight, quantity, period, status_todo,
                                       arch_context)
VALUES ('ec6fdfbc-dd62-4cbe-89a7-3fccfdb3182c', 3, '40f56ae9-72b6-42c6-b834-35bc09b426dc', 'ceramic', null, null,
        '2016-01-02 08:59:38.000000', null, null, 'R', null, 'a0dac6bc-55bb-4b22-830b-540e6f807ece',
        '2016-01-02 08:59:34.000000', '2016-01-05 20:49:30.000000', 'LK', false, null, null, null, null, null, null,
        'FA-003-3');
INSERT INTO public.collected_material (uid_locus, id, uid_lot, type, description, isobject, date, storage,
                                       pottery_remarks, status_done, dearregistrar, uid, created, modified, modified_by,
                                       repl_deleted, repl_tag, external_id, weight, quantity, period, status_todo,
                                       arch_context)
VALUES ('ec6fdfbc-dd62-4cbe-89a7-3fccfdb3182c', 4, '40f56ae9-72b6-42c6-b834-35bc09b426dc', 'sample', 'Charcoal', null,
        '2016-01-02 09:16:01.000000', null, null, 'R', null, '079523f3-f81d-4836-8f89-8437a869b273',
        '2016-01-02 09:15:58.000000', '2016-01-05 20:49:30.000000', 'LK', false, null, null, null, null, null, null,
        'FA-003-4');

INSERT INTO public.collected_material (uid_locus, id, uid_lot, type, description, isobject, date, storage,
                                       pottery_remarks, status_done, dearregistrar, uid, created, modified, modified_by,
                                       repl_deleted, repl_tag, external_id, weight, quantity, period, status_todo,
                                       arch_context)
VALUES ('3b3a49d1-2fdc-40ab-ab5d-32093f9d8d31', 1, 'eada18f7-b15e-4a46-bc3a-535b92049e25', 'ceramic', null, 0,
        '2015-12-29 09:21:26.000000', null, null, 'R', null, '4a725892-2283-4cdf-b0bd-36249e34b4db',
        '2015-12-29 09:21:23.000000', '2016-01-10 14:33:45.000000', 'lkh''s iPad', false, null, null, null, null, null,
        null, 'FA-002-1');
INSERT INTO public.collected_material (uid_locus, id, uid_lot, type, description, isobject, date, storage,
                                       pottery_remarks, status_done, dearregistrar, uid, created, modified, modified_by,
                                       repl_deleted, repl_tag, external_id, weight, quantity, period, status_todo,
                                       arch_context)
VALUES ('3b3a49d1-2fdc-40ab-ab5d-32093f9d8d31', 2, 'eada18f7-b15e-4a46-bc3a-535b92049e25', 'animal bone', null, null,
        '2015-12-29 09:27:36.000000', null, null, 'R', null, '0f3c5497-76f4-45e4-868f-f51c6fb09ae0',
        '2015-12-29 09:27:33.000000', '2016-01-05 20:49:30.000000', 'LK', false, null, null, null, null, null, null,
        'FA-002-2');
INSERT INTO public.collected_material (uid_locus, id, uid_lot, type, description, isobject, date, storage,
                                       pottery_remarks, status_done, dearregistrar, uid, created, modified, modified_by,
                                       repl_deleted, repl_tag, external_id, weight, quantity, period, status_todo,
                                       arch_context)
VALUES ('3b3a49d1-2fdc-40ab-ab5d-32093f9d8d31', 3, 'eada18f7-b15e-4a46-bc3a-535b92049e25', 'ceramic', null, 1,
        '2016-01-10 14:33:52.000000', null, null, 'R', null, 'd4fdcf5d-62fe-40a9-adf7-cac73d345cc2',
        '2016-01-10 14:33:49.000000', '2016-01-10 15:28:15.000000', 'LK', false, null, null, null, null, null, null,
        'FA-002-3');

INSERT INTO public.collected_material (uid_locus, id, uid_lot, type, description, isobject, date, storage,
                                       pottery_remarks, status_done, dearregistrar, uid, created, modified, modified_by,
                                       repl_deleted, repl_tag, external_id, weight, quantity, period, status_todo,
                                       arch_context)
VALUES ('3ae3deee-a97f-463a-8524-8b137e8ab689', 1, null, 'ceramic', null, null, '2019-01-06 07:33:14.000000', 'Dumped',
        'Ver badly preserved assemblage of 160 odd small sherds. Looks like locus 3 only preserved in smaller pieces.',
        'HC', null, '5ea76874-99c7-468b-86f3-59a43c3a5ddb', '2019-01-06 07:33:10.000000', '2019-01-14 18:06:27.000000',
        'Urap’s iPad', false, null, null, null, null, null, 'HC', 'FA-004-1');
INSERT INTO public.collected_material (uid_locus, id, uid_lot, type, description, isobject, date, storage,
                                       pottery_remarks, status_done, dearregistrar, uid, created, modified, modified_by,
                                       repl_deleted, repl_tag, external_id, weight, quantity, period, status_todo,
                                       arch_context)
VALUES ('3ae3deee-a97f-463a-8524-8b137e8ab689', 2, null, 'animal bone', 'Vertebrae ', null,
        '2019-01-06 07:43:09.000000', null, null, 'H', null, 'a734fa8a-abda-4714-83f1-126de3279253',
        '2019-01-06 07:42:56.000000', '2019-01-12 17:06:31.000000', 'Urap’s iPad', false, null, null, null, null, null,
        'H', 'FA-004-2');

INSERT INTO public.dayplan (image_description, uid_image, uid, created, modified, modified_by, repl_deleted,
                            repl_tag)
VALUES ('white striped ware', '9cab65cb-1368-4659-be5a-e2eaf132aa43', '6d2ed92c-2346-44c1-8ddf-fd2ee8a3235f',
        '2019-03-11 20:52:30.000000', '2019-03-11 20:52:30.000000', 'sys', false, null);
INSERT INTO public.dayplan (image_description, uid_image, uid, created, modified, modified_by, repl_deleted,
                            repl_tag)
VALUES ('white striped ware', '0d09f3c4-0f67-403d-80e0-bab677bbc0b7', 'a737c8a4-bfa4-49fa-a3be-b53afac38ab1',
        '2019-03-11 20:52:30.000000', '2019-03-11 20:52:30.000000', 'sys', false, null);
INSERT INTO public.dayplan (image_description, uid_image, uid, created, modified, modified_by, repl_deleted,
                            repl_tag)
VALUES ('white striped ware', 'e72c73dc-abf5-4168-b290-c8f2ff2aaf29', 'f75833f1-56ab-4843-9d41-4d494b2a9746',
        '2019-03-11 20:52:30.000000', '2019-03-11 20:52:30.000000', 'sys', false, null);
INSERT INTO public.dayplan (image_description, uid_image, uid, created, modified, modified_by, repl_deleted,
                            repl_tag)
VALUES ('white striped ware', '458f0838-305b-48ac-b68f-935fa0e4f09f', '9f6da715-015a-4c63-92cb-2305413030e3',
        '2019-03-11 20:52:30.000000', '2019-03-11 20:52:30.000000', 'sys', false, null);
INSERT INTO public.dayplan (image_description, uid_image, uid, created, modified, modified_by, repl_deleted,
                            repl_tag)
VALUES ('white striped ware', 'fa886c46-12e7-41f1-84eb-ed02929f4cd8', '5b652ee5-3b30-4c7e-9d1e-6def68afed8f',
        '2019-03-11 20:52:30.000000', '2019-03-11 20:52:30.000000', 'sys', false, null);
INSERT INTO public.dayplan (image_description, uid_image, uid, created, modified, modified_by, repl_deleted,
                            repl_tag)
VALUES ('white striped ware', '4e10c871-1a20-4b03-ba68-07ee857b8e2b', '5aa75571-9b9a-45c5-bc79-ca70945883cb',
        '2019-03-11 20:52:30.000000', '2019-03-11 20:52:30.000000', 'sys', false, null);
INSERT INTO public.dayplan (image_description, uid_image, uid, created, modified, modified_by, repl_deleted,
                            repl_tag)
VALUES ('white striped ware', '31c70ca0-6cb9-4907-8c22-c158485ed23b', 'a532fc2a-38f8-4d0a-a58f-83c93aebe584', '2019-03-11 20:52:30.000000',
        '2019-03-11 20:52:30.000000', 'sys', false, null);