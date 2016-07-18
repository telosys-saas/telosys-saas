package org.telosys.saas.util;

import org.junit.Assert;
import org.junit.Test;

public class FileUtilTest {

	@Test
	public void testJoin1() {
		String result = FileUtil.join();
		Assert.assertEquals("", result);
	}

	@Test
	public void testJoin2() {
		String result = FileUtil.join("dir1");
		Assert.assertEquals("dir1", result);
	}

	@Test
	public void testJoin3() {
		String result = FileUtil.join("/dir1");
		Assert.assertEquals("/dir1", result);
	}

	@Test
	public void testJoin4() {
		String result = FileUtil.join("dir1/");
		Assert.assertEquals("dir1", result);
	}

	@Test
	public void testJoin5() {
		String result = FileUtil.join("/dir1/");
		Assert.assertEquals("/dir1", result);
	}

	@Test
	public void testJoin6() {
		String result = FileUtil.join("dir1", "dir2");
		Assert.assertEquals("dir1/dir2", result);
	}

	@Test
	public void testJoin7() {
		String result = FileUtil.join("/dir1", "/dir2");
		Assert.assertEquals("/dir1/dir2", result);
	}

	@Test
	public void testJoin8() {
		String result = FileUtil.join("dir1/", "dir2/");
		Assert.assertEquals("dir1/dir2", result);
	}

	@Test
	public void testJoin9() {
		String result = FileUtil.join("/dir1/", "/dir2/");
		Assert.assertEquals("/dir1/dir2", result);
	}

	@Test
	public void testJoin10() {
		String result = FileUtil.join("dir1", "dir2", "dir3");
		Assert.assertEquals("dir1/dir2/dir3", result);
	}

	@Test
	public void testJoin11() {
		String result = FileUtil.join("/dir1", "/dir2", "/dir3");
		Assert.assertEquals("/dir1/dir2/dir3", result);
	}

	@Test
	public void testJoin12() {
		String result = FileUtil.join("dir1/", "dir2/", "dir3/");
		Assert.assertEquals("dir1/dir2/dir3", result);
	}

	@Test
	public void testJoin13() {
		String result = FileUtil.join("/dir1/", "/dir2/", "/dir3/");
		Assert.assertEquals("/dir1/dir2/dir3", result);
	}
	
}
