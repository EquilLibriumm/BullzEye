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
public class Order {
    private Transaction transaction;
    private Transactionline transactionline;
    private int Sku;

    public Order(Transaction transaction, Transactionline transactionline, int Sku) {
        this.transaction = transaction;
        this.transactionline = transactionline;
        this.Sku = Sku;
    }

    public Order(Transaction transaction, Transactionline transactionline) {
        this.transaction = transaction;
        this.transactionline = transactionline;
    }

    public Transaction getTransaction() {
        return transaction;
    }

    public Transactionline getTransactionline() {
        return transactionline;
    }

    public int getSku() {
        return Sku;
    }
    
    
}
