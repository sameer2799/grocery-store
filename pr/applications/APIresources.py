from flask_restful import Resource, Api, reqparse, fields, marshal
from flask_security import auth_required, roles_required, current_user, roles_accepted
from .models import *
from datetime import datetime
from .instances import cache

api = Api(prefix = '/api')


#-------------------------------------------------------------
#-----------------------Approve Seller------------------------
#-------------------------------------------------------------
seller_parser = reqparse.RequestParser()
seller_parser.add_argument('id', type=int, location='json', required=True)

class ApproveSeller(Resource):
    @auth_required("token")
    @roles_required("admin")
    def post(self):
        args = seller_parser.parse_args()
        seller_id = args['id']
        
        seller = User.query.get(seller_id)
        if not seller or "seller" not in seller.roles:
            return {"message": "Seller not found"}, 404

        if seller.active:
            return {"info": "Seller already approved"}

        seller.active = True
        db.session.commit()
        return {"info": "Seller Approved"}

api.add_resource(ApproveSeller, '/approve/seller')

#-------------------------------------------------------------
#-----------------------Approve Category----------------------
#-------------------------------------------------------------
category_parser = reqparse.RequestParser()
category_parser.add_argument('category_id', type=int, location='json', required=True)

class ApproveCategory(Resource):
    @auth_required("token")
    @roles_required("admin")
    def post(self):
        args = category_parser.parse_args()
        category_id = args['category_id']
        
        category = Categories.query.get(category_id)
        if not category:
            return {"message": "Category not found"}, 404

        if category.is_approved:
            return {"info": "Category already approved"}

        category.is_approved = True
        db.session.commit()
        return {"info": "Category Approved"}

api.add_resource(ApproveCategory, '/approve/category')

#-------------------------------------------------------------
#-----------------------Category APIs-------------------------
#-------------------------------------------------------------
# -----------Argument Parser-----------------

parser = reqparse.RequestParser()
parser.add_argument('id', location = 'json' , type=int, help='Id of Category')
parser.add_argument('name', type=str, help='Name of Category')
parser.add_argument('description', type=str, help='Description of Category')

# -----------Return Parser-----------------

category_format = {
    'category_id': fields.Integer,
    'category_name': fields.String,
    'description': fields.String,
    'is_approved': fields.Boolean,
}

class Category(Resource):
    @auth_required("token")
    @cache.cached(timeout=50)
    def get(self):
        all_category = Categories.query.all()
        if not all_category:
            return {"info":"No Category Found"}, 404
        if 'seller' in current_user.roles:
            all_category = Categories.query.filter_by(is_approved = True).all()
            return marshal(all_category, category_format), 200
        return marshal(all_category, category_format), 200

    @auth_required("token")
    @roles_required("seller")
    def post(self):
        cache.clear()
        args = parser.parse_args()
        name = args['name']
        description = args['description']
        if not name and not description:
            return {"message": "Category name, description is required"}, 400
        existing_category = Categories.query.filter_by(category_name = name).first()
        if existing_category:
            return {"message": "Category already exists"}, 400
        
        obj = Categories(category_name = name, description = description)
        db.session.add(obj)
        db.session.commit()

        return {"info": "Request submitted, please wait for admin approval! "}, 200
    

    @auth_required("token")
    @roles_required("admin")
    def delete(self):
        cache.clear()
        args = parser.parse_args()
        id = args['id']
        category = Categories.query.get(id)
        if not category:
            return {"message": "Category not found"}, 404

        db.session.query(Categories).filter_by(category_id = id).delete(synchronize_session="fetch")
        db.session.commit()
        return {"info": "Category deleted"}

    @auth_required("token")
    @roles_required("admin")
    def put(self):
        cache.clear()
        args = parser.parse_args()
        id = args['id']
        name = args['name']
        description = args['description']

        category = Categories.query.get(id)
        if not category:
            return {"message": "Category not found"}, 404

        if name:
            category.category_name = name
        if description:
            category.category_description = description

        db.session.commit()
        return {"info": "Category updated"}


