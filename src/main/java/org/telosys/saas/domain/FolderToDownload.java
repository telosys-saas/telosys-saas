package org.telosys.saas.domain;

import java.util.Map;

public class FolderToDownload{

    Boolean generatedFiles;
    Boolean telosysFolder;

    public FolderToDownload() {
    }

    public FolderToDownload(Map<String, Object> mapFolderToDownload) {
        this.generatedFiles = (Boolean) mapFolderToDownload.get("generatedFiles");
        this.telosysFolder = (Boolean) mapFolderToDownload.get("telosysFolder");
    }

    public Boolean getGeneratedFiles() {
        return generatedFiles;
    }

    public void setGeneratedFiles(Boolean generatedFiles) {
        this.generatedFiles = generatedFiles;
    }

    public Boolean getTelosysFolder() {
        return telosysFolder;
    }

    public void setTelosysFolder(Boolean telosysFolder) {
        this.telosysFolder = telosysFolder;
    }
}

