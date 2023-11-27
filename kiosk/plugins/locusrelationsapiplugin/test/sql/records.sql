INSERT INTO public.unit (id, name, purpose, type, method, id_excavator, unit_creation_date, id_site,
                         excavator_full_name, spider_counter, coordinates, legacy_unit_id, uid, created, modified,
                         modified_by, repl_deleted, repl_tag, term_for_unit, term_for_locus, identification_method_loci,
                         identification_method_cm, identification_method_analysis, arch_domain, arch_context)
VALUES (null, null, e'Area H will be a 10 x 4 m trench off the northwestern side of the nuraghe, between towers 5 and 6, extending 10 m from the straight section of the antemurale. The goal in excavating this area is to determine whether the fossa discovered in Area E continues around the nuraghe, as the geophysics suggests.

', 'excavation', 'locus recording', 'AES', '2022-05-24', 'Nuraghe S''Urachi', null, null, null, null,
        'a450d92b-3459-4070-bd03-a2513a3bc326', '2022-05-24 22:09:24.000000', '2023-06-04 16:14:35.000000', 'AES',
        false, null, 'area', 'Strat.Unit', null, null, null, null, 'H');



INSERT INTO public.locus (uid_unit, id, type, "opening elevations", "closing elevations", description, date_defined,
                          date_closed, interpretation, colour, uid, created, modified, modified_by, repl_deleted,
                          repl_tag, formation_process, arch_domain, arch_context, recorded_by, elevation_opening_nw,
                          elevation_opening_ne, elevation_opening_sw, elevation_opening_se, elevation_closing_nw,
                          elevation_closing_ne, elevation_closing_sw, elevation_closing_se, elevation_opening_ct,
                          elevation_closing_ct, width, length, depth, volume, datum_point_elevation, excavated_with,
                          alternate_id)
VALUES ('a450d92b-3459-4070-bd03-a2513a3bc326', 2, 'ac', null, null, e'L-shaped feature composed of medium and large basalt stones. One side runs NE-SW for approximately 308 cm starting at the NE baulk of the area. It then breaks for 80 cm and picks up again with one stone on the SW baulk of the area. This side continues to the SW outside of Area H. The other side runs NW-SE along the NE baulk of Area H. This side is currently 260 cm in length, with a space of approximately 140cm between its visible end and the wall of the nuraghe (SU22-H001).

The NW-SE stretch of the feature is abutted by SU22-H000 and SU22-H003. It is cut by SU22-H006 and a large jumble of stones in the fill (SU22-H005) suggests that, prior to the cut, it reached the antemurale. And it sits on top of SU22-H007. This stretch of the feature appears to abut, but not bond with the NE-SW stretch of the feature.

The NE-SW stretch of the feature is abutted by SU22-H000, SU22-H003, SU22-H007, SU22-H012, SU22-H013, SU22-H015, SU22-H016, and SU22-H017.',
        '2022-06-26', null,
        '2 drystone walls of a structure dating to the Roman period or later (see Dressel amphora rim found beneath wall). The NE-SW stretch of wall predates the NW-SE stretch of wall (see their differing relationships with SU22-H007).',
        null, '64905a74-c2a5-4b93-854b-a540b469c7f1', '2022-06-26 04:32:38.000000', '2022-07-28 05:41:53.000000', 'AES',
        false, null, 'anthropogenic', 'H', 'SU22-H002', 'AES', null, null, null, null, null, null, null, null, null,
        null, null, null, null, null, null, null, null);
INSERT INTO public.locus (uid_unit, id, type, "opening elevations", "closing elevations", description, date_defined,
                          date_closed, interpretation, colour, uid, created, modified, modified_by, repl_deleted,
                          repl_tag, formation_process, arch_domain, arch_context, recorded_by, elevation_opening_nw,
                          elevation_opening_ne, elevation_opening_sw, elevation_opening_se, elevation_closing_nw,
                          elevation_closing_ne, elevation_closing_sw, elevation_closing_se, elevation_opening_ct,
                          elevation_closing_ct, width, length, depth, volume, datum_point_elevation, excavated_with,
                          alternate_id)
VALUES ('a450d92b-3459-4070-bd03-a2513a3bc326', 0, 'dp', null, null,
        'Topsoil. Loose, grayish-brown silty soil. Full of roots; also inclusions of sporadic medium-sized stones. Contains primarily ceramics from the second half of the first millennium BCE, but also sporadic bones, and a few pieces of modern glass and plastic.',
        '2022-06-25', '2022-06-27', 'Topsoil', 'grayish-brown', 'de06ade4-6afe-4b60-b331-4ffee5c06d8c',
        '2022-06-25 07:49:40.000000', '2022-07-24 03:33:31.000000', 'AES', false, null, null, 'H', 'SU22-H000', 'AES',
        null, null, null, null, null, null, null, null, null, null, 4000, 10000, null, null, null, null, null);
INSERT INTO public.locus (uid_unit, id, type, "opening elevations", "closing elevations", description, date_defined,
                          date_closed, interpretation, colour, uid, created, modified, modified_by, repl_deleted,
                          repl_tag, formation_process, arch_domain, arch_context, recorded_by, elevation_opening_nw,
                          elevation_opening_ne, elevation_opening_sw, elevation_opening_se, elevation_closing_nw,
                          elevation_closing_ne, elevation_closing_sw, elevation_closing_se, elevation_opening_ct,
                          elevation_closing_ct, width, length, depth, volume, datum_point_elevation, excavated_with,
                          alternate_id)
VALUES ('a450d92b-3459-4070-bd03-a2513a3bc326', 7, 'dp', null, null, e'Un estrato de color marrón rojizo con abundantes concreciones amarillas, muy bien definido por la presences de carbón y plaster blanca
Compacto', '2022-07-02', '2022-07-07', null, null, '4058a1e2-257c-4137-97ef-7e3ef902eab2', '2022-07-02 03:35:56.000000',
        '2022-07-28 06:38:29.000000', 'AES', false, null, null, 'H', 'SU22-H007', 'LMB', null, null, null, null, null,
        null, null, null, null, null, null, null, null, null, null, null, null);
INSERT INTO public.locus (uid_unit, id, type, "opening elevations", "closing elevations", description, date_defined,
                          date_closed, interpretation, colour, uid, created, modified, modified_by, repl_deleted,
                          repl_tag, formation_process, arch_domain, arch_context, recorded_by, elevation_opening_nw,
                          elevation_opening_ne, elevation_opening_sw, elevation_opening_se, elevation_closing_nw,
                          elevation_closing_ne, elevation_closing_sw, elevation_closing_se, elevation_opening_ct,
                          elevation_closing_ct, width, length, depth, volume, datum_point_elevation, excavated_with,
                          alternate_id)
VALUES ('a450d92b-3459-4070-bd03-a2513a3bc326', 3, 'dp', null, null,
        'Compact light greyish-brown silty soil with pebbles and roots. Significant bioturbation from roots of fennel, thistles, etc. Large quantities of ancient pottery ranging in size from small to large.',
        '2022-06-27', '2022-07-01', 'Topsoil', 'grayish-brow ', '769c19c9-1f0a-4df5-9c47-69c420576336',
        '2022-06-27 02:36:50.000000', '2022-07-28 05:50:03.000000', 'AES', false, null, null, 'H', 'SU22-H003', 'AES',
        null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null);
INSERT INTO public.locus (uid_unit, id, type, "opening elevations", "closing elevations", description, date_defined,
                          date_closed, interpretation, colour, uid, created, modified, modified_by, repl_deleted,
                          repl_tag, formation_process, arch_domain, arch_context, recorded_by, elevation_opening_nw,
                          elevation_opening_ne, elevation_opening_sw, elevation_opening_se, elevation_closing_nw,
                          elevation_closing_ne, elevation_closing_sw, elevation_closing_se, elevation_opening_ct,
                          elevation_closing_ct, width, length, depth, volume, datum_point_elevation, excavated_with,
                          alternate_id)
VALUES ('a450d92b-3459-4070-bd03-a2513a3bc326', 6, 'cu', null, null,
        'Cut filled by SU22-H005. Adjacent to the nuraghe wall (SU22-H001) and irregular in shape. The eastern end of the cut contains an accumulation of large stones that were likely dislodged from SU22-H002 when the cut was made.',
        '2022-07-01', '2022-07-02',
        'Cut excavated by Lilliu when he exposed the walls of the antemurale. Interpretation supported by the piece of rebar sticking out the section horizontally into the cut.',
        null, 'a6490717-059e-4db8-8796-7ececb87acec', '2022-07-01 04:52:00.000000', '2022-07-28 06:09:32.000000', 'AES',
        false, null, 'anthropogenic', 'H', 'SU22-H006', 'AES', null, null, null, null, null, null, null, null, null,
        null, null, null, null, null, null, null, null);
INSERT INTO public.locus (uid_unit, id, type, "opening elevations", "closing elevations", description, date_defined,
                          date_closed, interpretation, colour, uid, created, modified, modified_by, repl_deleted,
                          repl_tag, formation_process, arch_domain, arch_context, recorded_by, elevation_opening_nw,
                          elevation_opening_ne, elevation_opening_sw, elevation_opening_se, elevation_closing_nw,
                          elevation_closing_ne, elevation_closing_sw, elevation_closing_se, elevation_opening_ct,
                          elevation_closing_ct, width, length, depth, volume, datum_point_elevation, excavated_with,
                          alternate_id)
VALUES ('a450d92b-3459-4070-bd03-a2513a3bc326', 17, 'dp', null, null, 'Not excavated in 2022', null, null, null, null,
        '9d104fc7-d66d-4aa4-9c03-390882143e0a', '2022-07-12 03:33:32.000000', '2022-07-28 08:30:29.000000', 'AES',
        false, null, null, 'H', 'SU22-H017', 'AES', null, null, null, null, null, null, null, null, null, null, null,
        null, null, null, null, null, null);
INSERT INTO public.locus (uid_unit, id, type, "opening elevations", "closing elevations", description, date_defined,
                          date_closed, interpretation, colour, uid, created, modified, modified_by, repl_deleted,
                          repl_tag, formation_process, arch_domain, arch_context, recorded_by, elevation_opening_nw,
                          elevation_opening_ne, elevation_opening_sw, elevation_opening_se, elevation_closing_nw,
                          elevation_closing_ne, elevation_closing_sw, elevation_closing_se, elevation_opening_ct,
                          elevation_closing_ct, width, length, depth, volume, datum_point_elevation, excavated_with,
                          alternate_id)
VALUES ('a450d92b-3459-4070-bd03-a2513a3bc326', 15, 'dp', null, null,
        'Hard, whiteish-grey layer that comes up in a crust with multiple layers in each chunk: very hard whiteish-grey layers on the top and bottom with a softer, very fine layer that includes charcoal, ash, and small pieces of pink material (mudbrick?). The layer is not of a uniform thickness, and is much thicker in the E corner and thinner in the S corner. Sitting on top of this layer in two small places were a very flat hard plaster layer, suggesting that 015 is a floor preparation layer.',
        '2022-07-10', '2022-07-12', 'Likely a floor preparation layer', 'whiteish-grey',
        '28d00a9c-de55-4fdc-92d0-8ee47dad8687', '2022-07-07 05:29:31.000000', '2022-07-12 11:45:08.000000', 'AES',
        false, null, null, 'H', 'SU22-H015', 'AES', null, null, null, null, null, null, null, null, null, null, null,
        null, null, null, null, null, null);
INSERT INTO public.locus (uid_unit, id, type, "opening elevations", "closing elevations", description, date_defined,
                          date_closed, interpretation, colour, uid, created, modified, modified_by, repl_deleted,
                          repl_tag, formation_process, arch_domain, arch_context, recorded_by, elevation_opening_nw,
                          elevation_opening_ne, elevation_opening_sw, elevation_opening_se, elevation_closing_nw,
                          elevation_closing_ne, elevation_closing_sw, elevation_closing_se, elevation_opening_ct,
                          elevation_closing_ct, width, length, depth, volume, datum_point_elevation, excavated_with,
                          alternate_id)
VALUES ('a450d92b-3459-4070-bd03-a2513a3bc326', 25, 'dp', null, null,
        'Soft, loose, dark grayish-brown fill of cut SU22-H026. Soil is a silty clay with small pebble inclusions. Contains some pieces of pottery.',
        '2022-07-22', null, null, null, '6fbd50a5-70cf-450f-ac66-9174ada4dc73', '2022-07-22 01:49:09.000000',
        '2022-07-22 03:27:50.000000', 'AES', false, null, null, 'H', 'SU22-H025', 'AES', null, null, null, null, null,
        null, null, null, null, null, null, null, null, null, null, null, null);
INSERT INTO public.locus (uid_unit, id, type, "opening elevations", "closing elevations", description, date_defined,
                          date_closed, interpretation, colour, uid, created, modified, modified_by, repl_deleted,
                          repl_tag, formation_process, arch_domain, arch_context, recorded_by, elevation_opening_nw,
                          elevation_opening_ne, elevation_opening_sw, elevation_opening_se, elevation_closing_nw,
                          elevation_closing_ne, elevation_closing_sw, elevation_closing_se, elevation_opening_ct,
                          elevation_closing_ct, width, length, depth, volume, datum_point_elevation, excavated_with,
                          alternate_id)
VALUES ('a450d92b-3459-4070-bd03-a2513a3bc326', 26, 'cu', null, null, 'Narrow winding cut through pebble surface',
        '2022-07-22', null,
        'Crack between an older pebble surface (SU22-H027/SU23-H030) and its repair (SU22- H024/SU23-H029)', null,
        '9102721f-742a-45d2-a327-b7783f42fc09', '2022-07-22 01:49:52.000000', '2023-07-28 09:24:37.000000', 'AES',
        false, null, null, 'H', 'SU22-H026', 'AES', null, null, null, null, null, null, null, null, null, null, null,
        null, null, null, null, null, null);
INSERT INTO public.locus (uid_unit, id, type, "opening elevations", "closing elevations", description, date_defined,
                          date_closed, interpretation, colour, uid, created, modified, modified_by, repl_deleted,
                          repl_tag, formation_process, arch_domain, arch_context, recorded_by, elevation_opening_nw,
                          elevation_opening_ne, elevation_opening_sw, elevation_opening_se, elevation_closing_nw,
                          elevation_closing_ne, elevation_closing_sw, elevation_closing_se, elevation_opening_ct,
                          elevation_closing_ct, width, length, depth, volume, datum_point_elevation, excavated_with,
                          alternate_id)
VALUES ('a450d92b-3459-4070-bd03-a2513a3bc326', 13, 'dp', null, null,
        'Concentration of large amphora and tile fragments, lying largely horizontally', '2022-07-10', '2022-07-12',
        null, null, '05594aa5-1c66-482e-8349-571d2fe4429c', '2022-07-07 05:28:42.000000', '2022-07-28 08:34:12.000000',
        'AES', false, null, null, 'H', 'SU22-H013', 'AES', null, null, null, null, null, null, null, null, null, null,
        null, null, null, null, null, null, null);
INSERT INTO public.locus (uid_unit, id, type, "opening elevations", "closing elevations", description, date_defined,
                          date_closed, interpretation, colour, uid, created, modified, modified_by, repl_deleted,
                          repl_tag, formation_process, arch_domain, arch_context, recorded_by, elevation_opening_nw,
                          elevation_opening_ne, elevation_opening_sw, elevation_opening_se, elevation_closing_nw,
                          elevation_closing_ne, elevation_closing_sw, elevation_closing_se, elevation_opening_ct,
                          elevation_closing_ct, width, length, depth, volume, datum_point_elevation, excavated_with,
                          alternate_id)
VALUES ('a450d92b-3459-4070-bd03-a2513a3bc326', 12, 'dp', null, null,
        'Loose, very fine (powdery/ashy) soil, mottled dark grey and bright orange in color. Irregular surface level. Very few artifacts. ',
        '2022-07-08', '2022-07-10', 'mudbrick collapse', 'dark grey and bright orange',
        '1eb37ded-0ce3-4cb5-91b1-a27f1e9b5190', '2022-07-07 05:27:46.000000', '2022-07-28 07:00:46.000000', 'AES',
        false, null, 'anthropogenic', 'H', 'SU22-H012', 'AES', null, null, null, null, null, null, null, null, null,
        null, null, null, null, null, null, null, null);
INSERT INTO public.locus (uid_unit, id, type, "opening elevations", "closing elevations", description, date_defined,
                          date_closed, interpretation, colour, uid, created, modified, modified_by, repl_deleted,
                          repl_tag, formation_process, arch_domain, arch_context, recorded_by, elevation_opening_nw,
                          elevation_opening_ne, elevation_opening_sw, elevation_opening_se, elevation_closing_nw,
                          elevation_closing_ne, elevation_closing_sw, elevation_closing_se, elevation_opening_ct,
                          elevation_closing_ct, width, length, depth, volume, datum_point_elevation, excavated_with,
                          alternate_id)
VALUES ('a450d92b-3459-4070-bd03-a2513a3bc326', 23, 'dp', null, null,
        'Medium brown, sandy, soft and loose soil with abundant charcoal inclusions. Varying levels of compaction with the middle of the context being looser that the portions on the edges. Contains relatively abundant pottery (roughly 4th-3rd centuries BCE) but little animal bone. Location to the NW of SU22-H022.',
        '2022-07-17', '2022-07-20', null, null, '3c43e784-291b-44f7-8b72-401344b67c5b', '2022-07-15 05:13:48.000000',
        '2022-07-28 09:24:25.000000', 'AES', false, null, null, 'H', 'SU22-H023', 'AES', null, null, null, null, null,
        null, null, null, null, null, null, null, null, null, null, null, null);
INSERT INTO public.locus (uid_unit, id, type, "opening elevations", "closing elevations", description, date_defined,
                          date_closed, interpretation, colour, uid, created, modified, modified_by, repl_deleted,
                          repl_tag, formation_process, arch_domain, arch_context, recorded_by, elevation_opening_nw,
                          elevation_opening_ne, elevation_opening_sw, elevation_opening_se, elevation_closing_nw,
                          elevation_closing_ne, elevation_closing_sw, elevation_closing_se, elevation_opening_ct,
                          elevation_closing_ct, width, length, depth, volume, datum_point_elevation, excavated_with,
                          alternate_id)
VALUES ('a450d92b-3459-4070-bd03-a2513a3bc326', 20, 'dp', null, null,
        'Very thin, loose layer; dark brown with many black, highly organic patches. Lots of little roots coming through. In the W corner of Area H.',
        '2022-07-13', '2022-07-13', null, null, '5f65af9a-b09e-402d-a85e-591500f71031', '2022-07-13 03:40:55.000000',
        '2022-07-28 09:07:32.000000', 'AES', false, null, null, 'H', 'SU22-H020', 'AES', null, null, null, null, null,
        null, null, null, null, null, null, null, null, null, null, null, null);
INSERT INTO public.locus (uid_unit, id, type, "opening elevations", "closing elevations", description, date_defined,
                          date_closed, interpretation, colour, uid, created, modified, modified_by, repl_deleted,
                          repl_tag, formation_process, arch_domain, arch_context, recorded_by, elevation_opening_nw,
                          elevation_opening_ne, elevation_opening_sw, elevation_opening_se, elevation_closing_nw,
                          elevation_closing_ne, elevation_closing_sw, elevation_closing_se, elevation_opening_ct,
                          elevation_closing_ct, width, length, depth, volume, datum_point_elevation, excavated_with,
                          alternate_id)
VALUES ('a450d92b-3459-4070-bd03-a2513a3bc326', 9, 'cu', null, null,
        'Irregular cut filled with very loose fine soil (SU22-H008). Cuts SU22-H004. Located in the W corner of Area H. Cut is approximately 87 x 56 cm and 14 cm deep, although it continues into both the NW and SW baulks. ',
        '2022-07-03', '2022-07-03', null, null, '64fc871b-dd5d-4ee6-ad54-94a151747c62', '2022-07-03 04:50:38.000000',
        '2022-07-28 06:29:08.000000', 'AES', false, null, null, 'H', 'SU22-H009', 'AES', null, null, null, null, null,
        null, null, null, null, null, null, null, null, null, null, null, null);
INSERT INTO public.locus (uid_unit, id, type, "opening elevations", "closing elevations", description, date_defined,
                          date_closed, interpretation, colour, uid, created, modified, modified_by, repl_deleted,
                          repl_tag, formation_process, arch_domain, arch_context, recorded_by, elevation_opening_nw,
                          elevation_opening_ne, elevation_opening_sw, elevation_opening_se, elevation_closing_nw,
                          elevation_closing_ne, elevation_closing_sw, elevation_closing_se, elevation_opening_ct,
                          elevation_closing_ct, width, length, depth, volume, datum_point_elevation, excavated_with,
                          alternate_id)
VALUES ('a450d92b-3459-4070-bd03-a2513a3bc326', 19, 'dp', null, null,
        'Hard, light grayish-yellow in color, high concentration of pebbles and small stones (c. 5 cm). Contains a significant amount of pottery and large pieces of bone.',
        '2022-07-13', '2022-07-14', null, 'Light grayish-yellow', 'a31f66e9-f9f0-4423-9480-ebc749753f8e',
        '2022-07-12 03:33:38.000000', '2022-07-28 09:07:20.000000', 'AES', false, null, null, 'H', 'SU22-H019', 'AES',
        null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null);
