truncate table public.locus;
truncate table public.locus_relations;
truncate table public.unit;

INSERT INTO public.unit (id, name, purpose, type, method, id_excavator, unit_creation_date, id_site,
                         excavator_full_name, spider_counter, coordinates, legacy_unit_id, uid, created, modified,
                         modified_by, repl_deleted, repl_tag, term_for_unit, term_for_locus, identification_method_loci,
                         identification_method_cm, identification_method_analysis, arch_domain, arch_context)
VALUES (null, null, 'Trench consists of a room; it is SW of trench LB, a closet. ' ||
                    'The trench is enclosed by four walls with an opening on its NE side.

Research objectives for this trench include figuring out what the heck is in here since most of its parts have not been examined in many a year (including mysterious drawers with objects of utterly unknown purpose). This is actually LOGS’ second room in this apartment because her first (much missed) room was taken over by her brother after she went off to college and so a lot of the decisions that shaped what the room looks like now were not hers. Priorities for excavation include what seems to be a nightstand and several shelves with books (...bookshelves?), as well as a flat surface with a mess on top of it (a desk?!).',
        'excavation', 'locus recording', 'LOGS', '2020-07-08', 'Providence', null, null, null, null,
        '42f01bcc-8086-4334-9078-fa5531b1f8aa', '2020-07-08 08:20:44.000000', '2020-07-08 13:50:04.000000', 'logs',
        false, null, 'unit', 'locus', null, null, null, null, 'LA');

INSERT INTO public.locus (uid_unit, id, type, "opening elevations", "closing elevations", description, date_defined,
                          date_closed, interpretation, colour, uid, created, modified, modified_by, repl_deleted,
                          repl_tag, formation_process, arch_domain, arch_context, recorded_by, elevation_opening_nw,
                          elevation_opening_ne, elevation_opening_sw, elevation_opening_se, elevation_closing_nw,
                          elevation_closing_ne, elevation_closing_sw, elevation_closing_se, elevation_opening_ct,
                          elevation_closing_ct, width, length, depth, volume)
VALUES ('42f01bcc-8086-4334-9078-fa5531b1f8aa', 3, 'ac', null, null,
        'NW wall of trench LA. Same plaster and paint. ',
        '2022-01-08', null,
        'Some description',
        'Beige', '032d76fe-17d0-48f4-bc5d-8c2f09d01d81', '2020-07-08 09:23:33.000000', '2020-07-08 14:18:12.000000',
        'logs', false, null, null, 'LA', 'LA-003', 'LOGS', null, null, null, null, null, null, null, null, null, null,
        null, null, null, null);
INSERT INTO public.locus (uid_unit, id, type, "opening elevations", "closing elevations", description, date_defined,
                          date_closed, interpretation, colour, uid, created, modified, modified_by, repl_deleted,
                          repl_tag, formation_process, arch_domain, arch_context, recorded_by, elevation_opening_nw,
                          elevation_opening_ne, elevation_opening_sw, elevation_opening_se, elevation_closing_nw,
                          elevation_closing_ne, elevation_closing_sw, elevation_closing_se, elevation_opening_ct,
                          elevation_closing_ct, width, length, depth, volume)
VALUES ('42f01bcc-8086-4334-9078-fa5531b1f8aa', 2, 'ac', null, null,
        'SW wall of trench LA. Also plastered and painted like the others. ',
        '2020-07-08', null,
        'Wall built to separate LOGS’ room from the outside world',
        'Beige', '719a2c13-0aba-40e9-8ea9-3e17463c698d', '2020-07-08 09:18:02.000000', '2020-07-08 14:17:41.000000',
        'logs', false, null, null, 'LA', 'LA-002', 'LOGS', null, null, null, null, null, null, null, null, null, null,
        null, null, null, null);
