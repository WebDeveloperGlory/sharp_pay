-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Nov 22, 2024 at 10:56 PM
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
-- Database: `sharppay`
--

-- --------------------------------------------------------

--
-- Table structure for table `admins`
--

CREATE TABLE `admins` (
  `id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  `email` text NOT NULL,
  `pswd` varchar(200) NOT NULL,
  `dp` varchar(200) NOT NULL,
  `role` varchar(20) NOT NULL,
  `status` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `admins`
--

INSERT INTO `admins` (`id`, `name`, `email`, `pswd`, `dp`, `role`, `status`, `created_at`) VALUES
(1, 'tonys icon', 'sharppay@gmail.com', '$2b$10$aRz7y9tCh6N1nmW7PYXcXe3s5/EM8AnjCo8yA4g2JjAX9ZCvOYZBe', '', 'Super Admin', 1, '2024-07-26 02:53:48'),
(2, 'Oilmoney', 'oilmoney@gmail.com', '$2b$10$vJ.cRR0Dw.8Qk3EQcW3w6eTusmn1x/1Gn.A1ZpF0rM8/8Pm1pCfx.', '', 'Admin', 1, '2024-09-03 18:51:33');

-- --------------------------------------------------------

--
-- Table structure for table `app_d`
--

CREATE TABLE `app_d` (
  `id` int(11) NOT NULL,
  `title` text NOT NULL,
  `value` varchar(200) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `app_d`
--

INSERT INTO `app_d` (`id`, `title`, `value`) VALUES
(1, 'ngn_to_usd', '1200'),
(2, 'buy_sell_trans_max_time', '30'),
(3, 'ngn_to_usd', '1200'),
(4, 'buy_sell_max_time', '');

-- --------------------------------------------------------

--
-- Table structure for table `bank_acc_info`
--

CREATE TABLE `bank_acc_info` (
  `id` int(11) NOT NULL,
  `urs_id` varchar(32) NOT NULL,
  `bank_name` varchar(100) NOT NULL,
  `acc_num` varchar(10) NOT NULL,
  `acc_name` varchar(100) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `bank_acc_info`
--

INSERT INTO `bank_acc_info` (`id`, `urs_id`, `bank_name`, `acc_num`, `acc_name`, `created_at`) VALUES
(1, '4334bf0404f8b59eef99ddf1a9e7e1e4', 'union bank', '0121314587', 'Obateru Anthony Oluwkayode', '2024-05-17 06:48:27');

-- --------------------------------------------------------

--
-- Table structure for table `coins`
--

CREATE TABLE `coins` (
  `id` varchar(70) NOT NULL,
  `coin_name` varchar(50) NOT NULL,
  `coin_abv` varchar(20) NOT NULL,
  `rate` float NOT NULL,
  `minDeposit` int(11) NOT NULL,
  `logoUrl` longtext NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `coins`
--

INSERT INTO `coins` (`id`, `coin_name`, `coin_abv`, `rate`, `minDeposit`, `logoUrl`) VALUES
('04038bf6-3d6c-43e5-924a-8ef514b8ac14', 'Litecoin', 'LTC', 137.29, 22, 'https://www.cryptocompare.com/media/35309662/ltc.png'),
('2df4f759-271d-48b1-9523-2043b32e9ff7', 'USDT', 'USDT', 1.63, 10, 'https://www.cryptocompare.com/media/1383672/usdt.png'),
('713c3647-84ae-444e-934f-f5ba95f1ebca', 'Dogecoin', 'DOGE', 0.04, 3, 'https://www.cryptocompare.com/media/19684/doge.png'),
('72ddc632-197a-494c-b409-4e49f59e6a87', 'Ripple', 'XRP', 0.34, 9, 'https://www.cryptocompare.com/media/34477776/xrp.png'),
('7decaa06-bc9f-414e-adf5-601f408e95b1', 'Bitcoin Cash', 'BCH', 788.78, 42, 'https://www.cryptocompare.com/media/1383919/bch.jpg'),
('d3101975-110b-492a-94a6-edb7a84678ce', 'Ethereum', 'ETH', 3559.73, 91, 'https://www.cryptocompare.com/media/20646/eth_logo.png'),
('d88e0fca-77cb-482a-9b67-834f4c3dc2b2', 'Torn', 'TORN', 70.07, 31, 'https://www.cryptocompare.com/media/1365253/torn.png'),
('f2546789-c901-4e9d-8f23-ecc335a8b81e', 'Bitcoin', 'BTC', 44806.7, 14, 'https://www.cryptocompare.com/media/19633/btc.png');

-- --------------------------------------------------------

--
-- Table structure for table `coin_networks`
--

CREATE TABLE `coin_networks` (
  `id` int(11) NOT NULL,
  `coin_id` varchar(70) NOT NULL,
  `network_id` varchar(70) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `coin_networks`
--

INSERT INTO `coin_networks` (`id`, `coin_id`, `network_id`, `created_at`) VALUES
(1, 'f2546789-c901-4e9d-8f23-ecc335a8b81e', 'aae8b4f0-58ce-4e29-8d7f-2ff4b15a60b0', '2024-05-01 00:36:24'),
(2, '2df4f759-271d-48b1-9523-2043b32e9ff7', 'aae8b4f0-58ce-4e29-8d7f-2ff4b15a60b0', '2024-05-01 00:36:24'),
(3, 'd88e0fca-77cb-482a-9b67-834f4c3dc2b2', 'aae8b4f0-58ce-4e29-8d7f-2ff4b15a60b0', '2024-05-01 00:36:24'),
(4, '7decaa06-bc9f-414e-adf5-601f408e95b1', 'aae8b4f0-58ce-4e29-8d7f-2ff4b15a60b0', '2024-05-01 00:36:24'),
(5, '72ddc632-197a-494c-b409-4e49f59e6a87', 'aae8b4f0-58ce-4e29-8d7f-2ff4b15a60b0', '2024-05-01 00:36:24'),
(6, '04038bf6-3d6c-43e5-924a-8ef514b8ac14', 'aae8b4f0-58ce-4e29-8d7f-2ff4b15a60b0', '2024-05-01 00:36:24'),
(7, 'd3101975-110b-492a-94a6-edb7a84678ce', 'aae8b4f0-58ce-4e29-8d7f-2ff4b15a60b0', '2024-05-01 00:36:24'),
(8, '713c3647-84ae-444e-934f-f5ba95f1ebca', 'aae8b4f0-58ce-4e29-8d7f-2ff4b15a60b0', '2024-05-01 00:36:24');

-- --------------------------------------------------------

--
-- Table structure for table `deposits`
--

CREATE TABLE `deposits` (
  `id` int(11) NOT NULL,
  `user_id` varchar(32) NOT NULL,
  `trans_ref` varchar(255) NOT NULL,
  `wallet_id` varchar(36) NOT NULL,
  `coin_id` varchar(70) NOT NULL,
  `network_id` varchar(70) NOT NULL,
  `reject_reason` text NOT NULL,
  `trans_img` longtext NOT NULL,
  `amount` float NOT NULL,
  `trans_rate` float NOT NULL,
  `stat` int(11) NOT NULL DEFAULT 0,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp(),
  `attended_by` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `deposits`
--

INSERT INTO `deposits` (`id`, `user_id`, `trans_ref`, `wallet_id`, `coin_id`, `network_id`, `reject_reason`, `trans_img`, `amount`, `trans_rate`, `stat`, `created_at`, `updated_at`, `attended_by`) VALUES
(1, '4334bf0404f8b59eef99ddf1a9e7e1e4', 'dgtghtefefngdvdfrrgbfr', 'ogUemAZXiUYuPD7MAaMT9Lf1PpaDb9jZspHY', '2df4f759-271d-48b1-9523-2043b32e9ff7', 'aae8b4f0-58ce-4e29-8d7f-2ff4b15a60b0', '', '/uploads/95f6260f4ab3da415fb656d2feb156d2', 20, 137.29, 2, '2024-05-02 08:06:05', '2024-05-02 08:06:05', 8),
(2, '4334bf0404f8b59eef99ddf1a9e7e1e4', 'dgtghtefefngdvdfrrgbfr', 'ogUemAZXiUYuPD7MAaMT9Lf1PpaDb9jZspHY', '2df4f759-271d-48b1-9523-2043b32e9ff7', 'aae8b4f0-58ce-4e29-8d7f-2ff4b15a60b0', '', '/uploads/a848ccc7a6a1c5949400de29494970c8', 20, 137.29, 0, '2024-05-02 08:36:39', '2024-05-02 08:36:39', 0),
(3, '4334bf0404f8b59eef99ddf1a9e7e1e4', 'dgtghtefefngdvdfrrgbfr', 'ogUemAZXiUYuPD7MAaMT9Lf1PpaDb9jZspHY', '2df4f759-271d-48b1-9523-2043b32e9ff7', 'aae8b4f0-58ce-4e29-8d7f-2ff4b15a60b0', '', '/uploads/69d6099dfbc1786f6fd46fdb5819a29b', 0.03, 137.29, 1, '2024-05-02 08:38:16', '2024-05-02 08:38:16', 0),
(4, '4334bf0404f8b59eef99ddf1a9e7e1e4', 'dgtghtefefngdvdfrrgbfr', 'ogUemAZXiUYuPD7MAaMT9Lf1PpaDb9jZspHY', '2df4f759-271d-48b1-9523-2043b32e9ff7', 'aae8b4f0-58ce-4e29-8d7f-2ff4b15a60b0', '', '/uploads/0f8d48d53d8bd81bb0c83b490df00222', 0.6, 137.29, 1, '2024-05-02 08:39:31', '2024-05-02 08:39:31', 0),
(5, '4334bf0404f8b59eef99ddf1a9e7e1e4', 'dgtghtefefngdvdfrrgbfr', 'ogUemAZXiUYuPD7MAaMT9Lf1PpaDb9jZspHY', '2df4f759-271d-48b1-9523-2043b32e9ff7', 'aae8b4f0-58ce-4e29-8d7f-2ff4b15a60b0', '', '/uploads/191f55777ad8d316c65c0bee2a28c28a', 5, 137.29, 2, '2024-05-02 10:39:20', '2024-05-02 10:39:20', 0),
(6, '9858d54d2949a2fa4934a359403c6019', 'eQj1yZkouyqvbUQO49sjhjwhqce88hJHKJ8YHJSdsw2', '', '72ddc632-197a-494c-b409-4e49f59e6a87', 'aae8b4f0-58ce-4e29-8d7f-2ff4b15a60b0', '', '/uploads/30d3cb689a1970d98a6379ead8329faf', 20, 137.29, 2, '2024-07-31 13:36:33', '2024-07-31 13:36:33', 0),
(7, '9858d54d2949a2fa4934a359403c6019', 'eQj1yZkouyqvbUQO49sjhjwhqce88hJHKJ8YHJSdsw2', '', '2df4f759-271d-48b1-9523-2043b32e9ff7', 'aae8b4f0-58ce-4e29-8d7f-2ff4b15a60b0', '', '/uploads/1722429875108-705353697-Screenshot 2024-03-10 134320.png', 15, 1.63, 1, '2024-07-31 13:44:35', '2024-07-31 13:44:35', 0),
(8, '9858d54d2949a2fa4934a359403c6019', 'eQj1yZkouyqvbUQO49sjhjwhqce88hJHKJ8YHJSdsw2', '', '2df4f759-271d-48b1-9523-2043b32e9ff7', 'aae8b4f0-58ce-4e29-8d7f-2ff4b15a60b0', '', '/uploads/1722438965445-102991495-Screenshot 2024-03-10 134320.png', 30, 1.63, 0, '2024-07-31 16:16:05', '2024-07-31 16:16:05', 0),
(9, '9858d54d2949a2fa4934a359403c6019', 'eQj1yZkouyqvbUQO49sjhjwhqce88hJHKJ8YHJSdsw2', '', '2df4f759-271d-48b1-9523-2043b32e9ff7', 'aae8b4f0-58ce-4e29-8d7f-2ff4b15a60b0', '', '/uploads/1722442037762-228791015-Screenshot 2024-03-10 134320.png', 40, 1.63, 1, '2024-07-31 17:07:17', '2024-07-31 17:07:17', 1),
(10, '9858d54d2949a2fa4934a359403c6019', 'eQj1yZkouyqvbUQO49sjhjwhqce88hJHKJ8YHJSdsw2', '', '2df4f759-271d-48b1-9523-2043b32e9ff7', 'aae8b4f0-58ce-4e29-8d7f-2ff4b15a60b0', '', '/uploads/1722442645448-586927243-Screenshot 2024-03-10 134320.png', 20, 1.63, 1, '2024-07-31 17:17:25', '2024-07-31 17:17:25', 1),
(11, '4334bf0404f8b59eef99ddf1a9e7e1e4', '0x3aefdff90532bf73465252689d5a4e7743d1e476', '', '2df4f759-271d-48b1-9523-2043b32e9ff7', 'aae8b4f0-58ce-4e29-8d7f-2ff4b15a60b0', '', '/uploads/1723980511836-163439331-1000015910.jpg', 306.748, 1.63, 1, '2024-08-18 07:28:31', '2024-08-18 07:28:31', 1);

-- --------------------------------------------------------

--
-- Table structure for table `funding`
--

CREATE TABLE `funding` (
  `id` int(11) NOT NULL,
  `urs_id` varchar(36) NOT NULL,
  `amount` int(11) NOT NULL,
  `image_url` longtext NOT NULL,
  `stat` int(11) NOT NULL DEFAULT 0 COMMENT '0 for pending , 1 for approved , 2 for rejected',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `attended_by` int(11) NOT NULL,
  `reject_reason` varchar(200) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `funding`
--

INSERT INTO `funding` (`id`, `urs_id`, `amount`, `image_url`, `stat`, `created_at`, `updated_at`, `attended_by`, `reject_reason`) VALUES
(1, '9858d54d2949a2fa4934a359403c6019', 10000, '', 1, '2024-07-30 18:04:30', '2024-07-30 18:04:30', 0, ''),
(2, '4334bf0404f8b59eef99ddf1a9e7e1e4', 6000, '/uploads/1723934875073-635868168-zbg.png', 1, '2024-08-17 18:47:55', '2024-08-17 18:47:55', 1, ''),
(3, '4334bf0404f8b59eef99ddf1a9e7e1e4', 8888, '/uploads/1723935438811-141149853-image_picker_8E448E3E-E261-4E22-BD14-136F43E695AA-37219-0000004FE90E1AA4.png', 1, '2024-08-17 18:57:18', '2024-08-17 18:57:18', 1, ''),
(4, '4334bf0404f8b59eef99ddf1a9e7e1e4', 300, '/uploads/1723980619008-94598522-1000060484.webp', 1, '2024-08-18 07:30:19', '2024-08-18 07:30:19', 1, ''),
(5, '4334bf0404f8b59eef99ddf1a9e7e1e4', 10000, '/uploads/1723981153737-482404098-Screenshot_20240818-074331.jpg', 1, '2024-08-18 07:39:13', '2024-08-18 07:39:13', 1, ''),
(6, '4334bf0404f8b59eef99ddf1a9e7e1e4', 30000, '/uploads/1723983447684-754554667-1000324694.jpg', 1, '2024-08-18 08:17:27', '2024-08-18 08:17:27', 1, ''),
(7, '4334bf0404f8b59eef99ddf1a9e7e1e4', 1000000, '/uploads/1723985190884-597611584-Screenshot_20240818-123918.jpg', 1, '2024-08-18 08:46:30', '2024-08-18 08:46:30', 1, ''),
(8, '4334bf0404f8b59eef99ddf1a9e7e1e4', 500000, '/uploads/1723985435726-233125550-Screenshot_20240817-202306_Telegram.jpg', 1, '2024-08-18 08:50:35', '2024-08-18 08:50:35', 1, '');

-- --------------------------------------------------------

--
-- Table structure for table `kyc_level_1`
--

CREATE TABLE `kyc_level_1` (
  `id` int(11) NOT NULL,
  `user_id` varchar(255) NOT NULL,
  `first_name` varchar(255) NOT NULL,
  `last_name` varchar(255) NOT NULL,
  `gender` enum('Male','Female','Other') NOT NULL,
  `date_of_birth` date NOT NULL,
  `status` int(11) DEFAULT 0,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `kyc_level_1`
--

INSERT INTO `kyc_level_1` (`id`, `user_id`, `first_name`, `last_name`, `gender`, `date_of_birth`, `status`, `created_at`, `updated_at`) VALUES
(1, '4334bf0404f8b59eef99ddf1a9e7e1e4', 'Anthony', 'Obateru', 'Female', '0000-00-00', 0, '2024-08-29 17:10:10', '2024-08-29 17:10:10');

-- --------------------------------------------------------

--
-- Table structure for table `kyc_level_2`
--

CREATE TABLE `kyc_level_2` (
  `id` int(11) NOT NULL,
  `user_id` varchar(255) NOT NULL,
  `passport_image_url` varchar(255) NOT NULL,
  `id_card_image_url` varchar(255) NOT NULL,
  `status` int(11) DEFAULT 0,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `kyc_level_3`
--

CREATE TABLE `kyc_level_3` (
  `id` int(11) NOT NULL,
  `user_id` varchar(255) NOT NULL,
  `address` varchar(255) NOT NULL,
  `bill_image_url` varchar(255) NOT NULL,
  `status` int(11) DEFAULT 0,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `city` varchar(255) NOT NULL,
  `state` varchar(255) NOT NULL,
  `country` varchar(255) NOT NULL,
  `postal_code` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `kyc_status`
--

CREATE TABLE `kyc_status` (
  `id` int(11) NOT NULL,
  `user_id` varchar(32) DEFAULT NULL,
  `current_level` int(11) DEFAULT 0,
  `level_1_status` tinyint(4) DEFAULT NULL,
  `level_2_status` tinyint(4) DEFAULT NULL,
  `level_3_status` tinyint(4) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `kyc_status`
--

INSERT INTO `kyc_status` (`id`, `user_id`, `current_level`, `level_1_status`, `level_2_status`, `level_3_status`, `created_at`, `updated_at`) VALUES
(1, '4334bf0404f8b59eef99ddf1a9e7e1e4', 0, 0, NULL, NULL, '2024-08-29 17:10:10', '2024-09-03 14:48:38');

-- --------------------------------------------------------

--
-- Table structure for table `naira_withdrawal`
--

CREATE TABLE `naira_withdrawal` (
  `id` int(11) NOT NULL,
  `urs_id` int(11) NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `bank_acc_id` int(11) NOT NULL,
  `stat` tinyint(1) DEFAULT 0,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `networks`
--

CREATE TABLE `networks` (
  `id` varchar(40) NOT NULL,
  `name` varchar(30) NOT NULL,
  `abv` varchar(12) NOT NULL,
  `wallet_addr` varchar(80) NOT NULL,
  `qrcode` varchar(200) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `networks`
--

INSERT INTO `networks` (`id`, `name`, `abv`, `wallet_addr`, `qrcode`) VALUES
('aae8b4f0-58ce-4e29-8d7f-2ff4b15a60b0', 'Polygon', 'MATIC', '0x3aefdff90532bf73465252689d5a4e7743d1e476', 'https://example.com/qrcode/aae8b4f0-58ce-4e29-8d7f-2ff4b15a6');

-- --------------------------------------------------------

--
-- Table structure for table `transactions`
--

CREATE TABLE `transactions` (
  `id` int(11) NOT NULL,
  `ref_id` varchar(13) NOT NULL,
  `urs_id` varchar(32) NOT NULL,
  `coin_id` varchar(70) NOT NULL,
  `coin_amo` float NOT NULL,
  `usd_amo` decimal(10,0) NOT NULL,
  `ngn_amo` decimal(10,0) NOT NULL,
  `tns_rate` float NOT NULL,
  `usd_rate` float NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `tns_type` int(11) NOT NULL COMMENT '0 for sell , 1 for buy',
  `stat` int(11) NOT NULL DEFAULT 0,
  `updated_at` datetime NOT NULL,
  `updated_by` varchar(36) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `transactions`
--

INSERT INTO `transactions` (`id`, `ref_id`, `urs_id`, `coin_id`, `coin_amo`, `usd_amo`, `ngn_amo`, `tns_rate`, `usd_rate`, `created_at`, `tns_type`, `stat`, `updated_at`, `updated_by`) VALUES
(1, 'SP-xM5GV5eO6D', '4334bf0404f8b59eef99ddf1a9e7e1e4', '2df4f759-271d-48b1-9523-2043b32e9ff7', 0.45, 100, 120000, 0.0045, 120, '2024-05-17 15:12:57', 0, 0, '0000-00-00 00:00:00', ''),
(2, 'SP-Hmfp053Iu5', '4334bf0404f8b59eef99ddf1a9e7e1e4', '04038bf6-3d6c-43e5-924a-8ef514b8ac14', 22, 10, 120000, 2.2, 120, '2024-05-17 15:38:13', 1, 0, '0000-00-00 00:00:00', ''),
(3, 'SP-0jclP0Ks1z', '4334bf0404f8b59eef99ddf1a9e7e1e4', '2df4f759-271d-48b1-9523-2043b32e9ff7', 30.6748, 50, 71025, 0.613497, 1420.5, '2024-08-18 09:10:10', 1, 0, '0000-00-00 00:00:00', ''),
(4, 'SP-PfXmSLm3E8', '4334bf0404f8b59eef99ddf1a9e7e1e4', '2df4f759-271d-48b1-9523-2043b32e9ff7', 30.6748, 50, 71025, 0.613497, 1420.5, '2024-08-18 09:30:21', 0, 0, '0000-00-00 00:00:00', ''),
(5, 'SP-JlSIiCbeqM', '4334bf0404f8b59eef99ddf1a9e7e1e4', '2df4f759-271d-48b1-9523-2043b32e9ff7', 61.3497, 100, 142050, 0.613497, 1420.5, '2024-08-18 09:30:59', 0, 0, '0000-00-00 00:00:00', ''),
(6, 'SP-OZrF8S3wbL', '4334bf0404f8b59eef99ddf1a9e7e1e4', '2df4f759-271d-48b1-9523-2043b32e9ff7', 184.049, 300, 426150, 0.613497, 1420.5, '2024-08-19 06:04:19', 1, 0, '0000-00-00 00:00:00', '');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` varchar(32) NOT NULL,
  `email` varchar(255) NOT NULL,
  `lastN` varchar(255) NOT NULL,
  `firstN` varchar(255) NOT NULL,
  `countryCode` varchar(7) NOT NULL DEFAULT '+234',
  `phone` varchar(15) NOT NULL,
  `pswd` varchar(255) NOT NULL,
  `pscd` int(11) DEFAULT NULL,
  `is_verified` int(11) NOT NULL DEFAULT 0,
  `otp` int(11) NOT NULL,
  `ogt` datetime NOT NULL DEFAULT current_timestamp(),
  `ref_code` int(11) NOT NULL,
  `ref_by` int(11) NOT NULL,
  `acc_bal` decimal(10,0) NOT NULL DEFAULT 0,
  `created_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `email`, `lastN`, `firstN`, `countryCode`, `phone`, `pswd`, `pscd`, `is_verified`, `otp`, `ogt`, `ref_code`, `ref_by`, `acc_bal`, `created_at`) VALUES
('235fac114ccff0c19ffcb63757930ecc', 'zonynereus@gmail.com', 'Obateru', 'Anthony', '+234', '8144171295', 'cGFzc3dvcmQxMjM=', NULL, 1, 8511, '2024-04-21 12:56:40', 194925, 0, 0, '2024-04-21 12:56:40'),
('4334bf0404f8b59eef99ddf1a9e7e1e4', 'tonynereus@gmail.com', 'Obateru', 'Anthony', '+44', '8144171295', '$2b$10$8C6N.UzsUDv3jRs2TqbzAu9xnj108Ipsyiqd27wyFX.xwoqyhcmkG', 431251, 1, 7534, '2024-09-20 16:39:23', 901468, 0, 995188, '2024-04-22 16:04:54'),
('82ba2a6ee861d2c0058f055e7cc544ea', 'tolanereus@gmail.com', 'obateruuu', 'tonys', '+234', '8144171295', 'cGFzc3dvcmQxMjM=', 280426, 1, 8439, '2024-07-22 21:48:16', 440661, 0, 0, '2024-07-22 21:28:13'),
('9858d54d2949a2fa4934a359403c6019', 'bonynereus@gmail.com', 'Obateru', 'Anthony', '+42', '8144171295', 'cGFzc3dvcmQxMjM=', NULL, 1, 3278, '2024-05-01 18:03:24', 143977, 0, 10000, '2024-05-01 18:03:24'),
('dd316da26095319c072e378444159a9e', 'example@example.com', 'Doe', 'John', '+234', '1234567890', '$2b$10$ut91/o9CWGgt74iS6T0wTuDE8oIAc87XSFr/KjEV2g2b5ugjMtMMG', NULL, 0, 5767, '2024-04-13 23:52:07', 940124, 0, 0, '2024-04-10 05:23:34'),
('eb18ba8498dfc981a778807233d48c67', 'conynereus@gmail.com', 'Obateru', 'Anthony', '+42', '8144171295', 'cGFzc3dvcmQxMjM=', NULL, 0, 9246, '2024-05-01 18:20:00', 640065, 0, 0, '2024-05-01 18:20:00'),
('f52bf8f0ffbaae4bce2a9a0f7b4143a5', 'anthonynereus@gmail.com', 'Sexyy', 'Tony', '+234', '8144171295', '$2b$10$8C6N.UzsUDv3jRs2TqbzAu9xnj108Ipsyiqd27wyFX.xwoqyhcmkG', NULL, 0, 8540, '2024-04-16 16:30:15', 250402, 0, 0, '2024-04-10 05:42:04'),
('fe1c20a423ae204e9f886ba075bd5df0', 'wisdomeneyifuoolumoye@gmail.com', 'oil', 'wisdom', '+234', '09060990385', 'TGFyYTRmb3J1Kw==', NULL, 0, 1906, '2024-08-18 00:54:29', 508519, 0, 0, '2024-08-18 00:54:29');

-- --------------------------------------------------------

--
-- Table structure for table `user_wallets`
--

CREATE TABLE `user_wallets` (
  `id` int(11) NOT NULL,
  `user_id` varchar(32) NOT NULL,
  `coin_id` varchar(36) NOT NULL,
  `balance` float NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp(),
  `wallet_id` varchar(36) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user_wallets`
--

INSERT INTO `user_wallets` (`id`, `user_id`, `coin_id`, `balance`, `created_at`, `updated_at`, `wallet_id`) VALUES
(33, '235fac114ccff0c19ffcb63757930ecc', '04038bf6-3d6c-43e5-924a-8ef514b8ac14', 0, '2024-05-01 13:44:08', '2024-05-01 13:44:08', 'y9oRxzLo7D89UgLWUbyukoZxoFIzNVgj3cwh'),
(34, '235fac114ccff0c19ffcb63757930ecc', '2df4f759-271d-48b1-9523-2043b32e9ff7', 0, '2024-05-01 13:44:08', '2024-05-01 13:44:08', 'EtssTxbgYIXopxSsneJ7w9C3ZnUGBXSnVKqr'),
(35, '235fac114ccff0c19ffcb63757930ecc', '713c3647-84ae-444e-934f-f5ba95f1ebca', 0, '2024-05-01 13:44:08', '2024-05-01 13:44:08', 'xDmxTO2GnPsgLuVqDkllpGLGSBmIdw9kZn7l'),
(36, '235fac114ccff0c19ffcb63757930ecc', '72ddc632-197a-494c-b409-4e49f59e6a87', 0, '2024-05-01 13:44:08', '2024-05-01 13:44:08', 'HQeUYLbTbCeCfDlv5qXpwzXYYwhFYLWwivov'),
(37, '235fac114ccff0c19ffcb63757930ecc', '7decaa06-bc9f-414e-adf5-601f408e95b1', 0, '2024-05-01 13:44:08', '2024-05-01 13:44:08', 'HX7AKSp18qMu2rmX2JnRLe7UV12gvvViA80i'),
(38, '235fac114ccff0c19ffcb63757930ecc', 'd3101975-110b-492a-94a6-edb7a84678ce', 0, '2024-05-01 13:44:08', '2024-05-01 13:44:08', '0MNnmHHdTHY0isbgWRsrVtaqww8EfbSm0msv'),
(39, '235fac114ccff0c19ffcb63757930ecc', 'd88e0fca-77cb-482a-9b67-834f4c3dc2b2', 0, '2024-05-01 13:44:08', '2024-05-01 13:44:08', 'tut1gQbtVx21JPm7P5KANibQZP5RfXTKaZCX'),
(40, '235fac114ccff0c19ffcb63757930ecc', 'f2546789-c901-4e9d-8f23-ecc335a8b81e', 0, '2024-05-01 13:44:08', '2024-05-01 13:44:08', 'x7SricCL6aAaG0qt5IwXV42Bnm8omvq2D0Cf'),
(41, '4334bf0404f8b59eef99ddf1a9e7e1e4', '04038bf6-3d6c-43e5-924a-8ef514b8ac14', 0, '2024-05-01 13:44:08', '2024-05-01 13:44:08', 'WSW0m1i1kAZKMvJZ6LCnLTXShBuzsyQVeK7c'),
(42, '4334bf0404f8b59eef99ddf1a9e7e1e4', '2df4f759-271d-48b1-9523-2043b32e9ff7', 526.472, '2024-05-01 13:44:08', '2024-05-01 13:44:08', 'ogUemAZXiUYuPD7MAaMT9Lf1PpaDb9jZspHY'),
(43, '4334bf0404f8b59eef99ddf1a9e7e1e4', '713c3647-84ae-444e-934f-f5ba95f1ebca', 0, '2024-05-01 13:44:08', '2024-05-01 13:44:08', 'ygRkJAH2Gx7ZNze971SsMKfQDs5HGAl64yer'),
(44, '4334bf0404f8b59eef99ddf1a9e7e1e4', '72ddc632-197a-494c-b409-4e49f59e6a87', 0, '2024-05-01 13:44:08', '2024-05-01 13:44:08', 's8QuhiCA94J2dsqAriFZBow86ekYn0azUarD'),
(45, '4334bf0404f8b59eef99ddf1a9e7e1e4', '7decaa06-bc9f-414e-adf5-601f408e95b1', 9.54, '2024-05-01 13:44:08', '2024-05-01 13:44:08', 'MRcvqZa5WJzFynlA5NPOjlUTUIySA73Q9ipc'),
(46, '4334bf0404f8b59eef99ddf1a9e7e1e4', 'd3101975-110b-492a-94a6-edb7a84678ce', 0, '2024-05-01 13:44:08', '2024-05-01 13:44:08', 'UpBKEmAyuajTqZpdnPDWPES9XZe0Y8B7E96b'),
(47, '4334bf0404f8b59eef99ddf1a9e7e1e4', 'd88e0fca-77cb-482a-9b67-834f4c3dc2b2', 0, '2024-05-01 13:44:08', '2024-05-01 13:44:08', 'hDsAZ6ebENfOYVMXcsFDPXKGbUqlRrErfEHf'),
(48, '4334bf0404f8b59eef99ddf1a9e7e1e4', 'f2546789-c901-4e9d-8f23-ecc335a8b81e', 0, '2024-05-01 13:44:08', '2024-05-01 13:44:08', 'ifpyXnMRMRmppX4UTYWzVLyoQdlOgqxDVqt5'),
(49, 'dd316da26095319c072e378444159a9e', '04038bf6-3d6c-43e5-924a-8ef514b8ac14', 0, '2024-05-01 13:44:08', '2024-05-01 13:44:08', '1PmycmCR7217xZYl7gfqAZU2cwGAxGYrZVjX'),
(50, 'dd316da26095319c072e378444159a9e', '2df4f759-271d-48b1-9523-2043b32e9ff7', 0, '2024-05-01 13:44:08', '2024-05-01 13:44:08', '8GHfNLud7KKzWifbCwsHgqElutbYKnf4d1R8'),
(51, 'dd316da26095319c072e378444159a9e', '713c3647-84ae-444e-934f-f5ba95f1ebca', 0, '2024-05-01 13:44:08', '2024-05-01 13:44:08', '4lh2DyBF0TlExANX8fkacCOm4SV3jEqJnweH'),
(52, 'dd316da26095319c072e378444159a9e', '72ddc632-197a-494c-b409-4e49f59e6a87', 0, '2024-05-01 13:44:08', '2024-05-01 13:44:08', '4ORZyKRb7CXf2eReNac4VcvenJt8khc4HUuJ'),
(53, 'dd316da26095319c072e378444159a9e', '7decaa06-bc9f-414e-adf5-601f408e95b1', 0, '2024-05-01 13:44:08', '2024-05-01 13:44:08', 'zEjDfOXoy6vsQMZTPn9RCbNRmEbAGK2SawwM'),
(54, 'dd316da26095319c072e378444159a9e', 'd3101975-110b-492a-94a6-edb7a84678ce', 0, '2024-05-01 13:44:08', '2024-05-01 13:44:08', 'nlH34eVEW8cZgpVEQvKWOstlNluLNuZsdgKu'),
(55, 'dd316da26095319c072e378444159a9e', 'd88e0fca-77cb-482a-9b67-834f4c3dc2b2', 0, '2024-05-01 13:44:08', '2024-05-01 13:44:08', 'C7nUzV80KrKheRscjLubKIVFsCbVyc2KcYys'),
(56, 'dd316da26095319c072e378444159a9e', 'f2546789-c901-4e9d-8f23-ecc335a8b81e', 0, '2024-05-01 13:44:08', '2024-05-01 13:44:08', 'eSn55hZTFtlJ6RXLjsbPGgcPrWwIgADm5OnF'),
(57, 'f52bf8f0ffbaae4bce2a9a0f7b4143a5', '04038bf6-3d6c-43e5-924a-8ef514b8ac14', 0, '2024-05-01 13:44:08', '2024-05-01 13:44:08', 'qsk9OZX3H9wlRho2OKzfePPKIqLvFLQnq7Y0'),
(58, 'f52bf8f0ffbaae4bce2a9a0f7b4143a5', '2df4f759-271d-48b1-9523-2043b32e9ff7', 0, '2024-05-01 13:44:08', '2024-05-01 13:44:08', '6cBjSMZi5srHmKOjb8QilRQV02QrUojmhy4N'),
(59, 'f52bf8f0ffbaae4bce2a9a0f7b4143a5', '713c3647-84ae-444e-934f-f5ba95f1ebca', 0, '2024-05-01 13:44:08', '2024-05-01 13:44:08', 'Mzlnx5PlyxulchJehAoNlZHF53yxQ3lmnrX9'),
(60, 'f52bf8f0ffbaae4bce2a9a0f7b4143a5', '72ddc632-197a-494c-b409-4e49f59e6a87', 0, '2024-05-01 13:44:08', '2024-05-01 13:44:08', 'u9mppvN50xvpSsmVKZ3XTcLZKQsB0fqweyLs'),
(61, 'f52bf8f0ffbaae4bce2a9a0f7b4143a5', '7decaa06-bc9f-414e-adf5-601f408e95b1', 0, '2024-05-01 13:44:08', '2024-05-01 13:44:08', 'VkkYJSVyP97BSvEHImYn8AVCx3gzharuvy2U'),
(62, 'f52bf8f0ffbaae4bce2a9a0f7b4143a5', 'd3101975-110b-492a-94a6-edb7a84678ce', 0, '2024-05-01 13:44:08', '2024-05-01 13:44:08', 'Fe0MQ37Ry6bGrBjqggcKp6cg3465NqwwY85n'),
(63, 'f52bf8f0ffbaae4bce2a9a0f7b4143a5', 'd88e0fca-77cb-482a-9b67-834f4c3dc2b2', 0, '2024-05-01 13:44:08', '2024-05-01 13:44:08', 'uzy4qyJAM2PXja4U69lsaNVv5KmUu88LLUuh'),
(64, 'f52bf8f0ffbaae4bce2a9a0f7b4143a5', 'f2546789-c901-4e9d-8f23-ecc335a8b81e', 0, '2024-05-01 13:44:08', '2024-05-01 13:44:08', 'vrHAnsdWRp7nfuuQ3JieGM8MWafmUFDXDbCJ'),
(81, '9858d54d2949a2fa4934a359403c6019', '04038bf6-3d6c-43e5-924a-8ef514b8ac14', 0, '2024-05-01 18:14:37', '2024-05-01 18:14:37', 'rrWDOVKSiToMQK6uOlRXmqOTbgpEV1oq8D5x'),
(82, '9858d54d2949a2fa4934a359403c6019', '2df4f759-271d-48b1-9523-2043b32e9ff7', 200, '2024-05-01 18:14:37', '2024-05-01 18:14:37', 'qgthRZ1BYxScisQRvvZu7KVvfM7fVxfOGXnO'),
(83, '9858d54d2949a2fa4934a359403c6019', '713c3647-84ae-444e-934f-f5ba95f1ebca', 0, '2024-05-01 18:14:37', '2024-05-01 18:14:37', 'mu33Ivpjw1iRrBaKHdzijrcQyv9eA0Z57n16'),
(84, '9858d54d2949a2fa4934a359403c6019', '72ddc632-197a-494c-b409-4e49f59e6a87', 0, '2024-05-01 18:14:37', '2024-05-01 18:14:37', 'jnVJXa7OR8NeO6XjxbcQg7xRSPgVXcq362GA'),
(85, '9858d54d2949a2fa4934a359403c6019', '7decaa06-bc9f-414e-adf5-601f408e95b1', 0, '2024-05-01 18:14:37', '2024-05-01 18:14:37', 'ObLXOv1arzJfIfeBasmD5kD3RRJry22nlHOO'),
(86, '9858d54d2949a2fa4934a359403c6019', 'd3101975-110b-492a-94a6-edb7a84678ce', 0, '2024-05-01 18:14:37', '2024-05-01 18:14:37', 'Xhwm7Y0IqLL0ubMJok4lB6YrdriFbWzCtDDg'),
(87, '9858d54d2949a2fa4934a359403c6019', 'd88e0fca-77cb-482a-9b67-834f4c3dc2b2', 0, '2024-05-01 18:14:37', '2024-05-01 18:14:37', 'k2s78SeNpBebcoNgTDEUiAY7TZDToNSDZFEf'),
(88, '9858d54d2949a2fa4934a359403c6019', 'f2546789-c901-4e9d-8f23-ecc335a8b81e', 0, '2024-05-01 18:14:37', '2024-05-01 18:14:37', 'j31RNAChgcF7YgVCqxrlOBRNTe9IPHOYyuVn'),
(89, '82ba2a6ee861d2c0058f055e7cc544ea', '04038bf6-3d6c-43e5-924a-8ef514b8ac14', 0, '2024-07-22 21:49:24', '2024-07-22 21:49:24', 'n2Yuge4W8eqQ3h71bCmAQ49kBVkaglxluoub'),
(90, '82ba2a6ee861d2c0058f055e7cc544ea', '2df4f759-271d-48b1-9523-2043b32e9ff7', 0, '2024-07-22 21:49:24', '2024-07-22 21:49:24', 'o6sGJGbTYDhIeYUJP8PoiPis5QyNUH1eyZgb'),
(91, '82ba2a6ee861d2c0058f055e7cc544ea', '713c3647-84ae-444e-934f-f5ba95f1ebca', 0, '2024-07-22 21:49:24', '2024-07-22 21:49:24', 'yYcuWbysEk61LeuqFqFzZ00RWUrR9gEfzOJK'),
(92, '82ba2a6ee861d2c0058f055e7cc544ea', '72ddc632-197a-494c-b409-4e49f59e6a87', 0, '2024-07-22 21:49:24', '2024-07-22 21:49:24', 'G0ykqu70pzOTLHGLCGMInzvLK59hvzTnjxji'),
(93, '82ba2a6ee861d2c0058f055e7cc544ea', '7decaa06-bc9f-414e-adf5-601f408e95b1', 0, '2024-07-22 21:49:24', '2024-07-22 21:49:24', 'uLSmQpIjC6P1hXa1xdREqq3cvaYJTR3zZNAm'),
(94, '82ba2a6ee861d2c0058f055e7cc544ea', 'd3101975-110b-492a-94a6-edb7a84678ce', 0, '2024-07-22 21:49:24', '2024-07-22 21:49:24', 'idI7WDUe7DKCUQX2uiD7ToNOQUQXbSbqxXgh'),
(95, '82ba2a6ee861d2c0058f055e7cc544ea', 'd88e0fca-77cb-482a-9b67-834f4c3dc2b2', 0, '2024-07-22 21:49:24', '2024-07-22 21:49:24', '5oT2PQS0buBDoYoBN85KuXRAGdKUyWuCAJHj'),
(96, '82ba2a6ee861d2c0058f055e7cc544ea', 'f2546789-c901-4e9d-8f23-ecc335a8b81e', 0, '2024-07-22 21:49:24', '2024-07-22 21:49:24', 'sK2Br8MMl0O9kFCgzOK15HCCxV1DR0afpKZZ');

-- --------------------------------------------------------

--
-- Table structure for table `withdrawal`
--

CREATE TABLE `withdrawal` (
  `id` int(11) NOT NULL,
  `user_id` varchar(32) NOT NULL,
  `wallet_id` varchar(36) NOT NULL,
  `amount` float NOT NULL,
  `wallet_addr` varchar(80) NOT NULL,
  `network` varchar(255) NOT NULL,
  `stat` int(11) NOT NULL DEFAULT 0,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp(),
  `attended_by` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `withdrawal`
--

INSERT INTO `withdrawal` (`id`, `user_id`, `wallet_id`, `amount`, `wallet_addr`, `network`, `stat`, `created_at`, `updated_at`, `attended_by`) VALUES
(10, '4334bf0404f8b59eef99ddf1a9e7e1e4', 'MRcvqZa5WJzFynlA5NPOjlUTUIySA73Q9ipc', 0.23, 'trx-sjocoOjoco-xx-aopckroiqpdioevrooklj', 'network_value_here', 1, '2024-05-02 09:29:17', '2024-05-02 09:29:17', 1),
(11, '9858d54d2949a2fa4934a359403c6019', 'qgthRZ1BYxScisQRvvZu7KVvfM7fVxfOGXnO', 20, 'cwihrihcimemyopayoilmoney', 'network_value_here', 1, '2024-07-31 16:25:56', '2024-07-31 16:25:56', 0),
(12, '9858d54d2949a2fa4934a359403c6019', 'qgthRZ1BYxScisQRvvZu7KVvfM7fVxfOGXnO', 15, 'cwihrihcimemyopayoilmoney', 'network_value_here', 0, '2024-07-31 17:08:45', '2024-07-31 17:08:45', 0),
(13, '9858d54d2949a2fa4934a359403c6019', 'qgthRZ1BYxScisQRvvZu7KVvfM7fVxfOGXnO', 50, 'cwihrihcimemyopayoilmoney', 'network_value_here', 2, '2024-07-31 17:20:43', '2024-07-31 17:20:43', 1),
(14, '9858d54d2949a2fa4934a359403c6019', 'qgthRZ1BYxScisQRvvZu7KVvfM7fVxfOGXnO', 50, 'cwihrihcimemyopayoilmoney', 'network_value_here', 1, '2024-07-31 17:21:58', '2024-07-31 17:21:58', 1);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admins`
--
ALTER TABLE `admins`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `app_d`
--
ALTER TABLE `app_d`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `bank_acc_info`
--
ALTER TABLE `bank_acc_info`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id` (`id`);

--
-- Indexes for table `coins`
--
ALTER TABLE `coins`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `coin_networks`
--
ALTER TABLE `coin_networks`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `deposits`
--
ALTER TABLE `deposits`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `funding`
--
ALTER TABLE `funding`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `kyc_level_1`
--
ALTER TABLE `kyc_level_1`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `kyc_level_2`
--
ALTER TABLE `kyc_level_2`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `kyc_level_3`
--
ALTER TABLE `kyc_level_3`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `kyc_status`
--
ALTER TABLE `kyc_status`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `user_id` (`user_id`);

--
-- Indexes for table `naira_withdrawal`
--
ALTER TABLE `naira_withdrawal`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `networks`
--
ALTER TABLE `networks`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `transactions`
--
ALTER TABLE `transactions`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user_wallets`
--
ALTER TABLE `user_wallets`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `withdrawal`
--
ALTER TABLE `withdrawal`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admins`
--
ALTER TABLE `admins`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `app_d`
--
ALTER TABLE `app_d`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `bank_acc_info`
--
ALTER TABLE `bank_acc_info`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `coin_networks`
--
ALTER TABLE `coin_networks`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `deposits`
--
ALTER TABLE `deposits`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `funding`
--
ALTER TABLE `funding`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `kyc_level_1`
--
ALTER TABLE `kyc_level_1`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `kyc_level_2`
--
ALTER TABLE `kyc_level_2`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `kyc_level_3`
--
ALTER TABLE `kyc_level_3`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `kyc_status`
--
ALTER TABLE `kyc_status`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `naira_withdrawal`
--
ALTER TABLE `naira_withdrawal`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `transactions`
--
ALTER TABLE `transactions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `user_wallets`
--
ALTER TABLE `user_wallets`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=97;

--
-- AUTO_INCREMENT for table `withdrawal`
--
ALTER TABLE `withdrawal`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
