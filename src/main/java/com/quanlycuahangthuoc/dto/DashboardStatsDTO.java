package com.quanlycuahangthuoc.dto;

public class DashboardStatsDTO {

  private int totalMedicines;
  private int totalInvoices;
  private double totalRevenue;
  private int totalCustomers;
  private int totalEmployees;

  public int getTotalMedicines() {
    return totalMedicines;
  }

  public void setTotalMedicines(int totalMedicines) {
    this.totalMedicines = totalMedicines;
  }

  public int getTotalInvoices() {
    return totalInvoices;
  }

  public void setTotalInvoices(int totalInvoices) {
    this.totalInvoices = totalInvoices;
  }

  public double getTotalRevenue() {
    return totalRevenue;
  }

  public void setTotalRevenue(double totalRevenue) {
    this.totalRevenue = totalRevenue;
  }

  public int getTotalCustomers() {
    return totalCustomers;
  }

  public void setTotalCustomers(int totalCustomers) {
    this.totalCustomers = totalCustomers;
  }

  public int getTotalEmployees() {
    return totalEmployees;
  }

  public void setTotalEmployees(int totalEmployees) {
    this.totalEmployees = totalEmployees;
  }
}
