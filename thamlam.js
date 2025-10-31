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
        const a = dsDiem[i];
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