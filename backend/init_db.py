import sqlite3

def init_db():
    conn = sqlite3.connect('database/config.db')
    with open('database/schema.sql', 'r') as f:
        conn.executescript(f.read())
    conn.commit()
    conn.close()
    print("✅ SQLite DB가 성공적으로 초기화되었습니다.")

if __name__ == '__main__':
    init_db()
