import sqlite3
import uuid
import json
from werkzeug.security import generate_password_hash

def init_db():
    conn = sqlite3.connect('database/Config.db')
    try:
        with open('database/schema.sql', 'r', encoding='utf-8') as f:
            conn.executescript(f.read())
        conn.commit()
        print('초기 DB가 생성되었습니다.')
    finally:
        conn.close()

def init_user_create():
    conn = sqlite3.connect('database/Config.db')
    try:
        hashed_admin_pw = generate_password_hash('admin')
        conn.execute(
            'INSERT INTO users (username, password, permission) VALUES (?,?,?)',
            ('admin', hashed_admin_pw, 'Admin')
        )
        hashed_user_pw = generate_password_hash('user')
        conn.execute(
            'INSERT INTO users (username, password, permission) VALUES (?,?,?)',
            ('user', hashed_user_pw, 'User')
        )
        conn.commit()
        print("초기 유저가 생성되었습니다.")
    finally:
        conn.close()

def init_folder_dashboard_datasource_create():
    conn = sqlite3.connect('database/Config.db') 
    try:
        fab_1_uid = "folder_" + str(uuid.uuid4())[:8]
        fab_2_uid = "folder_" + str(uuid.uuid4())[:8]
        folders = [
            ("FAB 1", fab_1_uid, None),
            ("FAB 2", fab_2_uid, None)
        ]
        for title, uid, parent_uid in folders:
            conn.execute(
                'INSERT OR IGNORE INTO folders (title, uid, parent_uid) VALUES (?, ?, ?)',
                (title, uid, parent_uid)
            )

        eq_folders = []
        for i in range(1, 8):
            eq_uid = "folder_" + str(uuid.uuid4())[:8]
            parent_uid = fab_1_uid if i <= 4 else fab_2_uid
            eq_folders.append((f"EQ {i}", eq_uid, parent_uid))

        for title, uid, parent_uid in eq_folders:
            conn.execute(
                'INSERT OR IGNORE INTO folders (title, uid, parent_uid) VALUES (?, ?, ?)',
                (title, uid, parent_uid)
            )

        ds_influx_uid = "ds_" + str(uuid.uuid4())[:8]
        ds_api_uid = "ds_" + str(uuid.uuid4())[:8]

        influx_json = {
            "url": "http://localhost:8086",
            "username": "admin",
            "password": "admin"
        }

        python_api_json = {
            "url": "http://localhost:5000"
        }

        datasources = [
            (ds_influx_uid, "InfluxDB_v1", json.dumps(influx_json)),
            (ds_api_uid, "Python_API", json.dumps(python_api_json))
        ]

        for uid, ds_type, ds_json in datasources:
            conn.execute(
                'INSERT OR IGNORE INTO datasources (uid, type, ds_json) VALUES (?, ?, ?)',
                (uid, ds_type, ds_json)
            )

        for title, folder_uid, _ in eq_folders:
            dash_uid = "dash_" + str(uuid.uuid4())[:8]
            dash_title = f"{title} 기본 대시보드"
            conn.execute(
                'INSERT OR IGNORE INTO dashboards (uid, folder_uid, title, dash_json) VALUES (?, ?, ?, ?)',
                (dash_uid, folder_uid, dash_title, None)
            )

            for ds_uid in [ds_influx_uid, ds_api_uid]:
                conn.execute(
                    'INSERT OR IGNORE INTO dashboard_datasources (dashboard_uid, datasource_uid) VALUES (?, ?)',
                    (dash_uid, ds_uid)
                )

        conn.commit()
        print("초기 폴더, 대시보드, 데이터소스가 모두 생성되었습니다.")
    finally:
        conn.close()

if __name__ == '__main__':
    init_db()
    init_user_create()
    init_folder_dashboard_datasource_create()
