INSERT INTO public.unit (arch_context, name, purpose, id_excavator, unit_creation_date, id_site,
                         excavator_full_name, spider_counter, uid, created, modified, modified_by, repl_deleted,
                         repl_tag, coordinates, legacy_unit_id, type, method)
VALUES ('FA', null,
        'FA is opened to excavate Wheeler’s room 5. The reason for this decision is that a looter’s hole on the east side of the room has exposed a more complicated construction history than previously known. We even have some hopes that, as this was the very beginning of Wheeler’s work, he didn’t yet know that secondary floors existed. In the looter’s pit we see that there is a mud plastered floor surface that runs unambiguously beneath the east wall (FA-005). So unambiguously that there is even a layer of sand between them. Above that floor are more clearly cultural layers: bricks rubble, then mortar with bricks. The brick floor level that Wheeler stopped at is fully three courses above the bottom of the wall. So we need to explore.

Two observations of Wheeler''s do not accord with what we  found. In the 1928 diary p. 210 he says of FA/Room 5 that it is white-plastered, and that the dividing walls are present both east and west. And indeed the photographs make clear that is the case. Also clear from his photo is that the eastern column drums were still in situ.

As the removal of the brick floor in the NE corner of the Unit did not reveal any white plaster on the faces of the wall that had been hitherto protected, it is clear the white plaster was added only after the floor was in place (which as we know was not the first use of the room, though was likely very eary in the fort''s construction and use history).',
        'LDB', '2018-12-31', 'Fortress', null, null, 'c109e19c-c73c-cc49-9f58-4ba0a3ad1339',
        '2018-12-31 22:24:24.000000', '2019-03-20 10:30:53.000000', 'ldb', false, null, null, null, 'excavation',
        'excavation');

INSERT INTO public.dayplan (image_description, uid_image, uid, created, modified, modified_by, repl_deleted,
                            repl_tag, uid_unit)
VALUES ('white striped ware', '32d4db7e-ef19-4465-90de-5714c413638e', 'f27424aa-c826-451e-a434-a03f7332a802',
        '2019-03-11 20:52:30.000000', '2019-03-11 20:52:30.000000', 'sys', false, NULL,
        'c109e19c-c73c-cc49-9f58-4ba0a3ad1339');

INSERT INTO public.dayplan (image_description, uid_image, uid, created, modified, modified_by, repl_deleted,
                            repl_tag, uid_unit)
VALUES ('Dunham Plate IV, showing FA/Room 5 at lower left. White plaster and eastern dividing walls clear.',
        '21e9156c-c6a2-4229-9d9e-bd712323c4f1', '5a83a51e-fea2-4f56-b8bd-e20e39dad1e5', '2019-03-06 11:54:46.000000',
        '2019-03-06 11:55:44.000000', 'ldb', false, NULL, 'c109e19c-c73c-cc49-9f58-4ba0a3ad1339');

INSERT INTO public.dayplan (image_description, uid_image, uid, created, modified, modified_by, repl_deleted,
                            repl_tag, uid_unit)
VALUES ('Test image 3',
        'c5107d70-a9c2-4bde-945a-f41c2f11dfd6', '88edc131-b88a-4847-99fd-42333844cba3', '2019-09-22 13:25:59',
        '2019-09-22 13:26:32', 'lkh', false, NULL, 'c109e19c-c73c-cc49-9f58-4ba0a3ad1339');


INSERT INTO public.unit (arch_context, name, purpose, id_excavator, unit_creation_date, id_site,
                         excavator_full_name, spider_counter, uid, created, modified, modified_by, repl_deleted,
                         repl_tag, coordinates, legacy_unit_id, type, method)
VALUES ('CC', null,
        'Unit CC',
        'LDB', '2018-12-31', 'Fortress', null, null,
        '55dbdfe5-f379-4639-a632-d83e60a7b293',
        '2018-12-31 22:24:24.000000', '2019-03-20 10:30:53.000000', 'ldb', false, null, null, null, 'excavation',
        'excavation');

INSERT INTO public.locus(uid, uid_unit, id, type, description, date_defined,
                         created, modified, modified_by,
                         arch_domain, arch_context, recorded_by)

VALUES ('3b9eddde-e37c-41f5-93f4-73e8a7aa985a',
        '55dbdfe5-f379-4639-a632-d83e60a7b293', 1, 'architecture', 'locus CC-001', null,
        '2018-12-31 22:24:24.000000', '2019-03-20 10:30:53.000000', 'ldb', 'cc', 'CC-001', 'ldb');

INSERT INTO public.locus(uid, uid_unit, id, type, description, date_defined,
                         created, modified, modified_by,
                         arch_domain, arch_context, recorded_by)

VALUES ('906e3427-b384-45ca-9147-a72e05d4299b',
        '55dbdfe5-f379-4639-a632-d83e60a7b293', 1, 'architecture', 'locus CC-002', null,
        '2018-12-31 22:24:24.000000', '2019-03-20 10:30:53.000000', 'ldb', 'cc', 'CC-002', 'ldb');

INSERT INTO public.locus_photo(uid_locus, description, uid_image, created, modified, modified_by)

VALUES ('3b9eddde-e37c-41f5-93f4-73e8a7aa985a',
        'image for cc-001',
        '6ab28932-d8be-4bd8-8b08-b318827dea61',
        '2018-12-31 22:24:24.000000', '2019-03-20 10:30:53.000000', 'ldb');

INSERT INTO public.locus_relations(uid_locus, uid_locus_2_related, type, uid_sketch, sketch_description, created,
                                   modified, modified_by)

VALUES ('3b9eddde-e37c-41f5-93f4-73e8a7aa985a',
        '906e3427-b384-45ca-9147-a72e05d4299b',
        'below',
        'ef46cbd6-952b-43d1-afd4-796fb645916f',
        'locus CC-001 below CC-002',
        '2018-12-31 22:24:24.000000', '2019-03-20 10:30:53.000000', 'ldb');

INSERT INTO public.locus_relations(uid_locus, uid_locus_2_related, type, uid_sketch, sketch_description, created,
                                   modified, modified_by)

VALUES ('906e3427-b384-45ca-9147-a72e05d4299b',
        '3b9eddde-e37c-41f5-93f4-73e8a7aa985a',
        'above',
        'ef46cbd6-952b-43d1-afd4-796fb645916f',
        'locus CC-002 above CC-001',
        '2018-12-31 22:24:24.000000', '2019-03-20 10:30:53.000000', 'ldb');
