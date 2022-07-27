truncate table file_identifier_cache;
-- identifier & uid_image & recording_context & uid_recording_context
-- unit - dayplan
insert into file_identifier_cache(identifier, uid_file, file_text, recording_context, uid_recording_context, "primary")
select img_records.* from (select unit.arch_context "identifier",
        dayplan.uid_image "uid_file",
        dayplan.image_description "file_text",
        'dayplan' "recording_context",
        dayplan.uid "uid_recording_context",
        1 "primary"
from unit
inner join dayplan on unit.uid = dayplan.uid_unit) img_records
    left outer join file_identifier_cache fic on
        fic.identifier = img_records.identifier and
        fic.uid_file = img_records.uid_file and
        fic.uid_recording_context = img_records.uid_recording_context
where img_records.identifier is not null
  and img_records.uid_file is not null and
      fic.uid is null;

-- unit - locus_photo
insert into file_identifier_cache(identifier, uid_file, file_text, recording_context, uid_recording_context)
select img_records.* from (select unit.arch_context "identifier",
        locus_photo.uid_image "uid_file",
        '' "file_text",
        'locus_photo' "recording_context",
        locus_photo.uid "uid_recording_context"
from unit
    inner join locus on unit.uid = locus.uid_unit
    inner join locus_photo on locus.uid = locus_photo.uid_locus) img_records
    left outer join file_identifier_cache fic on
        fic.identifier = img_records.identifier and
        fic.uid_file = img_records.uid_file and
        fic.uid_recording_context = img_records.uid_recording_context
where img_records.identifier is not null
  and img_records.uid_file is not null and
      fic.uid is null;

-- unit - relations.uid_locus
insert into file_identifier_cache(identifier, uid_file, file_text, recording_context, uid_recording_context)
select img_records.* from (select unit.arch_context "identifier",
        locus_relations.uid_sketch "uid_file",
        '' "file_text",
        'locus_relations' "recording_context",
        locus_relations.uid "uid_recording_context"
from unit
    inner join locus on unit.uid = locus.uid_unit
    inner join locus_relations on locus.uid = locus_relations.uid_locus
    ) img_records
    left outer join file_identifier_cache fic on
        fic.identifier = img_records.identifier and
        fic.uid_file = img_records.uid_file and
        fic.uid_recording_context = img_records.uid_recording_context
where img_records.identifier is not null
  and img_records.uid_file is not null and
      fic.uid is null;

-- unit - relations.uid_locus_2_related
insert into file_identifier_cache(identifier, uid_file, file_text, recording_context, uid_recording_context)
select img_records.* from (select unit.arch_context "identifier",
        locus_relations.uid_sketch "uid_file",
        '' "file_text",
        'locus_relations' "recording_context",
        locus_relations.uid "uid_recording_context"
from unit
    inner join locus on unit.uid = locus.uid_unit
    inner join locus_relations on locus.uid = locus_relations.uid_locus_2_related
    ) img_records
    left outer join file_identifier_cache fic on
        fic.identifier = img_records.identifier and
        fic.uid_file = img_records.uid_file and
        fic.uid_recording_context = img_records.uid_recording_context
where img_records.identifier is not null
  and img_records.uid_file is not null and
      fic.uid is null;


-- unit - collected_material_photo
insert into file_identifier_cache(identifier, uid_file, file_text, recording_context, uid_recording_context)
select img_records.* from (select unit.arch_context "identifier",
        collected_material_photo.uid_photo "uid_file",
        '' "file_text",
        'collected_material_photo' "recording_context",
        collected_material_photo.uid "uid_recording_context"
from unit
    inner join locus on unit.uid = locus.uid_unit
    inner join collected_material on locus.uid = collected_material.uid_locus
    inner join collected_material_photo on collected_material.uid = collected_material_photo.uid_cm
    ) img_records
    left outer join file_identifier_cache fic on
        fic.identifier = img_records.identifier and
        fic.uid_file = img_records.uid_file and
        fic.uid_recording_context = img_records.uid_recording_context
where img_records.identifier is not null
  and img_records.uid_file is not null and
      fic.uid is null;

