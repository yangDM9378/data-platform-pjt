import sqlite3
from werkzeug.security import generate_password_hash

def init_db():
    conn = sqlite3.connect('database/Config.db')
    with open('database/schema.sql', 'r', encoding='utf-8') as f:
        conn.executescript(f.read())
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
    conn.close()
    print("✅ SQLite DB가 성공적으로 초기화되었습니다.")

if __name__ == '__main__':
    init_db()
