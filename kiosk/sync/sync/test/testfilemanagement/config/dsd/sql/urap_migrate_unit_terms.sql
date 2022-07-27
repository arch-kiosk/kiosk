update {{unit}} set term_for_unit='unit' where "type"='excavation';
update {{unit}} set term_for_unit='survey unit' where "type"='pedestrian survey';
update {{unit}} set term_for_unit='feature' where "type"='feature';
update {{unit}} set term_for_unit='unit' where term_for_unit is null;
update {{unit}} set term_for_locus='locus';