-- locus - locus_photo
insert into file_identifier_cache(identifier, uid_file, file_text, recording_context, uid_recording_context, "primary")
select img_records.* from (
    select locus.arch_context "identifier",
        locus_photo.uid_image "uid_file",
        locus_photo.description "file_text",
        'locus_photo' "recording_context",
        locus_photo.uid "uid_recording_context",
           1 "primary"
from locus
    inner join locus_photo on locus.uid = locus_photo.uid_locus) img_records
    left outer join file_identifier_cache fic on
        fic.identifier = img_records.identifier and
        fic.uid_file = img_records.uid_file and
        fic.uid_recording_context = img_records.uid_recording_context
where img_records.identifier is not null
  and img_records.uid_file is not null and
      fic.uid is null;

-- locus - collected_material_photo
insert into file_identifier_cache(identifier, uid_file, file_text, recording_context, uid_recording_context)
select img_records.* from (select locus.arch_context "identifier",
        collected_material_photo.uid_photo "uid_file",
        '' "file_text",
        'collected_material_photo' "recording_context",
        collected_material_photo.uid "uid_recording_context"
from locus
    inner join collected_material on locus.uid = collected_material.uid_locus
    inner join collected_material_photo on collected_material.uid = collected_material_photo.uid_cm
    ) img_records
    left outer join file_identifier_cache fic on
        fic.identifier = img_records.identifier and
        fic.uid_file = img_records.uid_file and
        fic.uid_recording_context = img_records.uid_recording_context
where img_records.identifier is not null
  and img_records.uid_file is not null and
      fic.uid is null;

-- locus - relations.uid_locus
insert into file_identifier_cache(identifier, uid_file, file_text, recording_context, uid_recording_context, "primary")
select img_records.* from (select locus.arch_context "identifier",
        locus_relations.uid_sketch "uid_file",
        '' "file_text",
        'locus_relations' "recording_context",
        locus_relations.uid "uid_recording_context",
                                  1 "primary"
from locus
    inner join locus_relations on locus.uid = locus_relations.uid_locus
    ) img_records
    left outer join file_identifier_cache fic on
        fic.identifier = img_records.identifier and
        fic.uid_file = img_records.uid_file and
        fic.uid_recording_context = img_records.uid_recording_context
where img_records.identifier is not null
  and img_records.uid_file is not null and
      fic.uid is null;

-- locus - relations.uid_locus_2_related
insert into file_identifier_cache(identifier, uid_file, file_text, recording_context, uid_recording_context, "primary")
select img_records.* from (select locus.arch_context "identifier",
        locus_relations.uid_sketch "uid_file",
        '' "file_text",
        'locus_relations' "recording_context",
        locus_relations.uid "uid_recording_context",
                                  1 "primary"
from locus
    inner join locus_relations on locus.uid = locus_relations.uid_locus_2_related
    ) img_records
    left outer join file_identifier_cache fic on
        fic.identifier = img_records.identifier and
        fic.uid_file = img_records.uid_file and
        fic.uid_recording_context = img_records.uid_recording_context
where img_records.identifier is not null
  and img_records.uid_file is not null and
      fic.uid is null;

-- collected_material
insert into file_identifier_cache(identifier, uid_file, file_text, recording_context, uid_recording_context, "primary")
select img_records.* from (select collected_material.arch_context "identifier",
        collected_material_photo.uid_photo "uid_file",
        collected_material_photo.description "file_text",
        'collected_material_photo' "recording_context",
        collected_material_photo.uid "uid_recording_context",
                                  1 "primary"
from collected_material
    inner join collected_material_photo on collected_material.uid = collected_material_photo.uid_cm
    ) img_records
    left outer join file_identifier_cache fic on
        fic.identifier = img_records.identifier and
        fic.uid_file = img_records.uid_file and
        fic.uid_recording_context = img_records.uid_recording_context
where img_records.identifier is not null
  and img_records.uid_file is not null and
      fic.uid is null;

--- site_map
insert into file_identifier_cache(identifier, uid_file, file_text, recording_context, uid_recording_context, "primary")
select img_records.* from (select site.arch_context "identifier",
        site.uid_site_map "uid_file",
        site.purpose "file_text",
        'site' "recording_context",
        site.uid "uid_recording_context",
        1 "primary"
from site
    ) img_records
    left outer join file_identifier_cache fic on
        fic.identifier = img_records.identifier and
        fic.uid_file = img_records.uid_file and
        fic.uid_recording_context = img_records.uid_recording_context
