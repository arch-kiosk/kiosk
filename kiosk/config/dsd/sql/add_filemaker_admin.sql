-- This indeed uses public tables! It is not supposed to add the admin user to workstation tables.
-- Instead it makes sure that when workstation tables are forked there will always already be an admin.

insert into excavator ("id", "name", "created", "modified", "modified_by", "properties")
select 'admin' "id", 'administrator' "admin",
    {NOW} "created",
    {NOW} "modified", 'sys' "modified_by", 'needs password'
where lower('admin') not in (select lower("id") from excavator)
