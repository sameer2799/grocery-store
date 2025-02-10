from flask import Flask, jsonify, request, send_file
from flask_security import Security
from applications.mailService import send_message, send_report
from applications.security import datastore
from applications.models import Products, Role, User, db, Cart
from config import DevelopementConfig, ProdConfig
from applications.APIresources import api
from applications.worker import celery_init_app
import flask_excel as excel
from celery.result import AsyncResult
from celery.schedules import crontab
from applications.instances import cache
from datetime import datetime, timedelta
import applications.gen_report as gen_report
from sqlalchemy.orm import contains_eager

from werkzeug.security import generate_password_hash

def create_app():
    app = Flask(__name__, template_folder="templates")
    app.config.from_object(ProdConfig)
    db.init_app(app)
    api.init_app(app)
    excel.init_excel(app)
    cache.init_app(app)
    app.security = Security(app, datastore)

    with app.app_context():
        import applications.controllers

        db.create_all()
        datastore.find_or_create_role(name = 'admin', description = 'There can be only one Admin!')
        datastore.find_or_create_role(name = 'seller', description = 'Sellers need approval from Admin!')
        datastore.find_or_create_role(name = 'buyer', description = 'There can be many buyers!')
        db.session.commit()
        if not datastore.find_user(email = "admin@email.com"):
            datastore.create_user(email = "admin@email.com", password = generate_password_hash("password", method='pbkdf2:sha256', salt_length=16), roles = ["admin"])
        db.session.commit()
        
    return app

app = create_app()
celery_app = celery_init_app(app)



#-----------------------Celery Tasks-------------------------------

@celery_app.task(ignore_result=False)
def generate_csv_task(seller_id):
    
    products = Products.query.filter_by(seller_id=seller_id).all()

    for p in products:
        p.product_category_id = p.category.category_name

    columns = ["product_id", "product_name", "units",  "price_per_unit", "stock", "expiry_date", "description", "product_category_id", "is_featured", "is_available", "seller_id", "season"]

    if products is None:
        return None
    
    csv_output = excel.make_response_from_query_sets(products, columns, "csv", file_name="products")
    filename = "products.csv"

    with open(filename, "wb") as f:
        f.write(csv_output.data)

    return filename

@celery_app.task(ignore_result=True)
def daily_reminder(message):
    
    cart = Cart.query.all()
    user_ids = list(set([c.customer for c in cart]))
    users = User.query.filter(User.id.in_(user_ids)).all()

    to = [user.email for user in users if user.last_login_at == datetime.now() - timedelta(days=1)]
    
    for email in to:
        send_message(email, 'Daily Reminder', message)
    
    return "Daily Reminder Email Sent"

@celery_app.task(ignore_result=False)
def monthly_report():
    users = db.session.query(User).join(User.roles).filter(Role.name == 'buyer').options(contains_eager(User.roles)).all()
    
    gen_report.generate_report()
    
    for user in users:
        file_path = f'templates/report_for_{user.id}.pdf'
        send_report(user.email, 'Your Monthly Shopping Report', file_path)
    
    return "Monthly Report Email Sent"



#------------------------------------------------------------
#--------------------- Celery -------------------------------
#-----------------System Triggered---------------------------
    

@celery_app.on_after_configure.connect
def setup_periodic_tasks(sender, **kwargs):
    sender.add_periodic_task(
        crontab(hour=18, minute=0, day_of_week='*'),
        daily_reminder.s("Hello, products in your cart are waiting for you!"),
        name="send email every day"
    )
    sender.add_periodic_task(
        crontab(0, 0, day_of_month='1', month_of_year='*'),
        monthly_report.s(),
        name="send monthly report"
    )



#------------------------------------------------------------
#----------------------- Celery -----------------------------
#--------------------User Triggered--------------------------


@app.post('/products/download')
def download_csv():
    seller_id = request.get_json().get("id")
    products = Products.query.filter_by(seller_id=seller_id).all()
    t = generate_csv_task.apply_async((seller_id,))
    
    if len(products) == 0:
        return jsonify({"message": "No data found"}), 404
    if t is None:
        return jsonify({"message": "No data found"}), 404

    return jsonify({"task_id": t.id})


@app.get('/get-csv/<task_id>')
def get_csv(task_id):
    task = AsyncResult(task_id, app=celery_app)

    if task.ready():
        filename = task.result
        return send_file(filename, as_attachment=True)
    else:
        return jsonify({"message": "Task Pending"}), 404






#------------------------Main Driver Code----------------------------

#if __name__ == '__main__':
    # import initial_data
    #app.run()
