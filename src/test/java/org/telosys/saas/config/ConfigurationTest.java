package org.telosys.saas.config;

import static org.junit.Assert.assertEquals;

import java.util.Properties;

import org.junit.Test;

public class ConfigurationTest {
	
	@Test
	public void test1() {
		ConfigurationLoader configurationLoader = new ConfigurationLoader();
//		Properties properties = configurationLoader.loadProperties("src/test/resources/cfg.properties");
		Properties properties = configurationLoader.loadProperties();
		assertEquals("foo", properties.getProperty("dataRootPath"));
	}
	
//	@Test(expected=RuntimeException.class)
	@Test
	public void test2() {
		ConfigurationLoader configurationLoader = new ConfigurationLoader();
//		configurationLoader.loadProperties("src/test/resources/inex.properties");
		configurationLoader.loadProperties();
	}
	
	@Test
	public void test3() {
		ConfigurationLoader configurationLoader = new ConfigurationLoader();
//		Properties properties = configurationLoader.loadProperties("src/test/resources/cfg.properties");
		Properties properties = configurationLoader.loadProperties();
		assertEquals("foo", properties.getProperty("dataRootPath"));
	}

//	// @Test
//	public void test4() {
//		ConfigurationLoader configurationLoader = new ConfigurationLoader();
//		Configuration configuration = configurationLoader.loadConfiguration();
//		assertEquals("foo",  configuration.getDataRootPath() );
//		assertEquals("8282", configuration.getHttpPort() );
//	}
//
//	// @Test
//	public void test5() {
//		Configuration configuration = ConfigurationHolder.getConfiguration();
//		assertEquals("foo",  configuration.getDataRootPath() );
//		assertEquals("8282", configuration.getHttpPort() );
//	}
	
}
