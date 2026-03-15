-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Mar 15, 2026 at 04:57 PM
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
  `admin_profile_picture` varchar(500) DEFAULT NULL,
  `admin_password` varchar(255) NOT NULL,
  `date_account_created` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `admin_accounts`
--

INSERT INTO `admin_accounts` (`admin_id`, `admin_name`, `admin_email`, `admin_profile_picture`, `admin_password`, `date_account_created`) VALUES
(1, 'CSS Administrator', 'admin@panpacificu.edu.ph', 'admin-1773474482355-324628.png', '$2b$10$d4kXfzxstDkpQPR5Gp8YZeove4F2/T5Ga/EaS8g7y9c4ddf9HITP6', '2026-02-09 00:02:44');

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
(30, '1231372', 'A', 'Agustin', 'Steven John', 'BS in Information Technology', '21:48:01', '2026-03-07', '3rd Year', 'Big Data', NULL, NULL, 20, 'TSN17698767256291441'),
(31, '1231374', 'A', 'Lachica', 'Andrea', 'BS in Information Technology', '22:59:56', '2026-03-07', '3rd Year', 'Big Data', NULL, NULL, 7, 'TSN17698767256291441'),
(32, '1231377', 'A', 'Dragneel', 'Natsu', 'BS in Computer Science', '23:00:07', '2026-03-07', '3rd Year', 'Big Data', NULL, NULL, 12, 'TSN17698767256291441'),
(33, '1231333', 'A', 'Heartfilla', 'Lucy', 'BS in Information Technology', '23:00:11', '2026-03-07', '3rd Year', 'Big Data', NULL, NULL, 16, 'TSN17698767256291441'),
(34, '1231371', 'A', 'Salvarion', 'Mayen', 'BS in Information Technology', '23:00:14', '2026-03-07', '3rd Year', 'Big Data', NULL, NULL, 17, 'TSN17698767256291441'),
(35, '1231376', 'A', 'Castillo', 'Gabriel', 'BS in Information Technology', '23:00:16', '2026-03-07', '3rd Year', 'Big Data', NULL, NULL, 19, 'TSN17698767256291441'),
(36, '1231333', 'A', 'Heartfilla', 'Lucy', 'BS in Information Technology', '09:45:14', '2026-03-10', '3rd Year', 'Big Data', NULL, NULL, 23, 'TSN17698767256291441'),
(37, '1231333', 'A', 'Heartfilla', 'Lucy', 'BS in Information Technology', '12:53:39', '2026-03-11', '3rd Year', 'Integrative Programming', NULL, NULL, 23, 'TSN17698767256291441'),
(38, '1231333', 'A', 'Heartfilla', 'Lucy', 'BS in Information Technology', '14:15:17', '2026-03-11', '3rd Year', 'Integrative Programming', NULL, NULL, 23, 'TSN17698767256291441'),
(39, '1231377', 'A', 'Dragneel', 'Natsu', 'BS in Computer Science', '14:14:30', '2026-03-12', '3rd Year', 'Programming', NULL, NULL, 12, 'TSN17698767256291441'),
(40, '1231374', 'A', 'Lachica', 'Andrea', 'BS in Information Technology', '14:14:34', '2026-03-12', '3rd Year', 'Programming', NULL, NULL, 7, 'TSN17698767256291441'),
(41, '123123', 'M.', 'Toka', 'Luna', 'BS in Criminology', '14:17:44', '2026-03-12', '2nd Year', 'Programming', NULL, NULL, 24, 'TSN17698767256291441'),
(42, '1777227272', 'S', 'Zuckerberg', 'Mark', 'BS in Computer Engineering', '14:33:08', '2026-03-12', '4th Year', 'Digital Marketing', NULL, NULL, 34, 'TSN17698767256291441'),
(43, '1777227272', 'S', 'Zuckerberg', 'Mark', 'BS in Computer Engineering', '14:34:00', '2026-03-12', '4th Year', 'Digital Marketing', NULL, NULL, 34, 'TSN17698767256291441'),
(44, '1777227272', 'S', 'Zuckerberg', 'Mark', 'BS in Computer Engineering', '14:37:11', '2026-03-12', '4th Year', 'Digital Marketing', NULL, NULL, 34, 'TSN17698767256291441'),
(45, '1231333', 'A', 'Heartfilla', 'Lucy', 'BS in Information Technology', '23:40:00', '2026-03-12', '3rd Year', 'Event-Driven Programming', NULL, NULL, 23, 'TSN17698767256291441'),
(46, '1231333', 'A', 'Heartfilla', 'Lucy', 'BS in Information Technology', '00:38:08', '2026-03-13', '3rd Year', 'Big Data', NULL, NULL, 23, 'TSN17698767256291441'),
(47, '1231370', 'A', 'Agustin (CoAST)', 'Steven John', 'BS in Information Technology', '00:45:39', '2026-03-13', '3rd Year', 'Big Data', NULL, NULL, 31, 'TSN17698767256291441'),
(48, '1231231231231', 'A', 'Dragneel', 'Natsu', 'BS in Information Technology', '00:46:09', '2026-03-13', '3rd Year', 'Big Data', NULL, NULL, 28, 'TSN17698767256291441'),
(49, '12313598', 'O', 'Obillo (ECoAST)', 'Princess', 'BS in Information Technology', '00:46:12', '2026-03-13', '3rd Year', 'Big Data', NULL, NULL, 27, 'TSN17698767256291441'),
(50, '1231574', 'L', 'Magbitang', 'Alexander', 'BS in Information Technology', '00:46:20', '2026-03-13', '3rd Year', 'Big Data', NULL, NULL, 23, 'TSN17698767256291441'),
(51, '321', 'E', 'Lachica', 'Andrea', 'BS in Information Technology', '00:46:24', '2026-03-13', '3rd Year', 'Big Data', NULL, NULL, 22, 'TSN17698767256291441'),
(52, '1231426', 'M', 'Selga', 'Charimea', 'BS in Information Technology', '00:46:27', '2026-03-13', '3rd Year', 'Big Data', NULL, NULL, 21, 'TSN17698767256291441'),
(53, '1231376', 'A', 'Castillo', 'Gabriel', 'BS in Information Technology', '00:46:38', '2026-03-13', '3rd Year', 'Big Data', NULL, NULL, 19, 'TSN17698767256291441'),
(54, '1231371', 'A', 'Salvarion', 'Mayen', 'BS in Information Technology', '00:46:41', '2026-03-13', '3rd Year', 'Big Data', NULL, NULL, 17, 'TSN17698767256291441'),
(55, '1231333', 'A', 'Heartfilla', 'Lucy', 'BS in Information Technology', '12:28:17', '2026-03-14', '3rd Year', 'Big Data', NULL, NULL, 23, 'TSN17698767256291441'),
(56, '1231333', 'A', 'Heartfilla', 'Lucy', 'BS in Information Technology', '16:21:31', '2026-03-14', '3rd Year', 'Programming', NULL, NULL, 23, 'TSN17698767256291441'),
(57, '1231574', 'L', 'Magbitang', 'Alexander', 'BS in Information Technology', '16:30:42', '2026-03-14', '3rd Year', 'Programming', NULL, NULL, 23, 'TSN17698767256291441'),
(58, '14567', 'A', 'Chua', 'Diane', 'RPSEA', '17:03:46', '2026-03-14', '3rd Year', 'Programming', NULL, NULL, 42, 'TSN17698767256291441'),
(59, '12313598', 'O', 'Obillo (ECoAST)', 'Princess', 'BS in Information Technology', '17:04:14', '2026-03-14', '3rd Year', 'Programming', NULL, NULL, 27, 'TSN17698767256291441'),
(60, '1231333', 'A', 'Heartfilla', 'Lucy', 'BS in Information Technology', '17:17:50', '2026-03-14', '3rd Year', 'Event-Driven Programming', NULL, NULL, 23, 'TSN17698767256291441'),
(61, '1231231231231', 'A', 'Dragneel', 'Natsu', 'BS in Information Technology', '21:08:10', '2026-03-14', '3rd Year', 'Programming', NULL, NULL, 28, 'TSN17698767256291441'),
(62, '12313598', 'O', 'Obillo (ECoAST)', 'Princess', 'BS in Information Technology', '21:38:04', '2026-03-14', '3rd Year', 'Programming', NULL, NULL, 27, 'TSN17698767256291441'),
(63, '1231426', 'M', 'Selga', 'Charimea', 'BS in Information Technology', '23:16:39', '2026-03-15', '3rd Year', 'Programming', NULL, NULL, 21, 'TSN17698767256291441'),
(64, '1231574', 'L', 'Magbitang', 'Alexander', 'BS in Information Technology', '23:16:41', '2026-03-15', '3rd Year', 'Programming', NULL, NULL, 23, 'TSN17698767256291441'),
(65, '12313598', 'O', 'Obillo (ECoAST)', 'Princess', 'BS in Information Technology', '23:16:43', '2026-03-15', '3rd Year', 'Programming', NULL, NULL, 27, 'TSN17698767256291441'),
(66, '1231231231231', 'A', 'Dragneel', 'Natsu', 'BS in Information Technology', '23:16:45', '2026-03-15', '3rd Year', 'Programming', NULL, NULL, 28, 'TSN17698767256291441'),
(67, '12312313787', 'A', 'Agustin (CoAST)', 'Steven John', 'BS in Information Technology', '23:16:47', '2026-03-15', '3rd Year', 'Programming', NULL, NULL, 33, 'TSN17698767256291441'),
(68, '14567', 'A', 'Chua', 'Diane', 'RPSEA', '23:16:49', '2026-03-15', '3rd Year', 'Programming', NULL, NULL, 42, 'TSN17698767256291441'),
(69, '1231333', 'A', 'Heartfilla', 'Lucy', 'BS in Information Technology', '23:16:54', '2026-03-15', '3rd Year', 'Programming', NULL, NULL, 45, 'TSN17698767256291441'),
(70, '123123123', 'M', 'Cabote (ECoAST)', 'Angel Mageri', 'BS in Information Technology', '23:16:57', '2026-03-15', '3rd Year', 'Programming', NULL, NULL, 46, 'TSN17698767256291441');

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
(75, '1231426', 'M', 'Selga', 'Charimea', 'BS in Information Technology', '23:16:39', '2026-03-15', '3rd Year', 'Programming', NULL, NULL, 21, 'TSN17698767256291441'),
(76, '1231574', 'L', 'Magbitang', 'Alexander', 'BS in Information Technology', '23:16:41', '2026-03-15', '3rd Year', 'Programming', NULL, NULL, 23, 'TSN17698767256291441'),
(77, '12313598', 'O', 'Obillo (ECoAST)', 'Princess', 'BS in Information Technology', '23:16:43', '2026-03-15', '3rd Year', 'Programming', NULL, NULL, 27, 'TSN17698767256291441'),
(78, '1231231231231', 'A', 'Dragneel', 'Natsu', 'BS in Information Technology', '23:16:45', '2026-03-15', '3rd Year', 'Programming', NULL, NULL, 28, 'TSN17698767256291441'),
(79, '12312313787', 'A', 'Agustin (CoAST)', 'Steven John', 'BS in Information Technology', '23:16:47', '2026-03-15', '3rd Year', 'Programming', NULL, NULL, 33, 'TSN17698767256291441'),
(80, '14567', 'A', 'Chua', 'Diane', 'RPSEA', '23:16:49', '2026-03-15', '3rd Year', 'Programming', NULL, NULL, 42, 'TSN17698767256291441'),
(81, '1231333', 'A', 'Heartfilla', 'Lucy', 'BS in Information Technology', '23:16:54', '2026-03-15', '3rd Year', 'Programming', NULL, NULL, 45, 'TSN17698767256291441'),
(82, '123123123', 'M', 'Cabote (ECoAST)', 'Angel Mageri', 'BS in Information Technology', '23:16:57', '2026-03-15', '3rd Year', 'Programming', NULL, NULL, 46, 'TSN17698767256291441');

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
(16, 23, 'Lucy A. Heartfilla', '1231333', 'BS in Information Technology', '3rd Year', 'Foundation day', 'Gray Fullbuster', 'Main Gate', '12:39:44', '2026-03-07', 'TIME OUT', 5, 1),
(17, 26, 'Luna M.. Toka', '123123', 'BS in Criminology', '2nd Year', 'Foundation day', 'Gray Fullbuster', 'Main Gate', '11:20:47', '2026-03-09', 'TIME IN', 5, 1),
(18, 27, 'David C. Tan', '567', 'RPSEA', '2nd Year', 'Foundation day', 'Gray Fullbuster', 'Main Gate', '11:20:53', '2026-03-09', 'TIME IN', 5, 1),
(19, 26, 'Luna M.. Toka', '123123', 'BS in Criminology', '2nd Year', 'Foundation day', 'Gray Fullbuster', 'Main Gate', '11:21:06', '2026-03-09', 'TIME OUT', 5, 1),
(20, 27, 'David C. Tan', '567', 'RPSEA', '2nd Year', 'Foundation day', 'Gray Fullbuster', 'Main Gate', '11:21:09', '2026-03-09', 'TIME OUT', 5, 1),
(21, 29, 'Alexander Lambino. Magbitang', '1231574', 'BS in Information Technology', '3rd Year', 'Sample', 'Gray Fullbuster', 'Main Gate', '14:23:56', '2026-03-11', 'TIME IN', 5, 1),
(22, 23, 'Lucy A. Heartfilla', '1231333', 'BS in Information Technology', '3rd Year', 'Foundation day', 'Gray Fullbuster', 'Main Gate', '11:40:53', '2026-03-12', 'TIME IN', 5, 1),
(23, 34, 'Mark S. Zuckerberg', '1777227272', 'BS in Computer Engineering', '4th Year', 'Foundation day', 'Gray Fullbuster', 'Main Gate', '14:35:13', '2026-03-12', 'TIME IN', 5, 1),
(24, 34, 'Mark S. Zuckerberg', '1777227272', 'BS in Computer Engineering', '4th Year', 'Foundation day', 'Gray Fullbuster', 'Main Gate', '14:35:22', '2026-03-12', 'TIME OUT', 5, 1),
(25, 36, 'Steven John A. Agustin (CoAST)', '1231370', 'BS in Information Technology', '3rd Year', 'Foundation day', 'Gray Fullbuster', 'Main Gate', '23:41:36', '2026-03-12', 'TIME IN', 5, 1),
(26, 36, 'Steven John A. Agustin (CoAST)', '1231370', 'BS in Information Technology', '3rd Year', 'Foundation day', 'Gray Fullbuster', 'Main Gate', '23:41:53', '2026-03-12', 'TIME OUT', 5, 1),
(27, 36, 'Steven John A. Agustin (CoAST)', '1231370', 'BS in Information Technology', '3rd Year', 'Foundation day', 'Gray Fullbuster', 'Main Gate', '00:39:24', '2026-03-13', 'TIME IN', 5, 1),
(28, 36, 'Steven John A. Agustin (CoAST)', '1231370', 'BS in Information Technology', '3rd Year', 'Foundation day', 'Gray Fullbuster', 'Main Gate', '01:02:19', '2026-03-13', 'TIME OUT', 5, 1),
(29, 39, 'Steven John John Agustin. Agustin (CoAST)', '12312313787', 'BS in Information Technology', '3rd Year', 'Fun run', 'Gray Fullbuster', 'Main Gate', '11:55:00', '2026-03-14', 'TIME IN', 5, 1),
(30, 39, 'Steven John John Agustin. Agustin (CoAST)', '12312313787', 'BS in Information Technology', '3rd Year', 'Fun run', 'Gray Fullbuster', 'Main Gate', '11:55:05', '2026-03-14', 'TIME OUT', 5, 1),
(31, 23, 'Lucy A. Heartfilla', '1231333', 'BS in Information Technology', '3rd Year', 'Fun run', 'Chari Segla (Guard)', 'Main Gate', '13:08:12', '2026-03-14', 'TIME IN', 10, 1),
(32, 40, 'Steven John John. Agustin', '12313123123343', 'BS Education', '3rd Year', 'Fun run', 'Chari Segla (Guard)', 'Main Gate', '13:13:05', '2026-03-14', 'TIME IN', 10, 1),
(33, 41, 'Angel Mageri M. Cabote (ECoAST)', '123123123', 'BS in Information Technology', '3rd Year', 'Ecoast Day', 'Gray Fullbuster', 'Main Gate', '15:04:41', '2026-03-14', 'TIME IN', 5, 1),
(34, 41, 'Angel Mageri M. Cabote (ECoAST)', '123123123', 'BS in Information Technology', '3rd Year', 'Ecoast Day', 'Gray Fullbuster', 'Main Gate', '15:04:50', '2026-03-14', 'TIME OUT', 5, 1),
(35, 41, 'Angel Mageri M. Cabote (ECoAST)', '123123123', 'BS in Information Technology', '3rd Year', 'Kick off', 'Gray Fullbuster', 'Main Gate', '16:46:35', '2026-03-14', 'TIME IN', 5, 1),
(36, 41, 'Angel Mageri M. Cabote (ECoAST)', '123123123', 'BS in Information Technology', '3rd Year', 'Kick off', 'Gray Fullbuster', 'Main Gate', '16:47:05', '2026-03-14', 'TIME OUT', 5, 1);

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
(1, 'Kick off', '2026-02-08 23:50:53', 1);

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
(9, 'Kirito Kirigayaa', 'kirito@panpacificu.edu.ph', '$2b$10$.32vBAdFxi8CK.a8KDB8Hete8XiZ.KyJsWSDQ3DWdGXwDh4MtJlIu', 'Main Gate', 1),
(10, 'Chari Segla (Guard)', 'chari@guard.panpacificu.edu.ph', '$2b$10$A4U6PKfPr0b9eqH3KmOhM.HXsh.Ek.schyFyVNPsw0vyCm/PsmZg.', 'Main Gate', 1);

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
(18, '1233345', 'Agrifina', 'A', 'Agaran', 'agrifina@panpacificu.edu.ph', '$2b$10$OuBrVjLjQIjpZ6DNU.rpROthB9qekSgTqujfjA0B/gsMIrH9WFaJG', '3rd Year', '+639481239328', 'BS Education', '', 'BC17708947181891836', '2026-02-12 19:11:58', 'DEV17708947181898475', 1),
(19, '1231422', 'Charimea', 'M', 'Selga', 'charimea.selga.ecoast@panpacificu.edu.ph', '$2b$10$.VzGuTyj7ZlUsdb/Vd5cUeDKBMqawDkcEZEUlKF9jug/E28aFC9/W', '3rd Year', '+639563543429', 'BS in Information Technology', '', 'BC17708952022486423', '2026-02-12 19:20:02', 'DEV17708952022489448', 1),
(22, '1231377', 'Natsu', 'S', 'Dragneel', 'natsu@panpacificu.edu.ph', '$2b$10$RN//Sz5amZ.Mc7.7PMnJIe2kuH5sPBzxe1lMCeF8Om1gO11KqAmxW', '3rd Year', '+639481239328', 'BS in Information Technology', '', 'BC17728133125295864', '2026-03-07 00:08:32', 'DEV17717813336788766', 0),
(23, '1231333', 'Lucy', 'A', 'Heartfilla', 'lucy@panpacificu.edu.ph', '$2b$10$617POruNNIa1m8LeMYdKS.9IjOgJqbMX.N1.wInPcKK6hYj26weHy', '3rd Year', '+639763891308', 'BS in Information Technology', '', 'BC17734586362015429', '2026-03-14 11:23:57', 'DEV17724373352405790', 0),
(25, '14567', 'Diane', 'A', 'Chua', 'dwynna@gmail.com', '$2b$10$haEoY2zIw3gGj0k4wHFHKOIoXTJu2soBKV1/T1tICPwSy5CPd9Ceu', '3rd Year', '+639195364085', 'RPSEA', '', 'BC17728938112284412', '2026-03-07 22:30:11', 'DEV17728938112288581', 0),
(26, '123123', 'Luna', 'M', 'Toka', 'lunatoka@gmail.com', '$2b$10$5s.sqyEQozw1ukpJCFToSuFsmPmhTvxjspj9koWCt/tmP8ORg7wFC', '2nd Year', '+639455415405', 'BS in Criminology', '', 'BC17730263477958911', '2026-03-09 11:19:07', 'DEV17730263477952164', 0),
(28, '456', 'Andria', 'A', 'Ramirez', 'andria@gmail.com', '$2b$10$sO26fMQvVakQtiCy4Zoal.Yn09ulCejCe61giWID5iWnna/nuCs0K', '1st Year', '+639615842358', 'BS Education', '', 'BC17731513173571253', '2026-03-10 22:01:57', 'DEV17731513173573442', 0),
(29, '1231574', 'Alexander', 'L', 'Magbitang', 'alexander.magbitang.ecoast@panpacificu.edu.ph', '$2b$10$sz2Q0ajsshSDGiQOkeWv0.NrqzTMDw5DxxPO7qJRgVkXDu0zAYNVW', '3rd Year', '+639455964091', 'BS in Information Technology', '', 'BC17732101025598406', '2026-03-11 14:21:42', 'DEV17732101025594536', 0),
(32, '12313598', 'Princess', 'O', 'Obillo (ECoAST)', 'princess.obillo.ecoast@panpacificu.edu.ph', '$2b$10$OJRhAThkJPVmRtZKwn3TgumarOGVk/t16kx3llQsT2hn/xSknESa.', '3rd Year', '+639763891308', 'BS in Information Technology', '', 'BC17732896532762650', '2026-03-12 12:27:33', 'DEV17732896532765869', 0),
(33, '12312312312', 'Marfel Gem', 'A', 'Gallarde (ECoAST)', 'marfel.gallarde.ecoast@panpacificu.edu.ph', '$2b$10$tKtaOIS4wk/b8R9x/bw9Fee6fVO54mEl2S9jjzGtsOKFMwlRGBJPO', '4th Year', '+639763891308', 'BS in Computer Engineering', '', 'BC17732910277928988', '2026-03-12 12:50:27', 'DEV17732910277926704', 0),
(35, '1231231231231', 'Natsu', 'A', 'Dragneel', 'xnatsu25@gmail.com', '$2b$10$z2EKEoHbu6d0TBxeh2BgnezZJCcTCB.6mSjVoYM9nakkmUaeUFMK2', '3rd Year', '+63639763891308', 'BS in Information Technology', '', 'BC17733091976498062', '2026-03-12 17:53:17', 'DEV17733091976487706', 0),
(39, '12312313787', 'Steven John', 'A', 'Agustin (CoAST)', 'steven.agustin.ecoast@panpacificu.edu.ph', '$2b$10$FOtDA0mtyD/lYAPU26LsO.sKWqdM3UVaiYidCISLTRvFU8.OkBIme', '3rd Year', '+639763891308', 'BS in Information Technology', '', 'BC17734223249694153', '2026-03-14 01:18:44', 'DEV17734223249698924', 0),
(41, '123123123', 'Angel Mageri', 'M', 'Cabote (ECoAST)', 'angel.cabote.ecoast@panpacificu.edu.ph', '$2b$10$FUo8ACmR2EdY44cNkkLNvuPknzBlR/EnpRy3nWZ2T2Ou5r1GlVlGe', '3rd Year', '+639763891307', 'BS in Information Technology', '', 'BC17734718397722686', '2026-03-14 15:03:59', 'DEV17734718397725112', 0);

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
(21, '1231426', 'Charimea', 'M', 'Selga', 'charimea.selga.ecoast@panpacificu.edu.ph', '3rd Year', '+639481239328', NULL, 'BS in Information Technology', 'TSN17698767256291441', '2026-03-07 22:32:58'),
(23, '1231574', 'Alexander', 'L', 'Magbitang', 'alexander.magbitang.ecoast@panpacificu.edu.ph', '3rd Year', '09455964091', NULL, 'BS in Information Technology', 'TSN17698767256291441', '2026-03-11 14:26:51'),
(27, '12313598', 'Princess', 'O', 'Obillo (ECoAST)', 'princess.obillo.ecoast@panpacificu.edu.ph', '3rd Year', '+639763891308', NULL, 'BS in Information Technology', 'TSN17698767256291441', '2026-03-12 15:31:57'),
(28, '1231231231231', 'Natsu', 'A', 'Dragneel', 'xnatsu25@gmail.com', '3rd Year', '+63639763891308', NULL, 'BS in Information Technology', 'TSN17698767256291441', '2026-03-12 17:56:50'),
(33, '12312313787', 'Steven John', 'A', 'Agustin (CoAST)', 'steven.agustin.ecoast@panpacificu.edu.ph', '3rd Year', '+639763891308', NULL, 'BS in Information Technology', 'TSN17698767256291441', '2026-03-14 01:22:52'),
(34, '1231333', 'Lucy', 'A', 'Heartfilla', 'lucy@panpacificu.edu.ph', '3rd Year', '+639763891308', NULL, 'BS in Information Technology', 'TSN17734603098321716', '2026-03-14 12:58:54'),
(36, '123123123', 'Angel Mageri', 'M', 'Cabote (ECoAST)', 'angel.cabote.ecoast@panpacificu.edu.ph', '3rd Year', '+639763891307', NULL, 'BS in Information Technology', 'TSN17734603098321716', '2026-03-14 15:23:15'),
(41, '14567', 'Diane', 'A', 'Chua', 'dwynna@gmail.com', '3rd Year', '+639195364085', NULL, 'RPSEA', 'TSN17734603098321716', '2026-03-14 15:29:45'),
(42, '14567', 'Diane', 'A', 'Chua', 'dwynna@gmail.com', '3rd Year', '+639195364085', NULL, 'RPSEA', 'TSN17698767256291441', '2026-03-14 15:29:51'),
(44, '12312312312', 'Marfel Gem', 'A', 'Gallarde (ECoAST)', 'marfel.gallarde.ecoast@panpacificu.edu.ph', '4th Year', '+639763891308', NULL, 'BS in Computer Engineering', 'TSN17698767256291441', '2026-03-15 10:43:01'),
(45, '1231333', 'Lucy', 'A', 'Heartfilla', 'lucy@panpacificu.edu.ph', '3rd Year', '+639763891308', NULL, 'BS in Information Technology', 'TSN17698767256291441', '2026-03-15 10:49:14'),
(46, '123123123', 'Angel Mageri', 'M', 'Cabote (ECoAST)', 'angel.cabote.ecoast@panpacificu.edu.ph', '3rd Year', '+639763891307', NULL, 'BS in Information Technology', 'TSN17698767256291441', '2026-03-15 10:49:22');

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
(7, 'Programming Lec', '2026-02-23 01:39:46', 11),
(19, 'App Dev', '2026-03-14 12:56:12', 17);

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
(2, 'Programming', '3rd Year', 'TSN17698767256291441'),
(3, '', '', 'TSN17704826980131949'),
(4, '', '', 'TSN17704837387017092'),
(5, '', '', 'TSN17704837433987368'),
(6, 'Programming Lec', '3rd Year', 'TSN17713351187271590'),
(7, '', '', 'TSN17713353120404545'),
(8, '', '', 'TSN17713354408022460'),
(9, '', '', 'TSN17719208025622022'),
(10, '', '', 'TSN17719241460167887'),
(11, '', '', 'TSN17734601215899710'),
(12, 'App Dev', '3rd Year', 'TSN17734603098321716');

