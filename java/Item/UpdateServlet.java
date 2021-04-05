/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package Item;

import com.google.gson.Gson;
import dbAccess.dbAccessor;
import entity.*;
import entity.Item;
import java.io.IOException;
import java.io.PrintWriter;
import static java.lang.System.console;
import static java.lang.System.out;
import java.util.ArrayList;
import java.util.Scanner;
import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 *
 * @author scott
 */
@WebServlet(name = "UpdateServlet", urlPatterns = {"/UpdateServlet", "/UpdateServlet/Item/*"})
public class UpdateServlet extends HttpServlet {

    protected void processRequest(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setContentType("text/html;charset=UTF-8");

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
            ArrayList<Item> item = new ArrayList();
            item = dbAccessor.getAllItems();
            String jsonObject = new Gson().toJson(item);
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
            System.out.println(JSON);
            Gson g = new Gson();
            try {
                Item item = g.fromJson(JSON, Item.class);
            boolean success = dbAccessor.addItem(item);
            out.println(success == true ? 1 : 0);
            } catch (Exception ex) {
                System.out.println(ex.getMessage());
            }
        }
    }

    @Override
    protected void doPut(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        try (PrintWriter out = response.getWriter()) {
            Scanner sc = new Scanner(request.getReader());
            String JSON = sc.nextLine();
            Gson g = new Gson();
            Item item = g.fromJson(JSON, Item.class);
            System.out.println(item);
            boolean success = dbAccessor.updateItem(item);
            out.println(success == true ? 1 : 0);
        }
    }
//

    @Override
    protected void doDelete(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        try (PrintWriter out = response.getWriter()) {
            String pathInfo = request.getPathInfo();
            String[] item = pathInfo.substring(1).split("/");
            String id = item[0];
            String active = item[1];
            System.out.println(item);
            dbAccessor.deleteItem(Integer.parseInt(id), Integer.parseInt(active));

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
