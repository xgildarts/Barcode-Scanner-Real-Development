-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Mar 23, 2026 at 06:22 PM
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
(1, 'CSS Admin', 'admin@panpacificu.edu.ph', 'admin-1774286246774-277301.png', '$2b$10$WLX3Xkyz5en54kOO/5ZpouaRVWh2a9COy/rskR8Z/sqwBLYYB30ra', '2026-02-09 00:02:44'),
(2, 'Steven John A. Agustin', 'steven.agustin.admin@panpacificu.edu.ph', NULL, '$2b$10$mDndtidBYe2/oHD.7lxoIuJlt.x6rBHFOTSuo1NPJk.tUA9TRSLay', '2026-03-22 02:29:34');

-- --------------------------------------------------------

--
-- Table structure for table `admin_activity_logs`
--

CREATE TABLE `admin_activity_logs` (
  `log_id` int(11) NOT NULL,
  `admin_id` int(11) DEFAULT NULL,
  `admin_name` varchar(255) DEFAULT NULL,
  `action` varchar(100) NOT NULL,
  `target_type` varchar(100) DEFAULT NULL,
  `target_id` varchar(100) DEFAULT NULL,
  `target_name` varchar(255) DEFAULT NULL,
  `details` text DEFAULT NULL,
  `performed_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `admin_activity_logs`
--

INSERT INTO `admin_activity_logs` (`log_id`, `admin_id`, `admin_name`, `action`, `target_type`, `target_id`, `target_name`, `details`, `performed_at`) VALUES
(1, NULL, NULL, 'teacher', 'MANUAL_ATTENDANCE', 'Class Attendance', '1231333', 'Lucy A. Heartfilla', '2026-03-16 01:01:35');

-- --------------------------------------------------------

--
-- Table structure for table `admin_login_logs`
--

CREATE TABLE `admin_login_logs` (
  `log_id` int(11) NOT NULL,
  `admin_id` int(11) DEFAULT NULL,
  `admin_email` varchar(255) NOT NULL,
  `admin_name` varchar(255) DEFAULT NULL,
  `status` enum('SUCCESS','FAILED') NOT NULL,
  `ip_address` varchar(100) DEFAULT NULL,
  `login_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
(70, '123123123', 'M', 'Cabote (ECoAST)', 'Angel Mageri', 'BS in Information Technology', '23:16:57', '2026-03-15', '3rd Year', 'Programming', NULL, NULL, 46, 'TSN17698767256291441'),
(71, '1231333', 'A', 'Heartfilla', 'Lucy', 'BS in Information Technology', '01:01:34', '2026-03-16', '3rd Year', 'App Dev', NULL, NULL, 34, 'TSN17734603098321716'),
(72, '1231426', 'M', 'Selga', 'Charimea', 'BS in Information Technology', '11:53:25', '2026-03-16', '3rd Year', 'Programming', NULL, NULL, 21, 'TSN17698767256291441'),
(73, '737773', 'A', 'Agustin', 'Zaiejan', 'BS in Information Technology', '15:19:10', '2026-03-16', '3rd Year', 'Programming', NULL, NULL, 42, 'TSN17698767256291441'),
(74, '737773', 'A', 'Agustin', 'Zaiejan', 'BS in Information Technology', '15:22:10', '2026-03-16', '3rd Year', 'Programming', NULL, NULL, 42, 'TSN17698767256291441'),
(75, '737773', 'A', 'Agustin', 'Zaiejan', 'BS in Information Technology', '15:28:15', '2026-03-16', '3rd Year', 'Programming', NULL, NULL, 42, 'TSN17698767256291441'),
(76, '12312313787', 'A', 'Agustin (CoAST)', 'Steven John', 'BS in Information Technology', '21:01:43', '2026-03-16', '3rd Year', 'Programming', NULL, NULL, 33, 'TSN17698767256291441'),
(77, '1231231231231', 'A', 'Dragneel', 'Natsu', 'BS in Information Technology', '21:01:46', '2026-03-16', '3rd Year', 'Programming', NULL, NULL, 28, 'TSN17698767256291441'),
(78, '12313598', 'O', 'Obillo (ECoAST)', 'Princess', 'BS in Information Technology', '21:01:50', '2026-03-16', '3rd Year', 'Programming', NULL, NULL, 27, 'TSN17698767256291441'),
(79, '123123123', 'A', 'Cabote (ECoAST)', 'Angel Mageri', 'BS in Information Technology', '21:01:54', '2026-03-16', '3rd Year', 'Programming', NULL, NULL, 46, 'TSN17698767256291441'),
(80, '14567', 'A', 'Chua', 'Diane', 'RPSEA', '21:02:00', '2026-03-16', '3rd Year', 'Programming', NULL, NULL, 42, 'TSN17698767256291441'),
(81, '1231333', 'A', 'Heartfilla', 'Lucy', 'BS in Information Technology', '21:02:02', '2026-03-16', '3rd Year', 'Programming', NULL, NULL, 45, 'TSN17698767256291441'),
(82, '1231333', 'A', 'Heartfilla', 'Lucy', 'BS in Information Technology', '13:24:35', '2026-03-19', '3rd Year', 'Event-Driven Programming', NULL, NULL, 23, 'TSN17698767256291441'),
(83, '1231333', 'A', 'Heartfilla', 'Lucy', 'BS in Information Technology', '14:38:35', '2026-03-19', '3rd Year', 'Event-Driven Programming', NULL, NULL, 23, 'TSN17698767256291441'),
(84, '1231333', 'A', 'Heartfilla', 'Lucy', 'BS in Information Technology', '17:49:17', '2026-03-19', '3rd Year', 'Physics', NULL, NULL, 23, 'TSN17736807667173940'),
(85, '1231333', 'A', 'Heartfilla', 'Lucy', 'BS in Information Technology', '16:04:19', '2026-03-20', '3rd Year', 'Big Data', NULL, NULL, 23, 'TSN17698767256291441'),
(86, '1231333', 'A', 'Heartfilla', 'Lucy', 'BS in Information Technology', '17:00:24', '2026-03-20', '3rd Year', 'Computer Programming', NULL, NULL, 23, 'TSN17736807667173940'),
(87, '1231333', 'A', 'Heartfilla', 'Lucy', 'BS in Information Technology', '17:01:20', '2026-03-20', '3rd Year', 'Event-Driven Programming', NULL, NULL, 23, 'TSN17698767256291441'),
(88, '1231426', 'M', 'Selga', 'Charimea', 'BS in Information Technology', '12:30:38', '2026-03-21', '3rd Year', 'Big Data', NULL, NULL, 21, 'TSN17698767256291441'),
(89, '12313598', 'O', 'Obillo (ECoAST)', 'Princess', 'BS in Information Technology', '12:30:55', '2026-03-21', '3rd Year', 'Big Data', NULL, NULL, 27, 'TSN17698767256291441'),
(90, '1231231231231', 'A', 'Dragneel', 'Natsu', 'BS in Information Technology', '12:31:01', '2026-03-21', '3rd Year', 'Big Data', NULL, NULL, 28, 'TSN17698767256291441'),
(91, '14567', 'A', 'Chua', 'Diane', 'RPSEA', '12:31:09', '2026-03-21', '3rd Year', 'Big Data', NULL, NULL, 42, 'TSN17698767256291441'),
(92, '1231333', 'A', 'Heartfilla', 'Lucy', 'BS in Information Technology', '12:31:15', '2026-03-21', '3rd Year', 'Big Data', NULL, NULL, 45, 'TSN17698767256291441'),
(93, '1231377', 'A', 'Agustin (CoAST)', 'Steven John', 'BS in Information Technology', '12:31:27', '2026-03-21', '3rd Year', 'Big Data', NULL, NULL, 56, 'TSN17698767256291441'),
(94, '1231333', 'A', 'Heartfilla', 'Lucy', 'BS in Information Technology', '17:07:30', '2026-03-21', '3rd Year', 'Computer Programming', NULL, NULL, 23, 'TSN17736807667173940'),
(95, '1231426', 'M', 'Selga', 'Charimea', 'BS in Information Technology', '12:13:52', '2026-03-22', '3rd Year', 'Big Data', NULL, NULL, 21, 'TSN17698767256291441'),
(96, '12313598', 'O', 'Obillo (ECoAST)', 'Princess', 'BS in Information Technology', '12:13:55', '2026-03-22', '3rd Year', 'Big Data', NULL, NULL, 27, 'TSN17698767256291441'),
(97, '1231231231231', 'A', 'Dragneel', 'Natsu', 'BS in Information Technology', '12:13:59', '2026-03-22', '3rd Year', 'Big Data', NULL, NULL, 28, 'TSN17698767256291441'),
(98, '14567', 'A', 'Chua', 'Diane', 'RPSEA', '12:14:03', '2026-03-22', '3rd Year', 'Big Data', NULL, NULL, 42, 'TSN17698767256291441'),
(99, '123123123', 'A', 'Cabote (ECoAST)', 'Angel Mageri', 'BS in Information Technology', '12:14:06', '2026-03-22', '3rd Year', 'Big Data', NULL, NULL, 46, 'TSN17698767256291441'),
(100, '737773', 'A', 'Agustin', 'Zaiejan', 'BS in Information Technology', '12:14:10', '2026-03-22', '3rd Year', 'Big Data', NULL, NULL, 49, 'TSN17698767256291441'),
(101, '1231377', 'A', 'Agustin (CoAST)', 'Steven John', 'BS in Information Technology', '12:14:17', '2026-03-22', '3rd Year', 'Big Data', NULL, NULL, 56, 'TSN17698767256291441'),
(102, '1231333', 'A', 'Heartfilla', 'Lucy', 'BS in Information Technology', '12:25:16', '2026-03-22', '3rd Year', 'Programming', NULL, NULL, 23, 'TSN17698767256291441'),
(103, '1231333', 'A', 'Heartfilla', 'Lucy', 'BS in Information Technology', '12:37:42', '2026-03-22', '3rd Year', 'Computer Programming', NULL, NULL, 23, 'TSN17736807667173940'),
(104, '123123123', 'A', 'Cabote (ECoAST)', 'Angel Mageri', 'BS in Information Technology', '13:15:44', '2026-03-22', '3rd Year', 'Computer Programming', NULL, NULL, 50, 'TSN17736807667173940'),
(105, '1231377', 'A', 'Agustin (CoAST)', 'Steven John', 'BS in Information Technology', '13:15:50', '2026-03-22', '3rd Year', 'Computer Programming', NULL, NULL, 57, 'TSN17736807667173940'),
(106, '67', 'A', 'Kiyomi', 'Yuumi', 'BS in Mechanics', '14:40:21', '2026-03-22', '2nd Year', 'Mathematics', NULL, NULL, 47, 'TSN17736807667173940'),
(107, '12313598', 'O', 'Obillo (ECoAST)', 'Princess', 'BS in Information Technology', '15:29:15', '2026-03-22', '3rd Year', 'Programming', NULL, NULL, 27, 'TSN17698767256291441'),
(108, '1231231231231', 'A', 'Dragneel', 'Natsu', 'BS in Information Technology', '20:33:53', '2026-03-22', '3rd Year', 'Programming', NULL, NULL, 28, 'TSN17698767256291441'),
(109, '14567', 'A', 'Chua', 'Diane', 'RPSEA', '20:33:56', '2026-03-22', '3rd Year', 'Programming', NULL, NULL, 42, 'TSN17698767256291441'),
(110, '123123123', 'A', 'Cabote (ECoAST)', 'Angel Mageri', 'BS in Information Technology', '20:33:59', '2026-03-22', '3rd Year', 'Programming', NULL, NULL, 46, 'TSN17698767256291441'),
(111, '1231333', 'A', 'Heartfilla', 'Lucy', 'BS in Information Technology', '20:34:02', '2026-03-22', '3rd Year', 'Programming', NULL, NULL, 45, 'TSN17698767256291441'),
(112, '737773', 'A', 'Agustin', 'Zaiejan', 'BS in Information Technology', '20:34:06', '2026-03-22', '3rd Year', 'Programming', NULL, NULL, 49, 'TSN17698767256291441'),
(113, '456', 'A', 'Ramirez', 'Andria', 'BS Education', '20:34:52', '2026-03-22', '1st Year', 'Big Data', NULL, NULL, 48, 'TSN17698767256291441'),
(114, '1231426', 'M', 'Selga', 'Charimea', 'BS in Information Technology', '02:32:31', '2026-03-23', '3rd Year', 'Big Data', NULL, NULL, 21, 'TSN17698767256291441'),
(115, '12313598', 'O', 'Obillo (ECoAST)', 'Princess', 'BS in Information Technology', '02:32:33', '2026-03-23', '3rd Year', 'Big Data', NULL, NULL, 27, 'TSN17698767256291441'),
(116, '1231231231231', 'A', 'Dragneel', 'Natsu', 'BS in Information Technology', '02:32:35', '2026-03-23', '3rd Year', 'Big Data', NULL, NULL, 28, 'TSN17698767256291441'),
(117, '14567', 'A', 'Chua', 'Diane', 'RPSEA', '02:32:37', '2026-03-23', '3rd Year', 'Big Data', NULL, NULL, 42, 'TSN17698767256291441'),
(118, '1231333', 'A', 'Heartfilla', 'Lucy', 'BS in Information Technology', '11:13:34', '2026-03-23', '3rd Year', 'Big Data', NULL, NULL, 45, 'TSN17698767256291441');

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
(36, 41, 'Angel Mageri M. Cabote (ECoAST)', '123123123', 'BS in Information Technology', '3rd Year', 'Kick off', 'Gray Fullbuster', 'Main Gate', '16:47:05', '2026-03-14', 'TIME OUT', 5, 1),
(37, 46, 'Steven John A. Agustin (CoAST)', '1231377', 'BS in Information Technology', '3rd Year', 'Foundation day', 'Gray Fullbusters', 'Main Gate', '12:41:12', '2026-03-21', 'TIME IN', 5, 1),
(38, 46, 'Steven John A. Agustin (CoAST)', '1231377', 'BS in Information Technology', '3rd Year', 'Foundation day', 'Gray Fullbusters', 'Main Gate', '12:45:19', '2026-03-21', 'TIME IN', 5, 1),
(39, 46, 'Steven John A. Agustin (CoAST)', '1231377', 'BS in Information Technology', '3rd Year', 'Sample', 'Gray Fullbusters', 'Main Gate', '15:24:02', '2026-03-22', 'TIME IN', 5, 1),
(40, 46, 'Steven John A. Agustin (CoAST)', '1231377', 'BS in Information Technology', '3rd Year', 'Sample', 'Gray Fullbusters', 'Main Gate', '15:24:17', '2026-03-22', 'TIME OUT', 5, 1),
(41, 49, 'Andrea A. Lachica', '897', 'BS in Information Technology', '3rd Year', 'Sample', 'Gray Fullbusters', 'Main Gate', '13:13:12', '2026-03-23', 'TIME IN', 5, 1);

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
(1, 'Sample', '2026-02-08 23:50:53', 1);

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
(5, 'Gray Fullbusters', 'gray@panpacificu.edu.ph', '$2b$10$NGqhdmtbZyNS91U8YY4Deu6/.9MO.i7qy.rHRQG68OXmqDoCj1w5e', 'Main Gate', 1),
(6, 'Metalman', 'metal@panpacificu.edu.ph', '$2b$10$1T70awsl2.pNGdvZflKI6.fBURIm1foeww1VA.HMojcCatgOvrPVi', 'Parking Area', 1),
(9, 'Kirito Kirigaya (Guard)', 'kirito@panpacificu.edu.ph', '$2b$10$.32vBAdFxi8CK.a8KDB8Hete8XiZ.KyJsWSDQ3DWdGXwDh4MtJlIu', 'Main Gate', 1),
(10, 'Chari Segla (Guard)', 'chari@guard.panpacificu.edu.ph', '$2b$10$A4U6PKfPr0b9eqH3KmOhM.HXsh.Ek.schyFyVNPsw0vyCm/PsmZg.', 'Main Gate', 1);

-- --------------------------------------------------------

--
-- Table structure for table `messages`
--

CREATE TABLE `messages` (
  `id` int(11) NOT NULL,
  `sender_id` int(11) NOT NULL,
  `sender_role` varchar(20) NOT NULL,
  `sender_name` varchar(255) NOT NULL,
  `receiver_id` int(11) NOT NULL,
  `receiver_role` varchar(20) NOT NULL,
  `receiver_name` varchar(255) NOT NULL,
  `content` text DEFAULT NULL,
  `file_url` varchar(500) DEFAULT NULL,
  `file_name` varchar(255) DEFAULT NULL,
  `file_type` varchar(100) DEFAULT NULL,
  `is_read` tinyint(1) NOT NULL DEFAULT 0,
  `read_at` datetime DEFAULT NULL,
  `is_unsent` tinyint(1) NOT NULL DEFAULT 0,
  `is_edited` tinyint(1) NOT NULL DEFAULT 0,
  `edited_at` datetime DEFAULT NULL,
  `deleted_for_sender` tinyint(1) NOT NULL DEFAULT 0,
  `deleted_for_receiver` tinyint(1) NOT NULL DEFAULT 0,
  `is_pinned` tinyint(1) NOT NULL DEFAULT 0,
  `forwarded_from_id` int(11) DEFAULT NULL,
  `sender_profile_picture` varchar(500) DEFAULT NULL,
  `receiver_profile_picture` varchar(500) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `messages`
--

INSERT INTO `messages` (`id`, `sender_id`, `sender_role`, `sender_name`, `receiver_id`, `receiver_role`, `receiver_name`, `content`, `file_url`, `file_name`, `file_type`, `is_read`, `read_at`, `is_unsent`, `is_edited`, `edited_at`, `deleted_for_sender`, `deleted_for_receiver`, `is_pinned`, `forwarded_from_id`, `sender_profile_picture`, `receiver_profile_picture`, `created_at`) VALUES
(1, 1, 'admin', 'Administrator', 1, 'super_admin', 'Super Administrator', 'Hello', NULL, NULL, NULL, 1, NULL, 0, 0, NULL, 0, 0, 0, NULL, NULL, NULL, '2026-03-23 01:46:47'),
(2, 41, 'student', 'Angel Mageri', 18, 'teacher', 'Mark Zuckerberg', 'Hello sir I am absent for now, because I have Illness', NULL, NULL, NULL, 1, NULL, 0, 0, NULL, 0, 0, 0, NULL, NULL, NULL, '2026-03-23 01:48:14'),
(3, 41, 'student', 'Angel Mageri', 18, 'teacher', 'Mark Zuckerberg', 'Hello sir', NULL, NULL, NULL, 1, NULL, 0, 0, NULL, 0, 0, 0, NULL, NULL, NULL, '2026-03-23 02:01:49'),
(4, 41, 'student', 'Angel Mageri', 18, 'teacher', 'Mark Zuckerberg', 'Hello world', NULL, NULL, NULL, 1, NULL, 0, 0, NULL, 0, 0, 0, NULL, NULL, NULL, '2026-03-23 02:07:28'),
(5, 1, 'super_admin', 'Super Administrator', 1, 'admin', 'Administrator', 'What is your need?', NULL, NULL, NULL, 1, NULL, 0, 0, NULL, 0, 0, 0, NULL, NULL, NULL, '2026-03-23 02:10:01'),
(6, 5, 'guard', 'Gray Fullbusters', 1, 'admin', 'Administrator', 'I can\'t sir', NULL, NULL, NULL, 1, NULL, 0, 0, NULL, 0, 0, 0, NULL, NULL, NULL, '2026-03-23 02:16:51'),
(7, 1, 'admin', 'Administrator', 5, 'guard', 'Gray Fullbusters', 'Okay I\'ll fix it', NULL, NULL, NULL, 1, NULL, 0, 0, NULL, 0, 0, 0, NULL, NULL, NULL, '2026-03-23 02:24:50'),
(8, 1, 'admin', 'Administrator', 2, 'admin', 'Steven John A. Agustin', NULL, '/api/v1/uploads/message_files/msg_1774207090680_02.png', '02.png', 'image/png', 1, NULL, 0, 0, NULL, 0, 0, 0, NULL, NULL, NULL, '2026-03-23 03:18:10'),
(9, 35, 'student', 'Natsu', 1, 'admin', 'Administrator', 'Adda bagtit mo chari', NULL, NULL, NULL, 1, NULL, 0, 0, NULL, 0, 0, 1, NULL, NULL, NULL, '2026-03-23 08:56:21'),
(10, 1, 'admin', 'Administrator', 35, 'student', 'Natsu', NULL, NULL, NULL, NULL, 1, NULL, 1, 0, NULL, 0, 0, 0, NULL, NULL, NULL, '2026-03-23 09:02:47'),
(11, 35, 'student', 'Natsu', 1, 'admin', 'Administrator', 'Hello', NULL, NULL, NULL, 1, NULL, 0, 0, NULL, 1, 0, 0, NULL, NULL, NULL, '2026-03-23 09:09:46'),
(12, 35, 'student', 'Natsu', 1, 'admin', 'Administrator', 'hello nigga', NULL, NULL, NULL, 1, '2026-03-23 09:38:37', 0, 0, NULL, 0, 0, 0, NULL, 'student-1774204990603-169913.png', 'admin-1773474482355-324628.png', '2026-03-23 09:38:25'),
(13, 35, 'student', 'Natsu', 1, 'admin', 'Administrator', 'This is me', NULL, NULL, NULL, 1, '2026-03-23 09:38:37', 0, 0, NULL, 0, 0, 0, NULL, 'student-1774204990603-169913.png', 'admin-1773474482355-324628.png', '2026-03-23 09:38:30'),
(14, 35, 'student', 'Natsu', 1, 'admin', 'Administrator', 'Sir I have a requests for you, because I can\'t attend now, because I am sick, Thank you sir for your consideration', NULL, NULL, NULL, 1, '2026-03-23 09:39:50', 0, 0, NULL, 0, 0, 0, NULL, 'student-1774204990603-169913.png', 'admin-1773474482355-324628.png', '2026-03-23 09:39:47'),
(15, 35, 'student', 'Natsu', 1, 'admin', 'Administrator', 'Sir?', NULL, NULL, NULL, 1, '2026-03-23 09:40:15', 0, 0, NULL, 0, 0, 0, NULL, 'student-1774204990603-169913.png', 'admin-1773474482355-324628.png', '2026-03-23 09:40:02'),
(16, 1, 'admin', 'Administrator', 35, 'student', 'Natsu', 'Ops whats wrong?', NULL, NULL, NULL, 1, '2026-03-23 09:43:24', 0, 0, NULL, 0, 0, 0, NULL, 'admin-1773474482355-324628.png', 'student-1774204990603-169913.png', '2026-03-23 09:43:21'),
(17, 1, 'admin', 'Administrator', 35, 'student', 'Natsu', 'Hello', NULL, NULL, NULL, 1, '2026-03-23 09:43:29', 0, 0, NULL, 0, 0, 0, NULL, 'admin-1773474482355-324628.png', 'student-1774204990603-169913.png', '2026-03-23 09:43:28'),
(18, 1, 'admin', 'Administrator', 2, 'admin', 'Steven John A. Agustin', 'hello', NULL, NULL, NULL, 0, NULL, 0, 0, NULL, 0, 0, 0, NULL, 'admin-1773474482355-324628.png', NULL, '2026-03-23 09:46:13'),
(19, 35, 'student', 'Natsu', 1, 'admin', 'CSS Admin', 'hello', NULL, NULL, NULL, 1, '2026-03-23 09:54:21', 0, 0, NULL, 0, 0, 0, NULL, 'student-1774204990603-169913.png', 'admin-1773474482355-324628.png', '2026-03-23 09:46:35'),
(20, 1, 'admin', 'Administrator', 2, 'admin', 'Steven John A. Agustin', 'hello', NULL, NULL, NULL, 0, NULL, 0, 0, NULL, 0, 0, 0, NULL, 'admin-1773474482355-324628.png', NULL, '2026-03-23 09:49:30'),
(21, 1, 'admin', 'Administrator', 35, 'student', 'Natsu', 'what?', NULL, NULL, NULL, 1, '2026-03-23 09:54:33', 0, 0, NULL, 0, 0, 0, NULL, 'admin-1773474482355-324628.png', 'student-1774204990603-169913.png', '2026-03-23 09:54:26'),
(22, 1, 'admin', 'Administrator', 35, 'student', 'Natsu', 'hello', NULL, NULL, NULL, 1, '2026-03-23 09:54:33', 0, 0, NULL, 0, 0, 0, NULL, 'admin-1773474482355-324628.png', 'student-1774204990603-169913.png', '2026-03-23 09:54:29'),
(23, 1, 'admin', 'Administrator', 35, 'student', 'Natsu', 'Come on', NULL, NULL, NULL, 1, '2026-03-23 09:56:42', 0, 0, NULL, 0, 0, 0, NULL, 'admin-1773474482355-324628.png', 'student-1774204990603-169913.png', '2026-03-23 09:56:21'),
(24, 1, 'admin', 'Administrator', 35, 'student', 'Natsu', '😂😂', NULL, NULL, NULL, 1, '2026-03-23 09:56:42', 0, 0, NULL, 0, 0, 0, NULL, 'admin-1773474482355-324628.png', 'student-1774204990603-169913.png', '2026-03-23 09:56:25'),
(25, 1, 'admin', 'Administrator', 35, 'student', 'Natsu Dragneel', 'hello', NULL, NULL, NULL, 1, '2026-03-23 09:58:27', 0, 0, NULL, 0, 0, 0, NULL, 'admin-1773474482355-324628.png', 'student-1774204990603-169913.png', '2026-03-23 09:58:21'),
(26, 35, 'student', 'Natsu', 1, 'admin', 'CSS Admin', 'Mam what\'s going on?', NULL, NULL, NULL, 1, '2026-03-23 09:59:13', 0, 0, NULL, 0, 0, 0, NULL, 'student-1774204990603-169913.png', 'admin-1773474482355-324628.png', '2026-03-23 09:59:11'),
(27, 1, 'admin', 'Administrator', 35, 'student', 'Natsu', 'Nothing haha', NULL, NULL, NULL, 1, '2026-03-23 09:59:25', 0, 0, NULL, 0, 0, 0, NULL, 'admin-1773474482355-324628.png', 'student-1774204990603-169913.png', '2026-03-23 09:59:24'),
(28, 1, 'admin', 'Administrator', 35, 'student', 'Natsu Dragneel', 'Hello', NULL, NULL, NULL, 1, '2026-03-23 10:00:33', 0, 0, NULL, 0, 0, 0, NULL, 'admin-1773474482355-324628.png', 'student-1774204990603-169913.png', '2026-03-23 10:00:31'),
(29, 35, 'student', 'Natsu', 1, 'admin', 'Administrator', 'ahahaha', NULL, NULL, NULL, 1, '2026-03-23 10:00:43', 0, 0, NULL, 0, 0, 0, NULL, 'student-1774204990603-169913.png', 'admin-1773474482355-324628.png', '2026-03-23 10:00:41'),
(30, 35, 'student', 'Natsu', 1, 'admin', 'Administrator', 'What\'s', NULL, NULL, NULL, 1, '2026-03-23 10:01:21', 0, 0, NULL, 0, 0, 0, NULL, 'student-1774204990603-169913.png', 'admin-1773474482355-324628.png', '2026-03-23 10:01:19'),
(31, 35, 'student', 'Natsu', 19, 'student', 'Charimea Selga', 'Hello!', NULL, NULL, NULL, 0, NULL, 0, 0, NULL, 0, 0, 0, NULL, 'student-1774204990603-169913.png', 'student-1774180359937-849543.jpg', '2026-03-23 10:05:02'),
(32, 35, 'student', 'Natsu', 19, 'student', 'Charimea Selga', 'This is the new feature I put in to our System', NULL, NULL, NULL, 0, NULL, 0, 0, NULL, 0, 0, 0, NULL, 'student-1774204990603-169913.png', 'student-1774180359937-849543.jpg', '2026-03-23 10:05:19'),
(33, 35, 'student', 'Natsu', 19, 'student', 'Charimea Selga', 'It is great?', NULL, NULL, NULL, 0, NULL, 0, 0, NULL, 0, 0, 0, NULL, 'student-1774204990603-169913.png', 'student-1774180359937-849543.jpg', '2026-03-23 10:05:23'),
(34, 1, 'admin', 'Administrator', 35, 'student', 'Natsu Dragneel', 'Hello', NULL, NULL, NULL, 1, '2026-03-23 10:06:42', 0, 0, NULL, 0, 0, 0, NULL, 'admin-1773474482355-324628.png', 'student-1774204990603-169913.png', '2026-03-23 10:06:22'),
(35, 1, 'admin', 'Administrator', 35, 'student', 'Natsu Dragneel', 'What?', NULL, NULL, NULL, 1, '2026-03-23 10:06:42', 0, 0, NULL, 0, 0, 0, NULL, 'admin-1773474482355-324628.png', 'student-1774204990603-169913.png', '2026-03-23 10:06:31'),
(36, 1, 'admin', 'Administrator', 35, 'student', 'Natsu Dragneel', 'It\'s working?', NULL, NULL, NULL, 1, '2026-03-23 10:06:55', 0, 0, NULL, 0, 0, 0, NULL, 'admin-1773474482355-324628.png', 'student-1774204990603-169913.png', '2026-03-23 10:06:51'),
(37, 35, 'student', 'Natsu', 1, 'admin', 'Administrator', 'No mam', NULL, NULL, NULL, 1, '2026-03-23 10:07:14', 0, 1, '2026-03-23 19:50:34', 0, 0, 0, NULL, 'student-1774204990603-169913.png', 'admin-1773474482355-324628.png', '2026-03-23 10:07:11'),
(38, 1, 'admin', 'Administrator', 35, 'student', 'Natsu', '😂😂', NULL, NULL, NULL, 1, '2026-03-23 10:07:26', 0, 0, NULL, 0, 0, 0, NULL, 'admin-1773474482355-324628.png', 'student-1774204990603-169913.png', '2026-03-23 10:07:24'),
(39, 1, 'admin', 'Administrator', 35, 'student', 'Natsu', NULL, '/api/v1/uploads/message_files/msg_1774231944611_376289072_6734967113212830_5626171689343155846_n.jpg', '376289072_6734967113212830_5626171689343155846_n.jpg', 'image/jpeg', 1, '2026-03-23 10:12:26', 0, 0, NULL, 0, 0, 0, NULL, 'admin-1773474482355-324628.png', 'student-1774204990603-169913.png', '2026-03-23 10:12:24'),
(40, 7, 'teacher', 'Steven John A. Agustin', 1, 'admin', 'CSS Admin', NULL, NULL, NULL, NULL, 1, '2026-03-23 11:21:00', 1, 0, NULL, 0, 0, 0, NULL, 'teacher-1774205291067-113602.png', 'admin-1773474482355-324628.png', '2026-03-23 11:20:49'),
(41, 49, 'student', 'Andrea', 1, 'super_admin', 'Super Administrator', NULL, NULL, NULL, NULL, 1, '2026-03-23 12:32:17', 1, 0, NULL, 0, 0, 0, NULL, NULL, 'superadmin-1774076347437-483598.jpg', '2026-03-23 12:32:03'),
(42, 1, 'super_admin', 'Super Administrator', 49, 'student', 'Andrea', 'Is this your lastname?', '/api/v1/uploads/message_files/msg_1774240559970_Untitled.png', 'Untitled.png', 'image/png', 1, '2026-03-23 12:36:46', 0, 0, NULL, 0, 0, 0, NULL, 'superadmin-1774076347437-483598.jpg', NULL, '2026-03-23 12:36:00'),
(43, 7, 'teacher', 'Steven John A. Agustin', 1, 'admin', 'CSS Admin', NULL, NULL, NULL, NULL, 1, '2026-03-23 12:59:57', 1, 0, NULL, 0, 0, 0, NULL, 'teacher-1774240930680-701646.png', 'admin-1773474482355-324628.png', '2026-03-23 12:42:26'),
(44, 1, 'super_admin', 'Super Administrator', 1, 'admin', 'CSS Admin', 'Hello World', NULL, NULL, NULL, 1, '2026-03-23 13:01:02', 0, 0, NULL, 0, 0, 0, NULL, 'superadmin-1774076347437-483598.jpg', 'admin-1773474482355-324628.png', '2026-03-23 12:59:46'),
(45, 1, 'admin', 'CSS Admin', 7, 'teacher', 'Steven John A. Agustin', NULL, NULL, NULL, NULL, 1, '2026-03-23 13:00:34', 1, 0, NULL, 0, 0, 0, NULL, 'admin-1773474482355-324628.png', 'teacher-1774240930680-701646.png', '2026-03-23 13:00:31'),
(46, 7, 'teacher', 'Steven John A. Agustin', 1, 'admin', 'CSS Admin', NULL, NULL, NULL, NULL, 1, '2026-03-23 13:01:23', 1, 0, NULL, 0, 0, 0, NULL, 'teacher-1774240930680-701646.png', 'admin-1773474482355-324628.png', '2026-03-23 13:00:45'),
(47, 7, 'teacher', 'Steven John A. Agustin', 1, 'admin', 'CSS Admin', 'Good day Admin! can I request another account?', NULL, NULL, NULL, 1, '2026-03-23 13:02:56', 0, 0, NULL, 0, 0, 1, NULL, 'teacher-1774240930680-701646.png', 'admin-1773474482355-324628.png', '2026-03-23 13:02:54'),
(48, 1, 'admin', 'CSS Admin', 7, 'teacher', 'Steven John A. Agustin', 'yes sure, account for you or a student ?', NULL, NULL, NULL, 1, '2026-03-23 13:04:15', 0, 0, NULL, 0, 0, 0, NULL, 'admin-1773474482355-324628.png', 'teacher-1774240930680-701646.png', '2026-03-23 13:04:13'),
(49, 7, 'teacher', 'Steven John A. Agustin', 1, 'admin', 'CSS Admin', 'Good day admin!, I have problem with my account', NULL, NULL, NULL, 1, '2026-03-23 13:06:33', 0, 0, NULL, 0, 0, 0, NULL, 'teacher-1774240930680-701646.png', 'admin-1773474482355-324628.png', '2026-03-23 13:06:30'),
(50, 7, 'teacher', 'Steven John A. Agustin', 1, 'super_admin', 'Super Administrator', 'Good day! Super admin, Can I see my login logs?', NULL, NULL, NULL, 1, '2026-03-23 13:20:54', 0, 0, NULL, 0, 0, 0, NULL, 'teacher-1774240930680-701646.png', 'superadmin-1774242535609-552779.png', '2026-03-23 13:08:57'),
(51, 1, 'admin', 'CSS Admin', 7, 'teacher', 'Steven John A. Agustin', 'what is problem?', NULL, NULL, NULL, 1, '2026-03-24 01:18:15', 0, 0, NULL, 0, 0, 0, NULL, 'admin-1773474482355-324628.png', 'teacher-1774240930680-701646.png', '2026-03-23 13:09:45'),
(52, 35, 'student', 'Natsu', 1, 'admin', 'Administrator', 'I can\'t upload profile mam', NULL, NULL, NULL, 1, '2026-03-23 20:12:43', 0, 0, NULL, 0, 0, 0, NULL, 'student-1774204990603-169913.png', 'admin-1773474482355-324628.png', '2026-03-23 20:12:32');

-- --------------------------------------------------------

--
-- Table structure for table `notifications`
--

CREATE TABLE `notifications` (
  `id` int(11) NOT NULL,
  `type` varchar(50) NOT NULL DEFAULT 'info',
  `title` varchar(255) NOT NULL,
  `message` text DEFAULT NULL,
  `meta` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`meta`)),
  `is_read_admin` tinyint(1) NOT NULL DEFAULT 0,
  `is_read_super` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `notifications`
--

INSERT INTO `notifications` (`id`, `type`, `title`, `message`, `meta`, `is_read_admin`, `is_read_super`, `created_at`) VALUES
(1, 'new_student', 'New Student Registered', 'Albert A. Wesker (12313795) registered — BS in Information Technology, 3rd Year', '{\"student_id_number\":\"12313795\",\"name\":\"Albert Wesker\",\"program\":\"BS in Information Technology\",\"yearLevel\":\"3rd Year\",\"email\":\"albert@panpacificu.edu.ph\"}', 1, 1, '2026-03-22 19:34:26'),
(2, 'new_student', 'New Student Registered', 'Andrea A. Lachica (897) registered — BS in Information Technology, 3rd Year', '{\"student_id_number\":\"897\",\"name\":\"Andrea Lachica\",\"program\":\"BS in Information Technology\",\"yearLevel\":\"3rd Year\",\"email\":\"andrea.lachica@panpacificu.edu.ph\"}', 1, 0, '2026-03-23 12:28:44');

-- --------------------------------------------------------

--
-- Table structure for table `program`
--

CREATE TABLE `program` (
  `program_id` int(11) NOT NULL,
  `program_name` varchar(200) NOT NULL,
  `program_date_created` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `program`
--

INSERT INTO `program` (`program_id`, `program_name`, `program_date_created`) VALUES
(1, 'BS in Information Technology', '2026-01-31 00:30:28'),
(2, 'BS in Computer Science', '2026-01-31 00:30:28'),
(6, 'BS Education', '2026-02-02 18:40:44'),
(13, 'BS in Criminology', '2026-02-08 20:59:23'),
(19, 'BS in Computer Engineering', '2026-02-19 00:33:54'),
(24, 'RPSEA', '2026-03-07 12:16:59'),
(28, 'BS in Mechanics', '2026-03-16 12:21:00');

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
  `admin_id` int(11) NOT NULL,
  `barcode_teacher_serial` varchar(100) DEFAULT NULL,
  `student_profile_picture` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `student_accounts`
--

INSERT INTO `student_accounts` (`student_id`, `student_id_number`, `student_firstname`, `student_middlename`, `student_lastname`, `student_email`, `password`, `student_year_level`, `student_guardian_number`, `student_program`, `location_generated`, `barcode`, `barcode_date_generated`, `device_id`, `admin_id`, `barcode_teacher_serial`, `student_profile_picture`) VALUES
(18, '1233345989', 'Agrifina', 'A', 'Agaran', 'agrifina@panpacificu.edu.ph', '$2b$10$OuBrVjLjQIjpZ6DNU.rpROthB9qekSgTqujfjA0B/gsMIrH9WFaJG', '3rd Year', '+639481239328', 'BS Education', '', 'BC17708947181891836', '2026-02-12 19:11:58', '', 1, NULL, NULL),
(19, '1231422', 'Charimea', 'M', 'Selga', 'charimea.selga.ecoast@panpacificu.edu.ph', '$2b$10$.VzGuTyj7ZlUsdb/Vd5cUeDKBMqawDkcEZEUlKF9jug/E28aFC9/W', '3rd Year', '+639563543429', 'BS in Information Technology', '', 'BC17708952022486423', '2026-02-12 19:20:02', 'b8d006cd57914cf55af091e1aa64aa53cfbce04637e3467feaeeedeb02e2cf08', 1, NULL, 'student-1774180359937-849543.jpg'),
(23, '1231333', 'Lucy', 'A', 'Heartfilla', 'lucyheart@panpacificu.edu.ph', '$2b$10$617POruNNIa1m8LeMYdKS.9IjOgJqbMX.N1.wInPcKK6hYj26weHy', '3rd Year', '+639763891308', 'BS in Information Technology', '', 'BC17741975430858488', '2026-03-23 00:39:03', '8596927ce8a26ec5db6831cb162f7da752db54b19ec598e9714fb28fcbbdda54', 0, 'TSN17736807667173940', 'student-1774159341046-561222.png'),
(25, '14567', 'Diane', 'A', 'Chua', 'dwynna@gmail.com', '$2b$10$haEoY2zIw3gGj0k4wHFHKOIoXTJu2soBKV1/T1tICPwSy5CPd9Ceu', '3rd Year', '+639195364085', 'RPSEA', '', 'BC17728938112284412', '2026-03-07 22:30:11', '', 0, NULL, NULL),
(26, '123123', 'Luna', 'M', 'Toka', 'lunatoka@gmail.com', '$2b$10$5s.sqyEQozw1ukpJCFToSuFsmPmhTvxjspj9koWCt/tmP8ORg7wFC', '2nd Year', '+639455415405', 'BS in Criminology', '', 'BC17730263477958911', '2026-03-09 11:19:07', '', 0, NULL, NULL),
(28, '456', 'Andria', 'A', 'Ramirez', 'andria@gmail.com', '$2b$10$sO26fMQvVakQtiCy4Zoal.Yn09ulCejCe61giWID5iWnna/nuCs0K', '1st Year', '+639615842358', 'BS Education', '', 'BC17731513173571253', '2026-03-10 22:01:57', '', 0, NULL, NULL),
(29, '1231574', 'Alexander', 'L', 'Magbitang', 'alexander.magbitang.ecoast@panpacificu.edu.ph', '$2b$10$sz2Q0ajsshSDGiQOkeWv0.NrqzTMDw5DxxPO7qJRgVkXDu0zAYNVW', '3rd Year', '+639455964091', 'BS in Information Technology', '', 'BC17732101025598406', '2026-03-11 14:21:42', '', 0, NULL, NULL),
(32, '12313598', 'Princess', 'O', 'Obillo (ECoAST)', 'princess.obillo.ecoast@panpacificu.edu.ph', '$2b$10$OJRhAThkJPVmRtZKwn3TgumarOGVk/t16kx3llQsT2hn/xSknESa.', '3rd Year', '+639763891308', 'BS in Information Technology', '', 'BC17732896532762650', '2026-03-12 12:27:33', '', 0, NULL, NULL),
(33, '12312312312', 'Marfel Gem', 'A', 'Gallarde (ECoAST)', 'marfel.gallarde.ecoast@panpacificu.edu.ph', '$2b$10$tKtaOIS4wk/b8R9x/bw9Fee6fVO54mEl2S9jjzGtsOKFMwlRGBJPO', '4th Year', '+639763891308', 'BS in Computer Engineering', '', 'BC17732910277928988', '2026-03-12 12:50:27', '', 0, NULL, NULL),
(35, '1231231231231', 'Natsu', 'B', 'Dragneel', 'xnatsu25@gmail.com', '$2b$10$z2EKEoHbu6d0TBxeh2BgnezZJCcTCB.6mSjVoYM9nakkmUaeUFMK2', '3rd Year', '+63639763891308', 'BS in Information Technology', '', 'BC17741978032688002', '2026-03-23 00:43:23', '5fd6d04e115bc91553eef8cc76799725738ec5dca241a58d5c924d3e185c623a', 0, 'TSN17698767256291441', 'student-1774204990603-169913.png'),
(41, '123123123', 'Angel Mageri', 'A', 'Cabote (ECoAST)', 'angel.cabote.ecoast@panpacificu.edu.ph', '$2b$10$FUo8ACmR2EdY44cNkkLNvuPknzBlR/EnpRy3nWZ2T2Ou5r1GlVlGe', '3rd Year', '+639763891307', 'BS in Information Technology', '', 'BC17741978321072707', '2026-03-23 00:43:52', '5fd6d04e115bc91553eef8cc76799725738ec5dca241a58d5c924d3e185c623a', 0, 'TSN17698767256291441', 'student-1774204811919-842386.jpg'),
(42, '737773', 'Zaiejan', 'A', 'Agustin', 'zaiejanagustin@gmail.com', '$2b$10$siGOJgd3GAIWr85GZy0p3OcoaXjkulNqVh1.aCfaJVCNyfs.NsUju', '3rd Year', '+639763891308', 'BS in Information Technology', '', 'BC17736449111529783', '2026-03-16 15:08:31', '8596927ce8a26ec5db6831cb162f7da752db54b19ec598e9714fb28fcbbdda54', 0, NULL, NULL),
(43, '1231392', 'Jan Ray', 'Agmata', 'Aquino', 'janrayaquino9@gmail.com', '$2b$10$ILpPmsYI.iv3Y9BAWj6AK.ht72RhYFkLxP8hd8RfPebBWKqc6khYu', '3rd Year', '+6309661672889', 'BS in Information Technology', '', 'BC17736592032317119', '2026-03-16 19:06:43', '', 0, NULL, NULL),
(44, '1010', 'Jasmin', 'A', 'Pastor', 'jasmin@gmail.com', '$2b$10$H/YJjdnT2pZemnE6pStiSOpXJFwJbrcP./632TD6BR0Zc61ai69Ki', 'SBE', '+63639615842353', 'BS in Mechanics', '', 'BC17739113039904719', '2026-03-19 17:14:11', '', 0, 'TSN17739090200094291', NULL),
(46, '1231377', 'Steven John', 'A', 'Agustin (CoAST)', 'steven.agustin.ecoast@panpacificu.edu.ph', '$2b$10$9CJD/U5MPDMB/3.f18vYSeklWLX1TT90cl4Q6ls0sow54K3TDY61O', '3rd Year', '+639763891308', 'BS in Information Technology', '', 'BC17741971412966285', '2026-03-23 00:32:21', '5fd6d04e115bc91553eef8cc76799725738ec5dca241a58d5c924d3e185c623a', 0, 'TSN17698767256291441', NULL),
(47, '67', 'Yuumi', 'A', 'Kiyomi', 'example@panpacificu.edu.ph', '$2b$10$nyCzO4gK0WKF9Uc0y23nUOuueYCmnqzVZf7r/HgNL4fgYk6IDSl8S', '2nd Year', '+636767676767', 'BS in Mechanics', '', 'BC17741610878194590', '2026-03-22 14:37:38', 'fb311b2397651ca64b39658572971b21aef645f36ba2d6ac45b9ff8683585e05', 0, 'TSN17736807667173940', 'student-1774161481694-153469.jpg'),
(48, '12313795', 'Albert', 'A', 'Wesker', 'albert@panpacificu.edu.ph', '$2b$10$ma7s87MRnZwc1LNpU/jUj.YKiAeNHoonX3Cx.bdkQSLq4xe6yHZ3C', '3rd Year', '+639481239328', 'BS in Information Technology', '', 'BC17741792669036245', '2026-03-22 19:34:26', '5fd6d04e115bc91553eef8cc76799725738ec5dca241a58d5c924d3e185c623a', 0, NULL, NULL),
(49, '897', 'Andrea', 'A', 'Lachica', 'andrea.lachica@panpacificu.edu.ph', '$2b$10$Bjns138ua26/ukNYd4t8xu.HT1Vzx9NsRMwdv4Bzn60EfW4cHHx6O', '3rd Year', '+63639195366089', 'BS in Information Technology', '', 'BC17742401247732238', '2026-03-23 12:28:44', '1f2079e418f7ebd0d36bbd234af6f77ae33b044a2fc69f0a207f50748482897b', 0, NULL, NULL);

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
(27, '12313598', 'Princess', 'O', 'Obillo (ECoAST)', 'princess.obillo.ecoast@panpacificu.edu.ph', '3rd Year', '+639763891308', NULL, 'BS in Information Technology', 'TSN17698767256291441', '2026-03-12 15:31:57'),
(28, '1231231231231', 'Natsu', 'A', 'Dragneel', 'xnatsu25@gmail.com', '3rd Year', '+63639763891308', NULL, 'BS in Information Technology', 'TSN17698767256291441', '2026-03-12 17:56:50'),
(34, '1231333', 'Lucy', 'A', 'Heartfilla', 'lucy@panpacificu.edu.ph', '3rd Year', '+639763891308', NULL, 'BS in Information Technology', 'TSN17734603098321716', '2026-03-14 12:58:54'),
(36, '123123123', 'Angel Mageri', 'A', 'Cabote (ECoAST)', 'angel.cabote.ecoast@panpacificu.edu.ph', '3rd Year', '+639763891307', NULL, 'BS in Information Technology', 'TSN17734603098321716', '2026-03-14 15:23:15'),
(41, '14567', 'Diane', 'A', 'Chua', 'dwynna@gmail.com', '3rd Year', '+639195364085', NULL, 'RPSEA', 'TSN17734603098321716', '2026-03-14 15:29:45'),
(42, '14567', 'Diane', 'A', 'Chua', 'dwynna@gmail.com', '3rd Year', '+639195364085', NULL, 'RPSEA', 'TSN17698767256291441', '2026-03-14 15:29:51'),
(44, '12312312312', 'Marfel Gem', 'A', 'Gallarde (ECoAST)', 'marfel.gallarde.ecoast@panpacificu.edu.ph', '4th Year', '+639763891308', NULL, 'BS in Computer Engineering', 'TSN17698767256291441', '2026-03-15 10:43:01'),
(45, '1231333', 'Lucy', 'A', 'Heartfilla', 'lucy@panpacificu.edu.ph', '3rd Year', '+639763891308', NULL, 'BS in Information Technology', 'TSN17698767256291441', '2026-03-15 10:49:14'),
(46, '123123123', 'Angel Mageri', 'A', 'Cabote (ECoAST)', 'angel.cabote.ecoast@panpacificu.edu.ph', '3rd Year', '+639763891307', NULL, 'BS in Information Technology', 'TSN17698767256291441', '2026-03-15 10:49:22'),
(48, '456', 'Andria', 'A', 'Ramirez', 'andria@gmail.com', '1st Year', '+639615842358', NULL, 'BS Education', 'TSN17698767256291441', '2026-03-16 12:17:18'),
(49, '737773', 'Zaiejan', 'A', 'Agustin', 'zaiejanagustin@gmail.com', '3rd Year', '+639763891308', NULL, 'BS in Information Technology', 'TSN17698767256291441', '2026-03-16 15:09:21'),
(50, '123123123', 'Angel Mageri', 'A', 'Cabote (ECoAST)', 'angel.cabote.ecoast@panpacificu.edu.ph', '3rd Year', '+639763891307', NULL, 'BS in Information Technology', 'TSN17736807667173940', '2026-03-17 01:08:41'),
(51, '1231333', 'Lucy', 'A', 'Heartfilla', 'lucy@panpacificu.edu.ph', '3rd Year', '+639763891308', NULL, 'BS in Information Technology', 'TSN17736807667173940', '2026-03-19 13:18:46'),
(52, '123123123', 'Angel Mageri', 'A', 'Cabote (ECoAST)', 'angel.cabote.ecoast@panpacificu.edu.ph', '3rd Year', '+639763891307', NULL, 'BS in Information Technology', 'TSN17739090200094291', '2026-03-19 17:00:52'),
(53, '1010', 'Jasmin', 'A', 'Pastor', 'jasmin@gmail.com', 'SBE', '+63639615842353', NULL, 'BS in Mechanics', 'TSN17739090200094291', '2026-03-19 17:09:56'),
(54, '1010', 'Jasmin', 'A', 'Pastor', 'jasmin@gmail.com', 'SBE', '+63639615842353', NULL, 'BS in Mechanics', 'TSN17736807667173940', '2026-03-19 17:13:42'),
(56, '1231377', 'Steven John', 'A', 'Agustin (CoAST)', 'steven.agustin.ecoast@panpacificu.edu.ph', '3rd Year', '+639763891308', NULL, 'BS in Information Technology', 'TSN17698767256291441', '2026-03-20 00:57:00'),
(57, '1231377', 'Steven John', 'A', 'Agustin (CoAST)', 'steven.agustin.ecoast@panpacificu.edu.ph', '3rd Year', '+639763891308', NULL, 'BS in Information Technology', 'TSN17736807667173940', '2026-03-20 00:57:14'),
(58, '1010', 'Jasmin', 'A', 'Pastor', 'jasmin@gmail.com', 'SBE', '+63639615842353', NULL, 'BS in Mechanics', 'TSN17698767256291441', '2026-03-20 17:31:10'),
(59, '1231574', 'Alexander', 'L', 'Magbitang', 'alexander.magbitang.ecoast@panpacificu.edu.ph', '3rd Year', '+639455964091', NULL, 'BS in Information Technology', 'TSN17698767256291441', '2026-03-22 13:02:10'),
(60, '67', 'Yuumi', 'A', 'Kiyomi', 'example@panpacificu.edu.ph', '2nd Year', '+636767676767', NULL, 'BS in Mechanics', 'TSN17736807667173940', '2026-03-22 14:37:32');

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
(19, 'App Dev', '2026-03-14 12:56:12', 17),
(22, 'Database Lec', '2026-03-16 12:16:48', 7),
(23, 'Computer Programming', '2026-03-19 12:40:03', 18),
(24, 'Physics', '2026-03-19 12:40:14', 18),
(25, 'Math', '2026-03-19 16:33:30', 19),
(26, 'Mathematics', '2026-03-22 12:41:49', 18);

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
(10, '', '', 'TSN17719241460167887'),
(11, '', '', 'TSN17734601215899710'),
(12, 'App Dev', '3rd Year', 'TSN17734603098321716'),
(13, 'Mathematics', '2nd Year', 'TSN17736807667173940'),
(14, 'Math', 'SBE', 'TSN17739090200094291');

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
(1, 'Super Administrator', 'superadmin@panpacificu.edu.ph', '$2b$10$d4kXfzxstDkpQPR5Gp8YZeove4F2/T5Ga/EaS8g7y9c4ddf9HITP6', 'superadmin-1774242535609-552779.png', '2026-03-15 11:22:58');

-- --------------------------------------------------------

--
-- Table structure for table `system_activity_logs`
--

CREATE TABLE `system_activity_logs` (
  `log_id` int(11) NOT NULL,
  `actor_id` int(11) DEFAULT NULL,
  `actor_name` varchar(255) DEFAULT NULL,
  `actor_role` enum('student','teacher','guard','admin','super_admin') NOT NULL,
  `action` varchar(100) NOT NULL,
  `target_type` varchar(100) DEFAULT NULL,
  `target_id` varchar(100) DEFAULT NULL,
  `target_name` varchar(255) DEFAULT NULL,
  `details` text DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `device_info` text DEFAULT NULL,
  `performed_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `system_activity_logs`
--

INSERT INTO `system_activity_logs` (`log_id`, `actor_id`, `actor_name`, `actor_role`, `action`, `target_type`, `target_id`, `target_name`, `details`, `ip_address`, `device_info`, `performed_at`) VALUES
(1, 7, 'Steven John A. Agustin', 'teacher', 'MANUAL_ATTENDANCE', 'Class Attendance', '1231426', 'Charimea M. Selga', 'Manual entry by Steven John A. Agustin — Program: BS in Information Technology, Year: 3rd Year', NULL, NULL, '2026-03-16 11:53:26'),
(2, 7, 'Steven John A. Agustin', 'teacher', 'SET_LOCATION', 'Location', '7', NULL, 'Set location: lat 15.94, lng 120.52, radius 50m', NULL, NULL, '2026-03-16 12:06:17'),
(3, 7, 'Steven John A. Agustin', 'teacher', 'DELETE_STUDENT_RECORD', 'Student', '23', NULL, 'Removed student record ID: 23 from class', NULL, NULL, '2026-03-16 12:07:28'),
(4, 7, 'Steven John A. Agustin', 'teacher', 'ADD_STUDENT_TO_CLASS', 'Student', '456', 'Andria Ramirez', 'Added by Steven John A. Agustin — Program: BS Education, Year: 1st Year', NULL, NULL, '2026-03-16 12:08:11'),
(5, 7, 'Steven John A. Agustin', 'teacher', 'EDIT_STUDENT_RECORD', 'Student', '47', 'Andria Ramirez', 'Edited class record: 4567878', NULL, NULL, '2026-03-16 12:08:32'),
(6, 7, 'Steven John A. Agustin', 'teacher', 'DELETE_SUBJECT', 'Subject', '21', NULL, 'Deleted subject ID: 21', NULL, NULL, '2026-03-16 12:08:49'),
(7, 1, 'CSS Administrator', 'admin', 'EDIT_STUDENT', 'Student', '41', 'Angel Mageri Cabote (ECoAST)', 'Edited student ID: 41 — BS in Information Technology 3rd Year', NULL, NULL, '2026-03-16 12:12:29'),
(8, 7, 'Steven John A. Agustin', 'teacher', 'SET_LOCATION', 'Location', '7', NULL, 'Set location: lat 15.94, lng 120.52, radius 50m', NULL, NULL, '2026-03-16 12:15:47'),
(9, 7, 'Steven John A. Agustin', 'teacher', 'SET_SUBJECT_YEAR_LEVEL', 'Class Setup', '', 'Big Data', 'Set subject: Big Data, year level: 1st Year', NULL, NULL, '2026-03-16 12:16:01'),
(10, 7, 'Steven John A. Agustin', 'teacher', 'ADD_SUBJECT', 'Subject', '', 'Database Lec', 'Added subject: Database Lec', NULL, NULL, '2026-03-16 12:16:48'),
(11, 7, 'Steven John A. Agustin', 'teacher', 'DELETE_STUDENT_RECORD', 'Student', '', 'Andria Ramirez', 'Removed Andria Ramirez from class', NULL, NULL, '2026-03-16 12:17:03'),
(12, 7, 'Steven John A. Agustin', 'teacher', 'ADD_STUDENT_TO_CLASS', 'Student', '456', 'Andria Ramirez', 'Added by Steven John A. Agustin — Program: BS Education, Year: 1st Year', NULL, NULL, '2026-03-16 12:17:18'),
(13, 1, 'CSS Administrator', 'admin', 'SET_EVENT', 'Event', '', 'Foundation day', 'Set event name to: Foundation day', NULL, NULL, '2026-03-16 12:19:49'),
(14, 1, 'CSS Administrator', 'admin', 'DELETE_YEAR_LEVEL', 'Year Level', '8', NULL, 'Deleted year level ID: 8', NULL, NULL, '2026-03-16 12:20:13'),
(15, 1, 'CSS Administrator', 'admin', 'ADD_YEAR_LEVEL', 'Year Level', '', 'Sample For Debugging', 'Added year level: Sample For Debugging', NULL, NULL, '2026-03-16 12:20:23'),
(16, 1, 'CSS Administrator', 'admin', 'ADD_PROGRAM', 'Program', '', 'BS in Mechanics', 'Added program: BS in Mechanics', NULL, NULL, '2026-03-16 12:21:00'),
(17, 1, 'CSS Administrator', 'admin', 'EDIT_STUDENT', 'Student', '18', 'Agrifina Agaran', 'Edited student ID: 18 — BS Education 3rd Year', NULL, NULL, '2026-03-16 12:21:23'),
(18, NULL, NULL, 'admin', 'DELETE_STUDENT', 'Student', '22', NULL, 'Deleted student ID: 22', NULL, NULL, '2026-03-16 12:22:06'),
(19, 1, 'CSS Administrator', 'admin', 'ADD_PROGRAM', 'Program', '', 'sdfsdf', 'Added program: sdfsdf', NULL, NULL, '2026-03-16 12:33:13'),
(20, 1, 'CSS Administrator', 'admin', 'DELETE_PROGRAM', 'Program', '', 'sdfsdf', 'Deleted program: sdfsdf', NULL, NULL, '2026-03-16 12:33:24'),
(21, 1, 'CSS Administrator', 'admin', 'EDIT_GUARD', 'Guard', '', 'Gray Fullbusters', 'Edited guard: Gray Fullbusters — location: Main Gate', NULL, NULL, '2026-03-16 12:33:46'),
(22, 1, 'CSS Administrator', 'admin', 'DELETE_YEAR_LEVEL', 'Year Level', '', 'Sample For Debugging', 'Deleted year level: Sample For Debugging', NULL, NULL, '2026-03-16 12:34:37'),
(23, 1, 'CSS Administrator', 'admin', 'ADD_YEAR_LEVEL', 'Year Level', '', 'Sample For Debugging', 'Added year level: Sample For Debugging', NULL, NULL, '2026-03-16 12:34:47'),
(24, 1, 'CSS Administrator', 'admin', 'CHANGE_NAME', 'Admin', '1', 'CSS Administrator', 'Changed name to: CSS Administrator', NULL, NULL, '2026-03-16 12:35:19'),
(25, 35, 'Natsu Dragneel', 'student', 'REGENERATE_BARCODE', 'Student', '', 'Natsu Dragneel', 'Regenerated barcode — ID No: 1231231231231', NULL, NULL, '2026-03-16 12:41:09'),
(26, 35, 'Natsu Dragneel', 'student', 'UPDATE_PROFILE', 'Student', '', 'Natsu Dragneel', 'Updated profile — ID No: 1231231231231', NULL, NULL, '2026-03-16 12:41:35'),
(27, 42, 'Zaiejan Agustin', 'student', 'UPDATE_PROFILE', 'Student', '', 'Zaiejan Agustin', 'Updated profile — ID No: 737773', NULL, NULL, '2026-03-16 15:09:04'),
(28, 7, 'Steven John A. Agustin', 'teacher', 'ADD_STUDENT_TO_CLASS', 'Student', '737773', 'Zaiejan Agustin', 'Added by Steven John A. Agustin — Program: BS in Information Technology, Year: 3rd Year', NULL, NULL, '2026-03-16 15:09:21'),
(29, 7, 'Steven John A. Agustin', 'teacher', 'SET_SUBJECT_YEAR_LEVEL', 'Class Setup', '', 'Programming', 'Set subject: Programming, year level: 3rd Year', NULL, NULL, '2026-03-16 15:09:33'),
(30, 7, 'Steven John A. Agustin', 'teacher', 'SET_LOCATION', 'Location', '7', NULL, 'Set location: lat 16.017917, lng 120.7498184, radius 100m', NULL, NULL, '2026-03-16 15:13:47'),
(31, 1, 'CSS Administrator', 'admin', 'DELETE_TEACHER', 'Teacher', '', 'Charimea Selga', 'Deleted teacher: Charimea Selga', NULL, NULL, '2026-03-16 15:15:59'),
(32, 1, NULL, 'admin', 'DELETE_TEACHER', 'Teacher', '17', NULL, 'Deleted teacher ID: 17', NULL, NULL, '2026-03-16 15:15:59'),
(33, 1, NULL, 'admin', 'DELETE_TEACHER', 'Teacher', '16', NULL, 'Deleted teacher ID: 16', NULL, NULL, '2026-03-16 15:16:02'),
(34, 1, 'CSS Administrator', 'admin', 'DELETE_TEACHER', 'Teacher', '', 'Andrea Lachica', 'Deleted teacher: Andrea Lachica', NULL, NULL, '2026-03-16 15:16:02'),
(35, 1, NULL, 'admin', 'DELETE_TEACHER', 'Teacher', '15', NULL, 'Deleted teacher ID: 15', NULL, NULL, '2026-03-16 15:16:05'),
(36, 1, 'CSS Administrator', 'admin', 'DELETE_TEACHER', 'Teacher', '', 'Mark Zuckerberg', 'Deleted teacher: Mark Zuckerberg', NULL, NULL, '2026-03-16 15:16:05'),
(37, 1, NULL, 'admin', 'DELETE_TEACHER', 'Teacher', '14', NULL, 'Deleted teacher ID: 14', NULL, NULL, '2026-03-16 15:16:08'),
(38, 1, 'CSS Administrator', 'admin', 'DELETE_TEACHER', 'Teacher', '', 'Elon Musk', 'Deleted teacher: Elon Musk', NULL, NULL, '2026-03-16 15:16:08'),
(39, 1, NULL, 'admin', 'DELETE_TEACHER', 'Teacher', '11', NULL, 'Deleted teacher ID: 11', NULL, NULL, '2026-03-16 15:16:12'),
(40, 1, 'CSS Administrator', 'admin', 'DELETE_TEACHER', 'Teacher', '', 'Bill Gates', 'Deleted teacher: Bill Gates', NULL, NULL, '2026-03-16 15:16:12'),
(41, 7, 'Steven John A. Agustin', 'teacher', 'SET_LOCATION', 'Location', '7', NULL, 'Set location: lat 16.017917, lng 120.7498184, radius 100m', NULL, NULL, '2026-03-16 15:16:17'),
(42, 7, 'Steven John A. Agustin', 'teacher', 'SET_LOCATION', 'Location', '7', NULL, 'Set location: lat 15.94, lng 120.53, radius 100m', NULL, NULL, '2026-03-16 15:16:55'),
(43, 7, 'Steven John A. Agustin', 'teacher', 'SET_LOCATION', 'Location', '7', NULL, 'Set location: lat 16.017917, lng 120.7498184, radius 100m', NULL, NULL, '2026-03-16 15:17:57'),
(44, 42, 'Zaiejan A. Agustin', 'student', 'CLASS_ATTENDANCE_IN', 'Class Attendance', '737773', 'Zaiejan A. Agustin', 'Teacher: Unknown | Program: BS in Information Technology, Year: 3rd Year', NULL, NULL, '2026-03-16 15:19:10'),
(45, 42, 'Zaiejan A. Agustin', 'student', 'CLASS_ATTENDANCE_IN', 'Class Attendance', '737773', 'Zaiejan A. Agustin', 'Teacher: Unknown | Program: BS in Information Technology, Year: 3rd Year', NULL, NULL, '2026-03-16 15:22:10'),
(46, 42, 'Zaiejan A. Agustin', 'student', 'CLASS_ATTENDANCE_IN', 'Class Attendance', '737773', 'Zaiejan A. Agustin', 'Teacher: Unknown | Program: BS in Information Technology, Year: 3rd Year', NULL, NULL, '2026-03-16 15:28:15'),
(47, 7, 'Steven John A. Agustin', 'teacher', 'SET_LOCATION', 'Location', '7', NULL, 'Set location: lat 15.94, lng 120.53, radius 100m', NULL, NULL, '2026-03-16 19:06:13'),
(48, 7, 'Steven John A. Agustin', 'teacher', 'MANUAL_ATTENDANCE', 'Class Attendance', '12312313787', 'Steven John A. Agustin (CoAST)', 'Manual entry by Steven John A. Agustin — Program: BS in Information Technology, Year: 3rd Year', NULL, NULL, '2026-03-16 21:01:44'),
(49, 7, 'Steven John A. Agustin', 'teacher', 'MANUAL_ATTENDANCE', 'Class Attendance', '1231231231231', 'Natsu A. Dragneel', 'Manual entry by Steven John A. Agustin — Program: BS in Information Technology, Year: 3rd Year', NULL, NULL, '2026-03-16 21:01:47'),
(50, 7, 'Steven John A. Agustin', 'teacher', 'MANUAL_ATTENDANCE', 'Class Attendance', '12313598', 'Princess O. Obillo (ECoAST)', 'Manual entry by Steven John A. Agustin — Program: BS in Information Technology, Year: 3rd Year', NULL, NULL, '2026-03-16 21:01:50'),
(51, 7, 'Steven John A. Agustin', 'teacher', 'MANUAL_ATTENDANCE', 'Class Attendance', '123123123', 'Angel Mageri A. Cabote (ECoAST)', 'Manual entry by Steven John A. Agustin — Program: BS in Information Technology, Year: 3rd Year', NULL, NULL, '2026-03-16 21:01:54'),
(52, 7, 'Steven John A. Agustin', 'teacher', 'MANUAL_ATTENDANCE', 'Class Attendance', '14567', 'Diane A. Chua', 'Manual entry by Steven John A. Agustin — Program: RPSEA, Year: 3rd Year', NULL, NULL, '2026-03-16 21:02:01'),
(53, 7, 'Steven John A. Agustin', 'teacher', 'MANUAL_ATTENDANCE', 'Class Attendance', '1231333', 'Lucy A. Heartfilla', 'Manual entry by Steven John A. Agustin — Program: BS in Information Technology, Year: 3rd Year', NULL, NULL, '2026-03-16 21:02:03'),
(54, 41, 'Angel Mageri Cabote (ECoAST)', 'student', 'REGENERATE_BARCODE', 'Student', '', 'Angel Mageri Cabote (ECoAST)', 'Regenerated barcode — ID No: 123123123', NULL, NULL, '2026-03-17 00:58:51'),
(55, 1, NULL, 'admin', 'CREATE_TEACHER', 'Teacher', '18', 'Mark Zuckerberg', 'Registered teacher: markzuckerberg@panpacificu.edu.ph, Dept: BS in Information Technology', NULL, NULL, '2026-03-17 01:06:06'),
(56, 18, 'Mark Zuckerberg', 'teacher', 'ADD_STUDENT_TO_CLASS', 'Student', '123123123', 'Angel Mageri Cabote (ECoAST)', 'Added by Mark Zuckerberg — Program: BS in Information Technology, Year: 3rd Year', NULL, NULL, '2026-03-17 01:08:41'),
(57, 7, 'Steven John A. Agustin', 'teacher', 'SET_LOCATION', 'Location', '7', NULL, 'Set location: lat 16.0178972, lng 120.7498142, radius 100m', NULL, NULL, '2026-03-17 01:09:59'),
(58, 18, 'Mark Zuckerberg', 'teacher', 'SET_LOCATION', 'Location', '18', NULL, 'Set location: lat 15.94, lng 120.53, radius 100m', NULL, NULL, '2026-03-17 01:10:24'),
(59, 18, 'Mark Zuckerberg', 'teacher', 'SET_LOCATION', 'Location', '18', NULL, 'Set location: lat 15.997635337659018, lng 120.47367095947267, radius 100m', NULL, NULL, '2026-03-17 01:10:38'),
(60, 18, 'Mark Zuckerberg', 'teacher', 'ADD_SUBJECT', 'Subject', '', 'Computer Programming', 'Added subject: Computer Programming', NULL, NULL, '2026-03-19 12:40:03'),
(61, 18, 'Mark Zuckerberg', 'teacher', 'ADD_SUBJECT', 'Subject', '', 'Physics', 'Added subject: Physics', NULL, NULL, '2026-03-19 12:40:14'),
(62, 18, 'Mark Zuckerberg', 'teacher', 'SET_SUBJECT_YEAR_LEVEL', 'Class Setup', '', 'Physics', 'Set subject: Physics, year level: 3rd Year', NULL, NULL, '2026-03-19 12:40:22'),
(63, 18, 'Mark Zuckerberg', 'teacher', 'SET_LOCATION', 'Location', '18', NULL, 'Set location: lat 15.93, lng 120.51, radius 100m', NULL, NULL, '2026-03-19 12:40:43'),
(64, 41, 'Angel Mageri Cabote (ECoAST)', 'student', 'REGENERATE_BARCODE', 'Student', '', 'Angel Mageri Cabote (ECoAST)', 'Regenerated barcode — ID No: 123123123', NULL, NULL, '2026-03-19 12:41:27'),
(65, 7, 'Steven John A. Agustin', 'teacher', 'SET_SUBJECT_YEAR_LEVEL', 'Class Setup', '', 'Event-Driven Programming', 'Set subject: Event-Driven Programming, year level: 3rd Year', NULL, NULL, '2026-03-19 13:15:35'),
(66, 7, 'Steven John A. Agustin', 'teacher', 'SET_LOCATION', 'Location', '7', NULL, 'Set location: lat 15.93, lng 120.51, radius 100m', NULL, NULL, '2026-03-19 13:15:41'),
(67, 7, 'Steven John A. Agustin', 'teacher', 'SET_LOCATION', 'Location', '7', NULL, 'Set location: lat 16.01795, lng 120.7497792, radius 100m', NULL, NULL, '2026-03-19 13:17:56'),
(68, 23, 'Lucy Heartfilla', 'student', 'REGENERATE_BARCODE', 'Student', '', 'Lucy Heartfilla', 'Regenerated barcode — ID No: 1231333', NULL, NULL, '2026-03-19 13:18:19'),
(69, 18, 'Mark Zuckerberg', 'teacher', 'ADD_STUDENT_TO_CLASS', 'Student', '1231333', 'Lucy Heartfilla', 'Added by Mark Zuckerberg — Program: BS in Information Technology, Year: 3rd Year', NULL, NULL, '2026-03-19 13:18:46'),
(70, 18, 'Mark Zuckerberg', 'teacher', 'SET_LOCATION', 'Location', '18', NULL, 'Set location: lat 16.01841563923227, lng 120.75151562690736, radius 100m', NULL, NULL, '2026-03-19 13:22:07'),
(71, 18, 'Mark Zuckerberg', 'teacher', 'SET_LOCATION', 'Location', '18', NULL, 'Set location: lat 16.01823001832003, lng 120.75122594833375, radius 100m', NULL, NULL, '2026-03-19 13:22:54'),
(72, 18, 'Mark Zuckerberg', 'teacher', 'SET_LOCATION', 'Location', '18', NULL, 'Set location: lat 16.0178690882742, lng 120.74990630149843, radius 100m', NULL, NULL, '2026-03-19 13:23:29'),
(73, 23, 'Lucy A. Heartfilla', 'student', 'CLASS_ATTENDANCE_IN', 'Class Attendance', '1231333', 'Lucy A. Heartfilla', 'Teacher: Unknown | Program: BS in Information Technology, Year: 3rd Year', NULL, NULL, '2026-03-19 13:24:35'),
(74, 23, 'Lucy Heartfilla', 'student', 'REGENERATE_BARCODE', 'Student', '', 'Lucy Heartfilla', 'Regenerated barcode — ID No: 1231333', NULL, NULL, '2026-03-19 14:29:18'),
(75, 23, 'Lucy Heartfilla', 'student', 'REGENERATE_BARCODE', 'Student', '', 'Lucy Heartfilla', 'Regenerated barcode — ID No: 1231333', NULL, NULL, '2026-03-19 14:29:26'),
(76, 23, 'Lucy Heartfilla', 'student', 'REGENERATE_BARCODE', 'Student', '', 'Lucy Heartfilla', 'Regenerated barcode — ID No: 1231333', NULL, NULL, '2026-03-19 14:30:09'),
(77, 23, 'Lucy Heartfilla', 'student', 'REGENERATE_BARCODE', 'Student', '', 'Lucy Heartfilla', 'Regenerated barcode — ID No: 1231333', NULL, NULL, '2026-03-19 14:37:37'),
(78, 23, 'Lucy Heartfilla', 'student', 'REGENERATE_BARCODE', 'Student', '', 'Lucy Heartfilla', 'Regenerated barcode — ID No: 1231333', NULL, NULL, '2026-03-19 14:37:45'),
(79, 23, 'Lucy Heartfilla', 'student', 'REGENERATE_BARCODE', 'Student', '', 'Lucy Heartfilla', 'Regenerated barcode — ID No: 1231333', NULL, NULL, '2026-03-19 14:38:27'),
(80, 23, 'Lucy A. Heartfilla', 'student', 'CLASS_ATTENDANCE_IN', 'Class Attendance', '1231333', 'Lucy A. Heartfilla', 'Teacher: Unknown | Program: BS in Information Technology, Year: 3rd Year', NULL, NULL, '2026-03-19 14:38:35'),
(81, 1, NULL, 'admin', 'CREATE_TEACHER', 'Teacher', '19', 'Andrea Lachica', 'Registered teacher: andrea@panpacificu.edu.ph, Dept: BS in Criminology', NULL, NULL, '2026-03-19 16:30:20'),
(82, 19, 'Andrea Lachica', 'teacher', 'ADD_SUBJECT', 'Subject', '', 'Math', 'Added subject: Math', NULL, NULL, '2026-03-19 16:33:30'),
(83, 1, 'CSS Administrator', 'admin', 'ADD_YEAR_LEVEL', 'Year Level', '', 'SBE', 'Added year level: SBE', NULL, NULL, '2026-03-19 16:34:09'),
(84, 19, 'Andrea Lachica', 'teacher', 'SET_SUBJECT_YEAR_LEVEL', 'Class Setup', '', 'Math', 'Set subject: Math, year level: SBE', NULL, NULL, '2026-03-19 16:34:33'),
(85, 19, 'Andrea Lachica', 'teacher', 'SET_LOCATION', 'Location', '19', NULL, 'Set location: lat 16.0262007, lng 120.7763676, radius 50m', NULL, NULL, '2026-03-19 16:34:49'),
(86, 1, 'CSS Administrator', 'admin', 'DELETE_YEAR_LEVEL', 'Year Level', '', 'Sample For Debugging', 'Deleted year level: Sample For Debugging', NULL, NULL, '2026-03-19 16:42:42'),
(87, 19, 'Andrea Lachica', 'teacher', 'ADD_STUDENT_TO_CLASS', 'Student', '123123123', 'Angel Mageri Cabote (ECoAST)', 'Added by Andrea Lachica — Program: BS in Information Technology, Year: 3rd Year', NULL, NULL, '2026-03-19 17:00:52'),
(88, 19, 'Andrea Lachica', 'teacher', 'ADD_STUDENT_TO_CLASS', 'Student', '1010', 'Jasmin Pastor', 'Added by Andrea Lachica — Program: BS in Mechanics, Year: SBE', NULL, NULL, '2026-03-19 17:09:56'),
(89, 19, 'Andrea Lachica', 'teacher', 'SET_LOCATION', 'Location', '19', NULL, 'Set location: lat 16.026207, lng 120.7763817, radius 50m', NULL, NULL, '2026-03-19 17:10:06'),
(90, 44, 'Jasmin Pastor', 'student', 'REGENERATE_BARCODE', 'Student', '', 'Jasmin Pastor', 'Regenerated barcode — ID No: 1010', NULL, NULL, '2026-03-19 17:12:58'),
(91, 44, 'Jasmin Pastor', 'student', 'REGENERATE_BARCODE', 'Student', '', 'Jasmin Pastor', 'Regenerated barcode — ID No: 1010', NULL, NULL, '2026-03-19 17:13:05'),
(92, 44, 'Jasmin Pastor', 'student', 'REGENERATE_BARCODE', 'Student', '', 'Jasmin Pastor', 'Regenerated barcode — ID No: 1010', NULL, NULL, '2026-03-19 17:13:24'),
(93, 18, 'Mark Zuckerberg', 'teacher', 'ADD_STUDENT_TO_CLASS', 'Student', '1010', 'Jasmin Pastor', 'Added by Mark Zuckerberg — Program: BS in Mechanics, Year: SBE', NULL, NULL, '2026-03-19 17:13:42'),
(94, 18, 'Mark Zuckerberg', 'teacher', 'SET_LOCATION', 'Location', '18', NULL, 'Set location: lat 15.9198886, lng 120.4876399, radius 55m', NULL, NULL, '2026-03-19 17:13:55'),
(95, 44, 'Jasmin Pastor', 'student', 'REGENERATE_BARCODE', 'Student', '', 'Jasmin Pastor', 'Regenerated barcode — ID No: 1010', NULL, NULL, '2026-03-19 17:14:11'),
(96, NULL, 'Super Admin', 'super_admin', 'RESET_ADMIN_PASSWORD', 'Admin', '1', NULL, 'Reset password for admin ID: 1', NULL, NULL, '2026-03-19 17:21:40'),
(97, NULL, 'Super Admin', 'super_admin', 'RESET_ADMIN_PASSWORD', 'Admin', '1', NULL, 'Reset password for admin ID: 1', NULL, NULL, '2026-03-19 17:22:29'),
(98, 18, 'Mark Zuckerberg', 'teacher', 'SET_LOCATION', 'Location', '18', NULL, 'Set location: lat 16.0177247160731, lng 120.74926257133485, radius 100m', NULL, NULL, '2026-03-19 17:48:55'),
(99, 23, 'Lucy Heartfilla', 'student', 'REGENERATE_BARCODE', 'Student', '', 'Lucy Heartfilla', 'Regenerated barcode — ID No: 1231333', NULL, NULL, '2026-03-19 17:49:12'),
(100, 23, 'Lucy A. Heartfilla', 'student', 'CLASS_ATTENDANCE_IN', 'Class Attendance', '1231333', 'Lucy A. Heartfilla', 'Teacher: Mark Zuckerberg | Program: BS in Information Technology, Year: 3rd Year', NULL, NULL, '2026-03-19 17:49:17'),
(101, 7, 'Steven John A. Agustin', 'teacher', 'DELETE_STUDENT_RECORD', 'Student', '', 'Steven John Agustin (CoAST)', 'Removed Steven John Agustin (CoAST) from class', NULL, NULL, '2026-03-20 00:56:44'),
(102, 7, 'Steven John A. Agustin', 'teacher', 'ADD_STUDENT_TO_CLASS', 'Student', '1231377', 'Steven John Agustin (CoAST)', 'Added by Steven John A. Agustin — Program: BS in Information Technology, Year: 3rd Year', NULL, NULL, '2026-03-20 00:57:00'),
(103, 18, 'Mark Zuckerberg', 'teacher', 'ADD_STUDENT_TO_CLASS', 'Student', '1231377', 'Steven John Agustin (CoAST)', 'Added by Mark Zuckerberg — Program: BS in Information Technology, Year: 3rd Year', NULL, NULL, '2026-03-20 00:57:14'),
(104, 1, 'CSS Administrator', 'admin', 'EDIT_STUDENT', 'Student', '', 'Steven John Agustin (CoAST)', 'Edited student: Steven John Agustin (CoAST) — BS in Information Technology 3rd Year', NULL, NULL, '2026-03-20 00:58:53'),
(105, 1, 'CSS Administrator', 'admin', 'EDIT_STUDENT', 'Student', '', 'Jasmin Pastor', 'Edited student: Jasmin Pastor — BS in Mechanics SBE', NULL, NULL, '2026-03-20 00:58:59'),
(106, 23, 'Lucy Heartfilla', 'student', 'REGENERATE_BARCODE', 'Student', '', 'Lucy Heartfilla', 'Regenerated barcode — ID No: 1231333', NULL, NULL, '2026-03-20 01:04:20'),
(107, 18, 'Mark Zuckerberg', 'teacher', 'SET_LOCATION', 'Location', '18', NULL, 'Set location: lat 15.93, lng 120.51, radius 50m', NULL, NULL, '2026-03-20 15:58:30'),
(108, 7, 'Steven John A. Agustin', 'teacher', 'SET_LOCATION', 'Location', '7', NULL, 'Set location: lat 16.0179184, lng 120.7498207, radius 100m', NULL, NULL, '2026-03-20 15:59:04'),
(109, 1, 'CSS Administrator', 'admin', 'RESET_STUDENT_DEVICE', 'Student', '23', 'Lucy Heartfilla', 'Device binding reset for: Lucy Heartfilla', NULL, NULL, '2026-03-20 16:00:34'),
(110, 23, 'Lucy Heartfilla', 'student', 'REGENERATE_BARCODE', 'Student', '', 'Lucy Heartfilla', 'Regenerated barcode — ID No: 1231333', NULL, NULL, '2026-03-20 16:02:22'),
(111, 23, 'Lucy Heartfilla', 'student', 'REGENERATE_BARCODE', 'Student', '', 'Lucy Heartfilla', 'Regenerated barcode — ID No: 1231333', NULL, NULL, '2026-03-20 16:02:49'),
(112, 7, 'Steven John A. Agustin', 'teacher', 'SET_SUBJECT_YEAR_LEVEL', 'Class Setup', '', 'Big Data', 'Set subject: Big Data, year level: 3rd Year', NULL, NULL, '2026-03-20 16:03:18'),
(113, 23, 'Lucy Heartfilla', 'student', 'REGENERATE_BARCODE', 'Student', '', 'Lucy Heartfilla', 'Regenerated barcode — ID No: 1231333', NULL, NULL, '2026-03-20 16:03:26'),
(114, 18, 'Mark Zuckerberg', 'teacher', 'SET_SUBJECT_YEAR_LEVEL', 'Class Setup', '', 'Computer Programming', 'Set subject: Computer Programming, year level: 3rd Year', NULL, NULL, '2026-03-20 16:04:10'),
(115, 23, 'Lucy A. Heartfilla', 'student', 'CLASS_ATTENDANCE_IN', 'Class Attendance', '1231333', 'Lucy A. Heartfilla', 'Teacher: Steven John A. Agustin | Program: BS in Information Technology, Year: 3rd Year', NULL, NULL, '2026-03-20 16:04:19'),
(116, 18, 'Mark Zuckerberg', 'teacher', 'SET_LOCATION', 'Location', '18', NULL, 'Set location: lat 16.017662842240664, lng 120.74950933456422, radius 100m', NULL, NULL, '2026-03-20 16:04:52'),
(117, 23, 'Lucy Heartfilla', 'student', 'REGENERATE_BARCODE', 'Student', '', 'Lucy Heartfilla', 'Regenerated barcode — ID No: 1231333', NULL, NULL, '2026-03-20 16:05:09'),
(118, 23, 'Lucy Heartfilla', 'student', 'REGENERATE_BARCODE', 'Student', '', 'Lucy Heartfilla', 'Regenerated barcode — ID No: 1231333', NULL, NULL, '2026-03-20 16:05:45'),
(119, 23, 'Lucy A. Heartfilla', 'student', 'CLASS_ATTENDANCE_IN', 'Class Attendance', '1231333', 'Lucy A. Heartfilla', 'Teacher: Mark Zuckerberg | Program: BS in Information Technology, Year: 3rd Year', NULL, NULL, '2026-03-20 17:00:24'),
(120, 23, 'Lucy Heartfilla', 'student', 'REGENERATE_BARCODE', 'Student', '', 'Lucy Heartfilla', 'Regenerated barcode — ID No: 1231333', NULL, NULL, '2026-03-20 17:00:53'),
(121, 7, 'Steven John A. Agustin', 'teacher', 'SET_SUBJECT_YEAR_LEVEL', 'Class Setup', '', 'Event-Driven Programming', 'Set subject: Event-Driven Programming, year level: 3rd Year', NULL, NULL, '2026-03-20 17:01:16'),
(122, 23, 'Lucy A. Heartfilla', 'student', 'CLASS_ATTENDANCE_IN', 'Class Attendance', '1231333', 'Lucy A. Heartfilla', 'Teacher: Steven John A. Agustin | Program: BS in Information Technology, Year: 3rd Year', NULL, NULL, '2026-03-20 17:01:20'),
(123, 7, 'Steven John A. Agustin', 'teacher', 'SET_SUBJECT_YEAR_LEVEL', 'Class Setup', '', 'Event-Driven Programming', 'Set subject: Event-Driven Programming, year level: 1st Year', NULL, NULL, '2026-03-20 17:01:42'),
(124, 7, 'Steven John A. Agustin', 'teacher', 'SET_SUBJECT_YEAR_LEVEL', 'Class Setup', '', 'Digital Marketing', 'Set subject: Digital Marketing, year level: 1st Year', NULL, NULL, '2026-03-20 17:02:01'),
(125, 7, 'Steven John A. Agustin', 'teacher', 'SET_SUBJECT_YEAR_LEVEL', 'Class Setup', '', 'Big Data', 'Set subject: Big Data, year level: 3rd Year', NULL, NULL, '2026-03-20 17:17:20'),
(126, 7, 'Steven John A. Agustin', 'teacher', 'ADD_STUDENT_TO_CLASS', 'Student', '1010', 'Jasmin Pastor', 'Added by Steven John A. Agustin — Program: BS in Mechanics, Year: SBE', NULL, NULL, '2026-03-20 17:31:10'),
(127, 1, 'CSS Administrator', 'admin', 'RESET_STUDENT_DEVICE', 'Student', '18', 'Agrifina Agaran', 'Device binding reset for: Agrifina Agaran', NULL, NULL, '2026-03-20 17:31:33'),
(128, 1, 'CSS Administrator', 'admin', 'RESET_STUDENT_DEVICE', 'Student', '19', 'Charimea Selga', 'Device binding reset for: Charimea Selga', NULL, NULL, '2026-03-20 17:31:35'),
(129, 1, 'CSS Administrator', 'admin', 'RESET_STUDENT_DEVICE', 'Student', '23', 'Lucy Heartfilla', 'Device binding reset for: Lucy Heartfilla', NULL, NULL, '2026-03-20 17:31:38'),
(130, 1, 'CSS Administrator', 'admin', 'RESET_STUDENT_DEVICE', 'Student', '25', 'Diane Chua', 'Device binding reset for: Diane Chua', NULL, NULL, '2026-03-20 17:31:44'),
(131, 1, 'CSS Administrator', 'admin', 'RESET_STUDENT_DEVICE', 'Student', '26', 'Luna Toka', 'Device binding reset for: Luna Toka', NULL, NULL, '2026-03-20 17:31:48'),
(132, 1, 'CSS Administrator', 'admin', 'RESET_STUDENT_DEVICE', 'Student', '28', 'Andria Ramirez', 'Device binding reset for: Andria Ramirez', NULL, NULL, '2026-03-20 17:31:53'),
(133, 1, 'CSS Administrator', 'admin', 'RESET_STUDENT_DEVICE', 'Student', '29', 'Alexander Magbitang', 'Device binding reset for: Alexander Magbitang', NULL, NULL, '2026-03-20 17:31:56'),
(134, 1, 'CSS Administrator', 'admin', 'RESET_STUDENT_DEVICE', 'Student', '32', 'Princess Obillo (ECoAST)', 'Device binding reset for: Princess Obillo (ECoAST)', NULL, NULL, '2026-03-20 17:32:00'),
(135, 1, 'CSS Administrator', 'admin', 'RESET_STUDENT_DEVICE', 'Student', '33', 'Marfel Gem Gallarde (ECoAST)', 'Device binding reset for: Marfel Gem Gallarde (ECoAST)', NULL, NULL, '2026-03-20 17:32:03'),
(136, 1, 'CSS Administrator', 'admin', 'RESET_STUDENT_DEVICE', 'Student', '35', 'Natsu Dragneel', 'Device binding reset for: Natsu Dragneel', NULL, NULL, '2026-03-20 17:32:06'),
(137, 1, 'CSS Administrator', 'admin', 'RESET_STUDENT_DEVICE', 'Student', '41', 'Angel Mageri Cabote (ECoAST)', 'Device binding reset for: Angel Mageri Cabote (ECoAST)', NULL, NULL, '2026-03-20 17:32:09'),
(138, 1, 'CSS Administrator', 'admin', 'RESET_STUDENT_DEVICE', 'Student', '42', 'Zaiejan Agustin', 'Device binding reset for: Zaiejan Agustin', NULL, NULL, '2026-03-20 17:32:14'),
(139, 1, 'CSS Administrator', 'admin', 'RESET_STUDENT_DEVICE', 'Student', '43', 'Jan Ray Aquino', 'Device binding reset for: Jan Ray Aquino', NULL, NULL, '2026-03-20 17:32:17'),
(140, 1, 'CSS Administrator', 'admin', 'RESET_STUDENT_DEVICE', 'Student', '44', 'Jasmin Pastor', 'Device binding reset for: Jasmin Pastor', NULL, NULL, '2026-03-20 17:32:21'),
(141, 1, 'CSS Administrator', 'admin', 'SET_EVENT', 'Event', '', 'Foundation day', 'Set event name to: Foundation day', NULL, NULL, '2026-03-20 17:56:47'),
(142, 1, 'CSS Administrator', 'admin', 'SET_EVENT', 'Event', '', 'Foundation day', 'Set event name to: Foundation day', NULL, NULL, '2026-03-20 19:17:15'),
(143, 1, 'CSS Administrator', 'admin', 'SET_EVENT', 'Event', '', 'Foundation day', 'Set event name to: Foundation day', NULL, NULL, '2026-03-20 19:23:22'),
(144, 1, 'CSS Administrator', 'admin', 'ADD_PROGRAM', 'Program', '', 'asdasd', 'Added program: asdasd', NULL, NULL, '2026-03-20 19:54:54'),
(145, 1, 'CSS Administrator', 'admin', 'DELETE_PROGRAM', 'Program', '', 'asdasd', 'Deleted program: asdasd', NULL, NULL, '2026-03-20 19:54:59'),
(146, 1, 'Super Administrator', 'super_admin', 'SET_LOCATION', 'Location', '7', NULL, 'SuperAdmin set location for teacher: Steven John A. Agustin — lat 15.93, lng 120.51, radius 500m', NULL, NULL, '2026-03-20 22:01:21'),
(147, 1, 'Super Administrator', 'super_admin', 'SET_LOCATION', 'Location', '18', NULL, 'SuperAdmin set location for teacher: Mark Zuckerberg — lat 15.93, lng 120.51, radius 500m', NULL, NULL, '2026-03-20 22:01:55'),
(148, 1, 'CSS Administrator', 'admin', 'SET_EVENT', 'Event', '', 'Foundation day', 'Set event name to: Foundation day', NULL, NULL, '2026-03-21 00:06:12'),
(149, 7, 'Steven John A. Agustin', 'teacher', 'MANUAL_ATTENDANCE', 'Class Attendance', '1231426', 'Charimea M. Selga', 'Manual entry by Steven John A. Agustin — Program: BS in Information Technology, Year: 3rd Year', NULL, NULL, '2026-03-21 12:30:39'),
(150, 7, 'Steven John A. Agustin', 'teacher', 'MANUAL_ATTENDANCE', 'Class Attendance', '12313598', 'Princess O. Obillo (ECoAST)', 'Manual entry by Steven John A. Agustin — Program: BS in Information Technology, Year: 3rd Year', NULL, NULL, '2026-03-21 12:30:55'),
(151, 7, 'Steven John A. Agustin', 'teacher', 'MANUAL_ATTENDANCE', 'Class Attendance', '1231231231231', 'Natsu A. Dragneel', 'Manual entry by Steven John A. Agustin — Program: BS in Information Technology, Year: 3rd Year', NULL, NULL, '2026-03-21 12:31:01'),
(152, 7, 'Steven John A. Agustin', 'teacher', 'MANUAL_ATTENDANCE', 'Class Attendance', '14567', 'Diane A. Chua', 'Manual entry by Steven John A. Agustin — Program: RPSEA, Year: 3rd Year', NULL, NULL, '2026-03-21 12:31:10'),
(153, 7, 'Steven John A. Agustin', 'teacher', 'MANUAL_ATTENDANCE', 'Class Attendance', '1231333', 'Lucy A. Heartfilla', 'Manual entry by Steven John A. Agustin — Program: BS in Information Technology, Year: 3rd Year', NULL, NULL, '2026-03-21 12:31:16'),
(154, 7, 'Steven John A. Agustin', 'teacher', 'MANUAL_ATTENDANCE', 'Class Attendance', '1231377', 'Steven John A. Agustin (CoAST)', 'Manual entry by Steven John A. Agustin — Program: BS in Information Technology, Year: 3rd Year', NULL, NULL, '2026-03-21 12:31:28'),
(155, 46, 'Steven John Agustin (CoAST)', 'student', 'REGENERATE_BARCODE', 'Student', '', 'Steven John Agustin (CoAST)', 'Regenerated barcode — ID No: 1231377', NULL, NULL, '2026-03-21 12:41:07'),
(156, 5, 'Gray Fullbusters', 'guard', 'EVENT_TIME_IN', 'Event Attendance', '1231377', 'Steven John A. Agustin (CoAST)', 'Event: Foundation day | Location: Main Gate', NULL, NULL, '2026-03-21 12:41:12'),
(157, 5, 'Gray Fullbusters', 'guard', 'EVENT_TIME_IN', 'Event Attendance', '1231377', 'Steven John A. Agustin (CoAST)', 'Event: Foundation day | Location: Main Gate', NULL, NULL, '2026-03-21 12:45:19'),
(158, 1, 'Super Administrator', 'super_admin', 'SET_EVENT', 'Event', '', 'Fun run', 'Set system-wide event: Fun run', NULL, NULL, '2026-03-21 14:58:44'),
(159, 1, 'Super Administrator', 'super_admin', 'SET_EVENT', 'Event', '', 'Kick off', 'Set system-wide event: Kick off', NULL, NULL, '2026-03-21 14:59:44'),
(160, 1, 'CSS Administrator', 'admin', 'SET_EVENT', 'Event', '', 'Fun run', 'Set event name to: Fun run', NULL, NULL, '2026-03-21 15:00:35'),
(161, 1, 'Super Administrator', 'super_admin', 'MAINTENANCE_TOGGLE', 'System', '', 'Maintenance ON', 'Maintenance mode turned ON', NULL, NULL, '2026-03-21 15:12:16'),
(162, 1, 'Super Administrator', 'super_admin', 'MAINTENANCE_TOGGLE', 'System', '', 'Maintenance OFF', 'Maintenance mode turned OFF', NULL, NULL, '2026-03-21 15:13:14'),
(163, 1, 'Super Administrator', 'super_admin', 'MAINTENANCE_TOGGLE', 'System', '', 'Maintenance ON', 'Maintenance mode turned ON', NULL, NULL, '2026-03-21 15:13:42'),
(164, 1, 'Super Administrator', 'super_admin', 'MAINTENANCE_TOGGLE', 'System', '', 'Maintenance OFF', 'Maintenance mode turned OFF', NULL, NULL, '2026-03-21 15:13:58'),
(165, 1, 'Super Administrator', 'super_admin', 'SET_EVENT', 'Event', '', 'Fun', 'Set system-wide event: Fun', NULL, NULL, '2026-03-21 15:43:19'),
(166, 1, 'Super Administrator', 'super_admin', 'ADD_PROGRAM', 'Program', '', 'asd', 'Added program: asd', NULL, NULL, '2026-03-21 16:22:50'),
(167, 1, 'Super Administrator', 'super_admin', 'DELETE_PROGRAM', 'Program', '', 'asd', 'Deleted program: asd', NULL, NULL, '2026-03-21 16:22:59'),
(168, 1, 'Super Administrator', 'super_admin', 'ADD_YEAR_LEVEL', 'Year Level', '', 'ad', 'Added year level: ad', NULL, NULL, '2026-03-21 16:23:11'),
(169, 1, 'Super Administrator', 'super_admin', 'DELETE_YEAR_LEVEL', 'Year Level', '', 'ad', 'Deleted year level: ad', NULL, NULL, '2026-03-21 16:23:15'),
(170, 1, 'Super Administrator', 'super_admin', 'ADD_PROGRAM', 'Program', '', 'hjh', 'Added program: hjh', NULL, NULL, '2026-03-21 16:27:14'),
(171, 1, 'Super Administrator', 'super_admin', 'DELETE_PROGRAM', 'Program', '', 'hjh', 'Deleted program: hjh', NULL, NULL, '2026-03-21 16:27:17'),
(172, 1, 'Super Administrator', 'super_admin', 'SET_EVENT', 'Event', '', 'Fun run', 'Set system-wide event: Fun run', NULL, NULL, '2026-03-21 16:35:47'),
(173, 1, 'Super Administrator', 'super_admin', 'SET_EVENT', 'Event', '', 'Sample', 'Set system-wide event: Sample', NULL, NULL, '2026-03-21 16:38:38'),
(174, 1, 'Super Administrator', 'super_admin', 'SET_EVENT', 'Event', '', 'Fun run', 'Set system-wide event: Fun run', NULL, NULL, '2026-03-21 16:38:44'),
(175, 1, 'Super Administrator', 'super_admin', 'EDIT_STUDENT', 'Student', '', 'Lucy Heartfilla', 'Edited student: Lucy Heartfilla — BS in Information Technology 3rd Year', NULL, NULL, '2026-03-21 17:02:00'),
(176, 18, 'Mark Zuckerberg', 'teacher', 'SET_LOCATION', 'Location', '18', NULL, 'Set location: lat 16.01799283579202, lng 120.7494878768921, radius 100m', NULL, NULL, '2026-03-21 17:03:11'),
(177, 23, 'Lucy Heartfilla', 'student', 'REGENERATE_BARCODE', 'Student', '', 'Lucy Heartfilla', 'Regenerated barcode — ID No: 1231333', NULL, NULL, '2026-03-21 17:03:37'),
(178, 23, 'Lucy A. Heartfilla', 'student', 'CLASS_ATTENDANCE_IN', 'Class Attendance', '1231333', 'Lucy A. Heartfilla', 'Teacher: Mark Zuckerberg | Program: BS in Information Technology, Year: 3rd Year', NULL, NULL, '2026-03-21 17:07:30'),
(179, 1, 'Super Administrator', 'super_admin', 'MAINTENANCE_TOGGLE', 'System', '', 'Maintenance ON', 'Maintenance mode turned ON', NULL, NULL, '2026-03-21 17:20:36'),
(180, 1, 'Super Administrator', 'super_admin', 'MAINTENANCE_TOGGLE', 'System', '', 'Maintenance OFF', 'Maintenance mode turned OFF', NULL, NULL, '2026-03-21 17:22:51'),
(181, 1, 'Super Administrator', 'super_admin', 'MAINTENANCE_TOGGLE', 'System', '', 'Maintenance ON', 'Maintenance mode turned ON', NULL, NULL, '2026-03-21 17:23:16'),
(182, 1, 'Super Administrator', 'super_admin', 'MAINTENANCE_TOGGLE', 'System', '', 'Maintenance OFF', 'Maintenance mode turned OFF', NULL, NULL, '2026-03-21 17:25:05'),
(183, 35, 'Natsu Dragneel', 'student', 'REGENERATE_BARCODE', 'Student', '', 'Natsu Dragneel', 'Regenerated barcode — ID No: 1231231231231', NULL, NULL, '2026-03-21 17:25:25'),
(184, 1, 'Super Administrator', 'super_admin', 'MAINTENANCE_TOGGLE', 'System', '', 'Maintenance ON', 'Maintenance mode turned ON', NULL, NULL, '2026-03-21 17:26:30'),
(185, 1, 'Super Administrator', 'super_admin', 'MAINTENANCE_TOGGLE', 'System', '', 'Maintenance OFF', 'Maintenance mode turned OFF', NULL, NULL, '2026-03-21 17:27:00'),
(186, 1, 'Super Administrator', 'super_admin', 'MAINTENANCE_TOGGLE', 'System', '', 'Maintenance ON', 'Maintenance mode turned ON', NULL, NULL, '2026-03-21 18:47:32'),
(187, 1, 'Super Administrator', 'super_admin', 'MAINTENANCE_TOGGLE', 'System', '', 'Maintenance OFF', 'Maintenance mode turned OFF', NULL, NULL, '2026-03-21 18:47:58'),
(188, NULL, 'Super Admin', 'super_admin', 'RESET_ADMIN_PASSWORD', 'Admin', '1', NULL, 'Reset password for admin ID: 1', NULL, NULL, '2026-03-21 18:51:46'),
(189, 18, 'Mark Zuckerberg', 'teacher', 'SET_LOCATION', 'Location', '18', NULL, 'Set location: lat 15.93, lng 120.51, radius 50m', NULL, NULL, '2026-03-21 20:06:20'),
(190, 1, 'Administrator', 'admin', 'CHANGE_NAME', 'Admin', '1', 'Administrator', 'Changed name to: Administrator', NULL, NULL, '2026-03-21 21:26:36'),
(191, 18, 'Mark Zuckerberg', 'teacher', 'SET_SUBJECT_YEAR_LEVEL', 'Class Setup', '', 'Physics', 'Set subject: Physics, year level: 3rd Year', NULL, NULL, '2026-03-21 21:27:12'),
(192, 1, 'CSS Administrator', 'admin', 'SET_EVENT', 'Event', '', 'Ecoast day', 'Set event name to: Ecoast day', NULL, NULL, '2026-03-21 21:32:36'),
(193, 1, 'CSS Administrator', 'admin', 'EDIT_GUARD', 'Guard', '', 'Kirito Kirigaya (Guard)', 'Edited guard: Kirito Kirigaya (Guard) — location: Main Gate', NULL, NULL, '2026-03-21 21:35:56'),
(194, 18, 'Mark Zuckerberg', 'teacher', 'SET_LOCATION', 'Location', '18', NULL, 'Set location: lat 15.93, lng 120.51, radius 50m', NULL, NULL, '2026-03-21 21:36:49'),
(195, 7, 'Steven John A. Agustin', 'teacher', 'SET_LOCATION', 'Location', '7', NULL, 'Set location: lat 15.93, lng 120.51, radius 50m', '136.158.120.56', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', '2026-03-21 21:41:55'),
(196, 1, 'CSS Administrator', 'admin', 'EDIT_TEACHER', 'Teacher', '', 'Andrea B. Lachica', 'Edited teacher: Andrea B. Lachica — andrea@panpacificu.edu.ph', '136.158.120.56', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', '2026-03-21 21:42:31'),
(197, 35, 'Natsu Dragneel', 'student', 'REGENERATE_BARCODE', 'Student', '', 'Natsu Dragneel', 'Regenerated barcode — ID No: 1231231231231', '136.158.120.56', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', '2026-03-21 21:43:27'),
(198, 35, 'Natsu Dragneel', 'student', 'REGENERATE_BARCODE', 'Student', '', 'Natsu Dragneel', 'Regenerated barcode — ID No: 1231231231231', '136.158.120.56', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', '2026-03-21 21:57:50'),
(199, 23, 'Lucy Heartfilla', 'student', 'UPDATE_PROFILE', 'Student', '', 'Lucy Heartfilla', 'Updated profile — ID No: 1231333', '136.158.120.56', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Mobile Safari/537.36', '2026-03-21 22:08:46'),
(200, 1, 'Administrator', 'admin', 'SET_EVENT', 'Event', '', 'Sample', 'Set event name to: Sample', '136.158.120.56', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Mobile Safari/537.36', '2026-03-21 22:10:26'),
(201, 35, 'Natsu Dragneel', 'student', 'REGENERATE_BARCODE', 'Student', '', 'Natsu Dragneel', 'Regenerated barcode — ID No: 1231231231231', '136.158.120.56', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Mobile Safari/537.36', '2026-03-21 22:32:31'),
(202, 18, 'Mark Zuckerberg', 'teacher', 'SET_LOCATION', 'Location', '18', NULL, 'Set location: lat 15.93, lng 120.51, radius 50m', '136.158.120.56', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', '2026-03-21 22:33:21'),
(203, 35, 'Natsu Dragneel', 'student', 'REGENERATE_BARCODE', 'Student', '', 'Natsu Dragneel', 'Regenerated barcode — ID No: 1231231231231', '136.158.120.56', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Mobile Safari/537.36', '2026-03-21 22:35:53'),
(204, 35, 'Natsu Dragneel', 'student', 'REGENERATE_BARCODE', 'Student', '', 'Natsu Dragneel', 'Regenerated barcode — ID No: 1231231231231', '136.158.120.56', 'Google Chrome 146 · Android 6.0 · Nexus 5', '2026-03-21 22:49:09'),
(205, 18, 'Mark Zuckerberg', 'teacher', 'SET_LOCATION', 'Location', '18', NULL, 'Set location: lat 15.93, lng 120.51, radius 50m', '136.158.120.56', 'Google Chrome 146 · Windows 10.0.0', '2026-03-21 22:50:22'),
(206, 23, 'Lucy Heartfilla', 'student', 'UPDATE_PROFILE', 'Student', '', 'Lucy Heartfilla', 'Updated profile — ID No: 1231333', '136.158.120.56', 'Google Chrome 144 · Android 14.0.0 · Infinix X6731B', '2026-03-21 22:58:42'),
(207, 35, 'Natsu Dragneel', 'student', 'REGENERATE_BARCODE', 'Student', '', 'Natsu Dragneel', 'Regenerated barcode — ID No: 1231231231231', '136.158.120.56', 'Google Chrome 146 · Android 6.0 · Nexus 5', '2026-03-21 23:01:55'),
(208, 35, 'Natsu Dragneel', 'student', 'REGENERATE_BARCODE', 'Student', '', 'Natsu Dragneel', 'Regenerated barcode — ID No: 1231231231231', '136.158.120.56', 'Chrome 146 · Android 6 · Nexus 5', '2026-03-21 23:05:03'),
(209, NULL, 'Super Admin', 'super_admin', 'CREATE_ADMIN', 'Admin', '2', 'Steven John A. Agustin', 'Created admin: steven.agustin.admin@panpacificu.edu.ph', NULL, NULL, '2026-03-22 02:29:34'),
(210, 1, 'Super Administrator', 'super_admin', 'ADD_YEAR_LEVEL', 'Year Level', '', 'asd', 'Added year level: asd', '136.158.120.56', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', '2026-03-22 02:43:11'),
(211, 1, 'Super Administrator', 'super_admin', 'DELETE_YEAR_LEVEL', 'Year Level', '', 'asd', 'Deleted year level: asd', '136.158.120.56', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', '2026-03-22 02:43:15'),
(212, 7, 'Steven John A. Agustin', 'teacher', 'MANUAL_ATTENDANCE', 'Class Attendance', '1231426', 'Charimea M. Selga', 'Manual entry by Steven John A. Agustin — Program: BS in Information Technology, Year: 3rd Year', NULL, NULL, '2026-03-22 12:13:53'),
(213, 7, 'Steven John A. Agustin', 'teacher', 'MANUAL_ATTENDANCE', 'Class Attendance', '12313598', 'Princess O. Obillo (ECoAST)', 'Manual entry by Steven John A. Agustin — Program: BS in Information Technology, Year: 3rd Year', NULL, NULL, '2026-03-22 12:13:56'),
(214, 7, 'Steven John A. Agustin', 'teacher', 'MANUAL_ATTENDANCE', 'Class Attendance', '1231231231231', 'Natsu A. Dragneel', 'Manual entry by Steven John A. Agustin — Program: BS in Information Technology, Year: 3rd Year', NULL, NULL, '2026-03-22 12:13:59'),
(215, 7, 'Steven John A. Agustin', 'teacher', 'MANUAL_ATTENDANCE', 'Class Attendance', '14567', 'Diane A. Chua', 'Manual entry by Steven John A. Agustin — Program: RPSEA, Year: 3rd Year', NULL, NULL, '2026-03-22 12:14:03'),
(216, 7, 'Steven John A. Agustin', 'teacher', 'MANUAL_ATTENDANCE', 'Class Attendance', '123123123', 'Angel Mageri A. Cabote (ECoAST)', 'Manual entry by Steven John A. Agustin — Program: BS in Information Technology, Year: 3rd Year', NULL, NULL, '2026-03-22 12:14:07'),
(217, 7, 'Steven John A. Agustin', 'teacher', 'MANUAL_ATTENDANCE', 'Class Attendance', '737773', 'Zaiejan A. Agustin', 'Manual entry by Steven John A. Agustin — Program: BS in Information Technology, Year: 3rd Year', NULL, NULL, '2026-03-22 12:14:11'),
(218, 7, 'Steven John A. Agustin', 'teacher', 'MANUAL_ATTENDANCE', 'Class Attendance', '1231377', 'Steven John A. Agustin (CoAST)', 'Manual entry by Steven John A. Agustin — Program: BS in Information Technology, Year: 3rd Year', NULL, NULL, '2026-03-22 12:14:17'),
(219, 7, 'Steven John A. Agustin', 'teacher', 'SET_SUBJECT_YEAR_LEVEL', 'Class Setup', '', 'Programming', 'Set subject: Programming, year level: 2nd Year', '136.158.120.56', 'Chrome 146 · Windows 10', '2026-03-22 12:16:21'),
(220, 7, 'Steven John A. Agustin', 'teacher', 'SET_LOCATION', 'Location', '7', NULL, 'Set location: lat 16.017920649749286, lng 120.74940204620363, radius 100m', '136.158.120.56', 'Chrome 146 · Windows 10', '2026-03-22 12:23:12'),
(221, 18, 'Mark Zuckerberg', 'teacher', 'SET_LOCATION', 'Location', '18', NULL, 'Set location: lat 15.93, lng 120.51, radius 100m', '136.158.120.56', 'Chrome 146 · Windows 10', '2026-03-22 12:23:54'),
(222, 18, 'Mark Zuckerberg', 'teacher', 'SET_SUBJECT_YEAR_LEVEL', 'Class Setup', '', 'Computer Programming', 'Set subject: Computer Programming, year level: 3rd Year', '136.158.120.56', 'Chrome 146 · Windows 10', '2026-03-22 12:24:05'),
(223, 23, 'Lucy Heartfilla', 'student', 'REGENERATE_BARCODE', 'Student', '', 'Lucy Heartfilla', 'Regenerated barcode — ID No: 1231333', '136.158.120.56', 'Google Chrome 144 · Android 14.0.0 · Infinix X6731B', '2026-03-22 12:24:41'),
(224, 7, 'Steven John A. Agustin', 'teacher', 'SET_SUBJECT_YEAR_LEVEL', 'Class Setup', '', 'Programming', 'Set subject: Programming, year level: 3rd Year', '136.158.120.56', 'Chrome 146 · Windows 10', '2026-03-22 12:25:10'),
(225, 23, 'Lucy A. Heartfilla', 'student', 'CLASS_ATTENDANCE_IN', 'Class Attendance', '1231333', 'Lucy A. Heartfilla', 'Teacher: Steven John A. Agustin | Program: BS in Information Technology, Year: 3rd Year', NULL, NULL, '2026-03-22 12:25:16'),
(226, 18, 'Mark Zuckerberg', 'teacher', 'SET_LOCATION', 'Location', '18', NULL, 'Set location: lat 16.01788971286583, lng 120.74942350387575, radius 100m', '136.158.120.56', 'Chrome 146 · Windows 10', '2026-03-22 12:37:20'),
(227, 23, 'Lucy Heartfilla', 'student', 'REGENERATE_BARCODE', 'Student', '', 'Lucy Heartfilla', 'Regenerated barcode — ID No: 1231333', '136.158.120.56', 'Google Chrome 144 · Android 14.0.0 · Infinix X6731B', '2026-03-22 12:37:38'),
(228, 23, 'Lucy A. Heartfilla', 'student', 'CLASS_ATTENDANCE_IN', 'Class Attendance', '1231333', 'Lucy A. Heartfilla', 'Teacher: Mark Zuckerberg | Program: BS in Information Technology, Year: 3rd Year', NULL, NULL, '2026-03-22 12:37:42'),
(229, 18, 'Mark Zuckerberg', 'teacher', 'ADD_SUBJECT', 'Subject', '', 'Mathematics', 'Added subject: Mathematics', '136.158.120.56', 'Chrome 146 · Windows 10', '2026-03-22 12:41:49'),
(230, 7, 'Steven John A. Agustin', 'teacher', 'ADD_STUDENT_TO_CLASS', 'Student', '1231574', 'Alexander Magbitang', 'Added by Steven John A. Agustin — Program: BS in Information Technology, Year: 3rd Year', NULL, NULL, '2026-03-22 13:02:10'),
(231, 1, 'Super Administrator', 'super_admin', 'MAINTENANCE_TOGGLE', 'System', '', 'Maintenance ON', 'Maintenance mode turned ON', '136.158.120.56', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', '2026-03-22 13:05:27'),
(232, 1, 'Super Administrator', 'super_admin', 'MAINTENANCE_TOGGLE', 'System', '', 'Maintenance OFF', 'Maintenance mode turned OFF', '136.158.120.56', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', '2026-03-22 13:05:42'),
(233, 18, 'Mark Zuckerberg', 'teacher', 'MANUAL_ATTENDANCE', 'Class Attendance', '123123123', 'Angel Mageri A. Cabote (ECoAST)', 'Manual entry by Mark Zuckerberg — Program: BS in Information Technology, Year: 3rd Year', NULL, NULL, '2026-03-22 13:15:45'),
(234, 18, 'Mark Zuckerberg', 'teacher', 'MANUAL_ATTENDANCE', 'Class Attendance', '1231377', 'Steven John A. Agustin (CoAST)', 'Manual entry by Mark Zuckerberg — Program: BS in Information Technology, Year: 3rd Year', NULL, NULL, '2026-03-22 13:15:51'),
(235, 23, 'Lucy Heartfilla', 'student', 'REGENERATE_BARCODE', 'Student', '', 'Lucy Heartfilla', 'Regenerated barcode — ID No: 1231333', '136.158.120.56', 'Google Chrome 144 · Android 14.0.0 · Infinix X6731B', '2026-03-22 13:46:16'),
(236, 23, 'Lucy Heartfilla', 'student', 'UPDATE_PROFILE', 'Student', '', 'Lucy Heartfilla', 'Updated profile — ID No: 1231333', '136.158.120.56', 'Google Chrome 144 · Android 14.0.0 · Infinix X6731B', '2026-03-22 13:46:39'),
(237, 23, 'Lucy Heartfilla', 'student', 'UPDATE_PROFILE', 'Student', '', 'Lucy Heartfilla', 'Updated profile — ID No: 1231333', '136.158.120.56', 'Google Chrome 144 · Android 14.0.0 · Infinix X6731B', '2026-03-22 13:50:51'),
(238, 23, 'Lucy Heartfilla', 'student', 'UPDATE_PROFILE', 'Student', '', 'Lucy Heartfilla', 'Updated profile — ID No: 1231333', '136.158.120.56', 'Google Chrome 144 · Android 14.0.0 · Infinix X6731B', '2026-03-22 13:51:05'),
(239, 23, 'Lucy Heartfilla', 'student', 'UPDATE_PROFILE', 'Student', '', 'Lucy Heartfilla', 'Updated profile — ID No: 1231333', '136.158.120.56', 'Google Chrome 144 · Android 14.0.0 · Infinix X6731B', '2026-03-22 14:02:40'),
(240, 23, 'Lucy Heartfilla', 'student', 'UPDATE_PROFILE', 'Student', '', 'Lucy Heartfilla', 'Updated profile — ID No: 1231333', '136.158.120.56', 'Google Chrome 144 · Android 14.0.0 · Infinix X6731B', '2026-03-22 14:02:53'),
(241, 1, 'Super Administrator', 'super_admin', 'RESET_STUDENT_PASSWORD', 'Student', '47', NULL, 'Reset password for student ID: 47', '136.158.120.56', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', '2026-03-22 14:35:37'),
(242, 18, 'Mark Zuckerberg', 'teacher', 'ADD_STUDENT_TO_CLASS', 'Student', '67', 'Hbd U', 'Added by Mark Zuckerberg — Program: BS in Mechanics, Year: 2nd Year', NULL, NULL, '2026-03-22 14:37:32'),
(243, 47, 'Hbd U', 'student', 'REGENERATE_BARCODE', 'Student', '', 'Hbd U', 'Regenerated barcode — ID No: 67', '136.158.120.56', 'Chrome · Android 10 · en-us; CPH2179', '2026-03-22 14:37:38'),
(244, 1, 'Super Administrator', 'super_admin', 'EDIT_STUDENT', 'Student', '', 'Yuumi Kiyomi', 'Edited student: Yuumi Kiyomi — BS in Mechanics 2nd Year', '136.158.120.56', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', '2026-03-22 14:39:47'),
(245, 18, 'Mark Zuckerberg', 'teacher', 'SET_SUBJECT_YEAR_LEVEL', 'Class Setup', '', 'Mathematics', 'Set subject: Mathematics, year level: 2nd Year', '136.158.120.56', 'Chrome 146 · Windows 10', '2026-03-22 14:40:16'),
(246, 47, 'Yuumi A. Kiyomi', 'student', 'CLASS_ATTENDANCE_IN', 'Class Attendance', '67', 'Yuumi A. Kiyomi', 'Teacher: Mark Zuckerberg | Program: BS in Mechanics, Year: 2nd Year', NULL, NULL, '2026-03-22 14:40:21'),
(247, 7, 'Steven John A. Agustin', 'teacher', 'SET_LOCATION', 'Location', '7', NULL, 'Set location: lat 15.93, lng 120.51, radius 50m', '136.158.120.56', 'Chrome 146 · Windows 10', '2026-03-22 15:23:00'),
(248, 46, 'Steven John Agustin (CoAST)', 'student', 'REGENERATE_BARCODE', 'Student', '', 'Steven John Agustin (CoAST)', 'Regenerated barcode — ID No: 1231377', '136.158.120.56', 'Chrome 146 · Windows 10', '2026-03-22 15:23:33'),
(249, 5, 'Gray Fullbusters', 'guard', 'EVENT_TIME_IN', 'Event Attendance', '1231377', 'Steven John A. Agustin (CoAST)', 'Event: Sample | Location: Main Gate', NULL, NULL, '2026-03-22 15:24:02'),
(250, 5, 'Gray Fullbusters', 'guard', 'EVENT_TIME_OUT', 'Event Attendance', '1231377', 'Steven John A. Agustin (CoAST)', 'Event: Sample | Location: Main Gate', NULL, NULL, '2026-03-22 15:24:17'),
(251, 7, 'Steven John A. Agustin', 'teacher', 'MANUAL_ATTENDANCE', 'Class Attendance', '12313598', 'Princess O. Obillo (ECoAST)', 'Manual entry by Steven John A. Agustin — Program: BS in Information Technology, Year: 3rd Year', NULL, NULL, '2026-03-22 15:29:15'),
(252, 1, 'Super Administrator', 'super_admin', 'MAINTENANCE_TOGGLE', 'System', '', 'Maintenance ON', 'Maintenance mode turned ON', '182.255.40.171', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36 Edg/146.0.0.0', '2026-03-22 20:26:10'),
(253, 1, 'Super Administrator', 'super_admin', 'MAINTENANCE_TOGGLE', 'System', '', 'Maintenance OFF', 'Maintenance mode turned OFF', '182.255.40.171', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36 Edg/146.0.0.0', '2026-03-22 20:26:34');
INSERT INTO `system_activity_logs` (`log_id`, `actor_id`, `actor_name`, `actor_role`, `action`, `target_type`, `target_id`, `target_name`, `details`, `ip_address`, `device_info`, `performed_at`) VALUES
(254, 7, 'Steven John A. Agustin', 'teacher', 'SET_SUBJECT_YEAR_LEVEL', 'Class Setup', '', 'Programming', 'Set subject: Programming, year level: 3rd Year', '182.255.40.171', 'Edge 146 · Windows 19', '2026-03-22 20:33:23'),
(255, 7, 'Steven John A. Agustin', 'teacher', 'MANUAL_ATTENDANCE', 'Class Attendance', '1231231231231', 'Natsu A. Dragneel', 'Manual entry by Steven John A. Agustin — Program: BS in Information Technology, Year: 3rd Year', NULL, NULL, '2026-03-22 20:33:54'),
(256, 7, 'Steven John A. Agustin', 'teacher', 'MANUAL_ATTENDANCE', 'Class Attendance', '14567', 'Diane A. Chua', 'Manual entry by Steven John A. Agustin — Program: RPSEA, Year: 3rd Year', NULL, NULL, '2026-03-22 20:33:56'),
(257, 7, 'Steven John A. Agustin', 'teacher', 'MANUAL_ATTENDANCE', 'Class Attendance', '123123123', 'Angel Mageri A. Cabote (ECoAST)', 'Manual entry by Steven John A. Agustin — Program: BS in Information Technology, Year: 3rd Year', NULL, NULL, '2026-03-22 20:34:00'),
(258, 7, 'Steven John A. Agustin', 'teacher', 'MANUAL_ATTENDANCE', 'Class Attendance', '1231333', 'Lucy A. Heartfilla', 'Manual entry by Steven John A. Agustin — Program: BS in Information Technology, Year: 3rd Year', NULL, NULL, '2026-03-22 20:34:03'),
(259, 7, 'Steven John A. Agustin', 'teacher', 'MANUAL_ATTENDANCE', 'Class Attendance', '737773', 'Zaiejan A. Agustin', 'Manual entry by Steven John A. Agustin — Program: BS in Information Technology, Year: 3rd Year', NULL, NULL, '2026-03-22 20:34:07'),
(260, 7, 'Steven John A. Agustin', 'teacher', 'SET_SUBJECT_YEAR_LEVEL', 'Class Setup', '', 'Big Data', 'Set subject: Big Data, year level: 3rd Year', '136.158.120.56', 'Chrome 146 · Windows 10', '2026-03-22 20:34:18'),
(261, 7, 'Steven John A. Agustin', 'teacher', 'SET_SUBJECT_YEAR_LEVEL', 'Class Setup', '', 'Big Data', 'Set subject: Big Data, year level: 1st Year', '182.255.40.171', 'Edge 146 · Windows 19', '2026-03-22 20:34:27'),
(262, 7, 'Steven John A. Agustin', 'teacher', 'MANUAL_ATTENDANCE', 'Class Attendance', '456', 'Andria A. Ramirez', 'Manual entry by Steven John A. Agustin — Program: BS Education, Year: 1st Year', NULL, NULL, '2026-03-22 20:34:53'),
(263, 46, 'Steven John Agustin (CoAST)', 'student', 'REGENERATE_BARCODE', 'Student', '', 'Steven John Agustin (CoAST)', 'Regenerated barcode — ID No: 1231377', '136.158.120.56', 'Chrome 146 · Windows 10', '2026-03-23 00:32:21'),
(264, 23, 'Lucy Heartfilla', 'student', 'REGENERATE_BARCODE', 'Student', '', 'Lucy Heartfilla', 'Regenerated barcode — ID No: 1231333', '136.158.120.56', 'Chrome 144 · Android 14 · Infinix X6731B', '2026-03-23 00:39:03'),
(265, 35, 'Natsu Dragneel', 'student', 'REGENERATE_BARCODE', 'Student', '', 'Natsu Dragneel', 'Regenerated barcode — ID No: 1231231231231', '136.158.120.56', 'Chrome 146 · Windows 10', '2026-03-23 00:43:23'),
(266, 41, 'Angel Mageri Cabote (ECoAST)', 'student', 'REGENERATE_BARCODE', 'Student', '', 'Angel Mageri Cabote (ECoAST)', 'Regenerated barcode — ID No: 123123123', '136.158.120.56', 'Chrome 146 · Windows 10', '2026-03-23 00:43:52'),
(267, 7, 'Steven John A. Agustin', 'teacher', 'SET_LOCATION', 'Location', '7', NULL, 'Set location: lat 15.93, lng 120.51, radius 50m', '136.158.120.56', 'Chrome 146 · Windows 10', '2026-03-23 02:25:42'),
(268, 7, 'Steven John A. Agustin', 'teacher', 'SET_SUBJECT_YEAR_LEVEL', 'Class Setup', '', 'Big Data', 'Set subject: Big Data, year level: 3rd Year', '136.158.120.56', 'Chrome 146 · Windows 10', '2026-03-23 02:32:28'),
(269, 7, 'Steven John A. Agustin', 'teacher', 'MANUAL_ATTENDANCE', 'Class Attendance', '1231426', 'Charimea M. Selga', 'Manual entry by Steven John A. Agustin — Program: BS in Information Technology, Year: 3rd Year', '136.158.120.56', 'Chrome 146 · Windows 10', '2026-03-23 02:32:32'),
(270, 7, 'Steven John A. Agustin', 'teacher', 'MANUAL_ATTENDANCE', 'Class Attendance', '12313598', 'Princess O. Obillo (ECoAST)', 'Manual entry by Steven John A. Agustin — Program: BS in Information Technology, Year: 3rd Year', '136.158.120.56', 'Chrome 146 · Windows 10', '2026-03-23 02:32:34'),
(271, 7, 'Steven John A. Agustin', 'teacher', 'MANUAL_ATTENDANCE', 'Class Attendance', '1231231231231', 'Natsu A. Dragneel', 'Manual entry by Steven John A. Agustin — Program: BS in Information Technology, Year: 3rd Year', '136.158.120.56', 'Chrome 146 · Windows 10', '2026-03-23 02:32:36'),
(272, 7, 'Steven John A. Agustin', 'teacher', 'MANUAL_ATTENDANCE', 'Class Attendance', '14567', 'Diane A. Chua', 'Manual entry by Steven John A. Agustin — Program: RPSEA, Year: 3rd Year', '136.158.120.56', 'Chrome 146 · Windows 10', '2026-03-23 02:32:38'),
(273, 1, 'CSS Admin', 'admin', 'CHANGE_NAME', 'Admin', '1', 'CSS Admin', 'Changed name to: CSS Admin', '136.158.120.56', 'Chrome 146 · Windows 10', '2026-03-23 09:37:35'),
(274, 1, 'CSS Admin', 'admin', 'CHANGE_NAME', 'Admin', '1', 'CSS Admin', 'Changed name to: CSS Admin', '136.158.120.56', 'Chrome 146 · Windows 10', '2026-03-23 09:37:55'),
(275, 7, 'Steven John A. Agustin', 'teacher', 'MANUAL_ATTENDANCE', 'Class Attendance', '1231333', 'Lucy A. Heartfilla', 'Manual entry by Steven John A. Agustin — Program: BS in Information Technology, Year: 3rd Year', NULL, NULL, '2026-03-23 11:13:35'),
(276, 1, 'Super Administrator', 'super_admin', 'MAINTENANCE_TOGGLE', 'System', '', 'Maintenance ON', 'Maintenance mode turned ON', '124.6.158.140', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '2026-03-23 11:15:54'),
(277, 1, 'Super Administrator', 'super_admin', 'MAINTENANCE_TOGGLE', 'System', '', 'Maintenance OFF', 'Maintenance mode turned OFF', '124.6.158.140', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '2026-03-23 11:16:43'),
(278, 5, 'Gray Fullbusters', 'guard', 'EVENT_TIME_IN', 'Event Attendance', '897', 'Andrea A. Lachica', 'Event: Sample | Location: Main Gate', NULL, NULL, '2026-03-23 13:13:12');

-- --------------------------------------------------------

--
-- Table structure for table `system_login_logs`
--

CREATE TABLE `system_login_logs` (
  `log_id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `user_name` varchar(255) DEFAULT NULL,
  `user_email` varchar(255) NOT NULL,
  `role` enum('admin','teacher','guard','student','super_admin') NOT NULL,
  `status` enum('SUCCESS','FAILED','LOGOUT') NOT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `device_info` text DEFAULT NULL,
  `login_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `system_login_logs`
--

INSERT INTO `system_login_logs` (`log_id`, `user_id`, `user_name`, `user_email`, `role`, `status`, `ip_address`, `device_info`, `login_at`) VALUES
(1, 17, 'Charimea Selga', 'chari@panpacificu.edu.ph', 'teacher', 'SUCCESS', NULL, NULL, '2026-03-16 00:45:26'),
(2, 1, 'Super Administrator', 'superadmin@panpacificu.edu.ph', 'super_admin', 'SUCCESS', NULL, NULL, '2026-03-16 11:29:21'),
(3, 7, 'Steven John A. Agustin', 'steven.agustin.ecoast@panpacificu.edu.ph', 'teacher', 'SUCCESS', NULL, NULL, '2026-03-16 11:53:02'),
(4, 1, 'CSS Administrator', 'admin@panpacificu.edu.ph', 'admin', 'SUCCESS', NULL, NULL, '2026-03-16 11:56:45'),
(5, 7, 'Steven John A. Agustin', 'steven.agustin.ecoast@panpacificu.edu.ph', 'teacher', 'SUCCESS', NULL, NULL, '2026-03-16 15:02:06'),
(6, 23, 'Lucy Heartfilla', 'lucy@panpacificu.edu.ph', 'student', 'SUCCESS', NULL, NULL, '2026-03-16 15:13:03'),
(7, 7, 'Steven John A. Agustin', 'steven.agustin.ecoast@panpacificu.edu.ph', 'teacher', 'SUCCESS', NULL, NULL, '2026-03-16 15:13:37'),
(8, 1, 'CSS Administrator', 'admin@panpacificu.edu.ph', 'admin', 'SUCCESS', NULL, NULL, '2026-03-16 15:15:24'),
(9, 7, 'Steven John A. Agustin', 'steven.agustin.ecoast@panpacificu.edu.ph', 'teacher', 'SUCCESS', NULL, NULL, '2026-03-16 15:18:56'),
(10, NULL, NULL, 'stevenjohnagustin25@panpacificu.edu.ph', 'teacher', 'FAILED', NULL, NULL, '2026-03-16 18:46:33'),
(11, 7, 'Steven John A. Agustin', 'steven.agustin.ecoast@panpacificu.edu.ph', 'teacher', 'SUCCESS', NULL, NULL, '2026-03-16 18:46:43'),
(12, 1, 'Super Administrator', 'superadmin@panpacificu.edu.ph', 'super_admin', 'SUCCESS', NULL, NULL, '2026-03-16 18:47:49'),
(13, 7, 'Steven John A. Agustin', 'steven.agustin.ecoast@panpacificu.edu.ph', 'teacher', 'FAILED', NULL, NULL, '2026-03-16 18:49:45'),
(14, 7, 'Steven John A. Agustin', 'steven.agustin.ecoast@panpacificu.edu.ph', 'teacher', 'SUCCESS', NULL, NULL, '2026-03-16 18:50:47'),
(15, 7, 'Steven John A. Agustin', 'steven.agustin.ecoast@panpacificu.edu.ph', 'teacher', 'SUCCESS', NULL, NULL, '2026-03-16 18:51:15'),
(16, 7, 'Steven John A. Agustin', 'steven.agustin.ecoast@panpacificu.edu.ph', 'teacher', 'SUCCESS', NULL, NULL, '2026-03-16 18:53:26'),
(17, 7, 'Steven John A. Agustin', 'steven.agustin.ecoast@panpacificu.edu.ph', 'teacher', 'SUCCESS', NULL, NULL, '2026-03-16 18:54:51'),
(18, NULL, NULL, 'janrayaquino9@gmail.com', 'student', 'FAILED', NULL, NULL, '2026-03-16 19:05:25'),
(19, NULL, NULL, 'janrayaquino9@gmail.com', 'student', 'FAILED', NULL, NULL, '2026-03-16 19:05:33'),
(20, NULL, NULL, 'janrayaquino9@gmail.com', 'student', 'FAILED', NULL, NULL, '2026-03-16 19:05:39'),
(21, 43, 'Jan Ray Aquino', 'janrayaquino9@gmail.com', 'student', 'SUCCESS', NULL, NULL, '2026-03-16 19:06:55'),
(22, NULL, NULL, 'guard@panpacific.edu.ph', 'guard', 'FAILED', NULL, NULL, '2026-03-16 19:06:55'),
(23, 43, 'Jan Ray Aquino', 'janrayaquino9@gmail.com', 'student', 'SUCCESS', NULL, NULL, '2026-03-16 19:07:15'),
(24, NULL, NULL, 'janrayaquino9@gmail.com', 'guard', 'FAILED', NULL, NULL, '2026-03-16 19:08:00'),
(25, NULL, NULL, 'janrayaquino9@gmail.com', 'guard', 'FAILED', NULL, NULL, '2026-03-16 19:08:04'),
(26, NULL, NULL, 'steven.agustin.ecoast@panpacificu.edu.ph', 'guard', 'FAILED', NULL, NULL, '2026-03-16 19:08:49'),
(27, NULL, NULL, 'janrayaquino9@gmail.com', 'admin', 'FAILED', NULL, NULL, '2026-03-16 19:09:09'),
(28, NULL, NULL, 'steven.agustin.ecoast@panpacificu.edu.ph', 'admin', 'FAILED', NULL, NULL, '2026-03-16 19:09:26'),
(29, NULL, NULL, 'gray@panpacific.edu.ph', 'guard', 'FAILED', NULL, NULL, '2026-03-16 19:09:35'),
(30, 5, 'Gray Fullbusters', 'gray@panpacificu.edu.ph', 'guard', 'SUCCESS', NULL, NULL, '2026-03-16 19:09:41'),
(31, NULL, NULL, 'gray.ecoast@panpacificu.edu.ph', 'admin', 'FAILED', NULL, NULL, '2026-03-16 19:10:28'),
(32, 5, 'Gray Fullbusters', 'gray@panpacificu.edu.ph', 'guard', 'SUCCESS', NULL, NULL, '2026-03-16 19:11:08'),
(33, 1, 'CSS Administrator', 'admin@panpacificu.edu.ph', 'admin', 'SUCCESS', NULL, NULL, '2026-03-16 19:11:47'),
(34, NULL, NULL, 'natsu@panpacificu.edu.ph', 'student', 'FAILED', NULL, NULL, '2026-03-16 20:51:39'),
(35, 5, 'Gray Fullbusters', 'gray@panpacificu.edu.ph', 'guard', 'SUCCESS', NULL, NULL, '2026-03-16 22:06:14'),
(36, 23, 'Lucy Heartfilla', 'lucy@panpacificu.edu.ph', 'student', 'SUCCESS', NULL, NULL, '2026-03-17 01:03:52'),
(37, 1, 'CSS Administrator', 'admin@panpacificu.edu.ph', 'admin', 'FAILED', NULL, NULL, '2026-03-17 01:05:27'),
(38, 1, 'CSS Administrator', 'admin@panpacificu.edu.ph', 'admin', 'SUCCESS', NULL, NULL, '2026-03-17 01:05:38'),
(39, 18, 'Mark Zuckerberg', 'markzuckerberg@panpacificu.edu.ph', 'teacher', 'SUCCESS', NULL, NULL, '2026-03-17 01:06:27'),
(40, 7, 'Steven John A. Agustin', 'steven.agustin.ecoast@panpacificu.edu.ph', 'teacher', 'SUCCESS', NULL, NULL, '2026-03-17 01:09:45'),
(41, 1, 'Super Administrator', 'superadmin@panpacificu.edu.ph', 'super_admin', 'SUCCESS', NULL, NULL, '2026-03-19 12:04:37'),
(42, NULL, NULL, 'chari@panpacificu.edu.ph', 'teacher', 'FAILED', NULL, NULL, '2026-03-19 12:38:52'),
(43, NULL, NULL, 'chari@panpacificu.edu.ph', 'teacher', 'FAILED', NULL, NULL, '2026-03-19 12:39:00'),
(44, 1, 'CSS Administrator', 'admin@panpacificu.edu.ph', 'admin', 'SUCCESS', NULL, NULL, '2026-03-19 12:39:16'),
(45, 18, 'Mark Zuckerberg', 'markzuckerberg@panpacificu.edu.ph', 'teacher', 'SUCCESS', NULL, NULL, '2026-03-19 12:39:34'),
(46, 7, 'Steven John A. Agustin', 'steven.agustin.ecoast@panpacificu.edu.ph', 'teacher', 'SUCCESS', NULL, NULL, '2026-03-19 13:15:16'),
(47, 7, 'Steven John A. Agustin', 'steven.agustin.ecoast@panpacificu.edu.ph', 'teacher', 'SUCCESS', NULL, NULL, '2026-03-19 13:17:43'),
(48, 23, 'Lucy Heartfilla', 'lucy@panpacificu.edu.ph', 'student', 'SUCCESS', NULL, NULL, '2026-03-19 13:18:14'),
(49, 19, 'Andrea Lachica', 'andrea@panpacificu.edu.ph', 'teacher', 'SUCCESS', NULL, NULL, '2026-03-19 16:32:42'),
(50, NULL, NULL, 'jasmin@gmail.com', 'student', 'FAILED', NULL, NULL, '2026-03-19 17:07:10'),
(51, 44, 'Jasmin Pastor', 'jasmin@gmail.com', 'student', 'SUCCESS', NULL, NULL, '2026-03-19 17:08:44'),
(52, 19, 'Andrea Lachica', 'andrea@panpacificu.edu.ph', 'teacher', 'SUCCESS', NULL, NULL, '2026-03-19 17:09:25'),
(53, 44, 'Jasmin Pastor', 'jasmin@gmail.com', 'student', 'SUCCESS', NULL, NULL, '2026-03-19 17:12:48'),
(54, 1, 'CSS Administrator', 'admin@panpacificu.edu.ph', 'admin', 'FAILED', NULL, NULL, '2026-03-19 17:22:08'),
(55, 1, 'CSS Administrator', 'admin@panpacificu.edu.ph', 'admin', 'SUCCESS', NULL, NULL, '2026-03-19 17:22:13'),
(56, NULL, NULL, 'stevenjohnagustin25@panpacificu.edu.ph', 'teacher', 'FAILED', NULL, NULL, '2026-03-19 17:38:16'),
(57, 46, 'Steven John Agustin (CoAST)', 'steven.agustin.ecoast@panpacificu.edu.ph', 'student', 'SUCCESS', NULL, NULL, '2026-03-20 00:57:56'),
(58, NULL, NULL, 'lucy@panpancificu.edu.ph', 'student', 'FAILED', NULL, NULL, '2026-03-20 00:58:13'),
(59, 46, 'Steven John Agustin (CoAST)', 'steven.agustin.ecoast@panpacificu.edu.ph', 'student', 'SUCCESS', NULL, NULL, '2026-03-20 01:03:41'),
(60, 18, 'Mark Zuckerberg', 'markzuckerberg@panpacificu.edu.ph', 'teacher', 'SUCCESS', NULL, NULL, '2026-03-20 15:58:13'),
(61, 7, 'Steven John A. Agustin', 'steven.agustin.ecoast@panpacificu.edu.ph', 'teacher', 'SUCCESS', NULL, NULL, '2026-03-20 15:58:52'),
(62, 1, 'CSS Administrator', 'admin@panpacificu.edu.ph', 'admin', 'SUCCESS', NULL, NULL, '2026-03-20 16:00:24'),
(63, 23, 'Lucy Heartfilla', 'lucy@panpacificu.edu.ph', 'student', 'SUCCESS', NULL, NULL, '2026-03-20 16:00:50'),
(64, 23, 'Lucy Heartfilla', 'lucy@panpacificu.edu.ph', 'student', 'SUCCESS', NULL, NULL, '2026-03-20 16:01:11'),
(65, 46, 'Steven John Agustin (CoAST)', 'steven.agustin.ecoast@panpacificu.edu.ph', 'student', 'SUCCESS', NULL, NULL, '2026-03-20 16:01:47'),
(66, 7, 'Steven John A. Agustin', 'steven.agustin.ecoast@panpacificu.edu.ph', 'teacher', 'SUCCESS', NULL, NULL, '2026-03-20 16:03:05'),
(67, 1, 'Super Administrator', 'superadmin@panpacificu.edu.ph', 'super_admin', 'SUCCESS', NULL, NULL, '2026-03-20 21:09:07'),
(68, 1, 'Super Administrator', 'superadmin@panpacificu.edu.ph', 'super_admin', 'SUCCESS', NULL, NULL, '2026-03-21 11:19:09'),
(69, 5, 'Gray Fullbusters', 'gray@panpacificu.edu.ph', 'guard', 'SUCCESS', NULL, NULL, '2026-03-21 12:40:55'),
(70, 1, 'CSS Administrator', 'admin@panpacificu.edu.ph', 'admin', 'SUCCESS', NULL, NULL, '2026-03-21 14:24:41'),
(71, 1, 'CSS Administrator', 'admin@panpacificu.edu.ph', 'admin', 'SUCCESS', NULL, NULL, '2026-03-21 14:27:30'),
(72, 1, 'Super Administrator', 'superadmin@panpacificu.edu.ph', 'super_admin', 'SUCCESS', NULL, NULL, '2026-03-21 14:45:36'),
(73, 5, 'Gray Fullbusters', 'gray@panpacificu.edu.ph', 'guard', 'SUCCESS', NULL, NULL, '2026-03-21 15:13:31'),
(74, 18, 'Mark Zuckerberg', 'markzuckerberg@panpacificu.edu.ph', 'teacher', 'SUCCESS', NULL, NULL, '2026-03-21 16:39:13'),
(75, NULL, NULL, 'gray@panpacificu.edu.ph', 'student', 'FAILED', NULL, NULL, '2026-03-21 17:02:19'),
(76, NULL, NULL, 'lucy@panpacificu.edu.ph', 'student', 'FAILED', NULL, NULL, '2026-03-21 17:02:27'),
(77, 23, 'Lucy Heartfilla', 'lucyheart@panpacificu.edu.ph', 'student', 'SUCCESS', NULL, NULL, '2026-03-21 17:02:31'),
(78, 7, 'Steven John A. Agustin', 'steven.agustin.ecoast@panpacificu.edu.ph', 'teacher', 'SUCCESS', NULL, NULL, '2026-03-21 17:06:59'),
(79, 7, 'Steven John A. Agustin', 'steven.agustin.ecoast@panpacificu.edu.ph', 'teacher', 'SUCCESS', NULL, NULL, '2026-03-21 17:21:34'),
(80, 5, 'Gray Fullbusters', 'gray@panpacificu.edu.ph', 'guard', 'SUCCESS', NULL, NULL, '2026-03-21 17:22:57'),
(81, 5, 'Gray Fullbusters', 'gray@panpacificu.edu.ph', 'guard', 'SUCCESS', NULL, NULL, '2026-03-21 17:25:43'),
(82, 18, 'Mark Zuckerberg', 'markzuckerberg@panpacificu.edu.ph', 'teacher', 'SUCCESS', NULL, NULL, '2026-03-21 17:26:06'),
(83, NULL, NULL, 'steven.agustin.ecoast@panpacificu.edu.ph', 'super_admin', 'FAILED', NULL, NULL, '2026-03-21 19:26:12'),
(84, 1, 'Super Administrator', 'superadmin@panpacificu.edu.ph', 'super_admin', 'SUCCESS', NULL, NULL, '2026-03-21 19:26:32'),
(85, 23, 'Lucy Heartfilla', 'lucyheart@panpacificu.edu.ph', 'student', 'SUCCESS', '::ffff:127.0.0.1', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Mobile Safari/537.36', '2026-03-21 19:52:56'),
(86, 7, 'Steven John A. Agustin', 'steven.agustin.ecoast@panpacificu.edu.ph', 'teacher', 'SUCCESS', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', '2026-03-21 19:53:26'),
(87, 5, 'Gray Fullbusters', 'gray@panpacificu.edu.ph', 'guard', 'SUCCESS', '::ffff:127.0.0.1', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Mobile Safari/537.36', '2026-03-21 19:54:24'),
(88, 5, 'Gray Fullbusters', 'gray@panpacificu.edu.ph', 'guard', 'SUCCESS', '136.158.120.56', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', '2026-03-21 19:56:49'),
(89, 5, 'Gray Fullbusters', 'gray@panpacificu.edu.ph', 'guard', 'SUCCESS', '136.158.120.56', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Mobile Safari/537.36', '2026-03-21 19:57:46'),
(90, 1, 'CSS Administrator', 'admin@panpacificu.edu.ph', 'admin', 'LOGOUT', '136.158.120.56', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', '2026-03-21 20:06:57'),
(91, 5, 'Gray Fullbusters', 'gray@panpacificu.edu.ph', 'guard', 'SUCCESS', '136.158.120.56', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Mobile Safari/537.36', '2026-03-21 20:07:22'),
(92, 23, 'Lucy Heartfilla', 'lucyheart@panpacificu.edu.ph', 'student', 'SUCCESS', '136.158.120.56', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Mobile Safari/537.36', '2026-03-21 20:09:48'),
(93, 23, 'Lucy Heartfilla', 'lucyheart@panpacificu.edu.ph', 'student', 'LOGOUT', '136.158.120.56', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Mobile Safari/537.36', '2026-03-21 20:10:00'),
(94, 18, 'Mark Zuckerberg', 'markzuckerberg@panpacificu.edu.ph', 'teacher', 'SUCCESS', '136.158.120.56', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Mobile Safari/537.36', '2026-03-21 20:10:19'),
(95, 5, 'Gray Fullbusters', 'gray@panpacificu.edu.ph', 'guard', 'SUCCESS', '136.158.120.56', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Mobile Safari/537.36', '2026-03-21 20:10:50'),
(96, 23, 'Lucy Heartfilla', 'lucyheart@panpacificu.edu.ph', 'student', 'SUCCESS', '136.158.120.56', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Mobile Safari/537.36', '2026-03-21 20:11:23'),
(97, 23, 'Lucy Heartfilla', 'lucyheart@panpacificu.edu.ph', 'student', 'LOGOUT', '136.158.120.56', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Mobile Safari/537.36', '2026-03-21 20:11:33'),
(98, 23, 'Lucy Heartfilla', 'lucyheart@panpacificu.edu.ph', 'student', 'SUCCESS', '136.158.120.56', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Mobile Safari/537.36', '2026-03-21 20:20:25'),
(99, 23, 'Lucy Heartfilla', 'lucyheart@panpacificu.edu.ph', 'student', 'LOGOUT', '136.158.120.56', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Mobile Safari/537.36', '2026-03-21 20:20:44'),
(100, 23, 'Lucy Heartfilla', 'lucyheart@panpacificu.edu.ph', 'student', 'SUCCESS', '136.158.120.56', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Mobile Safari/537.36', '2026-03-21 20:20:48'),
(101, 5, 'Gray Fullbusters', 'gray@panpacificu.edu.ph', 'guard', 'SUCCESS', '136.158.120.56', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Mobile Safari/537.36', '2026-03-21 20:20:59'),
(102, 5, 'Gray Fullbusters', 'gray@panpacificu.edu.ph', 'guard', 'LOGOUT', '136.158.120.56', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Mobile Safari/537.36', '2026-03-21 20:21:04'),
(103, 18, 'Mark Zuckerberg', 'markzuckerberg@panpacificu.edu.ph', 'teacher', 'SUCCESS', '136.158.120.56', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', '2026-03-21 20:21:16'),
(104, 1, 'CSS Administrator', 'admin@panpacificu.edu.ph', 'admin', 'SUCCESS', '136.158.120.56', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', '2026-03-21 20:21:19'),
(105, 1, 'CSS Administrator', 'admin@panpacificu.edu.ph', 'admin', 'LOGOUT', '136.158.120.56', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', '2026-03-21 20:21:50'),
(106, 18, 'Mark Zuckerberg', 'markzuckerberg@panpacificu.edu.ph', 'teacher', 'LOGOUT', '136.158.120.56', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', '2026-03-21 20:21:56'),
(107, 1, 'CSS Administrator', 'admin@panpacificu.edu.ph', 'admin', 'SUCCESS', '136.158.120.56', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', '2026-03-21 21:25:50'),
(108, 18, 'Mark Zuckerberg', 'markzuckerberg@panpacificu.edu.ph', 'teacher', 'SUCCESS', '136.158.120.56', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', '2026-03-21 21:27:04'),
(109, 5, 'Gray Fullbusters', 'gray@panpacificu.edu.ph', 'guard', 'SUCCESS', '136.158.120.56', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Mobile Safari/537.36', '2026-03-21 21:42:48'),
(110, 5, 'Gray Fullbusters', 'gray@panpacificu.edu.ph', 'guard', 'LOGOUT', '136.158.120.56', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Mobile Safari/537.36', '2026-03-21 21:44:08'),
(111, 5, 'Gray Fullbusters', 'gray@panpacificu.edu.ph', 'guard', 'SUCCESS', '136.158.120.56', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Mobile Safari/537.36', '2026-03-21 21:51:44'),
(112, 5, 'Gray Fullbusters', 'gray@panpacificu.edu.ph', 'guard', 'LOGOUT', '136.158.120.56', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Mobile Safari/537.36', '2026-03-21 21:51:56'),
(113, 5, 'Gray Fullbusters', 'gray@panpacificu.edu.ph', 'guard', 'SUCCESS', '136.158.120.56', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Mobile Safari/537.36', '2026-03-21 21:58:33'),
(114, 5, 'Gray Fullbusters', 'gray@panpacificu.edu.ph', 'guard', 'LOGOUT', '136.158.120.56', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Mobile Safari/537.36', '2026-03-21 21:58:50'),
(115, 7, 'Steven John A. Agustin', 'steven.agustin.ecoast@panpacificu.edu.ph', 'teacher', 'LOGOUT', '136.158.120.56', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', '2026-03-21 22:04:43'),
(116, 7, 'Steven John A. Agustin', 'steven.agustin.ecoast@panpacificu.edu.ph', 'teacher', 'SUCCESS', '136.158.120.56', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', '2026-03-21 22:04:47'),
(117, 5, 'Gray Fullbusters', 'gray@panpacificu.edu.ph', 'guard', 'SUCCESS', '136.158.120.56', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Mobile Safari/537.36', '2026-03-21 22:05:21'),
(118, 23, 'Lucy Heartfilla', 'lucyheart@panpacificu.edu.ph', 'student', 'LOGOUT', '136.158.120.56', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Mobile Safari/537.36', '2026-03-21 22:05:32'),
(119, 23, 'Lucy Heartfilla', 'lucyheart@panpacificu.edu.ph', 'student', 'SUCCESS', '136.158.120.56', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Mobile Safari/537.36', '2026-03-21 22:05:36'),
(120, 23, 'Lucy Heartfilla', 'lucyheart@panpacificu.edu.ph', 'student', 'SUCCESS', '136.158.120.56', 'Google Chrome 144 · Android 14.0.0 · Infinix X6731B', '2026-03-21 22:07:26'),
(121, 18, 'Mark Zuckerberg', 'markzuckerberg@panpacificu.edu.ph', 'teacher', 'LOGOUT', '136.158.120.56', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', '2026-03-21 22:08:18'),
(122, 1, 'Administrator', 'admin@panpacificu.edu.ph', 'admin', 'SUCCESS', '136.158.120.56', 'Google Chrome 144 · Android 14.0.0 · Infinix X6731B', '2026-03-21 22:09:22'),
(123, 5, 'Gray Fullbusters', 'gray@panpacificu.edu.ph', 'guard', 'LOGOUT', '136.158.120.56', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Mobile Safari/537.36', '2026-03-21 22:10:51'),
(124, 5, 'Gray Fullbusters', 'gray@panpacificu.edu.ph', 'guard', 'SUCCESS', '136.158.120.56', 'Google Chrome 144 · Android 14.0.0 · Infinix X6731B', '2026-03-21 22:11:00'),
(125, 1, 'Super Administrator', 'superadmin@panpacificu.edu.ph', 'super_admin', 'SUCCESS', '136.158.120.56', 'Google Chrome 146 · Windows 10.0.0', '2026-03-21 22:29:18'),
(126, 18, 'Mark Zuckerberg', 'markzuckerberg@panpacificu.edu.ph', 'teacher', 'SUCCESS', '136.158.120.56', 'Google Chrome 146 · Windows 10.0.0', '2026-03-21 22:33:03'),
(127, 1, 'Administrator', 'admin@panpacificu.edu.ph', 'admin', 'SUCCESS', '136.158.120.56', 'Google Chrome 146 · Windows 10.0.0', '2026-03-21 22:34:58'),
(128, 5, 'Gray Fullbusters', 'gray@panpacificu.edu.ph', 'guard', 'LOGOUT', '136.158.120.56', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Mobile Safari/537.36', '2026-03-21 22:35:20'),
(129, 5, 'Gray Fullbusters', 'gray@panpacificu.edu.ph', 'guard', 'SUCCESS', '136.158.120.56', 'Google Chrome 144 · Android 14.0.0 · Infinix X6731B', '2026-03-21 22:35:25'),
(130, 5, 'Gray Fullbusters', 'gray@panpacificu.edu.ph', 'guard', 'LOGOUT', '136.158.120.56', 'Google Chrome 144 · Android 14.0.0 · Infinix X6731B', '2026-03-21 22:36:23'),
(131, 18, 'Mark Zuckerberg', 'markzuckerberg@panpacificu.edu.ph', 'teacher', 'LOGOUT', '136.158.120.56', 'Google Chrome 146 · Windows 10.0.0', '2026-03-21 22:50:00'),
(132, 18, 'Mark Zuckerberg', 'markzuckerberg@panpacificu.edu.ph', 'teacher', 'SUCCESS', '136.158.120.56', 'Google Chrome 146 · Windows 10.0.0', '2026-03-21 22:50:05'),
(133, 1, 'Administrator', 'admin@panpacificu.edu.ph', 'admin', 'LOGOUT', '136.158.120.56', 'Google Chrome 146 · Windows 10.0.0', '2026-03-21 22:50:35'),
(134, 1, 'Administrator', 'admin@panpacificu.edu.ph', 'admin', 'SUCCESS', '136.158.120.56', 'Google Chrome 146 · Windows 10.0.0', '2026-03-21 22:50:49'),
(135, 5, 'Gray Fullbusters', 'gray@panpacificu.edu.ph', 'guard', 'SUCCESS', '136.158.120.56', 'Google Chrome 144 · Android 14.0.0 · Infinix X6731B', '2026-03-21 22:51:01'),
(136, 5, 'Gray Fullbusters', 'gray@panpacificu.edu.ph', 'guard', 'LOGOUT', '136.158.120.56', 'Google Chrome 144 · Android 14.0.0 · Infinix X6731B', '2026-03-21 22:51:54'),
(137, 23, 'Lucy Heartfilla', 'lucyheart@panpacificu.edu.ph', 'student', 'LOGOUT', '136.158.120.56', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Mobile Safari/537.36', '2026-03-21 22:56:54'),
(138, 23, 'Lucy Heartfilla', 'lucyheart@panpacificu.edu.ph', 'student', 'SUCCESS', '136.158.120.56', 'Google Chrome 144 · Android 14.0.0 · Infinix X6731B', '2026-03-21 22:57:01'),
(139, 46, 'Steven John Agustin (CoAST)', 'steven.agustin.ecoast@panpacificu.edu.ph', 'student', 'SUCCESS', '136.158.120.56', 'Chrome 146 · Android 6 · Nexus 5', '2026-03-21 23:06:00'),
(140, 35, 'Natsu Dragneel', 'xnatsu25@gmail.com', 'student', 'SUCCESS', '136.158.120.56', 'Chrome 146 · Android 6 · Nexus 5', '2026-03-21 23:08:15'),
(141, 18, 'Mark Zuckerberg', 'markzuckerberg@panpacificu.edu.ph', 'teacher', 'LOGOUT', '136.158.120.56', 'Google Chrome 146 · Windows 10.0.0', '2026-03-21 23:11:39'),
(142, 18, 'Mark Zuckerberg', 'markzuckerberg@panpacificu.edu.ph', 'teacher', 'SUCCESS', '136.158.120.56', 'Chrome 146 · Windows 10', '2026-03-21 23:11:52'),
(143, 35, 'Natsu Dragneel', 'xnatsu25@gmail.com', 'student', 'LOGOUT', '136.158.120.56', 'Chrome 146 · Android 6 · Nexus 5', '2026-03-21 23:48:30'),
(144, 35, 'Natsu Dragneel', 'xnatsu25@gmail.com', 'student', 'LOGOUT', '136.158.120.56', 'Chrome 146 · Android 6 · Nexus 5', '2026-03-21 23:49:12'),
(145, 46, 'Steven John Agustin (CoAST)', 'steven.agustin.ecoast@panpacificu.edu.ph', 'student', 'SUCCESS', '136.158.120.56', 'Chrome 146 · Android 6 · Nexus 5', '2026-03-21 23:49:22'),
(146, 46, 'Steven John Agustin (CoAST)', 'steven.agustin.ecoast@panpacificu.edu.ph', 'student', 'LOGOUT', '136.158.120.56', 'Chrome 146 · Android 6 · Nexus 5', '2026-03-21 23:49:41'),
(147, 35, 'Natsu Dragneel', 'xnatsu25@gmail.com', 'student', 'LOGOUT', '136.158.120.56', 'Chrome 146 · Android 6 · Nexus 5', '2026-03-21 23:49:54'),
(148, 23, 'Lucy Heartfilla', 'lucyheart@panpacificu.edu.ph', 'student', 'FAILED', '136.158.120.56', 'Chrome 146 · Android 6 · Nexus 5', '2026-03-21 23:50:12'),
(149, 18, 'Mark Zuckerberg', 'markzuckerberg@panpacificu.edu.ph', 'teacher', 'LOGOUT', '136.158.120.56', 'Chrome 146 · Windows 10', '2026-03-21 23:51:07'),
(150, 18, 'Mark Zuckerberg', 'markzuckerberg@panpacificu.edu.ph', 'teacher', 'SUCCESS', '136.158.120.56', 'Chrome 146 · Windows 10', '2026-03-22 01:28:55'),
(151, 1, 'Administrator', 'admin@panpacificu.edu.ph', 'admin', 'LOGOUT', '136.158.120.56', 'Google Chrome 146 · Windows 10.0.0', '2026-03-22 01:30:12'),
(152, 2, 'Steven John A. Agustin', 'steven.agustin.admin@panpacificu.edu.ph', 'admin', 'SUCCESS', '136.158.120.56', 'Chrome 146 · Windows 10', '2026-03-22 02:30:00'),
(153, 2, 'Steven John A. Agustin', 'steven.agustin.admin@panpacificu.edu.ph', 'admin', 'LOGOUT', '136.158.120.56', 'Chrome 146 · Windows 10', '2026-03-22 02:30:15'),
(154, 2, 'Steven John A. Agustin', 'steven.agustin.admin@panpacificu.edu.ph', 'admin', 'SUCCESS', '136.158.120.56', 'Chrome 146 · Windows 10', '2026-03-22 02:30:25'),
(155, 2, 'Steven John A. Agustin', 'steven.agustin.admin@panpacificu.edu.ph', 'admin', 'LOGOUT', '136.158.120.56', 'Chrome 146 · Windows 10', '2026-03-22 02:30:55'),
(156, 1, 'Administrator', 'admin@panpacificu.edu.ph', 'admin', 'SUCCESS', '136.158.120.56', 'Chrome 146 · Windows 10', '2026-03-22 02:42:19'),
(157, 1, 'Super Administrator', 'superadmin@panpacificu.edu.ph', 'super_admin', 'LOGOUT', '136.158.120.56', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', '2026-03-22 02:42:50'),
(158, 1, 'Super Administrator', 'superadmin@panpacificu.edu.ph', 'super_admin', 'SUCCESS', '136.158.120.56', 'Chrome 146 · Windows 10', '2026-03-22 02:42:56'),
(159, 1, 'Administrator', 'admin@panpacificu.edu.ph', 'admin', 'LOGOUT', '136.158.120.56', 'Chrome 146 · Windows 10', '2026-03-22 03:23:14'),
(160, 18, 'Mark Zuckerberg', 'markzuckerberg@panpacificu.edu.ph', 'teacher', 'LOGOUT', '136.158.120.56', 'Chrome 146 · Windows 10', '2026-03-22 03:23:36'),
(161, 1, 'Super Administrator', 'superadmin@panpacificu.edu.ph', 'super_admin', 'LOGOUT', '136.158.120.56', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', '2026-03-22 03:23:50'),
(162, NULL, NULL, 'chari@panpacificu.edu.ph', 'teacher', 'FAILED', '136.158.120.56', 'Chrome 146 · Windows 10', '2026-03-22 03:49:26'),
(163, 7, 'Steven John A. Agustin', 'steven.agustin.ecoast@panpacificu.edu.ph', 'teacher', 'SUCCESS', '136.158.120.56', 'Chrome 146 · Windows 10', '2026-03-22 03:49:56'),
(164, 7, 'Steven John A. Agustin', 'steven.agustin.ecoast@panpacificu.edu.ph', 'teacher', 'LOGOUT', '136.158.120.56', 'Chrome 146 · Windows 10', '2026-03-22 03:50:57'),
(165, 1, 'Administrator', 'admin@panpacificu.edu.ph', 'admin', 'SUCCESS', '136.158.120.56', 'Chrome 146 · Windows 10', '2026-03-22 11:38:20'),
(166, 7, 'Steven John A. Agustin', 'steven.agustin.ecoast@panpacificu.edu.ph', 'teacher', 'SUCCESS', '136.158.120.56', 'Chrome 146 · Windows 10', '2026-03-22 11:40:10'),
(167, 18, 'Mark Zuckerberg', 'markzuckerberg@panpacificu.edu.ph', 'teacher', 'SUCCESS', '136.158.120.56', 'Chrome 146 · Windows 10', '2026-03-22 12:23:46'),
(168, 7, 'Steven John A. Agustin', 'steven.agustin.ecoast@panpacificu.edu.ph', 'teacher', 'SUCCESS', '136.158.120.56', 'Chrome 146 · Windows 10', '2026-03-22 12:35:24'),
(169, 1, 'Super Administrator', 'superadmin@panpacificu.edu.ph', 'super_admin', 'SUCCESS', '136.158.120.56', 'Chrome 146 · Windows 10', '2026-03-22 13:05:14'),
(170, 23, 'Lucy Heartfilla', 'lucyheart@panpacificu.edu.ph', 'student', 'LOGOUT', '136.158.120.56', 'Google Chrome 144 · Android 14.0.0 · Infinix X6731B', '2026-03-22 14:17:20'),
(171, 23, 'Lucy Heartfilla', 'lucyheart@panpacificu.edu.ph', 'student', 'SUCCESS', '136.158.120.56', 'Chrome 144 · Android 14 · Infinix X6731B', '2026-03-22 14:17:28'),
(172, 47, 'Hbd U', 'example@panpacificu.edu.ph', 'student', 'FAILED', '136.158.120.56', 'Chromium 145 · Android 10 · CPH2179', '2026-03-22 14:33:22'),
(173, 47, 'Hbd U', 'example@panpacificu.edu.ph', 'student', 'FAILED', '136.158.120.56', 'Chromium 145 · Android 10 · CPH2179', '2026-03-22 14:33:42'),
(174, 47, 'Hbd U', 'example@panpacificu.edu.ph', 'student', 'FAILED', '136.158.120.56', 'Chromium 145 · Android 10 · CPH2179', '2026-03-22 14:34:37'),
(175, 47, 'Hbd U', 'example@panpacificu.edu.ph', 'student', 'SUCCESS', '136.158.120.56', 'Chrome · Android 10 · en-us; CPH2179', '2026-03-22 14:36:29'),
(176, 23, 'Lucy Heartfilla', 'lucyheart@panpacificu.edu.ph', 'student', 'LOGOUT', '136.158.120.56', 'Chrome 144 · Android 14 · Infinix X6731B', '2026-03-22 14:41:10'),
(177, 42, 'Zaiejan Agustin', 'zaiejanagustin@gmail.com', 'student', 'SUCCESS', '136.158.120.56', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Mobile Safari/537.36', '2026-03-22 14:43:15'),
(178, 42, 'Zaiejan Agustin', 'zaiejanagustin@gmail.com', 'student', 'LOGOUT', '136.158.120.56', 'Chrome 144 · Android 14 · Infinix X6731B', '2026-03-22 14:47:55'),
(179, 23, 'Lucy Heartfilla', 'lucyheart@panpacificu.edu.ph', 'student', 'SUCCESS', '136.158.120.56', 'Chrome 144 · Android 14 · Infinix X6731B', '2026-03-22 14:52:19'),
(180, NULL, NULL, 'chari@panpacificu.edu.ph', 'student', 'FAILED', '136.158.120.56', 'Chrome 146 · Windows 10', '2026-03-22 14:58:05'),
(181, 18, 'Mark Zuckerberg', 'markzuckerberg@panpacificu.edu.ph', 'teacher', 'LOGOUT', '136.158.120.56', 'Chrome 146 · Windows 10', '2026-03-22 15:10:10'),
(182, 1, 'Super Administrator', 'superadmin@panpacificu.edu.ph', 'super_admin', 'LOGOUT', '136.158.120.56', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', '2026-03-22 15:10:22'),
(183, 1, 'Super Administrator', 'superadmin@panpacificu.edu.ph', 'super_admin', 'SUCCESS', '136.158.120.56', 'Chrome 146 · Windows 10', '2026-03-22 15:10:54'),
(184, 18, 'Mark Zuckerberg', 'markzuckerberg@panpacificu.edu.ph', 'teacher', 'SUCCESS', '136.158.120.56', 'Chrome 146 · Windows 10', '2026-03-22 15:23:15'),
(185, 46, 'Steven John Agustin (CoAST)', 'steven.agustin.ecoast@panpacificu.edu.ph', 'student', 'SUCCESS', '136.158.120.56', 'Chrome 146 · Windows 10', '2026-03-22 15:23:27'),
(186, 5, 'Gray Fullbusters', 'gray@panpacificu.edu.ph', 'guard', 'SUCCESS', '136.158.120.56', 'Chrome 144 · Android 14 · Infinix X6731B', '2026-03-22 15:23:57'),
(187, 5, 'Gray Fullbusters', 'gray@panpacificu.edu.ph', 'guard', 'LOGOUT', '136.158.120.56', 'Chrome 144 · Android 14 · Infinix X6731B', '2026-03-22 15:25:01'),
(188, 46, 'Steven John Agustin (CoAST)', 'steven.agustin.ecoast@panpacificu.edu.ph', 'student', 'LOGOUT', '136.158.120.56', 'Chrome 146 · Windows 10', '2026-03-22 19:31:43'),
(189, 41, 'Angel Mageri Cabote (ECoAST)', 'angel.cabote.ecoast@panpacificu.edu.ph', 'student', 'SUCCESS', '136.158.120.56', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', '2026-03-22 19:31:52'),
(190, 41, 'Angel Mageri Cabote (ECoAST)', 'angel.cabote.ecoast@panpacificu.edu.ph', 'student', 'LOGOUT', '136.158.120.56', 'Chrome 146 · Windows 10', '2026-03-22 19:32:02'),
(191, NULL, NULL, 'steven.agustin.ecoast@panpacificu.edu.ph', 'super_admin', 'FAILED', '182.255.40.171', 'Edge 146 · Windows 19', '2026-03-22 19:44:58'),
(192, 1, 'Super Administrator', 'superadmin@panpacificu.edu.ph', 'super_admin', 'SUCCESS', '136.158.120.56', 'Chrome 146 · Windows 10', '2026-03-22 19:49:52'),
(193, 18, 'Mark Zuckerberg', 'markzuckerberg@panpacificu.edu.ph', 'teacher', 'LOGOUT', '136.158.120.56', 'Chrome 146 · Windows 10', '2026-03-22 19:50:07'),
(194, 1, 'Super Administrator', 'superadmin@panpacificu.edu.ph', 'super_admin', 'SUCCESS', '136.158.120.56', 'Chrome 146 · Windows 10', '2026-03-22 19:51:17'),
(195, 19, 'Charimea Selga', 'charimea.selga.ecoast@panpacificu.edu.ph', 'student', 'SUCCESS', '182.255.40.171', 'Chromium 145 · Android 14 · CPH2387', '2026-03-22 19:51:39'),
(196, 41, 'Angel Mageri Cabote (ECoAST)', 'angel.cabote.ecoast@panpacificu.edu.ph', 'student', 'SUCCESS', '136.158.120.56', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', '2026-03-22 19:52:29'),
(197, 1, 'Super Administrator', 'superadmin@panpacificu.edu.ph', 'super_admin', 'SUCCESS', '182.255.40.171', 'Edge 146 · Windows 19', '2026-03-22 19:54:09'),
(198, 19, 'Charimea Selga', 'charimea.selga.ecoast@panpacificu.edu.ph', 'student', 'LOGOUT', '182.255.40.171', 'Chromium 145 · Android 14 · CPH2387', '2026-03-22 19:56:15'),
(199, 41, 'Angel Mageri Cabote (ECoAST)', 'angel.cabote.ecoast@panpacificu.edu.ph', 'student', 'LOGOUT', '136.158.120.56', 'Chrome 146 · Windows 10', '2026-03-22 19:56:40'),
(200, 46, 'Steven John Agustin (CoAST)', 'steven.agustin.ecoast@panpacificu.edu.ph', 'student', 'SUCCESS', '136.158.120.56', 'Chrome 146 · Android 6 · Nexus 5', '2026-03-22 20:10:12'),
(201, 18, 'Mark Zuckerberg', 'markzuckerberg@panpacificu.edu.ph', 'teacher', 'SUCCESS', '136.158.120.56', 'Chrome 146 · Windows 10', '2026-03-22 20:10:26'),
(202, NULL, NULL, 'gray@panpacificu.edu', 'guard', 'FAILED', '136.158.120.56', 'Chrome 146 · Windows 10', '2026-03-22 20:11:16'),
(203, NULL, NULL, 'gray@panpacificu.edu', 'guard', 'FAILED', '136.158.120.56', 'Chrome 146 · Windows 10', '2026-03-22 20:11:25'),
(204, NULL, NULL, 'gray@panpacificu.edu', 'guard', 'FAILED', '136.158.120.56', 'Chrome 146 · Windows 10', '2026-03-22 20:11:42'),
(205, NULL, NULL, 'gray@panpacificu.edu', 'guard', 'FAILED', '136.158.120.56', 'Chrome 146 · Windows 10', '2026-03-22 20:11:47'),
(206, NULL, NULL, 'gray@panpacific.edu', 'guard', 'FAILED', '136.158.120.56', 'Chrome 146 · Windows 10', '2026-03-22 20:11:58'),
(207, 5, 'Gray Fullbusters', 'gray@panpacificu.edu.ph', 'guard', 'SUCCESS', '136.158.120.56', 'Chrome 146 · Windows 10', '2026-03-22 20:12:23'),
(208, 5, 'Gray Fullbusters', 'gray@panpacificu.edu.ph', 'guard', 'LOGOUT', '136.158.120.56', 'Chrome 146 · Windows 10', '2026-03-22 20:12:51'),
(209, 41, 'Angel Mageri Cabote (ECoAST)', 'angel.cabote.ecoast@panpacificu.edu.ph', 'student', 'SUCCESS', '136.158.120.56', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', '2026-03-22 20:19:57'),
(210, 41, 'Angel Mageri Cabote (ECoAST)', 'angel.cabote.ecoast@panpacificu.edu.ph', 'student', 'LOGOUT', '136.158.120.56', 'Chrome 146 · Windows 10', '2026-03-22 20:20:02'),
(211, 7, 'Steven John A. Agustin', 'steven.agustin.ecoast@panpacificu.edu.ph', 'teacher', 'SUCCESS', '182.255.40.171', 'Edge 146 · Windows 19', '2026-03-22 20:32:33'),
(212, 46, 'Steven John Agustin (CoAST)', 'steven.agustin.ecoast@panpacificu.edu.ph', 'student', 'LOGOUT', '136.158.120.56', 'Chrome 146 · Android 6 · Nexus 5', '2026-03-22 21:07:49'),
(213, 1, 'Administrator', 'admin@panpacificu.edu.ph', 'admin', 'SUCCESS', '136.158.120.56', 'Chrome 146 · Windows 10', '2026-03-22 23:55:06'),
(214, 1, 'Administrator', 'admin@panpacificu.edu.ph', 'admin', 'LOGOUT', '136.158.120.56', 'Chrome 146 · Windows 10', '2026-03-23 00:00:28'),
(215, 1, 'Administrator', 'admin@panpacificu.edu.ph', 'admin', 'SUCCESS', '136.158.120.56', 'Chrome 146 · Windows 10', '2026-03-23 00:00:35'),
(216, 1, 'Administrator', 'admin@panpacificu.edu.ph', 'admin', 'LOGOUT', '136.158.120.56', 'Chrome 146 · Windows 10', '2026-03-23 00:13:42'),
(217, 1, 'Administrator', 'admin@panpacificu.edu.ph', 'admin', 'SUCCESS', '136.158.120.56', 'Chrome 146 · Windows 10', '2026-03-23 00:13:47'),
(218, 1, 'Administrator', 'admin@panpacificu.edu.ph', 'admin', 'LOGOUT', '136.158.120.56', 'Chrome 146 · Windows 10', '2026-03-23 00:14:02'),
(219, 1, 'Administrator', 'admin@panpacificu.edu.ph', 'admin', 'SUCCESS', '136.158.120.56', 'Chrome 146 · Windows 10', '2026-03-23 00:14:37'),
(220, 2, 'Steven John A. Agustin', 'steven.agustin.admin@panpacificu.edu.ph', 'admin', 'SUCCESS', '136.158.120.56', 'Chrome 146 · Windows 10', '2026-03-23 00:31:44'),
(221, 46, 'Steven John Agustin (CoAST)', 'steven.agustin.ecoast@panpacificu.edu.ph', 'student', 'SUCCESS', '136.158.120.56', 'Chrome 146 · Windows 10', '2026-03-23 00:32:14'),
(222, 46, 'Steven John Agustin (CoAST)', 'steven.agustin.ecoast@panpacificu.edu.ph', 'student', 'LOGOUT', '136.158.120.56', 'Chrome 146 · Windows 10', '2026-03-23 00:36:24'),
(223, 23, 'Lucy Heartfilla', 'lucyheart@panpacificu.edu.ph', 'student', 'SUCCESS', '136.158.120.56', 'Chrome 144 · Android 14 · Infinix X6731B', '2026-03-23 00:36:39'),
(224, 41, 'Angel Mageri Cabote (ECoAST)', 'angel.cabote.ecoast@panpacificu.edu.ph', 'student', 'SUCCESS', '136.158.120.56', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', '2026-03-23 00:42:42'),
(225, 35, 'Natsu Dragneel', 'xnatsu25@gmail.com', 'student', 'LOGOUT', '136.158.120.56', 'Chrome 146 · Windows 10', '2026-03-23 00:46:13'),
(226, 23, 'Lucy Heartfilla', 'lucyheart@panpacificu.edu.ph', 'student', 'LOGOUT', '136.158.120.56', 'Chrome 144 · Android 14 · Infinix X6731B', '2026-03-23 00:46:23'),
(227, 35, 'Natsu Dragneel', 'xnatsu25@gmail.com', 'student', 'FAILED', '136.158.120.56', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Mobile Safari/537.36', '2026-03-23 00:46:33'),
(228, 35, 'Natsu Dragneel', 'xnatsu25@gmail.com', 'student', 'FAILED', '136.158.120.56', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Mobile Safari/537.36', '2026-03-23 00:46:55'),
(229, 23, 'Lucy Heartfilla', 'lucyheart@panpacificu.edu.ph', 'student', 'SUCCESS', '136.158.120.56', 'Chrome 144 · Android 14 · Infinix X6731B', '2026-03-23 02:11:11'),
(230, 5, 'Gray Fullbusters', 'gray@panpacificu.edu.ph', 'guard', 'SUCCESS', '136.158.120.56', 'Chrome 144 · Android 14 · Infinix X6731B', '2026-03-23 02:12:07'),
(231, 5, 'Gray Fullbusters', 'gray@panpacificu.edu.ph', 'guard', 'SUCCESS', '136.158.120.56', 'Chrome 144 · Android 14 · Infinix X6731B', '2026-03-23 02:16:17'),
(232, 5, 'Gray Fullbusters', 'gray@panpacificu.edu.ph', 'guard', 'LOGOUT', '136.158.120.56', 'Chrome 144 · Android 14 · Infinix X6731B', '2026-03-23 02:18:13'),
(233, 23, 'Lucy Heartfilla', 'lucyheart@panpacificu.edu.ph', 'student', 'SUCCESS', '136.158.120.56', 'Chrome 144 · Android 14 · Infinix X6731B', '2026-03-23 02:18:19'),
(234, 35, 'Natsu Dragneel', 'xnatsu25@gmail.com', 'student', 'SUCCESS', '136.158.120.56', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', '2026-03-23 02:19:26'),
(235, 5, 'Gray Fullbusters', 'gray@panpacificu.edu.ph', 'guard', 'SUCCESS', '136.158.120.56', 'Chrome 144 · Android 14 · Infinix X6731B', '2026-03-23 02:25:09'),
(236, 5, 'Gray Fullbusters', 'gray@panpacificu.edu.ph', 'guard', 'LOGOUT', '136.158.120.56', 'Chrome 144 · Android 14 · Infinix X6731B', '2026-03-23 02:25:25'),
(237, 5, 'Gray Fullbusters', 'gray@panpacificu.edu.ph', 'guard', 'SUCCESS', '136.158.120.56', 'Chrome 144 · Android 14 · Infinix X6731B', '2026-03-23 02:39:56'),
(238, 7, 'Steven John A. Agustin', 'steven.agustin.ecoast@panpacificu.edu.ph', 'teacher', 'SUCCESS', '136.158.120.56', 'Chrome 146 · Windows 10', '2026-03-23 02:47:51'),
(239, 7, 'Steven John A. Agustin', 'steven.agustin.ecoast@panpacificu.edu.ph', 'teacher', 'LOGOUT', '136.158.120.56', 'Chrome 146 · Windows 10', '2026-03-23 02:52:44'),
(240, 1, 'Administrator', 'admin@panpacificu.edu.ph', 'admin', 'SUCCESS', '136.158.120.56', 'Chrome 146 · Windows 10', '2026-03-23 02:57:06'),
(241, 1, 'Administrator', 'admin@panpacificu.edu.ph', 'admin', 'SUCCESS', '136.158.120.56', 'Chrome 146 · Windows 10', '2026-03-23 03:18:29'),
(242, NULL, NULL, 'steven.agustin.ecoast@panpacificu.edu.ph', 'admin', 'FAILED', '136.158.120.56', 'Chrome 146 · Windows 10', '2026-03-23 03:19:10'),
(243, NULL, NULL, 'steven.agustin.ecoast@panpacificu.edu.ph', 'admin', 'FAILED', '136.158.120.56', 'Chrome 146 · Windows 10', '2026-03-23 03:19:31'),
(244, 1, 'Super Administrator', 'superadmin@panpacificu.edu.ph', 'super_admin', 'SUCCESS', '136.158.120.56', 'Chrome 146 · Windows 10', '2026-03-23 03:20:24'),
(245, 2, 'Steven John A. Agustin', 'steven.agustin.admin@panpacificu.edu.ph', 'admin', 'SUCCESS', '136.158.120.56', 'Chrome 146 · Windows 10', '2026-03-23 03:20:56'),
(246, 35, 'Natsu Dragneel', 'xnatsu25@gmail.com', 'student', 'SUCCESS', '136.158.120.56', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', '2026-03-23 08:55:37'),
(247, 1, 'Administrator', 'admin@panpacificu.edu.ph', 'admin', 'SUCCESS', '136.158.120.56', 'Chrome 146 · Windows 10', '2026-03-23 08:57:01'),
(248, 1, 'Administrator', 'admin@panpacificu.edu.ph', 'admin', 'LOGOUT', '136.158.120.56', 'Chrome 146 · Windows 10', '2026-03-23 09:36:40'),
(249, 1, 'Administrator', 'admin@panpacificu.edu.ph', 'admin', 'SUCCESS', '136.158.120.56', 'Chrome 146 · Windows 10', '2026-03-23 09:36:44'),
(250, 1, 'Super Administrator', 'superadmin@panpacificu.edu.ph', 'super_admin', 'SUCCESS', '124.6.158.140', 'Chrome 145 · Windows 19', '2026-03-23 11:11:05'),
(251, 7, 'Steven John A. Agustin', 'steven.agustin.ecoast@panpacificu.edu.ph', 'teacher', 'SUCCESS', '124.6.158.140', 'Chrome 145 · Windows 19', '2026-03-23 11:15:42'),
(252, 1, 'CSS Admin', 'admin@panpacificu.edu.ph', 'admin', 'SUCCESS', '124.6.158.140', 'Chrome 145 · Windows 19', '2026-03-23 11:20:13'),
(253, 5, 'Gray Fullbusters', 'gray@panpacificu.edu.ph', 'guard', 'SUCCESS', '124.6.158.140', 'Chrome 144 · Android 14 · Infinix X6731B', '2026-03-23 11:30:33'),
(254, 1, 'Super Administrator', 'superadmin@panpacificu.edu.ph', 'super_admin', 'LOGOUT', '124.6.158.140', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '2026-03-23 11:31:18'),
(255, 7, 'Steven John A. Agustin', 'steven.agustin.ecoast@panpacificu.edu.ph', 'teacher', 'LOGOUT', '124.6.158.140', 'Chrome 145 · Windows 19', '2026-03-23 11:31:24'),
(256, 1, 'CSS Admin', 'admin@panpacificu.edu.ph', 'admin', 'LOGOUT', '124.6.158.140', 'Chrome 145 · Windows 19', '2026-03-23 11:31:29'),
(257, 1, 'Super Administrator', 'superadmin@panpacificu.edu.ph', 'super_admin', 'SUCCESS', '124.6.158.140', 'Chrome 145 · Windows 19', '2026-03-23 11:36:17'),
(258, 46, 'Steven John Agustin (CoAST)', 'steven.agustin.ecoast@panpacificu.edu.ph', 'student', 'FAILED', '124.6.158.140', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '2026-03-23 11:40:38'),
(259, 1, 'CSS Admin', 'admin@panpacificu.edu.ph', 'admin', 'SUCCESS', '124.6.158.140', 'Chrome 145 · Windows 19', '2026-03-23 11:44:14'),
(260, 7, 'Steven John A. Agustin', 'steven.agustin.ecoast@panpacificu.edu.ph', 'teacher', 'SUCCESS', '124.6.158.140', 'Chrome 145 · Windows 19', '2026-03-23 11:44:16'),
(261, NULL, NULL, 'gray@panpacificu.edu.ph', 'student', 'FAILED', '124.6.158.140', 'Chrome 144 · Android 14 · Infinix X6731B', '2026-03-23 12:25:12'),
(262, 49, 'Andrea Lachica', 'andrea.lachica@panpacificu.edu.ph', 'student', 'SUCCESS', '124.6.158.140', 'Chrome 146 · Android 16 · SM-A156E', '2026-03-23 12:28:57'),
(263, NULL, NULL, 'natsu@panpacificu.edu.ph', 'student', 'FAILED', '124.6.158.140', 'Chrome 144 · Android 14 · Infinix X6731B', '2026-03-23 12:30:34'),
(264, NULL, NULL, 'natsu@panpacificu.edu.ph', 'student', 'FAILED', '124.6.158.140', 'Chrome 144 · Android 14 · Infinix X6731B', '2026-03-23 12:30:50'),
(265, 1, 'CSS Admin', 'admin@panpacificu.edu.ph', 'admin', 'SUCCESS', '124.6.158.140', 'Edge 145 · Windows 19', '2026-03-23 12:59:28'),
(266, 1, 'Super Administrator', 'superadmin@panpacificu.edu.ph', 'super_admin', 'SUCCESS', '124.6.158.140', 'Edge 145 · Windows 19', '2026-03-23 13:07:00'),
(267, NULL, NULL, 'andrea@panpacificu.edu.ph', 'student', 'FAILED', '124.6.158.140', 'Chrome 146 · Android 16 · SM-A156E', '2026-03-23 13:11:46'),
(268, NULL, NULL, 'andrea@panpacificu.edu.ph', 'student', 'FAILED', '124.6.158.140', 'Chrome 146 · Android 16 · SM-A156E', '2026-03-23 13:11:49'),
(269, NULL, NULL, 'andrea@panpacificu.edu.ph', 'student', 'FAILED', '124.6.158.140', 'Chrome 146 · Android 16 · SM-A156E', '2026-03-23 13:11:55'),
(270, NULL, NULL, 'andrea@panpacificu.edu.ph', 'student', 'FAILED', '124.6.158.140', 'Chrome 146 · Android 16 · SM-A156E', '2026-03-23 13:12:03'),
(271, NULL, NULL, 'andrea@panpacificu.edu.ph', 'student', 'FAILED', '124.6.158.140', 'Chrome 146 · Android 16 · SM-A156E', '2026-03-23 13:12:08'),
(272, 49, 'Andrea Lachica', 'andrea.lachica@panpacificu.edu.ph', 'student', 'FAILED', '124.6.158.140', 'Chrome 146 · Android 16 · SM-A156E', '2026-03-23 13:12:35'),
(273, 49, 'Andrea Lachica', 'andrea.lachica@panpacificu.edu.ph', 'student', 'SUCCESS', '124.6.158.140', 'Chrome 146 · Android 16 · SM-A156E', '2026-03-23 13:12:58'),
(274, 5, 'Gray Fullbusters', 'gray@panpacificu.edu.ph', 'guard', 'LOGOUT', '124.6.158.140', 'Chrome 144 · Android 14 · Infinix X6731B', '2026-03-23 13:13:24'),
(275, 46, 'Steven John Agustin (CoAST)', 'steven.agustin.ecoast@panpacificu.edu.ph', 'student', 'SUCCESS', '136.158.120.56', 'Chrome 146 · Windows 10', '2026-03-23 16:25:21'),
(276, 35, 'Natsu Dragneel', 'xnatsu25@gmail.com', 'student', 'SUCCESS', '136.158.120.56', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', '2026-03-23 19:50:11'),
(277, 1, 'CSS Admin', 'admin@panpacificu.edu.ph', 'admin', 'SUCCESS', '136.158.120.56', 'Chrome 146 · Windows 10', '2026-03-23 20:01:13'),
(278, 7, 'Steven John A. Agustin', 'steven.agustin.ecoast@panpacificu.edu.ph', 'teacher', 'SUCCESS', '136.158.120.56', 'Chrome 146 · Windows 10', '2026-03-23 20:14:29');

-- --------------------------------------------------------

--
-- Table structure for table `system_settings`
--

CREATE TABLE `system_settings` (
  `id` int(11) NOT NULL,
  `setting_key` varchar(100) NOT NULL,
  `setting_value` varchar(255) NOT NULL DEFAULT '',
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `system_settings`
--

INSERT INTO `system_settings` (`id`, `setting_key`, `setting_value`, `updated_at`) VALUES
(1, 'maintenance_mode', '0', '2026-03-23 03:16:43');

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
(7, 'Steven John A. Agustin', 'teacher-1774286273203-115898.jpg', 'steven.agustin.ecoast@panpacificu.edu.ph', '$2b$10$j5nYLjVE7BGPwRwM3ELoJez2glRdd8LbnvHq8VDj9qxUMBHDpARCq', 'BS in Information Technology', NULL, '{\"latitude\":15.93,\"longitude\":120.51}', 50, '2026-01-31 16:25:25', 'TSN17698767256291441', 1),
(18, 'Mark Zuckerberg', 'teacher-1773680898788-757146.webp', 'markzuckerberg@panpacificu.edu.ph', '$2b$10$pgqV81EPWO.u2aOGz51M5O//Dma2hohn5F/t2bY0vWfAJm..dg9PO', 'BS in Information Technology', NULL, '{\"latitude\":16.01788971286583,\"longitude\":120.74942350387575}', 100, '2026-03-16 17:06:06', 'TSN17736807667173940', 1),
(19, 'Andrea B. Lachica', NULL, 'andrea@panpacificu.edu.ph', '$2b$10$9HmOHucmCL6f7ZseaO0SSuNIBOrs0JaaFgixPTR2AXsAHuLLyZNsu', 'BS in Criminology', NULL, '{\"latitude\":16.026207,\"longitude\":120.7763817}', 50, '2026-03-19 08:30:20', 'TSN17739090200094291', 1);

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
(12, 'SBE', '2026-03-19 16:34:09');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admin_accounts`
--
ALTER TABLE `admin_accounts`
  ADD PRIMARY KEY (`admin_id`);

--
-- Indexes for table `admin_activity_logs`
--
ALTER TABLE `admin_activity_logs`
  ADD PRIMARY KEY (`log_id`),
  ADD KEY `idx_admin_id` (`admin_id`),
  ADD KEY `idx_action` (`action`),
  ADD KEY `idx_performed_at` (`performed_at`);

--
-- Indexes for table `admin_login_logs`
--
ALTER TABLE `admin_login_logs`
  ADD PRIMARY KEY (`log_id`),
  ADD KEY `idx_admin_id` (`admin_id`),
  ADD KEY `idx_login_at` (`login_at`);

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
-- Indexes for table `messages`
--
ALTER TABLE `messages`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`id`);

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
-- Indexes for table `system_activity_logs`
--
ALTER TABLE `system_activity_logs`
  ADD PRIMARY KEY (`log_id`),
  ADD KEY `idx_actor_role` (`actor_role`),
  ADD KEY `idx_action` (`action`),
  ADD KEY `idx_performed_at` (`performed_at`);

--
-- Indexes for table `system_login_logs`
--
ALTER TABLE `system_login_logs`
  ADD PRIMARY KEY (`log_id`),
  ADD KEY `idx_role` (`role`),
  ADD KEY `idx_status` (`status`),
  ADD KEY `idx_login_at` (`login_at`);

--
-- Indexes for table `system_settings`
--
ALTER TABLE `system_settings`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `setting_key` (`setting_key`);

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
  MODIFY `admin_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `admin_activity_logs`
--
ALTER TABLE `admin_activity_logs`
  MODIFY `log_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `admin_login_logs`
--
ALTER TABLE `admin_login_logs`
  MODIFY `log_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `attendance_history_record`
--
ALTER TABLE `attendance_history_record`
  MODIFY `attendance_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=119;

--
-- AUTO_INCREMENT for table `attendance_record`
--
ALTER TABLE `attendance_record`
  MODIFY `attendance_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=131;

--
-- AUTO_INCREMENT for table `event_attendance_history_record`
--
ALTER TABLE `event_attendance_history_record`
  MODIFY `event_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=42;

--
-- AUTO_INCREMENT for table `event_attendance_record`
--
ALTER TABLE `event_attendance_record`
  MODIFY `event_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=46;

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
-- AUTO_INCREMENT for table `messages`
--
ALTER TABLE `messages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=53;

--
-- AUTO_INCREMENT for table `notifications`
--
ALTER TABLE `notifications`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `program`
--
ALTER TABLE `program`
  MODIFY `program_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=33;

--
-- AUTO_INCREMENT for table `student_accounts`
--
ALTER TABLE `student_accounts`
  MODIFY `student_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=50;

--
-- AUTO_INCREMENT for table `student_records_regular_class`
--
ALTER TABLE `student_records_regular_class`
  MODIFY `student_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=61;

--
-- AUTO_INCREMENT for table `subject`
--
ALTER TABLE `subject`
  MODIFY `subject_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- AUTO_INCREMENT for table `subject_and_year_level_setter`
--
ALTER TABLE `subject_and_year_level_setter`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `super_admin_accounts`
--
ALTER TABLE `super_admin_accounts`
  MODIFY `super_admin_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `system_activity_logs`
--
ALTER TABLE `system_activity_logs`
  MODIFY `log_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=279;

--
-- AUTO_INCREMENT for table `system_login_logs`
--
ALTER TABLE `system_login_logs`
  MODIFY `log_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=279;

--
-- AUTO_INCREMENT for table `system_settings`
--
ALTER TABLE `system_settings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT for table `teacher`
--
ALTER TABLE `teacher`
  MODIFY `teacher_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT for table `year_level`
--
ALTER TABLE `year_level`
  MODIFY `year_level_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
