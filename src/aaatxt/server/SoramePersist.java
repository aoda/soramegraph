package aaatxt.server;

import java.io.IOException;
import java.lang.Character.UnicodeBlock;
import java.net.URLEncoder;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Iterator;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import javax.cache.Cache;
import javax.cache.CacheException;
import javax.cache.CacheManager;
import javax.jdo.PersistenceManager;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import aaatxt.logic.Extractor;
import aaatxt.logic.NetworkHandler;
import aaatxt.logic.PMF;
import aaatxt.logic.Util;
import aaatxt.model.Edge;

import twitter4j.Query;
import twitter4j.QueryResult;
import twitter4j.Tweet;
import twitter4j.Twitter;
import twitter4j.TwitterFactory;
import twitter4j.User;


public class SoramePersist extends HttpServlet {

	// twitter API を使って検索
	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException {
		String key = req.getParameter("key");
		Cache cache = null;

		try {
	          cache = CacheManager.getInstance().getCacheFactory().createCache(Collections.emptyMap());
	     } catch (CacheException e) {
	            System.out.println("cache 取得出来ませんでした。");// ...
	     }

	     Edge e = (Edge)cache.get(key);
	     PersistenceManager pm = PMF.get().getPersistenceManager();
	     try {
	    	 pm.makePersistent(e);
	     } finally {
	    	 pm.close();
	     }

	}
	@Override
	protected void doPost(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException {
		// TODO Auto-generated method stub
		doGet(req, resp);
	}
	
	
}
