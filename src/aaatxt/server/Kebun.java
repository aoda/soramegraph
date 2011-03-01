package aaatxt.server;

import java.io.IOException;
import java.net.MalformedURLException;
import java.net.URL;
import java.net.URLEncoder;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;
import javax.xml.xpath.XPath;
import javax.xml.xpath.XPathConstants;
import javax.xml.xpath.XPathExpression;
import javax.xml.xpath.XPathExpressionException;
import javax.xml.xpath.XPathFactory;

import org.w3c.dom.Document;
import org.w3c.dom.NodeList;
import org.xml.sax.SAXException;

import aaatxt.logic.SorameDatastoreQuery;
import aaatxt.model.Edge;

public class Kebun extends HttpServlet {


	private static final String YAHOOAPI_URL_APPID = Messages.getString("Kebun.0"); //$NON-NLS-1$


	@Override
	public void init() throws ServletException {
		super.init();
	}


	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException {
        StringBuffer sb2 = new StringBuffer();
		String nlpBase = YAHOOAPI_URL_APPID;
    	String src = req.getParameter("src"); //$NON-NLS-1$
    	if (src != null && src.trim().length() > 0) {
	        try {
	        	
	            // ドキュメントビルダーファクトリを生成
	            DocumentBuilderFactory dbfactory = DocumentBuilderFactory.newInstance();
	            // ドキュメントビルダーを生成
	            DocumentBuilder builder = dbfactory.newDocumentBuilder();
	            // パースを実行してDocumentオブジェクトを取得
	            XPathFactory factory = (XPathFactory) Class.forName("org.apache.xpath.jaxp.XPathFactoryImpl").newInstance(); //$NON-NLS-1$

		            URL url2 = new URL(nlpBase + URLEncoder.encode(src, "UTF-8")); //$NON-NLS-1$
		            // パースを実行してDocumentオブジェクトを取得
		            Document xtree2 = builder.parse(url2.openStream());
		            //XPathFactory factory = XPathFactory.newInstance();
		            // changed to the following line
		            //XPathFactory factory = new org.apache.xpath.jaxp.XPathFactoryImpl();
		            XPath xpath = factory.newXPath();
		            XPathExpression expr 
		             = xpath.compile("//ma_result/word_list/word/surface/text()"); //$NON-NLS-1$
		            Object result = expr.evaluate(xtree2, XPathConstants.NODESET);
		            NodeList nodes = (NodeList) result;
	    			SorameDatastoreQuery sdq = new SorameDatastoreQuery();
	                for (int j = 0; j < nodes.getLength(); j++) {
		            	String childWord = nodes.item(j).getNodeValue();
		            	if("特殊".equals(nodes.item(j).getParentNode().getNextSibling().getNextSibling().getTextContent())){ //$NON-NLS-1$
		            		sb2.append(childWord);
		            		continue;
		            	}
//		            	System.out.println(childWord); 
	    				List<Edge> l = sdq.searchEnd(childWord);
	    				if (l.size() == 0) {
	    					sb2.append(childWord);
	    				} else {
	    					sb2.append(l.get((int)(Math.random() * (double)l.size())).getStart());
	    				}
		            }

	        } catch (MalformedURLException e) {
	        	req.setAttribute("e", e); //$NON-NLS-1$
	    		req.getRequestDispatcher("/WEB-INF/jsp/error.jsp").forward(req, resp); //$NON-NLS-1$
	        } catch (IOException e) {
	        	req.setAttribute("e", e); //$NON-NLS-1$
	    		req.getRequestDispatcher("/WEB-INF/jsp/error.jsp").forward(req, resp); //$NON-NLS-1$
	        } catch (SAXException e) {
	        	req.setAttribute("e", e); //$NON-NLS-1$
	    		req.getRequestDispatcher("/WEB-INF/jsp/error.jsp").forward(req, resp); //$NON-NLS-1$
			} catch (ParserConfigurationException e) {
	        	req.setAttribute("e", e); //$NON-NLS-1$
	    		req.getRequestDispatcher("/WEB-INF/jsp/error.jsp").forward(req, resp); //$NON-NLS-1$
			} catch (XPathExpressionException e) {
	        	req.setAttribute("e", e); //$NON-NLS-1$
	    		req.getRequestDispatcher("/WEB-INF/jsp/error.jsp").forward(req, resp); //$NON-NLS-1$
			} catch (InstantiationException e) {
	        	req.setAttribute("e", e); //$NON-NLS-1$
	    		req.getRequestDispatcher("/WEB-INF/jsp/error.jsp").forward(req, resp); //$NON-NLS-1$
			} catch (IllegalAccessException e) {
	        	req.setAttribute("e", e); //$NON-NLS-1$
	    		req.getRequestDispatcher("/WEB-INF/jsp/error.jsp").forward(req, resp); //$NON-NLS-1$
			} catch (ClassNotFoundException e) {
	        	req.setAttribute("e", e); //$NON-NLS-1$
	    		req.getRequestDispatcher("/WEB-INF/jsp/error.jsp").forward(req, resp); //$NON-NLS-1$
			}
    	}
    	req.setAttribute("res", sb2.toString()); //$NON-NLS-1$
		req.getRequestDispatcher("/WEB-INF/jsp/kebunlidge.jsp").forward(req, resp); //$NON-NLS-1$
	}
}
