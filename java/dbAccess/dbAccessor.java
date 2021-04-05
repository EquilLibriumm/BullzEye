/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package dbAccess;

import Item.User;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import entity.*;
import dbAccess.ConnectionManager;
import static java.lang.System.console;
import java.sql.DriverManager;
import java.util.Date;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 *
 * @author scott
 */
public class dbAccessor {

    private static Connection conn = null;
    private static PreparedStatement selectAllStatement = null;
    private static PreparedStatement deleteStatement = null;
    private static PreparedStatement updateStatment = null;
    private static PreparedStatement insertStatment = null;
    private static PreparedStatement passwordStatment = null;
    private static PreparedStatement locationStatement = null;
    private static PreparedStatement courierStatement = null;
    private static PreparedStatement inventoryStatement = null;
    private static PreparedStatement updateCourierStatement = null;
    private static PreparedStatement updateUserStatement = null;
    private static PreparedStatement updateLocationStatement = null;
    private static PreparedStatement updateIventoryStatement = null;
    private static PreparedStatement insertItemStatement = null;
    private static PreparedStatement insertCourierStatement = null;
    private static PreparedStatement insertUserStatement = null;
    private static PreparedStatement insertLocationStatement = null;
    private static PreparedStatement insertInventoryStatement = null;
    private static PreparedStatement insertOrderStatementOne = null;
    private static PreparedStatement insertOrderStatementTwo = null;
    private static PreparedStatement changeActiveCourierStatement = null;
    private static PreparedStatement changeActiveUserStatement = null;
    private static PreparedStatement changeActiveLocationStatement = null;
    private static PreparedStatement changeActiveInventoryStatement = null;
    private static PreparedStatement selectPermissionsStatement = null;
    private static PreparedStatement updateManagerOrdersStatementOne = null;
    private static PreparedStatement updateManagerOrdersStatementTwo = null;
    private static PreparedStatement updateManagerOrdersStatementStoreOne = null;
    private static PreparedStatement updateManagerOrdersStatementStoreTwo = null;
    private static PreparedStatement selectOrdersStatement = null;
    private static PreparedStatement selectManagerOrdersStatement = null;
    private static PreparedStatement selectWeightsStatement = null;
    private static PreparedStatement selectRouteStatement = null;
    private static PreparedStatement getSkuStatement = null;
    private static PreparedStatement orderScannedStatement = null;
    private static PreparedStatement insertDeliveryStatement = null;
    private static PreparedStatement selectDeliveries = null;
    private static PreparedStatement updateIventoryLossStatement = null;
    private static PreparedStatement updateIventoryLossStatementTwo = null;
    private static PreparedStatement processReturnStatement = null;
    private static PreparedStatement getWarehouseInventory = null; 
    private static PreparedStatement decressWarehouseInventory = null; 

    // constructor is private - no instantiation allowed
    private dbAccessor() {
    }

