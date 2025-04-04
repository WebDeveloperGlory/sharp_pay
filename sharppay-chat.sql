-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Nov 23, 2024 at 11:50 AM
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
-- Database: `sharppay-chat`
--

-- --------------------------------------------------------

--
-- Table structure for table `chats`
--

CREATE TABLE `chats` (
  `id` int(11) NOT NULL,
  `user_id` varchar(36) NOT NULL,
  `admin_id` varchar(36) NOT NULL,
  `message` longtext NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `chats`
--

INSERT INTO `chats` (`id`, `user_id`, `admin_id`, `message`, `created_at`) VALUES
(1, '4334bf0404f8b59eef99ddf1a9e7e1e4', '1', 'Hi boas', '2024-09-21 15:47:27'),
(2, '4334bf0404f8b59eef99ddf1a9e7e1e4', '1', 'Boss', '2024-09-21 15:47:31'),
(3, '4334bf0404f8b59eef99ddf1a9e7e1e4', '1', 'Yes I am with you ', '2024-09-21 15:47:55'),
(4, '4334bf0404f8b59eef99ddf1a9e7e1e4', '1', 'Good I just sent u a coin ', '2024-09-21 15:48:14'),
(5, '4334bf0404f8b59eef99ddf1a9e7e1e4', '1', 'Wow ok transaction refference ? ', '2024-09-21 15:48:29'),
(6, '4334bf0404f8b59eef99ddf1a9e7e1e4', '1', 'Yes baby ', '2024-09-21 15:49:50'),
(7, '4334bf0404f8b59eef99ddf1a9e7e1e4', '1', 'Do ', '2024-09-21 15:49:54'),
(8, '4334bf0404f8b59eef99ddf1a9e7e1e4', '1', 'Hii', '2024-09-21 16:01:15'),
(9, '4334bf0404f8b59eef99ddf1a9e7e1e4', '1', 'OK come ', '2024-09-21 16:07:51'),
(10, '4334bf0404f8b59eef99ddf1a9e7e1e4', '1', 'Broo', '2024-09-21 22:59:31'),
(11, '4334bf0404f8b59eef99ddf1a9e7e1e4', '1', 'hi', '2024-09-21 23:26:23'),
(12, '4334bf0404f8b59eef99ddf1a9e7e1e4', '1', 'Hi', '2024-09-21 23:28:41'),
(13, '4334bf0404f8b59eef99ddf1a9e7e1e4', '1', 'Ok It\'s working ', '2024-09-21 23:28:50'),
(14, '4334bf0404f8b59eef99ddf1a9e7e1e4', '1', 'Wow', '2024-09-21 23:28:56'),
(15, '4334bf0404f8b59eef99ddf1a9e7e1e4', '1', 'hi', '2024-09-21 23:33:02'),
(16, '4334bf0404f8b59eef99ddf1a9e7e1e4', '1', 'Yes', '2024-09-21 23:33:09'),
(17, '4334bf0404f8b59eef99ddf1a9e7e1e4', '1', 'ok ', '2024-09-21 23:33:22'),
(18, '4334bf0404f8b59eef99ddf1a9e7e1e4', '1', 'Why ', '2024-09-21 23:33:26'),
(19, '4334bf0404f8b59eef99ddf1a9e7e1e4', '1', 'Ok', '2024-09-21 23:34:18'),
(20, '4334bf0404f8b59eef99ddf1a9e7e1e4', '1', 'Hum', '2024-09-21 23:34:22'),
(21, '4334bf0404f8b59eef99ddf1a9e7e1e4', '1', 'Come now ', '2024-09-21 23:34:28'),
(22, '4334bf0404f8b59eef99ddf1a9e7e1e4', '1', 'I\'ll show u comething ', '2024-09-21 23:34:39'),
(23, '9858d54d2949a2fa4934a359403c6019', '1', 'Humm', '2024-09-21 23:36:04'),
(24, '4334bf0404f8b59eef99ddf1a9e7e1e4', '1', 'Sir ? ', '2024-09-21 23:36:33'),
(25, '4334bf0404f8b59eef99ddf1a9e7e1e4', '1', 'Don\'t worry ', '2024-09-21 23:36:40'),
(26, '4334bf0404f8b59eef99ddf1a9e7e1e4', '1', 'Ok send it now ', '2024-09-21 23:41:20'),
(27, '4334bf0404f8b59eef99ddf1a9e7e1e4', '1', 'Alright please hold on ', '2024-09-21 23:41:30'),
(28, '4334bf0404f8b59eef99ddf1a9e7e1e4', '1', 'Hi', '2024-09-21 23:53:09'),
(29, '82ba2a6ee861d2c0058f055e7cc544ea', '1', 'bro', '2024-09-21 23:53:37'),
(30, '4334bf0404f8b59eef99ddf1a9e7e1e4', '1', 'Qhii', '2024-09-21 23:53:50'),
(31, '4334bf0404f8b59eef99ddf1a9e7e1e4', '1', 'humm', '2024-09-21 23:54:13'),
(32, '4334bf0404f8b59eef99ddf1a9e7e1e4', '1', 'Hii', '2024-09-21 23:54:21'),
(33, '4334bf0404f8b59eef99ddf1a9e7e1e4', '1', 'hi', '2024-09-21 23:57:26'),
(34, '4334bf0404f8b59eef99ddf1a9e7e1e4', '1', '1her', '2024-09-21 23:57:33'),
(35, '4334bf0404f8b59eef99ddf1a9e7e1e4', '1', 'Hh', '2024-09-21 23:59:35'),
(36, '4334bf0404f8b59eef99ddf1a9e7e1e4', '1', 'Yoo', '2024-09-21 23:59:44'),
(37, '4334bf0404f8b59eef99ddf1a9e7e1e4', '1', 'Bi ', '2024-09-22 00:00:12'),
(38, '4334bf0404f8b59eef99ddf1a9e7e1e4', '1', 'Hummm', '2024-09-22 00:01:58'),
(39, '4334bf0404f8b59eef99ddf1a9e7e1e4', '1', 'Yes', '2024-09-22 00:39:03'),
(40, '4334bf0404f8b59eef99ddf1a9e7e1e4', '1', 'We\'ll OK ', '2024-09-22 00:39:11'),
(41, '4334bf0404f8b59eef99ddf1a9e7e1e4', '1', 'Yo', '2024-09-22 01:08:19'),
(42, '4334bf0404f8b59eef99ddf1a9e7e1e4', '1', 'bos man ', '2024-09-22 01:08:32'),
(43, '4334bf0404f8b59eef99ddf1a9e7e1e4', '1', 'Tovyaevf', '2024-09-22 01:08:50'),
(44, '4334bf0404f8b59eef99ddf1a9e7e1e4', '1', 'Hi', '2024-09-22 01:09:30'),
(45, '4334bf0404f8b59eef99ddf1a9e7e1e4', '1', 'Ok', '2024-09-22 01:09:36'),
(46, '4334bf0404f8b59eef99ddf1a9e7e1e4', '1', 'Tony sexy ', '2024-09-22 01:10:44'),
(47, '4334bf0404f8b59eef99ddf1a9e7e1e4', '1', 'Coin sent boss ', '2024-09-22 01:11:34'),
(48, '4334bf0404f8b59eef99ddf1a9e7e1e4', '1', 'Sharppp ', '2024-09-22 01:11:38'),
(49, '4334bf0404f8b59eef99ddf1a9e7e1e4', '1', 'Boss', '2024-09-22 01:17:37'),
(50, '4334bf0404f8b59eef99ddf1a9e7e1e4', '1', 'Chief', '2024-09-22 01:19:08'),
(51, '4334bf0404f8b59eef99ddf1a9e7e1e4', '1', 'Chair man ', '2024-09-22 01:19:22'),
(52, '4334bf0404f8b59eef99ddf1a9e7e1e4', '1', 'how your end ', '2024-09-22 01:19:30'),
(53, '4334bf0404f8b59eef99ddf1a9e7e1e4', '1', 'Good sir ', '2024-09-22 01:19:35'),
(54, '4334bf0404f8b59eef99ddf1a9e7e1e4', '1', 'I sent you some crypto ', '2024-09-22 01:19:41'),
(55, '4334bf0404f8b59eef99ddf1a9e7e1e4', '1', 'Please requesting confirmation ', '2024-09-22 01:19:55'),
(56, '4334bf0404f8b59eef99ddf1a9e7e1e4', '1', 'Hi boss', '2024-09-22 12:49:45'),
(57, '4334bf0404f8b59eef99ddf1a9e7e1e4', '1', 'OK ', '2024-09-22 12:49:54'),
(58, '4334bf0404f8b59eef99ddf1a9e7e1e4', '1', 'Chief ', '2024-09-22 12:53:16'),
(59, '4334bf0404f8b59eef99ddf1a9e7e1e4', '1', 'Yes ? ', '2024-09-22 12:53:41'),
(60, '4334bf0404f8b59eef99ddf1a9e7e1e4', '1', 'Lol OK sha ', '2024-09-22 12:53:52'),
(61, '4334bf0404f8b59eef99ddf1a9e7e1e4', '1', 'Ehnnn when are u coming ', '2024-09-22 12:54:24'),
(62, '4334bf0404f8b59eef99ddf1a9e7e1e4', '1', 'Reply me ohh', '2024-09-22 12:54:35'),
(63, '4334bf0404f8b59eef99ddf1a9e7e1e4', '1', 'Ok', '2024-09-22 13:34:09'),
(64, '4334bf0404f8b59eef99ddf1a9e7e1e4', '1', 'Humm ok i see', '2024-09-22 13:40:13'),
(65, '235fac114ccff0c19ffcb63757930ecc', '1', 'Chief', '2024-09-22 13:40:24'),
(66, '4334bf0404f8b59eef99ddf1a9e7e1e4', '1', 'hi', '2024-09-22 13:53:34'),
(67, '4334bf0404f8b59eef99ddf1a9e7e1e4', '1', 'i dey na', '2024-09-22 13:53:59'),
(68, '4334bf0404f8b59eef99ddf1a9e7e1e4', '1', 'Boss', '2024-09-22 23:42:12'),
(69, '4334bf0404f8b59eef99ddf1a9e7e1e4', '1', 'how  u doing ', '2024-09-22 23:42:35'),
(70, '4334bf0404f8b59eef99ddf1a9e7e1e4', '1', 'Ok Ok ', '2024-09-23 00:07:11'),
(71, '4334bf0404f8b59eef99ddf1a9e7e1e4', '1', 'But any ways i saw it coming sha ', '2024-09-23 00:07:24'),
(72, '235fac114ccff0c19ffcb63757930ecc', '1', 'Humm', '2024-09-23 00:07:33'),
(73, '4334bf0404f8b59eef99ddf1a9e7e1e4', '1', ' Non the less my bro ', '2024-09-23 00:07:49'),
(74, '4334bf0404f8b59eef99ddf1a9e7e1e4', '1', 'ok', '2024-09-23 00:11:18'),
(75, '4334bf0404f8b59eef99ddf1a9e7e1e4', '1', 'Yoo', '2024-09-23 00:43:16'),
(76, '4334bf0404f8b59eef99ddf1a9e7e1e4', '1', 'yoo ?', '2024-09-23 00:44:53'),
(77, '4334bf0404f8b59eef99ddf1a9e7e1e4', '1', 'Ok hi ', '2024-09-23 00:45:01'),
(78, '4334bf0404f8b59eef99ddf1a9e7e1e4', '1', 'Hi', '2024-09-23 00:59:07'),
(79, '4334bf0404f8b59eef99ddf1a9e7e1e4', '1', 'Ol', '2024-09-23 01:00:43'),
(80, '4334bf0404f8b59eef99ddf1a9e7e1e4', '1', 'Mad mad ', '2024-09-23 01:01:10'),
(81, '4334bf0404f8b59eef99ddf1a9e7e1e4', '1', 'he he he he ', '2024-09-23 01:01:16'),
(82, '4334bf0404f8b59eef99ddf1a9e7e1e4', '1', 'Boss ', '2024-09-23 01:01:24'),
(83, '4334bf0404f8b59eef99ddf1a9e7e1e4', '1', 'Good morning ', '2024-09-23 01:01:28'),
(84, '4334bf0404f8b59eef99ddf1a9e7e1e4', '1', 'Chief good morning ', '2024-09-23 01:03:48'),
(85, '4334bf0404f8b59eef99ddf1a9e7e1e4', '1', 'I sent some crypto yesterday ', '2024-09-23 01:03:55'),
(86, '4334bf0404f8b59eef99ddf1a9e7e1e4', '1', 'boss', '2024-09-23 01:04:39'),
(87, '4334bf0404f8b59eef99ddf1a9e7e1e4', '1', 'Chief', '2024-09-23 01:05:47'),
(88, '4334bf0404f8b59eef99ddf1a9e7e1e4', '1', 'How u dey na', '2024-09-23 01:06:02'),
(89, '4334bf0404f8b59eef99ddf1a9e7e1e4', '1', 'Ok offline Abi ??', '2024-09-23 01:06:09'),
(90, '4334bf0404f8b59eef99ddf1a9e7e1e4', '1', 'Why naw ', '2024-09-23 01:08:41'),
(91, '4334bf0404f8b59eef99ddf1a9e7e1e4', '1', 'Ok  send am ', '2024-09-23 01:08:44'),
(92, '4334bf0404f8b59eef99ddf1a9e7e1e4', '1', 'Hii', '2024-09-23 01:11:30'),
(93, '4334bf0404f8b59eef99ddf1a9e7e1e4', '1', 'Why', '2024-09-23 01:11:40'),
(94, '4334bf0404f8b59eef99ddf1a9e7e1e4', '1', ' Broo', '2024-09-23 01:13:35'),
(95, '4334bf0404f8b59eef99ddf1a9e7e1e4', '1', 'Please ', '2024-09-23 01:13:39'),
(96, '4334bf0404f8b59eef99ddf1a9e7e1e4', '1', 'Ok fuck u', '2024-09-23 01:16:26'),
(97, '4334bf0404f8b59eef99ddf1a9e7e1e4', '1', 'Yes i am with you ', '2024-09-23 01:18:04'),
(98, '4334bf0404f8b59eef99ddf1a9e7e1e4', '1', 'I sent some crypto ', '2024-09-23 01:18:21'),
(99, '4334bf0404f8b59eef99ddf1a9e7e1e4', '1', 'hi', '2024-10-01 17:36:10');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `chats`
--
ALTER TABLE `chats`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `chats`
--
ALTER TABLE `chats`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=100;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
