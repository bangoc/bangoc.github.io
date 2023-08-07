let tam_giác = `// Vẽ hình tam giác đều
phải(150);
tiến(150);
phải(120);
tiến(150);
phải(120);
tiến(150);
`;

let clock_vi = `khởi_động_lại(); 

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
`;
let bounce_vi = `khởi_động_lại();

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
`;
let randstripe_vi = `khởi_động_lại();
// Vẽ vài nét tô mầu ngẫu nhiên

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
`;
let sierpinski_vi = `// https://en.wikipedia.org/wiki/Sierpi%C5%84ski_curve

khởi_động_lại();

function bộ_phận(kích_thước, mức) {
   mức--;
   nửa_sierpi(kích_thước, mức);
   trái(45);
   tiến(kích_thước * Math.SQRT2);
   trái(45);
   nửa_sierpi(kích_thước, mức);
}

/** hàm hỗ trợ vẽ hình sierpinski */
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
 * Tạo 1 dãy số trong khoảng [start, end).
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
`;
let spiral_vi = `// Các hình xoắn ốc ngẫu nhiên

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
`;
const all_examples = new Map();
all_examples.set('đồng-hồ', clock_vi);
all_examples.set('mưa-hộp', bounce_vi);
all_examples.set('nét-ngẫu-nhiên', randstripe_vi);
all_examples.set('sierpinski', sierpinski_vi);
all_examples.set('xoắn-ốc', spiral_vi);
all_examples.set('tam-giác', tam_giác);
function set_example(evt, example_name) {
  const hộp_mã_nguồn = /**@type {HTMLInputElement}*/(document.getElementById('source-codes'));
  hộp_mã_nguồn.value = all_examples.get(example_name);
  hộp_mã_nguồn.dispatchEvent(new KeyboardEvent('keydown', {key: 'Home'}));
}