package com.quanlycuahangthuoc.dto.requests;

import com.quanlycuahangthuoc.dto.CTPhieuNhapDTO;
import com.quanlycuahangthuoc.dto.PhieuNhapDTO;
import java.util.ArrayList;
import java.util.List;

public class CreatePhieuNhapRequest {

  private PhieuNhapDTO phieuNhap;
  private List<CTPhieuNhapDTO> chiTiet;

  public PhieuNhapDTO getPhieuNhap() {
    return phieuNhap;
  }

  public void setPhieuNhap(PhieuNhapDTO phieuNhap) {
    this.phieuNhap = phieuNhap;
  }

  public List<CTPhieuNhapDTO> getChiTiet() {
    return chiTiet == null ? new ArrayList<>() : chiTiet;
  }

  public void setChiTiet(List<CTPhieuNhapDTO> chiTiet) {
    this.chiTiet = chiTiet;
  }
}
