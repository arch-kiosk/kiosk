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
VALUES ('c50df3cb-e68b-4ce7-b456-9ea3d636d933', 1, 'c109e19c-c73c-cc49-9f58-4ba0a3ad1339', 'FA-001', 'ac',
        '2019-01-17 11:58:16.000000', 'anm', '2019-01-17 11:50:54.000000');
INSERT INTO locus (uid, id, uid_unit, arch_context, modified, modified_by, created)
VALUES ('a1fc642f-468b-45e1-a368-d9c452c5df7f', 2, 'c109e19c-c73c-cc49-9f58-4ba0a3ad1339', 'FA-002',
        '2019-01-15 11:55:08.000000', 'Lrl’s iPad', '2019-01-01 12:24:36.000000');
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
values ('c50df3cb-e68b-4ce7-b456-9ea3d636d933', 'brick', '2019-05-05', '2019-05-05',
        'lkh', '3f85a1b2-8d78-4696-bb81-c7f10fa52661');
INSERT INTO urap_test.public.locus_architecture(uid_locus, material, created, modified, modified_by, uid)
values ('adbef66e-f8fd-422d-b20b-c2d0f09309a5', '', '2019-05-05', '2019-05-05',
        'lkh', '76f8e086-235d-4bb7-b803-dd294f0ce386');

INSERT INTO urap_test.public.images (description, img_proxy, ref_uid, file_datetime, filename, image_attributes, md5_hash,
                           original_md5, tags, uid, created, modified, modified_by, repl_deleted, repl_tag)
VALUES (null, '2020-07-13 13:42:44.000000', null, '2020-07-13 13:42:44.000000',
        '0f723370-196c-4efd-b6ac-45056d529ec8.png', '{
    "width": 2000,
    "format": "PNG",
    "height": 2667
  }', '162496802414a2187b79192b354dc17a', '162496802414A2187B79192B354DC17A', '"TURTLE"',
        '0f723370-196c-4efd-b6ac-45056d529ec8', '2020-07-13 13:42:44.000000', '2021-07-06 18:33:05.523949', 'lkh',
        false, null);
INSERT INTO urap_test.public.images (description, img_proxy, ref_uid, file_datetime, filename, image_attributes, md5_hash,
                           original_md5, tags, uid, created, modified, modified_by, repl_deleted, repl_tag)
VALUES (null, '2020-07-11 12:14:54.000000', null, '2020-07-11 12:14:54.000000',
        '774421fe-b685-4782-b4b9-94d0a9f2c5aa.jpg', '{
    "width": 2592,
    "format": "JPEG",
    "height": 1936
  }', 'e0bd55b26458b4f9bcd24d75d147d4b4', 'E0BD55B26458B4F9BCD24D75D147D4B4', '"BROKEN_FILE"',
        '774421fe-b685-4782-b4b9-94d0a9f2c5aa', '2020-07-11 12:14:54.000000', '2021-07-06 18:33:05.471419', 'logs',
        false, null);
INSERT INTO urap_test.public.images (description, img_proxy, ref_uid, file_datetime, filename, image_attributes, md5_hash,
                           original_md5, tags, uid, created, modified, modified_by, repl_deleted, repl_tag)
VALUES (null, '2020-07-13 11:53:37.000000', null, '2020-07-13 11:53:37.000000',
        '42966b12-6ffa-4a85-ba22-d37b9cf8c7d1.jpg', '{
    "width": 2667,
    "format": "JPEG",
    "height": 2000
  }', 'cc3f19dcbef099b0c0b54e2d3f1cc061', 'CC3F19DCBEF099B0C0B54E2D3F1CC061', '"BROKEN_FILE"',
        '42966b12-6ffa-4a85-ba22-d37b9cf8c7d1', '2020-07-13 11:53:37.000000', '2021-07-06 18:33:05.532557', 'sgk',
        false, null);
INSERT INTO urap_test.public.images (description, img_proxy, ref_uid, file_datetime, filename, image_attributes, md5_hash,
                           original_md5, tags, uid, created, modified, modified_by, repl_deleted, repl_tag)
VALUES (null, '2020-07-23 14:48:43.000000', null, '2020-07-23 14:48:43.000000',
        'd087640b-a379-4520-a175-c550182f6420.jpg', '{
    "width": 2667,
    "format": "JPEG",
    "height": 2000
  }', '35f51368331e848192884672e7b279f3', '35F51368331E848192884672E7B279F3', '"BROKEN_FILE"',
        'd087640b-a379-4520-a175-c550182f6420', '2020-07-23 14:48:43.000000', '2021-07-06 18:33:05.468428', 'sgk',
        false, null);
