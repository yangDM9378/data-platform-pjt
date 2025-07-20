from flask import Flask, request, jsonify, make_response
import sqlite3, jwt, datetime
from datetime import datetime, timezone, timedelta
from flask_cors import CORS

app = Flask(__name__)
app.config['SECRET_KEY'] = 'your_secret_key'
CORS(app, supports_credentials=True)

DB_PATH = 'database/config.db'

# select user info
def get_user_by_username(username):
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM users WHERE username = ?", (username,))
    row = cursor.fetchone()
    conn.close()
    return dict(row) if row else None

# login api
@app.route('/login', methods = ['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    user = get_user_by_username(username)
    if not user or user['password'] != password:
        return jsonify({'mesasge': '아이디 또는 비밀번호가 잘못되었습니다'}), 401

    token = jwt.encode({
        'user': username,
        'permission': user['permission'],
        'exp': datetime.now(timezone.utc) + timedelta(hours=2)
    }, app.config['SECRET_KEY'], algorithm="HS256")

    resp = make_response(jsonify({'message' : '로그인 성공'}))
    resp.set_cookie('token', token, httponly=True)
    return resp

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)