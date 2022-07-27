update images set excavation_context = urap_get_fqid_from_cm_uid(collected_material_photo.uid_cm) from collected_material_photo 
where images.uid = collected_material_photo.uid_photo and images.table_context='collected_material_photo'

select excavation_context,  urap_get_fqid_from_cm_uid(collected_material_photo.uid_cm),table_context from collected_material_photo, images 
where images.uid = collected_material_photo.uid_photo and images.table_context='collected_material_photo'

select excavation_context from images
