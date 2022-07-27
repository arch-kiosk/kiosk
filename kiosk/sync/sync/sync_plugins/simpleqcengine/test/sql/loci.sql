truncate table unit;
truncate table locus;
truncate table dayplan;
truncate table collected_material;
truncate table locus_photo;


INSERT INTO unit (uid, id, arch_context, modified, modified_by, created)
VALUES ('c109e19c-c73c-cc49-9f58-4ba0a3ad1339', null, 'FA',
        '2019-08-18 15:18:18.000000', 'ldb', '2018-12-31 22:24:24.000000');

INSERT INTO public.dayplan (image_description, uid_image, uid, created, modified, modified_by, uid_unit)
VALUES ('Day plan 2 I 2019', '0f44aa68-64a8-4312-a46a-99f87ec4ac21', 'c1d8dee0-fad5-4a04-8cca-515368c90722',
        '2019-01-03 08:07:22.000000', '2019-01-03 08:07:58.000000', 'Urap’s iPad (2)',
        'c109e19c-c73c-cc49-9f58-4ba0a3ad1339');
INSERT INTO public.dayplan (image_description, uid_image, uid, created, modified, modified_by, uid_unit)
VALUES ('FA NW corner after removal of 021 lot 1', 'ca77c27f-bbca-434e-ba20-4f289a562173',
        '3d7a1bdc-31ee-4c61-bd6f-84a57c3c1b72', '2019-01-07 10:07:24.000000', '2019-01-07 10:13:54.000000',
        'Lrl’s iPad',
        'c109e19c-c73c-cc49-9f58-4ba0a3ad1339');
INSERT INTO public.dayplan (image_description, uid_image, uid, created, modified, modified_by, uid_unit)
VALUES ('FA NWcorner section cutting ', '27002a9f-b2df-46fc-9150-56397ebc8870', '3b3b99f7-1eea-46fc-8223-b699f6889f11',
        '2019-01-07 10:13:54.000000', '2019-01-07 10:15:51.000000', 'Lrl’s iPad',
        'c109e19c-c73c-cc49-9f58-4ba0a3ad1339');

INSERT INTO locus (uid, id, uid_unit, arch_context, type, modified, modified_by, created)
VALUES ('c50df3cb-e68b-4ce7-b456-9ea3d636d933', 1, 'c109e19c-c73c-cc49-9f58-4ba0a3ad1339', 'FA-001','ac',
        '2019-01-17 11:58:16.000000', 'anm', '2019-01-17 11:50:54.000000');
INSERT INTO locus (uid, id, uid_unit, arch_context, modified, modified_by, created)
VALUES ('a1fc642f-468b-45e1-a368-d9c452c5df7f', 2, 'c109e19c-c73c-cc49-9f58-4ba0a3ad1339', 'FA-002',
        '2019-01-15 11:55:08.000000', 'Lrl’s iPad', '2019-01-01 12:24:36.000000');
INSERT INTO locus (uid, id, uid_unit, arch_context, modified, modified_by, created)
VALUES ('adbef66e-f8fd-422d-b20b-c2d0f09309a5', 3, 'c109e19c-c73c-cc49-9f58-4ba0a3ad1339', 'FA-003',
        '2019-01-17 07:50:13.000000', 'anm', '2019-01-17 07:33:00.000000');
INSERT INTO locus (uid, id, uid_unit, arch_context, modified, modified_by, created)
VALUES ('fc182ca8-3f35-49f7-a43a-f64c6383aa35', 3, 'c109e19c-c73c-cc49-9f58-4ba0a3ad1339', 'FA-003',
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

INSERT INTO collected_material (uid, id, uid_locus, external_id, arch_context, modified, modified_by, created)
VALUES ('9495ce6f-da84-4e58-bf0b-f3b6775116f9', 4, 'c50df3cb-e68b-4ce7-b456-9ea3d636d933', null, 'FA-001-1',
        '2019-01-17 16:24:30.000000', 'aes', '2019-01-17 12:40:03.000000');
INSERT INTO collected_material (uid, id, uid_locus, external_id, arch_context, modified, modified_by, created)
VALUES ('24cfb4f9-c23c-4e94-b083-56bf14cb5572', 3, 'c50df3cb-e68b-4ce7-b456-9ea3d636d933', null, 'FA-001-2',
        '2019-01-18 09:14:05.000000', 'aes', '2019-01-07 10:28:39.000000');
INSERT INTO collected_material (uid, id, uid_locus, external_id, arch_context, modified, modified_by, created)
VALUES ('25531aa1-f7b3-4f67-9b08-ba3030889b5b', 3, 'adbef66e-f8fd-422d-b20b-c2d0f09309a5', null, 'FA-003-1',
        '2019-01-18 09:11:48.000000', 'aes', '2019-01-02 08:04:40.000000');

INSERT INTO urap_test.public.locus_architecture(uid_locus, material, created, modified, modified_by, uid)
values('c50df3cb-e68b-4ce7-b456-9ea3d636d933', 'brick', '2019-05-05', '2019-05-05',
       'lkh', '3f85a1b2-8d78-4696-bb81-c7f10fa52661');
INSERT INTO urap_test.public.locus_architecture(uid_locus, material, created, modified, modified_by, uid)
values('adbef66e-f8fd-422d-b20b-c2d0f09309a5', '', '2019-05-05', '2019-05-05',
       'lkh', '76f8e086-235d-4bb7-b803-dd294f0ce386');