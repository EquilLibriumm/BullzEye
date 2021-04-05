CREATE DEFINER=`root`@`localhost` PROCEDURE `addLowItems2`(currentLocation VARCHAR(100), transID INT)
BEGIN
	DECLARE finished INTEGER DEFAULT 0;
    DECLARE ID varchar(100) DEFAULT "";
	DECLARE loc varchar(100) DEFAULT "";
    DECLARE quan INTEGER DEFAULT 0;
    DECLARE threshold INTEGER DEFAULT 0;
    DECLARE relevel INTEGER DEFAULT 0;

	DECLARE curInventory
		CURSOR FOR
			SELECT itemID, locationID, quantity, reorderThreshold, reorderLevel FROM bullseye.inventory WHERE locationID = currentLocation;
            
	DECLARE CONTINUE HANDLER 
        FOR NOT FOUND SET finished = 1;
        
	OPEN curInventory;
    
    getItems: LOOP
		FETCH curInventory INTO ID, loc, quan, threshold, relevel;
		IF finished = 1 THEN 
            LEAVE getItems;
        END IF;
        
        IF quan < threshold THEN
			INSERT INTO transactionline VALUES(transID, ID, relevel - quan);
        END IF;
	END LOOP getItems;
    CLOSE curInventory;
END