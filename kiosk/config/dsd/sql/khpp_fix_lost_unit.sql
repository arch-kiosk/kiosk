alter table unit
    add constraint name_unique UNIQUE(name);
insert into unit(name, purpose, id_excavator, unit_creation_date, id_site,
                 excavator_full_name, spider_counter, created, modified,
                 modified_by, type,
                 method, term_for_unit, term_for_locus,
                 arch_domain, arch_context)
                 values('lost unit', 'Once there was a unit with some dayplans attached to it. The unit got lost' ||
                                     'the dayplans are now attached to this unit here.','admin',
                        '2020-05-06 18:00:00.000000', 'Kom el-Hisn', 'admin', 0,
                        '2020-05-06 18:00:00.000000', '2020-05-06 18:00:00.000000','admin','excavation',
                        'excavation',
                        'unit', 'locus', '', 'lost unit')
                ON CONFLICT (name) DO NOTHING;
update dayplan set uid_unit = (select uid from unit where name='lost unit') where uid_unit is null;
