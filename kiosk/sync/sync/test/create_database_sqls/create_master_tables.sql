drop table if exists collected_material;
create table collected_material
(
	uid_locus uuid,
	id integer,
	uid_lot uuid,
	type varchar,
	description varchar,
	isobject integer,
	date timestamp,
	storage varchar,
	pottery_remarks varchar,
	status_done varchar,
	dearregistrar varchar,
	uid uuid not null
		constraint "X220lk_collected_material_pkey"
			primary key,
	created timestamp not null,
	modified timestamp,
	modified_by varchar,
	repl_deleted boolean default false,
	repl_tag integer,
	external_id varchar,
	weight numeric,
	quantity numeric,
	period varchar,
	status_todo varchar
);

alter table collected_material owner to "lkh";

drop table if exists collected_material_photo;
create table collected_material_photo
(
	uid_cm uuid,
	uid_photo uuid,
	description varchar,
	uid uuid not null
		constraint "X220lk_collected_material_photo_pkey"
			primary key,
	created timestamp not null,
	modified timestamp,
	modified_by varchar,
	repl_deleted boolean default false,
	repl_tag integer
);

alter table collected_material_photo owner to "lkh";



drop table if exists dayplan;
create table dayplan
(
	id_unit varchar,
	image_description varchar,
	uid_image uuid,
	uid uuid not null
		constraint "X220lk_dayplan_pkey"
			primary key,
	created timestamp not null,
	modified timestamp,
	modified_by varchar,
	repl_deleted boolean default false,
	repl_tag integer
);

alter table dayplan owner to "lkh";

drop table if exists delete_feature;
create table delete_feature
(
	name varchar,
	description varchar,
	uid uuid not null
		constraint "X220lk_feature_pkey"
			primary key,
	created timestamp not null,
	modified timestamp,
	modified_by varchar,
	repl_deleted boolean default false,
	repl_tag integer
);

alter table delete_feature owner to "lkh";

drop table if exists delete_feature_locus;
create table delete_feature_locus
(
	uid_locus uuid,
	uid_feature uuid,
	description varchar,
	dominant integer,
	uid uuid not null
		constraint "X220lk_feature_locus_pkey"
			primary key,
	created timestamp not null,
	modified timestamp,
	modified_by varchar,
	repl_deleted boolean default false,
	repl_tag integer
);

alter table delete_feature_locus owner to "lkh";

drop table if exists excavator;
create table excavator
(
	id varchar,
	name varchar,
	uid uuid default gen_random_uuid() not null
		constraint "X220lk_excavator_pkey"
			primary key,
	created timestamp not null,
	modified timestamp,
	modified_by varchar,
	repl_deleted boolean default false,
	repl_tag integer,
	properties varchar
);

comment on column excavator.properties is 'list of properties like "registrar" etc.';

alter table excavator owner to "lkh";

drop table if exists feature_unit;
create table feature_unit
(
	uid uuid not null
		constraint feature_unit_pkey
			primary key,
	created timestamp not null,
	modified timestamp,
	modified_by varchar,
	uid_unit uuid,
	feature_type varchar,
	materials varchar,
	width integer,
	length integer,
	elevation integer,
	repl_deleted boolean default false,
	repl_tag integer,
	revisit varchar
);

alter table feature_unit owner to "lkh";

drop table if exists images;
create table images
(
	table_context varchar,
	excavation_context varchar,
	description varchar,
	img_proxy timestamp,
	ref_uid uuid,
	id_locus integer,
	id_unit varchar,
	id_cm integer,
	uid uuid not null
		constraint "X220lk_images_pkey"
			primary key,
	created timestamp not null,
	modified timestamp,
	modified_by varchar,
	repl_deleted boolean default false,
	repl_tag integer,
	md5_hash varchar(32),
	file_datetime timestamp,
	tags varchar,
	original_md5 varchar,
	id_site varchar,
	image_attributes jsonb,
	filename varchar
);

alter table images owner to "lkh";

create index images_md5_hash_idx
	on images (md5_hash);

