package aaatxt.logic;

import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;

import javax.jdo.Extent;

import aaatxt.model.Counter;
import aaatxt.model.Edge;

public class SorameStatistics {

	public String getRanking(String mode) {

		String s = "[";
		
//		Query query = PMF.get().getPersistenceManager().newQuery(Edge.class);
//		query.setFilter("lastName == lastNameParam");
//		query.setOrdering("end");
//		query.declareParameters("String lastNameParam");
		Extent<Edge> results = PMF.get().getPersistenceManager().getExtent(Edge.class, false);		
		Map<String, Counter> m = new HashMap<String, Counter>();
		for (Edge e : results) {

			String key = e.getEnd();//defualt
			if (mode != null) {
				if (mode.equals("end")) {
					key = e.getEnd();
				} else if (mode.equals("start")) {
					key = e.getStart();
				}
			}
			Counter c = m.get(key);
			if (c == null) {
				c = new Counter(key);
				m.put(key, c);
			}
			c.increment();
		}
		results.closeAll();
		Counter[] cs = m.values().toArray(new Counter[0]);
		Arrays.sort(cs);
		for (int i = 0; i < cs.length; i++) {
			s +=  "\"" + cs[i].getName() + "\" : \"" + cs[i].getValue() + " , ";
		}
		return s + "]";
	}


	
}
