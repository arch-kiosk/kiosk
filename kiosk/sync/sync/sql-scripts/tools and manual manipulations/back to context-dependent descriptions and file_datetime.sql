-- select those image records that belong to the datatable 
-- update those descriptions in the data-table that are empty or different than the description in images
update locus_relations dt set sketch_description = images.description 
-- select dt.sketch_description, images.description
-- from locus_relations dt, images 
from images
where dt.uid_sketch = images.uid 
and coalesce(dt.sketch_description, '') <> images.description

-- set the description of those image records that belong to the datatable records
-- to null, since they cannot be necessary anymore
update images set description = NULL 
-- select dt.sketcH_description, images.description
-- from locus_relations dt, images 
from locus_relations dt
 where images.uid = dt.uid_sketch 
 and coalesce(dt.sketch_description, '') = images.description

-- update file_datetime in images where it isn't set
-- 

update images set file_datetime=images.created where file_datetime is null

select * from  images where file_datetime is null