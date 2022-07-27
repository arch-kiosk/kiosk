drop table if exists repl_deleted_uids;
create table repl_deleted_uids
(
	uid uuid default gen_random_uuid() not null
		constraint repl_deleted_uids_pk
			primary key,
	deleted_uid uuid not null,
	"table" varchar,
	repl_workstation_id varchar,
	modified timestamp
);

alter table repl_deleted_uids owner to "lkh";

-- truncate table repl_image_resolution;
--
-- comment on table repl_image_resolution is 'defines the rules for exporting images in the correct resolution to workstations';
--
-- comment on column repl_image_resolution.file_resolution is '''low'' or ''high''';
--
-- alter table repl_image_resolution owner to "lkh";

truncate table repl_workstation;
-- create table repl_workstation
-- (
-- 	id varchar(20) not null
-- 		constraint workstation_pk
-- 			primary key,
-- 	description varchar,
-- 	state smallint default 0 not null,
-- 	uid uuid default gen_random_uuid() not null,
-- 	fork_time timestamp,
-- 	fork_sync_time timestamp,
-- 	dsd_version varchar,
-- 	file_handling varchar
-- );

-- alter table repl_workstation owner to "lkh";

drop table if exists repl_workstation_events;
create table repl_workstation_events
(
	uid varchar default gen_random_uuid() not null
		constraint repl_workstation_log_pk
			primary key,
	ts timestamp default now() not null,
	event varchar,
	message varchar,
	workstation varchar not null
);

alter table repl_workstation_events owner to "lkh";

drop table if exists replication;
create table replication
(
	id varchar not null
		constraint replication_pk
			primary key,
	value varchar not null,
	ts timestamp default now() not null
);

comment on table replication is 'global values for the replication system in key - value format';

alter table replication owner to "lkh";

drop table if exists repl_workstation_filemaker;
create table repl_workstation_filemaker
(
	id varchar(20) not null
		constraint workstation_filemaker_pk
			primary key,
	recording_group varchar
);

alter table repl_workstation_filemaker owner to "lkh";

