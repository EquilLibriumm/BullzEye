
package entity;

public class Item {
    private String ItemName;
    private int ID;
    private String Sku;
    private String Des;
    private String category;
    private double Weight;
    private double CostPrice;
    private double RetailPrice;
    private int SupplierID;
    private int Active;
    private String Notes;
    private int CaseSize;

    public Item( int ID,String ItemName, String Sku, String Des, String category, double Weight, double CostPrice, double RetailPriice, int SupplierID, int Active, String Notes, int CaseSize) {
        this.ItemName = ItemName;
        this.ID = ID;
        this.Sku = Sku;
        this.Des = Des;
        this.category = category;
        this.Weight = Weight;
        this.CostPrice = CostPrice;
        this.RetailPrice = RetailPriice;
        this.SupplierID = SupplierID;
        this.Active = Active;
        this.Notes = Notes;
        this.CaseSize = CaseSize;
    }

    public String getItemName() {
        return ItemName;
    }

    public int getID() {
        return ID;
    }

    public String getSku() {
        return Sku;
    }

    public String getDes() {
        return Des;
    }

    public String getCategory() {
        return category;
    }

    public double getWeight() {
        return Weight;
    }

    public double getCostPrice() {
        return CostPrice;
    }

    public double getRetailPrice() {
        return RetailPrice;
    }

    public int getSupplierID() {
        return SupplierID;
    }

    public int getActive() {
        return Active;
    }

    public String getNotes() {
        return Notes;
    }

    public int getCaseSize() {
        return CaseSize;
    }
    


}
