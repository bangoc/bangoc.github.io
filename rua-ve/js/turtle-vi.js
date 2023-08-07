'use strict';
/**
 * @typedef {số} Uint32
 */

// lấy tham chiếu của mỗi khung vẽ trong tài liệu
const _khung_vẽ_hình_ảnh = /**@type {HTMLCanvasElement}*/(document.getElementById('imagecanvas'));
const _ngữ_cảnh_hình_ảnh = /**@type {CanvasRenderingContext2D}*/(_khung_vẽ_hình_ảnh.getContext('2d'));

_ngữ_cảnh_hình_ảnh.textAlign = 'center';
_ngữ_cảnh_hình_ảnh.textBaseline = 'middle';

const _ngữ_cảnh_rùa = (() => {
   const _khung_vẽ_rùa = /**@type {HTMLCanvasElement}*/(document.getElementById('turtlecanvas'));
   return /**@type {CanvasRenderingContext2D}*/(_khung_vẽ_rùa.getContext('2d'));
})();

// rùa được đặt phía trước khi kết hợp
_ngữ_cảnh_rùa.globalCompositeOperation = 'destination-over';

/**
 * các tọa độ tương đối để vẽ hình rùa, được biểu diễn như
 * các danh sách của các cặp [x,y].
 * (các hình vẽ được mượn từ thư viện turtle.py của cpython)
 */
const _các_mẫu_rùa = Object.freeze(/**@type {const}*/({
   tam_giác: [[-5, 0], [5, 0], [0, 15]],
   rùa: [
      [0, 16], [-2, 14], [-1, 10], [-4, 7], [-7, 9],
      [-9, 8], [-6, 5], [-7, 1], [-5, -3], [-8, -6],
      [-6, -8], [-4, -5], [0, -7], [4, -5], [6, -8],
      [8, -6], [5, -3], [7, 1], [6, 5], [9, 8],
      [7, 9], [4, 7], [1, 10], [2, 14]
   ],
   vuông: [[10, -10], [10, 10], [-10, 10], [-10, -10]],
   tròn: [
      [10, 0], [9.51, 3.09], [8.09, 5.88],
      [5.88, 8.09], [3.09, 9.51], [0, 10],
      [-3.09, 9.51], [-5.88, 8.09], [-8.09, 5.88],
      [-9.51, 3.09], [-10, 0], [-9.51, -3.09],
      [-8.09, -5.88], [-5.88, -8.09], [-3.09, -9.51],
      [-0.00, -10.00], [3.09, -9.51], [5.88, -8.09],
      [8.09, -5.88], [9.51, -3.09]
   ]
}));

const _RÙA_MẶC_ĐỊNH = 'rùa';

/** hàm tạo đối tượng rùa, được sử dụng cho kiểm tra kiểu tĩnh */
const _rùa_mặc_định = () => ({
   vị_trí: {
      x: 0,
      y: 0
   },
   góc: 0,
   đã_đặt_bút: true,
   chiều_rộng: 1,
   hiện: true,
   hình: _RÙA_MẶC_ĐỊNH,
   mầu: {
      r: 0,
      g: 0,
      b: 0,
      a: 1
   }
});

// khởi tạo trạng thái của đối tượng rùa
let _rùa = _rùa_mặc_định();

/**
 * Sử dụng khung vẽ với hệ tọa độ ở chính tâm hướng lên trên
 * @param {CanvasRenderingContext2D} ngữ_cảnh
 */
const _tọa_độ_tâm = ngữ_cảnh => {
   const {width: w, height: h} = ngữ_cảnh.canvas;
   ngữ_cảnh.translate(w / 2, h / 2);
   ngữ_cảnh.transform(1, 0, 0, -1, 0, 0);
};

/** vẽ rùa và cảnh hiện tại */
const vẽ = () => {
   _xóa_ngữ_cảnh(_ngữ_cảnh_rùa);
   if (_rùa.hiện) {
      const {x, y} = _rùa.vị_trí;

      _ngữ_cảnh_rùa.save();
      _tọa_độ_tâm(_ngữ_cảnh_rùa);
      
      // chuyển gốc tới tâm điểm của rùa
      _ngữ_cảnh_rùa.translate(x, y);

      // xoay quanh tâm điểm của rùa
      _ngữ_cảnh_rùa.rotate(-_rùa.góc);

      // chuyển rùa ngược về chỗ của nó
      _ngữ_cảnh_rùa.translate(-x, -y);

      const hình = _các_mẫu_rùa[
         _các_mẫu_rùa.hasOwnProperty(_rùa.hình) ? _rùa.hình : _DEFAULT_SHAPE
      ];

      // vẽ biểu tượng rùa
      _ngữ_cảnh_rùa.beginPath();
      if (hình.length > 0)
         _ngữ_cảnh_rùa.moveTo(x + hình[0][0], y + hình[0][1]);
      for (const [cx, cy] of hình.slice(1)) {
         _ngữ_cảnh_rùa.lineTo(x + cx, y + cy);
      }
      _ngữ_cảnh_rùa.closePath();

      _ngữ_cảnh_rùa.fillStyle = 'green';
      _ngữ_cảnh_rùa.fill();
      _ngữ_cảnh_rùa.restore();
   }
   _ngữ_cảnh_rùa.drawImage(_khung_vẽ_hình_ảnh, 0, 0, 500, 500, 0, 0, 500, 500);
};

