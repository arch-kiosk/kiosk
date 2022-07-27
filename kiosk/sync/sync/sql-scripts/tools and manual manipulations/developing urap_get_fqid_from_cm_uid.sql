drop function urap_get_fqid_from_cm_uid(uuid);
create or replace function urap_get_fqid_from_cm_uid(uuid) returns text as
$$
declare
	cm_uid alias for $1;
	rc text;
begin
	select into rc replace(format('%s-%3s-%s', unit.id, locus.id, collected_material.id),' ','0') 
		from collected_material 
		  inner join locus on locus.uid = collected_material.uid_locus
		  inner join unit on locus.uid_unit = unit.uid
		where collected_material.uid=cm_uid; 
	return rc;
end;
$$
LANGUAGE plpgsql;

select urap_get_fqid_from_cm_uid('7588a410-6ba1-4e34-a965-746dae3563b7') a;

select uid_locus from collected_material where uid='556e3dda-57ed-3148-b1cd-0446c41a9638'