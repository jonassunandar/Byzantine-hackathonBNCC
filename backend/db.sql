DROP TABLE IF EXISTS 
    users
CASCADE;

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(128) NOT NULL,
    address CHAR(40),
    pwd_salt VARCHAR(64)
);

CREATE INDEX user_index ON users (email);
