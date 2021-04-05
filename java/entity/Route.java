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
public class Route {

    private String routeID;
    private String startLocationID;
    private String destinationLocationID;
    private int distance;
    private double routeTime;
    private int active;

    public Route(String routeID, String startLocationID, String destinationLocationID, int distance, double routeTime, int active) {
        this.routeID = routeID;
        this.startLocationID = startLocationID;
        this.destinationLocationID = destinationLocationID;
        this.distance = distance;
        this.routeTime = routeTime;
        this.active = active;
    }

    public String getRouteID() {
        return routeID;
    }

    public String getStartLocationID() {
        return startLocationID;
    }

    public String getDestinationLocationID() {
        return destinationLocationID;
    }

    public int getDistance() {
        return distance;
    }

    public double getRouteTime() {
        return routeTime;
    }

    public int getActive() {
        return active;
    }
    
    
}
