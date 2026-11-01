package com.shopsphere.common.exception;

public class ShopSphereException extends RuntimeException {
    public ShopSphereException(String message) {
        super(message);
    }

    public ShopSphereException(String message, Throwable cause) {
        super(message, cause);
    }
}
