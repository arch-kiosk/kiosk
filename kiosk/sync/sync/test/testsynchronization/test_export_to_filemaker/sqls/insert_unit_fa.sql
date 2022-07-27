insert into public.site (id, purpose, id_short, uid_site_map,
                         uid, created, modified, modified_by, arch_context)
                         VALUES('Fortress', '', 'FRT', null, '37c269a5-7429-8141-b323-07be561b9450',
                                '2018-12-31 22:24:24.000000',
                                '2018-12-31 22:24:24.000000',
                                'lkh', 'FRT');

INSERT INTO public.unit (id, name, purpose, id_excavator,term_for_locus,term_for_unit,
                         unit_creation_date, id_site, excavator_full_name, spider_counter,
                         uid, created, modified, modified_by, repl_deleted,
                         repl_tag, coordinates, legacy_unit_id, type, method, arch_context)
                         VALUES (null, null, 'FA is opened to excavate Wheeler’s room 5. The reason for this decision is that a looter’s hole on the east side of the room has exposed a more complicated construction history than previously known. We even have some hopes that, as this was the very beginning of Wheeler’s work, he didn’t yet know that secondary floors existed. In the looter’s pit we see that there is a mud plastered floor surface that runs unambiguously beneath the east wall (FA-005). So unambiguously that there is even a layer of sand between them. Above that floor are more clearly cultural layers: bricks rubble, then mortar with bricks. The brick floor level that Wheeler stopped at is fully three courses above the bottom of the wall. So we need to explore.

Two observations of Wheeler''s do not accord with what we  found. In the 1928 diary p. 210 he says of FA/Room 5 that it is white-plastered, and that the dividing walls are present both east and west. And indeed the photographs make clear that is the case. Also clear from his photo is that the eastern column drums were still in situ.

As the removal of the brick floor in the NE corner of the Unit did not reveal any white plaster on the faces of the wall that had been hitherto protected, it is clear the white plaster was added only after the floor was in place (which as we know was not the first use of the room, though was likely very eary in the fort''s construction and use history).',
                                 'LDB','locus','unit', '2018-12-31', 'FRT', null, null,
                                 'c109e19c-c73c-cc49-9f58-4ba0a3ad1339',
                                 '2018-12-31 22:24:24.000000',
                                 '2019-03-20 10:30:53.000000',
                                 'ldb', false, null, null, null,
                                 'excavation', 'excavation', 'FA');