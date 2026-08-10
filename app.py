import os
from flask import Flask, jsonify, render_template
from flask_cors import CORS
import mysql.connector

app = Flask(__name__)
CORS(app) 

# Secure database configuration using environment variables
db_config = {
    'host': os.environ.get('DB_HOST', 'localhost'),
    'port': int(os.environ.get('DB_PORT', 3306)),
    'user': os.environ.get('DB_USER', 'root'), 
    'password': os.environ.get('DB_PASSWORD', 'Ladduayu@786'), 
    'database': os.environ.get('DB_NAME', 'ad_astra')
}

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
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM products")
        products = cursor.fetchall()
        cursor.close()
        conn.close()
        return jsonify(products)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)