INSERT INTO public.locus (uid_unit, id, type, "opening elevations", "closing elevations", description, date_defined,
                          date_closed, interpretation, colour, uid, created, modified, modified_by, repl_deleted,
                          repl_tag, formation_process, arch_domain, arch_context, recorded_by, elevation_opening_nw,
                          elevation_opening_ne, elevation_opening_sw, elevation_opening_se, elevation_closing_nw,
                          elevation_closing_ne, elevation_closing_sw, elevation_closing_se, elevation_opening_ct,
                          elevation_closing_ct, width, length, depth, volume, datum_point_elevation, excavated_with,
                          alternate_id)
VALUES ('a450d92b-3459-4070-bd03-a2513a3bc326', 8, 'dp', null, null,
        'Very fine sandy silt, reddish-brown in color, and extremely loose. Pebble and small stone inclusions and moderate amounts of ceramic and bone. Fills cut SU22-H009.',
        '2022-07-03', '2022-07-03', 'Fill of a tree pit or some other natural feature', 'Reddish brown',
        'bd5f2af7-e017-4125-9ff5-02cd15c89e63', '2022-07-03 04:50:04.000000', '2022-07-28 06:27:08.000000', 'AES',
        false, null, null, 'H', 'SU22-H008', 'AES', null, null, null, null, null, null, null, null, null, null, null,
        null, null, null, null, null, null);
INSERT INTO public.locus (uid_unit, id, type, "opening elevations", "closing elevations", description, date_defined,
                          date_closed, interpretation, colour, uid, created, modified, modified_by, repl_deleted,
                          repl_tag, formation_process, arch_domain, arch_context, recorded_by, elevation_opening_nw,
                          elevation_opening_ne, elevation_opening_sw, elevation_opening_se, elevation_closing_nw,
                          elevation_closing_ne, elevation_closing_sw, elevation_closing_se, elevation_opening_ct,
                          elevation_closing_ct, width, length, depth, volume, datum_point_elevation, excavated_with,
                          alternate_id)
VALUES ('a450d92b-3459-4070-bd03-a2513a3bc326', 18, 'dp', null, null,
        'Dark brown, compact, clayey soil with inclusions of charcoal and pebbles, along with a high concentration of medium-sized (approx. 10-30 cm) stones. Large quantities of ceramic and animal bone.',
        '2022-07-13', '2022-07-15', 'Fill layer', null, 'c22676f5-fcfd-4e35-ab69-342202ad083e',
        '2022-07-12 03:33:37.000000', '2022-07-28 09:17:46.000000', 'AES', false, null, null, 'H', 'SU22-H018', 'AES',
        null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null);
INSERT INTO public.locus (uid_unit, id, type, "opening elevations", "closing elevations", description, date_defined,
                          date_closed, interpretation, colour, uid, created, modified, modified_by, repl_deleted,
                          repl_tag, formation_process, arch_domain, arch_context, recorded_by, elevation_opening_nw,
                          elevation_opening_ne, elevation_opening_sw, elevation_opening_se, elevation_closing_nw,
                          elevation_closing_ne, elevation_closing_sw, elevation_closing_se, elevation_opening_ct,
                          elevation_closing_ct, width, length, depth, volume, datum_point_elevation, excavated_with,
                          alternate_id)
VALUES ('a450d92b-3459-4070-bd03-a2513a3bc326', 10, 'dp', null, null,
        'Dark brown, very compact, clayey soil with small flecks of charcoal, as well as pebbles and small- and medium-sized stones. Relatively abundant quantities of pottery (although less than SU22-H004), and large quantities of animal bones. Artifacts concentrated in the middle of the context (less abundant close to SU22-002).',
        '2022-07-08', '2022-07-12', 'Fill layer', 'dark brown', 'cd593a56-e9f0-42b6-8dc2-4c0f556c5ed3',
        '2022-07-07 05:26:23.000000', '2022-07-28 07:00:17.000000', 'AES', false, null, null, 'H', 'SU22-H010', 'AES',
        null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null);
INSERT INTO public.locus (uid_unit, id, type, "opening elevations", "closing elevations", description, date_defined,
                          date_closed, interpretation, colour, uid, created, modified, modified_by, repl_deleted,
                          repl_tag, formation_process, arch_domain, arch_context, recorded_by, elevation_opening_nw,
                          elevation_opening_ne, elevation_opening_sw, elevation_opening_se, elevation_closing_nw,
                          elevation_closing_ne, elevation_closing_sw, elevation_closing_se, elevation_opening_ct,
                          elevation_closing_ct, width, length, depth, volume, datum_point_elevation, excavated_with,
                          alternate_id)
VALUES ('a450d92b-3459-4070-bd03-a2513a3bc326', 4, 'dp', null, null,
        'Semi-compact reddish brown soil (sandy clay) with inclusions of charcoal and plaster specks. There are thin roots and small voids in the soil. Contains large quantities of pottery.',
        '2022-07-01', '2022-07-07', 'Fill layer', 'reddish-brown', 'ce6fbcd3-3f13-4edc-84bd-5210fb171181',
        '2022-07-01 01:14:35.000000', '2022-07-28 06:02:32.000000', 'AES', false, null, null, 'H', 'SU22-H004', 'AES',
        null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null);
INSERT INTO public.locus (uid_unit, id, type, "opening elevations", "closing elevations", description, date_defined,
                          date_closed, interpretation, colour, uid, created, modified, modified_by, repl_deleted,
                          repl_tag, formation_process, arch_domain, arch_context, recorded_by, elevation_opening_nw,
                          elevation_opening_ne, elevation_opening_sw, elevation_opening_se, elevation_closing_nw,
                          elevation_closing_ne, elevation_closing_sw, elevation_closing_se, elevation_opening_ct,
                          elevation_closing_ct, width, length, depth, volume, datum_point_elevation, excavated_with,
                          alternate_id)
VALUES ('a450d92b-3459-4070-bd03-a2513a3bc326', 11, 'dp', null, null, e'Light grey/yellow soil, fine texture, with few artifacts. Located in the NW end of Area H.

Appeared at a similar level to SU22-H010, but SU22-H010 sloped under it.', '2022-07-08', '2022-07-08', null, null,
        '4159a7a6-b87e-4929-a3ae-ac796637a4f0', '2022-07-07 05:27:05.000000', '2022-07-29 02:30:28.000000', 'AES',
        false, null, null, 'H', 'SU22-H011', 'AES', null, null, null, null, null, null, null, null, null, null, null,
        null, null, null, null, null, null);
INSERT INTO public.locus (uid_unit, id, type, "opening elevations", "closing elevations", description, date_defined,
                          date_closed, interpretation, colour, uid, created, modified, modified_by, repl_deleted,
                          repl_tag, formation_process, arch_domain, arch_context, recorded_by, elevation_opening_nw,
                          elevation_opening_ne, elevation_opening_sw, elevation_opening_se, elevation_closing_nw,
                          elevation_closing_ne, elevation_closing_sw, elevation_closing_se, elevation_opening_ct,
                          elevation_closing_ct, width, length, depth, volume, datum_point_elevation, excavated_with,
                          alternate_id)
VALUES ('a450d92b-3459-4070-bd03-a2513a3bc326', 16, 'dp', null, null,
        'Compact yellow-brown layer with abundant charcoal inclusions. Beneath SU22-H012 and SU22-H015. Barely excavated in 2022 (only in the E corner of Area H). Portions excavated in 2023 as SU23-H042.',
        '2022-07-12', null, null, null, '5faa41a3-24ca-4420-8049-2042d2ec38df', '2022-07-12 03:32:41.000000',
        '2023-07-17 07:10:44.000000', 'AES', false, null, null, 'H', 'SU22-H016', 'AES', null, null, null, null, null,
        null, null, null, null, null, null, null, null, null, null, null, 'SU23-H042');
INSERT INTO public.locus (uid_unit, id, type, "opening elevations", "closing elevations", description, date_defined,
                          date_closed, interpretation, colour, uid, created, modified, modified_by, repl_deleted,
                          repl_tag, formation_process, arch_domain, arch_context, recorded_by, elevation_opening_nw,
                          elevation_opening_ne, elevation_opening_sw, elevation_opening_se, elevation_closing_nw,
                          elevation_closing_ne, elevation_closing_sw, elevation_closing_se, elevation_opening_ct,
                          elevation_closing_ct, width, length, depth, volume, datum_point_elevation, excavated_with,
                          alternate_id)
VALUES ('a450d92b-3459-4070-bd03-a2513a3bc326', 21, 'dp', null, null, e'Between SU22-H002 and SU22-H022. Not excavated in 2022.
Western half excavated in 2023 as SU23-H028 due to the way the database makes new context numbers', null, null, null,
        null, '0020d171-0ab4-4154-b469-3b7f8e55f619', '2022-07-15 05:13:45.000000', '2023-06-24 11:20:53.000000', 'AES',
        false, null, null, 'H', 'SU22-H021', 'AES', null, null, null, null, null, null, null, null, null, null, null,
        null, null, null, null, null, 'SU23-H028');
INSERT INTO public.locus (uid_unit, id, type, "opening elevations", "closing elevations", description, date_defined,
                          date_closed, interpretation, colour, uid, created, modified, modified_by, repl_deleted,
                          repl_tag, formation_process, arch_domain, arch_context, recorded_by, elevation_opening_nw,
                          elevation_opening_ne, elevation_opening_sw, elevation_opening_se, elevation_closing_nw,
                          elevation_closing_ne, elevation_closing_sw, elevation_closing_se, elevation_opening_ct,
                          elevation_closing_ct, width, length, depth, volume, datum_point_elevation, excavated_with,
                          alternate_id)
VALUES ('a450d92b-3459-4070-bd03-a2513a3bc326', 27, 'dp', null, null, e'Hard-packed surface composed of small stones (approx. 5 cm or less) and pebbles, interspersed with occasional medium-sized stones, pottery and bone. Slopes down from NW to SE where cut by SU22-H026.

Not excavated in 2022.
Excavated in 2023 as SU23-H030', '2022-07-22', null,
        'Original pebble surface that was washed out and then repaired with the placement of SU22-H024.', null,
        '1a377fbe-85bb-48ba-98b7-54ca4cda890b', '2022-07-22 11:24:58.000000', '2023-06-25 07:38:02.000000', 'AES',
        false, null, 'anthropogenic', 'H', 'SU22-H027', 'AES', null, null, null, null, null, null, null, null, null,
        null, null, null, null, null, null, null, null);
INSERT INTO public.locus (uid_unit, id, type, "opening elevations", "closing elevations", description, date_defined,
                          date_closed, interpretation, colour, uid, created, modified, modified_by, repl_deleted,
                          repl_tag, formation_process, arch_domain, arch_context, recorded_by, elevation_opening_nw,
                          elevation_opening_ne, elevation_opening_sw, elevation_opening_se, elevation_closing_nw,
                          elevation_closing_ne, elevation_closing_sw, elevation_closing_se, elevation_opening_ct,
                          elevation_closing_ct, width, length, depth, volume, datum_point_elevation, excavated_with,
                          alternate_id)
VALUES ('a450d92b-3459-4070-bd03-a2513a3bc326', 24, 'dp', null, null, e'Hard-packed surface composed of small stones (approx. 5 cm or less) and pebbles, along with occasional pottery and bone. Surface composition is quite regular and homogeneous on the W end of the context, but more disrupted to the north. Surface slopes up slightly to abut SU22-H022.

Not excavated in 2022. Excavated in 2023 as SU23-H029.', '2022-07-22', null, 'Possible repair of SU22-H027', null,
        'dbf862ad-340d-42f1-a720-9cd43c7ac3ea', '2022-07-22 01:48:27.000000', '2023-06-24 11:19:39.000000', 'AES',
        false, null, 'anthropogenic', 'H', 'SU22-H024', 'AES', null, null, null, null, null, null, null, null, null,
        null, null, null, null, null, null, null, null);
INSERT INTO public.locus (uid_unit, id, type, "opening elevations", "closing elevations", description, date_defined,
                          date_closed, interpretation, colour, uid, created, modified, modified_by, repl_deleted,
                          repl_tag, formation_process, arch_domain, arch_context, recorded_by, elevation_opening_nw,
                          elevation_opening_ne, elevation_opening_sw, elevation_opening_se, elevation_closing_nw,
                          elevation_closing_ne, elevation_closing_sw, elevation_closing_se, elevation_opening_ct,
                          elevation_closing_ct, width, length, depth, volume, datum_point_elevation, excavated_with,
                          alternate_id)
VALUES ('a450d92b-3459-4070-bd03-a2513a3bc326', 44, 'ac', null, null,
        'Drystone architectural feature consisting of at least three courses of large (30+ cm) stones (size estimated as most disappear into baulks on either side). Only northern face exposed and some stones in the face are worked flat. The feature appears to slope inwards as it descends.',
        '2023-07-23', null, null, null, '3ebc1ab8-a40e-4e7b-b282-665b36bb7c08', '2023-07-23 07:06:40.000000',
        '2023-07-23 07:50:27.000000', 'AES', false, null, 'anthropogenic', 'H', 'SU23-H044', 'AES', null, null, null,
        null, null, null, null, null, null, null, null, null, null, null, null, null, null);
INSERT INTO public.locus (uid_unit, id, type, "opening elevations", "closing elevations", description, date_defined,
                          date_closed, interpretation, colour, uid, created, modified, modified_by, repl_deleted,
                          repl_tag, formation_process, arch_domain, arch_context, recorded_by, elevation_opening_nw,
                          elevation_opening_ne, elevation_opening_sw, elevation_opening_se, elevation_closing_nw,
                          elevation_closing_ne, elevation_closing_sw, elevation_closing_se, elevation_opening_ct,
                          elevation_closing_ct, width, length, depth, volume, datum_point_elevation, excavated_with,
                          alternate_id)
VALUES ('a450d92b-3459-4070-bd03-a2513a3bc326', 38, 'ac', null, null,
        'Line of 5 stones composed of 3 larger stones (30-60 cm) and 2 smaller stones (15-25 cm). There are also two more larger stones just slightly out of the line on either end. All stones are basalt.',
        '2023-07-07', null, 'Drystone wall, likely part of the same structure that SU22-H002 belongs to', null,
        'fc2fe0cf-2fa8-46c3-852b-32fd2bb56a0f', '2023-07-07 10:33:38.000000', '2023-07-11 07:23:33.000000', 'AES',
        false, null, 'anthropogenic', 'H', 'SU23-H038', 'AES', null, null, null, null, null, null, null, null, null,
        null, null, null, null, null, null, null, null);
INSERT INTO public.locus (uid_unit, id, type, "opening elevations", "closing elevations", description, date_defined,
                          date_closed, interpretation, colour, uid, created, modified, modified_by, repl_deleted,
                          repl_tag, formation_process, arch_domain, arch_context, recorded_by, elevation_opening_nw,
                          elevation_opening_ne, elevation_opening_sw, elevation_opening_se, elevation_closing_nw,
                          elevation_closing_ne, elevation_closing_sw, elevation_closing_se, elevation_opening_ct,
                          elevation_closing_ct, width, length, depth, volume, datum_point_elevation, excavated_with,
                          alternate_id)
VALUES ('a450d92b-3459-4070-bd03-a2513a3bc326', 39, 'ac', null, null,
        'Curved drystone wall constructed with large basalt boulders that range from c. 60 to 90 cm in all directions. One course of stones visible at the westernmost extent, while two courses are visible farther to the south. There is a stone clearly missing in the southern corner where SU23-H039 joins SU23-H001.',
        '2023-07-07', null, 'Tower 6 of the antemurale', null, '21d5c685-5df7-4562-a7f0-606c6b6289cd',
        '2023-07-07 10:34:37.000000', '2023-07-11 07:13:31.000000', 'AES', false, null, 'anthropogenic', 'H',
        'SU23-H039', 'AES', null, null, null, null, null, null, null, null, null, null, null, null, null, null, null,
        null, null);
INSERT INTO public.locus (uid_unit, id, type, "opening elevations", "closing elevations", description, date_defined,
                          date_closed, interpretation, colour, uid, created, modified, modified_by, repl_deleted,
                          repl_tag, formation_process, arch_domain, arch_context, recorded_by, elevation_opening_nw,
                          elevation_opening_ne, elevation_opening_sw, elevation_opening_se, elevation_closing_nw,
                          elevation_closing_ne, elevation_closing_sw, elevation_closing_se, elevation_opening_ct,
                          elevation_closing_ct, width, length, depth, volume, datum_point_elevation, excavated_with,
                          alternate_id)
VALUES ('a450d92b-3459-4070-bd03-a2513a3bc326', 1, 'ac', null, null,
        'Straight section of nuraghe wall between towers 5 and 6. Forms the SE edge of area H. Made of large basalt boulders with smaller stones wedged in between the large ones.',
        '2022-06-26', null, 'Antemurale wall', null, 'c3b89d7f-a6a6-424e-afb0-4283e0a4f7a2',
        '2022-06-26 04:23:39.000000', '2023-07-11 07:10:59.000000', 'AES', false, null, 'anthropogenic', 'H',
        'SU22-H001', 'AES', null, null, null, null, null, null, null, null, null, null, null, null, null, null, null,
        null, null);
INSERT INTO public.locus (uid_unit, id, type, "opening elevations", "closing elevations", description, date_defined,
                          date_closed, interpretation, colour, uid, created, modified, modified_by, repl_deleted,
                          repl_tag, formation_process, arch_domain, arch_context, recorded_by, elevation_opening_nw,
                          elevation_opening_ne, elevation_opening_sw, elevation_opening_se, elevation_closing_nw,
                          elevation_closing_ne, elevation_closing_sw, elevation_closing_se, elevation_opening_ct,
                          elevation_closing_ct, width, length, depth, volume, datum_point_elevation, excavated_with,
                          alternate_id)
VALUES ('a450d92b-3459-4070-bd03-a2513a3bc326', 5, 'dp', null, null,
        'Un estrato muy poco compacto, de arena fina color marrón grisáceo con abundantes piedras de tamaño pequeño y medio. La potencia de este nivel negativo baja unos 10-15 cms. ',
        '2022-07-01', '2022-07-02', 'Fill of a cut excavated by Lilliu when he exposed the walls of the antemurale',
        null, '2b89dfe6-328b-4d81-8092-38c7b2c4bfcd', '2022-07-01 01:23:07.000000', '2023-07-13 06:33:09.000000', 'AES',
        false, null, null, 'H', 'SU22-H005', 'LMB', null, null, null, null, null, null, null, null, null, null, null,
        null, null, null, null, null, null);
INSERT INTO public.locus (uid_unit, id, type, "opening elevations", "closing elevations", description, date_defined,
                          date_closed, interpretation, colour, uid, created, modified, modified_by, repl_deleted,
                          repl_tag, formation_process, arch_domain, arch_context, recorded_by, elevation_opening_nw,
                          elevation_opening_ne, elevation_opening_sw, elevation_opening_se, elevation_closing_nw,
                          elevation_closing_ne, elevation_closing_sw, elevation_closing_se, elevation_opening_ct,
                          elevation_closing_ct, width, length, depth, volume, datum_point_elevation, excavated_with,
                          alternate_id)
VALUES ('a450d92b-3459-4070-bd03-a2513a3bc326', 22, 'ac', null, null, e'2022: Linear feature composed of seven large (30+ cm) stones with medium sized stones interspersed. Runs roughly parallel to the antemurale in this area (SU22-H001).

2023 (following full excavation): Linear drystone architectural feature. Northern face consists of 3 courses of large (30-55 cm) with a few medium (10-15 cm) stones interspersed. Many of the stones of the northern face have flat worked faces. Southern face consists of 4 irregular courses of stone. The top course is a mix of large (up to 55 cm) and medium (15-25 cm) stones, while the bottom three courses are composed of medium (15-25 cm) stones with a few in the bottom course reaching 30 cm. The maximum height of the feature is roughly 95 cm and the width is roughly 70-75 cm. The whole feature curves slightly, paralleing the antemurale of the nuraghe.',
        '2022-07-15', null,
        'Wall. Likely the inner wall of a second phase or rebuilding of the fossato found in Area E', null,
        '1d9618f4-4bbc-476c-abab-c2a72f20830a', '2022-07-15 05:13:47.000000', '2023-07-23 07:47:36.000000', 'AES',
        false, null, 'anthropogenic', 'H', 'SU22-H022', 'AES', null, null, null, null, null, null, null, null, null,
        null, null, null, null, null, null, null, null);
INSERT INTO public.locus (uid_unit, id, type, "opening elevations", "closing elevations", description, date_defined,
                          date_closed, interpretation, colour, uid, created, modified, modified_by, repl_deleted,
                          repl_tag, formation_process, arch_domain, arch_context, recorded_by, elevation_opening_nw,
                          elevation_opening_ne, elevation_opening_sw, elevation_opening_se, elevation_closing_nw,
                          elevation_closing_ne, elevation_closing_sw, elevation_closing_se, elevation_opening_ct,
                          elevation_closing_ct, width, length, depth, volume, datum_point_elevation, excavated_with,
                          alternate_id)
VALUES ('a450d92b-3459-4070-bd03-a2513a3bc326', 40, 'dp', null, null,
        'Soft, humid, dark brown grainy clay with veins of greenish clay, inclusions of charcoal and some approx. 10 cm floating stones. Very wet and sticky.',
        '2023-07-07', null, null, null, '04406012-28bc-4eea-88d0-3c127a421497', '2023-07-07 10:35:09.000000',
        '2023-07-28 11:35:02.000000', 'AES', false, null, null, 'H', 'SU23-H040', 'AES', null, null, null, null, null,
        null, null, null, null, null, null, null, null, null, null, 'pick', null);
