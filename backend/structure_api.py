from flask import Flask, jsonify
from flask_cors import CORS
from collections import defaultdict
import sqlite3
import json

app = Flask(__name__)
app.config['SECRET_KEY'] = 'your_secret_key'
CORS(app, supports_credentials=True)

DB_PATH = 'database/config.db'

@app.route('/tree', methods = ['GET'])
def get_structure():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    cur = conn.cursor()

    query = """
    SELECT
        f_parent.title AS parent_title,
        f_folder.title AS folder_title,
        f_folder.uid AS folder_uid,
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
    ORDER BY f_parent.title, f_folder.title
    """
    
    cur.execute(query)
    rows = cur.fetchall()
    conn.close()

    result = defaultdict(lambda: defaultdict(lambda: {
        'folder_uid': None,
        'dashboard': None,
        'dashboard_uid' : None,
        'datasources': []
    }))
    for row in rows:
        parent_title = row['parent_title']
        folder_title = row['folder_title']
        
        result[parent_title][folder_title]['folder_uid'] = row['folder_uid']
        result[parent_title][folder_title]['dashboard'] = row['dashboard_title']
        result[parent_title][folder_title]['dashboard_uid'] = row['dashboard_uid']
        result[parent_title][folder_title]['datasources'].append({
            'title': row['datasource_title'],
            'type': row['datasource_type'],
            'config': json.loads(row['ds_json'])
        })

    parent_list = []
    for parent, folders in result.items():
        parent_list.append({
            'parent': parent,
            'folders': [
                {
                    'title': folder,
                    **data
                } for folder, data in folders.items()
            ]
        })
    return jsonify(parent_list)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)