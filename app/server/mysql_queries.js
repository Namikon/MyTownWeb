/* SQL Queries for MyTownWeb */
const SQL_GET_TOWN_LIST_STAFF = 'SELECT `Towns`.`name` AS townName, `Towns`.`isAdminTown`, subQMayor.name, COUNT(`Towns`.`name`) AS numChunks FROM `Towns` LEFT JOIN `Blocks` ON (`Towns`.`name` = `Blocks`.`townName`) ' +
    ' LEFT JOIN  ' +
    ' (SELECT `Residents`.`name`, `ResidentsToTowns`.`town` FROM `Residents` LEFT JOIN `ResidentsToTowns` ON (`Residents`.`uuid` = `ResidentsToTowns`.`resident`) ' +
    ' WHERE rank = \'Mayor\') AS subQMayor ON (subQMayor.town = `Towns`.`name`) ' +
    ' GROUP BY `Towns`.`name` ORDER BY `Towns`.`name`';

const SQL_GET_TOWN_LIST_MEMBER = 'SELECT `Towns`.`name` AS townName, `Towns`.`isAdminTown`, subQMayor.name, COUNT(`Towns`.`name`) AS numChunks FROM `Towns` LEFT JOIN `Blocks` ON (`Towns`.`name` = `Blocks`.`townName`) ' +
    ' LEFT JOIN ' +
    ' (SELECT `Residents`.`name`, `ResidentsToTowns`.`town` FROM `Residents` LEFT JOIN `ResidentsToTowns` ON (`Residents`.`uuid` = `ResidentsToTowns`.`resident`) ' +
    ' WHERE rank = \'Mayor\') AS subQMayor ON (subQMayor.town = `Towns`.`name`) ' +
    ' WHERE `Towns`.`isAdminTown` = 0 ' +
    ' GROUP BY `Towns`.`name` ORDER BY `Towns`.`name`';

module.exports = {
    SQL_GET_TOWN_LIST_STAFF, SQL_GET_TOWN_LIST_MEMBER
};