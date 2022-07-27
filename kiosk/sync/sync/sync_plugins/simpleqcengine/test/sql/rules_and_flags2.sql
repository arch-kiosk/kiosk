INSERT INTO qc_rules (id, type, type_param, trigger, suppress_on, process_only_on, objective, inputs, hosts, flag,
                      enabled, uid, created, modified, modified_by, repl_deleted, repl_tag)
VALUES ('lc_4_1', 'is0', null, 'rtl', null, null, null, '{
"type": "record_count",
"record_type": "locus_photo"
}', 'kiosk
FileMakerWorkstation', 'lc_4_1', 1, 'd331567b-0d36-400a-b192-439882178aec', '2021-05-01 00:00:00.000000',
        '2021-05-01 00:00:00.000000', 'lkh', false, null);

INSERT INTO qc_rules (id, type, type_param, trigger, suppress_on, process_only_on, objective, inputs, hosts, flag,
                      enabled, uid, created, modified, modified_by, repl_deleted, repl_tag)
VALUES ('lc_3_1', 'is0', null, 'rtl', null, null, null, '{
"type": "record_count",
"record_type": "collected_material"
}', 'kiosk
FileMakerWorkstation', 'lc_3_1', 1, '0cfdfa35-de19-4bc0-89ae-795ab88438c7', '2021-05-01 00:00:00.000000',
        '2021-05-01 00:00:00.000000', 'lkh', false, null);

INSERT INTO qc_flags(id, severity, message, params, fields_involved, i18n_id, uid, created, modified, modified_by)
VALUES('lc_4_1', 'error', '{1} {2} has no photos', '$$locus_term, arch_context', '', '',
       'ed59f2a6-05cd-4a58-a724-400e382f85de', '2019-05-05', '2019-05-05', 'lkh');

INSERT INTO qc_flags(id, severity, message, params, fields_involved, i18n_id, uid, created, modified, modified_by)
VALUES('lc_3_1', 'warning', '{1} {2} has no collected material', '$$locus_term, arch_context', '', '',
       'eaac8bee-ed1f-47e2-80c5-e6ed3bf581c5', '2019-05-05', '2019-05-05', 'lkh');
