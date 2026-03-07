-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Mar 07, 2026 at 03:02 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `attendance_barcode_system`
--

-- --------------------------------------------------------

--
-- Table structure for table `admin_accounts`
--

CREATE TABLE `admin_accounts` (
  `admin_id` int(11) NOT NULL,
  `admin_name` varchar(255) NOT NULL,
  `admin_email` varchar(255) NOT NULL,
  `admin_password` varchar(255) NOT NULL,
  `date_account_created` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `admin_accounts`
--

INSERT INTO `admin_accounts` (`admin_id`, `admin_name`, `admin_email`, `admin_password`, `date_account_created`) VALUES
(1, 'Administrator', 'steven.agustin.ecoast@panpacificu.edu.ph', '$2b$10$d4kXfzxstDkpQPR5Gp8YZeove4F2/T5Ga/EaS8g7y9c4ddf9HITP6', '2026-02-09 00:02:44');

-- --------------------------------------------------------

--
-- Table structure for table `attendance_history_record`
--

CREATE TABLE `attendance_history_record` (
  `attendance_id` int(11) NOT NULL,
  `student_id_number` varchar(255) DEFAULT NULL,
  `student_middlename` varchar(255) DEFAULT NULL,
  `student_lastname` varchar(255) DEFAULT NULL,
  `student_firstname` varchar(255) DEFAULT NULL,
  `student_program` varchar(255) DEFAULT NULL,
  `attendance_time` time DEFAULT curtime(),
  `attendance_date` date DEFAULT curdate(),
  `year_level` varchar(255) DEFAULT NULL,
  `subject` varchar(255) DEFAULT NULL,
  `location_generated` varchar(255) DEFAULT NULL,
  `device_id` varchar(255) DEFAULT NULL,
  `student_id` int(11) DEFAULT NULL,
  `teacher_barcode_scanner_serial_number` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `attendance_history_record`
--

INSERT INTO `attendance_history_record` (`attendance_id`, `student_id_number`, `student_middlename`, `student_lastname`, `student_firstname`, `student_program`, `attendance_time`, `attendance_date`, `year_level`, `subject`, `location_generated`, `device_id`, `student_id`, `teacher_barcode_scanner_serial_number`) VALUES
(1, '1231374', 'A', 'Lachica', 'Andrea', 'BS in Information Technology', '01:45:34', '2026-02-02', '3rd Year', 'Big Data', NULL, NULL, 11, 'TSN17698767256291441'),
(2, '1231374', 'A', 'Lachica', 'Andrea', 'BS in Information Technology', '12:59:35', '2026-02-02', '3rd Year', 'Event-Driven Ecoast Day', NULL, NULL, 11, 'TSN17698767256291441'),
(3, '1231374', 'A', 'Lachica', 'Andrea', 'BS in Information Technology', '13:10:44', '2026-02-02', '3rd Year', 'Event-Driven Ecoast Day', NULL, NULL, 11, 'TSN17698767256291441'),
(4, '1231345', 'A', 'Dragneel', 'Natsu', 'BS in Information Technology', '13:41:02', '2026-02-02', '3rd Year', 'Event-Driven Ecoast Day', NULL, NULL, 13, 'TSN17698767256291441'),
(5, '1231345', 'A', 'Dragneel', 'Natsu', 'BS in Information Technology', '18:06:21', '2026-02-03', '3rd Year', 'Digital Marketing', NULL, NULL, 13, 'TSN17698767256291441'),
(6, '1231345', 'A', 'Dragneel', 'Natsu', 'BS in Information Technology', '18:30:51', '2026-02-04', '3rd Year', 'Digital Marketing', NULL, NULL, 13, 'TSN17698767256291441'),
(7, '1231333', 'A', 'Heartfilla', 'Lucy', 'BS in Information Technology', '20:54:04', '2026-02-09', '3rd Year', 'Digital Marketing', NULL, NULL, 16, 'TSN17698767256291441'),
(8, '1231333', 'A', 'Heartfilla', 'Lucy', 'BS in Information Technology', '15:51:34', '2026-03-02', '3rd Year', 'Big Data', NULL, NULL, 23, 'TSN17698767256291441'),
(9, '1231379', 'A', 'Selga', 'Charimea', 'BS in Information Technology', '01:02:37', '2026-03-07', '3rd Year', 'Big Data', NULL, NULL, 9, 'TSN17698767256291441'),
(10, '1231377', 'A', 'Dragneel', 'Natsu', 'BS in Computer Science', '01:05:32', '2026-03-07', '3rd Year', 'Programming', NULL, NULL, 12, 'TSN17698767256291441'),
(11, '1231374', 'A', 'Lachica', 'Andrea', 'BS in Information Technology', '01:10:41', '2026-03-07', '3rd Year', 'Programming', NULL, NULL, 7, 'TSN17698767256291441'),
(12, '1231371', 'A', 'Salvarion', 'Mayen', 'BS in Information Technology', '09:34:56', '2026-03-07', '3rd Year', 'Programming', NULL, NULL, 17, 'TSN17698767256291441'),
(13, '1231374', 'A', 'Lachica', 'Andrea', 'BS in Information Technology', '09:45:41', '2026-03-07', '3rd Year', 'Programming', NULL, NULL, 7, 'TSN17698767256291441'),
(14, '1231379', 'A', 'Castillo', 'Gabriel', 'BS in Information Technology', '10:06:52', '2026-03-07', '3rd Year', 'Programming', NULL, NULL, 18, 'TSN17698767256291441'),
(15, '1231371', 'A', 'Salvarion', 'Mayen', 'BS in Information Technology', '10:07:03', '2026-03-07', '3rd Year', 'Programming', NULL, NULL, 17, 'TSN17698767256291441'),
(16, '1231372', 'A', 'Agustin', 'Steven John', 'BS in Information Technology', '10:26:31', '2026-03-07', '3rd Year', 'Programming', NULL, NULL, 20, 'TSN17698767256291441'),
(17, '1231333', 'A', 'Heartfilla', 'Lucy', 'BS in Information Technology', '21:27:43', '2026-03-07', '3rd Year', 'Big Data', NULL, NULL, 16, 'TSN17698767256291441'),
(18, '1231374', 'A', 'Lachica', 'Andrea', 'BS in Information Technology', '21:31:19', '2026-03-07', '3rd Year', 'Big Data', NULL, NULL, 7, 'TSN17698767256291441'),
(19, '1231379', 'A', 'Selga', 'Charimea', 'BS in Information Technology', '21:31:22', '2026-03-07', '3rd Year', 'Big Data', NULL, NULL, 9, 'TSN17698767256291441'),
(20, '1231377', 'A', 'Dragneel', 'Natsu', 'BS in Computer Science', '21:31:26', '2026-03-07', '3rd Year', 'Big Data', NULL, NULL, 12, 'TSN17698767256291441'),
(21, '1231333', 'A', 'Heartfilla', 'Lucy', 'BS in Information Technology', '21:31:28', '2026-03-07', '3rd Year', 'Big Data', NULL, NULL, 16, 'TSN17698767256291441'),
(22, '1231371', 'A', 'Salvarion', 'Mayen', 'BS in Information Technology', '21:31:30', '2026-03-07', '3rd Year', 'Big Data', NULL, NULL, 17, 'TSN17698767256291441'),
(23, '1231372', 'A', 'Agustin', 'Steven John', 'BS in Information Technology', '21:38:58', '2026-03-07', '3rd Year', 'Big Data', NULL, NULL, 20, 'TSN17698767256291441'),
(24, '1231374', 'A', 'Lachica', 'Andrea', 'BS in Information Technology', '21:47:48', '2026-03-07', '3rd Year', 'Big Data', NULL, NULL, 7, 'TSN17698767256291441'),
(25, '1231379', 'A', 'Selga', 'Charimea', 'BS in Information Technology', '21:47:51', '2026-03-07', '3rd Year', 'Big Data', NULL, NULL, 9, 'TSN17698767256291441'),
(26, '1231377', 'A', 'Dragneel', 'Natsu', 'BS in Computer Science', '21:47:53', '2026-03-07', '3rd Year', 'Big Data', NULL, NULL, 12, 'TSN17698767256291441'),
(27, '1231333', 'A', 'Heartfilla', 'Lucy', 'BS in Information Technology', '21:47:55', '2026-03-07', '3rd Year', 'Big Data', NULL, NULL, 16, 'TSN17698767256291441'),
(28, '1231371', 'A', 'Salvarion', 'Mayen', 'BS in Information Technology', '21:47:57', '2026-03-07', '3rd Year', 'Big Data', NULL, NULL, 17, 'TSN17698767256291441'),
(29, '1231376', 'A', 'Castillo', 'Gabriel', 'BS in Information Technology', '21:47:59', '2026-03-07', '3rd Year', 'Big Data', NULL, NULL, 19, 'TSN17698767256291441'),
(30, '1231372', 'A', 'Agustin', 'Steven John', 'BS in Information Technology', '21:48:01', '2026-03-07', '3rd Year', 'Big Data', NULL, NULL, 20, 'TSN17698767256291441');

-- --------------------------------------------------------

--
-- Table structure for table `attendance_record`
--

CREATE TABLE `attendance_record` (
  `attendance_id` int(11) NOT NULL,
  `student_id_number` varchar(255) DEFAULT NULL,
  `student_middlename` varchar(255) DEFAULT NULL,
  `student_lastname` varchar(255) DEFAULT NULL,
  `student_firstname` varchar(255) DEFAULT NULL,
  `student_program` varchar(255) DEFAULT NULL,
  `attendance_time` time DEFAULT curtime(),
  `attendance_date` date DEFAULT curdate(),
  `year_level` varchar(255) DEFAULT NULL,
  `subject` varchar(255) DEFAULT NULL,
  `location_generated` varchar(255) DEFAULT NULL,
  `device_id` varchar(255) DEFAULT NULL,
  `student_id` int(11) DEFAULT NULL,
  `teacher_barcode_scanner_serial_number` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `attendance_record`
--

INSERT INTO `attendance_record` (`attendance_id`, `student_id_number`, `student_middlename`, `student_lastname`, `student_firstname`, `student_program`, `attendance_time`, `attendance_date`, `year_level`, `subject`, `location_generated`, `device_id`, `student_id`, `teacher_barcode_scanner_serial_number`) VALUES
(36, '1231374', 'A', 'Lachica', 'Andrea', 'BS in Information Technology', '21:47:48', '2026-03-07', '3rd Year', 'Big Data', NULL, NULL, 7, 'TSN17698767256291441'),
(37, '1231379', 'A', 'Selga', 'Charimea', 'BS in Information Technology', '21:47:51', '2026-03-07', '3rd Year', 'Big Data', NULL, NULL, 9, 'TSN17698767256291441'),
(38, '1231377', 'A', 'Dragneel', 'Natsu', 'BS in Computer Science', '21:47:53', '2026-03-07', '3rd Year', 'Big Data', NULL, NULL, 12, 'TSN17698767256291441'),
(39, '1231333', 'A', 'Heartfilla', 'Lucy', 'BS in Information Technology', '21:47:55', '2026-03-07', '3rd Year', 'Big Data', NULL, NULL, 16, 'TSN17698767256291441'),
(40, '1231371', 'A', 'Salvarion', 'Mayen', 'BS in Information Technology', '21:47:57', '2026-03-07', '3rd Year', 'Big Data', NULL, NULL, 17, 'TSN17698767256291441'),
(41, '1231376', 'A', 'Castillo', 'Gabriel', 'BS in Information Technology', '21:47:59', '2026-03-07', '3rd Year', 'Big Data', NULL, NULL, 19, 'TSN17698767256291441'),
(42, '1231372', 'A', 'Agustin', 'Steven John', 'BS in Information Technology', '21:48:01', '2026-03-07', '3rd Year', 'Big Data', NULL, NULL, 20, 'TSN17698767256291441');

-- --------------------------------------------------------

--
-- Table structure for table `event_attendance_history_record`
--

CREATE TABLE `event_attendance_history_record` (
  `event_id` int(11) NOT NULL,
  `student_id` int(11) NOT NULL,
  `student_name` varchar(255) DEFAULT NULL,
  `student_id_number` varchar(255) DEFAULT NULL,
  `student_program` varchar(255) DEFAULT NULL,
  `student_year_level` varchar(255) NOT NULL,
  `event_name` varchar(255) DEFAULT NULL,
  `guard_name` varchar(255) DEFAULT NULL,
  `guard_location` varchar(255) DEFAULT NULL,
  `time` time DEFAULT curtime(),
  `date` date DEFAULT curdate(),
  `status` varchar(255) DEFAULT NULL,
  `guard_id` int(11) NOT NULL,
  `admin_id` int(11) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `event_attendance_history_record`
--

INSERT INTO `event_attendance_history_record` (`event_id`, `student_id`, `student_name`, `student_id_number`, `student_program`, `student_year_level`, `event_name`, `guard_name`, `guard_location`, `time`, `date`, `status`, `guard_id`, `admin_id`) VALUES
(2, 13, 'Natsu A. Dragneel', '1231345', 'BS in Information Technology', '3rd Year', 'Christmas', 'Gray Fullbuster', 'main-gate', '11:25:58', '2026-02-10', 'TIME IN', 5, 1),
(3, 13, 'Natsu A. Dragneel', '1231345', 'BS in Information Technology', '3rd Year', 'Christmas', 'Gray Fullbuster', 'main-gate', '11:26:54', '2026-02-10', 'TIME OUT', 5, 1),
(4, 13, 'Natsu A. Dragneel', '1231345', 'BS in Information Technology', '3rd Year', 'Fun run', 'Gray Fullbuster', 'main-gate', '11:40:36', '2026-02-10', 'TIME IN', 5, 1),
(5, 13, 'Natsu A. Dragneel', '1231345', 'BS in Information Technology', '3rd Year', 'Fun run', 'Gray Fullbuster', 'main-gate', '11:40:55', '2026-02-10', 'TIME OUT', 5, 1),
(6, 18, 'Agrifina A. Agustin', '1233345', 'BS Education', '3rd Year', 'Fun run', 'Gray Fullbuster', 'main-gate', '19:13:30', '2026-02-12', 'TIME IN', 5, 1),
(7, 18, 'Agrifina A. Agustin', '1233345', 'BS Education', '3rd Year', 'Fun run', 'Gray Fullbuster', 'main-gate', '19:13:50', '2026-02-12', 'TIME OUT', 5, 1),
(8, 17, 'Andrea A. Lachica', '123', 'BS in Information Technology', '3rd Year', 'Fun run', 'Gray Fullbuster', 'main-gate', '19:23:22', '2026-02-12', 'TIME IN', 5, 1),
(9, 19, 'Charimea Mabalot. Selga', '1231422', 'BS in Information Technology', '3rd Year', 'Foundation day', 'Gray Fullbuster', 'main-gate', '19:34:12', '2026-02-12', 'TIME IN', 5, 1),
(10, 19, 'Charimea Mabalot. Selga', '1231422', 'BS in Information Technology', '3rd Year', 'Foundation day', 'Gray Fullbuster', 'main-gate', '19:37:57', '2026-02-12', 'TIME OUT', 5, 1),
(11, 22, 'Natsu S. Dragneel', '1231377', 'BS in Information Technology', '3rd Year', 'Foundation day', 'Gray Fullbuster', 'Main Gate', '10:55:38', '2026-03-07', 'TIME IN', 5, 1),
(12, 22, 'Natsu S. Dragneel', '1231377', 'BS in Information Technology', '3rd Year', 'Foundation day', 'Gray Fullbuster', 'Main Gate', '10:55:44', '2026-03-07', 'TIME OUT', 5, 1),
(13, 23, 'Lucy A. Heartfilla', '1231333', 'BS in Information Technology', '3rd Year', 'Foundation day', 'Gray Fullbuster', 'Main Gate', '12:31:25', '2026-03-07', 'TIME IN', 5, 1),
(14, 23, 'Lucy A. Heartfilla', '1231333', 'BS in Information Technology', '3rd Year', 'Foundation day', 'Gray Fullbuster', 'Main Gate', '12:32:01', '2026-03-07', 'TIME OUT', 5, 1),
(15, 23, 'Lucy A. Heartfilla', '1231333', 'BS in Information Technology', '3rd Year', 'Foundation day', 'Gray Fullbuster', 'Main Gate', '12:39:30', '2026-03-07', 'TIME IN', 5, 1),
(16, 23, 'Lucy A. Heartfilla', '1231333', 'BS in Information Technology', '3rd Year', 'Foundation day', 'Gray Fullbuster', 'Main Gate', '12:39:44', '2026-03-07', 'TIME OUT', 5, 1);

-- --------------------------------------------------------

--
-- Table structure for table `event_attendance_record`
--

CREATE TABLE `event_attendance_record` (
  `event_id` int(11) NOT NULL,
  `student_id` int(11) NOT NULL,
  `student_name` varchar(255) DEFAULT NULL,
  `student_id_number` varchar(255) DEFAULT NULL,
  `student_program` varchar(255) DEFAULT NULL,
  `student_year_level` varchar(255) NOT NULL,
  `event_name` varchar(255) DEFAULT NULL,
  `guard_name` varchar(255) DEFAULT NULL,
  `guard_location` varchar(255) DEFAULT NULL,
  `time` time DEFAULT curtime(),
  `date` date DEFAULT curdate(),
  `status` varchar(255) DEFAULT NULL,
  `guard_id` int(11) NOT NULL,
  `admin_id` int(11) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `event_attendance_record`
--

INSERT INTO `event_attendance_record` (`event_id`, `student_id`, `student_name`, `student_id_number`, `student_program`, `student_year_level`, `event_name`, `guard_name`, `guard_location`, `time`, `date`, `status`, `guard_id`, `admin_id`) VALUES
(15, 22, 'Natsu S. Dragneel', '1231377', 'BS in Information Technology', '3rd Year', 'Foundation day', 'Gray Fullbuster', 'Main Gate', '10:55:38', '2026-03-07', 'TIME IN', 5, 1),
(16, 22, 'Natsu S. Dragneel', '1231377', 'BS in Information Technology', '3rd Year', 'Foundation day', 'Gray Fullbuster', 'Main Gate', '10:55:44', '2026-03-07', 'TIME OUT', 5, 1),
(19, 23, 'Lucy A. Heartfilla', '1231333', 'BS in Information Technology', '3rd Year', 'Foundation day', 'Gray Fullbuster', 'Main Gate', '12:39:30', '2026-03-07', 'TIME IN', 5, 1),
(20, 23, 'Lucy A. Heartfilla', '1231333', 'BS in Information Technology', '3rd Year', 'Foundation day', 'Gray Fullbuster', 'Main Gate', '12:39:44', '2026-03-07', 'TIME OUT', 5, 1);

-- --------------------------------------------------------

--
-- Table structure for table `event_setter`
--

CREATE TABLE `event_setter` (
  `event_setter_id` int(11) NOT NULL,
  `event_name_set` varchar(255) NOT NULL,
  `event_date_created` datetime DEFAULT current_timestamp(),
  `admin_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `event_setter`
--

INSERT INTO `event_setter` (`event_setter_id`, `event_name_set`, `event_date_created`, `admin_id`) VALUES
(1, 'Foundation day', '2026-02-08 23:50:53', 1);

-- --------------------------------------------------------

--
-- Table structure for table `guards`
--

CREATE TABLE `guards` (
  `guard_id` int(11) NOT NULL,
  `guard_name` varchar(255) NOT NULL,
  `guard_email` varchar(255) NOT NULL,
  `guard_password` varchar(255) NOT NULL,
  `guard_designated_location` varchar(255) DEFAULT NULL,
  `admin_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `guards`
--

INSERT INTO `guards` (`guard_id`, `guard_name`, `guard_email`, `guard_password`, `guard_designated_location`, `admin_id`) VALUES
(5, 'Gray Fullbuster', 'gray@panpacificu.edu.ph', '$2b$10$NGqhdmtbZyNS91U8YY4Deu6/.9MO.i7qy.rHRQG68OXmqDoCj1w5e', 'Main Gate', 1),
(6, 'Metalman', 'metal@panpacificu.edu.ph', '$2b$10$1T70awsl2.pNGdvZflKI6.fBURIm1foeww1VA.HMojcCatgOvrPVi', 'Parking Area', 1),
(9, 'Kirito Kirigayaa', 'kirito@panpacificu.edu.ph', '$2b$10$.32vBAdFxi8CK.a8KDB8Hete8XiZ.KyJsWSDQ3DWdGXwDh4MtJlIu', 'Main Gate', 1);

-- --------------------------------------------------------

--
-- Table structure for table `program`
--

CREATE TABLE `program` (
  `program_id` int(11) NOT NULL,
  `program_name` varchar(200) NOT NULL,
  `program_date_created` datetime NOT NULL DEFAULT current_timestamp(),
  `teacher_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `program`
--

INSERT INTO `program` (`program_id`, `program_name`, `program_date_created`, `teacher_id`) VALUES
(1, 'BS in Information Technology', '2026-01-31 00:30:28', 7),
(2, 'BS in Computer Science', '2026-01-31 00:30:28', 7),
(6, 'BS Education', '2026-02-02 18:40:44', 7),
(13, 'BS in Criminology', '2026-02-08 20:59:23', 0),
(19, 'BS in Computer Engineering', '2026-02-19 00:33:54', 0),
(24, 'RPSEA', '2026-03-07 12:16:59', 0);

-- --------------------------------------------------------

--
-- Table structure for table `student_accounts`
--

CREATE TABLE `student_accounts` (
  `student_id` int(11) NOT NULL,
  `student_id_number` varchar(255) NOT NULL,
  `student_firstname` varchar(255) NOT NULL,
  `student_middlename` varchar(255) NOT NULL,
  `student_lastname` varchar(255) NOT NULL,
  `student_email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `student_year_level` varchar(255) NOT NULL,
  `student_guardian_number` varchar(255) NOT NULL,
  `student_program` varchar(255) NOT NULL,
  `location_generated` varchar(255) NOT NULL,
  `barcode` varchar(255) NOT NULL,
  `barcode_date_generated` datetime NOT NULL DEFAULT current_timestamp(),
  `device_id` varchar(255) NOT NULL,
  `admin_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `student_accounts`
--

INSERT INTO `student_accounts` (`student_id`, `student_id_number`, `student_firstname`, `student_middlename`, `student_lastname`, `student_email`, `password`, `student_year_level`, `student_guardian_number`, `student_program`, `location_generated`, `barcode`, `barcode_date_generated`, `device_id`, `admin_id`) VALUES
(17, '1234567', 'Andrea', 'A', 'Lachica', 'andrea@gmail.com', '$2b$10$vak/1WF451HjD7St6kgNbum3321Jz.ZCfOdFUbt2ZvmqgqtZDUfYS', '3rd Year', '+639192921611', 'BS in Information Technology', '', 'BC17708941329739487', '2026-02-12 19:02:12', 'DEV17708941329736948', 1),
(18, '1233345', 'Agrifina', 'A', 'Agaran', 'agrifina@panpacificu.edu.ph', '$2b$10$OuBrVjLjQIjpZ6DNU.rpROthB9qekSgTqujfjA0B/gsMIrH9WFaJG', '3rd Year', '+639481239328', 'BS Education', '', 'BC17708947181891836', '2026-02-12 19:11:58', 'DEV17708947181898475', 1),
(19, '1231422', 'Charimea', 'M', 'Selga', 'charimea.selga.ecoast@panpacificu.edu.ph', '$2b$10$.VzGuTyj7ZlUsdb/Vd5cUeDKBMqawDkcEZEUlKF9jug/E28aFC9/W', '3rd Year', '+639563543429', 'BS in Information Technology', '', 'BC17708952022486423', '2026-02-12 19:20:02', 'DEV17708952022489448', 1),
(22, '1231377', 'Natsu', 'S', 'Dragneel', 'natsu@panpacificu.edu.ph', '$2b$10$RN//Sz5amZ.Mc7.7PMnJIe2kuH5sPBzxe1lMCeF8Om1gO11KqAmxW', '3rd Year', '+639481239328', 'BS in Information Technology', '', 'BC17728133125295864', '2026-03-07 00:08:32', 'DEV17717813336788766', 0),
(23, '1231333', 'Lucy', 'A', 'Heartfilla', 'lucy@panpacificu.edu.ph', '$2b$10$617POruNNIa1m8LeMYdKS.9IjOgJqbMX.N1.wInPcKK6hYj26weHy', '3rd Year', '+639763891308', 'BS in Information Technology', '', 'BC17728137207651941', '2026-03-07 00:15:23', 'DEV17724373352405790', 0);

-- --------------------------------------------------------

--
-- Table structure for table `student_records_regular_class`
--

CREATE TABLE `student_records_regular_class` (
  `student_id` int(11) NOT NULL,
  `student_id_number` varchar(255) NOT NULL,
  `student_firstname` varchar(255) NOT NULL,
  `student_middlename` varchar(255) DEFAULT NULL,
  `student_lastname` varchar(255) NOT NULL,
  `student_email` varchar(255) DEFAULT NULL,
  `student_year_level` varchar(255) DEFAULT NULL,
  `student_guardian_number` varchar(255) DEFAULT NULL,
  `student_profile_picture` varchar(500) DEFAULT NULL,
  `student_program` varchar(255) DEFAULT NULL,
  `teacher_barcode_scanner_serial_number` varchar(255) DEFAULT NULL,
  `date_created` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `student_records_regular_class`
--

INSERT INTO `student_records_regular_class` (`student_id`, `student_id_number`, `student_firstname`, `student_middlename`, `student_lastname`, `student_email`, `student_year_level`, `student_guardian_number`, `student_profile_picture`, `student_program`, `teacher_barcode_scanner_serial_number`, `date_created`) VALUES
(7, '1231374', 'Andrea', 'A', 'Lachica', 'andrea@panpacificu.edu.ph', '3rd Year', '+639763891308', NULL, 'BS in Information Technology', 'TSN17698767256291441', '2026-02-01 14:26:20'),
(9, '1231379', 'Charimea', 'A', 'Selga', 'chari@panpacificu.edu.ph', '3rd Year', '09481239328', NULL, 'BS in Information Technology', 'TSN17698767256291441', '2026-02-01 17:31:09'),
(12, '1231377', 'Natsu', 'A', 'Dragneel', 'natsu@panpacificu.edu.ph', '3rd Year', '+639763891308', NULL, 'BS in Computer Science', 'TSN17698767256291441', '2026-02-02 13:40:43'),
(16, '1231333', 'Lucy', 'A', 'Heartfilla', 'lucy@panpacificu.edu.ph', '3rd Year', '+639763891308', NULL, 'BS in Information Technology', 'TSN17698767256291441', '2026-03-02 15:51:17'),
(17, '1231371', 'Mayen', 'A', 'Salvarion', 'mayen@panpacificu.edu.ph', '3rd Year', '+639763891308', NULL, 'BS in Information Technology', 'TSN17698767256291441', '2026-03-06 22:58:37'),
(19, '1231376', 'Gabriel', 'A', 'Castillo', 'gabriel@panpacificu.edu.ph', '3rd Year', '+639763891308', NULL, 'BS in Information Technology', 'TSN17698767256291441', '2026-03-07 10:06:42'),
(20, '1231372', 'Steven John', 'A', 'Agustin', 'steven@panpacificu.edu.ph', '3rd Year', '+639763891308', NULL, 'BS in Information Technology', 'TSN17698767256291441', '2026-03-07 10:24:07');

-- --------------------------------------------------------

--
-- Table structure for table `subject`
--

CREATE TABLE `subject` (
  `subject_id` int(11) NOT NULL,
  `subject_name` varchar(255) NOT NULL,
  `subject_date_created` datetime NOT NULL DEFAULT current_timestamp(),
  `teacher_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `subject`
--

INSERT INTO `subject` (`subject_id`, `subject_name`, `subject_date_created`, `teacher_id`) VALUES
(1, 'Big Data', '2026-02-02 16:33:05', 7),
(2, 'Programming', '2026-02-02 16:33:05', 7),
(3, 'Event-Driven Programming', '2026-02-02 20:36:23', 7),
(4, 'Integrative Programming', '2026-02-02 20:37:05', 7),
(5, 'Digital Marketing', '2026-02-02 20:37:47', 7),
(7, 'Programming Lec', '2026-02-23 01:39:46', 11);

-- --------------------------------------------------------

--
-- Table structure for table `subject_and_year_level_setter`
--

CREATE TABLE `subject_and_year_level_setter` (
  `id` int(11) NOT NULL,
  `subject_name_set` varchar(255) DEFAULT NULL,
  `year_level_set` varchar(255) DEFAULT NULL,
  `teacher_barcode_scanner_serial_number` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `subject_and_year_level_setter`
--

INSERT INTO `subject_and_year_level_setter` (`id`, `subject_name_set`, `year_level_set`, `teacher_barcode_scanner_serial_number`) VALUES
(2, 'Big Data', '3rd Year', 'TSN17698767256291441'),
(3, '', '', 'TSN17704826980131949'),
(4, '', '', 'TSN17704837387017092'),
(5, '', '', 'TSN17704837433987368'),
(6, 'Programming Lec', '3rd Year', 'TSN17713351187271590'),
(7, '', '', 'TSN17713353120404545'),
(8, '', '', 'TSN17713354408022460'),
(9, '', '', 'TSN17719208025622022'),
(10, '', '', 'TSN17719241460167887');

-- --------------------------------------------------------

--
-- Table structure for table `teacher`
--

CREATE TABLE `teacher` (
  `teacher_id` int(11) NOT NULL,
  `teacher_name` varchar(255) NOT NULL,
  `teacher_profile_picture` varchar(500) DEFAULT NULL,
  `teacher_email` varchar(255) NOT NULL,
  `teacher_password` varchar(255) NOT NULL,
  `teacher_program` varchar(255) DEFAULT NULL,
  `teacher_current_subject` varchar(255) DEFAULT NULL,
  `teacher_location` varchar(255) DEFAULT NULL,
  `teacher_location_radius` int(11) DEFAULT 50,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `teacher_barcode_scanner_serial_number` varchar(255) NOT NULL,
  `admin_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `teacher`
--

INSERT INTO `teacher` (`teacher_id`, `teacher_name`, `teacher_profile_picture`, `teacher_email`, `teacher_password`, `teacher_program`, `teacher_current_subject`, `teacher_location`, `teacher_location_radius`, `created_at`, `teacher_barcode_scanner_serial_number`, `admin_id`) VALUES
(7, 'Steven John A. Agustin', 'teacher-1772889464327-558770.jpg', 'steven.agustin.ecoast@panpacificu.edu.ph', '$2b$10$CHq/nRGb/wUL0HUAQp25teX6eHPTRIkLiUPhvaPKXpR/l7pLAKBPK', 'BS in Information Technology', NULL, '{\"latitude\":16.0425,\"longitude\":120.3407}', 50, '2026-01-31 16:25:25', 'TSN17698767256291441', 1),
(11, 'Bill Gates', NULL, 'bill@panpacificu.edu.ph', '$2b$10$3mjbRSABRIncKUWJOdc/XeWc7vMhQJbV77ORpCNHh//Wt3MsHePGu', 'BS in Information Technology', NULL, NULL, 50, '2026-02-17 13:31:58', 'TSN17713351187271590', 1),
(14, 'Elon Musk', NULL, 'elon@panpacificu.edu.ph', '$2b$10$cp3VaryKqBN8RbJNyHHXv.pRp4aciN2qx8J/HMYMcaxCsSMIC74ju', 'BS in Information Technology', NULL, NULL, 50, '2026-02-24 08:13:22', 'TSN17719208025622022', 1),
(15, 'Mark Zuckerberg', NULL, 'markzuckerberg@panpacificu.edu.ph', '$2b$10$EiyfjHfWwzvzt9KKgS9GfuNbQ4/Z290hQ7fj8m/As.BMSXXLSJsAC', 'BS in Information Technology', NULL, NULL, 50, '2026-02-24 09:09:06', 'TSN17719241460167887', 1);

-- --------------------------------------------------------

--
-- Table structure for table `year_level`
--

CREATE TABLE `year_level` (
  `year_level_id` int(11) NOT NULL,
  `year_level_name` varchar(255) NOT NULL,
  `year_level_created` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `year_level`
--

INSERT INTO `year_level` (`year_level_id`, `year_level_name`, `year_level_created`) VALUES
(1, '1st Year', '2026-02-02 18:48:13'),
(2, '2nd Year', '2026-02-02 18:48:13'),
(3, '3rd Year', '2026-02-02 18:48:45'),
(4, '4th Year', '2026-02-02 18:48:45'),
(8, 'Sample Year For Debugging', '2026-03-07 12:48:36');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admin_accounts`
--
ALTER TABLE `admin_accounts`
  ADD PRIMARY KEY (`admin_id`);

--
-- Indexes for table `attendance_history_record`
--
ALTER TABLE `attendance_history_record`
  ADD PRIMARY KEY (`attendance_id`);

--
-- Indexes for table `attendance_record`
--
ALTER TABLE `attendance_record`
  ADD PRIMARY KEY (`attendance_id`);

--
-- Indexes for table `event_attendance_history_record`
--
ALTER TABLE `event_attendance_history_record`
  ADD PRIMARY KEY (`event_id`);

--
-- Indexes for table `event_attendance_record`
--
ALTER TABLE `event_attendance_record`
  ADD PRIMARY KEY (`event_id`);

--
-- Indexes for table `event_setter`
--
ALTER TABLE `event_setter`
  ADD PRIMARY KEY (`event_setter_id`);

--
-- Indexes for table `guards`
--
ALTER TABLE `guards`
  ADD PRIMARY KEY (`guard_id`),
  ADD UNIQUE KEY `guard_email` (`guard_email`);

--
-- Indexes for table `program`
--
ALTER TABLE `program`
  ADD PRIMARY KEY (`program_id`);

--
-- Indexes for table `student_accounts`
--
ALTER TABLE `student_accounts`
  ADD PRIMARY KEY (`student_id`);

--
-- Indexes for table `student_records_regular_class`
--
ALTER TABLE `student_records_regular_class`
  ADD PRIMARY KEY (`student_id`),
  ADD UNIQUE KEY `student_email` (`student_email`);

--
-- Indexes for table `subject`
--
ALTER TABLE `subject`
  ADD PRIMARY KEY (`subject_id`);

--
-- Indexes for table `subject_and_year_level_setter`
--
ALTER TABLE `subject_and_year_level_setter`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `teacher`
--
ALTER TABLE `teacher`
  ADD PRIMARY KEY (`teacher_id`);

--
-- Indexes for table `year_level`
--
ALTER TABLE `year_level`
  ADD PRIMARY KEY (`year_level_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admin_accounts`
--
ALTER TABLE `admin_accounts`
  MODIFY `admin_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `attendance_history_record`
--
ALTER TABLE `attendance_history_record`
  MODIFY `attendance_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;

--
-- AUTO_INCREMENT for table `attendance_record`
--
ALTER TABLE `attendance_record`
  MODIFY `attendance_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=43;

--
-- AUTO_INCREMENT for table `event_attendance_history_record`
--
ALTER TABLE `event_attendance_history_record`
  MODIFY `event_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `event_attendance_record`
--
ALTER TABLE `event_attendance_record`
  MODIFY `event_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `event_setter`
--
ALTER TABLE `event_setter`
  MODIFY `event_setter_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `guards`
--
ALTER TABLE `guards`
  MODIFY `guard_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `program`
--
ALTER TABLE `program`
  MODIFY `program_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT for table `student_accounts`
--
ALTER TABLE `student_accounts`
  MODIFY `student_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT for table `student_records_regular_class`
--
ALTER TABLE `student_records_regular_class`
  MODIFY `student_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `subject`
--
ALTER TABLE `subject`
  MODIFY `subject_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT for table `subject_and_year_level_setter`
--
ALTER TABLE `subject_and_year_level_setter`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `teacher`
--
ALTER TABLE `teacher`
  MODIFY `teacher_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `year_level`
--
ALTER TABLE `year_level`
  MODIFY `year_level_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
