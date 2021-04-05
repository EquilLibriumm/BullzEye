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
public class location {
    private String locationID;
    private String description;
    private String address;
    private String city;
    private String province;
    private String postalCode;
    private String country;
    private String locationTypeID;
    private String deliveryDay;
    private int active;

    public location(String locationID, String description, String address, String city, String province, String postalCode, String country, String locationTypeID, String deliveryDay, int active) {
        this.locationID = locationID;
        this.description = description;
        this.address = address;
        this.city = city;
        this.province = province;
        this.postalCode = postalCode;
        this.country = country;
        this.locationTypeID = locationTypeID;
        this.deliveryDay = deliveryDay;
        this.active = active;
    }

    public String getLocationID() {
        return locationID;
    }

    public String getDescription() {
        return description;
    }

    public String getAddress() {
        return address;
    }

    public String getCity() {
        return city;
    }

    public String getProvince() {
        return province;
    }

    public String getPostalCode() {
        return postalCode;
    }

    public String getCountry() {
        return country;
    }

    public String getLocationTypeID() {
        return locationTypeID;
    }

    public String getDeliveryDay() {
        return deliveryDay;
    }

    public int getActive() {
        return active;
    }
    
    
}
