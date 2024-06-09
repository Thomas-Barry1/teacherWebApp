CREATE DATABASE teacher_helper;

USE teacher_helper;

CREATE TABLE lesson_plans (
    id INT AUTO_INCREMENT PRIMARY KEY,
    topic VARCHAR(255) NOT NULL,
    grade_level VARCHAR(255) NOT NULL,
    duration INT NOT NULL,
    content TEXT NOT NULL
);

CREATE TABLE quizzes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    topic VARCHAR(255) NOT NULL,
    grade_level VARCHAR(255) NOT NULL,
    questions TEXT NOT NULL
);
