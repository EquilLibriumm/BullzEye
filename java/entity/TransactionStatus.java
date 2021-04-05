/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package entity;

/**
 *
 * @author scott
 */
public class TransactionStatus {
    private String transactionStatus;
    private String description;

    public TransactionStatus(String transactionStatus, String description) {
        this.transactionStatus = transactionStatus;
        this.description = description;
    }

    public String getTransactionStatus() {
        return transactionStatus;
    }

    public String getDescription() {
        return description;
    }
    
}