INSERT INTO public.locus (uid_unit, id, type, "opening elevations", "closing elevations", description, date_defined,
                          date_closed, interpretation, colour, uid, created, modified, modified_by, repl_deleted,
                          repl_tag, formation_process, arch_domain, arch_context, recorded_by, elevation_opening_nw,
                          elevation_opening_ne, elevation_opening_sw, elevation_opening_se, elevation_closing_nw,
                          elevation_closing_ne, elevation_closing_sw, elevation_closing_se, elevation_opening_ct,
                          elevation_closing_ct, width, length, depth, volume, datum_point_elevation, excavated_with,
                          alternate_id)
VALUES ('a450d92b-3459-4070-bd03-a2513a3bc326', 34, 'dp', null, null,
        'Medium brown largely sandy soil with some clay as well. Flecks of charcoal present in soil. Contains some small rocks (< 5 cm), and relatively small quantities of ceramics and bone. More compact in the northern portion and looser in the southern portion. Covers the entire area to the north of SU22-H022. ',
        '2023-07-03', '2023-07-07', 'Fill', null, '11e47e11-6fed-4695-9dad-872dcf3761f4', '2023-07-02 11:09:03.000000',
        '2023-07-28 11:20:07.000000', 'AES', false, null, null, 'H', 'SU23-H034', 'AES', null, null, null, null, null,
        null, null, null, null, null, null, null, null, null, null, 'pick', null);
INSERT INTO public.locus (uid_unit, id, type, "opening elevations", "closing elevations", description, date_defined,
                          date_closed, interpretation, colour, uid, created, modified, modified_by, repl_deleted,
                          repl_tag, formation_process, arch_domain, arch_context, recorded_by, elevation_opening_nw,
                          elevation_opening_ne, elevation_opening_sw, elevation_opening_se, elevation_closing_nw,
                          elevation_closing_ne, elevation_closing_sw, elevation_closing_se, elevation_opening_ct,
                          elevation_closing_ct, width, length, depth, volume, datum_point_elevation, excavated_with,
                          alternate_id)
VALUES ('a450d92b-3459-4070-bd03-a2513a3bc326', 31, 'dp', null, null,
        'Light brown compact soil with inclusions of white granules, yellowish clay, red granules, and small pieces of decomposing rock (granule to small pebble in size). Extends all the way across (east to west) the southern portion of the area that was covered by SU23-028 and roughly 110 cm south to north. Contains very little cultural material.',
        '2023-06-26', '2023-06-27', 'Thin lens within larger fills', 'Brown', '1f3cf23d-3a88-46a1-bf76-6b0afe6e1af1',
        '2023-06-26 10:55:59.000000', '2023-07-28 09:50:44.000000', 'AES', false, null, null, 'H', 'SU23-H031', 'AES',
        null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, 'pick', null);
INSERT INTO public.locus (uid_unit, id, type, "opening elevations", "closing elevations", description, date_defined,
                          date_closed, interpretation, colour, uid, created, modified, modified_by, repl_deleted,
                          repl_tag, formation_process, arch_domain, arch_context, recorded_by, elevation_opening_nw,
                          elevation_opening_ne, elevation_opening_sw, elevation_opening_se, elevation_closing_nw,
                          elevation_closing_ne, elevation_closing_sw, elevation_closing_se, elevation_opening_ct,
                          elevation_closing_ct, width, length, depth, volume, datum_point_elevation, excavated_with,
                          alternate_id)
VALUES ('a450d92b-3459-4070-bd03-a2513a3bc326', 28, 'dp', null, null,
        'Western half (2 m) of the space between SU22-H002 and SU22-H022 (i.e. western 2 m of SU22-H021). Deep brown, compact, clayey, humid soil with large quantities of ceramics and some bones. Ceramics fragments frequently large and have joins.',
        '2023-06-24', '2023-06-26', 'Fill', null, '2a3bfb8d-996c-42c1-a74f-9ac55f262007', '2023-06-24 11:15:49.000000',
        '2023-07-28 11:12:23.000000', 'AES', false, null, null, 'H', 'SU23-H028', 'AES', null, null, null, null, null,
        null, null, null, null, null, null, null, null, null, null, 'pick', 'SU22-H021');
INSERT INTO public.locus (uid_unit, id, type, "opening elevations", "closing elevations", description, date_defined,
                          date_closed, interpretation, colour, uid, created, modified, modified_by, repl_deleted,
                          repl_tag, formation_process, arch_domain, arch_context, recorded_by, elevation_opening_nw,
                          elevation_opening_ne, elevation_opening_sw, elevation_opening_se, elevation_closing_nw,
                          elevation_closing_ne, elevation_closing_sw, elevation_closing_se, elevation_opening_ct,
                          elevation_closing_ct, width, length, depth, volume, datum_point_elevation, excavated_with,
                          alternate_id)
VALUES ('a450d92b-3459-4070-bd03-a2513a3bc326', 35, 'dp', null, null,
        'Very dark brown clayey, humid soil, heavily included with charcoal. Contains large quantities of bone, mostly small bones or small fragments of bone.',
        '2023-07-05', null, 'Fill', null, '48806df6-56fe-4bc3-8dac-8abbb21558ae', '2023-07-02 11:09:06.000000',
        '2023-07-28 11:36:22.000000', 'AES', false, null, null, 'H', 'SU23-H035', 'AES', null, null, null, null, null,
        null, null, null, null, null, null, null, null, null, null, 'pick', null);
INSERT INTO public.locus (uid_unit, id, type, "opening elevations", "closing elevations", description, date_defined,
                          date_closed, interpretation, colour, uid, created, modified, modified_by, repl_deleted,
                          repl_tag, formation_process, arch_domain, arch_context, recorded_by, elevation_opening_nw,
                          elevation_opening_ne, elevation_opening_sw, elevation_opening_se, elevation_closing_nw,
                          elevation_closing_ne, elevation_closing_sw, elevation_closing_se, elevation_opening_ct,
                          elevation_closing_ct, width, length, depth, volume, datum_point_elevation, excavated_with,
                          alternate_id)
VALUES ('a450d92b-3459-4070-bd03-a2513a3bc326', 14, 'ac', null, null,
        'Stone feature composed of seven medium-large stones. Five stones form three sides of a squarish box, and the other two are perpendicular and parallel respectively to the lines of the box, possibly part of the same feature (a second box?).',
        '2022-07-07', null, e'Possibly the bottom of a staircase, cf. similar features from Terralba
2023: possible support for a central post to support flat, Punic-style roof', null,
        '43ebc1f0-06ae-48fe-8fff-61a904c2d0f3', '2022-07-07 05:29:08.000000', '2023-07-28 09:26:24.000000', 'AES',
        false, null, 'anthropogenic', 'H', 'SU22-H014', 'AES', null, null, null, null, null, null, null, null, null,
        null, null, null, null, null, null, null, null);
INSERT INTO public.locus (uid_unit, id, type, "opening elevations", "closing elevations", description, date_defined,
                          date_closed, interpretation, colour, uid, created, modified, modified_by, repl_deleted,
                          repl_tag, formation_process, arch_domain, arch_context, recorded_by, elevation_opening_nw,
                          elevation_opening_ne, elevation_opening_sw, elevation_opening_se, elevation_closing_nw,
                          elevation_closing_ne, elevation_closing_sw, elevation_closing_se, elevation_opening_ct,
                          elevation_closing_ct, width, length, depth, volume, datum_point_elevation, excavated_with,
                          alternate_id)
VALUES ('a450d92b-3459-4070-bd03-a2513a3bc326', 30, 'dp', null, null,
        'Hard-packed surface composed of small stones (approx. 5 cm or less) and pebbles, interspersed with frequent medium-sized stones (5-15 cm), pottery and bone. Stone/pottery/bone inclusions are more densely packed in the northern area of the context and become more dispersed towards the southern side of the context. Majority of non-stone inclusions are sherds less than 2 cm in size. Sunken towards the south. Soil is light greyish brown (partially from being baked by the sun) and fine grained.',
        '2023-06-25', '2023-06-27',
        'Pebbled surface that subsided towards the south due to the presence of ditch fill beneath it', null,
        '6b472acb-6f16-419c-8807-0dc858a04f1c', '2023-06-25 07:37:13.000000', '2023-07-28 11:16:03.000000', 'AES',
        false, null, 'anthropogenic', 'H', 'SU23-H030', 'AES', null, null, null, null, null, null, null, null, null,
        null, null, null, null, null, null, 'trowel', 'SU22-H027');
INSERT INTO public.locus (uid_unit, id, type, "opening elevations", "closing elevations", description, date_defined,
                          date_closed, interpretation, colour, uid, created, modified, modified_by, repl_deleted,
                          repl_tag, formation_process, arch_domain, arch_context, recorded_by, elevation_opening_nw,
                          elevation_opening_ne, elevation_opening_sw, elevation_opening_se, elevation_closing_nw,
                          elevation_closing_ne, elevation_closing_sw, elevation_closing_se, elevation_opening_ct,
                          elevation_closing_ct, width, length, depth, volume, datum_point_elevation, excavated_with,
                          alternate_id)
VALUES ('a450d92b-3459-4070-bd03-a2513a3bc326', 37, 'dp', null, null,
        'Reddish soil with inclusions of plaster and charcoal. Contains moderate quantities of ceramic and small quantities of bone. ',
        '2023-07-13', '2023-07-14', null, null, '6d79492b-08df-40f2-94eb-edd31d86cbfa', '2023-07-06 11:45:59.000000',
        '2023-07-28 11:35:37.000000', 'AES', false, null, null, 'H', 'SU23-H037', 'AES', null, null, null, null, null,
        null, null, null, null, null, null, null, null, null, null, 'pick', null);
INSERT INTO public.locus (uid_unit, id, type, "opening elevations", "closing elevations", description, date_defined,
                          date_closed, interpretation, colour, uid, created, modified, modified_by, repl_deleted,
                          repl_tag, formation_process, arch_domain, arch_context, recorded_by, elevation_opening_nw,
                          elevation_opening_ne, elevation_opening_sw, elevation_opening_se, elevation_closing_nw,
                          elevation_closing_ne, elevation_closing_sw, elevation_closing_se, elevation_opening_ct,
                          elevation_closing_ct, width, length, depth, volume, datum_point_elevation, excavated_with,
                          alternate_id)
VALUES ('a450d92b-3459-4070-bd03-a2513a3bc326', 36, 'dp', null, null,
        'Topsoil of area between the western baulk of Area H, the straight portion of the antemurale between towers 5 and 6 (SU22-H001), tower 6, and the westernmost extent of the wall of the late structure (SU22-H022 in the original extent of Area H). Loose, medium greyish brown sandy/silty soil with large quantities of roots and many small to medium-sized rocks. Small quantities of ceramics and bone.',
        '2023-07-02', '2023-07-11', null, 'Medium greyish brown', '73b732aa-b964-40b0-b843-7b5bcd5010c7',
        '2023-07-02 11:09:08.000000', '2023-07-28 11:24:10.000000', 'AES', false, null, null, 'H', 'SU23-H036', 'AES',
        null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, 'pick', null);
INSERT INTO public.locus (uid_unit, id, type, "opening elevations", "closing elevations", description, date_defined,
                          date_closed, interpretation, colour, uid, created, modified, modified_by, repl_deleted,
                          repl_tag, formation_process, arch_domain, arch_context, recorded_by, elevation_opening_nw,
                          elevation_opening_ne, elevation_opening_sw, elevation_opening_se, elevation_closing_nw,
                          elevation_closing_ne, elevation_closing_sw, elevation_closing_se, elevation_opening_ct,
                          elevation_closing_ct, width, length, depth, volume, datum_point_elevation, excavated_with,
                          alternate_id)
VALUES ('a450d92b-3459-4070-bd03-a2513a3bc326', 42, 'dp', null, null,
        'Yellowy brown silty soil, with inclusions of plaster, charcoal, and rocks of varying sizes (small 5-10 cm, medium 10-20). Some larger patches of plaster and orangey patches. Many roots extend through the layer. Contains large quantities of ceramics, including tile, and small quantities of bone. ',
        '2023-07-16', null, null, null, '86ddca1c-b82b-4280-98fc-5befc1790158', '2023-07-14 11:26:25.000000',
        '2023-07-28 11:30:22.000000', 'AES', false, null, null, 'H', 'SU23-H042', 'AES', null, null, null, null, null,
        null, null, null, null, null, null, null, null, null, null, 'pick', 'SU22-H016');
INSERT INTO public.locus (uid_unit, id, type, "opening elevations", "closing elevations", description, date_defined,
                          date_closed, interpretation, colour, uid, created, modified, modified_by, repl_deleted,
                          repl_tag, formation_process, arch_domain, arch_context, recorded_by, elevation_opening_nw,
                          elevation_opening_ne, elevation_opening_sw, elevation_opening_se, elevation_closing_nw,
                          elevation_closing_ne, elevation_closing_sw, elevation_closing_se, elevation_opening_ct,
                          elevation_closing_ct, width, length, depth, volume, datum_point_elevation, excavated_with,
                          alternate_id)
VALUES ('a450d92b-3459-4070-bd03-a2513a3bc326', 29, 'dp', null, null,
        'Hard-packed surface composed of small stones (approx. 5 cm or less) and pebbles, along with occasional pottery and bone. Surface composition is quite regular and homogeneous on the W end of the context, but more disrupted to the north. Surface slopes up slightly to abut SU22-H022.',
        '2023-06-24', '2023-06-25',
        'Repair of surface SU22-H027/SU23-H030 following subsidence or erosion towards the south', 'Grayish brown',
        '8fec8761-1719-4530-a868-d42a1c10dd7b', '2023-06-24 11:18:55.000000', '2023-07-28 11:14:40.000000', 'AES',
        false, null, 'anthropogenic', 'H', 'SU23-H029', 'AES', null, null, null, null, null, null, null, null, null,
        null, null, null, null, null, null, 'handpick', 'SU22-H024');
INSERT INTO public.locus (uid_unit, id, type, "opening elevations", "closing elevations", description, date_defined,
                          date_closed, interpretation, colour, uid, created, modified, modified_by, repl_deleted,
                          repl_tag, formation_process, arch_domain, arch_context, recorded_by, elevation_opening_nw,
                          elevation_opening_ne, elevation_opening_sw, elevation_opening_se, elevation_closing_nw,
                          elevation_closing_ne, elevation_closing_sw, elevation_closing_se, elevation_opening_ct,
                          elevation_closing_ct, width, length, depth, volume, datum_point_elevation, excavated_with,
                          alternate_id)
VALUES ('a450d92b-3459-4070-bd03-a2513a3bc326', 32, 'dp', null, null,
        'Dark brown, humid soil with roughly equal quantities of pottery and bone. Extends across the full area covered by SU23-H028. Material is concentrated more in the northern portion of the context near SU22-H022.',
        '2023-06-26', '2023-07-03', 'Fill', null, 'a17807c1-9ebd-4554-93ee-08790a38d7ba', '2023-06-26 11:09:46.000000',
        '2023-07-28 09:51:58.000000', 'AES', false, null, null, 'H', 'SU23-H032', 'AES', null, null, null, null, null,
        null, null, null, null, null, null, null, null, null, null, 'pick', null);
INSERT INTO public.locus (uid_unit, id, type, "opening elevations", "closing elevations", description, date_defined,
                          date_closed, interpretation, colour, uid, created, modified, modified_by, repl_deleted,
                          repl_tag, formation_process, arch_domain, arch_context, recorded_by, elevation_opening_nw,
                          elevation_opening_ne, elevation_opening_sw, elevation_opening_se, elevation_closing_nw,
                          elevation_closing_ne, elevation_closing_sw, elevation_closing_se, elevation_opening_ct,
                          elevation_closing_ct, width, length, depth, volume, datum_point_elevation, excavated_with,
                          alternate_id)
VALUES ('a450d92b-3459-4070-bd03-a2513a3bc326', 33, 'dp', null, null,
        'Very hard, light brown sandy soil with flecks of charcoal and occasional spots of plaster (< 5 cm). Contains large quantities of ceramics, moderate quantities of animal bone, and frequent medium-sized (10-15 cm) stones. Consistently harder in northern two-thirds and looser/more humid in the southern third abutting SU22-H022.',
        '2023-06-27', '2023-07-02', 'Fill', 'Light brown', 'c068cdb5-3ce4-4d85-a0f2-7596420b96dd',
        '2023-06-27 09:21:02.000000', '2023-07-28 11:18:31.000000', 'AES', false, null, null, 'H', 'SU23-H033', 'AES',
        null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, 'pick', null);
INSERT INTO public.locus (uid_unit, id, type, "opening elevations", "closing elevations", description, date_defined,
                          date_closed, interpretation, colour, uid, created, modified, modified_by, repl_deleted,
                          repl_tag, formation_process, arch_domain, arch_context, recorded_by, elevation_opening_nw,
                          elevation_opening_ne, elevation_opening_sw, elevation_opening_se, elevation_closing_nw,
                          elevation_closing_ne, elevation_closing_sw, elevation_closing_se, elevation_opening_ct,
                          elevation_closing_ct, width, length, depth, volume, datum_point_elevation, excavated_with,
                          alternate_id)
VALUES ('a450d92b-3459-4070-bd03-a2513a3bc326', 41, 'dp', null, null,
        'Dark brown sandy soil, heavily included with small rocks (c. 5-15 cm).', '2023-07-11', '2023-07-13', null,
        null, 'cbab053c-5f15-44bd-ae33-1077753d6b92', '2023-07-11 11:26:18.000000', '2023-07-29 13:36:03.000000', 'AES',
        false, null, null, 'H', 'SU23-H041', 'AES', null, null, null, null, null, null, null, null, null, null, null,
        null, null, null, null, 'pick', null);
INSERT INTO public.locus (uid_unit, id, type, "opening elevations", "closing elevations", description, date_defined,
                          date_closed, interpretation, colour, uid, created, modified, modified_by, repl_deleted,
                          repl_tag, formation_process, arch_domain, arch_context, recorded_by, elevation_opening_nw,
                          elevation_opening_ne, elevation_opening_sw, elevation_opening_se, elevation_closing_nw,
                          elevation_closing_ne, elevation_closing_sw, elevation_closing_se, elevation_opening_ct,
                          elevation_closing_ct, width, length, depth, volume, datum_point_elevation, excavated_with,
                          alternate_id)
VALUES ('a450d92b-3459-4070-bd03-a2513a3bc326', 43, 'dp', null, null,
        'Dark brown, very humid clay with substantial amounts of green clay, more sandy inclusions, patches of decomposing rock and bright red-orange dissolving mudbrick, and charcoal inclusions. Begins at the level of the bottom of the first course of stones of SU23-H044. Substantial amounts of ceramics and fired mudbrick; small amounts of bone. Concentration of large stones (20 cm+) in the southern portion of the context.',
        '2023-07-19', null, 'Ditch fill including debris from the destruction (fire) of a structure', null,
        'fcdc0106-a3b5-4c1f-802a-42321a6ac015', '2023-07-19 07:33:50.000000', '2023-07-28 11:33:45.000000', 'AES',
        false, null, null, 'H', 'SU23-H043', 'AES', null, null, null, null, null, null, null, null, null, null, null,
        null, null, null, null, null, null);


INSERT INTO public.locus_relations (uid_locus, uid_locus_2_related, type, uid_sketch, sketch_description, uid, created,
                                    modified, modified_by, repl_deleted, repl_tag, chronology)
VALUES ('de06ade4-6afe-4b60-b331-4ffee5c06d8c', '64905a74-c2a5-4b93-854b-a540b469c7f1', 'abuts', null, null,
        '764decd4-379c-4c45-93f4-67041e00a483', '2022-06-26 05:13:23.000000', '2022-06-26 05:14:11.000000', 'AES',
        false, null, 'later than');
INSERT INTO public.locus_relations (uid_locus, uid_locus_2_related, type, uid_sketch, sketch_description, uid, created,
                                    modified, modified_by, repl_deleted, repl_tag, chronology)
VALUES ('de06ade4-6afe-4b60-b331-4ffee5c06d8c', 'c3b89d7f-a6a6-424e-afb0-4283e0a4f7a2', 'abuts', null, null,
        '34c2db60-ce05-47f8-8ad2-fec38c5df7d7', '2022-06-26 05:14:24.000000', '2022-06-26 05:14:32.000000', 'AES',
        false, null, 'later than');
INSERT INTO public.locus_relations (uid_locus, uid_locus_2_related, type, uid_sketch, sketch_description, uid, created,
                                    modified, modified_by, repl_deleted, repl_tag, chronology)
VALUES ('64905a74-c2a5-4b93-854b-a540b469c7f1', 'de06ade4-6afe-4b60-b331-4ffee5c06d8c', 'is abutted by', null, null,
        '5688689c-9ccc-493a-8606-61b3b8838702', '2022-06-26 05:14:11.000000', '2022-06-26 05:14:11.000000', 'AES',
        false, null, 'earlier than');
INSERT INTO public.locus_relations (uid_locus, uid_locus_2_related, type, uid_sketch, sketch_description, uid, created,
                                    modified, modified_by, repl_deleted, repl_tag, chronology)
