import React, { useState } from 'react';
import { ArrowLeft, User, Phone, MapPin, Calendar, Clock, Car } from 'lucide-react';
import { openWhatsApp } from '../utils/whatsapp';

const CharterForm = ({ onBack }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    vehicleType: 'Avanza',
    duration: '12 Jam',
    pickupLocation: '',
    startDate: '',
    startTime: '',
    destination: ''
  });

  const PHONE_NUMBER = "";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const message = `*Order Sewa Mobil / Carter* 
        
Nama: ${formData.name}
No. HP: ${formData.phone}
Unit: ${formData.vehicleType}
Durasi: ${formData.duration}
Rute/Tujuan: ${formData.destination}
Lokasi Jemput: ${formData.pickupLocation}
Tanggal Mulai: ${formData.startDate}
Jam Mulai: ${formData.startTime}
        
Mohon info harga. Terima kasih!`;

    openWhatsApp(PHONE_NUMBER, message);
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <button 
        onClick={onBack}
        className="mb-6 text-sm text-gray-400 hover:text-white flex items-center gap-2 transition-colors"
      >
        <ArrowLeft size={16} /> Kembali ke Dashboard
      </button>

      <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
        <span className="w-1 h-6 bg-emerald-500 rounded-full"></span>
        Sewa Mobil / Carter
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <User className="absolute left-3 top-3.5 text-gray-500 w-5 h-5" />
          <input
            name="name"
            placeholder="Nama Lengkap"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
          />
        </div>

        <div className="relative">
          <Phone className="absolute left-3 top-3.5 text-gray-500 w-5 h-5" />
          <input
            name="phone"
            type="tel"
            placeholder="Nomor WhatsApp"
            value={formData.phone}
            onChange={handleChange}
            required
            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
          />
        </div>

        <div className="flex gap-4">
          <div className="relative flex-1">
            <label className="text-xs text-gray-400 ml-1 mb-1 block">Jenis Mobil</label>
            <select
              name="vehicleType"
              value={formData.vehicleType}
              onChange={handleChange}
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all text-white [&>option]:bg-gray-800"
            >
              <option value="Avanza">Avanza</option>
              <option value="Innova Reborn">Innova Reborn</option>
              <option value="Innova Zenix">Innova Zenix</option>
              <option value="Hiace">Hiace</option>
              <option value="Alphard">Alphard</option>
            </select>
          </div>
          <div className="relative flex-1">
            <label className="text-xs text-gray-400 ml-1 mb-1 block">Durasi</label>
            <select
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all text-white [&>option]:bg-gray-800"
            >
              <option value="12 Jam">12 Jam</option>
              <option value="Full Day">Full Day</option>
              <option value="Luar Kota">Luar Kota</option>
              <option value="Drop Only">Drop Only</option>
            </select>
          </div>
        </div>

        <div className="relative">
          <MapPin className="absolute left-3 top-3.5 text-gray-500 w-5 h-5" />
          <input
            name="pickupLocation"
            placeholder="Lokasi Penjemputan"
            value={formData.pickupLocation}
            onChange={handleChange}
            required
            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
          />
        </div>

        <div className="relative">
          <MapPin className="absolute left-3 top-3.5 text-gray-500 w-5 h-5" />
          <textarea
            name="destination"
            placeholder="Rute / Tujuan Perjalanan"
            rows="2"
            value={formData.destination}
            onChange={handleChange}
            required
            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all resize-none"
          />
        </div>

        <div className="flex gap-4">
          <div className="relative flex-1">
            <Calendar className="absolute left-3 top-3.5 text-gray-500 w-5 h-5" />
            <input
              name="startDate"
              type="date"
              value={formData.startDate}
              onChange={handleChange}
              required
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all [color-scheme:dark]"
            />
          </div>
          <div className="relative flex-1">
            <Clock className="absolute left-3 top-3.5 text-gray-500 w-5 h-5" />
            <input
              name="startTime"
              type="time"
              value={formData.startTime}
              onChange={handleChange}
              required
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all [color-scheme:dark]"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold py-4 rounded-xl shadow-lg hover:shadow-emerald-500/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
        >
          Tanya Harga via WhatsApp
        </button>
      </form>
    </div>
  );
};

export default CharterForm;
