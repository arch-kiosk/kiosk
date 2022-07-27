truncate table public.repl_file_picking_rules;

-- default is: Everything gets res. dummy,
--             contextuals get resolution low,
--             images with tag "site-map" get low, too.
INSERT INTO public.repl_file_picking_rules (workstation_type, recording_group, "order", rule_type, operator, value, resolution,
                                            disable_changes, misc, uid, created, modified, modified_by)
VALUES ('FileMakerWorkstation', 'default', 0, 'contextuals', null, null, 'low', false, null,
        'c1ad70a6-1e08-44ed-9f2c-bccb8be30fbd', '2021-02-18 17:41:31.281323', '2021-02-18 17:41:31.281323', 'sys');

INSERT INTO public.repl_file_picking_rules (workstation_type, recording_group, "order", rule_type, operator, value, resolution,
                                            disable_changes, misc, uid, created, modified, modified_by)
VALUES ('FileMakerWorkstation', 'default', 1, 'tag', '=', 'site-map', 'low', false, null,
        'c2ad70a6-1e08-44ed-9f2c-bccb8be30fbd', '2021-02-18 17:41:31.281323', '2021-02-18 17:41:31.281323', 'sys');

-- ceramicists: Everything gets res. dummy,
--             record_type "pottery_images" get resolution high,
--             images with tag "site-map" get res. high, too.

INSERT INTO public.repl_file_picking_rules (workstation_type, recording_group, "order", rule_type, operator, value, resolution,
                                            disable_changes, misc, uid, created, modified, modified_by)
VALUES ('FileMakerWorkstation', 'ceramicists', 0, 'all', null, null, 'dummy', false, null,
        'c3ad70a6-1e08-44ed-9f2c-bccb8be30fbd', '2021-02-18 17:41:31.281323', '2021-02-18 17:41:31.281323', 'sys');

INSERT INTO public.repl_file_picking_rules (workstation_type, recording_group, "order", rule_type, operator, value, resolution,
                                            disable_changes, misc, uid, created, modified, modified_by)
VALUES ('FileMakerWorkstation', 'ceramicists', 1, 'record_type', '=', 'pottery_images', 'high', false, null,
        'c4ad70a6-1e08-44ed-9f2c-bccb8be30fbd', '2021-02-18 17:41:31.281323', '2021-02-18 17:41:31.281323', 'sys');

INSERT INTO public.repl_file_picking_rules (workstation_type, recording_group, "order", rule_type, operator, value, resolution,
                                            disable_changes, misc, uid, created, modified, modified_by)
VALUES ('FileMakerWorkstation', 'ceramicists', 2, 'tag', '=', 'site-map', 'high', false, null,
        'c5ad70a6-1e08-44ed-9f2c-bccb8be30fbd', '2021-02-18 17:41:31.281323', '2021-02-18 17:41:31.281323', 'sys');
