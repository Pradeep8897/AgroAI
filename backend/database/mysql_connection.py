import os
import sqlite3
import mysql.connector
from mysql.connector import Error

# DB Configuration
DB_HOST = os.environ.get("DB_HOST", "localhost")
DB_USER = os.environ.get("DB_USER", "root")
DB_PASSWORD = os.environ.get("DB_PASSWORD", "")
DB_NAME = os.environ.get("DB_NAME", "agroai")

# Check if we should enforce SQLite or if MySQL is available
USE_SQLITE = True # Default fallback for local testing, can be toggled by env
if os.environ.get("USE_MYSQL") == "true":
    USE_SQLITE = False

# Use /tmp on Vercel for the SQLite database since the deployment directory is read-only
if os.environ.get("VERCEL") == "1":
    DB_PATH = "/tmp/agroai.db"
else:
    DB_PATH = os.path.join(os.path.dirname(os.path.dirname(__file__)), "database", "agroai.db")


def get_connection():
    """Returns a database connection (MySQL or SQLite) and a boolean indicating if it's SQLite."""
    if USE_SQLITE:
        # Create directory if not exists
        os.makedirs(os.path.dirname(DB_PATH), exist_ok=True)
        conn = sqlite3.connect(DB_PATH)
        conn.row_factory = sqlite3.Row  # Access columns by name
        return conn, True
    
    try:
        conn = mysql.connector.connect(
            host=DB_HOST,
            user=DB_USER,
            password=DB_PASSWORD,
            database=DB_NAME
        )
        return conn, False
    except Error as e:
        print(f"MySQL connection failed: {e}. Falling back to SQLite database.")
        os.makedirs(os.path.dirname(DB_PATH), exist_ok=True)
        conn = sqlite3.connect(DB_PATH)
        conn.row_factory = sqlite3.Row
        return conn, True

