INSERT INTO public.images (description, img_proxy, ref_uid,
                           uid, created, modified, modified_by, repl_deleted, repl_tag, md5_hash, file_datetime, tags,
                           original_md5, image_attributes, filename)
VALUES ('FA test image 1', '2019-09-22 13:31:17.000000', 'f27424aa-c826-451e-a434-a03f7332a802',
        '32d4db7e-ef19-4465-90de-5714c413638e', '2019-03-11 20:52:30.000000', '2019-03-11 20:52:30.000000',
        'ldb', false, null, null, '2019-03-11 20:52:30.000000', 'test', null, null,
        '%file_repository%\32d4db7e-ef19-4465-90de-5714c413638e.JPG');

INSERT INTO public.images (description, img_proxy, ref_uid,
                           uid, created, modified, modified_by, repl_deleted, repl_tag, md5_hash, file_datetime, tags,
                           original_md5, image_attributes, filename)
VALUES ('FA test image 2', '2019-09-22 13:53:34', '5a83a51e-fea2-4f56-b8bd-e20e39dad1e5',
        '21e9156c-c6a2-4229-9d9e-bd712323c4f1', '2019-03-11 20:52:30.000000', '2019-03-11 20:52:30.000000',
        'ldb', false, null, null, '2019-03-11 20:52:30.000000', 'test', null, null,
        '%file_repository%\21e9156c-c6a2-4229-9d9e-bd712323c4f1.NEF');

INSERT INTO public.images (description, img_proxy, ref_uid,
                           uid, created, modified, modified_by, repl_deleted, repl_tag, md5_hash, file_datetime, tags,
                           original_md5, image_attributes, filename)
VALUES ('FA test image 3', '2019-09-22 13:57:34', '88edc131-b88a-4847-99fd-42333844cba3',
        'c5107d70-a9c2-4bde-945a-f41c2f11dfd6', '2019-09-22 13:57:48', '2019-09-22 13:57:51',
        'ldb', false, null, null, '2019-09-22 13:57:59', null, null, null,
        '%file_repository%\c5107d70-a9c2-4bde-945a-f41c2f11dfd6.SVG');
