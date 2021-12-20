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


def get_profiles(event, engine):
    user_name = event['user_name']
    Session = sessionmaker(bind=engine)
    session = Session()
    result = []
    profiles = []
    
    if user_name == "":
        # return all profiles
        profiles = session.query(Profile).all()
    else:
        # filter on user_name
        profiles = session.query(Profile).filter(Profile.user_name == user_name)

    for profile in profiles:
        dict = {
            "id": profile.id,
            "first_name": profile.first_name,
            "last_name": profile.last_name,
            "email": profile.email,
            "school": profile.school,
            "degree": profile.degree,
            "year_in_school": profile.year_in_school,
            "department": profile.department,
            "major": profile.major,
            "available_date": profile.available_date,
            "user_name": profile.user_name,
        }
        result.append(dict)

    session.commit()
    
    return result


def lambda_handler(event, context):

    Base.metadata.create_all(engine)
    profiles = get_profiles(event, engine)

    return {
        'statusCode': 200,
        'body': json.dumps(profiles)
    }