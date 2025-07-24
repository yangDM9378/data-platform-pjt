DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS folders;
DROP TABLE IF EXISTS dashboards;
DROP TABLE IF EXISTS datasources;
DROP TABLE IF EXISTS dashboard_datasources;

CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    permission TEXT NOT NULL
);

CREATE TABLE folders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL UNIQUE,
    sub_title TEXT,
    uid TEXT NOT NULL UNIQUE,
    parent_uid TEXT
);

CREATE TABLE dashboards (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    uid TEXT NOT NULL UNIQUE,
    folder_uid TEXT NOT NULL,
    title TEXT NOT NULL,
    dash_json TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (folder_uid) REFERENCES folders(uid)
);

CREATE TABLE datasources (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    uid TEXT NOT NULL UNIQUE,
    type TEXT NOT NULL,
    ds_json TEXT
);

CREATE TABLE dashboard_datasources (
    dashboard_uid TEXT NOT NULL,
    datasource_uid TEXT NOT NULL,
    PRIMARY KEY (dashboard_uid, datasource_uid),
    FOREIGN KEY (dashboard_uid) REFERENCES dashboards(uid),
    FOREIGN KEY (datasource_uid) REFERENCES datasources(uid)
);