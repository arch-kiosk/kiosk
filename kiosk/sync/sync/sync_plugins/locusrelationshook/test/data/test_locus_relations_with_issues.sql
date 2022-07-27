with
relation_types as (
    select * from unnest(
        Array['above','below','abuts','is abutted by','bonds with','seals',
        'is sealed by','cuts through','cut by','fills','is filled by','is adjacent to'],
        Array['below','above','is abutted by','abuts','bonds with','is sealed by',
        'seals','cut by','cuts through','is filled by','fills','is adjacent to']) as relation_types("r1","r2")
    )
select r1.uid, locus.arch_context, relation_types.r1, related_locus.arch_context from locus_relations r1
--     inner join locus_relations r2
--     on r1.uid_locus = r2.uid_locus_2_related and
--        r1.uid_locus_2_related = r2.uid_locus
    left outer join relation_types on r1.type = relation_types.r1
    left outer join locus on r1.uid_locus = locus.uid
    left outer join locus related_locus on r1.uid_locus_2_related = related_locus.uid
where r1.uid not in (
    select r1.uid
    from locus_relations r1
             inner join relation_types on r1.type = relation_types.r1
             inner join locus_relations r2
                        on r1.uid_locus = r2.uid_locus_2_related and
                           r1.uid_locus_2_related = r2.uid_locus and
                           r2.type = relation_types.r2
             inner join locus on r1.uid_locus = locus.uid and r2.type = relation_types.r2
             inner join locus related_locus on r1.uid_locus_2_related = related_locus.uid
);
