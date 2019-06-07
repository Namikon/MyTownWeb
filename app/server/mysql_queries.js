/* SQL Queries for MyTownWeb */
const SQL_GET_TOWN_LIST_STAFF = 'SELECT ' +
    '`Towns`.`name` AS townName, ' +
    '`Towns`.`isAdminTown`, ' +
    'subQMayor.name, ' +
    'COUNT(`Towns`.`name`) AS numChunks ' +
    'FROM `Towns` ' +
    'LEFT JOIN `Blocks` ON (`Towns`.`name` = `Blocks`.`townName`) ' +
    'LEFT JOIN ' +
    '(' +
    'SELECT `Residents`.`name`, `ResidentsToTowns`.`town` FROM `Residents` ' +
    'LEFT JOIN `ResidentsToTowns` ON (`Residents`.`uuid` = `ResidentsToTowns`.`resident`) ' +
    'WHERE rank = \'Mayor\' ' +
    ') AS subQMayor ON (subQMayor.town = `Towns`.`name`) ' +
    'GROUP BY `Towns`.`name` ORDER BY `Towns`.`name`';

const SQL_GET_TOWN_LIST_MEMBER = 'SELECT ' +
    '    `Towns`.`name` AS townName, ' +
    '    `Towns`.`isAdminTown`, ' +
    '    subQMayor.name, ' +
    '    COUNT(`Towns`.`name`) AS numChunks ' +
    'FROM `Towns` ' +
    'LEFT JOIN `Blocks` ON (`Towns`.`name` = `Blocks`.`townName`) ' +
    'LEFT JOIN ' +
    '  (' +
    '    SELECT `Residents`.`name`, `ResidentsToTowns`.`town` FROM `Residents` ' +
    '    LEFT JOIN `ResidentsToTowns` ON (`Residents`.`uuid` = `ResidentsToTowns`.`resident`) ' +
    '    WHERE rank = \'Mayor\' ' +
    '  ) AS subQMayor ON (subQMayor.town = `Towns`.`name`) ' +
    //'  WHERE `Towns`.`isAdminTown` = 0 AND ' +
    '  WHERE `Towns`.`name` IN ' +
    '  (' +
    ' SELECT DISTINCT(`ResidentsToTowns`.`town`) FROM `ResidentsToTowns` WHERE `ResidentsToTowns`.`resident` = ? ' +
    '  )' +
    '  GROUP BY `Towns`.`name` ORDER BY `Towns`.`name`';

const SQL_GET_TOWN_BLOCKLIST_STAFF = 'SELECT `dim` AS DimID, `x` AS ChunkX, `z` AS ChunkZ, (`x`*16) AS BlockX1, (`x`*16)+16 AS BlockX2, (`z`*16) AS BlockZ1, (`z`*16)+16 AS BlockZ2, `isFarClaim`, `pricePaid` FROM `Blocks` WHERE `townName` LIKE ? AND `townName` IN (SELECT `ResidentsToTowns`.`town` FROM `ResidentsToTowns` WHERE `ResidentsToTowns`.`resident` = ?)';
const SQL_GET_TOWN_BLOCKLIST_MEMBER = 'SELECT `dim` AS DimID, `x` AS ChunkX, `z` AS ChunkZ, (`x`*16) AS BlockX1, (`x`*16)+16 AS BlockX2, (`z`*16) AS BlockZ1, (`z`*16)+16 AS BlockZ2, `isFarClaim`, `pricePaid` FROM `Blocks` WHERE `townName` LIKE ?';

const SQL_GET_TOWN_MEMBERLIST_STAFF = 'SELECT `Residents`.`name` AS residentName, ' +
    'FROM_UNIXTIME(`Residents`.`joined`) AS joinedDate, ' +
    'FROM_UNIXTIME(`Residents`.`lastOnline`) AS lastOnlineDate, ' +
    'DATEDIFF(NOW(), FROM_UNIXTIME(`Residents`.`lastOnline`)) AS daysOffline, ' +
    '`ResidentsToTowns`.`rank` AS townRank FROM `ResidentsToTowns` ' +
    'INNER JOIN `Residents` ON (`ResidentsToTowns`.`resident` = `Residents`.`uuid`)' +
    'WHERE `ResidentsToTowns`.`town` LIKE ?';

const SQL_GET_TOWN_MEMBERLIST_MEMBER = 'SELECT `Residents`.`name` AS residentName, ' +
    'FROM_UNIXTIME(`Residents`.`joined`) AS joinedDate, ' +
    'FROM_UNIXTIME(`Residents`.`lastOnline`) AS lastOnlineDate, ' +
    'DATEDIFF(NOW(), FROM_UNIXTIME(`Residents`.`lastOnline`)) AS daysOffline, ' +
    '`ResidentsToTowns`.`rank` AS townRank FROM `ResidentsToTowns` ' +
    'INNER JOIN `Residents` ON (`ResidentsToTowns`.`resident` = `Residents`.`uuid`)' +
    'WHERE `ResidentsToTowns`.`town` LIKE ? AND `ResidentsToTowns`.`town` IN (SELECT `ResidentsToTowns`.`town` FROM `ResidentsToTowns` WHERE `ResidentsToTowns`.`resident` = ?)';

const SQL_GET_TOWN_FLAGS_STAFF = 'SELECT `name` AS flagName, `serializedValue` AS flagValue FROM `townflags` WHERE `townName` = ?';
const SQL_GET_TOWN_FLAGS_MEMBER = 'SELECT `name` AS flagName, `serializedValue` AS flagValue FROM `townflags` WHERE `townName` = ? AND `townName` IN (SELECT `ResidentsToTowns`.`town` FROM `ResidentsToTowns` WHERE `ResidentsToTowns`.`resident` = ?) ORDER BY flagName ASC';

module.exports = {
    SQL_GET_TOWN_LIST_STAFF,
    SQL_GET_TOWN_LIST_MEMBER,
    SQL_GET_TOWN_BLOCKLIST_STAFF,
    SQL_GET_TOWN_BLOCKLIST_MEMBER,
    SQL_GET_TOWN_MEMBERLIST_STAFF,
    SQL_GET_TOWN_MEMBERLIST_MEMBER,
    SQL_GET_TOWN_FLAGS_STAFF,
    SQL_GET_TOWN_FLAGS_MEMBER
};