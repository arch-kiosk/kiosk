update {{images}} set tags='"inventory"' where {{images}}.uid in (select uid_photo from {{inventory}});
