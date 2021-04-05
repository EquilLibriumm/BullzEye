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
public class TransactionType {
    private String  transactionType;
    private String  description;
    private int active;

    public TransactionType(String transactionType, String description, int active) {
        this.transactionType = transactionType;
        this.description = description;
        this.active = active;
    }

    public String getTransactionType() {
        return transactionType;
    }

    public String getDescription() {
        return description;
    }

    public int getActive() {
        return active;
    }
    
    
}
