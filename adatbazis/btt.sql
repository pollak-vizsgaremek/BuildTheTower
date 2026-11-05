-- phpMyAdmin SQL Dump
-- version 5.2.3
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Nov 05, 2026 at 10:58 AM
-- Server version: 8.4.3
-- PHP Version: 8.3.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `btt`
--

-- --------------------------------------------------------

--
-- Table structure for table `ceg`
--

CREATE TABLE `ceg` (
  `ceg_id` int NOT NULL,
  `nev` varchar(256) COLLATE utf8mb4_hungarian_ci NOT NULL,
  `szekhely` varchar(256) COLLATE utf8mb4_hungarian_ci NOT NULL,
  `email` varchar(256) COLLATE utf8mb4_hungarian_ci NOT NULL,
  `telefonszam` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_hungarian_ci;

-- --------------------------------------------------------

--
-- Table structure for table `dokumentum`
--

CREATE TABLE `dokumentum` (
  `dokumentum_id` int NOT NULL,
  `fajlnev` varchar(256) COLLATE utf8mb4_hungarian_ci NOT NULL,
  `tipus` varchar(256) COLLATE utf8mb4_hungarian_ci NOT NULL,
  `fajl_meret` int NOT NULL,
  `feltoltes_datum` datetime NOT NULL,
  `leiras` text COLLATE utf8mb4_hungarian_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_hungarian_ci;

-- --------------------------------------------------------

--
-- Table structure for table `dolgozo`
--

CREATE TABLE `dolgozo` (
  `dolgozo_id` int NOT NULL,
  `belepes_idopont` datetime NOT NULL,
  `kilepes_idopont` datetime NOT NULL,
  `nev` varchar(256) COLLATE utf8mb4_hungarian_ci NOT NULL,
  `email` varchar(256) COLLATE utf8mb4_hungarian_ci NOT NULL,
  `telszam` int NOT NULL,
  `pozicio` varchar(256) COLLATE utf8mb4_hungarian_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_hungarian_ci;

-- --------------------------------------------------------

--
-- Table structure for table `epitkezes`
--

CREATE TABLE `epitkezes` (
  `epitkezes_id` int NOT NULL,
  `statusz` varchar(256) COLLATE utf8mb4_hungarian_ci NOT NULL,
  `nev` varchar(256) COLLATE utf8mb4_hungarian_ci NOT NULL,
  `helyszin` varchar(256) COLLATE utf8mb4_hungarian_ci NOT NULL,
  `kezdes_datum` datetime NOT NULL,
  `befejezes_datum` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_hungarian_ci;

-- --------------------------------------------------------

--
-- Table structure for table `munkavegzes`
--

CREATE TABLE `munkavegzes` (
  `munakvegzes_id` int NOT NULL,
  `szerepkor` varchar(256) COLLATE utf8mb4_hungarian_ci NOT NULL,
  `kezdes_datum` datetime NOT NULL,
  `befejezes_datum` int NOT NULL,
  `ledolgozott_orak` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_hungarian_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `ceg`
--
ALTER TABLE `ceg`
  ADD PRIMARY KEY (`ceg_id`);

--
-- Indexes for table `dokumentum`
--
ALTER TABLE `dokumentum`
  ADD PRIMARY KEY (`dokumentum_id`);

--
-- Indexes for table `dolgozo`
--
ALTER TABLE `dolgozo`
  ADD PRIMARY KEY (`dolgozo_id`);

--
-- Indexes for table `epitkezes`
--
ALTER TABLE `epitkezes`
  ADD PRIMARY KEY (`epitkezes_id`);

--
-- Indexes for table `munkavegzes`
--
ALTER TABLE `munkavegzes`
  ADD PRIMARY KEY (`munakvegzes_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `ceg`
--
ALTER TABLE `ceg`
  MODIFY `ceg_id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `dokumentum`
--
ALTER TABLE `dokumentum`
  MODIFY `dokumentum_id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `dolgozo`
--
ALTER TABLE `dolgozo`
  MODIFY `dolgozo_id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `epitkezes`
--
ALTER TABLE `epitkezes`
  MODIFY `epitkezes_id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `munkavegzes`
--
ALTER TABLE `munkavegzes`
  MODIFY `munakvegzes_id` int NOT NULL AUTO_INCREMENT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
