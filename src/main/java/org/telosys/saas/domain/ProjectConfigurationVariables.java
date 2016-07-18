package org.telosys.saas.domain;

import java.io.Serializable;

public class ProjectConfigurationVariables implements Serializable {

	private static final long serialVersionUID = -5764204285199246444L;
	
	private String ROOT_PKG = "";
	private String ENTITY_PKG = "";
	private String SRC = "";
	private String RES = "";
	private String TEST_SRC = "";
	private String TEST_RES = "";
	private String WEB = "";
	private String DOC = "";
	private String TMP = "";
	private String specificVariables = "{}";
	
	public String getROOT_PKG() {
		return ROOT_PKG;
	}
	public void setROOT_PKG(String rOOT_PKG) {
		ROOT_PKG = rOOT_PKG;
	}
	public String getENTITY_PKG() {
		return ENTITY_PKG;
	}
	public void setENTITY_PKG(String eNTITY_PKG) {
		ENTITY_PKG = eNTITY_PKG;
	}
	public String getSRC() {
		return SRC;
	}
	public void setSRC(String sRC) {
		SRC = sRC;
	}
	public String getRES() {
		return RES;
	}
	public void setRES(String rES) {
		RES = rES;
	}
	public String getTEST_SRC() {
		return TEST_SRC;
	}
	public void setTEST_SRC(String tEST_SRC) {
		TEST_SRC = tEST_SRC;
	}
	public String getTEST_RES() {
		return TEST_RES;
	}
	public void setTEST_RES(String tEST_RES) {
		TEST_RES = tEST_RES;
	}
	public String getWEB() {
		return WEB;
	}
	public void setWEB(String wEB) {
		WEB = wEB;
	}
	public String getDOC() {
		return DOC;
	}
	public void setDOC(String dOC) {
		DOC = dOC;
	}
	public String getTMP() {
		return TMP;
	}
	public void setTMP(String tMP) {
		TMP = tMP;
	}
	public String getSpecificVariables() {
		return specificVariables;
	}
	public void setSpecificVariables(String specificVariables) {
		this.specificVariables = specificVariables;
	}
	
	
}