where img_records.identifier is not null
  and img_records.uid_file is not null and
      fic.uid is null;

--- site_note_photo
insert into file_identifier_cache(identifier, uid_file, file_text, recording_context, uid_recording_context, "primary")
select img_records.* from (select site.arch_context "identifier",
        site_note_photo.uid_image "uid_file",
        '' "file_text",
        'site_note_photo' "recording_context",
        site.uid "uid_recording_context",
        1 "primary"
from site
    inner join site_notes on site.uid = site_notes.uid_site
    inner join site_note_photo on site_notes.uid = site_note_photo.uid_site_note
    ) img_records
    left outer join file_identifier_cache fic on
        fic.identifier = img_records.identifier and
        fic.uid_file = img_records.uid_file and
        fic.uid_recording_context = img_records.uid_recording_context
where img_records.identifier is not null
  and img_records.uid_file is not null and
      fic.uid is null;

-- locus-tag - locus_photo
insert into file_identifier_cache(identifier, uid_file, file_text, recording_context, uid_recording_context, "primary")
select img_records.* from (select tagging.tag "identifier",
        locus_photo.uid_image "uid_file",
        locus_photo.description "file_text",
        'locus_photo' "recording_context",
        locus_photo.uid "uid_recording_context",
        0 "primary"
from tagging
    inner join locus on tagging.source_uid = locus.uid
    inner join locus_photo on locus.uid = locus_photo.uid_locus
    where tagging.source_table = 'locus'
    ) img_records
    left outer join file_identifier_cache fic on
        fic.identifier = img_records.identifier and
        fic.uid_file = img_records.uid_file and
        fic.uid_recording_context = img_records.uid_recording_context
where img_records.identifier is not null
  and img_records.uid_file is not null and
      fic.uid is null;

-- locus-tag - collected_material_photo
insert into file_identifier_cache(identifier, uid_file, file_text, recording_context, uid_recording_context)
select img_records.* from (select tagging.tag "identifier",
        collected_material_photo.uid_photo "uid_file",
        '' "file_text",
        'collected_material_photo' "recording_context",
        collected_material_photo.uid "uid_recording_context"
from tagging
    inner join locus on tagging.source_uid = locus.uid
    inner join collected_material on locus.uid = collected_material.uid_locus
    inner join collected_material_photo on collected_material.uid = collected_material_photo.uid_cm
    where tagging.source_table = 'locus'
    ) img_records
    left outer join file_identifier_cache fic on
        fic.identifier = img_records.identifier and
        fic.uid_file = img_records.uid_file and
        fic.uid_recording_context = img_records.uid_recording_context
where img_records.identifier is not null
  and img_records.uid_file is not null and
      fic.uid is null;

-- locus-tag - locus_relations
insert into file_identifier_cache(identifier, uid_file, file_text, recording_context, uid_recording_context)
select img_records.* from (select tagging.tag "identifier",
        locus_relations.uid_sketch "uid_file",
        '' "file_text",
        'locus_relations' "recording_context",
        locus_relations.uid "uid_recording_context"
from tagging
    inner join locus on tagging.source_uid = locus.uid
    inner join locus_relations on locus.uid = locus_relations.uid_locus
    where tagging.source_table = 'locus'
    ) img_records
    left outer join file_identifier_cache fic on
        fic.identifier = img_records.identifier and
        fic.uid_file = img_records.uid_file and
        fic.uid_recording_context = img_records.uid_recording_context
where img_records.identifier is not null
  and img_records.uid_file is not null and
      fic.uid is null;

-- locus-tag - locus_relations2
insert into file_identifier_cache(identifier, uid_file, file_text, recording_context, uid_recording_context)
select img_records.* from (select tagging.tag "identifier",
        locus_relations.uid_sketch "uid_file",
        '' "file_text",
        'locus_relations' "recording_context",
        locus_relations.uid "uid_recording_context"
from tagging
    inner join locus on tagging.source_uid = locus.uid
    inner join locus_relations on locus.uid = locus_relations.uid_locus_2_related
    where tagging.source_table = 'locus'
    ) img_records
    left outer join file_identifier_cache fic on
        fic.identifier = img_records.identifier and
        fic.uid_file = img_records.uid_file and
        fic.uid_recording_context = img_records.uid_recording_context
where img_records.identifier is not null
  and img_records.uid_file is not null and
      fic.uid is null;
