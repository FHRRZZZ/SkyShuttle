import React from 'react';
import { Plane, Menu, X, Instagram, Facebook, Twitter } from 'lucide-react';

const Layout = ({ children, onNavigate }) => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const handleNav = (target) => {
    setIsMenuOpen(false);
    if (onNavigate) {
      onNavigate(target);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans flex flex-col relative overflow-x-hidden">

      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-blue-600/10 rounded-full blur-[150px] animate-pulse"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-teal-500/10 rounded-full blur-[150px] animate-pulse delay-1000"></div>
      </div>


      <nav className="relative z-50 bg-gray-900/80 backdrop-blur-md border-b border-white/10 sticky top-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">

            <div className="flex items-center gap-3 cursor-pointer" onClick={() => handleNav('dashboard')}>
              <div className="bg-gradient-to-br from-blue-500 to-teal-400 p-2 rounded-xl">
                <Plane className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                SkyShuttle
              </span>
            </div>


            <div className="hidden md:flex items-center gap-8">
              <button onClick={() => handleNav('dashboard')} className="text-gray-300 hover:text-white transition-colors text-sm font-medium">Beranda</button>
              <button onClick={() => handleNav('services')} className="text-gray-300 hover:text-white transition-colors text-sm font-medium">Layanan</button>
              <button onClick={() => handleNav('about')} className="text-gray-300 hover:text-white transition-colors text-sm font-medium">Tentang Kami</button>
              <button onClick={() => handleNav('contact')} className="bg-white/10 hover:bg-white/20 text-white px-5 py-2.5 rounded-full text-sm font-medium transition-all border border-white/10">
                Hubungi Kami
              </button>
            </div>


            <div className="md:hidden">
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-400 hover:text-white p-2"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>


        {isMenuOpen && (
          <div className="md:hidden bg-gray-900 border-b border-white/10">
            <div className="px-4 pt-2 pb-6 space-y-2">
              <button onClick={() => handleNav('dashboard')} className="block w-full text-left px-3 py-3 rounded-lg text-base font-medium text-white hover:bg-white/5">Beranda</button>
              <button onClick={() => handleNav('services')} className="block w-full text-left px-3 py-3 rounded-lg text-base font-medium text-gray-300 hover:bg-white/5 hover:text-white">Layanan</button>
              <button onClick={() => handleNav('about')} className="block w-full text-left px-3 py-3 rounded-lg text-base font-medium text-gray-300 hover:bg-white/5 hover:text-white">Tentang Kami</button>
              <button onClick={() => handleNav('contact')} className="block w-full text-left px-3 py-3 rounded-lg text-base font-medium text-blue-400 hover:bg-white/5">Hubungi Kami</button>
            </div>
          </div>
        )}
      </nav>


      <main className="flex-grow relative z-10 w-full">
        {children}
      </main>


      <footer id="footer" className="relative z-10 bg-gray-950 border-t border-white/10 pt-12 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-1 md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <Plane className="w-6 h-6 text-teal-400" />
                <span className="text-xl font-bold">SkyShuttle</span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                Mitra perjalanan terpercaya Anda. Melayani antar jemput bandara, sewa mobil, dan perjalanan dinas dengan armada premium.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-white mb-4">Layanan</h3>
              <ul className="space-y-3 text-sm text-gray-400">
                <li><button onClick={() => handleNav('airport')} className="hover:text-blue-400 transition-colors text-left">Antar Jemput Bandara</button></li>
                <li><button onClick={() => handleNav('charter')} className="hover:text-blue-400 transition-colors text-left">Sewa Mobil Harian</button></li>
                <li><button onClick={() => handleNav('charter')} className="hover:text-blue-400 transition-colors text-left">Perjalanan Dinas</button></li>
                <li><button onClick={() => handleNav('charter')} className="hover:text-blue-400 transition-colors text-left">Pariwisata</button></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-white mb-4">Perusahaan</h3>
              <ul className="space-y-3 text-sm text-gray-400">
                <li><button onClick={() => handleNav('about')} className="hover:text-blue-400 transition-colors text-left">Tentang Kami</button></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Karir</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Kebijakan Privasi</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Syarat & Ketentuan</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-white mb-4">Ikuti Kami</h3>
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all">
                  <Instagram size={20} />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all">
                  <Facebook size={20} />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all">
                  <Twitter size={20} />
                </a>
              </div>
            </div>
          </div>
          
          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-xs">
              &copy; {new Date().getFullYear()} SkyShuttle. All rights reserved.
            </p>
            <p className="text-gray-600 text-xs">
              Designed for Excellence
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
