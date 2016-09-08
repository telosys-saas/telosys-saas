package org.telosys.saas.domain;

import java.io.Serializable;

public class ChangePasswordResult implements Serializable {

    private Boolean hasError = false;

    private String message;

    public ChangePasswordResult() {
    }

    public Boolean getHasError() {
        return hasError;
    }

    public void setHasError(Boolean hasError) {
        this.hasError = hasError;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
