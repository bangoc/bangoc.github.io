khởi_động_lại();

/**
 * Trả về 1 số nguyên trong khoảng
 * @param {số} cực_tiểu bao gồm cận dưới
 * @param {số} cực_đại bao gồm cận trên
 */
const ngẫu_nhiên = (cực_tiểu, cực_đại) => {
   cực_tiểu = +cực_tiểu;
   cực_đại = +cực_đại;

   return Math.floor(Math.random() * (cực_đại - cực_tiểu + 1) + cực_tiểu);
};

// Các hình chữ nhật nảy quả các cạnh của khung vẽ
const khởi_tạo_các_hạt = length => Array.from({ length }, () => ({
   x: ngẫu_nhiên(-150, 150),
   y: ngẫu_nhiên(-150, 150),

   gia_tốc_x: ngẫu_nhiên(-6, 6),
   gia_tốc_y: ngẫu_nhiên(-6, 6),

   kích_thước: ngẫu_nhiên(20, 300),
   chiều_rộng: ngẫu_nhiên(1, 40),

   r: ngẫu_nhiên(0, 255),
   g: ngẫu_nhiên(0, 255),
   b: ngẫu_nhiên(0, 255),
   a: Math.random()
}));

function mưa(các_hạt) {
   xóa();
   for (const h of các_hạt) {
      mầu(h.r,h.g,h.b,h.a);
      rộng(h.chiều_rộng);
      nhảy(h.x,h.y);
      if (h.y < -150 || h.y + h.kích_thước > 150 && h.gia_tốc_y > 0)
         h.gia_tốc_y *= -1;
      if (h.x - h.chiều_rộng/2 < -150 || h.x + h.chiều_rộng/2 > 150)
         h.gia_tốc_x *= -1;
      tiến(h.kích_thước);
      h.y += h.gia_tốc_y;
      h.x += h.gia_tốc_x;
   }
}

function trình_diễn(n) {
   // wrap(false);
   ẩn_rùa();
   đặt_chu_kỳ(() => mưa(khởi_tạo_các_hạt(n)), 100);
}

trình_diễn(10);