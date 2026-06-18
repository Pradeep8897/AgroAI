from flask import Blueprint, jsonify, request
from models.notification import NotificationModel

notification_bp = Blueprint('notification', __name__)

@notification_bp.route('/api/notifications', methods=['GET'])
def get_notifications():
    user_id = request.args.get('user_id')
    alerts = NotificationModel.get_active_alerts(user_id)
    return jsonify({
        "success": True,
        "notifications": alerts
    })
