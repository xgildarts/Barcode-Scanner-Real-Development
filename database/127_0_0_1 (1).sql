-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Mar 21, 2026 at 03:17 PM
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
-- Database: `activity_proposal_system`
--
CREATE DATABASE IF NOT EXISTS `activity_proposal_system` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `activity_proposal_system`;

-- --------------------------------------------------------

--
-- Table structure for table `activity_logs`
--

CREATE TABLE `activity_logs` (
  `log_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `proposal_id` int(11) DEFAULT NULL,
  `action` varchar(100) NOT NULL,
  `details` text DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `activity_logs`
--

INSERT INTO `activity_logs` (`log_id`, `user_id`, `proposal_id`, `action`, `details`, `ip_address`, `created_at`) VALUES
(1, 1, NULL, 'login', '', '::1', '2026-02-11 22:38:03'),
(2, 2, NULL, 'login', '', '::1', '2026-02-11 22:38:43'),
(3, 3, NULL, 'login', '', '::1', '2026-02-11 22:38:58'),
(4, 3, 1, 'create_proposal', 'Created: Solar System', '::1', '2026-02-11 22:40:35'),
(5, 4, NULL, 'login', '', '::1', '2026-02-11 22:41:30'),
(6, 4, 2, 'create_proposal', 'Created: Sample', '::1', '2026-02-11 22:45:47'),
(7, 1, NULL, 'login', '', '::1', '2026-02-11 22:46:28'),
(8, 1, 2, 'update_status', 'Status changed to: approved', '::1', '2026-02-11 22:48:10'),
(9, 4, NULL, 'login', '', '::1', '2026-02-11 22:49:25'),
(10, 1, NULL, 'login', '', '::1', '2026-02-11 22:52:03'),
(11, 2, NULL, 'login', '', '::1', '2026-02-11 22:52:42'),
(12, 2, 1, 'update_status', 'Status changed to: approved', '::1', '2026-02-11 22:53:00'),
(13, 1, NULL, 'login', '', '::1', '2026-02-11 22:57:58'),
(14, 1, NULL, 'create_user', 'Created user: stevenjohnagustin25@panpacificu.edu.ph', '::1', '2026-02-11 22:59:29'),
(15, 1, NULL, 'login', '', '::1', '2026-02-11 23:02:41'),
(16, 5, NULL, 'login', '', '::1', '2026-02-11 23:02:58'),
(17, 5, 3, 'create_proposal', 'Created: Computers', '::1', '2026-02-11 23:04:09'),
(18, 1, NULL, 'login', '', '::1', '2026-02-11 23:04:21'),
(19, 1, 3, 'update_status', 'Status changed to: approved', '::1', '2026-02-11 23:05:55'),
(20, 5, NULL, 'login', '', '::1', '2026-02-11 23:06:05'),
(21, 5, NULL, 'login', '', '::1', '2026-02-11 23:06:41'),
(22, 1, NULL, 'login', '', '::1', '2026-02-12 04:28:08'),
(23, 3, NULL, 'login', '', '::1', '2026-02-12 04:28:33'),
(24, 3, 4, 'create_proposal', 'Created: Ni Mayen', '::1', '2026-02-12 04:29:34'),
(25, 2, NULL, 'login', '', '::1', '2026-02-12 04:30:07'),
(26, 2, 4, 'update_status', 'Status changed to: approved', '::1', '2026-02-12 04:31:26'),
(27, 3, NULL, 'login', '', '::1', '2026-02-12 04:31:37'),
(28, 1, NULL, 'login', '', '::1', '2026-02-12 04:32:15'),
(29, 1, NULL, 'login', '', '::1', '2026-02-21 11:45:54'),
(30, 1, NULL, 'update_user_status', 'Changed user 5 to inactive', '::1', '2026-02-21 11:53:44'),
(31, 1, NULL, 'update_user_status', 'Changed user 5 to active', '::1', '2026-02-21 11:53:51'),
(32, 1, NULL, 'update_user_status', 'Changed user 5 to inactive', '::1', '2026-02-21 11:54:55'),
(33, 1, NULL, 'update_user_status', 'Changed user 5 to active', '::1', '2026-02-21 11:54:58'),
(34, 1, NULL, 'update_user_status', 'Changed user 5 to active', '::1', '2026-02-21 11:57:02'),
(35, 3, NULL, 'login', '', '::1', '2026-02-21 12:00:21'),
(36, 2, NULL, 'login', '', '::1', '2026-02-21 12:03:04'),
(37, 3, NULL, 'login', '', '::1', '2026-02-21 12:04:05'),
(38, 3, 5, 'create_proposal', 'Created: BLUE DRAGON', '::1', '2026-02-21 12:04:54'),
(39, 3, NULL, 'login', '', '::1', '2026-02-21 12:05:26'),
(40, 2, NULL, 'login', '', '::1', '2026-02-21 12:05:36'),
(41, 1, NULL, 'login', '', '::1', '2026-02-22 06:26:18'),
(42, 1, NULL, 'update_user_status', 'Changed user 5 to inactive', '::1', '2026-02-22 06:26:44'),
(43, 1, NULL, 'update_user_status', 'Changed user 5 to active', '::1', '2026-02-22 06:26:47'),
(44, 1, NULL, 'login', '', '::1', '2026-03-08 05:05:40');

-- --------------------------------------------------------

--
-- Table structure for table `comments`
--

CREATE TABLE `comments` (
  `comment_id` int(11) NOT NULL,
  `proposal_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `comment_text` text NOT NULL,
  `comment_type` enum('feedback','revision_request','approval_note','rejection_note') DEFAULT 'feedback',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `comments`
--

INSERT INTO `comments` (`comment_id`, `proposal_id`, `user_id`, `comment_text`, `comment_type`, `created_at`) VALUES
(1, 2, 4, 'sample comment', 'feedback', '2026-02-11 22:46:01'),
(2, 2, 1, 'No comment', 'feedback', '2026-02-11 22:47:58'),
(3, 2, 1, 'No comment', 'approval_note', '2026-02-11 22:48:10'),
(4, 1, 2, 'Good', 'approval_note', '2026-02-11 22:53:00'),
(5, 3, 1, 'Okay!', 'approval_note', '2026-02-11 23:05:55'),
(6, 4, 3, 'Mam Jane pa check', 'feedback', '2026-02-12 04:29:57'),
(7, 4, 2, 'Na check kuna', 'feedback', '2026-02-12 04:30:33'),
(8, 4, 2, 'Good', 'approval_note', '2026-02-12 04:31:26');

-- --------------------------------------------------------

--
-- Table structure for table `notifications`
--

CREATE TABLE `notifications` (
  `notification_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `proposal_id` int(11) NOT NULL,
  `message` text NOT NULL,
  `type` enum('submission','approval','rejection','revision','comment','review') DEFAULT 'submission',
  `is_read` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `notifications`
--

INSERT INTO `notifications` (`notification_id`, `user_id`, `proposal_id`, `message`, `type`, `is_read`, `created_at`) VALUES
(1, 2, 1, 'Prof. Maria Santos submitted a new proposal: Solar System', 'submission', 1, '2026-02-11 22:40:35'),
(2, 1, 2, 'John Dela Cruz submitted a new proposal: Sample', 'submission', 1, '2026-02-11 22:45:47'),
(3, 1, 2, 'John Dela Cruz added a comment', 'comment', 1, '2026-02-11 22:46:01'),
(4, 4, 2, 'System Administrator added a comment', 'comment', 1, '2026-02-11 22:47:58'),
(5, 4, 2, 'Your proposal has been approved', 'approval', 1, '2026-02-11 22:48:10'),
(6, 3, 1, 'Your proposal has been approved', 'approval', 1, '2026-02-11 22:53:00'),
(7, 1, 3, 'Steven John A. Agustin submitted a new proposal: Computers', 'submission', 1, '2026-02-11 23:04:09'),
(8, 5, 3, 'Your proposal has been approved', 'approval', 0, '2026-02-11 23:05:55'),
(9, 2, 4, 'Prof. Maria Santos submitted a new proposal: Ni Mayen', 'submission', 1, '2026-02-12 04:29:34'),
(10, 2, 4, 'Prof. Maria Santos added a comment', 'comment', 1, '2026-02-12 04:29:57'),
(11, 3, 4, 'Dr. Jean M. Fernandez added a comment', 'comment', 1, '2026-02-12 04:30:33'),
(12, 3, 4, 'Your proposal has been approved', 'approval', 1, '2026-02-12 04:31:26'),
(13, 2, 5, 'Prof. Maria Santos submitted a new proposal: BLUE DRAGON', 'submission', 0, '2026-02-21 12:04:54');

-- --------------------------------------------------------

--
-- Table structure for table `proposals`
--

CREATE TABLE `proposals` (
  `proposal_id` int(11) NOT NULL,
  `proposer_id` int(11) NOT NULL,
  `approver_id` int(11) NOT NULL,
  `activity_title` varchar(255) NOT NULL,
  `activity_type` enum('academic','cultural','sports','community','workshop','seminar','other') NOT NULL,
  `activity_description` text NOT NULL,
  `objectives` text NOT NULL,
  `target_participants` varchar(255) DEFAULT NULL,
  `venue` varchar(255) NOT NULL,
  `date_from` date NOT NULL,
  `date_to` date NOT NULL,
  `time_from` time NOT NULL,
  `time_to` time NOT NULL,
  `budget_estimate` decimal(12,2) DEFAULT 0.00,
  `expected_outcomes` text DEFAULT NULL,
  `supporting_document` varchar(255) DEFAULT NULL,
  `status` enum('pending','under_review','revision_requested','approved','rejected') DEFAULT 'pending',
  `submission_date` timestamp NOT NULL DEFAULT current_timestamp(),
  `review_date` timestamp NULL DEFAULT NULL,
  `approval_date` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `proposals`
--

INSERT INTO `proposals` (`proposal_id`, `proposer_id`, `approver_id`, `activity_title`, `activity_type`, `activity_description`, `objectives`, `target_participants`, `venue`, `date_from`, `date_to`, `time_from`, `time_to`, `budget_estimate`, `expected_outcomes`, `supporting_document`, `status`, `submission_date`, `review_date`, `approval_date`) VALUES
(1, 3, 2, 'Solar System', 'other', 'Solar is the best free energy', 'Clean energy', 'Students', 'Campus', '2026-02-12', '2026-02-28', '06:39:00', '12:39:00', 20000.00, 'Must be free, electricity', '698d0563c49f4.png', 'approved', '2026-02-11 22:40:35', '2026-02-11 22:53:00', '2026-02-11 22:53:00'),
(2, 4, 1, 'Sample', 'other', 'Sample', 'Sample', 'Students', 'Campus', '2026-02-12', '2026-02-28', '06:45:00', '06:45:00', 20000.00, 'Sample', '698d069bc8e2f.docx', 'approved', '2026-02-11 22:45:47', '2026-02-11 22:48:10', '2026-02-11 22:48:10'),
(3, 5, 1, 'Computers', 'other', 'We need computer for our students', 'Make it easy for them to learned', 'Students', 'School', '2026-02-12', '2026-02-28', '07:03:00', '07:03:00', 100000.00, 'Make students learned more', '698d0ae9cea1c.docx', 'approved', '2026-02-11 23:04:09', '2026-02-11 23:05:55', '2026-02-11 23:05:55'),
(4, 3, 2, 'Ni Mayen', 'other', 'Ni Mayen Ni Mayen', 'Ni Mayen', 'Students', 'Campus', '2026-02-12', '2026-02-28', '12:29:00', '12:29:00', 1000000.00, 'Ni Mayen', '698d572e6aa20.pdf', 'approved', '2026-02-12 04:29:34', '2026-02-12 04:31:26', '2026-02-12 04:31:26'),
(5, 3, 2, 'BLUE DRAGON', 'academic', 'sample', 'To test', 'Students', 'Unknown', '2026-02-21', '2026-02-28', '20:04:00', '21:05:00', 0.00, 'None', '69999f66e783b.pdf', 'pending', '2026-02-21 12:04:54', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `user_id` int(11) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `full_name` varchar(100) NOT NULL,
  `role` enum('faculty','non-teaching','dean','admin') NOT NULL,
  `department` varchar(100) DEFAULT NULL,
  `contact_number` varchar(20) DEFAULT NULL,
  `status` enum('active','inactive') DEFAULT 'active',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `email`, `password`, `full_name`, `role`, `department`, `contact_number`, `status`, `created_at`, `updated_at`) VALUES
(1, 'admin@panpacific.edu.ph', '$2y$10$G.VkQhmECoMyo7yP/zJQSeF5lMnocHVIQkX5HCDrcmVOOuYS7XDn.', 'System Administrator', 'admin', 'IT Department', '', 'active', '2026-02-11 22:29:58', '2026-02-11 22:49:08'),
(2, 'dean@panpacific.edu.ph', '$2y$10$G.VkQhmECoMyo7yP/zJQSeF5lMnocHVIQkX5HCDrcmVOOuYS7XDn.', 'Dr. Jean M. Fernandez', 'dean', 'Engineering Computing Academy', NULL, 'active', '2026-02-11 22:29:58', '2026-02-11 22:38:23'),
(3, 'faculty@panpacific.edu.ph', '$2y$10$G.VkQhmECoMyo7yP/zJQSeF5lMnocHVIQkX5HCDrcmVOOuYS7XDn.', 'Prof. Maria Santos', 'faculty', 'Information Technology', NULL, 'active', '2026-02-11 22:29:58', '2026-02-11 22:38:25'),
(4, 'staff@panpacific.edu.ph', '$2y$10$G.VkQhmECoMyo7yP/zJQSeF5lMnocHVIQkX5HCDrcmVOOuYS7XDn.', 'Mayen Salvarion', 'non-teaching', 'Student Affairs', '09087641621', 'active', '2026-02-11 22:29:58', '2026-02-11 22:50:34'),
(5, 'stevenjohnagustin25@panpacificu.edu.ph', '$2y$10$cid2zZuIaAsDmlYm/nq8Yu6NV7sxaz2UQxhKN5weItxYOlTV5h0/u', 'Steven John A. Agustin', 'faculty', 'IT Department', '09481239328', 'active', '2026-02-11 22:59:29', '2026-02-22 06:26:47');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `activity_logs`
--
ALTER TABLE `activity_logs`
  ADD PRIMARY KEY (`log_id`),
  ADD KEY `idx_user` (`user_id`),
  ADD KEY `idx_proposal` (`proposal_id`);

--
-- Indexes for table `comments`
--
ALTER TABLE `comments`
  ADD PRIMARY KEY (`comment_id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `idx_proposal` (`proposal_id`);

--
-- Indexes for table `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`notification_id`),
  ADD KEY `proposal_id` (`proposal_id`),
  ADD KEY `idx_user_read` (`user_id`,`is_read`);

--
-- Indexes for table `proposals`
--
ALTER TABLE `proposals`
  ADD PRIMARY KEY (`proposal_id`),
  ADD KEY `idx_status` (`status`),
  ADD KEY `idx_proposer` (`proposer_id`),
  ADD KEY `idx_approver` (`approver_id`),
  ADD KEY `idx_dates` (`date_from`,`date_to`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `idx_email` (`email`),
  ADD KEY `idx_role` (`role`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `activity_logs`
--
ALTER TABLE `activity_logs`
  MODIFY `log_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=45;

--
-- AUTO_INCREMENT for table `comments`
--
ALTER TABLE `comments`
  MODIFY `comment_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `notifications`
--
ALTER TABLE `notifications`
  MODIFY `notification_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `proposals`
--
ALTER TABLE `proposals`
  MODIFY `proposal_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `activity_logs`
--
ALTER TABLE `activity_logs`
  ADD CONSTRAINT `activity_logs_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE;

--
-- Constraints for table `comments`
--
ALTER TABLE `comments`
  ADD CONSTRAINT `comments_ibfk_1` FOREIGN KEY (`proposal_id`) REFERENCES `proposals` (`proposal_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `comments_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE;

--
-- Constraints for table `notifications`
--
ALTER TABLE `notifications`
  ADD CONSTRAINT `notifications_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `notifications_ibfk_2` FOREIGN KEY (`proposal_id`) REFERENCES `proposals` (`proposal_id`) ON DELETE CASCADE;

--
-- Constraints for table `proposals`
--
ALTER TABLE `proposals`
  ADD CONSTRAINT `proposals_ibfk_1` FOREIGN KEY (`proposer_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `proposals_ibfk_2` FOREIGN KEY (`approver_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE;
--
-- Database: `animal_rescue_db`
--
CREATE DATABASE IF NOT EXISTS `animal_rescue_db` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `animal_rescue_db`;

-- --------------------------------------------------------

--
-- Table structure for table `admin_accounts`
--

CREATE TABLE `admin_accounts` (
  `id` int(11) NOT NULL,
  `username` varchar(200) NOT NULL,
  `password` varchar(1000) NOT NULL,
  `date_created` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `admin_accounts`
--

INSERT INTO `admin_accounts` (`id`, `username`, `password`, `date_created`) VALUES
(5, 'root', '$2y$10$bWq45IE.PKmXsDa1z3A2LukwLJ8oi/0xrTNFyb/80v0i4/Z7NCA5q', '2025-07-28 01:54:14');

-- --------------------------------------------------------

--
-- Table structure for table `animal_reports`
--

CREATE TABLE `animal_reports` (
  `id` int(11) NOT NULL,
  `reporter_name` varchar(100) NOT NULL,
  `details` text NOT NULL,
  `location` varchar(255) NOT NULL,
  `image` varchar(200) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `contact_requests`
--

CREATE TABLE `contact_requests` (
  `id` int(11) NOT NULL,
  `sender_name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `message` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `contact_requests`
--

INSERT INTO `contact_requests` (`id`, `sender_name`, `email`, `message`, `created_at`) VALUES
(2, 'Mark Lopez', 'marklopez@gmail.com', 'Can I visit the shelter this weekend to see Max?', '2025-07-26 19:01:39'),
(3, 'Angela Reyes', 'angela.reyes@yahoo.com', 'Is Snowy the puppy still available for adoption?', '2025-07-26 19:01:39');

-- --------------------------------------------------------

--
-- Table structure for table `rescued_animals`
--

CREATE TABLE `rescued_animals` (
  `id` int(11) NOT NULL,
  `animal_name` varchar(100) NOT NULL,
  `rescue_date` date NOT NULL,
  `animal_condition` text NOT NULL,
  `image` varchar(200) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `rescued_animals`
--

INSERT INTO `rescued_animals` (`id`, `animal_name`, `rescue_date`, `animal_condition`, `image`, `created_at`) VALUES
(11, 'Kangal', '2025-07-27', 'Pakkang', 'http://localhost/Stray-Animal-Platform/client/public/images/images/c529a263-8ffa-4521-a47e-babb146f1e6b.webp', '2025-07-26 20:02:13'),
(12, 'Cutie pie', '2025-07-29', 'Magaling na', 'http://localhost/Stray-Animal-Platform/client/public/images/images/Best-Small-Dog-Breeds-Pomeranian.webp', '2025-07-26 20:04:48'),
(13, 'Lone wolf', '2025-07-26', 'Ok na sya', 'http://localhost/Stray-Animal-Platform/client/public/images/images/c529a263-8ffa-4521-a47e-babb146f1e6b.webp', '2025-07-26 20:40:52'),
(14, 'Good dog', '2025-07-27', 'He feel happy now', 'http://localhost/Stray-Animal-Platform/client/public/images/images/6885453b9b70e_livestock-dogs-farm-dogs-german-shepherd-66e8667aed873.avif', '2025-07-26 21:15:29');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admin_accounts`
--
ALTER TABLE `admin_accounts`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `animal_reports`
--
ALTER TABLE `animal_reports`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `contact_requests`
--
ALTER TABLE `contact_requests`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `rescued_animals`
--
ALTER TABLE `rescued_animals`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admin_accounts`
--
ALTER TABLE `admin_accounts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `animal_reports`
--
ALTER TABLE `animal_reports`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `contact_requests`
--
ALTER TABLE `contact_requests`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `rescued_animals`
--
ALTER TABLE `rescued_animals`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;
--
-- Database: `attendance_barcode_system`
--
CREATE DATABASE IF NOT EXISTS `attendance_barcode_system` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `attendance_barcode_system`;

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
(1, 'Administrator', 'admin@panpacificu.edu.ph', 'admin-1773474482355-324628.png', '$2b$10$WLX3Xkyz5en54kOO/5ZpouaRVWh2a9COy/rskR8Z/sqwBLYYB30ra', '2026-02-09 00:02:44');

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
(94, '1231333', 'A', 'Heartfilla', 'Lucy', 'BS in Information Technology', '17:07:30', '2026-03-21', '3rd Year', 'Computer Programming', NULL, NULL, 23, 'TSN17736807667173940');

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
(100, '1231426', 'M', 'Selga', 'Charimea', 'BS in Information Technology', '12:30:38', '2026-03-21', '3rd Year', 'Big Data', NULL, NULL, 21, 'TSN17698767256291441'),
(101, '12313598', 'O', 'Obillo (ECoAST)', 'Princess', 'BS in Information Technology', '12:30:55', '2026-03-21', '3rd Year', 'Big Data', NULL, NULL, 27, 'TSN17698767256291441'),
(102, '1231231231231', 'A', 'Dragneel', 'Natsu', 'BS in Information Technology', '12:31:01', '2026-03-21', '3rd Year', 'Big Data', NULL, NULL, 28, 'TSN17698767256291441'),
(103, '14567', 'A', 'Chua', 'Diane', 'RPSEA', '12:31:09', '2026-03-21', '3rd Year', 'Big Data', NULL, NULL, 42, 'TSN17698767256291441'),
(104, '1231333', 'A', 'Heartfilla', 'Lucy', 'BS in Information Technology', '12:31:15', '2026-03-21', '3rd Year', 'Big Data', NULL, NULL, 45, 'TSN17698767256291441'),
(105, '1231377', 'A', 'Agustin (CoAST)', 'Steven John', 'BS in Information Technology', '12:31:27', '2026-03-21', '3rd Year', 'Big Data', NULL, NULL, 56, 'TSN17698767256291441'),
(106, '1231333', 'A', 'Heartfilla', 'Lucy', 'BS in Information Technology', '17:07:30', '2026-03-21', '3rd Year', 'Computer Programming', NULL, NULL, 23, 'TSN17736807667173940');

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
(38, 46, 'Steven John A. Agustin (CoAST)', '1231377', 'BS in Information Technology', '3rd Year', 'Foundation day', 'Gray Fullbusters', 'Main Gate', '12:45:19', '2026-03-21', 'TIME IN', 5, 1);

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
(42, 46, 'Steven John A. Agustin (CoAST)', '1231377', 'BS in Information Technology', '3rd Year', 'Foundation day', 'Gray Fullbusters', 'Main Gate', '12:45:19', '2026-03-21', 'TIME IN', 5, 1);

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
  `barcode_teacher_serial` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `student_accounts`
--

INSERT INTO `student_accounts` (`student_id`, `student_id_number`, `student_firstname`, `student_middlename`, `student_lastname`, `student_email`, `password`, `student_year_level`, `student_guardian_number`, `student_program`, `location_generated`, `barcode`, `barcode_date_generated`, `device_id`, `admin_id`, `barcode_teacher_serial`) VALUES
(18, '1233345989', 'Agrifina', 'A', 'Agaran', 'agrifina@panpacificu.edu.ph', '$2b$10$OuBrVjLjQIjpZ6DNU.rpROthB9qekSgTqujfjA0B/gsMIrH9WFaJG', '3rd Year', '+639481239328', 'BS Education', '', 'BC17708947181891836', '2026-02-12 19:11:58', '', 1, NULL),
(19, '1231422', 'Charimea', 'M', 'Selga', 'charimea.selga.ecoast@panpacificu.edu.ph', '$2b$10$.VzGuTyj7ZlUsdb/Vd5cUeDKBMqawDkcEZEUlKF9jug/E28aFC9/W', '3rd Year', '+639563543429', 'BS in Information Technology', '', 'BC17708952022486423', '2026-02-12 19:20:02', '', 1, NULL),
(23, '1231333', 'Lucy', 'B', 'Heartfilla', 'lucyheart@panpacificu.edu.ph', '$2b$10$617POruNNIa1m8LeMYdKS.9IjOgJqbMX.N1.wInPcKK6hYj26weHy', '3rd Year', '+639763891308', 'BS in Information Technology', '', 'BC17740838131748865', '2026-03-21 17:03:37', '8596927ce8a26ec5db6831cb162f7da752db54b19ec598e9714fb28fcbbdda54', 0, 'TSN17736807667173940'),
(25, '14567', 'Diane', 'A', 'Chua', 'dwynna@gmail.com', '$2b$10$haEoY2zIw3gGj0k4wHFHKOIoXTJu2soBKV1/T1tICPwSy5CPd9Ceu', '3rd Year', '+639195364085', 'RPSEA', '', 'BC17728938112284412', '2026-03-07 22:30:11', '', 0, NULL),
(26, '123123', 'Luna', 'M', 'Toka', 'lunatoka@gmail.com', '$2b$10$5s.sqyEQozw1ukpJCFToSuFsmPmhTvxjspj9koWCt/tmP8ORg7wFC', '2nd Year', '+639455415405', 'BS in Criminology', '', 'BC17730263477958911', '2026-03-09 11:19:07', '', 0, NULL),
(28, '456', 'Andria', 'A', 'Ramirez', 'andria@gmail.com', '$2b$10$sO26fMQvVakQtiCy4Zoal.Yn09ulCejCe61giWID5iWnna/nuCs0K', '1st Year', '+639615842358', 'BS Education', '', 'BC17731513173571253', '2026-03-10 22:01:57', '', 0, NULL),
(29, '1231574', 'Alexander', 'L', 'Magbitang', 'alexander.magbitang.ecoast@panpacificu.edu.ph', '$2b$10$sz2Q0ajsshSDGiQOkeWv0.NrqzTMDw5DxxPO7qJRgVkXDu0zAYNVW', '3rd Year', '+639455964091', 'BS in Information Technology', '', 'BC17732101025598406', '2026-03-11 14:21:42', '', 0, NULL),
(32, '12313598', 'Princess', 'O', 'Obillo (ECoAST)', 'princess.obillo.ecoast@panpacificu.edu.ph', '$2b$10$OJRhAThkJPVmRtZKwn3TgumarOGVk/t16kx3llQsT2hn/xSknESa.', '3rd Year', '+639763891308', 'BS in Information Technology', '', 'BC17732896532762650', '2026-03-12 12:27:33', '', 0, NULL),
(33, '12312312312', 'Marfel Gem', 'A', 'Gallarde (ECoAST)', 'marfel.gallarde.ecoast@panpacificu.edu.ph', '$2b$10$tKtaOIS4wk/b8R9x/bw9Fee6fVO54mEl2S9jjzGtsOKFMwlRGBJPO', '4th Year', '+639763891308', 'BS in Computer Engineering', '', 'BC17732910277928988', '2026-03-12 12:50:27', '', 0, NULL),
(35, '1231231231231', 'Natsu', 'B', 'Dragneel', 'xnatsu25@gmail.com', '$2b$10$z2EKEoHbu6d0TBxeh2BgnezZJCcTCB.6mSjVoYM9nakkmUaeUFMK2', '3rd Year', '+63639763891308', 'BS in Information Technology', '', 'BC17740851248848291', '2026-03-21 21:57:50', '5fd6d04e115bc91553eef8cc76799725738ec5dca241a58d5c924d3e185c623a', 0, 'TSN17698767256291441'),
(41, '123123123', 'Angel Mageri', 'A', 'Cabote (ECoAST)', 'angel.cabote.ecoast@panpacificu.edu.ph', '$2b$10$FUo8ACmR2EdY44cNkkLNvuPknzBlR/EnpRy3nWZ2T2Ou5r1GlVlGe', '3rd Year', '+639763891307', 'BS in Information Technology', '', 'BC17738952869517438', '2026-03-19 12:41:27', '', 0, 'TSN17736807667173940'),
(42, '737773', 'Zaiejan', 'A', 'Agustin', 'zaiejanagustin@gmail.com', '$2b$10$siGOJgd3GAIWr85GZy0p3OcoaXjkulNqVh1.aCfaJVCNyfs.NsUju', '3rd Year', '+639763891308', 'BS in Information Technology', '', 'BC17736449111529783', '2026-03-16 15:08:31', '', 0, NULL),
(43, '1231392', 'Jan Ray', 'Agmata', 'Aquino', 'janrayaquino9@gmail.com', '$2b$10$ILpPmsYI.iv3Y9BAWj6AK.ht72RhYFkLxP8hd8RfPebBWKqc6khYu', '3rd Year', '+6309661672889', 'BS in Information Technology', '', 'BC17736592032317119', '2026-03-16 19:06:43', '', 0, NULL),
(44, '1010', 'Jasmin', 'A', 'Pastor', 'jasmin@gmail.com', '$2b$10$H/YJjdnT2pZemnE6pStiSOpXJFwJbrcP./632TD6BR0Zc61ai69Ki', 'SBE', '+63639615842353', 'BS in Mechanics', '', 'BC17739113039904719', '2026-03-19 17:14:11', '', 0, 'TSN17739090200094291'),
(46, '1231377', 'Steven John', 'A', 'Agustin (CoAST)', 'steven.agustin.ecoast@panpacificu.edu.ph', '$2b$10$9CJD/U5MPDMB/3.f18vYSeklWLX1TT90cl4Q6ls0sow54K3TDY61O', '3rd Year', '+639763891308', 'BS in Information Technology', '', 'BC17740680670469201', '2026-03-21 12:41:07', '5fd6d04e115bc91553eef8cc76799725738ec5dca241a58d5c924d3e185c623a', 0, 'TSN17698767256291441');

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
(58, '1010', 'Jasmin', 'A', 'Pastor', 'jasmin@gmail.com', 'SBE', '+63639615842353', NULL, 'BS in Mechanics', 'TSN17698767256291441', '2026-03-20 17:31:10');

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
(25, 'Math', '2026-03-19 16:33:30', 19);

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
(13, 'Physics', '3rd Year', 'TSN17736807667173940'),
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
(1, 'Super Administrator', 'superadmin@panpacificu.edu.ph', '$2b$10$d4kXfzxstDkpQPR5Gp8YZeove4F2/T5Ga/EaS8g7y9c4ddf9HITP6', 'superadmin-1774076347437-483598.jpg', '2026-03-15 11:22:58');

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
(200, 1, 'Administrator', 'admin', 'SET_EVENT', 'Event', '', 'Sample', 'Set event name to: Sample', '136.158.120.56', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Mobile Safari/537.36', '2026-03-21 22:10:26');

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
(124, 5, 'Gray Fullbusters', 'gray@panpacificu.edu.ph', 'guard', 'SUCCESS', '136.158.120.56', 'Google Chrome 144 · Android 14.0.0 · Infinix X6731B', '2026-03-21 22:11:00');

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
(1, 'maintenance_mode', '0', '2026-03-21 10:47:58');

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
(7, 'Steven John A. Agustin', 'teacher-1773461634036-907330.jpg', 'steven.agustin.ecoast@panpacificu.edu.ph', '$2b$10$j5nYLjVE7BGPwRwM3ELoJez2glRdd8LbnvHq8VDj9qxUMBHDpARCq', 'BS in Information Technology', NULL, '{\"latitude\":15.93,\"longitude\":120.51}', 50, '2026-01-31 16:25:25', 'TSN17698767256291441', 1),
(18, 'Mark Zuckerberg', 'teacher-1773680898788-757146.webp', 'markzuckerberg@panpacificu.edu.ph', '$2b$10$pgqV81EPWO.u2aOGz51M5O//Dma2hohn5F/t2bY0vWfAJm..dg9PO', 'BS in Information Technology', NULL, '{\"latitude\":15.93,\"longitude\":120.51}', 50, '2026-03-16 17:06:06', 'TSN17736807667173940', 1),
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
  MODIFY `admin_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

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
  MODIFY `attendance_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=95;

--
-- AUTO_INCREMENT for table `attendance_record`
--
ALTER TABLE `attendance_record`
  MODIFY `attendance_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=107;

--
-- AUTO_INCREMENT for table `event_attendance_history_record`
--
ALTER TABLE `event_attendance_history_record`
  MODIFY `event_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=39;

--
-- AUTO_INCREMENT for table `event_attendance_record`
--
ALTER TABLE `event_attendance_record`
  MODIFY `event_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=43;

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
  MODIFY `program_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=33;

--
-- AUTO_INCREMENT for table `student_accounts`
--
ALTER TABLE `student_accounts`
  MODIFY `student_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=47;

--
-- AUTO_INCREMENT for table `student_records_regular_class`
--
ALTER TABLE `student_records_regular_class`
  MODIFY `student_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=59;

--
-- AUTO_INCREMENT for table `subject`
--
ALTER TABLE `subject`
  MODIFY `subject_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

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
  MODIFY `log_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=201;

--
-- AUTO_INCREMENT for table `system_login_logs`
--
ALTER TABLE `system_login_logs`
  MODIFY `log_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=125;

--
-- AUTO_INCREMENT for table `system_settings`
--
ALTER TABLE `system_settings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `teacher`
--
ALTER TABLE `teacher`
  MODIFY `teacher_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT for table `year_level`
--
ALTER TABLE `year_level`
  MODIFY `year_level_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;
--
-- Database: `bir_system`
--
CREATE DATABASE IF NOT EXISTS `bir_system` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `bir_system`;

-- --------------------------------------------------------

--
-- Table structure for table `reports`
--

CREATE TABLE `reports` (
  `id` int(11) NOT NULL,
  `fullname` varchar(100) NOT NULL,
  `address` varchar(200) NOT NULL,
  `contact_number` varchar(100) NOT NULL,
  `type_of_incident` varchar(200) NOT NULL,
  `date_incident` varchar(100) NOT NULL,
  `description` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `reports`
--

INSERT INTO `reports` (`id`, `fullname`, `address`, `contact_number`, `type_of_incident`, `date_incident`, `description`) VALUES
(1, 'Juan Dela Cruz', '123 Mabini Street, Barangay Uno', '09171234567', 'Fire', '2025-07-30', 'A fire broke out in the kitchen area around 3:00 PM. No injuries reported.'),
(2, 'asdsa', 'Bgry. Trenchera, Dike, Tayug, Pangasinan', '09481239328', 'road', '09/25/2025', 'dsfsdf');

-- --------------------------------------------------------

--
-- Table structure for table `resident_account`
--

CREATE TABLE `resident_account` (
  `id` int(11) NOT NULL,
  `fullname` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `phone_number` varchar(100) NOT NULL,
  `address` varchar(200) NOT NULL,
  `password` varchar(200) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `resident_account`
--

INSERT INTO `resident_account` (`id`, `fullname`, `email`, `phone_number`, `address`, `password`) VALUES
(3, 'Juan Dela Cruz', 'juan@example.com', '09171234567', '123 Barangay Street, City', 'q09481239328');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `email`, `password`, `created_at`) VALUES
(1, 'root', 'stevenjohnagustin25@gmail.com', '$2y$10$N.5yZs338e3XLFV6aTk4SuPqjtW5tMmIHpNeWwrnlSbPGyZIxmbpK', '2025-07-29 22:11:37'),
(2, 'stevenxd', 'xnatsu25@gmail.com', '$2y$10$7wH2jYoljntEnsatSEIMRO7az2qmAvROUU0WDH9wrGJy9kJCe3eYy', '2025-07-29 22:18:04');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `reports`
--
ALTER TABLE `reports`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `resident_account`
--
ALTER TABLE `resident_account`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `reports`
--
ALTER TABLE `reports`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `resident_account`
--
ALTER TABLE `resident_account`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
--
-- Database: `brgy_e_service`
--
CREATE DATABASE IF NOT EXISTS `brgy_e_service` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `brgy_e_service`;

-- --------------------------------------------------------

--
-- Table structure for table `admin_users`
--

CREATE TABLE `admin_users` (
  `id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `email` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `admin_users`
--

INSERT INTO `admin_users` (`id`, `username`, `password`, `email`) VALUES
(1, 'root', '$2y$10$Ml0kpm0mv3FX9w7T2dX.pe8Y/X0YsucFpICvJXHBbqWPbtp/.AcwW', 'xnatsu25@gmail.com'),
(2, 'admin', '$2y$10$bPqR.tCkW4K9H1qP5vV.hO2uKwIxCqwxhW6vlu9RLOEOBVcoE0Dea', 'robuza@thns.com'),
(3, 'princess', '$2y$10$AH4FUBGpkoy1YORVuEBOuOy.hTsRo3lVFhC0Ec4DvXmSDTyppXzaa', 'princes25@gmail.com'),
(4, 'Princess0701', '$2y$10$O1tGVdcpzIuDh8rlPM8/Benw2BKZAajK.44RAi.NulSHOrUmuhFbS', 'princessobillo70@gmail.com');

-- --------------------------------------------------------

--
-- Table structure for table `complaints`
--

CREATE TABLE `complaints` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `complaints` varchar(100) NOT NULL,
  `location` varchar(200) NOT NULL,
  `status` varchar(100) NOT NULL,
  `date_submitted` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `complaints`
--

INSERT INTO `complaints` (`id`, `user_id`, `complaints`, `location`, `status`, `date_submitted`) VALUES
(25, 4, 'asdasd', 'San quintin', 'Rejected', '2025-07-22 23:00:01'),
(26, 4, 'Flooding', 'Tayug', 'Rejected', '2025-07-22 23:09:32'),
(28, 7, 'No power', 'Tayug', 'Approved', '2025-10-25 01:57:20'),
(29, 9, 'Brownout', 'Casamtarian', 'Approved', '2025-10-25 12:48:19'),
(30, 11, 'Bullying', 'Purok2', 'Pending', '2025-11-20 11:42:51'),
(31, 13, 'Bullying', ' Casantamaria-anPurok2', 'Approved', '2025-11-20 11:58:41');

-- --------------------------------------------------------

--
-- Table structure for table `document_request`
--

CREATE TABLE `document_request` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `document` varchar(100) NOT NULL,
  `purpose` varchar(200) NOT NULL,
  `status` varchar(100) NOT NULL,
  `date_submitted` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `document_request`
--

INSERT INTO `document_request` (`id`, `user_id`, `document`, `purpose`, `status`, `date_submitted`) VALUES
(17, 3, 'Certificate of Indigency', 'kkl;k', 'Approved', '2025-07-22 04:35:52'),
(18, 3, 'Certificate of Indigency', 'kjlj', 'Approved', '2025-07-22 04:35:52'),
(19, 3, 'Barangay Clearance', 'kljkl', 'Rejected', '2025-07-22 04:35:52'),
(20, 3, 'Residency Certificate', 'hgjhgj', 'Rejected', '2025-07-22 04:35:52'),
(40, 4, 'Barangay Clearance', '2', 'Rejected', '2025-07-22 04:35:52'),
(42, 4, 'Residency Certificate', '3', 'Approved', '2025-07-22 04:35:52'),
(43, 5, 'Certificate of Indigency', 'ssdf', 'Approved', '2025-07-22 04:35:52'),
(44, 5, 'Barangay Clearance', 'ssdf', 'Approved', '2025-07-22 04:35:52'),
(45, 4, 'Residency Certificate', 'For school', 'Approved', '2025-07-22 21:52:44'),
(46, 4, 'Residency Certificate', 'For school', 'Rejected', '2025-07-22 23:09:56'),
(47, 7, 'Barangay Clearance', 'Job Application', 'Approved', '2025-10-25 01:54:32'),
(49, 9, 'Barangay Clearance', 'For school purposes', 'Approved', '2025-10-25 12:39:30'),
(50, 8, 'Barangay Clearance', 'For school', 'Pending', '2025-10-26 15:02:00'),
(51, 10, 'Barangay Clearance', 'School purposes', 'Approved', '2025-11-04 15:16:45'),
(52, 11, 'Certificate of Indigency', ' Educational Assintance', 'Approved', '2025-11-20 11:41:15'),
(53, 13, 'Certificate of Indigency', 'Educational Assistance', 'Approved', '2025-11-20 11:57:42');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `fullname` varchar(100) NOT NULL,
  `email_address` varchar(100) NOT NULL,
  `contact_number` varchar(100) NOT NULL,
  `address` varchar(100) NOT NULL,
  `user_id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`fullname`, `email_address`, `contact_number`, `address`, `user_id`, `username`, `password`) VALUES
('Steven John Agustin', 'stevenjohnagustin25@gmail.com', '09926915367', 'Antiporda Street, Poblacion B', 7, 'stevenjohn', '$2y$10$STIvUJTcm5E03VHl1Chgxu8hGxtxcGCZk4XIsPZb/UOEUjSC2M7FG'),
('Steven John Agustin', 'stevenxd81@yahoo.com', '09763891308', 'Bgry. Trenchera, Dike, Tayug, Pangasinan', 8, 'stevenxd81@yahoo.com', '$2y$10$Hk7BHiqiAGeyrAq8WXcWJuoQAaIVA1W0jRiN8Y5B8bDWNjmPReHMG'),
('Princess Obillo', 'princessobillo44@gmail.com', '09481239328', 'Brgy. San quintin', 9, 'princess', '$2y$10$A8GFdOsLBI.gpHKhy9mNX.roHnWyJYZuj1l62oZclbuXDsjoYOYgK'),
('Princess Obillo', 'princessobillo70@gmail.com', '973891308', 'Brgy. Bantog, Sta Maria, Pangasinan', 10, 'princess1@gmail.com', '$2y$10$Y47gKXCxHBROPhuzGWUCRufqwnFKMM5WCe9Wzq.DUm37w1EcTxAXm'),
('Princess Obillo', 'princessobillo70@gmail.com', '09633333987', 'Brgy Casantamaria-an San Quintin Pangasinan', 11, 'obillo', '$2y$10$AF9rRrqGDXMNkr1qcOMwiO1aD/8S.SDdrqfc/P0SDUTLiyM/rpps2'),
('Princess Obillo', 'princessobillo70@gmail.com', '09633333987', 'Brgy Casantamaria-an San Quintin Pangasinan', 12, 'cess', '$2y$10$qckbTGr4JZk5GquO89S.VuRlAjFwiHuXBiw6.maEVVKUX3dYcR9Sm'),
('Princess Obillo', 'princessobillo70@gmail.com', '09633333987', 'Brgy Casantamaria-an San Quintin Pangasinan', 13, 'incess', '$2y$10$Am5AiBu54zme5wFswrbjsOI0RuERujjKlnTsb0qTmMul7cay597tq');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admin_users`
--
ALTER TABLE `admin_users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- Indexes for table `complaints`
--
ALTER TABLE `complaints`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `document_request`
--
ALTER TABLE `document_request`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admin_users`
--
ALTER TABLE `admin_users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `complaints`
--
ALTER TABLE `complaints`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=32;

--
-- AUTO_INCREMENT for table `document_request`
--
ALTER TABLE `document_request`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=54;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;
--
-- Database: `cake_business`
--
CREATE DATABASE IF NOT EXISTS `cake_business` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `cake_business`;

-- --------------------------------------------------------

--
-- Table structure for table `admin_accounts`
--

CREATE TABLE `admin_accounts` (
  `id` int(11) NOT NULL,
  `username` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(200) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `admin_accounts`
--

INSERT INTO `admin_accounts` (`id`, `username`, `email`, `password`) VALUES
(2, 'root', 'xnatsu25@gmail.com', '$2b$10$O9IT7MgDAHbsePt7ouxGZe4enlsWcmWMSZKscCsj5I8TLi9kKuw9m'),
(3, 'admin', 'admin@gmail.com', '$2b$10$n8aIuCqldA1mKmxHSPPOoe0UZi6ad43N6qGppjUaOhlM2BLFcy0i6');

-- --------------------------------------------------------

--
-- Table structure for table `cake_menu`
--

CREATE TABLE `cake_menu` (
  `id` int(11) NOT NULL,
  `cake_name` varchar(200) NOT NULL,
  `cake_price` varchar(200) NOT NULL,
  `cake_description` varchar(200) NOT NULL,
  `image_path` varchar(200) NOT NULL,
  `date_created` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `cake_menu`
--

INSERT INTO `cake_menu` (`id`, `cake_name`, `cake_price`, `cake_description`, `image_path`, `date_created`) VALUES
(10, 'Vanilla', '550', 'Light sponge cake layered with fresh mangoes and cream', 'http://localhost/Cake-Online-Shop-Angel-Cabote/admin/public/images/cake-images/Vanilla.png', '2025-07-29 06:18:02'),
(11, 'Chinese cake', '657', 'Light sponge cake layered with fresh mangoes and cream', 'http://localhost/Cake-Online-Shop-Angel-Cabote/admin/public/images/cake-images/Chinese cake.png', '2025-07-29 06:19:11');

-- --------------------------------------------------------

--
-- Table structure for table `cake_reservation_table`
--

CREATE TABLE `cake_reservation_table` (
  `id` int(11) NOT NULL,
  `fullname` varchar(100) NOT NULL,
  `contact_number` varchar(100) NOT NULL,
  `email` varchar(255) NOT NULL,
  `cake_type` varchar(100) NOT NULL,
  `reservation_date` varchar(100) NOT NULL,
  `reservation_time` varchar(100) NOT NULL,
  `date_created` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `cake_reservation_table`
--

INSERT INTO `cake_reservation_table` (`id`, `fullname`, `contact_number`, `email`, `cake_type`, `reservation_date`, `reservation_time`, `date_created`) VALUES
(5, 'Gabriel Castillo', '09763891308', 'gabbycastillo8888@gmail.com', 'Vanilla', '2025-11-05', '07:12', '2025-11-04 03:08:36'),
(6, 'Gabriel Castillo', '09763891308', 'gabbycastillo8888@gmail.com', 'Chocolatte', '2025-11-04', '03:15', '2025-11-04 03:15:52');

-- --------------------------------------------------------

--
-- Table structure for table `order_table`
--

CREATE TABLE `order_table` (
  `id` int(11) NOT NULL,
  `fullname` varchar(200) NOT NULL,
  `contact_number` varchar(200) NOT NULL,
  `email` varchar(255) NOT NULL,
  `cake_type` varchar(200) NOT NULL,
  `quantity` varchar(100) NOT NULL,
  `delivery_type` varchar(200) NOT NULL,
  `date_created` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `order_table`
--

INSERT INTO `order_table` (`id`, `fullname`, `contact_number`, `email`, `cake_type`, `quantity`, `delivery_type`, `date_created`) VALUES
(14, 'Gabriel Castillo', '09763891308', 'gabbycastillo8888@gmail.com', 'Chocolatte', '1', 'Delivery', '2025-11-04 03:15:13'),
(15, 'Gabriel Castillo', '09763891308', 'gabbycastillo8888@gmail.com', 'Chocolatte', '3', 'Pickup', '2025-11-04 03:17:09');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admin_accounts`
--
ALTER TABLE `admin_accounts`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `cake_menu`
--
ALTER TABLE `cake_menu`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `cake_reservation_table`
--
ALTER TABLE `cake_reservation_table`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `order_table`
--
ALTER TABLE `order_table`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admin_accounts`
--
ALTER TABLE `admin_accounts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `cake_menu`
--
ALTER TABLE `cake_menu`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `cake_reservation_table`
--
ALTER TABLE `cake_reservation_table`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `order_table`
--
ALTER TABLE `order_table`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;
--
-- Database: `campus_event_scheduler`
--
CREATE DATABASE IF NOT EXISTS `campus_event_scheduler` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `campus_event_scheduler`;

-- --------------------------------------------------------

--
-- Table structure for table `activity_logs`
--

CREATE TABLE `activity_logs` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `activity` varchar(100) NOT NULL,
  `details` text DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `timestamp` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `activity_logs`
--

INSERT INTO `activity_logs` (`id`, `user_id`, `activity`, `details`, `ip_address`, `user_agent`, `timestamp`) VALUES
(3, 1, 'Login', NULL, NULL, NULL, '2025-11-14 17:10:22'),
(4, 1, 'Login', NULL, NULL, NULL, '2025-11-14 17:17:08'),
(5, 1, 'Event Registration', 'Registered for event ID: 1', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '2025-11-14 17:19:40'),
(6, 1, 'Event Registration', 'Registered for event ID: 5', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '2025-11-14 17:19:50'),
(7, 1, 'Event Registration', 'Registered for event ID: 2', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '2025-11-14 17:19:59'),
(8, 1, 'Logout', '', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '2025-11-14 17:48:38'),
(9, 1, 'Login', NULL, NULL, NULL, '2025-11-14 17:53:46'),
(10, 1, 'Profile Updated', 'Updated profile information', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '2025-11-14 17:56:16'),
(11, 1, 'User Status Changed', 'Changed user 2 status to inactive', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '2025-11-14 17:57:21'),
(12, 1, 'Event Updated', 'Updated event ID: 1', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '2025-11-14 17:57:37'),
(13, 1, 'Logout', '', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '2025-11-14 18:00:06'),
(17, 1, 'Login', NULL, NULL, NULL, '2025-11-15 09:47:52'),
(18, 1, 'Logout', '', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '2025-11-15 09:48:02'),
(19, 1, 'Login', NULL, NULL, NULL, '2025-11-15 10:07:22'),
(20, 1, 'Logout', '', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '2025-11-15 10:07:33'),
(21, 1, 'Login', NULL, NULL, NULL, '2025-11-15 10:21:12'),
(22, 1, 'Event Registration', 'Registered for event ID: 3', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '2025-11-15 10:28:41'),
(23, 1, 'Logout', '', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '2025-11-15 10:29:01'),
(30, 1, 'Login', NULL, NULL, NULL, '2025-11-15 10:43:01'),
(31, 1, 'Event Approved', 'Approved event ID: 9', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '2025-11-15 10:45:22'),
(32, 1, 'Event Registration', 'Registered for event ID: 9', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '2025-11-15 10:45:34'),
(33, 1, 'Logout', '', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '2025-11-15 10:47:29'),
(38, 1, 'Login', NULL, NULL, NULL, '2025-11-15 10:49:03'),
(39, 1, 'Logout', '', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '2025-11-15 10:49:20'),
(42, 1, 'Login', NULL, NULL, NULL, '2025-11-15 16:07:00'),
(43, 1, 'Logout', '', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '2025-11-15 16:07:12'),
(51, 1, 'Login', NULL, NULL, NULL, '2025-11-15 16:14:58'),
(52, 1, 'Event Approved', 'Approved event ID: 10', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '2025-11-15 16:57:07'),
(56, 1, 'Login', NULL, NULL, NULL, '2025-11-15 17:01:53'),
(57, 1, 'Event Approved', 'Approved event ID: 11', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '2025-11-15 17:02:16'),
(58, 1, 'Logout', '', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '2025-11-15 17:08:03'),
(62, 1, 'Login', NULL, NULL, NULL, '2025-11-15 17:08:43'),
(63, 1, 'Event Approved', 'Approved event ID: 12', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '2025-11-15 17:08:49'),
(64, 1, 'Logout', '', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '2025-11-15 17:14:26'),
(68, 1, 'Login', NULL, NULL, NULL, '2025-11-15 17:15:00'),
(69, 1, 'Event Approved', 'Approved event ID: 13', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '2025-11-15 17:15:08'),
(70, 1, 'Logout', '', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '2025-11-15 17:16:54'),
(74, 1, 'Login', NULL, NULL, NULL, '2025-11-15 17:17:42'),
(75, 1, 'Event Rejected', 'Rejected event ID: 14', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '2025-11-15 17:17:48'),
(76, 1, 'Logout', '', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '2025-11-15 17:18:25'),
(99, 1, 'Login', NULL, NULL, NULL, '2025-11-15 17:52:55'),
(100, 1, 'Event Approved', 'Approved event ID: 15', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '2025-11-15 17:53:00'),
(101, 1, 'Logout', '', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '2025-11-15 17:56:47'),
(105, 1, 'Login', NULL, NULL, NULL, '2025-11-15 17:57:59'),
(106, 1, 'Event Approved', 'Approved event ID: 16', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '2025-11-15 17:58:10'),
(114, 1, 'Login', NULL, NULL, NULL, '2025-11-17 11:56:05'),
(115, 1, 'Event Approved', 'Approved event ID: 17', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '2025-11-17 11:56:17'),
(121, 1, 'Login', NULL, NULL, NULL, '2025-11-17 12:02:57'),
(122, 1, 'Event Approved', 'Approved event ID: 18', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '2025-11-17 12:03:05'),
(123, 1, 'Logout', '', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '2025-11-17 12:05:08');

-- --------------------------------------------------------

--
-- Table structure for table `clubs_organizations`
--

CREATE TABLE `clubs_organizations` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `advisor` varchar(100) DEFAULT NULL,
  `president_id` int(11) DEFAULT NULL,
  `contact_email` varchar(100) DEFAULT NULL,
  `contact_phone` varchar(20) DEFAULT NULL,
  `status` enum('active','inactive') DEFAULT 'active',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `clubs_organizations`
--

INSERT INTO `clubs_organizations` (`id`, `name`, `description`, `advisor`, `president_id`, `contact_email`, `contact_phone`, `status`, `created_at`) VALUES
(1, 'Student Council', 'Official student government organization', 'Prof. Maria Santos', NULL, 'studentcouncil@panpacific.edu.ph', NULL, 'active', '2025-11-14 17:06:04'),
(2, 'IT Society', 'Information Technology student organization', 'Prof. Juan Dela Cruz', NULL, 'itsociety@panpacific.edu.ph', NULL, 'active', '2025-11-14 17:06:04'),
(3, 'Cultural Club', 'Promotes cultural awareness and activities', 'Prof. Ana Reyes', NULL, 'cultural@panpacific.edu.ph', NULL, 'active', '2025-11-14 17:06:04'),
(4, 'Sports Club', 'Organizes sports and fitness activities', 'Coach Mike Johnson', NULL, 'sports@panpacific.edu.ph', NULL, 'active', '2025-11-14 17:06:04'),
(5, 'Environmental Club', 'Environmental awareness and sustainability', 'Prof. Green Earth', NULL, 'environment@panpacific.edu.ph', NULL, 'active', '2025-11-14 17:06:04');

-- --------------------------------------------------------

--
-- Table structure for table `events`
--

CREATE TABLE `events` (
  `id` int(11) NOT NULL,
  `title` varchar(200) NOT NULL,
  `description` text DEFAULT NULL,
  `event_date` date NOT NULL,
  `event_time` time NOT NULL,
  `end_time` time DEFAULT NULL,
  `location` varchar(200) NOT NULL,
  `max_participants` int(11) DEFAULT 0,
  `current_participants` int(11) DEFAULT 0,
  `organizer_id` int(11) NOT NULL,
  `club_organization` varchar(100) DEFAULT NULL,
  `category` varchar(50) DEFAULT NULL,
  `status` enum('pending','approved','rejected','cancelled') DEFAULT 'pending',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `events`
--

INSERT INTO `events` (`id`, `title`, `description`, `event_date`, `event_time`, `end_time`, `location`, `max_participants`, `current_participants`, `organizer_id`, `club_organization`, `category`, `status`, `created_at`, `updated_at`) VALUES
(1, 'New Year Welcome Party 2026', 'Welcome to the new year! Join us for a celebration with food, games, and entertainment.', '2026-01-15', '14:00:00', '18:00:00', '0', 200, 2, 1, 'Student Council', 'Social', 'approved', '2025-11-14 17:06:04', '2025-11-15 10:31:49'),
(2, 'Tech Summit 2026', 'Annual technology summit featuring industry speakers and workshops on latest tech trends.', '2026-01-20', '09:00:00', '17:00:00', 'Convention Center', 300, 1, 1, 'IT Society', 'Academic', 'approved', '2025-11-14 17:06:04', '2025-11-14 17:19:59'),
(3, 'Basketball Championship', 'Inter-college basketball tournament. Register your team now!', '2026-01-25', '08:00:00', '18:00:00', 'University Gymnasium', 150, 1, 1, 'Sports Club', 'Sports', 'approved', '2025-11-14 17:06:04', '2025-11-15 10:28:41'),
(4, 'Web Development Bootcamp', 'Learn HTML, CSS, JavaScript, and React in this intensive 3-day workshop.', '2026-02-01', '13:00:00', '17:00:00', 'Computer Lab 1', 50, 0, 1, 'IT Society', 'Workshop', 'approved', '2025-11-14 17:06:04', '2025-11-14 17:06:04'),
(5, 'Cultural Festival 2026', 'Celebrate diversity with performances, food, and cultural exhibits from around the world.', '2026-02-10', '15:00:00', '21:00:00', 'Open Ground', 500, 1, 1, 'Cultural Club', 'Cultural', 'approved', '2025-11-14 17:06:04', '2025-11-14 17:19:50'),
(6, 'Science Quiz Bee', 'Test your knowledge in this exciting science competition with amazing prizes!', '2026-02-15', '13:00:00', '16:00:00', 'Science Building Auditorium', 80, 0, 1, 'Student Council', 'Competition', 'approved', '2025-11-14 17:06:04', '2025-11-14 17:06:04'),
(7, 'Tree Planting Activity', 'Help make our campus greener! Join us for a tree planting initiative.', '2026-02-20', '07:00:00', '11:00:00', 'Campus Green Area', 100, 0, 1, 'Environmental Club', 'Social', 'approved', '2025-11-14 17:06:04', '2025-11-14 17:06:04'),
(8, 'Career Guidance Seminar', 'Prepare for your future career with insights from industry professionals.', '2026-03-01', '10:00:00', '15:00:00', 'Conference Room A', 150, 0, 1, 'Student Council', 'Academic', 'approved', '2025-11-14 17:06:04', '2025-11-14 17:06:04');

-- --------------------------------------------------------

--
-- Table structure for table `event_categories`
--

CREATE TABLE `event_categories` (
  `id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  `description` text DEFAULT NULL,
  `color_code` varchar(7) DEFAULT '#006400',
  `icon` varchar(50) DEFAULT 'fas fa-calendar',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `event_categories`
--

INSERT INTO `event_categories` (`id`, `name`, `description`, `color_code`, `icon`, `created_at`) VALUES
(1, 'Academic', 'Academic events and seminars', '#006400', 'fas fa-graduation-cap', '2025-11-14 17:06:04'),
(2, 'Sports', 'Sports and recreational activities', '#FF6B35', 'fas fa-basketball-ball', '2025-11-14 17:06:04'),
(3, 'Cultural', 'Cultural and arts events', '#9B59B6', 'fas fa-masks-theater', '2025-11-14 17:06:04'),
(4, 'Social', 'Social gatherings and mixers', '#3498DB', 'fas fa-users', '2025-11-14 17:06:04'),
(5, 'Workshop', 'Workshops and training sessions', '#E67E22', 'fas fa-tools', '2025-11-14 17:06:04'),
(6, 'Competition', 'Competitions and contests', '#E74C3C', 'fas fa-trophy', '2025-11-14 17:06:04'),
(7, 'Fundraising', 'Fundraising activities', '#27AE60', 'fas fa-hand-holding-heart', '2025-11-14 17:06:04'),
(8, 'Orientation', 'Orientation programs', '#F39C12', 'fas fa-compass', '2025-11-14 17:06:04');

-- --------------------------------------------------------

--
-- Table structure for table `notifications`
--

CREATE TABLE `notifications` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `event_id` int(11) DEFAULT NULL,
  `title` varchar(200) NOT NULL,
  `message` text NOT NULL,
  `type` enum('email','sms','system') NOT NULL,
  `status` enum('pending','sent','failed') DEFAULT 'pending',
  `scheduled_time` timestamp NULL DEFAULT NULL,
  `sent_time` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `password_resets`
--

CREATE TABLE `password_resets` (
  `id` int(11) NOT NULL,
  `email` varchar(100) NOT NULL,
  `token` varchar(64) NOT NULL,
  `expires_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `used_at` timestamp NULL DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `password_resets`
--

INSERT INTO `password_resets` (`id`, `email`, `token`, `expires_at`, `created_at`, `used_at`, `ip_address`, `user_agent`) VALUES
(4, 'stevenjohnagustin25@gmail.com', '51507b2499756619ac639aed52a6a21df5d2dd945836fb5ac270ff0eb05dbc73', '2025-11-15 18:40:28', '2025-11-15 17:40:28', NULL, NULL, NULL),
(6, 'xnatsu25@gmail.com', '0b11f766568ab2a1f38d61dadd6a44a31ebfd648ee0f2e8e28de9cd66ac216ea', '2025-11-15 18:50:39', '2025-11-15 17:50:39', NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `registrations`
--

CREATE TABLE `registrations` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `event_id` int(11) NOT NULL,
  `registration_date` timestamp NOT NULL DEFAULT current_timestamp(),
  `status` enum('registered','attended','cancelled') DEFAULT 'registered',
  `notes` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `registrations`
--

INSERT INTO `registrations` (`id`, `user_id`, `event_id`, `registration_date`, `status`, `notes`) VALUES
(1, 1, 1, '2025-11-14 17:19:40', 'registered', NULL),
(2, 1, 5, '2025-11-14 17:19:50', 'registered', NULL),
(3, 1, 2, '2025-11-14 17:19:59', 'registered', NULL),
(4, 1, 3, '2025-11-15 10:28:41', 'registered', NULL);

--
-- Triggers `registrations`
--
DELIMITER $$
CREATE TRIGGER `after_registration_delete` AFTER DELETE ON `registrations` FOR EACH ROW BEGIN
    UPDATE events 
    SET current_participants = current_participants - 1 
    WHERE id = OLD.event_id;
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `after_registration_insert` AFTER INSERT ON `registrations` FOR EACH ROW BEGIN
    UPDATE events 
    SET current_participants = current_participants + 1 
    WHERE id = NEW.event_id;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `student_id` varchar(20) NOT NULL,
  `username` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `full_name` varchar(100) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `role` enum('student','club_leader','admin') DEFAULT 'student',
  `course` varchar(100) DEFAULT NULL,
  `year_level` varchar(20) DEFAULT NULL,
  `status` enum('active','inactive') DEFAULT 'active',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `student_id`, `username`, `email`, `password`, `full_name`, `phone`, `role`, `course`, `year_level`, `status`, `created_at`, `updated_at`) VALUES
(1, 'ADMIN001', 'admin', 'admin@panpacific.edu.ph', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'System Administrator', '09481239328', 'admin', 'Information Technology', '1st Year', 'active', '2025-11-14 17:06:04', '2025-11-14 17:56:16');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `activity_logs`
--
ALTER TABLE `activity_logs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `clubs_organizations`
--
ALTER TABLE `clubs_organizations`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`),
  ADD KEY `president_id` (`president_id`);

--
-- Indexes for table `events`
--
ALTER TABLE `events`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_events_date` (`event_date`),
  ADD KEY `idx_events_status` (`status`),
  ADD KEY `idx_events_organizer` (`organizer_id`);

--
-- Indexes for table `event_categories`
--
ALTER TABLE `event_categories`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `event_id` (`event_id`);

--
-- Indexes for table `password_resets`
--
ALTER TABLE `password_resets`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `token` (`token`);

--
-- Indexes for table `registrations`
--
ALTER TABLE `registrations`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_registration` (`user_id`,`event_id`),
  ADD KEY `idx_registrations_user` (`user_id`),
  ADD KEY `idx_registrations_event` (`event_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `student_id` (`student_id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `idx_users_username` (`username`),
  ADD KEY `idx_users_email` (`email`),
  ADD KEY `idx_users_role` (`role`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `activity_logs`
--
ALTER TABLE `activity_logs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=124;

--
-- AUTO_INCREMENT for table `clubs_organizations`
--
ALTER TABLE `clubs_organizations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `events`
--
ALTER TABLE `events`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT for table `event_categories`
--
ALTER TABLE `event_categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `notifications`
--
ALTER TABLE `notifications`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `password_resets`
--
ALTER TABLE `password_resets`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `registrations`
--
ALTER TABLE `registrations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `activity_logs`
--
ALTER TABLE `activity_logs`
  ADD CONSTRAINT `activity_logs_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `clubs_organizations`
--
ALTER TABLE `clubs_organizations`
  ADD CONSTRAINT `clubs_organizations_ibfk_1` FOREIGN KEY (`president_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `events`
--
ALTER TABLE `events`
  ADD CONSTRAINT `events_ibfk_1` FOREIGN KEY (`organizer_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `notifications`
--
ALTER TABLE `notifications`
  ADD CONSTRAINT `notifications_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `notifications_ibfk_2` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `registrations`
--
ALTER TABLE `registrations`
  ADD CONSTRAINT `registrations_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `registrations_ibfk_2` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`) ON DELETE CASCADE;
--
-- Database: `canteen_db`
--
CREATE DATABASE IF NOT EXISTS `canteen_db` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `canteen_db`;

-- --------------------------------------------------------

--
-- Table structure for table `menu_items`
--

CREATE TABLE `menu_items` (
  `id` int(11) NOT NULL,
  `store_id` int(11) DEFAULT NULL,
  `food_name` varchar(100) DEFAULT NULL,
  `category` varchar(100) DEFAULT NULL,
  `price` decimal(10,2) DEFAULT NULL,
  `available` tinyint(1) DEFAULT 1,
  `image` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `quantity` int(11) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `menu_items`
--

INSERT INTO `menu_items` (`id`, `store_id`, `food_name`, `category`, `price`, `available`, `image`, `created_at`, `quantity`) VALUES
(1, 1, 'Angel\'s Burger', NULL, 40.00, 1, '1760411490_1759451185_burger.jpg', '2025-10-14 03:11:30', 1),
(2, 1, 'Fries', NULL, 25.00, 1, '1760927470_1759447908_fries.webp', '2025-10-20 02:31:10', 1);

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `store_id` int(11) DEFAULT NULL,
  `pickup_time` datetime DEFAULT NULL,
  `status` enum('Pending','Preparing','Ready','Completed') DEFAULT 'Pending',
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`id`, `user_id`, `store_id`, `pickup_time`, `status`, `created_at`) VALUES
(1, 11, 1, '2025-10-22 21:17:00', 'Pending', '2025-10-21 21:29:00'),
(2, 11, 1, '2025-10-22 21:17:00', 'Pending', '2025-10-21 21:30:01'),
(3, 11, 1, '2025-10-22 21:17:00', 'Pending', '2025-10-21 21:30:41');

-- --------------------------------------------------------

--
-- Table structure for table `order_items`
--

CREATE TABLE `order_items` (
  `id` int(11) NOT NULL,
  `order_id` int(11) DEFAULT NULL,
  `menu_item_id` int(11) DEFAULT NULL,
  `quantity` int(11) DEFAULT NULL,
  `subtotal` decimal(10,2) DEFAULT NULL,
  `menu_id` int(11) NOT NULL,
  `price` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `order_items`
--

INSERT INTO `order_items` (`id`, `order_id`, `menu_item_id`, `quantity`, `subtotal`, `menu_id`, `price`) VALUES
(1, 3, NULL, 1, NULL, 2, 25.00),
(2, 3, NULL, 1, NULL, 1, 40.00);

-- --------------------------------------------------------

--
-- Table structure for table `reservations`
--

CREATE TABLE `reservations` (
  `id` int(11) NOT NULL,
  `buyer_id` int(11) NOT NULL,
  `food_id` int(11) NOT NULL,
  `quantity` int(11) NOT NULL,
  `pickup_time` datetime NOT NULL,
  `status` enum('Pending','Accepted','Completed','Cancelled') DEFAULT 'Pending',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `reservations`
--

INSERT INTO `reservations` (`id`, `buyer_id`, `food_id`, `quantity`, `pickup_time`, `status`, `created_at`) VALUES
(1, 11, 2, 1, '2025-10-22 18:57:00', 'Pending', '2025-10-21 11:02:42'),
(2, 11, 2, 1, '2025-10-22 19:05:00', 'Pending', '2025-10-21 11:05:23'),
(3, 11, 2, 1, '2025-10-22 19:05:00', 'Pending', '2025-10-21 11:14:13'),
(4, 11, 2, 1, '2025-10-21 19:14:00', 'Pending', '2025-10-21 11:14:28'),
(5, 11, 2, 1, '2025-10-21 19:14:00', 'Pending', '2025-10-21 11:15:02');

-- --------------------------------------------------------

--
-- Table structure for table `stores`
--

CREATE TABLE `stores` (
  `id` int(11) NOT NULL,
  `store_name` varchar(100) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `owner_id` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `stores`
--

INSERT INTO `stores` (`id`, `store_name`, `description`, `owner_id`, `created_at`) VALUES
(1, 'PU', 'Sheeesh', 13, '2025-10-14 03:04:09');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(100) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `role` enum('admin','seller','buyer') NOT NULL DEFAULT 'buyer',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `is_verified` tinyint(1) DEFAULT 0,
  `verified` tinyint(1) DEFAULT 0,
  `verification_token` varchar(64) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password`, `role`, `created_at`, `is_verified`, `verified`, `verification_token`) VALUES
(11, 'Mark Reynan Tenorio', 'markreynan.tenorio@panpacificu.edu.ph', '$2y$10$egehrxK3VDO/yE0rLmC5AOWH9DBHhC/ZQh.3zrfezeAkIsKPvUihu', 'buyer', '2025-10-20 02:21:07', 0, 1, NULL),
(12, 'Admin', 'admin@panpacificu.edu.ph', '$2y$10$NjYHXyJ/Vpx17S6giwrbE.DcGNTUOhRFq44oOrgYPtZvMAPSIG5m2', 'admin', '2025-10-21 10:50:17', 0, 0, 'bb0dbc2b481179422ef5c60f054f614b'),
(13, 'Seller', 'seller@panpacificu.edu.ph', '$2y$10$lR2Z1b6y/O4POJG2UF2YUuCahcsfVVO1tyQdGXhtd72dciefDUNEm', 'seller', '2025-10-21 10:50:44', 0, 0, 'e6e26cea49ce527169b26603c75cf4ba'),
(14, 'Sample', 'sample@gmail.com', '$2y$10$CTCyPWaNYEocJ3xN.aVEV.z/.rjmGfPct0n537HTz9en86VyxI8uO', 'buyer', '2025-11-24 10:12:43', 0, 0, NULL),
(15, 'Fea Majoy Pajrit', 'feamajoy.pajrit.ecoast@panpacificu.edu.ph', '$2y$10$nu0POBe.SzlcLZ1ai3V3LOA.O0FH5dwwUOpNrYed2gg0BW/k8Q8Nm', 'buyer', '2025-11-24 12:20:20', 0, 0, 'f7ca3153df999c10ed64aa2be16c5e4c'),
(16, 'Fea Majoy Pajrit', 'fea@gmail.com', '$2y$10$JB9nYnQITmvimUlow84jwOkliuFdg9OB9.R9OBpPCwRhdxYw3fxM6', 'buyer', '2025-11-24 12:23:10', 0, 0, NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `menu_items`
--
ALTER TABLE `menu_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `store_id` (`store_id`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `store_id` (`store_id`);

--
-- Indexes for table `order_items`
--
ALTER TABLE `order_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `order_id` (`order_id`),
  ADD KEY `menu_item_id` (`menu_item_id`);

--
-- Indexes for table `reservations`
--
ALTER TABLE `reservations`
  ADD PRIMARY KEY (`id`),
  ADD KEY `buyer_id` (`buyer_id`),
  ADD KEY `food_id` (`food_id`);

--
-- Indexes for table `stores`
--
ALTER TABLE `stores`
  ADD PRIMARY KEY (`id`),
  ADD KEY `owner_id` (`owner_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `menu_items`
--
ALTER TABLE `menu_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `order_items`
--
ALTER TABLE `order_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `reservations`
--
ALTER TABLE `reservations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `stores`
--
ALTER TABLE `stores`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `menu_items`
--
ALTER TABLE `menu_items`
  ADD CONSTRAINT `menu_items_ibfk_1` FOREIGN KEY (`store_id`) REFERENCES `stores` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `orders_ibfk_2` FOREIGN KEY (`store_id`) REFERENCES `stores` (`id`);

--
-- Constraints for table `order_items`
--
ALTER TABLE `order_items`
  ADD CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `order_items_ibfk_2` FOREIGN KEY (`menu_item_id`) REFERENCES `menu_items` (`id`);

--
-- Constraints for table `reservations`
--
ALTER TABLE `reservations`
  ADD CONSTRAINT `reservations_ibfk_1` FOREIGN KEY (`buyer_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `reservations_ibfk_2` FOREIGN KEY (`food_id`) REFERENCES `menu_items` (`id`);

--
-- Constraints for table `stores`
--
ALTER TABLE `stores`
  ADD CONSTRAINT `stores_ibfk_1` FOREIGN KEY (`owner_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
--
-- Database: `clearance_system`
--
CREATE DATABASE IF NOT EXISTS `clearance_system` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `clearance_system`;

-- --------------------------------------------------------

--
-- Table structure for table `activity_logs`
--

CREATE TABLE `activity_logs` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `action` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `activity_logs`
--

INSERT INTO `activity_logs` (`id`, `user_id`, `action`, `description`, `ip_address`, `user_agent`, `created_at`) VALUES
(1, NULL, 'User Registration', 'New student account created', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '2026-01-24 05:58:29'),
(2, NULL, 'User Registration', 'New student account created', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '2026-01-24 06:00:02'),
(3, NULL, 'User Registration', 'New student account created', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '2026-01-24 06:02:52'),
(4, NULL, 'User Registration', 'New student account created', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '2026-01-24 06:03:40'),
(5, 6, 'User Registration', 'New student account created', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '2026-01-24 06:04:55'),
(6, 6, 'Clearance Request Submitted', 'Submitted graduation clearance request for 2025-2026 - 1st', NULL, NULL, '2026-01-24 06:31:38'),
(7, 9, 'User Registration', 'New employee account created', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '2026-01-24 09:21:19'),
(8, 9, 'Clearance Request Submitted', 'Submitted graduation clearance request for 2025-2026 - 1st', NULL, NULL, '2026-01-24 09:21:44'),
(9, 6, 'Clearance Request Submitted', 'Submitted graduation clearance request for dsadasd - 1st', NULL, NULL, '2026-01-24 09:22:35'),
(10, 6, 'Clearance Request Submitted', 'Submitted transfer clearance request for ryrty - 2nd', NULL, NULL, '2026-01-24 09:25:18'),
(11, 6, 'Clearance Request Submitted', 'Submitted graduation clearance request for 321321 - 2nd', NULL, NULL, '2026-01-24 13:10:24'),
(12, 6, 'Clearance Request Submitted', 'Submitted transfer clearance request for 2025-2026 - 1st', NULL, NULL, '2026-01-24 16:03:28'),
(13, 6, 'Clearance Request Submitted', 'Submitted graduation clearance request for eqeq - 1st', NULL, NULL, '2026-01-24 16:18:10'),
(14, 8, 'User Deactivated', 'Deactivated user: Test Account2', NULL, NULL, '2026-01-24 16:20:38'),
(15, 8, 'User Deactivated', 'Deactivated user: Test Account2', NULL, NULL, '2026-01-24 16:21:21'),
(16, 6, 'Clearance Request Submitted', 'Submitted graduation clearance request for 2025-2026 - 3rd', NULL, NULL, '2026-01-24 16:22:49'),
(17, 6, 'Clearance Request Submitted', 'Submitted graduation clearance request for 1233123 - 2nd', NULL, NULL, '2026-01-25 06:51:18'),
(18, 6, 'Clearance Request Submitted', 'Submitted transfer clearance request for qwewqe - 1st', NULL, NULL, '2026-01-25 06:58:06'),
(19, 6, 'Clearance Request Submitted', 'Submitted transfer clearance request for eqwewq - 1st', NULL, NULL, '2026-01-25 06:58:52'),
(20, 6, 'Clearance Request Submitted', 'Submitted transfer clearance request for dsadasd - 2nd', NULL, NULL, '2026-01-25 07:04:49'),
(21, 6, 'Clearance Request Submitted', 'Submitted graduation clearance request for wdwq - 1st', NULL, NULL, '2026-01-25 07:09:44'),
(22, 6, 'Clearance Request Submitted', 'Submitted transfer clearance request for sdsf - 2nd', NULL, NULL, '2026-01-25 07:11:34'),
(23, 6, 'Clearance Request Submitted', 'Submitted transfer clearance request for asdas - 1st', NULL, NULL, '2026-01-25 07:32:46'),
(24, 10, 'Clearance Rejected', 'Rejected clearance for test account - Clinic', NULL, NULL, '2026-01-25 08:06:30'),
(25, 10, 'Clearance Rejected', 'Rejected clearance for test account - Registrar Office', NULL, NULL, '2026-01-25 08:12:07'),
(26, 6, 'Clearance Request Submitted', 'Submitted graduation clearance request for sdsf - 1st to 8 office(s)', NULL, NULL, '2026-01-25 08:26:11'),
(27, 10, 'Clearance Rejected', 'Rejected clearance for test account - Registrar Office', NULL, NULL, '2026-01-25 08:28:29'),
(28, 6, 'Clearance Request Submitted', 'Submitted transfer clearance request for qweqw - 1st to 8 office(s)', NULL, NULL, '2026-01-25 08:28:53'),
(29, 10, 'Clearance Approved', 'Approved clearance for test account - Registrar Office', NULL, NULL, '2026-01-25 08:30:17'),
(30, 6, 'Clearance Request Submitted', 'Submitted graduation clearance request for 2025-2026 - 1st to 8 office(s)', NULL, NULL, '2026-01-25 08:32:47'),
(31, 10, 'Clearance Rejected', 'Rejected clearance for test account - Registrar Office', NULL, NULL, '2026-01-25 08:33:13'),
(32, 6, 'Clearance Request Submitted', 'Submitted graduation clearance request for 2025-2026 - 2nd to 8 office(s)', NULL, NULL, '2026-01-25 08:42:10'),
(33, 10, 'Clearance Approved', 'Approved clearance for test account - Registrar Office', NULL, NULL, '2026-01-25 08:42:27'),
(34, 6, 'Clearance Request Submitted', 'Submitted transfer clearance request for 2025-2026 - 1st to 8 office(s)', NULL, NULL, '2026-01-25 08:42:53'),
(35, 10, 'Clearance Rejected', 'Rejected clearance for test account - Registrar Office', NULL, NULL, '2026-01-25 08:43:13'),
(36, 6, 'Clearance Request Submitted', 'Submitted other clearance request for sdsf - 2nd to 8 office(s)', NULL, NULL, '2026-01-25 08:44:24'),
(37, 6, 'Clearance Request Submitted', 'Submitted graduation clearance request for 2025 - 2nd to 8 office(s)', NULL, NULL, '2026-01-25 13:46:27'),
(38, 6, 'Clearance Request Submitted', 'Submitted graduation clearance request for 2024 - 1st to 8 office(s)', NULL, NULL, '2026-01-26 02:17:28'),
(39, 10, 'Clearance Rejected', 'Rejected clearance for test account - Registrar Office', NULL, NULL, '2026-01-26 02:18:22'),
(40, 6, 'Clearance Request Submitted', 'Submitted graduation clearance request for 2025 - 1st to 8 office(s)', NULL, NULL, '2026-01-26 03:12:45'),
(41, 6, 'Clearance Request Submitted', 'Submitted graduation clearance request for 202928 - 1st to 8 office(s)', NULL, NULL, '2026-01-26 03:34:07'),
(42, 10, 'Clearance Rejected', 'Rejected clearance for test account - Registrar Office', NULL, NULL, '2026-01-26 03:35:20'),
(43, 6, 'Clearance Request Submitted', 'Submitted graduation clearance request for 2323 - 1st to 8 office(s)', NULL, NULL, '2026-01-26 03:36:31'),
(44, 6, 'Clearance Request Submitted', 'Submitted honorable_dismissal clearance request for eqe - 1st to 8 office(s)', NULL, NULL, '2026-01-26 09:24:58'),
(45, 6, 'Clearance Request Submitted', 'Submitted graduation clearance request for qewqe - 2nd to 8 office(s)', NULL, NULL, '2026-01-26 09:42:21'),
(46, 6, 'Clearance Request Submitted', 'Submitted honorable_dismissal clearance request for 2323 - 1st to 8 office(s)', NULL, NULL, '2026-01-26 09:54:33'),
(47, 6, 'Clearance Request Submitted', 'Submitted transfer clearance request for 202928 - 2nd to 8 office(s)', NULL, NULL, '2026-01-26 09:56:32'),
(48, 6, 'Clearance Request Submitted', 'Submitted graduation clearance request for 202928 - 2nd to 8 office(s)', NULL, NULL, '2026-01-26 10:04:42'),
(49, 6, 'Clearance Request Submitted', 'Submitted transfer clearance request for 202928 - 1st to 8 office(s)', NULL, NULL, '2026-01-26 10:33:33'),
(50, 6, 'Clearance Request Submitted', 'Submitted honorable_dismissal clearance request for qewqe - 1st to 8 office(s)', NULL, NULL, '2026-01-26 11:18:51'),
(51, 6, 'Clearance Request Submitted', 'Submitted transfer clearance request for 202928 - 2nd to 8 office(s)', NULL, NULL, '2026-01-26 11:25:37'),
(52, 6, 'Clearance Request Submitted', 'Submitted graduation clearance request for 202928 - 2nd to 8 office(s)', NULL, NULL, '2026-01-26 11:28:50'),
(53, 10, 'Clearance Approved', 'Approved clearance for test account - Registrar Office', NULL, NULL, '2026-01-26 11:34:47'),
(54, 6, 'Clearance Request Submitted', 'Submitted transfer clearance request for 2323a - 1st to 8 office(s)', NULL, NULL, '2026-01-26 11:50:03'),
(55, 10, 'Clearance Rejected', 'Rejected clearance for test account - Registrar Office', NULL, NULL, '2026-01-26 11:50:31'),
(56, 6, 'Clearance Request Submitted', 'Submitted graduation clearance request for 202928 - 2nd to 8 office(s)', NULL, NULL, '2026-01-26 11:55:09'),
(57, 6, 'Clearance Request Submitted', 'Submitted transfer clearance request for 2323 - 2nd to 8 office(s)', NULL, NULL, '2026-01-26 12:07:33'),
(58, 6, 'Clearance Request Submitted', 'Submitted graduation clearance request for afaf - 1st to 8 office(s)', NULL, NULL, '2026-01-26 12:07:54'),
(59, 10, 'Clearance Approved', 'Approved clearance for test account - Registrar Office', NULL, NULL, '2026-01-26 12:08:14'),
(60, 6, 'Clearance Request Submitted', 'Submitted transfer clearance request for dwa - 1st to 8 office(s)', NULL, NULL, '2026-01-26 15:36:31'),
(61, 6, 'Clearance Request Submitted', 'Submitted graduation clearance request for dfgd - 1st to 8 office(s)', NULL, NULL, '2026-01-27 07:01:48'),
(62, 10, 'Clearance Approved', 'Approved clearance for test account - Registrar Office', NULL, NULL, '2026-01-27 07:03:15'),
(63, 6, 'Request Cancelled', 'Graduation clearance request was cancelled', NULL, NULL, '2026-01-27 15:41:42'),
(64, 6, 'Clearance Request Submitted', 'Submitted transfer clearance request for qewqe - 2nd to 8 office(s)', NULL, NULL, '2026-01-28 00:12:36'),
(65, 10, 'Clearance Rejected', 'Rejected clearance for test account - Registrar Office', NULL, NULL, '2026-01-28 00:31:38'),
(66, 6, 'Request Cancelled', 'Transfer clearance request was cancelled', NULL, NULL, '2026-01-28 00:40:31'),
(67, 6, 'Clearance Request Submitted', 'Submitted graduation clearance request for 2323 - 1st to 8 office(s)', NULL, NULL, '2026-01-28 00:40:39'),
(68, 6, 'Message Sent', 'Sent message to student: Additional Documents Required', NULL, NULL, '2026-01-29 12:12:47'),
(69, 8, 'Office Added', 'Added new office: css (CSS)', NULL, NULL, '2026-01-30 01:04:07'),
(70, 8, 'Office Added', 'Added new office: Center Of Student Success (CEN)', NULL, NULL, '2026-01-30 01:09:47'),
(71, 8, 'Office Added', 'Added new office: Center Of Student Success (CEN)', NULL, NULL, '2026-01-30 01:10:55'),
(72, 8, 'Staff Registration', 'New office staff registered: CSS Test (Employee ID: EMPOO2) - Office ID: 9', NULL, NULL, '2026-01-30 15:20:42'),
(73, 6, 'Request Cancelled', 'Graduation clearance request was cancelled', NULL, NULL, '2026-01-31 03:22:12'),
(74, 6, 'Clearance Request Submitted', 'Submitted graduation clearance request for adawd - 2nd to 6 office(s)', NULL, NULL, '2026-01-31 03:38:32'),
(75, 6, 'Request Cancelled', 'Graduation clearance request was cancelled', NULL, NULL, '2026-02-01 11:30:18'),
(76, 6, 'Submitted Graduation Clearance', 'New clearance request submitted', NULL, NULL, '2026-02-01 19:03:47'),
(77, 6, 'Request Cancelled', ' clearance request was cancelled', NULL, NULL, '2026-02-01 19:04:58'),
(78, 6, 'Submitted Graduation Clearance', 'New clearance request submitted', NULL, NULL, '2026-02-01 19:05:27'),
(79, 6, 'Request Cancelled', ' clearance request was cancelled', NULL, NULL, '2026-02-01 19:13:01'),
(80, 6, 'Submitted Graduation Clearance', 'New clearance request submitted', NULL, NULL, '2026-02-01 19:13:20'),
(81, 6, 'Request Cancelled', ' clearance request was cancelled', NULL, NULL, '2026-02-02 06:08:53'),
(82, 6, 'Submitted Graduation Clearance', 'New clearance request submitted', NULL, NULL, '2026-02-02 07:23:58'),
(83, 6, 'Request Cancelled', ' clearance request was cancelled', NULL, NULL, '2026-02-02 07:40:29'),
(84, 6, 'Submitted Graduation Clearance', 'New clearance request submitted', NULL, NULL, '2026-02-02 07:40:46'),
(85, 6, 'Request Cancelled', ' clearance request was cancelled', NULL, NULL, '2026-02-02 07:41:50'),
(86, 6, 'Submitted Graduation Clearance', 'New clearance request submitted', NULL, NULL, '2026-02-02 07:42:09'),
(87, 6, 'Request Cancelled', ' clearance request was cancelled', NULL, NULL, '2026-02-02 07:59:18'),
(88, 6, 'Submitted Graduation Clearance', 'New clearance request submitted', NULL, NULL, '2026-02-02 16:20:33'),
(89, 6, 'Request Cancelled', ' clearance request was cancelled', NULL, NULL, '2026-02-02 16:57:17'),
(90, 6, 'Submitted Graduation Clearance', 'New clearance request submitted', NULL, NULL, '2026-02-03 05:49:45'),
(91, 6, 'Message Sent', 'Sent message to student: Regarding Your Clearance Request', NULL, NULL, '2026-02-03 06:10:47'),
(92, 10, 'Clearance Approved', 'Approved clearance for test account - Registrar Office', NULL, NULL, '2026-02-03 06:10:56'),
(93, 6, 'Request Cancelled', ' clearance request was cancelled', NULL, NULL, '2026-02-03 06:36:42'),
(94, 6, 'Submitted Graduation Clearance', 'New clearance request submitted', NULL, NULL, '2026-02-03 06:36:55'),
(95, 12, 'User Registration', 'New employee account created', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '2026-02-03 17:02:04'),
(96, 8, 'Staff Registration', 'New office staff registered: clinic staff (Employee ID: EMPOO3) - Office ID: 7', NULL, NULL, '2026-02-05 02:10:53'),
(97, 8, 'Staff Registration', 'New office staff registered: finance staff (Employee ID: EMPOO4) - Office ID: 2', NULL, NULL, '2026-02-05 02:15:45'),
(98, 8, 'Staff Member Registered', 'Registered guidance staff as staff for Guidance Office', NULL, NULL, '2026-02-05 05:50:08'),
(99, 15, 'Clearance Approved', 'Approved clearance for test account - Guidance Office', NULL, NULL, '2026-02-05 05:50:29'),
(100, 13, 'Clearance Approved', 'Approved clearance for test account - Clinic', NULL, NULL, '2026-02-05 06:32:21'),
(101, 14, 'Clearance Approved', 'Approved clearance for test account - Finance Office', NULL, NULL, '2026-02-05 06:32:39'),
(102, 6, 'Request Cancelled', ' clearance request was cancelled', NULL, NULL, '2026-02-05 08:25:08'),
(103, 6, 'Submitted Graduation Clearance', 'New clearance request submitted as student', NULL, NULL, '2026-02-05 08:25:35'),
(104, 10, 'Clearance Approved', 'Approved clearance for test account - Registrar Office', NULL, NULL, '2026-02-05 08:28:40'),
(105, 15, 'Clearance Approved', 'Approved clearance for test account - Guidance Office', NULL, NULL, '2026-02-05 08:29:02'),
(106, 6, 'Request Cancelled', ' clearance request was cancelled', NULL, NULL, '2026-02-05 08:31:09'),
(107, 6, 'Submitted Graduation Clearance', 'New clearance request submitted as student', NULL, NULL, '2026-02-05 08:31:29'),
(108, 13, 'Clearance Approved', 'Approved clearance for test account - Clinic', NULL, NULL, '2026-02-05 08:31:44'),
(109, 6, 'Submitted Graduation Clearance', 'New clearance request submitted as student', NULL, NULL, '2026-02-05 15:46:26'),
(110, 13, 'Message Sent', 'Sent message to student: Clearance Request Approved', NULL, NULL, '2026-02-05 16:58:03'),
(111, 13, 'Clearance Approved', 'Approved clearance for test account - Clinic', NULL, NULL, '2026-02-05 16:58:06'),
(112, 8, 'Deleted Clearance Request', 'Deleted clearance request #54 for test account (testaccount@panpacificu.edu.ph)', '::1', NULL, '2026-02-06 11:38:23'),
(113, 6, 'Submitted Graduation Clearance', 'New clearance request submitted as student', NULL, NULL, '2026-02-07 16:42:55'),
(114, 13, 'Clearance Rejected', 'Rejected clearance for test account - Clinic', NULL, NULL, '2026-02-07 17:00:43'),
(115, 6, 'Request Cancelled', ' clearance request was cancelled', NULL, NULL, '2026-02-08 06:24:00'),
(116, 6, 'Submitted Graduation Clearance', 'New clearance request submitted as student', NULL, NULL, '2026-02-08 06:24:17'),
(117, 13, 'Clearance Rejected', 'Rejected clearance for test account - Clinic', NULL, NULL, '2026-02-08 06:25:23'),
(118, 16, 'Submitted Graduation Clearance', 'New clearance request submitted as student', NULL, NULL, '2026-02-12 12:14:44'),
(119, 6, 'Submitted Graduation Clearance', 'New clearance request submitted as student', NULL, NULL, '2026-02-15 08:55:40'),
(120, 6, 'Request Cancelled', ' clearance request was cancelled', NULL, NULL, '2026-02-15 09:22:10'),
(121, 6, 'Submitted Graduation Clearance', 'New clearance request submitted as student', NULL, NULL, '2026-02-15 09:22:26'),
(122, 16, 'Request Cancelled', ' clearance request was cancelled', NULL, NULL, '2026-02-17 10:47:33'),
(123, 16, 'Submitted Graduation Clearance', 'New clearance request submitted as student', NULL, NULL, '2026-02-17 10:48:13'),
(124, 16, 'Request Cancelled', ' clearance request was cancelled', NULL, NULL, '2026-02-17 11:58:38'),
(125, 16, 'Submitted Graduation Clearance', 'New clearance request submitted as student', NULL, NULL, '2026-02-17 11:58:59'),
(126, 13, 'Clearance Approved', 'Approved clearance for John Andrei Langit(ECOAST) - Clinic', NULL, NULL, '2026-02-17 11:59:30'),
(127, 13, 'Clearance Rejected', 'Rejected clearance for test account - Clinic', NULL, NULL, '2026-02-17 12:28:42'),
(128, 16, 'Submitted Graduation Clearance', 'New clearance request submitted as student', NULL, NULL, '2026-02-17 13:14:32'),
(129, 13, 'Message Sent', 'Sent message to student: Additional Documents Required', NULL, NULL, '2026-02-17 13:15:15'),
(130, 13, 'Clearance Rejected', 'Rejected clearance for John Andrei Langit(ECOAST) - Clinic', NULL, NULL, '2026-02-17 13:15:27'),
(131, 16, 'Message Sent', 'Replied to message: Re: Additional Documents Required', NULL, NULL, '2026-02-17 13:16:10'),
(132, 16, 'Message Sent', 'Replied to message: Re: Additional Documents Required', NULL, NULL, '2026-02-17 16:22:14'),
(133, 16, 'Message Sent', 'Replied to message: Re: Additional Documents Required', NULL, NULL, '2026-02-17 16:32:23'),
(134, 16, 'Message Sent', 'Replied to message: Re: Additional Documents Required', NULL, NULL, '2026-02-17 16:41:20'),
(135, 16, 'Message Sent', 'Replied to message: Re: Additional Documents Required', NULL, NULL, '2026-02-17 16:42:00'),
(136, 16, 'Submitted Graduation Clearance', 'New clearance request submitted as student', NULL, NULL, '2026-02-17 17:45:49'),
(137, 13, 'Message Sent', 'Sent message to student: ada', NULL, NULL, '2026-02-17 17:49:14'),
(138, 13, 'Message Sent', 'Sent message to student: Additional Documents Required', NULL, NULL, '2026-02-17 17:49:43'),
(139, 13, 'Clearance Approved', 'Approved clearance for John Andrei Langit(ECOAST) - Clinic', NULL, NULL, '2026-02-17 17:50:09'),
(140, 16, 'Submitted Graduation Clearance', 'New clearance request submitted as student', NULL, NULL, '2026-02-18 11:38:46'),
(141, 13, 'Message Sent', 'Sent message to student: Additional Documents Required', NULL, NULL, '2026-02-18 17:23:40'),
(142, 13, 'Clearance Rejected', 'Rejected clearance for John Andrei Langit(ECOAST) - Clinic', NULL, NULL, '2026-02-18 17:23:51'),
(143, 13, 'Message Sent', 'Sent message to student: Clearance Request - Action Required', NULL, NULL, '2026-02-18 17:37:16'),
(144, 16, 'Message Sent', 'Replied to message: Re: Clearance Request - Action Required', NULL, NULL, '2026-02-18 17:37:52'),
(145, 16, 'Request Cancelled', ' clearance request was cancelled', NULL, NULL, '2026-02-18 17:59:01'),
(146, 16, 'Submitted Graduation Clearance', 'New clearance request submitted as student', NULL, NULL, '2026-02-18 17:59:24'),
(147, 13, 'Clearance Rejected', 'Rejected clearance for John Andrei Langit(ECOAST) - Clinic', NULL, NULL, '2026-02-18 18:00:32'),
(148, 16, 'Request Cancelled', ' clearance request was cancelled', NULL, NULL, '2026-02-18 18:10:00'),
(149, 16, 'Submitted Graduation Clearance', 'New clearance request submitted as student', NULL, NULL, '2026-02-18 18:10:21'),
(150, 13, 'Clearance Rejected', 'Rejected clearance for John Andrei Langit(ECOAST) - Clinic', NULL, NULL, '2026-02-18 18:11:15'),
(151, 16, 'Clearance Resubmitted', 'Resubmitted  clearance request - 1 item(s) reset', NULL, NULL, '2026-02-18 18:11:50'),
(152, 13, 'Clearance Rejected', 'Rejected clearance for John Andrei Langit(ECOAST) - Clinic', NULL, NULL, '2026-02-18 18:12:42'),
(153, 13, 'Message Sent', 'Sent message to student: Clearance Request - Action Required', NULL, NULL, '2026-02-18 18:36:17'),
(154, 16, 'Message Sent', 'Replied to message: Re: Clearance Request - Action Required', NULL, NULL, '2026-02-18 18:36:45'),
(155, 16, 'Clearance Resubmitted', 'Resubmitted  clearance request - 1 item(s) reset', NULL, NULL, '2026-02-19 12:34:34'),
(156, 13, 'Clearance Rejected', 'Rejected clearance for John Andrei Langit(ECOAST) - Clinic', NULL, NULL, '2026-02-19 12:40:00'),
(157, 16, 'Message Sent', 'Replied to message: Re: Clearance Request - Action Required', NULL, NULL, '2026-02-19 16:33:42'),
(158, 16, 'Request Cancelled', ' clearance request was cancelled', NULL, NULL, '2026-02-20 14:47:21'),
(159, 16, 'Submitted Graduation Clearance', 'New clearance request submitted as student', NULL, NULL, '2026-02-20 14:47:53'),
(160, 13, 'Clearance Approved', 'Approved clearance for John Andrei Langit(ECOAST) - Clinic', NULL, NULL, '2026-02-20 15:19:30'),
(161, 16, 'Deleted Completed Clearance', 'User deleted their completed clearance request #69 ()', '::1', NULL, '2026-02-28 12:46:00'),
(162, 16, 'Deleted Completed Clearance', 'User deleted their completed clearance request #65 ()', '::1', NULL, '2026-02-28 12:46:02'),
(163, 16, 'Deleted Completed Clearance', 'User deleted their completed clearance request #63 ()', '::1', NULL, '2026-02-28 12:46:04'),
(164, 16, 'Submitted Graduation Clearance', 'New clearance request submitted as student', NULL, NULL, '2026-02-28 12:56:21'),
(165, 13, 'Clearance Approved', 'Approved clearance for John Andrei Langit(ECOAST) - Clinic', NULL, NULL, '2026-02-28 12:56:47'),
(166, 16, 'Deleted Completed Clearance', 'User deleted their completed clearance request #70 ()', '::1', NULL, '2026-02-28 12:59:29'),
(167, 12, 'Submitted Employee Clearance Test', 'New clearance request submitted as employee', NULL, NULL, '2026-03-03 09:44:48'),
(168, 12, 'Request Cancelled', ' clearance request was cancelled', NULL, NULL, '2026-03-03 10:39:02'),
(169, 12, 'Submitted Employee Clearance Test', 'New clearance request submitted as employee', NULL, NULL, '2026-03-03 10:39:42'),
(170, 8, 'Bulk Deleted Clearance Requests', 'Bulk deleted 65 completed and cancelled clearance request(s)', '::1', NULL, '2026-03-03 10:48:58'),
(171, 12, 'Request Cancelled', ' clearance request was cancelled', NULL, NULL, '2026-03-03 12:43:49'),
(172, 12, 'Submitted Employee Clearance Test', 'New clearance request submitted as employee', NULL, NULL, '2026-03-03 12:43:57'),
(173, 12, 'Request Cancelled', 'Employee Clearance Test clearance request was cancelled', NULL, NULL, '2026-03-03 12:44:01'),
(174, 16, 'Submitted Graduation Clearance', 'New clearance request submitted as student', NULL, NULL, '2026-03-03 13:26:38'),
(175, 13, 'Message Sent', 'Sent message to student: Regarding Your Clearance Request', NULL, NULL, '2026-03-03 13:44:28'),
(176, 13, 'Clearance Approved', 'Approved clearance for John Andrei Langit(ECOAST) - Clinic', NULL, NULL, '2026-03-03 13:44:45'),
(177, 16, 'Deleted Completed Clearance', 'User deleted their completed clearance request #74 (Graduation Clearance)', '::1', NULL, '2026-03-03 13:45:17'),
(178, 12, 'Submitted Employee Clearance Test', 'New clearance request submitted as employee', NULL, NULL, '2026-03-03 14:01:52'),
(179, 12, 'Request Cancelled', 'Employee Clearance Test clearance request was cancelled', NULL, NULL, '2026-03-03 14:02:40'),
(180, 12, 'Submitted Employee Clearance Test', 'New clearance request submitted as employee', NULL, NULL, '2026-03-03 14:03:38'),
(181, 13, 'Message Sent', 'Sent message to student: Regarding Your Clearance Request', NULL, NULL, '2026-03-03 14:04:15'),
(182, 13, 'Clearance Approved', 'Approved clearance for test account3 - Clinic', NULL, NULL, '2026-03-03 14:04:29'),
(183, 12, 'Deleted Completed Clearance', 'User deleted their completed clearance request #76 (Employee Clearance Test)', '::1', NULL, '2026-03-03 14:05:18'),
(184, 16, 'Submitted Graduation Clearance', 'New clearance request submitted as student', NULL, NULL, '2026-03-03 14:05:47'),
(185, 13, 'Message Sent', 'Sent message to student: Regarding Your Clearance Request', NULL, NULL, '2026-03-03 14:06:08'),
(186, 13, 'Clearance Approved', 'Approved clearance for John Andrei Langit(ECOAST) - Clinic', NULL, NULL, '2026-03-03 14:06:22'),
(187, 16, 'Deleted Completed Clearance', 'User deleted their completed clearance request #77 (Graduation Clearance)', '::1', NULL, '2026-03-03 14:07:37'),
(188, 12, 'Submitted Employee Clearance Test', 'New clearance request submitted as employee', NULL, NULL, '2026-03-03 14:35:07'),
(189, 16, 'Submitted Graduation Clearance', 'New clearance request submitted as student', NULL, NULL, '2026-03-03 16:01:40'),
(190, 13, 'Message Sent', 'Sent message to student: Regarding Your Clearance Request', NULL, NULL, '2026-03-03 16:02:20'),
(191, 13, 'Clearance Rejected', 'Rejected clearance for John Andrei Langit(ECOAST) - Clinic', NULL, NULL, '2026-03-03 16:02:30'),
(192, 16, 'Message Sent', 'Replied to message: Re: Regarding Your Clearance Request', NULL, NULL, '2026-03-03 16:03:22'),
(193, 13, 'Message Sent', 'Sent message to student: Regarding Your Clearance Request', NULL, NULL, '2026-03-03 16:05:01'),
(194, 16, 'Request Cancelled', 'Graduation Clearance clearance request was cancelled', NULL, NULL, '2026-03-04 12:49:50'),
(195, 13, 'Clearance Rejected', 'Rejected clearance for test account3 - Clinic', NULL, NULL, '2026-03-07 13:36:54'),
(196, 8, 'User Deactivated', 'Deactivated user: Test Account2', NULL, NULL, '2026-03-07 13:59:57'),
(197, 8, 'User Reactivated', 'Reactivated user: Test Account2', NULL, NULL, '2026-03-07 14:00:06'),
(198, 16, 'Submitted Graduation Clearance', 'New clearance request submitted as student', NULL, NULL, '2026-03-09 05:53:24'),
(199, 13, 'Clearance Approved', 'Approved clearance for John Andrei Langit(ECOAST) - Clinic', NULL, NULL, '2026-03-09 05:58:13'),
(200, 16, 'Deleted Completed Clearance', 'User deleted their completed clearance request #80 (Graduation Clearance)', '::1', NULL, '2026-03-09 05:59:11'),
(201, 12, 'Request Cancelled', 'Employee Clearance Test clearance request was cancelled', NULL, NULL, '2026-03-09 05:59:34'),
(202, 12, 'Submitted Employee Clearance Test', 'New clearance request submitted as employee', NULL, NULL, '2026-03-09 05:59:52'),
(203, 17, 'Submitted Graduation Clearance', 'New clearance request submitted as student', NULL, NULL, '2026-03-09 06:12:38'),
(204, 8, 'Office Added', 'Added new office: Supplies\' Office (SUPPLY)', NULL, NULL, '2026-03-09 06:14:42'),
(205, 17, 'Request Cancelled', 'Graduation Clearance clearance request was cancelled', NULL, NULL, '2026-03-09 06:29:36'),
(206, 17, 'Submitted Graduation Clearance', 'New clearance request submitted as student', NULL, NULL, '2026-03-09 06:30:03'),
(207, 17, 'Request Cancelled', 'Graduation Clearance clearance request was cancelled', NULL, NULL, '2026-03-09 06:31:07'),
(208, 17, 'Submitted Graduation Clearance', 'New clearance request submitted as student', NULL, NULL, '2026-03-09 06:32:00'),
(209, 13, 'Message Sent', 'Sent message to student: Regarding Your Clearance Request', NULL, NULL, '2026-03-09 06:34:56'),
(210, 13, 'Clearance Approved', 'Clearance approved for Clinic (Bulk Action)', NULL, NULL, '2026-03-09 06:36:00'),
(211, 17, 'Deleted Completed Clearance', 'User deleted their completed clearance request #84 (Graduation Clearance)', '::1', NULL, '2026-03-09 06:39:08'),
(212, 16, 'Password Reset', 'Password successfully reset via email link', '::1', NULL, '2026-03-09 17:18:42'),
(213, 16, 'Submitted Graduation Clearance', 'New clearance request submitted as student', NULL, NULL, '2026-03-10 04:55:06'),
(214, 8, 'Staff Member Registered', 'Registered supply Test as staff for Supplies\' Office', NULL, NULL, '2026-03-10 04:56:54'),
(215, 18, 'Message Sent', 'Sent message to student: Clearance Request Approved', NULL, NULL, '2026-03-10 05:04:33'),
(216, 18, 'Message Sent', 'Sent message to student: Clearance Request - Action Required', NULL, NULL, '2026-03-10 05:11:39'),
(217, 18, 'Message Sent', 'Sent message to student: Clearance Request Approved', NULL, NULL, '2026-03-10 05:24:33'),
(218, 18, 'Message Sent', 'Sent message to student: Clearance Request - Action Required', NULL, NULL, '2026-03-10 05:30:56'),
(219, 18, 'Message Sent', 'Sent message to student: Clearance Request Approved', NULL, NULL, '2026-03-10 05:38:21'),
(220, 16, 'Request Cancelled', 'Graduation Clearance clearance request was cancelled', NULL, NULL, '2026-03-10 11:46:32'),
(221, 16, 'Submitted Graduation Clearance', 'New clearance request submitted as student', NULL, NULL, '2026-03-10 14:26:09'),
(222, 18, 'Message Sent', 'Sent message to student: Clearance Request Approved', NULL, NULL, '2026-03-10 14:27:01'),
(223, 18, 'Message Sent', 'Sent message to student: Clearance Request Approved', NULL, NULL, '2026-03-10 14:28:14'),
(224, 18, 'Message Sent', 'Sent message to student: Clearance Request - Action Required', NULL, NULL, '2026-03-10 14:30:57'),
(225, 18, 'Message Sent', 'Sent message to student: Clearance Request Approved', NULL, NULL, '2026-03-10 14:32:23'),
(226, 16, 'Message Sent', 'Contacted office staff regarding clearance item #449', NULL, NULL, '2026-03-10 14:44:40'),
(227, 18, 'Message Sent', 'Sent message to student: Clearance Request - Action Required', NULL, NULL, '2026-03-10 14:47:46'),
(228, 16, 'Request Cancelled', 'Graduation Clearance clearance request was cancelled', NULL, NULL, '2026-03-10 15:20:51'),
(229, 16, 'Submitted Graduation Clearance', 'New clearance request submitted as student', NULL, NULL, '2026-03-10 15:23:13');

-- --------------------------------------------------------

--
-- Table structure for table `clearance_items`
--

CREATE TABLE `clearance_items` (
  `id` int(11) NOT NULL,
  `clearance_request_id` int(11) NOT NULL,
  `office_id` int(11) NOT NULL,
  `status` enum('pending','approved','rejected') DEFAULT 'pending',
  `processed_by` int(11) DEFAULT NULL,
  `processed_date` datetime DEFAULT NULL,
  `remarks` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `clearance_items`
--

INSERT INTO `clearance_items` (`id`, `clearance_request_id`, `office_id`, `status`, `processed_by`, `processed_date`, `remarks`, `created_at`, `updated_at`) VALUES
(441, 78, 7, 'pending', NULL, NULL, NULL, '2026-03-03 14:35:07', '2026-03-09 05:59:34'),
(442, 79, 7, 'pending', NULL, NULL, NULL, '2026-03-03 16:01:40', '2026-03-04 12:49:50'),
(444, 81, 7, 'pending', NULL, NULL, NULL, '2026-03-09 05:59:52', '2026-03-09 05:59:52'),
(445, 82, 7, 'pending', NULL, NULL, NULL, '2026-03-09 06:12:38', '2026-03-09 06:12:38'),
(446, 83, 7, 'pending', NULL, NULL, NULL, '2026-03-09 06:30:03', '2026-03-09 06:30:03'),
(448, 85, 12, 'pending', NULL, NULL, NULL, '2026-03-10 04:55:06', '2026-03-10 04:55:06'),
(449, 86, 12, 'pending', NULL, NULL, NULL, '2026-03-10 14:26:09', '2026-03-10 14:26:09'),
(450, 87, 12, 'pending', NULL, NULL, NULL, '2026-03-10 15:23:13', '2026-03-10 15:23:13');

-- --------------------------------------------------------

--
-- Table structure for table `clearance_requests`
--

CREATE TABLE `clearance_requests` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `user_role` varchar(50) NOT NULL,
  `template_id` int(11) DEFAULT NULL,
  `request_type` varchar(100) NOT NULL DEFAULT '',
  `academic_year` varchar(20) DEFAULT NULL,
  `semester` enum('1st','2nd','summer') DEFAULT NULL,
  `status` enum('pending','in_progress','completed','cancelled','rejected') DEFAULT 'pending',
  `completion_date` datetime DEFAULT NULL,
  `remarks` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `custom_data` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL COMMENT 'Stores custom field values' CHECK (json_valid(`custom_data`))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `clearance_requests`
--

INSERT INTO `clearance_requests` (`id`, `user_id`, `user_role`, `template_id`, `request_type`, `academic_year`, `semester`, `status`, `completion_date`, `remarks`, `created_at`, `updated_at`, `custom_data`) VALUES
(72, 12, 'employee', 7, '', '', '1st', 'cancelled', NULL, NULL, '2026-03-03 10:39:42', '2026-03-03 12:43:49', '{\"emp_id\":\"emp 24 01\",\"emp_name\":\"test3\",\"__field_labels\":{\"emp_id\":\"I.D. No:\",\"emp_name\":\"Name:\"}}'),
(73, 12, 'employee', 7, 'Employee Clearance Test', NULL, NULL, 'cancelled', NULL, NULL, '2026-03-03 12:43:57', '2026-03-03 12:44:01', '{\"emp_id\":\"emp 24 01\",\"emp_name\":\"test3\",\"__field_labels\":{\"emp_id\":\"I.D. No:\",\"emp_name\":\"Name:\"}}'),
(75, 12, 'employee', 7, 'Employee Clearance Test', NULL, NULL, 'cancelled', NULL, NULL, '2026-03-03 14:01:52', '2026-03-03 14:02:40', '{\"emp_id\":\"emp 24 01\",\"emp_name\":\"test3\",\"__field_labels\":{\"emp_id\":\"I.D. No:\",\"emp_name\":\"Name:\"}}'),
(78, 12, 'employee', 7, 'Employee Clearance Test', NULL, NULL, 'cancelled', NULL, NULL, '2026-03-03 14:35:07', '2026-03-09 05:59:34', '{\"emp_id\":\"emp 24 01\",\"emp_name\":\"test3\",\"__field_labels\":{\"emp_id\":\"I.D. No:\",\"emp_name\":\"Name:\"}}'),
(79, 16, 'student', 1, 'Graduation Clearance', NULL, NULL, 'cancelled', NULL, NULL, '2026-03-03 16:01:40', '2026-03-04 12:49:50', '{\"id_number\":\"12345\",\"degree_program\":\"BSIT\",\"student_name\":\"John Andrei Langit\",\"address\":\"tayug\",\"contact_number\":\"09623866889\",\"email\":\"johnandrei.langit.ecoast@panpacificu.edu.ph\",\"date_of_graduation\":\"2026-03-23\",\"__field_labels\":{\"id_number\":\"I.D. No:\",\"degree_program\":\"Degree Program:\",\"student_name\":\"Name:\",\"address\":\"Address:\",\"contact_number\":\"Contact Number:\",\"email\":\"Email:\",\"date_of_graduation\":\"Date of Graduation:\"}}'),
(81, 12, 'employee', 7, 'Employee Clearance Test', NULL, NULL, 'pending', NULL, NULL, '2026-03-09 05:59:52', '2026-03-09 05:59:52', '{\"emp_id\":\"emp 24 01\",\"emp_name\":\"test3\",\"__field_labels\":{\"emp_id\":\"I.D. No:\",\"emp_name\":\"Name:\"}}'),
(82, 17, 'student', 1, 'Graduation Clearance', NULL, NULL, 'cancelled', NULL, NULL, '2026-03-09 06:12:38', '2026-03-09 06:29:36', '{\"id_number\":\"1231008\",\"degree_program\":\"BSIT\",\"student_name\":\"Onyx Alunday\",\"address\":\"San Nicolas\",\"contact_number\":\"09623866889\",\"email\":\"onyxlloyd.alunday.ecoast@panpacificu.edu.ph\",\"date_of_graduation\":\"2026-03-16\",\"__field_labels\":{\"id_number\":\"I.D. No:\",\"degree_program\":\"Degree Program:\",\"student_name\":\"Name:\",\"address\":\"Address:\",\"contact_number\":\"Contact Number:\",\"email\":\"Email:\",\"date_of_graduation\":\"Date of Graduation:\"}}'),
(83, 17, 'student', 1, 'Graduation Clearance', NULL, NULL, 'cancelled', NULL, NULL, '2026-03-09 06:30:03', '2026-03-09 06:31:07', '{\"id_number\":\"1231401\",\"degree_program\":\"BSIT\",\"student_name\":\"bonifacio esporia\",\"address\":\"tayug\",\"contact_number\":\"09053330169\",\"email\":\"onyxlloyd.alunday.ecoast@panpacificu.edu.ph\",\"date_of_graduation\":\"2026-10-09\",\"__field_labels\":{\"id_number\":\"I.D. No:\",\"degree_program\":\"Degree Program:\",\"student_name\":\"Name:\",\"address\":\"Address:\",\"contact_number\":\"Contact Number:\",\"email\":\"Email:\",\"date_of_graduation\":\"Date of Graduation:\"}}'),
(85, 16, 'student', 1, 'Graduation Clearance', NULL, NULL, 'cancelled', NULL, NULL, '2026-03-10 04:55:06', '2026-03-10 11:46:32', '{\"id_number\":\"12345\",\"degree_program\":\"BSIT\",\"student_name\":\"John Andrei Langit\",\"address\":\"Tayug\",\"contact_number\":\"09623866889\",\"email\":\"johnandrei.langit.ecoast@panpacificu.edu.ph\",\"date_of_graduation\":\"2026-03-11\",\"__field_labels\":{\"id_number\":\"I.D. No:\",\"degree_program\":\"Degree Program:\",\"student_name\":\"Name:\",\"address\":\"Address:\",\"contact_number\":\"Contact Number:\",\"email\":\"Email:\",\"date_of_graduation\":\"Date of Graduation:\"}}'),
(86, 16, 'student', 1, 'Graduation Clearance', NULL, NULL, 'cancelled', NULL, NULL, '2026-03-10 14:26:09', '2026-03-10 15:20:51', '{\"id_number\":\"12345\",\"degree_program\":\"BSIT\",\"student_name\":\"John Andrei Langit\",\"address\":\"Tayug\",\"contact_number\":\"09623866889\",\"email\":\"johnandrei.langit.ecoast@panpacificu.edu.ph\",\"date_of_graduation\":\"2026-03-01\",\"__field_labels\":{\"id_number\":\"I.D. No:\",\"degree_program\":\"Degree Program:\",\"student_name\":\"Name:\",\"address\":\"Address:\",\"contact_number\":\"Contact Number:\",\"email\":\"Email:\",\"date_of_graduation\":\"Date of Graduation:\"}}'),
(87, 16, 'student', 1, 'Graduation Clearance', NULL, NULL, 'pending', NULL, NULL, '2026-03-10 15:23:13', '2026-03-10 15:23:13', '{\"id_number\":\"12345\",\"degree_program\":\"BSIT\",\"student_name\":\"John Andrei Langit\",\"address\":\"Tayug\",\"contact_number\":\"09623866889\",\"email\":\"johnandrei.langit.ecoast@panpacificu.edu.ph\",\"date_of_graduation\":\"2026-03-10\",\"__field_labels\":{\"id_number\":\"I.D. No:\",\"degree_program\":\"Degree Program:\",\"student_name\":\"Name:\",\"address\":\"Address:\",\"contact_number\":\"Contact Number:\",\"email\":\"Email:\",\"date_of_graduation\":\"Date of Graduation:\"}}');

-- --------------------------------------------------------

--
-- Table structure for table `clearance_status_logs`
--

CREATE TABLE `clearance_status_logs` (
  `id` int(11) NOT NULL,
  `clearance_item_id` int(11) NOT NULL,
  `clearance_request_id` int(11) NOT NULL,
  `changed_by_user_id` int(11) NOT NULL,
  `actor_role` varchar(50) NOT NULL COMMENT 'office_staff, administrator, student',
  `old_status` varchar(50) DEFAULT NULL,
  `new_status` varchar(50) NOT NULL,
  `remarks` text DEFAULT NULL,
  `office_name` varchar(100) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Audit trail: every status change on clearance items';

--
-- Dumping data for table `clearance_status_logs`
--

INSERT INTO `clearance_status_logs` (`id`, `clearance_item_id`, `clearance_request_id`, `changed_by_user_id`, `actor_role`, `old_status`, `new_status`, `remarks`, `office_name`, `created_at`) VALUES
(4, 442, 79, 13, 'office_staff', 'pending', 'rejected', '', 'Clinic', '2026-03-03 16:02:26'),
(5, 441, 78, 13, 'office_staff', 'pending', 'rejected', '', 'Clinic', '2026-03-07 13:36:50');

-- --------------------------------------------------------

--
-- Table structure for table `clearance_templates`
--

CREATE TABLE `clearance_templates` (
  `id` int(11) NOT NULL,
  `template_name` varchar(100) NOT NULL COMMENT 'e.g., Graduation, Transfer, Honorable Dismissal',
  `template_code` varchar(50) NOT NULL COMMENT 'e.g., GRAD, TRANS, HON_DIS',
  `description` text DEFAULT NULL COMMENT 'What this clearance is for',
  `user_type` enum('student','employee','both') DEFAULT 'student',
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `clearance_templates`
--

INSERT INTO `clearance_templates` (`id`, `template_name`, `template_code`, `description`, `user_type`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 'Graduation Clearance', 'GRADUATION', 'Required for graduating students before diploma release', 'student', 1, '2026-01-31 19:20:50', '2026-02-01 04:15:54'),
(7, 'Employee Clearance Test', 'EMPLOYEE CLEARANCE', 'testing', 'employee', 1, '2026-03-03 09:44:18', '2026-03-03 09:44:18');

-- --------------------------------------------------------

--
-- Table structure for table `clearance_template_fields`
--

CREATE TABLE `clearance_template_fields` (
  `id` int(11) NOT NULL,
  `template_id` int(11) NOT NULL,
  `field_name` varchar(100) NOT NULL COMMENT 'e.g., id_number, name, address',
  `field_label` varchar(100) NOT NULL COMMENT 'Display name: "I.D. Number"',
  `field_type` enum('text','email','date','tel','textarea','select') DEFAULT 'text',
  `is_required` tinyint(1) DEFAULT 1,
  `field_order` int(11) DEFAULT 0,
  `field_options` text DEFAULT NULL COMMENT 'For select fields, JSON array of options'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `clearance_template_fields`
--

INSERT INTO `clearance_template_fields` (`id`, `template_id`, `field_name`, `field_label`, `field_type`, `is_required`, `field_order`, `field_options`) VALUES
(39, 7, 'emp_id', 'I.D. No:', 'text', 1, 1, NULL),
(40, 7, 'emp_name', 'Name:', 'text', 1, 2, NULL),
(188, 1, 'id_number', 'I.D. No:', 'text', 1, 1, NULL),
(189, 1, 'degree_program', 'Degree Program:', 'text', 1, 2, NULL),
(190, 1, 'student_name', 'Name:', 'text', 1, 3, NULL),
(191, 1, 'address', 'Address:', 'textarea', 1, 4, NULL),
(192, 1, 'contact_number', 'Contact Number:', 'tel', 1, 5, NULL),
(193, 1, 'email', 'Email:', 'email', 1, 6, NULL),
(194, 1, 'date_of_graduation', 'Date of Graduation:', 'date', 1, 7, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `clearance_template_offices`
--

CREATE TABLE `clearance_template_offices` (
  `id` int(11) NOT NULL,
  `template_id` int(11) NOT NULL,
  `office_id` int(11) NOT NULL,
  `is_required` tinyint(1) DEFAULT 1,
  `office_order` int(11) DEFAULT 0 COMMENT 'Order in which offices appear',
  `requirements` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL COMMENT 'JSON array: [{"text":"ID Surrendered","mandatory":true}]' CHECK (json_valid(`requirements`))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `clearance_template_offices`
--

INSERT INTO `clearance_template_offices` (`id`, `template_id`, `office_id`, `is_required`, `office_order`, `requirements`) VALUES
(12, 7, 7, 1, 1, NULL),
(26, 1, 12, 1, 1, '[{\"text\":\"Toga\",\"mandatory\":true}]');

-- --------------------------------------------------------

--
-- Table structure for table `documents`
--

CREATE TABLE `documents` (
  `id` int(11) NOT NULL,
  `clearance_item_id` int(11) NOT NULL,
  `file_name` varchar(255) NOT NULL,
  `file_path` varchar(500) NOT NULL,
  `file_type` varchar(50) DEFAULT NULL,
  `file_size` int(11) DEFAULT NULL,
  `remarks` text DEFAULT NULL,
  `uploaded_by` int(11) NOT NULL,
  `upload_date` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `email_logs`
--

CREATE TABLE `email_logs` (
  `id` int(11) NOT NULL,
  `recipient` varchar(255) NOT NULL,
  `subject` varchar(500) NOT NULL,
  `status` enum('sent','failed','queued') DEFAULT 'sent',
  `error_message` text DEFAULT NULL,
  `sent_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `email_logs`
--

INSERT INTO `email_logs` (`id`, `recipient`, `subject`, `status`, `error_message`, `sent_at`) VALUES
(2, 'langitjohnandrei509@gmai.com', '✅ Test Email - Configuration Working!', 'sent', NULL, '2026-02-17 10:35:10'),
(3, 'langitjohnandrei509@gmai.com', 'Clearance Request Submitted - Graduation', 'sent', NULL, '2026-02-17 10:36:28'),
(4, 'johnandrei.langit.ecoast@panpacificu.edu.ph', '🎉 Clearance Completed Successfully!', 'sent', NULL, '2026-02-17 11:59:24'),
(5, 'johnandrei.langit.ecoast@panpacificu.edu.ph', '✅ Clearance Update: Clinic - Approved', 'sent', NULL, '2026-02-17 11:59:30'),
(6, 'testaccount@panpacificu.edu.ph', '⚠️ Clearance Update: Clinic - Rejected', 'sent', NULL, '2026-02-17 12:28:42'),
(7, 'johnandrei.langit.ecoast@panpacificu.edu.ph', '💬 New Message from clinic staff', 'sent', NULL, '2026-02-17 13:15:20'),
(8, 'johnandrei.langit.ecoast@panpacificu.edu.ph', '⚠️ Clearance Update: Clinic - Rejected', 'sent', NULL, '2026-02-17 13:15:27'),
(9, 'clinicstaff@panpacificu.edu.ph', '💬 New Message from John Andrei Langit(ECOAST)', 'sent', NULL, '2026-02-17 13:16:15'),
(10, 'clinicstaff@panpacificu.edu.ph', '💬 New Message from John Andrei Langit(ECOAST)', 'sent', NULL, '2026-02-17 16:22:22'),
(11, 'clinicstaff@panpacificu.edu.ph', '💬 New Message from John Andrei Langit(ECOAST)', 'sent', NULL, '2026-02-17 16:32:31'),
(12, 'clinicstaff@panpacificu.edu.ph', '💬 New Message from John Andrei Langit(ECOAST)', 'sent', NULL, '2026-02-17 16:41:26'),
(13, 'clinicstaff@panpacificu.edu.ph', '💬 New Message from John Andrei Langit(ECOAST)', 'sent', NULL, '2026-02-17 16:42:07'),
(14, 'clinicstaff@panpacificu.edu.ph', '💬 New Message from John Andrei Langit(ECOAST)', 'sent', NULL, '2026-02-17 17:46:20'),
(15, 'johnandrei.langit.ecoast@panpacificu.edu.ph', '💬 New Message from clinic staff', 'sent', NULL, '2026-02-17 17:49:20'),
(16, 'johnandrei.langit.ecoast@panpacificu.edu.ph', '💬 New Message from clinic staff', 'sent', NULL, '2026-02-17 17:49:49'),
(17, 'johnandrei.langit.ecoast@panpacificu.edu.ph', '🎉 Clearance Completed Successfully!', 'sent', NULL, '2026-02-17 17:50:03'),
(18, 'johnandrei.langit.ecoast@panpacificu.edu.ph', '✅ Clearance Update: Clinic - Approved', 'sent', NULL, '2026-02-17 17:50:09'),
(19, 'clinicstaff@panpacificu.edu.ph', '💬 New Message from John Andrei Langit(ECOAST)', 'sent', NULL, '2026-02-18 11:39:01'),
(20, 'johnandrei.langit.ecoast@panpacificu.edu.ph', '💬 New Message from clinic staff', 'sent', NULL, '2026-02-18 17:23:44'),
(21, 'johnandrei.langit.ecoast@panpacificu.edu.ph', '⚠️ Clearance Update: Clinic - Rejected', 'sent', NULL, '2026-02-18 17:23:51'),
(22, 'johnandrei.langit.ecoast@panpacificu.edu.ph', '💬 New Message from clinic staff', 'sent', NULL, '2026-02-18 17:37:20'),
(23, 'clinicstaff@panpacificu.edu.ph', '💬 New Message from John Andrei Langit(ECOAST)', 'sent', NULL, '2026-02-18 17:37:56'),
(24, 'clinicstaff@panpacificu.edu.ph', '💬 New Message from John Andrei Langit(ECOAST)', 'sent', NULL, '2026-02-18 17:59:06'),
(25, 'johnandrei.langit.ecoast@panpacificu.edu.ph', '⚠️ Clearance Update: Clinic - Rejected', 'sent', NULL, '2026-02-18 18:00:32'),
(26, 'clinicstaff@panpacificu.edu.ph', '💬 New Message from John Andrei Langit(ECOAST)', 'sent', NULL, '2026-02-18 18:10:04'),
(27, 'johnandrei.langit.ecoast@panpacificu.edu.ph', '⚠️ Clearance Update: Clinic - Rejected', 'sent', NULL, '2026-02-18 18:11:15'),
(28, 'clinicstaff@panpacificu.edu.ph', '💬 New Message from John Andrei Langit(ECOAST)', 'sent', NULL, '2026-02-18 18:11:55'),
(29, 'johnandrei.langit.ecoast@panpacificu.edu.ph', '⚠️ Clearance Update: Clinic - Rejected', 'sent', NULL, '2026-02-18 18:12:42'),
(30, 'johnandrei.langit.ecoast@panpacificu.edu.ph', '💬 New Message from clinic staff', 'sent', NULL, '2026-02-18 18:36:22'),
(31, 'clinicstaff@panpacificu.edu.ph', '💬 New Message from John Andrei Langit(ECOAST)', 'sent', NULL, '2026-02-18 18:36:48'),
(32, 'clinicstaff@panpacificu.edu.ph', '💬 New Message from John Andrei Langit(ECOAST)', 'sent', NULL, '2026-02-19 12:34:40'),
(33, 'johnandrei.langit.ecoast@panpacificu.edu.ph', '⚠️ Clearance Update: Clinic - Rejected', 'sent', NULL, '2026-02-19 12:40:00'),
(34, 'clinicstaff@panpacificu.edu.ph', '💬 New Message from John Andrei Langit(ECOAST)', 'sent', NULL, '2026-02-19 16:33:46'),
(35, 'johnandrei.langit.ecoast@panpacificu.edu.ph', 'Clearance Completed Successfully!', 'sent', NULL, '2026-02-20 15:19:27'),
(36, 'johnandrei.langit.ecoast@panpacificu.edu.ph', 'Clearance Update: Clinic - Approved', 'sent', NULL, '2026-02-20 15:19:30'),
(37, 'johnandrei.langit.ecoast@panpacificu.edu.ph', 'Clearance Completed Successfully!', 'sent', NULL, '2026-02-28 12:56:43'),
(38, 'johnandrei.langit.ecoast@panpacificu.edu.ph', 'Clearance Update: Clinic - Approved', 'sent', NULL, '2026-02-28 12:56:47'),
(39, 'clinicstaff@panpacificu.edu.ph', 'New Message from test account3', 'sent', NULL, '2026-03-03 10:39:07'),
(40, 'johnandrei.langit.ecoast@panpacificu.edu.ph', 'New Message from clinic staff', 'sent', NULL, '2026-03-03 13:44:32'),
(41, 'johnandrei.langit.ecoast@panpacificu.edu.ph', 'Clearance Completed Successfully!', 'sent', NULL, '2026-03-03 13:44:40'),
(42, 'johnandrei.langit.ecoast@panpacificu.edu.ph', 'Clearance Update: Clinic - Approved', 'sent', NULL, '2026-03-03 13:44:45'),
(43, 'testaccount3@panpacificu.edu.ph', 'New Message from clinic staff', 'sent', NULL, '2026-03-03 14:04:19'),
(44, 'testaccount3@panpacificu.edu.ph', 'Clearance Completed Successfully!', 'sent', NULL, '2026-03-03 14:04:25'),
(45, 'testaccount3@panpacificu.edu.ph', 'Clearance Update: Clinic - Approved', 'sent', NULL, '2026-03-03 14:04:29'),
(46, 'johnandrei.langit.ecoast@panpacificu.edu.ph', 'New Message from clinic staff', 'sent', NULL, '2026-03-03 14:06:13'),
(47, 'johnandrei.langit.ecoast@panpacificu.edu.ph', 'Clearance Completed Successfully!', 'sent', NULL, '2026-03-03 14:06:18'),
(48, 'johnandrei.langit.ecoast@panpacificu.edu.ph', 'Clearance Update: Clinic - Approved', 'sent', NULL, '2026-03-03 14:06:22'),
(49, 'johnandrei.langit.ecoast@panpacificu.edu.ph', 'New Message from clinic staff', 'sent', NULL, '2026-03-03 16:02:25'),
(50, 'johnandrei.langit.ecoast@panpacificu.edu.ph', 'Clearance Update: Clinic - Rejected', 'sent', NULL, '2026-03-03 16:02:30'),
(51, 'clinicstaff@panpacificu.edu.ph', 'New Message from John Andrei Langit(ECOAST)', 'sent', NULL, '2026-03-03 16:03:27'),
(52, 'johnandrei.langit.ecoast@panpacificu.edu.ph', 'New Message from clinic staff', 'sent', NULL, '2026-03-03 16:05:05'),
(53, 'clinicstaff@panpacificu.edu.ph', 'New Message from John Andrei Langit(ECOAST)', 'sent', NULL, '2026-03-04 12:49:55'),
(54, 'testaccount3@panpacificu.edu.ph', 'Clearance Update: Clinic - Rejected', 'sent', NULL, '2026-03-07 13:36:54'),
(55, 'johnandrei.langit.ecoast@panpacificu.edu.ph', 'Clearance Completed Successfully!', 'sent', NULL, '2026-03-09 05:58:08'),
(56, 'johnandrei.langit.ecoast@panpacificu.edu.ph', 'Clearance Update: Clinic - Approved', 'sent', NULL, '2026-03-09 05:58:13'),
(57, 'clinicstaff@panpacificu.edu.ph', 'New Message from test account3', 'sent', NULL, '2026-03-09 05:59:39'),
(58, 'clinicstaff@panpacificu.edu.ph', 'New Message from Onyx Lloyd Alunday (ECOAST)', 'sent', NULL, '2026-03-09 06:29:43'),
(59, 'clinicstaff@panpacificu.edu.ph', 'New Message from Onyx Lloyd Alunday (ECOAST)', 'sent', NULL, '2026-03-09 06:31:13'),
(60, 'onyxlloyd.alunday.ecoast@panpacificu.edu.ph', 'New Message from clinic staff', 'sent', NULL, '2026-03-09 06:35:01'),
(61, 'onyxlloyd.alunday.ecoast@panpacificu.edu.ph', 'Clearance Update: Clinic - Approved', 'sent', NULL, '2026-03-09 06:35:53'),
(62, 'onyxlloyd.alunday.ecoast@panpacificu.edu.ph', 'Clearance Completed Successfully!', 'sent', NULL, '2026-03-09 06:36:00'),
(63, 'testaccount3@panpacificu.edu.ph', 'Password Changed Successfully', 'sent', NULL, '2026-03-09 14:31:07'),
(64, 'clinicstaff@panpacificu.edu.ph', 'Password Changed Successfully', 'sent', NULL, '2026-03-09 16:04:22'),
(65, 'testaccount3@panpacificu.edu.ph', 'Password Changed Successfully', 'sent', NULL, '2026-03-09 17:00:42'),
(66, 'testaccount3@panpacificu.edu.ph', 'Password Changed Successfully', 'sent', NULL, '2026-03-09 17:07:37'),
(67, 'testaccount3@panpacificu.edu.ph', 'Password Changed Successfully', 'sent', NULL, '2026-03-09 17:11:42'),
(68, 'johnandrei.langit.ecoast@panpacificu.edu.ph', 'Password Reset Request', 'sent', NULL, '2026-03-09 17:14:41'),
(69, 'johnandrei.langit.ecoast@panpacificu.edu.ph', 'Password Reset Request', 'sent', NULL, '2026-03-09 17:18:09'),
(70, 'johnandrei.langit.ecoast@panpacificu.edu.ph', 'New Message from supply Test', 'sent', NULL, '2026-03-10 05:04:37'),
(71, 'johnandrei.langit.ecoast@panpacificu.edu.ph', 'New Message from supply Test', 'sent', NULL, '2026-03-10 05:11:45'),
(72, 'johnandrei.langit.ecoast@panpacificu.edu.ph', 'New Message from supply Test', 'sent', NULL, '2026-03-10 05:24:37'),
(73, 'johnandrei.langit.ecoast@panpacificu.edu.ph', 'New Message from supply Test', 'sent', NULL, '2026-03-10 05:31:00'),
(74, 'johnandrei.langit.ecoast@panpacificu.edu.ph', 'New Message from supply Test', 'sent', NULL, '2026-03-10 05:38:25'),
(75, 'supply@panpacificu.edu.ph', 'New Message from John Andrei Langit(ECOAST)', 'sent', NULL, '2026-03-10 11:46:37'),
(76, 'johnandrei.langit.ecoast@panpacificu.edu.ph', 'New Message from supply Test', 'sent', NULL, '2026-03-10 14:27:05'),
(77, 'johnandrei.langit.ecoast@panpacificu.edu.ph', 'New Message from supply Test', 'sent', NULL, '2026-03-10 14:28:18'),
(78, 'johnandrei.langit.ecoast@panpacificu.edu.ph', 'New Message from supply Test', 'sent', NULL, '2026-03-10 14:31:01'),
(79, 'johnandrei.langit.ecoast@panpacificu.edu.ph', 'New Message from supply Test', 'sent', NULL, '2026-03-10 14:32:27'),
(80, 'supply@panpacificu.edu.ph', 'New Message from John Andrei Langit(ECOAST)', 'sent', NULL, '2026-03-10 14:44:44'),
(81, 'johnandrei.langit.ecoast@panpacificu.edu.ph', 'New Message from supply Test', 'sent', NULL, '2026-03-10 14:47:49'),
(82, 'supply@panpacificu.edu.ph', 'New Message from John Andrei Langit(ECOAST)', 'sent', NULL, '2026-03-10 15:20:56');

-- --------------------------------------------------------

--
-- Table structure for table `messages`
--

CREATE TABLE `messages` (
  `id` int(11) NOT NULL,
  `clearance_item_id` int(11) DEFAULT NULL,
  `sender_id` int(11) NOT NULL,
  `recipient_id` int(11) NOT NULL,
  `message_type` enum('request_documents','clarification','notification','general') DEFAULT 'general',
  `subject` varchar(255) NOT NULL,
  `message` text NOT NULL,
  `is_read` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `messages`
--

INSERT INTO `messages` (`id`, `clearance_item_id`, `sender_id`, `recipient_id`, `message_type`, `subject`, `message`, `is_read`, `created_at`) VALUES
(26, 448, 18, 16, 'clarification', 'Clearance Request - Action Required', 'Dear Recipient,\n\nWe regret to inform you that your clearance request cannot be approved at this time due to the following reason(s):\n\n• [Specify reasons]\n\nPlease address these issues and resubmit your request.\n\nIf you need assistance, please contact our office.\n\nThank you.', 1, '2026-03-10 05:11:39'),
(27, 448, 18, 16, 'clarification', 'Clearance Request Approved', 'Dear Recipient,\n\nCongratulations! Your clearance request has been approved.\n\nYou may now proceed to the next step in your process.\n\nIf you have any questions, please don\'t hesitate to contact us.\n\nBest regards.', 1, '2026-03-10 05:24:33'),
(28, 448, 18, 16, 'clarification', 'Clearance Request - Action Required', 'Dear Recipient,\n\nWe regret to inform you that your clearance request cannot be approved at this time due to the following reason(s):\n\n• [Specify reasons]\n\nPlease address these issues and resubmit your request.\n\nIf you need assistance, please contact our office.\n\nThank you.', 1, '2026-03-10 05:30:56'),
(29, 448, 18, 16, 'clarification', 'Clearance Request Approved', 'Dear Recipient,\n\nCongratulations! Your clearance request has been approved.\n\nYou may now proceed to the next step in your process.\n\nIf you have any questions, please don\'t hesitate to contact us.\n\nBest regards.', 1, '2026-03-10 05:38:21'),
(30, 449, 18, 16, 'request_documents', 'Clearance Request Approved', 'Dear Recipient,\n\nCongratulations! Your clearance request has been approved.\n\nYou may now proceed to the next step in your process.\n\nIf you have any questions, please don\'t hesitate to contact us.\n\nBest regards.', 1, '2026-03-10 14:27:01'),
(31, 449, 18, 16, 'clarification', 'Clearance Request Approved', 'Dear Recipient,\n\nCongratulations! Your clearance request has been approved.\n\nYou may now proceed to the next step in your process.\n\nIf you have any questions, please don\'t hesitate to contact us.\n\nBest regards.', 1, '2026-03-10 14:28:14'),
(32, 449, 18, 16, 'request_documents', 'Clearance Request - Action Required', 'Dear Recipient,\n\nWe regret to inform you that your clearance request cannot be approved at this time due to the following reason(s):\n\n• [Specify reasons]\n\nPlease address these issues and resubmit your request.\n\nIf you need assistance, please contact our office.\n\nThank you.', 1, '2026-03-10 14:30:57'),
(33, 449, 18, 16, 'request_documents', 'Clearance Request Approved', 'Dear Recipient,\n\nCongratulations! Your clearance request has been approved.\n\nYou may now proceed to the next step in your process.\n\nIf you have any questions, please don\'t hesitate to contact us.\n\nBest regards.', 1, '2026-03-10 14:32:23'),
(34, 449, 16, 18, 'general', 'Inquiry about Supplies\' Office Clearance', 'test', 1, '2026-03-10 14:44:40'),
(35, 449, 18, 16, 'clarification', 'Clearance Request - Action Required', 'Dear Recipient,\n\nWe regret to inform you that your clearance request cannot be approved at this time due to the following reason(s):\n\n• [Specify reasons]\n\nPlease address these issues and resubmit your request.\n\nIf you need assistance, please contact our office.\n\nThank you.', 0, '2026-03-10 14:47:45');

-- --------------------------------------------------------

--
-- Table structure for table `notifications`
--

CREATE TABLE `notifications` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `message` text NOT NULL,
  `type` enum('info','success','warning','error') DEFAULT 'info',
  `is_read` tinyint(1) DEFAULT 0,
  `related_clearance_id` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `notifications`
--

INSERT INTO `notifications` (`id`, `user_id`, `title`, `message`, `type`, `is_read`, `related_clearance_id`, `created_at`) VALUES
(1, 6, 'Clearance Request Submitted', 'Your Graduation clearance request has been submitted successfully.', 'info', 1, NULL, '2026-01-24 06:31:38'),
(2, 9, 'Clearance Request Submitted', 'Your Graduation clearance request has been submitted successfully.', 'info', 0, NULL, '2026-01-24 09:21:44'),
(3, 6, 'Clearance Request Submitted', 'Your Graduation clearance request has been submitted successfully.', 'info', 1, NULL, '2026-01-24 09:22:35'),
(4, 6, 'Clearance Request Submitted', 'Your Transfer clearance request has been submitted successfully.', 'info', 1, NULL, '2026-01-24 09:25:18'),
(5, 6, 'Clearance Request Submitted', 'Your Graduation clearance request has been submitted successfully.', 'info', 1, NULL, '2026-01-24 13:10:24'),
(6, 6, 'Clearance Request Submitted', 'Your Transfer clearance request has been submitted successfully.', 'info', 1, NULL, '2026-01-24 16:03:28'),
(7, 6, 'Clearance Request Submitted', 'Your Graduation clearance request has been submitted successfully.', 'info', 1, NULL, '2026-01-24 16:18:10'),
(8, 6, 'Clearance Request Submitted', 'Your Graduation clearance request has been submitted successfully.', 'info', 1, NULL, '2026-01-24 16:22:49'),
(9, 6, 'Clearance Request Submitted', 'Your Graduation clearance request has been submitted successfully.', 'info', 1, NULL, '2026-01-25 06:51:18'),
(10, 6, 'Clearance Request Submitted', 'Your Transfer clearance request has been submitted successfully.', 'info', 1, NULL, '2026-01-25 06:58:06'),
(11, 6, 'Clearance Request Submitted', 'Your Transfer clearance request has been submitted successfully.', 'info', 1, NULL, '2026-01-25 06:58:52'),
(12, 6, 'Clearance Request Submitted', 'Your Transfer clearance request has been submitted successfully.', 'info', 1, NULL, '2026-01-25 07:04:49'),
(13, 6, 'Clearance Request Submitted', 'Your Graduation clearance request has been submitted successfully.', 'info', 1, NULL, '2026-01-25 07:09:44'),
(14, 6, 'Clearance Request Submitted', 'Your Transfer clearance request has been submitted successfully.', 'info', 1, NULL, '2026-01-25 07:11:34'),
(15, 6, 'Clearance Request Submitted', 'Your Transfer clearance request has been submitted successfully.', 'info', 1, NULL, '2026-01-25 07:32:46'),
(18, 6, 'Clearance Request Submitted', 'Your Graduation clearance request has been submitted to 8 office(s).', 'info', 1, NULL, '2026-01-25 08:26:11'),
(20, 6, 'Clearance Request Submitted', 'Your Transfer clearance request has been submitted to 8 office(s).', 'info', 1, NULL, '2026-01-25 08:28:53'),
(22, 6, 'Clearance Request Submitted', 'Your Graduation clearance request has been submitted to 8 office(s).', 'info', 1, NULL, '2026-01-25 08:32:47'),
(24, 6, 'Clearance Request Submitted', 'Your Graduation clearance request has been submitted to 8 office(s).', 'info', 1, NULL, '2026-01-25 08:42:10'),
(26, 6, 'Clearance Request Submitted', 'Your Transfer clearance request has been submitted to 8 office(s).', 'info', 1, NULL, '2026-01-25 08:42:53'),
(28, 6, 'Clearance Request Submitted', 'Your Other clearance request has been submitted to 8 office(s).', 'info', 1, NULL, '2026-01-25 08:44:24'),
(29, 6, 'Clearance Request Submitted', 'Your Graduation clearance request has been submitted to 8 office(s).', 'info', 1, NULL, '2026-01-25 13:46:27'),
(30, 6, 'Clearance Request Submitted', 'Your Graduation clearance request has been submitted to 8 office(s).', 'info', 1, NULL, '2026-01-26 02:17:28'),
(32, 6, 'Clearance Request Submitted', 'Your Graduation clearance request has been submitted to 8 office(s).', 'info', 1, NULL, '2026-01-26 03:12:45'),
(33, 6, 'Clearance Request Submitted', 'Your Graduation clearance request has been submitted to 8 office(s).', 'info', 1, NULL, '2026-01-26 03:34:07'),
(35, 6, 'Clearance Request Submitted', 'Your Graduation clearance request has been submitted to 8 office(s).', 'info', 1, NULL, '2026-01-26 03:36:31'),
(36, 6, 'Clearance Request Submitted', 'Your Honorable dismissal clearance request has been submitted to 8 office(s).', 'info', 1, NULL, '2026-01-26 09:24:58'),
(37, 6, 'Clearance Request Submitted', 'Your Graduation clearance request has been submitted to 8 office(s).', 'info', 1, NULL, '2026-01-26 09:42:21'),
(38, 6, 'Clearance Request Submitted', 'Your Honorable dismissal clearance request has been submitted to 8 office(s).', 'info', 1, NULL, '2026-01-26 09:54:33'),
(39, 6, 'Clearance Request Submitted', 'Your Transfer clearance request has been submitted to 8 office(s).', 'info', 1, NULL, '2026-01-26 09:56:32'),
(40, 6, 'Clearance Request Submitted', 'Your Graduation clearance request has been submitted to 8 office(s).', 'info', 1, NULL, '2026-01-26 10:04:42'),
(41, 6, 'Clearance Request Submitted', 'Your Transfer clearance request has been submitted to 8 office(s).', 'info', 1, NULL, '2026-01-26 10:33:33'),
(42, 6, 'Clearance Request Submitted', 'Your Honorable dismissal clearance request has been submitted to 8 office(s).', 'info', 1, NULL, '2026-01-26 11:18:51'),
(43, 6, 'Clearance Request Submitted', 'Your Transfer clearance request has been submitted to 8 office(s).', 'info', 1, NULL, '2026-01-26 11:25:37'),
(44, 6, 'Clearance Request Submitted', 'Your Graduation clearance request has been submitted to 8 office(s).', 'info', 1, NULL, '2026-01-26 11:28:50'),
(46, 6, 'Clearance Request Submitted', 'Your Transfer clearance request has been submitted to 8 office(s).', 'info', 1, NULL, '2026-01-26 11:50:03'),
(48, 6, 'Clearance Request Submitted', 'Your Graduation clearance request has been submitted to 8 office(s).', 'info', 1, NULL, '2026-01-26 11:55:09'),
(49, 6, 'Clearance Request Submitted', 'Your Transfer clearance request has been submitted to 8 office(s).', 'info', 1, NULL, '2026-01-26 12:07:33'),
(50, 6, 'Clearance Request Submitted', 'Your Graduation clearance request has been submitted to 8 office(s).', 'info', 1, NULL, '2026-01-26 12:07:54'),
(52, 6, 'Clearance Request Submitted', 'Your Transfer clearance request has been submitted to 8 office(s).', 'info', 1, NULL, '2026-01-26 15:36:31'),
(53, 6, 'Clearance Request Submitted', 'Your Graduation clearance request has been submitted to 8 office(s).', 'info', 1, NULL, '2026-01-27 07:01:48'),
(55, 6, 'Clearance Request Submitted', 'Your Transfer clearance request has been submitted to 8 office(s).', 'info', 1, NULL, '2026-01-28 00:12:36'),
(57, 6, 'Clearance Request Submitted', 'Your Graduation clearance request has been submitted to 8 office(s).', 'info', 1, NULL, '2026-01-28 00:40:39'),
(58, 6, 'Clearance Request Submitted', 'Your Graduation clearance request has been submitted to 6 office(s).', 'info', 1, NULL, '2026-01-31 03:38:32'),
(78, 13, 'Document Upload with Message', 'John Andrei Langit(ECOAST) uploaded 1 document(s) with a message: \"dadad\"', '', 1, NULL, '2026-02-17 17:46:13'),
(81, 13, 'Document Upload with Message', 'John Andrei Langit(ECOAST) uploaded 1 document(s) with a message: \"ewqewqe\"', '', 1, NULL, '2026-02-18 11:38:56'),
(104, 16, 'Clearance Rejected', 'Your Graduation Clearance clearance has been rejected by Clinic', 'warning', 1, 79, '2026-03-03 16:02:26'),
(105, 16, 'Clearance Rejected', 'Your Graduation Clearance clearance has been rejected by 1 office(s). Please review the remarks and resubmit.', 'warning', 1, 79, '2026-03-03 16:02:26'),
(106, 12, 'Clearance Rejected', 'Your Employee Clearance Test clearance has been rejected by Clinic', 'warning', 0, 78, '2026-03-07 13:36:50'),
(107, 12, 'Clearance Rejected', 'Your Employee Clearance Test clearance has been rejected by 1 office(s). Please review the remarks and resubmit.', 'warning', 0, 78, '2026-03-07 13:36:50');

-- --------------------------------------------------------

--
-- Table structure for table `offices`
--

CREATE TABLE `offices` (
  `id` int(11) NOT NULL,
  `office_name` varchar(100) NOT NULL,
  `office_code` varchar(20) NOT NULL,
  `processing_order` int(11) UNSIGNED NOT NULL DEFAULT 0,
  `description` text DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `offices`
--

INSERT INTO `offices` (`id`, `office_name`, `office_code`, `processing_order`, `description`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 'Registrar Office', 'REG', 8, 'Handles academic records and enrollment', 1, '2026-01-24 05:47:23', '2026-03-08 07:44:36'),
(2, 'Finance Office', 'FIN', 4, 'Manages financial clearances and payments', 1, '2026-01-24 05:47:23', '2026-03-08 07:44:36'),
(3, 'Library', 'LIB', 7, 'Manages library resources and book returns', 0, '2026-01-24 05:47:23', '2026-03-08 07:44:36'),
(4, 'Student Affairs', 'SA', 9, 'Handles student activities and organizations', 0, '2026-01-24 05:47:23', '2026-03-08 07:44:36'),
(5, 'Kins', 'KIN', 6, 'Manages IT equipment and access', 1, '2026-01-24 05:47:23', '2026-03-08 07:44:36'),
(6, 'Guidance Office', 'GUID', 5, 'Provides counseling and guidance services', 1, '2026-01-24 05:47:23', '2026-03-08 07:44:36'),
(7, 'Clinic', 'CLINIC', 3, 'Handles health records and medical clearances', 1, '2026-01-24 05:47:23', '2026-03-08 07:44:36'),
(8, 'Accounting Office', 'ACC', 1, 'Manages financial accounting', 1, '2026-01-24 05:47:23', '2026-01-30 15:18:39'),
(9, 'Center Of Student Success', 'CEN', 2, 'Manages library resources and book returns', 1, '2026-01-30 01:04:07', '2026-01-30 15:19:00'),
(12, 'Supplies\' Office', 'SUPPLY', 10, 'Supply', 1, '2026-03-09 06:14:42', '2026-03-09 06:14:42');

-- --------------------------------------------------------

--
-- Table structure for table `password_resets`
--

CREATE TABLE `password_resets` (
  `id` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `token` varchar(64) NOT NULL,
  `expires_at` datetime NOT NULL,
  `used` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `password_resets`
--

INSERT INTO `password_resets` (`id`, `email`, `token`, `expires_at`, `used`) VALUES
(2, 'johnandrei.langit.ecoast@panpacificu.edu.ph', '19026c8fd0cc1a2d6e9f8b4696575915d316734c3c887a61cb61302facae20b3', '2026-03-09 19:18:05', 1);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `google_id` varchar(255) DEFAULT NULL,
  `profile_picture` varchar(500) DEFAULT NULL,
  `first_name` varchar(100) NOT NULL,
  `last_name` varchar(100) NOT NULL,
  `role` enum('student','employee','office_staff','administrator') NOT NULL,
  `office_id` int(11) DEFAULT NULL,
  `student_id` varchar(50) DEFAULT NULL,
  `employee_id` varchar(50) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `reset_token` varchar(255) DEFAULT NULL,
  `reset_token_expiry` datetime DEFAULT NULL,
  `last_login` datetime DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `program` varchar(255) DEFAULT NULL,
  `year_level` varchar(50) DEFAULT NULL,
  `department` varchar(255) DEFAULT NULL,
  `contact_number` varchar(20) DEFAULT NULL,
  `email_notifications` tinyint(1) DEFAULT 1 COMMENT 'Master switch for all email notifications',
  `notify_submission` tinyint(1) DEFAULT 1 COMMENT 'Notify when clearance is submitted',
  `notify_status_change` tinyint(1) DEFAULT 1 COMMENT 'Notify when clearance status changes',
  `notify_messages` tinyint(1) DEFAULT 1 COMMENT 'Notify about new messages',
  `notify_completion` tinyint(1) DEFAULT 1 COMMENT 'Notify when clearance is completed',
  `notify_reminders` tinyint(1) DEFAULT 1 COMMENT 'Send reminder emails for pending actions',
  `position` varchar(100) DEFAULT NULL,
  `start_date` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `email`, `password`, `google_id`, `profile_picture`, `first_name`, `last_name`, `role`, `office_id`, `student_id`, `employee_id`, `is_active`, `reset_token`, `reset_token_expiry`, `last_login`, `created_at`, `updated_at`, `program`, `year_level`, `department`, `contact_number`, `email_notifications`, `notify_submission`, `notify_status_change`, `notify_messages`, `notify_completion`, `notify_reminders`, `position`, `start_date`) VALUES
(6, 'testaccount@panpacificu.edu.ph', '$2y$10$dPbKyLLaCDEydvgE7XEsaeMKt5/xkkWMwsQTq1o6esl7QY/S/bh0O', NULL, NULL, 'test', 'account', 'student', NULL, '1231499', NULL, 1, NULL, NULL, '2026-03-03 17:44:24', '2026-01-24 06:04:55', '2026-03-03 09:44:24', 'Information Technology', '3rd Year', 'E-coast', '09623866889', 1, 1, 1, 1, 1, 1, NULL, NULL),
(8, 'admin@panpacificu.edu.ph', '$2y$10$WuQw2SJBcj6HEZl15tQjSe7uSkToW2qEn0/FSds1fzWx1ck6bNpIW', NULL, NULL, 'System', 'Administrator', 'administrator', NULL, NULL, NULL, 1, NULL, NULL, '2026-03-11 20:02:24', '2026-01-24 07:47:21', '2026-03-11 12:02:24', NULL, NULL, NULL, NULL, 1, 1, 1, 1, 1, 1, NULL, NULL),
(9, 'testaccount2@panpacificu.edu.ph', '$2y$10$imTJ5IyJBzTaHQSv7yu5dOEoZbbTDBFyKPCUtDV.Ji.5B1UutVra2', NULL, NULL, 'Test', 'Account2', 'employee', NULL, NULL, '12345', 1, NULL, NULL, '2026-01-24 17:21:31', '2026-01-24 09:21:19', '2026-03-07 14:00:06', NULL, NULL, NULL, NULL, 1, 1, 1, 1, 1, 1, NULL, NULL),
(10, 'staff@panpacificu.edu.ph', '$2y$10$Oh91t5DZiOJy4UZhUkT5v.qMyxtvY59H78Fy4OjMUzshlwVM4gmpu', NULL, NULL, 'test', 'staff', 'office_staff', 1, NULL, NULL, 1, NULL, NULL, '2026-02-17 12:52:01', '2026-01-25 08:05:10', '2026-02-17 04:52:01', NULL, NULL, NULL, NULL, 1, 1, 1, 1, 1, 1, NULL, NULL),
(11, 'csstest@panpacificu.edu.ph', '$2y$10$CnyNPFlYWsMXDtIlQGE7R.J4hrj3YnomGYyeOf4aE9nF7s3rIpyui', NULL, NULL, 'CSS', 'Test', 'office_staff', NULL, NULL, 'EMPOO2', 1, NULL, NULL, '2026-01-30 23:20:54', '2026-01-30 15:20:42', '2026-01-30 15:20:54', NULL, NULL, NULL, NULL, 1, 1, 1, 1, 1, 1, NULL, NULL),
(12, 'testaccount3@panpacificu.edu.ph', '$2y$10$xsSpPZevYWUpPuXk52gXW.ytCip3.vSs032PmNDZq.hfqME9Lth0.', NULL, NULL, 'test', 'account3', 'employee', NULL, NULL, 'EMP-2024-001', 1, NULL, NULL, '2026-03-10 01:01:05', '2026-02-03 17:02:04', '2026-03-09 17:11:37', NULL, NULL, 'E-coast', '09123456789', 1, 1, 1, 1, 1, 1, 'Teacher', '2024-01-15'),
(13, 'clinicstaff@panpacificu.edu.ph', '$2y$10$mfYvT7mhXq7A.ZCPmt05G.cKB0N3DgoAOjBSXbEskbZ7XXv2tKVki', NULL, NULL, 'clinic', 'staff', 'office_staff', 7, NULL, 'EMPOO3', 1, NULL, NULL, '2026-03-10 22:26:29', '2026-02-05 02:10:53', '2026-03-10 14:26:29', NULL, NULL, NULL, NULL, 1, 1, 1, 1, 1, 1, NULL, NULL),
(14, 'finance0ffice@panpacificu.edu.ph', '$2y$10$b3fNgfInAh6iAuat09MTkeDL52ToEjSUmNRu1Vn6Notrok8X3ETUK', NULL, NULL, 'finance', 'staff', 'office_staff', 2, NULL, 'EMPOO4', 1, NULL, NULL, '2026-02-05 10:15:55', '2026-02-05 02:15:45', '2026-02-05 02:22:49', NULL, NULL, NULL, NULL, 1, 1, 1, 1, 1, 1, NULL, NULL),
(15, 'guidancestaff@panpacificu.edu.ph', '$2y$10$GHgKTb9Hidn/CKs4d2Ux3eiFPmIiqvW0fWOw9pduBE2k9ULwb4XZy', NULL, NULL, 'guidance', 'staff', 'office_staff', 6, NULL, 'EMPOO5', 1, NULL, NULL, '2026-02-15 16:52:39', '2026-02-05 05:50:08', '2026-02-15 08:52:39', NULL, NULL, NULL, NULL, 1, 1, 1, 1, 1, 1, NULL, NULL),
(16, 'johnandrei.langit.ecoast@panpacificu.edu.ph', '$2y$10$n63Aksbqnxh2p8urwGsbmubBmmcAo24koXWlOpKPGAwUZpK5iuugW', '113513031004857027259', 'https://lh3.googleusercontent.com/a/ACg8ocKNaQ-txO5OFRs7udGTJ8eYN_RJIk0iv-TLMeLMiZ5HXTN9CA=s96-c', 'John Andrei', 'Langit(ECOAST)', 'student', NULL, '1231450', NULL, 1, NULL, NULL, '2026-03-10 23:20:33', '2026-02-12 12:14:07', '2026-03-10 15:20:33', 'Information Technology', '3rd Year', 'E-coast', '', 1, 1, 1, 1, 1, 1, NULL, NULL),
(17, 'onyxlloyd.alunday.ecoast@panpacificu.edu.ph', '$2y$10$FzzZSI0N6EHummzhpL3ebOLs68IbADLuJibaDKPfWw/NreEmqhX2C', '117694827993048376328', 'https://lh3.googleusercontent.com/a/ACg8ocLU9lcNbhbE120ycJ_gJKfyz_2RhE4aKie1c0aafkoKcSy0bms=s96-c', 'Onyx Lloyd', 'Alunday (ECOAST)', 'student', NULL, '1231008', NULL, 1, NULL, NULL, '2026-03-09 14:36:24', '2026-03-09 06:07:16', '2026-03-09 06:36:24', 'Information Technology', '3rd Year', 'E-coast', '09623866889', 1, 1, 1, 1, 1, 1, NULL, NULL),
(18, 'supply@panpacificu.edu.ph', '$2y$10$ItQWlr12y00GJ9rzLd76u./Aa4LfeGJhOBSRYLBy1BTATu6zP12vG', NULL, NULL, 'supply', 'Test', 'office_staff', 12, NULL, 'EMPOO6', 1, NULL, NULL, '2026-03-10 22:47:32', '2026-03-10 04:56:54', '2026-03-10 14:47:32', NULL, NULL, NULL, NULL, 1, 1, 1, 1, 1, 1, NULL, NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `activity_logs`
--
ALTER TABLE `activity_logs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_user_id` (`user_id`),
  ADD KEY `idx_created_at` (`created_at`);

--
-- Indexes for table `clearance_items`
--
ALTER TABLE `clearance_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `processed_by` (`processed_by`),
  ADD KEY `idx_clearance_request` (`clearance_request_id`),
  ADD KEY `idx_office` (`office_id`),
  ADD KEY `idx_status` (`status`);

--
-- Indexes for table `clearance_requests`
--
ALTER TABLE `clearance_requests`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_user_id` (`user_id`),
  ADD KEY `idx_status` (`status`),
  ADD KEY `idx_user_role` (`user_role`),
  ADD KEY `idx_user_id_role` (`user_id`,`user_role`),
  ADD KEY `clearance_requests_ibfk_template` (`template_id`);

--
-- Indexes for table `clearance_status_logs`
--
ALTER TABLE `clearance_status_logs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_clearance_item` (`clearance_item_id`),
  ADD KEY `idx_clearance_request` (`clearance_request_id`),
  ADD KEY `idx_changed_by` (`changed_by_user_id`),
  ADD KEY `idx_created_at` (`created_at`);

--
-- Indexes for table `clearance_templates`
--
ALTER TABLE `clearance_templates`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `template_name` (`template_name`),
  ADD UNIQUE KEY `template_code` (`template_code`);

--
-- Indexes for table `clearance_template_fields`
--
ALTER TABLE `clearance_template_fields`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_template` (`template_id`);

--
-- Indexes for table `clearance_template_offices`
--
ALTER TABLE `clearance_template_offices`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_template_office` (`template_id`,`office_id`),
  ADD KEY `idx_template` (`template_id`),
  ADD KEY `idx_office` (`office_id`);

--
-- Indexes for table `documents`
--
ALTER TABLE `documents`
  ADD PRIMARY KEY (`id`),
  ADD KEY `uploaded_by` (`uploaded_by`),
  ADD KEY `idx_clearance_item` (`clearance_item_id`);

--
-- Indexes for table `email_logs`
--
ALTER TABLE `email_logs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_recipient` (`recipient`),
  ADD KEY `idx_status` (`status`),
  ADD KEY `idx_sent_at` (`sent_at`),
  ADD KEY `idx_recipient_status` (`recipient`,`status`);

--
-- Indexes for table `messages`
--
ALTER TABLE `messages`
  ADD PRIMARY KEY (`id`),
  ADD KEY `clearance_item_id` (`clearance_item_id`),
  ADD KEY `sender_id` (`sender_id`),
  ADD KEY `recipient_id` (`recipient_id`),
  ADD KEY `idx_message_type` (`message_type`),
  ADD KEY `idx_is_read` (`is_read`);

--
-- Indexes for table `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `related_clearance_id` (`related_clearance_id`),
  ADD KEY `idx_user_id` (`user_id`),
  ADD KEY `idx_is_read` (`is_read`);

--
-- Indexes for table `offices`
--
ALTER TABLE `offices`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `office_code` (`office_code`);

--
-- Indexes for table `password_resets`
--
ALTER TABLE `password_resets`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `token` (`token`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `google_id` (`google_id`),
  ADD KEY `idx_email` (`email`),
  ADD KEY `idx_role` (`role`),
  ADD KEY `idx_student_id` (`student_id`),
  ADD KEY `idx_employee_id` (`employee_id`),
  ADD KEY `office_id` (`office_id`);
--
-- Database: `coinsngoals`
--
CREATE DATABASE IF NOT EXISTS `coinsngoals` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `coinsngoals`;

-- --------------------------------------------------------

--
-- Table structure for table `goals`
--

CREATE TABLE `goals` (
  `id` int(10) UNSIGNED NOT NULL,
  `user_id` int(10) UNSIGNED NOT NULL,
  `goal_name` varchar(100) DEFAULT NULL,
  `target_amount` decimal(10,2) DEFAULT NULL,
  `target_date` date DEFAULT NULL,
  `frequency` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `goals`
--

INSERT INTO `goals` (`id`, `user_id`, `goal_name`, `target_amount`, `target_date`, `frequency`) VALUES
(6, 3, 'Summer', 10000.00, '2026-04-21', 'weekly'),
(7, 3, 'New Year', 3000.00, '2025-12-31', 'daily'),
(8, 3, 'Christmas', 3000.00, '2025-12-24', 'daily'),
(10, 2, 'Allowance', 1000.00, '2025-11-26', 'daily'),
(33, 1, 'Allowance', 66.00, '2025-11-20', 'daily'),
(34, 1, 'Vacation', 70.00, '2025-11-18', 'daily'),
(35, 1, 'cp', 2222.00, '2025-11-18', 'daily'),
(36, 1, 'Vacation', 80.00, '2025-11-24', 'daily');

-- --------------------------------------------------------

--
-- Table structure for table `goal_marks`
--

CREATE TABLE `goal_marks` (
  `id` int(11) NOT NULL,
  `goal_id` int(10) UNSIGNED NOT NULL,
  `marked_date` date NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `goal_marks`
--

INSERT INTO `goal_marks` (`id`, `goal_id`, `marked_date`, `created_at`) VALUES
(1406, 10, '2025-11-16', '2025-11-15 15:29:22'),
(1407, 10, '2025-11-17', '2025-11-15 15:29:23'),
(1408, 10, '2025-11-18', '2025-11-15 15:29:24'),
(2039, 36, '2025-11-18', '2025-11-17 05:25:29');

-- --------------------------------------------------------

--
-- Table structure for table `goal_savings`
--

CREATE TABLE `goal_savings` (
  `id` int(10) UNSIGNED NOT NULL,
  `user_id` int(10) UNSIGNED NOT NULL,
  `goal_name` varchar(255) NOT NULL,
  `target_amount` decimal(10,2) NOT NULL,
  `current_amount` decimal(10,2) NOT NULL DEFAULT 0.00,
  `deadline` date NOT NULL,
  `daily_required` decimal(10,2) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(10) UNSIGNED NOT NULL,
  `username` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `email`, `password`) VALUES
(1, 'onyx', 'onyxalunday@gmail.com', '$2y$10$UfEhrguxgy3qI2XZEFgIyei0P4FBd3ly7n7wnOX2rWT6y00QxPFqu'),
(2, 'chari', 'charimeaselga@gmail.com', '$2y$10$NmjAIzZligWSIbJcpKrQEeQvTRR9kpKcVDxz6eqQI9PgFFMDf07MG'),
(3, 'rona', 'ronalynbarsicula@gmail.com', '$2y$10$Kb02nSb3bxaJ5lJDRbWnbecY07cjbJ1.DsrrL8WxOdqd5cG2njL4W'),
(4, 'Joan', 'joancabreros@gmail.com', '$2y$10$SIMwleIPmvytvkI/XPjslOwtT0PSQcfICl7jQrh6IGKZ/.ITHv3sC'),
(6, 'mayen', 'mayensalvarion@gmail.com', '$2y$10$hnlfLDIIM.sRsDSXGPYmhuXUvu8NoNEw1.5gnbZYVVZ07Ar0FLIM.'),
(7, 'Steven', 'stevenagustin@gmail.com', '$2y$10$wPTnYJ/bKtCjUEOUcVVma.gnCGtrAJZCTsDHN0vTeHfAvbssQ8d.m');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `goals`
--
ALTER TABLE `goals`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `goal_marks`
--
ALTER TABLE `goal_marks`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `goal_id` (`goal_id`,`marked_date`);

--
-- Indexes for table `goal_savings`
--
ALTER TABLE `goal_savings`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email_unique` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `goals`
--
ALTER TABLE `goals`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=37;

--
-- AUTO_INCREMENT for table `goal_marks`
--
ALTER TABLE `goal_marks`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2040;

--
-- AUTO_INCREMENT for table `goal_savings`
--
ALTER TABLE `goal_savings`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `goals`
--
ALTER TABLE `goals`
  ADD CONSTRAINT `goals_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `goal_marks`
--
ALTER TABLE `goal_marks`
  ADD CONSTRAINT `goal_marks_ibfk_1` FOREIGN KEY (`goal_id`) REFERENCES `goals` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `goal_savings`
--
ALTER TABLE `goal_savings`
  ADD CONSTRAINT `fk_user_goal` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
--
-- Database: `counseling_system`
--
CREATE DATABASE IF NOT EXISTS `counseling_system` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `counseling_system`;

-- --------------------------------------------------------

--
-- Table structure for table `activity_logs`
--

CREATE TABLE `activity_logs` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `action` varchar(100) NOT NULL COMMENT 'Action performed (e.g., login, logout, book_appointment)',
  `details` text DEFAULT NULL COMMENT 'Additional details about the action',
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `created_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='User activity audit trail';

-- --------------------------------------------------------

--
-- Table structure for table `anonymous_queries`
--

CREATE TABLE `anonymous_queries` (
  `id` int(11) NOT NULL,
  `subject` varchar(100) NOT NULL DEFAULT 'General Concern',
  `message_content` text NOT NULL,
  `date_submitted` timestamp NOT NULL DEFAULT current_timestamp(),
  `is_read` tinyint(1) DEFAULT 0 COMMENT 'Track if admin has read the query'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `anonymous_queries`
--

INSERT INTO `anonymous_queries` (`id`, `subject`, `message_content`, `date_submitted`, `is_read`) VALUES
(2, 'General Concern', 'How can I deal with anxiety before exams? I get very nervous and it affects my performance.', '2026-01-07 15:09:33', 0),
(6, 'academic stress', 'testing all the functions.', '2026-02-13 11:15:15', 1);

-- --------------------------------------------------------

--
-- Table structure for table `appointments`
--

CREATE TABLE `appointments` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `appointment_date` date NOT NULL,
  `appointment_time` time NOT NULL,
  `status` enum('pending','confirmed','cancelled','completed') NOT NULL DEFAULT 'pending',
  `concern` text NOT NULL COMMENT 'Reason for the appointment',
  `admin_remarks` text DEFAULT NULL COMMENT 'Feedback or notes from counselor/admin',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `reminder_sent` tinyint(1) DEFAULT 0 COMMENT 'Whether reminder email was sent',
  `reminder_sent_at` datetime DEFAULT NULL COMMENT 'When reminder was sent',
  `confirmation_status` enum('pending','confirmed','expired') DEFAULT 'pending' COMMENT 'Whether student confirmed attendance',
  `confirmation_token` varchar(64) DEFAULT NULL COMMENT 'Unique token for confirmation link',
  `confirmation_sent_at` datetime DEFAULT NULL COMMENT 'When confirmation request was sent',
  `confirmed_at` datetime DEFAULT NULL COMMENT 'When student confirmed',
  `confirmation_expires_at` datetime DEFAULT NULL COMMENT 'Confirmation deadline',
  `has_case_note` tinyint(1) DEFAULT 0 COMMENT 'Whether case note exists for this appointment',
  `feedback_submitted` tinyint(1) DEFAULT 0,
  `google_event_id` varchar(255) DEFAULT NULL COMMENT 'Google Calendar event ID'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `appointments`
--

INSERT INTO `appointments` (`id`, `user_id`, `appointment_date`, `appointment_time`, `status`, `concern`, `admin_remarks`, `created_at`, `updated_at`, `reminder_sent`, `reminder_sent_at`, `confirmation_status`, `confirmation_token`, `confirmation_sent_at`, `confirmed_at`, `confirmation_expires_at`, `has_case_note`, `feedback_submitted`, `google_event_id`) VALUES
(1, 2, '2026-01-15', '10:00:00', 'cancelled', 'I need guidance on my academic performance and study habits.', NULL, '2026-01-07 15:09:33', '2026-02-13 15:36:36', 0, NULL, 'pending', NULL, NULL, NULL, NULL, 0, 0, NULL),
(2, 3, '2026-01-19', '08:42:00', 'completed', 'gsgdgzgf', NULL, '2026-01-07 15:26:13', '2026-01-07 15:30:43', 0, NULL, 'pending', NULL, NULL, NULL, NULL, 0, 0, NULL),
(3, 7, '2026-01-16', '09:13:00', 'cancelled', 'boss pa resched', 'madik', '2026-01-07 16:13:09', '2026-01-08 13:15:04', 0, NULL, 'pending', NULL, NULL, NULL, NULL, 0, 0, NULL),
(4, 7, '2026-01-10', '10:00:00', 'completed', 'dfhrsdhsgsdgsgsdg sdfgsdgsdgg', NULL, '2026-01-08 12:53:26', '2026-02-13 15:36:12', 0, NULL, 'pending', NULL, NULL, NULL, NULL, 0, 0, NULL),
(5, 7, '2026-01-10', '09:21:00', 'completed', 'thdyydh  sgfs gsgsgsd gsg waawfssgsgsgs', 'ndfhdfh dshrsgsegdxbdgsgdfzgzfwtwesrswr  t s sgfsg sd gsg sg sgsgsgsg', '2026-01-08 13:18:44', '2026-01-08 13:20:53', 0, NULL, 'pending', NULL, NULL, NULL, NULL, 0, 0, NULL),
(6, 7, '2026-01-12', '14:30:00', 'completed', 'stresss sssssssssssss', NULL, '2026-01-08 13:25:34', '2026-02-13 14:25:50', 0, NULL, 'pending', NULL, NULL, NULL, NULL, 0, 1, NULL),
(7, 7, '2026-01-12', '10:00:00', 'completed', 'gfdfsfgsdgsdg', 'accepted just wait', '2026-01-08 13:46:21', '2026-02-14 14:49:30', 0, NULL, 'pending', NULL, NULL, NULL, NULL, 0, 0, NULL),
(8, 7, '2026-02-17', '13:00:00', 'cancelled', 'gsfasdfasf', NULL, '2026-02-09 11:15:11', '2026-02-13 11:19:12', 0, NULL, 'pending', NULL, NULL, NULL, NULL, 0, 0, NULL),
(9, 7, '2026-04-09', '09:01:00', 'cancelled', 'ggs gsgsgsg', NULL, '2026-02-09 12:38:01', '2026-02-13 11:19:29', 0, NULL, 'pending', NULL, NULL, NULL, NULL, 0, 0, NULL),
(10, 7, '2026-02-12', '10:00:00', 'cancelled', 'test tst aad', 'try to book another time', '2026-02-09 12:47:04', '2026-02-13 11:18:38', 0, NULL, 'pending', NULL, NULL, NULL, NULL, 0, 0, NULL),
(11, 7, '2026-02-19', '13:30:00', 'cancelled', 'afageg agaega', NULL, '2026-02-13 10:47:10', '2026-02-13 11:19:17', 0, NULL, 'pending', NULL, NULL, NULL, NULL, 0, 0, NULL),
(12, 7, '2026-02-25', '10:00:00', 'cancelled', 'testing all the function', NULL, '2026-02-13 11:14:01', '2026-02-13 11:19:24', 0, NULL, 'pending', NULL, NULL, NULL, NULL, 0, 0, NULL),
(13, 7, '2026-02-17', '09:00:00', 'completed', 'test test test test', NULL, '2026-02-13 13:24:58', '2026-02-13 15:33:05', 0, NULL, 'pending', NULL, NULL, NULL, NULL, 1, 1, 'o89mt22gm270raiban7bkb4rtk'),
(14, 7, '2026-02-16', '08:30:00', 'confirmed', 'i&#039;m stress', NULL, '2026-02-14 14:45:40', '2026-02-14 14:48:27', 0, NULL, 'pending', NULL, NULL, NULL, NULL, 0, 0, '7mudspg7b55aq921n64uj113q0'),
(15, 7, '2026-03-17', '09:00:00', 'cancelled', 'testtesttest', NULL, '2026-03-15 14:20:24', '2026-03-15 14:36:34', 0, NULL, 'pending', NULL, NULL, NULL, NULL, 0, 0, NULL),
(16, 7, '2026-03-18', '09:00:00', 'cancelled', 'testetetsafaetae', NULL, '2026-03-15 14:33:14', '2026-03-15 14:36:38', 0, NULL, 'pending', NULL, NULL, NULL, NULL, 0, 0, NULL),
(17, 7, '2026-03-20', '10:00:00', 'confirmed', 'ffjhgkgk ukh;', NULL, '2026-03-15 14:38:47', '2026-03-15 14:39:36', 0, NULL, 'pending', NULL, NULL, NULL, NULL, 0, 0, 'br2ikn3l8hfff37ejq1qq1m48c'),
(18, 9, '2026-04-07', '09:00:00', 'pending', 'Sample sample', 'madi paylang boy', '2026-03-15 15:31:01', '2026-03-15 15:40:10', 0, NULL, 'pending', NULL, NULL, NULL, NULL, 0, 0, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `appointment_feedback`
--

CREATE TABLE `appointment_feedback` (
  `id` int(11) NOT NULL,
  `appointment_id` int(11) NOT NULL,
  `student_id` int(11) NOT NULL,
  `overall_rating` int(11) NOT NULL CHECK (`overall_rating` between 1 and 5),
  `counselor_professionalism` int(11) DEFAULT NULL CHECK (`counselor_professionalism` between 1 and 5),
  `helpfulness` int(11) DEFAULT NULL CHECK (`helpfulness` between 1 and 5),
  `environment_comfort` int(11) DEFAULT NULL CHECK (`environment_comfort` between 1 and 5),
  `what_went_well` text DEFAULT NULL,
  `what_could_improve` text DEFAULT NULL,
  `additional_comments` text DEFAULT NULL,
  `would_recommend` tinyint(1) DEFAULT 1,
  `would_return` tinyint(1) DEFAULT 1,
  `is_anonymous` tinyint(1) DEFAULT 0,
  `submitted_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `ip_address` varchar(45) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `appointment_feedback`
--

INSERT INTO `appointment_feedback` (`id`, `appointment_id`, `student_id`, `overall_rating`, `counselor_professionalism`, `helpfulness`, `environment_comfort`, `what_went_well`, `what_could_improve`, `additional_comments`, `would_recommend`, `would_return`, `is_anonymous`, `submitted_at`, `ip_address`) VALUES
(1, 13, 7, 4, 4, 5, 2, 'test', 'test', 'test', 1, 1, 0, '2026-02-13 14:25:22', '::1'),
(2, 6, 7, 1, 1, 1, 1, 'tee', 'teess', 'tsssst', 1, 1, 1, '2026-02-13 14:25:50', '::1');

-- --------------------------------------------------------

--
-- Table structure for table `appointment_waitlist`
--

CREATE TABLE `appointment_waitlist` (
  `id` int(11) NOT NULL,
  `student_id` int(11) NOT NULL,
  `preferred_date` date NOT NULL,
  `preferred_time_start` time NOT NULL,
  `preferred_time_end` time NOT NULL,
  `concern` text NOT NULL,
  `priority` int(11) DEFAULT 0 COMMENT 'Lower number = higher priority',
  `status` enum('active','notified','expired','converted') DEFAULT 'active',
  `notification_sent` tinyint(1) DEFAULT 0,
  `notified_at` datetime DEFAULT NULL,
  `expires_at` datetime NOT NULL COMMENT 'Waitlist entry expires after',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `appointment_waitlist`
--

INSERT INTO `appointment_waitlist` (`id`, `student_id`, `preferred_date`, `preferred_time_start`, `preferred_time_end`, `concern`, `priority`, `status`, `notification_sent`, `notified_at`, `expires_at`, `created_at`, `updated_at`) VALUES
(1, 7, '2026-02-15', '07:06:00', '17:00:00', 'just testing', 1, 'active', 0, NULL, '2026-02-22 00:00:00', '2026-02-13 14:12:31', '2026-02-13 14:12:31');

-- --------------------------------------------------------

--
-- Table structure for table `blocked_dates`
--

CREATE TABLE `blocked_dates` (
  `id` int(11) NOT NULL,
  `date` date NOT NULL,
  `reason` varchar(255) DEFAULT NULL,
  `is_holiday` tinyint(1) DEFAULT 0,
  `created_by` int(11) DEFAULT NULL COMMENT 'Admin user who created the block',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Blocked dates (holidays, special events)';

--
-- Dumping data for table `blocked_dates`
--

INSERT INTO `blocked_dates` (`id`, `date`, `reason`, `is_holiday`, `created_by`, `created_at`) VALUES
(1, '2026-01-01', 'New Year\'s Day', 1, NULL, '2026-01-08 13:38:25'),
(2, '2026-04-09', 'Araw ng Kagitingan (Day of Valor)', 1, NULL, '2026-01-08 13:38:25'),
(3, '2026-04-10', 'Maundy Thursday', 1, NULL, '2026-01-08 13:38:25'),
(4, '2026-04-11', 'Good Friday', 1, NULL, '2026-01-08 13:38:25'),
(5, '2026-05-01', 'Labor Day', 1, NULL, '2026-01-08 13:38:25'),
(6, '2026-06-12', 'Independence Day', 1, NULL, '2026-01-08 13:38:25'),
(7, '2026-08-31', 'National Heroes Day', 1, NULL, '2026-01-08 13:38:25'),
(8, '2026-11-30', 'Bonifacio Day', 1, NULL, '2026-01-08 13:38:25'),
(9, '2026-12-25', 'Christmas Day', 1, NULL, '2026-01-08 13:38:25'),
(10, '2026-12-30', 'Rizal Day', 1, NULL, '2026-01-08 13:38:25'),
(21, '2026-02-09', 'Chinese New Year', 1, NULL, '2026-02-09 10:55:26'),
(22, '2026-02-25', 'EDSA Revolution Anniversary', 1, NULL, '2026-02-09 10:55:26'),
(23, '2026-04-12', 'Black Saturday', 1, NULL, '2026-02-09 10:55:26'),
(24, '2026-11-01', 'All Saints Day', 1, NULL, '2026-02-09 10:55:26'),
(25, '2026-12-24', 'Christmas Eve', 1, NULL, '2026-02-09 10:55:26'),
(26, '2026-12-31', 'New Year\'s Eve', 1, NULL, '2026-02-09 10:55:26'),
(27, '2026-02-15', 'absent', 0, 1, '2026-02-13 15:21:09');

-- --------------------------------------------------------

--
-- Table structure for table `case_notes`
--

CREATE TABLE `case_notes` (
  `id` int(11) NOT NULL,
  `student_id` int(11) NOT NULL,
  `appointment_id` int(11) DEFAULT NULL,
  `counselor_id` int(11) NOT NULL,
  `session_date` date NOT NULL,
  `session_type` enum('initial','follow-up','crisis','termination','other') DEFAULT 'follow-up',
  `duration_minutes` int(11) DEFAULT 60,
  `presenting_concern` text NOT NULL COMMENT 'Main reason for session',
  `session_summary` text NOT NULL COMMENT 'Summary of session discussion',
  `interventions_used` text DEFAULT NULL COMMENT 'Therapeutic interventions applied',
  `student_response` text DEFAULT NULL COMMENT 'Student response to interventions',
  `progress_notes` text DEFAULT NULL COMMENT 'Progress toward goals',
  `risk_assessment` enum('none','low','moderate','high','crisis') DEFAULT 'none',
  `risk_details` text DEFAULT NULL COMMENT 'Details of any risk factors',
  `mood_affect` varchar(255) DEFAULT NULL COMMENT 'Observed mood and affect',
  `treatment_plan` text DEFAULT NULL COMMENT 'Treatment plan or goals',
  `homework_assignments` text DEFAULT NULL COMMENT 'Assignments or activities',
  `follow_up_recommendations` text DEFAULT NULL COMMENT 'Recommendations for next session',
  `next_session_date` date DEFAULT NULL,
  `referrals` text DEFAULT NULL COMMENT 'External referrals if any',
  `is_confidential` tinyint(1) DEFAULT 1 COMMENT 'Privacy flag',
  `tags` varchar(500) DEFAULT NULL COMMENT 'Comma-separated tags',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Professional counseling case notes';

--
-- Dumping data for table `case_notes`
--

INSERT INTO `case_notes` (`id`, `student_id`, `appointment_id`, `counselor_id`, `session_date`, `session_type`, `duration_minutes`, `presenting_concern`, `session_summary`, `interventions_used`, `student_response`, `progress_notes`, `risk_assessment`, `risk_details`, `mood_affect`, `treatment_plan`, `homework_assignments`, `follow_up_recommendations`, `next_session_date`, `referrals`, `is_confidential`, `tags`, `created_at`, `updated_at`) VALUES
(1, 7, 13, 1, '2026-02-13', 'crisis', 60, 'test a faf', 'ftydtyfu  fuyf ufu i giyug igf iyug uyfuf yu i yi iyu iyug oiug', 'ffo uoh ohoi', 'afasfsaf', 'fa faf', 'high', 'ffas', 'fafaf', 'fasfsaffs', 'fasff', 'sfaasf', '2026-02-14', 'dd', 1, NULL, '2026-02-13 15:33:05', '2026-02-13 16:13:55');

-- --------------------------------------------------------

--
-- Table structure for table `counselor_availability`
--

CREATE TABLE `counselor_availability` (
  `id` int(11) NOT NULL,
  `counselor_id` int(11) NOT NULL COMMENT 'References users.id where role=admin',
  `day_of_week` tinyint(1) NOT NULL COMMENT '1=Monday, 7=Sunday',
  `start_time` time NOT NULL,
  `end_time` time NOT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Weekly recurring availability schedule';

--
-- Dumping data for table `counselor_availability`
--

INSERT INTO `counselor_availability` (`id`, `counselor_id`, `day_of_week`, `start_time`, `end_time`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 1, 1, '08:00:00', '17:00:00', 1, '2026-01-08 13:38:25', NULL),
(2, 1, 2, '08:00:00', '17:00:00', 1, '2026-01-08 13:38:25', NULL),
(3, 1, 3, '08:00:00', '17:00:00', 1, '2026-01-08 13:38:25', NULL),
(4, 1, 4, '08:00:00', '17:00:00', 1, '2026-01-08 13:38:25', NULL),
(5, 1, 5, '08:00:00', '17:00:00', 1, '2026-01-08 13:38:25', NULL),
(6, 1, 1, '08:00:00', '17:00:00', 1, '2026-02-09 10:53:34', NULL),
(7, 1, 2, '08:00:00', '17:00:00', 1, '2026-02-09 10:53:34', NULL),
(8, 1, 3, '08:00:00', '17:00:00', 1, '2026-02-09 10:53:34', NULL),
(9, 1, 4, '08:00:00', '17:00:00', 1, '2026-02-09 10:53:34', NULL),
(10, 1, 5, '08:00:00', '17:00:00', 1, '2026-02-09 10:53:34', NULL),
(11, 1, 1, '08:00:00', '17:00:00', 1, '2026-02-09 10:55:26', NULL),
(12, 1, 2, '08:00:00', '17:00:00', 1, '2026-02-09 10:55:26', NULL),
(13, 1, 3, '08:00:00', '17:00:00', 1, '2026-02-09 10:55:26', NULL),
(14, 1, 4, '08:00:00', '17:00:00', 1, '2026-02-09 10:55:26', NULL),
(15, 1, 5, '08:00:00', '17:00:00', 1, '2026-02-09 10:55:26', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `counselor_custom_hours`
--

CREATE TABLE `counselor_custom_hours` (
  `id` int(11) NOT NULL,
  `counselor_id` int(11) NOT NULL,
  `date` date NOT NULL,
  `start_time` time DEFAULT NULL,
  `end_time` time DEFAULT NULL,
  `is_unavailable` tinyint(1) DEFAULT 0 COMMENT '1 = completely unavailable this day',
  `reason` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Custom hours or unavailability for specific dates';

-- --------------------------------------------------------

--
-- Table structure for table `error_logs`
--

CREATE TABLE `error_logs` (
  `id` int(11) NOT NULL,
  `timestamp` datetime NOT NULL,
  `level` varchar(20) NOT NULL,
  `message` text NOT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `url` varchar(500) DEFAULT NULL,
  `context` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `login_attempts`
--

CREATE TABLE `login_attempts` (
  `id` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `ip_address` varchar(45) NOT NULL,
  `user_agent` text DEFAULT NULL,
  `attempt_time` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Failed login attempts tracking';

-- --------------------------------------------------------

--
-- Table structure for table `password_resets`
--

CREATE TABLE `password_resets` (
  `id` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `expires_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `used` tinyint(1) DEFAULT 0 COMMENT '0 = not used, 1 = token has been used'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `treatment_goals`
--

CREATE TABLE `treatment_goals` (
  `id` int(11) NOT NULL,
  `student_id` int(11) NOT NULL,
  `counselor_id` int(11) NOT NULL,
  `goal_description` text NOT NULL,
  `target_date` date DEFAULT NULL,
  `status` enum('active','achieved','discontinued','modified') DEFAULT 'active',
  `progress_percentage` int(11) DEFAULT 0 COMMENT '0-100',
  `notes` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `achieved_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `trusted_devices`
--

CREATE TABLE `trusted_devices` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `device_token` varchar(64) NOT NULL,
  `device_name` varchar(255) DEFAULT NULL,
  `ip_address` varchar(45) NOT NULL,
  `user_agent` text DEFAULT NULL,
  `last_used` datetime NOT NULL,
  `expires_at` datetime NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `two_factor_auth`
--

CREATE TABLE `two_factor_auth` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `otp_code` varchar(6) NOT NULL,
  `expires_at` datetime NOT NULL,
  `is_used` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `two_factor_auth`
--

INSERT INTO `two_factor_auth` (`id`, `user_id`, `otp_code`, `expires_at`, `is_used`, `created_at`) VALUES
(1, 1, '476429', '2026-02-13 20:30:43', 0, '2026-02-13 12:20:43'),
(2, 1, '508272', '2026-02-13 20:30:47', 0, '2026-02-13 12:20:47'),
(3, 1, '788689', '2026-02-13 20:30:51', 0, '2026-02-13 12:20:51'),
(4, 1, '101620', '2026-02-13 20:30:54', 0, '2026-02-13 12:20:54'),
(5, 1, '786286', '2026-02-13 20:40:38', 1, '2026-02-13 12:30:38'),
(6, 1, '270116', '2026-02-13 21:15:08', 1, '2026-02-13 13:05:08'),
(7, 1, '266752', '2026-02-13 21:58:33', 1, '2026-02-13 13:48:33'),
(8, 1, '907191', '2026-02-14 22:57:20', 1, '2026-02-14 14:47:20'),
(9, 1, '492358', '2026-03-15 22:22:04', 0, '2026-03-15 14:12:04'),
(10, 1, '460850', '2026-03-15 22:22:06', 0, '2026-03-15 14:12:06'),
(11, 1, '109264', '2026-03-15 22:22:33', 0, '2026-03-15 14:12:33'),
(12, 1, '715052', '2026-03-15 22:25:45', 0, '2026-03-15 14:15:45'),
(13, 1, '273062', '2026-03-15 22:28:34', 0, '2026-03-15 14:18:34'),
(14, 1, '377645', '2026-03-15 22:41:28', 1, '2026-03-15 14:31:28'),
(15, 1, '045054', '2026-03-15 23:49:34', 1, '2026-03-15 15:39:34');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `student_id` varchar(50) NOT NULL COMMENT 'Student ID or "admin" for admin users',
  `full_name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL COMMENT 'In production, use hashed passwords',
  `course` varchar(100) DEFAULT NULL COMMENT 'Nullable for admin accounts',
  `year_level` varchar(20) DEFAULT NULL COMMENT 'Nullable for admin accounts',
  `role` enum('student','admin') NOT NULL DEFAULT 'student',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `account_status` enum('active','blocked') DEFAULT 'active' COMMENT 'Account status',
  `two_factor_enabled` tinyint(1) DEFAULT 0 COMMENT 'Whether 2FA is enabled',
  `two_factor_mandatory` tinyint(1) DEFAULT 0 COMMENT 'Whether 2FA is required'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `student_id`, `full_name`, `email`, `password`, `course`, `year_level`, `role`, `created_at`, `account_status`, `two_factor_enabled`, `two_factor_mandatory`) VALUES
(1, 'admin', 'System Administrator', 'panpacific1101@gmail.com', '$2y$10$OXNiOCRLaOzvmTWNHg4sb.EIolLQ4hvSbI4C2vD8g7zf3qdor2xlq', NULL, NULL, 'admin', '2026-01-07 15:09:33', 'active', 0, 1),
(2, '2024-0001', 'Juan Dela Cruz', 'juan.delacruz.ecoast@panpacificu.edu.ph', '$2y$10$I8Cqy2Hx2n3RIOnOvDUItuTnYAt9ryFyTagnVvuH6zjG9IqIKjyjy', 'BSIT', '3rd', 'student', '2026-01-07 15:09:33', 'active', 0, 0),
(3, '123', 'sander', 'f.ecoast@panpacificu.edu.ph', '$2y$10$ZTPX9iKkF1cYyCGYJfpoK.wj3wkvaF4gT6q94DMxwOwJ3Dwf.Qrzi', 'BSHRM', '1st', 'student', '2026-01-07 15:13:04', 'active', 0, 0),
(5, '3512', 'kc', 'fen.ecoast@panpacificu.edu.ph', '$2y$10$Kdx68Kd01hP.H0hSK2wlzOsZyJdCqwrIh8f/GXr3AjNuP8uCdwgd2', 'BSCS', '2nd', 'student', '2026-01-07 15:51:55', 'active', 0, 0),
(6, '462352', 'rt', 'full.ecoast@panpacificu.edu.ph', '$2y$10$A6gz0Ixdb.7jo6TOylYVp.zauX.nTaT4XgxMybBJkZG2amNTDmFx.', 'BSHRM', '2nd', 'student', '2026-01-07 16:09:54', 'active', 0, 0),
(7, '523424', 'keith czander villanueva', 'keithczander.villanueva.ecoast@panpacificu.edu.ph', '$2y$10$oa828wMxYCcvqgBjFHvfWeySQNXJ.bSyyvDuhnhR1PSwBZqiOXS5W', 'BSHRM', '2nd', 'student', '2026-01-07 16:12:17', 'active', 0, 0),
(8, '634642', 'kelown', 'doctor.ecoast@panpacificu.edu.ph', '$2y$10$ETpM9ueSfW8a0kPS67kiwevo4SrY86pA8Jf.Gy4bM77RMGG16Q6yO', 'BSN', '2nd', 'student', '2026-01-08 11:50:28', 'blocked', 0, 0),
(9, '1231377', 'Steven John A. Agustin', 'steven.agustin.ecoast@panpacificu.edu.ph', '$2y$10$d0HaBakeA5nnRiowC6HOwuOp7W0a/kvZxZ3ZS/4eSNEmU1rario3S', 'BSIT', '3rd', 'student', '2026-03-15 15:27:56', 'active', 0, 0);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `activity_logs`
--
ALTER TABLE `activity_logs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `action` (`action`),
  ADD KEY `created_at` (`created_at`),
  ADD KEY `idx_activity_user_time` (`user_id`,`created_at`);

--
-- Indexes for table `anonymous_queries`
--
ALTER TABLE `anonymous_queries`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_date_submitted` (`date_submitted`),
  ADD KEY `idx_is_read` (`is_read`);

--
-- Indexes for table `appointments`
--
ALTER TABLE `appointments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_user_id` (`user_id`),
  ADD KEY `idx_appointment_date` (`appointment_date`),
  ADD KEY `idx_status` (`status`),
  ADD KEY `idx_appointments_date_time` (`appointment_date`,`appointment_time`),
  ADD KEY `idx_appointments_status` (`status`),
  ADD KEY `idx_appointments_user_date` (`user_id`,`appointment_date`),
  ADD KEY `idx_reminder_check` (`status`,`reminder_sent`,`appointment_date`,`appointment_time`),
  ADD KEY `idx_confirmation` (`confirmation_status`,`confirmation_expires_at`),
  ADD KEY `idx_token` (`confirmation_token`),
  ADD KEY `idx_has_note` (`has_case_note`),
  ADD KEY `idx_feedback` (`feedback_submitted`),
  ADD KEY `idx_google_event` (`google_event_id`);

--
-- Indexes for table `appointment_feedback`
--
ALTER TABLE `appointment_feedback`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_feedback` (`appointment_id`,`student_id`),
  ADD KEY `idx_appointment` (`appointment_id`),
  ADD KEY `idx_student` (`student_id`),
  ADD KEY `idx_rating` (`overall_rating`),
  ADD KEY `idx_submitted` (`submitted_at`);

--
-- Indexes for table `appointment_waitlist`
--
ALTER TABLE `appointment_waitlist`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_student` (`student_id`),
  ADD KEY `idx_date` (`preferred_date`,`preferred_time_start`),
  ADD KEY `idx_status` (`status`),
  ADD KEY `idx_expires` (`expires_at`),
  ADD KEY `idx_priority` (`priority`);

--
-- Indexes for table `blocked_dates`
--
ALTER TABLE `blocked_dates`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `date` (`date`),
  ADD KEY `created_by` (`created_by`);

--
-- Indexes for table `case_notes`
--
ALTER TABLE `case_notes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_student` (`student_id`),
  ADD KEY `idx_appointment` (`appointment_id`),
  ADD KEY `idx_counselor` (`counselor_id`),
  ADD KEY `idx_session_date` (`session_date`),
  ADD KEY `idx_risk` (`risk_assessment`),
  ADD KEY `idx_created` (`created_at`);

--
-- Indexes for table `counselor_availability`
--
ALTER TABLE `counselor_availability`
  ADD PRIMARY KEY (`id`),
  ADD KEY `counselor_id` (`counselor_id`),
  ADD KEY `day_of_week` (`day_of_week`);

--
-- Indexes for table `counselor_custom_hours`
--
ALTER TABLE `counselor_custom_hours`
  ADD PRIMARY KEY (`id`),
  ADD KEY `counselor_id` (`counselor_id`),
  ADD KEY `date` (`date`);

--
-- Indexes for table `error_logs`
--
ALTER TABLE `error_logs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_timestamp` (`timestamp`),
  ADD KEY `idx_level` (`level`),
  ADD KEY `idx_user_id` (`user_id`);

--
-- Indexes for table `login_attempts`
--
ALTER TABLE `login_attempts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `email_ip` (`email`,`ip_address`),
  ADD KEY `attempt_time` (`attempt_time`),
  ADD KEY `idx_login_attempts_cleanup` (`attempt_time`);

--
-- Indexes for table `password_resets`
--
ALTER TABLE `password_resets`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `token` (`token`),
  ADD KEY `idx_email` (`email`),
  ADD KEY `idx_token` (`token`),
  ADD KEY `idx_expires` (`expires_at`);

--
-- Indexes for table `treatment_goals`
--
ALTER TABLE `treatment_goals`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_student` (`student_id`),
  ADD KEY `idx_counselor` (`counselor_id`),
  ADD KEY `idx_status` (`status`);

--
-- Indexes for table `trusted_devices`
--
ALTER TABLE `trusted_devices`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `device_token` (`device_token`),
  ADD KEY `idx_user` (`user_id`),
  ADD KEY `idx_token` (`device_token`),
  ADD KEY `idx_expires` (`expires_at`);

--
-- Indexes for table `two_factor_auth`
--
ALTER TABLE `two_factor_auth`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_user` (`user_id`),
  ADD KEY `idx_code` (`otp_code`),
  ADD KEY `idx_expires` (`expires_at`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `student_id` (`student_id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `idx_student_id` (`student_id`),
  ADD KEY `idx_email` (`email`),
  ADD KEY `idx_role` (`role`),
  ADD KEY `idx_account_status` (`account_status`),
  ADD KEY `idx_2fa` (`two_factor_enabled`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `activity_logs`
--
ALTER TABLE `activity_logs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `anonymous_queries`
--
ALTER TABLE `anonymous_queries`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `appointments`
--
ALTER TABLE `appointments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT for table `appointment_feedback`
--
ALTER TABLE `appointment_feedback`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `appointment_waitlist`
--
ALTER TABLE `appointment_waitlist`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `blocked_dates`
--
ALTER TABLE `blocked_dates`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;

--
-- AUTO_INCREMENT for table `case_notes`
--
ALTER TABLE `case_notes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `counselor_availability`
--
ALTER TABLE `counselor_availability`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `counselor_custom_hours`
--
ALTER TABLE `counselor_custom_hours`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `error_logs`
--
ALTER TABLE `error_logs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `login_attempts`
--
ALTER TABLE `login_attempts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `password_resets`
--
ALTER TABLE `password_resets`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `treatment_goals`
--
ALTER TABLE `treatment_goals`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `trusted_devices`
--
ALTER TABLE `trusted_devices`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `two_factor_auth`
--
ALTER TABLE `two_factor_auth`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `activity_logs`
--
ALTER TABLE `activity_logs`
  ADD CONSTRAINT `activity_logs_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `appointments`
--
ALTER TABLE `appointments`
  ADD CONSTRAINT `fk_appointments_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `appointment_feedback`
--
ALTER TABLE `appointment_feedback`
  ADD CONSTRAINT `appointment_feedback_ibfk_1` FOREIGN KEY (`appointment_id`) REFERENCES `appointments` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `appointment_feedback_ibfk_2` FOREIGN KEY (`student_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `appointment_waitlist`
--
ALTER TABLE `appointment_waitlist`
  ADD CONSTRAINT `appointment_waitlist_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `blocked_dates`
--
ALTER TABLE `blocked_dates`
  ADD CONSTRAINT `blocked_dates_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `case_notes`
--
ALTER TABLE `case_notes`
  ADD CONSTRAINT `case_notes_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `case_notes_ibfk_2` FOREIGN KEY (`appointment_id`) REFERENCES `appointments` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `case_notes_ibfk_3` FOREIGN KEY (`counselor_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `counselor_availability`
--
ALTER TABLE `counselor_availability`
  ADD CONSTRAINT `counselor_availability_ibfk_1` FOREIGN KEY (`counselor_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `counselor_custom_hours`
--
ALTER TABLE `counselor_custom_hours`
  ADD CONSTRAINT `counselor_custom_hours_ibfk_1` FOREIGN KEY (`counselor_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `treatment_goals`
--
ALTER TABLE `treatment_goals`
  ADD CONSTRAINT `treatment_goals_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `treatment_goals_ibfk_2` FOREIGN KEY (`counselor_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `trusted_devices`
--
ALTER TABLE `trusted_devices`
  ADD CONSTRAINT `trusted_devices_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `two_factor_auth`
--
ALTER TABLE `two_factor_auth`
  ADD CONSTRAINT `two_factor_auth_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
--
-- Database: `daily_meds`
--
CREATE DATABASE IF NOT EXISTS `daily_meds` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `daily_meds`;

-- --------------------------------------------------------

--
-- Table structure for table `medicines`
--

CREATE TABLE `medicines` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `medicine_name` varchar(100) NOT NULL,
  `dosage` varchar(50) DEFAULT NULL,
  `frequency` varchar(50) DEFAULT NULL,
  `schedule_time` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `reminder_sent` tinyint(1) DEFAULT 0,
  `email_sent` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `email`, `password`, `created_at`) VALUES
(2, 'elon@gmail.com', 'elon@gmail.com', '$2y$10$t.uRDHxog0NzlhxVUwGbVOL22.6qoKYtkL26zYifQKnRHMsrWehpW', '2025-10-07 16:14:44'),
(14, 'Princess Garcia', 'princess.garcia.ecoast@panpacificu.edu.ph', '$2y$10$WY6RGAd1ar3DA7Swo5tpSu4rzFiA/voexJNuAoW/ZM5PxlPigYIm6', '2025-11-23 16:55:23');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `medicines`
--
ALTER TABLE `medicines`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `medicines`
--
ALTER TABLE `medicines`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `medicines`
--
ALTER TABLE `medicines`
  ADD CONSTRAINT `medicines_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
--
-- Database: `diet_schedule_db`
--
CREATE DATABASE IF NOT EXISTS `diet_schedule_db` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `diet_schedule_db`;

-- --------------------------------------------------------

--
-- Table structure for table `accounts`
--

CREATE TABLE `accounts` (
  `id` int(11) NOT NULL,
  `username` varchar(200) NOT NULL,
  `email` varchar(200) NOT NULL,
  `password` varchar(200) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `accounts`
--

INSERT INTO `accounts` (`id`, `username`, `email`, `password`) VALUES
(12, 'chari', 'chari@gmail.com', '$2y$10$HgfezvXCBRVAgejxanFKjeVjwnv4mhB931Fj7G20ENakviC25mgES');

-- --------------------------------------------------------

--
-- Table structure for table `calories_date`
--

CREATE TABLE `calories_date` (
  `id` int(11) NOT NULL,
  `date` varchar(200) NOT NULL,
  `day` varchar(200) NOT NULL,
  `total_calories` varchar(200) NOT NULL,
  `food_name` varchar(200) NOT NULL,
  `food_calories` varchar(200) NOT NULL,
  `user_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `calories_date`
--

INSERT INTO `calories_date` (`id`, `date`, `day`, `total_calories`, `food_name`, `food_calories`, `user_id`) VALUES
(20, '2025-10-25', 'Saturday,', '23', 'Banana', '23', 5),
(21, '2025-10-25', 'Saturday,', '30', 'Pizza', '10', 6),
(22, '2025-10-25', 'Saturday,', '30', 'Hotdog', '20', 6),
(23, '2025-10-25', 'Saturday,', '10', 'Beef', '10', 6),
(24, '2025-11-21', 'Friday,', '34', 'Banana', '9', 12),
(25, '2025-11-21', 'Friday,', '34', 'Rice', '25', 12);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `accounts`
--
ALTER TABLE `accounts`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `calories_date`
--
ALTER TABLE `calories_date`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `accounts`
--
ALTER TABLE `accounts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `calories_date`
--
ALTER TABLE `calories_date`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;
--
-- Database: `expense_tracker`
--
CREATE DATABASE IF NOT EXISTS `expense_tracker` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `expense_tracker`;

-- --------------------------------------------------------

--
-- Table structure for table `expenses`
--

CREATE TABLE `expenses` (
  `id` int(11) NOT NULL,
  `description` varchar(255) NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `category` varchar(100) DEFAULT NULL,
  `date` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `expenses`
--

INSERT INTO `expenses` (`id`, `description`, `amount`, `category`, `date`) VALUES
(13, 'Samgyup', 1299.00, 'Food', '2025-10-19'),
(14, 'Coke', 13.00, 'Food', '2025-10-19'),
(15, 'Samgyup', 299.00, 'Food', '2025-10-19'),
(16, 'samgyup', 299.00, 'Food', '2025-11-20');

-- --------------------------------------------------------

--
-- Table structure for table `expenses_history`
--

CREATE TABLE `expenses_history` (
  `id` int(11) NOT NULL,
  `description` varchar(255) NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `category` varchar(255) NOT NULL,
  `date` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `expenses_history`
--

INSERT INTO `expenses_history` (`id`, `description`, `amount`, `category`, `date`) VALUES
(1, 'Candy', 2.00, 'Food', '2025-10-19'),
(2, 'Samgyup', 1299.00, 'Food', '2025-10-19'),
(3, 'Coke', 13.00, 'Food', '2025-10-19'),
(4, 'Samgyup', 299.00, 'Food', '2025-10-19'),
(5, 'samgyup', 299.00, 'Food', '2025-11-20');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `expenses`
--
ALTER TABLE `expenses`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `expenses_history`
--
ALTER TABLE `expenses_history`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `expenses`
--
ALTER TABLE `expenses`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `expenses_history`
--
ALTER TABLE `expenses_history`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;
--
-- Database: `e_waste_donation`
--
CREATE DATABASE IF NOT EXISTS `e_waste_donation` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `e_waste_donation`;

-- --------------------------------------------------------

--
-- Table structure for table `accounts`
--

CREATE TABLE `accounts` (
  `id` int(11) NOT NULL,
  `email` varchar(200) NOT NULL,
  `password` varchar(200) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `accounts`
--

INSERT INTO `accounts` (`id`, `email`, `password`) VALUES
(2, 'gabrielcastillo068@gmail.com', '$2y$10$Jhhw/j7Se0IcuczyK6GTbO79sGfKeORRIZGKsTptjNbEN.1pcSWCy');

-- --------------------------------------------------------

--
-- Table structure for table `donations`
--

CREATE TABLE `donations` (
  `id` int(11) NOT NULL,
  `photo` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `pickup_date` varchar(255) NOT NULL,
  `pick_up_address` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `status` varchar(255) NOT NULL DEFAULT 'Pending',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `first_name` varchar(100) DEFAULT NULL,
  `last_name` varchar(100) DEFAULT NULL,
  `email_address` varchar(100) DEFAULT NULL,
  `phone_number` varchar(20) DEFAULT NULL,
  `street_address` varchar(255) DEFAULT NULL,
  `city` varchar(100) DEFAULT NULL,
  `zip_code` varchar(10) DEFAULT NULL,
  `property_type` varchar(100) DEFAULT NULL,
  `additional_information` text DEFAULT NULL,
  `otp_code` int(11) NOT NULL,
  `otp_code_expiry` varchar(255) NOT NULL,
  `verified` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `accounts`
--
ALTER TABLE `accounts`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `donations`
--
ALTER TABLE `donations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `accounts`
--
ALTER TABLE `accounts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `donations`
--
ALTER TABLE `donations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=76;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=87;
--
-- Database: `face_recognition`
--
CREATE DATABASE IF NOT EXISTS `face_recognition` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `face_recognition`;

-- --------------------------------------------------------

--
-- Table structure for table `admin_accounts`
--

CREATE TABLE `admin_accounts` (
  `id` int(11) NOT NULL,
  `fullname` varchar(200) NOT NULL,
  `username` varchar(100) NOT NULL,
  `password` varchar(100) NOT NULL,
  `profile_image` varchar(1000) NOT NULL,
  `date` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `admin_accounts`
--

INSERT INTO `admin_accounts` (`id`, `fullname`, `username`, `password`, `profile_image`, `date`) VALUES
(1, 'Steve Job', 'admin', '$2y$10$tu9d.VqCp1PZXETHdUeJ.eg2JimcD8dIF.rhDpKBU6cc7Xo/eqGG.', 'http://localhost/Library-Attendance-System/administrator/profile-image/PUNP Picture of me white background.jpg', '2025-07-20 03:28:39');

-- --------------------------------------------------------

--
-- Table structure for table `attendance_history`
--

CREATE TABLE `attendance_history` (
  `id` int(11) NOT NULL,
  `id_number` varchar(100) NOT NULL,
  `firstname` varchar(100) NOT NULL,
  `middlename` varchar(100) NOT NULL,
  `lastname` varchar(100) NOT NULL,
  `course` varchar(200) NOT NULL,
  `year_level` varchar(100) NOT NULL,
  `file_path` varchar(200) NOT NULL,
  `date_and_time` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `attendance_history`
--

INSERT INTO `attendance_history` (`id`, `id_number`, `firstname`, `middlename`, `lastname`, `course`, `year_level`, `file_path`, `date_and_time`) VALUES
(94, '1234565', 'Elon', 'C', 'Musk', 'BSIT', '3', 'http://localhost/Library-Attendance-System/client/uploads/Elon C. Musk.png', '2025-11-17 11:00:06 pm'),
(95, '1231377', 'Steven John', 'A', 'Agustin', 'BSCS', '3', 'http://localhost/Library-Attendance-System/client/uploads/Steven John A. Agustin.png', '2025-11-18 10:21:31 am'),
(96, '1234565', 'Elon', 'C', 'Musk', 'BSIT', '3', 'http://localhost/Library-Attendance-System/client/uploads/Elon C. Musk.png', '2025-11-18 10:22:42 am'),
(97, '1234565', 'Elon', 'C', 'Musk', 'BSIT', '3', 'http://localhost/Library-Attendance-System/client/uploads/Elon C. Musk.png', '2025-11-18 10:28:42 am'),
(98, '1231597', 'Mark', 'D', 'Zuckerberg', 'BSTM', '3', 'http://localhost/Library-Attendance-System/client/uploads/Mark D. Zuckerberg.png', '2025-11-18 10:28:49 am'),
(99, '1231372', 'Bill', 'B', 'Gates', 'BSECE', '3', 'http://localhost/Library-Attendance-System/client/uploads/Bill B. Gates.png', '2025-11-18 10:28:58 am'),
(100, '1231377', 'Steven John', 'A', 'Agustin', 'BSCS', '3', 'http://localhost/Library-Attendance-System/client/uploads/Steven John A. Agustin.png', '2025-11-23 01:49:03 am'),
(101, '1231377', 'Steven John', 'A', 'Agustin', 'BSCS', '3', 'http://localhost/Library-Attendance-System/client/uploads/Steven John A. Agustin.png', '2025-11-23 01:57:05 am'),
(102, '1231372', 'Bill', 'B', 'Gates', 'BSECE', '3', 'http://localhost/Library-Attendance-System/client/uploads/Bill B. Gates.png', '2025-11-23 01:57:27 am'),
(103, '1231597', 'Mark', 'D', 'Zuckerberg', 'BSTM', '3', 'http://localhost/Library-Attendance-System/client/uploads/Mark D. Zuckerberg.png', '2025-11-23 01:57:36 am'),
(104, '1234565', 'Elon', 'C', 'Musk', 'BSIT', '3', 'http://localhost/Library-Attendance-System/client/uploads/Elon C. Musk.png', '2025-11-23 01:57:43 am'),
(105, '1231377', 'Steven John', 'A', 'Agustin', 'BSCS', '3', 'http://localhost/Library-Attendance-System/client/uploads/Steven John A. Agustin.png', '2025-11-23 02:10:04 am'),
(106, '1234565', 'Elon', 'C', 'Musk', 'BSIT', '3', 'http://localhost/Library-Attendance-System/client/uploads/Elon C. Musk.png', '2025-11-23 02:10:24 am'),
(107, '1231597', 'Mark', 'D', 'Zuckerberg', 'BSTM', '3', 'http://localhost/Library-Attendance-System/client/uploads/Mark D. Zuckerberg.png', '2025-11-23 02:10:31 am'),
(108, '1231372', 'Bill', 'R', 'Gates', 'BSECE', '3', 'http://localhost/Library-Attendance-System/client/uploads/Bill B. Gates.png', '2025-11-23 02:10:38 am'),
(109, '1231377', 'Steven John', 'A', 'Agustin', 'BSCS', '3', 'http://localhost/Library-Attendance-System/client/uploads/Steven John A. Agustin.png', '2025-11-23 02:35:41 am'),
(110, '1234565', 'Elon', 'P', 'Musk', 'BSIT', '3', 'http://localhost/Library-Attendance-System/client/uploads/Elon C. Musk.png', '2025-11-23 02:36:01 am'),
(111, '1231597', 'Mark', 'D', 'Zuckerberg', 'BSTM', '3', 'http://localhost/Library-Attendance-System/client/uploads/Mark D. Zuckerberg.png', '2025-11-23 02:36:12 am'),
(112, '1231372', 'Bill', 'R', 'Gates', 'BSECE', '3', 'http://localhost/Library-Attendance-System/client/uploads/Bill B. Gates.png', '2025-11-23 02:36:19 am');

-- --------------------------------------------------------

--
-- Table structure for table `attendance_now`
--

CREATE TABLE `attendance_now` (
  `id` int(11) NOT NULL,
  `id_number` int(11) NOT NULL,
  `firstname` varchar(100) NOT NULL,
  `middlename` varchar(100) NOT NULL,
  `lastname` varchar(100) NOT NULL,
  `course` varchar(200) NOT NULL,
  `year_level` varchar(100) NOT NULL,
  `file_path` varchar(200) NOT NULL,
  `date_and_time` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `course`
--

CREATE TABLE `course` (
  `id` int(11) NOT NULL,
  `course_name` varchar(200) NOT NULL,
  `color` varchar(200) NOT NULL,
  `date` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `course`
--

INSERT INTO `course` (`id`, `course_name`, `color`, `date`) VALUES
(92, 'BSCrim', 'rgba(255, 51, 51, 0.8)', '0000-00-00 00:00:00'),
(94, 'BSBA-FM', 'rgba(255, 204, 0, 0.8)', '0000-00-00 00:00:00'),
(95, 'BSBA-HRM', 'rgba(0, 153, 76, 0.8)', '0000-00-00 00:00:00'),
(96, 'BSBA-MM', 'rgba(255, 153, 51, 0.8)', '0000-00-00 00:00:00'),
(97, 'BSBA-OM', 'rgba(102, 153, 255, 0.8)', '0000-00-00 00:00:00'),
(98, 'BSMA', 'rgba(153, 0, 204, 0.8)', '0000-00-00 00:00:00'),
(99, 'BSHM', 'rgba(255, 102, 0, 0.8)', '0000-00-00 00:00:00'),
(100, 'BSTM', 'rgba(255, 0, 102, 0.8)', '0000-00-00 00:00:00'),
(101, 'BSCS', 'rgba(0, 204, 204, 0.8)', '0000-00-00 00:00:00'),
(102, 'BSIT', 'rgba(102, 0, 204, 0.8)', '0000-00-00 00:00:00'),
(103, 'BSCE', 'rgba(0, 153, 255, 0.8)', '0000-00-00 00:00:00'),
(105, 'BSEE', 'rgba(204, 0, 102, 0.8)', '0000-00-00 00:00:00'),
(106, 'BSECE', 'rgba(0, 204, 102, 0.8)', '0000-00-00 00:00:00'),
(161, 'Sample', '', '2025-11-23 02:39:16'),
(162, 'Chari', '', '2026-01-03 21:53:27');

-- --------------------------------------------------------

--
-- Stand-in structure for view `my_view`
-- (See below for the actual view)
--
CREATE TABLE `my_view` (
`id` int(11)
,`level` int(11)
,`date` datetime
);

-- --------------------------------------------------------

--
-- Table structure for table `student_information`
--

CREATE TABLE `student_information` (
  `id` int(11) NOT NULL,
  `id_number` varchar(100) NOT NULL,
  `firstname` varchar(100) NOT NULL,
  `middlename` varchar(100) NOT NULL,
  `lastname` varchar(100) NOT NULL,
  `course` varchar(100) NOT NULL,
  `year_level` varchar(100) NOT NULL,
  `file_path` varchar(200) NOT NULL,
  `date_and_time` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `student_information`
--

INSERT INTO `student_information` (`id`, `id_number`, `firstname`, `middlename`, `lastname`, `course`, `year_level`, `file_path`, `date_and_time`) VALUES
(65, '1234565', 'Elon', 'Q', 'Musk', 'BSIT', '3', 'http://localhost/Library-Attendance-System/client/uploads/Elon C. Musk.png', '2025-11-17 22:56:38'),
(66, '1231372', 'Bill', 'R', 'Gates', 'BSECE', '3', 'http://localhost/Library-Attendance-System/client/uploads/Bill B. Gates.png', '2025-11-18 10:27:18');

-- --------------------------------------------------------

--
-- Table structure for table `year_level`
--

CREATE TABLE `year_level` (
  `id` int(11) NOT NULL,
  `level` int(11) NOT NULL,
  `date` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `year_level`
--

INSERT INTO `year_level` (`id`, `level`, `date`) VALUES
(6, 1, '2025-07-19 03:40:25'),
(7, 2, '2025-07-19 03:40:25'),
(8, 3, '2025-07-19 03:40:25'),
(9, 4, '2025-07-19 03:40:25'),
(27, 5, '2025-07-21 21:01:57');

-- --------------------------------------------------------

--
-- Structure for view `my_view`
--
DROP TABLE IF EXISTS `my_view`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `my_view`  AS SELECT `year_level`.`id` AS `id`, `year_level`.`level` AS `level`, `year_level`.`date` AS `date` FROM `year_level` ;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admin_accounts`
--
ALTER TABLE `admin_accounts`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `attendance_history`
--
ALTER TABLE `attendance_history`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `attendance_now`
--
ALTER TABLE `attendance_now`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `course`
--
ALTER TABLE `course`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `student_information`
--
ALTER TABLE `student_information`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `year_level`
--
ALTER TABLE `year_level`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admin_accounts`
--
ALTER TABLE `admin_accounts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `attendance_history`
--
ALTER TABLE `attendance_history`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=113;

--
-- AUTO_INCREMENT for table `attendance_now`
--
ALTER TABLE `attendance_now`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=80;

--
-- AUTO_INCREMENT for table `course`
--
ALTER TABLE `course`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=163;

--
-- AUTO_INCREMENT for table `student_information`
--
ALTER TABLE `student_information`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=72;

--
-- AUTO_INCREMENT for table `year_level`
--
ALTER TABLE `year_level`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=34;
--
-- Database: `gatepass_db`
--
CREATE DATABASE IF NOT EXISTS `gatepass_db` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `gatepass_db`;

-- --------------------------------------------------------

--
-- Table structure for table `announcements`
--

CREATE TABLE `announcements` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `message` text NOT NULL,
  `type` enum('info','warning','error','success') NOT NULL DEFAULT 'info',
  `target` enum('all','student','faculty','guard','hr') NOT NULL DEFAULT 'all',
  `scheduled_at` datetime DEFAULT NULL COMMENT 'NULL = send immediately',
  `sent_at` datetime DEFAULT NULL,
  `created_by` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `announcements`
--

INSERT INTO `announcements` (`id`, `title`, `message`, `type`, `target`, `scheduled_at`, `sent_at`, `created_by`, `created_at`) VALUES
(1, 'Kunwari', 'Kunwari', 'info', 'student', '2026-03-15 16:05:00', '2026-03-15 16:05:33', NULL, '2026-03-15 08:05:11'),
(2, 'asdasdasdasd', 'Saan ka?', 'warning', 'all', NULL, '2026-03-15 16:08:48', NULL, '2026-03-15 08:08:45');

-- --------------------------------------------------------

--
-- Table structure for table `gate_passes`
--

CREATE TABLE `gate_passes` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `control_no` varchar(50) DEFAULT NULL,
  `date` date NOT NULL,
  `time` time NOT NULL,
  `department` varchar(50) DEFAULT NULL,
  `program` varchar(100) DEFAULT NULL,
  `year_level` varchar(50) DEFAULT NULL,
  `quantity` varchar(50) DEFAULT NULL,
  `return_time` varchar(50) DEFAULT NULL,
  `reason` text DEFAULT NULL,
  `faculty_approver` varchar(100) DEFAULT NULL,
  `faculty_status` enum('Pending','Approved','Rejected') DEFAULT 'Pending',
  `faculty_remarks` text DEFAULT NULL,
  `css_status` enum('Pending','Approved','Rejected') DEFAULT 'Pending',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `exit_status` enum('Pending','Exited') DEFAULT 'Pending',
  `actual_exit_time` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `gate_passes`
--

INSERT INTO `gate_passes` (`id`, `user_id`, `control_no`, `date`, `time`, `department`, `program`, `year_level`, `quantity`, `return_time`, `reason`, `faculty_approver`, `faculty_status`, `faculty_remarks`, `css_status`, `created_at`, `exit_status`, `actual_exit_time`) VALUES
(82, 14, 'GP-FAC-3626', '2026-03-16', '17:12:27', 'ECOAST', NULL, NULL, 'Individual', '17:12', 'Lunch', 'Jane A Fernandez', 'Approved', NULL, 'Approved', '2026-03-16 09:12:27', 'Pending', NULL),
(83, 14, 'GP-FAC-6971', '2026-03-16', '17:19:50', 'ECOAST', NULL, NULL, 'Individual', '17:19', 'Lunch', 'Jane A Fernandez', 'Approved', NULL, 'Approved', '2026-03-16 09:19:50', 'Pending', NULL),
(84, 14, 'GP-FAC-1100', '2026-03-16', '17:23:15', 'ECOAST', NULL, NULL, 'Individual', '17:23', 'Lunch', 'Jane A Fernandez', 'Approved', NULL, 'Approved', '2026-03-16 09:23:15', 'Pending', NULL),
(85, 14, 'GP-FAC-3333', '2026-03-16', '17:23:57', 'ECOAST', NULL, NULL, 'Individual', NULL, 'Lunch', 'Jane A Fernandez', 'Approved', NULL, 'Approved', '2026-03-16 09:23:57', 'Pending', NULL),
(86, 6, 'GP-6080', '2026-03-16', '17:25:36', 'ECOAST', 'Bachelor of Science in Information Technology', '3rd Year', 'Individual', 'N/A', 'Uuwi', 'Daniel M Villano', 'Approved', 'sgeh', 'Approved', '2026-03-16 09:25:37', 'Pending', NULL),
(87, 14, 'GP-FAC-3446', '2026-03-16', '17:30:23', 'ECOAST', NULL, NULL, 'Individual', '17:30', 'Lunch', 'Jane A Fernandez', 'Approved', NULL, 'Approved', '2026-03-16 09:30:23', 'Pending', NULL),
(88, 14, 'GP-FAC-9974', '2026-03-16', '17:33:50', 'ECOAST', NULL, NULL, 'Individual', NULL, 'Lunch', 'Jane A Fernandez', 'Approved', NULL, 'Approved', '2026-03-16 09:33:50', 'Pending', NULL),
(89, 14, 'GP-FAC-3592', '2026-03-16', '17:41:38', 'ECOAST', NULL, NULL, 'Individual', '17:41', 'Lunch', 'Jane A Fernandez', 'Approved', NULL, 'Approved', '2026-03-16 09:41:38', 'Pending', NULL),
(90, 14, 'GP-FAC-6713', '2026-03-16', '17:51:12', 'ECOAST', NULL, NULL, 'Individual', '17:51', 'Lunch', 'Jane A Fernandez', 'Approved', NULL, 'Approved', '2026-03-16 09:51:12', 'Pending', NULL),
(91, 38, 'GP-3502', '2026-03-17', '16:53:37', 'ECOAST', 'Bachelor of Science in Information Technology', '3rd Year', 'Individual', 'N/A', 'Lunch', 'Daniel M Villano', 'Approved', 'asdasda', 'Approved', '2026-03-17 08:53:38', 'Pending', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `notifications`
--

CREATE TABLE `notifications` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `message` text NOT NULL,
  `type` enum('info','success','warning','error') NOT NULL DEFAULT 'info',
  `is_read` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `notifications`
--

INSERT INTO `notifications` (`id`, `user_id`, `title`, `message`, `type`, `is_read`, `created_at`) VALUES
(2, 6, 'Gate Pass Request', 'Your gate pass request was submitted and is waiting for approval.', 'info', 1, '2026-03-08 10:28:01'),
(8, 15, 'New Gate Pass Request', 'Daniel Villano submitted a gate pass request requiring your approval.', 'info', 1, '2026-03-08 15:17:24'),
(82, 14, 'New Gate Pass Request', 'Mayen Salvarion submitted a gate pass request requiring your approval.', 'info', 1, '2026-03-08 16:10:14'),
(83, 2, 'New Gate Pass Request', 'Mayen Salvarion submitted a gate pass request pending CSS approval.', 'info', 1, '2026-03-08 16:10:14'),
(84, 30, 'Gate Pass Approved by Faculty', 'Your gate pass request has been approved by Faculty Daniel Villano.', 'success', 1, '2026-03-08 16:10:27'),
(85, 30, 'Gate Pass Approved by CSS', 'Your gate pass request has been approved by CSS .', 'success', 1, '2026-03-08 16:10:39'),
(86, 13, 'Gate Pass Ready for Exit', 'Mayen Salvarion\'s gate pass has been fully approved by CSS  and is ready for exit monitoring.', 'info', 1, '2026-03-08 16:10:39'),
(87, 14, 'New Gate Pass Request', 'Mayen Salvarion submitted a gate pass request requiring your approval.', 'info', 1, '2026-03-08 16:11:05'),
(88, 2, 'New Gate Pass Request', 'Mayen Salvarion submitted a gate pass request pending CSS approval.', 'info', 1, '2026-03-08 16:11:05'),
(89, 30, 'Gate Pass Approved by Faculty', 'Your gate pass request has been approved by Faculty Daniel Villano.', 'success', 1, '2026-03-08 16:11:10'),
(90, 30, 'Gate Pass Approved by CSS', 'Your gate pass request has been approved by CSS .', 'success', 1, '2026-03-08 16:11:24'),
(91, 13, 'Gate Pass Ready for Exit', 'Mayen Salvarion\'s gate pass has been fully approved by CSS  and is ready for exit monitoring.', 'info', 1, '2026-03-08 16:11:24'),
(92, 14, 'New Gate Pass Request', 'Mayen Salvarion submitted a gate pass request requiring your approval.', 'info', 1, '2026-03-08 16:11:41'),
(93, 2, 'New Gate Pass Request', 'Mayen Salvarion submitted a gate pass request pending CSS approval.', 'info', 1, '2026-03-08 16:11:41'),
(94, 30, 'Gate Pass Approved by CSS', 'Your gate pass request has been approved by CSS .', 'success', 1, '2026-03-08 16:11:46'),
(95, 13, 'Gate Pass Ready for Exit', 'Mayen Salvarion\'s gate pass has been fully approved by CSS  and is ready for exit monitoring.', 'info', 1, '2026-03-08 16:11:46'),
(96, 30, 'Gate Pass Approved by Faculty', 'Your gate pass request has been approved by Faculty Daniel Villano.', 'success', 1, '2026-03-08 16:11:59'),
(98, 2, 'New Faculty Gate Pass Request', 'Daniel Villano submitted a gate pass request pending CSS approval.', 'info', 1, '2026-03-08 16:13:34'),
(100, 14, 'Gate Pass Approved by CSS', 'Your gate pass request has been approved by CSS .', 'success', 1, '2026-03-08 16:14:00'),
(101, 13, 'Gate Pass Ready for Exit', 'Daniel Villano\'s gate pass has been fully approved by CSS  and is ready for exit monitoring.', 'info', 1, '2026-03-08 16:14:00'),
(102, 14, 'CSS Approval', 'Your gate pass was approved by CSS!', 'success', 1, '2026-03-08 16:14:02'),
(104, 14, 'Gate Pass Approved', 'Your gate pass request has been approved by Jane Hernandez (HR).', 'success', 1, '2026-03-08 16:14:07'),
(105, 2, 'Gate Pass Approved', 'Daniel Villano\'s gate pass has been Approved by Jane Hernandez (HR).', 'success', 1, '2026-03-08 16:14:07'),
(106, 14, 'Approver Approval', 'Your gate pass was approved by the approver!', 'success', 1, '2026-03-08 16:14:12'),
(107, 14, 'New Gate Pass Request', 'Mayen Salvarion submitted a gate pass request requiring your approval.', 'info', 1, '2026-03-08 17:14:09'),
(108, 2, 'New Gate Pass Request', 'Mayen Salvarion submitted a gate pass request pending CSS approval.', 'info', 1, '2026-03-08 17:14:09'),
(109, 30, 'Gate Pass Approved by Faculty', 'Your gate pass request has been approved by Faculty Daniel Villano.', 'success', 1, '2026-03-08 17:14:20'),
(110, 30, 'Gate Pass Approved by CSS', 'Your gate pass request has been approved by CSS .', 'success', 1, '2026-03-08 17:14:35'),
(111, 13, 'Gate Pass Ready for Exit', 'Mayen Salvarion\'s gate pass has been fully approved by CSS  and is ready for exit monitoring.', 'info', 1, '2026-03-08 17:14:35'),
(113, 2, 'New Faculty Gate Pass Request', 'Daniel Villano submitted a gate pass request pending CSS approval.', 'info', 1, '2026-03-08 17:15:21'),
(115, 14, 'Gate Pass Approved by CSS', 'Your gate pass request has been approved by CSS .', 'success', 1, '2026-03-08 17:15:57'),
(116, 13, 'Gate Pass Ready for Exit', 'Daniel Villano\'s gate pass has been fully approved by CSS  and is ready for exit monitoring.', 'info', 1, '2026-03-08 17:15:57'),
(118, 14, 'CSS Approval', 'Your gate pass was approved by CSS!', 'success', 1, '2026-03-08 17:15:59'),
(119, 14, 'Gate Pass Approved', 'Your gate pass request has been approved by Jane Hernandez (HR).', 'success', 1, '2026-03-08 17:16:00'),
(120, 2, 'Gate Pass Approved', 'Daniel Villano\'s gate pass has been Approved by Jane Hernandez (HR).', 'success', 1, '2026-03-08 17:16:00'),
(121, 14, 'Approver Approval', 'Your gate pass was approved by the approver!', 'success', 1, '2026-03-08 17:16:04'),
(122, 14, 'New Gate Pass Request', 'Mayen Salvarion submitted a gate pass request requiring your approval.', 'info', 1, '2026-03-08 18:04:47'),
(123, 2, 'New Gate Pass Request', 'Mayen Salvarion submitted a gate pass request pending CSS approval.', 'info', 1, '2026-03-08 18:04:47'),
(124, 30, 'Gate Pass Approved by CSS', 'Your gate pass request has been approved by CSS .', 'success', 1, '2026-03-08 18:05:00'),
(125, 13, 'Gate Pass Ready for Exit', 'Mayen Salvarion\'s gate pass has been fully approved by CSS  and is ready for exit monitoring.', 'info', 1, '2026-03-08 18:05:00'),
(127, 30, 'Gate Pass Approved by Faculty', 'Your gate pass request has been approved by Faculty Daniel Villano.', 'success', 1, '2026-03-08 18:05:05'),
(128, 14, 'New Gate Pass Request', 'Ronalyn Barsicula submitted a gate pass request requiring your approval.', 'info', 1, '2026-03-09 10:55:15'),
(129, 2, 'New Gate Pass Request', 'Ronalyn Barsicula submitted a gate pass request pending CSS approval.', 'info', 1, '2026-03-09 10:55:15'),
(130, 6, 'Gate Pass Approved by Faculty', 'Your gate pass request has been approved by Faculty Daniel Villano.', 'success', 1, '2026-03-09 10:56:49'),
(131, 6, 'Gate Pass Approved by CSS', 'Your gate pass request has been approved by CSS .', 'success', 1, '2026-03-09 10:57:13'),
(132, 13, 'Gate Pass Ready for Exit', 'Ronalyn Barsicula\'s gate pass has been fully approved by CSS  and is ready for exit monitoring.', 'info', 1, '2026-03-09 10:57:13'),
(134, 14, 'New Gate Pass Request', 'Ronalyn Barsicula submitted a gate pass request requiring your approval.', 'info', 1, '2026-03-10 13:49:51'),
(135, 2, 'New Gate Pass Request', 'Ronalyn Barsicula submitted a gate pass request pending CSS approval.', 'info', 1, '2026-03-10 13:49:51'),
(136, 6, 'Gate Pass Approved by Faculty', 'Your gate pass request has been approved by Faculty Daniel Villano.', 'success', 1, '2026-03-10 13:50:04'),
(137, 6, 'Gate Pass Approved by CSS', 'Your gate pass request has been approved by CSS .', 'success', 1, '2026-03-10 13:50:25'),
(138, 13, 'Gate Pass Ready for Exit', 'Ronalyn Barsicula\'s gate pass has been fully approved by CSS  and is ready for exit monitoring.', 'info', 1, '2026-03-10 13:50:25'),
(140, 14, 'New Gate Pass Request', 'Natsu Dragneel submitted a gate pass request requiring your approval.', 'info', 1, '2026-03-10 15:59:30'),
(141, 2, 'New Gate Pass Request', 'Natsu Dragneel submitted a gate pass request pending CSS approval.', 'info', 1, '2026-03-10 15:59:33'),
(142, 34, 'Gate Pass Approved by CSS', 'Your gate pass request has been approved by CSS .', 'success', 1, '2026-03-10 16:00:17'),
(143, 13, 'Gate Pass Ready for Exit', 'Natsu Dragneel\'s gate pass has been fully approved by CSS  and is ready for exit monitoring.', 'info', 1, '2026-03-10 16:00:21'),
(145, 34, 'Gate Pass Approved by Faculty', 'Your gate pass request has been approved by Faculty Daniel Villano.', 'success', 1, '2026-03-10 16:06:49'),
(146, 14, 'New Gate Pass Request', 'Natsu Dragneel submitted a gate pass request requiring your approval.', 'info', 1, '2026-03-10 16:07:08'),
(147, 2, 'New Gate Pass Request', 'Natsu Dragneel submitted a gate pass request pending CSS approval.', 'info', 1, '2026-03-10 16:07:12'),
(148, 34, 'Gate Pass Approved by CSS', 'Your gate pass request has been approved by CSS .', 'success', 1, '2026-03-10 16:07:48'),
(149, 13, 'Gate Pass Ready for Exit', 'Natsu Dragneel\'s gate pass has been fully approved by CSS  and is ready for exit monitoring.', 'info', 1, '2026-03-10 16:07:52'),
(150, 34, 'Gate Pass Approved by Faculty', 'Your gate pass request has been approved by Faculty Daniel Villano.', 'success', 1, '2026-03-10 16:07:55'),
(153, 2, 'New Faculty Gate Pass Request', 'Daniel Villano submitted a gate pass request pending CSS approval.', 'info', 1, '2026-03-10 16:14:19'),
(154, 14, 'Gate Pass Approved by CSS', 'Your gate pass request has been approved by CSS .', 'success', 1, '2026-03-10 16:14:30'),
(155, 14, 'CSS Approval', 'Your gate pass was approved by CSS!', 'success', 1, '2026-03-10 16:14:30'),
(156, 14, 'CSS Approval', 'Your gate pass was approved by CSS!', 'success', 1, '2026-03-10 16:14:30'),
(157, 13, 'Gate Pass Ready for Exit', 'Daniel Villano\'s gate pass has been fully approved by CSS  and is ready for exit monitoring.', 'info', 1, '2026-03-10 16:14:34'),
(159, 14, 'New Gate Pass Request', 'Natsu Dragneel submitted a gate pass request requiring your approval.', 'info', 1, '2026-03-10 16:15:13'),
(160, 2, 'New Gate Pass Request', 'Natsu Dragneel submitted a gate pass request pending CSS approval.', 'info', 1, '2026-03-10 16:15:17'),
(161, 34, 'Gate Pass Approved by CSS', 'Your gate pass request has been approved by CSS .', 'success', 1, '2026-03-10 16:15:32'),
(162, 13, 'Gate Pass Ready for Exit', 'Natsu Dragneel\'s gate pass has been fully approved by CSS  and is ready for exit monitoring.', 'info', 1, '2026-03-10 16:15:36'),
(164, 34, 'Gate Pass Approved by Faculty', 'Your gate pass request has been approved by Faculty Daniel Villano.', 'success', 1, '2026-03-10 16:15:40'),
(165, 14, 'New Gate Pass Request', 'Gabriel Castillo submitted a gate pass request requiring your approval.', 'info', 1, '2026-03-15 06:51:53'),
(166, 2, 'New Gate Pass Request', 'Gabriel Castillo submitted a gate pass request pending CSS approval.', 'info', 1, '2026-03-15 06:51:57'),
(169, 13, 'Gate Pass Ready for Exit', 'Gabriel Castillo\'s gate pass has been fully approved by CSS  and is ready for exit monitoring.', 'info', 1, '2026-03-15 06:52:27'),
(171, 14, 'New Gate Pass Request', 'Ronalyn Barsicula submitted a gate pass request requiring your approval.', 'info', 1, '2026-03-15 07:30:41'),
(172, 2, 'New Gate Pass Request', 'Ronalyn Barsicula submitted a gate pass request pending CSS approval.', 'info', 1, '2026-03-15 07:30:46'),
(173, 6, 'Gate Pass Approved by Faculty', 'Your gate pass request has been approved by Faculty Daniel Villano. Remarks: Balik ka rin lng ah', 'success', 1, '2026-03-15 07:31:15'),
(174, 6, 'Gate Pass Approved by CSS', 'Your gate pass request has been approved by CSS .', 'success', 1, '2026-03-15 07:31:29'),
(175, 13, 'Gate Pass Ready for Exit', 'Ronalyn Barsicula\'s gate pass has been fully approved by CSS  and is ready for exit monitoring.', 'info', 0, '2026-03-15 07:31:33'),
(177, 14, 'New Gate Pass Request', 'Gabriel Castillo submitted a gate pass request requiring your approval.', 'info', 1, '2026-03-15 07:35:02'),
(178, 2, 'New Gate Pass Request', 'Gabriel Castillo submitted a gate pass request pending CSS approval.', 'info', 1, '2026-03-15 07:35:05'),
(181, 13, 'Gate Pass Ready for Exit', 'Gabriel Castillo\'s gate pass has been fully approved by CSS  and is ready for exit monitoring.', 'info', 0, '2026-03-15 07:35:30'),
(183, 6, 'Kunwari', 'Kunwari', 'info', 1, '2026-03-15 08:05:11'),
(184, 22, 'Kunwari', 'Kunwari', 'info', 0, '2026-03-15 08:05:15'),
(185, 30, 'Kunwari', 'Kunwari', 'info', 0, '2026-03-15 08:05:19'),
(187, 34, 'Kunwari', 'Kunwari', 'info', 0, '2026-03-15 08:05:26'),
(190, 14, 'New Gate Pass Request', 'Gabriel Castillo submitted a gate pass request requiring your approval.', 'info', 1, '2026-03-15 08:52:28'),
(191, 2, 'New Gate Pass Request', 'Gabriel Castillo submitted a gate pass request pending CSS approval.', 'info', 1, '2026-03-15 08:52:32'),
(193, 13, 'Gate Pass Ready for Exit', 'Gabriel Castillo\'s gate pass has been fully approved by CSS  and is ready for exit monitoring.', 'info', 0, '2026-03-15 08:53:00'),
(196, 36, 'New Gate Pass Request', 'Daniel Villano submitted a gate pass request requiring your approval.', 'info', 1, '2026-03-16 08:57:45'),
(197, 2, 'New Faculty Gate Pass Request', 'Daniel Villano submitted a gate pass request pending CSS approval.', 'info', 1, '2026-03-16 08:57:45'),
(198, 14, 'Gate Pass Approved by CSS', 'Your gate pass request has been approved by CSS .', 'success', 1, '2026-03-16 08:59:34'),
(199, 14, 'CSS Approval', 'Your gate pass was approved by CSS!', 'success', 1, '2026-03-16 08:59:37'),
(200, 13, 'Gate Pass Ready for Exit', 'Daniel Villano\'s gate pass has been fully approved by CSS  and is ready for exit monitoring.', 'info', 0, '2026-03-16 08:59:37'),
(201, 36, 'CSS Approved', '1 request approved by CSS — awaiting your review!', 'info', 1, '2026-03-16 08:59:38'),
(202, 14, 'Gate Pass Approved', 'Your gate pass request has been approved by Jane Fernandez (HR).', 'success', 1, '2026-03-16 08:59:44'),
(203, 36, 'CSS Approved', '1 request approved by CSS — awaiting your review!', 'info', 1, '2026-03-16 08:59:47'),
(204, 2, 'Gate Pass Approved', 'Daniel Villano\'s gate pass has been Approved by Jane Fernandez (HR).', 'success', 1, '2026-03-16 08:59:47'),
(205, 14, 'Approver Approval', 'Your gate pass was approved by the approver!', 'success', 1, '2026-03-16 08:59:47'),
(206, 36, 'New Gate Pass Request', 'Daniel Villano submitted a gate pass request requiring your approval.', 'info', 1, '2026-03-16 09:12:27'),
(207, 2, 'New Faculty Gate Pass Request', 'Daniel Villano submitted a gate pass request pending CSS approval.', 'info', 1, '2026-03-16 09:12:27'),
(208, 36, 'New Request', '1 new gate pass request received!', 'info', 1, '2026-03-16 09:12:28'),
(209, 14, 'Gate Pass Approved', 'Your gate pass request has been approved by Jane Fernandez (HR).', 'success', 1, '2026-03-16 09:12:46'),
(210, 14, 'HR Approval', 'Your gate pass was approved by HR!', 'success', 1, '2026-03-16 09:12:47'),
(211, 2, 'Gate Pass Approved', 'Daniel Villano\'s gate pass has been Approved by Jane Fernandez (HR).', 'success', 1, '2026-03-16 09:12:49'),
(212, 14, 'Gate Pass Approved by CSS', 'Your gate pass request has been approved by CSS .', 'success', 1, '2026-03-16 09:17:14'),
(213, 13, 'Gate Pass Ready for Exit', 'Daniel Villano\'s gate pass has been fully approved by CSS  and is ready for exit monitoring.', 'info', 0, '2026-03-16 09:17:17'),
(214, 36, 'New Gate Pass Request', 'Daniel Villano submitted a gate pass request requiring your approval.', 'info', 1, '2026-03-16 09:19:50'),
(215, 2, 'New Faculty Gate Pass Request', 'Daniel Villano submitted a gate pass request pending CSS approval.', 'info', 1, '2026-03-16 09:19:50'),
(216, 36, 'New Request', '1 new gate pass request received!', 'info', 1, '2026-03-16 09:19:53'),
(217, 14, 'Gate Pass Approved', 'Your gate pass request has been approved by Jane Fernandez (HR).', 'success', 1, '2026-03-16 09:20:06'),
(218, 2, 'Gate Pass Approved', 'Daniel Villano\'s gate pass has been Approved by Jane Fernandez (HR).', 'success', 1, '2026-03-16 09:20:10'),
(219, 14, 'HR Approval', 'Your gate pass was approved by HR!', 'success', 1, '2026-03-16 09:20:11'),
(220, 14, 'Gate Pass Approved by CSS', 'Your gate pass request has been approved by CSS .', 'success', 1, '2026-03-16 09:20:14'),
(221, 13, 'Gate Pass Ready for Exit', 'Daniel Villano\'s gate pass has been fully approved by CSS  and is ready for exit monitoring.', 'info', 0, '2026-03-16 09:20:18'),
(222, 36, 'New Gate Pass Request', 'Daniel Villano submitted a gate pass request requiring your approval.', 'info', 1, '2026-03-16 09:23:15'),
(223, 2, 'New Faculty Gate Pass Request', 'Daniel Villano submitted a gate pass request pending CSS approval.', 'info', 1, '2026-03-16 09:23:15'),
(224, 36, 'New Request', '1 new gate pass request received!', 'info', 1, '2026-03-16 09:23:17'),
(225, 14, 'Gate Pass Approved', 'Your gate pass request has been approved by Jane Fernandez (HR).', 'success', 1, '2026-03-16 09:23:34'),
(226, 14, 'HR Approval', 'Your gate pass was approved by HR!', 'success', 1, '2026-03-16 09:23:37'),
(227, 14, 'Gate Pass Approved by CSS', 'Your gate pass request has been approved by CSS .', 'success', 1, '2026-03-16 09:23:37'),
(228, 36, 'CSS Approved', '1 request approved by CSS — awaiting your review!', 'info', 1, '2026-03-16 09:23:38'),
(229, 2, 'Gate Pass Approved', 'Daniel Villano\'s gate pass has been Approved by Jane Fernandez (HR).', 'success', 1, '2026-03-16 09:23:38'),
(230, 13, 'Gate Pass Ready for Exit', 'Daniel Villano\'s gate pass has been fully approved by CSS  and is ready for exit monitoring.', 'info', 0, '2026-03-16 09:23:40'),
(231, 36, 'New Gate Pass Request', 'Daniel Villano submitted a gate pass request requiring your approval.', 'info', 1, '2026-03-16 09:23:57'),
(232, 2, 'New Faculty Gate Pass Request', 'Daniel Villano submitted a gate pass request pending CSS approval.', 'info', 1, '2026-03-16 09:23:57'),
(233, 36, 'New Request', '1 new gate pass request received!', 'info', 1, '2026-03-16 09:23:58'),
(234, 14, 'Gate Pass Approved', 'Your gate pass request has been approved by Jane Fernandez (HR).', 'success', 1, '2026-03-16 09:24:33'),
(235, 14, 'HR Approval', 'Your gate pass was approved by HR!', 'success', 1, '2026-03-16 09:24:34'),
(236, 14, 'Gate Pass Approved by CSS', 'Your gate pass request has been approved by CSS .', 'success', 1, '2026-03-16 09:24:34'),
(237, 2, 'Gate Pass Approved', 'Daniel Villano\'s gate pass has been Approved by Jane Fernandez (HR).', 'success', 1, '2026-03-16 09:24:37'),
(238, 36, 'CSS Approved', '1 request approved by CSS — awaiting your review!', 'info', 1, '2026-03-16 09:24:38'),
(239, 13, 'Gate Pass Ready for Exit', 'Daniel Villano\'s gate pass has been fully approved by CSS  and is ready for exit monitoring.', 'info', 0, '2026-03-16 09:24:39'),
(240, 14, 'New Gate Pass Request', 'Ronalyn Barsicula submitted a gate pass request requiring your approval.', 'info', 1, '2026-03-16 09:25:37'),
(241, 2, 'New Gate Pass Request', 'Ronalyn Barsicula submitted a gate pass request pending CSS approval.', 'info', 1, '2026-03-16 09:25:41'),
(242, 6, 'Gate Pass Approved by Faculty', 'Your gate pass request has been approved by Faculty Daniel Villano. Remarks: sgeh', 'success', 1, '2026-03-16 09:26:04'),
(243, 6, 'Gate Pass Approved by CSS', 'Your gate pass request has been approved by CSS .', 'success', 1, '2026-03-16 09:26:14'),
(244, 13, 'Gate Pass Ready for Exit', 'Ronalyn Barsicula\'s gate pass has been fully approved by CSS  and is ready for exit monitoring.', 'info', 0, '2026-03-16 09:26:18'),
(245, 36, 'New Gate Pass Request', 'Daniel Villano submitted a gate pass request requiring your approval.', 'info', 1, '2026-03-16 09:30:23'),
(246, 36, 'New Request', '1 new gate pass request received!', 'info', 1, '2026-03-16 09:30:28'),
(247, 14, 'Gate Pass Approved', 'Your gate pass request has been approved by Jane Fernandez (HR).', 'success', 1, '2026-03-16 09:30:34'),
(248, 14, 'HR Approval', 'Your gate pass was approved by HR!', 'success', 1, '2026-03-16 09:30:37'),
(249, 36, 'CSS Approved', '1 request approved by CSS — awaiting your review!', 'info', 1, '2026-03-16 09:30:37'),
(250, 2, 'Gate Pass Approved', 'Daniel Villano\'s gate pass has been Approved by Jane Fernandez (HR).', 'success', 1, '2026-03-16 09:30:39'),
(251, 36, 'New Gate Pass Request', 'Daniel Villano submitted a gate pass request requiring your approval.', 'info', 1, '2026-03-16 09:33:50'),
(252, 36, 'New Request', '1 new gate pass request received!', 'info', 1, '2026-03-16 09:33:54'),
(253, 14, 'Gate Pass Approved', 'Your gate pass request has been approved by Jane Fernandez (HR).', 'success', 1, '2026-03-16 09:34:07'),
(254, 14, 'HR Approval', 'Your gate pass was approved by HR!', 'success', 1, '2026-03-16 09:34:08'),
(255, 36, 'CSS Approved', '1 request approved by CSS — awaiting your review!', 'info', 1, '2026-03-16 09:34:08'),
(256, 2, 'Gate Pass Approved', 'Daniel Villano\'s gate pass has been Approved by Jane Fernandez (HR).', 'success', 1, '2026-03-16 09:34:11'),
(257, 36, 'New Gate Pass Request', 'Daniel Villano submitted a gate pass request requiring your approval.', 'info', 0, '2026-03-16 09:41:38'),
(258, 36, 'New Request', '1 new gate pass request received!', 'info', 0, '2026-03-16 09:41:43'),
(259, 14, 'Gate Pass Approved', 'Your gate pass request has been approved by Jane Fernandez (HR).', 'success', 0, '2026-03-16 09:42:08'),
(260, 2, 'Gate Pass Approved', 'Daniel Villano\'s gate pass has been Approved by Jane Fernandez (HR).', 'success', 0, '2026-03-16 09:42:12'),
(261, 36, 'CSS Approved', '1 request approved by CSS — awaiting your review!', 'info', 0, '2026-03-16 09:42:12'),
(262, 14, 'HR Approval', 'Your gate pass was approved by HR!', 'success', 0, '2026-03-16 09:42:13'),
(263, 36, 'New Gate Pass Request', 'Daniel Villano submitted a gate pass request requiring your approval.', 'info', 0, '2026-03-16 09:51:12'),
(264, 36, 'New Request', '1 new gate pass request received!', 'info', 0, '2026-03-16 09:51:13'),
(265, 14, 'Gate Pass Approved', 'Your gate pass request has been approved by Jane Fernandez (HR).', 'success', 0, '2026-03-16 09:51:18'),
(266, 14, 'HR Approval', 'Your gate pass was approved by HR!', 'success', 0, '2026-03-16 09:51:19'),
(267, 36, 'CSS Approved', '1 request approved by CSS — awaiting your review!', 'info', 0, '2026-03-16 09:51:23'),
(268, 2, 'Gate Pass Approved', 'Daniel Villano\'s gate pass has been Approved by Jane Fernandez (HR).', 'success', 0, '2026-03-16 09:51:23'),
(269, 14, 'New Gate Pass Request', 'Gabriel Castillo submitted a gate pass request requiring your approval.', 'info', 0, '2026-03-17 08:53:38'),
(270, 2, 'New Gate Pass Request', 'Gabriel Castillo submitted a gate pass request pending CSS approval.', 'info', 0, '2026-03-17 08:53:42'),
(271, 38, 'Gate Pass Approved by CSS', 'Your gate pass request has been approved by CSS .', 'success', 0, '2026-03-17 08:53:50'),
(272, 13, 'Gate Pass Ready for Exit', 'Gabriel Castillo\'s gate pass has been fully approved by CSS  and is ready for exit monitoring.', 'info', 0, '2026-03-17 08:53:55'),
(273, 39, 'Gate Pass Ready for Exit', 'Gabriel Castillo\'s gate pass has been fully approved by CSS  and is ready for exit monitoring.', 'info', 0, '2026-03-17 08:53:59'),
(274, 38, 'Gate Pass Approved by Faculty', 'Your gate pass request has been approved by Faculty Daniel Villano. Remarks: asdasda', 'success', 0, '2026-03-17 08:54:21');

-- --------------------------------------------------------

--
-- Table structure for table `password_resets`
--

CREATE TABLE `password_resets` (
  `id` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `token` varchar(64) NOT NULL,
  `expires_at` datetime NOT NULL,
  `used` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `password_resets`
--

INSERT INTO `password_resets` (`id`, `email`, `token`, `expires_at`, `used`, `created_at`) VALUES
(11, 'css@panpacificu.edu.ph', '549f21c2a1b9f01a4aebcc6aaf53c15da772aa5917572f9cee3d4d5baf44f8f8', '2026-03-10 14:35:17', 0, '2026-03-10 12:35:17'),
(16, 'example@panpacificu.edu.ph', '98d79c495de0c06144017112398c647eaa804ec7e6d3348d0886d0350a91cb33', '2026-03-10 14:40:31', 0, '2026-03-10 12:40:31'),
(18, 'steven.agustin.ecoast@panpacificu.edu.ph', '49647d6541ef4e3dd3d5e685031594cb0f7ba253cb17621a9d27de546d3ff7b5', '2026-03-10 14:46:15', 1, '2026-03-10 12:46:15'),
(19, 'xnatsu25@gmail.com', '79180fa055196761e27b61d5e628e50b646850941771e743172fc430afd13fca', '2026-03-10 18:18:55', 1, '2026-03-10 16:18:55');

-- --------------------------------------------------------

--
-- Table structure for table `system_settings`
--

CREATE TABLE `system_settings` (
  `id` int(11) NOT NULL,
  `setting_key` varchar(100) NOT NULL,
  `setting_value` text NOT NULL,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `system_settings`
--

INSERT INTO `system_settings` (`id`, `setting_key`, `setting_value`, `updated_at`) VALUES
(1, 'maintenance_mode', '0', '2026-03-16 09:42:54'),
(2, 'maintenance_message', 'The Gate Pass System is currently under maintenance. Please try again later.', '2026-03-15 08:48:12'),
(3, 'sidebar_width', '300', '2026-03-15 10:51:01');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `user_id` int(11) NOT NULL,
  `id_number` varchar(255) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('student','faculty','css','guard','hr') NOT NULL,
  `status` enum('active','inactive') DEFAULT 'active',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `first_name` varchar(255) DEFAULT NULL,
  `last_name` varchar(255) DEFAULT NULL,
  `middle_initial` varchar(255) DEFAULT NULL,
  `department` varchar(255) DEFAULT NULL,
  `program` varchar(255) DEFAULT NULL,
  `year_level` varchar(255) DEFAULT NULL,
  `position` varchar(100) DEFAULT 'Faculty'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `id_number`, `email`, `password`, `role`, `status`, `created_at`, `first_name`, `last_name`, `middle_initial`, `department`, `program`, `year_level`, `position`) VALUES
(2, '', 'css@panpacificu.edu.ph', '$2y$10$zD7Nz5bzI/hLqfh.jyK8Ru0aYjOE4s6uGEbyta35eQ5UR2W6SMqQ.', 'css', 'active', '2026-01-25 04:31:29', NULL, NULL, NULL, NULL, NULL, NULL, ''),
(6, '1231442', 'ronalyn@panpacificu.edu.ph', '$2y$10$sTf2HZPswUjRG3ZiqTXndeXCb72AesCNuqSYFNKZZAUjPgCuKNi76', 'student', 'active', '2026-01-25 07:46:54', 'Ronalyn', 'Barsicula', 'R', 'ECOAST', 'Bachelor of Science in Information Technology', '3rd Year', ''),
(13, '', 'guard@panpacific.edu.ph', '$2y$10$sTf2HZPswUjRG3ZiqTXndeXCb72AesCNuqSYFNKZZAUjPgCuKNi76', 'guard', 'active', '2026-02-12 17:13:28', 'Chief', 'Security', NULL, 'Security Office', NULL, NULL, ''),
(14, '', 'daniel@panpacificu.edu.ph', '$2y$10$kwx2W.OxG.ql9CDUxc0N/eyYOOIuIh0Utuh.Pvhcy7lVLDJfqqJpe', 'faculty', 'active', '2026-02-12 17:37:59', 'Daniel', 'Villano', 'M', 'ECOAST', 'Bachelor of Science in Information Technology', NULL, 'Professor'),
(15, '', 'justin@panpacificu.edu.ph', '$2y$10$PVDhC2CAkoz9SZ1/6.BhN.G5pDc/aXHspw57ILHUGak0122gZxwsW', 'faculty', 'active', '2026-02-19 02:51:36', 'Justin Nichol', 'Pasamonte', 'A', 'ECOAST', 'Bachelor of Science in Information Technology', NULL, 'Professor'),
(22, '1231379', 'blessy@panpacificu.edu.ph', '$2y$10$jo9LqidgsrMQBjhDxhuvo.UTXJIg.L9WpANvGYo0483HmcSv.3DIS', 'student', 'active', '2026-02-21 11:15:29', 'Blessy', 'Ancheta', 'A', 'ECOAST', 'Bachelor of Science in Information Technology', '3rd Year', NULL),
(30, '1231374', 'mayen@panpacificu.edu.ph', '$2y$10$wH4w3ievG2wzYheDJlWr/ux.Vv1WgzOBo7EzwLZy92oypWOzxrumm', 'student', 'active', '2026-03-08 14:47:37', 'Mayen', 'Salvarion', 'A', 'CRIMINOLOGY', 'Bachelor of Science in Criminology', '3rd Year', NULL),
(34, '12313556', 'xnatsu25@gmail.com', '$2y$10$c7ekYoJyTNHOgID.uzjaF.TjeeRW1BpmiAtc3sDJEBW5Onzya.HCm', 'student', 'active', '2026-03-10 15:56:27', 'Natsu', 'Dragneel', 'A', 'ECOAST', 'Bachelor of Science in Information Technology', '3rd Year', NULL),
(36, '', 'hr@panpacificu.edu.ph', '$2y$10$e9KW3N4HqJhxu76nvQbtCeOqP.Vv2iw2Ak1O/IcAk3u2GbaONb0Aa', 'hr', 'active', '2026-03-16 08:38:56', 'Jane', 'Fernandez', 'A', NULL, NULL, NULL, 'Human Resources'),
(37, '1231377', 'steven.agustin.ecoast@panpacificu.edu.ph', '$2y$10$8H7yMh8goNDi6x6xRvsyIu8eqGJObfBdlWJD9Q..dyngCTbxZoAEy', 'student', 'active', '2026-03-17 07:04:02', 'Steven John', 'Agustin', 'A', 'ECOAST', 'Bachelor of Science in Information Technology', '3rd Year', NULL),
(38, '1231247', 'gabriel.castillo.ecoast@panpacificu.edu.ph', '$2y$10$gGUQKXGE14r.yMVRNFWObu1lpSMgnpc0GGk5QGmVKJGwE9YsSSC5m', 'student', 'active', '2026-03-17 07:13:58', 'Gabriel', 'Castillo', 'A', 'ECOAST', 'Bachelor of Science in Information Technology', '3rd Year', NULL),
(39, '', 'sample@panpacificu.edu.ph', '$2y$10$La08liUORnuVPaXpXt7bX.8FGkgnezeIZtgGTwXIg3K8hOBBntmPC', 'guard', 'active', '2026-03-17 08:48:52', 'Sample', 'Sample', 'A', NULL, NULL, NULL, 'Faculty');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `announcements`
--
ALTER TABLE `announcements`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_announcement_creator` (`created_by`);

--
-- Indexes for table `gate_passes`
--
ALTER TABLE `gate_passes`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `control_no` (`control_no`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `is_read` (`is_read`);

--
-- Indexes for table `password_resets`
--
ALTER TABLE `password_resets`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `token` (`token`),
  ADD KEY `idx_token` (`token`),
  ADD KEY `idx_email` (`email`);

--
-- Indexes for table `system_settings`
--
ALTER TABLE `system_settings`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `setting_key` (`setting_key`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `email_2` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `announcements`
--
ALTER TABLE `announcements`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `gate_passes`
--
ALTER TABLE `gate_passes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=92;

--
-- AUTO_INCREMENT for table `notifications`
--
ALTER TABLE `notifications`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=275;

--
-- AUTO_INCREMENT for table `password_resets`
--
ALTER TABLE `password_resets`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT for table `system_settings`
--
ALTER TABLE `system_settings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=40;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `announcements`
--
ALTER TABLE `announcements`
  ADD CONSTRAINT `fk_announcement_creator` FOREIGN KEY (`created_by`) REFERENCES `users` (`user_id`) ON DELETE SET NULL;

--
-- Constraints for table `gate_passes`
--
ALTER TABLE `gate_passes`
  ADD CONSTRAINT `gate_passes_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE;

--
-- Constraints for table `notifications`
--
ALTER TABLE `notifications`
  ADD CONSTRAINT `notifications_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE;
--
-- Database: `healthtrackpro_db`
--
CREATE DATABASE IF NOT EXISTS `healthtrackpro_db` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `healthtrackpro_db`;

-- --------------------------------------------------------

--
-- Table structure for table `bmi_records`
--

CREATE TABLE `bmi_records` (
  `id` int(11) NOT NULL,
  `bmi` varchar(255) NOT NULL,
  `date` varchar(255) NOT NULL,
  `user_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `bmi_records`
--

INSERT INTO `bmi_records` (`id`, `bmi`, `date`, `user_id`) VALUES
(2, 'Your BMI is 125.0 (Obese)', '2025-11-02T17:53:04.833Z', 22),
(3, 'Your BMI is 101.0 (Obese)', '2025-11-02T18:13:39.851Z', 22),
(5, 'Your BMI is 111.1 (Obese)', '2025-11-02T18:24:10.228Z', 22),
(6, 'Your BMI is 125.0 (Obese)', '2025-11-02T18:24:38.573Z', 22);

-- --------------------------------------------------------

--
-- Table structure for table `goals`
--

CREATE TABLE `goals` (
  `id` int(11) NOT NULL,
  `daily_calories` bigint(20) NOT NULL,
  `weight_goal` varchar(200) NOT NULL,
  `user_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `goals`
--

INSERT INTO `goals` (`id`, `daily_calories`, `weight_goal`, `user_id`) VALUES
(2, 1000, '40', 9),
(13, 1000, '45', 20),
(14, 0, '0', 21),
(15, 0, '0', 22);

-- --------------------------------------------------------

--
-- Table structure for table `logs`
--

CREATE TABLE `logs` (
  `id` int(11) NOT NULL,
  `type` varchar(200) NOT NULL,
  `name` varchar(255) NOT NULL,
  `calories` int(11) NOT NULL,
  `time` varchar(200) NOT NULL,
  `user_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `logs`
--

INSERT INTO `logs` (`id`, `type`, `name`, `calories`, `time`, `user_id`) VALUES
(24, 'food', 'Banana', 25, '01:49 AM', 20),
(25, 'food', 'Rice', 21, '01:49 AM', 20),
(26, 'exercise', 'Running', 25, '01:49 AM', 20),
(27, 'exercise', 'Jogging', 10, '01:49 AM', 20),
(28, 'food', 'Banana', 23, '03:05 PM', 9),
(29, 'exercise', 'Running', 50, '03:06 PM', 9),
(30, 'food', 'Banana', 9, '01:23 AM', 22);

-- --------------------------------------------------------

--
-- Table structure for table `tracking`
--

CREATE TABLE `tracking` (
  `tracking_id` int(11) NOT NULL,
  `weight` double NOT NULL,
  `calories` double NOT NULL,
  `steps` double NOT NULL,
  `sleep` double NOT NULL,
  `user_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tracking`
--

INSERT INTO `tracking` (`tracking_id`, `weight`, `calories`, `steps`, `sleep`, `user_id`) VALUES
(0, 8, 90, 8, 90, 9),
(0, 45, 27, 1000, 7, 18),
(0, 70, 21, 1000, 8, 19),
(0, 70, 11, 1000, 8, 20),
(0, 0, 0, 0, 0, 21),
(0, 45, 9, 1000, 9, 22);

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `id` int(11) NOT NULL,
  `fullname` varchar(200) NOT NULL,
  `age` int(11) NOT NULL,
  `birthday` varchar(200) NOT NULL,
  `email` varchar(200) NOT NULL,
  `password` varchar(200) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`id`, `fullname`, `age`, `birthday`, `email`, `password`) VALUES
(9, 'Steve John Agustin', 25, '2025-10-08', 'stevenxd81@yahoo.com', '$2y$10$j2HHAy8HdxMBuAAN2aJJEufY5jhe94W16ztHzYB7YWXFmAg5Cqi4a'),
(20, 'Raiza Jaramillo', 20, '2006-10-21', 'raiza@gmail.com', '$2y$10$Zg9ETZphhyHjrMm7EfncneSPLDhoPTBp6UQwv0A9JKX74HwwsPmf2'),
(21, 'Steven John Agustin', 25, '2000-09-25', 'steven@gmail.com', '$2y$10$EOT.ZE8u2zFSqti.Qsnbr.TLq0O8DHqMnxVtaRRJjs/C7JygpuyeC'),
(22, 'Steven John Agustin', 25, '2000-09-25', 'stevenjohnagustin25@gmail.com', '$2y$10$Io3Yc8nFOhOOmAx7/99yFOCx1xd8ievMZFKUmGb39HHn/wCEpJS4G');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `bmi_records`
--
ALTER TABLE `bmi_records`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `goals`
--
ALTER TABLE `goals`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `logs`
--
ALTER TABLE `logs`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `bmi_records`
--
ALTER TABLE `bmi_records`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `goals`
--
ALTER TABLE `goals`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `logs`
--
ALTER TABLE `logs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;
--
-- Database: `iot`
--
CREATE DATABASE IF NOT EXISTS `iot` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `iot`;

-- --------------------------------------------------------

--
-- Table structure for table `esp_data`
--

CREATE TABLE `esp_data` (
  `id` int(11) NOT NULL,
  `humidity` double NOT NULL,
  `temperature` double NOT NULL,
  `device_id` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `esp_data`
--

INSERT INTO `esp_data` (`id`, `humidity`, `temperature`, `device_id`) VALUES
(1, 75, 25.3, 'ESP32_001');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `esp_data`
--
ALTER TABLE `esp_data`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `esp_data`
--
ALTER TABLE `esp_data`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
--
-- Database: `online_parent_notification-db`
--
CREATE DATABASE IF NOT EXISTS `online_parent_notification-db` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `online_parent_notification-db`;

-- --------------------------------------------------------

--
-- Table structure for table `grades`
--

CREATE TABLE `grades` (
  `id` int(11) NOT NULL,
  `student_id` varchar(100) NOT NULL,
  `subject` varchar(100) NOT NULL,
  `grade` int(11) NOT NULL,
  `remarks` varchar(50) NOT NULL,
  `image_path` varchar(200) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `grades`
--

INSERT INTO `grades` (`id`, `student_id`, `subject`, `grade`, `remarks`, `image_path`) VALUES
(26, '1231514', 'web system', 90, 'excellent', 'http://localhost/Online-parent-notification/backend/uploads/Grade.jpg'),
(27, '1231514', 'cloud computing', 90, 'excellent', 'http://localhost/Online-parent-notification/backend/uploads/Grade.jpg'),
(28, '1231514', 'web system', 90, 'excellent', 'http://localhost/Online-parent-notification/backend/uploads/Grade.jpg');

-- --------------------------------------------------------

--
-- Table structure for table `students`
--

CREATE TABLE `students` (
  `id` int(11) NOT NULL,
  `student_id` varchar(20) NOT NULL,
  `full_name` varchar(100) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `parent_email` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `students`
--

INSERT INTO `students` (`id`, `student_id`, `full_name`, `username`, `password`, `parent_email`) VALUES
(10, '1231514', 'Maxene Franco', 'maxene123', '$2y$10$3B33AecjfLaWjYBwioY89eoBSl8ZwDkEqVX6urthVIzRyzV4h.5oG', 'maxene.franco.ecoast@panpacificu.edu.ph');

-- --------------------------------------------------------

--
-- Table structure for table `teachers`
--

CREATE TABLE `teachers` (
  `id` int(11) NOT NULL,
  `fullname` varchar(255) NOT NULL,
  `username` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `teachers`
--

INSERT INTO `teachers` (`id`, `fullname`, `username`, `password`, `email`, `created_at`) VALUES
(8, 'Daniel Villano', 'villano123', '$2y$10$4UX3dfzxySiEmLwc7Np0B.XFhhirU0zU4PvYiXZ3cpphFf.P9N4IW', 'daniel@gmail.com', '2025-11-20 05:35:42');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `grades`
--
ALTER TABLE `grades`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `students`
--
ALTER TABLE `students`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `student_id` (`student_id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- Indexes for table `teachers`
--
ALTER TABLE `teachers`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `grades`
--
ALTER TABLE `grades`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=29;

--
-- AUTO_INCREMENT for table `students`
--
ALTER TABLE `students`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `teachers`
--
ALTER TABLE `teachers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;
--
-- Database: `phpmyadmin`
--
CREATE DATABASE IF NOT EXISTS `phpmyadmin` DEFAULT CHARACTER SET utf8 COLLATE utf8_bin;
USE `phpmyadmin`;

-- --------------------------------------------------------

--
-- Table structure for table `pma__bookmark`
--

CREATE TABLE `pma__bookmark` (
  `id` int(10) UNSIGNED NOT NULL,
  `dbase` varchar(255) NOT NULL DEFAULT '',
  `user` varchar(255) NOT NULL DEFAULT '',
  `label` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '',
  `query` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='Bookmarks';

-- --------------------------------------------------------

--
-- Table structure for table `pma__central_columns`
--

CREATE TABLE `pma__central_columns` (
  `db_name` varchar(64) NOT NULL,
  `col_name` varchar(64) NOT NULL,
  `col_type` varchar(64) NOT NULL,
  `col_length` text DEFAULT NULL,
  `col_collation` varchar(64) NOT NULL,
  `col_isNull` tinyint(1) NOT NULL,
  `col_extra` varchar(255) DEFAULT '',
  `col_default` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='Central list of columns';

-- --------------------------------------------------------

--
-- Table structure for table `pma__column_info`
--

CREATE TABLE `pma__column_info` (
  `id` int(5) UNSIGNED NOT NULL,
  `db_name` varchar(64) NOT NULL DEFAULT '',
  `table_name` varchar(64) NOT NULL DEFAULT '',
  `column_name` varchar(64) NOT NULL DEFAULT '',
  `comment` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '',
  `mimetype` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '',
  `transformation` varchar(255) NOT NULL DEFAULT '',
  `transformation_options` varchar(255) NOT NULL DEFAULT '',
  `input_transformation` varchar(255) NOT NULL DEFAULT '',
  `input_transformation_options` varchar(255) NOT NULL DEFAULT ''
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='Column information for phpMyAdmin';

-- --------------------------------------------------------

--
-- Table structure for table `pma__designer_settings`
--

CREATE TABLE `pma__designer_settings` (
  `username` varchar(64) NOT NULL,
  `settings_data` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='Settings related to Designer';

-- --------------------------------------------------------

--
-- Table structure for table `pma__export_templates`
--

CREATE TABLE `pma__export_templates` (
  `id` int(5) UNSIGNED NOT NULL,
  `username` varchar(64) NOT NULL,
  `export_type` varchar(10) NOT NULL,
  `template_name` varchar(64) NOT NULL,
  `template_data` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='Saved export templates';

-- --------------------------------------------------------

--
-- Table structure for table `pma__favorite`
--

CREATE TABLE `pma__favorite` (
  `username` varchar(64) NOT NULL,
  `tables` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='Favorite tables';

-- --------------------------------------------------------

--
-- Table structure for table `pma__history`
--

CREATE TABLE `pma__history` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `username` varchar(64) NOT NULL DEFAULT '',
  `db` varchar(64) NOT NULL DEFAULT '',
  `table` varchar(64) NOT NULL DEFAULT '',
  `timevalue` timestamp NOT NULL DEFAULT current_timestamp(),
  `sqlquery` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='SQL history for phpMyAdmin';

-- --------------------------------------------------------

--
-- Table structure for table `pma__navigationhiding`
--

CREATE TABLE `pma__navigationhiding` (
  `username` varchar(64) NOT NULL,
  `item_name` varchar(64) NOT NULL,
  `item_type` varchar(64) NOT NULL,
  `db_name` varchar(64) NOT NULL,
  `table_name` varchar(64) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='Hidden items of navigation tree';

-- --------------------------------------------------------

--
-- Table structure for table `pma__pdf_pages`
--

CREATE TABLE `pma__pdf_pages` (
  `db_name` varchar(64) NOT NULL DEFAULT '',
  `page_nr` int(10) UNSIGNED NOT NULL,
  `page_descr` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT ''
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='PDF relation pages for phpMyAdmin';

-- --------------------------------------------------------

--
-- Table structure for table `pma__recent`
--

CREATE TABLE `pma__recent` (
  `username` varchar(64) NOT NULL,
  `tables` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='Recently accessed tables';

--
-- Dumping data for table `pma__recent`
--

INSERT INTO `pma__recent` (`username`, `tables`) VALUES
('root', '[{\"db\":\"training_ground\",\"table\":\"accounts\"},{\"db\":\"canteen_db\",\"table\":\"users\"},{\"db\":\"reading_tracker\",\"table\":\"books\"},{\"db\":\"reading_tracker\",\"table\":\"users\"},{\"db\":\"daily_meds\",\"table\":\"medicines\"},{\"db\":\"daily_meds\",\"table\":\"users\"},{\"db\":\"face_recognition\",\"table\":\"student_information\"},{\"db\":\"face_recognition\",\"table\":\"course\"},{\"db\":\"face_recognition\",\"table\":\"attendance_now\"},{\"db\":\"face_recognition\",\"table\":\"attendance_history\"}]');

-- --------------------------------------------------------

--
-- Table structure for table `pma__relation`
--

CREATE TABLE `pma__relation` (
  `master_db` varchar(64) NOT NULL DEFAULT '',
  `master_table` varchar(64) NOT NULL DEFAULT '',
  `master_field` varchar(64) NOT NULL DEFAULT '',
  `foreign_db` varchar(64) NOT NULL DEFAULT '',
  `foreign_table` varchar(64) NOT NULL DEFAULT '',
  `foreign_field` varchar(64) NOT NULL DEFAULT ''
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='Relation table';

-- --------------------------------------------------------

--
-- Table structure for table `pma__savedsearches`
--

CREATE TABLE `pma__savedsearches` (
  `id` int(5) UNSIGNED NOT NULL,
  `username` varchar(64) NOT NULL DEFAULT '',
  `db_name` varchar(64) NOT NULL DEFAULT '',
  `search_name` varchar(64) NOT NULL DEFAULT '',
  `search_data` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='Saved searches';

-- --------------------------------------------------------

--
-- Table structure for table `pma__table_coords`
--

CREATE TABLE `pma__table_coords` (
  `db_name` varchar(64) NOT NULL DEFAULT '',
  `table_name` varchar(64) NOT NULL DEFAULT '',
  `pdf_page_number` int(11) NOT NULL DEFAULT 0,
  `x` float UNSIGNED NOT NULL DEFAULT 0,
  `y` float UNSIGNED NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='Table coordinates for phpMyAdmin PDF output';

-- --------------------------------------------------------

--
-- Table structure for table `pma__table_info`
--

CREATE TABLE `pma__table_info` (
  `db_name` varchar(64) NOT NULL DEFAULT '',
  `table_name` varchar(64) NOT NULL DEFAULT '',
  `display_field` varchar(64) NOT NULL DEFAULT ''
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='Table information for phpMyAdmin';

-- --------------------------------------------------------

--
-- Table structure for table `pma__table_uiprefs`
--

CREATE TABLE `pma__table_uiprefs` (
  `username` varchar(64) NOT NULL,
  `db_name` varchar(64) NOT NULL,
  `table_name` varchar(64) NOT NULL,
  `prefs` text NOT NULL,
  `last_update` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='Tables'' UI preferences';

-- --------------------------------------------------------

--
-- Table structure for table `pma__tracking`
--

CREATE TABLE `pma__tracking` (
  `db_name` varchar(64) NOT NULL,
  `table_name` varchar(64) NOT NULL,
  `version` int(10) UNSIGNED NOT NULL,
  `date_created` datetime NOT NULL,
  `date_updated` datetime NOT NULL,
  `schema_snapshot` text NOT NULL,
  `schema_sql` text DEFAULT NULL,
  `data_sql` longtext DEFAULT NULL,
  `tracking` set('UPDATE','REPLACE','INSERT','DELETE','TRUNCATE','CREATE DATABASE','ALTER DATABASE','DROP DATABASE','CREATE TABLE','ALTER TABLE','RENAME TABLE','DROP TABLE','CREATE INDEX','DROP INDEX','CREATE VIEW','ALTER VIEW','DROP VIEW') DEFAULT NULL,
  `tracking_active` int(1) UNSIGNED NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='Database changes tracking for phpMyAdmin';

-- --------------------------------------------------------

--
-- Table structure for table `pma__userconfig`
--

CREATE TABLE `pma__userconfig` (
  `username` varchar(64) NOT NULL,
  `timevalue` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `config_data` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='User preferences storage for phpMyAdmin';

--
-- Dumping data for table `pma__userconfig`
--

INSERT INTO `pma__userconfig` (`username`, `timevalue`, `config_data`) VALUES
('root', '2025-11-28 07:34:50', '{\"Console\\/Mode\":\"collapse\",\"NavigationWidth\":406}');

-- --------------------------------------------------------

--
-- Table structure for table `pma__usergroups`
--

CREATE TABLE `pma__usergroups` (
  `usergroup` varchar(64) NOT NULL,
  `tab` varchar(64) NOT NULL,
  `allowed` enum('Y','N') NOT NULL DEFAULT 'N'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='User groups with configured menu items';

-- --------------------------------------------------------

--
-- Table structure for table `pma__users`
--

CREATE TABLE `pma__users` (
  `username` varchar(64) NOT NULL,
  `usergroup` varchar(64) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='Users and their assignments to user groups';

--
-- Indexes for dumped tables
--

--
-- Indexes for table `pma__bookmark`
--
ALTER TABLE `pma__bookmark`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `pma__central_columns`
--
ALTER TABLE `pma__central_columns`
  ADD PRIMARY KEY (`db_name`,`col_name`);

--
-- Indexes for table `pma__column_info`
--
ALTER TABLE `pma__column_info`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `db_name` (`db_name`,`table_name`,`column_name`);

--
-- Indexes for table `pma__designer_settings`
--
ALTER TABLE `pma__designer_settings`
  ADD PRIMARY KEY (`username`);

--
-- Indexes for table `pma__export_templates`
--
ALTER TABLE `pma__export_templates`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `u_user_type_template` (`username`,`export_type`,`template_name`);

--
-- Indexes for table `pma__favorite`
--
ALTER TABLE `pma__favorite`
  ADD PRIMARY KEY (`username`);

--
-- Indexes for table `pma__history`
--
ALTER TABLE `pma__history`
  ADD PRIMARY KEY (`id`),
  ADD KEY `username` (`username`,`db`,`table`,`timevalue`);

--
-- Indexes for table `pma__navigationhiding`
--
ALTER TABLE `pma__navigationhiding`
  ADD PRIMARY KEY (`username`,`item_name`,`item_type`,`db_name`,`table_name`);

--
-- Indexes for table `pma__pdf_pages`
--
ALTER TABLE `pma__pdf_pages`
  ADD PRIMARY KEY (`page_nr`),
  ADD KEY `db_name` (`db_name`);

--
-- Indexes for table `pma__recent`
--
ALTER TABLE `pma__recent`
  ADD PRIMARY KEY (`username`);

--
-- Indexes for table `pma__relation`
--
ALTER TABLE `pma__relation`
  ADD PRIMARY KEY (`master_db`,`master_table`,`master_field`),
  ADD KEY `foreign_field` (`foreign_db`,`foreign_table`);

--
-- Indexes for table `pma__savedsearches`
--
ALTER TABLE `pma__savedsearches`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `u_savedsearches_username_dbname` (`username`,`db_name`,`search_name`);

--
-- Indexes for table `pma__table_coords`
--
ALTER TABLE `pma__table_coords`
  ADD PRIMARY KEY (`db_name`,`table_name`,`pdf_page_number`);

--
-- Indexes for table `pma__table_info`
--
ALTER TABLE `pma__table_info`
  ADD PRIMARY KEY (`db_name`,`table_name`);

--
-- Indexes for table `pma__table_uiprefs`
--
ALTER TABLE `pma__table_uiprefs`
  ADD PRIMARY KEY (`username`,`db_name`,`table_name`);

--
-- Indexes for table `pma__tracking`
--
ALTER TABLE `pma__tracking`
  ADD PRIMARY KEY (`db_name`,`table_name`,`version`);

--
-- Indexes for table `pma__userconfig`
--
ALTER TABLE `pma__userconfig`
  ADD PRIMARY KEY (`username`);

--
-- Indexes for table `pma__usergroups`
--
ALTER TABLE `pma__usergroups`
  ADD PRIMARY KEY (`usergroup`,`tab`,`allowed`);

--
-- Indexes for table `pma__users`
--
ALTER TABLE `pma__users`
  ADD PRIMARY KEY (`username`,`usergroup`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `pma__bookmark`
--
ALTER TABLE `pma__bookmark`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `pma__column_info`
--
ALTER TABLE `pma__column_info`
  MODIFY `id` int(5) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `pma__export_templates`
--
ALTER TABLE `pma__export_templates`
  MODIFY `id` int(5) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `pma__history`
--
ALTER TABLE `pma__history`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `pma__pdf_pages`
--
ALTER TABLE `pma__pdf_pages`
  MODIFY `page_nr` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `pma__savedsearches`
--
ALTER TABLE `pma__savedsearches`
  MODIFY `id` int(5) UNSIGNED NOT NULL AUTO_INCREMENT;
--
-- Database: `pig_age_calculator`
--
CREATE DATABASE IF NOT EXISTS `pig_age_calculator` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `pig_age_calculator`;

-- --------------------------------------------------------

--
-- Table structure for table `accounts`
--

CREATE TABLE `accounts` (
  `id` int(11) NOT NULL,
  `username` varchar(200) NOT NULL,
  `password` varchar(200) NOT NULL,
  `date_created` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `accounts`
--

INSERT INTO `accounts` (`id`, `username`, `password`, `date_created`) VALUES
(3, 'ronalyn@gmail.com', '$2y$10$BKY9iAnhoshxHzxvC3TVge4hoeGWZJW8M/bFmC7XtSL8JQGQMCcOe', '2025-10-22 01:49:52'),
(4, 'chari@gmail.com', '$2y$10$yu4zq3jknGmVexNEhGGr9e90lTu6s6r0y9rLy3gPrxK2XCDCY.tHW', '2025-10-22 01:51:29'),
(5, 'sample@gmail.com', '$2y$10$mrAIzF.sX8hxe7ljjfhagufddDTpLThy9RD2ZMUbKC4N.8D26RVFu', '2025-10-22 01:53:58'),
(7, 'erza@gmail.com', '$2y$10$FKB6R5GAyUCxjO3x7XdTdOQ2l9WuW.Iaik5mShEsvqMgEtaNm1HMe', '2025-10-22 02:00:50'),
(8, 'mayen', '$2y$10$Vj.WencLnalVEfOG.P7ah.afO5sq25dAYwTWB3AS1Rp5sUWZ9P1lK', '2025-10-22 14:18:36'),
(9, 'stevenjohnagustin25@gmail.com', '$2y$10$i83xYuL6pKjOzpxeBwAIrug4WGOpZDSZGm6uK8IK7789y933OVzNy', '2025-11-18 00:15:47'),
(10, 'luka@gmail.com', '$2y$10$7fcTZCRlQTPMyz0oPmAuO.Ve2PEBeguTHk34eByQTRefoCXqF2pgu', '2025-11-18 07:59:22');

-- --------------------------------------------------------

--
-- Table structure for table `expenses`
--

CREATE TABLE `expenses` (
  `id` int(11) NOT NULL,
  `report_id` int(11) NOT NULL,
  `bought` varchar(255) DEFAULT NULL,
  `qty` double DEFAULT NULL,
  `price` double DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `pig_data`
--

CREATE TABLE `pig_data` (
  `id` int(11) NOT NULL,
  `group_name` varchar(200) NOT NULL,
  `mothers_name` varchar(100) NOT NULL,
  `pig_breed` varchar(100) NOT NULL,
  `pig_age` varchar(200) NOT NULL,
  `notes` varchar(200) NOT NULL,
  `date` varchar(100) NOT NULL,
  `user_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `pig_data`
--

INSERT INTO `pig_data` (`id`, `group_name`, `mothers_name`, `pig_breed`, `pig_age`, `notes`, `date`, `user_id`) VALUES
(4, 'Mamasita na group', 'Sita', 'Native', '0 years, 3 months, 8 days', 'For birthday', '2025-04-09', 4),
(36, 'asd', 'asd', 'asd', '0 years, 0 months, 0 days', 'asdasdas', '2025-10-22', 4),
(38, 'sdf', 'sdf', 'sdfsd', '0 years, 0 months, 0 days', 'sdfsdfsdf', '2025-10-22', 4),
(39, 'Ronalyn', 'sample', 'sample', '0 years, 0 months, 0 days', 'sample sample', '2025-10-22', 3),
(40, 'Mayen', 'asda', 'asdas', '0 years, 0 months, 0 days', 'asdasd', '2025-10-22', 8),
(43, 'Group A', 'Mama Pig 1', 'Large White', '8 months', 'Healthy and active, vaccinated on schedule.', '2025-10-25', 3),
(45, '', '', '', '', '', '', 3),
(46, '', '', '', '', '', '', 3);

-- --------------------------------------------------------

--
-- Table structure for table `pig_reports`
--

CREATE TABLE `pig_reports` (
  `id` int(11) NOT NULL,
  `expenses` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`expenses`)),
  `sales` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`sales`)),
  `total_expense` decimal(10,2) NOT NULL,
  `total_revenue` decimal(10,2) NOT NULL,
  `profit` decimal(10,2) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `reports`
--

CREATE TABLE `reports` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `sales`
--

CREATE TABLE `sales` (
  `id` int(11) NOT NULL,
  `report_id` int(11) NOT NULL,
  `pig` varchar(255) DEFAULT NULL,
  `kilo` double DEFAULT NULL,
  `date_bought` date DEFAULT NULL,
  `buyer` varchar(255) DEFAULT NULL,
  `price` double DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `accounts`
--
ALTER TABLE `accounts`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `expenses`
--
ALTER TABLE `expenses`
  ADD PRIMARY KEY (`id`),
  ADD KEY `report_id` (`report_id`);

--
-- Indexes for table `pig_data`
--
ALTER TABLE `pig_data`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `pig_reports`
--
ALTER TABLE `pig_reports`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `reports`
--
ALTER TABLE `reports`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `sales`
--
ALTER TABLE `sales`
  ADD PRIMARY KEY (`id`),
  ADD KEY `report_id` (`report_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `accounts`
--
ALTER TABLE `accounts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `expenses`
--
ALTER TABLE `expenses`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `pig_data`
--
ALTER TABLE `pig_data`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=47;

--
-- AUTO_INCREMENT for table `pig_reports`
--
ALTER TABLE `pig_reports`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `reports`
--
ALTER TABLE `reports`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `sales`
--
ALTER TABLE `sales`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `expenses`
--
ALTER TABLE `expenses`
  ADD CONSTRAINT `expenses_ibfk_1` FOREIGN KEY (`report_id`) REFERENCES `reports` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `sales`
--
ALTER TABLE `sales`
  ADD CONSTRAINT `sales_ibfk_1` FOREIGN KEY (`report_id`) REFERENCES `reports` (`id`) ON DELETE CASCADE;
--
-- Database: `reading_tracker`
--
CREATE DATABASE IF NOT EXISTS `reading_tracker` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `reading_tracker`;

-- --------------------------------------------------------

--
-- Table structure for table `books`
--

CREATE TABLE `books` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `title` varchar(255) NOT NULL,
  `author` varchar(255) NOT NULL,
  `status` varchar(50) DEFAULT NULL,
  `category` varchar(255) NOT NULL,
  `schedule` date DEFAULT NULL,
  `note` text DEFAULT NULL,
  `Contents` varchar(255) NOT NULL,
  `reminder_sent` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `books`
--

INSERT INTO `books` (`id`, `user_id`, `title`, `author`, `status`, `category`, `schedule`, `note`, `Contents`, `reminder_sent`) VALUES
(1, 1, 'The Great Gatsbi', 'F. Scott Fitzgerald', 'To Read', 'Manga', '2025-10-23', 'Classic literature', '', 0),
(2, 1, 'solo leveling', 'michael', 'To Read', '', '2025-10-09', 'dsadas', '', 0),
(18, 1, 'dsadadsa', 'dasdad', 'To Read', '', '2025-10-24', 'fdasfdas', '', 0);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `email`, `password`, `created_at`) VALUES
(1, 'michaellingal36@gmail.com', '$2y$10$1KAG5PFSUpMCJBbeYzdmfON40aGPkNfuc6j83fZJKt6Xbl9jFnChG', '2025-10-08 22:08:49'),
(6, 'michaellingal34@gmail.com', '$2y$10$j/HPRMDqZI.9UtS2bGcsYOVEVp21e/ZpaqKI5T03SMOwKFT/xMzrG', '2025-10-26 14:11:45'),
(7, 'malingal37@gmail.com', '$2y$10$M1svRluJHazt3vp5stOa3.wiEqkcqTahYdAFCwSnbHi3bW.AROuHK', '2025-10-26 14:23:03');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `books`
--
ALTER TABLE `books`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_user_book` (`user_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `books`
--
ALTER TABLE `books`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `books`
--
ALTER TABLE `books`
  ADD CONSTRAINT `fk_user_book` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
--
-- Database: `review_planner`
--
CREATE DATABASE IF NOT EXISTS `review_planner` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `review_planner`;

-- --------------------------------------------------------

--
-- Table structure for table `accounts`
--

CREATE TABLE `accounts` (
  `id` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `accounts`
--

INSERT INTO `accounts` (`id`, `email`, `password`) VALUES
(5, 'stevenjohnagustin25@gmail.com', '$2b$10$OYBV7lIY8ajMEOgtjTgkeupKC1FRumwiRwtFNpLZrIJbPiehLqe/K'),
(6, 'stevenxd81@yahoo.com', '$2b$10$LssVEaUFhKpnHX/kVn.eSuLEeBOfJdKLXU3sXMT4yFcQBtAvkyETa'),
(7, 'andrea@gmail.com', '$2b$10$jzw9ep85u/fHcP.mUYNt9eewClUNqtUwTOoJgWX/Ewqi4KOz5rIrO'),
(8, 'andrea1@gmail.com', '$2b$10$HQVRz6S1ZYpJxI9XTFd3wuBosQ7jMcA259CnXpV1vtqblxQ9JS/lu'),
(9, 'andrea2@gmail.com', '$2b$10$1RR3KyoyrH07BZYeklXO9e.dmMCiYMsywj8OjeIS/8kpv4ZeJt.ru'),
(11, 'andrea3@gmail.com', '$2b$10$jd4v9pJWVB7zFD7VV7LjRe05bCXQasAkWJpqLfKk2yGcV0sJWPKBW'),
(12, 'robuza@thns.com', '$2b$10$gI8vqaj7H9d6YlrW0LtlzOrxR4gABIR9hGnZ/rzkv9EX0mh4ecqxK'),
(13, 'xnatsu25@gmail.com', '$2b$10$.EU64MEA6vG5tssUaKBo/u/uJxtEo66766bRQhaqeKXbXSkYIwPzS'),
(14, 'andrealachica297@gmail.com', '$2b$10$OU1Qajr2xErXrmHel9wIxuGbyl8qCdnRe2Zx1lWE9vh5ISKMW/vZS');

-- --------------------------------------------------------

--
-- Table structure for table `exam_reviewer`
--

CREATE TABLE `exam_reviewer` (
  `id` int(11) NOT NULL,
  `sent` int(11) NOT NULL,
  `topic` varchar(200) NOT NULL,
  `date` varchar(100) NOT NULL,
  `note` varchar(1000) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `quiz_reviewer`
--

CREATE TABLE `quiz_reviewer` (
  `id` int(11) NOT NULL,
  `topic` varchar(200) NOT NULL,
  `date` varchar(100) NOT NULL,
  `note` varchar(1000) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `task_progress`
--

CREATE TABLE `task_progress` (
  `task_id` int(11) NOT NULL,
  `review_topic` varchar(255) NOT NULL,
  `date` varchar(255) NOT NULL,
  `review_type` varchar(255) NOT NULL,
  `status` varchar(255) NOT NULL,
  `note` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `user_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `task_progress`
--

INSERT INTO `task_progress` (`task_id`, `review_topic`, `date`, `review_type`, `status`, `note`, `email`, `user_id`) VALUES
(49, 'STEVE', '2025-10-27T01:45', 'Exam', 'Done', 'STEVE', 'stevenjohnagustin25@gmail.com', 5),
(50, 'XNATSU', '2025-10-27T01:45', 'Exam', 'In Progress', 'XNATSU', 'xnatsu25@gmail.com', 13),
(51, 'XNATSU', '2025-10-27T01:49', 'Exam', 'In Progress', 'XNATSU', 'xnatsu25@gmail.com', 13),
(53, 'Sample', '2025-11-01T14:04', 'Exam', 'In Progress', 'sample, sample', 'stevenxd81@yahoo.com', 6),
(59, 'Programming', '2025-11-03T00:47', 'Exam', 'In Progress', 'sample sample', 'stevenjohnagustin25@gmail.com', 5),
(60, 'Programming', '2025-11-03T00:43', 'Exam', 'Decline', 'sample sample', 'stevenjohnagustin25@gmail.com', 5),
(61, 'jkljkljk', '2025-11-03T00:44', 'Exam', 'Decline', 'sample sample', 'stevenjohnagustin25@gmail.com', 5),
(70, 'Cloud Computing Lec 2', '2025-11-04T23:48', 'Exam', 'In Progress', 'Focus', 'andrealachica297@gmail.com', 14),
(71, 'Focus on \"CHAPTER 6: Development Life Cycle”', '2025-11-04T15:57', 'Exam', 'In Progress', 'Focus this one', 'andrealachica297@gmail.com', 14),
(72, 'Introduction to Platform Technologies', '2025-11-04T23:58', 'Quiz', 'In Progress', 'The Quiz number 1 covers the Chapter 1:', 'andrealachica297@gmail.com', 14),
(73, 'ntroduction to Platform Technologies,', '2025-11-05T00:00', 'Quiz', 'Decline', 'Sample, sample', 'andrealachica297@gmail.com', 14),
(74, 'Lesson 1: The Computer Revolution.', '2025-11-05T00:00', 'Quiz', 'In Progress', 'Sample, sample', 'andrealachica297@gmail.com', 14),
(75, 'Computer Graphics and animations', '2025-11-05T00:06', 'Exam', 'In Progress', 'Focus', 'andrealachica297@gmail.com', 14),
(76, 'Review the fundamental of computer graphics', '2025-11-05T00:07', 'Exam', 'Done', 'Sample, sample', 'andrealachica297@gmail.com', 14),
(78, 'Information management', '2025-11-05T00:10', 'Quiz', 'Done', 'Note: The Quiz covers the Module 4 \"Introductions of MS Access\"', 'andrealachica297@gmail.com', 14),
(79, 'Internet of Things', '2025-11-20T23:20', 'Exam', 'In Progress', 'review classification of sensors', 'andrea@gmail.com', 7),
(80, 'Quantitative methods', '2025-11-15T23:21', 'Exam', 'In Progress', 'Review weighted mean', 'andrea@gmail.com', 7),
(81, 'Graphics and Animation', '2025-11-20T23:21', 'Quiz', 'In Progress', 'Covered by module 1 and 2', 'andrea@gmail.com', 7),
(82, 'Internet of Things', '2025-11-14T23:34', 'Exam', 'Done', 'review classification of sensors', 'andrealachica297@gmail.com', 14),
(83, 'Quantitative methods', '2025-11-14T23:35', 'Exam', 'In Progress', 'Review weighted mean', 'andrealachica297@gmail.com', 14),
(84, 'Graphics and Animation', '2025-11-14T23:35', 'Quiz', 'Decline', 'Covered by module 1 and 2', 'andrealachica297@gmail.com', 14),
(85, 'Reading and Visual', '2025-11-14T23:35', 'Quiz', 'In Progress', 'Review the mod 4 and 5', 'andrealachica297@gmail.com', 14);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `accounts`
--
ALTER TABLE `accounts`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `exam_reviewer`
--
ALTER TABLE `exam_reviewer`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `quiz_reviewer`
--
ALTER TABLE `quiz_reviewer`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `task_progress`
--
ALTER TABLE `task_progress`
  ADD PRIMARY KEY (`task_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `accounts`
--
ALTER TABLE `accounts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `exam_reviewer`
--
ALTER TABLE `exam_reviewer`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `quiz_reviewer`
--
ALTER TABLE `quiz_reviewer`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `task_progress`
--
ALTER TABLE `task_progress`
  MODIFY `task_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=86;
--
-- Database: `school_db`
--
CREATE DATABASE IF NOT EXISTS `school_db` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `school_db`;

-- --------------------------------------------------------

--
-- Table structure for table `enrollments`
--

CREATE TABLE `enrollments` (
  `enrollment_id` int(11) NOT NULL,
  `student_id` int(11) DEFAULT NULL,
  `subject_id` int(11) DEFAULT NULL,
  `teacher_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `enrollments`
--

INSERT INTO `enrollments` (`enrollment_id`, `student_id`, `subject_id`, `teacher_id`) VALUES
(1, 1, 1, 1),
(2, 1, 2, 2),
(3, 2, 1, 1),
(4, 3, 3, 2);

-- --------------------------------------------------------

--
-- Table structure for table `students`
--

CREATE TABLE `students` (
  `student_id` int(11) NOT NULL,
  `first_name` varchar(50) DEFAULT NULL,
  `last_name` varchar(50) DEFAULT NULL,
  `program` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `students`
--

INSERT INTO `students` (`student_id`, `first_name`, `last_name`, `program`) VALUES
(1, 'Juan', 'Dela Cruz', 'BSIT'),
(2, 'Maria', 'Santos', 'BSCS'),
(3, 'Pedro', 'Reyes', 'BSIT');

-- --------------------------------------------------------

--
-- Table structure for table `subjects`
--

CREATE TABLE `subjects` (
  `subject_id` int(11) NOT NULL,
  `subject_name` varchar(100) DEFAULT NULL,
  `units` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `subjects`
--

INSERT INTO `subjects` (`subject_id`, `subject_name`, `units`) VALUES
(1, 'Web Development', 3),
(2, 'Database Systems', 3),
(3, 'Networking', 3);

-- --------------------------------------------------------

--
-- Table structure for table `teachers`
--

CREATE TABLE `teachers` (
  `teacher_id` int(11) NOT NULL,
  `teacher_name` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `teachers`
--

INSERT INTO `teachers` (`teacher_id`, `teacher_name`) VALUES
(1, 'Mr. Villano'),
(2, 'Ms. Garcia');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `enrollments`
--
ALTER TABLE `enrollments`
  ADD PRIMARY KEY (`enrollment_id`),
  ADD KEY `student_id` (`student_id`),
  ADD KEY `subject_id` (`subject_id`),
  ADD KEY `teacher_id` (`teacher_id`);

--
-- Indexes for table `students`
--
ALTER TABLE `students`
  ADD PRIMARY KEY (`student_id`);

--
-- Indexes for table `subjects`
--
ALTER TABLE `subjects`
  ADD PRIMARY KEY (`subject_id`);

--
-- Indexes for table `teachers`
--
ALTER TABLE `teachers`
  ADD PRIMARY KEY (`teacher_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `enrollments`
--
ALTER TABLE `enrollments`
  MODIFY `enrollment_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `students`
--
ALTER TABLE `students`
  MODIFY `student_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `subjects`
--
ALTER TABLE `subjects`
  MODIFY `subject_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `teachers`
--
ALTER TABLE `teachers`
  MODIFY `teacher_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `enrollments`
--
ALTER TABLE `enrollments`
  ADD CONSTRAINT `enrollments_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `students` (`student_id`),
  ADD CONSTRAINT `enrollments_ibfk_2` FOREIGN KEY (`subject_id`) REFERENCES `subjects` (`subject_id`),
  ADD CONSTRAINT `enrollments_ibfk_3` FOREIGN KEY (`teacher_id`) REFERENCES `teachers` (`teacher_id`);
--
-- Database: `student_registration`
--
CREATE DATABASE IF NOT EXISTS `student_registration` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `student_registration`;

-- --------------------------------------------------------

--
-- Table structure for table `student_records`
--

CREATE TABLE `student_records` (
  `id` int(11) NOT NULL,
  `id_number` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `age` int(11) NOT NULL,
  `program` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `student_records`
--

INSERT INTO `student_records` (`id`, `id_number`, `name`, `age`, `program`) VALUES
(1, '1231377', 'Erza Scarlet', 24, 'BS in Information Technology'),
(6, '1231378', 'Chari Selga', 24, 'BS in Information Technology'),
(8, '1231378', 'Natsu Dragneel', 25, 'BS in Information Technology'),
(9, '1231333', 'Gio Pagal', 23, 'BS in Criminology');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `student_records`
--
ALTER TABLE `student_records`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `student_records`
--
ALTER TABLE `student_records`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;
--
-- Database: `student_schedule_organizer`
--
CREATE DATABASE IF NOT EXISTS `student_schedule_organizer` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `student_schedule_organizer`;

-- --------------------------------------------------------

--
-- Table structure for table `accounts`
--

CREATE TABLE `accounts` (
  `id` int(11) NOT NULL,
  `fullname` varchar(200) NOT NULL,
  `username` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(100) NOT NULL,
  `date_created` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `accounts`
--

INSERT INTO `accounts` (`id`, `fullname`, `username`, `email`, `password`, `date_created`) VALUES
(5, 'Steven John A. Agustin', 'stevenxd', 'stevenxd81@yahoo.com', '$2b$10$Y6UUsx.GBqGI2Z2MHUejBeO73UqX.R33ZJrFHgmbAK80.XU/YgbV6', '2025-11-09 03:37:33'),
(6, 'Steven John Agustin', 'stevenjohnagustin25@gmail.com', 'stevenjohnagustin25@gmail.com', '$2b$10$KolhM0.XXh34JqNAtffrCu1soXh9fIXIh4NTCK/eSErVwvagiWCES', '2025-11-09 17:32:07'),
(7, 'Steven John', 'stevenxd', 'stevenjohnagustin25@gmail.com', '$2b$10$eWP2oWi/7IGaRpBTnKP03ubE33fzTNhnihxbX68aNHYNvXZSmTb0u', '2025-11-14 23:53:38'),
(8, 'Princess Obillo', 'princess', 'princess@gmail.com', '$2b$10$fSGKYJPknhOeX3omEjPfNOTBkU.KLk7K1YzRVZ9CxDzJraKWEjIFK', '2025-11-15 15:15:28'),
(9, 'Jocelyn Tayan', 'jocelyn123', 'jocelyn.tayan.ecoast@panpacificu.edu.ph', '$2b$10$wc4rGX/cu6B8/DyCEXnH0.nlXslQzDmU5ZUuReqZuRyMAgKAc/DYK', '2025-11-15 15:19:27'),
(10, 'Jocelyn Tayan', 'jocelyn_14', 'jocelyn.tayan.ecoast@panpacificu.edu.ph', '$2b$10$WuovV1nEYsKTPLCfp7iBfehTfsPNwKfPZBT0.9f8YO8wROMhKvI66', '2025-11-22 01:56:55');

-- --------------------------------------------------------

--
-- Table structure for table `events_tb`
--

CREATE TABLE `events_tb` (
  `id` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `title` varchar(200) NOT NULL,
  `starts` varchar(200) NOT NULL,
  `end` varchar(200) NOT NULL,
  `user_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `events_tb`
--

INSERT INTO `events_tb` (`id`, `email`, `title`, `starts`, `end`, `user_id`) VALUES
(22, 'stevenjohnagustin25@gmail.com', 'Helllo', '2025-11-10T17:38', '2025-11-10T17:38', 6),
(28, 'stevenjohnagustin25@gmail.com', 'Testing purposes', '2025-11-11T16:29', '2025-11-11T16:30', 6),
(31, 'princess@gmail.com', 'Sample', '2025-11-15T15:16', '2025-11-15T15:16', 8),
(36, 'jocelyn.tayan.ecoast@panpacificu.edu.ph', 'PUFEST', '2025-11-22T01:59', '2025-11-22T01:02', 10);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `accounts`
--
ALTER TABLE `accounts`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `events_tb`
--
ALTER TABLE `events_tb`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `accounts`
--
ALTER TABLE `accounts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `events_tb`
--
ALTER TABLE `events_tb`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=37;
--
-- Database: `test`
--
CREATE DATABASE IF NOT EXISTS `test` DEFAULT CHARACTER SET latin1 COLLATE latin1_swedish_ci;
USE `test`;
--
-- Database: `training_ground`
--
CREATE DATABASE IF NOT EXISTS `training_ground` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `training_ground`;

-- --------------------------------------------------------

--
-- Table structure for table `accounts`
--

CREATE TABLE `accounts` (
  `id` bigint(20) NOT NULL,
  `username` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `accounts`
--

INSERT INTO `accounts` (`id`, `username`, `password`) VALUES
(5, 'panot', 'q09481239328@@@@@@@@'),
(7, 'asd', '$2b$10$dFZ7InHKdDRbTJwS36kqjeE9zbKGMf.GE29Z7ILHceCj0AmRpOK4K'),
(8, 'hello', '$2b$10$9M.Q39yA.co1ovOQokCNOOGzCdHS15GWb10sEBMkDCDfknBqOhW0i'),
(9, 'kalbo', '$2b$10$PvXU/TMRdpxAmshPuHm2Tu6hOG7PJQvZdgYJebzbbAyNIjA4VQngy'),
(11, 'dfgdf', '$2b$10$VzUmbSlnBrczKi6keoNiwehIZRQGpxrEh2Z82cBlM4CbhzIISNkoa'),
(13, 'Erza scarlet', 'asdasdasdas'),
(14, 'Juvia', 'asdasdasdas'),
(15, 'Kiri', 'asdasdasdas'),
(16, 'Sprinboot', 'asdasdasdas'),
(17, 'Nerd', '$2a$10$KRRcDt.JO.L3Ty2D/sCYceVuFdEoaOiPXNoYxUhLbpETzHvPGtDFK'),
(18, 'Ner', '$2a$10$hCs2h33k5TLzs4nGrDdJzu/9XgJ/UJhj/T61fiEZuo/BQzTg5KvcS'),
(19, 'Ne', '$2a$10$bSxP522q77MGp0JLstYen.k6pBdRGfTk2WRA3TMwbZ2cHonjA2Y2q'),
(21, 'kalbo', '$2b$10$J1Mgann7nfhR.Xl6SHtPOunSniEDZYbH/TnFZj1u/41dIK.g/IT.G'),
(22, 'panot', 'q09481239328@@@@@@@@');

-- --------------------------------------------------------

--
-- Table structure for table `cache`
--

CREATE TABLE `cache` (
  `key` varchar(255) NOT NULL,
  `value` mediumtext NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `cache_locks`
--

CREATE TABLE `cache_locks` (
  `key` varchar(255) NOT NULL,
  `owner` varchar(255) NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `failed_jobs`
--

CREATE TABLE `failed_jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `connection` text NOT NULL,
  `queue` text NOT NULL,
  `payload` longtext NOT NULL,
  `exception` longtext NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `jobs`
--

CREATE TABLE `jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `queue` varchar(255) NOT NULL,
  `payload` longtext NOT NULL,
  `attempts` tinyint(3) UNSIGNED NOT NULL,
  `reserved_at` int(10) UNSIGNED DEFAULT NULL,
  `available_at` int(10) UNSIGNED NOT NULL,
  `created_at` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `job_batches`
--

CREATE TABLE `job_batches` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `total_jobs` int(11) NOT NULL,
  `pending_jobs` int(11) NOT NULL,
  `failed_jobs` int(11) NOT NULL,
  `failed_job_ids` longtext NOT NULL,
  `options` mediumtext DEFAULT NULL,
  `cancelled_at` int(11) DEFAULT NULL,
  `created_at` int(11) NOT NULL,
  `finished_at` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `migrations`
--

CREATE TABLE `migrations` (
  `id` int(10) UNSIGNED NOT NULL,
  `migration` varchar(255) NOT NULL,
  `batch` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(1, '0001_01_01_000000_create_users_table', 1),
(2, '0001_01_01_000001_create_cache_table', 1),
(3, '0001_01_01_000002_create_jobs_table', 1),
(4, '2025_09_05_125456_create_personal_access_tokens_table', 1);

-- --------------------------------------------------------

--
-- Table structure for table `password_reset_tokens`
--

CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `personal_access_tokens`
--

CREATE TABLE `personal_access_tokens` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `tokenable_type` varchar(255) NOT NULL,
  `tokenable_id` bigint(20) UNSIGNED NOT NULL,
  `name` text NOT NULL,
  `token` varchar(64) NOT NULL,
  `abilities` text DEFAULT NULL,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `sessions`
--

CREATE TABLE `sessions` (
  `id` varchar(255) NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `payload` longtext NOT NULL,
  `last_activity` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `sessions`
--

INSERT INTO `sessions` (`id`, `user_id`, `ip_address`, `user_agent`, `payload`, `last_activity`) VALUES
('9yVyMXRvEveEqthLGxfhbufBXSNsyL8SAZ3rnTwl', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoiOEFidnl2Y3J3SmxZZW1HUVVVQlo2SkRhTzFjNnIyeExBRmZkUU1mQiI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1757230520),
('Gb8cxAOTT419sseRKJvG9tFJk4h4aw28Pfh93Mwo', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoiYmNvTXRGY0RqaExTWk9aNVQ1RTdHVFNMUXdNWDZWZGhKMzhEbHBPUiI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1757672052);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `remember_token` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user_entity`
--

CREATE TABLE `user_entity` (
  `id` bigint(20) NOT NULL,
  `password` varchar(255) DEFAULT NULL,
  `username` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `accounts`
--
ALTER TABLE `accounts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `getByUsername` (`username`);

--
-- Indexes for table `cache`
--
ALTER TABLE `cache`
  ADD PRIMARY KEY (`key`);

--
-- Indexes for table `cache_locks`
--
ALTER TABLE `cache_locks`
  ADD PRIMARY KEY (`key`);

--
-- Indexes for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`);

--
-- Indexes for table `jobs`
--
ALTER TABLE `jobs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `jobs_queue_index` (`queue`);

--
-- Indexes for table `job_batches`
--
ALTER TABLE `job_batches`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  ADD PRIMARY KEY (`email`);

--
-- Indexes for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  ADD KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`),
  ADD KEY `personal_access_tokens_expires_at_index` (`expires_at`);

--
-- Indexes for table `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sessions_user_id_index` (`user_id`),
  ADD KEY `sessions_last_activity_index` (`last_activity`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_email_unique` (`email`);

--
-- Indexes for table `user_entity`
--
ALTER TABLE `user_entity`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `accounts`
--
ALTER TABLE `accounts`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `jobs`
--
ALTER TABLE `jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `user_entity`
--
ALTER TABLE `user_entity`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