VALUES ('c3b89d7f-a6a6-424e-afb0-4283e0a4f7a2', 'de06ade4-6afe-4b60-b331-4ffee5c06d8c', 'is abutted by', null, null,
        'cfb4fcc0-bd04-4d55-82c6-7c82c576820b', '2022-06-26 05:14:32.000000', '2022-06-26 05:14:32.000000', 'AES',
        false, null, 'earlier than');
INSERT INTO public.locus_relations (uid_locus, uid_locus_2_related, type, uid_sketch, sketch_description, uid, created,
                                    modified, modified_by, repl_deleted, repl_tag, chronology)
VALUES ('769c19c9-1f0a-4df5-9c47-69c420576336', 'de06ade4-6afe-4b60-b331-4ffee5c06d8c', 'below', null, null,
        '39eb6c52-cd75-4d9a-8dea-ae733c92940b', '2022-06-27 02:37:05.000000', '2022-06-27 02:37:13.000000', 'AES',
        false, null, 'earlier than');
INSERT INTO public.locus_relations (uid_locus, uid_locus_2_related, type, uid_sketch, sketch_description, uid, created,
                                    modified, modified_by, repl_deleted, repl_tag, chronology)
VALUES ('769c19c9-1f0a-4df5-9c47-69c420576336', 'c3b89d7f-a6a6-424e-afb0-4283e0a4f7a2', 'abuts', null, null,
        'ef0c97d0-92d2-4311-a3ab-7f8d6c28b2ca', '2022-06-27 03:35:21.000000', '2022-06-27 03:35:31.000000', 'AES',
        false, null, 'later than');
INSERT INTO public.locus_relations (uid_locus, uid_locus_2_related, type, uid_sketch, sketch_description, uid, created,
                                    modified, modified_by, repl_deleted, repl_tag, chronology)
VALUES ('769c19c9-1f0a-4df5-9c47-69c420576336', '64905a74-c2a5-4b93-854b-a540b469c7f1', 'abuts', null, null,
        '5e93e4ee-484d-4101-a782-05bd7c0d81cf', '2022-06-27 03:35:33.000000', '2022-06-27 03:35:41.000000', 'AES',
        false, null, 'later than');
INSERT INTO public.locus_relations (uid_locus, uid_locus_2_related, type, uid_sketch, sketch_description, uid, created,
                                    modified, modified_by, repl_deleted, repl_tag, chronology)
VALUES ('de06ade4-6afe-4b60-b331-4ffee5c06d8c', '769c19c9-1f0a-4df5-9c47-69c420576336', 'above', null, null,
        'cde1febf-633b-426d-a4a7-f38644a350b8', '2022-06-27 02:37:13.000000', '2022-06-27 02:37:13.000000', 'AES',
        false, null, 'later than');
INSERT INTO public.locus_relations (uid_locus, uid_locus_2_related, type, uid_sketch, sketch_description, uid, created,
                                    modified, modified_by, repl_deleted, repl_tag, chronology)
VALUES ('c3b89d7f-a6a6-424e-afb0-4283e0a4f7a2', '769c19c9-1f0a-4df5-9c47-69c420576336', 'is abutted by', null, null,
        'e328518b-29ea-4341-a7a5-21eeb0f9746d', '2022-06-27 03:35:31.000000', '2022-06-27 03:35:31.000000', 'AES',
        false, null, 'earlier than');
INSERT INTO public.locus_relations (uid_locus, uid_locus_2_related, type, uid_sketch, sketch_description, uid, created,
                                    modified, modified_by, repl_deleted, repl_tag, chronology)
VALUES ('64905a74-c2a5-4b93-854b-a540b469c7f1', '769c19c9-1f0a-4df5-9c47-69c420576336', 'is abutted by', null, null,
        'ad738e5b-97c0-4dfd-89ac-3f6aff4e6669', '2022-06-27 03:35:41.000000', '2022-06-27 03:35:41.000000', 'AES',
        false, null, 'earlier than');
INSERT INTO public.locus_relations (uid_locus, uid_locus_2_related, type, uid_sketch, sketch_description, uid, created,
                                    modified, modified_by, repl_deleted, repl_tag, chronology)
VALUES ('ce6fbcd3-3f13-4edc-84bd-5210fb171181', '769c19c9-1f0a-4df5-9c47-69c420576336', 'below', null, null,
        'e4aeeaa9-b135-45dc-bce4-789441e99761', '2022-07-01 02:06:48.000000', '2022-07-01 02:06:59.000000', 'AES',
        false, null, 'earlier than');
INSERT INTO public.locus_relations (uid_locus, uid_locus_2_related, type, uid_sketch, sketch_description, uid, created,
                                    modified, modified_by, repl_deleted, repl_tag, chronology)
VALUES ('2b89dfe6-328b-4d81-8092-38c7b2c4bfcd', '769c19c9-1f0a-4df5-9c47-69c420576336', 'below', null, null,
        'ab9ae733-eb57-4e33-8091-ca26a3a369da', '2022-07-01 02:07:27.000000', '2022-07-01 02:07:39.000000', 'AES',
        false, null, 'earlier than');
INSERT INTO public.locus_relations (uid_locus, uid_locus_2_related, type, uid_sketch, sketch_description, uid, created,
                                    modified, modified_by, repl_deleted, repl_tag, chronology)
VALUES ('2b89dfe6-328b-4d81-8092-38c7b2c4bfcd', 'c3b89d7f-a6a6-424e-afb0-4283e0a4f7a2', 'abuts', null, null,
        'e3da4989-de2d-45ee-9874-04c99e76b9e0', '2022-07-01 02:07:41.000000', '2022-07-01 02:07:52.000000', 'AES',
        false, null, 'later than');
INSERT INTO public.locus_relations (uid_locus, uid_locus_2_related, type, uid_sketch, sketch_description, uid, created,
                                    modified, modified_by, repl_deleted, repl_tag, chronology)
VALUES ('2b89dfe6-328b-4d81-8092-38c7b2c4bfcd', 'a6490717-059e-4db8-8796-7ececb87acec', 'fills', null, null,
        '5fb57f66-da06-4716-94f2-aac39af5d58e', '2022-07-01 04:56:17.000000', '2022-07-01 04:56:30.000000', 'AES',
        false, null, 'later than');
INSERT INTO public.locus_relations (uid_locus, uid_locus_2_related, type, uid_sketch, sketch_description, uid, created,
                                    modified, modified_by, repl_deleted, repl_tag, chronology)
VALUES ('769c19c9-1f0a-4df5-9c47-69c420576336', 'ce6fbcd3-3f13-4edc-84bd-5210fb171181', 'above', null, null,
        '012571ee-f359-4683-9064-53728871e873', '2022-07-01 02:06:58.000000', '2022-07-01 02:06:58.000000', 'AES',
        false, null, 'later than');
INSERT INTO public.locus_relations (uid_locus, uid_locus_2_related, type, uid_sketch, sketch_description, uid, created,
                                    modified, modified_by, repl_deleted, repl_tag, chronology)
VALUES ('769c19c9-1f0a-4df5-9c47-69c420576336', '2b89dfe6-328b-4d81-8092-38c7b2c4bfcd', 'above', null, null,
        'e437694d-d5e4-47e4-b56a-33fcf9dc6c88', '2022-07-01 02:07:39.000000', '2022-07-01 02:07:39.000000', 'AES',
        false, null, 'later than');
INSERT INTO public.locus_relations (uid_locus, uid_locus_2_related, type, uid_sketch, sketch_description, uid, created,
                                    modified, modified_by, repl_deleted, repl_tag, chronology)
VALUES ('c3b89d7f-a6a6-424e-afb0-4283e0a4f7a2', '2b89dfe6-328b-4d81-8092-38c7b2c4bfcd', 'is abutted by', null, null,
        '283a3d55-b203-4eb3-a118-c3b6664f86f7', '2022-07-01 02:07:52.000000', '2022-07-01 02:07:52.000000', 'AES',
        false, null, 'earlier than');
INSERT INTO public.locus_relations (uid_locus, uid_locus_2_related, type, uid_sketch, sketch_description, uid, created,
                                    modified, modified_by, repl_deleted, repl_tag, chronology)
VALUES ('a6490717-059e-4db8-8796-7ececb87acec', '2b89dfe6-328b-4d81-8092-38c7b2c4bfcd', 'is filled by', null, null,
        '516a8bb3-f8ba-453b-85ad-3854b28a317e', '2022-07-01 04:56:29.000000', '2022-07-01 04:56:29.000000', 'AES',
        false, null, 'earlier than');
INSERT INTO public.locus_relations (uid_locus, uid_locus_2_related, type, uid_sketch, sketch_description, uid, created,
                                    modified, modified_by, repl_deleted, repl_tag, chronology)
VALUES ('a6490717-059e-4db8-8796-7ececb87acec', '64905a74-c2a5-4b93-854b-a540b469c7f1', 'cuts through', null, null,
        '2e037baf-9dcd-497e-b07b-4748949b6e6d', '2022-07-02 09:03:48.000000', '2022-07-02 09:04:01.000000', 'AES',
        false, null, 'later than');
INSERT INTO public.locus_relations (uid_locus, uid_locus_2_related, type, uid_sketch, sketch_description, uid, created,
                                    modified, modified_by, repl_deleted, repl_tag, chronology)
VALUES ('a6490717-059e-4db8-8796-7ececb87acec', '4058a1e2-257c-4137-97ef-7e3ef902eab2', 'cuts through', null, null,
        '557d7a07-6472-47b5-ae7a-6c3fa87eced7', '2022-07-02 09:04:04.000000', '2022-07-02 09:04:13.000000', 'AES',
        false, null, 'later than');
INSERT INTO public.locus_relations (uid_locus, uid_locus_2_related, type, uid_sketch, sketch_description, uid, created,
                                    modified, modified_by, repl_deleted, repl_tag, chronology)
VALUES ('a6490717-059e-4db8-8796-7ececb87acec', 'c3b89d7f-a6a6-424e-afb0-4283e0a4f7a2', 'is adjacent to', null, null,
        '82c7152b-5a39-4191-90de-7944ecc8660a', '2022-07-02 09:04:27.000000', '2022-07-02 09:04:44.000000', 'AES',
        false, null, 'later than');
INSERT INTO public.locus_relations (uid_locus, uid_locus_2_related, type, uid_sketch, sketch_description, uid, created,
                                    modified, modified_by, repl_deleted, repl_tag, chronology)
VALUES ('64905a74-c2a5-4b93-854b-a540b469c7f1', 'a6490717-059e-4db8-8796-7ececb87acec', 'cut by', null, null,
        '95e55ef6-8091-49e0-a724-88cbed017baf', '2022-07-02 09:04:00.000000', '2022-07-02 09:04:00.000000', 'AES',
        false, null, 'earlier than');
INSERT INTO public.locus_relations (uid_locus, uid_locus_2_related, type, uid_sketch, sketch_description, uid, created,
                                    modified, modified_by, repl_deleted, repl_tag, chronology)
VALUES ('4058a1e2-257c-4137-97ef-7e3ef902eab2', 'a6490717-059e-4db8-8796-7ececb87acec', 'cut by', null, null,
        '31a5d430-2159-4155-a814-5c2753b4b32c', '2022-07-02 09:04:13.000000', '2022-07-02 09:04:13.000000', 'AES',
        false, null, 'earlier than');
INSERT INTO public.locus_relations (uid_locus, uid_locus_2_related, type, uid_sketch, sketch_description, uid, created,
                                    modified, modified_by, repl_deleted, repl_tag, chronology)
VALUES ('c3b89d7f-a6a6-424e-afb0-4283e0a4f7a2', 'a6490717-059e-4db8-8796-7ececb87acec', 'is adjacent to', null, null,
        'c27677ea-0742-42e2-95f0-b31fc7d348f2', '2022-07-02 09:04:44.000000', '2022-07-02 09:04:44.000000', 'AES',
        false, null, 'earlier than');
INSERT INTO public.locus_relations (uid_locus, uid_locus_2_related, type, uid_sketch, sketch_description, uid, created,
                                    modified, modified_by, repl_deleted, repl_tag, chronology)
VALUES ('bd5f2af7-e017-4125-9ff5-02cd15c89e63', '64fc871b-dd5d-4ee6-ad54-94a151747c62', 'fills', null, null,
        '7ec64e73-3d1d-41ad-9843-472ad9ff87f2', '2022-07-03 04:55:52.000000', '2022-07-03 04:56:02.000000', 'AES',
        false, null, 'later than');
INSERT INTO public.locus_relations (uid_locus, uid_locus_2_related, type, uid_sketch, sketch_description, uid, created,
                                    modified, modified_by, repl_deleted, repl_tag, chronology)
VALUES ('64fc871b-dd5d-4ee6-ad54-94a151747c62', 'bd5f2af7-e017-4125-9ff5-02cd15c89e63', 'is filled by', null, null,
        '87e02a88-d7a0-4cbb-91b8-52e59957805c', '2022-07-03 04:56:02.000000', '2022-07-03 04:56:02.000000', 'AES',
        false, null, 'earlier than');
INSERT INTO public.locus_relations (uid_locus, uid_locus_2_related, type, uid_sketch, sketch_description, uid, created,
                                    modified, modified_by, repl_deleted, repl_tag, chronology)
VALUES ('769c19c9-1f0a-4df5-9c47-69c420576336', '4058a1e2-257c-4137-97ef-7e3ef902eab2', 'above', null, null,
        '04ea8ef1-3aaf-481e-8287-754e80087ff8', '2022-07-04 02:10:54.000000', '2022-07-04 02:11:07.000000', 'AES',
        false, null, 'later than');
INSERT INTO public.locus_relations (uid_locus, uid_locus_2_related, type, uid_sketch, sketch_description, uid, created,
                                    modified, modified_by, repl_deleted, repl_tag, chronology)
VALUES ('4058a1e2-257c-4137-97ef-7e3ef902eab2', '769c19c9-1f0a-4df5-9c47-69c420576336', 'below', null, null,
        '619797d4-49c3-4d71-aa88-bf6e26b90c7a', '2022-07-04 02:11:07.000000', '2022-07-04 02:11:07.000000', 'AES',
        false, null, 'earlier than');
INSERT INTO public.locus_relations (uid_locus, uid_locus_2_related, type, uid_sketch, sketch_description, uid, created,
                                    modified, modified_by, repl_deleted, repl_tag, chronology)
VALUES ('cd593a56-e9f0-42b6-8dc2-4c0f556c5ed3', '4159a7a6-b87e-4929-a3ae-ac796637a4f0', 'below', null, null,
        'c81a920c-c056-4d13-93ca-59b6ed2b4523', '2022-07-08 08:36:44.000000', '2022-07-08 08:38:01.000000', 'AES',
        false, null, 'earlier than');
INSERT INTO public.locus_relations (uid_locus, uid_locus_2_related, type, uid_sketch, sketch_description, uid, created,
                                    modified, modified_by, repl_deleted, repl_tag, chronology)
VALUES ('cd593a56-e9f0-42b6-8dc2-4c0f556c5ed3', 'ce6fbcd3-3f13-4edc-84bd-5210fb171181', 'below', null, null,
        'da296d16-ca56-4c81-a9f4-a36fe20d3503', '2022-07-08 08:36:53.000000', '2022-07-08 08:37:59.000000', 'AES',
        false, null, 'earlier than');
INSERT INTO public.locus_relations (uid_locus, uid_locus_2_related, type, uid_sketch, sketch_description, uid, created,
                                    modified, modified_by, repl_deleted, repl_tag, chronology)
VALUES ('4159a7a6-b87e-4929-a3ae-ac796637a4f0', 'ce6fbcd3-3f13-4edc-84bd-5210fb171181', 'below', null, null,
        'ee23ad6e-9090-450f-843a-04fa0e815572', '2022-07-08 08:38:18.000000', '2022-07-08 08:38:38.000000', 'AES',
        false, null, 'earlier than');
INSERT INTO public.locus_relations (uid_locus, uid_locus_2_related, type, uid_sketch, sketch_description, uid, created,
                                    modified, modified_by, repl_deleted, repl_tag, chronology)
VALUES ('1eb37ded-0ce3-4cb5-91b1-a27f1e9b5190', '4058a1e2-257c-4137-97ef-7e3ef902eab2', 'below', null, null,
        'c8d11030-48da-464a-bd0a-60c505e8ce0a', '2022-07-08 08:39:00.000000', '2022-07-08 08:39:09.000000', 'AES',
        false, null, 'earlier than');
INSERT INTO public.locus_relations (uid_locus, uid_locus_2_related, type, uid_sketch, sketch_description, uid, created,
                                    modified, modified_by, repl_deleted, repl_tag, chronology)
VALUES ('1eb37ded-0ce3-4cb5-91b1-a27f1e9b5190', '64905a74-c2a5-4b93-854b-a540b469c7f1', 'abuts', null, null,
        '053935d8-03e0-4406-a2b3-229ee6a3619c', '2022-07-08 08:39:14.000000', '2022-07-08 08:39:54.000000', 'AES',
        false, null, 'later than');
INSERT INTO public.locus_relations (uid_locus, uid_locus_2_related, type, uid_sketch, sketch_description, uid, created,
                                    modified, modified_by, repl_deleted, repl_tag, chronology)
VALUES ('05594aa5-1c66-482e-8349-571d2fe4429c', '4058a1e2-257c-4137-97ef-7e3ef902eab2', 'below', null, null,
        '266852d6-0853-4da5-9b6a-316c04ce040f', '2022-07-08 08:40:07.000000', '2022-07-08 08:40:14.000000', 'AES',
        false, null, 'earlier than');
INSERT INTO public.locus_relations (uid_locus, uid_locus_2_related, type, uid_sketch, sketch_description, uid, created,
                                    modified, modified_by, repl_deleted, repl_tag, chronology)
VALUES ('43ebc1f0-06ae-48fe-8fff-61a904c2d0f3', '4058a1e2-257c-4137-97ef-7e3ef902eab2', 'below', null, null,
        '368efedd-38ab-42c4-a9d5-fdd2061fe40b', '2022-07-08 08:40:49.000000', '2022-07-08 08:40:56.000000', 'AES',
        false, null, 'earlier than');
INSERT INTO public.locus_relations (uid_locus, uid_locus_2_related, type, uid_sketch, sketch_description, uid, created,
                                    modified, modified_by, repl_deleted, repl_tag, chronology)
VALUES ('28d00a9c-de55-4fdc-92d0-8ee47dad8687', '4058a1e2-257c-4137-97ef-7e3ef902eab2', 'below', null, null,
        '8b9571c4-a369-49a0-9312-4e64faed779c', '2022-07-08 08:41:12.000000', '2022-07-08 08:41:21.000000', 'AES',
        false, null, 'earlier than');
INSERT INTO public.locus_relations (uid_locus, uid_locus_2_related, type, uid_sketch, sketch_description, uid, created,
                                    modified, modified_by, repl_deleted, repl_tag, chronology)
VALUES ('28d00a9c-de55-4fdc-92d0-8ee47dad8687', 'c3b89d7f-a6a6-424e-afb0-4283e0a4f7a2', 'abuts', null, null,
        '80930982-dcac-4c07-b50b-c91da53c1ef4', '2022-07-08 08:41:22.000000', '2022-07-08 08:41:33.000000', 'AES',
        false, null, 'later than');
INSERT INTO public.locus_relations (uid_locus, uid_locus_2_related, type, uid_sketch, sketch_description, uid, created,
                                    modified, modified_by, repl_deleted, repl_tag, chronology)
VALUES ('ce6fbcd3-3f13-4edc-84bd-5210fb171181', 'cd593a56-e9f0-42b6-8dc2-4c0f556c5ed3', 'above', null, null,
        '09a46fa8-cb94-49fd-8a4c-d35fdd623f74', '2022-07-08 08:37:59.000000', '2022-07-08 08:37:59.000000', 'AES',
        false, null, 'later than');
INSERT INTO public.locus_relations (uid_locus, uid_locus_2_related, type, uid_sketch, sketch_description, uid, created,
                                    modified, modified_by, repl_deleted, repl_tag, chronology)
VALUES ('4159a7a6-b87e-4929-a3ae-ac796637a4f0', 'cd593a56-e9f0-42b6-8dc2-4c0f556c5ed3', 'above', null, null,
        'ab88227e-6de3-4280-9f4e-edab87ae7310', '2022-07-08 08:38:01.000000', '2022-07-08 08:38:01.000000', 'AES',
        false, null, 'later than');
INSERT INTO public.locus_relations (uid_locus, uid_locus_2_related, type, uid_sketch, sketch_description, uid, created,
                                    modified, modified_by, repl_deleted, repl_tag, chronology)
VALUES ('ce6fbcd3-3f13-4edc-84bd-5210fb171181', '4159a7a6-b87e-4929-a3ae-ac796637a4f0', 'above', null, null,
        'f1b650b6-bbc9-4032-8024-a372c54427c1', '2022-07-08 08:38:38.000000', '2022-07-08 08:38:38.000000', 'AES',
        false, null, 'later than');
INSERT INTO public.locus_relations (uid_locus, uid_locus_2_related, type, uid_sketch, sketch_description, uid, created,
                                    modified, modified_by, repl_deleted, repl_tag, chronology)
VALUES ('4058a1e2-257c-4137-97ef-7e3ef902eab2', '1eb37ded-0ce3-4cb5-91b1-a27f1e9b5190', 'above', null, null,
        '1b96227c-cb18-4744-abc9-834521224151', '2022-07-08 08:39:08.000000', '2022-07-08 08:39:08.000000', 'AES',
        false, null, 'later than');
