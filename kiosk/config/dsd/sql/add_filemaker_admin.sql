-- This indeed uses public tables! It is not supposed to add the admin user to workstation tables.
-- Instead it makes sure that when workstation tables are forked there will always already be an admin.
-- time zone relevance

insert into excavator ("id", "name", "created", "modified", "modified_tz", "modified_ww", "modified_by", "properties")
select 'admin' "id", 'administrator' "admin",
    {NOW} "created",
    {NOW} "modified",
    0 "modified_tz",
    {NOW} "modified_ww",
    'sys' "modified_by", 'needs password'
where lower('admin') not in (select lower("id") from excavator)
