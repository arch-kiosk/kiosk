update {{locus_relations}}
set chronology='later than'
where coalesce(chronology, '') = ''
  and type in (
               'above',
               'abuts',
               'seals',
               'cuts through',
               'fills');

update {{locus_relations}}
set chronology='earlier than'
where coalesce(chronology, '') = ''
  and type in (
               'below',
               'is abutted by',
               'is sealed by',
               'cut by',
               'is filled by');

update {{locus_relations}}
set chronology='same time as'
where coalesce(chronology, '') = ''
  and type in (
               'equals');


