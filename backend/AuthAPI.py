from flask import Flask, request, jsonify, make_response
import sqlite3, jwt, datetime
from datetime import datetime, timezone, timedelta
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash

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
    if not user or not check_password_hash(user['password'], password):
        return jsonify({'message': '아이디 또는 비밀번호가 잘못되었습니다'}), 401

    token = jwt.encode({
        'user': username,
        'permission': user['permission'],
        'exp': datetime.now(timezone.utc) + timedelta(days=365)
    }, app.config['SECRET_KEY'], algorithm="HS256")

    resp = make_response(jsonify({'message' : '로그인 성공'}))
    resp.set_cookie('token', token, httponly=True,secure=True, samesite='Lax')
    return resp

@app.route('/me', methods = ['GET'])
def get_current_user():
    token = request.cookies.get('token')
    if not token:
        return jsonify({'message': '로그인이 필요합니다.'}), 401
    
    try:
        data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
        return jsonify({'user': data['user'], 'permission': data['permission']})
    except jwt.ExpiredSignatureError:
        return jsonify({'message': '토큰이 만료되었습니다.'}), 401
    except jwt.InvalidTokenError:
        return jsonify({'message': '유효하지 않은 토큰입니다.'}), 401

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)