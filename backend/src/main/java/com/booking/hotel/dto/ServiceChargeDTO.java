package com.booking.hotel.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.DecimalMin;

import java.math.BigDecimal;

public class ServiceChargeDTO {

    @NotBlank(message = "Service name is required")
    private String name;

    @NotNull(message = "Service amount is required")
    @DecimalMin(value = "0.0", message = "Service amount must be non-negative")
    private BigDecimal amount;

    // Default constructor
    public ServiceChargeDTO() {
    }

    // Constructor with parameters
    public ServiceChargeDTO(String name, BigDecimal amount) {
        this.name = name;
        this.amount = amount;
    }

    // Getters and setters
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    @Override
    public String toString() {
        return "ServiceChargeDTO{" +
                "name='" + name + '\'' +
                ", amount=" + amount +
                '}';
    }
}