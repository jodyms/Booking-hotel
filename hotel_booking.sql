-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Sep 08, 2025 at 11:18 AM
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
-- Database: `hotel_booking`
--

-- --------------------------------------------------------

--
-- Table structure for table `amenities`
--

CREATE TABLE `amenities` (
  `id` bigint(20) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `icon` varchar(50) DEFAULT NULL,
  `is_active` bit(1) NOT NULL,
  `name` varchar(100) NOT NULL,
  `updated_at` datetime(6) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `amenities`
--

INSERT INTO `amenities` (`id`, `created_at`, `description`, `icon`, `is_active`, `name`, `updated_at`) VALUES
(1, '2025-09-02 03:52:36.000000', 'Free wireless internet access', 'wifi', b'1', 'WiFi', '2025-09-02 03:52:36.000000'),
(2, '2025-09-02 03:52:36.000000', 'Climate control with air conditioning', 'ac', b'1', 'Air Conditioning', '2025-09-02 03:52:36.000000'),
(3, '2025-09-02 03:52:36.000000', 'Flat screen television with cable channels', 'tv', b'1', 'TV', '2025-09-02 03:52:36.000000'),
(4, '2025-09-02 03:52:36.000000', 'In-room mini refrigerator with beverages and snacks', 'minibar', b'1', 'Mini Bar', '2025-09-02 03:52:36.000000'),
(5, '2025-09-02 03:52:36.000000', '24-hour room service available', 'room-service', b'1', 'Room Service', '2025-09-02 03:52:36.000000'),
(6, '2025-09-02 03:52:36.000000', 'In-room safety deposit box', 'safe', b'1', 'Safe', '2025-09-02 03:52:36.000000'),
(7, '2025-09-02 03:52:36.000000', 'Private balcony with outdoor seating', 'balcony', b'1', 'Balcony', '2025-09-02 03:52:36.000000'),
(8, '2025-09-02 03:52:36.000000', 'Room with ocean view', 'ocean-view', b'1', 'Ocean View', '2025-09-02 03:52:36.000000'),
(9, '2025-09-02 03:52:36.000000', 'Room with city skyline view', 'city-view', b'1', 'City View', '2025-09-02 03:52:36.000000'),
(10, '2025-09-02 03:52:36.000000', 'Private hot tub or jacuzzi', 'hot-tub', b'1', 'Hot Tub', '2025-09-02 03:52:36.000000'),
(11, '2025-09-02 03:52:36.000000', 'In-room fireplace', 'fireplace', b'1', 'Fireplace', '2025-09-02 03:52:36.000000'),
(12, '2025-09-02 03:52:36.000000', 'Full kitchen with cooking facilities', 'kitchen', b'1', 'Kitchen', '2025-09-02 03:52:36.000000'),
(13, '2025-09-02 03:52:36.000000', 'Small kitchen area with basic cooking facilities', 'kitchenette', b'1', 'Kitchenette', '2025-09-02 03:52:36.000000'),
(14, '2025-09-02 03:52:36.000000', 'In-room washing machine', 'washing-machine', b'1', 'Washing Machine', '2025-09-02 03:52:36.000000'),
(15, '2025-09-02 03:52:36.000000', 'Dedicated parking space', 'parking', b'1', 'Parking', '2025-09-02 03:52:36.000000'),
(16, '2025-09-02 03:52:36.000000', 'Pets allowed in room', 'pet-friendly', b'1', 'Pet Friendly', '2025-09-02 03:52:36.000000'),
(17, '2025-09-02 03:52:36.000000', 'Smoking permitted in room', 'smoking', b'1', 'Smoking Allowed', '2025-09-02 03:52:36.000000'),
(18, '2025-09-02 03:52:36.000000', 'Non-smoking room', 'no-smoking', b'1', 'Non-Smoking', '2025-09-02 03:52:36.000000'),
(19, '2025-09-02 03:52:36.000000', 'Work desk with chair', 'desk', b'1', 'Desk', '2025-09-02 03:52:36.000000'),
(20, '2025-09-02 03:52:36.000000', 'Comfortable seating area with sofa', 'sofa', b'1', 'Sofa', '2025-09-02 03:52:36.000000'),
(21, '2025-09-02 03:52:36.000000', 'In-room coffee making facilities', 'coffee', b'1', 'Coffee Maker', '2025-09-02 03:52:36.000000'),
(22, '2025-09-02 03:52:36.000000', 'Hair dryer available in bathroom', 'hair-dryer', b'1', 'Hair Dryer', '2025-09-02 03:52:36.000000'),
(23, '2025-09-02 03:52:36.000000', 'Iron and ironing board provided', 'iron', b'1', 'Iron & Ironing Board', '2025-09-02 03:52:36.000000'),
(24, '2025-09-02 03:52:36.000000', 'Full bathtub in bathroom', 'bathtub', b'1', 'Bathtub', '2025-09-02 03:52:36.000000'),
(25, '2025-09-02 03:52:36.000000', 'Separate shower in bathroom', 'shower', b'1', 'Shower', '2025-09-02 03:52:36.000000'),
(26, '2025-09-02 03:52:36.000000', 'Fresh towels provided', 'towels', b'1', 'Towels', '2025-09-02 03:52:36.000000'),
(27, '2025-09-02 03:52:36.000000', 'Complimentary toiletries', 'toiletries', b'1', 'Toiletries', '2025-09-02 03:52:36.000000'),
(28, '2025-09-02 03:52:36.000000', 'Access to hotel gym facilities', 'gym', b'1', 'Gym Access', '2025-09-02 03:52:36.000000'),
(29, '2025-09-02 03:52:36.000000', 'Access to hotel swimming pool', 'pool', b'1', 'Pool Access', '2025-09-02 03:52:36.000000'),
(30, '2025-09-02 03:52:36.000000', 'Access to hotel spa services', 'spa', b'1', 'Spa Access', '2025-09-02 03:52:36.000000');

-- --------------------------------------------------------

--
-- Table structure for table `bookings`
--

CREATE TABLE `bookings` (
  `id` bigint(20) NOT NULL,
  `adult_capacity` int(11) NOT NULL,
  `check_in_date` date NOT NULL,
  `check_out_date` date NOT NULL,
  `children_capacity` int(11) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `first_name` varchar(50) NOT NULL,
  `last_name` varchar(50) NOT NULL,
  `pronouns` varchar(20) NOT NULL,
  `status` enum('BOOKED','CANCELLED','CHECKED_IN','CHECKED_OUT') NOT NULL,
  `total_amount` decimal(10,2) NOT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `room_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `bookings`
--

INSERT INTO `bookings` (`id`, `adult_capacity`, `check_in_date`, `check_out_date`, `children_capacity`, `created_at`, `first_name`, `last_name`, `pronouns`, `status`, `total_amount`, `updated_at`, `room_id`) VALUES
(1, 1, '2025-09-03', '2025-09-04', 0, '2025-09-03 02:14:39.000000', 'test', 'te', 'Mr', 'CANCELLED', 1111.00, '2025-09-04 03:28:09.000000', 542),
(2, 1, '2025-09-08', '2025-09-09', 0, '2025-09-03 06:35:32.000000', 'customer', 'baru', 'Mr', 'CHECKED_IN', 100.00, '2025-09-08 03:04:28.000000', 543),
(3, 1, '2025-09-04', '2025-09-05', 0, '2025-09-04 03:28:43.000000', 'qw', 'qw', 'Mr', 'CHECKED_OUT', 3660.00, '2025-09-04 03:55:44.000000', 1),
(4, 1, '2025-09-04', '2025-09-05', 0, '2025-09-04 04:26:24.000000', 'qwe', 'qwe', 'Mr', 'CHECKED_IN', 600.00, '2025-09-04 04:26:30.000000', 2),
(5, 1, '2025-09-04', '2025-09-06', 0, '2025-09-04 04:31:00.000000', 'ttt', 'ttt', 'Mr', 'CANCELLED', 2200.00, '2025-09-04 06:34:40.000000', 7),
(6, 1, '2025-09-04', '2025-09-06', 0, '2025-09-04 06:33:51.000000', 'qwerty', 'qwerty', 'Mr', 'CHECKED_OUT', 3660.00, '2025-09-04 06:34:30.000000', 4),
(7, 2, '2025-09-08', '2025-09-11', 0, '2025-09-08 05:02:04.000000', 'John', 'Smith', 'he/him', 'BOOKED', 450.00, '2025-09-08 05:02:04.000000', 1),
(8, 2, '2025-09-08', '2025-09-10', 1, '2025-09-08 05:02:04.000000', 'Sarah', 'Johnson', 'she/her', 'BOOKED', 500.00, '2025-09-08 05:02:04.000000', 3),
(9, 2, '2025-09-06', '2025-09-08', 1, '2025-09-08 05:02:04.000000', 'Lisa', 'Anderson', 'she/her', 'CHECKED_IN', 300.00, '2025-09-08 05:02:04.000000', 2),
(10, 2, '2025-09-08', '2025-09-10', 0, '2025-09-08 05:02:04.000000', 'Guest0', 'User0', 'he/him', 'BOOKED', 1200.00, '2025-09-08 05:02:04.000000', 1),
(11, 2, '2025-09-09', '2025-09-11', 1, '2025-09-08 05:02:04.000000', 'Guest1', 'User1', 'she/her', 'CHECKED_IN', 1200.00, '2025-09-08 05:02:04.000000', 2),
(12, 2, '2025-09-10', '2025-09-12', 0, '2025-09-08 05:02:04.000000', 'Guest2', 'User2', 'he/him', 'CHECKED_OUT', 1200.00, '2025-09-08 05:02:04.000000', 3),
(13, 2, '2025-09-11', '2025-09-13', 1, '2025-09-08 05:02:04.000000', 'Guest3', 'User3', 'she/her', 'BOOKED', 1200.00, '2025-09-08 05:02:04.000000', 4),
(14, 2, '2025-09-12', '2025-09-14', 0, '2025-09-08 05:02:04.000000', 'Guest4', 'User4', 'he/him', 'CHECKED_IN', 2000.00, '2025-09-08 05:02:04.000000', 5),
(15, 2, '2025-09-13', '2025-09-15', 1, '2025-09-08 05:02:04.000000', 'Guest5', 'User5', 'she/her', 'CHECKED_OUT', 2000.00, '2025-09-08 05:02:04.000000', 6),
(16, 2, '2025-09-14', '2025-09-16', 0, '2025-09-08 05:02:04.000000', 'Guest6', 'User6', 'he/him', 'BOOKED', 2200.00, '2025-09-08 05:02:04.000000', 7);

-- --------------------------------------------------------

--
-- Table structure for table `rooms`
--

CREATE TABLE `rooms` (
  `id` bigint(20) NOT NULL,
  `adult_capacity` int(11) NOT NULL,
  `children_capacity` int(11) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `room_number` varchar(10) NOT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `is_active` bit(1) NOT NULL,
  `room_type` enum('STANDARD','DELUXE','SUITE') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `rooms`
--

INSERT INTO `rooms` (`id`, `adult_capacity`, `children_capacity`, `created_at`, `price`, `room_number`, `updated_at`, `description`, `is_active`, `room_type`) VALUES
(1, 2, 2, '2025-09-02 10:44:38.000000', 600.00, '101', '2025-09-03 02:46:41.000000', NULL, b'0', 'STANDARD'),
(2, 2, 2, '2025-09-02 10:44:38.000000', 600.00, '102', '2025-09-02 10:44:38.000000', NULL, b'0', 'STANDARD'),
(3, 3, 2, '2025-09-02 10:44:38.000000', 600.00, '103', '2025-09-02 10:44:38.000000', NULL, b'0', 'STANDARD'),
(4, 3, 2, '2025-09-02 10:44:38.000000', 600.00, '104', '2025-09-02 10:44:38.000000', NULL, b'0', 'STANDARD'),
(5, 3, 1, '2025-09-02 10:44:38.000000', 1000.00, '105', '2025-09-02 10:44:38.000000', NULL, b'0', 'STANDARD'),
(6, 3, 2, '2025-09-02 10:44:38.000000', 1000.00, '106', '2025-09-02 10:44:38.000000', NULL, b'0', 'STANDARD'),
(7, 4, 2, '2025-09-02 10:44:38.000000', 1100.00, '107', '2025-09-02 10:44:38.000000', NULL, b'0', 'STANDARD'),
(8, 5, 2, '2025-09-02 10:44:38.000000', 1100.00, '108', '2025-09-02 10:44:38.000000', NULL, b'0', 'STANDARD'),
(9, 2, 1, '2025-09-02 10:44:38.000000', 650.00, '201', '2025-09-02 10:44:38.000000', NULL, b'0', 'STANDARD'),
(10, 2, 2, '2025-09-02 10:44:38.000000', 650.00, '202', '2025-09-02 10:44:38.000000', NULL, b'0', 'STANDARD'),
(11, 3, 1, '2025-09-02 10:44:38.000000', 650.00, '203', '2025-09-02 10:44:38.000000', NULL, b'0', 'STANDARD'),
(12, 3, 2, '2025-09-02 10:44:38.000000', 650.00, '204', '2025-09-02 10:44:38.000000', NULL, b'0', 'STANDARD'),
(13, 4, 2, '2025-09-02 10:44:38.000000', 1050.00, '205', '2025-09-02 10:44:38.000000', NULL, b'0', 'STANDARD'),
(14, 4, 2, '2025-09-02 10:44:38.000000', 1050.00, '206', '2025-09-02 10:44:38.000000', NULL, b'0', 'STANDARD'),
(15, 5, 2, '2025-09-02 10:44:38.000000', 1150.00, '207', '2025-09-02 10:44:38.000000', NULL, b'0', 'STANDARD'),
(16, 5, 3, '2025-09-02 10:44:38.000000', 1150.00, '208', '2025-09-02 10:44:38.000000', NULL, b'0', 'STANDARD'),
(17, 2, 1, '2025-09-02 10:44:38.000000', 700.00, '301', '2025-09-02 10:44:38.000000', NULL, b'0', 'STANDARD'),
(18, 2, 2, '2025-09-02 10:44:38.000000', 700.00, '302', '2025-09-02 10:44:38.000000', NULL, b'0', 'STANDARD'),
(19, 3, 1, '2025-09-02 10:44:38.000000', 700.00, '303', '2025-09-02 10:44:38.000000', NULL, b'0', 'STANDARD'),
(20, 3, 2, '2025-09-02 10:44:38.000000', 700.00, '304', '2025-09-02 10:44:38.000000', NULL, b'0', 'STANDARD'),
(21, 4, 2, '2025-09-02 10:44:38.000000', 1100.00, '305', '2025-09-02 10:44:38.000000', NULL, b'0', 'STANDARD'),
(22, 4, 2, '2025-09-02 10:44:38.000000', 1100.00, '306', '2025-09-02 10:44:38.000000', NULL, b'0', 'STANDARD'),
(23, 5, 2, '2025-09-02 10:44:38.000000', 1200.00, '307', '2025-09-02 10:44:38.000000', NULL, b'0', 'STANDARD'),
(24, 6, 3, '2025-09-02 10:44:38.000000', 1200.00, '308', '2025-09-02 10:44:38.000000', NULL, b'0', 'STANDARD'),
(25, 1, 0, '2025-09-02 10:44:38.000000', 500.00, '401', '2025-09-02 10:44:38.000000', NULL, b'0', 'STANDARD'),
(26, 1, 1, '2025-09-02 10:44:38.000000', 550.00, '402', '2025-09-02 10:44:38.000000', NULL, b'0', 'STANDARD'),
(27, 2, 1, '2025-09-02 10:44:38.000000', 600.00, '403', '2025-09-02 10:44:38.000000', NULL, b'0', 'STANDARD'),
(28, 2, 2, '2025-09-02 10:44:38.000000', 650.00, '404', '2025-09-02 10:44:38.000000', NULL, b'0', 'STANDARD'),
(29, 4, 2, '2025-09-02 10:44:38.000000', 1500.00, '501', '2025-09-02 10:44:38.000000', NULL, b'0', 'STANDARD'),
(30, 6, 4, '2025-09-02 10:44:38.000000', 2000.00, '502', '2025-09-02 10:44:38.000000', NULL, b'0', 'STANDARD'),
(541, 1, 1, '2025-09-02 06:03:05.000000', 100.00, 'test0001', '2025-09-02 06:03:05.000000', NULL, b'0', 'STANDARD'),
(542, 11, 1, '2025-09-02 08:29:16.000000', 1111.00, '101886', '2025-09-03 02:46:51.000000', NULL, b'0', 'STANDARD'),
(543, 1, 1, '2025-09-03 06:34:54.000000', 100.00, 'room123', '2025-09-03 06:34:54.000000', NULL, b'0', 'STANDARD');

-- --------------------------------------------------------

--
-- Table structure for table `room_amenities`
--

CREATE TABLE `room_amenities` (
  `room_id` bigint(20) NOT NULL,
  `amenity_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `room_amenities`
--

INSERT INTO `room_amenities` (`room_id`, `amenity_id`) VALUES
(1, 3),
(541, 1),
(541, 2),
(542, 1),
(542, 14),
(543, 1),
(543, 3);

-- --------------------------------------------------------

--
-- Table structure for table `room_services`
--

CREATE TABLE `room_services` (
  `id` bigint(20) NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `completed_at` datetime(6) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `guest_name` varchar(255) DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `requested_at` datetime(6) NOT NULL,
  `room_number` varchar(255) NOT NULL,
  `service_type` varchar(255) NOT NULL,
  `status` enum('PENDING','IN_PROGRESS','COMPLETED','CANCELLED') NOT NULL,
  `updated_at` datetime(6) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `room_services`
--

INSERT INTO `room_services` (`id`, `amount`, `completed_at`, `description`, `guest_name`, `notes`, `requested_at`, `room_number`, `service_type`, `status`, `updated_at`) VALUES
(1, 1.00, NULL, 'Room cleaning service', NULL, NULL, '2025-09-08 02:33:18.000000', '101', 'CLEANING', 'PENDING', '2025-09-08 02:33:18.000000'),
(2, 1.00, NULL, '1', NULL, NULL, '2025-09-08 02:55:02.000000', '101', 'CLEANING', 'PENDING', '2025-09-08 02:55:02.000000'),
(3, 1.00, NULL, '1', 'customer baru', NULL, '2025-09-08 03:15:43.000000', 'room123', 'MINI_BAR', 'PENDING', '2025-09-08 03:15:43.000000');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` bigint(20) NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `first_name` varchar(255) DEFAULT NULL,
  `is_active` bit(1) DEFAULT NULL,
  `last_name` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `phone_number` varchar(255) DEFAULT NULL,
  `role` enum('USER','ADMIN') DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `created_at`, `email`, `first_name`, `is_active`, `last_name`, `password`, `phone_number`, `role`, `updated_at`) VALUES
(1, '2025-09-01 04:34:28.000000', 'admin@example.com', 'admin', b'1', 'admin', '$2a$10$zyLm65J1cJMgF8I9kAcUDO9kgVkM9Z2bUyvUmUaJo34u0CdkNR4Au', '089248238', 'USER', '2025-09-01 04:34:28.000000'),
(2, '2025-09-02 04:05:46.000000', 'admin@hotel.com', 'Admin', b'1', 'User', '$2a$10$PF9O5GRu3rtfAatUIab5QObPVZxyqr.pnXcfS2vY/iaTz.hO5T1Du', '+1234567890', 'ADMIN', '2025-09-02 04:05:46.000000');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `amenities`
--
ALTER TABLE `amenities`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UK_m492b3r7aa2c88y156nvic16s` (`name`),
  ADD UNIQUE KEY `UKm492b3r7aa2c88y156nvic16s` (`name`);

--
-- Indexes for table `bookings`
--
ALTER TABLE `bookings`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FKrgoycol97o21kpjodw1qox4nc` (`room_id`);

--
-- Indexes for table `rooms`
--
ALTER TABLE `rooms`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UK_7ljglxlj90ln3lbas4kl983m2` (`room_number`),
  ADD UNIQUE KEY `UK7ljglxlj90ln3lbas4kl983m2` (`room_number`);

--
-- Indexes for table `room_amenities`
--
ALTER TABLE `room_amenities`
  ADD PRIMARY KEY (`room_id`,`amenity_id`),
  ADD KEY `FKm1qu088g1b1ufhd2mae8fhhmb` (`amenity_id`);

--
-- Indexes for table `room_services`
--
ALTER TABLE `room_services`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UK_6dotkott2kjsp8vw4d0m25fb7` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `amenities`
--
ALTER TABLE `amenities`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4745;

--
-- AUTO_INCREMENT for table `bookings`
--
ALTER TABLE `bookings`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `rooms`
--
ALTER TABLE `rooms`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=544;

--
-- AUTO_INCREMENT for table `room_services`
--
ALTER TABLE `room_services`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `bookings`
--
ALTER TABLE `bookings`
  ADD CONSTRAINT `FKrgoycol97o21kpjodw1qox4nc` FOREIGN KEY (`room_id`) REFERENCES `rooms` (`id`);

--
-- Constraints for table `room_amenities`
--
ALTER TABLE `room_amenities`
  ADD CONSTRAINT `FKm1qu088g1b1ufhd2mae8fhhmb` FOREIGN KEY (`amenity_id`) REFERENCES `amenities` (`id`),
  ADD CONSTRAINT `FKps6ofup9gxhn8juqvproxbaud` FOREIGN KEY (`room_id`) REFERENCES `rooms` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
