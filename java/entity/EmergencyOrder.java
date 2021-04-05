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
public class EmergencyOrder {
    
    private int transactionID;
    private String transactionType;
    private String originalLocationID;
    private String creationDate;
    private String estimatedArrival;
    private String trasnactionStatus;
    private String sourceTransactionID;
    private String notes;
    private int itemID;
    private int quantity;

    public EmergencyOrder(int transactionID, String transactionType, String originalLocationID, String creationDate, String estimatedArrival, String trasnactionStatus, String sourceTransactionID, String notes, int itemID, int quantity) {
        this.transactionID = transactionID;
        this.transactionType = transactionType;
        this.originalLocationID = originalLocationID;
        this.creationDate = creationDate;
        this.estimatedArrival = estimatedArrival;
        this.trasnactionStatus = trasnactionStatus;
        this.sourceTransactionID = sourceTransactionID;
        this.notes = notes;
        this.itemID = itemID;
        this.quantity = quantity;
    }

    public int getTransactionID() {
        return transactionID;
    }

    public String getTransactionType() {
        return transactionType;
    }

    public String getOriginalLocationID() {
        return originalLocationID;
    }

    public String getCreationDate() {
        return creationDate;
    }

    public String getEstimatedArrival() {
        return estimatedArrival;
    }

    public String getTrasnactionStatus() {
        return trasnactionStatus;
    }

    public String getSourceTransactionID() {
        return sourceTransactionID;
    }

    public String getNotes() {
        return notes;
    }

    public int getItemID() {
        return itemID;
    }

    public int getQuantity() {
        return quantity;
    }

}
