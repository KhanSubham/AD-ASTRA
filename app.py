from flask import Flask, jsonify, render_template
from flask_cors import CORS
import mysql.connector

app = Flask(__name__)
CORS(app) 

# Database connection configuration
db_config = {
    'host': 'localhost',
    'user': 'root', 
    'password': 'Ladduayu@786', 
    'database': 'ad_astra'
}

# --- PAGE ROUTES (Serving HTML) ---

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/store')
def store():
    return render_template('store.html')

@app.route('/cart')
def cart():
    return render_template('cart.html')

# --- API ROUTES (Serving Data) ---

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
    print("🚀 AD ASTRA Full-Stack Server starting on port 5000...")
    app.run(debug=True, port=5000)