    /**
     * Used only by methods in this class to guarantee a database connection.
     *
     * @throws SQLException
     */
    private static void init() throws SQLException {
        if (conn == null) {
            try {
                Class.forName("com.mysql.jdbc.Driver");
            } catch (ClassNotFoundException ex) {
                Logger.getLogger(dbAccessor.class.getName()).log(Level.SEVERE, null, ex);
            }
            conn = ConnectionManager.getConnection(ConnectionParameters.URL, ConnectionParameters.USERNAME, ConnectionParameters.PASSWORD);
            selectAllStatement = conn.prepareStatement("select * from item");
            passwordStatment = conn.prepareStatement("Select * from user");
            updateStatment = conn.prepareStatement("UPDATE item SET itemName = ?, sku = ?, description = ?, categoryName = ?, weight = ?, costPrice = ?, retailPrice = ?, supplierID = ?, active = ?, notes = ?, caseSize = ? WHERE itemID = ?");
            deleteStatement = conn.prepareStatement("UPDATE item SET active = ? WHERE itemID = ?");
            locationStatement = conn.prepareStatement("Select * from location");
            courierStatement = conn.prepareStatement("SELECT * FROM courier");
            inventoryStatement = conn.prepareStatement("SELECT * FROM inventory, item WHERE inventory.itemID = item.itemID");
            updateCourierStatement = conn.prepareStatement("UPDATE courier SET courierName = ?, address = ?, city = ?, provinceID = ?, postalCode = ?, country = ?, courierEmail = ?, courierPhone = ?, notes = ? WHERE courierID = ?");
            updateUserStatement = conn.prepareStatement("UPDATE user SET password = ?, locationID = ?, roleID = ?, active = ? WHERE userID = ?");
            insertCourierStatement = conn.prepareStatement("INSERT INTO courier VALUES (?,?,?,?,?,?,?,?,?,?,?)");
            insertUserStatement = conn.prepareStatement("INSERT INTO user VALUES (?,MD5(?),?,?,?)");
            changeActiveCourierStatement = conn.prepareStatement("UPDATE courier SET active = ? WHERE courierID = ?");
            changeActiveUserStatement = conn.prepareStatement("UPDATE user SET active = ? WHERE userID = ?");
            updateLocationStatement = conn.prepareStatement("UPDATE location SET description = ?, address = ?, city = ?, province = ?, postalCode = ?, country = ?, locationTypeID = ?, deliveryDay = ?, active = ? WHERE locationID = ?");
            insertLocationStatement = conn.prepareStatement("INSERT INTO location VALUES (?,?,?,?,?,?,?,?,?,?)");
            changeActiveLocationStatement = conn.prepareStatement("UPDATE location SET active = ? WHERE locationID = ?");
            updateIventoryStatement = conn.prepareStatement("UPDATE inventory SET reorderThreshold = ?,reorderLevel = ? WHERE itemID = ? AND locationID = ?");
            changeActiveInventoryStatement = conn.prepareStatement("UPDATE inventory SET active = ? WHERE itemID = ?");
            insertInventoryStatement = conn.prepareStatement("INSERT INTO inventory VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)");
            insertItemStatement = conn.prepareStatement("INSERT INTO item VALUES (?,?,?,?,?,?,?,?,?,?,?,?)");
            selectPermissionsStatement = conn.prepareStatement("select actionID from permission WHERE roleID = ?");
            selectOrdersStatement = conn.prepareStatement("SELECT * FROM transaction, transactionline WHERE transaction.originalLocationID = ? AND transaction.transactionID = transactionline.transactionID order by transaction.transactionID");
            selectManagerOrdersStatement = conn.prepareStatement("SELECT * FROM transaction, transactionline WHERE transaction.transactionID = transactionline.transactionID");
            updateManagerOrdersStatementOne = conn.prepareStatement("UPDATE transactionline, transaction SET transactionline.quantity = ? WHERE transactionline.itemID = ? AND transactionline.transactionID = ?");
            updateManagerOrdersStatementTwo = conn.prepareStatement("UPDATE transaction,transactionline SET transactionStatus = ?, notes = ? WHERE originalLocationID = ? AND transactionline.itemID = ?");
            insertOrderStatementOne = conn.prepareStatement("INSERT INTO transaction (transactionID, transactionType, originalLocationID, creationDate, estimatedArrival, transactionStatus, sourceTransactionID, notes) VALUES (?,?,?,?,?,?,?,?);");
            insertOrderStatementTwo = conn.prepareStatement("INSERT INTO transactionline (transactionID, itemID, Quantity) VALUES (?,?,?)");
            updateManagerOrdersStatementStoreOne = conn.prepareStatement("UPDATE transaction SET transactionStatus = ? WHERE transactionID = ?");
            updateManagerOrdersStatementStoreTwo = conn.prepareStatement("UPDATE transactionline SET quantity = ? WHERE transactionID = ? AND itemID = ?");
            selectWeightsStatement = conn.prepareStatement("SELECT weight FROM item WHERE itemID = ?");
            selectRouteStatement = conn.prepareStatement("SELECT * FROM route");
            getSkuStatement = conn.prepareStatement("SELECT sku FROM item WHERE itemID = ?");
            orderScannedStatement = conn.prepareStatement("UPDATE transaction SET transactionStatus = ?, originalLocationID = ? WHERE transactionID = ?");
            insertDeliveryStatement = conn.prepareStatement("INSERT INTO delivery VALUES(?,?,?,?)");
            selectDeliveries = conn.prepareStatement("SELECT * FROM delivery");
            updateIventoryLossStatement = conn.prepareStatement("UPDATE inventory SET quantity = ? WHERE itemID = ? AND locationID = ?");
            updateIventoryLossStatementTwo = conn.prepareStatement("UPDATE inventory SET quantity = ? WHERE itemID = ? AND locationID = ?");
            processReturnStatement = conn.prepareStatement("UPDATE transaction SET transactionStatus = ?, notes = ? WHERE originalLocationID = ? AND transactionID = ?");
            getWarehouseInventory = conn.prepareStatement("SELECT * from inventory WHERE locationID = 'WARE'");
            decressWarehouseInventory = conn.prepareStatement("UPDATE inventory SET quantity = ? WHERE locationID = ? AND itemID = ?");
        }
    }
    
