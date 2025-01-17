INSERT INTO public.site (id, purpose, id_short, uid, created, modified, modified_by, repl_deleted, repl_tag,
                         uid_site_map, arch_domain, arch_context)
VALUES ('Fortress', null, 'FRT', '2f636baf-f8a8-f34a-a5c4-b1568a7a92cf', '2015-12-21 08:16:51.000000',
        '2017-01-18 10:53:35.000000', 'ldb', false, null, '54a88243-ee06-46f3-90a1-8b7a648f99b8', null, 'FRT');


INSERT INTO unit (uid, arch_context, modified, modified_by, created, type, id_site)
VALUES ('c109e19c-c73c-cc49-9f58-4ba0a3ad1339', 'FA',
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


