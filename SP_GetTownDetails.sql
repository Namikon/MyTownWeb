DELIMITER $$

USE `mytown`$$

DROP PROCEDURE IF EXISTS `GetTownDetails`$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `GetTownDetails`(IN pTownName VARCHAR(255), IN pUUID VARCHAR(255))
    READS SQL DATA
BEGIN
    SELECT 
    (SELECT COUNT(*) FROM `Blocks` WHERE `townName` = pTownName) AS countBlocks, 
    (SELECT `isAdminTown` FROM `Towns` WHERE `name` = pTownName) AS isAdminTown, 
    (SELECT COUNT(`ID`) FROM `Plots` WHERE `townName` = pTownName) AS countPlots,
    (SELECT COUNT(*) FROM `ResidentsToTowns` WHERE `town` = pTownName) AS countMembers, 
    (SELECT `Residents`.`name` FROM `ResidentsToTowns` INNER JOIN `Residents` ON (`Residents`.`uuid` = `ResidentsToTowns`.`resident`) WHERE `ResidentsToTowns`.`town` = pTownName AND `ResidentsToTowns`.`rank` = 'Mayor') AS townMayor, 
    (SELECT CONCAT('', `spawnDim`, ' X: ', ROUND(`spawnX`), ' Y: ', ROUND(`spawnY`), ' Z: ', ROUND(`spawnZ`)) FROM `Towns` WHERE `name` = pTownName) AS spawnDim,
    (SELECT COUNT(*) FROM `ResidentsToTowns` WHERE `resident` = pUUID AND `town` = pTownName) AS isMember;
END$$

DELIMITER ;