drop table if exists inventory;
create table inventory
(
	uid uuid not null
		constraint inventory_pkey
			primary key,
	created timestamp not null,
	modified timestamp,
	modified_by varchar,
	item_name varchar,
	count_available integer,
	count_needed integer,
	state varchar,
	storage varchar,
	description varchar,
	category varchar,
	uid_photo uuid,
	repl_deleted boolean default false,
	repl_tag integer
);

alter table inventory owner to "lkh";

drop table if exists locus;
create table locus
(
	uid_unit uuid,
	id integer,
	type varchar,
	"opening elevations" varchar,
	"closing elevations" varchar,
	description varchar,
	date_defined date,
	interpretation varchar,
	uid uuid not null
		constraint "X220lk_locus_pkey"
			primary key,
	created timestamp not null,
	modified timestamp,
	modified_by varchar,
	repl_deleted boolean default false,
	repl_tag integer,
	phase varchar,
	colour varchar,
	date_closed date
);

alter table locus owner to "lkh";

drop table if exists locus_architecture;
create table locus_architecture
(
	uid_locus uuid,
	material varchar,
	wall_thickness numeric,
	preserved_height numeric,
	features varchar,
	brick_size varchar,
	stone_size varchar,
	mortar_desc varchar,
	uid uuid not null
		constraint "X220lk_locus_architecture_pkey"
			primary key,
	created timestamp not null,
	modified timestamp,
	modified_by varchar,
	repl_deleted boolean default false,
	repl_tag integer
);

alter table locus_architecture owner to "lkh";

drop table if exists locus_deposit;
create table locus_deposit
(
	uid_locus uuid,
	material varchar,
	compositions varchar,
	inclusions varchar,
	description varchar,
	uid uuid not null
		constraint "X220lk_locus_deposit_pkey"
			primary key,
	created timestamp not null,
	modified timestamp,
	modified_by varchar,
	repl_deleted boolean default false,
	repl_tag integer,
	gravel_prc numeric,
	silt_prc numeric,
	sand_prc numeric,
	clay_prc numeric
);

alter table locus_deposit owner to "lkh";

drop table if exists locus_othertype;
create table locus_othertype
(
	uid_locus uuid,
	type varchar,
	description varchar,
	uid uuid not null
		constraint "X220lk_locus_othertype_pkey"
			primary key,
	created timestamp not null,
	modified timestamp,
	modified_by varchar,
	repl_deleted boolean default false,
	repl_tag integer
);

alter table locus_othertype owner to "lkh";

drop table if exists locus_photo;
create table locus_photo
(
	uid_locus uuid,
	description varchar,
	uid_image uuid,
	uid uuid not null
		constraint "X220lk_locus_photo_pkey"
			primary key,
	created timestamp not null,
	modified timestamp,
	modified_by varchar,
	repl_deleted boolean default false,
	repl_tag integer
);

alter table locus_photo owner to "lkh";

drop table if exists locus_relations;
create table locus_relations
(
	uid_locus uuid,
	uid_locus_2_related uuid,
	type varchar,
	uid_sketch uuid,
	uid uuid not null
		constraint "X220lk_locus_relations_pkey"
			primary key,
	created timestamp not null,
	modified timestamp,
	modified_by varchar,
	repl_deleted boolean default false,
	repl_tag integer,
	sketch_description varchar
);

alter table locus_relations owner to "lkh";

drop table if exists locus_types;
create table locus_types
(
	id varchar,
	type_name varchar,
	uid uuid not null
		constraint "X220lk_locus_types_pkey"
			primary key,
	created timestamp not null,
	modified timestamp,
	modified_by varchar,
	repl_deleted boolean default false,
	repl_tag integer
);

alter table locus_types owner to "lkh";

drop table if exists lot;
create table lot
(
	uid_locus uuid,
	id integer,
	purpose varchar,
	date timestamp,
	uid uuid not null
		constraint "X220lk_lot_pkey"
			primary key,
	created timestamp not null,
	modified timestamp,
	modified_by varchar,
	repl_deleted boolean default false,
	repl_tag integer,
	opening_elevations varchar,
	closing_elevations varchar
);

alter table lot owner to "lkh";

