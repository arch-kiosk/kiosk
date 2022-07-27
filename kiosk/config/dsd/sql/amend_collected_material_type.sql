update {{collected_material}}
    set cm_type = 'small_find'
where {{collected_material}}.cm_type is null and coalesce({{collected_material}}.isObject,0)=1;

update {{collected_material}}
    set cm_type = 'bulk'
where {{collected_material}}.cm_type is null and coalesce({{collected_material}}.isObject, 0)=0;
