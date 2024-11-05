update {{locus}}
set "arch_domain"=trim(split_part(arch_context, '-', 1)), "id"= to_number(trim(split_part(arch_context, '-', 2)), '9999999')::int
where "arch_context" is not null and trim(split_part("arch_context", '-', 2)) ~ '[0-9]+' and "arch_context" is not null and split_part("arch_context", '-', 1) <> '' and trim(split_part("arch_context", '-', 2)) <> '';
