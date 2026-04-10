-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 09, 2026 at 04:21 AM
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
(1, 'CSS Admin Cha', 'admin@panpacificu.edu.ph', 'admin-1774705701340-338856.jpg', '$2b$10$WLX3Xkyz5en54kOO/5ZpouaRVWh2a9COy/rskR8Z/sqwBLYYB30ra', '2026-02-09 00:02:44'),
(4, 'Soleil Riego', 'soleil@gmail.com', NULL, '$2b$10$tBk40nvbIex3sPfKo9AOQ.6q5ubLHxMGkOgDV6itVQq6RAwQuUNw2', '2026-04-06 16:11:49'),
(5, 'Steven John A. Agustin', 'steven.agustin.admin@panpacificu.edu.ph', NULL, '$2b$10$TNYSp0dyCuYlpf7/6upWJuL6dchwXnhLBH29BiocUAsRLnmdWlA4y', '2026-04-07 01:07:54');

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
  `teacher_barcode_scanner_serial_number` varchar(255) NOT NULL,
  `attendance_status` enum('Present','Late','Absent','Excused') NOT NULL DEFAULT 'Present',
  `manually_overridden` tinyint(1) NOT NULL DEFAULT 0 COMMENT '1 = teacher manually set this status, auto-late detection is skipped'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `attendance_record`
--

INSERT INTO `attendance_record` (`attendance_id`, `student_id_number`, `student_middlename`, `student_lastname`, `student_firstname`, `student_program`, `attendance_time`, `attendance_date`, `year_level`, `subject`, `location_generated`, `device_id`, `student_id`, `teacher_barcode_scanner_serial_number`, `attendance_status`, `manually_overridden`) VALUES
(310, '737773', 'A', 'Agustin', 'Zaiejan', NULL, '16:30:24', '2026-03-31', '3rd Year', 'Big Data', NULL, NULL, NULL, 'TSN17698767256291441', 'Present', 1),
(311, '1231377', 'A', 'Agustin (CoAST)', 'Steven John', NULL, '16:30:25', '2026-03-30', '3rd Year', 'Big Data', NULL, NULL, NULL, 'TSN17698767256291441', 'Late', 1),
(312, '1231392', 'Agmata', 'Aquino', 'Jan Ray', NULL, '16:30:26', '2026-03-31', '3rd Year', 'Big Data', NULL, NULL, NULL, 'TSN17698767256291441', 'Present', 1),
(313, '1231231231231', 'A', 'Dragneel', 'Natsu', NULL, NULL, '2026-03-31', '3rd Year', 'Big Data', NULL, NULL, NULL, 'TSN17698767256291441', 'Absent', 1),
(314, '12312312312', 'A', 'Gallarde (ECoAST)', 'Marfel Gem', NULL, NULL, '2026-03-30', '3rd Year', 'Big Data', NULL, NULL, NULL, 'TSN17698767256291441', 'Absent', 1),
(315, '1231333', 'A', 'Heartfilla', 'Lucy', NULL, '16:30:37', '2026-03-30', '3rd Year', 'Big Data', NULL, NULL, NULL, 'TSN17698767256291441', 'Present', 1),
(316, '12310922', 'A', 'Lachica', 'Andrea', NULL, '16:30:39', '2026-03-30', '3rd Year', 'Big Data', NULL, NULL, NULL, 'TSN17698767256291441', 'Present', 1),
(317, '12313598', 'O', 'Obillo (ECoAST)', 'Princess', NULL, '16:30:41', '2026-03-31', '3rd Year', 'Big Data', NULL, NULL, NULL, 'TSN17698767256291441', 'Present', 1),
(318, '1231422', 'M', 'Selga', 'Charimea', NULL, '16:31:05', '2026-03-31', '3rd Year', 'Big Data', NULL, NULL, NULL, 'TSN17698767256291441', 'Late', 1),
(319, '1231333', 'A', 'Heartfilla', 'Lucy', 'BS in Information Technology', '16:34:42', '2026-03-31', '3rd Year', 'Database Lec', NULL, NULL, 23, 'TSN17698767256291441', 'Present', 0),
(320, '123123123', 'A', 'Cabote (ECoAST)', 'Angel Mageri', NULL, '17:12:09', '2026-03-31', '3rd Year', 'Big Data', NULL, NULL, NULL, 'TSN17698767256291441', 'Present', 1),
(321, '1231392', 'Agmata', 'Aquino', 'Jan Ray', NULL, '17:12:09', '2026-03-31', '3rd Year', 'Big Data', NULL, NULL, NULL, 'TSN17698767256291441', 'Late', 1),
(322, '737773', 'A', 'Agustin', 'Zaiejan', NULL, '20:42:48', '2026-03-31', '3rd Year', 'Event-Driven Programming', NULL, NULL, NULL, 'TSN17698767256291441', 'Present', 1),
(323, '737773', 'A', 'Agustin', 'Zaiejan', 'BS in Information Technology', '14:02:23', '2026-04-05', '3rd Year', 'Event-Driven Programming', NULL, NULL, 49, 'TSN17698767256291441', 'Present', 1),
(324, '1231377', 'A', 'Agustin (CoAST)', 'Steven John', 'BS in Information Technology', '14:02:24', '2026-04-05', '3rd Year', 'Event-Driven Programming', NULL, NULL, 56, 'TSN17698767256291441', 'Present', 1),
(325, '1231231231231', 'A', 'Dragneel', 'Natsu', 'BS in Information Technology', '14:02:25', '2026-04-05', '3rd Year', 'Event-Driven Programming', NULL, NULL, 28, 'TSN17698767256291441', 'Present', 1),
(326, '1231333', 'A', 'Heartfilla', 'Lucy', 'BS in Information Technology', '14:02:26', '2026-04-05', '3rd Year', 'Event-Driven Programming', NULL, NULL, 45, 'TSN17698767256291441', 'Present', 1),
(327, '12310922', 'A', 'Lachica', 'Andrea', 'BS in Information Technology', '14:02:27', '2026-04-05', '3rd Year', 'Event-Driven Programming', NULL, NULL, 62, 'TSN17698767256291441', 'Present', 1),
(328, '1231422', 'M', 'Selga', 'Charimea', 'BS in Information Technology', '14:02:32', '2026-04-05', '3rd Year', 'Event-Driven Programming', NULL, NULL, 21, 'TSN17698767256291441', 'Late', 1),
(329, '737773', 'A', 'Agustin', 'Zaiejan', 'BS in Information Technology', '14:06:43', '2026-04-05', '3rd Year', 'Integrative Programming', NULL, NULL, 49, 'TSN17698767256291441', 'Present', 1),
(330, '1231377', 'A', 'Agustin (CoAST)', 'Steven John', 'BS in Information Technology', '14:06:44', '2026-04-05', '3rd Year', 'Integrative Programming', NULL, NULL, 56, 'TSN17698767256291441', 'Present', 1),
(331, '1231231231231', 'A', 'Dragneel', 'Natsu', 'BS in Information Technology', '14:06:45', '2026-04-05', '3rd Year', 'Integrative Programming', NULL, NULL, 28, 'TSN17698767256291441', 'Present', 1),
(332, '1231333', 'A', 'Heartfilla', 'Lucy', 'BS in Information Technology', '14:06:46', '2026-04-05', '3rd Year', 'Integrative Programming', NULL, NULL, 45, 'TSN17698767256291441', 'Present', 1),
(333, '12310922', 'A', 'Lachica', 'Andrea', 'BS in Information Technology', '14:06:46', '2026-04-05', '3rd Year', 'Integrative Programming', NULL, NULL, 62, 'TSN17698767256291441', 'Present', 1),
(334, '1231422', 'M', 'Selga', 'Charimea', 'BS in Information Technology', '14:06:50', '2026-04-05', '3rd Year', 'Integrative Programming', NULL, NULL, 21, 'TSN17698767256291441', 'Present', 1),
(335, '1231231231231', 'A', 'Dragneel', 'Natsu', 'BS in Information Technology', '14:07:43', '2026-04-05', '3rd Year', 'Cloud Computing', NULL, NULL, 28, 'TSN17698767256291441', 'Present', 1),
(336, '1231333', 'A', 'Heartfilla', 'Lucy', 'BS in Information Technology', '14:07:43', '2026-04-05', '3rd Year', 'Cloud Computing', NULL, NULL, 45, 'TSN17698767256291441', 'Present', 1),
(337, '737773', 'A', 'Agustin', 'Zaiejan', NULL, NULL, '2026-04-05', '3rd Year', 'Database Lec', NULL, NULL, NULL, 'TSN17698767256291441', 'Excused', 1),
(338, '1231377', 'A', 'Agustin (CoAST)', 'Steven John', NULL, '15:11:03', '2026-04-05', '3rd Year', 'Database Lec', NULL, NULL, NULL, 'TSN17698767256291441', 'Present', 1),
(339, '1231333', 'A', 'Heartfilla', 'Lucy', NULL, NULL, '2026-04-05', '3rd Year', 'Database Lec', NULL, NULL, NULL, 'TSN17698767256291441', 'Absent', 1),
(340, '12310922', 'A', 'Lachica', 'Andrea', NULL, '15:11:12', '2026-04-05', '3rd Year', 'Database Lec', NULL, NULL, NULL, 'TSN17698767256291441', 'Present', 1),
(341, '1231422', 'M', 'Selga', 'Charimea', NULL, '15:11:14', '2026-04-05', '3rd Year', 'Database Lec', NULL, NULL, NULL, 'TSN17698767256291441', 'Present', 1),
(342, '737773', 'A', 'Agustin', 'Zaiejan', NULL, '14:08:28', '2026-04-05', '3rd Year', 'Digital Marketing', NULL, NULL, NULL, 'TSN17698767256291441', 'Present', 1),
(343, '1231377', 'A', 'Agustin (CoAST)', 'Steven John', NULL, '14:08:29', '2026-04-05', '3rd Year', 'Digital Marketing', NULL, NULL, NULL, 'TSN17698767256291441', 'Present', 1),
(344, '1231231231231', 'A', 'Dragneel', 'Natsu', NULL, '14:08:29', '2026-04-05', '3rd Year', 'Digital Marketing', NULL, NULL, NULL, 'TSN17698767256291441', 'Present', 1),
(345, '1231333', 'A', 'Heartfilla', 'Lucy', NULL, '14:08:30', '2026-04-05', '3rd Year', 'Digital Marketing', NULL, NULL, NULL, 'TSN17698767256291441', 'Late', 1),
(346, '12310922', 'A', 'Lachica', 'Andrea', NULL, '14:08:30', '2026-04-05', '3rd Year', 'Digital Marketing', NULL, NULL, NULL, 'TSN17698767256291441', 'Late', 1),
(347, '1231422', 'M', 'Selga', 'Charimea', NULL, NULL, '2026-04-05', '3rd Year', 'Digital Marketing', NULL, NULL, NULL, 'TSN17698767256291441', 'Excused', 1),
(348, '737773', 'A', 'Agustin', 'Zaiejan', NULL, '14:08:45', '2026-04-05', '3rd Year', 'Programming', NULL, NULL, NULL, 'TSN17698767256291441', 'Present', 1),
(349, '1231377', 'A', 'Agustin (CoAST)', 'Steven John', NULL, '14:08:45', '2026-04-05', '3rd Year', 'Programming', NULL, NULL, NULL, 'TSN17698767256291441', 'Present', 1),
(350, '1231231231231', 'A', 'Dragneel', 'Natsu', NULL, '14:08:45', '2026-04-05', '3rd Year', 'Programming', NULL, NULL, NULL, 'TSN17698767256291441', 'Present', 1),
(351, '1231333', 'A', 'Heartfilla', 'Lucy', NULL, '14:08:46', '2026-04-05', '3rd Year', 'Programming', NULL, NULL, NULL, 'TSN17698767256291441', 'Present', 1),
(352, '67', 'A', 'Kiyomi', 'Yuumi', NULL, '14:08:46', '2026-04-05', '2nd Year', 'Programming', NULL, NULL, NULL, 'TSN17698767256291441', 'Present', 1),
(353, '12310922', 'A', 'Lachica', 'Andrea', NULL, '14:08:47', '2026-04-05', '3rd Year', 'Programming', NULL, NULL, NULL, 'TSN17698767256291441', 'Late', 1),
(354, '1231422', 'M', 'Selga', 'Charimea', NULL, NULL, '2026-04-05', '3rd Year', 'Programming', NULL, NULL, NULL, 'TSN17698767256291441', 'Absent', 1),
(355, '1231422', 'M', 'Selga', 'Charimea', NULL, '14:08:55', '2026-04-05', '3rd Year', 'Big Data', NULL, NULL, NULL, 'TSN17698767256291441', 'Present', 1),
(356, '12310922', 'A', 'Lachica', 'Andrea', NULL, '14:08:56', '2026-04-05', '3rd Year', 'Big Data', NULL, NULL, NULL, 'TSN17698767256291441', 'Present', 1),
(357, '1231333', 'A', 'Heartfilla', 'Lucy', NULL, '14:08:56', '2026-04-05', '3rd Year', 'Big Data', NULL, NULL, NULL, 'TSN17698767256291441', 'Present', 1),
(358, '1231231231231', 'A', 'Dragneel', 'Natsu', NULL, '14:08:59', '2026-04-05', '3rd Year', 'Big Data', NULL, NULL, NULL, 'TSN17698767256291441', 'Present', 1),
(359, '1231377', 'A', 'Agustin (CoAST)', 'Steven John', NULL, NULL, '2026-04-05', '3rd Year', 'Big Data', NULL, NULL, NULL, 'TSN17698767256291441', 'Absent', 1),
(360, '737773', 'A', 'Agustin', 'Zaiejan', NULL, NULL, '2026-04-05', '3rd Year', 'Big Data', NULL, NULL, NULL, 'TSN17698767256291441', 'Absent', 1),
(361, '1231231231231', 'A', 'Dragneel', 'Natsu', NULL, '14:09:15', '2026-04-05', '3rd Year', 'Sample lng to', NULL, NULL, NULL, 'TSN17698767256291441', 'Present', 1),
(362, '1231333', 'A', 'Heartfilla', 'Lucy', NULL, '14:09:15', '2026-04-05', '3rd Year', 'Sample lng to', NULL, NULL, NULL, 'TSN17698767256291441', 'Present', 1),
(363, '1231333', 'A', 'Heartfilla', 'Lucy', 'BS in Information Technology', '12:15:55', '2026-04-06', '3rd Year', 'Integrative Programming', NULL, NULL, 23, 'TSN17698767256291441', 'Present', 0),
(364, '737773', 'A', 'Agustin', 'Zaiejan', NULL, '12:16:20', '2026-04-06', '3rd Year', 'Integrative Programming', NULL, NULL, NULL, 'TSN17698767256291441', 'Present', 1),
(365, '1231377', 'A', 'Agustin (CoAST)', 'Steven John', NULL, '12:16:22', '2026-04-06', '3rd Year', 'Integrative Programming', NULL, NULL, NULL, 'TSN17698767256291441', 'Present', 1),
(366, '1231231231231', 'A', 'Dragneel', 'Natsu', NULL, '12:16:24', '2026-04-06', '3rd Year', 'Integrative Programming', NULL, NULL, NULL, 'TSN17698767256291441', 'Present', 1),
(367, '1231422', 'M', 'Selga', 'Charimea', NULL, '15:11:43', '2026-04-06', '3rd Year', 'Integrative Programming', NULL, NULL, NULL, 'TSN17698767256291441', 'Present', 1),
(368, '12310922', 'A', 'Lachica', 'Andrea', NULL, NULL, '2026-04-06', '3rd Year', 'Integrative Programming', NULL, NULL, NULL, 'TSN17698767256291441', 'Excused', 1),
(369, '1231231231231', 'A', 'Dragneel', 'Natsu', NULL, '01:40:56', '2026-04-07', '3rd Year', 'Integrative Programming', NULL, NULL, NULL, 'TSN17698767256291441', 'Present', 1),
(370, '737773', 'A', 'Agustin', 'Zaiejan', NULL, '01:40:57', '2026-04-07', '3rd Year', 'Integrative Programming', NULL, NULL, NULL, 'TSN17698767256291441', 'Present', 1),
(371, '1231377', 'A', 'Agustin (CoAST)', 'Steven John', NULL, '01:40:57', '2026-04-07', '3rd Year', 'Integrative Programming', NULL, NULL, NULL, 'TSN17698767256291441', 'Present', 1),
(372, '1231333', 'A', 'Heartfilla', 'Lucy', NULL, '01:40:58', '2026-04-07', '3rd Year', 'Integrative Programming', NULL, NULL, NULL, 'TSN17698767256291441', 'Present', 1),
(373, '12310922', 'A', 'Lachica', 'Andrea', NULL, '01:40:58', '2026-04-07', '3rd Year', 'Integrative Programming', NULL, NULL, NULL, 'TSN17698767256291441', 'Present', 1),
(374, '1231422', 'M', 'Selga', 'Charimea', NULL, '01:40:59', '2026-04-07', '3rd Year', 'Integrative Programming', NULL, NULL, NULL, 'TSN17698767256291441', 'Present', 1),
(375, '1231333', 'A', 'Heartfilla', 'Lucy', NULL, '01:41:00', '2026-04-07', '3rd Year', 'Integrative Programming', NULL, NULL, NULL, 'TSN17698767256291441', 'Present', 1);

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
(41, 49, 'Andrea A. Lachica', '897', 'BS in Information Technology', '3rd Year', 'Sample', 'Gray Fullbusters', 'Main Gate', '13:13:12', '2026-03-23', 'TIME IN', 5, 1),
(42, 51, 'Ace-cin A. Kyoshi', '848484', 'BS in Information Technology', '3rd Year', 'Sample', 'Gray Fullbusters', 'Main Gate', '12:54:57', '2026-03-24', 'TIME IN', 5, 1),
(43, 51, 'Ace-cin A. Kyoshi', '848484', 'BS in Information Technology', '3rd Year', 'Sample', 'Gray Fullbusters', 'Main Gate', '12:55:16', '2026-03-24', 'TIME OUT', 5, 1),
(44, 26, 'Luna M. Toka', '123123', 'BS in Criminology', '2nd Year', 'Sample', 'Gray Fullbusters', 'Main Gate', '14:09:41', '2026-03-24', 'TIME IN', 5, 1),
(45, 46, 'Steven John A. Agustin (CoAST)', '1231377', 'BS in Information Technology', '3rd Year', 'Sample', 'Gray Fullbusters', 'Main Gate', '22:47:36', '2026-04-01', 'TIME IN', 5, 1),
(46, 35, 'Natsu B. Dragneel', '1231231231231', 'BS in Information Technology', '3rd Year', 'Sail- 2026', 'Gray Fullbusters', 'Main Gate', '16:17:46', '2026-03-31', 'TIME IN', 5, 1),
(47, 35, 'Natsu B. Dragneel', '1231231231231', 'BS in Information Technology', '3rd Year', 'Sail- 2026', 'Gray Fullbusters', 'Main Gate', '16:19:13', '2026-03-31', 'TIME OUT', 5, 1),
(48, 35, 'Natsu B. Dragneel', '1231231231231', 'BS in Information Technology', '3rd Year', 'Sail- 2026', 'Gray Fullbusters', 'Main Gate', '16:17:46', '2026-03-31', 'TIME IN', 5, 1),
(49, 35, 'Natsu B. Dragneel', '1231231231231', 'BS in Information Technology', '3rd Year', 'Sail- 2026', 'Gray Fullbusters', 'Main Gate', '16:19:13', '2026-03-31', 'TIME OUT', 5, 1),
(50, 46, 'Steven John A. Agustin (CoAST)', '1231377', 'BS in Information Technology', '3rd Year', 'Sample', 'Gray Fullbusters', 'Main Gate', '22:47:36', '2026-04-01', 'TIME IN', 5, 1),
(51, 55, 'Andrea L. Mulach', '8700', 'Bs Psychology', '3rd Year', 'Student Night', 'Gray Fullbusters', 'Main Gate', '21:55:54', '2026-04-04', 'TIME IN', 5, 1),
(52, 55, 'Andrea L. Mulach', '8700', 'Bs Psychology', '3rd Year', 'Student Night', 'Gray Fullbusters', 'Main Gate', '21:56:55', '2026-04-04', 'TIME OUT', 5, 1),
(53, 55, 'Andrea L. Mulach', '8700', 'Bs Psychology', '3rd Year', 'Student Night', 'Gray Fullbusters', 'Main Gate', '21:55:54', '2026-04-04', 'TIME IN', 5, 1),
(54, 55, 'Andrea L. Mulach', '8700', 'Bs Psychology', '3rd Year', 'Student Night', 'Gray Fullbusters', 'Main Gate', '21:56:55', '2026-04-04', 'TIME OUT', 5, 1),
(55, 55, 'Andrea L. Mulach', '8700', 'Bachelor of Science in Business Administration', '3rd Year', 'Leader summint', 'Gray Fullbusters', 'Main Gate', '12:41:06', '2026-04-05', 'TIME IN', 5, 1),
(56, 55, 'Andrea L. Mulach', '8700', 'Bachelor of Science in Business Administration', '3rd Year', 'Leader summint', 'Gray Fullbusters', 'Main Gate', '12:41:15', '2026-04-05', 'TIME OUT', 5, 1),
(57, 35, 'Natsu B. Dragneel', '1231231231231', 'BS in Information Technology', '3rd Year', 'Leader summint', 'Gray Fullbusters', 'Main Gate', '14:13:12', '2026-04-05', 'TIME IN', 5, 1),
(58, 35, 'Natsu B. Dragneel', '1231231231231', 'BS in Information Technology', '3rd Year', 'Leader summint', 'Gray Fullbusters', 'Main Gate', '14:13:29', '2026-04-05', 'TIME OUT', 5, 1),
(59, 55, 'Andrea L. Mulach', '8700', 'Bachelor of Science in Business Administration', '3rd Year', 'Leader summint', 'Gray Fullbusters', 'Main Gate', '12:41:06', '2026-04-05', 'TIME IN', 5, 1),
(60, 55, 'Andrea L. Mulach', '8700', 'Bachelor of Science in Business Administration', '3rd Year', 'Leader summint', 'Gray Fullbusters', 'Main Gate', '12:41:15', '2026-04-05', 'TIME OUT', 5, 1),
(61, 35, 'Natsu B. Dragneel', '1231231231231', 'BS in Information Technology', '3rd Year', 'Leader summint', 'Gray Fullbusters', 'Main Gate', '14:13:12', '2026-04-05', 'TIME IN', 5, 1),
(62, 35, 'Natsu B. Dragneel', '1231231231231', 'BS in Information Technology', '3rd Year', 'Leader summint', 'Gray Fullbusters', 'Main Gate', '14:13:29', '2026-04-05', 'TIME OUT', 5, 1),
(63, 43, 'Jan Ray A. Aquino', '1231392', '', '3rd Year', 'GGHG', 'Gray Fullbusters', 'Main Gate', '14:38:24', '2026-04-06', 'TIME IN', 5, 1),
(64, 23, 'Lucy A. Heartfilla', '1231333', 'BS in Information Technology', '3rd Year', 'GGHG', 'Gray Fullbusters', 'Main Gate', '16:09:18', '2026-04-06', 'TIME IN', 5, 1),
(65, 23, 'Lucy A. Heartfilla', '1231333', 'BS in Information Technology', '3rd Year', 'GGHG', 'Gray Fullbusters', 'Main Gate', '16:17:31', '2026-04-06', 'TIME OUT', 5, 1),
(66, 43, 'Jan Ray A. Aquino', '1231392', '', '3rd Year', 'GGHG', 'Gray Fullbusters', 'Main Gate', '14:38:24', '2026-04-06', 'TIME IN', 5, 1),
(67, 23, 'Lucy A. Heartfilla', '1231333', 'BS in Information Technology', '3rd Year', 'GGHG', 'Gray Fullbusters', 'Main Gate', '16:09:18', '2026-04-06', 'TIME IN', 5, 1),
(68, 23, 'Lucy A. Heartfilla', '1231333', 'BS in Information Technology', '3rd Year', 'GGHG', 'Gray Fullbusters', 'Main Gate', '16:17:31', '2026-04-06', 'TIME OUT', 5, 1);

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
(1, '', '2026-02-08 23:50:53', 1);

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
  `admin_id` int(11) DEFAULT NULL,
  `guard_profile_picture` varchar(500) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `guards`
--

INSERT INTO `guards` (`guard_id`, `guard_name`, `guard_email`, `guard_password`, `guard_designated_location`, `admin_id`, `guard_profile_picture`) VALUES
(5, 'Gray Fullbusters', 'gray@panpacificu.edu.ph', '$2b$10$NGqhdmtbZyNS91U8YY4Deu6/.9MO.i7qy.rHRQG68OXmqDoCj1w5e', 'Main Gate', 1, 'guard-1774706082744-315190.jpg'),
(9, 'Kirito Kirigaya (Guard)', 'kirito@panpacificu.edu.ph', '$2b$10$.32vBAdFxi8CK.a8KDB8Hete8XiZ.KyJsWSDQ3DWdGXwDh4MtJlIu', 'Main Gate', 1, NULL),
(11, 'Asuna Kirigaya', 'asuna@panpacificu.edu.ph', '$2b$10$5lE8e/CYQmxB4gV5shqO/O3Em85c9.wjezPnxQ0nX.Xf87xdwPwAS', 'Parking Area', NULL, NULL),
(12, 'Anton', 'anton@gmail.com', '$2b$10$JQOoP3Oky5vGI8E0U31FIOQuQeyGGejJHQHj2zN5Gb8/2UgOo5/S2', 'Main Gate', 1, NULL);

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
  `reactions` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`reactions`)),
  `forwarded_from_id` int(11) DEFAULT NULL,
  `sender_profile_picture` varchar(500) DEFAULT NULL,
  `receiver_profile_picture` varchar(500) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `messages`
--

INSERT INTO `messages` (`id`, `sender_id`, `sender_role`, `sender_name`, `receiver_id`, `receiver_role`, `receiver_name`, `content`, `file_url`, `file_name`, `file_type`, `is_read`, `read_at`, `is_unsent`, `is_edited`, `edited_at`, `deleted_for_sender`, `deleted_for_receiver`, `is_pinned`, `reactions`, `forwarded_from_id`, `sender_profile_picture`, `receiver_profile_picture`, `created_at`) VALUES
(1, 1, 'admin', 'Administrator', 1, 'super_admin', 'Super Administrator', 'Hello', NULL, NULL, NULL, 1, NULL, 0, 0, NULL, 0, 0, 0, '{\"super_admin_1\":{\"reactorId\":1,\"reactorRole\":\"super_admin\",\"emoji\":\"😂\"}}', NULL, NULL, NULL, '2026-03-23 01:46:47'),
(2, 41, 'student', 'Angel Mageri', 18, 'teacher', 'Mark Zuckerberg', 'Hello sir I am absent for now, because I have Illness', NULL, NULL, NULL, 1, NULL, 0, 0, NULL, 0, 0, 0, NULL, NULL, NULL, NULL, '2026-03-23 01:48:14'),
(3, 41, 'student', 'Angel Mageri', 18, 'teacher', 'Mark Zuckerberg', 'Hello sir', NULL, NULL, NULL, 1, NULL, 0, 0, NULL, 0, 0, 0, NULL, NULL, NULL, NULL, '2026-03-23 02:01:49'),
(4, 41, 'student', 'Angel Mageri', 18, 'teacher', 'Mark Zuckerberg', 'Hello world', NULL, NULL, NULL, 1, NULL, 0, 0, NULL, 0, 0, 0, NULL, NULL, NULL, NULL, '2026-03-23 02:07:28'),
(5, 1, 'super_admin', 'Super Administrator', 1, 'admin', 'Administrator', 'What is your need?', NULL, NULL, NULL, 1, NULL, 0, 0, NULL, 0, 0, 0, '{\"admin_1\":{\"reactorId\":1,\"reactorRole\":\"admin\",\"emoji\":\"😂\"}}', NULL, NULL, NULL, '2026-03-23 02:10:01'),
(6, 5, 'guard', 'Gray Fullbusters', 1, 'admin', 'Administrator', 'I can\'t sir', NULL, NULL, NULL, 1, NULL, 0, 0, NULL, 0, 0, 0, NULL, NULL, NULL, NULL, '2026-03-23 02:16:51'),
(7, 1, 'admin', 'Administrator', 5, 'guard', 'Gray Fullbusters', 'Okay I\'ll fix it', NULL, NULL, NULL, 1, NULL, 0, 0, NULL, 0, 0, 0, NULL, NULL, NULL, NULL, '2026-03-23 02:24:50'),
(8, 1, 'admin', 'Administrator', 2, 'admin', 'Steven John A. Agustin', NULL, '/api/v1/uploads/message_files/msg_1774207090680_02.png', '02.png', 'image/png', 1, NULL, 0, 0, NULL, 0, 0, 0, NULL, NULL, NULL, NULL, '2026-03-23 03:18:10'),
(9, 35, 'student', 'Natsu', 1, 'admin', 'Administrator', 'Adda bagtit mo chari', NULL, NULL, NULL, 1, NULL, 0, 0, NULL, 0, 0, 0, NULL, NULL, NULL, NULL, '2026-03-23 08:56:21'),
(10, 1, 'admin', 'Administrator', 35, 'student', 'Natsu', NULL, NULL, NULL, NULL, 1, NULL, 1, 0, NULL, 0, 0, 0, NULL, NULL, NULL, NULL, '2026-03-23 09:02:47'),
(11, 35, 'student', 'Natsu', 1, 'admin', 'Administrator', 'Hello', NULL, NULL, NULL, 1, NULL, 0, 0, NULL, 1, 0, 0, NULL, NULL, NULL, NULL, '2026-03-23 09:09:46'),
(12, 35, 'student', 'Natsu', 1, 'admin', 'Administrator', 'hello nigga', NULL, NULL, NULL, 1, '2026-03-23 09:38:37', 0, 0, NULL, 0, 0, 0, NULL, NULL, 'student-1774204990603-169913.png', 'admin-1773474482355-324628.png', '2026-03-23 09:38:25'),
(13, 35, 'student', 'Natsu', 1, 'admin', 'Administrator', 'This is me', NULL, NULL, NULL, 1, '2026-03-23 09:38:37', 0, 0, NULL, 0, 0, 0, NULL, NULL, 'student-1774204990603-169913.png', 'admin-1773474482355-324628.png', '2026-03-23 09:38:30'),
(14, 35, 'student', 'Natsu', 1, 'admin', 'Administrator', 'Sir I have a requests for you, because I can\'t attend now, because I am sick, Thank you sir for your consideration', NULL, NULL, NULL, 1, '2026-03-23 09:39:50', 0, 0, NULL, 0, 0, 0, NULL, NULL, 'student-1774204990603-169913.png', 'admin-1773474482355-324628.png', '2026-03-23 09:39:47'),
(15, 35, 'student', 'Natsu', 1, 'admin', 'Administrator', 'Sir?', NULL, NULL, NULL, 1, '2026-03-23 09:40:15', 0, 0, NULL, 0, 0, 0, NULL, NULL, 'student-1774204990603-169913.png', 'admin-1773474482355-324628.png', '2026-03-23 09:40:02'),
(16, 1, 'admin', 'Administrator', 35, 'student', 'Natsu', 'Ops whats wrong?', NULL, NULL, NULL, 1, '2026-03-23 09:43:24', 0, 0, NULL, 0, 0, 0, NULL, NULL, 'admin-1773474482355-324628.png', 'student-1774204990603-169913.png', '2026-03-23 09:43:21'),
(17, 1, 'admin', 'Administrator', 35, 'student', 'Natsu', 'Hello', NULL, NULL, NULL, 1, '2026-03-23 09:43:29', 0, 0, NULL, 0, 0, 0, NULL, NULL, 'admin-1773474482355-324628.png', 'student-1774204990603-169913.png', '2026-03-23 09:43:28'),
(18, 1, 'admin', 'Administrator', 2, 'admin', 'Steven John A. Agustin', 'hello', NULL, NULL, NULL, 0, NULL, 0, 0, NULL, 0, 0, 0, NULL, NULL, 'admin-1773474482355-324628.png', NULL, '2026-03-23 09:46:13'),
(19, 35, 'student', 'Natsu', 1, 'admin', 'CSS Admin', 'hello', NULL, NULL, NULL, 1, '2026-03-23 09:54:21', 0, 0, NULL, 0, 0, 0, NULL, NULL, 'student-1774204990603-169913.png', 'admin-1773474482355-324628.png', '2026-03-23 09:46:35'),
(20, 1, 'admin', 'Administrator', 2, 'admin', 'Steven John A. Agustin', 'hello', NULL, NULL, NULL, 0, NULL, 0, 0, NULL, 0, 0, 0, NULL, NULL, 'admin-1773474482355-324628.png', NULL, '2026-03-23 09:49:30'),
(21, 1, 'admin', 'Administrator', 35, 'student', 'Natsu', 'what?', NULL, NULL, NULL, 1, '2026-03-23 09:54:33', 0, 0, NULL, 0, 0, 0, NULL, NULL, 'admin-1773474482355-324628.png', 'student-1774204990603-169913.png', '2026-03-23 09:54:26'),
(22, 1, 'admin', 'Administrator', 35, 'student', 'Natsu', 'hello', NULL, NULL, NULL, 1, '2026-03-23 09:54:33', 0, 0, NULL, 0, 0, 0, NULL, NULL, 'admin-1773474482355-324628.png', 'student-1774204990603-169913.png', '2026-03-23 09:54:29'),
(23, 1, 'admin', 'Administrator', 35, 'student', 'Natsu', 'Come on', NULL, NULL, NULL, 1, '2026-03-23 09:56:42', 0, 0, NULL, 0, 0, 0, NULL, NULL, 'admin-1773474482355-324628.png', 'student-1774204990603-169913.png', '2026-03-23 09:56:21'),
(24, 1, 'admin', 'Administrator', 35, 'student', 'Natsu', '😂😂', NULL, NULL, NULL, 1, '2026-03-23 09:56:42', 0, 0, NULL, 0, 0, 0, NULL, NULL, 'admin-1773474482355-324628.png', 'student-1774204990603-169913.png', '2026-03-23 09:56:25'),
(25, 1, 'admin', 'Administrator', 35, 'student', 'Natsu Dragneel', 'hello', NULL, NULL, NULL, 1, '2026-03-23 09:58:27', 0, 0, NULL, 0, 0, 0, NULL, NULL, 'admin-1773474482355-324628.png', 'student-1774204990603-169913.png', '2026-03-23 09:58:21'),
(26, 35, 'student', 'Natsu', 1, 'admin', 'CSS Admin', 'Mam what\'s going on?', NULL, NULL, NULL, 1, '2026-03-23 09:59:13', 0, 0, NULL, 0, 0, 0, NULL, NULL, 'student-1774204990603-169913.png', 'admin-1773474482355-324628.png', '2026-03-23 09:59:11'),
(27, 1, 'admin', 'Administrator', 35, 'student', 'Natsu', 'Nothing haha', NULL, NULL, NULL, 1, '2026-03-23 09:59:25', 0, 0, NULL, 0, 0, 0, NULL, NULL, 'admin-1773474482355-324628.png', 'student-1774204990603-169913.png', '2026-03-23 09:59:24'),
(28, 1, 'admin', 'Administrator', 35, 'student', 'Natsu Dragneel', 'Hello', NULL, NULL, NULL, 1, '2026-03-23 10:00:33', 0, 0, NULL, 0, 0, 0, NULL, NULL, 'admin-1773474482355-324628.png', 'student-1774204990603-169913.png', '2026-03-23 10:00:31'),
(29, 35, 'student', 'Natsu', 1, 'admin', 'Administrator', 'ahahaha', NULL, NULL, NULL, 1, '2026-03-23 10:00:43', 0, 0, NULL, 0, 0, 0, NULL, NULL, 'student-1774204990603-169913.png', 'admin-1773474482355-324628.png', '2026-03-23 10:00:41'),
(30, 35, 'student', 'Natsu', 1, 'admin', 'Administrator', 'What\'s', NULL, NULL, NULL, 1, '2026-03-23 10:01:21', 0, 0, NULL, 0, 0, 0, NULL, NULL, 'student-1774204990603-169913.png', 'admin-1773474482355-324628.png', '2026-03-23 10:01:19'),
(31, 35, 'student', 'Natsu', 19, 'student', 'Charimea Selga', 'Hello!', NULL, NULL, NULL, 1, '2026-03-24 10:27:04', 0, 0, NULL, 0, 0, 0, NULL, NULL, 'student-1774204990603-169913.png', 'student-1774180359937-849543.jpg', '2026-03-23 10:05:02'),
(32, 35, 'student', 'Natsu', 19, 'student', 'Charimea Selga', 'This is the new feature I put in to our System', NULL, NULL, NULL, 1, '2026-03-24 10:27:04', 0, 0, NULL, 0, 0, 0, NULL, NULL, 'student-1774204990603-169913.png', 'student-1774180359937-849543.jpg', '2026-03-23 10:05:19'),
(33, 35, 'student', 'Natsu', 19, 'student', 'Charimea Selga', 'It is great?', NULL, NULL, NULL, 1, '2026-03-24 10:27:04', 0, 0, NULL, 0, 0, 0, NULL, NULL, 'student-1774204990603-169913.png', 'student-1774180359937-849543.jpg', '2026-03-23 10:05:23'),
(34, 1, 'admin', 'Administrator', 35, 'student', 'Natsu Dragneel', 'Hello', NULL, NULL, NULL, 1, '2026-03-23 10:06:42', 0, 0, NULL, 0, 0, 0, NULL, NULL, 'admin-1773474482355-324628.png', 'student-1774204990603-169913.png', '2026-03-23 10:06:22'),
(35, 1, 'admin', 'Administrator', 35, 'student', 'Natsu Dragneel', 'What?', NULL, NULL, NULL, 1, '2026-03-23 10:06:42', 0, 0, NULL, 0, 0, 0, NULL, NULL, 'admin-1773474482355-324628.png', 'student-1774204990603-169913.png', '2026-03-23 10:06:31'),
(36, 1, 'admin', 'Administrator', 35, 'student', 'Natsu Dragneel', 'It\'s working?', NULL, NULL, NULL, 1, '2026-03-23 10:06:55', 0, 0, NULL, 0, 0, 0, NULL, NULL, 'admin-1773474482355-324628.png', 'student-1774204990603-169913.png', '2026-03-23 10:06:51'),
(37, 35, 'student', 'Natsu', 1, 'admin', 'Administrator', 'No mam', NULL, NULL, NULL, 1, '2026-03-23 10:07:14', 0, 1, '2026-03-23 19:50:34', 0, 0, 0, NULL, NULL, 'student-1774204990603-169913.png', 'admin-1773474482355-324628.png', '2026-03-23 10:07:11'),
(38, 1, 'admin', 'Administrator', 35, 'student', 'Natsu', '😂😂', NULL, NULL, NULL, 1, '2026-03-23 10:07:26', 0, 0, NULL, 0, 0, 0, NULL, NULL, 'admin-1773474482355-324628.png', 'student-1774204990603-169913.png', '2026-03-23 10:07:24'),
(39, 1, 'admin', 'Administrator', 35, 'student', 'Natsu', NULL, '/api/v1/uploads/message_files/msg_1774231944611_376289072_6734967113212830_5626171689343155846_n.jpg', '376289072_6734967113212830_5626171689343155846_n.jpg', 'image/jpeg', 1, '2026-03-23 10:12:26', 0, 0, NULL, 0, 0, 0, NULL, NULL, 'admin-1773474482355-324628.png', 'student-1774204990603-169913.png', '2026-03-23 10:12:24'),
(40, 7, 'teacher', 'Steven John A. Agustin', 1, 'admin', 'CSS Admin', NULL, NULL, NULL, NULL, 1, '2026-03-23 11:21:00', 1, 0, NULL, 0, 0, 0, NULL, NULL, 'teacher-1774205291067-113602.png', 'admin-1773474482355-324628.png', '2026-03-23 11:20:49'),
(41, 49, 'student', 'Andrea', 1, 'super_admin', 'Super Administrator', NULL, NULL, NULL, NULL, 1, '2026-03-23 12:32:17', 1, 0, NULL, 0, 0, 0, NULL, NULL, NULL, 'superadmin-1774076347437-483598.jpg', '2026-03-23 12:32:03'),
(42, 1, 'super_admin', 'Super Administrator', 49, 'student', 'Andrea', 'Is this your lastname?', '/api/v1/uploads/message_files/msg_1774240559970_Untitled.png', 'Untitled.png', 'image/png', 1, '2026-03-23 12:36:46', 0, 0, NULL, 0, 0, 0, NULL, NULL, 'superadmin-1774076347437-483598.jpg', NULL, '2026-03-23 12:36:00'),
(43, 7, 'teacher', 'Steven John A. Agustin', 1, 'admin', 'CSS Admin', NULL, NULL, NULL, NULL, 1, '2026-03-23 12:59:57', 1, 0, NULL, 0, 0, 0, NULL, NULL, 'teacher-1774240930680-701646.png', 'admin-1773474482355-324628.png', '2026-03-23 12:42:26'),
(44, 1, 'super_admin', 'Super Administrator', 1, 'admin', 'CSS Admin', 'Hello World', NULL, NULL, NULL, 1, '2026-03-23 13:01:02', 0, 0, NULL, 0, 0, 0, '{\"admin_1\":{\"reactorId\":1,\"reactorRole\":\"admin\",\"emoji\":\"😂\"}}', NULL, 'superadmin-1774076347437-483598.jpg', 'admin-1773474482355-324628.png', '2026-03-23 12:59:46'),
(45, 1, 'admin', 'CSS Admin', 7, 'teacher', 'Steven John A. Agustin', NULL, NULL, NULL, NULL, 1, '2026-03-23 13:00:34', 1, 0, NULL, 0, 0, 0, NULL, NULL, 'admin-1773474482355-324628.png', 'teacher-1774240930680-701646.png', '2026-03-23 13:00:31'),
(46, 7, 'teacher', 'Steven John A. Agustin', 1, 'admin', 'CSS Admin', NULL, NULL, NULL, NULL, 1, '2026-03-23 13:01:23', 1, 0, NULL, 0, 0, 0, NULL, NULL, 'teacher-1774240930680-701646.png', 'admin-1773474482355-324628.png', '2026-03-23 13:00:45'),
(47, 7, 'teacher', 'Steven John A. Agustin', 1, 'admin', 'CSS Admin', 'Good day Admin! can I request another account?', NULL, NULL, NULL, 1, '2026-03-23 13:02:56', 0, 0, NULL, 0, 0, 1, NULL, NULL, 'teacher-1774240930680-701646.png', 'admin-1773474482355-324628.png', '2026-03-23 13:02:54'),
(48, 1, 'admin', 'CSS Admin', 7, 'teacher', 'Steven John A. Agustin', 'yes sure, account for you or a student ?', NULL, NULL, NULL, 1, '2026-03-23 13:04:15', 0, 0, NULL, 0, 0, 0, NULL, NULL, 'admin-1773474482355-324628.png', 'teacher-1774240930680-701646.png', '2026-03-23 13:04:13'),
(49, 7, 'teacher', 'Steven John A. Agustin', 1, 'admin', 'CSS Admin', 'Good day admin!, I have problem with my account', NULL, NULL, NULL, 1, '2026-03-23 13:06:33', 0, 0, NULL, 0, 0, 0, NULL, NULL, 'teacher-1774240930680-701646.png', 'admin-1773474482355-324628.png', '2026-03-23 13:06:30'),
(50, 7, 'teacher', 'Steven John A. Agustin', 1, 'super_admin', 'Super Administrator', 'Good day! Super admin, Can I see my login logs?', NULL, NULL, NULL, 1, '2026-03-23 13:20:54', 0, 0, NULL, 0, 0, 0, NULL, NULL, 'teacher-1774240930680-701646.png', 'superadmin-1774242535609-552779.png', '2026-03-23 13:08:57'),
(51, 1, 'admin', 'CSS Admin', 7, 'teacher', 'Steven John A. Agustin', 'what is problem?', NULL, NULL, NULL, 1, '2026-03-24 01:18:15', 0, 0, NULL, 0, 0, 0, '{\"teacher_7\":{\"reactorId\":7,\"reactorRole\":\"teacher\",\"emoji\":\"😂\"}}', NULL, 'admin-1773474482355-324628.png', 'teacher-1774240930680-701646.png', '2026-03-23 13:09:45'),
(52, 35, 'student', 'Natsu', 1, 'admin', 'Administrator', 'I can\'t upload profile mam', NULL, NULL, NULL, 1, '2026-03-23 20:12:43', 0, 0, NULL, 0, 0, 0, NULL, NULL, 'student-1774204990603-169913.png', 'admin-1773474482355-324628.png', '2026-03-23 20:12:32'),
(53, 7, 'teacher', 'Steven John A. Agustin', 41, 'student', 'Angel Mageri Cabote (ECoAST)', '↪️ yes sure, account for you or a student ?', NULL, NULL, NULL, 0, NULL, 0, 0, NULL, 0, 0, 0, NULL, NULL, 'teacher-1774286273203-115898.jpg', 'student-1774204811919-842386.jpg', '2026-03-24 01:26:16'),
(54, 35, 'student', 'Natsu', 19, 'student', 'Charimea Selga', 'Test mo crop image', NULL, NULL, NULL, 1, '2026-03-24 10:27:04', 0, 0, NULL, 0, 0, 0, NULL, NULL, 'student-1774291218077-659300.jpg', 'student-1774180359937-849543.jpg', '2026-03-24 10:16:04'),
(55, 35, 'student', 'Natsu', 19, 'student', 'Charimea Selga', 'nu agbalen', NULL, NULL, NULL, 1, '2026-03-24 10:27:04', 0, 0, NULL, 0, 0, 0, NULL, NULL, 'student-1774291218077-659300.jpg', 'student-1774180359937-849543.jpg', '2026-03-24 10:16:08'),
(56, 35, 'student', 'Natsu', 19, 'student', 'Charimea Selga', '😂😂', NULL, NULL, NULL, 1, '2026-03-24 10:27:04', 0, 0, NULL, 0, 0, 0, NULL, NULL, 'student-1774291218077-659300.jpg', 'student-1774180359937-849543.jpg', '2026-03-24 10:16:15'),
(57, 19, 'student', 'Charimea', 35, 'student', 'Natsu', 'Bleeeee', NULL, NULL, NULL, 1, '2026-03-24 10:27:12', 0, 0, NULL, 0, 0, 0, NULL, NULL, 'student-1774180359937-849543.jpg', 'student-1774291218077-659300.jpg', '2026-03-24 10:27:08'),
(58, 35, 'student', 'Natsu', 19, 'student', 'Charimea Selga', 'Edit message', NULL, NULL, NULL, 1, '2026-03-24 10:28:46', 0, 0, NULL, 0, 0, 0, NULL, NULL, 'student-1774291218077-659300.jpg', 'student-1774319257454-911589.jpg', '2026-03-24 10:28:28'),
(59, 35, 'student', 'Natsu', 19, 'student', 'Charimea Selga', 'test mo', NULL, NULL, NULL, 1, '2026-03-24 10:28:46', 0, 0, NULL, 0, 0, 0, NULL, NULL, 'student-1774291218077-659300.jpg', 'student-1774319257454-911589.jpg', '2026-03-24 10:28:30'),
(60, 35, 'student', 'Natsu', 19, 'student', 'Charimea Selga', 'haha', NULL, NULL, NULL, 1, '2026-03-24 10:28:46', 0, 0, NULL, 0, 0, 0, NULL, NULL, 'student-1774291218077-659300.jpg', 'student-1774319257454-911589.jpg', '2026-03-24 10:28:31'),
(61, 19, 'student', 'Charimea', 35, 'student', 'Natsu', 'Bleeee', NULL, NULL, NULL, 1, '2026-03-24 10:28:52', 0, 1, '2026-03-24 10:29:00', 0, 0, 0, NULL, NULL, 'student-1774319257454-911589.jpg', 'student-1774291218077-659300.jpg', '2026-03-24 10:28:52'),
(62, 35, 'student', 'Natsu', 19, 'student', 'Charimea Selga', 'edit mo', NULL, NULL, NULL, 1, '2026-03-24 10:29:00', 0, 0, NULL, 0, 0, 0, NULL, NULL, 'student-1774291218077-659300.jpg', 'student-1774319257454-911589.jpg', '2026-03-24 10:28:58'),
(63, 35, 'student', 'Natsu', 19, 'student', 'Charimea Selga', 'test mo haha', NULL, NULL, NULL, 1, '2026-03-24 10:29:02', 0, 0, NULL, 0, 0, 0, NULL, NULL, 'student-1774291218077-659300.jpg', 'student-1774319257454-911589.jpg', '2026-03-24 10:29:00'),
(64, 19, 'student', 'Charimea', 35, 'student', 'Natsu', 'Balinen', NULL, NULL, NULL, 1, '2026-03-24 10:29:08', 0, 0, NULL, 0, 0, 0, NULL, NULL, 'student-1774319257454-911589.jpg', 'student-1774291218077-659300.jpg', '2026-03-24 10:29:05'),
(65, 35, 'student', 'Natsu', 19, 'student', 'Charimea Selga', 'Nice haha', NULL, NULL, NULL, 1, '2026-03-24 10:29:14', 0, 0, NULL, 0, 0, 0, NULL, NULL, 'student-1774291218077-659300.jpg', 'student-1774319257454-911589.jpg', '2026-03-24 10:29:13'),
(66, 35, 'student', 'Natsu', 19, 'student', 'Charimea Selga', 'inaramid nga chat box haha', NULL, NULL, NULL, 1, '2026-03-24 10:29:22', 0, 0, NULL, 0, 0, 0, NULL, NULL, 'student-1774291218077-659300.jpg', 'student-1774319257454-911589.jpg', '2026-03-24 10:29:19'),
(67, 7, 'teacher', 'Steven John A. Agustin', 41, 'student', 'Angel Mageri Cabote (ECoAST)', '??', NULL, NULL, NULL, 0, NULL, 0, 0, NULL, 0, 0, 0, NULL, NULL, 'teacher-1774291178630-987411.jpg', 'student-1774204811919-842386.jpg', '2026-03-24 12:58:25'),
(68, 7, 'teacher', 'Steven John A. Agustin', 41, 'student', 'Angel Mageri Cabote (ECoAST)', 'any follow up?', NULL, NULL, NULL, 0, NULL, 0, 0, NULL, 0, 0, 0, NULL, NULL, 'teacher-1774291178630-987411.jpg', 'student-1774204811919-842386.jpg', '2026-03-24 12:58:30'),
(69, 7, 'teacher', 'Steven John A. Agustin', 41, 'student', 'Angel Mageri Cabote (ECoAST)', 'student?', NULL, NULL, NULL, 0, NULL, 0, 0, NULL, 0, 0, 0, NULL, NULL, 'teacher-1774291178630-987411.jpg', 'student-1774204811919-842386.jpg', '2026-03-24 12:58:31'),
(70, 42, 'student', 'Zaiejan', 49, 'student', 'Andrea Lachica', 'Hello hamste🤣', NULL, NULL, NULL, 1, '2026-03-24 15:21:38', 0, 1, '2026-03-24 15:21:57', 0, 0, 1, NULL, NULL, 'student-1774336806254-514881.jpg', 'student-1774336848701-75789.jpg', '2026-03-24 15:21:20'),
(71, 42, 'student', 'Zaiejan', 19, 'student', 'Charimea Selga', '↪️ Hello hamste🤣 (edited)', NULL, NULL, NULL, 0, NULL, 0, 0, NULL, 0, 0, 0, NULL, NULL, 'student-1774336806254-514881.jpg', 'student-1774319257454-911589.jpg', '2026-03-24 15:22:28'),
(72, 42, 'student', 'Zaiejan', 19, 'student', 'Charimea Selga', NULL, '/api/v1/uploads/message_files/msg_1774336989582_Panpacific-University-North-Philippines.jpg', 'Panpacific-University-North-Philippines.jpg', 'image/jpeg', 0, NULL, 0, 0, NULL, 0, 0, 0, NULL, NULL, 'student-1774336806254-514881.jpg', 'student-1774319257454-911589.jpg', '2026-03-24 15:23:09'),
(73, 42, 'student', 'Zaiejan', 19, 'student', 'Charimea Selga', 'uurje', NULL, NULL, NULL, 0, NULL, 0, 0, NULL, 0, 0, 0, NULL, NULL, 'student-1774336806254-514881.jpg', 'student-1774319257454-911589.jpg', '2026-03-24 15:27:30'),
(74, 42, 'student', 'Zaiejan', 19, 'student', 'Charimea Selga', NULL, '/api/v1/uploads/message_files/msg_1774337265049_IMG_20260324_152540_866.jpg', 'IMG_20260324_152540_866.jpg', 'image/jpeg', 0, NULL, 0, 0, NULL, 0, 0, 0, NULL, NULL, 'student-1774336806254-514881.jpg', 'student-1774319257454-911589.jpg', '2026-03-24 15:27:45'),
(75, 42, 'student', 'Zaiejan', 19, 'student', 'Charimea Selga', NULL, '/api/v1/uploads/message_files/msg_1774337285402_IMG_20260324_152540_866.jpg', 'IMG_20260324_152540_866.jpg', 'image/jpeg', 0, NULL, 0, 0, NULL, 0, 0, 0, NULL, NULL, 'student-1774336806254-514881.jpg', 'student-1774319257454-911589.jpg', '2026-03-24 15:28:05'),
(76, 7, 'teacher', 'Steven John A. Agustin', 1, 'admin', 'CSS Admin', '😎', NULL, NULL, NULL, 1, '2026-03-24 22:56:21', 0, 0, NULL, 0, 0, 0, NULL, NULL, 'teacher-1774291178630-987411.jpg', 'admin-1774291107115-669.jpg', '2026-03-24 22:43:08'),
(77, 1, 'admin', 'CSS Admin', 52, 'student', 'Maxene Franco', NULL, '/api/v1/uploads/message_files/msg_1774364467541_e4fe201a-02d2-4f18-86db-5ba51fb76fe5.jpg', 'e4fe201a-02d2-4f18-86db-5ba51fb76fe5.jpg', 'image/jpeg', 1, '2026-03-24 23:01:19', 0, 0, NULL, 0, 0, 0, NULL, NULL, 'admin-1774291107115-669.jpg', NULL, '2026-03-24 23:01:07'),
(78, 1, 'admin', 'CSS Admin', 52, 'student', 'Maxene Franco', NULL, '/api/v1/uploads/message_files/msg_1774364472134_IMG_20260324_100235_526.jpg', 'IMG_20260324_100235_526.jpg', 'image/jpeg', 1, '2026-03-24 23:01:19', 0, 0, NULL, 0, 0, 0, NULL, NULL, 'admin-1774291107115-669.jpg', NULL, '2026-03-24 23:01:12'),
(79, 1, 'admin', 'CSS Admin', 52, 'student', 'Maxene Franco', NULL, '/api/v1/uploads/message_files/msg_1774364519814_81a14f46-e4a1-4425-b287-10583c982900__1_.jpg', '81a14f46-e4a1-4425-b287-10583c982900 (1).jpg', 'image/jpeg', 1, '2026-03-24 23:02:02', 0, 0, NULL, 0, 0, 0, NULL, NULL, 'admin-1774291107115-669.jpg', NULL, '2026-03-24 23:01:59'),
(80, 1, 'admin', 'CSS Admin', 52, 'student', 'Maxene Franco', 'hello', NULL, NULL, NULL, 1, '2026-03-25 00:56:59', 0, 0, NULL, 0, 0, 0, NULL, NULL, 'admin-1774291107115-669.jpg', NULL, '2026-03-25 00:56:56'),
(81, 35, 'student', 'Natsu', 1, 'admin', 'CSS Admin', 'This is the list of the class Mam', '/api/v1/uploads/message_files/msg_1774374886612_Admin_Appointment_History.xlsx', 'Admin Appointment History.xlsx', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 1, '2026-03-25 01:55:00', 0, 0, NULL, 0, 0, 0, NULL, NULL, 'student-1774291218077-659300.jpg', 'admin-1774291107115-669.jpg', '2026-03-25 01:54:46'),
(82, 35, 'student', 'Natsu', 43, 'student', 'Jan Ray Aquino', NULL, NULL, NULL, NULL, 1, '2026-03-25 19:41:10', 1, 0, NULL, 0, 0, 0, NULL, NULL, 'student-1774291218077-659300.jpg', NULL, '2026-03-25 19:40:55'),
(83, 43, 'student', 'Jan Ray', 35, 'student', 'Natsu', NULL, NULL, NULL, NULL, 1, '2026-03-25 19:41:19', 1, 0, NULL, 0, 0, 0, NULL, NULL, NULL, 'student-1774291218077-659300.jpg', '2026-03-25 19:41:17'),
(84, 43, 'student', 'Jan Ray', 35, 'student', 'Natsu', NULL, NULL, NULL, NULL, 1, '2026-03-25 20:07:40', 1, 0, NULL, 0, 0, 0, NULL, NULL, 'student-1774440304501-238054.jpg', 'student-1774291218077-659300.jpg', '2026-03-25 20:07:05'),
(85, 43, 'student', 'Jan Ray', 35, 'student', 'Natsu', NULL, NULL, NULL, NULL, 1, '2026-03-25 20:07:40', 1, 0, NULL, 0, 0, 0, NULL, NULL, 'student-1774440304501-238054.jpg', 'student-1774291218077-659300.jpg', '2026-03-25 20:07:25'),
(86, 43, 'student', 'Jan Ray', 35, 'student', 'Natsu', NULL, NULL, NULL, NULL, 1, '2026-03-25 20:08:40', 1, 0, NULL, 0, 0, 0, NULL, NULL, 'student-1774440304501-238054.jpg', 'student-1774291218077-659300.jpg', '2026-03-25 20:07:49'),
(87, 43, 'student', 'Jan Ray', 35, 'student', 'Natsu', NULL, NULL, NULL, NULL, 1, '2026-03-25 20:15:56', 1, 0, NULL, 0, 0, 0, NULL, NULL, 'student-1774440304501-238054.jpg', 'student-1774291218077-659300.jpg', '2026-03-25 20:15:53'),
(88, 43, 'student', 'Jan Ray', 1, 'super_admin', 'Super Administrator', 'Can I Request to reset my Device Binding', NULL, NULL, NULL, 1, '2026-03-25 20:16:41', 0, 0, NULL, 0, 0, 0, NULL, NULL, 'student-1774440304501-238054.jpg', 'superadmin-1774318366514-851420.jpg', '2026-03-25 20:16:37'),
(89, 1, 'super_admin', 'Super Administrator', 43, 'student', 'Jan Ray Aquino', 'Yes!!', NULL, NULL, NULL, 1, '2026-03-25 20:16:58', 0, 0, NULL, 0, 0, 0, NULL, NULL, 'superadmin-1774318366514-851420.jpg', 'student-1774440304501-238054.jpg', '2026-03-25 20:16:58'),
(90, 7, 'teacher', 'Steven John A. Agustin', 1, 'admin', 'CSS Admin', 'hello', NULL, NULL, NULL, 1, '2026-03-28 18:39:20', 0, 0, NULL, 0, 0, 0, NULL, NULL, 'teacher-1774291178630-987411.jpg', 'admin-1774291107115-669.jpg', '2026-03-27 16:20:08'),
(91, 7, 'teacher', 'Steven John A. Agustin', 1, 'admin', 'CSS Admin', NULL, NULL, NULL, NULL, 1, '2026-03-28 18:39:20', 1, 0, NULL, 0, 0, 0, NULL, NULL, 'teacher-1774291178630-987411.jpg', 'admin-1774291107115-669.jpg', '2026-03-27 16:37:35'),
(92, 7, 'teacher', 'Steven John A. Agustin', 1, 'admin', 'CSS Admin', NULL, NULL, NULL, NULL, 1, '2026-03-28 18:39:20', 1, 0, NULL, 0, 0, 0, NULL, NULL, 'teacher-1774291178630-987411.jpg', 'admin-1774291107115-669.jpg', '2026-03-27 16:41:41'),
(93, 7, 'teacher', 'Steven John A. Agustin', 1, 'admin', 'CSS Admin', NULL, NULL, NULL, NULL, 1, '2026-03-28 18:39:20', 1, 0, NULL, 0, 0, 0, NULL, NULL, 'teacher-1774291178630-987411.jpg', 'admin-1774291107115-669.jpg', '2026-03-27 16:45:18'),
(94, 7, 'teacher', 'Steven John A. Agustin', 1, 'admin', 'CSS Admin', NULL, NULL, NULL, NULL, 1, '2026-03-28 18:39:20', 1, 0, NULL, 0, 0, 0, NULL, NULL, 'teacher-1774291178630-987411.jpg', 'admin-1774291107115-669.jpg', '2026-03-27 16:46:55'),
(95, 7, 'teacher', 'Steven John A. Agustin', 1, 'admin', 'CSS Admin', NULL, NULL, NULL, NULL, 1, '2026-03-28 18:39:20', 1, 0, NULL, 0, 0, 0, NULL, NULL, 'teacher-1774291178630-987411.jpg', 'admin-1774291107115-669.jpg', '2026-03-27 16:46:59'),
(96, 7, 'teacher', 'Steven John A. Agustin', 1, 'super_admin', 'Super Administrator', NULL, NULL, NULL, NULL, 1, '2026-03-28 02:23:16', 1, 0, NULL, 0, 0, 0, NULL, NULL, 'teacher-1774291178630-987411.jpg', 'superadmin-1774318366514-851420.jpg', '2026-03-27 16:48:11'),
(97, 7, 'teacher', 'Steven John A. Agustin', 1, 'super_admin', 'Super Administrator', NULL, NULL, NULL, NULL, 1, '2026-03-28 02:23:16', 1, 0, NULL, 0, 0, 0, NULL, NULL, 'teacher-1774291178630-987411.jpg', 'superadmin-1774318366514-851420.jpg', '2026-03-27 16:52:05'),
(98, 35, 'student', 'Natsu Dragneel', 1, 'super_admin', 'Super Administrator', 'Mam can I request to reset my device binding so I can login to my new device, because my previous device is destroyed, Thanks for your cooperation mam', NULL, NULL, NULL, 1, '2026-03-27 17:07:11', 0, 1, '2026-03-27 17:20:58', 0, 0, 0, NULL, NULL, NULL, NULL, '2026-03-27 17:06:59'),
(99, 23, 'student', 'Lucy', 7, 'teacher', 'Steven John A. Agustin', 'hello po sir pa excused po sir', NULL, NULL, NULL, 1, '2026-03-28 12:15:22', 0, 0, NULL, 0, 0, 0, '{\"teacher_7\":{\"reactorId\":7,\"reactorRole\":\"teacher\",\"emoji\":\"❤️\"}}', NULL, 'student-1774159341046-561222.png', 'teacher-1774291178630-987411.jpg', '2026-03-28 12:15:12'),
(100, 7, 'teacher', 'Steven John A. Agustin', 23, 'student', 'Lucy', NULL, NULL, NULL, NULL, 1, '2026-04-06 08:14:44', 1, 0, NULL, 0, 0, 0, NULL, NULL, 'teacher-1774291178630-987411.jpg', 'student-1774159341046-561222.png', '2026-04-01 22:23:36'),
(101, 7, 'teacher', 'Steven John A. Agustin', 23, 'student', 'Lucy', NULL, NULL, NULL, NULL, 1, '2026-04-06 08:14:44', 1, 0, NULL, 0, 0, 0, NULL, NULL, 'teacher-1774291178630-987411.jpg', 'student-1774159341046-561222.png', '2026-04-01 22:29:20'),
(102, 7, 'teacher', 'Steven John A. Agustin', 41, 'student', 'Angel Mageri Cabote (ECoAST)', 'hello', NULL, NULL, NULL, 0, NULL, 0, 0, NULL, 0, 0, 0, NULL, NULL, 'teacher-1774291178630-987411.jpg', 'student-1774204811919-842386.jpg', '2026-03-28 18:14:12'),
(103, 7, 'teacher', 'Steven John A. Agustin', 41, 'student', 'Angel Mageri Cabote (ECoAST)', 'hello', NULL, NULL, NULL, 0, NULL, 0, 0, NULL, 0, 0, 0, NULL, NULL, 'teacher-1774291178630-987411.jpg', 'student-1774204811919-842386.jpg', '2026-03-28 18:14:19'),
(104, 7, 'teacher', 'Steven John A. Agustin', 41, 'student', 'Angel Mageri Cabote (ECoAST)', 'hello', NULL, NULL, NULL, 0, NULL, 0, 0, NULL, 0, 0, 0, NULL, NULL, 'teacher-1774291178630-987411.jpg', 'student-1774204811919-842386.jpg', '2026-03-28 18:14:19'),
(105, 7, 'teacher', 'Steven John A. Agustin', 41, 'student', 'Angel Mageri Cabote (ECoAST)', 'hello', NULL, NULL, NULL, 0, NULL, 0, 0, NULL, 0, 0, 0, NULL, NULL, 'teacher-1774291178630-987411.jpg', 'student-1774204811919-842386.jpg', '2026-03-28 18:14:19'),
(106, 7, 'teacher', 'Steven John A. Agustin', 41, 'student', 'Angel Mageri Cabote (ECoAST)', 'hello', NULL, NULL, NULL, 0, NULL, 0, 0, NULL, 0, 0, 0, NULL, NULL, 'teacher-1774291178630-987411.jpg', 'student-1774204811919-842386.jpg', '2026-03-28 18:14:20'),
(107, 7, 'teacher', 'Steven John A. Agustin', 1, 'super_admin', 'Super Administrator', '😂😂', NULL, NULL, NULL, 1, '2026-03-28 23:00:46', 0, 0, NULL, 0, 0, 0, NULL, NULL, 'teacher-1774291178630-987411.jpg', 'superadmin-1774318366514-851420.jpg', '2026-03-28 18:28:11'),
(108, 7, 'teacher', 'Steven John A. Agustin', 1, 'admin', 'CSS Admin', '😂', NULL, NULL, NULL, 1, '2026-03-28 18:39:20', 0, 0, NULL, 0, 0, 0, NULL, NULL, 'teacher-1774291178630-987411.jpg', 'admin-1774291107115-669.jpg', '2026-03-28 18:32:56'),
(109, 7, 'teacher', 'Steven John A. Agustin', 1, 'admin', 'CSS Admin', NULL, NULL, NULL, NULL, 1, '2026-03-28 18:39:20', 1, 0, NULL, 0, 0, 0, NULL, NULL, 'teacher-1774291178630-987411.jpg', 'admin-1774291107115-669.jpg', '2026-03-28 18:34:06'),
(110, 7, 'teacher', 'Steven John A. Agustin', 1, 'admin', 'CSS Admin', 'Hello Mam, I have a request', NULL, NULL, NULL, 1, '2026-03-28 18:40:52', 0, 1, '2026-03-28 18:41:30', 0, 0, 0, NULL, NULL, 'teacher-1774291178630-987411.jpg', 'admin-1774291107115-669.jpg', '2026-03-28 18:40:40'),
(111, 1, 'admin', 'CSS Admin', 7, 'teacher', 'Steven John A. Agustin', 'What is it?', NULL, NULL, NULL, 1, '2026-03-28 18:41:02', 0, 0, NULL, 0, 0, 0, '{\"teacher_7\":{\"reactorId\":7,\"reactorRole\":\"teacher\",\"emoji\":\"❤️\"}}', NULL, 'admin-1774291107115-669.jpg', 'teacher-1774291178630-987411.jpg', '2026-03-28 18:41:00'),
(112, 35, 'student', 'Natsu Dragneel', 1, 'admin', 'CSS Admin', 'Hello mam', NULL, NULL, NULL, 1, '2026-03-28 18:44:33', 0, 0, NULL, 0, 0, 0, NULL, NULL, NULL, NULL, '2026-03-28 18:44:25'),
(113, 1, 'admin', 'CSS Admin', 35, 'student', 'Natsu', 'Why?', NULL, NULL, NULL, 1, '2026-03-28 18:44:40', 0, 0, NULL, 0, 0, 0, NULL, NULL, 'admin-1774291107115-669.jpg', 'student-1774291218077-659300.jpg', '2026-03-28 18:44:37'),
(114, 7, 'teacher', 'Steven John A. Agustin', 1, 'admin', 'CSS Admin', 'Nothing mam', NULL, NULL, NULL, 1, '2026-03-28 18:45:17', 0, 0, NULL, 0, 0, 0, '{\"admin_1\":{\"reactorId\":1,\"reactorRole\":\"admin\",\"emoji\":\"😂\"}}', NULL, 'teacher-1774291178630-987411.jpg', 'admin-1774291107115-669.jpg', '2026-03-28 18:45:17'),
(115, 35, 'student', 'Natsu Dragneel', 1, 'admin', 'CSS Admin', NULL, NULL, NULL, NULL, 1, '2026-03-28 18:46:07', 1, 0, NULL, 0, 0, 0, NULL, NULL, NULL, NULL, '2026-03-28 18:45:41'),
(116, 35, 'student', 'Natsu Dragneel', 1, 'admin', 'CSS Admin', NULL, NULL, NULL, NULL, 1, '2026-03-28 18:46:07', 1, 0, NULL, 0, 0, 0, NULL, NULL, NULL, NULL, '2026-03-28 18:45:48'),
(117, 1, 'admin', 'CSS Admin', 49, 'student', 'Andrea Lachica', 'Hello Hamster!!', NULL, NULL, NULL, 0, NULL, 0, 0, NULL, 0, 0, 0, NULL, NULL, 'admin-1774291107115-669.jpg', 'student-1774336848701-75789.jpg', '2026-03-28 18:46:43'),
(118, 7, 'teacher', 'Steven John A. Agustin', 1, 'admin', 'CSS Admin', 'll', NULL, NULL, NULL, 1, '2026-03-28 18:55:31', 0, 0, NULL, 0, 0, 0, '{\"admin_1\":{\"reactorId\":1,\"reactorRole\":\"admin\",\"emoji\":\"😂\"}}', NULL, 'teacher-1774291178630-987411.jpg', 'admin-1774291107115-669.jpg', '2026-03-28 18:55:18'),
(119, 1, 'admin', 'CSS Admin', 2, 'admin', 'Steven John A. Agustin', 'hawak mo ang beaaaaaaaaaat!!!!', NULL, NULL, NULL, 0, NULL, 0, 0, NULL, 0, 0, 0, '{\"admin_1\":{\"reactorId\":1,\"reactorRole\":\"admin\",\"emoji\":\"😂\"}}', NULL, 'admin-1774291107115-669.jpg', NULL, '2026-03-28 21:12:36'),
(120, 7, 'teacher', 'Steven John A. Agustin', 1, 'admin', 'CSS Admin Cha', 'Adda bagtit mo', NULL, NULL, NULL, 1, '2026-03-28 21:41:15', 0, 0, NULL, 0, 0, 0, NULL, NULL, 'teacher-1774291178630-987411.jpg', 'admin-1774291107115-669.jpg', '2026-03-28 21:40:38'),
(121, 7, 'teacher', 'Steven John A. Agustin', 1, 'admin', 'CSS Admin Cha', 'Adda in add ko mabalin ka ag react', NULL, NULL, NULL, 1, '2026-03-28 21:41:15', 0, 0, NULL, 0, 0, 0, '{\"admin_1\":{\"reactorId\":1,\"reactorRole\":\"admin\",\"emoji\":\"😡\"},\"teacher_7\":{\"reactorId\":7,\"reactorRole\":\"teacher\",\"emoji\":\"😂\"}}', NULL, 'teacher-1774291178630-987411.jpg', 'admin-1774291107115-669.jpg', '2026-03-28 21:40:55'),
(122, 7, 'teacher', 'Steven John A. Agustin', 1, 'admin', 'CSS Admin Cha', NULL, '/api/v1/uploads/message_files/msg_1774705440120_image.png', 'image.png', 'image/png', 1, '2026-03-28 21:44:59', 0, 0, NULL, 0, 0, 0, NULL, NULL, 'teacher-1774291178630-987411.jpg', 'admin-1774291107115-669.jpg', '2026-03-28 21:44:00'),
(123, 5, 'guard', 'Gray Fullbusters', 1, 'admin', 'Administrator', 'Hi sir', NULL, NULL, NULL, 1, '2026-03-28 23:40:17', 0, 0, NULL, 0, 0, 0, NULL, NULL, NULL, 'admin-1774705701340-338856.jpg', '2026-03-28 21:54:07'),
(124, 5, 'guard', 'Gray Fullbusters', 1, 'admin', 'Administrator', '😊', NULL, NULL, NULL, 1, '2026-03-28 23:40:17', 0, 0, NULL, 0, 0, 0, NULL, NULL, NULL, 'admin-1774705701340-338856.jpg', '2026-03-28 21:54:14'),
(125, 5, 'guard', 'Gray Fullbusters', 20, 'teacher', 'Charimea Selga', 'Hello World', NULL, NULL, NULL, 1, '2026-03-28 21:55:06', 0, 0, NULL, 0, 0, 0, NULL, NULL, 'guard-1774706082744-315190.jpg', NULL, '2026-03-28 21:54:54'),
(126, 20, 'teacher', 'Charimea Selga', 5, 'guard', 'Gray Fullbusters', 'whu yu?', NULL, NULL, NULL, 1, '2026-03-28 21:55:19', 0, 0, NULL, 0, 0, 0, NULL, NULL, NULL, NULL, '2026-03-28 21:55:16'),
(127, 5, 'guard', 'Gray Fullbusters', 20, 'teacher', 'Charimea Selga', NULL, '/api/v1/uploads/message_files/msg_1774706122703_image.png', 'image.png', 'image/png', 0, NULL, 0, 0, NULL, 0, 0, 0, NULL, NULL, 'guard-1774706082744-315190.jpg', NULL, '2026-03-28 21:55:22'),
(128, 7, 'teacher', 'Steven John A. Agustin', 5, 'guard', 'Gray Fullbusters', 'atoy re', NULL, NULL, NULL, 1, '2026-03-28 22:31:15', 0, 0, NULL, 0, 0, 0, '{\"guard_5\":{\"reactorId\":5,\"reactorRole\":\"guard\",\"emoji\":\"😂\"}}', NULL, 'teacher-1774706233728-467958.jpg', NULL, '2026-03-28 22:00:05'),
(129, 7, 'teacher', 'Steven John A. Agustin', 5, 'guard', 'Gray Fullbusters', 'react mo man pre', NULL, NULL, NULL, 1, '2026-03-28 22:31:15', 0, 0, NULL, 0, 0, 0, '{\"guard_5\":{\"reactorId\":5,\"reactorRole\":\"guard\",\"emoji\":\"😮\"}}', NULL, 'teacher-1774706233728-467958.jpg', NULL, '2026-03-28 22:00:09'),
(130, 5, 'guard', 'Gray Fullbusters', 7, 'teacher', 'Steven John A. Agustin', 'Hi', NULL, NULL, NULL, 1, '2026-03-28 22:31:44', 0, 0, NULL, 0, 0, 0, '{\"teacher_7\":{\"reactorId\":7,\"reactorRole\":\"teacher\",\"emoji\":\"😂\"}}', NULL, 'guard-1774706082744-315190.jpg', 'teacher-1774706233728-467958.jpg', '2026-03-28 22:31:33'),
(131, 5, 'guard', 'Gray Fullbusters', 7, 'teacher', 'Steven John A. Agustin', 'Allgoods', NULL, NULL, NULL, 1, '2026-03-28 22:31:44', 0, 0, NULL, 0, 0, 0, '{\"teacher_7\":{\"reactorId\":7,\"reactorRole\":\"teacher\",\"emoji\":\"❤️\"}}', NULL, 'guard-1774706082744-315190.jpg', 'teacher-1774706233728-467958.jpg', '2026-03-28 22:31:36'),
(132, 5, 'guard', 'Gray Fullbusters', 7, 'teacher', 'Steven John A. Agustin', 'Labyou pre', NULL, NULL, NULL, 1, '2026-03-28 22:32:17', 0, 0, NULL, 0, 0, 0, '{\"teacher_7\":{\"reactorId\":7,\"reactorRole\":\"teacher\",\"emoji\":\"😂\"}}', NULL, 'guard-1774706082744-315190.jpg', 'teacher-1774706233728-467958.jpg', '2026-03-28 22:32:16'),
(133, 7, 'teacher', 'Steven John A. Agustin', 5, 'guard', 'Gray Fullbusters', 'Nc', NULL, NULL, NULL, 1, '2026-03-28 22:32:19', 0, 0, NULL, 0, 0, 0, '{\"guard_5\":{\"reactorId\":5,\"reactorRole\":\"guard\",\"emoji\":\"😂\"}}', NULL, 'teacher-1774706233728-467958.jpg', NULL, '2026-03-28 22:32:17'),
(134, 5, 'guard', 'Gray Fullbusters', 7, 'teacher', 'Steven John A. Agustin', 'HAHAHAHA', NULL, NULL, NULL, 1, '2026-03-28 22:32:20', 0, 0, NULL, 0, 0, 0, '{\"teacher_7\":{\"reactorId\":7,\"reactorRole\":\"teacher\",\"emoji\":\"😂\"}}', NULL, 'guard-1774706082744-315190.jpg', 'teacher-1774706233728-467958.jpg', '2026-03-28 22:32:18'),
(135, 7, 'teacher', 'Steven John A. Agustin', 1, 'admin', 'CSS Admin Chariz', 'You changed name?', NULL, NULL, NULL, 1, '2026-03-29 02:09:28', 0, 0, NULL, 0, 0, 0, '{\"admin_1\":{\"reactorId\":1,\"reactorRole\":\"admin\",\"emoji\":\"😂\"}}', NULL, 'teacher-1774712389017-326359.jpg', 'admin-1774705701340-338856.jpg', '2026-03-29 02:09:25'),
(136, 7, 'teacher', 'Steven John A. Agustin', 1, 'admin', 'CSS Admin Chariz', 'Hello? haha', NULL, NULL, NULL, 1, '2026-03-29 02:25:49', 0, 0, NULL, 0, 0, 0, '{\"admin_1\":{\"reactorId\":1,\"reactorRole\":\"admin\",\"emoji\":\"😂\"}}', NULL, 'teacher-1774712389017-326359.jpg', 'admin-1774705701340-338856.jpg', '2026-03-29 02:25:43'),
(137, 7, 'teacher', 'Steven John A. Agustin', 1, 'admin', 'CSS Admin Chariz', 'Why mam?', NULL, NULL, NULL, 1, '2026-03-29 02:26:50', 0, 0, NULL, 0, 0, 0, NULL, NULL, 'teacher-1774712389017-326359.jpg', 'admin-1774705701340-338856.jpg', '2026-03-29 02:26:48'),
(138, 1, 'admin', 'CSS Admin Cha', 7, 'teacher', 'Steven John A. Agustin', 'Nothing', NULL, NULL, NULL, 1, '2026-03-29 02:26:59', 0, 0, NULL, 0, 0, 0, '{\"teacher_7\":{\"reactorId\":7,\"reactorRole\":\"teacher\",\"emoji\":\"😂\"}}', NULL, 'admin-1774705701340-338856.jpg', 'teacher-1774712389017-326359.jpg', '2026-03-29 02:26:56'),
(139, 46, 'student', 'Steven John', 1, 'admin', 'CSS Admin Chariz', 'Hello mam, I can\'t attend class right now, because I have urgent to go mam.', NULL, NULL, NULL, 1, '2026-03-29 02:29:04', 0, 0, NULL, 0, 0, 0, '{\"admin_1\":{\"reactorId\":1,\"reactorRole\":\"admin\",\"emoji\":\"❤️\"}}', NULL, NULL, 'admin-1774705701340-338856.jpg', '2026-03-29 02:28:51'),
(140, 7, 'teacher', 'Steven John A. Agustin', 1, 'admin', 'CSS Admin Chariz', 'Mam the System bug is fixed?', NULL, NULL, NULL, 1, '2026-03-29 02:36:15', 0, 0, NULL, 0, 0, 0, '{\"admin_1\":{\"reactorId\":1,\"reactorRole\":\"admin\",\"emoji\":\"😂\"}}', NULL, 'teacher-1774712389017-326359.jpg', 'admin-1774705701340-338856.jpg', '2026-03-29 02:36:05'),
(141, 1, 'admin', 'CSS Admin Cha', 7, 'teacher', 'Steven John A. Agustin', 'Idk haha', NULL, NULL, NULL, 1, '2026-03-29 02:36:23', 0, 0, NULL, 0, 0, 0, '{\"teacher_7\":{\"reactorId\":7,\"reactorRole\":\"teacher\",\"emoji\":\"😂\"}}', NULL, 'admin-1774705701340-338856.jpg', 'teacher-1774712389017-326359.jpg', '2026-03-29 02:36:22'),
(142, 5, 'guard', 'Gray Fullbusters', 7, 'teacher', 'Steven John A. Agustin', 'Hello sir', NULL, NULL, NULL, 1, '2026-03-29 02:40:47', 0, 0, NULL, 0, 0, 0, '{\"teacher_7\":{\"reactorId\":7,\"reactorRole\":\"teacher\",\"emoji\":\"👍\"}}', NULL, 'guard-1774706082744-315190.jpg', 'teacher-1774712389017-326359.jpg', '2026-03-29 02:40:17'),
(143, 7, 'teacher', 'Steven John A. Agustin', 1, 'admin', 'CSS Admin Chariz', 'hello?', NULL, NULL, NULL, 1, '2026-03-29 02:43:30', 0, 0, NULL, 0, 0, 0, '{\"admin_1\":{\"reactorId\":1,\"reactorRole\":\"admin\",\"emoji\":\"👍\"}}', NULL, 'teacher-1774712389017-326359.jpg', 'admin-1774705701340-338856.jpg', '2026-03-29 02:43:20'),
(144, 1, 'admin', 'CSS Admin Cha', 2, 'admin', 'Steven John A. Agustin', 'Hawak nga haha', NULL, NULL, NULL, 0, NULL, 0, 0, NULL, 0, 0, 0, NULL, NULL, 'admin-1774705701340-338856.jpg', NULL, '2026-03-29 02:51:13'),
(145, 1, 'admin', 'CSS Admin Cha', 7, 'teacher', 'Steven John A. Agustin', 'Hawak mo ang beeeeat', NULL, NULL, NULL, 1, '2026-03-29 02:52:19', 0, 0, NULL, 0, 0, 0, '{\"teacher_7\":{\"reactorId\":7,\"reactorRole\":\"teacher\",\"emoji\":\"😂\"}}', NULL, 'admin-1774705701340-338856.jpg', 'teacher-1774712389017-326359.jpg', '2026-03-29 02:52:07'),
(146, 5, 'guard', 'Gray Fullbusters', 1, 'admin', 'Administrator', 'Hello World Mam haha', NULL, NULL, NULL, 1, '2026-03-29 02:55:34', 0, 0, NULL, 0, 0, 0, '{\"admin_1\":{\"reactorId\":1,\"reactorRole\":\"admin\",\"emoji\":\"😂\"}}', NULL, 'guard-1774706082744-315190.jpg', 'admin-1774705701340-338856.jpg', '2026-03-29 02:55:25'),
(147, 1, 'super_admin', 'Super Administrator', 5, 'guard', 'Gray Fullbusters', 'Hello', NULL, NULL, NULL, 1, '2026-03-29 02:56:43', 0, 0, NULL, 0, 0, 0, '{\"guard_5\":{\"reactorId\":5,\"reactorRole\":\"guard\",\"emoji\":\"😂\"}}', NULL, 'superadmin-1774318366514-851420.jpg', NULL, '2026-03-29 02:56:33'),
(148, 5, 'guard', 'Gray Fullbusters', 1, 'super_admin', 'Super Administrator', 'Why mam?', NULL, NULL, NULL, 1, '2026-03-29 02:56:50', 0, 0, NULL, 0, 0, 0, '{\"super_admin_1\":{\"reactorId\":1,\"reactorRole\":\"super_admin\",\"emoji\":\"😂\"}}', NULL, 'guard-1774706082744-315190.jpg', 'superadmin-1774318366514-851420.jpg', '2026-03-29 02:56:48'),
(149, 1, 'super_admin', 'Super Administrator', 5, 'guard', 'Gray Fullbusters', 'Noted sir.', NULL, NULL, NULL, 1, '2026-03-29 02:57:28', 0, 1, '2026-04-01 22:03:26', 0, 0, 0, '{\"guard_5\":{\"reactorId\":5,\"reactorRole\":\"guard\",\"emoji\":\"😂\"}}', NULL, 'superadmin-1774318366514-851420.jpg', NULL, '2026-03-29 02:57:27'),
(150, 5, 'guard', 'Gray Fullbusters', 7, 'teacher', 'Steven John A. Agustin', 'Hello sir haha', NULL, NULL, NULL, 1, '2026-03-29 03:05:45', 0, 0, NULL, 0, 0, 0, '{\"teacher_7\":{\"reactorId\":7,\"reactorRole\":\"teacher\",\"emoji\":\"😂\"}}', NULL, 'guard-1774706082744-315190.jpg', 'teacher-1774712389017-326359.jpg', '2026-03-29 03:05:36'),
(151, 1, 'super_admin', 'Super Administrator', 7, 'teacher', 'Steven John A. Agustin', 'Hello sir', NULL, NULL, NULL, 1, '2026-03-29 03:06:38', 0, 0, NULL, 0, 0, 0, '{\"teacher_7\":{\"reactorId\":7,\"reactorRole\":\"teacher\",\"emoji\":\"😂\"}}', NULL, 'superadmin-1774318366514-851420.jpg', 'teacher-1774712389017-326359.jpg', '2026-03-29 03:06:32'),
(152, 7, 'teacher', 'Steven John A. Agustin', 1, 'super_admin', 'Super Administrator', 'Why mam?', NULL, NULL, NULL, 1, '2026-03-29 03:06:45', 0, 0, NULL, 0, 0, 0, NULL, NULL, 'teacher-1774712389017-326359.jpg', 'superadmin-1774318366514-851420.jpg', '2026-03-29 03:06:41'),
(153, 46, 'student', 'Steven John', 1, 'admin', 'CSS Admin Chariz', 'Sample', NULL, NULL, NULL, 1, '2026-03-29 03:10:20', 0, 0, NULL, 0, 0, 0, NULL, NULL, NULL, 'admin-1774705701340-338856.jpg', '2026-03-29 03:10:01'),
(154, 1, 'admin', 'CSS Admin Cha', 46, 'student', 'Steven John', 'It didn\'t received notification about chat', NULL, NULL, NULL, 1, '2026-03-29 03:10:38', 0, 0, NULL, 0, 0, 0, NULL, NULL, 'admin-1774705701340-338856.jpg', NULL, '2026-03-29 03:10:34'),
(155, 7, 'teacher', 'Steven John A. Agustin', 5, 'guard', 'Gray Fullbusters', 'ok', NULL, NULL, NULL, 1, '2026-03-29 03:11:17', 0, 1, '2026-04-01 22:00:26', 0, 0, 0, '{\"guard_5\":{\"reactorId\":5,\"reactorRole\":\"guard\",\"emoji\":\"😂\"}}', NULL, 'teacher-1774712389017-326359.jpg', NULL, '2026-03-29 03:11:16'),
(156, 1, 'admin', 'CSS Admin Cha', 5, 'guard', 'Gray Fullbusters', 'you received message?', NULL, NULL, NULL, 1, '2026-03-29 03:11:55', 0, 0, NULL, 0, 0, 0, '{\"guard_5\":{\"reactorId\":5,\"reactorRole\":\"guard\",\"emoji\":\"😂\"}}', NULL, 'admin-1774705701340-338856.jpg', NULL, '2026-03-29 03:11:48'),
(157, 5, 'guard', 'Gray Fullbusters', 1, 'admin', 'CSS Admin Cha', 'Yeah mam', NULL, NULL, NULL, 1, '2026-03-29 03:12:05', 0, 0, NULL, 0, 0, 0, '{\"admin_1\":{\"reactorId\":1,\"reactorRole\":\"admin\",\"emoji\":\"😂\"}}', NULL, 'guard-1774706082744-315190.jpg', 'admin-1774705701340-338856.jpg', '2026-03-29 03:12:04'),
(158, 5, 'guard', 'Gray Fullbusters', 1, 'admin', 'CSS Admin Cha', 'Why mam?', NULL, NULL, NULL, 1, '2026-03-29 03:12:37', 0, 0, NULL, 0, 0, 0, NULL, NULL, 'guard-1774706082744-315190.jpg', 'admin-1774705701340-338856.jpg', '2026-03-29 03:12:25'),
(159, 5, 'guard', 'Gray Fullbusters', 1, 'admin', 'CSS Admin Chariz', 'hello', NULL, NULL, NULL, 1, '2026-03-29 03:13:41', 0, 0, NULL, 0, 0, 0, NULL, NULL, 'guard-1774706082744-315190.jpg', 'admin-1774705701340-338856.jpg', '2026-03-29 03:13:25'),
(160, 1, 'super_admin', 'Super Administrator', 7, 'teacher', 'Steven John A. Agustin', 'nothing haha', NULL, NULL, NULL, 1, '2026-03-29 03:14:16', 0, 0, NULL, 0, 0, 0, '{\"teacher_7\":{\"reactorId\":7,\"reactorRole\":\"teacher\",\"emoji\":\"😂\"}}', NULL, 'superadmin-1774318366514-851420.jpg', 'teacher-1774712389017-326359.jpg', '2026-03-29 03:14:13'),
(161, 7, 'teacher', 'Steven John A. Agustin', 1, 'super_admin', 'Super Administrator', 'You received reaction?', NULL, NULL, NULL, 1, '2026-03-29 03:14:53', 0, 0, NULL, 0, 0, 0, '{\"super_admin_1\":{\"reactorId\":1,\"reactorRole\":\"super_admin\",\"emoji\":\"😂\"}}', NULL, 'teacher-1774712389017-326359.jpg', 'superadmin-1774318366514-851420.jpg', '2026-03-29 03:14:43'),
(162, 1, 'super_admin', 'Super Administrator', 7, 'teacher', 'Steven John A. Agustin', 'Nope', NULL, NULL, NULL, 1, '2026-03-29 03:15:00', 0, 0, NULL, 0, 0, 0, '{\"teacher_7\":{\"reactorId\":7,\"reactorRole\":\"teacher\",\"emoji\":\"😂\"}}', NULL, 'superadmin-1774318366514-851420.jpg', 'teacher-1774712389017-326359.jpg', '2026-03-29 03:14:57'),
(163, 1, 'super_admin', 'Super Administrator', 7, 'teacher', 'Steven John A. Agustin', 'can you try to react', NULL, NULL, NULL, 1, '2026-03-29 03:15:04', 0, 0, NULL, 0, 0, 0, '{\"teacher_7\":{\"reactorId\":7,\"reactorRole\":\"teacher\",\"emoji\":\"😂\"}}', NULL, 'superadmin-1774318366514-851420.jpg', 'teacher-1774712389017-326359.jpg', '2026-03-29 03:15:00'),
(164, 5, 'guard', 'Gray Fullbusters', 1, 'admin', 'CSS Admin Chariz', 'Mam', NULL, NULL, NULL, 1, '2026-03-29 03:19:22', 0, 0, NULL, 0, 0, 0, '{\"admin_1\":{\"reactorId\":1,\"reactorRole\":\"admin\",\"emoji\":\"😂\"}}', NULL, 'guard-1774706082744-315190.jpg', 'admin-1774705701340-338856.jpg', '2026-03-29 03:19:10'),
(165, 1, 'admin', 'CSS Admin Cha', 5, 'guard', 'Gray Fullbusters', 'Why?', NULL, NULL, NULL, 1, '2026-03-29 03:19:31', 0, 0, NULL, 0, 0, 0, '{\"guard_5\":{\"reactorId\":5,\"reactorRole\":\"guard\",\"emoji\":\"😂\"}}', NULL, 'admin-1774705701340-338856.jpg', NULL, '2026-03-29 03:19:31'),
(166, 1, 'admin', 'CSS Admin Cha', 1, 'super_admin', 'Super Administrator', 'Hello', NULL, NULL, NULL, 1, '2026-03-29 19:44:44', 0, 0, NULL, 0, 0, 0, NULL, NULL, 'admin-1774705701340-338856.jpg', 'superadmin-1774318366514-851420.jpg', '2026-03-29 19:44:40'),
(167, 35, 'student', 'Natsu Dragneel', 1, 'super_admin', 'Super Administrator', 'MAM pwd pa reset ng device binding', NULL, NULL, NULL, 1, '2026-03-31 16:15:50', 0, 0, NULL, 0, 0, 0, NULL, NULL, NULL, NULL, '2026-03-31 16:15:47'),
(168, 1, 'super_admin', 'Super Administrator', 35, 'student', 'Natsu Dragneel', 'ayoko', NULL, NULL, NULL, 1, '2026-03-31 16:16:07', 0, 0, NULL, 0, 0, 0, '{\"student_35\":{\"reactorId\":35,\"reactorRole\":\"student\",\"emoji\":\"😂\"}}', NULL, 'superadmin-1774318366514-851420.jpg', 'student-1774291218077-659300.jpg', '2026-03-31 16:16:03'),
(169, 35, 'student', 'Natsu Dragneel', 1, 'super_admin', 'Super Administrator', 'Mam plssss', '/api/v1/uploads/message_files/1774945030654-710737858-image.png', 'image.png', 'image/png', 1, '2026-03-31 16:17:30', 0, 0, NULL, 0, 0, 0, NULL, NULL, NULL, NULL, '2026-03-31 16:17:10'),
(170, 35, 'student', 'Natsu Dragneel', 1, 'super_admin', 'Super Administrator', '😅', NULL, NULL, NULL, 1, '2026-03-31 16:17:30', 0, 0, NULL, 0, 0, 0, NULL, NULL, NULL, NULL, '2026-03-31 16:17:26'),
(171, 35, 'student', 'Natsu Dragneel', 1, 'super_admin', 'Super Administrator', 'Thanks mam', NULL, NULL, NULL, 1, '2026-03-31 16:17:30', 0, 0, NULL, 0, 0, 0, NULL, NULL, NULL, NULL, '2026-03-31 16:17:29'),
(172, 1, 'super_admin', 'Super Administrator', 35, 'student', 'Natsu Dragneel', '🦾', NULL, NULL, NULL, 1, '2026-03-31 16:17:59', 0, 0, NULL, 0, 0, 0, '{\"student_35\":{\"reactorId\":35,\"reactorRole\":\"student\",\"emoji\":\"😂\"}}', NULL, 'superadmin-1774318366514-851420.jpg', 'student-1774291218077-659300.jpg', '2026-03-31 16:17:49'),
(173, 46, 'student', 'Steven John', 1, 'super_admin', 'Super Administrator', '↪️ It didn\'t received notification about chat', NULL, NULL, NULL, 1, '2026-03-31 16:40:08', 0, 0, NULL, 0, 0, 0, NULL, NULL, 'student-1774770851525-40101.jpg', 'superadmin-1774318366514-851420.jpg', '2026-03-31 16:20:48'),
(174, 7, 'teacher', 'Steven John A. Agustin', 1, 'super_admin', 'Super Administrator', 'i request to remove steben from earth', NULL, NULL, NULL, 1, '2026-03-31 16:37:00', 0, 0, NULL, 0, 0, 0, '{\"super_admin_1\":{\"reactorId\":1,\"reactorRole\":\"super_admin\",\"emoji\":\"😂\"}}', NULL, 'teacher-1774726925820-608067.jpg', 'superadmin-1774318366514-851420.jpg', '2026-03-31 16:27:11'),
(175, 35, 'student', 'Natsu', 7, 'teacher', 'Steven John A. Agustin', 'Chari bagtit', NULL, NULL, NULL, 1, '2026-03-31 16:40:51', 0, 0, NULL, 0, 0, 0, NULL, NULL, 'student-1774291218077-659300.jpg', 'teacher-1774726925820-608067.jpg', '2026-03-31 16:37:48'),
(176, 46, 'student', 'Steven John Agustin (CoAST)', 1, 'super_admin', 'Super Administrator', NULL, '/api/v1/uploads/message_files/1774946374234-147328196-IMG_20260324_152541_815.jpg', 'IMG_20260324_152541_815.jpg', 'image/jpeg', 1, '2026-03-31 16:40:08', 0, 0, NULL, 0, 0, 0, NULL, NULL, NULL, NULL, '2026-03-31 16:39:34'),
(177, 46, 'student', 'Steven John Agustin (CoAST)', 1, 'super_admin', 'Super Administrator', NULL, '/api/v1/uploads/message_files/1774946405773-442989484-IMG_20260324_152540_866.jpg', 'IMG_20260324_152540_866.jpg', 'image/jpeg', 1, '2026-03-31 16:40:08', 0, 0, NULL, 0, 0, 0, NULL, NULL, NULL, NULL, '2026-03-31 16:40:06'),
(178, 7, 'teacher', 'Steven John A. Agustin', 35, 'student', 'Natsu', 'bagsak ka hahahaha', NULL, NULL, NULL, 1, '2026-03-31 16:41:40', 0, 0, NULL, 0, 0, 0, '{\"student_35\":{\"reactorId\":35,\"reactorRole\":\"student\",\"emoji\":\"😂\"}}', NULL, 'teacher-1774726925820-608067.jpg', 'student-1774291218077-659300.jpg', '2026-03-31 16:41:04'),
(179, 35, 'student', 'Natsu', 7, 'teacher', 'Steven John A. Agustin', 'Bagtit ka sir', NULL, NULL, NULL, 1, '2026-03-31 17:13:15', 0, 0, NULL, 0, 0, 0, NULL, NULL, 'student-1774291218077-659300.jpg', 'teacher-1774726925820-608067.jpg', '2026-03-31 16:54:13'),
(180, 35, 'student', 'Natsu', 7, 'teacher', 'Steven John A. Agustin', 'Bagtit ka chari', NULL, NULL, NULL, 1, '2026-03-31 17:13:15', 0, 0, NULL, 0, 0, 0, NULL, NULL, 'student-1774291218077-659300.jpg', 'teacher-1774726925820-608067.jpg', '2026-03-31 17:00:24'),
(181, 35, 'student', 'Natsu', 7, 'teacher', 'Steven John A. Agustin', 'Pa check nga sir DFD', '/api/v1/uploads/message_files/msg_1774947642196_4f28c515-b1a2-43d5-ab09-9abefe5c0b4a.jpg', '4f28c515-b1a2-43d5-ab09-9abefe5c0b4a.jpg', 'image/jpeg', 1, '2026-03-31 17:13:15', 0, 0, NULL, 0, 0, 0, NULL, NULL, 'student-1774291218077-659300.jpg', 'teacher-1774726925820-608067.jpg', '2026-03-31 17:00:42'),
(182, 35, 'student', 'Natsu', 1, 'super_admin', 'Super Administrator', 'Bagtit ka', NULL, NULL, NULL, 1, '2026-03-31 21:00:48', 0, 0, NULL, 0, 0, 0, NULL, NULL, 'student-1774291218077-659300.jpg', 'superadmin-1774318366514-851420.jpg', '2026-03-31 20:44:04'),
(183, 46, 'student', 'Steven John Agustin (CoAST)', 2, 'admin', 'Steven John A. Agustin', NULL, NULL, NULL, NULL, 0, NULL, 1, 0, NULL, 0, 0, 0, NULL, NULL, NULL, NULL, '2026-03-31 21:36:34');
INSERT INTO `messages` (`id`, `sender_id`, `sender_role`, `sender_name`, `receiver_id`, `receiver_role`, `receiver_name`, `content`, `file_url`, `file_name`, `file_type`, `is_read`, `read_at`, `is_unsent`, `is_edited`, `edited_at`, `deleted_for_sender`, `deleted_for_receiver`, `is_pinned`, `reactions`, `forwarded_from_id`, `sender_profile_picture`, `receiver_profile_picture`, `created_at`) VALUES
(184, 7, 'teacher', 'Steven John A. Agustin', 1, 'super_admin', 'Super Administrator', NULL, '/api/v1/uploads/message_files/msg_1774965571911_image.png', 'image.png', 'image/png', 1, '2026-04-01 14:34:32', 0, 0, NULL, 0, 0, 0, NULL, NULL, 'teacher-1774726925820-608067.jpg', 'superadmin-1774318366514-851420.jpg', '2026-03-31 21:59:32'),
(185, 7, 'teacher', 'Steven John A. Agustin', 1, 'super_admin', 'Super Administrator', NULL, NULL, NULL, NULL, 1, '2026-04-02 15:22:41', 1, 0, NULL, 0, 0, 0, NULL, NULL, 'teacher-1774726925820-608067.jpg', 'superadmin-1774318366514-851420.jpg', '2026-04-02 14:50:35'),
(186, 55, 'student', 'Andrea', 1, 'admin', 'CSS Admin Cha', 'Good day, I would like to request a device reset as I cannot log in on another device because my phone is broken. Thank you.', NULL, NULL, NULL, 1, '2026-04-02 15:17:14', 0, 0, NULL, 0, 0, 0, NULL, NULL, NULL, 'admin-1774705701340-338856.jpg', '2026-04-02 14:56:43'),
(187, 5, 'guard', 'Gray Fullbusters', 1, 'admin', 'CSS Admin Chariz', 'Good day, requesting password reset. Thank you.', NULL, NULL, NULL, 1, '2026-04-02 15:10:59', 0, 0, NULL, 0, 0, 0, '{\"admin_1\":{\"reactorId\":1,\"reactorRole\":\"admin\",\"emoji\":\"❤️\"}}', NULL, 'guard-1774706082744-315190.jpg', 'admin-1774705701340-338856.jpg', '2026-04-02 15:00:37'),
(188, 5, 'guard', 'Gray Fullbusters', 1, 'super_admin', 'Super Administrator', 'Good day, requesting password reset. Thank you.', NULL, NULL, NULL, 1, '2026-04-02 15:11:26', 0, 0, NULL, 0, 0, 0, '{\"super_admin_1\":{\"reactorId\":1,\"reactorRole\":\"super_admin\",\"emoji\":\"👍\"}}', NULL, 'guard-1774706082744-315190.jpg', 'superadmin-1774318366514-851420.jpg', '2026-04-02 15:00:46'),
(189, 1, 'super_admin', 'Super Administrator', 1, 'admin', 'CSS Admin Cha', 'Good day, please assist the student of Nursing about the device reset. Thank you.', NULL, NULL, NULL, 1, '2026-04-02 15:16:52', 0, 0, NULL, 0, 0, 0, NULL, NULL, 'superadmin-1774318366514-851420.jpg', 'admin-1774705701340-338856.jpg', '2026-04-02 15:03:21'),
(190, 1, 'super_admin', 'Super Administrator', 35, 'student', 'Natsu Dragneel', 'Please proceed to Office 123 for assistance. Thank you.', NULL, NULL, NULL, 1, '2026-04-05 05:07:16', 0, 0, NULL, 0, 0, 0, NULL, NULL, 'superadmin-1774318366514-851420.jpg', 'student-1774291218077-659300.jpg', '2026-04-02 15:04:22'),
(191, 1, 'admin', 'CSS Admin Cha', 7, 'teacher', 'Steven John A. Agustin', 'for assistance please proceed to Office 123', NULL, NULL, NULL, 1, '2026-04-04 22:01:45', 0, 0, NULL, 0, 0, 0, NULL, NULL, 'admin-1774705701340-338856.jpg', 'teacher-1774726925820-608067.jpg', '2026-04-02 15:07:42'),
(192, 1, 'admin', 'CSS Admin Cha', 5, 'guard', 'Gray Fullbusters', 'noted sir', NULL, NULL, NULL, 1, '2026-04-05 05:08:11', 0, 0, NULL, 0, 0, 0, NULL, NULL, 'admin-1774705701340-338856.jpg', NULL, '2026-04-02 15:11:53'),
(193, 1, 'super_admin', 'Super Administrator', 5, 'guard', 'Gray Fullbusters', 'Please message again if you encounter any problem. Thank you.', NULL, NULL, NULL, 1, '2026-04-05 05:08:03', 0, 1, '2026-04-04 23:08:49', 0, 0, 0, NULL, NULL, 'superadmin-1774318366514-851420.jpg', NULL, '2026-04-02 15:13:56'),
(194, 1, 'admin', 'CSS Admin Cha', 5, 'guard', 'Gray Fullbusters', '👍', NULL, NULL, NULL, 1, '2026-04-05 05:08:11', 0, 0, NULL, 0, 0, 0, NULL, NULL, 'admin-1774705701340-338856.jpg', NULL, '2026-04-02 15:14:18'),
(195, 1, 'admin', 'CSS Admin Cha', 55, 'student', 'Andrea', 'ok noted', NULL, NULL, NULL, 0, NULL, 0, 0, NULL, 0, 0, 0, NULL, NULL, 'admin-1774705701340-338856.jpg', NULL, '2026-04-02 15:17:21'),
(196, 55, 'student', 'Andrea', 7, 'teacher', 'Steven John A. Agustin', 'ok sir', NULL, NULL, NULL, 1, '2026-04-04 23:09:52', 0, 0, NULL, 0, 0, 0, NULL, NULL, NULL, 'teacher-1774726925820-608067.jpg', '2026-04-02 15:22:20'),
(197, 1, 'super_admin', 'Super Administrator', 7, 'teacher', 'Steven John A. Agustin', 'Check your location and please message again if you encounter any problem. Thank you.', NULL, NULL, NULL, 1, '2026-04-04 23:00:52', 0, 0, NULL, 0, 0, 0, NULL, NULL, 'superadmin-1774318366514-851420.jpg', 'teacher-1774726925820-608067.jpg', '2026-04-02 15:23:22'),
(198, 1, 'admin', 'CSS Admin Cha', 7, 'teacher', 'Steven John A. Agustin', 'message again if you encounter any problem. Thank you.', NULL, NULL, NULL, 1, '2026-04-04 22:01:45', 0, 0, NULL, 0, 0, 0, NULL, NULL, 'admin-1774705701340-338856.jpg', 'teacher-1774726925820-608067.jpg', '2026-04-02 15:25:14'),
(199, 7, 'teacher', 'Steven John A. Agustin', 35, 'student', 'Natsu', '👍', NULL, NULL, NULL, 1, '2026-04-05 05:07:26', 0, 0, NULL, 0, 0, 0, NULL, NULL, 'teacher-1774726925820-608067.jpg', 'student-1774291218077-659300.jpg', '2026-04-02 16:45:47'),
(200, 1, 'super_admin', 'Super Administrator', 7, 'teacher', 'Steven John A. Agustin', NULL, NULL, NULL, NULL, 1, '2026-04-04 23:00:52', 1, 0, NULL, 0, 0, 0, NULL, NULL, 'superadmin-1774318366514-851420.jpg', 'teacher-1774726925820-608067.jpg', '2026-04-04 22:52:37'),
(201, 1, 'super_admin', 'Super Administrator', 7, 'teacher', 'Steven John A. Agustin', NULL, NULL, NULL, NULL, 1, '2026-04-04 23:00:52', 1, 0, NULL, 0, 0, 0, NULL, NULL, 'superadmin-1774318366514-851420.jpg', 'teacher-1774726925820-608067.jpg', '2026-04-04 22:53:02'),
(202, 1, 'super_admin', 'Super Administrator', 7, 'teacher', 'Steven John A. Agustin', NULL, NULL, NULL, NULL, 1, '2026-04-04 23:00:52', 1, 0, NULL, 0, 0, 0, NULL, NULL, 'superadmin-1774318366514-851420.jpg', 'teacher-1774726925820-608067.jpg', '2026-04-04 22:53:11'),
(203, 1, 'super_admin', 'Super Administrator', 5, 'guard', 'Gray Fullbusters', NULL, NULL, NULL, NULL, 1, '2026-04-05 05:08:03', 1, 0, NULL, 0, 0, 0, NULL, NULL, 'superadmin-1774318366514-851420.jpg', NULL, '2026-04-04 22:59:29'),
(204, 1, 'super_admin', 'Super Administrator', 5, 'guard', 'Gray Fullbusters', 'Goodss', NULL, NULL, NULL, 1, '2026-04-05 05:08:03', 0, 0, NULL, 1, 0, 0, NULL, NULL, 'superadmin-1774318366514-851420.jpg', NULL, '2026-04-04 22:59:31'),
(205, 1, 'super_admin', 'Super Administrator', 5, 'guard', 'Gray Fullbusters', '😂', NULL, NULL, NULL, 1, '2026-04-05 05:08:03', 0, 0, NULL, 1, 0, 0, NULL, NULL, 'superadmin-1774318366514-851420.jpg', NULL, '2026-04-04 22:59:34'),
(206, 1, 'super_admin', 'Super Administrator', 35, 'student', 'Natsu Dragneel', NULL, NULL, NULL, NULL, 1, '2026-04-05 05:07:16', 1, 0, NULL, 0, 0, 0, NULL, NULL, 'superadmin-1774318366514-851420.jpg', 'student-1774291218077-659300.jpg', '2026-04-04 22:59:44'),
(207, 1, 'super_admin', 'Super Administrator', 35, 'student', 'Natsu Dragneel', NULL, NULL, NULL, NULL, 1, '2026-04-05 05:07:16', 1, 0, NULL, 0, 0, 0, NULL, NULL, 'superadmin-1774318366514-851420.jpg', 'student-1774291218077-659300.jpg', '2026-04-04 22:59:49'),
(208, 1, 'super_admin', 'Super Administrator', 1, 'admin', 'CSS Admin Cha', NULL, NULL, NULL, NULL, 0, NULL, 1, 0, NULL, 0, 0, 0, NULL, NULL, 'superadmin-1774318366514-851420.jpg', 'admin-1774705701340-338856.jpg', '2026-04-04 23:00:03'),
(209, 1, 'super_admin', 'Super Administrator', 46, 'student', 'Steven John Agustin (CoAST)', NULL, NULL, NULL, NULL, 1, '2026-04-09 10:04:54', 1, 0, NULL, 0, 0, 0, NULL, NULL, 'superadmin-1774318366514-851420.jpg', 'student-1774770851525-40101.jpg', '2026-04-04 23:00:11'),
(210, 1, 'super_admin', 'Super Administrator', 5, 'guard', 'Gray Fullbusters', NULL, NULL, NULL, NULL, 1, '2026-04-05 05:08:03', 1, 0, NULL, 0, 0, 0, NULL, NULL, 'superadmin-1774318366514-851420.jpg', NULL, '2026-04-04 23:08:53'),
(211, 1, 'super_admin', 'Super Administrator', 5, 'guard', 'Gray Fullbusters', NULL, NULL, NULL, NULL, 1, '2026-04-05 05:08:03', 1, 0, NULL, 0, 0, 0, NULL, NULL, 'superadmin-1774318366514-851420.jpg', NULL, '2026-04-04 23:08:58'),
(212, 1, 'super_admin', 'Super Administrator', 5, 'guard', 'Gray Fullbusters', NULL, NULL, NULL, NULL, 1, '2026-04-05 05:08:03', 1, 0, NULL, 0, 0, 0, NULL, NULL, 'superadmin-1774318366514-851420.jpg', NULL, '2026-04-04 23:09:11'),
(213, 42, 'student', 'Zaiejan Agustin', 1, 'admin', 'CSS Admin Cha', 'hello', NULL, NULL, NULL, 1, '2026-04-07 02:03:23', 0, 0, NULL, 0, 0, 0, NULL, NULL, NULL, NULL, '2026-04-06 08:12:49'),
(214, 23, 'student', 'Lucy', 7, 'teacher', 'Steven John A. Agustin', NULL, NULL, NULL, NULL, 1, '2026-04-06 08:14:56', 1, 0, NULL, 0, 0, 0, NULL, NULL, 'student-1774159341046-561222.png', 'teacher-1774726925820-608067.jpg', '2026-04-06 08:14:47'),
(215, 7, 'teacher', 'Steven John A. Agustin', 1, 'super_admin', 'Super Administrator', 'Yes mam! Thank you for your time mam 😊', NULL, NULL, NULL, 1, '2026-04-06 14:40:02', 0, 0, NULL, 0, 0, 0, NULL, NULL, 'teacher-1774726925820-608067.jpg', 'superadmin-1774318366514-851420.jpg', '2026-04-06 09:08:29'),
(216, 7, 'teacher', 'Steven John A. Agustin', 1, 'super_admin', 'Super Administrator', 'HI PO', NULL, NULL, NULL, 1, '2026-04-06 14:40:02', 0, 0, NULL, 0, 0, 0, '{\"super_admin_1\":{\"reactorId\":1,\"reactorRole\":\"super_admin\",\"emoji\":\"❤️\"}}', NULL, 'teacher-1774726925820-608067.jpg', 'superadmin-1774318366514-851420.jpg', '2026-04-06 14:27:11'),
(217, 23, 'student', 'Lucy', 7, 'teacher', 'Steven John A. Agustin', 'dggd', NULL, NULL, NULL, 1, '2026-04-06 14:45:53', 0, 0, NULL, 0, 0, 0, NULL, NULL, 'student-1774159341046-561222.png', 'teacher-1774726925820-608067.jpg', '2026-04-06 14:30:03'),
(218, 7, 'teacher', 'Steven John A. Agustin', 1, 'super_admin', 'Super Administrator', NULL, NULL, NULL, NULL, 1, '2026-04-06 14:46:51', 1, 0, NULL, 0, 0, 0, '{\"super_admin_1\":{\"reactorId\":1,\"reactorRole\":\"super_admin\",\"emoji\":\"❤️\"}}', NULL, 'teacher-1774726925820-608067.jpg', 'superadmin-1774318366514-851420.jpg', '2026-04-06 14:46:48'),
(219, 23, 'student', 'Lucy', 7, 'teacher', 'Steven John A. Agustin', 'hello po', NULL, NULL, NULL, 1, '2026-04-06 15:05:49', 0, 0, NULL, 0, 0, 0, NULL, NULL, 'student-1774159341046-561222.png', 'teacher-1774726925820-608067.jpg', '2026-04-06 15:05:21'),
(220, 23, 'student', 'Lucy', 7, 'teacher', 'Steven John A. Agustin', NULL, NULL, NULL, NULL, 1, '2026-04-06 15:05:49', 1, 0, NULL, 0, 0, 0, NULL, NULL, 'student-1774159341046-561222.png', 'teacher-1774726925820-608067.jpg', '2026-04-06 15:05:34'),
(221, 23, 'student', 'Lucy', 7, 'teacher', 'Steven John A. Agustin', 'yuj', NULL, NULL, NULL, 1, '2026-04-06 15:06:17', 0, 0, NULL, 0, 0, 0, NULL, NULL, 'student-1774159341046-561222.png', 'teacher-1774726925820-608067.jpg', '2026-04-06 15:06:17'),
(222, 7, 'teacher', 'Steven John A. Agustin', 23, 'student', 'Lucy', 'YY', NULL, NULL, NULL, 1, '2026-04-06 15:09:34', 0, 0, NULL, 0, 0, 0, NULL, NULL, 'teacher-1774726925820-608067.jpg', 'student-1774159341046-561222.png', '2026-04-06 15:09:25'),
(223, 7, 'teacher', 'Steven John A. Agustin', 23, 'student', 'Lucy', 'JJJ', NULL, NULL, NULL, 1, '2026-04-06 15:14:58', 0, 0, NULL, 0, 0, 0, '{\"student_23\":{\"reactorId\":23,\"reactorRole\":\"student\",\"emoji\":\"😂\"}}', NULL, 'teacher-1774726925820-608067.jpg', 'student-1774159341046-561222.png', '2026-04-06 15:14:54'),
(224, 23, 'student', 'Lucy', 7, 'teacher', 'Steven John A. Agustin', NULL, NULL, NULL, NULL, 1, '2026-04-06 15:16:09', 1, 0, NULL, 0, 0, 0, NULL, NULL, 'student-1774159341046-561222.png', 'teacher-1774726925820-608067.jpg', '2026-04-06 15:16:08'),
(225, 23, 'student', 'Lucy', 58, 'student', 'Onyx Lloyd Alunday', 'Hello po mam', NULL, NULL, NULL, 1, '2026-04-06 15:33:13', 0, 0, NULL, 0, 0, 0, NULL, NULL, 'student-1774159341046-561222.png', NULL, '2026-04-06 15:31:47'),
(226, 23, 'student', 'Lucy', 58, 'student', 'Onyx Lloyd Alunday', NULL, '/api/v1/uploads/message_files/msg_1775460725116_IMG_20260330_000109_706.jpg', 'IMG_20260330_000109_706.jpg', 'image/jpeg', 1, '2026-04-06 15:33:13', 0, 0, NULL, 0, 0, 0, NULL, NULL, 'student-1774159341046-561222.png', NULL, '2026-04-06 15:32:05'),
(227, 23, 'student', 'Lucy', 58, 'student', 'Onyx Lloyd Alunday', 'hello po mam', NULL, NULL, NULL, 1, '2026-04-06 15:33:13', 0, 0, NULL, 0, 0, 0, '{\"student_58\":{\"reactorId\":58,\"reactorRole\":\"student\",\"emoji\":\"😡\"}}', NULL, 'student-1774159341046-561222.png', NULL, '2026-04-06 15:33:04'),
(228, 4, 'admin', 'Soleil Riego', 1, 'super_admin', 'Super Administrator', 'Hi', NULL, NULL, NULL, 1, '2026-04-06 16:18:23', 0, 0, NULL, 0, 0, 0, NULL, NULL, NULL, 'superadmin-1774318366514-851420.jpg', '2026-04-06 16:12:59');

-- --------------------------------------------------------

--
-- Table structure for table `message_notifications`
--

CREATE TABLE `message_notifications` (
  `id` int(11) NOT NULL,
  `receiver_id` int(11) NOT NULL,
  `receiver_role` varchar(20) NOT NULL,
  `sender_id` int(11) NOT NULL,
  `sender_role` varchar(20) NOT NULL,
  `sender_name` varchar(255) NOT NULL,
  `type` enum('message','file','reaction') NOT NULL DEFAULT 'message',
  `emoji` varchar(10) DEFAULT NULL,
  `message_id` int(11) DEFAULT NULL,
  `preview` varchar(255) DEFAULT NULL,
  `is_read` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `message_notifications`
--

INSERT INTO `message_notifications` (`id`, `receiver_id`, `receiver_role`, `sender_id`, `sender_role`, `sender_name`, `type`, `emoji`, `message_id`, `preview`, `is_read`, `created_at`) VALUES
(67, 1, 'super_admin', 7, 'teacher', 'Steven John A. Agustin', 'message', NULL, 185, 'Good day, requesting to fix the location issue on my dashboard. Thank you.', 1, '2026-04-02 14:50:35'),
(68, 1, 'admin', 55, 'student', 'Andrea Mulach', 'message', NULL, 186, 'Good day, I would like to request a device reset as I cannot log in on another device because my pho', 0, '2026-04-02 14:56:43'),
(69, 1, 'admin', 5, 'guard', 'Gray Fullbusters', 'message', NULL, 187, 'Good day, requesting password reset. Thank you.', 1, '2026-04-02 15:00:37'),
(70, 1, 'super_admin', 5, 'guard', 'Gray Fullbusters', 'message', NULL, 188, 'Good day, requesting password reset. Thank you.', 1, '2026-04-02 15:00:46'),
(71, 1, 'admin', 1, 'super_admin', 'Super Administrator', 'message', NULL, 189, 'Good day, please assist the student of Nursing about the device reset. Thank you.', 0, '2026-04-02 15:03:21'),
(72, 35, 'student', 1, 'super_admin', 'Super Administrator', 'message', NULL, 190, 'Please proceed to Office 123 for assistance. Thank you.', 0, '2026-04-02 15:04:22'),
(73, 7, 'teacher', 1, 'admin', 'CSS Admin Cha', 'message', NULL, 191, 'for assistance please proceed to Office 123', 0, '2026-04-02 15:07:42'),
(74, 5, 'guard', 1, 'admin', 'CSS Admin Cha', 'reaction', '❤️', 187, NULL, 1, '2026-04-02 15:11:04'),
(75, 5, 'guard', 1, 'super_admin', 'Super Administrator', 'reaction', '👍', 188, NULL, 0, '2026-04-02 15:11:31'),
(76, 5, 'guard', 1, 'admin', 'CSS Admin Cha', 'message', NULL, 192, 'noted sir', 0, '2026-04-02 15:11:53'),
(77, 5, 'guard', 1, 'super_admin', 'Super Administrator', 'message', NULL, 193, 'Please message again if you encounter any problem. Thank you.', 0, '2026-04-02 15:13:56'),
(78, 5, 'guard', 1, 'admin', 'CSS Admin Cha', 'message', NULL, 194, '👍', 0, '2026-04-02 15:14:18'),
(79, 55, 'student', 1, 'admin', 'CSS Admin Cha', 'message', NULL, 195, 'ok noted', 0, '2026-04-02 15:17:21'),
(80, 7, 'teacher', 55, 'student', 'Andrea Mulach', 'message', NULL, 196, 'ok sir', 0, '2026-04-02 15:22:20'),
(81, 7, 'teacher', 1, 'super_admin', 'Super Administrator', 'message', NULL, 197, 'Check your location and please message again if you encounter any problem. Thank you.', 1, '2026-04-02 15:23:22'),
(82, 7, 'teacher', 1, 'admin', 'CSS Admin Cha', 'message', NULL, 198, 'message again if you encounter any problem. Thank you.', 1, '2026-04-02 15:25:14'),
(83, 35, 'student', 7, 'teacher', 'Steven John A. Agustin', 'message', NULL, 199, '👍', 0, '2026-04-02 16:45:47'),
(85, 7, 'teacher', 1, 'super_admin', 'Super Administrator', 'file', NULL, 201, '1775314369913328863728772297847.jpg', 1, '2026-04-04 22:53:02'),
(86, 7, 'teacher', 1, 'super_admin', 'Super Administrator', 'message', NULL, 202, 'Goods camera', 1, '2026-04-04 22:53:11'),
(87, 5, 'guard', 1, 'super_admin', 'Super Administrator', 'message', NULL, 203, 'Hiii', 0, '2026-04-04 22:59:29'),
(88, 5, 'guard', 1, 'super_admin', 'Super Administrator', 'message', NULL, 204, 'Goodss', 0, '2026-04-04 22:59:31'),
(89, 5, 'guard', 1, 'super_admin', 'Super Administrator', 'message', NULL, 205, '😂', 0, '2026-04-04 22:59:34'),
(90, 35, 'student', 1, 'super_admin', 'Super Administrator', 'message', NULL, 206, 'Hsishsuxizjs', 1, '2026-04-04 22:59:44'),
(91, 35, 'student', 1, 'super_admin', 'Super Administrator', 'message', NULL, 207, '🤣', 0, '2026-04-04 22:59:49'),
(92, 1, 'admin', 1, 'super_admin', 'Super Administrator', 'message', NULL, 208, '😀', 0, '2026-04-04 23:00:03'),
(93, 46, 'student', 1, 'super_admin', 'Super Administrator', 'message', NULL, 209, 'Shessh', 1, '2026-04-04 23:00:11'),
(94, 5, 'guard', 1, 'super_admin', 'Super Administrator', 'message', NULL, 210, 'Please message again if you encounter any problem. Thank you.', 1, '2026-04-04 23:08:53'),
(95, 5, 'guard', 1, 'super_admin', 'Super Administrator', 'message', NULL, 211, 'Please message again if you encounter any problem. Thank you.', 1, '2026-04-04 23:08:58'),
(96, 5, 'guard', 1, 'super_admin', 'Super Administrator', 'message', NULL, 212, 'Please message again if you encounter any problem. Thank you.', 1, '2026-04-04 23:09:11'),
(97, 1, 'super_admin', 7, 'teacher', 'Steven John A. Agustin', 'reaction', '😂', 151, NULL, 0, '2026-04-04 23:09:37'),
(98, 7, 'teacher', 23, 'student', 'Lucy Heartfilla', 'message', NULL, 214, 'hhhh', 0, '2026-04-06 08:14:47'),
(99, 1, 'super_admin', 7, 'teacher', 'Steven John A. Agustin', 'message', NULL, 215, 'Yes mam! Thank you for your time mam 😊', 0, '2026-04-06 09:08:29'),
(100, 1, 'super_admin', 7, 'teacher', 'Steven John A. Agustin', 'message', NULL, 216, 'HI PO', 0, '2026-04-06 14:27:11'),
(101, 7, 'teacher', 23, 'student', 'Lucy Heartfilla', 'message', NULL, 217, 'dggd', 0, '2026-04-06 14:30:03'),
(102, 23, 'student', 7, 'teacher', 'Steven John A. Agustin', 'reaction', '❤️', 99, NULL, 0, '2026-04-06 14:45:57'),
(103, 1, 'super_admin', 7, 'teacher', 'Steven John A. Agustin', 'message', NULL, 218, 'I LOVE YOU RAIZA', 0, '2026-04-06 14:46:48'),
(104, 7, 'teacher', 1, 'super_admin', 'Super Administrator', 'reaction', '❤️', 218, NULL, 0, '2026-04-06 14:47:08'),
(105, 7, 'teacher', 1, 'super_admin', 'Super Administrator', 'reaction', '❤️', 216, NULL, 0, '2026-04-06 14:58:20'),
(106, 7, 'teacher', 23, 'student', 'Lucy Heartfilla', 'message', NULL, 219, 'hello po', 0, '2026-04-06 15:05:21'),
(107, 7, 'teacher', 23, 'student', 'Lucy Heartfilla', 'message', NULL, 220, 'cvv', 0, '2026-04-06 15:05:34'),
(108, 7, 'teacher', 23, 'student', 'Lucy Heartfilla', 'message', NULL, 221, 'yuj', 0, '2026-04-06 15:06:17'),
(109, 23, 'student', 7, 'teacher', 'Steven John A. Agustin', 'message', NULL, 222, 'YY', 0, '2026-04-06 15:09:25'),
(110, 23, 'student', 7, 'teacher', 'Steven John A. Agustin', 'message', NULL, 223, 'JJJ', 0, '2026-04-06 15:14:54'),
(111, 7, 'teacher', 23, 'student', 'Lucy Heartfilla', 'reaction', '😂', 223, NULL, 0, '2026-04-06 15:15:19'),
(112, 7, 'teacher', 23, 'student', 'Lucy Heartfilla', 'message', NULL, 224, 'gffg', 0, '2026-04-06 15:16:08'),
(113, 58, 'student', 23, 'student', 'Lucy Heartfilla', 'message', NULL, 225, 'Hello po mam', 0, '2026-04-06 15:31:47'),
(114, 58, 'student', 23, 'student', 'Lucy Heartfilla', 'file', NULL, 226, 'IMG_20260330_000109_706.jpg', 0, '2026-04-06 15:32:05'),
(115, 58, 'student', 23, 'student', 'Lucy Heartfilla', 'message', NULL, 227, 'hello po mam', 0, '2026-04-06 15:33:04'),
(116, 23, 'student', 58, 'student', 'Onyx Lloyd Alunday', 'reaction', '😡', 227, NULL, 0, '2026-04-06 15:33:29'),
(117, 1, 'super_admin', 4, 'admin', 'Soleil Riego', 'message', NULL, 228, 'Hi', 1, '2026-04-06 16:12:59');

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
(2, 'new_student', 'New Student Registered', 'Andrea A. Lachica (897) registered — BS in Information Technology, 3rd Year', '{\"student_id_number\":\"897\",\"name\":\"Andrea Lachica\",\"program\":\"BS in Information Technology\",\"yearLevel\":\"3rd Year\",\"email\":\"andrea.lachica@panpacificu.edu.ph\"}', 1, 1, '2026-03-23 12:28:44'),
(3, 'new_student', 'New Student Registered', 'Gabriel Castillo. Castillo (ECoAST) (789789) registered — BS in Information Technology, 3rd Year', '{\"student_id_number\":\"789789\",\"name\":\"Gabriel Castillo (ECoAST)\",\"program\":\"BS in Information Technology\",\"yearLevel\":\"3rd Year\",\"email\":\"gabriel.castillo.ecoast@panpacificu.edu.ph\"}', 1, 1, '2026-03-24 11:19:41'),
(4, 'new_student', 'New Student Registered', 'Ace-cin Kyoshi (848484) registered — BS in Information Technology, 3rd Year', '{\"student_id_number\":\"848484\",\"name\":\"Ace-cin Kyoshi\",\"program\":\"BS in Information Technology\",\"yearLevel\":\"3rd Year\",\"email\":\"kyoshiacecin@gmail.com\"}', 1, 1, '2026-03-24 12:48:42'),
(5, 'new_student', 'New Student Registered', 'Maxene Franco (12334575) registered — BS in Information Technology, 3rd Year', '{\"student_id_number\":\"12334575\",\"name\":\"Maxene Franco\",\"program\":\"BS in Information Technology\",\"yearLevel\":\"3rd Year\",\"email\":\"maxenefranco@gmail.com\"}', 1, 1, '2026-03-24 23:00:11'),
(39, 'new_student', 'New Student Registered', 'Dwynna A. Chu (234) registered — Bs Nursing, 4th Year', '{\"student_id_number\":\"234\",\"name\":\"Dwynna Chu\",\"program\":\"Bs Nursing\",\"yearLevel\":\"4th Year\",\"email\":\"dwynna@gmail.com.ph\"}', 0, 1, '2026-03-31 23:44:05'),
(40, 'new_student', 'New Student Registered', 'Andrea L. Mulach (8700) registered — Bs Psychology, 3rd Year', '{\"student_id_number\":\"8700\",\"name\":\"Andrea Mulach\",\"program\":\"Bs Psychology\",\"yearLevel\":\"3rd Year\",\"email\":\"andreamulach@gmail.com\"}', 1, 1, '2026-04-02 14:47:38'),
(43, 'new_student', 'New Student Registered', 'kurdapya  (67867867) registered — Bachelor of Science in Computer Science, 3rd Year', '{\"student_id_number\":\"67867867\",\"name\":\"kurdapya \",\"program\":\"Bachelor of Science in Computer Science\",\"yearLevel\":\"3rd Year\",\"email\":\"kurdapyapipit@gmail.com\"}', 1, 1, '2026-04-05 05:38:09'),
(48, 'new_student', 'New Student Registered', 'Onyx Lloyd E. Alunday (1231008) registered — Bachelor of Science in Information Technology, 3rd Year', '{\"student_id_number\":\"1231008\",\"name\":\"Onyx Lloyd Alunday\",\"program\":\"Bachelor of Science in Information Technology\",\"yearLevel\":\"3rd Year\",\"email\":\"onyxlloyd.alunday.ecoast@panpacificu.edu.ph\"}', 0, 0, '2026-04-06 15:30:47'),
(50, 'new_student', 'New Student Registered', 'Marfel A. Gallarde (1231378) registered — Bachelor of Science in Information Technology, 3rd Year', '{\"student_id_number\":\"1231378\",\"name\":\"Marfel Gallarde\",\"program\":\"Bachelor of Science in Information Technology\",\"yearLevel\":\"3rd Year\",\"email\":\"marfel.gallarde.ecoast@panpacificu.edu.ph\"}', 0, 1, '2026-04-06 15:38:31');

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
(38, 'Kinder Section 1', '2026-04-04 22:56:44'),
(47, 'Bachelor of Science in Information Technology', '2026-04-04 22:58:55'),
(48, 'Bachelor of Science in Computer Science', '2026-04-04 22:59:05'),
(49, 'Bachelor of Science in Business Administration', '2026-04-04 22:59:15'),
(50, 'Bachelor of Secondary Education', '2026-04-04 22:59:27'),
(51, 'Bachelor of Elementary Education', '2026-04-04 22:59:38'),
(52, 'GAS', '2026-04-05 13:38:25'),
(53, 'TVL', '2026-04-05 13:38:34'),
(55, 'STEM', '2026-04-05 13:38:52'),
(56, 'ABM', '2026-04-05 13:38:58'),
(57, 'SBE', '2026-04-05 13:40:14'),
(58, 'HUMSS', '2026-04-05 13:41:54');

-- --------------------------------------------------------

--
-- Table structure for table `student_accounts`
--

CREATE TABLE `student_accounts` (
  `student_id` int(11) NOT NULL,
  `student_id_number` varchar(255) NOT NULL,
  `student_firstname` varchar(255) NOT NULL,
  `student_middlename` varchar(255) DEFAULT NULL,
  `student_lastname` varchar(255) NOT NULL,
  `student_email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `student_year_level` varchar(255) NOT NULL,
  `student_guardian_number` varchar(255) DEFAULT NULL,
  `student_program` varchar(255) NOT NULL,
  `location_generated` varchar(255) NOT NULL DEFAULT '',
  `barcode` varchar(255) NOT NULL DEFAULT '',
  `barcode_date_generated` datetime NOT NULL DEFAULT current_timestamp(),
  `device_id` varchar(255) NOT NULL DEFAULT '',
  `admin_id` int(11) DEFAULT NULL,
  `barcode_teacher_serial` varchar(100) DEFAULT NULL,
  `student_profile_picture` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `student_accounts`
--

INSERT INTO `student_accounts` (`student_id`, `student_id_number`, `student_firstname`, `student_middlename`, `student_lastname`, `student_email`, `password`, `student_year_level`, `student_guardian_number`, `student_program`, `location_generated`, `barcode`, `barcode_date_generated`, `device_id`, `admin_id`, `barcode_teacher_serial`, `student_profile_picture`) VALUES
(18, '1233345989', 'Agrifina', 'A', 'Agaran', 'agrifina@panpacificu.edu.ph', '$2b$10$OuBrVjLjQIjpZ6DNU.rpROthB9qekSgTqujfjA0B/gsMIrH9WFaJG', '3rd Year', '+639481239328', 'BS Education', '', 'BC17708947181891836', '2026-02-12 19:11:58', '', 1, NULL, NULL),
(19, '1231422', 'Charimea', 'M', 'Selga', 'charimea.selga.ecoast@panpacificu.edu.ph', '$2b$10$.VzGuTyj7ZlUsdb/Vd5cUeDKBMqawDkcEZEUlKF9jug/E28aFC9/W', '3rd Year', '+639563543429', 'BS in Information Technology', '', 'BC17708952022486423', '2026-02-12 19:20:02', 'bfada3fc56d39ca594cb3f4271f15aff37d473d54b26fa1b30b2a40667dd8959', 1, NULL, 'student-1774319257454-911589.jpg'),
(23, '1231333', 'Lucy', 'A', 'Heartfilla', 'lucyheart@panpacificu.edu.ph', '$2b$10$617POruNNIa1m8LeMYdKS.9IjOgJqbMX.N1.wInPcKK6hYj26weHy', '3rd Year', '+639763891308', 'BS in Information Technology', '', 'BC17754374678544394', '2026-04-06 16:20:46', 'bfada3fc56d39ca594cb3f4271f15aff37d473d54b26fa1b30b2a40667dd8959', 0, 'TSN17698767256291441', 'student-1774159341046-561222.png'),
(25, '14567', 'Diane', 'A', 'Chua', 'dwynna@gmail.com', '$2b$10$haEoY2zIw3gGj0k4wHFHKOIoXTJu2soBKV1/T1tICPwSy5CPd9Ceu', '3rd Year', '+639195364085', 'RPSEA', '', 'BC17728938112284412', '2026-03-07 22:30:11', '', 0, NULL, NULL),
(26, '123123', 'Luna', 'M', 'Toka', 'lunatoka@gmail.com', '$2b$10$5s.sqyEQozw1ukpJCFToSuFsmPmhTvxjspj9koWCt/tmP8ORg7wFC', '2nd Year', '+639455415405', 'BS in Criminology', '', 'BC17743311630866537', '2026-03-24 13:57:38', 'becb852897243ae674ae8c1ac62dbbb097a92f9606ec12abed80303b063bd7ff', 0, 'TSN17698767256291441', NULL),
(28, '456', 'Andria', 'A', 'Ramirez', 'andria@gmail.com', '$2b$10$sO26fMQvVakQtiCy4Zoal.Yn09ulCejCe61giWID5iWnna/nuCs0K', '1st Year', '+639615842358', 'BS Education', '', 'BC17731513173571253', '2026-03-10 22:01:57', '', 0, NULL, NULL),
(35, '1231231231231', 'Natsu', 'B', 'Dragneel', 'xnatsu25@gmail.com', '$2b$10$z2EKEoHbu6d0TBxeh2BgnezZJCcTCB.6mSjVoYM9nakkmUaeUFMK2', '3rd Year', '+63639763891308', 'BS in Information Technology', '', 'BC17753695495428992', '2026-04-05 14:12:29', '5fd6d04e115bc91553eef8cc76799725738ec5dca241a58d5c924d3e185c623a', 0, 'TSN17698767256291441', 'student-1774291218077-659300.jpg'),
(42, '737773', 'Zaiejan', 'A', 'Agustin', 'zaiejanagustin@gmail.com', '$2b$10$siGOJgd3GAIWr85GZy0p3OcoaXjkulNqVh1.aCfaJVCNyfs.NsUju', '3rd Year', '+639763891308', 'BS in Information Technology', '', 'BC17743368484166337', '2026-03-24 15:20:49', '8596927ce8a26ec5db6831cb162f7da752db54b19ec598e9714fb28fcbbdda54', 0, 'TSN17698767256291441', 'student-1774336806254-514881.jpg'),
(43, '1231392', 'Jan Ray', 'A', 'Aquino', 'janrayaquino9@gmail.com', '$2b$10$z8utuo2j76que1L6sEnv0uvCdVUcYRlwjnhHcPEQqG4d.6asy3ZQC', '3rd Year', '+6309661672889', '', '', 'BC17754574702446646', '2026-04-06 14:37:50', 'bfada3fc56d39ca594cb3f4271f15aff37d473d54b26fa1b30b2a40667dd8959', 0, 'TSN17698767256291441', 'student-1774440304501-238054.jpg'),
(44, '1010', 'Jasmin', 'A', 'Pastor', 'jasmin@gmail.com', '$2b$10$H/YJjdnT2pZemnE6pStiSOpXJFwJbrcP./632TD6BR0Zc61ai69Ki', 'SBE', '+63639615842353', '', '', 'BC17739113039904719', '2026-03-19 17:14:11', '', 0, 'TSN17739090200094291', NULL),
(46, '1231377', 'Steven John', 'A', 'Agustin (CoAST)', 'steven.agustin.ecoast@panpacificu.edu.ph', '$2b$10$9CJD/U5MPDMB/3.f18vYSeklWLX1TT90cl4Q6ls0sow54K3TDY61O', '3rd Year', '+639763891308', 'BS in Information Technology', '', 'BC17749448835984602', '2026-03-31 16:14:43', '5fd6d04e115bc91553eef8cc76799725738ec5dca241a58d5c924d3e185c623a', 0, 'TSN17698767256291441', 'student-1774770851525-40101.jpg'),
(47, '67', 'Yuumi', 'A', 'Kiyomi', 'example@panpacificu.edu.ph', '$2b$10$nyCzO4gK0WKF9Uc0y23nUOuueYCmnqzVZf7r/HgNL4fgYk6IDSl8S', '2nd Year', '+636767676767', 'BS in Mechanics', '', 'BC17741610878194590', '2026-03-22 14:37:38', 'fb311b2397651ca64b39658572971b21aef645f36ba2d6ac45b9ff8683585e05', 0, 'TSN17736807667173940', 'student-1774161481694-153469.jpg'),
(49, '12310922', 'Andrea', 'A', 'Lachica', 'andrea.lachica@panpacificu.edu.ph', '$2b$10$Bjns138ua26/ukNYd4t8xu.HT1Vzx9NsRMwdv4Bzn60EfW4cHHx6O', '3rd Year', '+63639195366089', 'BS in Information Technology', '', 'BC17743308931349513', '2026-03-24 13:41:33', '1f2079e418f7ebd0d36bbd234af6f77ae33b044a2fc69f0a207f50748482897b', 0, 'TSN17698767256291441', 'student-1774336848701-75789.jpg'),
(53, '1231423432', 'Darren James', 'A', 'Agustin', 'darren@panpacificu.edu.ph', '$2b$10$zjGsBFrK2tNgM/HxJN2zd.W4A84dQZBfrIAX9WzvsdhWUA6mIaXhO', '3rd Year', '09481239328', 'Bachelor of Science in Computer Science', '', 'BC17746831616057616', '2026-03-28 15:32:41', '', NULL, NULL, NULL),
(54, '234', 'Andrea', 'A', 'Balbin', 'dwynna@gmail.com.ph', '$2b$10$UuNy0USbTfv2faVqBIKlcuGqo1676pOkpJc13PBA/rXkuBJgTozFS', '4th Year', '+6309174563890', 'Bs Nursing', '', 'BC17749718457774115', '2026-03-31 23:44:05', 'a93bb0e14f93cfeaa024be22f5cf4506e0035ad12b52e3ca21a05bebf4859e68', NULL, NULL, NULL),
(55, '8700', 'Andrea', 'L', 'Mulach', 'andreamulach@gmail.com', '$2b$10$PnoSP0lXM9LlQUBRXFi6seo7X.Brsbk0Pdoj.ynRX2/crflDKW7aW', '3rd Year', '+6309974503890', 'Bachelor of Science in Business Administration', '', 'BC17754489208503468', '2026-04-06 12:15:21', '8596927ce8a26ec5db6831cb162f7da752db54b19ec598e9714fb28fcbbdda54', NULL, 'TSN17698767256291441', NULL),
(56, '0009', 'Mica', 'M', 'Mosser', 'mosser@gmail.com', '$2b$10$jN.A971zlCBVxJ5Gb0dkU.1xTeI4WivxL90Jasl.P9hIOlPsAdP9K', '1st Year', '09546735324', 'BS Education', '', 'BC17753141569787105', '2026-04-04 22:49:16', '', NULL, NULL, NULL),
(57, '67867867', 'Kurdapya', 'A', 'Alunday', 'kurdapyapipit@gmail.com', '$2b$10$Rtbn/O5yZ/0EzLnOP0dzlOGif4ujhZ9ocPVTDr/2zAqBV2lzw0YRq', '3rd Year', '+639763891308', 'Bachelor of Science in Computer Science', '', 'BC17753386896813475', '2026-04-05 05:38:09', '5fd6d04e115bc91553eef8cc76799725738ec5dca241a58d5c924d3e185c623a', NULL, NULL, NULL),
(58, '1231008', 'Onyx Lloyd', 'E', 'Alunday', 'onyxlloyd.alunday.ecoast@panpacificu.edu.ph', '$2b$10$aocahnojR/Hp56jCUreHoOl1LUMmFnpz3F/VsJl6p9mP91KNK1xpS', '3rd Year', '+639662154134', 'Bachelor of Science in Information Technology', '', 'BC17754606479574131', '2026-04-06 15:30:47', 'bfada3fc56d39ca594cb3f4271f15aff37d473d54b26fa1b30b2a40667dd8959', NULL, NULL, NULL),
(59, '1231378', 'Marfel', 'A', 'Gallarde', 'marfel.gallarde.ecoast@panpacificu.edu.ph', '$2b$10$hkcTZ/WzbnB7E8yBpW0DcuNkLb8oVfqoGhWE2sYNFp7.XQR68AOFa', '3rd Year', '+639662154134', 'Bachelor of Science in Information Technology', '', 'BC17754611118687892', '2026-04-06 15:38:31', 'bfada3fc56d39ca594cb3f4271f15aff37d473d54b26fa1b30b2a40667dd8959', NULL, NULL, NULL);

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
(21, '1231422', 'Charimea', 'M', 'Selga', 'charimea.selga.ecoast@panpacificu.edu.ph', '3rd Year', '+639481239328', NULL, 'BS in Information Technology', 'TSN17698767256291441', '2026-03-07 22:32:58'),
(28, '1231231231231', 'Natsu', 'A', 'Dragneel', 'xnatsu25@gmail.com', '3rd Year', '+63639763891308', NULL, 'BS in Information Technology', 'TSN17698767256291441', '2026-03-12 17:56:50'),
(34, '1231333', 'Lucy', 'A', 'Heartfilla', 'lucy@panpacificu.edu.ph', '3rd Year', '+639763891308', NULL, 'BS in Information Technology', 'TSN17734603098321716', '2026-03-14 12:58:54'),
(41, '14567', 'Diane', 'A', 'Chua', 'dwynna@gmail.com', '3rd Year', '+639195364085', NULL, 'RPSEA', 'TSN17734603098321716', '2026-03-14 15:29:45'),
(45, '1231333', 'Lucy', 'A', 'Heartfilla', 'lucy@panpacificu.edu.ph', '3rd Year', '+639763891308', NULL, 'BS in Information Technology', 'TSN17698767256291441', '2026-03-15 10:49:14'),
(49, '737773', 'Zaiejan', 'A', 'Agustin', 'zaiejanagustin@gmail.com', '3rd Year', '+639763891308', NULL, 'BS in Information Technology', 'TSN17698767256291441', '2026-03-16 15:09:21'),
(51, '1231333', 'Lucy', 'A', 'Heartfilla', 'lucy@panpacificu.edu.ph', '3rd Year', '+639763891308', NULL, 'BS in Information Technology', 'TSN17736807667173940', '2026-03-19 13:18:46'),
(53, '1010', 'Jasmin', 'A', 'Pastor', 'jasmin@gmail.com', 'SBE', '+63639615842353', NULL, '', 'TSN17739090200094291', '2026-03-19 17:09:56'),
(54, '1010', 'Jasmin', 'A', 'Pastor', 'jasmin@gmail.com', 'SBE', '+63639615842353', NULL, '', 'TSN17736807667173940', '2026-03-19 17:13:42'),
(56, '1231377', 'Steven John', 'A', 'Agustin (CoAST)', 'steven.agustin.ecoast@panpacificu.edu.ph', '3rd Year', '+639763891308', NULL, 'BS in Information Technology', 'TSN17698767256291441', '2026-03-20 00:57:00'),
(57, '1231377', 'Steven John', 'A', 'Agustin (CoAST)', 'steven.agustin.ecoast@panpacificu.edu.ph', '3rd Year', '+639763891308', NULL, 'BS in Information Technology', 'TSN17736807667173940', '2026-03-20 00:57:14'),
(60, '67', 'Yuumi', 'A', 'Kiyomi', 'example@panpacificu.edu.ph', '2nd Year', '+636767676767', NULL, 'BS in Mechanics', 'TSN17736807667173940', '2026-03-22 14:37:32'),
(62, '12310922', 'Andrea', 'A', 'Lachica', 'andrea.lachica@panpacificu.edu.ph', '3rd Year', '+63639195366089', NULL, 'BS in Information Technology', 'TSN17698767256291441', '2026-03-24 13:41:06'),
(66, '67', 'Yuumi', 'A', 'Kiyomi', 'example@panpacificu.edu.ph', '2nd Year', '+636767676767', NULL, 'BS in Mechanics', 'TSN17698767256291441', '2026-03-28 16:22:15'),
(67, '1231392', 'Jan Ray', 'A', 'Aquino', 'janrayaquino9@gmail.com', '3rd Year', '+6309661672889', NULL, 'Bachelor of Elementary Education', 'TSN17698767256291441', '2026-03-28 22:11:50'),
(69, '8700', 'Andrea', 'L', 'Mulach', 'andreamulach@gmail.com', '3rd Year', '+6309974503890', NULL, 'Bachelor of Science in Business Administration', 'TSN17698767256291441', '2026-04-04 21:49:41');

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
(26, 'Mathematics', '2026-03-22 12:41:49', 18),
(28, 'Cloud Computing', '2026-03-28 22:29:44', 7);

-- --------------------------------------------------------

--
-- Table structure for table `subject_and_year_level_setter`
--

CREATE TABLE `subject_and_year_level_setter` (
  `id` int(11) NOT NULL,
  `subject_name_set` varchar(255) DEFAULT NULL,
  `year_level_set` varchar(255) DEFAULT NULL,
  `teacher_barcode_scanner_serial_number` varchar(255) DEFAULT NULL,
  `class_time_set` varchar(10) DEFAULT NULL,
  `last_set_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `subject_and_year_level_setter`
--

INSERT INTO `subject_and_year_level_setter` (`id`, `subject_name_set`, `year_level_set`, `teacher_barcode_scanner_serial_number`, `class_time_set`, `last_set_at`) VALUES
(2, 'Integrative Programming', '3rd Year', 'TSN17698767256291441', '07:36', '2026-04-06 11:46:41'),
(3, '', '', 'TSN17704826980131949', NULL, NULL),
(4, '', '', 'TSN17704837387017092', NULL, NULL),
(5, '', '', 'TSN17704837433987368', NULL, NULL),
(6, 'Programming Lec', '3rd Year', 'TSN17713351187271590', NULL, NULL),
(7, '', '', 'TSN17713353120404545', NULL, NULL),
(8, '', '', 'TSN17713354408022460', NULL, NULL),
(9, '', '', 'TSN17719208025622022', NULL, NULL),
(10, '', '', 'TSN17719241460167887', NULL, NULL),
(11, '', '', 'TSN17734601215899710', NULL, NULL),
(12, 'App Dev', '3rd Year', 'TSN17734603098321716', NULL, NULL),
(13, 'Mathematics', '2nd Year', 'TSN17736807667173940', NULL, NULL),
(14, 'Math', 'SBE', 'TSN17739090200094291', NULL, NULL),
(15, '', '', 'TSN17750552569416047', NULL, NULL),
(16, '', '', 'TSN17746831293607630', NULL, NULL),
(17, '', '', 'TSN17747043778496654', NULL, NULL),
(18, '', '', 'TSN17751153525768087', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `subject_class_list`
--

CREATE TABLE `subject_class_list` (
  `id` int(11) NOT NULL,
  `subject_id` int(11) NOT NULL,
  `student_id` int(11) NOT NULL,
  `teacher_barcode_scanner_serial_number` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `subject_class_list`
--

INSERT INTO `subject_class_list` (`id`, `subject_id`, `student_id`, `teacher_barcode_scanner_serial_number`) VALUES
(1, 1, 21, 'TSN17698767256291441'),
(2, 1, 28, 'TSN17698767256291441'),
(3, 1, 45, 'TSN17698767256291441'),
(7, 1, 49, 'TSN17698767256291441'),
(8, 1, 56, 'TSN17698767256291441'),
(9, 1, 61, 'TSN17698767256291441'),
(10, 1, 62, 'TSN17698767256291441'),
(11, 2, 21, 'TSN17698767256291441'),
(12, 2, 28, 'TSN17698767256291441'),
(13, 2, 45, 'TSN17698767256291441'),
(15, 2, 46, 'TSN17698767256291441'),
(16, 2, 49, 'TSN17698767256291441'),
(17, 2, 56, 'TSN17698767256291441'),
(18, 2, 61, 'TSN17698767256291441'),
(19, 2, 62, 'TSN17698767256291441'),
(20, 3, 21, 'TSN17698767256291441'),
(21, 3, 27, 'TSN17698767256291441'),
(22, 3, 28, 'TSN17698767256291441'),
(23, 3, 45, 'TSN17698767256291441'),
(24, 3, 46, 'TSN17698767256291441'),
(25, 3, 49, 'TSN17698767256291441'),
(26, 3, 56, 'TSN17698767256291441'),
(27, 3, 61, 'TSN17698767256291441'),
(28, 3, 62, 'TSN17698767256291441'),
(29, 22, 21, 'TSN17698767256291441'),
(32, 22, 45, 'TSN17698767256291441'),
(34, 22, 49, 'TSN17698767256291441'),
(35, 22, 56, 'TSN17698767256291441'),
(36, 22, 61, 'TSN17698767256291441'),
(37, 22, 62, 'TSN17698767256291441'),
(39, 4, 21, 'TSN17698767256291441'),
(40, 4, 27, 'TSN17698767256291441'),
(41, 4, 28, 'TSN17698767256291441'),
(43, 4, 45, 'TSN17698767256291441'),
(44, 4, 46, 'TSN17698767256291441'),
(45, 4, 49, 'TSN17698767256291441'),
(46, 4, 56, 'TSN17698767256291441'),
(47, 4, 61, 'TSN17698767256291441'),
(48, 4, 62, 'TSN17698767256291441'),
(49, 4, 64, 'TSN17698767256291441'),
(50, 5, 21, 'TSN17698767256291441'),
(51, 5, 27, 'TSN17698767256291441'),
(52, 5, 28, 'TSN17698767256291441'),
(53, 5, 45, 'TSN17698767256291441'),
(54, 5, 46, 'TSN17698767256291441'),
(55, 5, 49, 'TSN17698767256291441'),
(56, 5, 56, 'TSN17698767256291441'),
(57, 5, 61, 'TSN17698767256291441'),
(58, 5, 62, 'TSN17698767256291441'),
(59, 5, 64, 'TSN17698767256291441'),
(60, 4, 44, 'TSN17698767256291441'),
(64, 28, 27, 'TSN17698767256291441'),
(65, 28, 28, 'TSN17698767256291441'),
(66, 29, 27, 'TSN17698767256291441'),
(67, 28, 45, 'TSN17698767256291441'),
(68, 29, 28, 'TSN17698767256291441'),
(69, 29, 45, 'TSN17698767256291441'),
(70, 28, 46, 'TSN17698767256291441'),
(71, 28, 44, 'TSN17698767256291441'),
(73, 2, 27, 'TSN17698767256291441'),
(74, 2, 44, 'TSN17698767256291441'),
(75, 2, 66, 'TSN17698767256291441'),
(76, 1, 66, 'TSN17698767256291441');

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
(1, 'Super Administrator', 'superadmin@panpacificu.edu.ph', '$2b$10$d4kXfzxstDkpQPR5Gp8YZeove4F2/T5Ga/EaS8g7y9c4ddf9HITP6', 'superadmin-1774318366514-851420.jpg', '2026-03-15 11:22:58');

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
(278, 5, 'Gray Fullbusters', 'guard', 'EVENT_TIME_IN', 'Event Attendance', '897', 'Andrea A. Lachica', 'Event: Sample | Location: Main Gate', NULL, NULL, '2026-03-23 13:13:12'),
(279, NULL, NULL, 'admin', 'DELETE_STUDENT', 'Student', '29', NULL, 'Deleted student ID: 29', NULL, NULL, '2026-03-24 10:25:05'),
(280, 1, 'Super Administrator', 'super_admin', 'DELETE_STUDENT', 'Student', '', 'Alexander Magbitang', 'Deleted student: Alexander Magbitang', '136.158.120.56', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', '2026-03-24 10:25:05'),
(281, 1, 'CSS Admin', 'admin', 'EDIT_STUDENT', 'Student', '', 'Gabriel Castillo (ECoAST)', 'Edited student: Gabriel Castillo (ECoAST) — BS in Information Technology 3rd Year', '136.158.120.56', 'Chrome 146 · Windows 10', '2026-03-24 11:30:04'),
(282, 1, 'CSS Admin', 'admin', 'EDIT_STUDENT', 'Student', '', 'Gabriel Castillo (ECoAST)', 'Edited student: Gabriel Castillo (ECoAST) — BS in Information Technology 3rd Year', '136.158.120.56', 'Chrome 146 · Windows 10', '2026-03-24 11:30:15'),
(283, 1, 'CSS Admin', 'admin', 'EDIT_STUDENT', 'Student', '', 'Ace-cin Kyoshi', 'Edited student: Ace-cin Kyoshi — BS in Information Technology 3rd Year', '136.158.120.56', 'Chrome 146 · Windows 10', '2026-03-24 12:53:28'),
(284, 7, 'Steven John A. Agustin', 'teacher', 'ADD_STUDENT_TO_CLASS', 'Student', '848484', 'Ace-cin Kyoshi', 'Added by Steven John A. Agustin — Program: BS in Information Technology, Year: 3rd Year', NULL, NULL, '2026-03-24 12:54:19'),
(285, 5, 'Gray Fullbusters', 'guard', 'EVENT_TIME_IN', 'Event Attendance', '848484', 'Ace-cin A. Kyoshi', 'Event: Sample | Location: Main Gate', NULL, NULL, '2026-03-24 12:54:57'),
(286, 5, 'Gray Fullbusters', 'guard', 'EVENT_TIME_OUT', 'Event Attendance', '848484', 'Ace-cin A. Kyoshi', 'Event: Sample | Location: Main Gate', NULL, NULL, '2026-03-24 12:55:16'),
(287, 7, 'Steven John A. Agustin', 'teacher', 'ADD_STUDENT_TO_CLASS', 'Student', '897', 'Andrea Lachica', 'Added by Steven John A. Agustin — Program: BS in Information Technology, Year: 3rd Year', NULL, NULL, '2026-03-24 13:41:06'),
(288, 7, 'Steven John A. Agustin', 'teacher', 'SET_LOCATION', 'Location', '7', NULL, 'Set location: lat 16.03041564451211, lng 120.74390132743584, radius 50m', '124.6.158.140', 'Edge 146 · Windows 19', '2026-03-24 13:41:27'),
(289, 49, 'Andrea Lachica', 'student', 'REGENERATE_BARCODE', 'Student', '', 'Andrea Lachica', 'Regenerated barcode — ID No: 897', '124.6.158.140', 'Chrome 146 · Android 16 · SM-A156E', '2026-03-24 13:41:33'),
(290, 49, 'Andrea A. Lachica', 'student', 'CLASS_ATTENDANCE_IN', 'Class Attendance', '897', 'Andrea A. Lachica', 'Teacher: Steven John A. Agustin | Program: BS in Information Technology, Year: 3rd Year', NULL, NULL, '2026-03-24 13:43:43'),
(291, 7, 'Steven John A. Agustin', 'teacher', 'ADD_STUDENT_TO_CLASS', 'Student', '123123', 'Luna Toka', 'Added by Steven John A. Agustin — Program: BS in Criminology, Year: 2nd Year', NULL, NULL, '2026-03-24 13:45:56'),
(292, 26, 'Luna Toka', 'student', 'REGENERATE_BARCODE', 'Student', '', 'Luna Toka', 'Regenerated barcode — ID No: 123123', '58.69.165.115', 'Chrome 146 · Android 14 · CPH2387', '2026-03-24 13:46:04'),
(293, 7, 'Steven John A. Agustin', 'teacher', 'ADD_SUBJECT', 'Subject', '', 'Sample', 'Added subject: Sample', '124.6.158.140', 'Edge 146 · Windows 19', '2026-03-24 13:49:02'),
(294, 26, 'Luna Toka', 'student', 'REGENERATE_BARCODE', 'Student', '', 'Luna Toka', 'Regenerated barcode — ID No: 123123', '58.69.165.115', 'Chrome 146 · Android 14 · CPH2387', '2026-03-24 13:56:44'),
(295, 26, 'Luna Toka', 'student', 'REGENERATE_BARCODE', 'Student', '', 'Luna Toka', 'Regenerated barcode — ID No: 123123', '58.69.165.115', 'Chrome 146 · Android 14 · CPH2387', '2026-03-24 13:57:38'),
(296, 7, 'Steven John A. Agustin', 'teacher', 'SET_SUBJECT_YEAR_LEVEL', 'Class Setup', '', 'Programming', 'Set subject: Programming, year level: 2nd Year', '124.6.158.140', 'Edge 146 · Windows 19', '2026-03-24 13:58:48'),
(297, 26, 'Luna M. Toka', 'student', 'CLASS_ATTENDANCE_IN', 'Class Attendance', '123123', 'Luna M. Toka', 'Teacher: Steven John A. Agustin | Program: BS in Criminology, Year: 2nd Year', NULL, NULL, '2026-03-24 13:58:56'),
(298, 7, 'Steven John A. Agustin', 'teacher', 'DELETE_STUDENT_RECORD', 'Student', '', 'Diane Chua', 'Removed Diane Chua from class', '124.6.158.140', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36 Edg/146.0.0.0', '2026-03-24 14:01:39'),
(299, 7, 'Steven John A. Agustin', 'teacher', 'SET_SUBJECT_YEAR_LEVEL', 'Class Setup', '', 'Database Lec', 'Set subject: Database Lec, year level: 3rd Year', '124.6.158.140', 'Edge 146 · Windows 19', '2026-03-24 14:03:38'),
(300, 7, 'Steven John A. Agustin', 'teacher', 'MANUAL_ATTENDANCE', 'Class Attendance', '1231426', 'Charimea M. Selga', 'Manual entry by Steven John A. Agustin — Program: BS in Information Technology, Year: 3rd Year', '124.6.158.140', 'Edge 146 · Windows 19', '2026-03-24 14:03:45'),
(301, 1, 'Super Administrator', 'super_admin', 'MAINTENANCE_TOGGLE', 'System', '', 'Maintenance ON', 'Maintenance mode turned ON', '124.6.158.140', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36 Edg/146.0.0.0', '2026-03-24 14:08:54'),
(302, 1, 'Super Administrator', 'super_admin', 'MAINTENANCE_TOGGLE', 'System', '', 'Maintenance OFF', 'Maintenance mode turned OFF', '124.6.158.140', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36 Edg/146.0.0.0', '2026-03-24 14:09:03'),
(303, 5, 'Gray Fullbusters', 'guard', 'EVENT_TIME_IN', 'Event Attendance', '123123', 'Luna M. Toka', 'Event: Sample | Location: Main Gate', NULL, NULL, '2026-03-24 14:09:41'),
(304, 42, 'Zaiejan Agustin', 'student', 'REGENERATE_BARCODE', 'Student', '', 'Zaiejan Agustin', 'Regenerated barcode — ID No: 737773', '124.6.158.140', 'Chrome 144 · Android 14 · Infinix X6731B', '2026-03-24 15:20:49'),
(305, 1, 'CSS Admin', 'admin', 'EDIT_STUDENT', 'Student', '', 'Maxene Franco', 'Edited student: Maxene Franco — BS in Information Technology 3rd Year', '136.158.120.56', 'Chrome 146 · Windows 10', '2026-03-25 01:03:26'),
(306, 7, 'Steven John A. Agustin', 'teacher', 'MANUAL_ATTENDANCE', 'Class Attendance', '1231426', 'Charimea M. Selga', 'Manual entry by Steven John A. Agustin — Program: BS in Information Technology, Year: 3rd Year', '136.158.120.56', 'Chrome 146 · Windows 10', '2026-03-25 11:02:10'),
(307, 7, 'Steven John A. Agustin', 'teacher', 'MANUAL_ATTENDANCE', 'Class Attendance', '12313598', 'Princess O. Obillo (ECoAST)', 'Manual entry by Steven John A. Agustin — Program: BS in Information Technology, Year: 3rd Year', '136.158.120.56', 'Chrome 146 · Windows 10', '2026-03-25 11:02:12'),
(308, 7, 'Steven John A. Agustin', 'teacher', 'DELETE_STUDENT_RECORD', 'Student', '', 'Andria Ramirez', 'Removed Andria Ramirez from class', '136.158.120.56', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', '2026-03-25 11:08:07'),
(309, 7, 'Steven John A. Agustin', 'teacher', 'DELETE_STUDENT_RECORD', 'Student', '', 'Jasmin Pastor', 'Removed Jasmin Pastor from class', '136.158.120.56', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', '2026-03-25 11:08:10'),
(310, 7, 'Steven John A. Agustin', 'teacher', 'DELETE_STUDENT_RECORD', 'Student', '', 'Luna Toka', 'Removed Luna Toka from class', '136.158.120.56', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', '2026-03-25 11:08:12'),
(311, 7, 'Steven John A. Agustin', 'teacher', 'MANUAL_ATTENDANCE', 'Class Attendance', '737773', 'Zaiejan A. Agustin', 'Manual entry by Steven John A. Agustin — Program: BS in Information Technology, Year: 3rd Year', '136.158.120.56', 'Chrome 146 · Windows 10', '2026-03-25 11:24:32'),
(312, 7, 'Steven John A. Agustin', 'teacher', 'SET_SUBJECT_YEAR_LEVEL', 'Class Setup', '', 'Big Data', 'Set subject: Big Data, year level: 3rd Year', '136.158.120.56', 'Chrome 146 · Windows 10', '2026-03-25 11:24:57'),
(313, 7, 'Steven John A. Agustin', 'teacher', 'SET_SUBJECT_YEAR_LEVEL', 'Class Setup', '', 'Programming', 'Set subject: Programming, year level: 3rd Year', '136.158.120.56', 'Chrome 146 · Windows 10', '2026-03-25 12:39:57'),
(314, 7, 'Steven John A. Agustin', 'teacher', 'SET_SUBJECT_YEAR_LEVEL', 'Class Setup', '', 'Programming', 'Set subject: Programming, year level: 3rd Year', '136.158.120.56', 'Chrome 146 · Windows 10', '2026-03-25 13:17:29'),
(315, 7, 'Steven John A. Agustin', 'teacher', 'DELETE_SUBJECT', 'Subject', '', 'Sample', 'Deleted subject: Sample', '136.158.120.56', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', '2026-03-25 18:36:19'),
(316, 1, 'Super Administrator', 'super_admin', 'RESET_STUDENT_DEVICE', 'Student', '43', 'Jan Ray Aquino', 'Device binding reset for: Jan Ray Aquino', '136.158.120.56', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', '2026-03-25 19:47:24'),
(317, 7, 'Steven John A. Agustin', 'teacher', 'SET_LOCATION', 'Location', '7', NULL, 'Set location: lat 16.079996614554997, lng 120.7352907007391, radius 100m', '136.158.120.56', 'Chrome 146 · Windows 10', '2026-03-25 20:14:26'),
(318, 7, 'Steven John A. Agustin', 'teacher', 'ADD_STUDENT_TO_CLASS', 'Student', '1231392', 'Jan Ray Aquino', 'Added by Steven John A. Agustin — Program: BS in Information Technology, Year: 3rd Year', NULL, NULL, '2026-03-25 20:17:32'),
(319, 43, 'Jan Ray Aquino', 'student', 'REGENERATE_BARCODE', 'Student', '', 'Jan Ray Aquino', 'Regenerated barcode — ID No: 1231392', '49.150.35.37', 'Safari 604 · iOS 18.7', '2026-03-25 20:17:34'),
(320, 7, 'Steven John A. Agustin', 'teacher', 'SET_SUBJECT_YEAR_LEVEL', 'Class Setup', '', 'Integrative Programming', 'Set subject: Integrative Programming, year level: 3rd Year, class time: 20:25', '136.158.120.56', 'Chrome 146 · Windows 10', '2026-03-25 20:24:08'),
(321, 7, 'Steven John A. Agustin', 'teacher', 'SET_SUBJECT_YEAR_LEVEL', 'Class Setup', '', 'Integrative Programming', 'Set subject: Integrative Programming, year level: 3rd Year, class time: 01:25', '136.158.120.56', 'Chrome 146 · Windows 10', '2026-03-26 01:23:30'),
(322, 1, 'Super Administrator', 'super_admin', 'RESET_STUDENT_DEVICE', 'Student', '23', 'Lucy Heartfilla', 'Device binding reset for: Lucy Heartfilla', '136.158.120.56', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', '2026-03-26 01:27:31'),
(323, 7, 'Steven John A. Agustin', 'teacher', 'SET_LOCATION', 'Location', '7', NULL, 'Set location: lat 16.01769377915928, lng 120.74931085109712, radius 100m', '136.158.120.56', 'Chrome 146 · Windows 10', '2026-03-26 01:29:02'),
(324, 23, 'Lucy Heartfilla', 'student', 'REGENERATE_BARCODE', 'Student', '', 'Lucy Heartfilla', 'Regenerated barcode — ID No: 1231333', '136.158.120.56', 'Chrome 144 · Android 14 · Infinix X6731B', '2026-03-26 01:29:10'),
(325, 23, 'Lucy A. Heartfilla', 'student', 'CLASS_ATTENDANCE_IN', 'Class Attendance', '1231333', 'Lucy A. Heartfilla', 'Teacher: Steven John A. Agustin | Program: BS in Information Technology, Year: 3rd Year', NULL, NULL, '2026-03-26 01:31:27'),
(326, 7, 'Steven John A. Agustin', 'teacher', 'SET_SUBJECT_YEAR_LEVEL', 'Class Setup', '', 'Integrative Programming', 'Set subject: Integrative Programming, year level: 3rd Year, class time: 01:37', '136.158.120.56', 'Chrome 146 · Windows 10', '2026-03-26 01:32:14'),
(327, 1, 'Super Administrator', 'super_admin', 'RESET_STUDENT_DEVICE', 'Student', '35', 'Natsu Dragneel', 'Device binding reset for: Natsu Dragneel', '136.158.120.56', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', '2026-03-26 01:35:29'),
(328, 35, 'Natsu Dragneel', 'student', 'REGENERATE_BARCODE', 'Student', '', 'Natsu Dragneel', 'Regenerated barcode — ID No: 1231231231231', '136.158.120.56', 'Chrome 144 · Android 14 · Infinix X6731B', '2026-03-26 01:35:45'),
(329, 35, 'Natsu B. Dragneel', 'student', 'CLASS_ATTENDANCE_IN', 'Class Attendance', '1231231231231', 'Natsu B. Dragneel', 'Teacher: Steven John A. Agustin | Program: BS in Information Technology, Year: 3rd Year', NULL, NULL, '2026-03-26 01:35:48'),
(330, 1, 'Super Administrator', 'super_admin', 'RESET_STUDENT_DEVICE', 'Student', '33', 'Marfel Gem Gallarde (ECoAST)', 'Device binding reset for: Marfel Gem Gallarde (ECoAST)', '136.158.120.56', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', '2026-03-26 01:38:26'),
(331, 33, 'Marfel Gem Gallarde (ECoAST)', 'student', 'REGENERATE_BARCODE', 'Student', '', 'Marfel Gem Gallarde (ECoAST)', 'Regenerated barcode — ID No: 12312312312', '136.158.120.56', 'Chrome 144 · Android 14 · Infinix X6731B', '2026-03-26 01:38:55'),
(332, 1, 'Super Administrator', 'super_admin', 'EDIT_STUDENT', 'Student', '', 'Marfel Gem Gallarde (ECoAST)', 'Edited student: Marfel Gem Gallarde (ECoAST) — BS in Computer Engineering 3rd Year', '136.158.120.56', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', '2026-03-26 01:39:33'),
(333, 33, 'Marfel Gem A. Gallarde (ECoAST)', 'student', 'CLASS_ATTENDANCE_IN', 'Class Attendance', '12312312312', 'Marfel Gem A. Gallarde (ECoAST)', 'Teacher: Steven John A. Agustin | Program: BS in Computer Engineering, Year: 3rd Year', NULL, NULL, '2026-03-26 01:40:13'),
(334, 7, 'Steven John A. Agustin', 'teacher', 'SET_SUBJECT_YEAR_LEVEL', 'Class Setup', '', 'Integrative Programming', 'Set subject: Integrative Programming, year level: 3rd Year, class time: 01:52', '136.158.120.56', 'Chrome 146 · Windows 10', '2026-03-26 01:47:53'),
(335, 23, 'Lucy Heartfilla', 'student', 'REGENERATE_BARCODE', 'Student', '', 'Lucy Heartfilla', 'Regenerated barcode — ID No: 1231333', '136.158.120.56', 'Chrome 144 · Android 14 · Infinix X6731B', '2026-03-27 11:51:03'),
(336, 23, 'Lucy A. Heartfilla', 'student', 'CLASS_ATTENDANCE_IN', 'Class Attendance', '1231333', 'Lucy A. Heartfilla', 'Teacher: Steven John A. Agustin | Program: BS in Information Technology, Year: 3rd Year', NULL, NULL, '2026-03-27 11:55:20'),
(337, 7, 'Steven John A. Agustin', 'teacher', 'SET_SUBJECT_YEAR_LEVEL', 'Class Setup', '', 'Integrative Programming', 'Set subject: Integrative Programming, year level: 3rd Year, class time: 11:57', '136.158.120.56', 'Chrome 146 · Windows 10', '2026-03-28 11:56:11'),
(338, 7, 'Steven John A. Agustin', 'teacher', 'SET_SUBJECT_YEAR_LEVEL', 'Class Setup', '', 'Integrative Programming', 'Set subject: Integrative Programming, year level: 3rd Year, class time: 00:11', '136.158.120.56', 'Chrome 146 · Windows 10', '2026-03-28 12:07:55'),
(339, 7, 'Steven John A. Agustin', 'teacher', 'SET_SUBJECT_YEAR_LEVEL', 'Class Setup', '', 'Integrative Programming', 'Set subject: Integrative Programming, year level: 3rd Year, class time: 12:11', '136.158.120.56', 'Chrome 146 · Windows 10', '2026-03-28 12:08:09'),
(340, 35, 'Natsu Dragneel', 'student', 'REGENERATE_BARCODE', 'Student', '', 'Natsu Dragneel', 'Regenerated barcode — ID No: 1231231231231', '136.158.120.56', 'Chrome 144 · Android 14 · Infinix X6731B', '2026-03-29 12:53:31'),
(341, 35, 'Natsu B. Dragneel', 'student', 'CLASS_ATTENDANCE_IN', 'Class Attendance', '1231231231231', 'Natsu B. Dragneel', 'Teacher: Steven John A. Agustin | Program: BS in Information Technology, Year: 3rd Year', NULL, NULL, '2026-03-29 12:53:38'),
(342, 23, 'Lucy A. Heartfilla', 'student', 'CLASS_ATTENDANCE_IN', 'Class Attendance', '1231333', 'Lucy A. Heartfilla', 'Teacher: Steven John A. Agustin | Program: BS in Information Technology, Year: 3rd Year', NULL, NULL, '2026-03-29 12:55:27'),
(343, 7, 'Steven John A. Agustin', 'teacher', 'SET_SUBJECT_YEAR_LEVEL', 'Class Setup', '', 'Integrative Programming', 'Set subject: Integrative Programming, year level: 3rd Year, class time: 14:51', '136.158.120.56', 'Chrome 146 · Windows 10', '2026-03-30 13:01:50'),
(344, 23, 'Lucy A. Heartfilla', 'student', 'CLASS_ATTENDANCE_IN', 'Class Attendance', '1231333', 'Lucy A. Heartfilla', 'Teacher: Steven John A. Agustin | Program: BS in Information Technology, Year: 3rd Year', NULL, NULL, '2026-03-30 13:21:01'),
(345, 35, 'Natsu B. Dragneel', 'student', 'CLASS_ATTENDANCE_IN', 'Class Attendance', '1231231231231', 'Natsu B. Dragneel', 'Teacher: Steven John A. Agustin | Program: BS in Information Technology, Year: 3rd Year', NULL, NULL, '2026-03-30 13:21:29'),
(346, 7, 'Steven John A. Agustin', 'teacher', 'SET_SUBJECT_YEAR_LEVEL', 'Class Setup', '', 'Integrative Programming', 'Set subject: Integrative Programming, year level: 3rd Year, class time: 11:51', '136.158.120.56', 'Chrome 146 · Windows 10', '2026-03-30 13:27:00'),
(347, 7, 'Steven John A. Agustin', 'teacher', 'SET_SUBJECT_YEAR_LEVEL', 'Class Setup', '', 'Integrative Programming', 'Set subject: Integrative Programming, year level: 3rd Year, class time: 19:51', '136.158.120.56', 'Chrome 146 · Windows 10', '2026-03-31 13:29:28'),
(348, 7, 'Steven John A. Agustin', 'teacher', 'SET_SUBJECT_YEAR_LEVEL', 'Class Setup', '', 'Integrative Programming', 'Set subject: Integrative Programming, year level: 3rd Year, class time: 07:51', '136.158.120.56', 'Chrome 146 · Windows 10', '2026-03-31 13:36:44'),
(349, 35, 'Natsu B. Dragneel', 'student', 'CLASS_ATTENDANCE_IN', 'Class Attendance', '1231231231231', 'Natsu B. Dragneel', 'Teacher: Steven John A. Agustin | Program: BS in Information Technology, Year: 3rd Year', NULL, NULL, '2026-03-31 13:37:31'),
(350, 23, 'Lucy A. Heartfilla', 'student', 'CLASS_ATTENDANCE_IN', 'Class Attendance', '1231333', 'Lucy A. Heartfilla', 'Teacher: Steven John A. Agustin | Program: BS in Information Technology, Year: 3rd Year', NULL, NULL, '2026-04-01 22:20:56'),
(351, 7, 'Steven John A. Agustin', 'teacher', 'SET_SUBJECT_YEAR_LEVEL', 'Class Setup', '', 'Integrative Programming', 'Set subject: Integrative Programming, year level: 3rd Year, class time: 22:55', '136.158.120.56', 'Chrome 146 · Windows 10', '2026-04-01 22:21:32'),
(352, 35, 'Natsu B. Dragneel', 'student', 'CLASS_ATTENDANCE_IN', 'Class Attendance', '1231231231231', 'Natsu B. Dragneel', 'Teacher: Steven John A. Agustin | Program: BS in Information Technology, Year: 3rd Year', NULL, NULL, '2026-04-01 22:22:37'),
(353, 7, 'Steven John A. Agustin', 'teacher', 'SET_SUBJECT_YEAR_LEVEL', 'Class Setup', '', 'Digital Marketing', 'Set subject: Digital Marketing, year level: 3rd Year, class time: 22:55', '136.158.120.56', 'Chrome 146 · Windows 10', '2026-04-01 22:24:59'),
(354, 7, 'Steven John A. Agustin', 'teacher', 'ADD_STUDENT_TO_CLASS', 'Student', '12334575', 'Maxene Franco', 'Added by Steven John A. Agustin — Program: BS in Information Technology, Year: 3rd Year', NULL, NULL, '2026-04-01 22:35:59'),
(355, 7, 'Steven John A. Agustin', 'teacher', 'SET_LOCATION', 'Location', '7', NULL, 'Set location: lat 16.0425, lng 120.3407, radius 50m', '136.158.120.56', 'Chrome 146 · Windows 10', '2026-04-01 22:45:07'),
(356, 46, 'Steven John Agustin (CoAST)', 'student', 'REGENERATE_BARCODE', 'Student', '', 'Steven John Agustin (CoAST)', 'Regenerated barcode — ID No: 1231377', '136.158.120.56', 'Chrome 146 · Windows 10', '2026-04-01 22:45:13'),
(357, 5, 'Gray Fullbusters', 'guard', 'EVENT_TIME_IN', 'Event Attendance', '1231377', 'Steven John A. Agustin (CoAST)', 'Event: Sample | Location: Main Gate', NULL, NULL, '2026-04-01 22:47:36'),
(358, 1, NULL, 'admin', 'CREATE_TEACHER', 'Teacher', '20', 'Charimea Selga', 'Registered teacher: charimea.selga.ecoast@panpacificu.edu.ph, Dept: BS in Computer Science', NULL, NULL, '2026-04-01 22:54:16'),
(359, 1, 'Super Administrator', 'super_admin', 'EDIT_STUDENT', 'Student', '', 'Maxene Franco', 'Edited student: Maxene Franco — BS in Computer Science 3rd Year', '136.158.120.56', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', '2026-04-01 22:57:37'),
(360, 7, 'Steven John A. Agustin', 'teacher', 'DELETE_STUDENT_RECORD', 'Student', '', 'Maxene Franco', 'Removed Maxene Franco from class', '136.158.120.56', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', '2026-04-01 22:57:45'),
(361, 1, 'Super Administrator', 'super_admin', 'ADD_PROGRAM', 'Program', '', 'kk', 'Added program: kk', '136.158.120.56', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', '2026-04-01 23:03:32'),
(362, 1, 'Super Administrator', 'super_admin', 'MAINTENANCE_TOGGLE', 'System', '', 'Maintenance ON', 'Maintenance mode turned ON', '136.158.120.56', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', '2026-04-01 23:08:14'),
(363, 1, 'Super Administrator', 'super_admin', 'MAINTENANCE_TOGGLE', 'System', '', 'Maintenance OFF', 'Maintenance mode turned OFF', '136.158.120.56', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', '2026-04-01 23:08:24'),
(364, 1, 'CSS Admin', 'admin', 'ADD_YEAR_LEVEL', 'Year Level', '', 'Kinder', 'Added year level: Kinder', '136.158.120.56', 'Chrome 146 · Windows 10', '2026-04-01 23:10:28'),
(365, 7, 'Steven John A. Agustin', 'teacher', 'SET_SUBJECT_YEAR_LEVEL', 'Class Setup', '', 'Programming', 'Set subject: Programming, year level: 3rd Year, class time: 22:55', '136.158.120.56', 'Chrome 146 · Windows 10', '2026-03-28 12:34:17'),
(366, NULL, NULL, 'admin', 'CREATE_GUARD', 'Guard', '11', 'Asuna Kirigaya', 'Registered guard: asuna@panpacificu.edu.ph, Location: Parking Area', NULL, NULL, '2026-03-28 15:31:56'),
(367, 1, 'Super Administrator', 'super_admin', 'CREATE_GUARD', 'Guard', '', 'Asuna Kirigaya', 'SuperAdmin registered guard: asuna@panpacificu.edu.ph, Location: Parking Area', '136.158.120.56', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', '2026-03-28 15:31:56'),
(368, NULL, NULL, 'admin', 'CREATE_TEACHER', 'Teacher', '21', 'Bill Gates', 'Registered teacher: bill@panpacificu.edu.ph, Dept: BS in Computer Engineering', NULL, NULL, '2026-03-28 15:32:09'),
(369, 1, 'Super Administrator', 'super_admin', 'CREATE_TEACHER', 'Teacher', '', 'Bill Gates', 'SuperAdmin registered teacher: bill@panpacificu.edu.ph, Dept: BS in Computer Engineering', '136.158.120.56', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', '2026-03-28 15:32:09'),
(370, 1, 'Super Administrator', 'super_admin', 'CREATE_STUDENT', 'Student', '', 'Darren James Agustin', 'SuperAdmin registered student: darren@panpacificu.edu.ph, Program: BS in Computer Engineering', '136.158.120.56', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', '2026-03-28 15:32:41'),
(371, NULL, 'Super Admin', 'super_admin', 'CREATE_ADMIN', 'Admin', '3', 'Gabriel C. Castillo', 'Created admin: gabriel@panpacificu.edu.ph', NULL, NULL, '2026-03-28 15:33:17'),
(372, 1, 'Super Administrator', 'super_admin', 'EDIT_TEACHER', 'Teacher', '21', 'Bill Gate', 'Edited teacher: Bill Gate', '136.158.120.56', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', '2026-03-28 15:33:33'),
(373, 1, 'Super Administrator', 'super_admin', 'EDIT_TEACHER', 'Teacher', '21', 'Bill Gates', 'Edited teacher: Bill Gates', '136.158.120.56', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', '2026-03-28 15:33:37'),
(374, 7, 'Steven John A. Agustin', 'teacher', 'ADD_STUDENT_TO_CLASS', 'Student', '67', 'Yuumi Kiyomi', 'Added by Steven John A. Agustin — Program: BS in Mechanics, Year: 2nd Year', NULL, NULL, '2026-03-28 16:22:15'),
(375, 1, 'Super Administrator', 'super_admin', 'SET_EVENT', 'Event', '', 'Fun run', 'Set system-wide event: Fun run', '136.158.120.56', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', '2026-03-28 16:40:53'),
(376, 7, 'Steven John A. Agustin', 'teacher', 'SET_SUBJECT_YEAR_LEVEL', 'Class Setup', '', 'Database Lec', 'Set subject: Database Lec, year level: 3rd Year, class time: 22:55', '136.158.120.56', 'Chrome 146 · Windows 10', '2026-03-28 16:46:29'),
(377, 7, 'Steven John A. Agustin', 'teacher', 'SET_SUBJECT_YEAR_LEVEL', 'Class Setup', '', 'Programming', 'Set subject: Programming, year level: 3rd Year, class time: 22:55', '136.158.120.56', 'Chrome 146 · Windows 10', '2026-03-28 16:47:03'),
(378, 7, 'Steven John A. Agustin', 'teacher', 'SET_LOCATION', 'Location', '7', NULL, 'Set location: lat 16.0425, lng 120.3407, radius 50m', '136.158.120.56', 'Chrome 146 · Windows 10', '2026-03-28 17:21:30'),
(379, 1, 'CSS Admin Cha', 'admin', 'CHANGE_NAME', 'Admin', '1', 'CSS Admin Cha', 'Changed name to: CSS Admin Cha', '182.255.40.171', 'Edge 146 · Windows 19', '2026-03-28 21:15:13'),
(380, 1, 'CSS Admin', 'admin', 'EDIT_STUDENT', 'Student', '', 'Andrea Lachica', 'Edited student: Andrea Lachica — BS in Information Technology 3rd Year', '182.255.40.171', 'Edge 146 · Windows 19', '2026-03-28 21:16:18'),
(381, NULL, NULL, 'admin', 'DELETE_STUDENT', 'Student', '51', NULL, 'Deleted student ID: 51', NULL, NULL, '2026-03-28 21:16:55'),
(382, 1, 'CSS Admin', 'admin', 'DELETE_STUDENT', 'Student', '', 'Ace-cin Kyoshi', 'Deleted student: Ace-cin Kyoshi', '182.255.40.171', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36 Edg/146.0.0.0', '2026-03-28 21:16:55'),
(383, 1, 'CSS Admin', 'admin', 'ADD_PROGRAM', 'Program', '', 'Bs Psychology', 'Added program: Bs Psychology', '182.255.40.171', 'Edge 146 · Windows 19', '2026-03-28 21:20:49'),
(384, 1, 'CSS Admin', 'admin', 'EDIT_TEACHER', 'Teacher', '', 'Bill Gates', 'Edited teacher: Bill Gates — bill@panpacificu.edu.ph', '182.255.40.171', 'Edge 146 · Windows 19', '2026-03-28 21:23:55'),
(385, 1, 'CSS Admin', 'admin', 'RESET_TEACHER_PASSWORD', 'Teacher', '21', NULL, 'Reset password for teacher ID: 21', '182.255.40.171', 'Edge 146 · Windows 19', '2026-03-28 21:24:36'),
(386, 1, NULL, 'admin', 'CREATE_TEACHER', 'Teacher', '22', 'Rose Chien', 'Registered teacher: rose@gmail.com, Dept: Bs Psychology', NULL, NULL, '2026-03-28 21:26:17'),
(387, 1, 'CSS Admin', 'admin', 'EDIT_GUARD', 'Guard', '', 'Chari Segla (Guard)', 'Edited guard: Chari Segla (Guard) — location: Parking Area', '182.255.40.171', 'Edge 146 · Windows 19', '2026-03-28 21:27:02'),
(388, 1, NULL, 'admin', 'DELETE_GUARD', 'Guard', '11', NULL, 'Deleted guard ID: 11', NULL, NULL, '2026-03-28 21:27:13'),
(389, 1, 'CSS Admin', 'admin', 'DELETE_GUARD', 'Guard', '', 'Asuna Kirigaya', 'Deleted guard: Asuna Kirigaya', '182.255.40.171', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36 Edg/146.0.0.0', '2026-03-28 21:27:13'),
(390, 1, NULL, 'admin', 'DELETE_GUARD', 'Guard', '11', NULL, 'Deleted guard ID: 11', NULL, NULL, '2026-03-28 21:27:33'),
(391, 1, 'CSS Admin', 'admin', 'DELETE_GUARD', 'Guard', '', 'Asuna Kirigaya', 'Deleted guard: Asuna Kirigaya', '182.255.40.171', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36 Edg/146.0.0.0', '2026-03-28 21:27:33'),
(392, 1, NULL, 'admin', 'DELETE_GUARD', 'Guard', '11', NULL, 'Deleted guard ID: 11', NULL, NULL, '2026-03-28 21:27:52'),
(393, 1, 'CSS Admin', 'admin', 'DELETE_GUARD', 'Guard', '', 'Asuna Kirigaya', 'Deleted guard: Asuna Kirigaya', '182.255.40.171', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36 Edg/146.0.0.0', '2026-03-28 21:27:52'),
(394, 1, NULL, 'admin', 'DELETE_GUARD', 'Guard', '11', NULL, 'Deleted guard ID: 11', NULL, NULL, '2026-03-28 21:31:16'),
(395, 1, 'CSS Admin', 'admin', 'DELETE_GUARD', 'Guard', '', 'Asuna Kirigaya', 'Deleted guard: Asuna Kirigaya', '182.255.40.171', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36 Edg/146.0.0.0', '2026-03-28 21:31:16'),
(396, 1, NULL, 'admin', 'DELETE_GUARD', 'Guard', '11', NULL, 'Deleted guard ID: 11', NULL, NULL, '2026-03-28 21:31:49'),
(397, 1, 'CSS Admin Cha', 'admin', 'DELETE_GUARD', 'Guard', '', 'Asuna Kirigaya', 'Deleted guard: Asuna Kirigaya', '136.158.120.56', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', '2026-03-28 21:31:49'),
(398, 1, NULL, 'admin', 'DELETE_GUARD', 'Guard', '11', NULL, 'Deleted guard ID: 11', NULL, NULL, '2026-03-28 21:31:53'),
(399, 1, 'CSS Admin Cha', 'admin', 'DELETE_GUARD', 'Guard', '', 'Asuna Kirigaya', 'Deleted guard: Asuna Kirigaya', '136.158.120.56', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', '2026-03-28 21:31:53'),
(400, 1, NULL, 'admin', 'DELETE_GUARD', 'Guard', '11', NULL, 'Deleted guard ID: 11', NULL, NULL, '2026-03-28 21:32:01'),
(401, 1, 'CSS Admin Cha', 'admin', 'DELETE_GUARD', 'Guard', '', 'Asuna Kirigaya', 'Deleted guard: Asuna Kirigaya', '136.158.120.56', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Mobile Safari/537.36', '2026-03-28 21:32:01'),
(402, 1, NULL, 'admin', 'DELETE_GUARD', 'Guard', '11', NULL, 'Deleted guard ID: 11', NULL, NULL, '2026-03-28 21:32:04'),
(403, 1, 'CSS Admin Cha', 'admin', 'DELETE_GUARD', 'Guard', '', 'Asuna Kirigaya', 'Deleted guard: Asuna Kirigaya', '136.158.120.56', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Mobile Safari/537.36', '2026-03-28 21:32:04'),
(404, 1, 'CSS Admin', 'admin', 'RESET_GUARD_PASSWORD', 'Guard', '10', NULL, 'Reset password for guard ID: 10', '182.255.40.171', 'Edge 146 · Windows 19', '2026-03-28 21:32:07'),
(405, 1, NULL, 'admin', 'CREATE_GUARD', 'Guard', '12', 'Anton', 'Registered guard: anton@gmail.com, Location: Main Gate', NULL, NULL, '2026-03-28 21:33:14'),
(406, 1, 'CSS Admin', 'admin', 'ADD_PROGRAM', 'Program', '', 'Bs Nursing', 'Added program: Bs Nursing', '182.255.40.171', 'Edge 146 · Windows 19', '2026-03-28 21:33:55'),
(407, 1, 'CSS Admin', 'admin', 'ADD_YEAR_LEVEL', 'Year Level', '', 'Irregular', 'Added year level: Irregular', '182.255.40.171', 'Edge 146 · Windows 19', '2026-03-28 21:34:26'),
(408, 1, 'CSS Admin', 'admin', 'DELETE_YEAR_LEVEL', 'Year Level', '', '2nd Year', 'Deleted year level: 2nd Year', '182.255.40.171', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36 Edg/146.0.0.0', '2026-03-28 21:34:34'),
(409, 1, 'CSS Admin', 'admin', 'ADD_YEAR_LEVEL', 'Year Level', '', '2nd Year', 'Added year level: 2nd Year', '182.255.40.171', 'Edge 146 · Windows 19', '2026-03-28 21:34:47'),
(410, 1, 'CSS Admin Cha', 'admin', 'DELETE_PROGRAM', 'Program', '', 'kk', 'Deleted program: kk', '136.158.120.56', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', '2026-03-28 21:35:12'),
(411, 1, 'CSS Admin', 'admin', 'SET_EVENT', 'Event', '', 'Mass', 'Set event name to: Mass', '182.255.40.171', 'Edge 146 · Windows 19', '2026-03-28 21:42:01'),
(412, 1, 'CSS Admin', 'admin', 'SET_EVENT', 'Event', '', 'Sail', 'Set event name to: Sail', '182.255.40.171', 'Edge 146 · Windows 19', '2026-03-28 21:43:05'),
(413, NULL, NULL, 'admin', 'DELETE_STUDENT', 'Student', '48', NULL, 'Deleted student ID: 48', NULL, NULL, '2026-03-28 21:51:55'),
(414, 1, 'CSS Admin Cha', 'admin', 'DELETE_STUDENT', 'Student', '', 'Albert Wesker', 'Deleted student: Albert Wesker', '182.255.40.171', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36 Edg/146.0.0.0', '2026-03-28 21:51:55'),
(415, 1, 'CSS Admin Cha', 'admin', 'EDIT_STUDENT', 'Student', '', 'Maxene Franco', 'Edited student: Maxene Franco — BS in Computer Science 2nd Year', '182.255.40.171', 'Edge 146 · Windows 19', '2026-03-28 21:52:14'),
(416, 1, NULL, 'admin', 'DELETE_TEACHER', 'Teacher', '22', NULL, 'Deleted teacher ID: 22', NULL, NULL, '2026-03-28 21:52:29'),
(417, 1, 'CSS Admin Cha', 'admin', 'DELETE_TEACHER', 'Teacher', '', 'Rose Chien', 'Deleted teacher: Rose Chien', '182.255.40.171', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36 Edg/146.0.0.0', '2026-03-28 21:52:29'),
(418, 20, 'Charimea Selga', 'teacher', 'SET_LOCATION', 'Location', '20', NULL, 'Set location: lat 15.986820340081675, lng 120.70427393430985, radius 50m', '182.255.40.171', 'Edge 146 · Windows 19', '2026-03-28 21:58:17'),
(419, 7, 'Steven John A. Agustin', 'teacher', 'SET_LOCATION', 'Location', '7', NULL, 'Set location: lat 15.986909175048254, lng 120.70788145065309, radius 50m', '182.255.40.171', 'Edge 146 · Windows 19', '2026-03-28 22:04:49'),
(420, 7, 'Steven John A. Agustin', 'teacher', 'EDIT_STUDENT_RECORD', 'Student', '21', 'Charimea Selga', 'Edited class record: 1231422', '182.255.40.171', 'Edge 146 · Windows 19', '2026-03-28 22:10:34'),
(421, 7, 'Steven John A. Agustin', 'teacher', 'DELETE_STUDENT_RECORD', 'Student', '', 'Jan Ray Aquino', 'Removed Jan Ray Aquino from class', '182.255.40.171', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36 Edg/146.0.0.0', '2026-03-28 22:10:54'),
(422, 7, 'Steven John A. Agustin', 'teacher', 'ADD_STUDENT_TO_CLASS', 'Student', '1231392', 'Jan Ray Aquino', 'Added by Steven John A. Agustin — Program: BS in Information Technology, Year: 3rd Year', NULL, NULL, '2026-03-28 22:11:50'),
(423, 7, 'Steven John A. Agustin', 'teacher', 'SET_SUBJECT_YEAR_LEVEL', 'Class Setup', '', 'Big Data', 'Set subject: Big Data, year level: 3rd Year, class time: 22:55', '182.255.40.171', 'Edge 146 · Windows 19', '2026-03-28 22:25:46'),
(424, 7, 'Steven John A. Agustin', 'teacher', 'ADD_SUBJECT', 'Subject', '', 'Cloud Computing', 'Added subject: Cloud Computing', '182.255.40.171', 'Edge 146 · Windows 19', '2026-03-28 22:29:44'),
(425, 1, NULL, 'admin', 'DELETE_GUARD', 'Guard', '6', NULL, 'Deleted guard ID: 6', NULL, NULL, '2026-03-29 01:04:20'),
(426, 1, 'CSS Admin Cha', 'admin', 'DELETE_GUARD', 'Guard', '', 'Metalman', 'Deleted guard: Metalman', '136.158.120.56', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', '2026-03-29 01:04:20'),
(427, 1, NULL, 'admin', 'DELETE_GUARD', 'Guard', '10', NULL, 'Deleted guard ID: 10', NULL, NULL, '2026-03-29 01:35:25'),
(428, 1, 'CSS Admin Cha', 'admin', 'DELETE_GUARD', 'Guard', '', 'Chari Segla (Guard)', 'Deleted guard: Chari Segla (Guard)', '136.158.120.56', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', '2026-03-29 01:35:25'),
(429, 1, 'CSS Admin Chariz', 'admin', 'CHANGE_NAME', 'Admin', '1', 'CSS Admin Chariz', 'Changed name to: CSS Admin Chariz', '136.158.120.56', 'Chrome 146 · Windows 10', '2026-03-29 02:09:05'),
(430, 7, 'Steven John A. Agustin', 'teacher', 'ADD_SUBJECT', 'Subject', '', 'Sample lng to', 'Added subject: Sample lng to', '136.158.120.56', 'Chrome 146 · Windows 10', '2026-03-29 03:25:56'),
(431, 1, 'Super Administrator', 'super_admin', 'SET_SUBJECT_YEAR_LEVEL', 'Class Setup', '7', 'Digital Marketing', 'SuperAdmin set subject: Digital Marketing, year level: 3rd Year for teacher: Steven John A. Agustin', '136.158.120.56', 'Chrome 146 · Windows 10', '2026-03-29 12:39:44'),
(432, 1, 'Super Administrator', 'super_admin', 'SET_SUBJECT_YEAR_LEVEL', 'Class Setup', '7', 'Sample lng to', 'SuperAdmin set subject: Sample lng to, year level: 3rd Year for teacher: Steven John A. Agustin', '136.158.120.56', 'Chrome 146 · Windows 10', '2026-03-29 12:39:49'),
(433, 1, 'Super Administrator', 'super_admin', 'SET_SUBJECT_YEAR_LEVEL', 'Class Setup', '7', 'Big Data', 'SuperAdmin set subject: Big Data, year level: 3rd Year for teacher: Steven John A. Agustin', '136.158.120.56', 'Chrome 146 · Windows 10', '2026-03-29 12:39:53'),
(434, 1, 'Super Administrator', 'super_admin', 'SET_SUBJECT_YEAR_LEVEL', 'Class Setup', '7', 'Sample lng to', 'SuperAdmin set subject: Sample lng to, year level: 3rd Year for teacher: Steven John A. Agustin', '136.158.120.56', 'Chrome 146 · Windows 10', '2026-03-29 12:40:21'),
(435, 1, 'Super Administrator', 'super_admin', 'SET_SUBJECT_YEAR_LEVEL', 'Class Setup', '7', 'Event-Driven Programming', 'SuperAdmin set subject: Event-Driven Programming, year level: 3rd Year for teacher: Steven John A. Agustin', '136.158.120.56', 'Chrome 146 · Windows 10', '2026-03-29 12:40:38'),
(436, 1, 'Super Administrator', 'super_admin', 'SET_SUBJECT_YEAR_LEVEL', 'Class Setup', '7', 'Integrative Programming', 'SuperAdmin set subject: Integrative Programming, year level: 3rd Year for teacher: Steven John A. Agustin', '136.158.120.56', 'Chrome 146 · Windows 10', '2026-03-29 12:40:43'),
(437, 1, 'Super Administrator', 'super_admin', 'SET_SUBJECT_YEAR_LEVEL', 'Class Setup', '7', 'Programming', 'SuperAdmin set subject: Programming, year level: 3rd Year for teacher: Steven John A. Agustin', '136.158.120.56', 'Chrome 146 · Windows 10', '2026-03-29 12:43:47'),
(438, 1, 'Super Administrator', 'super_admin', 'SET_SUBJECT_YEAR_LEVEL', 'Class Setup', '7', 'Sample lng to', 'SuperAdmin set subject: Sample lng to, year level: 3rd Year for teacher: Steven John A. Agustin', '136.158.120.56', 'Chrome 146 · Windows 10', '2026-03-29 12:43:51'),
(439, 1, 'Super Administrator', 'super_admin', 'SET_SUBJECT_YEAR_LEVEL', 'Class Setup', '7', 'Integrative Programming', 'SuperAdmin set subject: Integrative Programming, year level: 3rd Year for teacher: Steven John A. Agustin', '136.158.120.56', 'Chrome 146 · Windows 10', '2026-03-29 12:44:02'),
(440, 1, 'Super Administrator', 'super_admin', 'SET_SUBJECT_YEAR_LEVEL', 'Class Setup', '7', 'Sample lng to', 'SuperAdmin set subject: Sample lng to, year level: 3rd Year for teacher: Steven John A. Agustin', '136.158.120.56', 'Chrome 146 · Windows 10', '2026-03-29 12:44:09'),
(441, 1, 'Super Administrator', 'super_admin', 'SET_SUBJECT_YEAR_LEVEL', 'Class Setup', '7', 'Sample lng to', 'SuperAdmin set subject: Sample lng to, year level: 3rd Year for teacher: Steven John A. Agustin', '136.158.120.56', 'Chrome 146 · Windows 10', '2026-03-29 12:44:26'),
(442, 1, 'Super Administrator', 'super_admin', 'SET_SUBJECT_YEAR_LEVEL', 'Class Setup', '7', 'Integrative Programming', 'SuperAdmin set subject: Integrative Programming, year level: 3rd Year for teacher: Steven John A. Agustin', '136.158.120.56', 'Chrome 146 · Windows 10', '2026-03-29 12:53:13'),
(443, 1, 'Super Administrator', 'super_admin', 'SET_SUBJECT_YEAR_LEVEL', 'Class Setup', '7', 'Event-Driven Programming', 'SuperAdmin set subject: Event-Driven Programming, year level: 3rd Year for teacher: Steven John A. Agustin', '136.158.120.56', 'Chrome 146 · Windows 10', '2026-03-29 16:22:50'),
(444, 1, 'Super Administrator', 'super_admin', 'SET_SUBJECT_YEAR_LEVEL', 'Class Setup', '7', 'Big Data', 'SuperAdmin set subject: Big Data, year level: 3rd Year for teacher: Steven John A. Agustin', '136.158.120.56', 'Chrome 146 · Windows 10', '2026-03-29 16:30:56'),
(445, 7, 'Steven John A. Agustin', 'teacher', 'SET_SUBJECT_YEAR_LEVEL', 'Class Setup', '', 'Big Data', 'Set subject: Big Data, year level: 3rd Year, class time: 22:55', '136.158.120.56', 'Chrome 146 · Windows 10', '2026-03-29 16:31:55'),
(446, 1, 'CSS Admin Cha', 'admin', 'CHANGE_NAME', 'Admin', '1', 'CSS Admin Cha', 'Changed name to: CSS Admin Cha', '136.158.120.56', 'Chrome 146 · Windows 10', '2026-03-29 19:42:43'),
(447, 7, 'Steven John A. Agustin', 'teacher', 'SET_SUBJECT_YEAR_LEVEL', 'Class Setup', '', 'Sample lng to', 'Set subject: Sample lng to, year level: 3rd Year, class time: 22:55', '136.158.120.56', 'Chrome 146 · Windows 10', '2026-03-30 01:48:52'),
(448, 7, 'Steven John A. Agustin', 'teacher', 'SET_SUBJECT_YEAR_LEVEL', 'Class Setup', '', 'Sample lng to', 'Set subject: Sample lng to, year level: 3rd Year, class time: 22:55', '136.158.120.56', 'Chrome 146 · Windows 10', '2026-03-30 02:14:05'),
(449, 7, 'Steven John A. Agustin', 'teacher', 'SET_SUBJECT_YEAR_LEVEL', 'Class Setup', '', 'Programming', 'Set subject: Programming, year level: 3rd Year, class time: 22:55', '136.158.120.56', 'Chrome 146 · Windows 10', '2026-03-30 02:15:00'),
(450, 7, 'Steven John A. Agustin', 'teacher', 'SET_SUBJECT_YEAR_LEVEL', 'Class Setup', '', 'Cloud Computing', 'Set subject: Cloud Computing, year level: 3rd Year, class time: 07:50', '136.158.120.56', 'Chrome 146 · Windows 10', '2026-03-30 02:25:31'),
(451, 7, 'Steven John A. Agustin', 'teacher', 'SET_SUBJECT_YEAR_LEVEL', 'Class Setup', '', 'Cloud Computing', 'Set subject: Cloud Computing, year level: 3rd Year, class time: 07:50', '136.158.120.56', 'Chrome 146 · Windows 10', '2026-03-30 02:29:48'),
(452, 7, 'Steven John A. Agustin', 'teacher', 'SET_LOCATION', 'Location', '7', NULL, 'Set location: lat 16.014672250804875, lng 120.73966026306154, radius 95m', '136.158.120.56', 'Chrome 146 · Windows 10', '2026-03-30 02:37:23'),
(453, 7, 'Steven John A. Agustin', 'teacher', 'SET_LOCATION', 'Location', '7', NULL, 'Set location: lat 16.017250349534205, lng 120.7494878768921, radius 245m', '136.158.120.56', 'Chrome 146 · Windows 10', '2026-03-30 02:38:06'),
(454, 23, 'Lucy Heartfilla', 'student', 'REGENERATE_BARCODE', 'Student', '', 'Lucy Heartfilla', 'Regenerated barcode — ID No: 1231333', '136.158.120.56', 'Chrome 144 · Android 14 · Infinix X6731B', '2026-03-30 02:38:13'),
(455, 23, 'Lucy A. Heartfilla', 'student', 'CLASS_ATTENDANCE_IN', 'Class Attendance', '1231333', 'Lucy A. Heartfilla', 'Teacher: Steven John A. Agustin | Program: BS in Information Technology, Year: 3rd Year', NULL, NULL, '2026-03-30 02:38:24'),
(456, 35, 'Natsu Dragneel', 'student', 'REGENERATE_BARCODE', 'Student', '', 'Natsu Dragneel', 'Regenerated barcode — ID No: 1231231231231', '136.158.120.56', 'Chrome 144 · Android 14 · Infinix X6731B', '2026-03-30 02:39:52'),
(457, 35, 'Natsu B. Dragneel', 'student', 'CLASS_ATTENDANCE_IN', 'Class Attendance', '1231231231231', 'Natsu B. Dragneel', 'Teacher: Steven John A. Agustin | Program: BS in Information Technology, Year: 3rd Year', NULL, NULL, '2026-03-30 02:40:02'),
(458, 7, 'Steven John A. Agustin', 'teacher', 'SET_SUBJECT_YEAR_LEVEL', 'Class Setup', '', 'Sample lng to', 'Set subject: Sample lng to, year level: 3rd Year, class time: 07:50', '136.158.120.56', 'Chrome 146 · Windows 10', '2026-03-30 02:41:02'),
(459, 35, 'Natsu B. Dragneel', 'student', 'CLASS_ATTENDANCE_IN', 'Class Attendance', '1231231231231', 'Natsu B. Dragneel', 'Teacher: Steven John A. Agustin | Program: BS in Information Technology, Year: 3rd Year', NULL, NULL, '2026-03-30 02:41:10'),
(460, 7, 'Steven John A. Agustin', 'teacher', 'SET_SUBJECT_YEAR_LEVEL', 'Class Setup', '', 'Sample lng to', 'Set subject: Sample lng to, year level: 3rd Year, class time: 01:50', '136.158.120.56', 'Chrome 146 · Windows 10', '2026-03-30 02:41:37'),
(461, 23, 'Lucy A. Heartfilla', 'student', 'CLASS_ATTENDANCE_IN', 'Class Attendance', '1231333', 'Lucy A. Heartfilla', 'Teacher: Steven John A. Agustin | Program: BS in Information Technology, Year: 3rd Year', NULL, NULL, '2026-03-30 02:42:22'),
(462, 7, 'Steven John A. Agustin', 'teacher', 'SET_SUBJECT_YEAR_LEVEL', 'Class Setup', '', 'Database Lec', 'Set subject: Database Lec, year level: 3rd Year, class time: 04:50', '136.158.120.56', 'Chrome 146 · Windows 10', '2026-03-30 02:43:39'),
(463, 23, 'Lucy A. Heartfilla', 'student', 'CLASS_ATTENDANCE_IN', 'Class Attendance', '1231333', 'Lucy A. Heartfilla', 'Teacher: Steven John A. Agustin | Program: BS in Information Technology, Year: 3rd Year', NULL, NULL, '2026-03-30 02:43:53');
INSERT INTO `system_activity_logs` (`log_id`, `actor_id`, `actor_name`, `actor_role`, `action`, `target_type`, `target_id`, `target_name`, `details`, `ip_address`, `device_info`, `performed_at`) VALUES
(464, 7, 'Steven John A. Agustin', 'teacher', 'SET_SUBJECT_YEAR_LEVEL', 'Class Setup', '', 'Database Lec', 'Set subject: Database Lec, year level: 3rd Year, class time: 04:50', '136.158.120.56', 'Chrome 146 · Windows 10', '2026-03-30 02:45:01'),
(465, 1, 'Super Administrator', 'super_admin', 'MAINTENANCE_TOGGLE', 'System', '', 'Maintenance ON', 'Maintenance mode turned ON', '136.158.120.56', 'Chrome 146 · Windows 10', '2026-03-30 02:53:56'),
(466, 1, 'Super Administrator', 'super_admin', 'MAINTENANCE_TOGGLE', 'System', '', 'Maintenance OFF', 'Maintenance mode turned OFF', '136.158.120.56', 'Chrome 146 · Windows 10', '2026-03-30 02:54:27'),
(467, 7, 'Steven John A. Agustin', 'teacher', 'SET_SUBJECT_YEAR_LEVEL', 'Class Setup', '', 'Cloud Computing', 'Set subject: Cloud Computing, year level: 3rd Year, class time: 04:50', '136.158.120.56', 'Chrome 146 · Windows 10', '2026-03-30 03:00:26'),
(468, 23, 'Lucy A. Heartfilla', 'student', 'CLASS_ATTENDANCE_IN', 'Class Attendance', '1231333', 'Lucy A. Heartfilla', 'Teacher: Steven John A. Agustin | Program: BS in Information Technology, Year: 3rd Year', NULL, NULL, '2026-03-30 03:00:49'),
(469, 7, 'Steven John A. Agustin', 'teacher', 'SET_SUBJECT_YEAR_LEVEL', 'Class Setup', '', 'Cloud Computing', 'Set subject: Cloud Computing, year level: 3rd Year, class time: 04:50', '136.158.120.56', 'Chrome 146 · Windows 10', '2026-03-30 03:06:53'),
(470, 7, 'Steven John A. Agustin', 'teacher', 'SET_SUBJECT_YEAR_LEVEL', 'Class Setup', '', 'Cloud Computing', 'Set subject: Cloud Computing, year level: 3rd Year, class time: 04:50', '136.158.120.56', 'Chrome 146 · Windows 10', '2026-03-30 03:07:04'),
(471, 7, 'Steven John A. Agustin', 'teacher', 'SET_SUBJECT_YEAR_LEVEL', 'Class Setup', '', 'Cloud Computing', 'Set subject: Cloud Computing, year level: 3rd Year, class time: 04:50', '136.158.120.56', 'Chrome 146 · Windows 10', '2026-03-30 03:08:49'),
(472, 7, 'Steven John A. Agustin', 'teacher', 'SET_SUBJECT_YEAR_LEVEL', 'Class Setup', '', 'Cloud Computing', 'Set subject: Cloud Computing, year level: 3rd Year, class time: 04:50', '136.158.120.56', 'Chrome 146 · Windows 10', '2026-03-30 03:08:58'),
(473, 7, 'Steven John A. Agustin', 'teacher', 'SET_SUBJECT_YEAR_LEVEL', 'Class Setup', '', 'Cloud Computing', 'Set subject: Cloud Computing, year level: 3rd Year, class time: 04:50', '136.158.120.56', 'Chrome 146 · Windows 10', '2026-03-30 03:09:03'),
(474, 7, 'Steven John A. Agustin', 'teacher', 'SET_SUBJECT_YEAR_LEVEL', 'Class Setup', '', 'Programming', 'Set subject: Programming, year level: 3rd Year, class time: 04:50', '136.158.120.56', 'Chrome 146 · Windows 10', '2026-03-31 02:18:58'),
(475, 7, 'Steven John A. Agustin', 'teacher', 'SET_LOCATION', 'Location', '7', NULL, 'Set location: lat 16.0425, lng 120.3407, radius 50m', '136.158.120.56', 'Chrome 146 · Windows 10', '2026-03-31 16:14:37'),
(476, 46, 'Steven John Agustin (CoAST)', 'student', 'REGENERATE_BARCODE', 'Student', '', 'Steven John Agustin (CoAST)', 'Regenerated barcode — ID No: 1231377', '136.158.120.56', 'Chrome 146 · Windows 10', '2026-03-31 16:14:43'),
(477, 1, 'Super Administrator', 'super_admin', 'SET_EVENT', 'Event', '', 'Sail- 2026', 'Set system-wide event: Sail- 2026', '143.44.216.7', 'Chrome 146 · Windows 19', '2026-03-31 16:15:01'),
(478, 1, 'Super Administrator', 'super_admin', 'RESET_STUDENT_DEVICE', 'Student', '35', 'Natsu Dragneel', 'Device binding reset for: Natsu Dragneel', '143.44.216.7', 'Chrome 146 · Windows 19', '2026-03-31 16:17:23'),
(479, 35, 'Natsu Dragneel', 'student', 'REGENERATE_BARCODE', 'Student', '', 'Natsu Dragneel', 'Regenerated barcode — ID No: 1231231231231', '136.158.120.56', 'Chrome 146 · Windows 10', '2026-03-31 16:17:39'),
(480, 5, 'Gray Fullbusters', 'guard', 'EVENT_TIME_IN', 'Event Attendance', '1231231231231', 'Natsu B. Dragneel', 'Event: Sail- 2026 | Location: Main Gate', NULL, NULL, '2026-03-31 16:17:46'),
(481, 5, 'Gray Fullbusters', 'guard', 'EVENT_TIME_OUT', 'Event Attendance', '1231231231231', 'Natsu B. Dragneel', 'Event: Sail- 2026 | Location: Main Gate', NULL, NULL, '2026-03-31 16:19:13'),
(482, 7, 'Steven John A. Agustin', 'teacher', 'SET_SUBJECT_YEAR_LEVEL', 'Class Setup', '', 'Event-Driven Programming', 'Set subject: Event-Driven Programming, year level: 3rd Year, class time: 04:50', '182.255.40.171', 'Edge 146 · Windows 19', '2026-03-31 16:20:35'),
(483, 7, 'Steven John A. Agustin', 'teacher', 'ADD_STUDENT_TO_CLASS', 'Student', '456', 'Andria Ramirez', 'Added by Steven John A. Agustin — Program: BS Education, Year: 1st Year', NULL, NULL, '2026-03-31 16:21:04'),
(484, 7, 'Steven John A. Agustin', 'teacher', 'EDIT_STUDENT_RECORD', 'Student', '68', 'Andria Ramirez', 'Edited class record: 456781', '182.255.40.171', 'Edge 146 · Windows 19', '2026-03-31 16:21:33'),
(485, 7, 'Steven John A. Agustin', 'teacher', 'DELETE_STUDENT_RECORD', 'Student', '', 'Andria Ramirez', 'Removed Andria Ramirez from class', '182.255.40.171', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36 Edg/146.0.0.0', '2026-03-31 16:21:40'),
(486, 1, 'Super Administrator', 'super_admin', 'EDIT_STUDENT', 'Student', '', 'Jasmin Pastor', 'Edited student: Jasmin Pastor —  SBE', '143.44.216.7', 'Chrome 146 · Windows 19', '2026-03-31 16:23:13'),
(487, 7, 'Steven John A. Agustin', 'teacher', 'SET_SUBJECT_YEAR_LEVEL', 'Class Setup', '', 'Big Data', 'Set subject: Big Data, year level: 3rd Year, class time: 04:50', '182.255.40.171', 'Edge 146 · Windows 19', '2026-03-31 16:30:18'),
(488, 1, 'Super Administrator', 'super_admin', 'SET_SUBJECT_YEAR_LEVEL', 'Class Setup', '7', 'Database Lec', 'SuperAdmin set subject: Database Lec, year level: 3rd Year for teacher: Steven John A. Agustin', '143.44.216.7', 'Chrome 146 · Windows 19', '2026-03-31 16:32:18'),
(489, 7, 'Steven John A. Agustin', 'teacher', 'SET_LOCATION', 'Location', '7', NULL, 'Set location: lat 16.01570349429245, lng 120.74438095092775, radius 500m', '136.158.120.56', 'Chrome 146 · Windows 10', '2026-03-31 16:33:14'),
(490, 7, 'Steven John A. Agustin', 'teacher', 'SET_LOCATION', 'Location', '7', NULL, 'Set location: lat 16.01438350167366, lng 120.73940277099611, radius 500m', '136.158.120.56', 'Chrome 146 · Windows 10', '2026-03-31 16:33:33'),
(491, 7, 'Steven John A. Agustin', 'teacher', 'SET_LOCATION', 'Location', '7', NULL, 'Set location: lat 16.01727097418978, lng 120.74935913085939, radius 500m', '136.158.120.56', 'Chrome 146 · Windows 10', '2026-03-31 16:33:53'),
(492, 23, 'Lucy Heartfilla', 'student', 'REGENERATE_BARCODE', 'Student', '', 'Lucy Heartfilla', 'Regenerated barcode — ID No: 1231333', '136.158.120.56', 'Chrome 144 · Android 14 · Infinix X6731B', '2026-03-31 16:33:59'),
(493, 23, 'Lucy A. Heartfilla', 'student', 'CLASS_ATTENDANCE_IN', 'Class Attendance', '1231333', 'Lucy A. Heartfilla', 'Teacher: Steven John A. Agustin | Program: BS in Information Technology, Year: 3rd Year', NULL, NULL, '2026-03-31 16:34:42'),
(494, 1, 'Super Administrator', 'super_admin', 'DELETE_YEAR_LEVEL', 'Year Level', '', 'Kinder', 'Deleted year level: Kinder', '143.44.216.7', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', '2026-03-31 16:36:50'),
(495, 1, 'Super Administrator', 'super_admin', 'SET_LOCATION', 'Location', '7', NULL, 'SuperAdmin set location for teacher: Steven John A. Agustin — lat 16.0425, lng 120.3407, radius 50m', '136.158.120.56', 'Chrome 146 · Windows 10', '2026-03-31 16:46:37'),
(496, 35, 'Natsu Dragneel', 'student', 'REGENERATE_BARCODE', 'Student', '', 'Natsu Dragneel', 'Regenerated barcode — ID No: 1231231231231', '136.158.120.56', 'Chrome 146 · Windows 10', '2026-03-31 16:46:47'),
(497, 1, 'Super Administrator', 'super_admin', 'SET_LOCATION', 'Location', '7', NULL, 'SuperAdmin set location for teacher: Steven John A. Agustin — lat 16.043565675503334, lng 120.33443212509157, radius 50m', '136.158.120.56', 'Chrome 146 · Windows 10', '2026-03-31 16:46:57'),
(498, 1, 'Super Administrator', 'super_admin', 'MAINTENANCE_TOGGLE', 'System', '', 'Maintenance ON', 'Maintenance mode turned ON', '143.44.216.7', 'Chrome 146 · Windows 19', '2026-03-31 17:31:35'),
(499, 1, 'Super Administrator', 'super_admin', 'MAINTENANCE_TOGGLE', 'System', '', 'Maintenance OFF', 'Maintenance mode turned OFF', '143.44.216.7', 'Chrome 146 · Windows 19', '2026-03-31 17:31:42'),
(500, 1, 'Super Administrator', 'super_admin', 'SET_SUBJECT_YEAR_LEVEL', 'Class Setup', '7', 'Event-Driven Programming', 'SuperAdmin set subject: Event-Driven Programming, year level: 3rd Year for teacher: Steven John A. Agustin', '136.158.120.56', 'Chrome 146 · Windows 10', '2026-03-31 20:40:25'),
(501, 1, 'Super Administrator', 'super_admin', 'RESET_STUDENT_DEVICE', 'Student', '53', 'Darren James Agustin', 'Device binding reset for: Darren James Agustin', '182.255.40.171', 'Edge 146 · Windows 19', '2026-03-31 21:05:34'),
(502, 7, 'Steven John A. Agustin', 'teacher', 'EDIT_STUDENT_RECORD', 'Student', '21', 'Charimea Selga', 'Edited class record: 1231422', '182.255.40.171', 'Edge 146 · Windows 19', '2026-03-31 21:26:33'),
(503, 7, 'Steven John A. Agustin', 'teacher', 'CHANGE_NAME', 'Teacher', '7', 'Steven John A. Agustin', 'Changed name to: Steven John A. Agustin', '182.255.40.171', 'Edge 146 · Windows 19', '2026-03-31 21:29:51'),
(504, 1, 'Super Administrator', 'super_admin', 'RESET_STUDENT_DEVICE', 'Student', '19', 'Charimea Selga', 'Device binding reset for: Charimea Selga', '182.255.40.171', 'Edge 146 · Windows 19', '2026-03-31 21:44:25'),
(505, 1, 'Super Administrator', 'super_admin', 'RESET_STUDENT_DEVICE', 'Student', '19', 'Charimea Selga', 'Device binding reset for: Charimea Selga', '182.255.40.171', 'Edge 146 · Windows 19', '2026-03-31 21:47:42'),
(506, 1, 'Super Administrator', 'super_admin', 'RESET_STUDENT_DEVICE', 'Student', '19', 'Charimea Selga', 'Device binding reset for: Charimea Selga', '182.255.40.171', 'Edge 146 · Windows 19', '2026-03-31 21:49:36'),
(507, 1, 'Super Administrator', 'super_admin', 'RESET_GUARD_PASSWORD', 'Guard', '12', NULL, 'Reset password for guard ID: 12', '182.255.40.171', 'Edge 146 · Windows 19', '2026-03-31 21:57:04'),
(508, 1, 'CSS Admin Cha', 'admin', 'SET_EVENT', 'Event', '', 'Sail- 2026', 'Set event name to: Sail- 2026', '49.150.35.37', 'Chrome 146 · Windows 10', '2026-03-31 22:00:59'),
(509, 54, 'Dwynna Chu', 'student', 'UPDATE_PROFILE', 'Student', '', 'Dwynna Chu', 'Updated profile — ID No: 234', '143.44.216.7', 'Chrome 146 · Windows 19', '2026-03-31 23:45:21'),
(510, 1, 'Super Administrator', 'super_admin', 'SET_EVENT', 'Event', '', 'Sports Day', 'Set system-wide event: Sports Day', '143.44.216.7', 'Chrome 146 · Windows 19', '2026-04-01 13:27:13'),
(511, 7, 'Steven John A. Agustin', 'teacher', 'DELETE_STUDENT_RECORD', 'Student', '', 'Princess Obillo (ECoAST)', 'Removed Princess Obillo (ECoAST) from class', '143.44.216.7', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', '2026-04-01 21:21:21'),
(512, 7, 'Steven John A. Agustin', 'teacher', 'DELETE_STUDENT_RECORD', 'Student', '', 'Angel Mageri Cabote (ECoAST)', 'Removed Angel Mageri Cabote (ECoAST) from class', '143.44.216.7', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', '2026-04-01 21:21:27'),
(513, 7, 'Steven John A. Agustin', 'teacher', 'DELETE_STUDENT_RECORD', 'Student', '', 'Marfel Gem Gallarde (ECoAST)', 'Removed Marfel Gem Gallarde (ECoAST) from class', '143.44.216.7', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', '2026-04-01 21:21:35'),
(514, 7, 'Steven John A. Agustin', 'teacher', 'SET_LOCATION', 'Location', '7', NULL, 'Set location: lat 16.02562168702326, lng 120.77627015134075, radius 255m', '143.44.216.7', 'Chrome 146 · Windows 19', '2026-04-01 21:35:46'),
(515, 1, NULL, 'admin', 'CREATE_TEACHER', 'Teacher', '23', 'Olivia Q. Sanquez', 'Registered teacher: olivia@gmail.com, Dept: BS in Mechanics', NULL, NULL, '2026-04-02 15:35:52'),
(516, 7, 'Steven John A. Agustin', 'teacher', 'SET_LOCATION', 'Location', '7', NULL, 'Set location: lat 16.0262071, lng 120.7763819, radius 50m', '143.44.216.7', 'Chrome 146 · Android 16 · SM-A156E', '2026-04-04 21:44:31'),
(517, 1, 'Super Administrator', 'super_admin', 'SET_LOCATION', 'Location', '7', NULL, 'SuperAdmin set location for teacher: Steven John A. Agustin — lat 16.0425, lng 120.3407, radius 50m', '136.158.120.56', 'Chrome 146 · Windows 10', '2026-04-04 21:47:30'),
(518, 7, 'Steven John A. Agustin', 'teacher', 'ADD_STUDENT_TO_CLASS', 'Student', '8700', 'Andrea Mulach', 'Added by Steven John A. Agustin — Program: Bs Psychology, Year: 3rd Year', NULL, NULL, '2026-04-04 21:49:41'),
(519, 1, 'Super Administrator', 'super_admin', 'SET_EVENT', 'Event', '', 'Student Night', 'Set system-wide event: Student Night', '143.44.216.7', 'Chrome 146 · Windows 19', '2026-04-04 21:50:48'),
(520, 1, 'Super Administrator', 'super_admin', 'RESET_STUDENT_DEVICE', 'Student', '55', 'Andrea Mulach', 'Device binding reset for: Andrea Mulach', '143.44.216.7', 'Chrome 146 · Windows 19', '2026-04-04 21:53:11'),
(521, 7, 'Steven John A. Agustin', 'teacher', 'SET_LOCATION', 'Location', '7', NULL, 'Set location: lat 16.025591, lng 120.77629850000001, radius 130m', '143.44.216.7', 'Chrome 146 · Windows 19', '2026-04-04 21:54:33'),
(522, 55, 'Andrea Mulach', 'student', 'REGENERATE_BARCODE', 'Student', '', 'Andrea Mulach', 'Regenerated barcode — ID No: 8700', '143.44.216.7', 'Chrome 146 · Android 16 · SM-A156E', '2026-04-04 21:54:36'),
(523, 5, 'Gray Fullbusters', 'guard', 'EVENT_TIME_IN', 'Event Attendance', '8700', 'Andrea L. Mulach', 'Event: Student Night | Location: Main Gate', NULL, NULL, '2026-04-04 21:55:54'),
(524, 5, 'Gray Fullbusters', 'guard', 'EVENT_TIME_OUT', 'Event Attendance', '8700', 'Andrea L. Mulach', 'Event: Student Night | Location: Main Gate', NULL, NULL, '2026-04-04 21:56:55'),
(525, 1, 'Super Administrator', 'super_admin', 'RESET_STUDENT_PASSWORD', 'Student', '55', NULL, 'Reset password for student ID: 55', '143.44.216.7', 'Chrome 146 · Windows 19', '2026-04-04 22:41:49'),
(526, NULL, NULL, 'admin', 'DELETE_STUDENT', 'Student', '50', NULL, 'Deleted student ID: 50', NULL, NULL, '2026-04-04 22:43:19'),
(527, 1, 'Super Administrator', 'super_admin', 'DELETE_STUDENT', 'Student', '', 'Gabriel Castillo (ECoAST)', 'Deleted student: Gabriel Castillo (ECoAST)', '143.44.216.7', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', '2026-04-04 22:43:19'),
(528, NULL, NULL, 'admin', 'DELETE_STUDENT', 'Student', '41', NULL, 'Deleted student ID: 41', NULL, NULL, '2026-04-04 22:44:28'),
(529, 1, 'Super Administrator', 'super_admin', 'DELETE_STUDENT', 'Student', '', 'Angel Mageri Cabote (ECoAST)', 'Deleted student: Angel Mageri Cabote (ECoAST)', '143.44.216.7', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', '2026-04-04 22:44:28'),
(530, NULL, NULL, 'admin', 'DELETE_STUDENT', 'Student', '32', NULL, 'Deleted student ID: 32', NULL, NULL, '2026-04-04 22:44:34'),
(531, 1, 'Super Administrator', 'super_admin', 'DELETE_STUDENT', 'Student', '', 'Princess Obillo (ECoAST)', 'Deleted student: Princess Obillo (ECoAST)', '143.44.216.7', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', '2026-04-04 22:44:34'),
(532, NULL, NULL, 'admin', 'DELETE_STUDENT', 'Student', '33', NULL, 'Deleted student ID: 33', NULL, NULL, '2026-04-04 22:44:45'),
(533, 1, 'Super Administrator', 'super_admin', 'DELETE_STUDENT', 'Student', '', 'Marfel Gem Gallarde (ECoAST)', 'Deleted student: Marfel Gem Gallarde (ECoAST)', '143.44.216.7', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', '2026-04-04 22:44:45'),
(534, NULL, NULL, 'admin', 'DELETE_STUDENT', 'Student', '52', NULL, 'Deleted student ID: 52', NULL, NULL, '2026-04-04 22:44:53'),
(535, 1, 'Super Administrator', 'super_admin', 'DELETE_STUDENT', 'Student', '', 'Maxene Franco', 'Deleted student: Maxene Franco', '143.44.216.7', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', '2026-04-04 22:44:53'),
(536, 1, 'Super Administrator', 'super_admin', 'CREATE_STUDENT', 'Student', '', 'Mica Mosser', 'SuperAdmin registered student: mosser@gmail.com, Program: BS Education', '143.44.216.7', 'Chrome 146 · Windows 19', '2026-04-04 22:49:16'),
(537, 1, 'Super Administrator', 'super_admin', 'DELETE_PROGRAM', 'Program', '', 'BS in Information Technology', 'Deleted program: BS in Information Technology', '143.44.216.7', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', '2026-04-04 22:51:46'),
(538, 1, 'Super Administrator', 'super_admin', 'ADD_PROGRAM', 'Program', '', 'BS in Information Technology', 'Added program: BS in Information Technology', '143.44.216.7', 'Chrome 146 · Windows 19', '2026-04-04 22:51:55'),
(539, 1, 'Super Administrator', 'super_admin', 'DELETE_PROGRAM', 'Program', '', 'BS Education', 'Deleted program: BS Education', '143.44.216.7', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', '2026-04-04 22:52:05'),
(540, 1, 'Super Administrator', 'super_admin', 'ADD_PROGRAM', 'Program', '', 'BS in Education', 'Added program: BS in Education', '143.44.216.7', 'Chrome 146 · Windows 19', '2026-04-04 22:52:54'),
(541, 1, 'Super Administrator', 'super_admin', 'EDIT_STUDENT', 'Student', '', 'Mica Mosser', 'Edited student: Mica Mosser — BS in Education 3rd Year', '143.44.216.7', 'Chrome 146 · Windows 19', '2026-04-04 22:53:18'),
(542, 1, 'Super Administrator', 'super_admin', 'EDIT_STUDENT', 'Student', '', 'Mica Mosser', 'Edited student: Mica Mosser — BS Education 1st Year', '49.150.35.37', 'Chrome 145 · Android 11 · RMX2061', '2026-04-04 22:53:54'),
(543, 1, 'Super Administrator', 'super_admin', 'DELETE_PROGRAM', 'Program', '', 'BS in Education', 'Deleted program: BS in Education', '143.44.216.7', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', '2026-04-04 22:55:43'),
(544, 1, 'Super Administrator', 'super_admin', 'DELETE_PROGRAM', 'Program', '', 'BS in Information Technology', 'Deleted program: BS in Information Technology', '143.44.216.7', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', '2026-04-04 22:55:50'),
(545, 1, 'Super Administrator', 'super_admin', 'DELETE_PROGRAM', 'Program', '', 'Bs Nursing', 'Deleted program: Bs Nursing', '143.44.216.7', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', '2026-04-04 22:55:54'),
(546, 1, 'Super Administrator', 'super_admin', 'DELETE_PROGRAM', 'Program', '', 'BS in Computer Science', 'Deleted program: BS in Computer Science', '143.44.216.7', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', '2026-04-04 22:56:01'),
(547, 1, 'Super Administrator', 'super_admin', 'DELETE_PROGRAM', 'Program', '', 'BS in Criminology', 'Deleted program: BS in Criminology', '143.44.216.7', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', '2026-04-04 22:56:05'),
(548, 1, 'Super Administrator', 'super_admin', 'DELETE_PROGRAM', 'Program', '', 'BS in Computer Engineering', 'Deleted program: BS in Computer Engineering', '143.44.216.7', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', '2026-04-04 22:56:09'),
(549, 1, 'Super Administrator', 'super_admin', 'DELETE_PROGRAM', 'Program', '', 'RPSEA', 'Deleted program: RPSEA', '143.44.216.7', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', '2026-04-04 22:56:13'),
(550, 1, 'Super Administrator', 'super_admin', 'DELETE_PROGRAM', 'Program', '', 'BS in Mechanics', 'Deleted program: BS in Mechanics', '143.44.216.7', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', '2026-04-04 22:56:18'),
(551, 1, 'Super Administrator', 'super_admin', 'DELETE_PROGRAM', 'Program', '', 'Bs Psychology', 'Deleted program: Bs Psychology', '143.44.216.7', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', '2026-04-04 22:56:23'),
(552, 1, 'Super Administrator', 'super_admin', 'ADD_PROGRAM', 'Program', '', 'Kinder Section 1', 'Added program: Kinder Section 1', '143.44.216.7', 'Chrome 146 · Windows 19', '2026-04-04 22:56:44'),
(553, 1, 'Super Administrator', 'super_admin', 'ADD_PROGRAM', 'Program', '', 'Grade 1', 'Added program: Grade 1', '143.44.216.7', 'Chrome 146 · Windows 19', '2026-04-04 22:56:58'),
(554, 1, 'Super Administrator', 'super_admin', 'ADD_PROGRAM', 'Program', '', 'Grade 6', 'Added program: Grade 6', '143.44.216.7', 'Chrome 146 · Windows 19', '2026-04-04 22:57:06'),
(555, 1, 'Super Administrator', 'super_admin', 'ADD_PROGRAM', 'Program', '', 'Grade 7', 'Added program: Grade 7', '143.44.216.7', 'Chrome 146 · Windows 19', '2026-04-04 22:57:15'),
(556, 1, 'Super Administrator', 'super_admin', 'ADD_PROGRAM', 'Program', '', 'Grade 10', 'Added program: Grade 10', '143.44.216.7', 'Chrome 146 · Windows 19', '2026-04-04 22:57:23'),
(557, 1, 'Super Administrator', 'super_admin', 'ADD_PROGRAM', 'Program', '', 'Grade 12 – GAS', 'Added program: Grade 12 – GAS', '143.44.216.7', 'Chrome 146 · Windows 19', '2026-04-04 22:57:35'),
(558, 1, 'Super Administrator', 'super_admin', 'ADD_PROGRAM', 'Program', '', 'Grade 12 – ABM', 'Added program: Grade 12 – ABM', '143.44.216.7', 'Chrome 146 · Windows 19', '2026-04-04 22:57:49'),
(559, 1, 'Super Administrator', 'super_admin', 'ADD_PROGRAM', 'Program', '', 'Grade 12 – STEM', 'Added program: Grade 12 – STEM', '143.44.216.7', 'Chrome 146 · Windows 19', '2026-04-04 22:58:17'),
(560, 1, 'Super Administrator', 'super_admin', 'ADD_PROGRAM', 'Program', '', 'Grade 11 – STEM', 'Added program: Grade 11 – STEM', '143.44.216.7', 'Chrome 146 · Windows 19', '2026-04-04 22:58:42'),
(561, 1, 'Super Administrator', 'super_admin', 'ADD_PROGRAM', 'Program', '', 'Bachelor of Science in Information Technology', 'Added program: Bachelor of Science in Information Technology', '143.44.216.7', 'Chrome 146 · Windows 19', '2026-04-04 22:58:55'),
(562, 1, 'Super Administrator', 'super_admin', 'ADD_PROGRAM', 'Program', '', 'Bachelor of Science in Computer Science', 'Added program: Bachelor of Science in Computer Science', '143.44.216.7', 'Chrome 146 · Windows 19', '2026-04-04 22:59:05'),
(563, 1, 'Super Administrator', 'super_admin', 'ADD_PROGRAM', 'Program', '', 'Bachelor of Science in Business Administration', 'Added program: Bachelor of Science in Business Administration', '143.44.216.7', 'Chrome 146 · Windows 19', '2026-04-04 22:59:15'),
(564, 1, 'Super Administrator', 'super_admin', 'ADD_PROGRAM', 'Program', '', 'Bachelor of Secondary Education', 'Added program: Bachelor of Secondary Education', '143.44.216.7', 'Chrome 146 · Windows 19', '2026-04-04 22:59:27'),
(565, 1, 'Super Administrator', 'super_admin', 'ADD_PROGRAM', 'Program', '', 'Bachelor of Elementary Education', 'Added program: Bachelor of Elementary Education', '143.44.216.7', 'Chrome 146 · Windows 19', '2026-04-04 22:59:38'),
(566, 1, 'Super Administrator', 'super_admin', 'EDIT_STUDENT', 'Student', '', 'Darren James Agustin', 'Edited student: Darren James Agustin — Bachelor of Science in Computer Science 3rd Year', '143.44.216.7', 'Chrome 146 · Windows 19', '2026-04-04 23:00:09'),
(567, 1, 'Super Administrator', 'super_admin', 'EDIT_STUDENT', 'Student', '', 'Andrea Mulach', 'Edited student: Andrea Mulach — Bachelor of Science in Business Administration 3rd Year', '143.44.216.7', 'Chrome 146 · Windows 19', '2026-04-04 23:00:29'),
(568, 1, 'Super Administrator', 'super_admin', 'DELETE_TEACHER', 'Teacher', '', 'Olivia Q. Sanquez', 'Deleted teacher: Olivia Q. Sanquez', '143.44.216.7', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', '2026-04-04 23:35:32'),
(569, 1, 'Super Administrator', 'super_admin', 'EDIT_GUARD', 'Guard', '', 'Anton', 'Edited guard: Anton', '143.44.216.7', 'Chrome 146 · Windows 19', '2026-04-04 23:51:32'),
(570, NULL, 'Super Admin', 'super_admin', 'DELETE_ADMIN', 'Admin', '3', NULL, 'Deleted admin ID: 3', NULL, NULL, '2026-04-04 23:56:40'),
(571, 1, 'Super Administrator', 'super_admin', 'EDIT_STUDENT', 'Student', '', 'Kurdapya Alunday', 'Edited student: Kurdapya Alunday — Bachelor of Science in Computer Science 3rd Year', '136.158.120.56', 'Chrome 146 · Windows 10', '2026-04-05 05:39:05'),
(572, 1, 'CSS Admin Cha', 'admin', 'EDIT_STUDENT', 'Student', '', 'Jan Ray Aquino', 'Edited student: Jan Ray Aquino —  3rd Year', '136.158.120.56', 'Chrome 146 · Windows 10', '2026-04-05 05:39:38'),
(573, 1, 'Super Administrator', 'super_admin', 'SET_EVENT', 'Event', '', 'Leader summint', 'Set system-wide event: Leader summint', '143.44.216.7', 'Chrome 146 · Windows 19', '2026-04-05 12:38:34'),
(574, 7, 'Steven John A. Agustin', 'teacher', 'SET_LOCATION', 'Location', '7', NULL, 'Set location: lat 16.025591, lng 120.77629850000001, radius 50m', '143.44.216.7', 'Chrome 146 · Windows 19', '2026-04-05 12:39:08'),
(575, 1, 'Super Administrator', 'super_admin', 'RESET_STUDENT_DEVICE', 'Student', '55', 'Andrea Mulach', 'Device binding reset for: Andrea Mulach', '143.44.216.7', 'Chrome 146 · Windows 19', '2026-04-05 12:40:00'),
(576, 55, 'Andrea Mulach', 'student', 'REGENERATE_BARCODE', 'Student', '', 'Andrea Mulach', 'Regenerated barcode — ID No: 8700', '143.44.216.7', 'Chrome 146 · Windows 19', '2026-04-05 12:40:23'),
(577, 5, 'Gray Fullbusters', 'guard', 'EVENT_TIME_IN', 'Event Attendance', '8700', 'Andrea L. Mulach', 'Event: Leader summint | Location: Main Gate', NULL, NULL, '2026-04-05 12:41:06'),
(578, 5, 'Gray Fullbusters', 'guard', 'EVENT_TIME_OUT', 'Event Attendance', '8700', 'Andrea L. Mulach', 'Event: Leader summint | Location: Main Gate', NULL, NULL, '2026-04-05 12:41:15'),
(579, 1, 'Super Administrator', 'super_admin', 'DELETE_PROGRAM', 'Program', '', 'Grade 12 – STEM', 'Deleted program: Grade 12 – STEM', '143.44.216.7', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', '2026-04-05 13:37:48'),
(580, 1, 'Super Administrator', 'super_admin', 'DELETE_PROGRAM', 'Program', '', 'Grade 12 – GAS', 'Deleted program: Grade 12 – GAS', '143.44.216.7', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', '2026-04-05 13:37:59'),
(581, 1, 'Super Administrator', 'super_admin', 'DELETE_PROGRAM', 'Program', '', 'Grade 12 – ABM', 'Deleted program: Grade 12 – ABM', '143.44.216.7', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', '2026-04-05 13:38:05'),
(582, 1, 'Super Administrator', 'super_admin', 'DELETE_PROGRAM', 'Program', '', 'Grade 11 – STEM', 'Deleted program: Grade 11 – STEM', '143.44.216.7', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', '2026-04-05 13:38:12'),
(583, 1, 'Super Administrator', 'super_admin', 'ADD_PROGRAM', 'Program', '', 'GAS', 'Added program: GAS', '143.44.216.7', 'Chrome 146 · Windows 19', '2026-04-05 13:38:25'),
(584, 1, 'Super Administrator', 'super_admin', 'ADD_PROGRAM', 'Program', '', 'TVL', 'Added program: TVL', '143.44.216.7', 'Chrome 146 · Windows 19', '2026-04-05 13:38:34'),
(585, 1, 'Super Administrator', 'super_admin', 'ADD_PROGRAM', 'Program', '', 'hUMMS', 'Added program: hUMMS', '143.44.216.7', 'Chrome 146 · Windows 19', '2026-04-05 13:38:41'),
(586, 1, 'Super Administrator', 'super_admin', 'ADD_PROGRAM', 'Program', '', 'STEM', 'Added program: STEM', '143.44.216.7', 'Chrome 146 · Windows 19', '2026-04-05 13:38:52'),
(587, 1, 'Super Administrator', 'super_admin', 'ADD_PROGRAM', 'Program', '', 'ABM', 'Added program: ABM', '143.44.216.7', 'Chrome 146 · Windows 19', '2026-04-05 13:38:58'),
(588, 1, 'Super Administrator', 'super_admin', 'ADD_YEAR_LEVEL', 'Year Level', '', '11', 'Added year level: 11', '143.44.216.7', 'Chrome 146 · Windows 19', '2026-04-05 13:39:04'),
(589, 1, 'Super Administrator', 'super_admin', 'ADD_YEAR_LEVEL', 'Year Level', '', '12', 'Added year level: 12', '143.44.216.7', 'Chrome 146 · Windows 19', '2026-04-05 13:39:11'),
(590, 1, 'Super Administrator', 'super_admin', 'DELETE_PROGRAM', 'Program', '', 'Grade 10', 'Deleted program: Grade 10', '143.44.216.7', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', '2026-04-05 13:39:24'),
(591, 1, 'Super Administrator', 'super_admin', 'DELETE_PROGRAM', 'Program', '', 'Grade 7', 'Deleted program: Grade 7', '143.44.216.7', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', '2026-04-05 13:39:46'),
(592, 1, 'Super Administrator', 'super_admin', 'DELETE_PROGRAM', 'Program', '', 'Grade 6', 'Deleted program: Grade 6', '143.44.216.7', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', '2026-04-05 13:39:51'),
(593, 1, 'Super Administrator', 'super_admin', 'DELETE_PROGRAM', 'Program', '', 'Grade 1', 'Deleted program: Grade 1', '143.44.216.7', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', '2026-04-05 13:39:57'),
(594, 1, 'Super Administrator', 'super_admin', 'SET_LOCATION', 'Location', '7', NULL, 'SuperAdmin set location for teacher: Steven John A. Agustin — lat 16.017332848143703, lng 120.74931621551515, radius 500m', '136.158.120.56', 'Chrome 146 · Windows 10', '2026-04-05 13:39:58'),
(595, 1, 'Super Administrator', 'super_admin', 'ADD_PROGRAM', 'Program', '', 'SBE', 'Added program: SBE', '143.44.216.7', 'Chrome 146 · Windows 19', '2026-04-05 13:40:14'),
(596, 1, 'Super Administrator', 'super_admin', 'DELETE_YEAR_LEVEL', 'Year Level', '', 'SBE', 'Deleted year level: SBE', '143.44.216.7', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', '2026-04-05 13:40:20'),
(597, 1, 'Super Administrator', 'super_admin', 'ADD_YEAR_LEVEL', 'Year Level', '', 'Grade 10', 'Added year level: Grade 10', '143.44.216.7', 'Chrome 146 · Windows 19', '2026-04-05 13:40:34'),
(598, 1, 'Super Administrator', 'super_admin', 'ADD_YEAR_LEVEL', 'Year Level', '', 'Grade 9', 'Added year level: Grade 9', '143.44.216.7', 'Chrome 146 · Windows 19', '2026-04-05 13:40:44'),
(599, 1, 'Super Administrator', 'super_admin', 'ADD_YEAR_LEVEL', 'Year Level', '', 'Grade 8', 'Added year level: Grade 8', '143.44.216.7', 'Chrome 146 · Windows 19', '2026-04-05 13:40:55'),
(600, 1, 'Super Administrator', 'super_admin', 'EDIT_STUDENT_RECORD', 'Student', '', 'Jan Ray Aquino', 'Edited class roster student: Jan Ray Aquino', '136.158.120.56', 'Chrome 146 · Windows 10', '2026-04-05 13:41:02'),
(601, 1, 'Super Administrator', 'super_admin', 'ADD_YEAR_LEVEL', 'Year Level', '', 'Grade 7', 'Added year level: Grade 7', '143.44.216.7', 'Chrome 146 · Windows 19', '2026-04-05 13:41:02'),
(602, 1, 'Super Administrator', 'super_admin', 'ADD_YEAR_LEVEL', 'Year Level', '', 'Grade 5', 'Added year level: Grade 5', '143.44.216.7', 'Chrome 146 · Windows 19', '2026-04-05 13:41:15'),
(603, 1, 'Super Administrator', 'super_admin', 'DELETE_PROGRAM', 'Program', '', 'hUMMS', 'Deleted program: hUMMS', '143.44.216.7', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', '2026-04-05 13:41:27'),
(604, 1, 'Super Administrator', 'super_admin', 'ADD_PROGRAM', 'Program', '', 'HUMSS', 'Added program: HUMSS', '143.44.216.7', 'Chrome 146 · Windows 19', '2026-04-05 13:41:54'),
(605, 7, 'Steven John A. Agustin', 'teacher', 'EDIT_STUDENT_RECORD', 'Student', '67', 'Jan Ray Aquino', 'Edited class record: 1231392', '136.158.120.56', 'Chrome 146 · Windows 10', '2026-04-05 13:42:39'),
(606, 1, 'Super Administrator', 'super_admin', 'INSERT_MANUAL_STATUS', 'Attendance', '49', 'Present', 'SuperAdmin manually set Zaiejan Agustin to Present', '136.158.120.56', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', '2026-04-05 14:02:23'),
(607, 1, 'Super Administrator', 'super_admin', 'INSERT_MANUAL_STATUS', 'Attendance', '56', 'Present', 'SuperAdmin manually set Steven John Agustin (CoAST) to Present', '136.158.120.56', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', '2026-04-05 14:02:24'),
(608, 1, 'Super Administrator', 'super_admin', 'INSERT_MANUAL_STATUS', 'Attendance', '28', 'Present', 'SuperAdmin manually set Natsu Dragneel to Present', '136.158.120.56', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', '2026-04-05 14:02:25'),
(609, 1, 'Super Administrator', 'super_admin', 'INSERT_MANUAL_STATUS', 'Attendance', '45', 'Present', 'SuperAdmin manually set Lucy Heartfilla to Present', '136.158.120.56', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', '2026-04-05 14:02:26'),
(610, 1, 'Super Administrator', 'super_admin', 'INSERT_MANUAL_STATUS', 'Attendance', '62', 'Present', 'SuperAdmin manually set Andrea Lachica to Present', '136.158.120.56', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', '2026-04-05 14:02:27'),
(611, 1, 'Super Administrator', 'super_admin', 'INSERT_MANUAL_STATUS', 'Attendance', '21', 'Late', 'SuperAdmin manually set Charimea Selga to Late', '136.158.120.56', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', '2026-04-05 14:02:32'),
(612, 1, 'Super Administrator', 'super_admin', 'SET_SUBJECT_YEAR_LEVEL', 'Class Setup', '7', 'Integrative Programming', 'SuperAdmin set subject: Integrative Programming, year level: 3rd Year for teacher: Steven John A. Agustin', '136.158.120.56', 'Chrome 146 · Windows 10', '2026-04-05 14:06:39'),
(613, 1, 'Super Administrator', 'super_admin', 'INSERT_MANUAL_STATUS', 'Attendance', '49', 'Present', 'SuperAdmin manually set Zaiejan Agustin to Present', '136.158.120.56', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', '2026-04-05 14:06:43'),
(614, 1, 'Super Administrator', 'super_admin', 'INSERT_MANUAL_STATUS', 'Attendance', '56', 'Present', 'SuperAdmin manually set Steven John Agustin (CoAST) to Present', '136.158.120.56', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', '2026-04-05 14:06:44'),
(615, 1, 'Super Administrator', 'super_admin', 'INSERT_MANUAL_STATUS', 'Attendance', '28', 'Present', 'SuperAdmin manually set Natsu Dragneel to Present', '136.158.120.56', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', '2026-04-05 14:06:45'),
(616, 1, 'Super Administrator', 'super_admin', 'INSERT_MANUAL_STATUS', 'Attendance', '45', 'Present', 'SuperAdmin manually set Lucy Heartfilla to Present', '136.158.120.56', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', '2026-04-05 14:06:46'),
(617, 1, 'Super Administrator', 'super_admin', 'INSERT_MANUAL_STATUS', 'Attendance', '62', 'Present', 'SuperAdmin manually set Andrea Lachica to Present', '136.158.120.56', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', '2026-04-05 14:06:46'),
(618, 1, 'Super Administrator', 'super_admin', 'INSERT_MANUAL_STATUS', 'Attendance', '21', 'Present', 'SuperAdmin manually set Charimea Selga to Present', '136.158.120.56', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', '2026-04-05 14:06:50'),
(619, 1, 'Super Administrator', 'super_admin', 'SET_SUBJECT_YEAR_LEVEL', 'Class Setup', '7', 'Cloud Computing', 'SuperAdmin set subject: Cloud Computing, year level: 3rd Year for teacher: Steven John A. Agustin', '136.158.120.56', 'Chrome 146 · Windows 10', '2026-04-05 14:07:39'),
(620, 1, 'Super Administrator', 'super_admin', 'INSERT_MANUAL_STATUS', 'Attendance', '28', 'Present', 'SuperAdmin manually set Natsu Dragneel to Present', '136.158.120.56', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', '2026-04-05 14:07:43'),
(621, 1, 'Super Administrator', 'super_admin', 'INSERT_MANUAL_STATUS', 'Attendance', '45', 'Present', 'SuperAdmin manually set Lucy Heartfilla to Present', '136.158.120.56', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', '2026-04-05 14:07:43'),
(622, 1, 'Super Administrator', 'super_admin', 'SET_SUBJECT_YEAR_LEVEL', 'Class Setup', '7', 'Database Lec', 'SuperAdmin set subject: Database Lec, year level: 3rd Year for teacher: Steven John A. Agustin', '136.158.120.56', 'Chrome 146 · Windows 10', '2026-04-05 14:07:59'),
(623, 7, 'Steven John A. Agustin', 'teacher', 'SET_LOCATION', 'Location', '7', NULL, 'Set location: lat 16.0425, lng 120.3407, radius 50m', '136.158.120.56', 'Chrome 146 · Windows 10', '2026-04-05 14:12:25'),
(624, 35, 'Natsu Dragneel', 'student', 'REGENERATE_BARCODE', 'Student', '', 'Natsu Dragneel', 'Regenerated barcode — ID No: 1231231231231', '136.158.120.56', 'Chrome 146 · Windows 10', '2026-04-05 14:12:29'),
(625, 5, 'Gray Fullbusters', 'guard', 'EVENT_TIME_IN', 'Event Attendance', '1231231231231', 'Natsu B. Dragneel', 'Event: Leader summint | Location: Main Gate', NULL, NULL, '2026-04-05 14:13:12'),
(626, 5, 'Gray Fullbusters', 'guard', 'EVENT_TIME_OUT', 'Event Attendance', '1231231231231', 'Natsu B. Dragneel', 'Event: Leader summint | Location: Main Gate', NULL, NULL, '2026-04-05 14:13:29'),
(627, 1, 'Super Administrator', 'super_admin', 'UPDATE_ATTENDANCE_STATUS', 'Attendance', '337', 'Late', 'SuperAdmin updated attendance ID 337 to Late', '143.44.216.7', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', '2026-04-05 15:10:57'),
(628, 1, 'Super Administrator', 'super_admin', 'UPDATE_ATTENDANCE_STATUS', 'Attendance', '337', 'Absent', 'SuperAdmin updated attendance ID 337 to Absent', '143.44.216.7', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', '2026-04-05 15:10:58'),
(629, 1, 'Super Administrator', 'super_admin', 'UPDATE_ATTENDANCE_STATUS', 'Attendance', '337', 'Present', 'SuperAdmin updated attendance ID 337 to Present', '143.44.216.7', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', '2026-04-05 15:10:59'),
(630, 1, 'Super Administrator', 'super_admin', 'UPDATE_ATTENDANCE_STATUS', 'Attendance', '337', 'Excused', 'SuperAdmin updated attendance ID 337 to Excused', '143.44.216.7', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', '2026-04-05 15:11:00'),
(631, 1, 'Super Administrator', 'super_admin', 'UPDATE_ATTENDANCE_STATUS', 'Attendance', '338', 'Late', 'SuperAdmin updated attendance ID 338 to Late', '143.44.216.7', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', '2026-04-05 15:11:01'),
(632, 1, 'Super Administrator', 'super_admin', 'UPDATE_ATTENDANCE_STATUS', 'Attendance', '338', 'Excused', 'SuperAdmin updated attendance ID 338 to Excused', '143.44.216.7', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', '2026-04-05 15:11:02'),
(633, 1, 'Super Administrator', 'super_admin', 'UPDATE_ATTENDANCE_STATUS', 'Attendance', '338', 'Absent', 'SuperAdmin updated attendance ID 338 to Absent', '143.44.216.7', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', '2026-04-05 15:11:03'),
(634, 1, 'Super Administrator', 'super_admin', 'UPDATE_ATTENDANCE_STATUS', 'Attendance', '338', 'Present', 'SuperAdmin updated attendance ID 338 to Present', '143.44.216.7', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', '2026-04-05 15:11:03'),
(635, 1, 'Super Administrator', 'super_admin', 'UPDATE_ATTENDANCE_STATUS', 'Attendance', '339', 'Late', 'SuperAdmin updated attendance ID 339 to Late', '143.44.216.7', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', '2026-04-05 15:11:04'),
(636, 1, 'Super Administrator', 'super_admin', 'UPDATE_ATTENDANCE_STATUS', 'Attendance', '339', 'Absent', 'SuperAdmin updated attendance ID 339 to Absent', '143.44.216.7', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', '2026-04-05 15:11:08'),
(637, 1, 'Super Administrator', 'super_admin', 'UPDATE_ATTENDANCE_STATUS', 'Attendance', '340', 'Late', 'SuperAdmin updated attendance ID 340 to Late', '143.44.216.7', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', '2026-04-05 15:11:09'),
(638, 1, 'Super Administrator', 'super_admin', 'UPDATE_ATTENDANCE_STATUS', 'Attendance', '341', 'Late', 'SuperAdmin updated attendance ID 341 to Late', '143.44.216.7', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', '2026-04-05 15:11:11'),
(639, 1, 'Super Administrator', 'super_admin', 'UPDATE_ATTENDANCE_STATUS', 'Attendance', '340', 'Present', 'SuperAdmin updated attendance ID 340 to Present', '143.44.216.7', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', '2026-04-05 15:11:12'),
(640, 1, 'Super Administrator', 'super_admin', 'UPDATE_ATTENDANCE_STATUS', 'Attendance', '341', 'Present', 'SuperAdmin updated attendance ID 341 to Present', '143.44.216.7', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', '2026-04-05 15:11:14'),
(641, 1, 'Super Administrator', 'super_admin', 'SET_SUBJECT_YEAR_LEVEL', 'Class Setup', '7', 'Database Lec', 'SuperAdmin set subject: Database Lec, year level: 3rd Year for teacher: Steven John A. Agustin', '143.44.216.7', 'Chrome 146 · Windows 19', '2026-04-05 15:15:12'),
(642, 1, 'Super Administrator', 'super_admin', 'SET_SUBJECT_YEAR_LEVEL', 'Class Setup', '7', 'Cloud Computing', 'SuperAdmin set subject: Cloud Computing, year level: 2nd Year for teacher: Steven John A. Agustin', '143.44.216.7', 'Chrome 146 · Windows 19', '2026-04-05 15:15:30'),
(643, 1, 'Super Administrator', 'super_admin', 'SET_SUBJECT_YEAR_LEVEL', 'Class Setup', '7', 'Cloud Computing', 'SuperAdmin set subject: Cloud Computing, year level: 2nd Year for teacher: Steven John A. Agustin', '143.44.216.7', 'Chrome 146 · Windows 19', '2026-04-05 15:15:48'),
(644, 1, 'Super Administrator', 'super_admin', 'SET_SUBJECT_YEAR_LEVEL', 'Class Setup', '7', 'Cloud Computing', 'SuperAdmin set subject: Cloud Computing, year level: 2nd Year for teacher: Steven John A. Agustin', '143.44.216.7', 'Chrome 146 · Windows 19', '2026-04-05 15:15:52'),
(645, 1, 'Super Administrator', 'super_admin', 'SET_SUBJECT_YEAR_LEVEL', 'Class Setup', '7', 'Cloud Computing', 'SuperAdmin set subject: Cloud Computing, year level: 2nd Year for teacher: Steven John A. Agustin', '143.44.216.7', 'Chrome 146 · Windows 19', '2026-04-05 15:16:10'),
(646, 1, 'Super Administrator', 'super_admin', 'SET_SUBJECT_YEAR_LEVEL', 'Class Setup', '7', 'Cloud Computing', 'SuperAdmin set subject: Cloud Computing, year level: 2nd Year for teacher: Steven John A. Agustin', '143.44.216.7', 'Chrome 146 · Windows 19', '2026-04-05 15:16:12'),
(647, 1, 'Super Administrator', 'super_admin', 'SET_SUBJECT_YEAR_LEVEL', 'Class Setup', '7', 'Programming', 'SuperAdmin set subject: Programming, year level: 3rd Year for teacher: Steven John A. Agustin', '143.44.216.7', 'Chrome 146 · Windows 19', '2026-04-05 15:16:40'),
(648, 1, 'Super Administrator', 'super_admin', 'SET_SUBJECT_YEAR_LEVEL', 'Class Setup', '7', 'Programming', 'SuperAdmin set subject: Programming, year level: 3rd Year for teacher: Steven John A. Agustin', '143.44.216.7', 'Chrome 146 · Windows 19', '2026-04-05 15:21:22'),
(649, 1, 'Super Administrator', 'super_admin', 'SET_SUBJECT_YEAR_LEVEL', 'Class Setup', '7', 'Integrative Programming', 'SuperAdmin set subject: Integrative Programming, year level: 3rd Year for teacher: Steven John A. Agustin', '143.44.216.7', 'Chrome 146 · Windows 19', '2026-04-05 15:21:33'),
(650, 1, 'Super Administrator', 'super_admin', 'SET_SUBJECT_YEAR_LEVEL', 'Class Setup', '7', 'Integrative Programming', 'SuperAdmin set subject: Integrative Programming, year level: 3rd Year for teacher: Steven John A. Agustin', '143.44.216.7', 'Chrome 146 · Windows 19', '2026-04-05 15:35:09'),
(651, 7, 'Steven John A. Agustin', 'teacher', 'SET_SUBJECT_YEAR_LEVEL', 'Class Setup', '', 'Integrative Programming', 'Set subject: Integrative Programming, year level: 3rd Year, class time: 15:36', '143.44.216.7', 'Chrome 146 · Windows 19', '2026-04-05 15:37:08'),
(652, 1, 'Super Administrator', 'super_admin', 'SET_SUBJECT_YEAR_LEVEL', 'Class Setup', '7', 'Integrative Programming', 'SuperAdmin set subject: Integrative Programming, year level: 3rd Year for teacher: Steven John A. Agustin', '143.44.216.7', 'Chrome 146 · Windows 19', '2026-04-05 15:45:40'),
(653, 1, 'Super Administrator', 'super_admin', 'SET_SUBJECT_YEAR_LEVEL', 'Class Setup', '7', 'Integrative Programming', 'SuperAdmin set subject: Integrative Programming, year level: 3rd Year for teacher: Steven John A. Agustin', '143.44.216.7', 'Chrome 146 · Windows 19', '2026-04-05 15:45:42'),
(654, 7, 'Steven John A. Agustin', 'teacher', 'SET_LOCATION', 'Location', '7', NULL, 'Set location: lat 16.030423930294614, lng 120.74390522373285, radius 50m', '112.198.120.152', 'Edge 146 · Windows 19', '2026-04-06 08:55:45'),
(655, 1, 'Super Administrator', 'super_admin', 'RESET_STUDENT_DEVICE', 'Student', '43', 'Jan Ray Aquino', 'Device binding reset for: Jan Ray Aquino', '112.198.120.152', 'Edge 146 · Windows 19', '2026-04-06 08:59:03'),
(656, 1, 'Super Administrator', 'super_admin', 'RESET_STUDENT_PASSWORD', 'Student', '43', NULL, 'Reset password for student ID: 43', '112.198.120.152', 'Edge 146 · Windows 19', '2026-04-06 09:01:16'),
(657, 1, 'Super Administrator', 'super_admin', 'EDIT_STUDENT', 'Student', '', 'Jan Ray Aquino', 'Edited student: Jan Ray Aquino —  3rd Year', '112.198.120.152', 'Edge 146 · Windows 19', '2026-04-06 09:02:31'),
(658, 23, 'Lucy Heartfilla', 'student', 'REGENERATE_BARCODE', 'Student', '', 'Lucy Heartfilla', 'Regenerated barcode — ID No: 1231333', '112.198.120.152', 'Chrome 144 · Android 14 · Infinix X6731B', '2026-04-06 09:04:29'),
(659, 7, 'Steven John A. Agustin', 'teacher', 'SET_SUBJECT_YEAR_LEVEL', 'Class Setup', '', 'Integrative Programming', 'Set subject: Integrative Programming, year level: 3rd Year, class time: 07:36', '175.158.198.181', 'Edge 146 · Windows 19', '2026-04-06 11:46:41'),
(660, 1, 'Super Administrator', 'super_admin', 'RESET_STUDENT_DEVICE', 'Student', '55', 'Andrea Mulach', 'Device binding reset for: Andrea Mulach', '175.158.198.181', 'Edge 146 · Windows 19', '2026-04-06 11:48:25'),
(661, 1, 'Super Administrator', 'super_admin', 'RESET_STUDENT_DEVICE', 'Student', '55', 'Andrea Mulach', 'Device binding reset for: Andrea Mulach', '175.158.198.181', 'Edge 146 · Windows 19', '2026-04-06 11:48:25'),
(662, 1, 'Super Administrator', 'super_admin', 'RESET_STUDENT_DEVICE', 'Student', '55', 'Andrea Mulach', 'Device binding reset for: Andrea Mulach', '112.198.120.152', 'Edge 146 · Windows 19', '2026-04-06 11:50:37'),
(663, 55, 'Andrea Mulach', 'student', 'REGENERATE_BARCODE', 'Student', '', 'Andrea Mulach', 'Regenerated barcode — ID No: 8700', '131.226.96.24', 'Chrome 146 · Android 16 · SM-A156E', '2026-04-06 12:15:21'),
(664, 7, 'Steven John A. Agustin', 'teacher', 'DELETE_SUBJECT', 'Subject', '', 'Sample lng to', 'Deleted subject: Sample lng to', '58.69.165.115', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36 Edg/146.0.0.0', '2026-04-06 14:14:45'),
(665, 43, 'Jan Ray Aquino', 'student', 'UPDATE_PROFILE', 'Student', '', 'Jan Ray Aquino', 'Updated profile — ID No: 1231392', '58.69.165.115', 'Edge 146 · Windows 19', '2026-04-06 14:34:09'),
(666, 43, 'Jan Ray Aquino', 'student', 'REGENERATE_BARCODE', 'Student', '', 'Jan Ray Aquino', 'Regenerated barcode — ID No: 1231392', '58.69.165.115', 'Edge 146 · Windows 19', '2026-04-06 14:37:50'),
(667, 1, 'Super Administrator', 'super_admin', 'SET_EVENT', 'Event', '', 'GGHG', 'Set system-wide event: GGHG', '58.69.165.115', 'Edge 146 · Windows 19', '2026-04-06 14:38:14'),
(668, 5, 'Gray Fullbusters', 'guard', 'EVENT_TIME_IN', 'Event Attendance', '1231392', 'Jan Ray A. Aquino', 'Event: GGHG | Location: Main Gate', NULL, NULL, '2026-04-06 14:38:24'),
(669, 7, 'Steven John A. Agustin', 'teacher', 'EDIT_STUDENT_RECORD', 'Student', '67', 'Jan Ray Aquino', 'Edited class record: 1231392', '58.69.165.115', 'Edge 146 · Windows 19', '2026-04-06 15:05:06');
INSERT INTO `system_activity_logs` (`log_id`, `actor_id`, `actor_name`, `actor_role`, `action`, `target_type`, `target_id`, `target_name`, `details`, `ip_address`, `device_info`, `performed_at`) VALUES
(670, 1, 'Super Administrator', 'super_admin', 'RESET_STUDENT_DEVICE', 'Student', '23', 'Lucy Heartfilla', 'Device binding reset for: Lucy Heartfilla', '58.69.165.115', 'Edge 146 · Windows 19', '2026-04-06 15:48:43'),
(671, 5, 'Gray Fullbusters', 'guard', 'EVENT_TIME_IN', 'Event Attendance', '1231333', 'Lucy A. Heartfilla', 'Event: GGHG | Location: Main Gate', NULL, NULL, '2026-04-06 16:09:18'),
(672, NULL, 'Super Admin', 'super_admin', 'CREATE_ADMIN', 'Admin', '4', 'Soleil Riego', 'Created admin: soleil@gmail.com', NULL, NULL, '2026-04-06 16:11:49'),
(673, 5, 'Gray Fullbusters', 'guard', 'EVENT_TIME_OUT', 'Event Attendance', '1231333', 'Lucy A. Heartfilla', 'Event: GGHG | Location: Main Gate', NULL, NULL, '2026-04-06 16:17:31'),
(674, 7, 'Steven John A. Agustin', 'teacher', 'SET_LOCATION', 'Location', '7', NULL, 'Set location: lat 16.030310485917624, lng 120.74298620224, radius 50m', '58.69.165.115', 'Edge 146 · Windows 19', '2026-04-06 16:19:54'),
(675, 7, 'Steven John A. Agustin', 'teacher', 'SET_LOCATION', 'Location', '7', NULL, 'Set location: lat 16.03040873677262, lng 120.7439043645886, radius 50m', '58.69.165.115', 'Edge 146 · Windows 19', '2026-04-06 16:20:37'),
(676, 23, 'Lucy Heartfilla', 'student', 'REGENERATE_BARCODE', 'Student', '', 'Lucy Heartfilla', 'Regenerated barcode — ID No: 1231333', '58.69.165.115', 'Edge 146 · Windows 19', '2026-04-06 16:20:46'),
(677, 2, 'Steven John A. Agustin', 'admin', 'EDIT_TEACHER', 'Teacher', '', 'Bill Gate', 'Edited teacher: Bill Gate — bill@panpacificu.edu.ph', '136.158.121.88', 'Chrome 146 · Windows 10', '2026-04-07 00:55:23'),
(678, 2, 'Steven John A. Agustin', 'admin', 'EDIT_TEACHER', 'Teacher', '', 'Bill Gate', 'Edited teacher: Bill Gate — bill@panpacificu.edu.ph', '136.158.121.88', 'Chrome 146 · Windows 10', '2026-04-07 00:55:30'),
(679, NULL, 'Super Admin', 'super_admin', 'DELETE_ADMIN', 'Admin', '2', NULL, 'Deleted admin ID: 2', NULL, NULL, '2026-04-07 01:07:31'),
(680, NULL, 'Super Admin', 'super_admin', 'CREATE_ADMIN', 'Admin', '5', 'Steven John A. Agustin', 'Created admin: steven.agustin.admin@panpacificu.edu.ph', NULL, NULL, '2026-04-07 01:07:54'),
(681, 1, 'Super Administrator', 'super_admin', 'MAINTENANCE_TOGGLE', 'System', '', 'Maintenance ON', 'Maintenance mode turned ON', '136.158.121.88', 'Chrome 146 · Windows 10', '2026-04-08 15:48:07'),
(682, 1, 'Super Administrator', 'super_admin', 'MAINTENANCE_TOGGLE', 'System', '', 'Maintenance OFF', 'Maintenance mode turned OFF', '136.158.121.88', 'Chrome 146 · Windows 10', '2026-04-08 15:48:30');

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
(278, 7, 'Steven John A. Agustin', 'steven.agustin.ecoast@panpacificu.edu.ph', 'teacher', 'SUCCESS', '136.158.120.56', 'Chrome 146 · Windows 10', '2026-03-23 20:14:29'),
(279, 5, 'Gray Fullbusters', 'gray@panpacificu.edu.ph', 'guard', 'SUCCESS', '136.158.120.56', 'Chrome 146 · Windows 10', '2026-03-24 01:33:45'),
(280, 1, 'Super Administrator', 'superadmin@panpacificu.edu.ph', 'super_admin', 'SUCCESS', '136.158.120.56', 'Chrome 146 · Windows 10', '2026-03-24 01:46:52'),
(281, 1, 'Super Administrator', 'superadmin@panpacificu.edu.ph', 'super_admin', 'SUCCESS', '136.158.120.56', 'Chrome 146 · Windows 10', '2026-03-24 10:07:50'),
(282, 19, 'Charimea Selga', 'charimea.selga.ecoast@panpacificu.edu.ph', 'student', 'SUCCESS', '182.255.40.171', 'Chromium 145 · Android 14 · CPH2387', '2026-03-24 10:26:51'),
(283, 19, 'Charimea Selga', 'charimea.selga.ecoast@panpacificu.edu.ph', 'student', 'LOGOUT', '182.255.40.171', 'Chromium 145 · Android 14 · CPH2387', '2026-03-24 10:28:22'),
(284, 19, 'Charimea Selga', 'charimea.selga.ecoast@panpacificu.edu.ph', 'student', 'SUCCESS', '182.255.40.171', 'Chromium 145 · Android 14 · CPH2387', '2026-03-24 10:28:40'),
(285, 35, 'Natsu Dragneel', 'xnatsu25@gmail.com', 'student', 'LOGOUT', '136.158.120.56', 'Chrome 146 · Windows 10', '2026-03-24 11:18:18'),
(286, 50, 'Gabriel Castillo (ECoAST)', 'gabriel.castillo.ecoast@panpacificu.edu.ph', 'student', 'SUCCESS', '136.158.120.56', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', '2026-03-24 11:19:50'),
(287, 1, 'Super Administrator', 'superadmin@panpacificu.edu.ph', 'super_admin', 'SUCCESS', '136.158.120.56', 'Chrome 146 · Windows 10', '2026-03-24 11:24:20'),
(288, 42, 'Zaiejan Agustin', 'zaiejanagustin@gmail.com', 'student', 'FAILED', '136.158.120.56', 'Mozilla/5.0 (Linux; Android 10; CPH2179) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.106 Mobile Safari/537.36', '2026-03-24 12:45:51'),
(289, 50, 'Gabriel Castillo (ECoAST)', 'gabriel.castillo.ecoast@panpacificu.edu.ph', 'student', 'LOGOUT', '136.158.120.56', 'Chrome 146 · Windows 10', '2026-03-24 12:45:57'),
(290, 50, 'Gabriel Castillo (ECoAST)', 'gabriel.castillo.ecoast@panpacificu.edu.ph', 'student', 'FAILED', '136.158.120.56', 'Chrome 146 · Android 6 · Nexus 5', '2026-03-24 12:46:01'),
(291, NULL, NULL, 'stevenjohnagustin25@gmail.com', 'student', 'FAILED', '136.158.120.56', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', '2026-03-24 12:46:18'),
(292, 51, 'Ace-cin Kyoshi', 'kyoshiacecin@gmail.com', 'student', 'SUCCESS', '136.158.120.56', 'Mozilla/5.0 (Linux; Android 10; CPH2179) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.106 Mobile Safari/537.36', '2026-03-24 12:49:01'),
(293, 5, 'Gray Fullbusters', 'gray@panpacificu.edu.ph', 'guard', 'SUCCESS', '136.158.120.56', 'Chrome 144 · Android 14 · Infinix X6731B', '2026-03-24 12:52:52'),
(294, 1, 'CSS Admin', 'admin@panpacificu.edu.ph', 'admin', 'SUCCESS', '124.6.158.140', 'Edge 146 · Windows 19', '2026-03-24 13:38:57'),
(295, NULL, NULL, 'andrea.lachica.@panpacificu.edu.ph', 'student', 'FAILED', '124.6.158.140', 'Chrome 146 · Android 16 · SM-A156E', '2026-03-24 13:39:02'),
(296, NULL, NULL, 'andrea.lachica.@panpacificu.edu.ph', 'student', 'FAILED', '124.6.158.140', 'Chrome 146 · Android 16 · SM-A156E', '2026-03-24 13:39:20'),
(297, NULL, NULL, 'andrea.lachica.@panpacificu.edu.ph', 'student', 'FAILED', '124.6.158.140', 'Chrome 146 · Android 16 · SM-A156E', '2026-03-24 13:39:26'),
(298, 1, 'Super Administrator', 'superadmin@panpacificu.edu.ph', 'super_admin', 'SUCCESS', '124.6.158.140', 'Edge 146 · Windows 19', '2026-03-24 13:40:02'),
(299, 49, 'Andrea Lachica', 'andrea.lachica@panpacificu.edu.ph', 'student', 'SUCCESS', '124.6.158.140', 'Chrome 146 · Android 16 · SM-A156E', '2026-03-24 13:40:34'),
(300, 7, 'Steven John A. Agustin', 'steven.agustin.ecoast@panpacificu.edu.ph', 'teacher', 'SUCCESS', '124.6.158.140', 'Edge 146 · Windows 19', '2026-03-24 13:40:35'),
(301, NULL, NULL, 'natsu@panpacificu.edu.ph', 'student', 'FAILED', '124.6.158.140', 'Chrome 144 · Android 14 · Infinix X6731B', '2026-03-24 13:41:57'),
(302, 5, 'Gray Fullbusters', 'gray@panpacificu.edu.ph', 'guard', 'SUCCESS', '124.6.158.140', 'Chrome 144 · Android 14 · Infinix X6731B', '2026-03-24 13:42:02'),
(303, 49, 'Andrea Lachica', 'andrea.lachica@panpacificu.edu.ph', 'student', 'LOGOUT', '124.6.158.140', 'Chrome 146 · Android 16 · SM-A156E', '2026-03-24 13:45:09'),
(304, 26, 'Luna Toka', 'lunatoka@gmail.com', 'student', 'SUCCESS', '58.69.165.115', 'Chrome 146 · Android 14 · CPH2387', '2026-03-24 13:45:11'),
(305, 49, 'Andrea Lachica', 'andrea.lachica@panpacificu.edu.ph', 'student', 'SUCCESS', '124.6.158.140', 'Chrome 146 · Android 16 · SM-A156E', '2026-03-24 13:45:29'),
(306, 5, 'Gray Fullbusters', 'gray@panpacificu.edu.ph', 'guard', 'LOGOUT', '124.6.158.140', 'Chrome 144 · Android 14 · Infinix X6731B', '2026-03-24 14:05:40'),
(307, 5, 'Gray Fullbusters', 'gray@panpacificu.edu.ph', 'guard', 'SUCCESS', '124.6.158.140', 'Chrome 144 · Android 14 · Infinix X6731B', '2026-03-24 14:09:30'),
(308, 5, 'Gray Fullbusters', 'gray@panpacificu.edu.ph', 'guard', 'LOGOUT', '124.6.158.140', 'Chrome 144 · Android 14 · Infinix X6731B', '2026-03-24 14:10:04'),
(309, 1, 'CSS Admin', 'admin@panpacificu.edu.ph', 'admin', 'SUCCESS', '124.6.158.140', 'Chrome 144 · Android 14 · Infinix X6731B', '2026-03-24 15:13:28');
INSERT INTO `system_login_logs` (`log_id`, `user_id`, `user_name`, `user_email`, `role`, `status`, `ip_address`, `device_info`, `login_at`) VALUES
(310, NULL, NULL, 'lucy@panpacificu.edu.ph', 'student', 'FAILED', '124.6.158.140', 'Chrome 144 · Android 14 · Infinix X6731B', '2026-03-24 15:15:09'),
(311, NULL, NULL, 'lucy@panpacificu.edu.ph', 'student', 'FAILED', '124.6.158.140', 'Chrome 144 · Android 14 · Infinix X6731B', '2026-03-24 15:15:16'),
(312, 35, 'Natsu Dragneel', 'xnatsu25@gmail.com', 'student', 'FAILED', '124.6.158.140', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Mobile Safari/537.36', '2026-03-24 15:15:23'),
(313, 49, 'Andrea Lachica', 'andrea.lachica@panpacificu.edu.ph', 'student', 'SUCCESS', '124.6.158.140', 'Chrome 146 · Android 16 · SM-A156E', '2026-03-24 15:16:42'),
(314, NULL, NULL, 'lucy@panpacificu.edu.ph', 'student', 'FAILED', '124.6.158.140', 'Chrome 144 · Android 14 · Infinix X6731B', '2026-03-24 15:17:59'),
(315, NULL, NULL, 'lucy@panpacific.edu.ph', 'student', 'FAILED', '124.6.158.140', 'Chrome 144 · Android 14 · Infinix X6731B', '2026-03-24 15:18:08'),
(316, NULL, NULL, 'lucy@panpacificu.edu.ph', 'student', 'FAILED', '124.6.158.140', 'Chrome 144 · Android 14 · Infinix X6731B', '2026-03-24 15:18:23'),
(317, 42, 'Zaiejan Agustin', 'zaiejanagustin@gmail.com', 'student', 'SUCCESS', '124.6.158.140', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Mobile Safari/537.36', '2026-03-24 15:18:39'),
(318, 42, 'Zaiejan Agustin', 'zaiejanagustin@gmail.com', 'student', 'LOGOUT', '124.6.158.140', 'Chrome 144 · Android 14 · Infinix X6731B', '2026-03-24 15:27:08'),
(319, 42, 'Zaiejan Agustin', 'zaiejanagustin@gmail.com', 'student', 'SUCCESS', '124.6.158.140', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Mobile Safari/537.36', '2026-03-24 15:27:18'),
(320, 26, 'Luna Toka', 'lunatoka@gmail.com', 'student', 'LOGOUT', '58.69.165.115', 'Chrome 146 · Android 14 · CPH2387', '2026-03-24 15:29:12'),
(321, 26, 'Luna Toka', 'lunatoka@gmail.com', 'student', 'SUCCESS', '58.69.165.115', 'Chrome 146 · Android 14 · CPH2387', '2026-03-24 15:29:18'),
(322, 26, 'Luna Toka', 'lunatoka@gmail.com', 'student', 'LOGOUT', '58.69.165.115', 'Chrome 146 · Android 14 · CPH2387', '2026-03-24 15:29:34'),
(323, NULL, NULL, 'charimeaselga@gmail.com', 'student', 'FAILED', '58.69.165.115', 'Chrome 146 · Android 14 · CPH2387', '2026-03-24 15:29:37'),
(324, NULL, NULL, 'charimeaselga@gmail.com', 'student', 'FAILED', '58.69.165.115', 'Chrome 146 · Android 14 · CPH2387', '2026-03-24 15:29:45'),
(325, 19, 'Charimea Selga', 'charimea.selga.ecoast@panpacificu.edu.ph', 'student', 'FAILED', '58.69.165.115', 'Chrome 146 · Android 14 · CPH2387', '2026-03-24 15:29:59'),
(326, 19, 'Charimea Selga', 'charimea.selga.ecoast@panpacificu.edu.ph', 'student', 'FAILED', '58.69.165.115', 'Chrome 146 · Android 14 · CPH2387', '2026-03-24 15:30:02'),
(327, 7, 'Steven John A. Agustin', 'steven.agustin.ecoast@panpacificu.edu.ph', 'teacher', 'SUCCESS', '136.158.120.56', 'Chrome 146 · Windows 10', '2026-03-24 22:42:51'),
(328, 1, 'Super Administrator', 'superadmin@panpacificu.edu.ph', 'super_admin', 'LOGOUT', '136.158.120.56', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', '2026-03-24 22:52:26'),
(329, 7, 'Steven John A. Agustin', 'steven.agustin.ecoast@panpacificu.edu.ph', 'teacher', 'LOGOUT', '136.158.120.56', 'Chrome 146 · Windows 10', '2026-03-24 22:52:29'),
(330, 1, 'CSS Admin', 'admin@panpacificu.edu.ph', 'admin', 'SUCCESS', '136.158.120.56', 'Chrome 146 · Windows 10', '2026-03-24 22:52:59'),
(331, 52, 'Maxene Franco', 'maxenefranco@gmail.com', 'student', 'SUCCESS', '136.158.120.56', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', '2026-03-24 23:00:23'),
(332, 52, 'Maxene Franco', 'maxenefranco@gmail.com', 'student', 'SUCCESS', '136.158.120.56', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', '2026-03-25 00:51:26'),
(333, 35, 'Natsu Dragneel', 'xnatsu25@gmail.com', 'student', 'SUCCESS', '136.158.120.56', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', '2026-03-25 00:53:00'),
(334, 1, 'Super Administrator', 'superadmin@panpacificu.edu.ph', 'super_admin', 'SUCCESS', '136.158.120.56', 'Chrome 146 · Windows 10', '2026-03-25 01:03:45'),
(335, 46, 'Steven John Agustin (CoAST)', 'steven.agustin.ecoast@panpacificu.edu.ph', 'student', 'SUCCESS', '136.158.120.56', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', '2026-03-25 01:53:41'),
(336, 7, 'Steven John A. Agustin', 'steven.agustin.ecoast@panpacificu.edu.ph', 'teacher', 'SUCCESS', '136.158.120.56', 'Chrome 146 · Windows 10', '2026-03-25 10:59:11'),
(337, 1, 'Super Administrator', 'superadmin@panpacificu.edu.ph', 'super_admin', 'SUCCESS', '136.158.120.56', 'Chrome 146 · Windows 10', '2026-03-25 12:57:11'),
(338, 7, 'Steven John A. Agustin', 'steven.agustin.ecoast@panpacificu.edu.ph', 'teacher', 'SUCCESS', '136.158.120.56', 'Chrome 146 · Windows 10', '2026-03-25 18:34:59'),
(339, 43, 'Jan Ray Aquino', 'janrayaquino9@gmail.com', 'student', 'SUCCESS', '49.150.35.37', 'Chrome 146 · Windows 10', '2026-03-25 19:40:19'),
(340, 43, 'Jan Ray Aquino', 'janrayaquino9@gmail.com', 'student', 'SUCCESS', '49.150.35.37', 'Chrome 146 · Windows 10', '2026-03-25 19:43:32'),
(341, 43, 'Jan Ray Aquino', 'janrayaquino9@gmail.com', 'student', 'FAILED', '49.150.35.37', 'Safari 604 · iOS 18.7', '2026-03-25 19:45:07'),
(342, 43, 'Jan Ray Aquino', 'janrayaquino9@gmail.com', 'student', 'FAILED', '49.150.35.37', 'Safari 604 · iOS 18.7', '2026-03-25 19:45:18'),
(343, 43, 'Jan Ray Aquino', 'janrayaquino9@gmail.com', 'student', 'FAILED', '49.150.35.37', 'Safari 604 · iOS 18.7', '2026-03-25 19:45:26'),
(344, 43, 'Jan Ray Aquino', 'janrayaquino9@gmail.com', 'student', 'FAILED', '49.150.35.37', 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.3 Mobile/15E148 Safari/604.1', '2026-03-25 19:45:36'),
(345, 43, 'Jan Ray Aquino', 'janrayaquino9@gmail.com', 'student', 'FAILED', '49.150.35.37', 'Safari 604 · iOS 18.7', '2026-03-25 19:46:02'),
(346, 43, 'Jan Ray Aquino', 'janrayaquino9@gmail.com', 'student', 'FAILED', '49.150.35.37', 'Safari 604 · iOS 18.7', '2026-03-25 19:46:34'),
(347, 1, 'Super Administrator', 'superadmin@panpacificu.edu.ph', 'super_admin', 'SUCCESS', '136.158.120.56', 'Chrome 146 · Windows 10', '2026-03-25 19:46:55'),
(348, 43, 'Jan Ray Aquino', 'janrayaquino9@gmail.com', 'student', 'FAILED', '49.150.35.37', 'Safari 604 · iOS 18.7', '2026-03-25 19:47:11'),
(349, 43, 'Jan Ray Aquino', 'janrayaquino9@gmail.com', 'student', 'SUCCESS', '49.150.35.37', 'Safari 604 · iOS 18.7', '2026-03-25 19:47:28'),
(350, 43, 'Jan Ray Aquino', 'janrayaquino9@gmail.com', 'student', 'FAILED', '49.150.35.37', 'Chrome 146 · Windows 10', '2026-03-25 19:59:11'),
(351, 43, 'Jan Ray Aquino', 'janrayaquino9@gmail.com', 'student', 'FAILED', '49.150.35.37', 'Chrome 146 · Windows 10', '2026-03-25 19:59:15'),
(352, 43, 'Jan Ray Aquino', 'janrayaquino9@gmail.com', 'student', 'FAILED', '49.150.35.37', 'Chrome 146 · Windows 10', '2026-03-25 19:59:20'),
(353, 43, 'Jan Ray Aquino', 'janrayaquino9@gmail.com', 'student', 'FAILED', '49.150.35.37', 'Chrome 146 · Windows 10', '2026-03-25 19:59:23'),
(354, 43, 'Jan Ray Aquino', 'janrayaquino9@gmail.com', 'student', 'FAILED', '49.150.35.37', 'Chrome 146 · Windows 10', '2026-03-25 19:59:24'),
(355, 43, 'Jan Ray Aquino', 'janrayaquino9@gmail.com', 'student', 'FAILED', '49.150.35.37', 'Chrome 146 · Windows 10', '2026-03-25 19:59:28'),
(356, 43, 'Jan Ray Aquino', 'janrayaquino9@gmail.com', 'student', 'FAILED', '49.150.35.37', 'Chrome 146 · Windows 10', '2026-03-25 19:59:55'),
(357, 43, 'Jan Ray Aquino', 'janrayaquino9@gmail.com', 'student', 'FAILED', '49.150.35.37', 'Chrome 146 · Windows 10', '2026-03-25 19:59:57'),
(358, 43, 'Jan Ray Aquino', 'janrayaquino9@gmail.com', 'student', 'FAILED', '49.150.35.37', 'Chrome 146 · Windows 10', '2026-03-25 20:00:00'),
(359, 43, 'Jan Ray Aquino', 'janrayaquino9@gmail.com', 'student', 'FAILED', '49.150.35.37', 'Chrome 146 · Windows 10', '2026-03-25 20:00:17'),
(360, 43, 'Jan Ray Aquino', 'janrayaquino9@gmail.com', 'student', 'FAILED', '49.150.35.37', 'Chrome 146 · Windows 10', '2026-03-25 20:00:52'),
(361, 43, 'Jan Ray Aquino', 'janrayaquino9@gmail.com', 'student', 'SUCCESS', '49.150.35.37', 'Safari 604 · iOS 18.7', '2026-03-25 20:04:43'),
(362, 43, 'Jan Ray Aquino', 'janrayaquino9@gmail.com', 'student', 'FAILED', '49.150.35.37', 'Chrome 146 · Windows 10', '2026-03-25 20:07:38'),
(363, 43, 'Jan Ray Aquino', 'janrayaquino9@gmail.com', 'student', 'FAILED', '49.150.35.37', 'Chrome 146 · Windows 10', '2026-03-25 20:07:40'),
(364, 43, 'Jan Ray Aquino', 'janrayaquino9@gmail.com', 'student', 'LOGOUT', '49.150.35.37', 'Safari 604 · iOS 18.7', '2026-03-25 20:07:54'),
(365, 43, 'Jan Ray Aquino', 'janrayaquino9@gmail.com', 'student', 'FAILED', '49.150.35.37', 'Chrome 146 · Windows 10', '2026-03-25 20:08:00'),
(366, 43, 'Jan Ray Aquino', 'janrayaquino9@gmail.com', 'student', 'FAILED', '49.150.35.37', 'Chrome 146 · Windows 10', '2026-03-25 20:08:13'),
(367, 43, 'Jan Ray Aquino', 'janrayaquino9@gmail.com', 'student', 'FAILED', '49.150.35.37', 'Chrome 146 · Windows 10', '2026-03-25 20:08:15'),
(368, 43, 'Jan Ray Aquino', 'janrayaquino9@gmail.com', 'student', 'FAILED', '49.150.35.37', 'Chrome 146 · Windows 10', '2026-03-25 20:08:16'),
(369, 43, 'Jan Ray Aquino', 'janrayaquino9@gmail.com', 'student', 'FAILED', '49.150.35.37', 'Chrome 146 · Windows 10', '2026-03-25 20:08:19'),
(370, 43, 'Jan Ray Aquino', 'janrayaquino9@gmail.com', 'student', 'FAILED', '49.150.35.37', 'Chrome 146 · Windows 10', '2026-03-25 20:08:22'),
(371, 43, 'Jan Ray Aquino', 'janrayaquino9@gmail.com', 'student', 'FAILED', '49.150.35.37', 'Chrome 146 · Windows 10', '2026-03-25 20:08:27'),
(372, 43, 'Jan Ray Aquino', 'janrayaquino9@gmail.com', 'student', 'FAILED', '49.150.35.37', 'Chrome 146 · Windows 10', '2026-03-25 20:08:53'),
(373, 43, 'Jan Ray Aquino', 'janrayaquino9@gmail.com', 'student', 'FAILED', '49.150.35.37', 'Chrome 146 · Windows 10', '2026-03-25 20:08:58'),
(374, 43, 'Jan Ray Aquino', 'janrayaquino9@gmail.com', 'student', 'FAILED', '49.150.35.37', 'Chrome 146 · Windows 10', '2026-03-25 20:09:28'),
(375, 43, 'Jan Ray Aquino', 'janrayaquino9@gmail.com', 'student', 'FAILED', '49.150.35.37', 'Chrome 146 · Windows 10', '2026-03-25 20:09:30'),
(376, 43, 'Jan Ray Aquino', 'janrayaquino9@gmail.com', 'student', 'FAILED', '49.150.35.37', 'Chrome 146 · Windows 10', '2026-03-25 20:09:34'),
(377, 43, 'Jan Ray Aquino', 'janrayaquino9@gmail.com', 'student', 'FAILED', '49.150.35.37', 'Chrome 146 · Windows 10', '2026-03-25 20:09:37'),
(378, 43, 'Jan Ray Aquino', 'janrayaquino9@gmail.com', 'student', 'FAILED', '49.150.35.37', 'Chrome 146 · Windows 10', '2026-03-25 20:09:43'),
(379, 43, 'Jan Ray Aquino', 'janrayaquino9@gmail.com', 'student', 'FAILED', '49.150.35.37', 'Chrome 146 · Windows 10', '2026-03-25 20:10:38'),
(380, 43, 'Jan Ray Aquino', 'janrayaquino9@gmail.com', 'student', 'SUCCESS', '49.150.35.37', 'Browser · iOS 18.7', '2026-03-25 20:12:51'),
(381, 43, 'Jan Ray Aquino', 'janrayaquino9@gmail.com', 'student', 'SUCCESS', '49.150.35.37', 'Safari 604 · iOS 18.7', '2026-03-25 20:13:01'),
(382, 35, 'Natsu Dragneel', 'xnatsu25@gmail.com', 'student', 'FAILED', '136.158.120.56', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Mobile Safari/537.36', '2026-03-26 01:26:29'),
(383, NULL, NULL, 'gray@panpacificu.edu.ph', 'student', 'FAILED', '136.158.120.56', 'Chrome 144 · Android 14 · Infinix X6731B', '2026-03-26 01:26:34'),
(384, NULL, NULL, 'lucy@panpacificu.edu.ph', 'student', 'FAILED', '136.158.120.56', 'Chrome 144 · Android 14 · Infinix X6731B', '2026-03-26 01:26:42'),
(385, NULL, NULL, 'lucy@panpacificu.edu.ph', 'student', 'FAILED', '136.158.120.56', 'Chrome 144 · Android 14 · Infinix X6731B', '2026-03-26 01:26:56'),
(386, 23, 'Lucy Heartfilla', 'lucyheart@panpacificu.edu.ph', 'student', 'FAILED', '136.158.120.56', 'Chrome 144 · Android 14 · Infinix X6731B', '2026-03-26 01:27:23'),
(387, 23, 'Lucy Heartfilla', 'lucyheart@panpacificu.edu.ph', 'student', 'FAILED', '136.158.120.56', 'Chrome 144 · Android 14 · Infinix X6731B', '2026-03-26 01:27:33'),
(388, NULL, NULL, 'gray@panpacificu.edu.ph', 'student', 'FAILED', '136.158.120.56', 'Chrome 144 · Android 14 · Infinix X6731B', '2026-03-26 01:27:41'),
(389, 23, 'Lucy Heartfilla', 'lucyheart@panpacificu.edu.ph', 'student', 'SUCCESS', '136.158.120.56', 'Chrome 144 · Android 14 · Infinix X6731B', '2026-03-26 01:27:56'),
(390, 23, 'Lucy Heartfilla', 'lucyheart@panpacificu.edu.ph', 'student', 'LOGOUT', '136.158.120.56', 'Chrome 144 · Android 14 · Infinix X6731B', '2026-03-26 01:34:25'),
(391, 42, 'Zaiejan Agustin', 'zaiejanagustin@gmail.com', 'student', 'FAILED', '136.158.120.56', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Mobile Safari/537.36', '2026-03-26 01:34:33'),
(392, 35, 'Natsu Dragneel', 'xnatsu25@gmail.com', 'student', 'FAILED', '136.158.120.56', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Mobile Safari/537.36', '2026-03-26 01:34:41'),
(393, 35, 'Natsu Dragneel', 'xnatsu25@gmail.com', 'student', 'FAILED', '136.158.120.56', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Mobile Safari/537.36', '2026-03-26 01:34:59'),
(394, 35, 'Natsu Dragneel', 'xnatsu25@gmail.com', 'student', 'SUCCESS', '136.158.120.56', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Mobile Safari/537.36', '2026-03-26 01:35:37'),
(395, 35, 'Natsu Dragneel', 'xnatsu25@gmail.com', 'student', 'LOGOUT', '136.158.120.56', 'Chrome 144 · Android 14 · Infinix X6731B', '2026-03-26 01:38:29'),
(396, 33, 'Marfel Gem Gallarde (ECoAST)', 'marfel.gallarde.ecoast@panpacificu.edu.ph', 'student', 'SUCCESS', '136.158.120.56', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Mobile Safari/537.36', '2026-03-26 01:38:40'),
(397, 7, 'Steven John A. Agustin', 'steven.agustin.ecoast@panpacificu.edu.ph', 'teacher', 'LOGOUT', '136.158.120.56', 'Chrome 146 · Windows 10', '2026-03-26 10:31:57'),
(398, 7, 'Steven John A. Agustin', 'steven.agustin.ecoast@panpacificu.edu.ph', 'teacher', 'SUCCESS', '136.158.120.56', 'Chrome 146 · Windows 10', '2026-03-26 10:32:04'),
(399, 7, 'Steven John A. Agustin', 'steven.agustin.ecoast@panpacificu.edu.ph', 'teacher', 'SUCCESS', '136.158.120.56', 'Chrome 146 · Windows 10', '2026-03-27 11:44:26'),
(400, 23, 'Lucy Heartfilla', 'lucyheart@panpacificu.edu.ph', 'student', 'SUCCESS', '136.158.120.56', 'Chrome 144 · Android 14 · Infinix X6731B', '2026-03-27 11:50:52'),
(401, 1, 'Super Administrator', 'superadmin@panpacificu.edu.ph', 'super_admin', 'SUCCESS', '136.158.120.56', 'Chrome 146 · Windows 10', '2026-03-27 13:45:21'),
(402, 7, 'Steven John A. Agustin', 'steven.agustin.ecoast@panpacificu.edu.ph', 'teacher', 'SUCCESS', '136.158.120.56', 'Chrome 144 · Android 14 · Infinix X6731B', '2026-03-27 14:23:44'),
(403, 7, 'Steven John A. Agustin', 'steven.agustin.ecoast@panpacificu.edu.ph', 'teacher', 'LOGOUT', '136.158.120.56', 'Chrome 146 · Windows 10', '2026-03-27 17:01:59'),
(404, 7, 'Steven John A. Agustin', 'steven.agustin.ecoast@panpacificu.edu.ph', 'teacher', 'SUCCESS', '136.158.120.56', 'Chrome 146 · Windows 10', '2026-03-27 17:02:02'),
(405, 35, 'Natsu Dragneel', 'xnatsu25@gmail.com', 'student', 'FAILED', '136.158.120.56', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', '2026-03-27 17:05:41'),
(406, 35, 'Natsu Dragneel', 'xnatsu25@gmail.com', 'student', 'FAILED', '136.158.120.56', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', '2026-03-27 17:07:30'),
(407, 35, 'Natsu Dragneel', 'xnatsu25@gmail.com', 'student', 'FAILED', '136.158.120.56', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', '2026-03-27 17:07:50'),
(408, 35, 'Natsu Dragneel', 'xnatsu25@gmail.com', 'student', 'FAILED', '136.158.120.56', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', '2026-03-27 17:20:19'),
(409, 46, 'Steven John Agustin (CoAST)', 'steven.agustin.ecoast@panpacificu.edu.ph', 'student', 'SUCCESS', '136.158.120.56', 'Chrome 146 · Windows 10', '2026-03-27 23:14:22'),
(410, 46, 'Steven John Agustin (CoAST)', 'steven.agustin.ecoast@panpacificu.edu.ph', 'student', 'LOGOUT', '136.158.120.56', 'Chrome 146 · Windows 10', '2026-03-27 23:14:29'),
(411, 35, 'Natsu Dragneel', 'xnatsu25@gmail.com', 'student', 'FAILED', '136.158.120.56', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', '2026-03-27 23:14:36'),
(412, 35, 'Natsu Dragneel', 'xnatsu25@gmail.com', 'student', 'FAILED', '136.158.120.56', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', '2026-03-27 23:19:45'),
(413, 1, 'Super Administrator', 'superadmin@panpacificu.edu.ph', 'super_admin', 'SUCCESS', '136.158.120.56', 'Chrome 146 · Windows 10', '2026-03-28 11:51:15'),
(414, 1, 'Super Administrator', 'superadmin@panpacificu.edu.ph', 'super_admin', 'LOGOUT', '136.158.120.56', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', '2026-03-28 11:51:21'),
(415, 1, 'Super Administrator', 'superadmin@panpacificu.edu.ph', 'super_admin', 'LOGOUT', '136.158.120.56', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', '2026-03-28 11:51:26'),
(416, 1, 'Super Administrator', 'superadmin@panpacificu.edu.ph', 'super_admin', 'LOGOUT', '136.158.120.56', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', '2026-03-28 11:52:15'),
(417, 1, 'Super Administrator', 'superadmin@panpacificu.edu.ph', 'super_admin', 'LOGOUT', '136.158.120.56', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', '2026-03-28 11:52:29'),
(418, 7, 'Steven John A. Agustin', 'steven.agustin.ecoast@panpacificu.edu.ph', 'teacher', 'LOGOUT', '136.158.120.56', 'Chrome 146 · Windows 10', '2026-03-28 11:54:55'),
(419, 7, 'Steven John A. Agustin', 'steven.agustin.ecoast@panpacificu.edu.ph', 'teacher', 'SUCCESS', '136.158.120.56', 'Chrome 146 · Windows 10', '2026-03-28 11:55:18'),
(420, 23, 'Lucy Heartfilla', 'lucyheart@panpacificu.edu.ph', 'student', 'SUCCESS', '136.158.120.56', 'Chrome 144 · Android 14 · Infinix X6731B', '2026-03-28 12:13:16'),
(421, 23, 'Lucy Heartfilla', 'lucyheart@panpacificu.edu.ph', 'student', 'SUCCESS', '136.158.120.56', 'Chrome 144 · Android 14 · Infinix X6731B', '2026-03-28 12:15:17'),
(422, 35, 'Natsu Dragneel', 'xnatsu25@gmail.com', 'student', 'SUCCESS', '136.158.120.56', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Mobile Safari/537.36', '2026-03-29 12:53:26'),
(423, 7, 'Steven John A. Agustin', 'steven.agustin.ecoast@panpacificu.edu.ph', 'teacher', 'SUCCESS', '136.158.120.56', 'Chrome 146 · Windows 10', '2026-03-29 12:54:56'),
(424, 35, 'Natsu Dragneel', 'xnatsu25@gmail.com', 'student', 'LOGOUT', '136.158.120.56', 'Chrome 144 · Android 14 · Infinix X6731B', '2026-03-29 12:55:17'),
(425, 23, 'Lucy Heartfilla', 'lucyheart@panpacificu.edu.ph', 'student', 'SUCCESS', '136.158.120.56', 'Chrome 144 · Android 14 · Infinix X6731B', '2026-03-29 12:55:20'),
(426, 7, 'Steven John A. Agustin', 'steven.agustin.ecoast@panpacificu.edu.ph', 'teacher', 'SUCCESS', '136.158.120.56', 'Chrome 146 · Windows 10', '2026-03-30 13:02:24'),
(427, 35, 'Natsu Dragneel', 'xnatsu25@gmail.com', 'student', 'SUCCESS', '136.158.120.56', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Mobile Safari/537.36', '2026-03-30 13:21:18'),
(428, 7, 'Steven John A. Agustin', 'steven.agustin.ecoast@panpacificu.edu.ph', 'teacher', 'SUCCESS', '136.158.120.56', 'Chrome 146 · Windows 10', '2026-03-31 13:28:54'),
(429, 7, 'Steven John A. Agustin', 'steven.agustin.ecoast@panpacificu.edu.ph', 'teacher', 'SUCCESS', '136.158.120.56', 'Chrome 146 · Windows 10', '2026-04-01 22:12:03'),
(430, 23, 'Lucy Heartfilla', 'lucyheart@panpacificu.edu.ph', 'student', 'SUCCESS', '136.158.120.56', 'Chrome 144 · Android 14 · Infinix X6731B', '2026-04-01 22:19:48'),
(431, 23, 'Lucy Heartfilla', 'lucyheart@panpacificu.edu.ph', 'student', 'LOGOUT', '136.158.120.56', 'Chrome 144 · Android 14 · Infinix X6731B', '2026-04-01 22:22:26'),
(432, 35, 'Natsu Dragneel', 'xnatsu25@gmail.com', 'student', 'SUCCESS', '136.158.120.56', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Mobile Safari/537.36', '2026-04-01 22:22:33'),
(433, 35, 'Natsu Dragneel', 'xnatsu25@gmail.com', 'student', 'FAILED', '136.158.120.56', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', '2026-04-01 22:31:59'),
(434, 1, 'CSS Admin', 'admin@panpacificu.edu.ph', 'admin', 'SUCCESS', '136.158.120.56', 'Chrome 146 · Windows 10', '2026-04-01 22:34:40'),
(435, 1, 'Super Administrator', 'superadmin@panpacificu.edu.ph', 'super_admin', 'SUCCESS', '136.158.120.56', 'Chrome 146 · Windows 10', '2026-04-01 22:34:59'),
(436, 46, 'Steven John Agustin (CoAST)', 'steven.agustin.ecoast@panpacificu.edu.ph', 'student', 'SUCCESS', '136.158.120.56', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', '2026-04-01 22:44:45'),
(437, 5, 'Gray Fullbusters', 'gray@panpacificu.edu.ph', 'guard', 'SUCCESS', '136.158.120.56', 'Chrome 144 · Android 14 · Infinix X6731B', '2026-04-01 22:46:11'),
(438, 7, 'Steven John A. Agustin', 'steven.agustin.ecoast@panpacificu.edu.ph', 'teacher', 'SUCCESS', '182.255.40.171', 'Edge 146 · Windows 19', '2026-04-01 22:57:18'),
(439, 46, 'Steven John Agustin (CoAST)', 'steven.agustin.ecoast@panpacificu.edu.ph', 'student', 'LOGOUT', '136.158.120.56', 'Chrome 146 · Windows 10', '2026-04-01 23:10:36'),
(440, 7, 'Steven John A. Agustin', 'steven.agustin.ecoast@panpacificu.edu.ph', 'teacher', 'LOGOUT', '136.158.120.56', 'Chrome 146 · Windows 10', '2026-03-28 12:25:10'),
(441, 7, 'Steven John A. Agustin', 'steven.agustin.ecoast@panpacificu.edu.ph', 'teacher', 'SUCCESS', '136.158.120.56', 'Chrome 146 · Windows 10', '2026-03-28 12:25:14'),
(442, 7, 'Steven John A. Agustin', 'steven.agustin.ecoast@panpacificu.edu.ph', 'teacher', 'LOGOUT', '136.158.120.56', 'Chrome 146 · Windows 10', '2026-03-28 12:55:41'),
(443, 35, 'Natsu Dragneel', 'xnatsu25@gmail.com', 'student', 'FAILED', '136.158.120.56', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', '2026-03-28 12:56:00'),
(444, 46, 'Steven John Agustin (CoAST)', 'steven.agustin.ecoast@panpacificu.edu.ph', 'student', 'SUCCESS', '136.158.120.56', 'Chrome 146 · Windows 10', '2026-03-28 12:56:10'),
(445, 46, 'Steven John Agustin (CoAST)', 'steven.agustin.ecoast@panpacificu.edu.ph', 'student', 'LOGOUT', '136.158.120.56', 'Chrome 146 · Windows 10', '2026-03-28 12:56:56'),
(446, 1, 'Super Administrator', 'superadmin@panpacificu.edu.ph', 'super_admin', 'LOGOUT', '136.158.120.56', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', '2026-03-28 12:57:27'),
(447, 1, 'Super Administrator', 'superadmin@panpacificu.edu.ph', 'super_admin', 'LOGOUT', '136.158.120.56', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', '2026-03-28 12:58:06'),
(448, 1, 'Super Administrator', 'superadmin@panpacificu.edu.ph', 'super_admin', 'LOGOUT', '136.158.120.56', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', '2026-03-28 12:58:20'),
(449, 7, 'Steven John A. Agustin', 'steven.agustin.ecoast@panpacificu.edu.ph', 'teacher', 'SUCCESS', '136.158.120.56', 'Chrome 146 · Windows 10', '2026-03-28 12:58:26'),
(450, 1, 'CSS Admin', 'admin@panpacificu.edu.ph', 'admin', 'SUCCESS', '136.158.120.56', 'Chrome 146 · Windows 10', '2026-03-28 12:58:32'),
(451, 1, 'CSS Admin', 'admin@panpacificu.edu.ph', 'admin', 'LOGOUT', '136.158.120.56', 'Chrome 146 · Windows 10', '2026-03-28 12:58:38'),
(452, 1, 'Super Administrator', 'superadmin@panpacificu.edu.ph', 'super_admin', 'SUCCESS', '136.158.120.56', 'Chrome 146 · Windows 10', '2026-03-28 13:15:47'),
(453, NULL, NULL, 'superadmin@panpacificu.edu.ph', 'student', 'FAILED', '136.158.120.56', 'Chrome 146 · Windows 10', '2026-03-28 13:16:37'),
(454, NULL, NULL, 'superadmin@panpacificu.edu.ph', 'student', 'FAILED', '136.158.120.56', 'Chrome 146 · Windows 10', '2026-03-28 14:11:26'),
(455, 1, 'Super Administrator', 'superadmin@panpacificu.edu.ph', 'super_admin', 'LOGOUT', '136.158.120.56', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', '2026-03-28 14:11:33'),
(456, 1, 'Super Administrator', 'superadmin@panpacificu.edu.ph', 'super_admin', 'SUCCESS', '136.158.120.56', 'Chrome 146 · Windows 10', '2026-03-28 14:11:46'),
(457, 7, 'Steven John A. Agustin', 'steven.agustin.ecoast@panpacificu.edu.ph', 'teacher', 'SUCCESS', '136.158.120.56', 'Chrome 144 · Android 14 · Infinix X6731B', '2026-03-28 16:25:04'),
(458, 1, 'CSS Admin', 'admin@panpacificu.edu.ph', 'admin', 'SUCCESS', '136.158.120.56', 'Chrome 146 · Windows 10', '2026-03-28 16:39:53'),
(459, 7, 'Steven John A. Agustin', 'steven.agustin.ecoast@panpacificu.edu.ph', 'teacher', 'SUCCESS', '136.158.120.56', 'Chrome 146 · Windows 10', '2026-03-28 17:38:00'),
(460, 35, 'Natsu Dragneel', 'xnatsu25@gmail.com', 'student', 'FAILED', '136.158.120.56', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', '2026-03-28 18:06:23'),
(461, 35, 'Natsu Dragneel', 'xnatsu25@gmail.com', 'student', 'FAILED', '136.158.120.56', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', '2026-03-28 18:24:02'),
(462, 35, 'Natsu Dragneel', 'xnatsu25@gmail.com', 'student', 'FAILED', '136.158.120.56', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', '2026-03-28 18:33:42'),
(463, 35, 'Natsu Dragneel', 'xnatsu25@gmail.com', 'student', 'FAILED', '136.158.120.56', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', '2026-03-28 18:39:00'),
(464, 46, 'Steven John Agustin (CoAST)', 'steven.agustin.ecoast@panpacificu.edu.ph', 'student', 'SUCCESS', '136.158.120.56', 'Chrome 146 · Windows 10', '2026-03-28 19:41:36'),
(465, 46, 'Steven John Agustin (CoAST)', 'steven.agustin.ecoast@panpacificu.edu.ph', 'student', 'LOGOUT', '136.158.120.56', 'Chrome 146 · Windows 10', '2026-03-28 19:41:42'),
(466, 1, 'Super Administrator', 'superadmin@panpacificu.edu.ph', 'super_admin', 'LOGOUT', '136.158.120.56', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', '2026-03-28 19:41:49'),
(467, 1, 'CSS Admin', 'admin@panpacificu.edu.ph', 'admin', 'LOGOUT', '136.158.120.56', 'Chrome 146 · Windows 10', '2026-03-28 19:41:55'),
(468, 7, 'Steven John A. Agustin', 'steven.agustin.ecoast@panpacificu.edu.ph', 'teacher', 'LOGOUT', '136.158.120.56', 'Chrome 146 · Windows 10', '2026-03-28 19:41:59'),
(469, 46, 'Steven John Agustin (CoAST)', 'steven.agustin.ecoast@panpacificu.edu.ph', 'student', 'SUCCESS', '136.158.120.56', 'Chrome 146 · Windows 10', '2026-03-28 19:49:17'),
(470, 35, 'Natsu Dragneel', 'xnatsu25@gmail.com', 'student', 'LOGOUT', '136.158.120.56', 'Chrome 144 · Android 14 · Infinix X6731B', '2026-03-28 19:50:10'),
(471, 46, 'Steven John Agustin (CoAST)', 'steven.agustin.ecoast@panpacificu.edu.ph', 'student', 'SUCCESS', '136.158.120.56', 'Chrome 146 · Windows 10', '2026-03-28 20:01:27'),
(472, 46, 'Steven John Agustin (CoAST)', 'steven.agustin.ecoast@panpacificu.edu.ph', 'student', 'LOGOUT', '136.158.120.56', 'Chrome 146 · Windows 10', '2026-03-28 20:01:35'),
(473, 46, 'Steven John Agustin (CoAST)', 'steven.agustin.ecoast@panpacificu.edu.ph', 'student', 'SUCCESS', '136.158.120.56', 'Chrome 146 · Windows 10', '2026-03-28 20:16:07'),
(474, NULL, NULL, 'janrayaquino9@gmail.com', 'guard', 'FAILED', '49.150.35.37', 'Chrome 146 · Windows 10', '2026-03-28 20:51:54'),
(475, 5, 'Gray Fullbusters', 'gray@panpacificu.edu.ph', 'guard', 'SUCCESS', '49.150.35.37', 'Chrome 146 · Windows 10', '2026-03-28 20:52:17'),
(476, 5, 'Gray Fullbusters', 'gray@panpacificu.edu.ph', 'guard', 'LOGOUT', '49.150.35.37', 'Chrome 146 · Windows 10', '2026-03-28 20:52:43'),
(477, 5, 'Gray Fullbusters', 'gray@panpacificu.edu.ph', 'guard', 'SUCCESS', '49.150.35.37', 'Chromium 145 · Android 11 · RMX2061', '2026-03-28 20:53:10'),
(478, 1, 'CSS Admin', 'admin@panpacificu.edu.ph', 'admin', 'SUCCESS', '182.255.40.171', 'Edge 146 · Windows 19', '2026-03-28 21:11:56'),
(479, 1, 'CSS Admin Cha', 'admin@panpacificu.edu.ph', 'admin', 'SUCCESS', '136.158.120.56', 'Chrome 146 · Windows 10', '2026-03-28 21:23:53'),
(480, 5, 'Gray Fullbusters', 'gray@panpacificu.edu.ph', 'guard', 'SUCCESS', '136.158.120.56', 'Chrome 146 · Windows 10', '2026-03-28 21:24:29'),
(481, 7, 'Steven John A. Agustin', 'steven.agustin.ecoast@panpacificu.edu.ph', 'teacher', 'SUCCESS', '136.158.120.56', 'Chrome 146 · Windows 10', '2026-03-28 21:40:22'),
(482, 1, 'CSS Admin', 'admin@panpacificu.edu.ph', 'admin', 'LOGOUT', '182.255.40.171', 'Edge 146 · Windows 19', '2026-03-28 21:49:48'),
(483, 1, 'CSS Admin Cha', 'admin@panpacificu.edu.ph', 'admin', 'SUCCESS', '182.255.40.171', 'Edge 146 · Windows 19', '2026-03-28 21:51:37'),
(484, 7, 'Steven John A. Agustin', 'steven.agustin.ecoast@panpacificu.edu.ph', 'teacher', 'LOGOUT', '182.255.40.171', 'Edge 146 · Windows 19', '2026-03-28 21:53:18'),
(485, NULL, NULL, 'chari@panpacificu.edu.ph', 'teacher', 'FAILED', '182.255.40.171', 'Edge 146 · Windows 19', '2026-03-28 21:53:26'),
(486, 1, 'Super Administrator', 'superadmin@panpacificu.edu.ph', 'super_admin', 'SUCCESS', '136.158.120.56', 'Chrome 146 · Windows 10', '2026-03-28 21:53:28'),
(487, 5, 'Gray Fullbusters', 'gray@panpacificu.edu.ph', 'guard', 'SUCCESS', '49.150.35.37', 'Chromium 145 · Android 11 · RMX2061', '2026-03-28 21:53:48'),
(488, 20, 'Charimea Selga', 'charimea.selga.ecoast@panpacificu.edu.ph', 'teacher', 'FAILED', '182.255.40.171', 'Edge 146 · Windows 19', '2026-03-28 21:54:28'),
(489, 20, 'Charimea Selga', 'charimea.selga.ecoast@panpacificu.edu.ph', 'teacher', 'SUCCESS', '182.255.40.171', 'Edge 146 · Windows 19', '2026-03-28 21:54:38'),
(490, 5, 'Gray Fullbusters', 'gray@panpacificu.edu.ph', 'guard', 'SUCCESS', '49.150.35.37', 'Chromium 145 · Android 11 · RMX2061', '2026-03-28 21:54:48'),
(491, 20, 'Charimea Selga', 'charimea.selga.ecoast@panpacificu.edu.ph', 'teacher', 'LOGOUT', '182.255.40.171', 'Edge 146 · Windows 19', '2026-03-28 21:59:09'),
(492, 7, 'Steven John A. Agustin', 'steven.agustin.ecoast@panpacificu.edu.ph', 'teacher', 'FAILED', '182.255.40.171', 'Edge 146 · Windows 19', '2026-03-28 21:59:28'),
(493, NULL, NULL, 'stevenjohn.agustin.ecoast@panpacificu.edu.ph', 'teacher', 'FAILED', '182.255.40.171', 'Edge 146 · Windows 19', '2026-03-28 21:59:36'),
(494, NULL, NULL, 'steven.john.agustin.ecoast@panpacificu.edu.ph', 'teacher', 'FAILED', '182.255.40.171', 'Edge 146 · Windows 19', '2026-03-28 21:59:43'),
(495, 7, 'Steven John A. Agustin', 'steven.agustin.ecoast@panpacificu.edu.ph', 'teacher', 'SUCCESS', '182.255.40.171', 'Edge 146 · Windows 19', '2026-03-28 22:00:43'),
(496, 5, 'Gray Fullbusters', 'gray@panpacificu.edu.ph', 'guard', 'SUCCESS', '49.150.35.37', 'Chromium 145 · Android 11 · RMX2061', '2026-03-28 22:31:07'),
(497, 7, 'Steven John A. Agustin', 'steven.agustin.ecoast@panpacificu.edu.ph', 'teacher', 'LOGOUT', '182.255.40.171', 'Edge 146 · Windows 19', '2026-03-28 22:33:47'),
(498, 5, 'Gray Fullbusters', 'gray@panpacificu.edu.ph', 'guard', 'LOGOUT', '136.158.120.56', 'Chrome 146 · Windows 10', '2026-03-28 22:59:53'),
(499, 46, 'Steven John Agustin (CoAST)', 'steven.agustin.ecoast@panpacificu.edu.ph', 'student', 'SUCCESS', '136.158.120.56', 'Chrome 146 · Windows 10', '2026-03-29 02:28:06'),
(500, 5, 'Gray Fullbusters', 'gray@panpacificu.edu.ph', 'guard', 'SUCCESS', '136.158.120.56', 'Chrome 146 · Windows 10', '2026-03-29 02:40:05'),
(501, 5, 'Gray Fullbusters', 'gray@panpacificu.edu.ph', 'guard', 'SUCCESS', '136.158.120.56', 'Chrome 146 · Windows 10', '2026-03-29 02:43:54'),
(502, 46, 'Steven John Agustin (CoAST)', 'steven.agustin.ecoast@panpacificu.edu.ph', 'student', 'LOGOUT', '136.158.120.56', 'Chrome 146 · Windows 10', '2026-03-29 11:50:13'),
(503, 46, 'Steven John Agustin (CoAST)', 'steven.agustin.ecoast@panpacificu.edu.ph', 'student', 'SUCCESS', '136.158.120.56', 'Chrome 146 · Windows 10', '2026-03-29 11:50:23'),
(504, 46, 'Steven John Agustin (CoAST)', 'steven.agustin.ecoast@panpacificu.edu.ph', 'student', 'SUCCESS', '136.158.120.56', 'Chrome 146 · Windows 10', '2026-03-29 15:52:40'),
(505, 1, 'Super Administrator', 'superadmin@panpacificu.edu.ph', 'super_admin', 'SUCCESS', '136.158.120.56', 'Chrome 146 · Windows 10', '2026-03-29 15:56:27'),
(506, 1, 'Super Administrator', 'superadmin@panpacificu.edu.ph', 'super_admin', 'SUCCESS', '136.158.120.56', 'Chrome 146 · Windows 10', '2026-03-29 16:01:00'),
(507, 1, 'Super Administrator', 'superadmin@panpacificu.edu.ph', 'super_admin', 'SUCCESS', '136.158.120.56', 'Chrome 146 · Windows 10', '2026-03-29 19:00:30'),
(508, 7, 'Steven John A. Agustin', 'steven.agustin.ecoast@panpacificu.edu.ph', 'teacher', 'SUCCESS', '136.158.120.56', 'Chrome 146 · Windows 10', '2026-03-29 19:38:36'),
(509, 7, 'Steven John A. Agustin', 'steven.agustin.ecoast@panpacificu.edu.ph', 'teacher', 'SUCCESS', '136.158.120.56', 'Chrome 146 · Windows 10', '2026-03-30 01:21:13'),
(510, NULL, NULL, 'gray@panpacificu.edu.ph', 'student', 'FAILED', '136.158.120.56', 'Chrome 144 · Android 14 · Infinix X6731B', '2026-03-30 02:36:14'),
(511, 23, 'Lucy Heartfilla', 'lucyheart@panpacificu.edu.ph', 'student', 'SUCCESS', '136.158.120.56', 'Chrome 144 · Android 14 · Infinix X6731B', '2026-03-30 02:36:23'),
(512, 23, 'Lucy Heartfilla', 'lucyheart@panpacificu.edu.ph', 'student', 'LOGOUT', '136.158.120.56', 'Chrome 144 · Android 14 · Infinix X6731B', '2026-03-30 02:39:27'),
(513, 35, 'Natsu Dragneel', 'xnatsu25@gmail.com', 'student', 'SUCCESS', '136.158.120.56', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Mobile Safari/537.36', '2026-03-30 02:39:47'),
(514, 35, 'Natsu Dragneel', 'xnatsu25@gmail.com', 'student', 'LOGOUT', '136.158.120.56', 'Chrome 144 · Android 14 · Infinix X6731B', '2026-03-30 02:42:01'),
(515, 23, 'Lucy Heartfilla', 'lucyheart@panpacificu.edu.ph', 'student', 'SUCCESS', '136.158.120.56', 'Chrome 144 · Android 14 · Infinix X6731B', '2026-03-30 02:42:13'),
(516, 23, 'Lucy Heartfilla', 'lucyheart@panpacificu.edu.ph', 'student', 'LOGOUT', '136.158.120.56', 'Chrome 144 · Android 14 · Infinix X6731B', '2026-03-30 03:00:51'),
(517, 35, 'Natsu Dragneel', 'xnatsu25@gmail.com', 'student', 'SUCCESS', '136.158.120.56', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Mobile Safari/537.36', '2026-03-30 03:01:06'),
(518, 7, 'Steven John A. Agustin', 'steven.agustin.ecoast@panpacificu.edu.ph', 'teacher', 'SUCCESS', '136.158.120.56', 'Chrome 146 · Windows 10', '2026-03-30 19:52:34'),
(519, 7, 'Steven John A. Agustin', 'steven.agustin.ecoast@panpacificu.edu.ph', 'teacher', 'SUCCESS', '136.158.120.56', 'Chrome 146 · Windows 10', '2026-03-30 19:53:21'),
(520, 1, 'CSS Admin Cha', 'admin@panpacificu.edu.ph', 'admin', 'SUCCESS', '136.158.120.56', 'Chrome 146 · Windows 10', '2026-03-30 20:03:34'),
(521, 1, 'Super Administrator', 'superadmin@panpacificu.edu.ph', 'super_admin', 'SUCCESS', '136.158.120.56', 'Chrome 146 · Windows 10', '2026-03-31 01:29:00'),
(522, 7, 'Steven John A. Agustin', 'steven.agustin.ecoast@panpacificu.edu.ph', 'teacher', 'SUCCESS', '136.158.120.56', 'Chrome 146 · Windows 10', '2026-03-31 01:30:57'),
(523, 1, 'Super Administrator', 'superadmin@panpacificu.edu.ph', 'super_admin', 'SUCCESS', '136.158.120.56', 'Chrome 146 · Windows 10', '2026-03-31 01:43:57'),
(524, 7, 'Steven John A. Agustin', 'steven.agustin.ecoast@panpacificu.edu.ph', 'teacher', 'SUCCESS', '136.158.120.56', 'Chrome 146 · Windows 10', '2026-03-31 01:45:13'),
(525, 1, 'Super Administrator', 'superadmin@panpacificu.edu.ph', 'super_admin', 'SUCCESS', '182.255.40.171', 'Edge 146 · Windows 19', '2026-03-31 16:10:33'),
(526, 1, 'Super Administrator', 'superadmin@panpacificu.edu.ph', 'super_admin', 'SUCCESS', '143.44.216.7', 'Chrome 146 · Windows 19', '2026-03-31 16:12:00'),
(527, 7, 'Steven John A. Agustin', 'steven.agustin.ecoast@panpacificu.edu.ph', 'teacher', 'SUCCESS', '182.255.40.171', 'Edge 146 · Windows 19', '2026-03-31 16:13:25'),
(528, 35, 'Natsu Dragneel', 'xnatsu25@gmail.com', 'student', 'FAILED', '136.158.120.56', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', '2026-03-31 16:13:44'),
(529, 46, 'Steven John Agustin (CoAST)', 'steven.agustin.ecoast@panpacificu.edu.ph', 'student', 'SUCCESS', '136.158.120.56', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', '2026-03-31 16:14:24'),
(530, 35, 'Natsu Dragneel', 'xnatsu25@gmail.com', 'student', 'FAILED', '136.158.120.56', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', '2026-03-31 16:15:35'),
(531, 35, 'Natsu Dragneel', 'xnatsu25@gmail.com', 'student', 'FAILED', '136.158.120.56', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', '2026-03-31 16:15:57'),
(532, 5, 'Gray Fullbusters', 'gray@panpacificu.edu.ph', 'guard', 'LOGOUT', '136.158.120.56', 'Chrome 144 · Android 14 · Infinix X6731B', '2026-03-31 16:16:47'),
(533, 5, 'Gray Fullbusters', 'gray@panpacificu.edu.ph', 'guard', 'SUCCESS', '136.158.120.56', 'Chrome 144 · Android 14 · Infinix X6731B', '2026-03-31 16:16:53'),
(534, 35, 'Natsu Dragneel', 'xnatsu25@gmail.com', 'student', 'SUCCESS', '136.158.120.56', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', '2026-03-31 16:17:35'),
(535, 1, 'CSS Admin Cha', 'admin@panpacificu.edu.ph', 'admin', 'LOGOUT', '136.158.120.56', 'Chrome 146 · Windows 10', '2026-03-31 16:18:55'),
(536, 1, 'CSS Admin Cha', 'admin@panpacificu.edu.ph', 'admin', 'SUCCESS', '136.158.120.56', 'Chrome 146 · Windows 10', '2026-03-31 16:19:06'),
(537, 5, 'Gray Fullbusters', 'gray@panpacificu.edu.ph', 'guard', 'LOGOUT', '136.158.120.56', 'Chrome 144 · Android 14 · Infinix X6731B', '2026-03-31 16:21:53'),
(538, 23, 'Lucy Heartfilla', 'lucyheart@panpacificu.edu.ph', 'student', 'SUCCESS', '136.158.120.56', 'Chrome 144 · Android 14 · Infinix X6731B', '2026-03-31 16:32:28'),
(539, 1, 'Super Administrator', 'superadmin@panpacificu.edu.ph', 'super_admin', 'SUCCESS', '136.158.120.56', 'Chrome 146 · Windows 10', '2026-03-31 16:35:59'),
(540, 23, 'Lucy Heartfilla', 'lucyheart@panpacificu.edu.ph', 'student', 'LOGOUT', '136.158.120.56', 'Chrome 144 · Android 14 · Infinix X6731B', '2026-03-31 16:36:32'),
(541, 42, 'Zaiejan Agustin', 'zaiejanagustin@gmail.com', 'student', 'FAILED', '136.158.120.56', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Mobile Safari/537.36', '2026-03-31 16:36:46'),
(542, 46, 'Steven John Agustin (CoAST)', 'steven.agustin.ecoast@panpacificu.edu.ph', 'student', 'FAILED', '136.158.120.56', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Mobile Safari/537.36', '2026-03-31 16:37:00'),
(543, 1, 'CSS Admin Cha', 'admin@panpacificu.edu.ph', 'admin', 'SUCCESS', '49.150.35.37', 'Chrome 146 · Windows 10', '2026-03-31 17:07:13'),
(544, 5, 'Gray Fullbusters', 'gray@panpacificu.edu.ph', 'guard', 'SUCCESS', '143.44.216.7', 'Chromium 146 · Android 16 · SM-A156E', '2026-03-31 18:47:41'),
(545, 5, 'Gray Fullbusters', 'gray@panpacificu.edu.ph', 'guard', 'SUCCESS', '143.44.216.7', 'Chrome 146 · Android 16 · SM-A156E', '2026-03-31 18:55:27'),
(546, 5, 'Gray Fullbusters', 'gray@panpacificu.edu.ph', 'guard', 'LOGOUT', '143.44.216.7', 'Chrome 146 · Android 16 · SM-A156E', '2026-03-31 18:56:23'),
(547, 7, 'Steven John A. Agustin', 'steven.agustin.ecoast@panpacificu.edu.ph', 'teacher', 'SUCCESS', '136.158.120.56', 'Chrome 146 · Windows 10', '2026-03-31 20:32:56'),
(548, 46, 'Steven John Agustin (CoAST)', 'steven.agustin.ecoast@panpacificu.edu.ph', 'student', 'LOGOUT', '136.158.120.56', 'Chrome 146 · Windows 10', '2026-03-31 20:37:22'),
(549, 7, 'Steven John A. Agustin', 'steven.agustin.ecoast@panpacificu.edu.ph', 'teacher', 'LOGOUT', '136.158.120.56', 'Chrome 146 · Windows 10', '2026-03-31 20:38:42'),
(550, 1, 'Super Administrator', 'superadmin@panpacificu.edu.ph', 'super_admin', 'LOGOUT', '136.158.120.56', 'Chrome 146 · Windows 10', '2026-03-31 20:38:57'),
(551, 1, 'CSS Admin Cha', 'admin@panpacificu.edu.ph', 'admin', 'LOGOUT', '136.158.120.56', 'Chrome 146 · Windows 10', '2026-03-31 20:39:18'),
(552, 1, 'Super Administrator', 'superadmin@panpacificu.edu.ph', 'super_admin', 'SUCCESS', '136.158.120.56', 'Chrome 146 · Windows 10', '2026-03-31 20:40:06'),
(553, 7, 'Steven John A. Agustin', 'steven.agustin.ecoast@panpacificu.edu.ph', 'teacher', 'SUCCESS', '136.158.120.56', 'Chrome 146 · Windows 10', '2026-03-31 20:41:54'),
(554, 1, 'Super Administrator', 'superadmin@panpacificu.edu.ph', 'super_admin', 'LOGOUT', '182.255.40.171', 'Edge 146 · Windows 19', '2026-03-31 20:43:01'),
(555, 1, 'Super Administrator', 'superadmin@panpacificu.edu.ph', 'super_admin', 'SUCCESS', '182.255.40.171', 'Edge 146 · Windows 19', '2026-03-31 20:43:41'),
(556, 1, 'Super Administrator', 'superadmin@panpacificu.edu.ph', 'super_admin', 'SUCCESS', '143.44.216.7', 'Chrome 146 · Windows 19', '2026-03-31 21:17:15'),
(557, 7, 'Steven John A. Agustin', 'steven.agustin.ecoast@panpacificu.edu.ph', 'teacher', 'SUCCESS', '182.255.40.171', 'Edge 146 · Windows 19', '2026-03-31 21:22:45'),
(558, 1, 'CSS Admin Cha', 'admin@panpacificu.edu.ph', 'admin', 'SUCCESS', '143.44.216.7', 'Chrome 146 · Windows 19', '2026-03-31 21:32:49'),
(559, 46, 'Steven John Agustin (CoAST)', 'steven.agustin.ecoast@panpacificu.edu.ph', 'student', 'FAILED', '182.255.40.171', 'Edge 146 · Windows 19', '2026-03-31 21:36:08'),
(560, NULL, NULL, 'steven.agustin.ecoast@panpacificu.edu.ph', 'admin', 'FAILED', '136.158.120.56', 'Chrome 146 · Windows 10', '2026-03-31 21:36:47'),
(561, 46, 'Steven John Agustin (CoAST)', 'steven.agustin.ecoast@panpacificu.edu.ph', 'student', 'FAILED', '182.255.40.171', 'Edge 146 · Windows 19', '2026-03-31 21:36:49'),
(562, 1, 'Super Administrator', 'superadmin@panpacificu.edu.ph', 'super_admin', 'SUCCESS', '182.255.40.171', 'Edge 146 · Windows 19', '2026-03-31 21:37:23'),
(563, 19, 'Charimea Selga', 'charimea.selga.ecoast@panpacificu.edu.ph', 'student', 'FAILED', '182.255.40.171', 'Edge 146 · Windows 19', '2026-03-31 21:42:12'),
(564, 19, 'Charimea Selga', 'charimea.selga.ecoast@panpacificu.edu.ph', 'student', 'FAILED', '182.255.40.171', 'Edge 146 · Windows 19', '2026-03-31 21:42:44'),
(565, 19, 'Charimea Selga', 'charimea.selga.ecoast@panpacificu.edu.ph', 'student', 'FAILED', '182.255.40.171', 'Edge 146 · Windows 19', '2026-03-31 21:44:37'),
(566, 19, 'Charimea Selga', 'charimea.selga.ecoast@panpacificu.edu.ph', 'student', 'FAILED', '182.255.40.171', 'Edge 146 · Windows 19', '2026-03-31 21:44:49'),
(567, 19, 'Charimea Selga', 'charimea.selga.ecoast@panpacificu.edu.ph', 'student', 'SUCCESS', '182.255.40.171', 'Edge 146 · Windows 19', '2026-03-31 21:44:56'),
(568, NULL, NULL, 'charimeaselga@gmail.com', 'student', 'FAILED', '182.255.40.171', 'Chrome 146 · Android 14 · CPH2387', '2026-03-31 21:47:30'),
(569, NULL, NULL, 'charimeaselga@gmail.com', 'student', 'FAILED', '182.255.40.171', 'Chrome 146 · Android 14 · CPH2387', '2026-03-31 21:47:49'),
(570, NULL, NULL, 'charimeaselga@gmail.com', 'student', 'FAILED', '182.255.40.171', 'Chrome 146 · Android 14 · CPH2387', '2026-03-31 21:47:51'),
(571, 19, 'Charimea Selga', 'charimea.selga.ecoast@panpacificu.edu.ph', 'student', 'SUCCESS', '182.255.40.171', 'Chrome 146 · Android 14 · CPH2387', '2026-03-31 21:48:05'),
(572, 19, 'Charimea Selga', 'charimea.selga.ecoast@panpacificu.edu.ph', 'student', 'FAILED', '182.255.40.171', 'Edge 146 · Windows 19', '2026-03-31 21:49:40'),
(573, 19, 'Charimea Selga', 'charimea.selga.ecoast@panpacificu.edu.ph', 'student', 'FAILED', '182.255.40.171', 'Edge 146 · Windows 19', '2026-03-31 21:49:42'),
(574, 19, 'Charimea Selga', 'charimea.selga.ecoast@panpacificu.edu.ph', 'student', 'SUCCESS', '182.255.40.171', 'Edge 146 · Windows 19', '2026-03-31 21:49:52'),
(575, 19, 'Charimea Selga', 'charimea.selga.ecoast@panpacificu.edu.ph', 'student', 'LOGOUT', '182.255.40.171', 'Edge 146 · Windows 19', '2026-03-31 21:51:32'),
(576, NULL, NULL, 'charimea.selga.ecoast@panpacificu.edu.ph', 'guard', 'FAILED', '182.255.40.171', 'Edge 146 · Windows 19', '2026-03-31 21:54:20'),
(577, NULL, NULL, 'chari@panpacificu.edu.ph', 'guard', 'FAILED', '182.255.40.171', 'Edge 146 · Windows 19', '2026-03-31 21:54:33'),
(578, NULL, NULL, 'chari@panpacificu.edu.ph', 'guard', 'FAILED', '182.255.40.171', 'Edge 146 · Windows 19', '2026-03-31 21:55:00'),
(579, 1, 'Super Administrator', 'superadmin@panpacificu.edu.ph', 'super_admin', 'SUCCESS', '182.255.40.171', 'Edge 146 · Windows 19', '2026-03-31 21:55:42'),
(580, 12, 'Anton', 'anton@gmail.com', 'guard', 'SUCCESS', '182.255.40.171', 'Edge 146 · Windows 19', '2026-03-31 21:57:52'),
(581, 1, 'CSS Admin Cha', 'admin@panpacificu.edu.ph', 'admin', 'SUCCESS', '49.150.35.37', 'Chrome 146 · Windows 10', '2026-03-31 21:58:27'),
(582, 5, 'Gray Fullbusters', 'gray@panpacificu.edu.ph', 'guard', 'SUCCESS', '136.158.120.56', 'Chrome 146 · Windows 10', '2026-03-31 21:58:56'),
(583, 5, 'Gray Fullbusters', 'gray@panpacificu.edu.ph', 'guard', 'LOGOUT', '136.158.120.56', 'Chrome 146 · Windows 10', '2026-03-31 21:59:06'),
(584, 12, 'Anton', 'anton@gmail.com', 'guard', 'LOGOUT', '182.255.40.171', 'Edge 146 · Windows 19', '2026-03-31 21:59:27'),
(585, 1, 'CSS Admin Cha', 'admin@panpacificu.edu.ph', 'admin', 'SUCCESS', '49.150.35.37', 'Chrome 146 · Windows 10', '2026-03-31 22:06:07'),
(586, 1, 'CSS Admin Cha', 'admin@panpacificu.edu.ph', 'admin', 'SUCCESS', '49.150.35.37', 'Chrome 146 · Windows 10', '2026-03-31 22:06:36'),
(587, 1, 'CSS Admin Cha', 'admin@panpacificu.edu.ph', 'admin', 'LOGOUT', '49.150.35.37', 'Chrome 146 · Windows 10', '2026-03-31 22:13:09'),
(588, 1, 'CSS Admin Cha', 'admin@panpacificu.edu.ph', 'admin', 'SUCCESS', '49.150.35.37', 'Chrome 146 · Windows 10', '2026-03-31 22:13:16'),
(589, 7, 'Steven John A. Agustin', 'steven.agustin.ecoast@panpacificu.edu.ph', 'teacher', 'SUCCESS', '143.44.216.7', 'Chrome 146 · Windows 19', '2026-03-31 23:26:32'),
(590, 1, 'Super Administrator', 'superadmin@panpacificu.edu.ph', 'super_admin', 'SUCCESS', '143.44.216.7', 'Chrome 146 · Windows 19', '2026-03-31 23:27:16'),
(591, NULL, NULL, 'andrea.lachica.@panpacificu.edu.ph', 'student', 'FAILED', '143.44.216.7', 'Chrome 146 · Windows 19', '2026-03-31 23:43:03'),
(592, 54, 'Dwynna Chu', 'dwynna@gmail.com.ph', 'student', 'SUCCESS', '143.44.216.7', 'Chrome 146 · Windows 19', '2026-03-31 23:44:19'),
(593, 54, 'Andrea Balbin', 'dwynna@gmail.com.ph', 'student', 'SUCCESS', '143.44.216.7', 'Chrome 146 · Windows 19', '2026-04-01 13:18:54'),
(594, 1, 'Super Administrator', 'superadmin@panpacificu.edu.ph', 'super_admin', 'SUCCESS', '143.44.216.7', 'Chrome 146 · Windows 19', '2026-04-01 13:19:24'),
(595, 1, 'CSS Admin Cha', 'admin@panpacificu.edu.ph', 'admin', 'SUCCESS', '143.44.216.7', 'Chrome 146 · Windows 19', '2026-04-01 13:19:46'),
(596, 19, 'Andrea B. Lachica', 'andrea@panpacificu.edu.ph', 'teacher', 'FAILED', '143.44.216.7', 'Chrome 146 · Windows 19', '2026-04-01 13:20:32'),
(597, NULL, NULL, 'andrea.lachica@panpacificu.edu.ph', 'teacher', 'FAILED', '143.44.216.7', 'Chrome 146 · Windows 19', '2026-04-01 13:20:44'),
(598, 7, 'Steven John A. Agustin', 'steven.agustin.ecoast@panpacificu.edu.ph', 'teacher', 'SUCCESS', '143.44.216.7', 'Chrome 146 · Windows 19', '2026-04-01 13:21:21'),
(599, 5, 'Gray Fullbusters', 'gray@panpacificu.edu.ph', 'guard', 'SUCCESS', '143.44.216.7', 'Chrome 146 · Windows 19', '2026-04-01 13:21:50'),
(600, 1, 'Super Administrator', 'superadmin@panpacificu.edu.ph', 'super_admin', 'SUCCESS', '136.158.120.56', 'Chrome 146 · Windows 10', '2026-04-01 14:34:12'),
(601, NULL, NULL, 'admin@panpacificu.edu.ph', 'super_admin', 'FAILED', '49.150.35.37', 'Chrome 146 · Windows 10', '2026-04-01 20:13:41'),
(602, 1, 'Super Administrator', 'superadmin@panpacificu.edu.ph', 'super_admin', 'SUCCESS', '49.150.35.37', 'Chrome 146 · Windows 10', '2026-04-01 20:14:27'),
(603, NULL, NULL, 'janrayaquino9@gmail.com', 'super_admin', 'FAILED', '49.150.35.37', 'Chrome 146 · Windows 10', '2026-04-01 20:36:50'),
(604, 7, 'Steven John A. Agustin', 'steven.agustin.ecoast@panpacificu.edu.ph', 'teacher', 'SUCCESS', '143.44.216.7', 'Chrome 146 · Windows 19', '2026-04-01 21:18:28'),
(605, 1, 'Super Administrator', 'superadmin@panpacificu.edu.ph', 'super_admin', 'SUCCESS', '143.44.216.7', 'Chrome 146 · Windows 19', '2026-04-01 21:18:32'),
(606, 1, 'CSS Admin Cha', 'admin@panpacificu.edu.ph', 'admin', 'SUCCESS', '143.44.216.7', 'Chrome 146 · Windows 19', '2026-04-01 21:19:00'),
(607, 54, 'Andrea Balbin', 'dwynna@gmail.com.ph', 'student', 'FAILED', '143.44.216.7', 'Chrome 146 · Windows 19', '2026-04-01 21:19:14');
INSERT INTO `system_login_logs` (`log_id`, `user_id`, `user_name`, `user_email`, `role`, `status`, `ip_address`, `device_info`, `login_at`) VALUES
(608, NULL, NULL, 'andrea.lachica.@panpacificu.edu.ph', 'student', 'FAILED', '143.44.216.7', 'Chrome 146 · Windows 19', '2026-04-01 21:19:34'),
(609, 49, 'Andrea Lachica', 'andrea.lachica@panpacificu.edu.ph', 'student', 'FAILED', '143.44.216.7', 'Chrome 146 · Windows 19', '2026-04-01 21:19:43'),
(610, 5, 'Gray Fullbusters', 'gray@panpacificu.edu.ph', 'guard', 'SUCCESS', '143.44.216.7', 'Chrome 146 · Windows 19', '2026-04-01 21:58:30'),
(611, 5, 'Gray Fullbusters', 'gray@panpacificu.edu.ph', 'guard', 'SUCCESS', '143.44.216.7', 'Chrome 146 · Windows 19', '2026-04-02 14:38:58'),
(612, NULL, NULL, 'admin@panpacificu.edu.ph', 'super_admin', 'FAILED', '143.44.216.7', 'Chrome 146 · Windows 19', '2026-04-02 14:40:37'),
(613, 1, 'Super Administrator', 'superadmin@panpacificu.edu.ph', 'super_admin', 'SUCCESS', '143.44.216.7', 'Chrome 146 · Windows 19', '2026-04-02 14:40:57'),
(614, 1, 'CSS Admin Cha', 'admin@panpacificu.edu.ph', 'admin', 'SUCCESS', '143.44.216.7', 'Chrome 146 · Windows 19', '2026-04-02 14:41:32'),
(615, 7, 'Steven John A. Agustin', 'steven.agustin.ecoast@panpacificu.edu.ph', 'teacher', 'FAILED', '143.44.216.7', 'Chrome 146 · Windows 19', '2026-04-02 14:41:41'),
(616, 7, 'Steven John A. Agustin', 'steven.agustin.ecoast@panpacificu.edu.ph', 'teacher', 'SUCCESS', '143.44.216.7', 'Chrome 146 · Windows 19', '2026-04-02 14:41:58'),
(617, 55, 'Andrea Mulach', 'andreamulach@gmail.com', 'student', 'SUCCESS', '143.44.216.7', 'Chrome 146 · Windows 19', '2026-04-02 14:48:01'),
(618, 7, 'Steven John A. Agustin', 'steven.agustin.ecoast@panpacificu.edu.ph', 'teacher', 'SUCCESS', '143.44.216.7', 'Chrome 146 · Windows 19', '2026-04-02 16:44:47'),
(619, 1, 'Super Administrator', 'superadmin@panpacificu.edu.ph', 'super_admin', 'SUCCESS', '143.44.216.7', 'Chrome 146 · Windows 19', '2026-04-04 21:26:22'),
(620, 46, 'Steven John Agustin (CoAST)', 'steven.agustin.ecoast@panpacificu.edu.ph', 'student', 'FAILED', '143.44.216.7', 'Chrome 146 · Windows 19', '2026-04-04 21:39:44'),
(621, 54, 'Andrea Balbin', 'dwynna@gmail.com.ph', 'student', 'FAILED', '143.44.216.7', 'Chrome 146 · Windows 19', '2026-04-04 21:40:07'),
(622, 55, 'Andrea Mulach', 'andreamulach@gmail.com', 'student', 'SUCCESS', '143.44.216.7', 'Chrome 146 · Windows 19', '2026-04-04 21:40:19'),
(623, 7, 'Steven John A. Agustin', 'steven.agustin.ecoast@panpacificu.edu.ph', 'teacher', 'SUCCESS', '143.44.216.7', 'Chrome 146 · Windows 19', '2026-04-04 21:40:56'),
(624, 7, 'Steven John A. Agustin', 'steven.agustin.ecoast@panpacificu.edu.ph', 'teacher', 'SUCCESS', '143.44.216.7', 'Chrome 146 · Android 16 · SM-A156E', '2026-04-04 21:43:51'),
(625, 1, 'Super Administrator', 'superadmin@panpacificu.edu.ph', 'super_admin', 'SUCCESS', '136.158.120.56', 'Chrome 146 · Windows 10', '2026-04-04 21:47:08'),
(626, 7, 'Steven John A. Agustin', 'steven.agustin.ecoast@panpacificu.edu.ph', 'teacher', 'SUCCESS', '136.158.120.56', 'Chrome 146 · Windows 10', '2026-04-04 21:48:20'),
(627, 55, 'Andrea Mulach', 'andreamulach@gmail.com', 'student', 'LOGOUT', '143.44.216.7', 'Chrome 146 · Windows 19', '2026-04-04 21:53:00'),
(628, 55, 'Andrea Mulach', 'andreamulach@gmail.com', 'student', 'SUCCESS', '143.44.216.7', 'Chrome 146 · Android 16 · SM-A156E', '2026-04-04 21:54:02'),
(629, 5, 'Gray Fullbusters', 'gray@panpacificu.edu.ph', 'guard', 'SUCCESS', '143.44.216.7', 'Chrome 146 · Windows 19', '2026-04-04 21:55:09'),
(630, 7, 'Steven John A. Agustin', 'steven.agustin.ecoast@panpacificu.edu.ph', 'teacher', 'SUCCESS', '143.44.216.7', 'Chrome 146 · Android 16 · SM-A156E', '2026-04-04 22:02:48'),
(631, 1, 'Super Administrator', 'superadmin@panpacificu.edu.ph', 'super_admin', 'LOGOUT', '136.158.120.56', 'Chrome 146 · Windows 10', '2026-04-04 22:41:17'),
(632, 1, 'Super Administrator', 'superadmin@panpacificu.edu.ph', 'super_admin', 'SUCCESS', '136.158.120.56', 'Chrome 146 · Windows 10', '2026-04-04 22:44:50'),
(633, 1, 'Super Administrator', 'superadmin@panpacificu.edu.ph', 'super_admin', 'LOGOUT', '136.158.120.56', 'Chrome 146 · Windows 10', '2026-04-04 22:44:56'),
(634, 1, 'Super Administrator', 'superadmin@panpacificu.edu.ph', 'super_admin', 'SUCCESS', '49.150.35.37', 'Chrome 145 · Android 11 · RMX2061', '2026-04-04 22:51:59'),
(635, 1, 'Super Administrator', 'superadmin@panpacificu.edu.ph', 'super_admin', 'FAILED', '49.150.35.37', 'Chrome 145 · Android 11 · RMX2061', '2026-04-04 22:57:33'),
(636, 1, 'Super Administrator', 'superadmin@panpacificu.edu.ph', 'super_admin', 'SUCCESS', '49.150.35.37', 'Chrome 145 · Android 11 · RMX2061', '2026-04-04 22:57:45'),
(637, 1, 'Super Administrator', 'superadmin@panpacificu.edu.ph', 'super_admin', 'SUCCESS', '49.150.35.37', 'Chromium 146 · Android 11 · RMX2061', '2026-04-04 23:06:39'),
(638, 1, 'Super Administrator', 'superadmin@panpacificu.edu.ph', 'super_admin', 'FAILED', '49.150.35.37', 'Chromium 146 · Android 11 · RMX2061', '2026-04-04 23:10:24'),
(639, 1, 'Super Administrator', 'superadmin@panpacificu.edu.ph', 'super_admin', 'SUCCESS', '136.158.120.56', 'Chrome 146 · Windows 10', '2026-04-04 23:25:31'),
(640, 1, 'CSS Admin Cha', 'admin@panpacificu.edu.ph', 'admin', 'SUCCESS', '136.158.120.56', 'Chrome 146 · Windows 10', '2026-04-05 05:02:27'),
(641, 35, 'Natsu Dragneel', 'xnatsu25@gmail.com', 'student', 'SUCCESS', '136.158.120.56', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', '2026-04-05 05:07:08'),
(642, 5, 'Gray Fullbusters', 'gray@panpacificu.edu.ph', 'guard', 'SUCCESS', '136.158.120.56', 'Chrome 146 · Windows 10', '2026-04-05 05:07:58'),
(643, 5, 'Gray Fullbusters', 'gray@panpacificu.edu.ph', 'guard', 'LOGOUT', '136.158.120.56', 'Chrome 146 · Windows 10', '2026-04-05 05:08:18'),
(644, 1, 'Super Administrator', 'superadmin@panpacificu.edu.ph', 'super_admin', 'SUCCESS', '143.44.216.7', 'Chrome 146 · Windows 19', '2026-04-05 12:27:21'),
(645, 7, 'Steven John A. Agustin', 'steven.agustin.ecoast@panpacificu.edu.ph', 'teacher', 'SUCCESS', '143.44.216.7', 'Chrome 146 · Windows 19', '2026-04-05 12:38:57'),
(646, 55, 'Andrea Mulach', 'andreamulach@gmail.com', 'student', 'FAILED', '143.44.216.7', 'Chrome 146 · Windows 19', '2026-04-05 12:39:39'),
(647, 55, 'Andrea Mulach', 'andreamulach@gmail.com', 'student', 'SUCCESS', '143.44.216.7', 'Chrome 146 · Windows 19', '2026-04-05 12:40:15'),
(648, 5, 'Gray Fullbusters', 'gray@panpacificu.edu.ph', 'guard', 'SUCCESS', '143.44.216.7', 'Chrome 146 · Windows 19', '2026-04-05 12:40:48'),
(649, 1, 'Super Administrator', 'superadmin@panpacificu.edu.ph', 'super_admin', 'SUCCESS', '136.158.120.56', 'Chrome 146 · Windows 10', '2026-04-05 13:18:56'),
(650, 5, 'Gray Fullbusters', 'gray@panpacificu.edu.ph', 'guard', 'SUCCESS', '136.158.120.56', 'Chrome 144 · Android 14 · Infinix X6731B', '2026-04-05 14:13:02'),
(651, 1, 'Super Administrator', 'superadmin@panpacificu.edu.ph', 'super_admin', 'LOGOUT', '143.44.216.7', 'Chrome 146 · Windows 19', '2026-04-05 16:22:45'),
(652, 42, 'Zaiejan Agustin', 'zaiejanagustin@gmail.com', 'student', 'FAILED', '58.69.165.115', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Mobile Safari/537.36', '2026-04-06 08:12:37'),
(653, 7, 'Steven John A. Agustin', 'steven.agustin.ecoast@panpacificu.edu.ph', 'teacher', 'SUCCESS', '58.69.165.115', 'Chrome 144 · Android 14 · Infinix X6731B', '2026-04-06 08:13:38'),
(654, 42, 'Zaiejan Agustin', 'zaiejanagustin@gmail.com', 'student', 'FAILED', '58.69.165.115', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Mobile Safari/537.36', '2026-04-06 08:14:02'),
(655, 35, 'Natsu Dragneel', 'xnatsu25@gmail.com', 'student', 'FAILED', '58.69.165.115', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Mobile Safari/537.36', '2026-04-06 08:14:20'),
(656, 23, 'Lucy Heartfilla', 'lucyheart@panpacificu.edu.ph', 'student', 'SUCCESS', '58.69.165.115', 'Chrome 144 · Android 14 · Infinix X6731B', '2026-04-06 08:14:27'),
(657, 5, 'Gray Fullbusters', 'gray@panpacificu.edu.ph', 'guard', 'SUCCESS', '112.198.113.70', 'Chrome 144 · Android 14 · Infinix X6731B', '2026-04-06 08:37:32'),
(658, 5, 'Gray Fullbusters', 'gray@panpacificu.edu.ph', 'guard', 'LOGOUT', '112.198.113.70', 'Chrome 144 · Android 14 · Infinix X6731B', '2026-04-06 08:37:38'),
(659, 1, 'Super Administrator', 'superadmin@panpacificu.edu.ph', 'super_admin', 'SUCCESS', '112.198.113.70', 'Edge 146 · Windows 19', '2026-04-06 08:42:18'),
(660, 1, 'CSS Admin Cha', 'admin@panpacificu.edu.ph', 'admin', 'SUCCESS', '112.198.113.70', 'Edge 146 · Windows 19', '2026-04-06 08:42:26'),
(661, 7, 'Steven John A. Agustin', 'steven.agustin.ecoast@panpacificu.edu.ph', 'teacher', 'SUCCESS', '112.198.113.70', 'Edge 146 · Windows 19', '2026-04-06 08:42:29'),
(662, 19, 'Charimea Selga', 'charimea.selga.ecoast@panpacificu.edu.ph', 'student', 'FAILED', '112.198.113.70', 'Edge 146 · Windows 19', '2026-04-06 08:42:39'),
(663, 19, 'Charimea Selga', 'charimea.selga.ecoast@panpacificu.edu.ph', 'student', 'SUCCESS', '112.198.113.70', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36 Edg/146.0.0.0', '2026-04-06 08:42:57'),
(664, 5, 'Gray Fullbusters', 'gray@panpacificu.edu.ph', 'guard', 'SUCCESS', '112.198.120.152', 'Chrome 144 · Android 14 · Infinix X6731B', '2026-04-06 08:46:47'),
(665, 5, 'Gray Fullbusters', 'gray@panpacificu.edu.ph', 'guard', 'LOGOUT', '112.198.120.152', 'Chrome 144 · Android 14 · Infinix X6731B', '2026-04-06 08:46:52'),
(666, 19, 'Charimea Selga', 'charimea.selga.ecoast@panpacificu.edu.ph', 'student', 'LOGOUT', '112.198.120.152', 'Edge 146 · Windows 19', '2026-04-06 08:57:26'),
(667, NULL, NULL, 'janray.aquino.ecoast@panpacificu.edu.ph', 'student', 'FAILED', '112.198.120.152', 'Edge 146 · Windows 19', '2026-04-06 08:58:12'),
(668, 43, 'Jan Ray Aquino', 'janrayaquino9@gmail.com', 'student', 'FAILED', '112.198.120.152', 'Edge 146 · Windows 19', '2026-04-06 08:58:36'),
(669, 43, 'Jan Ray Aquino', 'janrayaquino9@gmail.com', 'student', 'FAILED', '112.198.120.152', 'Edge 146 · Windows 19', '2026-04-06 08:59:09'),
(670, 43, 'Jan Ray Aquino', 'janrayaquino9@gmail.com', 'student', 'FAILED', '112.198.120.152', 'Edge 146 · Windows 19', '2026-04-06 08:59:20'),
(671, NULL, NULL, 'janray.aquino.ecoast@panpacificu.edu.ph', 'student', 'FAILED', '112.198.120.152', 'Edge 146 · Windows 19', '2026-04-06 09:00:32'),
(672, NULL, NULL, 'janray.aquino.ecoast@panpacificu.edu.ph', 'student', 'FAILED', '112.198.120.152', 'Edge 146 · Windows 19', '2026-04-06 09:00:35'),
(673, NULL, NULL, 'janray.aquino.ecoast@panpacificu.edu.ph', 'student', 'FAILED', '112.198.120.152', 'Edge 146 · Windows 19', '2026-04-06 09:00:44'),
(674, NULL, NULL, 'janray.aquino.ecoast@panpacificu.edu.ph', 'student', 'FAILED', '112.198.120.152', 'Edge 146 · Windows 19', '2026-04-06 09:01:30'),
(675, NULL, NULL, 'janray.aquino.ecoast@panpacificu.edu.ph', 'student', 'FAILED', '58.69.165.115', 'Chrome 145 · Android 11 · RMX2061', '2026-04-06 09:02:13'),
(676, 43, 'Jan Ray Aquino', 'janrayaquino9@gmail.com', 'student', 'FAILED', '58.69.165.115', 'Chrome 145 · Android 11 · RMX2061', '2026-04-06 09:02:22'),
(677, 43, 'Jan Ray Aquino', 'janrayaquino9@gmail.com', 'student', 'SUCCESS', '112.198.120.152', 'Edge 146 · Windows 19', '2026-04-06 09:02:44'),
(678, 43, 'Jan Ray Aquino', 'janrayaquino9@gmail.com', 'student', 'FAILED', '58.69.165.115', 'Chrome 145 · Android 11 · RMX2061', '2026-04-06 09:02:44'),
(679, 23, 'Lucy Heartfilla', 'lucyheart@panpacificu.edu.ph', 'student', 'SUCCESS', '58.69.165.115', 'Chrome 144 · Android 14 · Infinix X6731B', '2026-04-06 10:01:35'),
(680, 23, 'Lucy Heartfilla', 'lucyheart@panpacificu.edu.ph', 'student', 'LOGOUT', '58.69.165.115', 'Chrome 144 · Android 14 · Infinix X6731B', '2026-04-06 10:06:44'),
(681, 23, 'Lucy Heartfilla', 'lucyheart@panpacificu.edu.ph', 'student', 'SUCCESS', '58.69.165.115', 'Chrome 144 · Android 14 · Infinix X6731B', '2026-04-06 10:06:53'),
(682, 5, 'Gray Fullbusters', 'gray@panpacificu.edu.ph', 'guard', 'SUCCESS', '131.226.96.120', 'Chrome 146 · Android 16 · SM-A156E', '2026-04-06 11:04:47'),
(683, 55, 'Andrea Mulach', 'andreamulach@gmail.com', 'student', 'SUCCESS', '131.226.96.24', 'Chrome 146 · Android 16 · SM-A156E', '2026-04-06 11:51:00'),
(684, 5, 'Gray Fullbusters', 'gray@panpacificu.edu.ph', 'guard', 'SUCCESS', '58.69.165.115', 'Chrome 144 · Android 14 · Infinix X6731B', '2026-04-06 14:34:50'),
(685, 5, 'Gray Fullbusters', 'gray@panpacificu.edu.ph', 'guard', 'LOGOUT', '58.69.165.115', 'Chrome 144 · Android 14 · Infinix X6731B', '2026-04-06 14:35:03'),
(686, 5, 'Gray Fullbusters', 'gray@panpacificu.edu.ph', 'guard', 'SUCCESS', '58.69.165.115', 'Chrome 144 · Android 14 · Infinix X6731B', '2026-04-06 14:37:27'),
(687, 5, 'Gray Fullbusters', 'gray@panpacificu.edu.ph', 'guard', 'LOGOUT', '58.69.165.115', 'Chrome 144 · Android 14 · Infinix X6731B', '2026-04-06 14:38:36'),
(688, 7, 'Steven John A. Agustin', 'steven.agustin.ecoast@panpacificu.edu.ph', 'teacher', 'LOGOUT', '58.69.165.115', 'Edge 146 · Windows 19', '2026-04-06 15:28:35'),
(689, 43, 'Jan Ray Aquino', 'janrayaquino9@gmail.com', 'student', 'LOGOUT', '58.69.165.115', 'Edge 146 · Windows 19', '2026-04-06 15:28:54'),
(690, 58, 'Onyx Lloyd Alunday', 'onyxlloyd.alunday.ecoast@panpacificu.edu.ph', 'student', 'SUCCESS', '58.69.165.115', 'Edge 146 · Windows 19', '2026-04-06 15:31:24'),
(691, 58, 'Onyx Lloyd Alunday', 'onyxlloyd.alunday.ecoast@panpacificu.edu.ph', 'student', 'LOGOUT', '58.69.165.115', 'Edge 146 · Windows 19', '2026-04-06 15:35:22'),
(692, 59, 'Marfel Gallarde', 'marfel.gallarde.ecoast@panpacificu.edu.ph', 'student', 'SUCCESS', '58.69.165.115', 'Edge 146 · Windows 19', '2026-04-06 15:39:13'),
(693, 59, 'Marfel Gallarde', 'marfel.gallarde.ecoast@panpacificu.edu.ph', 'student', 'LOGOUT', '58.69.165.115', 'Edge 146 · Windows 19', '2026-04-06 15:44:30'),
(694, 7, 'Steven John A. Agustin', 'steven.agustin.ecoast@panpacificu.edu.ph', 'teacher', 'SUCCESS', '58.69.165.115', 'Edge 146 · Windows 19', '2026-04-06 15:45:24'),
(695, 23, 'Lucy Heartfilla', 'lucyheart@panpacificu.edu.ph', 'student', 'FAILED', '58.69.165.115', 'Edge 146 · Windows 19', '2026-04-06 15:48:23'),
(696, 23, 'Lucy Heartfilla', 'lucyheart@panpacificu.edu.ph', 'student', 'SUCCESS', '58.69.165.115', 'Edge 146 · Windows 19', '2026-04-06 15:48:54'),
(697, 5, 'Gray Fullbusters', 'gray@panpacificu.edu.ph', 'guard', 'SUCCESS', '58.69.165.115', 'Chrome 145 · Android 11 · RMX2061', '2026-04-06 15:55:33'),
(698, 5, 'Gray Fullbusters', 'gray@panpacificu.edu.ph', 'guard', 'LOGOUT', '58.69.165.115', 'Chrome 145 · Android 11 · RMX2061', '2026-04-06 16:08:39'),
(699, 5, 'Gray Fullbusters', 'gray@panpacificu.edu.ph', 'guard', 'SUCCESS', '58.69.165.115', 'Chrome 145 · Android 11 · RMX2061', '2026-04-06 16:08:50'),
(700, 5, 'Gray Fullbusters', 'gray@panpacificu.edu.ph', 'guard', 'LOGOUT', '58.69.165.115', 'Chrome 145 · Android 11 · RMX2061', '2026-04-06 16:10:54'),
(701, 1, 'CSS Admin Cha', 'admin@panpacificu.edu.ph', 'admin', 'LOGOUT', '58.69.165.115', 'Edge 146 · Windows 19', '2026-04-06 16:12:15'),
(702, 4, 'Soleil Riego', 'soleil@gmail.com', 'admin', 'SUCCESS', '58.69.165.115', 'Edge 146 · Windows 19', '2026-04-06 16:12:26'),
(703, 5, 'Gray Fullbusters', 'gray@panpacificu.edu.ph', 'guard', 'SUCCESS', '58.69.165.115', 'Chrome 145 · Android 11 · RMX2061', '2026-04-06 16:17:19'),
(704, 5, 'Gray Fullbusters', 'gray@panpacificu.edu.ph', 'guard', 'LOGOUT', '58.69.165.115', 'Chrome 145 · Android 11 · RMX2061', '2026-04-06 16:18:45'),
(705, 5, 'Gray Fullbusters', 'gray@panpacificu.edu.ph', 'guard', 'SUCCESS', '58.69.165.115', 'Chrome 145 · Android 11 · RMX2061', '2026-04-06 16:25:49'),
(706, 5, 'Gray Fullbusters', 'gray@panpacificu.edu.ph', 'guard', 'LOGOUT', '58.69.165.115', 'Chrome 145 · Android 11 · RMX2061', '2026-04-06 16:26:06'),
(707, 1, 'Super Administrator', 'superadmin@panpacificu.edu.ph', 'super_admin', 'SUCCESS', '136.158.121.88', 'Chrome 146 · Windows 10', '2026-04-06 19:36:33'),
(708, 7, 'Steven John A. Agustin', 'steven.agustin.ecoast@panpacificu.edu.ph', 'teacher', 'SUCCESS', '136.158.121.88', 'Chrome 146 · Windows 10', '2026-04-06 19:37:30'),
(709, 7, 'Steven John A. Agustin', 'steven.agustin.ecoast@panpacificu.edu.ph', 'teacher', 'LOGOUT', '136.158.121.88', 'Chrome 146 · Windows 10', '2026-04-06 19:39:37'),
(710, NULL, NULL, 'admin@panpacificu.edu.ph', 'teacher', 'FAILED', '136.158.121.88', 'Chrome 146 · Windows 10', '2026-04-06 19:39:46'),
(711, 1, 'CSS Admin Cha', 'admin@panpacificu.edu.ph', 'admin', 'SUCCESS', '136.158.121.88', 'Chrome 146 · Windows 10', '2026-04-06 19:39:59'),
(712, 7, 'Steven John A. Agustin', 'steven.agustin.ecoast@panpacificu.edu.ph', 'teacher', 'SUCCESS', '136.158.121.88', 'Chrome 146 · Windows 10', '2026-04-06 20:51:40'),
(713, 7, 'Steven John A. Agustin', 'steven.agustin.ecoast@panpacificu.edu.ph', 'teacher', 'LOGOUT', '136.158.121.88', 'Chrome 146 · Windows 10', '2026-04-07 00:53:23'),
(714, 1, 'Super Administrator', 'superadmin@panpacificu.edu.ph', 'super_admin', 'SUCCESS', '136.158.121.88', 'Chrome 146 · Windows 10', '2026-04-07 00:53:36'),
(715, 1, 'CSS Admin Cha', 'admin@panpacificu.edu.ph', 'admin', 'LOGOUT', '136.158.121.88', 'Chrome 146 · Windows 10', '2026-04-07 00:54:54'),
(716, 2, 'Steven John A. Agustin', 'steven.agustin.admin@panpacificu.edu.ph', 'admin', 'SUCCESS', '136.158.121.88', 'Chrome 146 · Windows 10', '2026-04-07 00:54:59'),
(717, 2, 'Steven John A. Agustin', 'steven.agustin.admin@panpacificu.edu.ph', 'admin', 'LOGOUT', '136.158.121.88', 'Chrome 146 · Windows 10', '2026-04-07 01:06:53'),
(718, 1, 'CSS Admin Cha', 'admin@panpacificu.edu.ph', 'admin', 'SUCCESS', '136.158.121.88', 'Chrome 146 · Windows 10', '2026-04-07 01:07:09'),
(719, 1, 'CSS Admin Cha', 'admin@panpacificu.edu.ph', 'admin', 'LOGOUT', '136.158.121.88', 'Chrome 146 · Windows 10', '2026-04-07 01:07:16'),
(720, 5, 'Steven John A. Agustin', 'steven.agustin.admin@panpacificu.edu.ph', 'admin', 'SUCCESS', '136.158.121.88', 'Chrome 146 · Windows 10', '2026-04-07 01:08:06'),
(721, 5, 'Steven John A. Agustin', 'steven.agustin.admin@panpacificu.edu.ph', 'admin', 'LOGOUT', '136.158.121.88', 'Chrome 146 · Windows 10', '2026-04-07 01:17:01'),
(722, 1, 'CSS Admin Cha', 'admin@panpacificu.edu.ph', 'admin', 'SUCCESS', '136.158.121.88', 'Chrome 146 · Windows 10', '2026-04-07 01:17:07'),
(723, 7, 'Steven John A. Agustin', 'steven.agustin.ecoast@panpacificu.edu.ph', 'teacher', 'SUCCESS', '136.158.121.88', 'Chrome 146 · Windows 10', '2026-04-07 01:23:55'),
(724, 35, 'Natsu Dragneel', 'xnatsu25@gmail.com', 'student', 'SUCCESS', '136.158.121.88', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', '2026-04-07 01:31:54'),
(725, 35, 'Natsu Dragneel', 'xnatsu25@gmail.com', 'student', 'SUCCESS', '136.158.121.88', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', '2026-04-07 01:40:09'),
(726, 1, 'CSS Admin Cha', 'admin@panpacificu.edu.ph', 'admin', 'LOGOUT', '136.158.121.88', 'Chrome 146 · Windows 10', '2026-04-07 02:03:42'),
(727, 1, 'Super Administrator', 'superadmin@panpacificu.edu.ph', 'super_admin', 'SUCCESS', '136.158.121.88', 'Chrome 146 · Windows 10', '2026-04-07 21:15:01'),
(728, 1, 'Super Administrator', 'superadmin@panpacificu.edu.ph', 'super_admin', 'LOGOUT', '136.158.121.88', 'Chrome 146 · Windows 10', '2026-04-07 21:15:57'),
(729, 1, 'Super Administrator', 'superadmin@panpacificu.edu.ph', 'super_admin', 'SUCCESS', '136.158.121.88', 'Chrome 146 · Windows 10', '2026-04-08 15:47:52'),
(730, 7, 'Steven John A. Agustin', 'steven.agustin.ecoast@panpacificu.edu.ph', 'teacher', 'SUCCESS', '136.158.121.88', 'Chrome 146 · Windows 10', '2026-04-08 15:47:59'),
(731, 1, 'Super Administrator', 'superadmin@panpacificu.edu.ph', 'super_admin', 'LOGOUT', '136.158.121.88', 'Chrome 146 · Windows 10', '2026-04-08 15:48:39'),
(732, 7, 'Steven John A. Agustin', 'steven.agustin.ecoast@panpacificu.edu.ph', 'teacher', 'LOGOUT', '136.158.121.88', 'Chrome 146 · Windows 10', '2026-04-08 15:48:41'),
(733, 46, 'Steven John Agustin (CoAST)', 'steven.agustin.ecoast@panpacificu.edu.ph', 'student', 'SUCCESS', '136.158.121.88', 'Chrome 146 · Windows 10', '2026-04-09 10:03:47');

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
(1, 'maintenance_mode', '0', '2026-04-08 07:48:30');

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
  `admin_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `teacher`
--

INSERT INTO `teacher` (`teacher_id`, `teacher_name`, `teacher_profile_picture`, `teacher_email`, `teacher_password`, `teacher_program`, `teacher_current_subject`, `teacher_location`, `teacher_location_radius`, `created_at`, `teacher_barcode_scanner_serial_number`, `admin_id`) VALUES
(7, 'Steven John A. Agustin', 'teacher-1774726925820-608067.jpg', 'steven.agustin.ecoast@panpacificu.edu.ph', '$2b$10$j5nYLjVE7BGPwRwM3ELoJez2glRdd8LbnvHq8VDj9qxUMBHDpARCq', 'BS in Information Technology', NULL, '{\"latitude\":16.03040873677262,\"longitude\":120.7439043645886}', 50, '2026-01-31 16:25:25', 'TSN17698767256291441', 1),
(18, 'Mark Zuckerberg', 'teacher-1773680898788-757146.webp', 'markzuckerberg@panpacificu.edu.ph', '$2b$10$pgqV81EPWO.u2aOGz51M5O//Dma2hohn5F/t2bY0vWfAJm..dg9PO', 'BS in Information Technology', NULL, '{\"latitude\":16.01788971286583,\"longitude\":120.74942350387575}', 100, '2026-03-16 17:06:06', 'TSN17736807667173940', 1),
(19, 'Andrea B. Lachica', NULL, 'andrea@panpacificu.edu.ph', '$2b$10$9HmOHucmCL6f7ZseaO0SSuNIBOrs0JaaFgixPTR2AXsAHuLLyZNsu', 'BS in Criminology', NULL, '{\"latitude\":16.026207,\"longitude\":120.7763817}', 50, '2026-03-19 08:30:20', 'TSN17739090200094291', 1),
(20, 'Charimea Selga', 'teacher-1774706182549-241887.jpg', 'charimea.selga.ecoast@panpacificu.edu.ph', '$2b$10$bZkH7sYpiF04eAt1E03a9OYCSARsyxu8rIzy5tuygmDTkWEZTMDSy', 'BS in Computer Science', NULL, '{\"latitude\":15.986820340081675,\"longitude\":120.70427393430985}', 50, '2026-04-01 14:54:16', 'TSN17750552569416047', 1),
(21, 'Bill Gate', NULL, 'bill@panpacificu.edu.ph', '$2b$10$eZ/UkIDTOXKZ7FGi/pQgnejQ/HVPB2mvTNsz5tSrcYyV2JLp0rGAS', 'Bachelor of Science in Information Technology', NULL, NULL, 50, '2026-03-28 07:32:09', 'TSN17746831293607630', NULL);

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
(3, '3rd Year', '2026-02-02 18:48:45'),
(4, '4th Year', '2026-02-02 18:48:45'),
(16, 'Irregular', '2026-03-28 21:34:26'),
(17, '2nd Year', '2026-03-28 21:34:47'),
(18, '11', '2026-04-05 13:39:04'),
(19, '12', '2026-04-05 13:39:11'),
(20, 'Grade 10', '2026-04-05 13:40:34'),
(21, 'Grade 9', '2026-04-05 13:40:44'),
(22, 'Grade 8', '2026-04-05 13:40:55'),
(23, 'Grade 7', '2026-04-05 13:41:02'),
(24, 'Grade 5', '2026-04-05 13:41:15');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admin_accounts`
--
ALTER TABLE `admin_accounts`
  ADD PRIMARY KEY (`admin_id`);

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
-- Indexes for table `message_notifications`
--
ALTER TABLE `message_notifications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_receiver` (`receiver_id`,`receiver_role`,`is_read`),
  ADD KEY `idx_created` (`created_at`);

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
-- Indexes for table `subject_class_list`
--
ALTER TABLE `subject_class_list`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_student_subject` (`subject_id`,`student_id`);

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
  MODIFY `admin_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `attendance_record`
--
ALTER TABLE `attendance_record`
  MODIFY `attendance_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=376;

--
-- AUTO_INCREMENT for table `event_attendance_history_record`
--
ALTER TABLE `event_attendance_history_record`
  MODIFY `event_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=69;

--
-- AUTO_INCREMENT for table `event_attendance_record`
--
ALTER TABLE `event_attendance_record`
  MODIFY `event_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=61;

--
-- AUTO_INCREMENT for table `event_setter`
--
ALTER TABLE `event_setter`
  MODIFY `event_setter_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `guards`
--
ALTER TABLE `guards`
  MODIFY `guard_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `messages`
--
ALTER TABLE `messages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=229;

--
-- AUTO_INCREMENT for table `message_notifications`
--
ALTER TABLE `message_notifications`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=118;

--
-- AUTO_INCREMENT for table `notifications`
--
ALTER TABLE `notifications`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=51;

--
-- AUTO_INCREMENT for table `program`
--
ALTER TABLE `program`
  MODIFY `program_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=59;

--
-- AUTO_INCREMENT for table `student_accounts`
--
ALTER TABLE `student_accounts`
  MODIFY `student_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=60;

--
-- AUTO_INCREMENT for table `student_records_regular_class`
--
ALTER TABLE `student_records_regular_class`
  MODIFY `student_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=70;

--
-- AUTO_INCREMENT for table `subject`
--
ALTER TABLE `subject`
  MODIFY `subject_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=30;

--
-- AUTO_INCREMENT for table `subject_and_year_level_setter`
--
ALTER TABLE `subject_and_year_level_setter`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT for table `subject_class_list`
--
ALTER TABLE `subject_class_list`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=77;

--
-- AUTO_INCREMENT for table `super_admin_accounts`
--
ALTER TABLE `super_admin_accounts`
  MODIFY `super_admin_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `system_activity_logs`
--
ALTER TABLE `system_activity_logs`
  MODIFY `log_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=683;

--
-- AUTO_INCREMENT for table `system_login_logs`
--
ALTER TABLE `system_login_logs`
  MODIFY `log_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=734;

--
-- AUTO_INCREMENT for table `system_settings`
--
ALTER TABLE `system_settings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=30;

--
-- AUTO_INCREMENT for table `teacher`
--
ALTER TABLE `teacher`
  MODIFY `teacher_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT for table `year_level`
--
ALTER TABLE `year_level`
  MODIFY `year_level_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