const _xóa_ngữ_cảnh = (/**@type {CanvasRenderingContext2D}*/ ngữ_cảnh) => {
   const {width: w, height: h} = ngữ_cảnh.canvas;
   ngữ_cảnh.save();
   ngữ_cảnh.setTransform( 1,0,0,1,0,0 );
   ngữ_cảnh.clearRect( 0,0,w,h );
   ngữ_cảnh.restore();
};

/** xóa bảng vẽ, không dịch chuyển rùa */
const xóa = () => {
   _xóa_ngữ_cảnh(_ngữ_cảnh_hình_ảnh);
   vẽ();
};

/**
 * Khởi động lại, xóa màn hình và đưa rùa về trạng thái ban đầu,
 * nhìn theo trục y.
*/
const khởi_động_lại = () => {
   // khởi tạo
   _rùa = _rùa_mặc_định();
   _ngữ_cảnh_hình_ảnh.lineWidth = _rùa.chiều_rộng;
   _ngữ_cảnh_hình_ảnh.strokeStyle = 'black';
   _ngữ_cảnh_hình_ảnh.globalAlpha = 1;

   // dừng các chu kỳ
   for (const id of các_chu_kỳ) {
      clearInterval(id);
   }

   xóa();
   vẽ();
};

/**
 * Di chuyển rùa về phía trước, cho phép xoay vòng 
 * quanh các biên của khung hình.
 * @param {số} khoảng cách
 */
const tiến = khoảng_cách => {
   khoảng_cách = +khoảng_cách;

   _ngữ_cảnh_hình_ảnh.save();
   _tọa_độ_tâm(_ngữ_cảnh_hình_ảnh);
   _ngữ_cảnh_hình_ảnh.beginPath();

   // lấy các đường biên của khung vẽ
   const
      {abs, sin, cos} = Math,
      {width: w, height: h} = _khung_vẽ_hình_ảnh,
      x_lớn_nhất = w / 2, x_nhỏ_nhất = -x_lớn_nhất,
      y_lớn_nhất = h / 2, y_nhỏ_nhất = -y_lớn_nhất;

   /**
    * trả về sine và cosine của 1 số như 1 bộ 2
    * @param {số} x
    * @return {[số, số]}
    */
   const sin_cos = x => [sin(x), cos(x)];

   let {x, y} = _rùa.vị_trí;

   // rò các bước tiến
   while (khoảng_cách > 0) {
      // chuyển tới vị trí hiện tại của rùa
      _ngữ_cảnh_hình_ảnh.moveTo(x, y);

      // tính vị trí mới sau khi tiến
      const
         [sin_góc, cos_góc] = sin_cos(_rùa.góc),
         x_mới = x + sin_góc * khoảng_cách,
         y_mới = y + cos_góc * khoảng_cách;

      /**
       * xoay vòng qua biên X
       * @param {số} cận_trên
       * @param {số} cận_dưới
       */
      const đóng_gói_x = (cận_trên, cận_dưới) => {
         const khoảng_cách_tới_cạnh = abs((cận_trên - x) / sin_góc);
         const cạnh_y = cos_góc * khoảng_cách_tới_cạnh + y;
         _ngữ_cảnh_hình_ảnh.lineTo(cận_trên, cạnh_y);
         khoảng_cách -= khoảng_cách_tới_cạnh;
         x = cận_dưới;
         y = cạnh_y;
      };

      /**
       * xoay vòng qua biên Y
       * @param {số} cận_trên
       * @param {số} cận_dưới
       */
      const đóng_gói_y = (cận_trên, cận_dưới) => {
         const khoảng_cách_tới_cạnh = abs((cận_trên - y) / cos_góc);
         const cạnh_x = sin_góc * khoảng_cách_tới_cạnh + x;
         _ngữ_cảnh_hình_ảnh.lineTo(cạnh_x, cận_trên);
         khoảng_cách -= khoảng_cách_tới_cạnh;
         x = cạnh_x;
         y = cận_dưới;
      };

      /** không xoay vòng qua bất kỳ biên nào */
      const không_đóng_gói = () => {
         _ngữ_cảnh_hình_ảnh.lineTo(x_mới, y_mới);
         _rùa.vị_trí.x = x_mới;
         _rùa.vị_trí.y = y_mới;
         khoảng_cách = 0;
      };
      if (x_mới > x_lớn_nhất)
         đóng_gói_x(x_lớn_nhất, x_nhỏ_nhất);
      else if (x_mới < x_nhỏ_nhất)
         đóng_gói_x(x_nhỏ_nhất, x_lớn_nhất);
      else if (y_mới > y_lớn_nhất)
         đóng_gói_y(y_lớn_nhất, y_nhỏ_nhất);
      else if (y_mới < y_nhỏ_nhất)
         đóng_gói_y(y_nhỏ_nhất, y_lớn_nhất);
      else
         không_đóng_gói();
   }

   // chỉ vẽ nếu bút đang được đặt xuống.
   _rùa.đã_đặt_bút && _ngữ_cảnh_hình_ảnh.stroke();
   _ngữ_cảnh_hình_ảnh.restore();
   vẽ();
};

