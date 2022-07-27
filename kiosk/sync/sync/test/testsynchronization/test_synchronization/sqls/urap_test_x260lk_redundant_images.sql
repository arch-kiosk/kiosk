-- insert image 0d09f3c4-0123-403d-80e0-bab677bbc0b7 that is redundant with 0d09f3c4-0f67-403d-80e0-bab677bbc0b7
INSERT INTO x260lk.x260lk_dayplan (image_description, uid_image, uid, created, modified, modified_by,
                                   repl_deleted, repl_tag)
VALUES ('white striped ware', '0d09f3c4-0123-403d-80e0-bab677bbc0b7', 'a717c8a4-bfa4-49fa-a3be-b53afac38ab1',
        '2019-03-11 20:52:30.000000', '2019-03-11 20:52:30.000000', 'sys', false, 1);


INSERT INTO x260lk.x260lk_fm_image_transfer (id, uid_file, filepath_and_name, location, resolution,disabled, file_type,
                                             file_size)
VALUES (7, '0d09f3c4-0123-403d-80e0-bab677bbc0b7',
        'data\file_repository\cache\1024x786jpg\0d09f3c4-0123-403d-80e0-bab677bbc0b7.jpg',
        'internal', 'low',false,'jpg', 123084);

INSERT INTO x260lk.x260lk_fm_repldata_transfer (id, tablename, uid, modified, modified_by)
VALUES (16, 'images', '0d09f3c4-0123-403d-80e0-bab677bbc0b7', '2019-04-28 14:18:58.31849', 'sys');

INSERT INTO x260lk.x260lk_images (description, img_proxy, ref_uid, file_datetime, original_md5, tags, uid, created,
                                  modified, modified_by, repl_deleted, repl_tag)
VALUES (null, '2021-01-29 14:18:58.000000', null, '2021-01-29 14:18:58.000000', '79CDA7B3A88A60DFFF05E9C48FB8D5BB',
        null, '0d09f3c4-0123-403d-80e0-bab677bbc0b7', '2021-01-29 14:18:58.000000', '2021-01-29 14:18:58.000000', 'test',
        false, 1);

-- ##################################################################################

-- insert image 0d09f3c4-0456-403d-80e0-bab677bbc0b7 that is redundant with 0d09f3c4-0f67-403d-80e0-bab677bbc0b7
INSERT INTO x260lk.x260lk_dayplan (image_description, uid_image, uid, created, modified, modified_by,
                                   repl_deleted, repl_tag)
VALUES ('white striped ware', '0d09f3c4-0456-403d-80e0-bab677bbc0b7', 'a718c8a4-bfa4-49fa-a3be-b53afac38ab1',
        '2019-03-11 20:52:30.000000', '2019-03-11 20:52:30.000000', 'sys', false, 1);

INSERT INTO x260lk.x260lk_fm_image_transfer (id, uid_file, filepath_and_name, location, resolution,disabled, file_type,
                                             file_size)
VALUES (7, '0d09f3c4-0456-403d-80e0-bab677bbc0b7',
        'data\file_repository\cache\1024x786jpg\0d09f3c4-0456-403d-80e0-bab677bbc0b7.jpg',
        'internal', 'low', false, 'jpg', 123890);

INSERT INTO x260lk.x260lk_fm_repldata_transfer (id, tablename, uid, modified, modified_by)
VALUES (16, 'images', '0d09f3c4-0456-403d-80e0-bab677bbc0b7', '2019-04-28 14:18:58.31849', 'sys');

INSERT INTO x260lk.x260lk_images (description, img_proxy, ref_uid, file_datetime, original_md5, tags, uid, created,
                                  modified, modified_by, repl_deleted, repl_tag)
VALUES (null, '2021-01-29 14:18:58.000000', null, '2021-01-29 14:18:58.000000', '79CDA7B3A88A60DFFF05E9C48FB8D5BB',
        null, '0d09f3c4-0456-403d-80e0-bab677bbc0b7', '2021-01-29 14:18:58.000000', '2021-01-29 14:18:58.000000', 'test',
        false, 1);

-- ##################################################################################

-- insert image e72c73dc-abcd-4168-b290-c8f2ff2aaf29 that is redundant with e72c73dc-abf5-4168-b290-c8f2ff2aaf29
INSERT INTO x260lk.x260lk_site (id, id_short, uid_site_map, uid, created, modified, modified_by,
                                   repl_deleted, repl_tag)
VALUES ('MySite', 'MYS', 'e72c73dc-abcd-4168-b290-c8f2ff2aaf29', 'a718c8a4-bfd4-49fa-a3be-b53afac38ab1',
        '2019-03-11 20:52:30.000000', '2019-03-11 20:52:30.000000', 'sys', false, 1);

INSERT INTO x260lk.x260lk_fm_image_transfer (id, uid_file, filepath_and_name, location, resolution,disabled, file_type,
                                             file_size)
VALUES (7, 'e72c73dc-abcd-4168-b290-c8f2ff2aaf29',
        'data\file_repository\cache\1024x786jpg\e72c73dc-abcd-4168-b290-c8f2ff2aaf29.jpg',
        'internal', 'low', false, 'jpg', 123345);

INSERT INTO x260lk.x260lk_fm_repldata_transfer (id, tablename, uid, modified, modified_by)
VALUES (16, 'images', 'e72c73dc-abcd-4168-b290-c8f2ff2aaf29', '2019-04-28 14:18:58.31849', 'sys');

INSERT INTO x260lk.x260lk_images (description, img_proxy, ref_uid, file_datetime, original_md5, tags, uid, created,
                                  modified, modified_by, repl_deleted, repl_tag)
VALUES (null, '2021-01-29 14:18:58.000000', null, '2021-01-29 14:18:58.000000', '79CDA7B3A88A60DFFF05E9C48FB8D5BB',
        null, 'e72c73dc-abcd-4168-b290-c8f2ff2aaf29', '2021-01-29 14:18:58.000000', '2021-01-29 14:18:58.000000', 'test',
        false, 1);
