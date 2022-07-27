truncate table public.repl_file_picking_rules;

INSERT INTO public.repl_file_picking_rules (workstation_type, recording_group, "order", rule_type, operator, value, resolution,
                                            disable_changes, misc, uid, created, modified, modified_by)
VALUES ('FileMakerWorkstation', 'default', 0, 'contextuals', null, null, 'low', false, null,
        'c1ad70a6-1e08-44ed-9f2c-bccb8be30fbd', '2021-02-18 17:41:31.281323', '2021-02-18 17:41:31.281323', 'sys');

INSERT INTO public.repl_file_picking_rules (workstation_type, recording_group, "order", rule_type, operator, value, resolution,
                                            disable_changes, misc, uid, created, modified, modified_by)
VALUES ('FileMakerWorkstation', 'default', 1, 'context', 'IN', 'FA', 'high', false, null,
        'c2ad70a6-1e08-44ed-9f2c-bccb8be30fbd', '2021-02-18 17:41:31.281323', '2021-02-18 17:41:31.281323', 'sys');

INSERT INTO public.repl_file_picking_rules (workstation_type, recording_group, "order", rule_type, operator, value, resolution,
                                            disable_changes, misc, uid, created, modified, modified_by)
VALUES ('FileMakerWorkstation', 'default', 2, 'record_type', '=', 'locus relation sketch', 'dummy', false, null,
        'c3ad70a6-1e08-44ed-9f2c-bccb8be30fbd', '2021-02-18 17:41:31.281323', '2021-02-18 17:41:31.281323', 'sys');
