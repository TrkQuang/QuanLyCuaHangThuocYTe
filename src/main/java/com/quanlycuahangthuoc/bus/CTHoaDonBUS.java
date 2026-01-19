package com.quanlycuahangthuoc.bus;

import java.util.ArrayList;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.quanlycuahangthuoc.dao.CTHoaDonDAO;
import com.quanlycuahangthuoc.dao.HoaDonDAO;
import com.quanlycuahangthuoc.dao.ThuocDAO;
import com.quanlycuahangthuoc.dto.CTHoaDonDTO;
import com.quanlycuahangthuoc.dto.HoaDonDTO;

@Service
public class CTHoaDonBUS {
    @Autowired
    private CTHoaDonDAO cthoadonDAO;

    @Autowired
    private HoaDonDAO hoaDonDAO;

    @Autowired
    private ThuocDAO thuocDAO;

    public boolean themCTHoaDon(CTHoaDonDTO ct, HoaDonDTO hd, float giaBan){

        if(!hd.getTrangThai().equals("CHOXACNHAN"))
            throw new RuntimeException("Chỉ thêm được chi tiết khi hóa đơn chưa được xác nhận");

        // Trừ trong kho ra 
        boolean trukho = thuocDAO.CongSoLuongTon(ct.getMaThuoc(), -ct.getSoLuong());
        if(!trukho)
            throw new RuntimeException("Trong kho không đủ sản phẩm để bán");

        // Lưu chi tiết vô
        boolean ok = cthoadonDAO.insertCTHoaDon(ct);
        if(!ok)
            throw new RuntimeException("Không thêm được chi tiết hóa đơn");

        // Cộng tiền hóa đơn lên
        hd.setTongTien(hd.getTongTien() + ct.getSoLuong() * giaBan);
        hoaDonDAO.updateHoaDon(hd);

        return true;
    }
    public ArrayList<CTHoaDonDTO> getCTHoaDonTheoHoaDon(String maHoaDon){
        return cthoadonDAO.getCTHoaDonByMaHoaDon(maHoaDon);
    }
}
