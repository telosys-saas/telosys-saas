package org.telosys.saas.dao;

public class StorageDaoProvider {

	/**
	 * Returns an instance of StorageDao 
	 */
	public final static StorageDao getStorageDao() {
		return new FileStorageDao();
	}
	
}
