/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package Item;

import com.google.gson.Gson;
import dbAccess.dbAccessor;
import entity.Item;
import entity.users;
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
@WebServlet(name = "User", urlPatterns = {"/User", "/User/*"})
public class User extends HttpServlet {

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
            ArrayList<users> user = new ArrayList();
            user = dbAccessor.getAllUsers();
            System.out.println(user);
            String jsonObject = new Gson().toJson(user);
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
            users user = g.fromJson(JSON, users.class);
            boolean success = dbAccessor.addUser(user);
            out.println(success == true ? 1 : 0);
        }
    }

    @Override
    protected void doPut(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        try (PrintWriter out = response.getWriter()) {
            Scanner sc = new Scanner(request.getReader());
            String JSON = sc.nextLine();
            Gson g = new Gson();
            users user = g.fromJson(JSON, users.class);
            boolean success = dbAccessor.updateUser(user);
            out.println(success == true ? 1 : 0);
        }
    }

    @Override
    protected void doDelete(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        try (PrintWriter out = response.getWriter()) {
            String pathInfo = request.getPathInfo();
            String[] user = pathInfo.substring(1).split("/");
            String id = user[0];
            String active = user[1];
            boolean success = dbAccessor.deleteUser(id, Integer.parseInt(active));
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
