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
public class users {
    private String userID;
    private String password;
    private String locationID;
    private String roleID;
    private int active;

    public int getActive() {
        return active;
    }

    public users(String userID, String password, String locationID, String roleID, int active) {
        this.userID = userID;
        this.password = password;
        this.locationID = locationID;
        this.roleID = roleID;
        this.active = active;
    }

    public String getUserID() {
        return userID;
    }

    public String getPassword() {
        return password;
    }

    public String getLocationID() {
        return locationID;
    }

    public String getRoleID() {
        return roleID;
    }
}
