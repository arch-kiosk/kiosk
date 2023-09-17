INSERT INTO {{repl_file_picking_rules}} (workstation_type, recording_group, "order", rule_type, operator, value,
                                            resolution, disable_changes, misc, uid, created, modified, modified_by)
select 'FileExportWorkstation',
       'default',
       0,
       'contextuals',
       null,
       null,
       'low',
       false,
       null,
       '5e730f79-daa9-43be-b613-93f03273eb76',
       now(),
       now(),
       'sys'
where not exists(select uid
                 from {{repl_file_picking_rules}}
                 where upper(recording_group) = 'DEFAULT'
                   and ("order" = 0 or upper("rule_type") = 'CONTEXTUALS'));

INSERT INTO {{repl_file_picking_rules}} (workstation_type, recording_group, "order", rule_type, operator, value,
                                            resolution, disable_changes, misc, uid, created, modified, modified_by)
select 'FileExportWorkstation',
       'default',
       10,
       'TAG',
       'IN',
       'map',
       'low',
       false,
       null,
       'a25e7965-1083-4eca-ad66-015c30eae6f2',
       now(),
       now(),
       'sys'
where not exists(select uid from {{repl_file_picking_rules}} where upper(recording_group) = 'DEFAULT'
                   and upper("rule_type") = 'TAG' and "value" = 'map');
