INSERT INTO site (uid, id, id_short,created, modified, modified_by, arch_domain, arch_context)
VALUES ('b1bc642f-468b-45e1-a368-d9c452c5df7f', 'Fortress', 'FRT', '2019-01-01 00:00:00.000000', '2019-01-01 00:00:00.000000', 'ldb', 'FA', 'FA');


INSERT INTO unit (uid, arch_context, modified, modified_by, created, id_site)
VALUES ('c109e19c-c73c-cc49-9f58-4ba0a3ad1339', 'FA',
        '2019-08-18 15:18:18.000000', 'ldb', '2018-12-31 22:24:24.000000', 'Fortress');

INSERT INTO locus (uid, id, arch_context, "type", modified, modified_by, created, uid_unit)
VALUES ('c50df3cb-e68b-4ce7-b456-9ea3d636d933', 53, 'FA-053', 'dp', '2019-01-17 11:58:16.000000', 'anm',
        '2019-01-17 11:50:54.000000', 'c109e19c-c73c-cc49-9f58-4ba0a3ad1339');
INSERT INTO locus (uid, id, arch_context, "type", modified, modified_by, created, uid_unit)
VALUES ('a1fc642f-468b-45e1-a368-d9c452c5df7f', 14, 'FA-014', 'dp', '2019-01-15 11:55:08.000000', 'Lrl’s iPad',
        '2019-01-01 12:24:36.000000', 'c109e19c-c73c-cc49-9f58-4ba0a3ad1339');

INSERT INTO locus (uid, id, arch_context, modified, modified_by, created, "type", uid_unit)
VALUES ('818e1e12-fb42-449d-a22b-2c27ce440e29', 59, 'FA-059', '2019-03-06 16:21:03.000000', 'ldb',
        '2019-03-06 11:38:23.000000', 'dp','c109e19c-c73c-cc49-9f58-4ba0a3ad1339');
INSERT INTO locus (uid, id, arch_context, modified, modified_by, created, "type", "description", "uid_unit")
VALUES ('d4f228ff-1163-4f85-aa74-b6530affae9e', 35, '24-5-17', '2019-12-14 13:47:33.000000', 'ldb',
        '2019-01-14 07:30:25.000000', 'dp', 'loose soil','c109e19c-c73c-cc49-9f58-4ba0a3ad1339');

-- three collected materials with types, connected to locus 818e1e12-fb42-449d-a22b-2c27ce440e29 (FA-059)
INSERT INTO public.collected_material (uid, id, uid_locus, external_id, arch_context, modified, modified_by, created, "type")
VALUES ('0000e3eb-1919-4605-8a6f-3c94eee1c295', 8, '818e1e12-fb42-449d-a22b-2c27ce440e29',
        '24-5-9 (Wheeler); 24.733 (MFA)', 'FA-059-8', '2019-03-06 15:15:32.000000', 'ldb',
        '2019-03-06 15:12:41.000000', 'ceramic');
INSERT INTO public.collected_material (uid, id, uid_locus, external_id, arch_context, modified, modified_by, created, "type")
VALUES ('dfba68fe-d261-4167-9523-6dc8c3ba18fd', 16, '818e1e12-fb42-449d-a22b-2c27ce440e29', '24-5-17', 'FA-059-16',
        '2019-03-06 16:20:11.000000', 'ldb', '2019-03-06 16:17:54.000000', 'ceramic');
INSERT INTO public.collected_material (uid, id, uid_locus, external_id, arch_context, modified, modified_by, created, "type")
VALUES ('99f1dc56-09e4-4a88-b32e-060885825ed2', 12, '818e1e12-fb42-449d-a22b-2c27ce440e29', '24-5-13', 'FA-059-12',
        '2019-03-06 16:01:57.000000', 'ldb', '2019-03-06 16:01:05.000000', 'stone');

-- two collected materials with types, connected to locus d4f228ff-1163-4f85-aa74-b6530affae9e (24-5-17)
INSERT INTO public.collected_material (uid, id, uid_locus, external_id, arch_context, modified, modified_by, created, "type")
VALUES ('6605397e-0bb6-4848-bd4a-4042673cb25a', 6, 'd4f228ff-1163-4f85-aa74-b6530affae9e', '24-5-7', '24-5-17',
        '2019-03-06 13:15:50.000000', 'ldb', '2019-03-06 13:12:18.000000', 'faience');
INSERT INTO public.collected_material (uid, id, uid_locus, external_id, arch_context, modified, modified_by, created, "type")
VALUES ('c2e5b22d-ef58-40c6-9db3-aaaeb367924b', 13, 'd4f228ff-1163-4f85-aa74-b6530affae9e', '24-5-14', '24-5-18',
        '2019-03-06 16:06:33.000000', 'ldb', '2019-03-06 16:04:58.000000', 'mud');
