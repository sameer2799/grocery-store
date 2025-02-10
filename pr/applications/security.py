from flask_security import Security, SQLAlchemyUserDatastore
from applications.models import db, User, Role

datastore = SQLAlchemyUserDatastore(db, User, Role)