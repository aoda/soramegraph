package aaatxt.server;

import java.io.IOException;
import java.lang.Character.UnicodeBlock;
import java.net.URLEncoder;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import aaatxt.logic.Extractor;
import aaatxt.logic.NetworkHandler;
import aaatxt.logic.SorameDatastoreQuery;
import aaatxt.logic.Util;
import aaatxt.model.Edge;

import twitter4j.Query;
import twitter4j.QueryResult;
import twitter4j.Tweet;
import twitter4j.Twitter;
import twitter4j.TwitterFactory;
import twitter4j.User;


public class NetworkAjax extends SorameServlet {

	// twitter API を使って検索
	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException {
		execute(req);
		req.getRequestDispatcher("/WEB-INF/jsp/networkAjax.jsp").forward(req, resp);
	}
	
	@Override
	protected void doPost(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException {
		// TODO Auto-generated method stub
		doGet(req, resp);
	}
	// 
	
		
}
