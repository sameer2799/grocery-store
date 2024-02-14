# Grocery Store

An online grocery store project that allows users to browse and purchase groceries from the comfort of their homes. The project provides a user-friendly interface for customers to search for products, add them to their cart, and proceed to checkout. It also includes features such as user authentication, exporting data, daily reminders and monthly reports. The project aims to simplify the grocery shopping experience and provide a convenient solution for users to fulfill their grocery needs online.

## Table of Contents

- [Features](#features)
- [Getting Started](#getting-started)
- [Technologies Used](#technologies-used)

## Features

- Admin, Store Manager and User login
- Category Request and Approval
- Product Management and CSV Download for store managers
- Buy/Cart products from one or multiple categories for users
- Daily Reminders, Monthly reports for users
- Search for Category/Product
- Single Responsive UI
- Add to Desktop Feature

## Getting Started

### 1. Prerequisites

- Python
- Redis
- Celery
- Pango (pango1.0-tools)
- MailHog

>**Note:** All other requirements are listed in tech stack and can be installed by following below listed steps.

### 2. Installing the dependencies

Installing the dependencies.
The below command will install all the required dependencies which are listed in the file named **requirements.txt**.

```python
pip install -r requirements.txt
```

### 3. Starting the Redis Server

Start the redis server using the command:

```bash
redis-server
```

### 4. Run the app

```python
python main.py
```

### 5. Starting celery worker and celery beat

Start the celery worker by using the below command:

```bash
celery -A main:celery_app worker -l info
```

Then start celery beat using:

```bash
celery -A main:celery_app beat -l info
```

Voila! The app is running.

## Technologies Used

- Python, Javascript
- Flask framework
- VueJS
- SQLite database
- Redis database
- Celery
- RESTful (Flask-RESTful API extension)
- Flask-SQLAlchemy (ORM)

### *Thank you*
