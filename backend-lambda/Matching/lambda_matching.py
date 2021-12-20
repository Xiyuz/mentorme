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

class ProfileNotFoundError(Exception):
    pass

def __repr__(self):
    return "<Profile(id='%s', user_name='%s')>" % (self.id, self.user_name)


def match_mentors(event, engine):
    Session = sessionmaker(bind=engine, autocommit=True)
    session = Session()
    profile_id = event["id"]
    current_profile = session.query(Profile).get(profile_id)
    if current_profile is None:
        raise ProfileNotFoundError("Profile is not found.")
    school_name = current_profile.school
    available_date = current_profile.available_date
    match_profile_by_school = session.query(Profile).filter_by(school=school_name).all()
    all_match_profiles = []
    if len(available_date) > 0:
        profile_available_date = available_date.split(',')
        for p in match_profile_by_school:
            p_available_date = p.available_date.split(",")
            p_id = p.id
            if len(set(p_available_date) & set(profile_available_date)) > 0:
                all_match_profiles.append(p)
    
    for p in all_match_profiles:
        if str(p.id) == profile_id:
            all_match_profiles.remove(p)
    profile_display = [profile_view(p) for p in all_match_profiles]   
    return ({'suggested_profiles': profile_display})


def profile_view(profile):
        return {
            "id": profile.id,
            "full_name": profile.first_name + ' ' + profile.last_name,
            "email": profile.email,
            "school": profile.school,
            "major": profile.major
        }


def lambda_handler(event, context):

    Base.metadata.create_all(engine)
    try:
        msg = match_mentors(event, engine)
    except ProfileNotFoundError:
        return {
            'statusCode': 404,
            'body': 'Profile does not exist.'
        }
    return {
        'statusCode': 200,
        'body': json.dumps(msg)
    }