api.add_resource(Category, '/category')

#-------------------------------------------------------------
#-----------------------Products APIs-------------------------
#-------------------------------------------------------------

product_parser = reqparse.RequestParser()
product_parser.add_argument('product_id', type=int, help='Id of Product')
product_parser.add_argument('product_name', type=str, help='Name of Product')
product_parser.add_argument('units', type=str, help='Units of Product quantity')
product_parser.add_argument('price_per_unit', type=float, help='Price per unit of Product',)
product_parser.add_argument('stock', type=int, help='Product stock')
product_parser.add_argument('expiry_date', type=str, help='Product expiry date')
product_parser.add_argument('description', type=str, help='Description of Product')
product_parser.add_argument('product_category_id', type=int, help='Category Id of Product')


class CategoryName(fields.Raw):
    def format(self, value):
        category = Categories.query.get(value)
        return category.category_name

class SellerName(fields.Raw):
    def format(self, value):
        seller = User.query.get(value)
        return seller.username

product_format = {
    'product_id': fields.Integer,
    'product_name': fields.String,
    'description': fields.String,
    'price_per_unit': fields.Float,
    'stock': fields.Integer,
    'expiry_date': fields.String,
    'units': fields.String,
    'product_category_id': CategoryName,
    'is_featured': fields.Boolean,
    'is_available': fields.Boolean,
    'seller_id': SellerName,
}

class Product(Resource):
    @auth_required("token")
    @cache.cached(timeout=50)
    def get(self):
        
        if 'seller' in current_user.roles:
            all_product = Products.query.filter_by(seller_id = current_user.id).all()
            if not all_product:
                return {"message":"Add some Products in a few steps!"}, 404
            return marshal(all_product, product_format), 200
        
        if 'buyer' in current_user.roles:
            all_product = Products.query.filter_by(is_available = True).all()
            if not all_product:
                return {"message":"No Products Found"}, 404
            return marshal(all_product, product_format), 200
        
        all_product = Products.query.all()
        if not all_product:
            return {"message":"No Product Found"}, 404
        
        return marshal(all_product, product_format), 200

    @auth_required("token")
    @roles_required("seller")
    def post(self):
        cache.clear()
        args = product_parser.parse_args()
        if not args['product_name'] or not args['units'] or not args['price_per_unit'] or not args['stock'] or not args['expiry_date'] or not args['description'] or not args['product_category_id']:
            return {"message": "Product name, unit, price per unit, stock, expiry date, product's category id and description are required"}, 400
        
        args['expiry_date'] = datetime.strptime(args['expiry_date'], "%Y-%m-%d")
        if args['expiry_date'] < datetime.now():
            return {"message": "Expired product cannot be listed!"}, 400
        existing_product = Products.query.filter_by(product_name = args['product_name'], seller_id = current_user.id).first()
        if existing_product:
            return {"message": "Product already exists"}, 400
        product = Products(**args, seller_id = current_user.id)
        db.session.add(product)
        db.session.commit()
        return {"info": "Product added"}, 200

    @auth_required("token")
    @roles_accepted('admin', 'seller')
    def delete(self):
        cache.clear()
        args = product_parser.parse_args()
        id = args['product_id']
        if not id:
            return {"message": "Product id is required"}, 400
        
        if 'seller' in current_user.roles:
            product = Products.query.get(id)
            if (not product) or (product.seller_id != current_user.id):
                return {"message": "Product not found"}, 404
        
        if 'admin' in current_user.roles:
            product = Products.query.get(id)
            if not product:
                return {"message": "Product not found"}, 404

        db.session.query(Products).filter_by(product_id = id).delete(synchronize_session="fetch")
        db.session.commit()
        return {"info": "Product deleted"}

    @auth_required("token")
    @roles_required("seller")
    def put(self):
        cache.clear()
        args = product_parser.parse_args()
        id = args['product_id']

        if not id:
            return {"message": "Product id is required"}, 400

        product = Products.query.get(id)
        if (not product) or (product.seller_id != current_user.id):
            return {"message": "Product not found"}, 404

        if args['product_name'] or args['expiry_date'] or args['product_category_id'] or args['price_per_unit'] or args['stock'] or args['description'] or args['units']:
            prod = Products.query.get(id)

            if args['product_name']:
                prod.product_name = args['product_name']
            
            if args['expiry_date']:
                args['expiry_date'] = datetime.strptime(args['expiry_date'], "%Y-%m-%d")
                if args['expiry_date'] < datetime.now():
                    return {"message": "Expired product cannot be listed!"}, 400
                prod.expiry_date = args['expiry_date']
            
            if args['product_category_id']:
                category = Categories.query.get(args['product_category_id'])
                if not category:
                    return {"message": "Category not found"}, 404
                if not category.is_approved:
                    return {"message": "Category not approved yet"}, 400
                
                prod.product_category_id = args['product_category_id']
                
            if args['price_per_unit']:
                prod.price_per_unit = args['price_per_unit']
                
            if args['stock']:
                prod.stock = args['stock']
                
            if args['description']:
                prod.description = args['description']
                
            if args['units']:
                prod.units = args['units']
            
            prod.is_available = False
            db.session.commit()
            return {"info": "Product updated"}

        if not args:
            return {"message": "No data provided"}, 400
        


