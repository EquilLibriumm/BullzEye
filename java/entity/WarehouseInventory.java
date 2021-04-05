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
public class WarehouseInventory {
    private int itemID;
    private String locationID;
    private int quantity;
    private int reorderThreshold;
    private int reorderLevel;

    public WarehouseInventory(int itemID, String locationID, int quantity, int reorderThreshold, int reorderLevel) {
        this.itemID = itemID;
        this.locationID = locationID;
        this.quantity = quantity;
        this.reorderThreshold = reorderThreshold;
        this.reorderLevel = reorderLevel;
    }

    public int getItemID() {
        return itemID;
    }

    public String getLocationID() {
        return locationID;
    }

    public int getQuantity() {
        return quantity;
    }

    public int getReorderThreshold() {
        return reorderThreshold;
    }

    public int getReorderLevel() {
        return reorderLevel;
    }
    
    
}
