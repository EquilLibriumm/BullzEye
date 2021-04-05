
package entity;

/**
 *
 * @author scott
 */
public class courier {
    private int courierID;
    private String courierName;
    private String address;
    private String city;
    private String provinceID;
    private String postalCode;
    private String country;
    private String courierEmail;
    private String courierPhone;
    private String notes;
    private int active;

    public courier(int courierID, String courierName, String address, String city, String provinceID, String postalCode, String country, String courierEmail, String courierPhone, String notes, int active) {
        this.courierID = courierID;
        this.courierName = courierName;
        this.address = address;
        this.city = city;
        this.provinceID = provinceID;
        this.postalCode = postalCode;
        this.country = country;
        this.courierEmail = courierEmail;
        this.courierPhone = courierPhone;
        this.notes = notes;
        this.active = active;
    }

    public int getCourierID() {
        return courierID;
    }

    public String getCourierName() {
        return courierName;
    }

    public String getAddress() {
        return address;
    }

    public String getCity() {
        return city;
    }

    public String getProvinceID() {
        return provinceID;
    }

    public String getPostalCode() {
        return postalCode;
    }

    public String getCountry() {
        return country;
    }

    public String getcourierEmail() {
        return courierEmail;
    }

    public String getCourierPhone() {
        return courierPhone;
    }

    public String getNotes() {
        return notes;
    }

    public int getActive() {
        return active;
    }
    
    
    
}
