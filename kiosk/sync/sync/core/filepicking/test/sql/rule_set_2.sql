truncate table public.repl_file_picking_rules;

INSERT INTO public.repl_file_picking_rules (workstation_type, recording_group, "order", rule_type, operator, value, resolution,
                                            disable_changes, misc, uid, created, modified, modified_by)
VALUES ('FileMakerWorkstation', 'default', 0, 'contextuals', null, null, 'low', false, null,
        'c1ad70a6-1e08-44ed-9f2c-bccb8be30fbd', '2021-02-18 17:41:31.281323', '2021-02-18 17:41:31.281323', 'sys');

INSERT INTO public.repl_file_picking_rules (workstation_type, recording_group, "order", rule_type, operator, value, resolution,
                                            disable_changes, misc, uid, created, modified, modified_by)
VALUES ('FileMakerWorkstation', 'default', 1, 'tag', '=', 'site-map', 'low', false, null,
        'c2ad70a6-1e08-44ed-9f2c-bccb8be30fbd', '2021-02-18 17:41:31.281323', '2021-02-18 17:41:31.281323', 'sys');

INSERT INTO public.repl_file_picking_rules (workstation_type, recording_group, "order", rule_type, operator, value, resolution,
                                            disable_changes, misc, uid, created, modified, modified_by)
VALUES ('FileMakerWorkstation', 'ceramicists', 0, 'all', null, null, 'dummy', false, null,
        'c3ad70a6-1e08-44ed-9f2c-bccb8be30fbd', '2021-02-18 17:41:31.281323', '2021-02-18 17:41:31.281323', 'sys');

INSERT INTO public.repl_file_picking_rules (workstation_type, recording_group, "order", rule_type, operator, value, resolution,
                                            disable_changes, misc, uid, created, modified, modified_by)
VALUES ('FileMakerWorkstation', 'ceramicists', 1, 'record_type', '=', 'photos of sherds', 'high', false, null,
        'c4ad70a6-1e08-44ed-9f2c-bccb8be30fbd', '2021-02-18 17:41:31.281323', '2021-02-18 17:41:31.281323', 'sys');

INSERT INTO public.repl_file_picking_rules (workstation_type, recording_group, "order", rule_type, operator, value, resolution,
                                            disable_changes, misc, uid, created, modified, modified_by)
VALUES ('FileMakerWorkstation', 'ceramicists', 2, 'tag', '=', 'site-map', 'low', false, null,
        'c5ad70a6-1e08-44ed-9f2c-bccb8be30fbd', '2021-02-18 17:41:31.281323', '2021-02-18 17:41:31.281323', 'sys');

--
-- notin
--
INSERT INTO public.repl_file_picking_rules (workstation_type, recording_group, "order", rule_type, operator, value, resolution,
                                            disable_changes, misc, uid, created, modified, modified_by)
VALUES ('FileMakerWorkstation', 'notin', 0, 'all', null, null, 'low', false, null,
        '66086b9e-05d3-40ee-9101-118330fe2106', '2021-02-18 17:41:31.281323', '2021-02-18 17:41:31.281323', 'sys');

INSERT INTO public.repl_file_picking_rules (workstation_type, recording_group, "order", rule_type, operator, value, resolution,
                                            disable_changes, misc, uid, created, modified, modified_by)
VALUES ('FileMakerWorkstation', 'notin', 1, 'record_type', '!IN', 'pottery_images', 'dummy', false, null,
        '10a050de-b295-4de3-a1fb-77c8cc1864b2', '2021-02-18 17:41:31.281323', '2021-02-18 17:41:31.281323', 'sys');

INSERT INTO public.repl_file_picking_rules (workstation_type, recording_group, "order", rule_type, operator, value, resolution,
                                            disable_changes, misc, uid, created, modified, modified_by)
VALUES ('FileMakerWorkstation', 'notin', 2, 'tag', '=', 'site-map', 'high', false, null,
        'edd6070d-d71d-433c-ae8f-663352d14d28', '2021-02-18 17:41:31.281323', '2021-02-18 17:41:31.281323', 'sys');
