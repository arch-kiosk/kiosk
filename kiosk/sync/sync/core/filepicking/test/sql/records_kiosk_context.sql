INSERT INTO public.site (id, purpose, id_short, uid, created, modified, modified_by, repl_deleted, repl_tag,
                         uid_site_map, arch_domain, arch_context)
VALUES ('Fortress', null, 'FRT', '2f636baf-f8a8-f34a-a5c4-b1568a7a92cf', '2015-12-21 08:16:51.000000',
        '2017-01-18 10:53:35.000000', 'ldb', false, null, '54a88243-ee06-46f3-90a1-8b7a648f99b8', null, 'FRT');


INSERT INTO unit (uid, id, arch_context, modified, modified_by, created, type, id_site)
VALUES ('c109e19c-c73c-cc49-9f58-4ba0a3ad1339', 0, 'FA',
        '2019-08-18 15:18:18.000000', 'ldb', '2018-12-31 22:24:24.000000', 'excavation', 'Fortress');

INSERT INTO public.dayplan (image_description, uid_image, uid, created, modified, modified_by, uid_unit)
VALUES ('Day plan 2 I 2019', '0f44aa68-64a8-4312-a46a-99f87ec4ac21', 'c1d8dee0-fad5-4a04-8cca-515368c90722',
        '2019-01-03 08:07:22.000000', '2019-01-03 08:07:58.000000', 'Urap’s iPad (2)',
        'c109e19c-c73c-cc49-9f58-4ba0a3ad1339');
INSERT INTO public.dayplan (image_description, uid_image, uid, created, modified, modified_by, uid_unit)
VALUES ('FA NW corner after removal of 021 lot 1', 'ca77c27f-bbca-434e-ba20-4f289a562173',
        '3d7a1bdc-31ee-4c61-bd6f-84a57c3c1b72', '2019-01-07 10:07:24.000000', '2019-01-07 10:13:54.000000',
        'Laurel’s iPad',
        'c109e19c-c73c-cc49-9f58-4ba0a3ad1339');
INSERT INTO public.dayplan (image_description, uid_image, uid, created, modified, modified_by, uid_unit)
VALUES ('FA NWcorner section cutting ', '27002a9f-b2df-46fc-9150-56397ebc8870',
        '3b3b99f7-1eea-46fc-8223-b699f6889f11', '2019-01-07 10:13:54.000000', '2019-01-07 10:15:51.000000',
        'Laurel’s iPad',
        'c109e19c-c73c-cc49-9f58-4ba0a3ad1339');

INSERT INTO locus (uid, id, uid_unit, arch_context, modified, modified_by, created)
VALUES ('c50df3cb-e68b-4ce7-b456-9ea3d636d933', 1, 'c109e19c-c73c-cc49-9f58-4ba0a3ad1339', 'FA-001',
        '2019-01-17 11:58:16.000000', 'anm', '2019-01-17 11:50:54.000000');
INSERT INTO locus (uid, id, uid_unit, arch_context, modified, modified_by, created)
VALUES ('a1fc642f-468b-45e1-a368-d9c452c5df7f', 2, 'c109e19c-c73c-cc49-9f58-4ba0a3ad1339', 'FA-002',
        '2019-01-15 11:55:08.000000', 'Laurel’s iPad', '2019-01-01 12:24:36.000000');
INSERT INTO locus (uid, id, uid_unit, arch_context, modified, modified_by, created)
VALUES ('adbef66e-f8fd-422d-b20b-c2d0f09309a5', 3, 'c109e19c-c73c-cc49-9f58-4ba0a3ad1339', 'FA-003',
        '2019-01-17 07:50:13.000000', 'anm', '2019-01-17 07:33:00.000000');

INSERT INTO locus_photo (uid_locus, description, uid_image, uid, created, modified)
VALUES ('c50df3cb-e68b-4ce7-b456-9ea3d636d933', null, 'dd26f0ec-bc94-554f-93df-2a3fe91dbc38',
        '21230024-bb70-4eab-bb95-c41344e5d93e', '2015-12-21 21:55:57.000000', '2017-09-07 13:17:39.000000');
INSERT INTO locus_photo (uid_locus, description, uid_image, uid, created, modified)
VALUES ('c50df3cb-e68b-4ce7-b456-9ea3d636d933', null, '14ca0f7b-6f65-8f48-b2c3-d64a4b2f9700',
        'ed363938-4164-42c1-a7bd-95225b1a9286', '2015-12-21 21:56:19.000000', '2017-09-07 13:17:39.000000');
INSERT INTO locus_photo (uid_locus, description, uid_image, uid, created, modified)
VALUES ('a1fc642f-468b-45e1-a368-d9c452c5df7f', null, 'dd26f0ec-bc94-554f-93df-2a3fe91dbc38',
        '21330024-bb70-4eab-bb95-c41344e5d93e', '2015-12-21 21:55:57.000000', '2017-09-07 13:17:39.000000');
