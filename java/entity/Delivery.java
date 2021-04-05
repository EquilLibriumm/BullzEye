/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package entity;

import java.util.Date;


/**
 *
 * @author scott
 */
public class Delivery {
    private int deliveryID;
    private Date dateTime;
    private String vehicleID;
    private int courierID;

    public Delivery(int deliveryID, Date dateTime, String vehicleID, int courierID) {
        this.deliveryID = deliveryID;
        this.dateTime = dateTime;
        this.vehicleID = vehicleID;
        this.courierID = courierID;
    }

    public int getDeliveryID() {
        return deliveryID;
    }

    public Date getDateTime() {
        return dateTime;
    }

    public String getVehicleID() {
        return vehicleID;
    }

    public int getCourierID() {
        return courierID;
    }
    
}
