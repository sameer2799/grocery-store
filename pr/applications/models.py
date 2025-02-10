from flask_sqlalchemy import SQLAlchemy
from flask_security import UserMixin, RoleMixin


db = SQLAlchemy()


class RolesUsers(db.Model):
    __tablename__ = 'roles_users'
    id = db.Column(db.Integer(), primary_key=True)
    user_id = db.Column('user_id', db.Integer(), db.ForeignKey('user.id'))
    role_id = db.Column('role_id', db.Integer(), db.ForeignKey('role.id'))


class User(db.Model, UserMixin):
    __tablename__ = "user"

    id = db.Column(db.Integer(), primary_key=True)
    email = db.Column(db.String(255), unique=True)
    username = db.Column(db.String(255), unique=False, nullable=True)
    password = db.Column(db.String(255), nullable=False)
    active = db.Column(db.Boolean())  # default = True
    last_login_at = db.Column(db.DateTime())
    fs_uniquifier = db.Column(db.String(64), unique=True, nullable=False)
    roles = db.relationship('Role', secondary='roles_users', backref = db.backref('users', lazy='dynamic'))


class Role(db.Model, RoleMixin):
    __tablename__ = "role"

    id = db.Column(db.Integer(), primary_key = True)
    name = db.Column(db.String(20), nullable = False)
    description = db.Column(db.String(30), nullable = False)




class Categories(db.Model):
    __tablename__ = 'categories'

    category_id = db.Column(db.Integer, primary_key = True)
    category_name = db.Column(db.String, nullable = False)
    description = db.Column(db.String, nullable=False)
    is_approved = db.Column(db.Boolean(), default = False)
    products = db.relationship('Products', backref = 'category', lazy = True)    

from enum import Enum

class Season(Enum):
    OFF_SEASON = 1
    PEAK_SEASON = 2


class Products(db.Model):
    __tablename__ = 'products'

    product_id = db.Column(db.Integer, primary_key = True)
    product_name = db.Column(db.String(length = 30), nullable = False)
    units = db.Column(db.String, nullable = False)
    price_per_unit = db.Column(db.Double, nullable = False)
    stock = db.Column(db.Integer, nullable = False)
    expiry_date = db.Column(db.Date, nullable = False)
    description = db.Column(db.Text, nullable = False)
    product_category_id = db.Column(db.Integer, db.ForeignKey("categories.category_id"))
    is_featured = db.Column(db.Boolean, default=False)
    is_available = db.Column(db.Boolean, default=False)
    seller_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)
    season = db.Column(db.Enum(Season), default=Season.OFF_SEASON)

    def get_price(self):
        if self.season == Season.PEAK_SEASON:
            return (self.price_per_unit * 1.1)
        else:
            return self.price_per_unit


class Cart(db.Model):
    __tablename__ = 'cart'    
    
    customer = db.Column(db.Integer, db.ForeignKey("user.id"), primary_key = True)
    carted_products = db.Column(db.Integer, db.ForeignKey("products.product_id"), primary_key = True)
    quantity = db.Column(db.Integer, default = 1, nullable = False)

class Order(db.Model):
    __tablename__ = "order"

    order_id = db.Column(db.Integer, primary_key = True)
    order_number = db.Column(db.String, nullable = False)
    order_customer_id = db.Column(db.Integer, nullable = False)
    order_category_id = db.Column(db.Integer, nullable = False)
    order_product_id = db.Column(db.Integer, nullable = False)
    order_quantity = db.Column(db.Integer, nullable=False)
    total_amount = db.Column(db.Double, nullable = False)
    order_date = db.Column(db.DateTime, nullable=False)
    shipping_address = db.Column(db.String(255), nullable=False)
    payment_method = db.Column(db.String(50), nullable=False)
    
