package java.bus;

import java.dao.KhachHangDAO;
import java.dto.KhachHangDTO;
import java.util.ArrayList;

public class KhachHangBUS {
    private KhachHangDAO khachHangDAO = new KhachHangDAO();
    private ArrayList<KhachHangDTO> dskh;

    public KhachHangBUS() {
        dskh = khachHangDAO.getAllKhachHang();
    }

    public void loadData() {
        dskh = khachHangDAO.getAllKhachHang();
    }
    
    public ArrayList<KhachHangDTO> getAllKhachHang() {
        return dskh;
    }

    public boolean ThemKhachHang(KhachHangDTO kh) {
        if(kh.getMaKhachHang().isEmpty()) return false;
        if(kh.getMaTaiKhoan().isEmpty()) return false;
        if(kh.getTen().isEmpty()) return false;
        if(kh.getHo().isEmpty()) return false;
        if(kh.getSDT().isEmpty()) return false;
        if(kh.getDiaChi().isEmpty()) return false;
        if(kh.getNgaySinh().isEmpty()) return false;

        boolean ok = khachHangDAO.insertKhachHang(kh);
        if (ok) dskh.add(kh);

        return ok;
    }

    public boolean CapNhatKhachHang(KhachHangDTO kh) {
        if (kh.getMaKhachHang().isEmpty()) return false;
        boolean check = khachHangDAO.updateKhachHang(kh);
        if(check) {
            for(int i = 0; i<dskh.size(); i++) {
                if(dskh.get(i).getMaKhachHang().equalsIgnoreCase(kh.getMaKhachHang())) {
                    dskh.set(i, kh);
                    break;
                }
            }
        }
        return check;
    }

    public boolean XoaKhachHang(String maKH) {
        if (maKH.isEmpty()) return false;
        boolean check = khachHangDAO.deleteKhachHang(maKH);
        if (check) {
            for(int i = 0;i < dskh.size(); i++) {
                if(dskh.get(i).getMaKhachHang().equals(maKH)) {
                    dskh.remove(i);
                }
            }
        }
        return check;
    }
}