    public static boolean decressWarehouseInventory(int quantity, int itemID, String locationID) {
        boolean res;

        try {
            init();
            decressWarehouseInventory.setInt(1, quantity);
            decressWarehouseInventory.setInt(3, itemID);
            decressWarehouseInventory.setString(2, locationID);
            int rowCountOne = decressWarehouseInventory.executeUpdate();

            res = (rowCountOne == 1);
        } catch (SQLException ex) {
            System.out.println(ex.getMessage());
            res = false;
        }
        return res;
    }
    
    public static ArrayList<WarehouseInventory> getWarehouseInventory() {
        ArrayList<WarehouseInventory> Inventory = new ArrayList();
        try {
            init();
            ResultSet rs = getWarehouseInventory.executeQuery();
            while (rs.next()) {
                int itemID = rs.getInt("itemID");
                String locationID = rs.getString("locationID");
                int q = rs.getInt("quantity");
                int rt = rs.getInt("reorderThreshold");
                int rl = rs.getInt("reorderLevel");
                WarehouseInventory x = new WarehouseInventory(itemID,locationID,q,rt,rl);

                Inventory.add(x);
            }
        } catch (SQLException ex) {
            Inventory = new ArrayList();
        }
        return Inventory;

    }

    public static boolean processReturn(int transactionID, String status, String locationID, String note) {
        boolean res;

        try {
            init();
            processReturnStatement.setString(1, status);
            processReturnStatement.setString(2, note);
            processReturnStatement.setString(3, locationID);
            processReturnStatement.setInt(4, transactionID);
            int rowCountOne = processReturnStatement.executeUpdate();
            System.out.println(status + " " + transactionID + " " + locationID);
            res = (rowCountOne == 1);
        } catch (SQLException ex) {
            System.out.println(ex.getMessage());
            res = false;
        }
        return res;
    }

    public static boolean updateLossInventory(String itemID, String quantity, String notes, String locationID) {
        boolean res;

        try {
            init();
            updateIventoryLossStatement.setInt(2, Integer.parseInt(itemID));
            updateIventoryLossStatement.setInt(1, Integer.parseInt(quantity));
//            updateIventoryLossStatement.setString(2, notes);
            updateIventoryLossStatement.setString(3, locationID);
            int rowCount = updateIventoryLossStatement.executeUpdate();
            System.out.println(rowCount);
            res = (rowCount == 1);
        } catch (SQLException ex) {
            res = false;
            System.out.println(ex.getMessage());
        }
        return res;
    }

    public static ArrayList<Delivery> getDeliveries() {
        ArrayList<Delivery> Delivery = new ArrayList();
        try {
            init();
            ResultSet rs = selectDeliveries.executeQuery();
            while (rs.next()) {
                int itemID = rs.getInt("deliveryID");
                Date date = rs.getDate("dateTime");
                String vehicleID = rs.getString("vehicleID");
                int courierID = rs.getInt("courierID");
                Delivery x = new Delivery(itemID, date, vehicleID, courierID);

                Delivery.add(x);
            }
        } catch (SQLException ex) {
            Delivery = new ArrayList();
            System.out.println(ex.getMessage());
        }
        return Delivery;

    }

    public static ArrayList<Item> getAllItems() {
        ArrayList<Item> Item = new ArrayList();
        try {
            init();
            ResultSet rs = selectAllStatement.executeQuery();
            while (rs.next()) {
                int itemID = rs.getInt("itemID");
                String Name = rs.getString("itemName");
                String sku = rs.getString("sku");
                String desc = rs.getString("description");
                String cata = rs.getString("categoryName");
                double weight = rs.getDouble("weight");
                double costPrice = rs.getDouble("costPrice");
                double retailPrice = rs.getDouble("retailPrice");
                int supID = rs.getInt("supplierID");
                int active = rs.getInt("active");
                String notes = rs.getString("notes");
                int caseSize = rs.getInt("caseSize");
                Item x = new Item(itemID, Name, sku, desc, cata, weight, costPrice, retailPrice, supID, active, notes, caseSize);

                Item.add(x);
            }
        } catch (SQLException ex) {
            Item = new ArrayList();
        }
        return Item;

    }

    public static ArrayList<Route> getRoutes() {
        ArrayList<Route> route = new ArrayList();
        try {
            init();
            ResultSet rs = selectRouteStatement.executeQuery();
            while (rs.next()) {
                String routeID = rs.getString("routeID");
                String startLocationID = rs.getString("startLocationID");
                String destinationLocationID = rs.getString("destinationLocationID");
                int distance = rs.getInt("distance");
                double routeTime = rs.getDouble("routeTime");
                int active = rs.getInt("active");
                Route x = new Route(routeID, startLocationID, destinationLocationID, distance, routeTime, active);

                route.add(x);
            }
        } catch (SQLException ex) {
            route = new ArrayList();
        }
        return route;

    }

