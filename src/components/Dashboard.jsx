import React from 'react';
import { Plane, Car, MapPin } from 'lucide-react';

const Dashboard = ({ onSelectService }) => {
  const services = [
    {
      id: 'airport',
      title: 'Antar Jemput Bandara',
      icon: <Plane className="w-10 h-10 text-white" />,
      desc: 'Layanan nyaman ke dan dari bandara. Tepat waktu dan profesional.',
      bg: 'bg-gradient-to-br from-blue-500 to-blue-600',
    },
    {
      id: 'dropoff',
      title: 'Antar ke Lokasi',
      icon: <MapPin className="w-10 h-10 text-white" />,
      desc: 'Antar jemput ke titik lokasi pilihan Anda dengan peta interaktif.',
      bg: 'bg-gradient-to-br from-purple-500 to-purple-600',
    },
    {
      id: 'charter',
      title: 'Sewa Mobil / Carter',
      icon: <Car className="w-10 h-10 text-white" />,
      desc: 'Fleksibilitas penuh untuk perjalanan dinas atau wisata Anda.',
      bg: 'bg-gradient-to-br from-emerald-500 to-emerald-600',
    }
  ];

  return (
    <div className="w-full">

      <section className="relative py-20 px-6 text-center">
        <div className="max-w-4xl mx-auto relative z-10">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-300 via-white to-teal-300 bg-clip-text text-transparent">
            Perjalanan Premium Anda Dimulai Di Sini
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Nikmati kenyamanan transportasi terbaik dengan layanan SkyShuttle. Aman, nyaman, dan terpercaya.
          </p>
          <div className="flex justify-center gap-4">
            <button onClick={() => document.getElementById('services').scrollIntoView({ behavior: 'smooth' })} className="px-8 py-3 bg-white text-gray-900 rounded-full font-semibold hover:bg-gray-100 transition-colors">
              Pesan Sekarang
            </button>
            <button className="px-8 py-3 border border-white/20 rounded-full font-semibold hover:bg-white/10 transition-colors">
              Hubungi Kami
            </button>
          </div>
        </div>
      </section>


      <section id="services" className="py-16 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Layanan Kami</h2>
          <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-teal-400 mx-auto rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service) => (
            <button
              key={service.id}
              onClick={() => onSelectService(service.id)}
              className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8 text-left transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-blue-500/10"
            >
              <div className={`w-16 h-16 rounded-2xl ${service.bg} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                {service.icon}
              </div>
              <h3 className="text-2xl font-bold mb-3">{service.title}</h3>
              <p className="text-gray-400 leading-relaxed">
                {service.desc}
              </p>
              
              <div className="mt-8 flex items-center gap-2 text-sm font-semibold text-blue-400 group-hover:text-blue-300">
                Pesan Sekarang <span>→</span>
              </div>
            </button>
          ))}
        </div>
      </section>


      <section className="py-16 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="p-6">
            <div className="text-4xl font-bold text-white mb-2">5000+</div>
            <div className="text-gray-400">Total Perjalanan</div>
          </div>
          <div className="p-6 border-l border-r border-white/10">
            <div className="text-4xl font-bold text-white mb-2">24/7</div>
            <div className="text-gray-400">Layanan Pelanggan</div>
          </div>
          <div className="p-6">
            <div className="text-4xl font-bold text-white mb-2">4.9/5</div>
            <div className="text-gray-400">Rating Kepuasan</div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
