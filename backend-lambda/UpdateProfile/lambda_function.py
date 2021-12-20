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


def update_profile(event, engine):
    
   
    profile_id = event['id']
    if profile_id == "":
        raise Exception("Bad Request: Invalid input parameters")
    attrs = event['body']
    
    Session = sessionmaker(bind=engine)
    session = Session()
    profile = session.query(Profile).get(profile_id)
    
    if profile is None:
        raise Exception("Profile: " + profile_id + " does not exist!")
    
    try:
        
        if 'first_name' in attrs:
            profile.first_name = attrs['first_name']
        if 'last_name' in attrs:
            profile.last_name = attrs['last_name']
        if 'email' in attrs:
            profile.email = attrs['email']
        if 'school' in attrs:
            profile.school = attrs['school']
        if 'degree' in attrs:
            profile.degree = attrs['degree']
        if 'year_in_school' in attrs:
            profile.year_in_school = attrs['year_in_school']
        if 'department' in attrs:
            profile.department = attrs['department']
        if 'major' in attrs:
            profile.major = attrs['major']
        if 'available_date' in attrs:
            profile.available_date = attrs['available_date']
    
        session.commit()
    
    except Exception:
        raise Exception("Bad Request: Invalid input parameters")
    
    return "update success"


def lambda_handler(event, context):

    Base.metadata.create_all(engine)
    msg = update_profile(event, engine)

    return {
        'statusCode': 200,
        'body': msg
    }


