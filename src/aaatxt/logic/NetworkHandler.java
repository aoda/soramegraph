package aaatxt.logic;

import static com.google.appengine.api.labs.taskqueue.TaskOptions.Builder.url;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;
import java.util.Iterator;
import java.util.List;

import javax.cache.Cache;
import javax.cache.CacheException;
import javax.cache.CacheManager;
import javax.jdo.PersistenceManager;
import javax.servlet.http.HttpServletRequest;

import twitter4j.Query;
import twitter4j.QueryResult;
import twitter4j.Tweet;
import twitter4j.Twitter;
import twitter4j.TwitterFactory;
import aaatxt.model.Edge;
import aaatxt.model.ReqInfo;

import com.google.appengine.api.labs.taskqueue.Queue;
import com.google.appengine.api.labs.taskqueue.QueueFactory;

public class NetworkHandler {
	
	private HttpServletRequest req;

	public NetworkHandler(HttpServletRequest req) {
		this.req = req;
	}

	public List<Edge> search(String q)  {
		
		ReqInfo reqInfo = new ReqInfo(new Date(), req.getRemoteHost());
		reqInfo.setKeyword(q);

        Queue queue = QueueFactory.getDefaultQueue();
		Cache cache = null;

		try {
	          cache = CacheManager.getInstance().getCacheFactory().createCache(Collections.emptyMap());
	     } catch (CacheException e) {
	            System.out.println("cache 取得出来ませんでした。");// ... //$NON-NLS-1$
	     }


		
		List<Edge> list = new  ArrayList<Edge>();
		try {
//			q = URLEncoder.encode(q, "UTF-8");
			TwitterFactory tf = new TwitterFactory();
			Twitter twitter = tf.getInstance();
			// getFollowersするなら必要なはず
			//Twitter twitter = tf.getInstance("aaatxt", Messages.getString("NetworkHandler.2")); //$NON-NLS-1$ //$NON-NLS-2$
			
			QueryResult result = twitter.search((new Query(q)).rpp(100));

			for (Iterator iterator = result.getTweets().iterator(); iterator.hasNext();) {
				Tweet tw = (Tweet) iterator.next();
				//				sb.append(tw.getText() + "\n");
				Edge e = Extractor.getEdge(tw.getText());
				if (e != null) {
//					User u = twitter.showUser(tw.getFromUser());
//					e.setFollowers(u.getFollowersCount());
					e.setFromUser(tw.getFromUser());
					e.setProfileImageUrl(tw.getProfileImageUrl());
					e.setTweet(Util.HTMLEscape(tw.getText()));
					e.setCreatedAt(tw.getCreatedAt());
					e.setUrl("http://twitter.com/" + tw.getFromUser() + "/status/" + tw.getId()); //$NON-NLS-1$ //$NON-NLS-2$
//					e.setUrl("http://twitter.com/" + u.getScreenName() + "/status/" + tw.getId());
//					System.out.println(e.getStart().getWord() + ":" + e.getEnd().getWord() + ":" + e.getFollowers() + ":" + e.getUrl() + ":" + e.getTweet());
					e.setReqInfo(reqInfo);
					list.add(e);
					cache.put(e.getUrl(), e);
			        queue.add(url("/soramePersist").param("key", e.getUrl())); //$NON-NLS-1$ //$NON-NLS-2$
			     }
			}
	        } catch (Exception e) {
//        	sb.append("Usage: ?q=[query]");
        	e.printStackTrace();
        }
		return list;
	}

}
