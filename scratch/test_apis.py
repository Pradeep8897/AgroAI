import requests
import io
import sys
import random

def test_endpoints():
    base_url = "https://agroai-j3v2.onrender.com"
    print(f"Testing APIs on deployed backend: {base_url}\n")
    
    session = requests.Session()
    
    # Generate random email to avoid duplicate errors
    email = f"tester_{random.randint(1000, 9999)}@agroai.com"
    password = "testpassword123"
    
    # 1. Test /api/auth/register
    print("--- Testing /api/auth/register ---")
    reg_payload = {
        "username": "api_tester",
        "email": email,
        "password": password,
        "role": "farmer"
    }
    try:
        r = session.post(f"{base_url}/api/auth/register", json=reg_payload)
        print(f"Status: {r.status_code}")
        print(f"Response: {r.text}\n")
    except Exception as e:
        print(f"Failed: {e}\n")
        
    # 2. Test /api/auth/login
    print("--- Testing /api/auth/login ---")
    login_payload = {
        "email": email,
        "password": password
    }
    try:
        r = session.post(f"{base_url}/api/auth/login", json=login_payload)
        print(f"Status: {r.status_code}")
        print(f"Response: {r.text}\n")
    except Exception as e:
        print(f"Failed: {e}\n")

    # 3. Test /api/crop/recommend
    print("--- Testing /api/crop/recommend ---")
    crop_payload = {
        "user_id": 1,
        "N": 90,
        "P": 42,
        "K": 43,
        "ph": 6.5,
        "temp": 24.6,
        "humidity": 70.2,
        "rainfall": 85.0
    }
    try:
        r = session.post(f"{base_url}/api/crop/recommend", json=crop_payload)
        print(f"Status: {r.status_code}")
        print(f"Response: {r.text}\n")
    except Exception as e:
        print(f"Failed: {e}\n")

    # 4. Test /api/disease/detect
    print("--- Testing /api/disease/detect ---")
    # Create a dummy image in memory (1x1 pixel JPEG)
    from PIL import Image
    img = Image.new('RGB', (100, 100), color = 'red')
    img_byte_arr = io.BytesIO()
    img.save(img_byte_arr, format='JPEG')
    img_byte_arr.seek(0)
    
    files = {
        'image': ('tomato_blight.jpg', img_byte_arr, 'image/jpeg')
    }
    data = {
        'user_id': '1'
    }
    try:
        r = session.post(f"{base_url}/api/disease/detect", files=files, data=data)
        print(f"Status: {r.status_code}")
        print(f"Response: {r.text}\n")
    except Exception as e:
        print(f"Failed: {e}\n")

if __name__ == "__main__":
    test_endpoints()
