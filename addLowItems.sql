CREATE DEFINER=`root`@`localhost` PROCEDURE `addLowItems`()
BEGIN
	DECLARE finished INTEGER DEFAULT 0;
    DECLARE currentlocation varchar(100) DEFAULT "";
	DECLARE transID INTEGER DEFAULT 0;

	DECLARE curLocations 
		CURSOR FOR 
			SELECT locationID FROM bullseye.location WHERE locationTypeID = "Store";
     
	DECLARE CONTINUE HANDLER 
        FOR NOT FOUND SET finished = 1;
     
	OPEN curlocations;
    
    getLocations: LOOP		
		FETCH curLocations INTO currentlocation;
		IF finished = 1 THEN 
            LEAVE getLocations;
        END IF;
        
		SELECT transactionID INTO transID FROM bullseye.transaction WHERE originalLocationID = currentlocation AND transactionStatus = "NEW" AND transactionType = "ORDER";
	
		CALL addLowItems2(currentlocation, transID);
    END LOOP getLocations;
    CLOSE curLocations;
END