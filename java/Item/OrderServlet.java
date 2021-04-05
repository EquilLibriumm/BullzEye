/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package Item;

import com.google.gson.Gson;
import dbAccess.dbAccessor;
import entity.EmergencyOrder;
import entity.Order;
import entity.inventory;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.Scanner;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 *
 * @author scott
 */
@WebServlet(name = "OrderServlet", urlPatterns = {"/OrderServlet", "/OrderServlet/*"})
public class OrderServlet extends HttpServlet {

    /**
     * Processes requests for both HTTP <code>GET</code> and <code>POST</code>
     * methods.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    protected void processRequest(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setContentType("text/html;charset=UTF-8");
        try (PrintWriter out = response.getWriter()) {
            /* TODO output your page here. You may use following sample code. */
            out.println("<!DOCTYPE html>");
            out.println("<html>");
            out.println("<head>");
            out.println("<title>Servlet OrderServlet</title>");
            out.println("</head>");
            out.println("<body>");
            out.println("<h1>Servlet OrderServlet at " + request.getContextPath() + "</h1>");
            out.println("</body>");
            out.println("</html>");
        }
    }

    // <editor-fold defaultstate="collapsed" desc="HttpServlet methods. Click on the + sign on the left to edit the code.">
    /**
     * Handles the HTTP <code>GET</code> method.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        try (PrintWriter out = response.getWriter()) {

            String pathInfo = request.getPathInfo();
            String[] location = pathInfo.substring(1).split("/");
            String id = location[0];
            ArrayList<Order> order = new ArrayList();
            order = dbAccessor.getOrders(id);
            String jsonObject = new Gson().toJson(order);
            out.println(jsonObject);
        }
    }

    /**
     * Handles the HTTP <code>POST</code> method.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        try (PrintWriter out = response.getWriter()) {
            Scanner sc = new Scanner(request.getReader());
            String JSON = sc.nextLine();
            Gson g = new Gson();
            System.out.println(JSON);
            EmergencyOrder emergencyOrder = g.fromJson(JSON, EmergencyOrder.class);
            boolean success = dbAccessor.insertEmergencyOrder(emergencyOrder);
            out.println(success == true ? 1 : 0);
        }catch (Exception ex){
            ex.getMessage();
            System.out.println(ex.getMessage());
        }
    }
        @Override
    protected void doPut(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        try (PrintWriter out = response.getWriter()) {
            Scanner sc = new Scanner(request.getReader());
            String JSON = sc.nextLine();
            Gson g = new Gson();
            inventory inventory = g.fromJson(JSON, inventory.class);
            System.out.println(inventory);
            boolean success = dbAccessor.updateInventory(inventory);
            out.println(success == true ? 1 : 0);
        }
    }
    /**
     * Returns a short description of the servlet.
     *
     * @return a String containing servlet description
     */
    @Override
    public String getServletInfo() {
        return "Short description";
    }// </editor-fold>

}
