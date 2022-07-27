update {{collected_material}} cm
    set description = cm.description || sf.description
from {{small_find}} sf
where coalesce(cm_type, '') = 'small_find' and coalesce(sf.description,'')<>''
  and cm.uid=sf.uid_cm;

update {{small_find}}
    set description = null;
