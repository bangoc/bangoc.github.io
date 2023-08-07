// https://en.wikipedia.org/wiki/Sierpi%C5%84ski_curve

khởi_động_lại();

function bộ_phận(kích_thước, mức) {
   mức--;
   nửa_sierpi(kích_thước, mức);
   trái(45);
   tiến(kích_thước * Math.SQRT2);
   trái(45);
   nửa_sierpi(kích_thước, mức);
}

/** hàm hỗ trợ vẽ hình `sierpinski` */
function nửa_sierpi(kích_thước, độ_sâu) {
   if (độ_sâu <= 0) {
      tiến(kích_thước);
      return;
   }
   bộ_phận(kích_thước, độ_sâu);
   phải(90);
   tiến(kích_thước);
   phải(90);
   bộ_phận(kích_thước, độ_sâu);
}

/**
 * Tạo 1 dãy số trong khoảng `[start, end)`.
 * @param {number} bắt_đầu
 * @param {number} kết_thúc
 */
const khoảng = function*(bắt_đầu, kết_thúc, bước=1) {
   for (let i = +bắt_đầu; i < +kết_thúc; i += +bước){
      yield i;
   }
};

/** vẽ 1 đường Sierpinski với độ sâu tùy ý */
function sierpinski(kích_thước, độ_sâu) {
   for (const _ of khoảng(0, 2)) {
      nửa_sierpi(kích_thước, độ_sâu);
      phải(90);
      tiến(kích_thước);
      phải(90);
   }
}

function trình_diễn() {
   ẩn_rùa();
   nhảy(0, -180);
   sierpinski(3,5);
}

trình_diễn();