INSERT INTO public.locus_relations (uid_locus, uid_locus_2_related, type, uid_sketch, sketch_description, uid, created,
                                    modified, modified_by, repl_deleted, repl_tag, chronology)
VALUES ('64905a74-c2a5-4b93-854b-a540b469c7f1', '1eb37ded-0ce3-4cb5-91b1-a27f1e9b5190', 'is abutted by', null, null,
        '09dd1694-6848-4870-a40a-0c6672655494', '2022-07-08 08:39:54.000000', '2022-07-08 08:39:54.000000', 'AES',
        false, null, 'earlier than');
INSERT INTO public.locus_relations (uid_locus, uid_locus_2_related, type, uid_sketch, sketch_description, uid, created,
                                    modified, modified_by, repl_deleted, repl_tag, chronology)
VALUES ('4058a1e2-257c-4137-97ef-7e3ef902eab2', '05594aa5-1c66-482e-8349-571d2fe4429c', 'above', null, null,
        'dd411668-7402-4c06-8f93-964468656f41', '2022-07-08 08:40:14.000000', '2022-07-08 08:40:14.000000', 'AES',
        false, null, 'later than');
INSERT INTO public.locus_relations (uid_locus, uid_locus_2_related, type, uid_sketch, sketch_description, uid, created,
                                    modified, modified_by, repl_deleted, repl_tag, chronology)
VALUES ('4058a1e2-257c-4137-97ef-7e3ef902eab2', '43ebc1f0-06ae-48fe-8fff-61a904c2d0f3', 'above', null, null,
        '2de7cdb8-ff4c-4414-8ae4-06b2c5eadf3a', '2022-07-08 08:40:56.000000', '2022-07-08 08:40:56.000000', 'AES',
        false, null, 'later than');
INSERT INTO public.locus_relations (uid_locus, uid_locus_2_related, type, uid_sketch, sketch_description, uid, created,
                                    modified, modified_by, repl_deleted, repl_tag, chronology)
VALUES ('4058a1e2-257c-4137-97ef-7e3ef902eab2', '28d00a9c-de55-4fdc-92d0-8ee47dad8687', 'above', null, null,
        '719dc7ab-d48f-40be-956d-65587d7d7faf', '2022-07-08 08:41:20.000000', '2022-07-08 08:41:20.000000', 'AES',
        false, null, 'later than');
INSERT INTO public.locus_relations (uid_locus, uid_locus_2_related, type, uid_sketch, sketch_description, uid, created,
                                    modified, modified_by, repl_deleted, repl_tag, chronology)
VALUES ('c3b89d7f-a6a6-424e-afb0-4283e0a4f7a2', '28d00a9c-de55-4fdc-92d0-8ee47dad8687', 'is abutted by', null, null,
        '1429485a-3380-46fa-bbda-a5b981b1d214', '2022-07-08 08:41:32.000000', '2022-07-08 08:41:32.000000', 'AES',
        false, null, 'earlier than');
INSERT INTO public.locus_relations (uid_locus, uid_locus_2_related, type, uid_sketch, sketch_description, uid, created,
                                    modified, modified_by, repl_deleted, repl_tag, chronology)
VALUES ('5faa41a3-24ca-4420-8049-2042d2ec38df', '28d00a9c-de55-4fdc-92d0-8ee47dad8687', 'below', null, null,
        '0771c4de-dfbb-4e02-9ee7-e9b7ad514f25', '2022-07-12 03:32:51.000000', '2022-07-12 03:33:04.000000', 'AES',
        false, null, 'earlier than');
INSERT INTO public.locus_relations (uid_locus, uid_locus_2_related, type, uid_sketch, sketch_description, uid, created,
                                    modified, modified_by, repl_deleted, repl_tag, chronology)
VALUES ('5faa41a3-24ca-4420-8049-2042d2ec38df', 'c3b89d7f-a6a6-424e-afb0-4283e0a4f7a2', 'abuts', null, null,
        '54ebcbca-76be-4b6c-92bc-5ee5d623630f', '2022-07-12 03:33:07.000000', '2022-07-12 03:33:18.000000', 'AES',
        false, null, 'later than');
INSERT INTO public.locus_relations (uid_locus, uid_locus_2_related, type, uid_sketch, sketch_description, uid, created,
                                    modified, modified_by, repl_deleted, repl_tag, chronology)
VALUES ('5faa41a3-24ca-4420-8049-2042d2ec38df', '05594aa5-1c66-482e-8349-571d2fe4429c', 'below', null, null,
        '04457f9a-af3a-4399-9f8f-51afab3b568a', '2022-07-12 06:47:45.000000', '2022-07-12 06:47:53.000000', 'AES',
        false, null, 'earlier than');
INSERT INTO public.locus_relations (uid_locus, uid_locus_2_related, type, uid_sketch, sketch_description, uid, created,
                                    modified, modified_by, repl_deleted, repl_tag, chronology)
VALUES ('c22676f5-fcfd-4e35-ab69-342202ad083e', 'cd593a56-e9f0-42b6-8dc2-4c0f556c5ed3', 'below', null, null,
        '441a949e-9978-4e9d-b4bf-252b409ae712', '2022-07-12 06:48:04.000000', '2022-07-12 06:48:17.000000', 'AES',
        false, null, 'earlier than');
INSERT INTO public.locus_relations (uid_locus, uid_locus_2_related, type, uid_sketch, sketch_description, uid, created,
                                    modified, modified_by, repl_deleted, repl_tag, chronology)
VALUES ('a31f66e9-f9f0-4423-9480-ebc749753f8e', 'cd593a56-e9f0-42b6-8dc2-4c0f556c5ed3', 'below', null, null,
        'dc39d1b2-5358-4796-8da7-6ebfba68a095', '2022-07-12 06:48:30.000000', '2022-07-12 06:48:38.000000', 'AES',
        false, null, 'earlier than');
INSERT INTO public.locus_relations (uid_locus, uid_locus_2_related, type, uid_sketch, sketch_description, uid, created,
                                    modified, modified_by, repl_deleted, repl_tag, chronology)
VALUES ('28d00a9c-de55-4fdc-92d0-8ee47dad8687', '5faa41a3-24ca-4420-8049-2042d2ec38df', 'above', null, null,
        'acf0ee3a-dd95-4088-9770-fa7b67e052d4', '2022-07-12 03:33:04.000000', '2022-07-12 03:33:04.000000', 'AES',
        false, null, 'later than');
INSERT INTO public.locus_relations (uid_locus, uid_locus_2_related, type, uid_sketch, sketch_description, uid, created,
                                    modified, modified_by, repl_deleted, repl_tag, chronology)
VALUES ('c3b89d7f-a6a6-424e-afb0-4283e0a4f7a2', '5faa41a3-24ca-4420-8049-2042d2ec38df', 'is abutted by', null, null,
        'e1170ed8-a271-49c0-b0e0-d6ea53bd2847', '2022-07-12 03:33:18.000000', '2022-07-12 03:33:18.000000', 'AES',
        false, null, 'earlier than');
INSERT INTO public.locus_relations (uid_locus, uid_locus_2_related, type, uid_sketch, sketch_description, uid, created,
                                    modified, modified_by, repl_deleted, repl_tag, chronology)
VALUES ('05594aa5-1c66-482e-8349-571d2fe4429c', '5faa41a3-24ca-4420-8049-2042d2ec38df', 'above', null, null,
        '376f877d-e8dc-4e84-8a14-165a03643add', '2022-07-12 06:47:53.000000', '2022-07-12 06:47:53.000000', 'AES',
        false, null, 'later than');
INSERT INTO public.locus_relations (uid_locus, uid_locus_2_related, type, uid_sketch, sketch_description, uid, created,
                                    modified, modified_by, repl_deleted, repl_tag, chronology)
VALUES ('cd593a56-e9f0-42b6-8dc2-4c0f556c5ed3', 'c22676f5-fcfd-4e35-ab69-342202ad083e', 'above', null, null,
        '2b796ef1-357b-4f8c-af86-4cd3702e29d5', '2022-07-12 06:48:17.000000', '2022-07-12 06:48:17.000000', 'AES',
        false, null, 'later than');
INSERT INTO public.locus_relations (uid_locus, uid_locus_2_related, type, uid_sketch, sketch_description, uid, created,
                                    modified, modified_by, repl_deleted, repl_tag, chronology)
VALUES ('cd593a56-e9f0-42b6-8dc2-4c0f556c5ed3', 'a31f66e9-f9f0-4423-9480-ebc749753f8e', 'above', null, null,
        'd5e2b554-b899-4d0f-97ef-6491774cc995', '2022-07-12 06:48:38.000000', '2022-07-12 06:48:38.000000', 'AES',
        false, null, 'later than');
INSERT INTO public.locus_relations (uid_locus, uid_locus_2_related, type, uid_sketch, sketch_description, uid, created,
                                    modified, modified_by, repl_deleted, repl_tag, chronology)
VALUES ('5f65af9a-b09e-402d-a85e-591500f71031', 'a31f66e9-f9f0-4423-9480-ebc749753f8e', 'below', null, null,
        '1a1e041a-8854-4dee-9ebc-4239393e9bc3', '2022-07-13 03:41:13.000000', '2022-07-13 03:41:22.000000', 'AES',
        false, null, 'earlier than');
INSERT INTO public.locus_relations (uid_locus, uid_locus_2_related, type, uid_sketch, sketch_description, uid, created,
                                    modified, modified_by, repl_deleted, repl_tag, chronology)
VALUES ('5f65af9a-b09e-402d-a85e-591500f71031', 'c22676f5-fcfd-4e35-ab69-342202ad083e', 'above', null, null,
        '6c7190a3-bb6d-4633-99ad-a1468b2df237', '2022-07-13 03:41:26.000000', '2022-07-13 03:41:36.000000', 'AES',
        false, null, 'later than');
INSERT INTO public.locus_relations (uid_locus, uid_locus_2_related, type, uid_sketch, sketch_description, uid, created,
                                    modified, modified_by, repl_deleted, repl_tag, chronology)
VALUES ('a31f66e9-f9f0-4423-9480-ebc749753f8e', '5f65af9a-b09e-402d-a85e-591500f71031', 'above', null, null,
        '3e075bbd-f088-4b9f-b2ae-d228f6c842ff', '2022-07-13 03:41:22.000000', '2022-07-13 03:41:22.000000', 'AES',
        false, null, 'later than');
INSERT INTO public.locus_relations (uid_locus, uid_locus_2_related, type, uid_sketch, sketch_description, uid, created,
                                    modified, modified_by, repl_deleted, repl_tag, chronology)
VALUES ('c22676f5-fcfd-4e35-ab69-342202ad083e', '5f65af9a-b09e-402d-a85e-591500f71031', 'below', null, null,
        'cf8670b1-f58a-4117-95aa-8286d7f34574', '2022-07-13 03:41:35.000000', '2022-07-13 03:41:35.000000', 'AES',
        false, null, 'earlier than');
INSERT INTO public.locus_relations (uid_locus, uid_locus_2_related, type, uid_sketch, sketch_description, uid, created,
                                    modified, modified_by, repl_deleted, repl_tag, chronology)
VALUES ('c22676f5-fcfd-4e35-ab69-342202ad083e', 'a31f66e9-f9f0-4423-9480-ebc749753f8e', 'below', null, null,
        '463299c8-adad-455c-8deb-c06c1a8b507b', '2022-07-18 06:10:58.000000', '2022-07-18 06:11:22.000000', 'AES',
        false, null, 'earlier than');
INSERT INTO public.locus_relations (uid_locus, uid_locus_2_related, type, uid_sketch, sketch_description, uid, created,
                                    modified, modified_by, repl_deleted, repl_tag, chronology)
VALUES ('c22676f5-fcfd-4e35-ab69-342202ad083e', '3c43e784-291b-44f7-8b72-401344b67c5b', 'above', null, null,
        '7cfdb3b9-5f2a-4d03-9bfc-32907202d68b', '2022-07-18 06:12:16.000000', '2022-07-18 06:12:28.000000', 'AES',
        false, null, 'later than');
INSERT INTO public.locus_relations (uid_locus, uid_locus_2_related, type, uid_sketch, sketch_description, uid, created,
                                    modified, modified_by, repl_deleted, repl_tag, chronology)
VALUES ('c22676f5-fcfd-4e35-ab69-342202ad083e', '1d9618f4-4bbc-476c-abab-c2a72f20830a', 'above', null, null,
        '1f436a8e-85c3-47ed-93e0-5e4438187d65', '2022-07-18 06:12:34.000000', '2022-07-18 06:12:45.000000', 'AES',
        false, null, 'later than');
INSERT INTO public.locus_relations (uid_locus, uid_locus_2_related, type, uid_sketch, sketch_description, uid, created,
                                    modified, modified_by, repl_deleted, repl_tag, chronology)
VALUES ('c22676f5-fcfd-4e35-ab69-342202ad083e', '0020d171-0ab4-4154-b469-3b7f8e55f619', 'above', null, null,
        '278c1338-7d41-4341-bb70-2ac3bc0cf435', '2022-07-18 06:12:47.000000', '2022-07-18 06:12:57.000000', 'AES',
        false, null, 'later than');
INSERT INTO public.locus_relations (uid_locus, uid_locus_2_related, type, uid_sketch, sketch_description, uid, created,
                                    modified, modified_by, repl_deleted, repl_tag, chronology)
VALUES ('0020d171-0ab4-4154-b469-3b7f8e55f619', '1d9618f4-4bbc-476c-abab-c2a72f20830a', 'abuts', null, null,
        'f8933efa-55d2-4b84-a1c0-451f91159bb3', '2022-07-18 06:13:18.000000', '2022-07-18 06:13:33.000000', 'AES',
        false, null, 'later than');
INSERT INTO public.locus_relations (uid_locus, uid_locus_2_related, type, uid_sketch, sketch_description, uid, created,
                                    modified, modified_by, repl_deleted, repl_tag, chronology)
VALUES ('a31f66e9-f9f0-4423-9480-ebc749753f8e', 'c22676f5-fcfd-4e35-ab69-342202ad083e', 'above', null, null,
        '89440d8b-5055-4bb3-8790-c41b7852ccf4', '2022-07-18 06:11:22.000000', '2022-07-18 06:11:22.000000', 'AES',
        false, null, 'later than');
INSERT INTO public.locus_relations (uid_locus, uid_locus_2_related, type, uid_sketch, sketch_description, uid, created,
                                    modified, modified_by, repl_deleted, repl_tag, chronology)
VALUES ('3c43e784-291b-44f7-8b72-401344b67c5b', 'c22676f5-fcfd-4e35-ab69-342202ad083e', 'below', null, null,
        'a027039e-e888-4238-a9f6-df97af86b61b', '2022-07-18 06:12:27.000000', '2022-07-18 06:12:27.000000', 'AES',
        false, null, 'earlier than');
INSERT INTO public.locus_relations (uid_locus, uid_locus_2_related, type, uid_sketch, sketch_description, uid, created,
                                    modified, modified_by, repl_deleted, repl_tag, chronology)
VALUES ('1d9618f4-4bbc-476c-abab-c2a72f20830a', 'c22676f5-fcfd-4e35-ab69-342202ad083e', 'below', null, null,
        'd2d492c3-32f6-4ab2-aef8-e37fe80c312c', '2022-07-18 06:12:44.000000', '2022-07-18 06:12:44.000000', 'AES',
        false, null, 'earlier than');
INSERT INTO public.locus_relations (uid_locus, uid_locus_2_related, type, uid_sketch, sketch_description, uid, created,
                                    modified, modified_by, repl_deleted, repl_tag, chronology)
VALUES ('0020d171-0ab4-4154-b469-3b7f8e55f619', 'c22676f5-fcfd-4e35-ab69-342202ad083e', 'below', null, null,
        'd2686baf-1548-4a99-9e1a-0fc09d71a304', '2022-07-18 06:12:57.000000', '2022-07-18 06:12:57.000000', 'AES',
        false, null, 'earlier than');
INSERT INTO public.locus_relations (uid_locus, uid_locus_2_related, type, uid_sketch, sketch_description, uid, created,
                                    modified, modified_by, repl_deleted, repl_tag, chronology)
VALUES ('1d9618f4-4bbc-476c-abab-c2a72f20830a', '0020d171-0ab4-4154-b469-3b7f8e55f619', 'is abutted by', null, null,
        'ab31afd3-bfe5-4615-aedd-ddbebe3b0c7b', '2022-07-18 06:13:33.000000', '2022-07-18 06:13:33.000000', 'AES',
        false, null, 'earlier than');
INSERT INTO public.locus_relations (uid_locus, uid_locus_2_related, type, uid_sketch, sketch_description, uid, created,
                                    modified, modified_by, repl_deleted, repl_tag, chronology)
VALUES ('6fbd50a5-70cf-450f-ac66-9174ada4dc73', '9102721f-742a-45d2-a327-b7783f42fc09', 'fills', null, null,
        '2814fc1b-1332-4b23-9183-199d1180011b', '2022-07-22 02:52:42.000000', '2022-07-22 02:52:53.000000', 'AES',
        false, null, 'later than');
INSERT INTO public.locus_relations (uid_locus, uid_locus_2_related, type, uid_sketch, sketch_description, uid, created,
                                    modified, modified_by, repl_deleted, repl_tag, chronology)
VALUES ('9102721f-742a-45d2-a327-b7783f42fc09', '1a377fbe-85bb-48ba-98b7-54ca4cda890b', 'cuts through', null, null,
        '33464ded-e478-4005-815d-056dabe66dbe', '2022-07-22 02:53:04.000000', '2022-07-22 11:25:57.000000', 'AES',
        false, null, 'later than');
INSERT INTO public.locus_relations (uid_locus, uid_locus_2_related, type, uid_sketch, sketch_description, uid, created,
                                    modified, modified_by, repl_deleted, repl_tag, chronology)
VALUES ('dbf862ad-340d-42f1-a720-9cd43c7ac3ea', '1d9618f4-4bbc-476c-abab-c2a72f20830a', 'abuts', null, null,
        'badcf3fd-dd1a-4d3f-993a-d0713554664b', '2022-07-22 02:53:37.000000', '2022-07-22 02:54:03.000000', 'AES',
        false, null, 'later than');
INSERT INTO public.locus_relations (uid_locus, uid_locus_2_related, type, uid_sketch, sketch_description, uid, created,
                                    modified, modified_by, repl_deleted, repl_tag, chronology)
VALUES ('dbf862ad-340d-42f1-a720-9cd43c7ac3ea', '3c43e784-291b-44f7-8b72-401344b67c5b', 'below', null, null,
        '11e086c9-1b6a-4ec3-ab29-22dce62102ae', '2022-07-22 02:54:42.000000', '2022-07-22 02:54:54.000000', 'AES',
        false, null, 'earlier than');
INSERT INTO public.locus_relations (uid_locus, uid_locus_2_related, type, uid_sketch, sketch_description, uid, created,
                                    modified, modified_by, repl_deleted, repl_tag, chronology)
VALUES ('6fbd50a5-70cf-450f-ac66-9174ada4dc73', '3c43e784-291b-44f7-8b72-401344b67c5b', 'below', null, null,
        'd1e04a6b-3a72-4670-9928-38c4526e6472', '2022-07-22 02:55:04.000000', '2022-07-22 02:55:14.000000', 'AES',
        false, null, 'earlier than');
INSERT INTO public.locus_relations (uid_locus, uid_locus_2_related, type, uid_sketch, sketch_description, uid, created,
                                    modified, modified_by, repl_deleted, repl_tag, chronology)
VALUES ('9102721f-742a-45d2-a327-b7783f42fc09', '3c43e784-291b-44f7-8b72-401344b67c5b', 'below', null, null,
        'b789001c-b7ea-4853-b802-adeefa24147d', '2022-07-22 02:55:21.000000', '2022-07-22 02:55:29.000000', 'AES',
        false, null, 'earlier than');
INSERT INTO public.locus_relations (uid_locus, uid_locus_2_related, type, uid_sketch, sketch_description, uid, created,
                                    modified, modified_by, repl_deleted, repl_tag, chronology)
VALUES ('1a377fbe-85bb-48ba-98b7-54ca4cda890b', '3c43e784-291b-44f7-8b72-401344b67c5b', 'below', null, null,
        '72ab2878-e9ea-4d4e-a8e6-424be78a8bd4', '2022-07-22 11:25:21.000000', '2022-07-22 11:25:38.000000', 'AES',
        false, null, 'earlier than');
INSERT INTO public.locus_relations (uid_locus, uid_locus_2_related, type, uid_sketch, sketch_description, uid, created,
                                    modified, modified_by, repl_deleted, repl_tag, chronology)
VALUES ('dbf862ad-340d-42f1-a720-9cd43c7ac3ea', '6fbd50a5-70cf-450f-ac66-9174ada4dc73', 'above', null, null,
        '4a126d76-f791-4179-880c-62f02f052c63', '2022-07-22 11:26:16.000000', '2022-07-22 11:26:28.000000', 'AES',
        false, null, 'later than');
INSERT INTO public.locus_relations (uid_locus, uid_locus_2_related, type, uid_sketch, sketch_description, uid, created,
                                    modified, modified_by, repl_deleted, repl_tag, chronology)