drop table if exists pottery;
create table pottery
(
	cm_uid uuid,
	fabric varchar,
	warecode varchar,
	sherdcount integer,
	weight numeric,
	pottery_number integer,
	type varchar,
	diameter numeric,
	prc_preserved numeric(10),
	notes varchar,
	pottery_number_prefix varchar,
	sortid_this numeric,
	sortid_next numeric,
	uid_prev uuid,
	uid_next uuid,
	uid_sketch uuid,
	uid uuid not null
		constraint "X220lk_pottery_pkey"
			primary key,
	created timestamp not null,
	modified timestamp,
	modified_by varchar,
	repl_deleted boolean default false,
	repl_tag integer,
	sketch_description varchar,
	vessel_type varchar
);

alter table pottery owner to "lkh";

drop table if exists pottery_images;
create table pottery_images
(
	uid_pottery uuid,
	description varchar,
	uid_image uuid,
	uid uuid not null
		constraint pottery_images_pkey
			primary key,
	created timestamp not null,
	modified timestamp,
	modified_by varchar,
	repl_deleted boolean default false,
	repl_tag integer
);

alter table pottery_images owner to "lkh";

drop table if exists site;
create table site
(
	id varchar,
	purpose varchar,
	id_short varchar,
	uid uuid not null
		constraint "X220lk_site_pkey"
			primary key,
	created timestamp not null,
	modified timestamp,
	modified_by varchar,
	repl_deleted boolean default false,
	repl_tag integer,
	uid_site_map uuid
);

alter table site owner to "lkh";

drop table if exists site_note_photo;
create table site_note_photo
(
	uid_site_note varchar,
	uid_image uuid,
	uid uuid not null
		constraint site_note_photo_pkey
			primary key,
	created timestamp not null,
	modified timestamp,
	modified_by varchar,
	repl_deleted boolean default false,
	repl_tag integer
);

alter table site_note_photo owner to "lkh";

drop table if exists site_notes;
create table site_notes
(
	uid_site varchar,
	date timestamp,
	id_excavator varchar,
	note varchar,
	uid uuid not null
		constraint site_notes_pkey
			primary key,
	created timestamp not null,
	modified timestamp,
	modified_by varchar,
	repl_deleted boolean default false,
	repl_tag integer
);

alter table site_notes owner to "lkh";

drop table if exists small_find;
create table small_find
(
	smallfindsnr integer,
	uid_cm uuid,
	material varchar,
	condition varchar,
	description varchar,
	length varchar,
	width varchar,
	thickness varchar,
	height varchar,
	diameter varchar,
	id_registrar varchar,
	measured_in_situ integer,
	colour varchar,
	uid uuid not null
		constraint "X220lk_small_find_pkey"
			primary key,
	created timestamp not null,
	modified timestamp,
	modified_by varchar,
	repl_deleted boolean default false,
	repl_tag integer,
	external_id varchar,
	period varchar,
	cost numeric,
	weight varchar
);

alter table small_find owner to "lkh";

drop table if exists survey_unit;
create table survey_unit
(
	uid uuid not null
		constraint survey_unit_pkey
			primary key,
	created timestamp not null,
	modified timestamp,
	modified_by varchar,
	uid_unit uuid,
	start_datetime timestamp,
	team_members varchar,
	bearing integer,
	visibility integer,
	spacing integer,
	conditions varchar,
	data_field1_name varchar,
	data_field2_name varchar,
	data_field3_name varchar,
	data_field4_name varchar,
	data_field5_name varchar,
	data_field6_name varchar,
	data_field7_name varchar,
	data_field8_name varchar,
	data_field9_name varchar,
	data_field10_name varchar,
	repl_deleted boolean default false,
	repl_tag integer
);

alter table survey_unit owner to "lkh";

