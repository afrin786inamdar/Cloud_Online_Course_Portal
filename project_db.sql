

Create database db_Sunbeam_Online_Student_Portal;

Use db_Sunbeam_Online_Student_Portal;

Create table if not exists users (
     email varchar(50) not null unique,
     password varchar(10),
     role enum('Student','Admin') default 'Students');

create table if not exists courses(
      course_id int  auto_increment primary key,
      course_name varchar(10) not null,
      description varchar(50) not null,
      fees int, 
      start_date date,
      end_date  date,
      video_expire_days int);

Create table if not exists students (
    reg_no int auto_increment primary key ,
    name varchar(10) not null,
    email varchar(50) not null,
    course_id int,
    mobile_no varchar(10),
    profile_pic blob,
    foreign key (email) references users(email),
    foreign key (course_id) references courses(course_id))


create table if not exists videos(
   video_id int auto_increment primary key,
   course_id int,
   title varchar(20) not null,
   description varchar(100) not null,
   youtube_url varchar(255) not null,
   added_at datetime default current_timestamp ,
   foreign key (course_id) references courses(course_id) ON DELETE CASCADE);