VALUES ('9102721f-742a-45d2-a327-b7783f42fc09', '6fbd50a5-70cf-450f-ac66-9174ada4dc73', 'is filled by', null, null,
        '484b76ee-7879-42c7-9a5b-be506e100cde', '2022-07-22 02:52:53.000000', '2022-07-22 02:52:53.000000', 'AES',
        false, null, 'earlier than');
INSERT INTO public.locus_relations (uid_locus, uid_locus_2_related, type, uid_sketch, sketch_description, uid, created,
                                    modified, modified_by, repl_deleted, repl_tag, chronology)
VALUES ('1d9618f4-4bbc-476c-abab-c2a72f20830a', 'dbf862ad-340d-42f1-a720-9cd43c7ac3ea', 'is abutted by', null, null,
        '3c39b24c-e0d8-405d-82d1-718c87cacdfb', '2022-07-22 02:54:03.000000', '2022-07-22 02:54:03.000000', 'AES',
        false, null, 'earlier than');
INSERT INTO public.locus_relations (uid_locus, uid_locus_2_related, type, uid_sketch, sketch_description, uid, created,
                                    modified, modified_by, repl_deleted, repl_tag, chronology)
VALUES ('3c43e784-291b-44f7-8b72-401344b67c5b', 'dbf862ad-340d-42f1-a720-9cd43c7ac3ea', 'above', null, null,
        '314d77dd-5f05-4ac6-a9d8-87bde93a1d29', '2022-07-22 02:54:54.000000', '2022-07-22 02:54:54.000000', 'AES',
        false, null, 'later than');
INSERT INTO public.locus_relations (uid_locus, uid_locus_2_related, type, uid_sketch, sketch_description, uid, created,
                                    modified, modified_by, repl_deleted, repl_tag, chronology)
VALUES ('3c43e784-291b-44f7-8b72-401344b67c5b', '6fbd50a5-70cf-450f-ac66-9174ada4dc73', 'above', null, null,
        'ba78303a-588a-4f8b-8829-b275d1bf87df', '2022-07-22 02:55:13.000000', '2022-07-22 02:55:13.000000', 'AES',
        false, null, 'later than');
INSERT INTO public.locus_relations (uid_locus, uid_locus_2_related, type, uid_sketch, sketch_description, uid, created,
                                    modified, modified_by, repl_deleted, repl_tag, chronology)
VALUES ('3c43e784-291b-44f7-8b72-401344b67c5b', '9102721f-742a-45d2-a327-b7783f42fc09', 'above', null, null,
        '276d083b-54ec-4689-8283-789346ab29ff', '2022-07-22 02:55:29.000000', '2022-07-22 02:55:29.000000', 'AES',
        false, null, 'later than');
INSERT INTO public.locus_relations (uid_locus, uid_locus_2_related, type, uid_sketch, sketch_description, uid, created,
                                    modified, modified_by, repl_deleted, repl_tag, chronology)
VALUES ('3c43e784-291b-44f7-8b72-401344b67c5b', '1a377fbe-85bb-48ba-98b7-54ca4cda890b', 'above', null, null,
        '753e307e-b8f7-480a-91ea-032674fdc80d', '2022-07-22 11:25:38.000000', '2022-07-22 11:25:38.000000', 'AES',
        false, null, 'later than');
INSERT INTO public.locus_relations (uid_locus, uid_locus_2_related, type, uid_sketch, sketch_description, uid, created,
                                    modified, modified_by, repl_deleted, repl_tag, chronology)
VALUES ('1a377fbe-85bb-48ba-98b7-54ca4cda890b', '9102721f-742a-45d2-a327-b7783f42fc09', 'cut by', null, null,
        '25cad0ba-e55c-4276-a22d-7df3154a6bf3', '2022-07-22 11:25:57.000000', '2022-07-22 11:25:57.000000', 'AES',
        false, null, 'earlier than');
INSERT INTO public.locus_relations (uid_locus, uid_locus_2_related, type, uid_sketch, sketch_description, uid, created,
                                    modified, modified_by, repl_deleted, repl_tag, chronology)
VALUES ('6fbd50a5-70cf-450f-ac66-9174ada4dc73', 'dbf862ad-340d-42f1-a720-9cd43c7ac3ea', 'below', null, null,
        'f6e0ce37-3da1-41bf-a903-d090c20f04da', '2022-07-22 11:26:27.000000', '2022-07-22 11:26:27.000000', 'AES',
        false, null, 'earlier than');
INSERT INTO public.locus_relations (uid_locus, uid_locus_2_related, type, uid_sketch, sketch_description, uid, created,
                                    modified, modified_by, repl_deleted, repl_tag, chronology)
VALUES ('64905a74-c2a5-4b93-854b-a540b469c7f1', '4058a1e2-257c-4137-97ef-7e3ef902eab2', 'is abutted by', null, null,
        '9cec4836-8392-4a46-82fe-121184ff1d8e', '2022-07-28 05:38:31.000000', '2022-07-28 05:38:45.000000', 'AES',
        false, null, 'earlier than');
INSERT INTO public.locus_relations (uid_locus, uid_locus_2_related, type, uid_sketch, sketch_description, uid, created,
                                    modified, modified_by, repl_deleted, repl_tag, chronology)
VALUES ('64905a74-c2a5-4b93-854b-a540b469c7f1', '05594aa5-1c66-482e-8349-571d2fe4429c', 'is abutted by', null, null,
        '38fa9643-ce8f-4fdf-a65d-a959220f0d4b', '2022-07-28 05:38:48.000000', '2022-07-28 05:38:57.000000', 'AES',
        false, null, 'earlier than');
INSERT INTO public.locus_relations (uid_locus, uid_locus_2_related, type, uid_sketch, sketch_description, uid, created,
                                    modified, modified_by, repl_deleted, repl_tag, chronology)
VALUES ('64905a74-c2a5-4b93-854b-a540b469c7f1', '28d00a9c-de55-4fdc-92d0-8ee47dad8687', 'is abutted by', null, null,
        'b77ce9e7-120d-4243-93f8-ea09ecf6f3df', '2022-07-28 05:38:59.000000', '2022-07-28 05:39:09.000000', 'AES',
        false, null, 'earlier than');
INSERT INTO public.locus_relations (uid_locus, uid_locus_2_related, type, uid_sketch, sketch_description, uid, created,
                                    modified, modified_by, repl_deleted, repl_tag, chronology)
VALUES ('64905a74-c2a5-4b93-854b-a540b469c7f1', '5faa41a3-24ca-4420-8049-2042d2ec38df', 'is abutted by', null, null,
        '3b703f33-e257-4552-9d1d-357c4dc417a7', '2022-07-28 05:39:10.000000', '2022-07-28 05:39:18.000000', 'AES',
        false, null, 'earlier than');
INSERT INTO public.locus_relations (uid_locus, uid_locus_2_related, type, uid_sketch, sketch_description, uid, created,
                                    modified, modified_by, repl_deleted, repl_tag, chronology)
VALUES ('64905a74-c2a5-4b93-854b-a540b469c7f1', '9d104fc7-d66d-4aa4-9c03-390882143e0a', 'is abutted by', null, null,
        '82a68392-e980-45f4-8851-a85c03010e07', '2022-07-28 05:39:20.000000', '2022-07-28 05:39:29.000000', 'AES',
        false, null, 'earlier than');
INSERT INTO public.locus_relations (uid_locus, uid_locus_2_related, type, uid_sketch, sketch_description, uid, created,
                                    modified, modified_by, repl_deleted, repl_tag, chronology)
VALUES ('4058a1e2-257c-4137-97ef-7e3ef902eab2', '2b89dfe6-328b-4d81-8092-38c7b2c4bfcd', 'below', null, null,
        '04740fa4-de8d-4ec0-bef6-92da8be5b81a', '2022-07-28 06:19:10.000000', '2022-07-28 06:19:23.000000', 'AES',
        false, null, 'earlier than');
INSERT INTO public.locus_relations (uid_locus, uid_locus_2_related, type, uid_sketch, sketch_description, uid, created,
                                    modified, modified_by, repl_deleted, repl_tag, chronology)
VALUES ('64fc871b-dd5d-4ee6-ad54-94a151747c62', 'ce6fbcd3-3f13-4edc-84bd-5210fb171181', 'cuts through', null, null,
        'b7118b83-32a9-403a-ba71-3e584700f4b9', '2022-07-28 06:29:08.000000', '2022-07-28 06:29:17.000000', 'AES',
        false, null, 'later than');
INSERT INTO public.locus_relations (uid_locus, uid_locus_2_related, type, uid_sketch, sketch_description, uid, created,
                                    modified, modified_by, repl_deleted, repl_tag, chronology)
VALUES ('1eb37ded-0ce3-4cb5-91b1-a27f1e9b5190', '5faa41a3-24ca-4420-8049-2042d2ec38df', 'above', null, null,
        '95b6a879-6060-4e92-bcfd-dc84c0fe652b', '2022-07-28 07:00:29.000000', '2022-07-28 07:00:39.000000', 'AES',
        false, null, 'later than');
INSERT INTO public.locus_relations (uid_locus, uid_locus_2_related, type, uid_sketch, sketch_description, uid, created,
                                    modified, modified_by, repl_deleted, repl_tag, chronology)
VALUES ('43ebc1f0-06ae-48fe-8fff-61a904c2d0f3', '5faa41a3-24ca-4420-8049-2042d2ec38df', 'above', null, null,
        'd0f4eb46-b249-429f-89e7-0a13231df94a', '2022-07-28 08:35:22.000000', '2022-07-28 08:35:34.000000', 'AES',
        false, null, 'later than');
INSERT INTO public.locus_relations (uid_locus, uid_locus_2_related, type, uid_sketch, sketch_description, uid, created,
                                    modified, modified_by, repl_deleted, repl_tag, chronology)
VALUES ('3c43e784-291b-44f7-8b72-401344b67c5b', '1d9618f4-4bbc-476c-abab-c2a72f20830a', 'abuts', null, null,
        'a4d4f750-b1a5-4b42-bee3-a8032000aabe', '2022-07-18 06:13:39.000000', '2022-07-28 09:24:58.000000', 'AES',
        false, null, 'later than');
INSERT INTO public.locus_relations (uid_locus, uid_locus_2_related, type, uid_sketch, sketch_description, uid, created,
                                    modified, modified_by, repl_deleted, repl_tag, chronology)
VALUES ('4058a1e2-257c-4137-97ef-7e3ef902eab2', '64905a74-c2a5-4b93-854b-a540b469c7f1', 'abuts', null, null,
        '1f55c809-d46e-42f8-82de-0054b1d7d37e', '2022-07-28 05:38:45.000000', '2022-07-28 05:38:45.000000', 'AES',
        false, null, 'later than');
INSERT INTO public.locus_relations (uid_locus, uid_locus_2_related, type, uid_sketch, sketch_description, uid, created,
                                    modified, modified_by, repl_deleted, repl_tag, chronology)
VALUES ('05594aa5-1c66-482e-8349-571d2fe4429c', '64905a74-c2a5-4b93-854b-a540b469c7f1', 'abuts', null, null,
        'd43f5195-904c-4ff4-84a8-07918b6479fc', '2022-07-28 05:38:56.000000', '2022-07-28 05:38:56.000000', 'AES',
        false, null, 'later than');
INSERT INTO public.locus_relations (uid_locus, uid_locus_2_related, type, uid_sketch, sketch_description, uid, created,
                                    modified, modified_by, repl_deleted, repl_tag, chronology)
VALUES ('28d00a9c-de55-4fdc-92d0-8ee47dad8687', '64905a74-c2a5-4b93-854b-a540b469c7f1', 'abuts', null, null,
        'c6257a85-2636-4d0a-a17c-a974f7af38e8', '2022-07-28 05:39:08.000000', '2022-07-28 05:39:08.000000', 'AES',
        false, null, 'later than');
INSERT INTO public.locus_relations (uid_locus, uid_locus_2_related, type, uid_sketch, sketch_description, uid, created,
                                    modified, modified_by, repl_deleted, repl_tag, chronology)
VALUES ('5faa41a3-24ca-4420-8049-2042d2ec38df', '64905a74-c2a5-4b93-854b-a540b469c7f1', 'abuts', null, null,
        '39783812-d30e-4c55-a342-0e204e21911c', '2022-07-28 05:39:18.000000', '2022-07-28 05:39:18.000000', 'AES',
        false, null, 'later than');
INSERT INTO public.locus_relations (uid_locus, uid_locus_2_related, type, uid_sketch, sketch_description, uid, created,
                                    modified, modified_by, repl_deleted, repl_tag, chronology)
VALUES ('9d104fc7-d66d-4aa4-9c03-390882143e0a', '64905a74-c2a5-4b93-854b-a540b469c7f1', 'abuts', null, null,
        '7febe9ce-8b5c-45e1-8554-9d2fc17c1f2b', '2022-07-28 05:39:29.000000', '2022-07-28 05:39:29.000000', 'AES',
        false, null, 'later than');
INSERT INTO public.locus_relations (uid_locus, uid_locus_2_related, type, uid_sketch, sketch_description, uid, created,
                                    modified, modified_by, repl_deleted, repl_tag, chronology)
VALUES ('2b89dfe6-328b-4d81-8092-38c7b2c4bfcd', '4058a1e2-257c-4137-97ef-7e3ef902eab2', 'above', null, null,
        '4f4c5a5e-631c-4736-9db4-b680ed518620', '2022-07-28 06:19:22.000000', '2022-07-28 06:19:22.000000', 'AES',
        false, null, 'later than');
INSERT INTO public.locus_relations (uid_locus, uid_locus_2_related, type, uid_sketch, sketch_description, uid, created,
                                    modified, modified_by, repl_deleted, repl_tag, chronology)
VALUES ('ce6fbcd3-3f13-4edc-84bd-5210fb171181', '64fc871b-dd5d-4ee6-ad54-94a151747c62', 'cut by', null, null,
        '4ca43ee5-acc8-4bdf-9d54-b51de769fc3d', '2022-07-28 06:29:17.000000', '2022-07-28 06:29:17.000000', 'AES',
        false, null, 'earlier than');
INSERT INTO public.locus_relations (uid_locus, uid_locus_2_related, type, uid_sketch, sketch_description, uid, created,
                                    modified, modified_by, repl_deleted, repl_tag, chronology)
VALUES ('5faa41a3-24ca-4420-8049-2042d2ec38df', '1eb37ded-0ce3-4cb5-91b1-a27f1e9b5190', 'below', null, null,
        '1679fffd-585a-4783-abb2-597771fdef5f', '2022-07-28 07:00:39.000000', '2022-07-28 07:00:39.000000', 'AES',
        false, null, 'earlier than');
INSERT INTO public.locus_relations (uid_locus, uid_locus_2_related, type, uid_sketch, sketch_description, uid, created,
                                    modified, modified_by, repl_deleted, repl_tag, chronology)
VALUES ('5faa41a3-24ca-4420-8049-2042d2ec38df', '43ebc1f0-06ae-48fe-8fff-61a904c2d0f3', 'below', null, null,
        'd8fa763f-96c2-4633-bfbe-64dfa5f4111c', '2022-07-28 08:35:34.000000', '2022-07-28 08:35:34.000000', 'AES',
        false, null, 'earlier than');
INSERT INTO public.locus_relations (uid_locus, uid_locus_2_related, type, uid_sketch, sketch_description, uid, created,
                                    modified, modified_by, repl_deleted, repl_tag, chronology)
VALUES ('1d9618f4-4bbc-476c-abab-c2a72f20830a', '3c43e784-291b-44f7-8b72-401344b67c5b', 'is abutted by', null, null,
        '7a4766b6-a00d-445b-95e7-5bc2bd0e4525', '2022-07-28 09:24:58.000000', '2022-07-28 09:24:58.000000', 'AES',
        false, null, 'earlier than');
INSERT INTO public.locus_relations (uid_locus, uid_locus_2_related, type, uid_sketch, sketch_description, uid, created,
                                    modified, modified_by, repl_deleted, repl_tag, chronology)
VALUES ('2a3bfb8d-996c-42c1-a74f-9ac55f262007', '1d9618f4-4bbc-476c-abab-c2a72f20830a', 'abuts', null, null,
        '1d8bd24b-947a-46b7-a2d3-7523e1ea12c0', '2023-06-25 16:16:12.000000', '2023-06-25 16:16:19.000000', 'AES',
        false, null, null);
INSERT INTO public.locus_relations (uid_locus, uid_locus_2_related, type, uid_sketch, sketch_description, uid, created,
                                    modified, modified_by, repl_deleted, repl_tag, chronology)
VALUES ('6b472acb-6f16-419c-8807-0dc858a04f1c', '3c43e784-291b-44f7-8b72-401344b67c5b', 'below', null, null,
        '1323c73a-d834-491c-bbc7-ddce1e50ebaf', '2023-06-25 08:48:53.000000', '2023-06-25 08:49:07.000000', 'AES',
        false, null, null);
INSERT INTO public.locus_relations (uid_locus, uid_locus_2_related, type, uid_sketch, sketch_description, uid, created,
                                    modified, modified_by, repl_deleted, repl_tag, chronology)
VALUES ('6b472acb-6f16-419c-8807-0dc858a04f1c', '8fec8761-1719-4530-a868-d42a1c10dd7b', 'below', null, null,
        '5983f04d-0ba6-4d30-8392-172f345a9192', '2023-06-25 08:49:12.000000', '2023-06-25 08:49:30.000000', 'AES',
        false, null, null);
INSERT INTO public.locus_relations (uid_locus, uid_locus_2_related, type, uid_sketch, sketch_description, uid, created,
                                    modified, modified_by, repl_deleted, repl_tag, chronology)
VALUES ('6b472acb-6f16-419c-8807-0dc858a04f1c', '6fbd50a5-70cf-450f-ac66-9174ada4dc73', 'below', null, null,
        '1e7642e6-f74e-4cb3-973e-c4594de2d173', '2023-06-25 08:49:32.000000', '2023-06-25 08:49:42.000000', 'AES',
        false, null, null);
INSERT INTO public.locus_relations (uid_locus, uid_locus_2_related, type, uid_sketch, sketch_description, uid, created,
                                    modified, modified_by, repl_deleted, repl_tag, chronology)
VALUES ('2a3bfb8d-996c-42c1-a74f-9ac55f262007', 'c22676f5-fcfd-4e35-ab69-342202ad083e', 'below', null, null,
        '8a39ada1-53d1-4610-bf68-f3dca868fcfd', '2023-06-25 16:15:58.000000', '2023-06-25 16:16:11.000000', 'AES',
        false, null, null);
INSERT INTO public.locus_relations (uid_locus, uid_locus_2_related, type, uid_sketch, sketch_description, uid, created,
                                    modified, modified_by, repl_deleted, repl_tag, chronology)
VALUES ('8fec8761-1719-4530-a868-d42a1c10dd7b', '3c43e784-291b-44f7-8b72-401344b67c5b', 'below', null, null,
        '41b9d843-7f82-4e7d-aa0d-a92c8bc70493', '2023-06-25 16:17:13.000000', '2023-06-25 16:17:31.000000', 'AES',
        false, null, null);
INSERT INTO public.locus_relations (uid_locus, uid_locus_2_related, type, uid_sketch, sketch_description, uid, created,
                                    modified, modified_by, repl_deleted, repl_tag, chronology)
VALUES ('8fec8761-1719-4530-a868-d42a1c10dd7b', '1d9618f4-4bbc-476c-abab-c2a72f20830a', 'abuts', null, null,
        '4eb5f12d-e7bd-4be7-b2d2-15c69061f275', '2023-06-25 16:17:44.000000', '2023-06-25 16:17:53.000000', 'AES',
        false, null, null);
INSERT INTO public.locus_relations (uid_locus, uid_locus_2_related, type, uid_sketch, sketch_description, uid, created,
                                    modified, modified_by, repl_deleted, repl_tag, chronology)
VALUES ('3c43e784-291b-44f7-8b72-401344b67c5b', '6b472acb-6f16-419c-8807-0dc858a04f1c', 'above', null, null,
        '647c6db1-2235-4aee-a81c-8232be4fb8e3', '2023-06-25 08:49:07.000000', '2023-06-25 08:49:07.000000', 'AES',
        false, null, null);
INSERT INTO public.locus_relations (uid_locus, uid_locus_2_related, type, uid_sketch, sketch_description, uid, created,
                                    modified, modified_by, repl_deleted, repl_tag, chronology)
VALUES ('8fec8761-1719-4530-a868-d42a1c10dd7b', '6b472acb-6f16-419c-8807-0dc858a04f1c', 'above', null, null,
        '5093092c-26d3-4e81-8f44-b7cd4510aca4', '2023-06-25 08:49:29.000000', '2023-06-25 08:49:29.000000', 'AES',
        false, null, null);
INSERT INTO public.locus_relations (uid_locus, uid_locus_2_related, type, uid_sketch, sketch_description, uid, created,
                                    modified, modified_by, repl_deleted, repl_tag, chronology)
VALUES ('6fbd50a5-70cf-450f-ac66-9174ada4dc73', '6b472acb-6f16-419c-8807-0dc858a04f1c', 'above', null, null,
        'f847f00e-0657-45b7-beeb-8cae2b35307c', '2023-06-25 08:49:41.000000', '2023-06-25 08:49:41.000000', 'AES',
        false, null, null);
INSERT INTO public.locus_relations (uid_locus, uid_locus_2_related, type, uid_sketch, sketch_description, uid, created,
                                    modified, modified_by, repl_deleted, repl_tag, chronology)