INSERT INTO urap_test.public.images (description, img_proxy, ref_uid, file_datetime, filename, image_attributes, md5_hash,
                           original_md5, tags, uid, created, modified, modified_by, repl_deleted, repl_tag)
VALUES (null, '2020-07-13 11:53:58.000000', null, '2020-07-13 11:53:58.000000',
        'd929151f-2d54-477a-a9f8-5265372bfefc.jpg', '{
    "width": 2667,
    "format": "JPEG",
    "height": 2000
  }', '6a264a6c84bc7d58ab99caa8cea84f2e', '6A264A6C84BC7D58AB99CAA8CEA84F2E', '"BROKEN_FILE"',
        'd929151f-2d54-477a-a9f8-5265372bfefc', '2020-07-13 11:53:58.000000', '2021-07-06 18:33:05.452470', 'sgk',
        false, null);
INSERT INTO urap_test.public.images (description, img_proxy, ref_uid, file_datetime, filename, image_attributes, md5_hash,
                           original_md5, tags, uid, created, modified, modified_by, repl_deleted, repl_tag)
VALUES (null, '2020-07-11 13:35:05.000000', null, '2020-07-11 13:35:05.000000',
        'ff691c9d-80be-4f6d-b982-5e446f07e2ba.jpg', '{
    "width": 2592,
    "format": "JPEG",
    "height": 1936
  }', '86794cad88f87737a46ca1cf93d3efa5', '86794CAD88F87737A46CA1CF93D3EFA5', '"BROKEN_FILE"',
        'ff691c9d-80be-4f6d-b982-5e446f07e2ba', '2020-07-11 13:35:05.000000', '2021-07-06 18:33:05.448481', 'logs',
        false, null);
INSERT INTO urap_test.public.images (description, img_proxy, ref_uid, file_datetime, filename, image_attributes, md5_hash,
                           original_md5, tags, uid, created, modified, modified_by, repl_deleted, repl_tag)
VALUES (null, '2020-07-23 14:53:55.000000', null, '2020-07-23 14:53:55.000000',
        'a0a3544d-6fc3-43f0-a560-6931c478a76a.jpg', '{
    "width": 2048,
    "format": "JPEG",
    "height": 1536
  }', '8dd99933f6639a9f33bd93a214adf1e6', '8DD99933F6639A9F33BD93A214ADF1E6', '"BROKEN_FILE"',
        'a0a3544d-6fc3-43f0-a560-6931c478a76a', '2020-07-23 14:53:55.000000', '2021-07-06 18:33:05.464441', 'sgk',
        false, null);
INSERT INTO urap_test.public.images (description, img_proxy, ref_uid, file_datetime, filename, image_attributes, md5_hash,
                           original_md5, tags, uid, created, modified, modified_by, repl_deleted, repl_tag)
VALUES (null, '2020-08-03 10:30:07.000000', null, '2020-08-03 10:30:07.000000',
        'f9d890eb-f92a-4deb-90f5-c7f9b4712365.png', '{
    "width": 2048,
    "format": "PNG",
    "height": 1536
  }', '3ebf432d58e677de81e106a1de628bae', '3EBF432D58E677DE81E106A1DE628BAE', '"BROKEN_FILE"',
        'f9d890eb-f92a-4deb-90f5-c7f9b4712365', '2020-08-03 10:30:07.000000', '2021-07-06 18:22:18.793049', 'logs',
        false, null);
INSERT INTO urap_test.public.images (description, img_proxy, ref_uid, file_datetime, filename, image_attributes, md5_hash,
                           original_md5, tags, uid, created, modified, modified_by, repl_deleted, repl_tag)
VALUES (null, '2020-07-13 13:35:46.000000', null, '2020-07-13 13:35:46.000000',
        'a63e2c9b-4c8d-4f41-bb29-ed4cc430f040.jpg', '{
    "width": 2000,
    "format": "JPEG",
    "height": 2667
  }', '8c3fedfae442572edcc06840ff05b63e', '8C3FEDFAE442572EDCC06840FF05B63E', '"BROKEN_FILE"',
        'a63e2c9b-4c8d-4f41-bb29-ed4cc430f040', '2020-07-13 13:35:46.000000', '2021-07-06 18:33:05.444492', 'mjl',
        false, null);
