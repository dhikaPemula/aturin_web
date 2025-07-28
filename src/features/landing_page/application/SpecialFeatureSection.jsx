import {
  Gif, Icon13, Icon14, Icon15, Icon16
} from "../../../../public/assets/landing_page/icon.jsx";

function SpecialFeatureSection() {
  return (
    <>
      <section id="fitur" className="font-family-poppins py-20">
        <div className="max-w-[1400px] mx-auto">
          <h2 className="text-3xl md:text-4xl text-center text-gray-800 mb-16">
            Apa Yang Spesial Dari <br />
            <span className="text-blue-600">Aturin</span>
            <span>?</span>
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 items-center">
            {/* Phone Mockup */}
            <div className="h-145 flex justify-center mb-6 sm:mb-0">
              <img className="bg-white" src={Gif}/>
            </div>

            {/* Feature Cards */}
            <div className="grid lg:grid-cols-2 gap-6 mx-6 md:mx-0">
              <div className="bg-blue-100 p-6 border border-gray-200 rounded-4xl order-1">
                <div className="mb-5">
                  <img src={Icon15}/>
                </div>
                <div className="flex items-center space-x-3 mb-3">
                  
                  <h3 className="text-lg font-semibold text-blue-500">
                    Aktivitas & Tugas Terorganisir
                  </h3>
                </div>
                <p className="text-black text-sm mb-3">
                  Tambahkan dan kelola tugas atau aktivitas harianmu dengan
                  mudah lewat tampilan kalender yang intuitif dan praktis.
                </p>
                <a href="#" className="text-blue-500 text-sm font-medium">
                  Lihat Selengkapnya →
                </a>
              </div>

              <div className="bg-yellow-100 p-6 border border-gray-200 rounded-4xl order-2">
                 <div className="mb-5">
                  <img src={Icon14}/>
                </div>
                <div className="flex items-center space-x-3 mb-3">
                  <h3 className="text-lg font-semibold text-yellow-500">
                    Alarm Cerdas
                  </h3>
                </div>
                <p className="text-black text-sm mb-3">
                  Atur pengingat khusus untuk tugas atau aktivitas harian. Waktu
                  bisa disesuaikan sesuai kebutuhanmu.
                </p>
                <a href="#" className="text-yellow-500 text-sm font-medium">
                  Lihat Selengkapnya →
                </a>
              </div>

              <div className="bg-yellow-100 p-6 border border-gray-200 rounded-4xl order-4 sm:order-3">
                <div className="mb-5">
                  <img src={Icon16}/>
                </div>
                <div className="flex items-center space-x-3 mb-3">
                  <h3 className="text-lg font-semibold text-yellow-500">
                    Analisis Keseimbangan Hidup
                  </h3>
                </div>
                <p className="text-black text-sm mb-3">
                  Dapatkan insight pencapaian dan evaluasi mingguan yang bantu
                  hidupmu sudah seimbang atau belum.
                </p>
                <a href="#" className="text-yellow-500 text-sm font-medium">
                  Lihat Selengkapnya →
                </a>
              </div>

              <div className="bg-blue-100 p-6 border border-gray-200 rounded-4xl order-3 sm:order-4">
                <div className="mb-5">
                  <img src={Icon13}/>
                </div>
                <div className="flex items-center space-x-3 mb-3">
                  <h3 className="text-lg font-semibold text-blue-500">
                    Personalisasi Sesuai Gaya Hidup
                  </h3>
                </div>
                <p className="text-black text-sm mb-3">
                  Aturin menyesuaikan caramu beraktivitas. Semua fitur dirancang
                  untuk mendukung rutinitas secara personal dan fleksibel.
                </p>
                <a href="#" className="text-blue-500 text-sm font-medium">
                  Lihat Selengkapnya →
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default SpecialFeatureSection;
