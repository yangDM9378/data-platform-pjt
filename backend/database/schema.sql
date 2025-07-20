-- DROP TABLE IF EXISTS users;

CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    permission TEXT NOT NULL
);

-- 관리자 계정
INSERT INTO users (username, password, permission)
VALUES ('admin', 'admin', 'admin');