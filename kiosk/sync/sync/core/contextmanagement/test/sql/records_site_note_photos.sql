-- INSERT INTO public.site (id, purpose, id_short, uid, created, modified, modified_by, repl_deleted, repl_tag,
--                          uid_site_map, arch_domain, arch_context)
-- VALUES ('Fortress', null, 'FRT', '2f636baf-f8a8-f34a-a5c4-b1568a7a92cf', '2015-12-21 08:16:51.000000',
--         '2019-01-20 10:53:35.000000', 'ldb', false, null, '54a88243-ee06-46f3-90a1-8b7a648f99b8', null, 'FRT');

INSERT INTO public.site_notes (uid_site, date, id_excavator, note, uid, created, modified, modified_by, repl_deleted,
                               repl_tag)
VALUES ('2f636baf-f8a8-f34a-a5c4-b1568a7a92cf', '2018-01-14 09:46:40.000000', 'LDB', 'Major new stratigraphic section observed! Also majorly eroding which is troublesome. Doorway between Dunham 43 and 45 has ar least 50cm accumulated strats of layered dirt with clear (but not necessarily intentional) surfaces. Charcoal and sherds observable. A big hole has been eroded through this. A doorway blocking wall of silty bricks is built on TOP of this section - I have no idea why Wheeler did not remove it but am grateful. Will photograph.

Seen from the west looking east this appears even to have multiple episodes of door blocking. At base (if what I can see is near the base) the strats cover an area 110cm wide (is that the normal width of a barracks door? Seems wide.) above that the door jamb on the south side was extended, narrowing the door to 83cm.

A few photos on the SLR and a few, including a sketch and location map, on the ipad. I need to be able to have images with the site notes.

(Later addition)
I now have images with site notes! In showing this to Felipe I noticed that the bottom part of this section looks like wash layers. I think abandonment. Then the doorway was narrowed. Accumulation of use layers. Then the doorway was bricked up, and damn I wish we had the stratigraphy related to the use of the post-bricking up phase. But I am quite tickled about what we do have, and the ability of the db to let me record it.

(Much later note, 6 I 2019) This now becomes Unit FI, defined so that Mrm can sample it.',
        'bd9deeaa-8a0f-4aad-8c06-69f706fd3632', '2018-01-14 09:46:26.000000', '2019-07-11 11:57:38.000000', 'lkh',
        false, null);

INSERT INTO public.site_note_photo (uid_site_note, uid_image, uid, created, modified, modified_by, repl_deleted, repl_tag) VALUES ('bd9deeaa-8a0f-4aad-8c06-69f706fd3632', 'af75093b-2777-4fc8-b08b-f341b382b488', 'fb9cb66e-4120-4215-bd32-ce5068b51c0a', '2018-01-25 18:57:19.000000', '2018-01-25 18:58:19.000000', 'Laurel''s iPad', false, null);
INSERT INTO public.site_note_photo (uid_site_note, uid_image, uid, created, modified, modified_by, repl_deleted, repl_tag) VALUES ('bd9deeaa-8a0f-4aad-8c06-69f706fd3632', 'ea7a8947-c926-467c-a3d5-af5f3e5522a9', '74d762cf-f93c-4e12-bf6d-2928fbc7d343', '2018-01-25 18:57:50.000000', '2018-01-25 18:58:19.000000', 'Laurel''s iPad', false, null);
INSERT INTO public.site_note_photo (uid_site_note, uid_image, uid, created, modified, modified_by, repl_deleted, repl_tag) VALUES ('bd9deeaa-8a0f-4aad-8c06-69f706fd3632', 'c7523541-7c9c-4eb3-9524-ac3b15d55f19', '19d9ec3e-94c1-43ff-8488-48f5da93e477', '2018-01-25 18:58:00.000000', '2018-01-25 18:58:19.000000', 'Laurel''s iPad', false, null);
INSERT INTO public.site_note_photo (uid_site_note, uid_image, uid, created, modified, modified_by, repl_deleted, repl_tag) VALUES ('bd9deeaa-8a0f-4aad-8c06-69f706fd3632', '5b2c0bff-5445-4ab8-b9df-a00ae4a2e2e5', '609d1f71-b1f0-437b-8422-fb464b99d73c', '2018-01-25 18:58:10.000000', '2018-01-25 19:07:39.000000', 'Laurel''s iPad', false, null);
INSERT INTO public.site_note_photo (uid_site_note, uid_image, uid, created, modified, modified_by, repl_deleted, repl_tag) VALUES ('bd9deeaa-8a0f-4aad-8c06-69f706fd3632', '98bf2058-bed2-4755-b29a-6cf7c1c19c25', 'af0f1223-5acb-4e78-bb70-1aec6b738c57', '2018-01-25 18:58:14.000000', '2018-01-25 18:58:38.000000', 'Laurel''s iPad', false, null);