const ẩn_rùa = () => {
   _rùa.hiện = false;
   vẽ();
};

const hiện_rùa = () => {
   _rùa.hiện = true;
   vẽ();
};

/** nâng bút (không vẽ) */
const nâng_bút = () => { _rùa.đã_đặt_bút = false; };
/** đặt bút xuống (để vẽ khi di chuyển) */
const đặt_bút = () => { _rùa.đã_đặt_bút = true; };

/**
 * Xoay phải 1 góc được đo bằng độ
 * @param {số} góc xoay
 */
const phải = góc => {
   _rùa.góc += độ_thành_rad(góc);
   vẽ();
};

/**
 * Xoay trái 1 góc được đo bằng độ
 * @param {số} góc xoay
 */
const trái = góc => {
   _rùa.góc -= độ_thành_rad(góc);
   vẽ();
};

/**
 * Dịch chuyển rùa tới 1 điểm cụ thể (không vẽ khi di chuyển)
 * @param {số} x
 * @param {số} y
 */
const nhảy = (x, y) => {
   _rùa.vị_trí.x = +x;
   _rùa.vị_trí.y = +y;
   vẽ();
};

/**
 * Đặt góc rùa theo độ
 * @param {số} a
 */
const góc = a => { 
   _rùa.góc = độ_thành_rad(a); 
   vẽ();
};

/**
 * Chuyển độ thành rad
 * @param {số} độ
 */
const độ_thành_rad = độ => độ / 180 * Math.PI;

/**
 * chuyển rad thành độ
 * @param {số} rad
 */
const rad_thành_độ = rad => rad * 180 / Math.PI;

/**
 * đặt độ rộng của đường thẳng
 * @param {số} kích thước
 */
const rộng = w => {
   w = +w;
   _rùa.chiều_rộng = w;
   _ngữ_cảnh_hình_ảnh.lineWidth = w;
};

/**
 * Viết ở vị trí của rùa
 *
 * @param {string} thông điệp
 */
const viết = msg => {
   const {x, y} = _rùa.vị_trí;

   _ngữ_cảnh_hình_ảnh.save();
   _tọa_độ_tâm(_ngữ_cảnh_hình_ảnh);

   //_ngữ_cảnh_hình_ảnh.rotate(turtle.góc);
   _ngữ_cảnh_hình_ảnh.translate(x, y);
   _ngữ_cảnh_hình_ảnh.transform(1, 0, 0, -1, 0, 0);
   _ngữ_cảnh_hình_ảnh.translate(-x, -y);

   _ngữ_cảnh_hình_ảnh.fillText(msg, x, y);

   _ngữ_cảnh_hình_ảnh.restore();

   vẽ();
};

/**
 * set the font of the image Context
 * @param {string} font
 */
const setFont = font => { _ngữ_cảnh_hình_ảnh.font = font; };

/**
 * thiết lập hình rùa
 *
 * hiện đang hỗ trợ rùa (mặc định), tam_giác, tròn, và vuông
 * @param {string} s
 */
const rùa = s => {
   _rùa.hình = s;
   vẽ();
};

/**
 * Đặt mầu vẽ bằng giá trị RGB, mỗi thành phần trong khoảng 0 - 255.
 * @param {số} r
 * @param {số} g
 * @param {số} b
 * @param {số} a alpha
 */
const mầu = (r, g, b, a) => {
   r = +r;
   g = +g;
   b = +b;
   a = +a;

   _ngữ_cảnh_hình_ảnh.strokeStyle = `rgba(${r}, ${g}, ${b}, ${a})`;
   const c = _rùa.mầu;
   c.r = r;
   c.g = g;
   c.b = b;
   c.a = a;
};

const các_chu_kỳ = []

/**
 * đồng nghĩa với `setInterval`, nhưng sử dụng 2 tham số
 * @param {hàm_xử_lý} f
 * @param {số} ms
 */
const đặt_chu_kỳ = (f, ms) => {
   let id = setInterval(f, ms);
   các_chu_kỳ.push(id);
}

const _main = () => {
   const tài_liệu = document;
   const hộp_mã_nguồn = /**@type {HTMLInputElement}*/(tài_liệu.getElementById('source-codes'));

   /** Thực hiện mã nguồn trong hộp mã nguồn */
   const thực_thi = () => {
      const mã_nguồn = hộp_mã_nguồn.value;
      try {
         (0, eval)(mã_nguồn);
      } catch (e) {
         alert('Phát sinh lỗi:\n' + e);
         throw e;
      } finally {
      }
   };

   const thêm_xử_lý_click = (id, cb) => tài_liệu.getElementById(id).addEventListener('click', cb);
   
   // gọi hàm thực_thi khi người dùng bấm nút Chạy
   thêm_xử_lý_click('run-button', thực_thi);
   khởi_động_lại();
};

_main();