    public static ArrayList<Order> getManagerOrders() {
        ArrayList<Order> order = new ArrayList();
        try {
            init();
            ResultSet rs = selectManagerOrdersStatement.executeQuery();
            while (rs.next()) {

                int tranactionID = rs.getInt("transactionID");
                String tt = rs.getString("transactionType");
                String olID = rs.getString("originalLocationID");
                String cd = rs.getString("creationDate");
                String ea = rs.getString("estimatedArrival");
                String ts = rs.getString("transactionStatus");
                String stID = rs.getString("sourceTransactionID");
                String notes = rs.getString("notes");
                int itemID = rs.getInt("itemID");
                int quantity = rs.getInt("quantity");

                getSkuStatement.setInt(1, itemID);
                ResultSet rsSku = getSkuStatement.executeQuery();
                int sku = 0;
                while (rsSku.next()) {
                    sku = rsSku.getInt("sku");
                    System.out.println(sku);
                }

                Transaction newTransaction = new Transaction(tranactionID, tt, olID, cd, ea, ts, stID, notes);
                Transactionline tLine = new Transactionline(tranactionID, itemID, quantity);
                Order x = new Order(newTransaction, tLine, sku);

                order.add(x);
            }
        } catch (SQLException ex) {
            order = new ArrayList();
        }
        return order;

    }

    public static ArrayList<Order> getOrders(String locationID) {
        ArrayList<Order> order = new ArrayList();
        try {
            init();
            selectOrdersStatement.setString(1, locationID);
            ResultSet rs = selectOrdersStatement.executeQuery();
            while (rs.next()) {

                int tranactionID = rs.getInt("transactionID");
                String tt = rs.getString("transactionType");
                String olID = rs.getString("originalLocationID");
                String cd = rs.getString("creationDate");
                String ea = rs.getString("estimatedArrival");
                String ts = rs.getString("transactionStatus");
                String stID = rs.getString("sourceTransactionID");
                String notes = rs.getString("notes");
                int itemID = rs.getInt("itemID");
                int quantity = rs.getInt("quantity");
                Transaction newTransaction = new Transaction(tranactionID, tt, olID, cd, ea, ts, stID, notes);
                Transactionline tLine = new Transactionline(tranactionID, itemID, quantity);
                Order x = new Order(newTransaction, tLine);

                order.add(x);
            }
        } catch (SQLException ex) {
            order = new ArrayList();
        }
        return order;

    }

    public static ArrayList<users> getAllUsers() {
        ArrayList<users> users = new ArrayList();
        try {
            init();
            ResultSet rs = passwordStatment.executeQuery();
            while (rs.next()) {
                String userID = rs.getString("userID");
                String password = rs.getString("password");
                String locationID = rs.getString("locationID");
                String roleID = rs.getString("roleID");
                int active = rs.getInt("active");
                users x = new users(userID, password, locationID, roleID, active);
                users.add(x);
            }
        } catch (SQLException ex) {
            users = new ArrayList();
        }
        return users;
    }

    public static ArrayList<location> getAllLocations() {
        ArrayList<location> locations = new ArrayList();
        try {
            init();
            ResultSet rs = locationStatement.executeQuery();
            while (rs.next()) {
                String locationID = rs.getString("locationID");
                String description = rs.getString("description");
                String address = rs.getString("address");
                String city = rs.getString("city");
                String province = rs.getString("province");
                String postalCode = rs.getString("postalCode");
                String country = rs.getString("country");
                String locationTypeID = rs.getString("locationTypeID");
                String deliveryDay = rs.getString("deliveryDay");
                int active = rs.getInt("active");
                location x = new location(locationID, description, address, city, province, postalCode, country, locationTypeID, deliveryDay, active);
                locations.add(x);
            }
        } catch (SQLException ex) {
            locations = new ArrayList();
        }
        return locations;
    }

    public static ArrayList<inventory> getAllInventory() {
        ArrayList<inventory> inventory = new ArrayList();
        try {
            init();
            ResultSet rs = inventoryStatement.executeQuery();
            while (rs.next()) {
                int itemID = rs.getInt("itemID");
                String itemName = rs.getString("itemName");
                String locationID = rs.getString("locationID");
                String sku = rs.getString("sku");
                String categoryName = rs.getString("categoryName");
                String description = rs.getString("description");
                int quantity = rs.getInt("quantity");
                double weight = rs.getDouble("weight");
                int caseSize = rs.getInt("caseSize");
                double costPrice = rs.getDouble("costPrice");
                double retailPrice = rs.getDouble("retailPrice");
                int supplierID = rs.getInt("supplierID");
                int reorderThreshold = rs.getInt("reorderThreshold");
                int reorderLevel = rs.getInt("reorderLevel");
                String notes = rs.getString("notes");
                int active = rs.getInt("active");
                inventory x = new inventory(itemID, itemName, locationID, sku, categoryName, description, quantity, weight, caseSize, costPrice, retailPrice, supplierID, reorderThreshold, reorderLevel, notes, active);
                inventory.add(x);
            }
        } catch (SQLException ex) {
            inventory = new ArrayList();
        }
        return inventory;
    }

