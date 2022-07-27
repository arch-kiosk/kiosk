
delete from collected_material where uid in (
select urapids.cm_uid from (
select collected_material.uid as cm_uid, unit.id || '-' || locus.id || '-' || collected_material.id as urapid from collected_material 
inner join locus on collected_material.uid_locus = locus.uid
inner join unit on locus.uid_unit = unit.uid
) as urapids 
where urapids.urapid='EC-26-9' or urapids.urapid='EC-26-10'
) 


