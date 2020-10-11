DROP TABLE IF EXISTS 
    users,
    user_test
CASCADE;

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(128) NOT NULL,
    first_name VARCHAR(64),
    last_name VARCHAR(64),
    address VARCHAR(128),
    blockchain_address char(42),
    pwd_salt VARCHAR(64)
);

CREATE TABLE user_test (
    id SERIAL PRIMARY KEY,
    email VARCHAR(128) NOT NULL,
    pwd_salt VARCHAR(64),
    password VARCHAR(128)
);

CREATE INDEX user_index ON users (email);
CREATE INDEX user_test_index ON user_test (email);

