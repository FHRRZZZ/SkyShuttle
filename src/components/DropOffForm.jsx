import React, { useState, useEffect, useMemo } from 'react';
import {
  ArrowLeft, User, Phone, MapPin, Navigation, Search, 
  Wallet, QrCode, Calendar, Clock
} from 'lucide-react';

import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

import { openWhatsApp, formatCurrency } from '../utils/whatsapp';
import { QRCodeSVG } from 'qrcode.react';
import { generateDynamicQris } from '../utils/qris';

/* ================= LEAFLET FIX ================= */
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

/* ================= MAP HELPERS ================= */
const MapUpdater = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    if (center) map.flyTo(center, 15);
  }, [center, map]);
  return null;
};

const LocationMarker = ({ setPosition, setAddress }) => {
  const [position, setPos] = useState(null);

  const fetchAddress = async (lat, lng) => {
    try {
      setAddress('Mengambil alamat...');
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
      const data = await res.json();
      setAddress(data.display_name || "Alamat tidak dikenal");
    } catch {
      setAddress('Gagal mengambil alamat');
    }
  };

  const map = useMapEvents({
    click(e) {
      setPos(e.latlng);
      setPosition(e.latlng);
      fetchAddress(e.latlng.lat, e.latlng.lng);
    },
    locationfound(e) {
      setPos(e.latlng);
      setPosition(e.latlng);
      map.flyTo(e.latlng, map.getZoom());
      fetchAddress(e.latlng.lat, e.latlng.lng);
    },
  });

  useEffect(() => {
    map.locate();
  }, [map]);

  return position ? <Marker position={position} /> : null;
};

