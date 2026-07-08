-- Size selection was removed: this shop sells embroidered accessories
-- (bags, caps, patches, and similar), which generally aren't sized like
-- clothing or shoes, so the size_type column added a day ago is dropped.
alter table products drop column size_type;
