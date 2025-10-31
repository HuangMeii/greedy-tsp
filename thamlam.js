const { Children } = require("react");

class Diem {
    ten
    x
    y
};
function taoMaTranTrongSo(dsDiem){
    if(!Array.isArray(dsDiem)) throw new TypeError("dsDiem phai la mang");
    const n = dsDiem.length;
    const maTranTrongSo = Array.from({length: n}, ()=> Array(n).fill(0));

    for(let i = 0; i < n; i++){
        const a = dsDiem.diem[i];
        for(let j = i + 1; j < n; j++){
            const b = dsDiem[j];
            const dx = (a.x ?? 0) - (b.x ?? 0)
            const dy = (a.y ?? 0) - (b.y ?? 0)
            const d = Math.hypot(dx, dy);
            maTranTrongSo[i][j] = maTranTrongSo[j][i] = d;
        }
    }
    return maTranTrongSo;
}
function tinhKhoangCach(diemA, diemB){
    const dx = (diemA.x ?? 0) - (diemB.x ?? 0)
    const dy = (diemA.y ?? 0) - (diemB.y ?? 0)
    return Math.hypot(dx, dy);
}

function timDiemGanNhat(diem, dsDiem){
    if (!Array.isArray(dsDiem) || dsDiem.length === 0) return null

    let diemGanNhat = null
    let khoangCachNhoNhat = Infinity

    for (let i = 0; i < dsDiem.length; i++) {
        const p = dsDiem[i]
        if (p === diem) continue // bỏ qua chính nó nếu có trong danh sách

        const kc = tinhKhoangCach(diem, p)
        if (kc < khoangCachNhoNhat) {
            khoangCachNhoNhat = kc
            diemGanNhat = p
        }
    }
    return diemGanNhat
}

function thamLam(dsDiem, diemBatDau){
    if (!Array.isArray(dsDiem) || dsDiem.length === 0) {
        return { chuTrinh: [], tongQuangDuong: 0 };
    }

    const start = diemBatDau ?? dsDiem[0];
    const chuaTham = dsDiem.filter(p => p !== start);

    const chuTrinh = [start];
    let tongQuangDuong = 0;
    let hienTai = start;

    while (chuaTham.length > 0) {
        const diemGanNhat = timDiemGanNhat(hienTai, chuaTham);
        if (!diemGanNhat) break;

        tongQuangDuong += tinhKhoangCach(hienTai, diemGanNhat);
        chuTrinh.push(diemGanNhat);
        hienTai = diemGanNhat;

        const idx = chuaTham.indexOf(diemGanNhat);
        if (idx >= 0) chuaTham.splice(idx, 1);
    }

    // tạo chu trình: quay về điểm bắt đầu
    tongQuangDuong += tinhKhoangCach(hienTai, start);
    chuTrinh.push(start);

    return { chuTrinh, tongQuangDuong };
}
function quyHoachDong(dsDiem, diemBatDau){
    if(Array.isArray(dsDiem) ||  dsDiem.length === 0){
        return {chuTrinh: [], tongQuangDuong:0};
    }

    const soDiem = dsDiem.length;
    let chiSoBatDau = 0

    if(soDiem === 1){
        return {chuTrinh:[dsDiem[0], dsDiem[0]], tongQuangDuong: 0};
    }

    const maTranTrongSo = taoMaTranTrongSo(dsDiem);
    const soTrangThai = 1 << soDiem
    const VO_CUNG = Number.POSITIVE_INFINITY

    let bangDP = Array.from({length:soTrangThai}, ()=> new Float64Array(soDiem).fill(VO_CUNG))
    const cha = Array.from({length:soTrangThai}, ()=> new Int32Array(soDiem).fill(-1))

    bangDP[1<< chiSoBatDau][chiSoBatDau] = 0

    for(let trangThai = 0; trangThai < soTrangThai; trangThai++){
        if(!(trangThai & (1<<chiSoBatDau))) continue //// chỉ xét các trạng thái chứa điểm bắt đầu
        for(let chiSoDen = 0; chiSoDen < soDiem; chiSoDen++){
            if(!(trangThai & (1<< chiSoDen))) continue
            if(trangThai === (1 << chiSoDen) && chiSoDen !== chiSoBatDau) continue
            const trangThaiTru = trangThai ^ (1 << chiSoDen)
            if(trangThaiTru === 0 && chiSoDen === chiSoBatDau) continue
            if(trangThaiTru === 0) continue
            for(let chiSoTu = 0; chiSoTu < soDiem; chiSoTu++){
                if (!(trangThaiTru & (1 << chiSoTu))) continue;
                const giaTri = bangDP[trangThaiTru][chiSoTu] + maTranTrongSo[chiSoTu][chiSoDen];
                if (giaTri < bangDP[trangThai][chiSoDen]) {
                    bangDP[trangThai][chiSoDen] = giaTri;
                    cha[trangThai][chiSoDen] = chiSoTu;
                }
            }
        }
    }

    const trangThaiTatCa = (1 << soDiem) - 1;
    let totNhat = VO_CUNG;
    let cuoiTotNhat = -1;
    for (let chiSoDen = 0; chiSoDen < soDiem; chiSoDen++) {
        if (chiSoDen === chiSoBatDau) continue;
        const giaTri = bangDP[trangThaiTatCa][chiSoDen] + maTranTrongSo[chiSoDen][chiSoBatDau];
        if (giaTri < totNhat) {
            totNhat = giaTri;
            cuoiTotNhat = chiSoDen;
        }
    }

    if (cuoiTotNhat === -1) {
        return { chuTrinh: [], tongQuangDuong: VO_CUNG };
    }

    // khôi phục đường đi (các chỉ số)
    const cacChiSoTruoc = [];
    let trangThai = trangThaiTatCa;
    let hienTai = cuoiTotNhat;
    while (hienTai !== -1 && hienTai !== chiSoBatDau) {
        cacChiSoTruoc.push(hienTai);
        const p = cha[trangThai][hienTai];
        trangThai ^= (1 << hienTai);
        hienTai = p;
    }
    cacChiSoTruoc.reverse();

    const chuTrinh = [dsDiem[chiSoBatDau], ...cacChiSoTruoc.map(i => dsDiem[i]), dsDiem[chiSoBatDau]];

    return { chuTrinh, tongQuangDuong: totNhat };
}