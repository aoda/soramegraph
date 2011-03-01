<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<jsp:useBean id="res" type="java.lang.String" scope="request"/>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<link rel="stylesheet" type="text/css" href="/styles/style.css" />
</head>
<body>
<div id="header"><a href="/soramegraph"><img src="logo.png" width="200px"/></a></div>
<div>
	<form action="/kebun" method="get">
		<input id="src" type="text" name="src" size="125" maxlength="250"></input>
		<input id="submit" type="submit" value="ケブン"></input>
	</form>
</div>
<div>
	<span id="res"><%= res != null ? res :"" %></span>
</div>
</body>
</html>