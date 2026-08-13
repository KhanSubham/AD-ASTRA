import os
from flask import Flask, jsonify, render_template
from flask_cors import CORS
import pymysql

app = Flask(__name__)
CORS(app)

def get_db_connection():
    return pymysql.connect(
        host=os.environ.get('DB_HOST', 'localhost'),
        port=int(os.environ.get('DB_PORT', 3306)),
        user=os.environ.get('DB_USER', 'root'),
        password=os.environ.get('DB_PASSWORD', 'Ladduayu@786'),
        database=os.environ.get('DB_NAME', 'ad_astra'),
        cursorclass=pymysql.cursors.DictCursor,
        connect_timeout=10
    )

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/store')
def store():
    return render_template('store.html')

@app.route('/cart')
def cart():
    return render_template('cart.html')

@app.route('/api/products', methods=['GET'])
def get_products():
    try:
        conn = get_db_connection()
        with conn.cursor() as cursor:
            cursor.execute("SELECT * FROM products")
            products = cursor.fetchall()
        conn.close()
        return jsonify(products)
    except Exception as e:
        print("DATABASE ERROR LOG:", str(e))  # Prints exact database error in Vercel Logs
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)
