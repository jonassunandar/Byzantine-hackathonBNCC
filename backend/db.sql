DROP TABLE IF EXISTS 
    users
CASCADE;

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(128) NOT NULL,
    first_name VARCHAR(64),
    last_name VARCHAR(64),
    address VARCHAR(128),
    blockchain_address char(40),
    pwd_salt VARCHAR(64)
);

CREATE INDEX user_index ON users (email);

INSERT INTO users (email, address, blockchainAddress, pwd_salt) VALUES("jonassunandar@gmail.com", "malang", "jonas", "salty_jonas")
