update {{site}} set arch_domain = Null, arch_context={{site}}.id;

update {{unit}} set arch_domain = Null, arch_context={{unit}}.id;

update {{locus}}
    set arch_domain = {{unit}}.id, arch_context = CONCAT({{unit}}.id, '-', LPAD({{locus}}.id::VARCHAR, 3, '0'))
    from {{unit}} where {{locus}}.uid_unit = {{unit}}.uid;

update {{collected_material}}
    set arch_domain = {{locus}}.arch_context,
        arch_context=CONCAT({{locus}}.arch_context, '-', {{collected_material}}.id::VARCHAR)
    from {{locus}} where {{collected_material}}.uid_locus = {{locus}}.uid;

update {{pottery}} set arch_domain = {{pottery}}.pottery_number_prefix,
                   arch_context=REPLACE(CONCAT({{pottery}}.pottery_number_prefix, '-', {{pottery}}.pottery_number::VARCHAR), '--', '-')
    where coalesce({{pottery}}.pottery_number, 0)>0;