VALUES ('c22676f5-fcfd-4e35-ab69-342202ad083e', '2a3bfb8d-996c-42c1-a74f-9ac55f262007', 'above', null, null,
        '765410ee-bbe3-4b49-828c-28ed83200d57', '2023-06-25 16:16:11.000000', '2023-06-25 16:16:11.000000', 'AES',
        false, null, null);
INSERT INTO public.locus_relations (uid_locus, uid_locus_2_related, type, uid_sketch, sketch_description, uid, created,
                                    modified, modified_by, repl_deleted, repl_tag, chronology)
VALUES ('1d9618f4-4bbc-476c-abab-c2a72f20830a', '2a3bfb8d-996c-42c1-a74f-9ac55f262007', 'is abutted by', null, null,
        '79a1cd02-58e8-44be-a674-a8044366ce36', '2023-06-25 16:16:19.000000', '2023-06-25 16:16:19.000000', 'AES',
        false, null, null);
INSERT INTO public.locus_relations (uid_locus, uid_locus_2_related, type, uid_sketch, sketch_description, uid, created,
                                    modified, modified_by, repl_deleted, repl_tag, chronology)
VALUES ('3c43e784-291b-44f7-8b72-401344b67c5b', '8fec8761-1719-4530-a868-d42a1c10dd7b', 'above', null, null,
        'f55341c3-b946-4839-965f-1b3d6e13ba85', '2023-06-25 16:17:31.000000', '2023-06-25 16:17:31.000000', 'AES',
        false, null, null);
INSERT INTO public.locus_relations (uid_locus, uid_locus_2_related, type, uid_sketch, sketch_description, uid, created,
                                    modified, modified_by, repl_deleted, repl_tag, chronology)
VALUES ('1d9618f4-4bbc-476c-abab-c2a72f20830a', '8fec8761-1719-4530-a868-d42a1c10dd7b', 'is abutted by', null, null,
        '85f029e4-1f3d-43c2-90b9-fcd512a1226b', '2023-06-25 16:17:53.000000', '2023-06-25 16:17:53.000000', 'AES',
        false, null, null);
INSERT INTO public.locus_relations (uid_locus, uid_locus_2_related, type, uid_sketch, sketch_description, uid, created,
                                    modified, modified_by, repl_deleted, repl_tag, chronology)
VALUES ('1f3cf23d-3a88-46a1-bf76-6b0afe6e1af1', '2a3bfb8d-996c-42c1-a74f-9ac55f262007', 'below', null, null,
        'db010e41-0144-40eb-96f9-bcf710d9d9a9', '2023-06-26 10:56:32.000000', '2023-06-26 10:56:48.000000', 'AES',
        false, null, 'earlier than');
INSERT INTO public.locus_relations (uid_locus, uid_locus_2_related, type, uid_sketch, sketch_description, uid, created,
                                    modified, modified_by, repl_deleted, repl_tag, chronology)
VALUES ('a17807c1-9ebd-4554-93ee-08790a38d7ba', '2a3bfb8d-996c-42c1-a74f-9ac55f262007', 'below', null, null,
        '44c5fc27-d187-42dd-9822-e1380e459dae', '2023-06-26 11:18:32.000000', '2023-06-26 11:18:44.000000', 'AES',
        false, null, 'earlier than');
INSERT INTO public.locus_relations (uid_locus, uid_locus_2_related, type, uid_sketch, sketch_description, uid, created,
                                    modified, modified_by, repl_deleted, repl_tag, chronology)
VALUES ('a17807c1-9ebd-4554-93ee-08790a38d7ba', '1d9618f4-4bbc-476c-abab-c2a72f20830a', 'abuts', null, null,
        '8158a471-baaa-4eb4-b7d2-1ad81c7eb21b', '2023-06-26 11:18:48.000000', '2023-06-26 11:18:59.000000', 'AES',
        false, null, 'later than');
INSERT INTO public.locus_relations (uid_locus, uid_locus_2_related, type, uid_sketch, sketch_description, uid, created,
                                    modified, modified_by, repl_deleted, repl_tag, chronology)
VALUES ('2a3bfb8d-996c-42c1-a74f-9ac55f262007', '1f3cf23d-3a88-46a1-bf76-6b0afe6e1af1', 'above', null, null,
        '92292d4a-2cfa-48e7-9ba1-0f9084a18411', '2023-06-26 10:56:48.000000', '2023-06-26 10:56:48.000000', 'AES',
        false, null, 'later than');
INSERT INTO public.locus_relations (uid_locus, uid_locus_2_related, type, uid_sketch, sketch_description, uid, created,
                                    modified, modified_by, repl_deleted, repl_tag, chronology)
VALUES ('2a3bfb8d-996c-42c1-a74f-9ac55f262007', 'a17807c1-9ebd-4554-93ee-08790a38d7ba', 'above', null, null,
        'ac7d1211-0322-4531-98ab-1262a8614ca8', '2023-06-26 11:18:44.000000', '2023-06-26 11:18:44.000000', 'AES',
        false, null, 'later than');
INSERT INTO public.locus_relations (uid_locus, uid_locus_2_related, type, uid_sketch, sketch_description, uid, created,
                                    modified, modified_by, repl_deleted, repl_tag, chronology)
VALUES ('1d9618f4-4bbc-476c-abab-c2a72f20830a', 'a17807c1-9ebd-4554-93ee-08790a38d7ba', 'is abutted by', null, null,
        'e58f3f32-ac6f-4ecf-8bf0-3c05b1194682', '2023-06-26 11:18:59.000000', '2023-06-26 11:18:59.000000', 'AES',
        false, null, 'earlier than');
INSERT INTO public.locus_relations (uid_locus, uid_locus_2_related, type, uid_sketch, sketch_description, uid, created,
                                    modified, modified_by, repl_deleted, repl_tag, chronology)
VALUES ('a17807c1-9ebd-4554-93ee-08790a38d7ba', '1f3cf23d-3a88-46a1-bf76-6b0afe6e1af1', 'below', null, null,
        '40909f78-4142-4300-af0d-a5b34c749f6f', '2023-06-27 08:55:49.000000', '2023-06-27 08:56:06.000000', 'AES',
        false, null, null);
INSERT INTO public.locus_relations (uid_locus, uid_locus_2_related, type, uid_sketch, sketch_description, uid, created,
                                    modified, modified_by, repl_deleted, repl_tag, chronology)
VALUES ('c068cdb5-3ce4-4d85-a0f2-7596420b96dd', '8fec8761-1719-4530-a868-d42a1c10dd7b', 'below', null, null,
        'ce435e1a-f2d7-43f5-8d93-14a2a9234511', '2023-06-27 14:28:25.000000', '2023-06-27 14:28:36.000000', 'AES',
        false, null, null);
INSERT INTO public.locus_relations (uid_locus, uid_locus_2_related, type, uid_sketch, sketch_description, uid, created,
                                    modified, modified_by, repl_deleted, repl_tag, chronology)
VALUES ('c068cdb5-3ce4-4d85-a0f2-7596420b96dd', '6b472acb-6f16-419c-8807-0dc858a04f1c', 'below', null, null,
        'ac534c50-6a1b-443b-a25e-9eeaac2d6243', '2023-06-27 14:28:42.000000', '2023-06-27 14:28:49.000000', 'AES',
        false, null, null);
INSERT INTO public.locus_relations (uid_locus, uid_locus_2_related, type, uid_sketch, sketch_description, uid, created,
                                    modified, modified_by, repl_deleted, repl_tag, chronology)
VALUES ('c068cdb5-3ce4-4d85-a0f2-7596420b96dd', '1d9618f4-4bbc-476c-abab-c2a72f20830a', 'abuts', null, null,
        'f9e713c3-3c56-4e9e-afea-09fe31a204b6', '2023-06-27 14:28:58.000000', '2023-06-27 14:29:05.000000', 'AES',
        false, null, null);
INSERT INTO public.locus_relations (uid_locus, uid_locus_2_related, type, uid_sketch, sketch_description, uid, created,
                                    modified, modified_by, repl_deleted, repl_tag, chronology)
VALUES ('1f3cf23d-3a88-46a1-bf76-6b0afe6e1af1', 'a17807c1-9ebd-4554-93ee-08790a38d7ba', 'above', null, null,
        '2ea70f84-9c01-439a-a367-fb4f2c22ad4e', '2023-06-27 08:56:05.000000', '2023-06-27 08:56:05.000000', 'AES',
        false, null, null);
INSERT INTO public.locus_relations (uid_locus, uid_locus_2_related, type, uid_sketch, sketch_description, uid, created,
                                    modified, modified_by, repl_deleted, repl_tag, chronology)
VALUES ('8fec8761-1719-4530-a868-d42a1c10dd7b', 'c068cdb5-3ce4-4d85-a0f2-7596420b96dd', 'above', null, null,
        'd8e40d23-ce63-499a-82f9-9a8a525f439f', '2023-06-27 14:28:35.000000', '2023-06-27 14:28:35.000000', 'AES',
        false, null, null);
INSERT INTO public.locus_relations (uid_locus, uid_locus_2_related, type, uid_sketch, sketch_description, uid, created,
                                    modified, modified_by, repl_deleted, repl_tag, chronology)
VALUES ('6b472acb-6f16-419c-8807-0dc858a04f1c', 'c068cdb5-3ce4-4d85-a0f2-7596420b96dd', 'above', null, null,
        'd8ca11e0-1261-4253-af87-9cc65fe09c0a', '2023-06-27 14:28:49.000000', '2023-06-27 14:28:49.000000', 'AES',
        false, null, null);
INSERT INTO public.locus_relations (uid_locus, uid_locus_2_related, type, uid_sketch, sketch_description, uid, created,
                                    modified, modified_by, repl_deleted, repl_tag, chronology)
VALUES ('1d9618f4-4bbc-476c-abab-c2a72f20830a', 'c068cdb5-3ce4-4d85-a0f2-7596420b96dd', 'is abutted by', null, null,
        'd9d15da4-d705-40da-8dbf-76d37f1a6874', '2023-06-27 14:29:05.000000', '2023-06-27 14:29:05.000000', 'AES',
        false, null, null);
INSERT INTO public.locus_relations (uid_locus, uid_locus_2_related, type, uid_sketch, sketch_description, uid, created,
                                    modified, modified_by, repl_deleted, repl_tag, chronology)
VALUES ('11e47e11-6fed-4695-9dad-872dcf3761f4', 'c068cdb5-3ce4-4d85-a0f2-7596420b96dd', 'below', null, null,
        '8fabfbc4-9e3b-4814-a088-4047966a9d57', '2023-07-02 11:19:18.000000', '2023-07-02 11:19:33.000000', 'AES',
        false, null, 'earlier than');
INSERT INTO public.locus_relations (uid_locus, uid_locus_2_related, type, uid_sketch, sketch_description, uid, created,
                                    modified, modified_by, repl_deleted, repl_tag, chronology)
VALUES ('48806df6-56fe-4bc3-8dac-8abbb21558ae', 'a17807c1-9ebd-4554-93ee-08790a38d7ba', 'below', null, null,
        'f179a764-172d-43bc-8e53-97a3b78ffadc', '2023-07-02 11:20:09.000000', '2023-07-02 11:20:21.000000', 'AES',
        false, null, 'earlier than');
INSERT INTO public.locus_relations (uid_locus, uid_locus_2_related, type, uid_sketch, sketch_description, uid, created,
                                    modified, modified_by, repl_deleted, repl_tag, chronology)
VALUES ('c068cdb5-3ce4-4d85-a0f2-7596420b96dd', '11e47e11-6fed-4695-9dad-872dcf3761f4', 'above', null, null,
        '14818d21-995c-4d4e-a89e-b22c16e5e01d', '2023-07-02 11:19:33.000000', '2023-07-02 11:19:33.000000', 'AES',
        false, null, 'later than');
INSERT INTO public.locus_relations (uid_locus, uid_locus_2_related, type, uid_sketch, sketch_description, uid, created,
                                    modified, modified_by, repl_deleted, repl_tag, chronology)
VALUES ('5faa41a3-24ca-4420-8049-2042d2ec38df', '86ddca1c-b82b-4280-98fc-5befc1790158', 'equivalent to', null, null,
        'b048224f-1e94-4bce-8275-7b47da58753e', '2023-07-17 07:04:56.000000', '2023-07-17 07:04:56.000000', 'AES',
        false, null, 'same time as');
INSERT INTO public.locus_relations (uid_locus, uid_locus_2_related, type, uid_sketch, sketch_description, uid, created,
                                    modified, modified_by, repl_deleted, repl_tag, chronology)
VALUES ('a17807c1-9ebd-4554-93ee-08790a38d7ba', '48806df6-56fe-4bc3-8dac-8abbb21558ae', 'above', null, null,
        '5e8013d0-1d29-40fe-bbc1-8d24dd6dd386', '2023-07-02 11:20:21.000000', '2023-07-02 11:20:21.000000', 'AES',
        false, null, 'later than');
INSERT INTO public.locus_relations (uid_locus, uid_locus_2_related, type, uid_sketch, sketch_description, uid, created,
                                    modified, modified_by, repl_deleted, repl_tag, chronology)
VALUES ('73b732aa-b964-40b0-b843-7b5bcd5010c7', 'de06ade4-6afe-4b60-b331-4ffee5c06d8c', 'equivalent to', null, null,
        '5bfcf5c1-b9b8-4806-8402-37a98e3e3aa5', '2023-07-03 17:16:55.000000', '2023-07-03 17:17:02.000000', 'AES',
        false, null, 'same time as');
INSERT INTO public.locus_relations (uid_locus, uid_locus_2_related, type, uid_sketch, sketch_description, uid, created,
                                    modified, modified_by, repl_deleted, repl_tag, chronology)
VALUES ('48806df6-56fe-4bc3-8dac-8abbb21558ae', '1d9618f4-4bbc-476c-abab-c2a72f20830a', 'abuts', null, null,
        'de77b172-8f8c-49c3-8a6f-a9a466849af3', '2023-07-03 17:17:34.000000', '2023-07-03 17:18:10.000000', 'AES',
        false, null, 'later than');
INSERT INTO public.locus_relations (uid_locus, uid_locus_2_related, type, uid_sketch, sketch_description, uid, created,
                                    modified, modified_by, repl_deleted, repl_tag, chronology)
VALUES ('6d79492b-08df-40f2-94eb-edd31d86cbfa', '86ddca1c-b82b-4280-98fc-5befc1790158', 'above', null, null,
        '0b26b410-9761-47be-89f9-ad56cbd5c400', '2023-07-17 07:07:03.000000', '2023-07-17 07:07:03.000000', 'AES',
        false, null, null);
INSERT INTO public.locus_relations (uid_locus, uid_locus_2_related, type, uid_sketch, sketch_description, uid, created,
                                    modified, modified_by, repl_deleted, repl_tag, chronology)
VALUES ('11e47e11-6fed-4695-9dad-872dcf3761f4', '1d9618f4-4bbc-476c-abab-c2a72f20830a', 'abuts', null, null,
        '591582e5-475f-4aa7-af0b-a38f9ca2e726', '2023-07-02 11:19:39.000000', '2023-07-03 17:18:18.000000', 'AES',
        false, null, 'later than');
INSERT INTO public.locus_relations (uid_locus, uid_locus_2_related, type, uid_sketch, sketch_description, uid, created,
                                    modified, modified_by, repl_deleted, repl_tag, chronology)
VALUES ('de06ade4-6afe-4b60-b331-4ffee5c06d8c', '73b732aa-b964-40b0-b843-7b5bcd5010c7', 'equivalent to', null, null,
        '24100b6c-a8c0-4e74-905f-4c4098c81794', '2023-07-03 17:17:02.000000', '2023-07-03 17:17:02.000000', 'AES',
        false, null, 'same time as');
INSERT INTO public.locus_relations (uid_locus, uid_locus_2_related, type, uid_sketch, sketch_description, uid, created,
                                    modified, modified_by, repl_deleted, repl_tag, chronology)
VALUES ('1d9618f4-4bbc-476c-abab-c2a72f20830a', '48806df6-56fe-4bc3-8dac-8abbb21558ae', 'is abutted by', null, null,
        '4f421785-9887-4c4f-9ce8-96f3398a2360', '2023-07-03 17:18:10.000000', '2023-07-03 17:18:10.000000', 'AES',
        false, null, 'earlier than');
INSERT INTO public.locus_relations (uid_locus, uid_locus_2_related, type, uid_sketch, sketch_description, uid, created,
                                    modified, modified_by, repl_deleted, repl_tag, chronology)
VALUES ('1d9618f4-4bbc-476c-abab-c2a72f20830a', '11e47e11-6fed-4695-9dad-872dcf3761f4', 'is abutted by', null, null,
        '1c21d57d-deae-445f-9230-beefc6adbf00', '2023-07-03 17:18:18.000000', '2023-07-03 17:18:18.000000', 'AES',
        false, null, 'earlier than');
INSERT INTO public.locus_relations (uid_locus, uid_locus_2_related, type, uid_sketch, sketch_description, uid, created,
                                    modified, modified_by, repl_deleted, repl_tag, chronology)
VALUES ('21d5c685-5df7-4562-a7f0-606c6b6289cd', 'c3b89d7f-a6a6-424e-afb0-4283e0a4f7a2', 'bonds with', null, null,
        '17f100bd-ae91-4bd1-b922-253a24a218b5', '2023-07-11 07:08:39.000000', '2023-07-11 07:09:14.000000', 'AES',
        false, null, null);
INSERT INTO public.locus_relations (uid_locus, uid_locus_2_related, type, uid_sketch, sketch_description, uid, created,
                                    modified, modified_by, repl_deleted, repl_tag, chronology)
VALUES ('21d5c685-5df7-4562-a7f0-606c6b6289cd', '73b732aa-b964-40b0-b843-7b5bcd5010c7', 'is abutted by', null, null,
        '1d452237-63e7-4ead-b305-3c6ecb7efbdb', '2023-07-11 07:09:19.000000', '2023-07-11 07:09:32.000000', 'AES',
        false, null, null);
INSERT INTO public.locus_relations (uid_locus, uid_locus_2_related, type, uid_sketch, sketch_description, uid, created,
                                    modified, modified_by, repl_deleted, repl_tag, chronology)
VALUES ('c3b89d7f-a6a6-424e-afb0-4283e0a4f7a2', '73b732aa-b964-40b0-b843-7b5bcd5010c7', 'is abutted by', null, null,
        '9653825c-098f-48bf-b983-bbdb79018f43', '2023-07-11 07:10:59.000000', '2023-07-11 07:11:09.000000', 'AES',
        false, null, null);
INSERT INTO public.locus_relations (uid_locus, uid_locus_2_related, type, uid_sketch, sketch_description, uid, created,
                                    modified, modified_by, repl_deleted, repl_tag, chronology)
VALUES ('fc2fe0cf-2fa8-46c3-852b-32fd2bb56a0f', '73b732aa-b964-40b0-b843-7b5bcd5010c7', 'is abutted by', null, null,
        '57c65746-de27-470f-8bb4-b6c7c942a852', '2023-07-11 07:23:33.000000', '2023-07-11 07:23:47.000000', 'AES',
        false, null, null);
INSERT INTO public.locus_relations (uid_locus, uid_locus_2_related, type, uid_sketch, sketch_description, uid, created,
                                    modified, modified_by, repl_deleted, repl_tag, chronology)
VALUES ('cbab053c-5f15-44bd-ae33-1077753d6b92', '73b732aa-b964-40b0-b843-7b5bcd5010c7', 'below', null, null,
        '5f63aeab-d276-4ed4-a82f-ec8f0a68721c', '2023-07-11 11:29:36.000000', '2023-07-11 11:29:47.000000', 'AES',
        false, null, null);
INSERT INTO public.locus_relations (uid_locus, uid_locus_2_related, type, uid_sketch, sketch_description, uid, created,
                                    modified, modified_by, repl_deleted, repl_tag, chronology)
VALUES ('cbab053c-5f15-44bd-ae33-1077753d6b92', 'c3b89d7f-a6a6-424e-afb0-4283e0a4f7a2', 'abuts', null, null,
        '6cf78348-d3c3-4435-a3b4-0ce6aec62bc1', '2023-07-11 11:31:23.000000', '2023-07-11 11:31:30.000000', 'AES',
        false, null, null);
INSERT INTO public.locus_relations (uid_locus, uid_locus_2_related, type, uid_sketch, sketch_description, uid, created,
                                    modified, modified_by, repl_deleted, repl_tag, chronology)
VALUES ('cbab053c-5f15-44bd-ae33-1077753d6b92', '21d5c685-5df7-4562-a7f0-606c6b6289cd', 'abuts', null, null,
        '4b890623-51f1-4e23-b2eb-d6b69eb68dd6', '2023-07-11 11:31:33.000000', '2023-07-11 11:31:40.000000', 'AES',
        false, null, null);
INSERT INTO public.locus_relations (uid_locus, uid_locus_2_related, type, uid_sketch, sketch_description, uid, created,
                                    modified, modified_by, repl_deleted, repl_tag, chronology)
VALUES ('c3b89d7f-a6a6-424e-afb0-4283e0a4f7a2', '21d5c685-5df7-4562-a7f0-606c6b6289cd', 'bonds with', null, null,
        '6cc3f0b5-32bc-4daf-aa47-6da7fc59bd24', '2023-07-11 07:09:13.000000', '2023-07-11 07:09:14.000000', 'AES',
        false, null, null);
