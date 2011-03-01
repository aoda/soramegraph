<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<jsp:useBean id="val" type="java.util.List" scope="request"/>
<jsp:useBean id="q" type="java.lang.String" scope="request"/>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">

<%@page import="java.util.Set"%><html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>soramegraph</title>
<!-- Flash embedding utility (needed to embed Cytoscape Web) -->
<script type="text/javascript" src="cytoscapeweb/js/src/AC_OETags.js"></script>
<!-- JSON support for IE (needed to use JS API) -->
<script type="text/javascript" src="cytoscapeweb/js/src/json2.js"></script>
<!-- Cytoscape Web JS API (needed to reference org.cytoscapeweb.Visualization) -->
<script type="text/javascript" src="cytoscapeweb/js/src/cytoscapeweb.js"></script>
<script type="text/javascript" src="js/jquery-1.3.2.min.js"></script>
<script type="text/javascript" src="js/twitterUtils.js"></script>
<script type="text/javascript" src="js/jquery.qtip-1.0.0-rc3.min.js"></script>
<script type="text/javascript" src="/js/jquery.autocomplete.js"></script>
<link rel="stylesheet" type="text/css" href="/styles/jquery.autocomplete.css" />
<link rel="stylesheet" type="text/css" href="/styles/style.css" />
<script type="text/javascript">
		$(document).ready(function(){
                // id of Cytoscape Web container div
                var div_id = "cytoscapeweb";
                // network data could alternatively be grabbed via ajax
                var network = '\
                <graphml>\
                <key id="label" for="all" attr.name="label" attr.type="string"/>\
                <key id="url" for="all" attr.name="url" attr.type="string"/>\
                <key id="fromUser" for="all" attr.name="fromUser" attr.type="string"/>\
                <key id="profileImageUrl" for="all" attr.name="profileImageUrl" attr.type="string"/>\
                  <graph edgedefault="directed">\<% Set<String> set = new java.util.HashSet<String>();	for (java.util.Iterator<aaatxt.model.Edge> iterator = val.iterator(); iterator.hasNext();) {aaatxt.model.Edge e = (aaatxt.model.Edge) iterator.next(); %>
<% if (!set.contains(e.getStart())) { %> <node id="<%= e.getStart() %>"><data key="label"><%= e.getStart() %></data></node><% set.add(e.getStart());}%>\
<% if (!set.contains(e.getEnd())) { %> <node id="<%= e.getEnd() %>"><data key="label"><%= e.getEnd() %></data></node><% set.add(e.getEnd()); }%>\
                    <edge target="<%= e.getEnd() %>" source="<%= e.getStart() %>"><data key="label"><%= e.getTweet() %></data><data key="url"><%= e.getUrl() %></data><data key="profileImageUrl"><%= e.getProfileImageUrl() %></data><data key="fromUser"><%= e.getFromUser() %></data></edge>\<%}%>
                    </graph>\
                </graphml>\
                ';
                var style = {
                        global: {
                            backgroundColor: "#ffffff",
                            tooltipDelay: 100
                        },
/*                        nodes: {
                            shape: "ELLIPSE",
                            color: "#333333",
                            opacity: 1,
                            size: { defaultValue: 12, 
                                    continuousMapper: { attrName: "weight", 
                                                        minValue: 12, 
                                                        maxValue: 36 } },
                            borderColor: "#000000",
                            tooltipText: "<b>${label}</b>: ${weight}"
                        }, */
                        edges: {
                            color: "#999999",
                            width: 2,
                            mergeWidth: 2,
                            opacity: 1,
                            mergeTooltipText: "hoge"
                         }
                };
                // options used for Cytoscape Web
                var options = {
                    // where you have the Cytoscape Web SWF
                    swfPath: "cytoscapeweb/swf/CytoscapeWeb",
                    
                    // where you have the Flash installer SWF
                    flashInstallerPath: "cytoscapeweb/swf/playerProductInstall",

                    visualStyle: style,
                
                    wmode: "transparent",
                    // your data goes here
                    network: network
                };
                
                // init and draw
                var vis = new org.cytoscapeweb.Visualization(div_id, options);
				// addListener
				vis.addListener("click", "edges", function(evt) {
					var edge = evt.target;
					//window.open(edge.data.url);
					$('#desc').replaceWith($("<div  id=\"desc\">" + "<a href=\"http://twitter.com/" + edge.data.fromUser + "\"><img src=\"" + edge.data.profileImageUrl + "\"/></a>" + "<a href=\"http://twitter.com/" + edge.data.fromUser + "\">" + edge.data.fromUser + "</a>" + formatTwitString(edge.data.label) + "<a href=\"" + edge.data.url + "\"> open...</a>" + "</div>"));
				});
				vis.addListener("click", "nodes", function(evt) {
					var node = evt.target;
					// window.open("soramegraph?q=" + encodeURI(node.data.label));
					$.ajax({
   						type: "GET",
   						url: "soramegraph/network.xml?q=" + encodeURI(node.data.label),
						beforeSend : function () {
							$('#desc').append($('<div id=\"waiting\"><img src=\"wating.gif\"/></div'));
							$('#q').val(node.data.label);
						},
   						success: function(xml){
							var vOptions = {};
							for (var i in options){
								if (i != 'network') {
									vOptions[i] = options[i];
								}
							}
							try {
								vOptions['network'] = (new XMLSerializer()).serializeToString(xml);
							} catch (e) {
								// for Internet Explorer.
								vOptions['network'] = xml.xml;							    
							}

							$("#waiting").remove();
							if (xml.getElementsByTagName("node").length == 0) {
								$('#desc').replaceWith($("<div  id=\"desc\">「" + node.data.label + "」での検索結果が<span class=\"warn\">0件</span>でした。</div>"));
							}　else {
								$('#desc').replaceWith($("<div id=\"desc\" class=\"desc\">矢印をクリックするとTweetを表示します。丸をクリックするとキーワードで検索します。</div>"));
								vis.draw(vOptions);
							}
						}
	 				});
					
				});
                vis.draw(options);
            });
        </script>
		<script type="text/javascript">
			$(document).ready(function(){
  				$('#q').autocomplete('/soramegraph/autocomplete');
			});
			$(document).ready(function() {
				$('#q').change(function() {
					if($('#q').val() != '<%= q %>') {
						$('#submit').val('検索');
					} else {
						$("#submit").val('連続して検索');
					}
				});
			});
		</script>
