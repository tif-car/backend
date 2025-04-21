CREATE DATABASE  IF NOT EXISTS `zoo` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `zoo`;
-- MySQL dump 10.13  Distrib 8.0.42, for Win64 (x86_64)
--
-- Host: zooproject.mysql.database.azure.com    Database: zoo
-- ------------------------------------------------------
-- Server version	8.0.40-azure

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `animal`
--

DROP TABLE IF EXISTS `animal`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `animal` (
  `Animal_ID` int NOT NULL AUTO_INCREMENT,
  `Animal_Name` varchar(30) NOT NULL,
  `Species_ID` int DEFAULT NULL,
  `Habitat_ID` int DEFAULT NULL,
  `Birth_Date` date DEFAULT NULL,
  `Wellness_Status` smallint DEFAULT NULL,
  PRIMARY KEY (`Animal_ID`),
  KEY `Species_ID` (`Species_ID`),
  KEY `Habitat_ID` (`Habitat_ID`),
  KEY `fk_wellnessStatus` (`Wellness_Status`),
  CONSTRAINT `animal_ibfk_1` FOREIGN KEY (`Species_ID`) REFERENCES `species` (`Species_ID`),
  CONSTRAINT `animal_ibfk_2` FOREIGN KEY (`Habitat_ID`) REFERENCES `habitat` (`Habitat_ID`),
  CONSTRAINT `fk_wellnessStatus` FOREIGN KEY (`Wellness_Status`) REFERENCES `wellness_type` (`wellness_typeID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=65 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `animal`
--

LOCK TABLES `animal` WRITE;
/*!40000 ALTER TABLE `animal` DISABLE KEYS */;
INSERT INTO `animal` VALUES (41,'Leo',11,201,'2018-06-15',1),(42,'Maya',12,202,'2020-03-22',3),(43,'Zara',13,204,'2017-11-05',1),(44,'Koda',14,204,'2019-01-30',2),(45,'Luna',15,205,'2021-07-14',1),(46,'Laura',11,201,'2019-12-25',1),(47,'Denver',16,204,'2020-03-16',1),(48,'Meg',17,201,'2015-09-22',1),(49,'Randy',18,204,'2018-02-17',1),(50,'Flin',19,206,'2014-08-01',1),(51,'Blu',21,206,'2010-07-21',1),(52,'Greg',20,207,'2017-04-07',1),(53,'Tom',22,208,'2005-04-06',3),(54,'Aby',23,209,'2023-10-07',1),(55,'Alice',23,209,'2024-04-03',1),(56,'Billy',23,209,'2023-01-10',1),(57,'Jerry',15,205,'2025-04-14',4),(58,'LeBron',23,209,NULL,1),(59,'b',23,209,'2025-04-17',4),(60,'a',23,209,'2025-04-18',4),(61,'g',23,209,'2025-04-18',2),(62,'h',23,209,'2025-04-18',4);
/*!40000 ALTER TABLE `animal` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `attraction`
--

DROP TABLE IF EXISTS `attraction`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `attraction` (
  `Attraction_ID` int NOT NULL AUTO_INCREMENT,
  `Attraction_Name` varchar(30) NOT NULL,
  `Annual_Cost` decimal(10,2) DEFAULT NULL,
  `Dept_ID` int DEFAULT NULL,
  `Habitat_ID` int DEFAULT NULL,
  `Status` int,
  PRIMARY KEY (`Attraction_ID`),
  KEY `Dept_ID` (`Dept_ID`),
  KEY `fk_habitat` (`Habitat_ID`),
  KEY `attraction_status_fk` (`Status`),
  CONSTRAINT `attraction_ibfk_1` FOREIGN KEY (`Dept_ID`) REFERENCES `department` (`Department_ID`),
  CONSTRAINT `attraction_status_fk` FOREIGN KEY (`Status`) REFERENCES `maintenance_location` (`Location_ID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_habitat` FOREIGN KEY (`Habitat_ID`) REFERENCES `habitat` (`Habitat_ID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=310 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `attraction`
--

LOCK TABLES `attraction` WRITE;
/*!40000 ALTER TABLE `attraction` DISABLE KEYS */;
INSERT INTO `attraction` VALUES (301,'Lion Lookout',22000.00,1,201,400),(302,'Elephant Falls',20000.00,1,202,401),(303,'Grizzly Trail',30000.00,1,204,402),(304,'Panda Pavilion',25000.00,1,204,403),(305,'Penguin Point',15000.00,3,205,404),(306,'General Zoo',30000.00,6,210,405),(307,'Kids Discovery Zone',17000.00,5,209,406);
/*!40000 ALTER TABLE `attraction` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `bulk_purchase`
--

DROP TABLE IF EXISTS `bulk_purchase`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `bulk_purchase` (
  `merch_id` int NOT NULL,
  `Bulk_cost` decimal(10,2) NOT NULL,
  `amount_of_items` int NOT NULL,
  `purchase_ID` int NOT NULL AUTO_INCREMENT,
  `date_purchased` date DEFAULT NULL,
  PRIMARY KEY (`purchase_ID`),
  KEY `bulk_purchase_merchandise_Merchandise_ID_fk` (`merch_id`),
  CONSTRAINT `bulk_purchase_merchandise_Merchandise_ID_fk` FOREIGN KEY (`merch_id`) REFERENCES `merchandise` (`Merchandise_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bulk_purchase`
--

LOCK TABLES `bulk_purchase` WRITE;
/*!40000 ALTER TABLE `bulk_purchase` DISABLE KEYS */;
INSERT INTO `bulk_purchase` VALUES (101,120.50,30,1,'2025-04-03'),(102,89.99,20,2,'2025-04-03'),(103,200.00,50,3,'2025-04-03'),(104,55.00,10,4,'2025-04-04'),(105,149.75,25,5,'2025-04-04'),(103,20.23,20,7,'2025-04-07'),(103,25.00,30,8,'2025-04-08'),(109,30.00,20,9,'2025-04-08'),(104,1.00,15,10,'2025-04-07'),(104,1.00,1,11,'2025-04-07'),(108,50.00,10,12,'2025-04-08'),(108,50.00,10,13,'2025-04-08'),(106,70.00,12,14,'2025-04-08'),(107,90.00,13,15,'2025-04-08'),(102,50.00,4,16,'2025-04-08'),(101,50.00,10,17,'2025-04-08'),(102,10.00,1,18,'2025-04-08'),(102,10.00,1,19,'2025-04-08'),(104,10.00,1,20,'2025-04-08'),(102,50.00,20,21,'2025-04-08'),(106,10.00,10,22,'2025-04-19'),(107,40.00,20,23,'2025-04-19'),(101,2.00,1,24,'2025-04-20'),(101,2.00,1,25,'2025-04-20'),(101,12.00,1,26,'2025-04-20'),(101,12.00,1,27,'2025-04-20'),(101,12.00,1,28,'2025-04-20'),(102,0.25,1,29,'2025-04-20'),(101,12.00,1,30,'2025-04-21');
/*!40000 ALTER TABLE `bulk_purchase` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`tycaram`@`%`*/ /*!50003 TRIGGER `after_bulk_purchase_insert` AFTER INSERT ON `bulk_purchase` FOR EACH ROW BEGIN
    DECLARE counter INT DEFAULT 0;

    WHILE counter < NEW.amount_of_items DO
        INSERT INTO single_item (merch_ID, order_ID)
        VALUES (NEW.merch_ID, NULL);
        SET counter = counter + 1;
    END WHILE;

END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`mabdull6`@`%`*/ /*!50003 TRIGGER `update_merch_cost_after_bulk_insert` AFTER INSERT ON `bulk_purchase` FOR EACH ROW BEGIN
  IF NEW.amount_of_items > 0 THEN
    UPDATE merchandise
    SET m_cost = ROUND(NEW.Bulk_cost / NEW.amount_of_items, 2)
    WHERE Merchandise_ID = NEW.merch_id;
  END IF;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`tycaram`@`%`*/ /*!50003 TRIGGER `after_bulk_purchase_update` AFTER UPDATE ON `bulk_purchase` FOR EACH ROW BEGIN
    DECLARE counter INT DEFAULT 0;

    WHILE counter < NEW.amount_of_items DO
        INSERT INTO single_item (merch_ID, order_ID)
        VALUES (NEW.merch_ID, NULL);
        SET counter = counter + 1;
    END WHILE;

END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Temporary view structure for view `bulk_purchase_view`
--

DROP TABLE IF EXISTS `bulk_purchase_view`;
/*!50001 DROP VIEW IF EXISTS `bulk_purchase_view`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `bulk_purchase_view` AS SELECT 
 1 AS `Purchase_ID`,
 1 AS `Merch_ID`,
 1 AS `Item_type`,
 1 AS `Item_name`,
 1 AS `amount_of_items`,
 1 AS `Bulk_cost`,
 1 AS `date_purchased`,
 1 AS `For_vendor`,
 1 AS `Item_sale_price`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `caretaker_view`
--

DROP TABLE IF EXISTS `caretaker_view`;
/*!50001 DROP VIEW IF EXISTS `caretaker_view`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `caretaker_view` AS SELECT 
 1 AS `Employee_ID`,
 1 AS `Habitat_Name`,
 1 AS `Department_Name`,
 1 AS `Animal_ID`,
 1 AS `Animal_Name`,
 1 AS `Habitat_ID`,
 1 AS `Species_Type`,
 1 AS `wellness_Types`,
 1 AS `Food_Type`,
 1 AS `Conservation_Type`*/;
SET character_set_client = @saved_cs_client;

--
-- Table structure for table `climate_type`
--

DROP TABLE IF EXISTS `climate_type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `climate_type` (
  `Climate_ID` smallint NOT NULL AUTO_INCREMENT,
  `Climate_Type` tinytext NOT NULL,
  PRIMARY KEY (`Climate_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `climate_type`
--

LOCK TABLES `climate_type` WRITE;
/*!40000 ALTER TABLE `climate_type` DISABLE KEYS */;
INSERT INTO `climate_type` VALUES (1,'Tropical'),(2,'Temperate'),(3,'Arctic');
/*!40000 ALTER TABLE `climate_type` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `closure`
--

DROP TABLE IF EXISTS `closure`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `closure` (
  `closure_ID` int NOT NULL AUTO_INCREMENT,
  `start_date` date NOT NULL,
  `end_date` date DEFAULT NULL,
  `location_ID` int DEFAULT NULL,
  `description` varchar(50) DEFAULT NULL,
  `mnt_ID` int DEFAULT NULL,
  PRIMARY KEY (`closure_ID`),
  KEY `closure entity_maintenance_Maintenance_ID_fk` (`mnt_ID`),
  KEY `closure_location_fk` (`location_ID`),
  CONSTRAINT `closure entity_maintenance_Maintenance_ID_fk` FOREIGN KEY (`mnt_ID`) REFERENCES `maintenance` (`Maintenance_ID`),
  CONSTRAINT `closure_location_fk` FOREIGN KEY (`location_ID`) REFERENCES `maintenance_location` (`Location_ID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `closure`
--

LOCK TABLES `closure` WRITE;
/*!40000 ALTER TABLE `closure` DISABLE KEYS */;
INSERT INTO `closure` VALUES (5,'2025-03-01','2025-03-04',412,'Routine inspection and sanitation',6),(6,'2025-03-10','2025-03-12',414,'Electrical rewiring and light check',7),(7,'2025-03-15','2025-03-15',400,'Emergency water pipe fix',8),(8,'2025-03-18','2025-03-20',409,'Crack sealing and repainting',9),(9,'2025-03-22','2025-03-24',404,'General maintenance and cleaning',10),(10,'2025-04-18',NULL,404,'because',10);
/*!40000 ALTER TABLE `closure` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Temporary view structure for view `closure_view`
--

DROP TABLE IF EXISTS `closure_view`;
/*!50001 DROP VIEW IF EXISTS `closure_view`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `closure_view` AS SELECT 
 1 AS `closure_ID`,
 1 AS `maintenance_ID`,
 1 AS `start_date`,
 1 AS `end_date`,
 1 AS `Location_type`,
 1 AS `Department_ID`,
 1 AS `Department`,
 1 AS `Location_Name`,
 1 AS `status_type`,
 1 AS `description`*/;
SET character_set_client = @saved_cs_client;

--
-- Table structure for table `conservation_type`
--

DROP TABLE IF EXISTS `conservation_type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `conservation_type` (
  `conservation_typeID` smallint NOT NULL AUTO_INCREMENT,
  `conservation_Type` tinytext NOT NULL,
  PRIMARY KEY (`conservation_typeID`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `conservation_type`
--

LOCK TABLES `conservation_type` WRITE;
/*!40000 ALTER TABLE `conservation_type` DISABLE KEYS */;
INSERT INTO `conservation_type` VALUES (1,'Least Concern'),(2,'Vulnerable'),(3,'Endangered');
/*!40000 ALTER TABLE `conservation_type` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `department`
--

DROP TABLE IF EXISTS `department`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `department` (
  `Department_ID` int NOT NULL AUTO_INCREMENT,
  `name` varchar(30) DEFAULT NULL,
  `Manager_ID` int DEFAULT NULL,
  PRIMARY KEY (`Department_ID`),
  KEY `Manager_ID` (`Manager_ID`),
  CONSTRAINT `department_ibfk_1` FOREIGN KEY (`Manager_ID`) REFERENCES `employee` (`Employee_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `department`
--

LOCK TABLES `department` WRITE;
/*!40000 ALTER TABLE `department` DISABLE KEYS */;
INSERT INTO `department` VALUES (1,'Mammals',3),(2,'Reptiles',14),(3,'Birds',14),(4,'Aquarium',14),(5,'Kid Zone',3),(6,'General',15);
/*!40000 ALTER TABLE `department` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `diet`
--

DROP TABLE IF EXISTS `diet`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `diet` (
  `Diet_ID` int NOT NULL AUTO_INCREMENT,
  `Food_Type` varchar(100) NOT NULL,
  PRIMARY KEY (`Diet_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `diet`
--

LOCK TABLES `diet` WRITE;
/*!40000 ALTER TABLE `diet` DISABLE KEYS */;
INSERT INTO `diet` VALUES (1,'Carnivore'),(2,'Herbivore'),(3,'Omnivore'),(4,'Insectivore');
/*!40000 ALTER TABLE `diet` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `diet_food_type`
--

DROP TABLE IF EXISTS `diet_food_type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `diet_food_type` (
  `Diet_ID` int NOT NULL,
  `foodtype_ID` smallint NOT NULL,
  PRIMARY KEY (`Diet_ID`,`foodtype_ID`),
  KEY `foodtype_ID` (`foodtype_ID`),
  CONSTRAINT `diet_food_type_ibfk_1` FOREIGN KEY (`Diet_ID`) REFERENCES `diet` (`Diet_ID`) ON DELETE CASCADE,
  CONSTRAINT `diet_food_type_ibfk_2` FOREIGN KEY (`foodtype_ID`) REFERENCES `food_type` (`foodtype_ID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `diet_food_type`
--

LOCK TABLES `diet_food_type` WRITE;
/*!40000 ALTER TABLE `diet_food_type` DISABLE KEYS */;
INSERT INTO `diet_food_type` VALUES (1,1),(1,2),(2,2);
/*!40000 ALTER TABLE `diet_food_type` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `employee`
--

DROP TABLE IF EXISTS `employee`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `employee` (
  `Employee_ID` int NOT NULL AUTO_INCREMENT,
  `first_Name` varchar(30) NOT NULL,
  `last_Name` varchar(30) DEFAULT NULL,
  `Role` smallint DEFAULT NULL,
  `Salary` decimal(10,2) DEFAULT NULL,
  `Phone_number` varchar(30) NOT NULL,
  `Email` varchar(50) NOT NULL,
  `password` varchar(30) NOT NULL,
  PRIMARY KEY (`Employee_ID`),
  UNIQUE KEY `Phone_number` (`Phone_number`),
  UNIQUE KEY `Email` (`Email`),
  KEY `fk_role` (`Role`),
  CONSTRAINT `fk_role` FOREIGN KEY (`Role`) REFERENCES `role_type` (`role_typeID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=52 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `employee`
--

LOCK TABLES `employee` WRITE;
/*!40000 ALTER TABLE `employee` DISABLE KEYS */;
INSERT INTO `employee` VALUES (1,'John','Doe',1,58000.00,'3334445555','john.doe@email.com','hashed_password1'),(2,'Jane','Smith',2,50000.00,'123-589-7891','jane.smith@email.com','hashed_password2'),(3,'Alice','Johnson',3,57000.00,'123-456-5588','alice.johnson@email.com','hashed_password3'),(4,'Bob','Brown',4,53000.00,'123-843-5321','bob.brown@email.com','hashed_password4'),(5,'Charlie ','White',5,56000.00,'123-431-7894','charlie.white@email.com','hashed_password5'),(12,'Billy','Wood',5,56000.00,'123-456-7895','billy.wood@email.com','hashed_password6'),(13,'Ken','Plum',2,50000.00,'123-786-8744','ken.p@email.com','hashed_password7'),(14,'Mike','Green',3,57000.00,'123-349-1277','mike.green@email.com','hashed_password8'),(15,'Taylor','Red',3,57000.00,'123-846-2733','taylor.red@email.com','hashed_password9'),(16,'Janet','Don',4,53000.00,'281-232-9988','janet.don@email.com','hashed_password10'),(17,'Peter','Le',5,56000.00,'281-233-4753','peter.le@email.com','hashed_password11'),(18,'Belle','Pin',4,53000.00,'281-776-3522','belle.pin@email.com','hashed_password12'),(19,'Abe','Mane',5,56000.00,'281-211-4587','abe.mane@email.com','hashed_password13'),(20,'Morgan','Quill',5,57000.00,'281-098-2344','morgan.quill@email.com','hashed_password14'),(21,'Jack','Ron',5,56000.00,'281-922-1746','jack.ron@email.com','hashed_password15'),(22,'Tony','Sol',4,53000.00,'281-556-4587','tony.sol@email.com','hashed_password16'),(23,'Marcus','Min',5,56000.00,'281-332-8475','marcus.min@email.com','hashed_password17'),(24,'Maggy','Olen',4,53000.00,'281-733-4246','maggie.olen@email.com','hashed_password18'),(25,'Rodney','Pack',5,56000.00,'281-345-0927','rodney.pack@email.com','hashed_password19'),(26,'Doug','Dick',4,53000.00,'123-456-7890','DD@email.com','hashed_password20'),(27,'Emily','Eve',4,53000.00,'281-321-5438','emily.eve@email.com','hashed_password21'),(28,'Sam','Sul',5,56000.00,'281-345-6549','sam.sul@email.com','hashed_password21'),(29,'Sally','Run',5,56000.00,'832-456-2718','sally.run@email.com','hashed_password22'),(30,'Jordan','Jay',5,56000.00,'832-356-3876','jordan.jay@email.com','hashed_password23'),(31,'Jeff','Jin',5,56000.00,'832-321-4736','jeff.jin@email.com','hashed_password24'),(32,'Jack','Chan',5,56000.00,'832-486-2149','jack.chan@email.com','hashed_password25'),(33,'Saul','Shall',5,56000.00,'832-432-5499','saul.shall@email.com','hashed_password26'),(34,'Meg','Loa',5,56000.00,'832-334-5566','meg.loa@email.com','hashed_password27'),(35,'Lola','Bin',4,53000.00,'832-112-3456','lola.bin@email.com','hashed_password28'),(36,'Molly','May',5,56000.00,'832-345-9844','molly.may@email.com','hashed_password29'),(37,'Mill','Mellon',4,53000.00,'832-493-3367','mill.mellon@email.com','hashed_password30'),(38,'Maddie','Min',4,53000.00,'832-432-4988','maddie.min@email.com','hashed_password31'),(39,'Wallie','Wonk',5,56000.00,'832-034-5687','wallie.wonk@email.com','hashed_password32'),(40,'Wendy','Wonk',4,53000.00,'832-432-5985','wendy.wonk@email.com','hashed_password33'),(41,'Will','Mon',5,56000.00,'832-327-4399','will.mon@email.com','hashed_password34'),(42,'Mellory','Elon',5,56000.00,'832-347-2228','mellory.elon@email.com','hashed_password35'),(43,'Maurice','Kol',5,56000.00,'832-392-3475','maurice.kol@email.com','hashed_password36'),(44,'Zan','Sue',5,56000.00,'832-321-4573','zan.sue@email.com','hashed_password37'),(45,'Bindy','Bun',5,56000.00,'832-324-5837','bindy.bun@email.com','hashed_password38'),(46,'Benny','Blue',5,56000.00,'832-328-4372','benny.blue@email.com','hashed_password39'),(47,'Blu','Blenn',5,56000.00,'832-348-4284','blu.blenn@email.com','hashed_password40'),(48,'Maggie','Luke',2,5000.00,'832-347-4389','maggie.luke@email.com','hashed_password41'),(50,'Lilly','Rose',5,56000.00,'2347538753','lilly.rose@email.com','hashed_password42'),(51,'karen','amith',4,12.00,'12','karenamith@email.com','password');
/*!40000 ALTER TABLE `employee` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `feeding_log`
--

DROP TABLE IF EXISTS `feeding_log`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `feeding_log` (
  `Feeding_ID` int NOT NULL AUTO_INCREMENT,
  `Animal_ID` int NOT NULL,
  `Employee_ID` int NOT NULL,
  `Food_Type` smallint NOT NULL,
  `Feeding_Date` date NOT NULL,
  `Quantity` decimal(10,2) NOT NULL,
  `Q_Unit` int NOT NULL,
  `Feeding_Time` time NOT NULL,
  PRIMARY KEY (`Feeding_ID`),
  KEY `Animal_ID` (`Animal_ID`),
  KEY `Employee_ID` (`Employee_ID`),
  KEY `fk_foodtype` (`Food_Type`),
  KEY `feeding_log_Unit_ fk` (`Q_Unit`),
  CONSTRAINT `feeding_log_ibfk_1` FOREIGN KEY (`Animal_ID`) REFERENCES `animal` (`Animal_ID`),
  CONSTRAINT `feeding_log_ibfk_2` FOREIGN KEY (`Employee_ID`) REFERENCES `employee` (`Employee_ID`),
  CONSTRAINT `feeding_log_Unit_ fk` FOREIGN KEY (`Q_Unit`) REFERENCES `unit` (`Unit_ID`),
  CONSTRAINT `fk_foodtype` FOREIGN KEY (`Food_Type`) REFERENCES `food_type` (`foodtype_ID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `feeding_log`
--

LOCK TABLES `feeding_log` WRITE;
/*!40000 ALTER TABLE `feeding_log` DISABLE KEYS */;
INSERT INTO `feeding_log` VALUES (6,41,5,1,'2025-03-24',5.00,1,'08:00:00'),(7,42,12,2,'2025-03-24',3.50,2,'08:30:00'),(8,43,19,4,'2025-03-24',2.00,3,'09:00:00'),(9,44,25,3,'2025-03-24',4.50,1,'09:30:00'),(10,45,28,4,'2025-03-24',1.00,2,'10:00:00'),(11,41,5,1,'2025-03-24',5.00,1,'08:00:00'),(12,42,12,2,'2025-03-24',3.50,2,'08:30:00'),(13,43,19,1,'2025-03-24',2.00,3,'09:00:00'),(14,44,25,3,'2025-03-24',4.50,1,'09:30:00'),(15,45,21,4,'2025-03-24',1.00,2,'10:00:00'),(16,46,28,1,'2025-04-01',30.00,1,'12:16:00'),(17,46,5,1,'2025-03-16',123.00,1,'17:17:00'),(18,46,28,1,'2025-03-24',323.00,2,'16:17:00'),(19,41,5,1,'2025-03-24',12.00,1,'12:36:00'),(20,41,28,1,'2025-03-24',23.00,2,'16:04:00'),(21,41,5,1,'2025-03-11',3.00,5,'13:06:00'),(22,42,12,2,'2025-04-10',4.00,5,'09:00:00'),(23,46,28,1,'2025-04-11',4.00,5,'09:10:00');
/*!40000 ALTER TABLE `feeding_log` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Temporary view structure for view `feedinglog_view`
--

DROP TABLE IF EXISTS `feedinglog_view`;
/*!50001 DROP VIEW IF EXISTS `feedinglog_view`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `feedinglog_view` AS SELECT 
 1 AS `Feeding_ID`,
 1 AS `Employee_ID`,
 1 AS `Habitat_Name`,
 1 AS `Animal_Name`,
 1 AS `Species`,
 1 AS `Diet`,
 1 AS `Food`,
 1 AS `Feeding_Date`,
 1 AS `Quantity`,
 1 AS `Unit_text`,
 1 AS `Feeding_Time`*/;
SET character_set_client = @saved_cs_client;

--
-- Table structure for table `food_type`
--

DROP TABLE IF EXISTS `food_type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `food_type` (
  `foodtype_ID` smallint NOT NULL AUTO_INCREMENT,
  `food_Types` tinytext NOT NULL,
  PRIMARY KEY (`foodtype_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `food_type`
--

LOCK TABLES `food_type` WRITE;
/*!40000 ALTER TABLE `food_type` DISABLE KEYS */;
INSERT INTO `food_type` VALUES (1,'Meat'),(2,'Fruits'),(3,'Bamboo'),(4,'Fish'),(5,'Vegetables');
/*!40000 ALTER TABLE `food_type` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `habitat`
--

DROP TABLE IF EXISTS `habitat`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `habitat` (
  `Habitat_ID` int NOT NULL AUTO_INCREMENT,
  `Habitat_Name` varchar(30) DEFAULT NULL,
  `CLimate` smallint DEFAULT NULL,
  `Annual_Cost` decimal(10,2) DEFAULT NULL,
  `Dept_ID` int DEFAULT NULL,
  `Status` int DEFAULT NULL,
  PRIMARY KEY (`Habitat_ID`),
  KEY `fk_climates` (`CLimate`),
  KEY `habitat_Dept_fk` (`Dept_ID`),
  KEY `habitat_status_fk` (`Status`),
  CONSTRAINT `fk_climates` FOREIGN KEY (`CLimate`) REFERENCES `climate_type` (`Climate_ID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `habitat_Dept_fk` FOREIGN KEY (`Dept_ID`) REFERENCES `department` (`Department_ID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `habitat_status_fk` FOREIGN KEY (`Status`) REFERENCES `maintenance_location` (`Location_ID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=211 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `habitat`
--

LOCK TABLES `habitat` WRITE;
/*!40000 ALTER TABLE `habitat` DISABLE KEYS */;
INSERT INTO `habitat` VALUES (201,'Savannah Enclosure',1,50000.00,1,412),(202,'Rainforest Dome',1,65000.00,1,413),(204,'Mountain Exhibit',2,43000.00,1,414),(205,'Penguin Bay',3,58000.00,3,415),(206,'Bird Enclosure',1,60000.00,3,416),(207,'Reptile Zone',1,64000.00,2,417),(208,'Aquarium',2,65000.00,4,418),(209,'Petting Farm',2,55000.00,5,419),(210,'All Habitats',2,460000.00,6,420);
/*!40000 ALTER TABLE `habitat` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `item_types`
--

DROP TABLE IF EXISTS `item_types`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `item_types` (
  `item_typeID` smallint NOT NULL AUTO_INCREMENT,
  `item_types` tinytext NOT NULL,
  PRIMARY KEY (`item_typeID`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `item_types`
--

LOCK TABLES `item_types` WRITE;
/*!40000 ALTER TABLE `item_types` DISABLE KEYS */;
INSERT INTO `item_types` VALUES (1,'Hats'),(2,'Toys'),(3,'Mugs'),(4,'Keychains'),(5,'Sprays');
/*!40000 ALTER TABLE `item_types` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `maintenance`
--

DROP TABLE IF EXISTS `maintenance`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `maintenance` (
  `Maintenance_ID` int NOT NULL AUTO_INCREMENT,
  `Maintenance_EmployeeID` int NOT NULL,
  `Start_Date` date NOT NULL,
  `End_Date` date DEFAULT NULL,
  `Description` varchar(50) DEFAULT NULL,
  `Status` int DEFAULT NULL,
  `cost` decimal(10,2) DEFAULT NULL,
  `RecentCheck` date DEFAULT NULL,
  `maintenance_locationID` int DEFAULT NULL,
  `request_desc` text,
  PRIMARY KEY (`Maintenance_ID`),
  KEY `Employee_ID` (`Maintenance_EmployeeID`),
  KEY `maintenance_status_fk` (`Status`),
  KEY `maintenance_location_fk` (`maintenance_locationID`),
  CONSTRAINT `maintenance_ibfk_2` FOREIGN KEY (`Maintenance_EmployeeID`) REFERENCES `employee` (`Employee_ID`),
  CONSTRAINT `maintenance_location_fk` FOREIGN KEY (`maintenance_locationID`) REFERENCES `maintenance_location` (`Location_ID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `maintenance_status_fk` FOREIGN KEY (`Status`) REFERENCES `mntstatus_type` (`status_typeID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `maintenance`
--

LOCK TABLES `maintenance` WRITE;
/*!40000 ALTER TABLE `maintenance` DISABLE KEYS */;
INSERT INTO `maintenance` VALUES (6,2,'2025-03-01','2025-03-03','Routine inspection and sanitation',3,500.00,'2025-03-03',412,'Routine Maintenance'),(7,13,'2025-03-10','2025-03-12','Electrical rewiring and light check',3,1000.00,'2025-04-11',414,'lights not working'),(8,2,'2025-03-15','2025-03-15','Emergency water pipe fix',3,2500.00,'2025-03-15',400,'pipe is broken'),(9,13,'2025-03-18','2025-03-20','Crack sealing and repainting',3,1200.00,'2025-03-20',408,'stuff is broken'),(10,2,'2025-03-22','2025-03-24','General maintenance and cleaning',3,500.00,'2025-03-24',404,'routine Maintenance'),(12,2,'2025-04-07','2025-04-08','Repair Needed',3,30.00,'2025-04-13',400,'stuff is broken'),(13,2,'2025-04-08','2025-04-09','Repair Needed',3,50.00,'2025-04-08',412,'lions broke a fence post'),(14,2,'2025-04-08','2025-04-09','Repair Needed',3,20.00,'2025-04-08',404,'fence is broken'),(15,2,'2025-04-08','2025-04-10','Repair Needed',3,20.00,'2025-04-08',401,'fence is down'),(16,2,'2025-04-08','2025-04-10','Repair Needed',3,20.00,'2025-04-18',412,'fence is down'),(17,2,'2025-04-08','2025-04-10','Repair Needed',3,18.00,'2025-04-11',414,'fence broken in arctic zone'),(18,2,'2025-04-08','2025-04-10','Repair Repair Needed',3,10.00,'2025-04-11',413,'broken'),(22,48,'2025-04-18','2025-04-19','fixed the fence ',3,20.00,'2025-04-19',412,'fence is broken'),(23,48,'2025-04-19','2025-04-19','will need to check the leak',3,15.00,'2025-04-19',408,'water leak'),(24,13,'2025-04-21',NULL,NULL,1,0.00,NULL,407,'up to date'),(25,48,'2025-04-21',NULL,NULL,1,0.00,NULL,407,'up to date');
/*!40000 ALTER TABLE `maintenance` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`tycaram`@`%`*/ /*!50003 TRIGGER `MAINTENANCE_NOTIFICATION` AFTER INSERT ON `maintenance` FOR EACH ROW BEGIN
    INSERT INTO maintenance_notifications (maintenance_employeeID, message, Start_date, maintenance_locationID, mnt_ID)
    VALUES (NEW.Maintenance_EmployeeID, CONCAT('Maintenance requested: ', NEW.request_desc), NEW.Start_Date, NEW.maintenance_locationID, NEW.Maintenance_ID);
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`tycaram`@`%`*/ /*!50003 TRIGGER `maintenance_status_update` AFTER INSERT ON `maintenance` FOR EACH ROW BEGIN
    UPDATE maintenance_location
    SET status_type = NEW.Status
    WHERE Location_ID = NEW.maintenance_locationID;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`tycaram`@`%`*/ /*!50003 TRIGGER `maintenance_updating_status` AFTER UPDATE ON `maintenance` FOR EACH ROW BEGIN
    UPDATE maintenance_location
    SET status_type = NEW.Status
    WHERE Location_ID = NEW.maintenance_locationID;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `maintenance_location`
--

DROP TABLE IF EXISTS `maintenance_location`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `maintenance_location` (
  `Location_ID` int NOT NULL AUTO_INCREMENT,
  `Location_type` varchar(30) DEFAULT NULL,
  `status_type` int DEFAULT NULL,
  PRIMARY KEY (`Location_ID`),
  KEY `status_text_fk` (`status_type`),
  CONSTRAINT `status_text_fk` FOREIGN KEY (`status_type`) REFERENCES `mntstatus_type` (`status_typeID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=422 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `maintenance_location`
--

LOCK TABLES `maintenance_location` WRITE;
/*!40000 ALTER TABLE `maintenance_location` DISABLE KEYS */;
INSERT INTO `maintenance_location` VALUES (400,'attraction',3),(401,'attraction',3),(402,'attraction',3),(403,'attraction',3),(404,'attraction',3),(405,'attraction',3),(406,'attraction',3),(407,'vendor',1),(408,'vendor',3),(409,'vendor',3),(410,'vendor',3),(411,'vendor',3),(412,'habitat',3),(413,'habitat',3),(414,'habitat',3),(415,'habitat',3),(416,'habitat',3),(417,'habitat',3),(418,'habitat',3),(419,'habitat',3),(420,'habitat',3),(421,'vendor',3);
/*!40000 ALTER TABLE `maintenance_location` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `maintenance_notifications`
--

DROP TABLE IF EXISTS `maintenance_notifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `maintenance_notifications` (
  `maintenance_messageID` int NOT NULL AUTO_INCREMENT,
  `mnt_ID` int DEFAULT NULL,
  `maintenance_employeeID` int DEFAULT NULL,
  `message` varchar(255) DEFAULT NULL,
  `Start_date` date NOT NULL,
  `message_sent` tinyint(1) DEFAULT '0',
  `maintenance_locationID` int DEFAULT NULL,
  PRIMARY KEY (`maintenance_messageID`),
  KEY `maintenance_notifications_Maintenance_ID_fk` (`mnt_ID`),
  KEY `mlocation_ID_fk` (`maintenance_locationID`),
  CONSTRAINT `maintenance_notifications_Maintenance_ID_fk` FOREIGN KEY (`mnt_ID`) REFERENCES `maintenance` (`Maintenance_ID`) ON DELETE CASCADE,
  CONSTRAINT `mlocation_ID_fk` FOREIGN KEY (`maintenance_locationID`) REFERENCES `maintenance_location` (`Location_ID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `maintenance_notifications`
--

LOCK TABLES `maintenance_notifications` WRITE;
/*!40000 ALTER TABLE `maintenance_notifications` DISABLE KEYS */;
INSERT INTO `maintenance_notifications` VALUES (1,10,2,'testing notifications','2025-03-01',1,412),(2,12,2,'Maintenance requested: stuff is broken','2025-04-07',1,400),(3,13,2,'Maintenance requested: lions broke a fence post','2025-04-08',1,412),(4,14,2,'Maintenance requested: fence is broken','2025-04-08',1,404),(5,15,2,'Maintenance requested: fence is down','2025-04-08',1,401),(6,16,2,'Maintenance requested: fence is down','2025-04-08',1,412),(7,17,2,'Maintenance requested: fence broken in arctic zone','2025-04-08',1,414),(8,18,2,'Maintenance requested: broken','2025-04-08',1,413),(13,22,48,'Maintenance requested: fence is broken','2025-04-18',1,412),(14,23,48,'Maintenance requested: water leak','2025-04-19',1,408),(15,24,13,'Maintenance requested: up to date','2025-04-21',0,407),(16,25,48,'Maintenance requested: up to date','2025-04-21',0,407);
/*!40000 ALTER TABLE `maintenance_notifications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Temporary view structure for view `maintenance_requests`
--

DROP TABLE IF EXISTS `maintenance_requests`;
/*!50001 DROP VIEW IF EXISTS `maintenance_requests`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `maintenance_requests` AS SELECT 
 1 AS `Maintenance_ID`,
 1 AS `Start_Date`,
 1 AS `Location`,
 1 AS `Department`,
 1 AS `Status_Type`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `manager_view`
--

DROP TABLE IF EXISTS `manager_view`;
/*!50001 DROP VIEW IF EXISTS `manager_view`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `manager_view` AS SELECT 
 1 AS `Manager_ID`,
 1 AS `Department_ID`,
 1 AS `Department_Name`,
 1 AS `Employee_ID`,
 1 AS `Role`,
 1 AS `Employee_Name`,
 1 AS `Location_ID`,
 1 AS `Location_Type`,
 1 AS `Location_Name`,
 1 AS `Annual_Cost`,
 1 AS `status_type`*/;
SET character_set_client = @saved_cs_client;

--
-- Table structure for table `medical_record`
--

DROP TABLE IF EXISTS `medical_record`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `medical_record` (
  `Record_ID` int NOT NULL AUTO_INCREMENT,
  `Animal_ID` int NOT NULL,
  `Employee_ID` int NOT NULL,
  `Checkup_Date` date DEFAULT NULL,
  `Diagnosis` text,
  `Treatment` text,
  PRIMARY KEY (`Record_ID`),
  KEY `Animal_ID` (`Animal_ID`),
  KEY `Employee_ID` (`Employee_ID`),
  CONSTRAINT `medical_record_ibfk_1` FOREIGN KEY (`Animal_ID`) REFERENCES `animal` (`Animal_ID`),
  CONSTRAINT `medical_record_ibfk_2` FOREIGN KEY (`Employee_ID`) REFERENCES `employee` (`Employee_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `medical_record`
--

LOCK TABLES `medical_record` WRITE;
/*!40000 ALTER TABLE `medical_record` DISABLE KEYS */;
INSERT INTO `medical_record` VALUES (1,41,5,'2025-03-01','Minor dehydration','Electrolyte fluid administered'),(2,42,12,'2025-03-03','Skin infection','Antibiotic cream applied'),(3,43,19,'2025-03-05','Limp in hind leg','Rest and physiotherapy scheduled'),(4,44,25,'2025-03-07','Allergic reaction','Antihistamines given'),(5,45,21,'2025-03-10','Weight loss','Nutritional supplements added to diet'),(7,41,5,'2025-04-20','bleeding','ointment');
/*!40000 ALTER TABLE `medical_record` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Temporary view structure for view `medical_view`
--

DROP TABLE IF EXISTS `medical_view`;
/*!50001 DROP VIEW IF EXISTS `medical_view`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `medical_view` AS SELECT 
 1 AS `Record_ID`,
 1 AS `Animal_ID`,
 1 AS `Animal_Name`,
 1 AS `Species`,
 1 AS `Checkup_Date`,
 1 AS `Diagnosis`,
 1 AS `Treatment`,
 1 AS `Employee_ID`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `member_view`
--

DROP TABLE IF EXISTS `member_view`;
/*!50001 DROP VIEW IF EXISTS `member_view`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `member_view` AS SELECT 
 1 AS `Visitor_ID`,
 1 AS `Visitor_Name`,
 1 AS `Email`,
 1 AS `Phone_number`,
 1 AS `membership_status`,
 1 AS `Address`*/;
SET character_set_client = @saved_cs_client;

--
-- Table structure for table `membership_type`
--

DROP TABLE IF EXISTS `membership_type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `membership_type` (
  `membership_TypeID` smallint NOT NULL AUTO_INCREMENT,
  `membership_Type` tinytext NOT NULL,
  PRIMARY KEY (`membership_TypeID`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `membership_type`
--

LOCK TABLES `membership_type` WRITE;
/*!40000 ALTER TABLE `membership_type` DISABLE KEYS */;
INSERT INTO `membership_type` VALUES (1,'None'),(2,'Bronze'),(3,'Silver'),(4,'Gold');
/*!40000 ALTER TABLE `membership_type` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `merchandise`
--

DROP TABLE IF EXISTS `merchandise`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `merchandise` (
  `Merchandise_ID` int NOT NULL AUTO_INCREMENT,
  `Item_Type` smallint NOT NULL,
  `Item_Name` varchar(30) NOT NULL,
  `Item_Price` decimal(10,2) NOT NULL,
  `m_cost` decimal(10,2) DEFAULT NULL,
  `V_ID` int DEFAULT NULL,
  PRIMARY KEY (`Merchandise_ID`),
  KEY `V_ID` (`V_ID`),
  KEY `fk_item_type` (`Item_Type`),
  CONSTRAINT `fk_item_type` FOREIGN KEY (`Item_Type`) REFERENCES `item_types` (`item_typeID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `merchandise_ibfk_2` FOREIGN KEY (`V_ID`) REFERENCES `vendor` (`Vendor_ID`),
  CONSTRAINT `merchandise_chk_2` CHECK ((`Item_Price` >= 0))
) ENGINE=InnoDB AUTO_INCREMENT=114 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `merchandise`
--

LOCK TABLES `merchandise` WRITE;
/*!40000 ALTER TABLE `merchandise` DISABLE KEYS */;
INSERT INTO `merchandise` VALUES (101,1,'Safari Hat',12.99,12.00,6),(102,2,'Plush Tiger Toy',12.99,0.25,7),(103,3,'Aquarium Mug',10.99,6.00,8),(104,4,'Penguin Keychain',6.99,3.00,9),(105,5,'Bug Repellent Spray',9.99,6.50,10),(106,2,'Animal Coloring Book',8.99,1.00,7),(107,2,'Penguin Snow Globe',15.99,2.00,9),(108,1,'Panda Themed Hat',12.99,9.99,11),(109,3,'Elephant Mug',10.99,6.99,6),(110,4,'Bear Keychain',6.99,3.99,7);
/*!40000 ALTER TABLE `merchandise` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `mntstatus_type`
--

DROP TABLE IF EXISTS `mntstatus_type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `mntstatus_type` (
  `status_typeID` int NOT NULL AUTO_INCREMENT,
  `status_types` tinytext NOT NULL,
  PRIMARY KEY (`status_typeID`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mntstatus_type`
--

LOCK TABLES `mntstatus_type` WRITE;
/*!40000 ALTER TABLE `mntstatus_type` DISABLE KEYS */;
INSERT INTO `mntstatus_type` VALUES (1,'Maintenance Scheduled'),(2,'Maintenance In Progress'),(3,'Maintenance up to date '),(4,'Maintenance Delayed'),(5,'Pending');
/*!40000 ALTER TABLE `mntstatus_type` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders` (
  `Order_ID` int NOT NULL AUTO_INCREMENT,
  `Visitor_ID` int NOT NULL,
  `Order_Date` date NOT NULL,
  `Discount_Applied` decimal(10,2) DEFAULT '0.00',
  `V_ID` int DEFAULT NULL,
  PRIMARY KEY (`Order_ID`),
  KEY `V_ID` (`V_ID`),
  KEY `fk_visitorID` (`Visitor_ID`),
  CONSTRAINT `fk_visitorID` FOREIGN KEY (`Visitor_ID`) REFERENCES `visitor` (`Visitor_ID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `orders_ibfk_2` FOREIGN KEY (`V_ID`) REFERENCES `vendor` (`Vendor_ID`),
  CONSTRAINT `orders_chk_1` CHECK ((`Discount_Applied` >= 0))
) ENGINE=InnoDB AUTO_INCREMENT=175 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` VALUES (1,20,'2025-03-03',0.00,6),(2,2,'2025-03-03',2.00,7),(3,3,'2025-03-04',0.00,10),(4,4,'2025-03-04',5.00,9),(5,20,'2025-03-03',0.00,8),(7,20,'2025-04-07',0.00,NULL),(8,20,'2025-04-07',0.00,NULL),(10,20,'2025-04-07',0.00,NULL),(11,20,'2025-04-07',0.00,NULL),(12,20,'2025-04-07',0.00,NULL),(13,20,'2025-04-07',0.00,NULL),(14,20,'2025-04-07',0.00,NULL),(15,20,'2025-04-07',0.00,NULL),(16,20,'2025-04-07',0.00,NULL),(17,20,'2025-04-07',0.00,NULL),(18,20,'2025-04-07',0.00,NULL),(19,20,'2025-04-07',0.00,NULL),(20,20,'2025-04-07',0.00,NULL),(21,20,'2025-04-07',0.00,NULL),(22,20,'2025-04-07',0.00,NULL),(23,20,'2025-04-07',0.00,NULL),(24,20,'2025-04-07',0.00,NULL),(25,20,'2025-04-07',0.00,NULL),(26,20,'2025-04-07',0.00,NULL),(27,20,'2025-04-07',0.00,NULL),(28,20,'2025-04-08',0.00,NULL),(29,20,'2025-04-08',0.00,NULL),(30,20,'2025-04-08',0.00,NULL),(31,20,'2025-04-08',0.00,NULL),(32,5,'2025-04-08',0.00,NULL),(33,20,'2025-04-08',0.00,NULL),(34,5,'2025-04-08',0.00,NULL),(35,20,'2025-04-08',0.00,NULL),(36,20,'2025-04-08',0.00,NULL),(43,2,'2025-04-08',0.00,NULL),(44,2,'2025-04-08',0.00,NULL),(45,20,'2025-04-08',0.00,NULL),(46,20,'2025-04-08',0.00,NULL),(47,20,'2025-04-08',0.00,NULL),(48,20,'2025-04-08',0.00,NULL),(56,20,'2025-04-08',0.00,NULL),(57,20,'2025-04-08',0.00,NULL),(58,20,'2025-04-08',0.00,NULL),(59,20,'2025-04-08',0.00,NULL),(62,5,'2025-04-08',0.00,NULL),(63,5,'2025-04-08',0.00,NULL),(64,20,'2025-04-08',0.00,NULL),(65,20,'2025-04-08',0.00,NULL),(66,20,'2025-04-08',0.00,NULL),(67,20,'2025-04-08',0.00,NULL),(70,12,'2025-04-08',0.00,NULL),(71,12,'2025-04-08',0.00,NULL),(72,12,'2025-04-08',0.00,NULL),(73,12,'2025-04-08',0.00,NULL),(74,12,'2025-04-08',0.00,NULL),(75,12,'2025-04-08',0.00,NULL),(76,12,'2025-04-08',0.00,NULL),(77,12,'2025-04-08',0.00,NULL),(78,12,'2025-04-08',0.00,NULL),(79,12,'2025-04-08',0.00,NULL),(80,12,'2025-04-08',0.00,NULL),(81,20,'2025-04-08',0.00,NULL),(82,20,'2025-04-08',0.00,NULL),(83,20,'2025-04-08',0.00,NULL),(84,20,'2025-04-08',0.00,NULL),(85,20,'2025-04-08',0.00,NULL),(86,20,'2025-04-08',0.00,NULL),(87,20,'2025-04-08',0.00,NULL),(88,20,'2025-04-08',0.00,NULL),(89,20,'2025-04-08',0.00,NULL),(90,20,'2025-04-08',0.00,NULL),(91,20,'2025-04-08',0.00,NULL),(92,20,'2025-04-08',0.00,NULL),(93,20,'2025-04-08',0.00,NULL),(94,20,'2025-04-08',0.00,NULL),(95,20,'2025-04-08',0.00,NULL),(97,18,'2025-04-08',0.00,NULL),(98,20,'2025-04-10',0.00,NULL),(99,20,'2025-04-11',0.00,NULL),(105,20,'2025-04-15',0.00,NULL),(106,20,'2025-04-15',0.00,NULL),(107,20,'2025-04-15',0.00,NULL),(108,20,'2025-04-15',0.00,NULL),(109,20,'2025-04-15',0.00,NULL),(110,20,'2025-04-16',0.00,NULL),(111,20,'2025-04-16',0.00,NULL),(112,20,'2025-04-16',0.00,NULL),(113,20,'2025-04-16',0.00,NULL),(114,20,'2025-04-16',0.00,NULL),(115,20,'2025-04-16',0.00,NULL),(116,20,'2025-04-16',0.00,NULL),(117,20,'2025-04-16',0.00,NULL),(118,20,'2025-04-16',0.00,NULL),(119,20,'2025-04-16',0.00,NULL),(120,20,'2025-04-16',0.00,NULL),(121,20,'2025-04-16',0.00,NULL),(122,20,'2025-04-16',0.00,NULL),(123,20,'2025-04-16',0.00,NULL),(124,20,'2025-04-16',0.00,NULL),(125,20,'2025-04-16',0.00,NULL),(126,20,'2025-04-16',0.00,NULL),(127,20,'2025-04-16',0.00,NULL),(128,20,'2025-04-16',0.00,NULL),(129,20,'2025-04-16',0.00,NULL),(130,20,'2025-04-16',0.00,NULL),(131,20,'2025-04-16',0.00,NULL),(132,20,'2025-04-16',0.00,NULL),(133,20,'2025-04-16',0.00,NULL),(134,20,'2025-04-16',0.00,NULL),(135,20,'2025-04-16',0.00,NULL),(136,20,'2025-04-16',0.00,NULL),(137,20,'2025-04-17',0.00,NULL),(138,20,'2025-04-17',0.00,NULL),(149,20,'2025-04-18',0.00,NULL),(153,20,'2025-04-18',0.00,NULL),(154,20,'2025-04-18',0.00,NULL),(157,20,'2025-04-18',0.00,NULL),(158,20,'2025-04-18',0.00,NULL),(159,20,'2025-04-18',0.00,NULL),(160,20,'2025-04-18',0.00,NULL),(161,20,'2025-04-18',0.00,NULL),(162,20,'2025-04-18',0.00,NULL),(165,20,'2025-04-19',0.00,NULL),(166,20,'2025-04-19',0.00,NULL),(167,9,'2025-04-19',0.00,NULL),(168,9,'2025-04-19',0.00,NULL),(169,8,'2025-04-19',0.00,NULL),(170,8,'2025-04-19',0.00,NULL),(171,8,'2025-04-19',0.00,NULL),(172,8,'2025-04-19',0.00,NULL),(173,22,'2025-04-21',0.00,NULL),(174,22,'2025-04-21',0.00,NULL);
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `role_type`
--

DROP TABLE IF EXISTS `role_type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `role_type` (
  `role_typeID` smallint NOT NULL AUTO_INCREMENT,
  `role_types` tinytext NOT NULL,
  PRIMARY KEY (`role_typeID`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `role_type`
--

LOCK TABLES `role_type` WRITE;
/*!40000 ALTER TABLE `role_type` DISABLE KEYS */;
INSERT INTO `role_type` VALUES (1,'admin'),(2,'maintenance'),(3,'manager'),(4,'service'),(5,'caretaker');
/*!40000 ALTER TABLE `role_type` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `single_item`
--

DROP TABLE IF EXISTS `single_item`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `single_item` (
  `Item_ID` int NOT NULL AUTO_INCREMENT,
  `merch_ID` int DEFAULT NULL,
  `order_ID` int DEFAULT NULL,
  PRIMARY KEY (`Item_ID`),
  KEY `single_itemID_fk` (`order_ID`),
  KEY `single_item_merchandise_Merchandise_ID_fk` (`merch_ID`),
  CONSTRAINT `single_item_merchandise_Merchandise_ID_fk` FOREIGN KEY (`merch_ID`) REFERENCES `merchandise` (`Merchandise_ID`),
  CONSTRAINT `single_itemID_fk` FOREIGN KEY (`order_ID`) REFERENCES `orders` (`Order_ID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=572 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `single_item`
--

LOCK TABLES `single_item` WRITE;
/*!40000 ALTER TABLE `single_item` DISABLE KEYS */;
INSERT INTO `single_item` VALUES (1,101,1),(2,101,1),(3,101,62),(4,101,63),(5,101,64),(6,101,70),(7,101,71),(8,101,72),(9,101,73),(10,101,74),(11,101,75),(12,101,76),(13,101,77),(14,101,78),(15,101,79),(16,101,80),(17,101,81),(18,101,88),(19,101,89),(20,101,90),(21,101,91),(22,101,92),(23,101,93),(24,101,99),(25,101,108),(26,101,132),(27,101,134),(28,101,136),(29,101,153),(30,101,153),(31,102,2),(32,102,2),(33,102,2),(34,102,45),(35,102,48),(36,102,56),(37,102,62),(38,102,63),(39,102,64),(40,102,93),(41,102,94),(42,102,97),(43,102,98),(44,102,98),(45,102,106),(46,102,109),(47,102,117),(48,102,120),(49,102,131),(50,102,133),(51,103,5),(52,103,5),(53,103,5),(54,103,5),(55,103,45),(56,103,48),(57,103,56),(58,103,62),(59,103,66),(60,103,98),(61,103,98),(62,103,105),(63,103,107),(64,103,110),(65,103,112),(66,103,114),(67,103,119),(68,103,121),(69,103,122),(70,103,122),(71,103,124),(72,103,125),(73,103,127),(74,103,128),(75,103,133),(76,103,133),(77,103,154),(78,103,NULL),(79,103,NULL),(80,103,NULL),(81,103,NULL),(82,103,NULL),(83,103,NULL),(84,103,NULL),(85,103,NULL),(86,103,NULL),(87,103,NULL),(88,103,NULL),(89,103,NULL),(90,103,NULL),(91,103,NULL),(92,103,NULL),(93,103,NULL),(94,103,NULL),(95,103,NULL),(96,103,NULL),(97,103,NULL),(98,103,NULL),(99,103,NULL),(100,103,NULL),(101,104,4),(102,104,62),(103,104,66),(104,104,82),(105,104,83),(106,104,84),(107,104,85),(108,104,85),(109,104,86),(110,104,86),(111,105,3),(112,105,59),(113,105,166),(114,105,NULL),(115,105,NULL),(116,105,NULL),(117,105,NULL),(118,105,NULL),(119,105,NULL),(120,105,NULL),(121,105,NULL),(122,105,NULL),(123,105,NULL),(124,105,NULL),(125,105,NULL),(126,105,NULL),(127,105,NULL),(128,105,NULL),(129,105,NULL),(130,105,NULL),(131,105,NULL),(132,105,NULL),(133,105,NULL),(134,105,NULL),(135,105,NULL),(136,103,NULL),(137,103,NULL),(138,103,NULL),(139,103,NULL),(140,103,NULL),(141,103,NULL),(142,103,NULL),(143,103,NULL),(144,103,NULL),(145,103,NULL),(146,103,NULL),(147,103,NULL),(148,103,NULL),(149,103,NULL),(150,103,NULL),(151,103,NULL),(152,103,NULL),(153,103,NULL),(154,103,NULL),(155,103,NULL),(156,103,7),(157,104,7),(158,102,7),(159,101,8),(160,103,8),(161,102,8),(162,102,10),(163,103,10),(164,104,10),(165,103,11),(166,102,11),(167,104,12),(168,103,12),(169,102,12),(170,102,13),(171,103,13),(172,104,13),(173,103,14),(174,104,14),(175,102,14),(176,103,15),(177,104,15),(178,102,15),(179,103,16),(180,102,16),(181,102,17),(182,103,17),(183,103,18),(184,102,18),(185,103,19),(186,104,19),(187,102,19),(188,103,20),(189,104,20),(190,102,20),(191,103,21),(192,102,21),(193,102,22),(194,103,22),(195,103,23),(196,102,23),(197,103,24),(198,102,24),(199,102,25),(200,103,25),(201,103,26),(202,102,26),(203,102,27),(204,104,27),(205,102,28),(206,103,28),(207,103,29),(208,102,29),(209,103,30),(210,102,30),(211,103,31),(212,104,31),(213,101,32),(214,103,33),(215,102,33),(216,101,34),(217,103,35),(218,102,35),(219,103,36),(220,102,36),(221,104,43),(222,104,44),(223,103,46),(224,106,46),(225,105,47),(226,102,47),(227,106,59),(228,106,64),(229,106,166),(230,106,NULL),(231,106,NULL),(232,107,57),(233,107,58),(234,107,65),(235,107,166),(236,107,NULL),(237,108,57),(238,108,58),(239,108,130),(240,108,NULL),(241,108,NULL),(242,109,67),(243,109,166),(244,109,167),(245,109,NULL),(246,109,NULL),(247,110,NULL),(248,110,NULL),(249,110,NULL),(250,110,NULL),(251,110,NULL),(252,103,NULL),(253,103,NULL),(254,103,NULL),(255,103,NULL),(256,103,NULL),(257,103,NULL),(258,103,NULL),(259,103,NULL),(260,103,NULL),(261,103,NULL),(262,103,NULL),(263,103,NULL),(264,103,NULL),(265,103,NULL),(266,103,NULL),(267,103,NULL),(268,103,NULL),(269,103,NULL),(270,103,NULL),(271,103,NULL),(272,103,NULL),(273,103,NULL),(274,103,NULL),(275,103,NULL),(276,103,NULL),(277,103,NULL),(278,103,NULL),(279,103,NULL),(280,103,NULL),(281,103,NULL),(282,109,NULL),(283,109,NULL),(284,109,NULL),(285,109,NULL),(286,109,NULL),(287,109,NULL),(288,109,NULL),(289,109,NULL),(290,109,NULL),(291,109,NULL),(292,109,NULL),(293,109,NULL),(294,109,NULL),(295,109,NULL),(296,109,NULL),(297,109,NULL),(298,109,NULL),(299,109,NULL),(300,109,NULL),(301,109,NULL),(302,104,87),(303,104,95),(304,104,98),(305,104,125),(306,104,138),(307,104,158),(308,104,167),(309,104,NULL),(310,104,NULL),(311,104,NULL),(312,104,NULL),(313,104,NULL),(314,104,NULL),(315,104,NULL),(316,104,NULL),(317,104,NULL),(318,108,NULL),(319,108,NULL),(320,108,NULL),(321,108,NULL),(322,108,NULL),(323,108,NULL),(324,108,NULL),(325,108,NULL),(326,108,NULL),(327,108,NULL),(328,108,NULL),(329,108,NULL),(330,108,NULL),(331,108,NULL),(332,108,NULL),(333,108,NULL),(334,108,NULL),(335,108,NULL),(336,108,NULL),(337,108,NULL),(338,106,NULL),(339,106,NULL),(340,106,NULL),(341,106,NULL),(342,106,NULL),(343,106,NULL),(344,106,NULL),(345,106,NULL),(346,106,NULL),(347,106,NULL),(348,106,NULL),(349,106,NULL),(350,107,NULL),(351,107,NULL),(352,107,NULL),(353,107,NULL),(354,107,NULL),(355,107,NULL),(356,107,NULL),(357,107,NULL),(358,107,NULL),(359,107,NULL),(360,107,NULL),(361,107,NULL),(362,107,NULL),(363,102,137),(364,102,149),(365,102,157),(366,102,NULL),(367,101,153),(368,101,162),(369,101,167),(370,101,NULL),(371,101,NULL),(372,101,NULL),(373,101,NULL),(374,101,NULL),(375,101,NULL),(376,101,NULL),(377,102,NULL),(378,102,NULL),(379,104,NULL),(380,102,NULL),(381,102,NULL),(382,102,NULL),(383,102,NULL),(384,102,NULL),(385,102,NULL),(386,102,NULL),(387,102,NULL),(388,102,NULL),(389,102,NULL),(390,102,NULL),(391,102,NULL),(392,102,NULL),(393,102,NULL),(394,102,NULL),(395,102,NULL),(396,102,NULL),(397,102,NULL),(398,102,NULL),(399,102,NULL),(400,102,NULL),(401,102,NULL),(402,102,NULL),(403,102,NULL),(404,102,NULL),(405,102,NULL),(406,102,NULL),(407,102,NULL),(408,102,NULL),(409,102,NULL),(410,102,NULL),(411,102,NULL),(412,102,NULL),(413,102,NULL),(414,102,NULL),(415,102,NULL),(416,102,NULL),(417,102,NULL),(418,102,NULL),(419,102,NULL),(420,105,NULL),(421,105,NULL),(422,105,NULL),(423,105,NULL),(424,105,NULL),(425,105,NULL),(426,105,NULL),(427,105,NULL),(428,105,NULL),(429,105,NULL),(430,105,NULL),(431,105,NULL),(432,105,NULL),(433,105,NULL),(434,105,NULL),(435,105,NULL),(436,105,NULL),(437,105,NULL),(438,105,NULL),(439,105,NULL),(440,105,NULL),(441,105,NULL),(442,105,NULL),(443,105,NULL),(444,105,NULL),(445,104,NULL),(446,104,NULL),(447,104,NULL),(448,104,NULL),(449,104,NULL),(450,104,NULL),(451,104,NULL),(452,104,NULL),(453,104,NULL),(454,104,NULL),(455,103,NULL),(456,103,NULL),(457,103,NULL),(458,103,NULL),(459,103,NULL),(460,103,NULL),(461,103,NULL),(462,103,NULL),(463,103,NULL),(464,103,NULL),(465,103,NULL),(466,103,NULL),(467,103,NULL),(468,103,NULL),(469,103,NULL),(470,103,NULL),(471,103,NULL),(472,103,NULL),(473,103,NULL),(474,103,NULL),(475,103,NULL),(476,103,NULL),(477,103,NULL),(478,103,NULL),(479,103,NULL),(480,103,NULL),(481,103,NULL),(482,103,NULL),(483,103,NULL),(484,103,NULL),(485,103,NULL),(486,103,NULL),(487,103,NULL),(488,103,NULL),(489,103,NULL),(490,103,NULL),(491,103,NULL),(492,103,NULL),(493,103,NULL),(494,103,NULL),(495,103,NULL),(496,103,NULL),(497,103,NULL),(498,103,NULL),(499,103,NULL),(500,103,NULL),(501,103,NULL),(502,103,NULL),(503,103,NULL),(504,103,NULL),(505,101,NULL),(506,101,NULL),(507,101,NULL),(508,101,NULL),(509,101,NULL),(510,101,NULL),(511,101,NULL),(512,101,NULL),(513,101,NULL),(514,101,NULL),(515,101,NULL),(516,101,NULL),(517,101,NULL),(518,101,NULL),(519,101,NULL),(520,101,NULL),(521,101,NULL),(522,101,NULL),(523,101,NULL),(524,101,NULL),(525,101,NULL),(526,101,NULL),(527,101,NULL),(528,101,NULL),(529,101,NULL),(530,101,NULL),(531,101,NULL),(532,101,NULL),(533,101,NULL),(534,101,NULL),(535,106,NULL),(536,106,NULL),(537,106,NULL),(538,106,NULL),(539,106,NULL),(540,106,NULL),(541,106,NULL),(542,106,NULL),(543,106,NULL),(544,106,NULL),(545,107,NULL),(546,107,NULL),(547,107,NULL),(548,107,NULL),(549,107,NULL),(550,107,NULL),(551,107,NULL),(552,107,NULL),(553,107,NULL),(554,107,NULL),(555,107,NULL),(556,107,NULL),(557,107,NULL),(558,107,NULL),(559,107,NULL),(560,107,NULL),(561,107,NULL),(562,107,NULL),(563,107,NULL),(564,107,NULL),(565,101,NULL),(566,101,NULL),(567,101,NULL),(568,101,NULL),(569,101,NULL),(570,102,NULL),(571,101,NULL);
/*!40000 ALTER TABLE `single_item` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`crparke3`@`%`*/ /*!50003 TRIGGER `SUPPLY_CHECK` AFTER INSERT ON `single_item` FOR EACH ROW BEGIN
    DECLARE stock_left INT;

    SELECT COUNT(*) INTO stock_left
    FROM single_item S
    WHERE S.merch_ID = NEW.merch_ID
      AND S.order_ID IS NULL
    GROUP BY S.merch_ID;

    IF stock_left >= 15 THEN
        -- Update all vendor notifications for this merch_ID to mark messages as sent
        UPDATE vendor_notifications
        SET message_sent = 1
        WHERE vendor_merchID = NEW.merch_ID;
    END IF;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`tycaram`@`%`*/ /*!50003 TRIGGER `LOW_SUPPLY` AFTER UPDATE ON `single_item` FOR EACH ROW BEGIN
    DECLARE stock_left INT;
    DECLARE item_name VARCHAR(30);

    -- Count how many items left for the same merch_ID
    SELECT COUNT(*) INTO stock_left
    FROM single_item S
    WHERE S.merch_ID = NEW.merch_ID
      AND S.order_ID IS NULL
    GROUP BY S.merch_ID;

    -- Get the item name from merchandise table
    SELECT M.Item_Name INTO item_name
    FROM merchandise M
    WHERE M.Merchandise_ID = NEW.merch_ID;

    IF stock_left < 15 AND stock_left > 0 THEN
        INSERT INTO vendor_notifications (vendor_merchID, message)
        VALUES (
            NEW.merch_ID,
            CONCAT('Low supply alert: Only ', stock_left, ' items left for ', item_name)
        );
       

    ELSEIF stock_left <= 0 THEN
        INSERT INTO vendor_notifications (vendor_merchID, message)
        VALUES (NEW.merch_ID, CONCAT('Warning: ', item_name, ' is out of stock'));
    END IF;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `species`
--

DROP TABLE IF EXISTS `species`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `species` (
  `Species_ID` int NOT NULL AUTO_INCREMENT,
  `Name` varchar(30) NOT NULL,
  `Diet` int DEFAULT NULL,
  `Average_Lifespan` int DEFAULT NULL,
  `Conservation_Status` smallint DEFAULT NULL,
  PRIMARY KEY (`Species_ID`),
  KEY `fk_conservation_status` (`Conservation_Status`),
  KEY `species_diet_fk` (`Diet`),
  CONSTRAINT `fk_conservation_status` FOREIGN KEY (`Conservation_Status`) REFERENCES `conservation_type` (`conservation_typeID`),
  CONSTRAINT `species_diet_fk` FOREIGN KEY (`Diet`) REFERENCES `diet` (`Diet_ID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `species`
--

LOCK TABLES `species` WRITE;
/*!40000 ALTER TABLE `species` DISABLE KEYS */;
INSERT INTO `species` VALUES (11,'African Lion',1,14,2),(12,'Asian Elephant',2,60,3),(13,'Grizzly Bear',3,25,1),(14,'Giant Panda',2,20,2),(15,'Emperor Penguin',1,20,2),(16,'Red Panda',2,15,3),(17,'Giraffe',2,25,2),(18,'Snow Leopard',1,20,2),(19,'Flamingo',2,30,1),(20,'Komodo Dragon',1,30,3),(21,'Macaw',2,50,1),(22,'Green Sea Turtle',2,70,3),(23,'Goat',2,16,1);
/*!40000 ALTER TABLE `species` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ticket`
--

DROP TABLE IF EXISTS `ticket`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ticket` (
  `Ticket_ID` int NOT NULL AUTO_INCREMENT,
  `Visitor_ID` int NOT NULL,
  `Bought_Date` date NOT NULL,
  `Expire_Date` date DEFAULT NULL,
  `Ticket_Price_ID` int NOT NULL,
  `Order_ID` int DEFAULT NULL,
  PRIMARY KEY (`Ticket_ID`),
  KEY `visitor_ID_fk` (`Visitor_ID`),
  KEY `ticket_price_fk` (`Ticket_Price_ID`),
  CONSTRAINT `ticket_price_fk` FOREIGN KEY (`Ticket_Price_ID`) REFERENCES `ticket_price` (`Price_ID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `visitor_ID_fk` FOREIGN KEY (`Visitor_ID`) REFERENCES `visitor` (`Visitor_ID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=266 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ticket`
--

LOCK TABLES `ticket` WRITE;
/*!40000 ALTER TABLE `ticket` DISABLE KEYS */;
INSERT INTO `ticket` VALUES (111,20,'2025-03-03','2026-03-04',505,1),(112,20,'2025-03-03','2026-03-04',500,1),(113,20,'2025-03-03','2025-09-04',511,1),(114,20,'2025-03-03','2025-03-04',506,1),(115,2,'2025-03-03','2025-03-04',505,2),(116,2,'2025-03-03','2025-03-04',505,2),(117,3,'2025-03-04','2025-03-05',505,3),(118,3,'2025-03-04','2025-03-05',511,3),(119,3,'2025-03-04','2025-03-05',511,3),(120,4,'2025-03-05','2025-03-06',501,NULL),(121,4,'2025-03-05','2025-03-06',505,NULL),(122,4,'2025-03-05','2025-03-06',507,NULL),(123,4,'2025-03-05','2025-03-06',511,NULL),(124,4,'2025-03-05','2025-03-06',517,NULL),(125,5,'2025-03-06','2025-03-07',505,NULL),(126,5,'2025-03-06','2025-03-07',505,NULL),(127,5,'2025-03-06','2025-03-07',505,NULL),(128,5,'2025-03-06','2025-03-07',504,NULL),(129,5,'2025-03-06','2025-03-07',504,NULL),(130,5,'2025-03-06','2025-03-07',504,NULL),(131,5,'2025-03-06','2025-03-07',503,NULL),(132,6,'2025-03-07','2025-03-08',505,NULL),(133,6,'2025-03-07','2025-03-08',511,NULL),(134,6,'2025-03-07','2025-03-08',511,NULL),(135,6,'2025-03-07','2025-03-08',511,NULL),(136,6,'2025-03-07','2025-03-08',511,NULL),(137,6,'2025-03-07','2025-03-08',511,NULL),(138,6,'2025-03-07','2025-03-08',508,NULL),(139,6,'2025-03-07','2025-03-08',508,NULL),(140,6,'2025-03-07','2025-03-08',508,NULL),(141,6,'2025-03-07','2025-03-08',508,NULL),(142,6,'2025-03-07','2025-03-08',508,NULL),(143,6,'2025-03-07','2025-03-08',502,NULL),(144,7,'2025-03-10','2025-03-11',517,NULL),(145,7,'2025-03-10','2025-03-11',517,NULL),(146,7,'2025-03-10','2025-03-11',505,NULL),(147,7,'2025-03-10','2025-03-11',511,NULL),(148,7,'2025-03-10','2025-03-11',511,NULL),(149,7,'2025-03-10','2025-03-11',510,NULL),(150,7,'2025-03-10','2025-03-11',510,NULL),(151,8,'2025-03-10','2025-03-11',505,NULL),(152,8,'2025-03-10','2025-03-11',505,NULL),(153,8,'2025-03-10','2025-03-11',511,NULL),(154,8,'2025-03-10','2025-03-11',511,NULL),(155,8,'2025-03-10','2025-03-11',511,NULL),(156,9,'2025-03-11','2025-03-12',505,NULL),(157,9,'2025-03-11','2025-03-12',505,NULL),(158,9,'2025-03-11','2025-03-12',502,NULL),(159,9,'2025-03-11','2025-03-12',502,NULL),(160,9,'2025-03-11','2025-03-12',511,NULL),(161,9,'2025-03-11','2025-03-12',508,NULL),(162,9,'2025-03-11','2025-03-12',517,NULL),(163,10,'2025-03-12','2025-03-13',505,NULL),(164,10,'2025-03-12','2025-03-13',504,NULL),(165,10,'2025-03-12','2025-03-13',511,NULL),(166,10,'2025-03-12','2025-03-13',510,NULL),(167,10,'2025-03-12','2025-03-13',511,NULL),(168,10,'2025-03-12','2025-03-13',510,NULL),(169,11,'2025-03-12','2025-03-13',517,NULL),(170,11,'2025-03-12','2025-03-13',512,NULL),(171,11,'2025-03-12','2025-03-13',513,NULL),(172,11,'2025-03-12','2025-03-13',511,NULL),(173,11,'2025-03-12','2025-03-13',506,NULL),(174,11,'2025-03-12','2025-03-13',507,NULL),(175,12,'2025-03-14','2025-03-15',505,NULL),(176,12,'2025-03-14','2025-03-15',502,NULL),(177,12,'2025-03-14','2025-03-15',503,NULL),(178,12,'2025-03-14','2025-03-15',511,NULL),(179,12,'2025-03-14','2025-03-15',508,NULL),(180,12,'2025-03-14','2025-03-15',509,NULL),(181,13,'2025-03-17','2025-03-18',505,NULL),(182,13,'2025-03-17','2025-03-18',505,NULL),(183,13,'2025-03-17','2025-03-18',517,NULL),(184,13,'2025-03-17','2025-03-18',517,NULL),(185,13,'2025-03-17','2025-03-18',511,NULL),(186,13,'2025-03-17','2025-03-18',511,NULL),(187,14,'2025-03-18','2025-03-19',505,NULL),(188,14,'2025-03-18','2025-03-19',500,NULL),(189,14,'2025-03-18','2025-03-19',511,NULL),(190,14,'2025-03-18','2025-03-19',506,NULL),(192,20,'2025-04-16','2025-04-17',510,111),(193,20,'2025-04-16','2025-04-17',511,111),(194,20,'2025-04-16','2025-04-17',505,112),(195,20,'2025-04-16','2025-04-17',502,113),(196,20,'2025-04-16','2025-04-17',510,113),(197,20,'2025-04-16','2025-04-17',515,113),(198,20,'2025-04-16','2025-04-17',510,114),(199,20,'2025-04-16','2025-04-17',511,114),(200,20,'2025-04-16','2025-04-17',509,115),(201,20,'2025-04-16','2025-04-17',516,115),(202,20,'2025-04-16','2025-04-17',511,116),(203,20,'2025-04-16','2025-04-17',510,116),(204,20,'2025-04-16','2025-04-17',511,117),(205,20,'2025-04-16','2025-04-17',510,118),(206,20,'2025-04-16','2025-04-17',505,120),(207,20,'2025-04-16','2025-04-17',510,120),(208,20,'2025-04-16','2025-04-17',510,121),(209,20,'2025-04-16','2025-04-17',511,121),(210,20,'2025-04-16','2025-04-17',511,122),(211,20,'2025-04-16','2025-04-17',511,122),(212,20,'2025-04-16','2025-04-17',516,123),(213,20,'2025-04-16','2025-04-17',516,123),(214,20,'2025-04-16','2025-04-17',510,124),(215,20,'2025-04-16','2025-04-17',510,125),(216,20,'2025-04-16','2025-04-17',516,126),(217,20,'2025-04-16','2025-04-17',510,127),(218,20,'2025-04-16','2025-04-17',510,128),(219,20,'2025-04-16','2025-04-17',509,128),(220,20,'2025-04-16','2025-04-17',510,129),(221,20,'2025-04-16','2025-04-17',510,131),(222,20,'2025-04-16','2025-04-17',505,132),(223,20,'2025-04-16','2025-04-17',516,132),(224,20,'2025-04-16','2025-04-17',509,133),(225,20,'2025-04-16','2025-04-17',510,133),(226,20,'2025-04-16','2025-04-17',510,134),(227,20,'2025-04-16','2025-04-17',517,134),(228,20,'2025-04-16','2025-04-17',502,135),(229,20,'2025-04-17','2025-04-18',517,137),(230,20,'2025-04-18','2025-04-19',510,149),(231,20,'2025-04-18','2025-04-19',503,149),(232,20,'2025-04-18','2025-04-19',503,149),(233,20,'2025-04-18','2025-04-19',517,149),(234,20,'2025-04-18','2025-04-19',511,154),(235,20,'2025-04-18','2025-04-19',512,159),(236,20,'2025-04-18','2025-04-19',505,160),(237,20,'2025-04-18','2025-04-19',502,161),(238,20,'2025-04-18','2025-04-19',512,162),(243,20,'2025-04-19','2025-04-20',518,165),(244,20,'2025-04-19','2025-04-20',500,165),(245,20,'2025-04-19','2025-04-20',506,165),(246,20,'2025-04-19','2025-04-20',519,165),(247,9,'2025-04-19','2025-04-20',502,168),(248,9,'2025-04-19','2025-04-20',504,168),(249,9,'2025-04-19','2025-04-20',516,168),(250,9,'2025-04-19','2025-04-20',514,168),(251,9,'2025-04-19','2025-04-20',505,168),(252,9,'2025-04-19','2025-04-20',517,168),(253,8,'2025-04-19','2025-04-20',503,169),(254,8,'2025-04-19','2025-04-20',503,169),(255,8,'2025-04-19','2025-04-20',509,169),(256,8,'2025-04-19','2025-04-20',509,169),(257,8,'2025-04-19','2025-04-20',505,169),(258,8,'2025-04-19','2025-04-20',505,169),(259,8,'2025-04-19','2025-04-20',511,169),(260,8,'2025-04-19','2025-04-20',511,169),(261,8,'2025-04-19','2025-04-20',517,170),(262,8,'2025-04-19','2025-04-20',505,171),(263,8,'2025-04-19','2025-04-20',505,172),(264,22,'2025-04-21','2025-04-22',500,173),(265,22,'2025-04-21','2025-04-22',500,174);
/*!40000 ALTER TABLE `ticket` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ticket_person`
--

DROP TABLE IF EXISTS `ticket_person`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ticket_person` (
  `PersonType_ID` int NOT NULL AUTO_INCREMENT,
  `ticket_person` varchar(50) NOT NULL,
  PRIMARY KEY (`PersonType_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=500 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ticket_person`
--

LOCK TABLES `ticket_person` WRITE;
/*!40000 ALTER TABLE `ticket_person` DISABLE KEYS */;
INSERT INTO `ticket_person` VALUES (1,'Adult'),(2,'Child'),(3,'Senior');
/*!40000 ALTER TABLE `ticket_person` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ticket_price`
--

DROP TABLE IF EXISTS `ticket_price`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ticket_price` (
  `Price_ID` int NOT NULL AUTO_INCREMENT,
  `ticket_Person` int DEFAULT NULL,
  `Attraction_ID` int DEFAULT NULL,
  `price` decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (`Price_ID`),
  KEY `ticket_attraction_fk` (`Attraction_ID`),
  KEY `ticket_person_fk` (`ticket_Person`),
  CONSTRAINT `ticket_attraction_fk` FOREIGN KEY (`Attraction_ID`) REFERENCES `attraction` (`Attraction_ID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `ticket_person_fk` FOREIGN KEY (`ticket_Person`) REFERENCES `ticket_person` (`PersonType_ID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `ticket_chk` CHECK ((`price` >= 0))
) ENGINE=InnoDB AUTO_INCREMENT=521 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ticket_price`
--

LOCK TABLES `ticket_price` WRITE;
/*!40000 ALTER TABLE `ticket_price` DISABLE KEYS */;
INSERT INTO `ticket_price` VALUES (500,1,301,12.99),(501,1,302,12.99),(502,1,303,12.99),(503,1,304,12.99),(504,1,305,12.99),(505,1,306,35.99),(506,2,301,11.99),(507,2,302,11.99),(508,2,303,11.99),(509,2,304,11.99),(510,2,305,11.99),(511,2,306,28.99),(512,3,301,10.99),(513,3,302,10.99),(514,3,303,10.99),(515,3,304,10.99),(516,3,305,10.99),(517,3,306,28.99),(518,1,307,12.99),(519,2,307,11.99),(520,3,307,10.99);
/*!40000 ALTER TABLE `ticket_price` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Temporary view structure for view `ticket_report`
--

DROP TABLE IF EXISTS `ticket_report`;
/*!50001 DROP VIEW IF EXISTS `ticket_report`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `ticket_report` AS SELECT 
 1 AS `sale_date`,
 1 AS `ticket_person`,
 1 AS `membership_Type`,
 1 AS `price`,
 1 AS `Attraction_Name`,
 1 AS `department_name`*/;
SET character_set_client = @saved_cs_client;

--
-- Table structure for table `unit`
--

DROP TABLE IF EXISTS `unit`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `unit` (
  `Unit_ID` int NOT NULL AUTO_INCREMENT,
  `Unit_text` varchar(15) DEFAULT NULL,
  PRIMARY KEY (`Unit_ID`),
  UNIQUE KEY `Unit_text` (`Unit_text`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `unit`
--

LOCK TABLES `unit` WRITE;
/*!40000 ALTER TABLE `unit` DISABLE KEYS */;
INSERT INTO `unit` VALUES (2,'g'),(1,'kg'),(3,'liters'),(4,'ml'),(5,'pieces');
/*!40000 ALTER TABLE `unit` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `vendor`
--

DROP TABLE IF EXISTS `vendor`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `vendor` (
  `Vendor_ID` int NOT NULL AUTO_INCREMENT,
  `Vendor_type` smallint DEFAULT NULL,
  `Phone_number` varchar(30) DEFAULT NULL,
  `name` varchar(30) DEFAULT NULL,
  `Dept_ID` int DEFAULT NULL,
  `Annual_Cost` decimal(10,2) DEFAULT NULL,
  `Status` int DEFAULT NULL,
  PRIMARY KEY (`Vendor_ID`),
  KEY `Dno` (`Dept_ID`),
  KEY `fk_vendor_type` (`Vendor_type`),
  KEY `vendor_status_fk` (`Status`),
  CONSTRAINT `fk_vendor_type` FOREIGN KEY (`Vendor_type`) REFERENCES `vendor_type` (`vendor_typeID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `vendor_ibfk_1` FOREIGN KEY (`Dept_ID`) REFERENCES `department` (`Department_ID`),
  CONSTRAINT `vendor_status_fk` FOREIGN KEY (`Status`) REFERENCES `maintenance_location` (`Location_ID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `vendor`
--

LOCK TABLES `vendor` WRITE;
/*!40000 ALTER TABLE `vendor` DISABLE KEYS */;
INSERT INTO `vendor` VALUES (6,1,'123-456-7894','Savannah Snacks',1,40000.00,407),(7,2,'234-567-8909','Jungle Gifts',2,30000.00,408),(8,3,'345-678-9013','Ocean Eats',4,30000.00,409),(9,4,'456-789-0122','Penguin Pops',3,30000.00,410),(10,5,'567-890-1235','Critter Toys',5,40000.00,411),(11,3,'239-334-7634','Online',6,20000.00,421);
/*!40000 ALTER TABLE `vendor` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `vendor_notifications`
--

DROP TABLE IF EXISTS `vendor_notifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `vendor_notifications` (
  `vendor_messageID` int NOT NULL AUTO_INCREMENT,
  `vendor_merchID` int DEFAULT NULL,
  `message` varchar(255) DEFAULT NULL,
  `message_sent` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`vendor_messageID`),
  KEY `vendor_notifications_merchandise_Merchandise_ID_fk` (`vendor_merchID`),
  CONSTRAINT `vendor_notifications_merchandise_Merchandise_ID_fk` FOREIGN KEY (`vendor_merchID`) REFERENCES `merchandise` (`Merchandise_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `vendor_notifications`
--

LOCK TABLES `vendor_notifications` WRITE;
/*!40000 ALTER TABLE `vendor_notifications` DISABLE KEYS */;
INSERT INTO `vendor_notifications` VALUES (1,101,'Low supply alert: Only 9 items left for Safari Hat',1),(2,102,'Low supply alert: Only 11 items left',1),(3,107,'Low supply alert: Only 2 items left',1),(4,108,'Low supply alert: Only 3 items left',1),(7,106,'Low supply alert: Only 3 items left',1),(8,104,'Low supply alert: Only 7 items left',1),(15,109,'Low supply alert: Only 4 items left',1),(22,101,'Low supply alert: Only 8 items left for Safari Hat',1),(23,102,'Low supply alert: Only 14 items left for Plush Tiger Toy',1),(24,101,'Low supply alert: Only 7 items left for Safari Hat',1),(25,102,'Low supply alert: Only 14 items left for Plush Tiger Toy',1),(26,104,'Low supply alert: Only 14 items left for Penguin Keychain',1),(27,102,'Low supply alert: Only 14 items left for Plush Tiger Toy',1),(28,104,'Low supply alert: Only 14 items left for Penguin Keychain',1),(29,104,'Low supply alert: Only 13 items left for Penguin Keychain',1),(30,107,'Low supply alert: Only 14 items left for Penguin Snow Globe',1),(31,106,'Low supply alert: Only 14 items left for Animal Coloring Book',1);
/*!40000 ALTER TABLE `vendor_notifications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `vendor_type`
--

DROP TABLE IF EXISTS `vendor_type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `vendor_type` (
  `vendor_typeID` smallint NOT NULL AUTO_INCREMENT,
  `vendor_Type` tinytext NOT NULL,
  PRIMARY KEY (`vendor_typeID`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `vendor_type`
--

LOCK TABLES `vendor_type` WRITE;
/*!40000 ALTER TABLE `vendor_type` DISABLE KEYS */;
INSERT INTO `vendor_type` VALUES (1,'Food'),(2,'Merchandise'),(3,'Souvenirs'),(4,'Drinks'),(5,'Toys');
/*!40000 ALTER TABLE `vendor_type` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `visitor`
--

DROP TABLE IF EXISTS `visitor`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `visitor` (
  `Visitor_ID` int NOT NULL AUTO_INCREMENT,
  `Visitor_Name` varchar(30) NOT NULL,
  `Email` varchar(30) NOT NULL,
  `Phone_number` varchar(30) DEFAULT NULL,
  `membership_status` smallint NOT NULL,
  `Address` varchar(50) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`Visitor_ID`),
  UNIQUE KEY `Email` (`Email`),
  UNIQUE KEY `Email_2` (`Email`),
  UNIQUE KEY `password` (`password`),
  UNIQUE KEY `password_2` (`password`),
  KEY `fk_member` (`membership_status`),
  CONSTRAINT `fk_member` FOREIGN KEY (`membership_status`) REFERENCES `membership_type` (`membership_TypeID`)
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `visitor`
--

LOCK TABLES `visitor` WRITE;
/*!40000 ALTER TABLE `visitor` DISABLE KEYS */;
INSERT INTO `visitor` VALUES (2,'James Patterson','Jpatty@me.com','555-786-6788',2,'8923 silver 1112 Silver Street','pass4477'),(3,'John Pork','porkchop@me.com','832-987-4401',2,'12801 Orange Drive','pass3628'),(4,'Zach Davis','ZDees@me.com','832-993-5387',2,'1102 Main 1112 Silver Street','pass2222'),(5,'Amy Brown','Amy.B@gmail.com','832-111-2233',1,'1112 Silver Street','pass123'),(6,'Brian Con','Brian.C@gmail.com','832-222-3344',1,'34562 Gold Street','pass234'),(7,'Caroline Drum','Caroline.D@gmail.com','832-333-4455',1,'98523 Main Street','pass888'),(8,'David En','David.E@gmail.com','713-333-1122',1,'99233 Grape Street','pass221'),(9,'Taylor Grin','Taylor.G@gmail.com','832-444-1122',1,'99233 Orange Street','pass3331'),(10,'Freddy Yon','Freddy.Y@gmail.com','832-777-1122',1,'50012 blinn Street','pass4481'),(11,'Jeffrey Xin','Jeffrey.X@gmail.com','713-999-3322',1,'50122 blinn Street','pass5571'),(12,'Owen Mill','Owen.M@gmail.com','713-001-8757',1,'54232 Green Street','pass2090'),(13,'Mike Flin','Mike.F@gmail.com','713-967-3667',1,'56739 Main 1112 Silver Street','pass5899'),(14,'Meg Crow','Meg.C@gmail.com','832-337-8811',1,'0937 Long 1112 Silver Street','pass1029'),(15,'John Zoo','testemail@gmail.com',NULL,2,NULL,'123456789'),(16,'sd','j@gmail.com',NULL,2,NULL,'1'),(18,'kane','kane@me.com',NULL,2,NULL,'gem'),(19,'g','charlie.white@email.com',NULL,2,NULL,'hashed_password5'),(20,'james hack','james.h@gmail.com','713-333-4477',1,'1234 grain street','pass5639'),(21,'Alix Meg','alix.meg@gmail.com',NULL,2,NULL,'password123'),(22,'ma','maki@email.com',NULL,2,NULL,'as'),(23,'John Do','john.doe2@gmail.com','123-456-1789',2,NULL,'password');
/*!40000 ALTER TABLE `visitor` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `wellness_type`
--

DROP TABLE IF EXISTS `wellness_type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `wellness_type` (
  `wellness_typeID` smallint NOT NULL AUTO_INCREMENT,
  `wellness_Types` tinytext NOT NULL,
  PRIMARY KEY (`wellness_typeID`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `wellness_type`
--

LOCK TABLES `wellness_type` WRITE;
/*!40000 ALTER TABLE `wellness_type` DISABLE KEYS */;
INSERT INTO `wellness_type` VALUES (1,'Healthy'),(2,'Sick'),(3,'Injured'),(4,'Recovering');
/*!40000 ALTER TABLE `wellness_type` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `works_at`
--

DROP TABLE IF EXISTS `works_at`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `works_at` (
  `Works_At_ID` int NOT NULL AUTO_INCREMENT,
  `Employee_ID` int NOT NULL,
  `Dept_ID` int NOT NULL,
  `Location_ID` int DEFAULT NULL,
  PRIMARY KEY (`Works_At_ID`),
  KEY `works_at_employee_Employee_ID_fk` (`Employee_ID`),
  KEY `work_Dept_fk` (`Dept_ID`),
  KEY `works_atlocation_fk` (`Location_ID`),
  CONSTRAINT `work_Dept_fk` FOREIGN KEY (`Dept_ID`) REFERENCES `department` (`Department_ID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `works_at_ibfk_4` FOREIGN KEY (`Employee_ID`) REFERENCES `employee` (`Employee_ID`),
  CONSTRAINT `works_atlocation_fk` FOREIGN KEY (`Location_ID`) REFERENCES `maintenance_location` (`Location_ID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=50 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `works_at`
--

LOCK TABLES `works_at` WRITE;
/*!40000 ALTER TABLE `works_at` DISABLE KEYS */;
INSERT INTO `works_at` VALUES (1,1,6,405),(2,2,6,405),(3,3,1,412),(4,4,1,407),(5,5,1,400),(6,12,1,413),(7,13,6,405),(8,14,2,417),(9,15,6,405),(11,16,2,408),(13,18,4,409),(14,19,1,402),(15,20,1,405),(16,21,3,415),(17,22,3,410),(18,23,5,406),(19,24,5,411),(20,17,2,417),(21,25,1,403),(22,26,1,407),(23,27,2,408),(25,28,1,400),(26,29,1,401),(27,30,1,401),(28,31,1,402),(29,32,1,403),(30,33,3,404),(31,34,3,404),(32,35,3,410),(33,36,5,406),(34,37,4,409),(35,38,4,409),(36,39,4,418),(37,40,5,411),(38,41,2,417),(39,42,4,418),(40,43,4,418),(41,44,2,418),(42,45,3,416),(43,46,3,416),(44,47,3,416),(45,48,6,405),(46,50,1,412),(47,5,1,412),(48,35,1,407);
/*!40000 ALTER TABLE `works_at` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping events for database 'zoo'
--

--
-- Dumping routines for database 'zoo'
--

--
-- Final view structure for view `bulk_purchase_view`
--

/*!50001 DROP VIEW IF EXISTS `bulk_purchase_view`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`tycaram`@`%` SQL SECURITY DEFINER */
/*!50001 VIEW `bulk_purchase_view` AS select `b`.`purchase_ID` AS `Purchase_ID`,`b`.`merch_id` AS `Merch_ID`,`i`.`item_types` AS `Item_type`,`m`.`Item_Name` AS `Item_name`,`b`.`amount_of_items` AS `amount_of_items`,`b`.`Bulk_cost` AS `Bulk_cost`,`b`.`date_purchased` AS `date_purchased`,`v`.`name` AS `For_vendor`,`m`.`Item_Price` AS `Item_sale_price` from (((`bulk_purchase` `b` join `merchandise` `m` on((`b`.`merch_id` = `m`.`Merchandise_ID`))) join `item_types` `i` on((`m`.`Item_Type` = `i`.`item_typeID`))) join `vendor` `v` on((`m`.`V_ID` = `v`.`Vendor_ID`))) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `caretaker_view`
--

/*!50001 DROP VIEW IF EXISTS `caretaker_view`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`tycaram`@`%` SQL SECURITY DEFINER */
/*!50001 VIEW `caretaker_view` AS select `w`.`Employee_ID` AS `Employee_ID`,coalesce(`h`.`Habitat_Name`,`h2`.`Habitat_Name`) AS `Habitat_Name`,`d`.`name` AS `Department_Name`,`a`.`Animal_ID` AS `Animal_ID`,`a`.`Animal_Name` AS `Animal_Name`,`a`.`Habitat_ID` AS `Habitat_ID`,`s`.`Name` AS `Species_Type`,`wt`.`wellness_Types` AS `wellness_Types`,`de`.`Food_Type` AS `Food_Type`,`c`.`conservation_Type` AS `Conservation_Type` from (((((((((((`works_at` `w` join `maintenance_location` `m` on((`w`.`Location_ID` = `m`.`Location_ID`))) left join `habitat` `h` on((`m`.`Location_ID` = `h`.`Status`))) left join `attraction` `z` on((`m`.`Location_ID` = `z`.`Status`))) left join `habitat` `h2` on((`z`.`Habitat_ID` = `h2`.`Habitat_ID`))) join `employee` `e` on((`w`.`Employee_ID` = `e`.`Employee_ID`))) left join `animal` `a` on((((`h`.`Habitat_ID` is not null) and (`a`.`Habitat_ID` = `h`.`Habitat_ID`)) or ((`h2`.`Habitat_ID` is not null) and (`a`.`Habitat_ID` = `h2`.`Habitat_ID`))))) left join `species` `s` on((`a`.`Species_ID` = `s`.`Species_ID`))) left join `wellness_type` `wt` on((`a`.`Wellness_Status` = `wt`.`wellness_typeID`))) left join `diet` `de` on((`s`.`Diet` = `de`.`Diet_ID`))) left join `conservation_type` `c` on((`s`.`Conservation_Status` = `c`.`conservation_typeID`))) left join `department` `d` on((coalesce(`h`.`Dept_ID`,`h2`.`Dept_ID`) = `d`.`Department_ID`))) where ((`e`.`Role` in (3,5)) and (`d`.`Department_ID` <> 6)) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `closure_view`
--

/*!50001 DROP VIEW IF EXISTS `closure_view`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`tycaram`@`%` SQL SECURITY DEFINER */
/*!50001 VIEW `closure_view` AS select `c`.`closure_ID` AS `closure_ID`,`c`.`mnt_ID` AS `maintenance_ID`,`c`.`start_date` AS `start_date`,(case when (`c`.`end_date` is not null) then `c`.`end_date` else 'Still in progress' end) AS `end_date`,`m`.`Location_type` AS `Location_type`,(case when (`m`.`Location_ID` = `h`.`Status`) then `h`.`Dept_ID` when (`m`.`Location_ID` = `a`.`Status`) then `a`.`Dept_ID` when (`m`.`Location_ID` = `v`.`Status`) then `v`.`Dept_ID` else NULL end) AS `Department_ID`,coalesce(`dh`.`name`,`da`.`name`,`dv`.`name`) AS `Department`,(case when (`m`.`Location_ID` = `h`.`Status`) then `h`.`Habitat_Name` when (`m`.`Location_ID` = `a`.`Status`) then `a`.`Attraction_Name` when (`m`.`Location_ID` = `v`.`Status`) then `v`.`name` else 'Unknown' end) AS `Location_Name`,`t`.`status_types` AS `status_type`,`c`.`description` AS `description` from (((((((((`closure` `c` join `maintenance` `n` on((`c`.`mnt_ID` = `n`.`Maintenance_ID`))) join `mntstatus_type` `t` on((`n`.`Status` = `t`.`status_typeID`))) join `maintenance_location` `m` on((`c`.`location_ID` = `m`.`Location_ID`))) left join `habitat` `h` on((`m`.`Location_ID` = `h`.`Status`))) left join `attraction` `a` on((`m`.`Location_ID` = `a`.`Status`))) left join `vendor` `v` on((`m`.`Location_ID` = `v`.`Status`))) left join `department` `dh` on((`h`.`Dept_ID` = `dh`.`Department_ID`))) left join `department` `da` on((`a`.`Dept_ID` = `da`.`Department_ID`))) left join `department` `dv` on((`v`.`Dept_ID` = `dv`.`Department_ID`))) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `feedinglog_view`
--

/*!50001 DROP VIEW IF EXISTS `feedinglog_view`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`tycaram`@`%` SQL SECURITY DEFINER */
/*!50001 VIEW `feedinglog_view` AS select `f`.`Feeding_ID` AS `Feeding_ID`,`f`.`Employee_ID` AS `Employee_ID`,`h`.`Habitat_Name` AS `Habitat_Name`,`a`.`Animal_Name` AS `Animal_Name`,`s`.`Name` AS `Species`,`d`.`Food_Type` AS `Diet`,`t`.`food_Types` AS `Food`,`f`.`Feeding_Date` AS `Feeding_Date`,`f`.`Quantity` AS `Quantity`,`u`.`Unit_text` AS `Unit_text`,`f`.`Feeding_Time` AS `Feeding_Time` from ((((((`feeding_log` `f` join `animal` `a` on((`a`.`Animal_ID` = `f`.`Animal_ID`))) join `habitat` `h` on((`a`.`Habitat_ID` = `h`.`Habitat_ID`))) join `species` `s` on((`a`.`Species_ID` = `s`.`Species_ID`))) join `diet` `d` on((`s`.`Diet` = `d`.`Diet_ID`))) join `food_type` `t` on((`f`.`Food_Type` = `t`.`foodtype_ID`))) join `unit` `u` on((`f`.`Q_Unit` = `u`.`Unit_ID`))) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `maintenance_requests`
--

/*!50001 DROP VIEW IF EXISTS `maintenance_requests`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`tycaram`@`%` SQL SECURITY DEFINER */
/*!50001 VIEW `maintenance_requests` AS select `m`.`Maintenance_ID` AS `Maintenance_ID`,`m`.`Start_Date` AS `Start_Date`,(case when (`l`.`Location_ID` = `h`.`Status`) then `h`.`Habitat_Name` when (`l`.`Location_ID` = `a`.`Status`) then `a`.`Attraction_Name` when (`l`.`Location_ID` = `v`.`Status`) then `v`.`name` end) AS `Location`,(case when ((`l`.`Location_ID` = `h`.`Status`) and (`h`.`Dept_ID` = `d`.`Department_ID`)) then `d`.`name` when ((`l`.`Location_ID` = `a`.`Status`) and (`a`.`Dept_ID` = `d`.`Department_ID`)) then `d`.`name` when ((`l`.`Location_ID` = `v`.`Status`) and (`v`.`Dept_ID` = `d`.`Department_ID`)) then `d`.`name` end) AS `Department`,`t`.`status_types` AS `Status_Type` from ((((((`maintenance` `m` join `maintenance_location` `l` on((`m`.`maintenance_locationID` = `l`.`Location_ID`))) join `mntstatus_type` `t` on((`l`.`status_type` = `t`.`status_typeID`))) left join `habitat` `h` on((`l`.`Location_ID` = `h`.`Status`))) left join `attraction` `a` on((`l`.`Location_ID` = `a`.`Status`))) left join `vendor` `v` on((`l`.`Location_ID` = `v`.`Status`))) left join `department` `d` on(((`h`.`Dept_ID` = `d`.`Department_ID`) or (`a`.`Dept_ID` = `d`.`Department_ID`) or (`v`.`Dept_ID` = `d`.`Department_ID`)))) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `manager_view`
--

/*!50001 DROP VIEW IF EXISTS `manager_view`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`tycaram`@`%` SQL SECURITY DEFINER */
/*!50001 VIEW `manager_view` AS select `d`.`Manager_ID` AS `Manager_ID`,`d`.`Department_ID` AS `Department_ID`,`d`.`name` AS `Department_Name`,`e`.`Employee_ID` AS `Employee_ID`,`r`.`role_types` AS `Role`,concat(`e`.`first_Name`,' ',`e`.`last_Name`) AS `Employee_Name`,`l`.`Location_ID` AS `Location_ID`,`l`.`Location_type` AS `Location_Type`,coalesce(`a`.`Attraction_Name`,`v`.`name`,`h`.`Habitat_Name`) AS `Location_Name`,coalesce(`a`.`Annual_Cost`,`v`.`Annual_Cost`,`h`.`Annual_Cost`) AS `Annual_Cost`,`t`.`status_types` AS `status_type` from ((((((((`works_at` `w` join `employee` `e` on((`w`.`Employee_ID` = `e`.`Employee_ID`))) join `department` `d` on((`w`.`Dept_ID` = `d`.`Department_ID`))) join `role_type` `r` on((`e`.`Role` = `r`.`role_typeID`))) join `maintenance_location` `l` on((`w`.`Location_ID` = `l`.`Location_ID`))) left join `attraction` `a` on((`l`.`Location_ID` = `a`.`Status`))) left join `habitat` `h` on((`l`.`Location_ID` = `h`.`Status`))) left join `vendor` `v` on((`l`.`Location_ID` = `v`.`Status`))) left join `mntstatus_type` `t` on((`l`.`status_type` = `t`.`status_typeID`))) where `e`.`Employee_ID` in (select `department`.`Manager_ID` from `department`) is false */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `medical_view`
--

/*!50001 DROP VIEW IF EXISTS `medical_view`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`tycaram`@`%` SQL SECURITY DEFINER */
/*!50001 VIEW `medical_view` AS select distinct `m`.`Record_ID` AS `Record_ID`,`m`.`Animal_ID` AS `Animal_ID`,`a`.`Animal_Name` AS `Animal_Name`,`s`.`Name` AS `Species`,`m`.`Checkup_Date` AS `Checkup_Date`,`m`.`Diagnosis` AS `Diagnosis`,`m`.`Treatment` AS `Treatment`,`w`.`Employee_ID` AS `Employee_ID` from ((((`medical_record` `m` join `animal` `a` on((`m`.`Animal_ID` = `a`.`Animal_ID`))) join `species` `s` on((`a`.`Species_ID` = `s`.`Species_ID`))) join `habitat` `h` on((`a`.`Habitat_ID` = `h`.`Habitat_ID`))) join `works_at` `w` on((`w`.`Dept_ID` = `h`.`Dept_ID`))) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `member_view`
--

/*!50001 DROP VIEW IF EXISTS `member_view`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`tycaram`@`%` SQL SECURITY DEFINER */
/*!50001 VIEW `member_view` AS select `visitor`.`Visitor_ID` AS `Visitor_ID`,`visitor`.`Visitor_Name` AS `Visitor_Name`,`visitor`.`Email` AS `Email`,`visitor`.`Phone_number` AS `Phone_number`,`visitor`.`membership_status` AS `membership_status`,`visitor`.`Address` AS `Address` from `visitor` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `ticket_report`
--

/*!50001 DROP VIEW IF EXISTS `ticket_report`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`crparke3`@`%` SQL SECURITY DEFINER */
/*!50001 VIEW `ticket_report` AS select date_format(`t`.`Bought_Date`,'%Y-%m-%d') AS `sale_date`,`p`.`ticket_person` AS `ticket_person`,`mt`.`membership_Type` AS `membership_Type`,`tp`.`price` AS `price`,`a`.`Attraction_Name` AS `Attraction_Name`,`d`.`name` AS `department_name` from ((((((`ticket` `t` join `ticket_price` `tp` on((`t`.`Ticket_Price_ID` = `tp`.`Price_ID`))) join `ticket_person` `p` on((`tp`.`ticket_Person` = `p`.`PersonType_ID`))) join `attraction` `a` on((`tp`.`Attraction_ID` = `a`.`Attraction_ID`))) join `visitor` `v` on((`t`.`Visitor_ID` = `v`.`Visitor_ID`))) join `membership_type` `mt` on((`v`.`membership_status` = `mt`.`membership_TypeID`))) join `department` `d` on((`a`.`Dept_ID` = `d`.`Department_ID`))) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-04-20 21:57:46