INSERT INTO public.locus_relations (uid_locus, uid_locus_2_related, type, uid_sketch, sketch_description, uid, created,
                                    modified, modified_by, repl_deleted, repl_tag, chronology)
VALUES ('73b732aa-b964-40b0-b843-7b5bcd5010c7', '21d5c685-5df7-4562-a7f0-606c6b6289cd', 'abuts', null, null,
        '4f11d7bd-3617-43ee-b75d-8f87207fee20', '2023-07-11 07:09:32.000000', '2023-07-11 07:09:32.000000', 'AES',
        false, null, null);
INSERT INTO public.locus_relations (uid_locus, uid_locus_2_related, type, uid_sketch, sketch_description, uid, created,
                                    modified, modified_by, repl_deleted, repl_tag, chronology)
VALUES ('73b732aa-b964-40b0-b843-7b5bcd5010c7', 'c3b89d7f-a6a6-424e-afb0-4283e0a4f7a2', 'abuts', null, null,
        'a94bafbb-73f3-4cac-84b8-fa1593b6b3e2', '2023-07-11 07:11:09.000000', '2023-07-11 07:11:09.000000', 'AES',
        false, null, null);
INSERT INTO public.locus_relations (uid_locus, uid_locus_2_related, type, uid_sketch, sketch_description, uid, created,
                                    modified, modified_by, repl_deleted, repl_tag, chronology)
VALUES ('73b732aa-b964-40b0-b843-7b5bcd5010c7', 'fc2fe0cf-2fa8-46c3-852b-32fd2bb56a0f', 'abuts', null, null,
        '8aec796d-ceb2-48e2-b69b-8ae43f5c6a55', '2023-07-11 07:23:47.000000', '2023-07-11 07:23:47.000000', 'AES',
        false, null, null);
INSERT INTO public.locus_relations (uid_locus, uid_locus_2_related, type, uid_sketch, sketch_description, uid, created,
                                    modified, modified_by, repl_deleted, repl_tag, chronology)
VALUES ('73b732aa-b964-40b0-b843-7b5bcd5010c7', 'cbab053c-5f15-44bd-ae33-1077753d6b92', 'above', null, null,
        'e41ac117-6886-4059-9c0a-81768d84e985', '2023-07-11 11:29:47.000000', '2023-07-11 11:29:47.000000', 'AES',
        false, null, null);
INSERT INTO public.locus_relations (uid_locus, uid_locus_2_related, type, uid_sketch, sketch_description, uid, created,
                                    modified, modified_by, repl_deleted, repl_tag, chronology)
VALUES ('c3b89d7f-a6a6-424e-afb0-4283e0a4f7a2', 'cbab053c-5f15-44bd-ae33-1077753d6b92', 'is abutted by', null, null,
        '8afb8ce6-e8d2-4825-9efe-ad210e4884f2', '2023-07-11 11:31:30.000000', '2023-07-11 11:31:30.000000', 'AES',
        false, null, null);
INSERT INTO public.locus_relations (uid_locus, uid_locus_2_related, type, uid_sketch, sketch_description, uid, created,
                                    modified, modified_by, repl_deleted, repl_tag, chronology)
VALUES ('21d5c685-5df7-4562-a7f0-606c6b6289cd', 'cbab053c-5f15-44bd-ae33-1077753d6b92', 'is abutted by', null, null,
        '1ec5fb7b-21ab-4f75-bd46-773146978a25', '2023-07-11 11:31:39.000000', '2023-07-11 11:31:39.000000', 'AES',
        false, null, null);
INSERT INTO public.locus_relations (uid_locus, uid_locus_2_related, type, uid_sketch, sketch_description, uid, created,
                                    modified, modified_by, repl_deleted, repl_tag, chronology)
VALUES ('86ddca1c-b82b-4280-98fc-5befc1790158', '5faa41a3-24ca-4420-8049-2042d2ec38df', 'equivalent to', null, null,
        'f0e6ed3e-e508-4a34-a298-9f3c0ab0ddfc', '2023-07-17 07:04:48.000000', '2023-07-17 07:04:57.000000', 'AES',
        false, null, 'same time as');
INSERT INTO public.locus_relations (uid_locus, uid_locus_2_related, type, uid_sketch, sketch_description, uid, created,
                                    modified, modified_by, repl_deleted, repl_tag, chronology)
VALUES ('86ddca1c-b82b-4280-98fc-5befc1790158', '6d79492b-08df-40f2-94eb-edd31d86cbfa', 'below', null, null,
        '40571f53-0b2d-4718-aef9-61d2a60821a1', '2023-07-17 07:06:56.000000', '2023-07-17 07:07:03.000000', 'AES',
        false, null, null);
INSERT INTO public.locus_relations (uid_locus, uid_locus_2_related, type, uid_sketch, sketch_description, uid, created,
                                    modified, modified_by, repl_deleted, repl_tag, chronology)
VALUES ('86ddca1c-b82b-4280-98fc-5befc1790158', 'cbab053c-5f15-44bd-ae33-1077753d6b92', 'below', null, null,
        'd5ec2c97-71fc-4104-8170-d372df5986d9', '2023-07-17 07:07:05.000000', '2023-07-17 07:07:14.000000', 'AES',
        false, null, null);
INSERT INTO public.locus_relations (uid_locus, uid_locus_2_related, type, uid_sketch, sketch_description, uid, created,
                                    modified, modified_by, repl_deleted, repl_tag, chronology)
VALUES ('86ddca1c-b82b-4280-98fc-5befc1790158', 'c3b89d7f-a6a6-424e-afb0-4283e0a4f7a2', 'abuts', null, null,
        '56323f97-98a5-4995-bc2b-73ac8e76a31e', '2023-07-17 07:07:34.000000', '2023-07-17 07:07:41.000000', 'AES',
        false, null, null);
INSERT INTO public.locus_relations (uid_locus, uid_locus_2_related, type, uid_sketch, sketch_description, uid, created,
                                    modified, modified_by, repl_deleted, repl_tag, chronology)
VALUES ('86ddca1c-b82b-4280-98fc-5befc1790158', '21d5c685-5df7-4562-a7f0-606c6b6289cd', 'abuts', null, null,
        '172cf321-c821-4dd4-904d-eaeff7e62c86', '2023-07-17 07:07:44.000000', '2023-07-17 07:07:54.000000', 'AES',
        false, null, null);
INSERT INTO public.locus_relations (uid_locus, uid_locus_2_related, type, uid_sketch, sketch_description, uid, created,
                                    modified, modified_by, repl_deleted, repl_tag, chronology)
VALUES ('cbab053c-5f15-44bd-ae33-1077753d6b92', '6d79492b-08df-40f2-94eb-edd31d86cbfa', 'below', null, null,
        '95da79a1-b05a-4b40-b68a-215204dbedc5', '2023-07-17 07:09:12.000000', '2023-07-17 07:09:21.000000', 'AES',
        false, null, null);
INSERT INTO public.locus_relations (uid_locus, uid_locus_2_related, type, uid_sketch, sketch_description, uid, created,
                                    modified, modified_by, repl_deleted, repl_tag, chronology)
VALUES ('cbab053c-5f15-44bd-ae33-1077753d6b92', '86ddca1c-b82b-4280-98fc-5befc1790158', 'above', null, null,
        '10789feb-1059-4f6a-8ee9-b082e644a120', '2023-07-17 07:07:14.000000', '2023-07-17 07:07:14.000000', 'AES',
        false, null, null);
INSERT INTO public.locus_relations (uid_locus, uid_locus_2_related, type, uid_sketch, sketch_description, uid, created,
                                    modified, modified_by, repl_deleted, repl_tag, chronology)
VALUES ('c3b89d7f-a6a6-424e-afb0-4283e0a4f7a2', '86ddca1c-b82b-4280-98fc-5befc1790158', 'is abutted by', null, null,
        '4095a18c-add8-4ceb-8454-ac58bf7d474b', '2023-07-17 07:07:41.000000', '2023-07-17 07:07:41.000000', 'AES',
        false, null, null);
INSERT INTO public.locus_relations (uid_locus, uid_locus_2_related, type, uid_sketch, sketch_description, uid, created,
                                    modified, modified_by, repl_deleted, repl_tag, chronology)
VALUES ('21d5c685-5df7-4562-a7f0-606c6b6289cd', '86ddca1c-b82b-4280-98fc-5befc1790158', 'is abutted by', null, null,
        'd43f91d7-5038-478d-a7a4-ba9739a38b4b', '2023-07-17 07:07:53.000000', '2023-07-17 07:07:53.000000', 'AES',
        false, null, null);
INSERT INTO public.locus_relations (uid_locus, uid_locus_2_related, type, uid_sketch, sketch_description, uid, created,
                                    modified, modified_by, repl_deleted, repl_tag, chronology)
VALUES ('6d79492b-08df-40f2-94eb-edd31d86cbfa', 'cbab053c-5f15-44bd-ae33-1077753d6b92', 'above', null, null,
        '5eca3070-f10e-4106-86bb-cba9fe8ee509', '2023-07-17 07:09:20.000000', '2023-07-17 07:09:20.000000', 'AES',
        false, null, null);
INSERT INTO public.locus_relations (uid_locus, uid_locus_2_related, type, uid_sketch, sketch_description, uid, created,
                                    modified, modified_by, repl_deleted, repl_tag, chronology)
VALUES ('fcdc0106-a3b5-4c1f-802a-42321a6ac015', '04406012-28bc-4eea-88d0-3c127a421497', 'below', null, null,
        '10837293-ce98-4984-9952-81f683534112', '2023-07-23 07:17:34.000000', '2023-07-23 07:17:41.000000', 'AES',
        false, null, null);
INSERT INTO public.locus_relations (uid_locus, uid_locus_2_related, type, uid_sketch, sketch_description, uid, created,
                                    modified, modified_by, repl_deleted, repl_tag, chronology)
VALUES ('fcdc0106-a3b5-4c1f-802a-42321a6ac015', '3ebc1ab8-a40e-4e7b-b282-665b36bb7c08', 'abuts', null, null,
        '243ab5ba-2ce3-4ed5-ba10-270b0f870a2c', '2023-07-23 07:17:44.000000', '2023-07-23 07:17:50.000000', 'AES',
        false, null, null);
INSERT INTO public.locus_relations (uid_locus, uid_locus_2_related, type, uid_sketch, sketch_description, uid, created,
                                    modified, modified_by, repl_deleted, repl_tag, chronology)
VALUES ('04406012-28bc-4eea-88d0-3c127a421497', '3ebc1ab8-a40e-4e7b-b282-665b36bb7c08', 'abuts', null, null,
        '5d1aee75-71cd-45ac-be93-124e61676f36', '2023-07-23 07:18:01.000000', '2023-07-23 07:18:10.000000', 'AES',
        false, null, null);
INSERT INTO public.locus_relations (uid_locus, uid_locus_2_related, type, uid_sketch, sketch_description, uid, created,
                                    modified, modified_by, repl_deleted, repl_tag, chronology)
VALUES ('04406012-28bc-4eea-88d0-3c127a421497', '11e47e11-6fed-4695-9dad-872dcf3761f4', 'below', null, null,
        'd10f01af-263e-48a6-8148-17c7117d986d', '2023-07-23 07:18:24.000000', '2023-07-23 07:18:32.000000', 'AES',
        false, null, null);
INSERT INTO public.locus_relations (uid_locus, uid_locus_2_related, type, uid_sketch, sketch_description, uid, created,
                                    modified, modified_by, repl_deleted, repl_tag, chronology)
VALUES ('04406012-28bc-4eea-88d0-3c127a421497', 'fcdc0106-a3b5-4c1f-802a-42321a6ac015', 'above', null, null,
        '8f7a2fdc-5fc6-4499-94b5-a539a22f046a', '2023-07-23 07:17:41.000000', '2023-07-23 07:17:41.000000', 'AES',
        false, null, null);
INSERT INTO public.locus_relations (uid_locus, uid_locus_2_related, type, uid_sketch, sketch_description, uid, created,
                                    modified, modified_by, repl_deleted, repl_tag, chronology)
VALUES ('3ebc1ab8-a40e-4e7b-b282-665b36bb7c08', 'fcdc0106-a3b5-4c1f-802a-42321a6ac015', 'is abutted by', null, null,
        'fe91beda-047f-4f24-9abf-787731d37fc2', '2023-07-23 07:17:50.000000', '2023-07-23 07:17:50.000000', 'AES',
        false, null, null);
INSERT INTO public.locus_relations (uid_locus, uid_locus_2_related, type, uid_sketch, sketch_description, uid, created,
                                    modified, modified_by, repl_deleted, repl_tag, chronology)
VALUES ('3ebc1ab8-a40e-4e7b-b282-665b36bb7c08', '04406012-28bc-4eea-88d0-3c127a421497', 'is abutted by', null, null,
        '856bf598-e467-4a67-b320-077e183c5082', '2023-07-23 07:18:09.000000', '2023-07-23 07:18:09.000000', 'AES',
        false, null, null);
INSERT INTO public.locus_relations (uid_locus, uid_locus_2_related, type, uid_sketch, sketch_description, uid, created,
                                    modified, modified_by, repl_deleted, repl_tag, chronology)
VALUES ('11e47e11-6fed-4695-9dad-872dcf3761f4', '04406012-28bc-4eea-88d0-3c127a421497', 'above', null, null,
        '6d8fa15d-304f-4fa4-8dc4-510636b37f59', '2023-07-23 07:18:31.000000', '2023-07-23 07:18:31.000000', 'AES',
        false, null, null);
INSERT INTO public.locus_relations (uid_locus, uid_locus_2_related, type, uid_sketch, sketch_description, uid, created,
                                    modified, modified_by, repl_deleted, repl_tag, chronology)
VALUES ('2a3bfb8d-996c-42c1-a74f-9ac55f262007', '0020d171-0ab4-4154-b469-3b7f8e55f619', 'equivalent to', null, null,
        'aa1c7f46-542a-4eee-9732-eb0e1331abfa', '2023-07-28 11:12:23.000000', '2023-07-28 11:12:33.000000', 'AES',
        false, null, 'same time as');
INSERT INTO public.locus_relations (uid_locus, uid_locus_2_related, type, uid_sketch, sketch_description, uid, created,
                                    modified, modified_by, repl_deleted, repl_tag, chronology)
VALUES ('8fec8761-1719-4530-a868-d42a1c10dd7b', 'dbf862ad-340d-42f1-a720-9cd43c7ac3ea', 'equivalent to', null, null,
        '41cf27d9-7ba0-407c-b483-d8651030c8ba', '2023-07-28 11:14:40.000000', '2023-07-28 11:14:48.000000', 'AES',
        false, null, 'same time as');
INSERT INTO public.locus_relations (uid_locus, uid_locus_2_related, type, uid_sketch, sketch_description, uid, created,
                                    modified, modified_by, repl_deleted, repl_tag, chronology)
VALUES ('6b472acb-6f16-419c-8807-0dc858a04f1c', '9102721f-742a-45d2-a327-b7783f42fc09', 'cut by', null, null,
        'ca21f34f-7af4-4d82-9f48-2dfb87ee88a9', '2023-07-28 11:15:44.000000', '2023-07-28 11:15:53.000000', 'AES',
        false, null, null);
INSERT INTO public.locus_relations (uid_locus, uid_locus_2_related, type, uid_sketch, sketch_description, uid, created,
                                    modified, modified_by, repl_deleted, repl_tag, chronology)
VALUES ('6b472acb-6f16-419c-8807-0dc858a04f1c', '1a377fbe-85bb-48ba-98b7-54ca4cda890b', 'equivalent to', null, null,
        '9badb2c1-06dd-4291-aa52-e32c4e3e2386', '2023-07-28 11:16:03.000000', '2023-07-28 11:16:12.000000', 'AES',
        false, null, 'same time as');
INSERT INTO public.locus_relations (uid_locus, uid_locus_2_related, type, uid_sketch, sketch_description, uid, created,
                                    modified, modified_by, repl_deleted, repl_tag, chronology)
VALUES ('0020d171-0ab4-4154-b469-3b7f8e55f619', '2a3bfb8d-996c-42c1-a74f-9ac55f262007', 'equivalent to', null, null,
        'b4043b76-8fa0-4fd7-b797-19ccc779699c', '2023-07-28 11:12:33.000000', '2023-07-28 11:12:33.000000', 'AES',
        false, null, 'same time as');
INSERT INTO public.locus_relations (uid_locus, uid_locus_2_related, type, uid_sketch, sketch_description, uid, created,
                                    modified, modified_by, repl_deleted, repl_tag, chronology)
VALUES ('dbf862ad-340d-42f1-a720-9cd43c7ac3ea', '8fec8761-1719-4530-a868-d42a1c10dd7b', 'equivalent to', null, null,
        'a9bf7ebf-0bbe-42aa-8b59-f85901d7b099', '2023-07-28 11:14:47.000000', '2023-07-28 11:14:47.000000', 'AES',
        false, null, 'same time as');
INSERT INTO public.locus_relations (uid_locus, uid_locus_2_related, type, uid_sketch, sketch_description, uid, created,
                                    modified, modified_by, repl_deleted, repl_tag, chronology)
VALUES ('9102721f-742a-45d2-a327-b7783f42fc09', '6b472acb-6f16-419c-8807-0dc858a04f1c', 'cuts through', null, null,
        '5f42a140-fe41-4b9e-ae59-84388f6cccb8', '2023-07-28 11:15:53.000000', '2023-07-28 11:15:53.000000', 'AES',
        false, null, null);
INSERT INTO public.locus_relations (uid_locus, uid_locus_2_related, type, uid_sketch, sketch_description, uid, created,
                                    modified, modified_by, repl_deleted, repl_tag, chronology)
VALUES ('73b732aa-b964-40b0-b843-7b5bcd5010c7', '769c19c9-1f0a-4df5-9c47-69c420576336', 'equivalent to', null, null,
        '0d134258-5738-4969-8f7f-8d741cb7e30a', '2023-07-28 11:23:46.000000', '2023-07-28 11:23:52.000000', 'AES',
        false, null, 'same time as');
INSERT INTO public.locus_relations (uid_locus, uid_locus_2_related, type, uid_sketch, sketch_description, uid, created,
                                    modified, modified_by, repl_deleted, repl_tag, chronology)
VALUES ('73b732aa-b964-40b0-b843-7b5bcd5010c7', '6d79492b-08df-40f2-94eb-edd31d86cbfa', 'above', null, null,
        'fb3f9e07-b85c-4df9-94a4-1886e6111ecd', '2023-07-28 11:24:10.000000', '2023-07-28 11:24:20.000000', 'AES',
        false, null, null);
INSERT INTO public.locus_relations (uid_locus, uid_locus_2_related, type, uid_sketch, sketch_description, uid, created,
                                    modified, modified_by, repl_deleted, repl_tag, chronology)
VALUES ('04406012-28bc-4eea-88d0-3c127a421497', '1d9618f4-4bbc-476c-abab-c2a72f20830a', 'abuts', null, null,
        '42004711-7f61-4701-adf0-ae36fb81e1df', '2023-07-28 11:27:21.000000', '2023-07-28 11:27:31.000000', 'AES',
        false, null, null);
INSERT INTO public.locus_relations (uid_locus, uid_locus_2_related, type, uid_sketch, sketch_description, uid, created,
                                    modified, modified_by, repl_deleted, repl_tag, chronology)
VALUES ('1a377fbe-85bb-48ba-98b7-54ca4cda890b', '6b472acb-6f16-419c-8807-0dc858a04f1c', 'equivalent to', null, null,
        '85b5e6a9-e90a-4408-a458-7696a766dcc7', '2023-07-28 11:16:12.000000', '2023-07-28 11:16:12.000000', 'AES',
        false, null, 'same time as');
INSERT INTO public.locus_relations (uid_locus, uid_locus_2_related, type, uid_sketch, sketch_description, uid, created,
                                    modified, modified_by, repl_deleted, repl_tag, chronology)
VALUES ('769c19c9-1f0a-4df5-9c47-69c420576336', '73b732aa-b964-40b0-b843-7b5bcd5010c7', 'equivalent to', null, null,
        'a10928ea-b028-4e70-b9ef-17bca97bc502', '2023-07-28 11:23:52.000000', '2023-07-28 11:23:52.000000', 'AES',
        false, null, 'same time as');
INSERT INTO public.locus_relations (uid_locus, uid_locus_2_related, type, uid_sketch, sketch_description, uid, created,
                                    modified, modified_by, repl_deleted, repl_tag, chronology)
VALUES ('6d79492b-08df-40f2-94eb-edd31d86cbfa', '73b732aa-b964-40b0-b843-7b5bcd5010c7', 'below', null, null,
        '72313869-d1ee-4aba-a177-dcd436ac7b5c', '2023-07-28 11:24:20.000000', '2023-07-28 11:24:20.000000', 'AES',
        false, null, null);
INSERT INTO public.locus_relations (uid_locus, uid_locus_2_related, type, uid_sketch, sketch_description, uid, created,
                                    modified, modified_by, repl_deleted, repl_tag, chronology)
VALUES ('1d9618f4-4bbc-476c-abab-c2a72f20830a', '04406012-28bc-4eea-88d0-3c127a421497', 'is abutted by', null, null,
        'a6fe4f19-b4f7-4b42-a0e8-d960ab66c4d1', '2023-07-28 11:27:31.000000', '2023-07-28 11:27:31.000000', 'AES',
        false, null, null);
