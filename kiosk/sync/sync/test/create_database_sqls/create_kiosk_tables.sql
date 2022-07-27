drop table if exists kiosk_privilege;
create table kiosk_privilege
(
	addressee varchar not null,
	privilege varchar not null,
	uid uuid default gen_random_uuid() not null
		constraint kiosk_privileges_pk
			primary key
);

alter table kiosk_privilege owner to "lkh";

drop table if exists kiosk_user;
create table kiosk_user
(
	uid uuid default gen_random_uuid() not null
		constraint kiosk_user_pkey
			primary key,
	user_id varchar(20) not null,
	user_name varchar not null,
	pwd_hash varchar not null,
	repl_user_id varchar(20),
	groups varchar,
	must_change_pwd boolean
);

alter table kiosk_user owner to "lkh";

create unique index kiosk_user_user_name_uindex
	on kiosk_user (user_name);

drop table if exists kiosk_workstation;
create table kiosk_workstation
(
	id varchar not null
		constraint kiosk_workstation_pk
			primary key,
	download_upload_status bigint default 0 not null,
	ts_status timestamp
);

comment on table kiosk_workstation is 'workstation data exclusive to the kiosk ui';

alter table kiosk_workstation owner to "lkh";

drop table if exists kiosk_file_cache;
create table kiosk_file_cache
(
	uid uuid default gen_random_uuid() not null
		constraint kiosk_file_cache_pk
			primary key,
	uid_file uuid not null,
	representation_type varchar,
	invalid boolean default true not null,
	created timestamp default now() not null,
	modified timestamp default now() not null,
	image_attributes json,
	path_and_filename varchar
);

alter table kiosk_file_cache owner to "lkh";

create unique index kiosk_file_cache_uid_file_representation_type_uindex
	on kiosk_file_cache (uid_file, representation_type);

create unique index kiosk_file_cache_uid_uindex
	on kiosk_file_cache (uid);

