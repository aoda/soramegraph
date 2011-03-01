package aaatxt.model;

import java.io.Serializable;
import java.util.Date;

import javax.jdo.annotations.IdGeneratorStrategy;
import javax.jdo.annotations.IdentityType;
import javax.jdo.annotations.PersistenceCapable;
import javax.jdo.annotations.Persistent;
import javax.jdo.annotations.PrimaryKey;

@PersistenceCapable(identityType = IdentityType.APPLICATION)
public class Edge implements Serializable{

	@PrimaryKey
    @Persistent(valueStrategy = IdGeneratorStrategy.IDENTITY)
	private String url;

	@Persistent
	private ReqInfo reqInfo;
	
	@Persistent
	private String start;

	@Persistent	
	private String end;
	
	@Persistent
	private String tweet;
	
	private int followers;

	@Persistent
	private Date createdAt;
	
	@Persistent
	private String profileImageUrl;
	
	@Persistent
	private String fromUser;

	public Date getCreatedAt() {
		return createdAt;
	}

	public void setCreatedAt(Date createdAt) {
		this.createdAt = createdAt;
	}

	public String getProfileImageUrl() {
		return profileImageUrl;
	}

	public void setProfileImageUrl(String profileImageUrl) {
		this.profileImageUrl = profileImageUrl;
	}

	public String getFromUser() {
		return fromUser;
	}

	public void setFromUser(String fromUser) {
		this.fromUser = fromUser;
	}

	
	public Edge(String start, String end) {
		this.start = start;
		this.end = end;
	}
	
	public String getTweet() {
		return tweet;
	}

	public void setTweet(String tweet) {
		this.tweet = tweet;
	}

	public String getUrl() {
		return url;
	}

	public void setUrl(String url) {
		this.url = url;
	}

	public int getFollowers() {
		return followers;
	}

	public void setFollowers(int followers) {
		this.followers = followers;
	}

	public String getStart() {
		return start;
	}
	
	public String getEnd() {
		return end;
	}

	public ReqInfo getReqInfo() {
		return reqInfo;
	}

	public void setReqInfo(ReqInfo reqInfo) {
		this.reqInfo = reqInfo;
	}
	
	@Override
	public int hashCode() {
		return url.hashCode();
	}

	@Override
	public boolean equals(Object obj) {
		if (obj instanceof Edge) {
			return this.getUrl().equals(((Edge) obj).getUrl());
		}
		return false;
	}
	
}