    public static ArrayList<courier> getAllCouriers() {
        ArrayList<courier> couriers = new ArrayList();
        try {
            init();
            ResultSet rs = courierStatement.executeQuery();
            while (rs.next()) {
                int courierID = rs.getInt("courierID");
                String courierName = rs.getString("courierName");
                String address = rs.getString("address");
                String city = rs.getString("city");
                String provinceID = rs.getString("provinceID");
                String postalCode = rs.getString("postalCode");
                String country = rs.getString("country");
                String courierEmail = rs.getString("courierEmail");
                String courierPhone = rs.getString("courierPhone");
                String notes = rs.getString("notes");
                int active = rs.getInt("active");
                courier x = new courier(courierID, courierName, address, city, provinceID, postalCode, country, courierEmail, courierPhone, notes, active);
                couriers.add(x);
            }
        } catch (SQLException ex) {
            couriers = new ArrayList();
        }
        return couriers;
    }

    public static ArrayList<String> getPermissions(String roleID) {
        ArrayList<String> permissions = new ArrayList();
        try {
            init();
            selectPermissionsStatement.setString(1, roleID);
            System.out.println(roleID);
            ResultSet rs = selectPermissionsStatement.executeQuery();
            while (rs.next()) {
                String permission = rs.getString("actionID");
                String x = permission;
                permissions.add(x);
            }
        } catch (SQLException ex) {
            permissions = new ArrayList();
        }
        return permissions;
    }

    public static double getWeights(int itemID) {
        double weight = 0;
        try {
            init();
            selectWeightsStatement.setInt(1, itemID);
            ResultSet rs = selectWeightsStatement.executeQuery();
            while (rs.next()) {
                weight = rs.getDouble("weight");
                System.out.println(weight);
            }
        } catch (SQLException ex) {
            weight = 0;
            System.out.println(ex.getMessage());
        }
        return weight;

    }

    public static boolean mUpdateOrder(int transactionID, String status, int itemID, int quantity) {
        boolean res;

        try {
            init();
            updateManagerOrdersStatementStoreOne.setString(1, status);
            updateManagerOrdersStatementStoreOne.setInt(2, transactionID);
            int rowCountOne = updateManagerOrdersStatementStoreOne.executeUpdate();

            updateManagerOrdersStatementStoreTwo.setInt(1, quantity);
            updateManagerOrdersStatementStoreTwo.setInt(2, transactionID);
            updateManagerOrdersStatementStoreTwo.setInt(3, itemID);

            System.out.println(quantity + " " + status + " " + itemID + " " + transactionID);
            int rowCountTwo = updateManagerOrdersStatementStoreTwo.executeUpdate();
            res = (rowCountTwo == 1 && rowCountOne == 1);
        } catch (SQLException ex) {
            System.out.println(ex.getMessage());
            res = false;
        }
        return res;
    }

    public static boolean managerUpdateOrder(int transactionID, String status, int itemID, int quantity, String locationID, String notes) {
        boolean res;

        try {
            init();
            updateManagerOrdersStatementOne.setInt(1, quantity);
            updateManagerOrdersStatementOne.setInt(2, itemID);
            updateManagerOrdersStatementOne.setInt(3, transactionID);
            int rowCountOne = updateManagerOrdersStatementOne.executeUpdate();

            updateManagerOrdersStatementTwo.setString(1, status);
            updateManagerOrdersStatementTwo.setString(2, notes);
            updateManagerOrdersStatementTwo.setString(3, locationID);
            updateManagerOrdersStatementTwo.setInt(4, itemID);

            System.out.println(quantity + " " + status + " " + itemID + " " + transactionID + " " + locationID);
            int rowCountTwo = updateManagerOrdersStatementTwo.executeUpdate();
            res = (rowCountTwo == 1 && rowCountOne == 1);
        } catch (SQLException ex) {
            System.out.println(ex.getMessage());
            res = false;
        }
        return res;
    }

