delete from {{small_find}} where uid in (
select sf.uid from {{collected_material}} cm inner join {{small_find}} sf on cm.uid = sf.uid_cm
                             where cm.cm_type <> 'small_find' and sf.description is null and sf.material is null)