/* ================= MAIN COMPONENT ================= */
const DropOffForm = ({ onBack }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    pickupLocation: '',
    paymentMethod: 'cash',
    date: '',
    time: '',
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [mapPosition, setMapPosition] = useState(null);
  const [mapAddress, setMapAddress] = useState('');
  const [flyToCoords, setFlyToCoords] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [priceDetails, setPriceDetails] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const PHONE_NUMBER = '6282289191926';
  const STATIC_QRIS_Data = '00020101021126570014ID.CO.QRIS.WWW01189360091431432263430215ID10200213035360303UMI51440014ID.CO.QRIS.WWW0215ID10200213035365204481453033605802ID5919SkyShuttle Payment6014Jakarta Selat61051214062070703A0163046B23';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const deg2rad = (deg) => deg * (Math.PI / 180);
    const R = 6371;
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a = Math.sin(dLat / 2) ** 2 + Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) ** 2;
    return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
  };

  const handleSearch = async () => {
    if (!searchQuery) return;
    setIsSearching(true);
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(searchQuery)}&format=json&limit=1`);
      const data = await res.json();
      if (data.length > 0) {
        const pos = { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
        setMapPosition(pos);
        setMapAddress(data[0].display_name);
        setFlyToCoords(pos);
        setPriceDetails(null);
      } else {
        alert('Lokasi tidak ditemukan');
      }
    } catch {
      alert('Gagal mencari lokasi');
    } finally {
      setIsSearching(false);
    }
  };

const checkPrice = async () => {
    // 1. Validasi Input
    if (!formData.pickupLocation.trim() || !mapPosition) {
      alert('Harap isi Nama Lokasi Jemput dan pilih Tujuan di peta.');
      return;
    }

    setIsCalculating(true);
    try {
      // 2. Tambahkan kata kunci "Indonesia" atau Kota spesifik agar pencarian lebih akurat
      const query = `${formData.pickupLocation}, Indonesia`;
      
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1`
      );
      const data = await res.json();

      if (data && data.length > 0) {
        const pickupLat = parseFloat(data[0].lat);
        const pickupLon = parseFloat(data[0].lon);

        const distance = calculateDistance(
          pickupLat,
          pickupLon,
          mapPosition.lat,
          mapPosition.lng
        );
        
        const baseCost = 12000;
        const total = distance <= 3 ? baseCost : baseCost + Math.round((distance - 3) * 5000);

        setPriceDetails({
          distance: distance.toFixed(1),
          total: total,
        });
      } else {
        // Jika tidak ditemukan, beri saran kepada user
        alert('Lokasi jemput tidak spesifik. Coba tambahkan nama kota (Contoh: "Tanah Abang, Jakarta")');
      }
    } catch (error) {
      console.error("Error fetching location:", error);
      alert('Gagal terhubung ke server peta. Periksa koneksi internet Anda.');
    } finally {
      setIsCalculating(false);
    }
  };

  const dynamicQris = useMemo(() => {
    if (!priceDetails || !generateDynamicQris) return STATIC_QRIS_Data;
    return generateDynamicQris(STATIC_QRIS_Data, priceDetails.total);
  }, [priceDetails]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!priceDetails) {
        alert("Selesaikan perhitungan harga terlebih dahulu.");
        return;
    }

    const mapLink = `https://www.google.com/maps?q=${mapPosition.lat},${mapPosition.lng}`;
    const message = `*Order Antar Lokasi*
Nama: ${formData.name}
No HP: ${formData.phone}
Titik Jemput: ${formData.pickupLocation}
Tujuan: ${mapAddress}
Link Map: ${mapLink}
Tanggal: ${formData.date}
Jam: ${formData.time}

Total: ${formatCurrency(priceDetails.total)}
Metode: ${formData.paymentMethod === 'qris' ? 'QRIS' : 'Tunai'}`;

    openWhatsApp(PHONE_NUMBER, message);
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 flex flex-col h-full relative">
      <button onClick={onBack} className="mb-4 text-sm text-gray-400 hover:text-white flex items-center gap-2 shrink-0">
        <ArrowLeft size={16} /> Kembali ke Dashboard
      </button>

      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 shrink-0">
        <span className="w-1 h-6 bg-purple-500 rounded-full"></span>
        Antar ke Lokasi
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4 flex flex-col flex-grow overflow-y-auto">
        <div className="space-y-4">
          <div className="relative">
            <User className="absolute left-3 top-3.5 text-gray-500 w-5 h-5" />
            <input name="name" placeholder="Nama Lengkap" value={formData.name} onChange={handleChange} required className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:border-purple-500" />
          </div>

          <div className="relative">
            <Phone className="absolute left-3 top-3.5 text-gray-500 w-5 h-5" />
            <input name="phone" type="tel" placeholder="Nomor WhatsApp" value={formData.phone} onChange={handleChange} required className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:border-purple-500" />
          </div>

          <div className="relative">
            <Navigation className="absolute left-3 top-3.5 text-gray-500 w-5 h-5" />
            <input name="pickupLocation" placeholder="Titik Penjemputan" value={formData.pickupLocation} onChange={handleChange} required className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4" />
          </div>

          <div className="flex gap-4">
            <input name="date" type="date" value={formData.date} onChange={handleChange} required className="flex-1 bg-white/5 border border-white/10 rounded-xl py-3 px-4 [color-scheme:dark]" />
            <input name="time" type="time" value={formData.time} onChange={handleChange} required className="flex-1 bg-white/5 border border-white/10 rounded-xl py-3 px-4 [color-scheme:dark]" />
          </div>
        </div>

        {/* Payment Methods */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-gray-300 flex items-center gap-2"><Wallet size={16} /> Metode Pembayaran</label>
          <div className="grid grid-cols-2 gap-4">
            <button type="button" onClick={() => setFormData(f => ({...f, paymentMethod: 'cash'}))} className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${formData.paymentMethod === 'cash' ? 'bg-purple-500/20 border-purple-500 text-white' : 'bg-white/5 border-white/10 text-gray-400'}`}>
              <Wallet className="w-6 h-6" /><span className="text-sm">Tunai</span>
            </button>
            <button type="button" onClick={() => setFormData(f => ({...f, paymentMethod: 'qris'}))} className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${formData.paymentMethod === 'qris' ? 'bg-purple-500/20 border-purple-500 text-white' : 'bg-white/5 border-white/10 text-gray-400'}`}>
              <QrCode className="w-6 h-6" /><span className="text-sm">QRIS</span>
            </button>
          </div>
          
          {formData.paymentMethod === 'qris' && (
            <div className="bg-white p-4 rounded-xl flex flex-col items-center animate-in zoom-in-95">
              <QRCodeSVG value={dynamicQris} size={150} />
              <p className="text-black text-xs mt-2 text-center font-bold">SCAN UNTUK BAYAR</p>
            </div>
          )}
        </div>

        {/* Map Section */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300 flex items-center gap-2"><MapPin size={16} /> Pilih Tujuan di Peta</label>
          <div className="flex gap-2">
            <input type="text" placeholder="Cari tujuan..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="flex-grow bg-white/5 border border-white/10 rounded-xl py-3 px-4" />
            <button type="button" onClick={handleSearch} disabled={isSearching} className="bg-purple-600 p-3 rounded-xl text-white">
              {isSearching ? <span className="animate-spin text-xs">...</span> : <Search size={20} />}
            </button>
          </div>
          <div className="w-full h-[250px] rounded-xl overflow-hidden border border-white/10 z-0">
            <MapContainer center={[-6.2000, 106.8166]} zoom={13} style={{ height: '100%', width: '100%' }}>
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <LocationMarker setPosition={setMapPosition} setAddress={(addr) => { setMapAddress(addr); setSearchQuery(addr); }} />
              <MapUpdater center={flyToCoords} />
            </MapContainer>
          </div>
          <p className="text-[10px] text-gray-500 truncate">{mapAddress || "Klik peta untuk menentukan tujuan"}</p>
        </div>

        {/* Pricing Results */}
        <div className="pt-2">
          {!priceDetails ? (
            <button type="button" onClick={checkPrice} disabled={isCalculating || !mapPosition} className="w-full bg-white/10 py-3 rounded-xl border border-dashed border-white/30 text-gray-300">
              {isCalculating ? "Menghitung..." : "Cek Estimasi Harga"}
            </button>
          ) : (
            <div className="bg-purple-500/10 p-4 rounded-xl border border-purple-500/30">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Jarak Tempuh</span>
                <span className="text-white font-medium">{priceDetails.distance} km</span>
              </div>
              <div className="flex justify-between font-bold text-lg pt-2 border-t border-white/10 mt-2">
                <span className="text-white">Total Bayar</span>
                <span className="text-purple-400">{formatCurrency(priceDetails.total)}</span>
              </div>
            </div>
          )}
        </div>

        <button type="submit" className="w-full bg-purple-600 py-4 rounded-xl font-bold text-white shadow-lg">
          {formData.paymentMethod === 'qris' ? 'Konfirmasi Bayar & Pesan' : 'Pesan via WhatsApp'}
        </button>
      </form>
    </div>
  );
};

export default DropOffForm;