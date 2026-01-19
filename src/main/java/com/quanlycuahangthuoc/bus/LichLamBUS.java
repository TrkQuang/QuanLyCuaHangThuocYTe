package com.quanlycuahangthuoc.bus;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.quanlycuahangthuoc.dao.LichLamDAO;
import com.quanlycuahangthuoc.dto.LichLamDTO;

@Service
public class LichLamBUS {
    @Autowired
    private LichLamDAO lichlamDAO;

    public boolean ThemLichLam(LichLamDTO ll) {

        if (ll.getMaLich().isEmpty() || ll.getMaNhanVien().isEmpty())
            throw new RuntimeException("Ma lich va ma nhan vien khong duoc rong");

        if (ll.getNgayLam().isEmpty() || ll.getGioBatDau().isEmpty() || ll.getGioKetThuc().isEmpty())
            throw new RuntimeException("Ngay lam, gio bat dau, gio ket thuc khong duoc rong");

        // Gio bat dau < gio ket thuc
        if (ll.getGioBatDau().compareTo(ll.getGioKetThuc()) >= 0)
            throw new RuntimeException("Gio bat dau phai nho hon gio ket thuc");

        return lichlamDAO.insertLichLam(ll);
    }

    public boolean SuaLichLam(LichLamDTO ll) {
        if(ll.getMaLich().isEmpty()) throw new RuntimeException("Mã lịch làm ko được rỗng");

        if (ll.getNgayLam().isEmpty() || ll.getGioBatDau().isEmpty() || ll.getGioKetThuc().isEmpty())
            throw new RuntimeException("Ngày làm, giờ bắt đầu, giờ kết thúc ko được rỗng");
        // Gio bat dau < gio ket thuc
        if (ll.getGioBatDau().compareTo(ll.getGioKetThuc()) >= 0)
            throw new RuntimeException("Giờ bắt đầu phải nhỏ hơn giờ kết thúc");

        return lichlamDAO.updateLichLam(ll);
    }

    public boolean XoaLichlam(String maLL){
        return lichlamDAO.deleteLichLam(maLL);
    }
}
