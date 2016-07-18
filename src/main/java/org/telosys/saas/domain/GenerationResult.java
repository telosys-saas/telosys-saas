package org.telosys.saas.domain;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

public class GenerationResult implements Serializable {

	private static final long serialVersionUID = 1737445652512257660L;

	private int numberOfResourcesCopied ;
	private int numberOfFilesGenerated ;
	private int numberOfGenerationErrors ;
	private List<GenerationErrorResult> errors = new ArrayList<GenerationErrorResult>();
	
	public int getNumberOfResourcesCopied() {
		return numberOfResourcesCopied;
	}
	public void setNumberOfResourcesCopied(int numberOfResourcesCopied) {
		this.numberOfResourcesCopied = numberOfResourcesCopied;
	}
	public int getNumberOfFilesGenerated() {
		return numberOfFilesGenerated;
	}
	public void setNumberOfFilesGenerated(int numberOfFilesGenerated) {
		this.numberOfFilesGenerated = numberOfFilesGenerated;
	}
	public int getNumberOfGenerationErrors() {
		return numberOfGenerationErrors;
	}
	public void setNumberOfGenerationErrors(int numberOfGenerationErrors) {
		this.numberOfGenerationErrors = numberOfGenerationErrors;
	}
	public List<GenerationErrorResult> getErrors() {
		return errors;
	}
	public void setErrors(List<GenerationErrorResult> errors) {
		this.errors = errors;
	}
	
}
