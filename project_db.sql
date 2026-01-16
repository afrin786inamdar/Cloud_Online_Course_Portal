Project Database

Create database db_Sunbeam_Online_Student_Portal;

Use db_Sunbeam_Online_Student_Portal;

Create table users (
     email varchar(50) primary key,
     password varchar(10),
     role enum(“Student”,”Admin”));

Create table students (
    reg_no int auto_increment primary key ,
    name varchar(10),
    email varchar(50),
    course_id int,
    mobile_no int,
    profile_pic blob,
    foreign key (course_id) references courses(course_id))

create table courses(
      course_id int primary key,
      course_name varchar(10) not null,
      description varchar(50),
      fees int, 
      start_date date,
      end_date  date,
      video_expire_days int);



create table videos(
   video_id int primary key,
   course_id int,
   title varchar(20),
   description varchar(40),
   youtube_url varchar(40),
   added_at date ,
   foreign key (course_id) references courses(course_id) ON DELETE CASCADE);
