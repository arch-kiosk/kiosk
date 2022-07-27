INSERT INTO public.kiosk_user (uid, user_id, user_name, pwd_hash, repl_user_id, groups, must_change_pwd)
VALUES ('8aa2cd40-4eb0-47f4-b3f7-9baaabfcbeee', 'admin', 'The Admin',
        'pbkdf2:sha256:150000$TXid0qe7$e4583fe09e7eea6f3467f1fc9339ce27321646bc8e1e0c629c27b31ab2880185', 'lkh',
        'admins, operators', false);

INSERT INTO public.kiosk_user (uid, user_id, user_name, pwd_hash, repl_user_id, groups, must_change_pwd)
VALUES ('8ba2cd40-4eb0-47f4-b3f7-9baaabfcbeee', 'test', 'Just a User',
        'pbkdf2:sha256:150000$TXid0qe7$e4583fe09e7eea6f3467f1fc9339ce27321646bc8e1e0c629c27b31ab2880185', 'lkh',
        '', false);

INSERT INTO public.kiosk_user (uid, user_id, user_name, pwd_hash, repl_user_id, groups, must_change_pwd)
VALUES ('8ca2cd40-4eb0-47f4-b3f7-9baaabfcbeee', 'operator', 'Just an operator',
        'pbkdf2:sha256:150000$TXid0qe7$e4583fe09e7eea6f3467f1fc9339ce27321646bc8e1e0c629c27b31ab2880185', 'lkh',
        'operators', false);
