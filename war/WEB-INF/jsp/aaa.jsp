<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<jsp:useBean id="ranking" type="java.util.Map" scope="request"/>
<jsp:useBean id="body" type="java.lang.String" scope="request"/>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>Insert title here</title>
</head>
<body>
<%
	for(int i = 0; i < ranking.size(); i++) {
		out.println(ranking.keySet().toArray()[i] + "   " + ranking.get(ranking.keySet().toArray()[i]));	
	}
%>

<% out.print(body); %>
</body>
</html>