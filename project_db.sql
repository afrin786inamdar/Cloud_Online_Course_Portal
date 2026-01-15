Project Database

Create database db_Sunbeam_Online_Student_Portal;

Use db_Sunbeam_Online_Student_Portal;

Create table users (
     email varchar(50) primary key,
     password varchar(10),
     role enum(“Student”,”Admin”));

Create table students (
    reg_no int primary key,
    name varchar(10),
    email varchar(50),
    course_id int,
    mobile_no int,
    profile_pic blob,
    foreign key (course_id) references courses(course_id))

create table courses(
      course_id int primary key,
      course_name varchar(10),
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
   added_at date
   foreign key (course_id) references courses(course_id) ON DELETE CASCADE);

INSERT INTO users (email, password, role)
VALUES 
('rahul@gmail.com', 'rahul123', 'student'),
('admin@gmail.com', 'admin123', 'admin');

INSERT INTO courses (course_id, course_name, description, fees, start_date, end_date, video_expire_days)
VALUES
(101, 'MERN', 'Full Stack Web Dev', 25000, '2026-02-01', '2026-05-01', 90),
(102, 'Python', 'Core + Django', 20000, '2026-03-01', '2026-06-01', 60);

INSERT INTO students (reg_no, name, email, course_id, mobile_no, profile_pic)
VALUES
(1, 'Afrin', 'rahul@gmail.com', 101, 9876543210, NULL),
(2, 'Sara', 'sara@gmail.com', 102, 9988776655, NULL);

INSERT INTO videos (video_id, course_id, title, description, youtube_url, added_at)
VALUES
(1, 101, 'Intro to MERN', 'Course Overview', 'https://youtu.be/mern01', '2026-02-02'),
(2, 101, 'React Basics', 'Learn Components', 'https://youtu.be/mern02', '2026-02-03'),
(3, 102, 'Intro to Python', 'Getting Started', 'https://youtu.be/py01', '2026-03-02');
