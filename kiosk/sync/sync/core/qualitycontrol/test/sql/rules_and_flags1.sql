INSERT INTO qc_rules (id, type, type_param, trigger, suppress_on, process_only_on, objective, inputs, hosts, flag,
                      enabled, uid, created, modified, modified_by, repl_deleted, repl_tag)
VALUES ('lc_1_1', 'empty', null, 'rtl', null, null, null, '{
"type": "field_value",
"record_type": "locus",
"field": "date_defined"
}', 'kiosk
FileMakerWorkstation', 'lc_1_1', 1, 'd331567b-0d36-400a-b192-439882178aec', '2021-05-01 00:00:00.000000',
        '2021-05-01 00:00:00.000000', 'lkh', false, null);

INSERT INTO qc_rules (id, type, type_param, trigger, suppress_on, process_only_on, objective, inputs, hosts, flag,
                      enabled, uid, created, modified, modified_by, repl_deleted, repl_tag)
VALUES ('lc_2_1', 'empty', null, 'rtl', null, null, null, '{
"type": "field_value",
"record_type": "locus_architecture",
"field": "material"
}', 'kiosk
FileMakerWorkstation', 'lc_2_1', 1, 'fa4368eb-4e0b-4c93-bad8-f008eef0eeaa', '2021-05-01 00:00:00.000000',
        '2021-05-01 00:00:00.000000', 'lkh', false, null);

INSERT INTO qc_flags(id, severity, message, params, fields_involved, i18n_id, uid, created, modified, modified_by)
VALUES('lc_1_1', 'hint', '{1} {2} has no opening date', '$$locus_term, arch_context', '', '',
       'ed59f2a6-05cd-4a58-a724-400e382f85de', '2019-05-05', '2019-05-05', 'lkh')