api.add_resource(Product, '/product')



#----------------------Publish Product-----------------------
publish_parser = reqparse.RequestParser()
publish_parser.add_argument('product_id', type=int, help='Id of Product')

class PublishProduct(Resource):
    @auth_required("token")
    @roles_required("seller")
    def post(self):
        cache.clear()
        args = publish_parser.parse_args()
        id = args['product_id']
        if not id:
            return {"message": "Product id is required"}, 400
        product = Products.query.get(id)
        if (not product) or (product.seller_id != current_user.id):
            return {"message": "Product not found"}, 404

        product.is_available = True
        db.session.commit()
        return {"info": "Product published"}

api.add_resource(PublishProduct, '/publish/product')


#--------------------------------------------------------
#-----------------------Home Page------------------------
#--------------------------------------------------------

class HomePage(Resource):
    @cache.cached(timeout=50)
    def get(self):
        products = Products.query.filter_by(is_available = True).all()
        if not products:
            return {"message": "No products found"}, 404
        return marshal(products, product_format), 200

api.add_resource(HomePage, '/unlog')


#--------------------------------------------------------
#-----------------------All Users------------------------
#--------------------------------------------------------

user_fields = {
    'id': fields.Integer,
    'username': fields.String,
    'email': fields.String,
    'active': fields.Boolean,
    'role': fields.String,
}


class UserList(Resource):
    @auth_required("token")
    @roles_required("admin")
    @cache.cached(timeout=50)
    def get(self):
        users = User.query.all()
        
        if len(users) == 1:
            return {"message": "No User Found"}, 404
        
        for user in users:            
            user.role = user.roles[0].name.title()
        
        return marshal(users, user_fields), 200

api.add_resource(UserList, '/user-list')



#--------------------------------------------------------
#-----------------------Add to Cart----------------------
#--------------------------------------------------------

add_to_cart_parser = reqparse.RequestParser()
add_to_cart_parser.add_argument('product_id', type=int, help='Id of Product')

cart_fields = {
    'cart_id': fields.Integer,
    'customer': fields.Integer,
    'carted_products': fields.Integer,
    'quantity': fields.Integer,
}

class CartList(Resource):
    @auth_required("token")
    @roles_required("buyer")
    @cache.cached(timeout=50)
    def get(self):
        cart = Cart.query.filter_by(customer = current_user.id).all()
        if not cart:
            return {"message": "Cart is empty"}, 404
        
        return marshal(cart, cart_fields), 200

    @auth_required("token")
    @roles_required("buyer")
    def delete(self):
        cache.clear()
        args = add_to_cart_parser.parse_args()
        id = args['product_id']
        if not id:
            return {"message": "Product id is required"}, 400
        product = Cart.query.filter_by(customer = current_user.id, carted_products = id).first()
        if (not product) or (product.customer != current_user.id):
            return {"message": "Product not found"}, 404

        db.session.query(Cart).filter_by(carted_products = id).delete(synchronize_session="fetch")
        db.session.commit()
        return {"info": "Product deleted"}

