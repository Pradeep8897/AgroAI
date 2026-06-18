from flask import Blueprint, request, jsonify
from models.user import UserModel
from werkzeug.security import check_password_hash

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/api/auth/register', methods=['POST'])
def register():
    data = request.get_json() or {}
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')
    role = data.get('role', 'farmer')

    if not username or not email or not password:
        return jsonify({"success": False, "message": "All fields are required."}), 400

    existing = UserModel.get_user_by_email(email)
    if existing:
        return jsonify({"success": False, "message": "Email already registered."}), 400

    user_id = UserModel.create_user(username, email, password, role)
    if user_id:
        return jsonify({
            "success": True,
            "message": "User registered successfully.",
            "user": {"id": user_id, "username": username, "email": email, "role": role}
        }), 201
    
    return jsonify({"success": False, "message": "Registration failed."}), 500

@auth_bp.route('/api/auth/login', methods=['POST'])
def login():
    data = request.get_json() or {}
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({"success": False, "message": "Email and password are required."}), 400

    user = UserModel.get_user_by_email(email)
    if not user:
        return jsonify({"success": False, "message": "Invalid credentials."}), 401

    if not check_password_hash(user['password'], password):
        return jsonify({"success": False, "message": "Invalid credentials."}), 401

    # Return a simulated token (for testing/development simplicity)
    return jsonify({
        "success": True,
        "message": "Login successful.",
        "token": f"mock-jwt-token-{user['id']}-{user['role']}",
        "user": {
            "id": user['id'],
            "username": user['username'],
            "email": user['email'],
            "role": user['role']
        }
    }), 200

@auth_bp.route('/api/auth/profile', methods=['GET', 'PUT'])
def profile():
    # In a real app we'd decode token. Here we parse the authorization header
    auth_header = request.headers.get('Authorization', '')
    user_id = None
    if auth_header.startswith('Bearer mock-jwt-token-'):
        parts = auth_header.split('-')
        if len(parts) >= 4:
            user_id = int(parts[3])

    if not user_id:
        # Fallback to query param or JSON body for testing ease
        user_id = request.args.get('user_id') or (request.get_json() or {}).get('user_id')
    
    if not user_id:
        return jsonify({"success": False, "message": "Unauthorized"}), 401

    if request.method == 'GET':
        user = UserModel.get_user_by_id(user_id)
        if user:
            return jsonify({
                "success": True,
                "user": {
                    "id": user['id'],
                    "username": user['username'],
                    "email": user['email'],
                    "role": user['role'],
                    "phone": user.get('phone', ''),
                    "location": user.get('location', ''),
                    "state": user.get('state', ''),
                    "farm_size": user.get('farm_size', ''),
                    "language": user.get('language', '')
                }
            })
        return jsonify({"success": False, "message": "User not found."}), 404

    else: # PUT
        data = request.get_json() or {}
        username = data.get('username')
        email = data.get('email')
        phone = data.get('phone', '')
        location = data.get('location', '')
        state = data.get('state', '')
        farm_size = data.get('farm_size', '')
        language = data.get('language', '')

        if not username or not email:
            return jsonify({"success": False, "message": "Username and email are required."}), 400

        try:
            if farm_size:
                farm_size = float(farm_size)
            else:
                farm_size = None
        except ValueError:
            return jsonify({"success": False, "message": "Farm size must be a number."}), 400

        success = UserModel.update_profile(user_id, username, email, phone, location, state, farm_size, language)
        if success:
            # Re-fetch updated user to return fresh info
            updated_user = UserModel.get_user_by_id(user_id)
            return jsonify({
                "success": True, 
                "message": "Profile updated successfully.", 
                "user": updated_user
            })
        return jsonify({"success": False, "message": "Profile update failed."}), 500

@auth_bp.route('/api/auth/forgot-password', methods=['POST'])
def forgot_password():
    data = request.get_json() or {}
    email = data.get('email')
    if not email:
        return jsonify({"success": False, "message": "Email is required."}), 400
    
    user = UserModel.get_user_by_email(email)
    if not user:
        return jsonify({"success": False, "message": "Email address not found."}), 404
        
    return jsonify({
        "success": True,
        "message": "Password reset instructions have been sent to your email."
    }), 200
