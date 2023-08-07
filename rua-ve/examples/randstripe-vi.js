// Vẽ vài nét tô mầu ngẫu nhiên

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

function thực_hiện(số_lượng) {
   while (số_lượng-- > 0) {
      nhảy(ngẫu_nhiên(-150, 150), ngẫu_nhiên(-150, 150));
      mầu(
         ngẫu_nhiên(0,255),
         ngẫu_nhiên(0,255),
         ngẫu_nhiên(0,255),
         Math.random()
      );
      góc(ngẫu_nhiên(0,180));
      rộng(ngẫu_nhiên(1,10));
      tiến(ngẫu_nhiên(10, 30));
   }
}

function trình_diễn(số_lượng) {
   ẩn_rùa();
   thực_hiện(số_lượng);
}

trình_diễn(20);