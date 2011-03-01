package aaatxt.logic;

import java.util.Arrays;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import javax.jdo.Query;

import aaatxt.model.Counter;
import aaatxt.model.Edge;

public class Autocomplete {

	public String searchStart(String start)  {
		String result = "";
		Query query = PMF.get().getPersistenceManager().newQuery(Edge.class);
		query.setFilter("start.startsWith(param)");
		query.declareParameters("String param");
	    try {
	        List<Edge> results = (List<Edge>) query.execute(start);
			Map<String, Counter> m = new HashMap<String, Counter>();
	        if (results.iterator().hasNext()) {
	            for (Edge e : results) {
	    			Counter c = m.get(e.getStart());
	    			if (c == null) {
	    				c = new Counter(e.getStart());
	    				m.put(e.getStart(), c);
	    			}
	    			c.increment();
	            }
	        }
			Counter[] cs = m.values().toArray(new Counter[0]);
			Arrays.sort(cs);
			for (int i = 0; i < Math.min(cs.length, 5); i++) {
				result += cs[i].getName() + "\n";
			}
	        return  result;
	    } finally {
	        query.closeAll();
	    }
	}


}
