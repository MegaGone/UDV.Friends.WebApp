CREATE OR REPLACE FUNCTION notify_friend_update() RETURNS trigger AS $$
DECLARE
  old_data JSON;
  new_data JSON;
BEGIN
  old_data := row_to_json(OLD);
  new_data := row_to_json(NEW);

  PERFORM pg_notify('friend_update', json_build_object(
    'table', TG_TABLE_NAME,
    'old', old_data,
    'new', new_data
  )::text);

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_friend_update ON my_friends;

CREATE TRIGGER trigger_friend_update
AFTER UPDATE ON my_friends
FOR EACH ROW
EXECUTE FUNCTION notify_friend_update();