def init_db():
    """Initializes the database schemas and seeds default data."""
    conn, is_sqlite = get_connection()
    cursor = conn.cursor()

    # Check if users table has 'phone' column, if not, drop it to migrate schema
    try:
        cursor.execute("SELECT phone FROM users LIMIT 1")
    except Exception:
        # Table doesn't exist, or doesn't have 'phone' column
        try:
            cursor.execute("DROP TABLE IF EXISTS users")
            conn.commit()
        except Exception:
            pass

    # Create tables queries
    tables = {}
    
    # SQLite schema
    if is_sqlite:
        tables['users'] = """
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            role TEXT DEFAULT 'farmer',
            phone TEXT,
            location TEXT,
            state TEXT,
            farm_size REAL,
            language TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );
        """
        tables['crops'] = """
        CREATE TABLE IF NOT EXISTS crops (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            name TEXT NOT NULL,
            N INTEGER,
            P INTEGER,
            K INTEGER,
            ph REAL,
            temperature REAL,
            humidity REAL,
            rainfall REAL,
            prediction TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );
        """
        tables['diseases'] = """
        CREATE TABLE IF NOT EXISTS diseases (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT UNIQUE NOT NULL,
            severity TEXT,
            cause TEXT,
            chemical_cure TEXT,
            organic_cure TEXT
        );
        """
        tables['disease_reports'] = """
        CREATE TABLE IF NOT EXISTS disease_reports (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            crop_name TEXT,
            disease_name TEXT,
            severity TEXT,
            image_path TEXT,
            status TEXT DEFAULT 'pending',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );
        """
        tables['equipment'] = """
        CREATE TABLE IF NOT EXISTS equipment (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            type TEXT,
            owner TEXT,
            rate_per_hour REAL,
            rate_per_day REAL,
            location TEXT,
            phone TEXT,
            image_url TEXT,
            availability INTEGER DEFAULT 1
        );
        """
        tables['bookings'] = """
        CREATE TABLE IF NOT EXISTS bookings (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            equipment_id INTEGER,
            hours INTEGER,
            total_cost REAL,
            status TEXT DEFAULT 'pending',
            date TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );
        """
        tables['products'] = """
        CREATE TABLE IF NOT EXISTS products (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            description TEXT,
            price REAL,
            category TEXT,
            image_url TEXT,
            stock INTEGER DEFAULT 10
        );
        """
        tables['listings'] = """
        CREATE TABLE IF NOT EXISTS listings (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            category TEXT NOT NULL,
            title TEXT NOT NULL,
            description TEXT,
            price REAL NOT NULL,
            unit TEXT DEFAULT 'quintal',
            location TEXT NOT NULL,
            quantity TEXT NOT NULL,
            phone TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );
        """
        tables['orders'] = """
        CREATE TABLE IF NOT EXISTS orders (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            product_id INTEGER,
            quantity INTEGER,
            total_cost REAL,
            status TEXT DEFAULT 'pending',
            address TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );
        """
        tables['market_prices'] = """
        CREATE TABLE IF NOT EXISTS market_prices (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            crop_name TEXT NOT NULL,
            market_name TEXT NOT NULL,
            state TEXT NOT NULL,
            current_price REAL,
            predicted_price REAL,
            date TEXT
        );
        """
        tables['chat_history'] = """
        CREATE TABLE IF NOT EXISTS chat_history (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            sender TEXT,
            message TEXT,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
        );
        """
    else:
        # MySQL schema
        tables['users'] = """
        CREATE TABLE IF NOT EXISTS users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            username VARCHAR(255) NOT NULL,
            email VARCHAR(255) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL,
            role VARCHAR(50) DEFAULT 'farmer',
            phone VARCHAR(50),
            location VARCHAR(255),
            state VARCHAR(255),
            farm_size FLOAT,
            language VARCHAR(100),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        """
        tables['crops'] = """
        CREATE TABLE IF NOT EXISTS crops (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT,
            name VARCHAR(255) NOT NULL,
            N INT,
            P INT,
            K INT,
            ph FLOAT,
            temperature FLOAT,
            humidity FLOAT,
            rainfall FLOAT,
            prediction VARCHAR(255),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        """
        tables['diseases'] = """
        CREATE TABLE IF NOT EXISTS diseases (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) UNIQUE NOT NULL,
            severity VARCHAR(100),
            cause TEXT,
            chemical_cure TEXT,
            organic_cure TEXT
        );
        """
        tables['disease_reports'] = """
        CREATE TABLE IF NOT EXISTS disease_reports (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT,
            crop_name VARCHAR(255),
            disease_name VARCHAR(255),
            severity VARCHAR(100),
            image_path VARCHAR(255),
            status VARCHAR(100) DEFAULT 'pending',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        """
        tables['equipment'] = """
        CREATE TABLE IF NOT EXISTS equipment (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            type VARCHAR(255),
            owner VARCHAR(255),
            rate_per_hour FLOAT,
            rate_per_day FLOAT,
            location VARCHAR(255),
            phone VARCHAR(50),
            image_url TEXT,
            availability BOOLEAN DEFAULT TRUE
        );
        """
        tables['bookings'] = """
        CREATE TABLE IF NOT EXISTS bookings (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT,
            equipment_id INT,
            hours INT,
            total_cost FLOAT,
            status VARCHAR(100) DEFAULT 'pending',
            date VARCHAR(100),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        """
        tables['products'] = """
        CREATE TABLE IF NOT EXISTS products (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            description TEXT,
            price FLOAT,
            category VARCHAR(255),
            image_url TEXT,
            stock INT DEFAULT 10
        );
        """
        tables['listings'] = """
        CREATE TABLE IF NOT EXISTS listings (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT,
            category VARCHAR(255) NOT NULL,
            title VARCHAR(255) NOT NULL,
            description TEXT,
            price FLOAT NOT NULL,
            unit VARCHAR(100) DEFAULT 'quintal',
            location VARCHAR(255) NOT NULL,
            quantity VARCHAR(255) NOT NULL,
            phone VARCHAR(50) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        """
        tables['orders'] = """
        CREATE TABLE IF NOT EXISTS orders (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT,
            product_id INT,
            quantity INT,
            total_cost FLOAT,
            status VARCHAR(100) DEFAULT 'pending',
            address TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        """
        tables['market_prices'] = """
        CREATE TABLE IF NOT EXISTS market_prices (
            id INT AUTO_INCREMENT PRIMARY KEY,
            crop_name VARCHAR(255) NOT NULL,
            market_name VARCHAR(255) NOT NULL,
            state VARCHAR(255) NOT NULL,
            current_price FLOAT,
            predicted_price FLOAT,
            date VARCHAR(100)
        );
        """
        tables['chat_history'] = """
        CREATE TABLE IF NOT EXISTS chat_history (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT,
            sender VARCHAR(100),
            message TEXT,
            timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        """

    # Check if equipment table has 'owner' column, if not, drop it to migrate schema
    try:
        cursor.execute("SELECT owner FROM equipment LIMIT 1")
    except Exception:
        # Table doesn't exist, or doesn't have 'owner' column
        try:
            cursor.execute("DROP TABLE IF EXISTS equipment")
            conn.commit()
        except Exception:
            pass

    # Execute table creations
    for name, query in tables.items():
        cursor.execute(query)
    conn.commit()

    # Seed initial items if they don't exist
    # 1. Seed Equipment
    cursor.execute("SELECT COUNT(*) FROM equipment")
    if cursor.fetchone()[0] == 0:
        equipment_seed = [
            ("Mahindra 575 DI Tractor", "Tractor", "Ramesh Patil", 800.0, 5000.0, "Nashik, Maharashtra", "+91 98765 43210", "tractor.jpg", 1),
            ("John Deere Harvester", "Harvester", "Gurpreet Singh", 2500.0, 15000.0, "Ludhiana, Punjab", "+91 87654 32109", "harvester.jpg", 1),
            ("Power Sprayer 20L", "Sprayer", "Suresh Jadhav", 200.0, 800.0, "Pune, Maharashtra", "+91 76543 21098", "sprayer.jpg", 1),
            ("Rotavator 5ft", "Rotavator", "Vikram Yadav", 600.0, 3500.0, "Indore, MP", "+91 65432 10987", "rotavator.jpg", 0),
            ("Seed Drill Machine", "Seed_drill", "Mohan Lal", 500.0, 2500.0, "Jaipur, Rajasthan", "+91 54321 09876", "seeder.jpg", 1)
        ]
        stmt = "INSERT INTO equipment (name, type, owner, rate_per_hour, rate_per_day, location, phone, image_url, availability) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)" if is_sqlite else "INSERT INTO equipment (name, type, owner, rate_per_hour, rate_per_day, location, phone, image_url, availability) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)"
        cursor.executemany(stmt, equipment_seed)
        conn.commit()

    # 2. Seed Diseases
    cursor.execute("SELECT COUNT(*) FROM diseases")
    if cursor.fetchone()[0] == 0:
        disease_seed = [
            ("Tomato Early Blight", "Moderate", "Alternaria solani fungus, usually spreads in wet conditions", "Apply copper-based fungicides (e.g., Mancozeb or Chlorothalonil) every 7-10 days.", "Remove infected lower leaves, rotate crops, prune for airflow, apply organic Neem oil spray."),
            ("Tomato Late Blight", "High", "Phytophthora infestans oomycete, thrives in cool, wet weather", "Apply Ridomil Gold or copper oxychloride instantly.", "Destroy affected plants immediately (do not compost), use resistant varieties, spray baking soda & organic compost tea."),
            ("Potato Leaf Roll", "High", "Potato leafroll virus (PLRV) transmitted by aphids", "No direct chemical cure for the virus. Apply systemic insecticides (e.g., Imidacloprid) to control aphid vector.", "Use certified virus-free seed tubers, weed out nightshade family hosts, release ladybugs to control aphids naturally."),
            ("Corn Common Rust", "Low", "Puccinia sorghi fungus, thrives in high humidity and moderate temperatures", "Apply fungicides such as Pyraclostrobin or Tebuconazole if severity exceeds 10%.", "Plant resistant hybrids, remove crop residues after harvest, rotate crops with non-grasses."),
            ("Rice Blast", "High", "Magnaporthe oryzae fungus, thrives in high nitrogen soils and wet weather", "Spray Tricyclazole or Edifenphos at early stages.", "Avoid excessive nitrogen fertilizers, maintain proper field flooding, spray bio-fungicide Pseudomonas fluorescens.")
        ]
        stmt = "INSERT INTO diseases (name, severity, cause, chemical_cure, organic_cure) VALUES (?, ?, ?, ?, ?)" if is_sqlite else "INSERT INTO diseases (name, severity, cause, chemical_cure, organic_cure) VALUES (%s, %s, %s, %s, %s)"
        cursor.executemany(stmt, disease_seed)
        conn.commit()

    # 3. Seed Products (Marketplace)
    cursor.execute("SELECT COUNT(*) FROM products")
    if cursor.fetchone()[0] == 0:
        product_seed = [
            ("Organic Heirloom Tomato Seeds", "100% natural, non-GMO tomato seeds with high germination rate (95%+). Ideal for home gardens and large farms.", 120.0, "Seeds", "tomato_seeds.jpg", 100),
            ("Premium Basmati Paddy Seeds", "Certified Pusa Basmati 1121 seeds. Offers high yield, strong pest resistance, and premium long grains.", 450.0, "Seeds", "paddy_seeds.jpg", 50),
            ("Pure Cold-Pressed Neem Oil (1L)", "Organic insecticide, pest repellent, and fungicide. Safe for beneficial insects like earthworms and bees.", 350.0, "Pesticides", "neem_oil.jpg", 80),
            ("Bio-NPK Liquid Fertilizer (500ml)", "Contains Nitrogen, Phosphorus, and Potassium fixing bacteria. Improves soil texture and plant growth.", 280.0, "Fertilizers", "npk_liquid.jpg", 120),
            ("Vermi-Compost Organic Manure (10kg)", "Rich in nutrients, improves water retention, and microbial activity of the soil.", 220.0, "Fertilizers", "vermicompost.jpg", 150),
            ("Soil pH Testing Digital Meter", "High-accuracy digital tester for soil moisture, pH, and ambient light. Batteries included.", 850.0, "Tools", "ph_meter.jpg", 30)
        ]
        stmt = "INSERT INTO products (name, description, price, category, image_url, stock) VALUES (?, ?, ?, ?, ?, ?)" if is_sqlite else "INSERT INTO products (name, description, price, category, image_url, stock) VALUES (%s, %s, %s, %s, %s, %s)"
        cursor.executemany(stmt, product_seed)
        conn.commit()

    # 4. Seed Market Prices
    cursor.execute("SELECT COUNT(*) FROM market_prices")
    if cursor.fetchone()[0] == 0:
        market_seed = [
            ("Tomato", "Azadpur Mandi", "Delhi", 1800.0, 1950.0, "2026-06-10"),
            ("Tomato", "Vashi Mandi", "Maharashtra", 1600.0, 1750.0, "2026-06-10"),
            ("Potato", "Agra Mandi", "Uttar Pradesh", 1200.0, 1250.0, "2026-06-10"),
            ("Rice", "Karnal Mandi", "Haryana", 3800.0, 3900.0, "2026-06-10"),
            ("Wheat", "Indore Mandi", "Madhya Pradesh", 2400.0, 2480.0, "2026-06-10"),
            ("Corn", "Chhindwara Mandi", "Madhya Pradesh", 2100.0, 2150.0, "2026-06-10")
        ]
        stmt = "INSERT INTO market_prices (crop_name, market_name, state, current_price, predicted_price, date) VALUES (?, ?, ?, ?, ?, ?)" if is_sqlite else "INSERT INTO market_prices (crop_name, market_name, state, current_price, predicted_price, date) VALUES (%s, %s, %s, %s, %s, %s)"
        cursor.executemany(stmt, market_seed)
        conn.commit()

    # 5. Seed default Admin and User accounts
    cursor.execute("SELECT COUNT(*) FROM users")
    if cursor.fetchone()[0] == 0:
        # Default password is "pbkdf2:sha256:..." or plain text for easy checks.
        # Let's save a sha256 hash or simple hashed password. For ease, we can store simple hashed passwords using werkzeug.security if available,
        # but let's write simple sha256 string or plain text verification in auth to make it robust.
        # Actually, let's use plain-text or a simple hash representation. To keep it clean and robust, we can use werkzeug.security.generate_password_hash.
        try:
            from werkzeug.security import generate_password_hash
            hashed_admin = generate_password_hash("admin123")
            hashed_farmer = generate_password_hash("farmer123")
        except ImportError:
            hashed_admin = "pbkdf2:sha256:260000$admin123"
            hashed_farmer = "pbkdf2:sha256:260000$farmer123"
            
        users_seed = [
            ("Pradeep Sangu", "pradeepsangu950@gmail.com", hashed_admin, "admin", "6305302731", "Nellore", "Andhrapradesh", 10.0, "telugu"),
            ("admin", "admin@agroai.com", hashed_admin, "admin", "9876543210", "Ludhiana", "Punjab", 5.0, "english"),
            ("farmer_pradeep", "pradeep@agroai.com", hashed_farmer, "farmer", "9876543210", "Ludhiana", "Punjab", 5.0, "english")
        ]
        stmt = "INSERT INTO users (username, email, password, role, phone, location, state, farm_size, language) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)" if is_sqlite else "INSERT INTO users (username, email, password, role, phone, location, state, farm_size, language) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)"
        cursor.executemany(stmt, users_seed)
        conn.commit()

    # 6. Seed default P2P Marketplace listings
    cursor.execute("SELECT COUNT(*) FROM listings")
    if cursor.fetchone()[0] == 0:
        listings_seed = [
            ("Sell Crop", "Paddy", "", 2000.0, "quintal", "Nellore", "50 quintal", "+91 98765 43210"),
            ("Sell Crop", "Premium Basmati Rice - 50 Quintals", "Grade A basmati rice from Punjab. Fresh harvest, excellent quality.", 2800.0, "quintal", "Amritsar, Punjab", "50 quintal", "+91 87654 32109"),
            ("Buy Crop", "Looking to buy Organic Tomatoes", "Need organic tomatoes for retail chain. Regular supply required.", 3500.0, "quintal", "Delhi NCR", "20 quintal", "+91 76543 21098"),
            ("Equipment Rent", "Mahindra 575 Tractor for Rent", "45 HP tractor in excellent condition. Comes with driver.", 800.0, "hour", "Nashik, Maharashtra", "1 hour", "+91 65432 10987")
        ]
        stmt = "INSERT INTO listings (category, title, description, price, unit, location, quantity, phone) VALUES (?, ?, ?, ?, ?, ?, ?, ?)" if is_sqlite else "INSERT INTO listings (category, title, description, price, unit, location, quantity, phone) VALUES (%s, %s, %s, %s, %s, %s, %s, %s)"
        cursor.executemany(stmt, listings_seed)
        conn.commit()

    conn.close()

if __name__ == "__main__":
    init_db()
    print("Database initialized successfully!")
