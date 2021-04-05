/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package Item;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.Scanner;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.gson.Gson;

import dbAccess.dbAccessor;
import entity.courier;

/**
 *
 * @author scott
 */
@WebServlet(name = "CourierServlet", urlPatterns = {"/CourierServlet", "/CourierServlet/courier/*"})
public class CourierServlet extends HttpServlet {

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
            out.println("<title>Servlet CourierServlet</title>");
            out.println("</head>");
            out.println("<body>");
            out.println("<h1>Servlet CourierServlet at " + request.getContextPath() + "</h1>");
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
            ArrayList<courier> couriers = new ArrayList();
            couriers = dbAccessor.getAllCouriers();
            String jsonObject = new Gson().toJson(couriers);
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
            courier courier = g.fromJson(JSON, courier.class);
            boolean success = dbAccessor.addCourier(courier);
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
            courier courier = g.fromJson(JSON, courier.class);
            boolean success = dbAccessor.updateCourier(courier);
            out.println(success == true ? 1 : 0);
        }
    }

    @Override
    protected void doDelete(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        try (PrintWriter out = response.getWriter()) {
            String pathInfo = request.getPathInfo();
            String[] courier = pathInfo.substring(1).split("/");
            String id = courier[0];
            String active = courier[1];
            boolean success = dbAccessor.deleteCourier(Integer.parseInt(id), Integer.parseInt(active));
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