</head>
<body>
<div id="header"><a href="/soramegraph"><img src="logo.png" width="200px"/></a></div>
<table align="center">
	<tbody  >
		<tr>
			<td>
			<form action="/soramegraph" method="get"><span class="label">キーワード：</span><input
				type="text" name="q" id="q" value="<%= q %>"/> <input id="submit" type="submit" value="<%= q.isEmpty() ? "" : "連続して" %>検索" /></form>
			</td>
		</tr>
		<tr>
			<td>
<% if (set.size() == 0) {%>
			<div id="desc" class="desc">Twitter検索の結果が<span class="warn">0件</span>でした。キーワードを変更するか、時間をおいて試してみてください。</div>
<% } else {%>
			<div id="desc" class="desc">矢印をクリックするとTweetを表示します。丸をクリックするとキーワードで検索します。<br/>
			<%= q.isEmpty() ? "" : "検索したキーワードを入力欄に残したままもう一度検索ボタンを押すとグラフを連続して検索します。" %></div>
<% }%>
			</td>
		</tr>
	</tbody>
</table>
<div id="cytoscapeweb">ここにもうすぐ表示されると思います。なにも表示されない場合はキーワードを変えてみてください。</div>
<div id="cytoscapeweb-logo">
</div>
<div id="footer">
&copy;2010 <a href="http://www.twitter.com/aoda">@aoda</a>
|
<a href="http://cytoscapeweb.cytoscape.org/">
<img src="http://cytoscapeweb.cytoscape.org/img/logos/cw_s.png" alt="Cytoscape Web"/>
</a>
<a href="http://twitter4j.org/">
<img src="powered-by-twitter4j-138x30.png" border="0" width="138" height="30">
</a>
|<a href="http://aaatxt.blog57.fc2.com/blog-entry-66.html">
Soramegraph について
</a>

</div>
</body>
</html>