INSERT INTO urap_test.public.images (description, img_proxy, ref_uid, file_datetime, filename, image_attributes, md5_hash,
                           original_md5, tags, uid, created, modified, modified_by, repl_deleted, repl_tag)
VALUES (null, '2020-07-10 14:48:23.000000', null, '2020-07-10 14:48:23.000000',
        'daa5a44e-5fe2-4e07-85e0-e5aee57ed29a.jpg', '{
    "width": 2667,
    "format": "JPEG",
    "height": 2000
  }', 'a69b74de6221a33c5cf9656258e5eb7c', 'A69B74DE6221A33C5CF9656258E5EB7C', '"BROKEN_FILE"',
        'daa5a44e-5fe2-4e07-85e0-e5aee57ed29a', '2020-07-10 14:48:23.000000', '2021-07-06 18:33:05.448481', 'nvd',
        false, null);
INSERT INTO urap_test.public.images (description, img_proxy, ref_uid, file_datetime, filename, image_attributes, md5_hash,
                           original_md5, tags, uid, created, modified, modified_by, repl_deleted, repl_tag)
VALUES (null, '2020-07-13 11:51:36.000000', null, '2020-07-13 11:51:36.000000',
        '25848747-d248-4178-8e4d-715aca3debd7.jpg', '{
    "width": 2667,
    "format": "JPEG",
    "height": 2000
  }', '6a169e5ebaa75cc035b927df64b232ef', '6A169E5EBAA75CC035B927DF64B232EF', '"BROKEN_FILE"',
        '25848747-d248-4178-8e4d-715aca3debd7', '2020-07-13 11:51:36.000000', '2021-07-06 18:33:05.453467', 'sgk',
        false, null);
INSERT INTO urap_test.public.images (description, img_proxy, ref_uid, file_datetime, filename, image_attributes, md5_hash,
                           original_md5, tags, uid, created, modified, modified_by, repl_deleted, repl_tag)
VALUES (null, '2020-07-10 15:08:22.000000', null, '2020-07-10 15:08:22.000000',
        '46337dfd-83d5-4522-acec-f2ed42966cbd.jpg', '{
    "width": 1500,
    "format": "JPEG",
    "height": 2000
  }', 'b2db082d0a1532e0cb10dd1f282a7a10', 'B2DB082D0A1532E0CB10DD1F282A7A10', '"BROKEN_FILE"',
        '46337dfd-83d5-4522-acec-f2ed42966cbd', '2020-07-10 15:08:22.000000', '2021-07-06 18:33:05.446487', 'nvd',
        false, null);
INSERT INTO urap_test.public.images (description, img_proxy, ref_uid, file_datetime, filename, image_attributes, md5_hash,
                           original_md5, tags, uid, created, modified, modified_by, repl_deleted, repl_tag)
VALUES (null, '2020-08-03 18:13:46.000000', null, '2020-08-03 18:13:46.000000',
        '009ff417-5982-4c0c-94d3-c7ce2d4baf2e.png', '{
    "width": 444,
    "format": "PNG",
    "height": 512
  }', '0ca8cf01d6b21c64a5649aa06064f340', '0CA8CF01D6B21C64A5649AA06064F340', '"BROKEN_FILE"',
        '009ff417-5982-4c0c-94d3-c7ce2d4baf2e', '2020-08-03 18:13:46.000000', '2021-07-06 18:33:05.457464', 'nvd',
        false, null);
INSERT INTO urap_test.public.images (description, img_proxy, ref_uid, file_datetime, filename, image_attributes, md5_hash,
                           original_md5, tags, uid, created, modified, modified_by, repl_deleted, repl_tag)
VALUES (null, '2020-07-23 12:33:16.000000', null, '2020-07-23 12:33:16.000000',
        '0194cba9d6a800cce8eea57814657d23.jpg', '{
    "width": 2048,
    "format": "JPEG",
    "height": 1536
  }', '0194cba9d6a800cce8eea57814657d23', '0194CBA9D6A800CCE8EEA57814657D23', '"BROKEN_FILE"',
        '949a8761-c17b-47c2-ba92-b521731d8271', '2020-07-23 12:33:16.000000', '2021-07-06 18:33:05.460450', 'sgk',
        false, null);