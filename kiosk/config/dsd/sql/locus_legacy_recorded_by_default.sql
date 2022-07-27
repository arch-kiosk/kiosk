update {{locus}} set recorded_by=modified_by where coalesce(recorded_by,'Null') = 'Null';

