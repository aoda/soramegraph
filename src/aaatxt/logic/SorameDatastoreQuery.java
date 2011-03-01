package aaatxt.logic;

import java.util.List;

import javax.jdo.Query;

import aaatxt.model.Edge;

public class SorameDatastoreQuery {

	public List<Edge> searchStart(String start)  {
		Query query = PMF.get().getPersistenceManager().newQuery(Edge.class);
		query.setFilter("start == param");
		return search(start, query);
	}

	private List<Edge> search(String start, Query query) {
		query.declareParameters("String param");
	    try {
	        List<Edge> results = (List<Edge>) query.execute(start);
//	        if (results.iterator().hasNext()) {
//	            for (Edge e : results) {
//
//	            }
//	        } else {
	            // ... no results ...
//	        }
	        System.out.println(start + ":" + results.size());
	        return results;
	    } finally {
	        query.closeAll();
	    }
	}

	public List<Edge> searchEnd(String end)  {
		Query query = PMF.get().getPersistenceManager().newQuery(Edge.class);
		query.setFilter("end == param");
		return search(end, query);
	}

}
