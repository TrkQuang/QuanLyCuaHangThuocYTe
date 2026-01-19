package com.quanlycuahangthuoc.bus;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.quanlycuahangthuoc.dao.NhaCungCapDAO;
import com.quanlycuahangthuoc.dao.ThuocDAO;
import com.quanlycuahangthuoc.dto.*;

@Service
public class ThuocBUS {

    @Autowired
    private ThuocDAO thuocDAO;

    @Autowired
    private NhaCungCapDAO nhaCungCapDAO;


    public boolean themThuoc(ThuocDTO t){
        if(t.getMaThuoc().isEmpty() || t.getTenThuoc().isEmpty())
            throw new RuntimeException("Mã thuốc và tên thuốc không được rỗng");

        if(nhaCungCapDAO.getById(t.getMaNhaCungCap()) == null)
            throw new RuntimeException("Nhà cung cấp không tồn tại");

        return thuocDAO.insertThuoc(t);
    }

}
