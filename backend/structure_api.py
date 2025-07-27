from flask import Flask, jsonify, request
from flask_cors import CORS
from collections import defaultdict
from datetime import datetime, timezone

from common import influxdb_v1_client
import sqlite3
import json

app = Flask(__name__)
app.config['SECRET_KEY'] = 'your_secret_key'
CORS(app, supports_credentials=True)

DB_PATH = 'database/config.db'

@app.route('/tree', methods=['GET'])
def get_structure():
    try:
        conn = sqlite3.connect(DB_PATH)
        conn.row_factory = sqlite3.Row
        cur = conn.cursor()

        query = """
        SELECT
            f_parent.title AS parent_title,
            f_folder.title AS folder_title,
            f_folder.uid AS folder_uid,
            f_folder.sub_title AS folder_sub_title,
            d.title AS dashboard_title,
            d.uid AS dashboard_uid,
            ds.title AS datasource_title,
            ds.type AS datasource_type,
            ds.ds_json
        FROM folders f_parent
        JOIN folders f_folder ON f_folder.parent_uid = f_parent.uid
        JOIN dashboards d ON d.folder_uid = f_folder.uid
        JOIN dashboard_datasources dd ON dd.dashboard_uid = d.uid
        JOIN datasources ds ON ds.uid = dd.datasource_uid
        WHERE f_parent.parent_uid IS NULL
        ORDER BY f_parent.title, f_folder.title, d.title
        """
        
        cur.execute(query)
        rows = cur.fetchall()
        conn.close()

        if not rows:
            return jsonify({'message': '구조 데이터를 찾을 수 없습니다.'}), 404

        result = defaultdict(lambda: defaultdict(lambda: {
            'folder_uid': None,
            'dashboards': defaultdict(lambda: {
                'dashboard_uid': None,
                'datasources': []
            })
        }))

        for row in rows:
            parent = row['parent_title']
            folder = row['folder_title']
            folder_uid = row['folder_uid']
            folder_sub_title = row['folder_sub_title']
            dash_title = row['dashboard_title']
            dash_uid = row['dashboard_uid']
            ds = {
                'title': row['datasource_title'],
                'type': row['datasource_type'],
                'config': json.loads(row['ds_json'])
            }

            folder_data = result[parent][folder]
            folder_data['folder_uid'] = folder_uid
            folder_data['folder_sub_title'] = folder_sub_title
            dash_data = folder_data['dashboards'][dash_title]
            dash_data['dashboard_uid'] = dash_uid
            dash_data['title'] = dash_title
            dash_data['datasources'].append(ds)

        final = []
        for parent_title, folders in result.items():
            final.append({
                'parent': parent_title,
                'folders': [
                    {
                        'title': folder_title,
                        'folder_uid': folder_data['folder_uid'],
                        'folder_sub_title': folder_data['folder_sub_title'],
                        'dashboards': list(folder_data['dashboards'].values())
                    } for folder_title, folder_data in folders.items()
                ]
            })

        return jsonify(final)

    except Exception as e:
        return jsonify({'message': f'서버 오류: {str(e)}'}), 500


@app.route('/batch', methods=['POST'])
def batch_status():
    data = request.get_json()
    result_map = {}
    for item in data:
        meas = item['measurement']
        try:
            client = influxdb_v1_client(
                url=item['url'],
                dbname=item['dbname'],
                username=item['username'],
                password=item['password']
            )
            query = f'SELECT * FROM "{meas}" ORDER BY time DESC LIMIT 1'
            result = client.query(query)
            points = list(result.get_points())
            point = points[0] if points else {}
            if not point:
                result_map[meas] = {}
                continue
            alarm = int(point.get("alarm_status", 0))
            run = int(point.get("run_status", 0))
            time_str = point.get("time")
            if alarm == 1:
                status = "ALARM"
                runtime = "-"
            elif run == 1:
                status = "RUNNING"
                try:
                    point_time = datetime.strptime(time_str, "%Y-%m-%dT%H:%M:%S.%fZ").replace(tzinfo=timezone.utc)
                    now = datetime.now(timezone.utc)
                    delta = now - point_time
                    runtime = str(delta).split(".")[0]
                except Exception as e:
                    runtime = "-"
            else:
                status = "STABLE"
                runtime = "-"

            result_map[meas] = {
                "status": status,
                "runtime": runtime
            }

        except Exception as e:
            print(f"[ERROR] {meas} : {e}")
            result_map[meas] = {"status": "ERROR", "runtime": "-"}

    return jsonify(result_map)
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)
