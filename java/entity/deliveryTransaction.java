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
public class deliveryTransaction {
    private int deliveryID;
    private int transactionID;
    private String routeID;

    public deliveryTransaction(int deliveryID, int transactionID, String routeID) {
        this.deliveryID = deliveryID;
        this.transactionID = transactionID;
        this.routeID = routeID;
    }

    public int getDeliveryID() {
        return deliveryID;
    }

    public int getTransactionID() {
        return transactionID;
    }

    public String getRouteID() {
        return routeID;
    }
    
}