INSERT INTO locus_photo (uid_locus, description, uid_image, uid, created, modified)
VALUES ('adbef66e-f8fd-422d-b20b-c2d0f09309a5', null, '14ca0f7b-6f65-8f48-b2c3-d64a4b2f9700',
        'ed463938-4164-42c1-a7bd-95225b1a9286', '2015-12-21 21:56:19.000000', '2017-09-07 13:17:39.000000');

INSERT INTO collected_material (uid, id, uid_locus, external_id, arch_context, modified, modified_by, created, isobject)
VALUES ('9495ce6f-da84-4e58-bf0b-f3b6775116f9', 4, 'c50df3cb-e68b-4ce7-b456-9ea3d636d933', null, 'FA-001-1',
        '2019-01-17 16:24:30.000000', 'aes', '2019-01-17 12:40:03.000000', 0);
INSERT INTO collected_material (uid, id, uid_locus, external_id, arch_context, modified, modified_by, created, isobject)
VALUES ('24cfb4f9-c23c-4e94-b083-56bf14cb5572', 3, 'c50df3cb-e68b-4ce7-b456-9ea3d636d933', null, 'FA-001-2',
        '2019-01-18 09:14:05.000000', 'aes', '2019-01-07 10:28:39.000000', 0);
INSERT INTO collected_material (uid, id, uid_locus, external_id, arch_context, modified, modified_by, created, isobject)
VALUES ('25531aa1-f7b3-4f67-9b08-ba3030889b5b', 3, 'adbef66e-f8fd-422d-b20b-c2d0f09309a5', null, 'FA-003-1',
        '2019-01-18 09:11:48.000000', 'aes', '2019-01-02 08:04:40.000000', 0);


INSERT INTO unit (uid, arch_context, modified, modified_by, created, id_site)
VALUES ('c108e19c-c73c-cc49-9f58-4ba0a3ad1339', 'CC',
        '2019-08-18 15:18:18.000000', 'ldb', '2018-12-31 22:24:24.000000', 'Fortress');

INSERT INTO public.dayplan (image_description, uid_image, uid, created, modified, modified_by, uid_unit)
VALUES ('digital test svg file', '71b1f2b3-0e93-bf4d-b9a8-989700159beb', 'd4a5d6a3-4371-4717-a391-2cadb6d69997',
        '2015-12-30 12:25:30.000000', '2017-09-07 16:44:35.000000', 'lkh',
        'c108e19c-c73c-cc49-9f58-4ba0a3ad1339');
INSERT INTO public.dayplan (image_description, uid_image, uid, created, modified, modified_by, uid_unit)
VALUES ('model 30-12', '2e4ff3be-86c2-704c-8dec-8695a571ac59', '539d3747-730b-495c-bd1e-9d0497957a78',
        '2015-12-30 16:43:03.000000', '2017-09-07 16:44:35.000000', 'lkh',
        'c108e19c-c73c-cc49-9f58-4ba0a3ad1339');

INSERT INTO locus (uid, id, uid_unit, arch_context, modified, modified_by, created, formation_process, type)
VALUES ('a1fc642f-568b-45e1-a368-d9c452c5df7f', 1, 'c108e19c-c73c-cc49-9f58-4ba0a3ad1339', 'CC-001',
        '2019-01-15 11:55:08.000000', 'Laurel’s iPad', '2019-01-01 12:24:36.000000', 'wind', 'deposit');
INSERT INTO locus (uid, id, uid_unit, arch_context, modified, modified_by, created, formation_process, type)
VALUES ('adbef66e-f6fd-422d-b20b-c2d0f09309a5', 2, 'c108e19c-c73c-cc49-9f58-4ba0a3ad1339', 'CC-002',
        '2019-01-17 07:50:13.000000', 'anm', '2019-01-17 07:33:00.000000', 'sun', 'architecture');
INSERT INTO locus (uid, id, uid_unit, arch_context, modified, modified_by, created, formation_process, type)
VALUES ('adbef66e-e6ee-422d-b20b-c2d0f09309a5', 3, 'c108e19c-c73c-cc49-9f58-4ba0a3ad1339', 'CC-003',
        '2020-11-17', 'anm', '2019-01-17 07:33:00.000000', 'sun', 'architecture');

INSERT INTO locus_photo (uid_locus, description, uid_image, uid, created, modified)
VALUES ('a1fc642f-568b-45e1-a368-d9c452c5df7f', null, 'dd26f0ec-bc94-554f-93df-2a3fe91dbc38',
        '21230024-b070-4eab-bb95-c41344e5d93e', '2015-12-21 21:55:57.000000', '2017-09-07 13:17:39.000000');
INSERT INTO locus_photo (uid_locus, description, uid_image, uid, created, modified)
VALUES ('a1fc642f-568b-45e1-a368-d9c452c5df7f', null, '14ca0f7b-6f65-8f48-b2c3-d64a4b2f9700',
        'ed363938-4264-42c1-a7bd-95225b1a9286', '2015-12-21 21:56:19.000000', '2017-09-07 13:17:39.000000');

