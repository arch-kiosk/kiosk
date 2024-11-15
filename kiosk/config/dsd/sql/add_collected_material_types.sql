-- time zone relevance
insert into {{collected_material_types}}(id, name, detail_record_type, layout_name, created,
                                     modified, modified_tz, modified_ww, modified_by)
select 'small_find', 'small find', 'small_find', 'collected_material',
       statement_timestamp(), statement_timestamp(), 0, statement_timestamp(), 'sys'
    from (select count(uid) c from {{collected_material_types}} where id='small_find') t where t.c=0;

insert into {{collected_material_types}}(id, name, layout_name, created,
                                     modified, modified_tz, modified_ww, modified_by)
select 'bulk', 'bulk', 'collected_material',
       statement_timestamp(), statement_timestamp(), 0, statement_timestamp(), 'sys'
    from (select count(uid) c from {{collected_material_types}} where id='bulk') t where t.c=0;

insert into {{collected_material_types}}(id, name, layout_name, created,
                                     modified, modified_tz, modified_ww, modified_by)
select 'sample', 'sample', 'collected_material',
       statement_timestamp(), statement_timestamp(), 0, statement_timestamp(), 'sys'
    from (select count(uid) c from {{collected_material_types}} where id='sample') t where t.c=0;


