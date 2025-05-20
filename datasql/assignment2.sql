-- 1
INSERT INTO "account" (account_id, account_firstname, account_lastname, account_email, account_password, account_type) VALUES (DEFAULT, 'Tony', 'Stark', 'tony@starkent.com', 'Iam1ronM@n', DEFAULT)
-- 2
UPDATE account SET account_type = 'Admin' WHERE account_email = 'tony@starkent.com';
-- 3
DELETE FROM account WHERE account_email = 'tony@starkent.com'
-- 4
UPDATE inventory
SET inv_description = REPLACE(inv_description, 'small', 'large')
WHERE inv_make = 'GM' AND inv_model = 'Hummer';
-- 5
select inv_make, inv_model, classification_name
from inventory
inner join classification
on inventory.classification_id = classification.classification_id
where classification_name = 'Sport'
-- 6
UPDATE inventory
SET 
  inv_image = REPLACE(inv_image, '/images/', '/images/vehicles/'),
  inv_thumbnail = REPLACE(inv_thumbnail, '/images/', '/images/vehicles/');