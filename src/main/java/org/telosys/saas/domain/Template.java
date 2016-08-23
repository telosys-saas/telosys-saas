package org.telosys.saas.domain;

import org.telosys.tools.generator.target.TargetDefinition;

import java.io.Serializable;

public class Template implements Serializable {

    private String name;

    private String description;

    private String absoluteFilePath;

    private Boolean type;

    private Boolean isSelected;

    public Template(TargetDefinition targetDefinition) {
        this.name = targetDefinition.getTemplate();
        this.description = targetDefinition.getName();
        this.absoluteFilePath = targetDefinition.getFullFileName();
        this.type = targetDefinition.isOnce();
        this.isSelected = false;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getAbsoluteFilePath() {
        return absoluteFilePath;
    }

    public void setAbsoluteFilePath(String absoluteFilePath) {
        this.absoluteFilePath = absoluteFilePath;
    }

    public Boolean getType() {
        return type;
    }

    public void setType(Boolean type) {
        this.type = type;
    }

    public Boolean getSelected() {
        return isSelected;
    }

    public void setSelected(Boolean selected) {
        isSelected = selected;
    }
}