    public static boolean scanOrder(int transactionID, String status, String locationID) {
        boolean res;

        try {
            init();
            orderScannedStatement.setString(1, status);
            orderScannedStatement.setString(2, locationID);
            orderScannedStatement.setInt(3, transactionID);
            int rowCountOne = orderScannedStatement.executeUpdate();
            System.out.println(status + " " + transactionID + " " + locationID);
            res = (rowCountOne == 1);
        } catch (SQLException ex) {
            System.out.println(ex.getMessage());
            res = false;
        }
        return res;
    }

    public static boolean insertEmergencyOrder(EmergencyOrder eOrder) {
        boolean res;
        try {
            init();
            insertOrderStatementOne.setInt(1, eOrder.getTransactionID());
            insertOrderStatementOne.setString(2, eOrder.getTransactionType());
            insertOrderStatementOne.setString(3, eOrder.getOriginalLocationID());
            insertOrderStatementOne.setString(4, eOrder.getCreationDate());
            insertOrderStatementOne.setString(5, eOrder.getEstimatedArrival());
            insertOrderStatementOne.setString(6, eOrder.getTrasnactionStatus());
            
            insertOrderStatementOne.setString(7, eOrder.getSourceTransactionID());
            insertOrderStatementOne.setString(8, eOrder.getNotes());
            int rowCountOne = insertOrderStatementOne.executeUpdate();

            insertOrderStatementTwo.setInt(1, eOrder.getTransactionID());
            insertOrderStatementTwo.setInt(2, eOrder.getItemID());
            insertOrderStatementTwo.setInt(3, eOrder.getQuantity());
            System.out.println(eOrder.getQuantity());
            int rowCountTwo = insertOrderStatementTwo.executeUpdate();

            res = (rowCountOne == 1 && rowCountTwo == 1);
        } catch (SQLException ex) {
            System.out.println(ex.getMessage());
            res = false;
        }
        return res;

    }

    public static boolean insertDelivery(Delivery delivery) {
        boolean res;
        try {
            init();
            insertDeliveryStatement.setInt(1, delivery.getDeliveryID());

            Date dateandtime = delivery.getDateTime();
            String year = Integer.toString(dateandtime.getYear() + 1900);
            String month = Integer.toString(dateandtime.getMonth());
            String day = Integer.toString(dateandtime.getDay());
            String HH = Long.toString(dateandtime.getHours());
            String MI = Long.toString(dateandtime.getMinutes());
            String SC = Long.toString(dateandtime.getSeconds());

            insertDeliveryStatement.setString(2, year + "-" + month + "-" + day + " " + HH + ":" + MI + ":" + SC);
            insertDeliveryStatement.setString(3, delivery.getVehicleID());
            insertDeliveryStatement.setInt(4, delivery.getCourierID());
            int rowCount = insertDeliveryStatement.executeUpdate();

            res = (rowCount == 1);
        } catch (SQLException ex) {
            System.out.println(ex.getMessage());
            res = false;
        }
        return res;

    }

    public static boolean deleteItem(int x, int z) {
        boolean res;

        try {
            init();
            deleteStatement.setInt(1, z);
            deleteStatement.setInt(2, x);
            System.out.println(x);
            int rowCount = deleteStatement.executeUpdate();
            res = (rowCount == 1);
        } catch (SQLException ex) {
            res = false;
        }
        return res;
    }

    public static boolean updateItem(Item item) {
        boolean res;

        try {
            init();
            updateStatment.setString(1, item.getItemName());
            updateStatment.setString(2, item.getSku());
            updateStatment.setString(3, item.getDes());
            updateStatment.setString(4, item.getCategory());
            updateStatment.setDouble(5, item.getWeight());
            updateStatment.setDouble(6, item.getCostPrice());
            updateStatment.setDouble(7, item.getRetailPrice());
            updateStatment.setInt(8, item.getSupplierID());
            updateStatment.setInt(9, item.getActive());
            updateStatment.setString(10, item.getNotes());
            updateStatment.setInt(11, item.getCaseSize());
            updateStatment.setInt(12, item.getID());
            int rowCount = updateStatment.executeUpdate();
            System.out.println(rowCount);
            res = (rowCount == 1);
        } catch (SQLException ex) {
            res = false;
        }
        return res;
    }

    public static boolean addItem(Item item) {
        boolean res;
        try {
            init();
            insertItemStatement.setInt(1, item.getID());
            insertItemStatement.setString(2, item.getItemName());
            insertItemStatement.setString(3, item.getSku());
            insertItemStatement.setString(4, item.getDes());
            insertItemStatement.setString(5, item.getCategory());
            insertItemStatement.setDouble(6, item.getWeight());
            insertItemStatement.setDouble(7, item.getCostPrice());
            insertItemStatement.setDouble(8, item.getRetailPrice());
            insertItemStatement.setInt(9, item.getSupplierID());
            insertItemStatement.setInt(10, item.getActive());
            insertItemStatement.setString(11, item.getNotes());
            insertItemStatement.setDouble(12, item.getCaseSize());
            int rowCount = insertItemStatement.executeUpdate();
            res = (rowCount == 1);
        } catch (SQLException ex) {
            res = false;
        }
        return res;
    }

