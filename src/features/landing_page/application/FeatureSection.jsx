import { Icon1, Icon2, Icon3 } from "../../../assets/landing_page/icon.jsx";
import AnimatedContent from "../lib/AnimatedContent.jsx";

function FeatureSection() {
  return (
    <section id="tentang" className="font-family-poppins px-6 bg-white">
      <div className="pt-20 pb-5 mx-auto border border-blue-100 rounded-3xl bg-blue-100 max-w-[1400px]">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl text-center text-gray-800 mb-16">
            Yuk, Kenalan Dengan <span className="text-blue-600">Aturin</span>
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <AnimatedContent>
              <div className="bg-blue-100 p-8 text-center">
                <div className="flex justify-center mx-auto mb-2">
                  <img src={Icon1} />
                </div>
                <h3 className="text-3xl text-gray-800 mb-4">
                  Apasih aturin itu?
                </h3>
                <p className="text-gray-600 text-lg leading-relaxed">
                  Aplikasi manajemen waktu berbasis personal insight yang
                  mendukung perencanaan jadwal, pengelolaan tugas, serta
                  evaluasi aktivitas untuk membantu kamu mencapai keseimbangan
                  hidup.
                </p>
              </div>
            </AnimatedContent>

            <AnimatedContent>
              <div className="bg-blue-100 p-8 text-center">
                <div className="flex justify-center mx-auto mb-2">
                  <img src={Icon2} />
                </div>
                <h3 className="text-3xl text-gray-800 mb-4">
                  Ga hanya mengelola
                </h3>
                <p className="text-gray-600 text-lg leading-relaxed">
                  Aturin ga hanya mengelola tapi bakal evaluasi kamu lewat
                  insight mingguan yang keren banget dan kamu bakal dapat
                  rekomendasi harian.
                </p>
              </div>
            </AnimatedContent>

            <AnimatedContent>
              <div className="bg-blue-100 p-8 text-center">
                <div className="flex justify-center mx-auto mb-2">
                  <img src={Icon3} />
                </div>
                <h3 className="text-3xl text-gray-800 mb-4">
                  +80% Pengguna puas
                </h3>
                <p className="text-gray-600 text-lg leading-relaxed">
                  Aturin membantu mereka mengelola waktu, menyelesaikan tugas
                  tepat waktu, dan menjaga keseimbangan antara aktivitas dan
                  istirahat.
                </p>
              </div>
            </AnimatedContent>
          </div>
        </div>
      </div>
    </section>
  );
}

export default FeatureSection;
