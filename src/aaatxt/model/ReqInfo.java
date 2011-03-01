package aaatxt.model;

import java.io.Serializable;
import java.util.Date;

import javax.jdo.annotations.IdGeneratorStrategy;
import javax.jdo.annotations.IdentityType;
import javax.jdo.annotations.PersistenceCapable;
import javax.jdo.annotations.Persistent;
import javax.jdo.annotations.PrimaryKey;

import com.google.appengine.api.datastore.Key;

@PersistenceCapable(identityType = IdentityType.APPLICATION)
public class ReqInfo  implements Serializable{

    @PrimaryKey
    @Persistent(valueStrategy = IdGeneratorStrategy.IDENTITY)
	private Key key;
	
    private String host;
    
    private Date date;
    
    private String keyword;
    
	public String getKeyword() {
		return keyword;
	}

	public void setKeyword(String keyword) {
		this.keyword = keyword;
	}

	public ReqInfo(Date date, String host) {
		this.date = date;
		this.host = host;
	}


	public String getHost() {
		return host;
	}

	public Date getDate() {
		return date;
	}

	public Key getKey() {
		return key;
	}

	public void setKey(Key key) {
		this.key = key;
	}

	public void setHost(String host) {
		this.host = host;
	}

	public void setDate(Date date) {
		this.date = date;
	}
	
	
}
