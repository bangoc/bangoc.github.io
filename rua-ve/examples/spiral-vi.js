// Các hình xoắn ốc ngẫu nhiên

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

function xoắn_ốc(số_bước, góc) {
   const tăng_chiều_rộng = 5 / số_bước;
   let r = 0.1;
   while (số_bước-- > 0) {
      rộng(r);
      tiến(ngẫu_nhiên(1,10));
      phải(góc--);
      r += tăng_chiều_rộng;
   }
}

function thực_thi(số_lượng) {
   while (số_lượng-- > 0) {
      mầu(
         ngẫu_nhiên(0,255),
         ngẫu_nhiên(0,255),
         ngẫu_nhiên(0,255),
         Math.random()
      );
      nhảy(ngẫu_nhiên(-150, 150), ngẫu_nhiên(-150, 150));
      góc(ngẫu_nhiên(0,360));
      xoắn_ốc(ngẫu_nhiên(100, 1000), ngẫu_nhiên(5, 90));
   }
}

function trình_diễn(số_lượng) {
   ẩn_rùa();
   thực_thi(số_lượng);
}

trình_diễn(10);