DROP DATABASE IF EXISTS RIDELINK;
CREATE DATABASE RIDELINK;
USE RIDELINK;

DROP TABLE IF EXISTS `trip`;
CREATE TABLE `trip` (
	tid BIGINT(11) NOT NULL PRIMARY KEY AUTO_INCREMENT COMMENT'trip id',
    pickup_datetime DATETIME NOT NULL COMMENT'pickup time',
    passenger INT COMMENT'the number of passenger',
    pickup_longitude FLOAT NOT NULL COMMENT'pick up longitude',
    pickup_latitude FLOAT NOT NULL COMMENT'pick up latitude',
    dropoff_longitude FLOAT NOT NULL COMMENT'drop off longitude',
    dropoff_latitude FLOAT NOT NULL COMMENT'drop off latitude',
	`Year` INT NOT NULL COMMENT'year',
    `Month` TINYINT(4) NOT NULL COMMENT'month',
    `Day` TINYINT(6) NOT NULL COMMENT'day',
    `Hour` TINYINT(5) NOT NULL COMMENT'HOUR',
    time_group TINYINT(3) NOT NULL 
    COMMENT'0-15 group 1, 16-30 group 2, 31-45 group 3, 46-60 group4'
)ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='trip data table';

    
-- CREATE TABLE `userinfo` (
--   uid INT NOT NULL PRIMARY KEY AUTO_INCREMENT COMMENT 'user ID',
--   `username` VARCHAR(50) NOT NULL COMMENT 'user name',
--   phone VARCHAR(20) NOT NULL COMMENT 'user phone number',
--   email VARCHAR(50) NOT NULL COMMENT 'user email',
--   `password` VARCHAR(255) NOT NULL COMMENT 'user password',
--   avatarUrl VARCHAR(100) NOT NULL COMMENT '头像url',
--   constraint email unique (email),
--   constraint phone unique (phone)
-- ) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='user infomation table';

-- CREATE TABLE `search_history` (
-- 	hid INT NOT NULL PRIMARY KEY AUTO_INCREMENT COMMENT 'searching history id',
--     departure POINT NOT NULL COMMENT 'departure location',
--     destination POINT COMMENT'destination location',
--     uid INT NOT NULL COMMENT'user id',
--     create_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT'time when create',
--     KEY `fk_sh_user`(uid),
--     CONSTRAINT `fk_sh_user` FOREIGN KEY(uid) REFERENCES `userinfo`(uid) 
--     ON DELETE CASCADE ON UPDATE CASCADE
-- )ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='search history table';
