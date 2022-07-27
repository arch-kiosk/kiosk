alter table {{collected_material}}
    alter column uid set default gen_random_uuid();
alter table {{collected_material_photo}}
    alter column uid set default gen_random_uuid();
alter table {{dayplan}}
    alter column uid set default gen_random_uuid();
alter table {{excavator}}
    alter column uid set default gen_random_uuid();
alter table {{feature_unit}}
    alter column uid set default gen_random_uuid();
alter table {{images}}
    alter column uid set default gen_random_uuid();
alter table {{locus}}
    alter column uid set default gen_random_uuid();
alter table {{locus_architecture}}
    alter column uid set default gen_random_uuid();
alter table {{locus_burial}}
    alter column uid set default gen_random_uuid();
alter table {{locus_deposit}}
    alter column uid set default gen_random_uuid();
alter table {{locus_othertype}}
    alter column uid set default gen_random_uuid();
alter table {{locus_photo}}
    alter column uid set default gen_random_uuid();
alter table {{locus_relations}}
    alter column uid set default gen_random_uuid();
alter table {{locus_types}}
    alter column uid set default gen_random_uuid();
alter table {{lot}}
    alter column uid set default gen_random_uuid();
alter table {{identification_methods}}
    alter column uid set default gen_random_uuid();
alter table {{identifier_lists}}
    alter column uid set default gen_random_uuid();
alter table {{pottery}}
    alter column uid set default gen_random_uuid();
alter table {{pottery_images}}
    alter column uid set default gen_random_uuid();
alter table {{site}}
    alter column uid set default gen_random_uuid();
alter table {{site_notes}}
    alter column uid set default gen_random_uuid();
alter table {{site_note_photo}}
    alter column uid set default gen_random_uuid();
alter table {{small_find}}
    alter column uid set default gen_random_uuid();
alter table {{survey_unit}}
    alter column uid set default gen_random_uuid();
alter table {{survey_unit_data}}
    alter column uid set default gen_random_uuid();
alter table {{tags}}
    alter column uid set default gen_random_uuid();
alter table {{tagging}}
    alter column uid set default gen_random_uuid();
alter table {{tickets}}
    alter column uid set default gen_random_uuid();
alter table {{unit}}
    alter column uid set default gen_random_uuid();
alter table {{unit_narrative}}
    alter column uid set default gen_random_uuid();
alter table {{unit_shop}}
    alter column uid set default gen_random_uuid();
alter table {{unit_unit_relation}}
    alter column uid set default gen_random_uuid();
alter table {{workflow_requests}}
    alter column uid set default gen_random_uuid();
alter table {{inventory}}
    alter column uid set default gen_random_uuid();
alter table {{constants}}
    alter column uid set default gen_random_uuid();

