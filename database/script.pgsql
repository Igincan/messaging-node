-- insert into tst (haha) values ('trololo');
-- select * from tst;
-- select currval(pg_get_serial_sequence('tst', 'id'));
-- INSERT INTO "tst" (haha)
-- VALUES ('meh')
-- RETURNING ID;


-- CREATE FUNCTION person_insert_trigger_function()
-- RETURNS TRIGGER AS $$
--     BEGIN
--         IF NEW.EMAIL = 'undefined' THEN
--             NEW.EMAIL := NULL;
--         END IF;
--         RETURN NEW;
--     END;
-- $$ LANGUAGE 'plpgsql';

-- create trigger person_update_trigger
-- before update on "Person"
-- for each row
-- when (new.email = 'undefined')
-- execute PROCEDURE person_insert_trigger_function();


-- select * from "Person" where "firstName" = 'Igor';
-- update "Person" set email = 'undefined' where "firstName" = 'Igor';


-- delete from "Person" where "firstName" = 'Igor';
 