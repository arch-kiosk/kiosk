update {{locus}} set modified_by='' where lower(coalesce(modified_by,'')) = 'null' or modified_by is null;
update {{qc_flags}} set modified_by='' where lower(coalesce(modified_by,'')) = 'null' or modified_by is null;
update {{qc_rules}} set modified_by='' where lower(coalesce(modified_by,'')) = 'null' or modified_by is null;
