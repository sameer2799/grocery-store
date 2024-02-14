from applications.models import db, User, Role, Order, Products, Categories
from sqlalchemy.orm import contains_eager
from jinja2 import Template
from weasyprint import HTML
import matplotlib.pyplot as plt
import datetime

def get_order_data(user_id):
    
    current_date = datetime.date.today()

    
    last_month_end = datetime.date(current_date.year, current_date.month, 1) - datetime.timedelta(days=1)
    last_month_start = datetime.date(last_month_end.year, last_month_end.month, 1)
    
    orders = Order.query.filter(Order.order_date.between(last_month_start, last_month_end), Order.order_customer_id == user_id).all()

    if orders is None:
        return "No orders found"
    unique_orders = list(set([o.order_number for o in orders]))
    total_orders = len(unique_orders)
    amnts = []
    for num in unique_orders:
        amnts.append(Order.query.filter_by(order_number=num).first().total_amount)

    total_amount = sum(amnts)

    total_products = {}
    for o in orders:
        p_name = Products.query.filter_by(product_id=o.order_product_id).first().product_name
        if p_name in total_products:
            total_products[p_name] += o.order_quantity
        else:
            total_products[p_name] = o.order_quantity

    total_products_in_category = {}
    for o in orders:
        c_name = Categories.query.filter_by(category_id=o.order_category_id).first().category_name
        if c_name in total_products_in_category:
            total_products_in_category[c_name] += o.order_quantity
        else:
            total_products_in_category[c_name] = o.order_quantity

    return {
        "total_orders": total_orders,
        "total_amount": total_amount,
        "total_products": total_products,
        "total_products_in_category": total_products_in_category
    }

def generate_report():
    
    users = db.session.query(User).join(User.roles).filter(Role.name == 'buyer').options(contains_eager(User.roles)).all()
    user_ids = [u.id for u in users]
    user_dict = {}
    
    p = Products.query.all()
    if p == []:
        return "No Products!"
    for user_id in user_ids:
        d = get_order_data(user_id)
        if d != "No orders found":
            user_dict[user_id] = d
    
    user_info = [(u.id, u.username, u.email) for u in users]

    for user_id in user_dict:
        user = User.query.get(user_id)
        user_info = [user.id, user.username, user.email]
        user_data = user_dict[user_id]

        # Bar chart
        plt.bar(user_data["total_products"].keys(), user_data["total_products"].values())
        plt.xlabel("Product")
        plt.ylabel("Quantity")
        plt.savefig(f"templates/ReportData/barChart_for_{user.id}.png")
        plt.close()

        # Pie chart
        plt.pie(user_data["total_products_in_category"].values(), labels=user_data["total_products_in_category"].keys())
        plt.savefig(f"templates/ReportData/pieChart_for_{user.id}.png")
        plt.close()

        # Report Html
        with open(f"templates/report_for_{user_id}.html", "w") as f:
            template = Template(open("templates/report.html").read())
            f.write(template.render(user_info=user_info, user_data=user_data))

        HTML(f"templates/report_for_{user_id}.html").write_pdf(f"templates/report_for_{user_id}.pdf")
    return "Done"
