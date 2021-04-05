/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package Item;

import com.google.gson.Gson;
import dbAccess.dbAccessor;
import entity.WarehouseInventory;
import entity.inventory;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 *
 * @author scott
 */
@WebServlet(name = "WarehouseManagerServlet", urlPatterns = {"/WarehouseManagerServlet/*"})
public class WarehouseManagerServlet extends HttpServlet {

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
            out.println("<title>Servlet WarehouseManagerServlet</title>");
            out.println("</head>");
            out.println("<body>");
            out.println("<h1>Servlet WarehouseManagerServlet at " + request.getContextPath() + "</h1>");
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
            ArrayList<WarehouseInventory> inventory = new ArrayList();
            inventory = dbAccessor.getWarehouseInventory();
            String jsonObject = new Gson().toJson(inventory);
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
            String pathInfo = request.getPathInfo();
            String[] order = pathInfo.substring(1).split("/");
            String id = order[0];
            String status = order[1];
            String locationID = order[2];
            String note = order[3];
            System.out.println(locationID);
            boolean success = dbAccessor.processReturn(Integer.parseInt(id), status,locationID,note);
            out.println(success == true ? 1 : 0);
        }
    }

    @Override
    protected void doPut(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        try (PrintWriter out = response.getWriter()) {
            String pathInfo = request.getPathInfo();
            String[] order = pathInfo.substring(1).split("/");
            String id = order[0];
            String status = order[1];
            String locationID = order[2];
            System.out.println(locationID);
            boolean success = dbAccessor.scanOrder(Integer.parseInt(id), status,locationID);
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