    public static boolean addOrder(Item item) {
        boolean res;
        try {
            init();
            insertItemStatement.setInt(1, item.getID());
            insertItemStatement.setString(2, item.getItemName());
            insertItemStatement.setString(3, item.getSku());
            insertItemStatement.setString(4, item.getDes());
            insertItemStatement.setString(5, item.getCategory());
            insertItemStatement.setDouble(6, item.getWeight());
            insertItemStatement.setDouble(7, item.getCostPrice());
            insertItemStatement.setDouble(8, item.getRetailPrice());
            insertItemStatement.setInt(9, item.getSupplierID());
            insertItemStatement.setInt(10, item.getActive());
            insertItemStatement.setString(11, item.getNotes());
            insertItemStatement.setDouble(12, item.getCaseSize());
            int rowCount = insertItemStatement.executeUpdate();
            res = (rowCount == 1);
        } catch (SQLException ex) {
            res = false;
        }
        return res;
    }

    public static boolean updateInventory(inventory inventory) {
        boolean res;

        try {
            init();
            updateIventoryStatement.setInt(1, inventory.getReorderThreshold());
            updateIventoryStatement.setInt(2, inventory.getReorderLevel());
            updateIventoryStatement.setInt(3, inventory.getItemID());
            updateIventoryStatement.setString(4, inventory.getLocationID());
            int rowCount = updateIventoryStatement.executeUpdate();
            System.out.println(rowCount);
            res = (rowCount == 1);
        } catch (SQLException ex) {
            res = false;
        }
        return res;
    }

    public static boolean updateCourier(courier courier) {
        boolean res;

        try {
            init();
            updateCourierStatement.setString(1, courier.getCourierName());
            updateCourierStatement.setString(2, courier.getAddress());
            updateCourierStatement.setString(3, courier.getCity());
            updateCourierStatement.setString(4, courier.getProvinceID());
            updateCourierStatement.setString(5, courier.getPostalCode());
            updateCourierStatement.setString(6, courier.getCountry());
            updateCourierStatement.setString(7, courier.getcourierEmail());
            updateCourierStatement.setString(8, courier.getCourierPhone());
            updateCourierStatement.setString(9, courier.getNotes());
            updateCourierStatement.setInt(10, courier.getCourierID());
            int rowCount = updateCourierStatement.executeUpdate();
            System.out.println(rowCount);
            res = (rowCount == 1);
        } catch (SQLException ex) {
            res = false;
        }
        return res;
    }

    public static boolean addCourier(courier courier) {
        boolean res;
        try {
            init();
            insertCourierStatement.setInt(1, courier.getCourierID());
            insertCourierStatement.setString(2, courier.getCourierName());
            insertCourierStatement.setString(3, courier.getAddress());
            insertCourierStatement.setString(4, courier.getCity());
            insertCourierStatement.setString(5, courier.getProvinceID());
            insertCourierStatement.setString(6, courier.getPostalCode());
            insertCourierStatement.setString(7, courier.getCountry());
            insertCourierStatement.setString(8, courier.getcourierEmail());
            insertCourierStatement.setString(9, courier.getCourierPhone());
            insertCourierStatement.setString(10, courier.getNotes());
            insertCourierStatement.setInt(11, courier.getActive());
            int rowCount = insertCourierStatement.executeUpdate();
            res = (rowCount == 1);
        } catch (SQLException ex) {
            res = false;
        }
        return res;
    }

    public static boolean deleteCourier(int x, int y) {
        boolean res;

        try {
            init();
            changeActiveCourierStatement.setInt(1, y);
            changeActiveCourierStatement.setInt(2, x);
            int rowCount = changeActiveCourierStatement.executeUpdate();
            res = (rowCount == 1);
        } catch (SQLException ex) {
            res = false;
        }
        return res;
    }

    public static boolean addUser(users user) {
        boolean res;
        try {
            init();
            insertUserStatement.setString(1, user.getUserID());
            insertUserStatement.setString(2, user.getPassword());
            insertUserStatement.setString(3, user.getLocationID());
            insertUserStatement.setString(4, user.getRoleID());
            insertUserStatement.setInt(5, user.getActive());
            int rowCount = insertUserStatement.executeUpdate();
            res = (rowCount == 1);
        } catch (SQLException ex) {
            res = false;
        }
        return res;
    }

