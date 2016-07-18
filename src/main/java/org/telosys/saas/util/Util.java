package org.telosys.saas.util;

import java.util.ArrayList;
import java.util.List;

public final class Util {

	public static boolean equalsAndNotEmpty(String str1, String str2) {
		if(isEmpty(str1) || isEmpty(str2)) {
			return false;
		}
		return str1.trim().equals(str2.trim());
	}
	
	public static boolean isEmpty(String str) {
		return str == null || "".equals(str.trim());
	}
	
	public static String[] splitWithNullIfEmpty(String str, char separator) {
		if(isEmpty(str)) {
			return new String[0];
		}
		List<String> splitteds = new ArrayList<String>();
		int lastPos = 0;
		int pos = -1;
		while((pos = str.indexOf(separator, lastPos)) != -1) {
			if(pos == lastPos) {
				splitteds.add(null);
			} else {
				String substring = str.substring(lastPos, pos);
				splitteds.add(substring);
			}
			lastPos = pos + 1;
		}
		return splitteds.toArray(new String[] {});
	}
	
}
