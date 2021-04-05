CREATE DEFINER=`root`@`localhost` PROCEDURE `finishCreateOrder`()
BEGIN
		UPDATE transaction SET transaction.transactionStatus = "SUBMITTED" WHERE transaction.transactionStatus = "NEW" AND transaction.transactionType = "ORDER";
      
		INSERT INTO transaction VALUES(NULL, "ORDER", "STJN", now(), NULL, "NEW", NULL, CONCAT("SUBMITTED: ", now()));
        INSERT INTO transaction VALUES(NULL, "ORDER", "MCTN", now(), NULL, "NEW", NULL, CONCAT("SUBMITTED: ", now()));
        INSERT INTO transaction VALUES(NULL, "ORDER", "DIEP", now(), NULL, "NEW", NULL, CONCAT("SUBMITTED: ", now()));
        INSERT INTO transaction VALUES(NULL, "ORDER", "FRED", now(), NULL, "NEW", NULL, CONCAT("SUBMITTED: ", now()));
        INSERT INTO transaction VALUES(NULL, "ORDER", "OROM", now(), NULL, "NEW", NULL, CONCAT("SUBMITTED: ", now()));
        INSERT INTO transaction VALUES(NULL, "ORDER", "MIRA", now(), NULL, "NEW", NULL, CONCAT("SUBMITTED: ", now()));
        INSERT INTO transaction VALUES(NULL, "ORDER", "SUSX", now(), NULL, "NEW", NULL, CONCAT("SUBMITTED: ", now()));
        
        CALL addLowItems;
END