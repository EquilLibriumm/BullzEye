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
public class Transactionline {
    private int transactionID;
    private int itemID;
    private int quantity;

    public Transactionline(int transactionID, int itemID, int quantity) {
        this.transactionID = transactionID;
        this.itemID = itemID;
        this.quantity = quantity;
    }

    public int getTransactionID() {
        return transactionID;
    }

    public int getItemID() {
        return itemID;
    }

    public int getQuantity() {
        return quantity;
    }
    
}
