package aaatxt.server;

import java.io.IOException;
import java.lang.Character.UnicodeBlock;
import java.net.URLEncoder;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;
import java.util.Set;
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
import twitter4j.internal.http.HTMLEntity;


public abstract class SorameServlet extends HttpServlet {

	public static final String queryBase = "空目  ";

	// when it cannot connect twitter search, it use popular keywords.
	public static final String[] pops = {
		"パラグアイ", "ブブゼラ", "ブラゼル", "ノーパソ", "カメルーン", "ブブセラ", "ロータリー",
		"ラプラス" , "ラブプラス", "スカイプ" , "ソニー" , "ラプラス変換", "ガルデモ" , "アイス" ,
		"アリエッティ" , "ピッチ"  , "こしいたい" , "フランちゃん人形" , "スイカバー"  , "ブラブラ" ,
		"ファミチキ" , "エアコン" , "七夕" , "カルガモ"  , "ゼブラ" , "オートバイパーツ", "ブラウザ" ,
		"ブラジル"
	};
	
	// previous keyword.
	public static final String PREV = "PREV"; 

	// previous selected edges.
	public static final String EDGE_LIST = "EDGE_LIST"; 

	// previous serached keyword.
	public static final String KEYWORD_LIST = "KEYWORD_LIST";

	protected void execute(HttpServletRequest req) {
		String q = req.getParameter("q");
		List<Edge> l = null;
		Set<String> searchedKeywords = null;
		// リクエストが以前と同じで、リストが存在し、クエリ文字列が空でなければ.
		if (req.getSession() != null && req.getSession().getAttribute(PREV) != null
				&& req.getSession().getAttribute(PREV).equals(q)
				&& q != null && !q.isEmpty()
				&& req.getSession().getAttribute(EDGE_LIST) != null
				&& req.getSession().getAttribute(KEYWORD_LIST) != null) {
			
			// 前回までに検索されたエッジのリスト。
			List<Edge> prevL = (List<Edge>) req.getSession().getAttribute(EDGE_LIST);
			// 前回までに検索されたキーワードのセット
			searchedKeywords = (Set<String>) req.getSession().getAttribute(KEYWORD_LIST);

			Set<String> querySet = new HashSet<String>();
			for (Iterator<Edge> iterator = prevL.iterator(); iterator
					.hasNext();) {
				Edge edge = (Edge) iterator.next();
				if (searchedKeywords.add(edge.getEnd())) {
					querySet.add(edge.getEnd());
				}
				if (searchedKeywords.add(edge.getStart())) {
					querySet.add(edge.getStart());
				}
			}
			Set<Edge> resultList = new HashSet<Edge>();
			resultList.addAll(prevL);
			SorameDatastoreQuery sdq = new SorameDatastoreQuery();
			for (Iterator iterator = querySet.iterator(); iterator
					.hasNext();) {
				String query = (String) iterator.next();
				resultList.addAll(sdq.searchEnd(query));
				resultList.addAll(sdq.searchStart(query));			
			}
			l = new ArrayList<Edge>();
			l.addAll(resultList);
		} else {
			
			NetworkHandler n = new NetworkHandler(req);
			List<Edge> l1 = n.search(Twitter4jtest.queryBase + (q != null ? q : ""));
			SorameDatastoreQuery sdq = new SorameDatastoreQuery();
			if ((q == null || q.isEmpty()) && l1.size() == 0) {
				q = pops[(int) (Math.random() * (double) pops.length)];
			}
			
			searchedKeywords = new HashSet<String>();
			searchedKeywords.add(q);
			
			if (q != null && !q.isEmpty()) {
				l1.addAll(sdq.searchEnd(q));
				l1.addAll(sdq.searchStart(q));			
			}
			//　重複除去
			Set<Edge> resultSet = new HashSet<Edge>();
			for (Iterator iterator = l1.iterator(); iterator.hasNext();) {
				resultSet.add((Edge) iterator.next());
			}
			l = new ArrayList<Edge>();
			l.addAll(resultSet);
		}
		req.getSession().setAttribute(PREV, q);
		req.getSession().setAttribute(EDGE_LIST, l);
		req.getSession().setAttribute(KEYWORD_LIST, searchedKeywords);
		req.setAttribute("val", l);
		req.setAttribute("q", (q != null ? HTMLEntity.escape(q) : ""));
	}
	

	
	private String graph(List<Edge> list) {
		StringBuilder sb = new StringBuilder();
//      	<node id="<%= e.getStart() %>"><data key="label"><%= e.getStart() %></data></node>\
//        <node id="<%= e.getEnd() %>"><data key="label"><%= e.getEnd() %></data></node>\
//        <edge target="<%= e.getEnd() %>" source="<%= e.getStart() %>"></edge>\<%}%>
		return "";
	}

	
		
}