    public static boolean updateUser(users user) {
        boolean res;

        try {
            init();
            updateUserStatement.setString(1, user.getPassword());
            updateUserStatement.setString(2, user.getLocationID());
            updateUserStatement.setString(3, user.getRoleID());
            updateUserStatement.setInt(4, user.getActive());
            updateUserStatement.setString(5, user.getUserID());
            int rowCount = updateUserStatement.executeUpdate();
            System.out.println(rowCount);
            res = (rowCount == 1);
        } catch (SQLException ex) {
            res = false;
        }
        return res;
    }

    public static boolean addLocation(location location) {
        boolean res;
        try {
            init();
            insertLocationStatement.setString(1, location.getLocationID());
            insertLocationStatement.setString(2, location.getDescription());
            insertLocationStatement.setString(3, location.getAddress());
            insertLocationStatement.setString(4, location.getCity());
            insertLocationStatement.setString(5, location.getProvince());
            insertLocationStatement.setString(6, location.getPostalCode());
            insertLocationStatement.setString(7, location.getCountry());
            insertLocationStatement.setString(8, location.getLocationTypeID());
            insertLocationStatement.setString(9, location.getDeliveryDay());
            insertLocationStatement.setInt(10, location.getActive());
            int rowCount = insertLocationStatement.executeUpdate();
            res = (rowCount == 1);
        } catch (SQLException ex) {
            res = false;
        }
        return res;
    }

    public static boolean updateLocation(location location) {
        boolean res;

        try {
            init();
            updateLocationStatement.setString(1, location.getDescription());
            updateLocationStatement.setString(2, location.getAddress());
            updateLocationStatement.setString(3, location.getCity());
            updateLocationStatement.setString(4, location.getProvince());
            updateLocationStatement.setString(5, location.getPostalCode());
            updateLocationStatement.setString(6, location.getCountry());
            updateLocationStatement.setString(7, location.getLocationTypeID());
            updateLocationStatement.setString(8, location.getDeliveryDay());
            updateLocationStatement.setInt(9, location.getActive());
            updateLocationStatement.setString(10, location.getLocationID());
            int rowCount = updateLocationStatement.executeUpdate();
            System.out.println(rowCount);
            res = (rowCount == 1);
        } catch (SQLException ex) {
            res = false;
        }
        return res;
    }

    public static boolean deleteLocation(String x, int y) {
        boolean res;

        try {
            init();
            changeActiveLocationStatement.setInt(1, y);
            changeActiveLocationStatement.setString(2, x);
            int rowCount = changeActiveLocationStatement.executeUpdate();
            res = (rowCount == 1);
        } catch (SQLException ex) {
            res = false;
        }
        return res;
    }

    public static boolean deleteUser(String x, int y) {
        boolean res;

        try {
            init();
            changeActiveUserStatement.setInt(1, y);
            changeActiveUserStatement.setString(2, x);
            int rowCount = changeActiveUserStatement.executeUpdate();
            res = (rowCount == 1);
        } catch (SQLException ex) {
            res = false;
        }
        return res;
    }

    public static boolean deleteInventory(int x, int y) {
        boolean res;

        try {
            init();
            changeActiveInventoryStatement.setInt(1, y);
            changeActiveInventoryStatement.setInt(2, x);
            int rowCount = changeActiveInventoryStatement.executeUpdate();
            res = (rowCount == 1);
        } catch (SQLException ex) {
            res = false;
        }
        return res;
    }

    public static boolean addInventory(inventory inventory) {
        boolean res;
        try {
            init();
            insertInventoryStatement.setInt(1, inventory.getItemID());
            insertInventoryStatement.setString(2, inventory.getItemName());
            insertInventoryStatement.setString(3, inventory.getLocationID());
            insertInventoryStatement.setString(4, inventory.getSku());
            insertInventoryStatement.setString(5, inventory.getCategoryName());
            insertInventoryStatement.setString(6, inventory.getDescription());
            insertInventoryStatement.setInt(7, inventory.getQuantity());
            insertInventoryStatement.setDouble(8, inventory.getWeight());
            insertInventoryStatement.setInt(9, inventory.getCaseSize());
            insertInventoryStatement.setDouble(10, inventory.getCostPrice());
            insertInventoryStatement.setDouble(11, inventory.getRetailPrice());
            insertInventoryStatement.setInt(12, inventory.getSupplierID());
            insertInventoryStatement.setInt(13, inventory.getReorderThreshold());
            insertInventoryStatement.setInt(14, inventory.getReorderLevel());
            int rowCount = insertInventoryStatement.executeUpdate();
            res = (rowCount == 1);
        } catch (SQLException ex) {
            res = false;
        }
        return res;
    }
}
