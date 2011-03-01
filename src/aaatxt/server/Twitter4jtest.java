package aaatxt.server;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;
import java.util.Set;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import aaatxt.logic.NetworkHandler;
import aaatxt.logic.SorameDatastoreQuery;
import aaatxt.model.Edge;


public class Twitter4jtest extends SorameServlet {


//	public static String 
	// twitter API を使って検索
	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException {
		execute(req);
		req.getRequestDispatcher("/WEB-INF/jsp/twitter4jtest.jsp").forward(req, resp);
	}

	
	@Override
	protected void doPost(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException {
		// TODO Auto-generated method stub
		doGet(req, resp);
	}
	// 
	
}
