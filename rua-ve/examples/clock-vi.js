khởi_động_lại(); 

// Vẽ các vạch dấu xung quang viền đồng hồ
function các_vạch(bán_kính) {
   const độ_dài_vạch = 7;
   const khoảng_trống = bán_kính - độ_dài_vạch;
   mầu(0,0,255,0.5);
   rộng(1);
   for (let theta = 0; theta < 360; theta += 6) {
      // bỏ qua các vị trí được vẽ số
      if (theta % 30 == 0) continue;
      nâng_bút();
      nhảy(0,0);
      góc(theta);
      tiến(khoảng_trống);
      đặt_bút();
      tiến(độ_dài_vạch);
   }
}

/**
 * Tạo 1 dãy số trong khoảng [start, end).
 * @param {number} bắt_đầu
 * @param {number} kết_thúc
 */
const khoảng = function*(bắt_đầu, kết_thúc, bước=1) {
   for (let i = +bắt_đầu; i < +kết_thúc; i += +bước){
      yield i;
   }
};

function đường_tròn(x, y, w, bán_kính, các_mặt) {
   const theta = 360/các_mặt;
   const độ_dài_mặt = 2 * bán_kính * Math.sin(độ_thành_rad(theta/2));
   nâng_bút();
   nhảy(x,y);
   tiến(bán_kính);
   đặt_bút();
   trái(90);
   tiến(độ_dài_mặt/2);
   phải(180);
   đặt_bút();
   mầu(0, 255, 0, 0.5);
   rộng(w);
   while (các_mặt-- > 0) {
      tiến(độ_dài_mặt);
      phải(theta);
   }
}

// vẽ số chỉ giờ trên mặt đồng hồ
function các_số(x, y, bán_kính) {
   nâng_bút();
   setFont('20px sans-serif');
   for (const giờ of khoảng(1, 13)) {
      nhảy(x,y);
      góc(giờ * 30);
      tiến(bán_kính);
      viết(giờ);
   }
   đặt_bút();
}

// vẽ 1 kim đồng hồ
function kim(theta, w, độ_dài, m) {
   const kích_thước_bước = 5;
   const delta_chiều_rộng = w / (độ_dài / kích_thước_bước);
   nhảy(0, 0);
   góc(theta);
   mầu(m.r, m.g, m.b, m.a);
   for (let bước = 0; bước < độ_dài; bước += kích_thước_bước) {
      rộng(w);
      tiến(kích_thước_bước);
      w -= delta_chiều_rộng;
   }
}

// vẽ tất cả các kim
function các_kim(giờ, phút, giây) {
   // vẽ kim giây
   kim(giây * 6, 6, 100, {r: 255, g: 0, b: 0, a: 0.5 });
   // vẽ kim phút
   const
      phút_sang_giây = phút * 60,
      phút_và_giây = phút_sang_giây + giây;
   kim(phút_và_giây * 0.1, 10, 100, {r: 0, g: 255, b: 0, a: 0.5 });
   // vẽ kim giờ
   const
      giờ_sang_giây = giờ % 12 * 3600,
      giờ_và_phút_và_giây = giờ_sang_giây + phút_và_giây;
   kim(giờ_và_phút_và_giây * 360 / 43200, 10, 60, {r: 0, g: 0, b: 255, a: 0.5 });
}

// làm mới toàn bộ đồng hồ
function đồng_hồ() {
   xóa();
   các_số(0, 0, 115);
   đường_tròn(0, 0, 2, 130, 50);
   các_vạch(130);
   const d = new Date();
   các_kim(d.getHours(), d.getMinutes(), d.getSeconds());
}

function thực_hiện() {
   ẩn_rùa();
   
   // Làm mới đồng hồ sau mỗi giây
   đặt_chu_kỳ(đồng_hồ, 1000);
}

thực_hiện();