api.add_resource(CartList, '/cart')

#--------------------------------------------------------
#-----------------------Order----------------------------
#--------------------------------------------------------

order_parser = reqparse.RequestParser()
order_parser.add_argument('total', type=str, help='Total Bill of Customer')
order_parser.add_argument('address', type=str, help='Address of Customer')
order_parser.add_argument('pay_method', type=str, help='Payment option of Customer')

order_fields = {
    'order_id': fields.Integer,
    'order_customer_id': fields.Integer,
    'order_category_id': fields.Integer,
    'order_product_id': fields.Integer,
    'order_quantity': fields.Integer,
    'total_amount': fields.Integer,
    'order_date': fields.String,
    'shipping_address': fields.String,
    'payment_method': fields.String,

}

class OrderList(Resource):
    @auth_required("token")
    @roles_required("buyer")
    def post(self):
        args = order_parser.parse_args()
        total = args['total']
        address = args['address']
        pay_method = args['pay_method']

        if not total and not address and not pay_method:
            return {"message": "All fields are required"}, 400

        prods = Cart.query.filter_by(customer = current_user.id).all()
        if not prods:
            return {"message": "Cart is empty"}, 404
        
        o_num = str(datetime.now().strftime("%Y%m%d%H%M%S"))
        for prod in prods:
            product = Products.query.get(prod.carted_products)
            if not product:
                return {"message": f"{product.product_name} not found"}, 404
            if product.stock < prod.quantity:
                return {"message": f"{product.product_name} out of stock"}, 400
            
            order = Order(order_number = o_num, order_customer_id = current_user.id, order_category_id = product.product_category_id, order_product_id = product.product_id, order_quantity = prod.quantity, total_amount = total, order_date = datetime.now(), shipping_address = address, payment_method = pay_method)
            db.session.add(order)    
            product.stock -= prod.quantity
            db.session.commit()

        db.session.query(Cart).filter_by(customer = current_user.id).delete(synchronize_session="fetch")
        db.session.commit()
        return {"info": "Order placed successfully. Thank you for shopping with us!"}, 200


    @auth_required("token")
    @roles_required("seller")
    def get(self):

        p = Products.query.filter_by(seller_id = current_user.id).all()
                
        order = Order.query.filter_by(order_product_id = p.product_id).all()
        if not order:
            return {"message": "No Order Found"}, 404
        return marshal(order, order_fields), 200
        

api.add_resource(OrderList, '/order')

#--------------------------------------------------------
#-----------------------Search---------------------------
#--------------------------------------------------------

p_search_fields = {
    'product_name': fields.String,
    'price_per_unit': fields.Float,
    'expiry_date': fields.String,
    'description': fields.String,
}
c_search_fields = {
    'category_name': fields.String,
    'description': fields.String,
}

class Search(Resource):
    @cache.memoize(timeout=30)
    def get(self, searchKey):
        if not searchKey:
            return {"message": "Search key is required"}, 400
        
        categories = Categories.query.filter(Categories.category_name.ilike(f"%{searchKey}%")).all()
        categories.extend(Categories.query.filter(Categories.description.ilike(f"%{searchKey}%")).all())
        products = Products.query.filter(Products.product_name.ilike(f"%{searchKey}%")).all()
        products.extend(Products.query.filter(Products.description.ilike(f"%{searchKey}%")).all())
        products.extend(Products.query.filter(Products.price_per_unit.ilike(f"%{searchKey}%")).all())
        products.extend(Products.query.filter(Products.expiry_date.ilike(f"%{searchKey}%")).all())
        
        if not products and not categories:
            return {"message": "No products found"}, 404
        
        response = {
            'categories': marshal(categories, c_search_fields),
            'products': marshal(products, p_search_fields),
        }

        return response, 200


api.add_resource(Search, '/search/<string:searchKey>')
