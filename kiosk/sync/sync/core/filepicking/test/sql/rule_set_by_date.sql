truncate table public.repl_file_picking_rules;

INSERT INTO public.repl_file_picking_rules (workstation_type, recording_group, "order", rule_type, operator, value, resolution,
                                            disable_changes, misc, uid, created, modified, modified_by)
VALUES ('FileMakerWorkstation', 'default', 0, 'contextuals', null, null, 'low', false, null,
        'c1ad70a6-1e08-44ed-9f2c-bccb8be30fbd', '2021-02-18 17:41:31.281323', '2021-02-18 17:41:31.281323', 'sys');

INSERT INTO public.repl_file_picking_rules (workstation_type, recording_group, "order", rule_type, operator, value, resolution,
                                            disable_changes, misc, uid, created, modified, modified_by)
VALUES ('FileMakerWorkstation', 'default', 1, 'date', 'within', '2018-01-01,2018-01-01', 'dummy', false, null,
        '1c4a9460-5c73-4a39-b383-556e3d5b7b5f', '2021-02-18 17:41:31.281323', '2021-02-18 17:41:31.281323', 'sys');

INSERT INTO public.repl_file_picking_rules (workstation_type, recording_group, "order", rule_type, operator, value, resolution,
                                            disable_changes, misc, uid, created, modified, modified_by)
VALUES ('FileMakerWorkstation', 'default', 2, 'date', '!within', '2018-01-01,2018-01-01', 'low1', false, null,
        '25e53d55-435e-472e-9709-473cd17b5ba9', '2021-02-18 17:41:31.281323', '2021-02-18 17:41:31.281323', 'sys');

INSERT INTO public.repl_file_picking_rules (workstation_type, recording_group, "order", rule_type, operator, value, resolution,
                                            disable_changes, misc, uid, created, modified, modified_by)
VALUES ('FileMakerWorkstation', 'default', 3, 'date', '<', '2018-01-01', 'low2', false, null,
        '5bd486a4-c5c7-44c2-9292-a9037ddb5ce5', '2021-02-18 17:41:31.281323', '2021-02-18 17:41:31.281323', 'sys');

INSERT INTO public.repl_file_picking_rules (workstation_type, recording_group, "order", rule_type, operator, value, resolution,
                                            disable_changes, misc, uid, created, modified, modified_by)
VALUES ('FileMakerWorkstation', 'default', 4, 'date', '>', '2018-01-01', 'low3', false, null,
        '10f7e9b9-7511-45c4-a2bb-cfbc53a40573', '2021-02-18 17:41:31.281323', '2021-02-18 17:41:31.281323', 'sys');