drop table if exists survey_unit_data;
create table survey_unit_data
(
	uid uuid not null
		constraint survey_unit_data_pkey
			primary key,
	created timestamp not null,
	modified timestamp,
	modified_by varchar,
	uid_survey_unit uuid,
	team_member_id varchar,
	data_field1_value integer,
	data_field2_value integer,
	data_field3_value integer,
	data_field4_value integer,
	data_field5_value integer,
	data_field6_value integer,
	data_field7_value integer,
	data_field8_value integer,
	data_field9_value integer,
	data_field10_value integer,
	uid_lot varchar,
	repl_deleted boolean default false,
	repl_tag integer
);

alter table survey_unit_data owner to "lkh";

drop table if exists tagging;
create table tagging
(
	tag varchar not null,
	description varchar,
	source_uid varchar not null,
	source_table varchar not null,
	created timestamp not null,
	modified timestamp,
	modified_by varchar,
	repl_deleted boolean default false,
	repl_tag integer,
	uid uuid not null,
	constraint tagging_pkey
		primary key (tag, source_uid, source_table)
);

alter table tagging owner to "lkh";

drop table if exists tags;
create table tags
(
	tag varchar not null
		constraint tags_pkey
			primary key,
	description varchar,
	category varchar,
	table_contexts varchar,
	created timestamp not null,
	modified timestamp,
	modified_by varchar,
	repl_deleted boolean default false,
	repl_tag integer,
	uid uuid not null
);

alter table tags owner to "lkh";

drop table if exists tickets;
create table tickets
(
	account varchar,
	nr integer,
	ts timestamp,
	description varchar,
	priority varchar,
	state varchar,
	uid uuid not null
		constraint "X220lk_tickets_pkey"
			primary key,
	created timestamp not null,
	modified timestamp,
	modified_by varchar,
	repl_deleted boolean default false,
	repl_tag integer,
	uid_image uuid,
	"where" varchar
);

alter table tickets owner to "lkh";

drop table if exists unit;
create table unit
(
	id varchar,
	name varchar,
	purpose varchar,
	id_excavator varchar,
	unit_creation_date date,
	id_site varchar,
	excavator_full_name varchar,
	spider_counter integer,
	uid uuid not null
		constraint "X220lk_unit_pkey"
			primary key,
	created timestamp not null,
	modified timestamp,
	modified_by varchar,
	repl_deleted boolean default false,
	repl_tag integer,
	coordinates varchar,
	legacy_unit_id varchar,
	type varchar,
	method varchar
);

comment on column unit.legacy_unit_id is 'if there is a legacy unit number from a former project, it goes in here.';

alter table unit owner to "lkh";

drop table if exists unit_narrative;
create table unit_narrative
(
	id_unit varchar,
	narrative varchar,
	id_excavator varchar,
	date timestamp,
	uid uuid not null
		constraint "X220lk_unit_narrative_pkey"
			primary key,
	created timestamp not null,
	modified timestamp,
	modified_by varchar,
	repl_deleted boolean default false,
	repl_tag integer
);

alter table unit_narrative owner to "lkh";

drop table if exists unit_shop;
create table unit_shop
(
	created timestamp not null,
	modified timestamp,
	modified_by varchar,
	team_member varchar not null,
	repl_deleted boolean default false,
	repl_tag integer,
	uid uuid not null,
	unit_id varchar not null
		constraint unit_shop_pkey
			primary key
);

alter table unit_shop owner to "lkh";

drop table if exists unit_unit_relation;
create table unit_unit_relation
(
	uid uuid not null
		constraint unit_unit_relation_pkey
			primary key,
	created timestamp not null,
	modified timestamp,
	modified_by varchar,
	uid_src_unit uuid,
	uid_dst_unit uuid,
	repl_deleted boolean default false,
	repl_tag integer
);

alter table unit_unit_relation owner to "lkh";

drop table if exists workflow_requests;
create table workflow_requests
(
	created timestamp not null,
	locus_uid uuid,
	modified timestamp,
	modified_by varchar,
	request varchar not null,
	request_data varchar,
	request_details varchar,
	request_group varchar,
	request_status varchar,
	request_type varchar,
	requesting_team_member varchar,
	repl_deleted boolean default false,
	repl_tag integer,
	uid uuid not null
		constraint workflow_requests_pkey
			primary key,
	unit_uid uuid
);

alter table workflow_requests owner to "lkh";

