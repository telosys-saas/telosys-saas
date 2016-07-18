package junit.tests.env;

import java.io.File;

public class TestsEnv {

	public final static void initExternalConfiguration() {
		System.out.println("TESTS INIT : initExternalConfiguration() ");
		String tmpFolderPath = TestsEnv.getTmpExistingFolderFullPath("telosys-saas-fs");
		System.out.println("TESTS INIT : set property TELOSYS_ROOT = " + tmpFolderPath);
		System.setProperty( "TELOSYS_ROOT" , tmpFolderPath );
	}
	
	//-----------------------------------------------------------------------------------------
	// TEMPORARY FILES AND FOLDERS
	//-----------------------------------------------------------------------------------------
	private final static String TARGET_TESTS_TMP_DIR = "target/tests-tmp/" ;
	
	public final static String getTmpRootFolderFullPath() {
		return getTmpExistingFolderFullPath( "" ) ;
	}
	
	public static String getTmpFileFullPath(String fileName ) {
		File file = getTmpFile(fileName) ;
		return file.getAbsolutePath();
	}
	
	public static String getTmpFileOrFolderFullPath(String fileName ) {
		File file = getTmpFileOrFolder(fileName) ;
		return file.getAbsolutePath();
	}
	
	public static String getTmpExistingFileFullPath(String fileName ) {
		File file = getTmpExistingFile( fileName ); 
		return file.getAbsolutePath();
	}
	
	public static String getTmpExistingFolderFullPath(String folderName ) {
		File file = getTmpExistingFolder( folderName ); 
		return file.getAbsolutePath();
	}
	
	/**
	 * Return an existing temporary folder (the folder is created if necessary)
	 * @param folderName
	 * @return
	 */
	public static File getTmpExistingFolder(String folderName ) {
		File folder = new File(TARGET_TESTS_TMP_DIR + folderName);
		if ( folder.exists() ) {
			if ( folder.isDirectory() ) {
				return folder ;
			}
			else {
				throw new RuntimeException("'"+ folder.getName() + "' is not a folder");
			}
		}
		else {
			if ( folder.mkdirs() ) {
				return folder ;
			}
			else {
				throw new RuntimeException("Cannot create folder '"+ folder.getName() + "' ");
			}
		}
	}
	
	public static File getTmpExistingFile(String fileName ) {
		File file = new File(TARGET_TESTS_TMP_DIR + fileName);
		if ( file.exists() ) {
			if ( file.isFile() ) {
				return file ;
			}
			else {
				throw new RuntimeException("'"+ file.getName() + "' exists and is not a file");
			}
		}
		else {
			throw new RuntimeException("'"+ file.getName() + "' not found");
		}
	}
	
	public static File getTmpFile(String fileName ) {
		File file = new File(TARGET_TESTS_TMP_DIR + fileName);
		if ( file.exists() && ! file.isFile()) {
				throw new RuntimeException("'"+ file.getName() + "' exists and is not a file");
		}
		return file ;
	}
	
	public static File getTmpFileOrFolder(String fileName ) {
		File file = new File(TARGET_TESTS_TMP_DIR + fileName);
		return file ;
	}

}
