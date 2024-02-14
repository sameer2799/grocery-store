from flask import current_app as app
from flask import  jsonify, request, render_template, send_file
from flask_security import auth_required, roles_required, current_user
from applications.security import datastore
from werkzeug.security import check_password_hash, generate_password_hash
from datetime import datetime
from applications.models import *
from .instances import cache
from email_validator import validate_email, EmailNotValidError


@app.get('/')
def home():
    return render_template("index.html")

#-----------------------------------------------------
#------------------- For PWA--------------------------
#-----------------------------------------------------

@app.route('/manifest.json')
def serve_manifest():
    return send_file('manifest.json', mimetype='application/manifest+json')

@app.route('/sw.js')
def serve_sw():
    return send_file('sw.js', mimetype='application/javascript')

#-----------------------------------------------------
#-----------------------------------------------------

@app.post('/user-login')
def user_login():
    data = request.get_json()
    email = data.get('email')
    p = data.get('password')
    if not (email and p):
        return jsonify({"message": "Email or Password not provided"}), 400

    try:
        emailinfo = validate_email(email, check_deliverability=False)

        email = emailinfo.email

    except EmailNotValidError as e:
        return jsonify({"message": str(e)}), 400

    user = datastore.find_user(email=email)

    if not user:
        return jsonify({"message": "User Not Found"}), 404
    
    if not user.active:
        return jsonify({"info": "User Not Activated, please wait for admin approval"}), 401

    if check_password_hash(user.password, data.get('password')):
        user.last_login_at = datetime.now()
        db.session.commit()
        return jsonify({"token": user.get_auth_token(), "id": user.id, "role": user.roles[0].name})
    else:
        return jsonify({"message": "Wrong Password"}), 400


@app.post('/user-register')
def register():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    username = data.get('username')
    role = data.get('role')

    if not (email and password and username):
        return jsonify({"message": "Email, password, or username not provided"}), 400

    if not role:
        return jsonify({"message": "Please select a role"}), 400

    try:
        emailinfo = validate_email(email, check_deliverability=True)
        email = emailinfo.email
    except EmailNotValidError as e:
        return jsonify({"message": str(e)}), 400

    existing_user = datastore.find_user(email=email)
    if existing_user:
        return jsonify({"message": "User already exists"}), 409

    if role == "seller":
        datastore.create_user(email=email, password=generate_password_hash(password, method='pbkdf2:sha256', salt_length=16), username=username, active=False, roles = ["seller"])
        db.session.commit()
        return jsonify({"info": "User registered successfully, please wait for admin approval"})

    datastore.create_user(email=email, password=generate_password_hash(password, method='pbkdf2:sha256', salt_length=16), username=username, roles = ["buyer"])
    db.session.commit()

    return jsonify({"message": "User registered successfully"})


#--------------------------------------------------------
#-----------------------Add to Cart----------------------
#--------------------------------------------------------

@app.post('/add-to-cart')
@auth_required("token")
@roles_required("buyer")
def add_to_cart():
    cache.clear()
    data = request.get_json()

    for p in data:
        product_id, quantity = p.get('product_id'), p.get('quantity')

        product = Products.query.filter_by(product_id=product_id).first()
        if not product:
            return jsonify({"message": "Product not found"}), 404

        if not product.is_available:
            return jsonify({"message": "Product not available"}), 400

        if product.expiry_date < datetime.now().date():
            return jsonify({"message": "Product expired"}), 400

        cart = Cart.query.filter_by(customer=current_user.id, carted_products=product_id).first()
        if cart:
            cart.quantity += quantity
            db.session.commit()
            continue

        cart = Cart(customer=current_user.id, carted_products=product_id, quantity=quantity)
        db.session.add(cart)
        db.session.commit()

    return jsonify({"info": "Products added to cart successfully"})