INSERT INTO public.locus (uid_unit, id, type, "opening elevations", "closing elevations", description, date_defined,
                          date_closed, interpretation, colour, uid, created, modified, modified_by, repl_deleted,
                          repl_tag, formation_process, arch_domain, arch_context, recorded_by, elevation_opening_nw,
                          elevation_opening_ne, elevation_opening_sw, elevation_opening_se, elevation_closing_nw,
                          elevation_closing_ne, elevation_closing_sw, elevation_closing_se, elevation_opening_ct,
                          elevation_closing_ct, width, length, depth, volume)
VALUES ('42f01bcc-8086-4334-9078-fa5531b1f8aa', 1, 'ac', null, null,
        'SE wall of trench LA. Plastered over and painted with detailing halfway up and on the bottom (see images).',
        '2020-07-08', null,
        'Wall built to separate LOGS’ room from others.',
        'Beige', '6ee8b69c-dc8f-4923-9e6c-0c01f2c5a961', '2020-07-08 09:04:17.000000', '2020-08-01 15:56:10.000000',
        'ldb', false, null, null, 'LA', 'LA-001', 'LOGS', null, null, null, null, null, null, null, null, null, null,
        null, null, null, null);

INSERT INTO public.locus_relations (uid_locus, uid_locus_2_related, type, uid_sketch, sketch_description, uid, created,
                                    modified, modified_by, repl_deleted, repl_tag, chronology)
VALUES ('719a2c13-0aba-40e9-8ea9-3e17463c698d', '4e27c519-de78-4a76-bd04-185ff09ccd4f', 'bonds with',
        '6e71c33f-d9cb-42d2-ba30-74f8bd3ce2ff', 'LA-002 bonds with LA-009', '05f710b0-b883-437c-ad24-2058d5c395f9',
        '2020-07-19 14:11:58.244774', '2020-07-19 14:11:58.244774', 'sys', false, null, null);
INSERT INTO public.locus_relations (uid_locus, uid_locus_2_related, type, uid_sketch, sketch_description, uid, created,
                                    modified, modified_by, repl_deleted, repl_tag, chronology)
VALUES ('719a2c13-0aba-40e9-8ea9-3e17463c698d', '032d76fe-17d0-48f4-bc5d-8c2f09d01d81', 'is abutted by',
        '6b005beb-614f-4408-bdaa-964ffcb09452', 'LA-002 is abutted by LA-003', '64e30b19-cd50-4913-8678-7e5e1f8d1c7f',
        '2020-07-08 14:02:21.000000', '2020-07-08 14:02:21.000000', 'logs', false, null, null);
INSERT INTO public.locus_relations (uid_locus, uid_locus_2_related, type, uid_sketch, sketch_description, uid, created,
                                    modified, modified_by, repl_deleted, repl_tag, chronology)
VALUES ('719a2c13-0aba-40e9-8ea9-3e17463c698d', '6ee8b69c-dc8f-4923-9e6c-0c01f2c5a961', 'is abutted by',
        '5d9e43c4-bbf4-4aee-b134-2c8ffa75c7d3', 'LA-002 is abutted by LA-001', '8aa5ce70-b023-4450-aad7-d8bad87d31a5',
        '2020-07-08 09:45:24.000000', '2020-07-08 09:46:07.000000', 'logs', false, null, null);
INSERT INTO public.locus_relations (uid_locus, uid_locus_2_related, type, uid_sketch, sketch_description, uid, created,
                                    modified, modified_by, repl_deleted, repl_tag, chronology)
VALUES ('719a2c13-0aba-40e9-8ea9-3e17463c698d', '8f7f8458-7111-418f-b7f7-3c6d5eab3193', 'is adjacent to',
        '3c5c2070-4c6c-4233-8db2-59199888c4e2', 'LA-002 is adjacent to LA-010', '60745074-0637-4af5-b906-89ddd0e4b3da',
        '2020-07-19 14:11:58.244774', '2020-07-19 14:11:58.244774', 'sys', false, null, null);

create table IF NOT EXISTS lookup_table (
    key_field varchar primary key,
    value_field varchar
);

truncate table lookup_table;

insert into lookup_table (key_field, value_field) values('key1', 'value1');
insert into lookup_table (key_field, value_field) values('key2', 'value2');