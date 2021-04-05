delimiter |
CREATE EVENT createNewOrder
    ON SCHEDULE
      EVERY 1 week starts '2020-02-12 23:55:00' ON COMPLETION NOT PRESERVE ENABLE
    DO
      BEGIN		
		UPDATE transaction SET transaction.transactionStatus = "SUBMITTED" WHERE transaction.transactionStatus = "NEW" AND transaction.transactiontype = "ORDER";
      
		INSERT INTO transaction VALUES(NULL, "ORDER", "STJN", now(), NULL, "NEW", NULL, CONCAT("SUBMITTED: ", now()));
        INSERT INTO transaction VALUES(NULL, "ORDER", "MCTN", now(), NULL, "NEW", NULL, CONCAT("SUBMITTED: ", now()));
        INSERT INTO transaction VALUES(NULL, "ORDER", "DIEP", now(), NULL, "NEW", NULL, CONCAT("SUBMITTED: ", now()));
        INSERT INTO transaction VALUES(NULL, "ORDER", "FRED", now(), NULL, "NEW", NULL, CONCAT("SUBMITTED: ", now()));
        INSERT INTO transaction VALUES(NULL, "ORDER", "OROM", now(), NULL, "NEW", NULL, CONCAT("SUBMITTED: ", now()));
        INSERT INTO transaction VALUES(NULL, "ORDER", "MIRA", now(), NULL, "NEW", NULL, CONCAT("SUBMITTED: ", now()));
        INSERT INTO transaction VALUES(NULL, "ORDER", "SUSX", now(), NULL, "NEW", NULL, CONCAT("SUBMITTED: ", now()));
        
        CALL addLowItems;
	  END |
delimiter ;