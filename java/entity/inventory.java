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
public class inventory {
    private int itemID;
    private String itemName;
    private String locationID;
    private String sku;
    private String categoryName;
    private String description;
    private int quantity;
    private double weight;
    private int caseSize;
    private double costPrice;
    private double retailPrice;
    private int supplierID;
    private int reorderThreshold;
    private int reorderLevel;
    private String notes;
    private int active;

    public inventory(int itemID, String itemName, String locationID, String sku, String categoryName, String description, int quantity, double weight, int caseSize, double costPrice, double retailPrice, int supplierID, int reorderThreshold, int reorderLevel, String notes, int active) {
        this.itemID = itemID;
        this.itemName = itemName;
        this.locationID = locationID;
        this.sku = sku;
        this.categoryName = categoryName;
        this.description = description;
        this.quantity = quantity;
        this.weight = weight;
        this.caseSize = caseSize;
        this.costPrice = costPrice;
        this.retailPrice = retailPrice;
        this.supplierID = supplierID;
        this.reorderThreshold = reorderThreshold;
        this.reorderLevel = reorderLevel;
        this.notes = notes;
        this.active = active;
    }

    public int getItemID() {
        return itemID;
    }

    public String getItemName() {
        return itemName;
    }

    public String getLocationID() {
        return locationID;
    }

    public String getSku() {
        return sku;
    }

    public String getCategoryName() {
        return categoryName;
    }

    public String getDescription() {
        return description;
    }

    public int getQuantity() {
        return quantity;
    }

    public double getWeight() {
        return weight;
    }

    public int getCaseSize() {
        return caseSize;
    }

    public double getCostPrice() {
        return costPrice;
    }

    public double getRetailPrice() {
        return retailPrice;
    }

    public int getSupplierID() {
        return supplierID;
    }

    public int getReorderThreshold() {
        return reorderThreshold;
    }

    public int getReorderLevel() {
        return reorderLevel;
    }

    public String getNotes() {
        return notes;
    }

    public int getActive() {
        return active;
    }
    
    
}
