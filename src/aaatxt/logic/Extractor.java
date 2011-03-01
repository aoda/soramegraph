package aaatxt.logic;

import java.lang.Character.UnicodeBlock;

import aaatxt.model.Edge;

public class Extractor {

	public static Edge getEdge(String s) {

		int nisorame = s.indexOf("に空目");
		if (nisorame == -1) {
			nisorame = s.indexOf("と空目");
		}
		// "を　に"
		// 「に空目」を検索その後に「を」を探す。
		int wo = -1;
		while (s.indexOf("を", wo + 1) != -1 && wo < nisorame) {
			wo = s.indexOf("を", wo + 1);
//			System.out.println(s + wo);
		}
		if (wo != -1 && wo < nisorame) {
			String wave2 = s.substring(wo + 1, nisorame);
			double[] cor = getCorelation(getWave(s.substring(0, wo)), getWave(wave2));
			String wave1 = s.substring(highest(cor), wo);
			if(Math.abs(wave1.length() - wave2.length()) < 3) {
				return new Edge(Util.HTMLEscape(wave1), Util.HTMLEscape(wave2));				
			}
			System.out.println("*1* " + wave1 + ">>>" + wave2 + "<<< " + s);
			return null;
		}
		
		// "が　に"
		// 「に空目」を検索その後に「が」を探す。
		int ga = -1;
		while (s.indexOf("が", ga + 1) != -1 && ga < nisorame) {
			ga = s.indexOf("が", ga + 1);
//			System.out.println(s + "ga");
		}
		if (ga != -1 && ga < nisorame) {
			String wave2 = s.substring(ga + 1, nisorame);			
			double[] cor = getCorelation(getWave(s.substring(0, ga)), getWave(wave2));
			String wave1 = s.substring(highest(cor), ga);
			if(Math.abs(wave1.length() - wave2.length()) < 3) {
				return new Edge(Util.HTMLEscape(wave1), Util.HTMLEscape(wave2));				
			}
			System.out.println("*2* " + wave1 + ">>>" + wave2 + "<<< " + s);
			return null;
		}
		
		System.out.println("*3* wo:" + wo + " ga:" + ga + " nisorame:" + nisorame + " " + s);
		return null;
	}
	
	private static double cofO = 2.0 * Math.PI * 0.0; //その他
	private static double cofN = 2.0 * Math.PI * 0.05; //数字
	private static double cofA = 2.0 * Math.PI * 0.1; //ASCII
	private static double cofK = 2.0 * Math.PI * 0.4; //漢字
	private static double cofH = 2.0 * Math.PI * 0.8; //平仮名
	private static double cofC = 2.0 * Math.PI * 0.9; //カタカナ
	
//	private static double cofO = 0.1; //その他
//	private static double cofN = 0.3; //数字
//	private static double cofA = 0.5; //ASCII
//	private static double cofK = 0.7; //漢字
//	private static double cofH = 1.2; //平仮名
//	private static double cofC = 1.5; //カタカナ

	private static double a0 = 1.0;
	private static double a1 = 0.5;
	private static double a2 = 0.25;
	
	
	/**
	 * @param s
	 * @return
	 */
	private static double[] getWave(String s) {
		double[] wave = new double[s.length()];
		for (int i = 0; i < s.length(); i++) {
			if (UnicodeBlock.of(s.charAt(i)) == UnicodeBlock.NUMBER_FORMS) {
				wave[i] = cofN;
			} else if (UnicodeBlock.of(s.charAt(i)) == UnicodeBlock.BASIC_LATIN){
				wave[i] = cofA;
			} else if (UnicodeBlock.of(s.charAt(i)) == UnicodeBlock.HIRAGANA) {
				wave[i] = cofH;
			} else if (UnicodeBlock.of(s.charAt(i)) == UnicodeBlock.KATAKANA){
				wave[i] = cofK;
			} else if (UnicodeBlock.of(s.charAt(i)) == UnicodeBlock.CJK_UNIFIED_IDEOGRAPHS){
				wave[i] = cofC;
			} else {
				wave[i] = cofO;
			}
		}
		return wave;
	}
	
	private static double[] getCorelation(double[] wave1, double[] wave2) {
		double[] cor = new double[wave1.length];
		for (int i = 0; i < wave1.length; i++) {
			
			for (int j = 0; j < wave2.length; j ++) {
				cor[i] += a0 * distance(wave1, wave2, cor, i, j, 0);
				cor[i] += a1 * distance(wave1, wave2, cor, i, j, 1);
				cor[i] += a2 * distance(wave1, wave2, cor, i, j, 2);
///				cor[i] += a0 * i + j < wave1.length ? Math.cos(wave1[(i + j) % wave1.length]) * Math.cos(wave2[j % wave2.length]) : 0.0;
///				cor[i] += a1 * i + j < wave1.length && j + 1 < wave2.length ? Math.cos(wave1[(i + j) % wave1.length]) * Math.cos(wave2[(j + 1) % wave2.length]): 0.0;
///				cor[i] += a2 * i + j < wave1.length && j + 2 < wave2.length ? Math.cos(wave1[(i + j) % wave1.length]) * Math.cos(wave2[(j + 2) % wave2.length]): 0.0;
			}
		}
		return cor;
	}
	
	private static double distance(double[] wave1, double[] wave2,
			double[] cor, int i, int j, int delta) {
		return Math.cos(wave1[(i + j) % wave1.length]) * Math.cos(wave2[(j + delta) % wave2.length])
		 + Math.sin(wave1[(i + j) % wave1.length]) * Math.sin(wave2[(j + delta) % wave2.length]);
	}

//	private static double[] getCorelation(double[] wave1, double[] wave2) {
//		double[] cor = new double[wave1.length];
//		for (int i = 0; i < wave1.length; i++) {
//			
//			for (int j = 0; j < wave2.length; j ++) {
//				cor[i] += a0 * Math.pow((wave1[(i + j) % wave1.length] - wave2[j % wave2.length]), 2.0);
//				cor[i] += a1 * Math.pow((wave1[(i + j) % wave1.length] - wave2[(j + 1) % wave2.length]), 2.0);
//				cor[i] += a2 * Math.pow((wave1[(i + j) % wave1.length] - wave2[(j + 2) % wave2.length]), 2.0);
//			}
//		}
//		return cor;
//	}

	private static int lowest(double[] cor) {
		double min = Double.MAX_VALUE;
		int lowest = 0;
		for (int i = 0; i < cor.length; i++) {
			if (cor[i] < min) {
				min = cor[i];
				lowest = i;
			}
		}
		return lowest;
	}

	private static int highest(double[] cor) {
		double max = Double.MIN_VALUE;
		int highest = 0;
		for (int i = 0; i < cor.length; i++) {
			if (cor[i] > max) {
				max = cor[i];
				highest = i;
			}
		}
		return highest;
	}
	
	public static void main(String[] args) {
		//String s = "このたびは、DevFest 2010 Japan にご応募いただきまして、まことにありがとうございます。";
		String s2 = "「夕刊」を「タモリ」に空目した";
		//String s1 = "クルーグマンをグーグルマンに空目";
		Edge e = getEdge(s2);
		System.out.println(e.getStart() + ":" + e.getEnd());
	}
	
}