INSERT INTO collected_material (uid, id, uid_locus, external_id, arch_context, modified, modified_by, created, isobject)
VALUES ('9495ce6f-da74-4e58-bf0b-f3b6775116f9', 1, 'a1fc642f-568b-45e1-a368-d9c452c5df7f', 'ext-1-1', 'CC-001-1',
        '2019-01-17 16:24:30.000000', 'aes', '2019-01-17 12:40:03.000000', 0);
INSERT INTO collected_material (uid, id, uid_locus, external_id, arch_context, modified, modified_by, created, isobject)
VALUES ('24cfb4f9-c21c-4e94-b083-56bf14cb5572', 1, 'adbef66e-f6fd-422d-b20b-c2d0f09309a5', 'ext-2-1', 'CC-002-1',
        '2019-01-18 09:14:05.000000', 'aes', '2019-01-07 10:28:39.000000', 0);
INSERT INTO collected_material (uid, id, uid_locus, external_id, arch_context, modified, modified_by, created, isobject)
VALUES ('25531aa1-f7b2-4f67-9b08-ba3030889b5b', 2, 'adbef66e-f6fd-422d-b20b-c2d0f09309a5', 'ext-2-2', 'CC-002-2',
        '2019-01-18 09:11:48.000000', 'aes', '2019-01-02 08:04:40.000000', 1);


INSERT INTO public.pottery (cm_uid, fabric, warecode, sherdcount, weight, pottery_number, type, diameter, prc_preserved,
                            notes, pottery_number_prefix, sortid_this, sortid_next, uid_prev, uid_next, uid_sketch, uid,
                            created, modified, modified_by, repl_deleted, repl_tag, sketch_description, vessel_type,
                            arch_domain, arch_context)
VALUES ('25531aa1-f7b2-4f67-9b08-ba3030889b5b', 'Nile B2', '21221', 1, 1, null, 'Bowl rim', null, null,
        'Direct rim of bowl to 1.5cm below rim. Not enough preserved to draw. Red slip seemingly covers the entirety of the Sherd.',
        'UP16-', 1.75, 1.875, '49249318-92a5-4bb4-8299-fadb19d5f4d0', '5df4597e-79a2-414d-ad5c-4aecf2312c9e',
        '54e828b3-a28a-1941-a385-f62fc6b430b7', '4da8a172-e38b-4761-a203-85dd456bd4d5', '2016-01-05 08:40:43.000000',
        '2017-10-28 01:00:14.000000', 'lkh', false, null,
        'Bowl rim - Direct rim of bowl to 1.5cm below rim. Not enough preserved to draw. Red slip seemingly covers the entirety of the Sherd. - Nile B2(21221)',
        null, null, null);
INSERT INTO public.pottery (cm_uid, fabric, warecode, sherdcount, weight, pottery_number, type, diameter, prc_preserved,
                            notes, pottery_number_prefix, sortid_this, sortid_next, uid_prev, uid_next, uid_sketch, uid,
                            created, modified, modified_by, repl_deleted, repl_tag, sketch_description, vessel_type,
                            arch_domain, arch_context)
VALUES ('25531aa1-f7b2-4f67-9b08-ba3030889b5b', 'Nile C', '21991', 20, 141, null, null, null, null, null, 'UP16-',
        1.99993896484375, 2, '57109b94-2941-41a3-b3d3-f6f485db1136', null, null, '78fcf878-341d-4989-b0db-8684c5a07788',
        '2016-01-06 02:16:45.000000', '2017-10-28 01:00:14.000000', 'lkh', false, null, null, null, null, null);

INSERT INTO public.pottery_images (uid_pottery, description, uid_image, uid, created, modified, modified_by,
                                   repl_deleted, repl_tag)
VALUES ('4da8a172-e38b-4761-a203-85dd456bd4d5', null, '54e828b3-a28a-1941-a385-f62fc6b430b7',
        'e9729980-ee11-4fa2-aad8-c358c371bc54', '2016-01-05 08:40:43.000000', '2017-10-28 01:00:14.000000', 'lkh',
        false, null);
INSERT INTO public.pottery_images (uid_pottery, description, uid_image, uid, created, modified, modified_by,
                                   repl_deleted, repl_tag)
VALUES ('4da8a172-e38b-4761-a203-85dd456bd4d5', null, '01d6a2e3-b510-dd4f-9f6a-e04a5f0032bb',
        '68500da3-e67f-4d24-9f21-ac7eeb43fcef', '2016-01-05 05:07:11.000000', '2017-10-28 01:00:14.000000', 'lkh',
        false, null);
INSERT INTO public.pottery_images (uid_pottery, description, uid_image, uid, created, modified, modified_by,
                                   repl_deleted, repl_tag)
VALUES ('78fcf878-341d-4989-b0db-8684c5a07788', null, 'd7374deb-39d8-a648-9dac-fa62cf033c69',
        '7e14f42c-a440-4bdf-91b8-74c3b4d6416b', '2016-01-05 08:47:06.000000', '2017-10-28 01:00:14.000000', 'lkh',
        false, null);