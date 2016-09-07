package org.telosys.saas.domain;

import org.telosys.tools.generator.target.TargetDefinition;

import java.io.Serializable;

public class Template implements Serializable {

    private String name;

    private String description;

    private String absoluteFilePath;

    private Boolean once;

    private Boolean selected;

    private String type = "template";

    public Template(){}

    public Template(TargetDefinition targetDefinition) {
        this.name = targetDefinition.getTemplate();
        this.description = targetDefinition.getName();
        this.absoluteFilePath = null;
        this.once = targetDefinition.isOnce();
        this.selected = false;
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

    public Boolean getOnce() {
        return once;
    }

    public void setOnce(Boolean once) {
        this.once = once;
    }

    public Boolean getSelected() {
        return selected;
    }

    public void setSelected(Boolean selected) {
        this.selected = selected;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }
}