-- --------------------------------------------------------

--
-- Table structure for table `super_admin_accounts`
--

CREATE TABLE `super_admin_accounts` (
  `super_admin_id` int(11) NOT NULL,
  `super_admin_name` varchar(255) NOT NULL,
  `super_admin_email` varchar(255) NOT NULL,
  `super_admin_password` varchar(255) NOT NULL,
  `super_admin_profile_picture` varchar(500) DEFAULT NULL,
  `date_account_created` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `super_admin_accounts`
--

INSERT INTO `super_admin_accounts` (`super_admin_id`, `super_admin_name`, `super_admin_email`, `super_admin_password`, `super_admin_profile_picture`, `date_account_created`) VALUES
(1, 'Super Administrator', 'superadmin@panpacificu.edu.ph', '$2b$10$d4kXfzxstDkpQPR5Gp8YZeove4F2/T5Ga/EaS8g7y9c4ddf9HITP6', NULL, '2026-03-15 11:22:58');

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
(7, 'Steven John A. Agustin', 'teacher-1773461634036-907330.jpg', 'steven.agustin.ecoast@panpacificu.edu.ph', '$2b$10$j5nYLjVE7BGPwRwM3ELoJez2glRdd8LbnvHq8VDj9qxUMBHDpARCq', 'BS in Information Technology', NULL, '{\"latitude\":16.0188439976287,\"longitude\":120.74901540773324}', 50, '2026-01-31 16:25:25', 'TSN17698767256291441', 1),
(11, 'Bill Gates', NULL, 'bill@panpacificu.edu.ph', '$2b$10$3mjbRSABRIncKUWJOdc/XeWc7vMhQJbV77ORpCNHh//Wt3MsHePGu', 'BS in Information Technology', NULL, NULL, 50, '2026-02-17 13:31:58', 'TSN17713351187271590', 1),
(14, 'Elon Musk', NULL, 'elon@panpacificu.edu.ph', '$2b$10$cp3VaryKqBN8RbJNyHHXv.pRp4aciN2qx8J/HMYMcaxCsSMIC74ju', 'BS in Information Technology', NULL, NULL, 50, '2026-02-24 08:13:22', 'TSN17719208025622022', 1),
(15, 'Mark Zuckerberg', NULL, 'markzuckerberg@panpacificu.edu.ph', '$2b$10$EiyfjHfWwzvzt9KKgS9GfuNbQ4/Z290hQ7fj8m/As.BMSXXLSJsAC', 'BS in Information Technology', NULL, NULL, 50, '2026-02-24 09:09:06', 'TSN17719241460167887', 1),
(16, 'Andrea Lachica', NULL, 'andrea@panpacificu.edu.ph', '$2b$10$tLdaJdkfxFAav6bycEUUXuzzGTpVgXMTIJ.v04pju0n33l/ddzY22', 'BS in Computer Science', NULL, NULL, 50, '2026-03-14 03:48:41', 'TSN17734601215899710', 1),
(17, 'Charimea Selga', NULL, 'chari@panpacificu.edu.ph', '$2b$10$3uqLkrfPfGxZccuu521f4ObbMrSMGOzcR8g5soLKy6kF9IUQHdUiS', 'BS Education', NULL, '{\"latitude\":16.018738142763947,\"longitude\":120.74908408530399}', 10, '2026-03-14 03:51:49', 'TSN17734603098321716', 1);

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
  ADD UNIQUE KEY `student_email_per_teacher` (`student_email`,`teacher_barcode_scanner_serial_number`);

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
-- Indexes for table `super_admin_accounts`
--
ALTER TABLE `super_admin_accounts`
  ADD PRIMARY KEY (`super_admin_id`),
  ADD UNIQUE KEY `super_admin_email` (`super_admin_email`);

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
  MODIFY `attendance_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=71;

--
-- AUTO_INCREMENT for table `attendance_record`
--
ALTER TABLE `attendance_record`
  MODIFY `attendance_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=83;

--
-- AUTO_INCREMENT for table `event_attendance_history_record`
--
ALTER TABLE `event_attendance_history_record`
  MODIFY `event_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=37;

--
-- AUTO_INCREMENT for table `event_attendance_record`
--
ALTER TABLE `event_attendance_record`
  MODIFY `event_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=41;

--
-- AUTO_INCREMENT for table `event_setter`
--
ALTER TABLE `event_setter`
  MODIFY `event_setter_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `guards`
--
ALTER TABLE `guards`
  MODIFY `guard_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `program`
--
ALTER TABLE `program`
  MODIFY `program_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;

--
-- AUTO_INCREMENT for table `student_accounts`
--
ALTER TABLE `student_accounts`
  MODIFY `student_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=42;

--
-- AUTO_INCREMENT for table `student_records_regular_class`
--
ALTER TABLE `student_records_regular_class`
  MODIFY `student_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=47;

--
-- AUTO_INCREMENT for table `subject`
--
ALTER TABLE `subject`
  MODIFY `subject_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `subject_and_year_level_setter`
--
ALTER TABLE `subject_and_year_level_setter`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `super_admin_accounts`
--
ALTER TABLE `super_admin_accounts`
  MODIFY `super_admin_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `teacher`
--
ALTER TABLE `teacher`
  MODIFY `teacher_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `year_level`
--
ALTER TABLE `year_level`
  MODIFY `year_level_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
