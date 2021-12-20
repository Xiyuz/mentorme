import json
import rds_config
import sys
import pymysql
from sqlalchemy import *
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, String
from sqlalchemy.orm import sessionmaker

name = rds_config.db_username
password = rds_config.db_password
db_name = rds_config.db_name
rds_host = rds_config.db_host

Base = declarative_base()
engine = create_engine("mysql+pymysql://{}:{}@{}/{}".format(name, password, rds_host, db_name), echo=True)


class Profile(Base):
    __tablename__ = 'profile'
    id = Column(Integer, primary_key=True, autoincrement=True)
    first_name = Column(String(50))
    last_name = Column(String(50))
    email = Column(String(50))
    school = Column(String(50))
    degree = Column(String(40))
    year_in_school = Column(String(10))
    department = Column(String(10))
    major = Column(String(10))
    available_date = Column(String(100))
    user_name = Column(String(50))


def __repr__(self):
    return "<Profile(id='%s', user_name='%s')>" % (self.id, self.user_name)


def create_profile(event, engine):
    new_profile = Profile(
        first_name=event["first_name"],
        last_name=event["last_name"],
        email=event["email"],
        school=event["school"],
        degree=event["degree"],
        year_in_school=event["year_in_school"],
        department=event["department"],
        major=event["major"],
        available_date=event["available_date"],
        user_name=event["user_name"],
    )

    Session = sessionmaker(bind=engine)
    session = Session()
    session.add(new_profile)
    session.commit()

    return "create success"


def lambda_handler(event, context):
    # return "test"

    Base.metadata.create_all(engine)

    msg = create_profile(event, engine)

    return {
        'statusCode': 200,
        'body': msg
    }