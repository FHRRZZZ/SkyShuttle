import React, { useState, useEffect, useMemo } from 'react';
import { ArrowLeft, User, Phone, MapPin, Calendar, Clock, Users, Wallet, QrCode, AlertTriangle } from 'lucide-react';
import { openWhatsApp, formatCurrency } from '../utils/whatsapp';
import { QRCodeSVG } from 'qrcode.react';
import { generateDynamicQris } from '../utils/qris';

const AirportForm = ({ onBack }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    pickup: '',
    destination: '',
    date: '',
    time: '',
    passengers: 1,
    paymentMethod: 'cash' // 'cash' | 'qris'
  });
  
  const [showWarning, setShowWarning] = useState(false);

  const BASE_PRICE = 100000;
  const PHONE_NUMBER = "6282289191926";
  const STATIC_QRIS_Data = "00020101021126570014ID.CO.QRIS.WWW01189360091431432263430215ID10200213035360303UMI51440014ID.CO.QRIS.WWW0215ID10200213035365204481453033605802ID5919SkyShuttle Payment6014Jakarta Selat61051214062070703A0163046B23"; 

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePassengerChange = (delta) => {
    setFormData(prev => ({
      ...prev,
      passengers: Math.max(1, prev.passengers + delta)
    }));
  };

  const handlePaymentChange = (method) => {
    setFormData(prev => ({ ...prev, paymentMethod: method }));
  };

  const calculateTotal = () => {
    let rawTotal = BASE_PRICE * formData.passengers;
    let discount = 0;
    
    if (formData.passengers === 2) {
      discount = rawTotal * 0.1;
    } else if (formData.passengers > 2) {
      discount = rawTotal * 0.2;
    }
    
    return {
      rawTotal,
      discount,
      finalTotal: rawTotal - discount
    };
  };

  const { finalTotal, discount } = calculateTotal();

  // Generate dynamic QRIS whenever finalTotal changes
  const dynamicQris = useMemo(() => {
    return generateDynamicQris(STATIC_QRIS_Data, finalTotal);
  }, [finalTotal]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowWarning(true);
  };

  const handleConfirm = () => {
    const { rawTotal, discount, finalTotal } = calculateTotal();
    
    let discountNote = "";
    if (formData.passengers === 2) discountNote = "(Disc 10%)";
    else if (formData.passengers > 2) discountNote = "(Disc 20%)";

    const paymentText = formData.paymentMethod === 'qris' ? 'QRIS (Scan)' : 'Tunai / Cash';

    const message = `*Order Antar Jemput Bandara* ✈️
        
Nama: ${formData.name}
No. HP: ${formData.phone}
Jemput: ${formData.pickup}
Tujuan: ${formData.destination}
Tanggal: ${formData.date}
Jam: ${formData.time}
Jumlah Penumpang: ${formData.passengers} Orang
        
*Total Harga: ${formatCurrency(finalTotal)}* ${discountNote}
Metode Pembayaran: ${paymentText}
        
Mohon konfirmasi pesanan saya. Terima kasih!`;

    openWhatsApp(PHONE_NUMBER, message);
    setShowWarning(false);
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 relative">
      <button 
        onClick={onBack}
        className="mb-6 text-sm text-gray-400 hover:text-white flex items-center gap-2 transition-colors"
      >
        <ArrowLeft size={16} /> Kembali ke Dashboard
      </button>

      <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
        <span className="w-1 h-6 bg-blue-500 rounded-full"></span>
        Formulir Bandara
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">

        <div className="space-y-4">
          <div className="relative">
            <User className="absolute left-3 top-3.5 text-gray-500 w-5 h-5" />
            <input
              name="name"
              placeholder="Nama Lengkap"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
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
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
            />
          </div>

          <div className="relative">
            <MapPin className="absolute left-3 top-3.5 text-gray-500 w-5 h-5" />
            <textarea
              name="pickup"
              placeholder="Alamat Penjemputan"
              rows="2"
              value={formData.pickup}
              onChange={handleChange}
              required
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all resize-none"
            />
          </div>

          <div className="relative">
            <MapPin className="absolute left-3 top-3.5 text-gray-500 w-5 h-5" />
            <input
              name="destination"
              placeholder="Tujuan (Bandara/Hotel)"
              value={formData.destination}
              onChange={handleChange}
              required
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
            />
          </div>

          <div className="flex gap-4">
            <div className="relative flex-1">
              <Calendar className="absolute left-3 top-3.5 text-gray-500 w-5 h-5" />
              <input
                name="date"
                type="date"
                value={formData.date}
                onChange={handleChange}
                required
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all [color-scheme:dark]"
              />
            </div>
            <div className="relative flex-1">
              <Clock className="absolute left-3 top-3.5 text-gray-500 w-5 h-5" />
              <input
                name="time"
                type="time"
                value={formData.time}
                onChange={handleChange}
                required
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all [color-scheme:dark]"
              />
            </div>
          </div>

          <div className="bg-white/5 p-4 rounded-xl flex items-center justify-between border border-white/10">
            <div className="flex items-center gap-2 text-gray-300">
              <Users size={20} /> <span className="text-sm">Penumpang</span>
            </div>
            <div className="flex items-center gap-4">
              <button 
                type="button" 
                onClick={() => handlePassengerChange(-1)}
                className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
              >
                -
              </button>
              <span className="text-lg font-semibold w-6 text-center">{formData.passengers}</span>
              <button 
                type="button" 
                onClick={() => handlePassengerChange(1)}
                className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="space-y-3">
             <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                <Wallet size={16} /> Metode Pembayaran
             </label>
             <div className="grid grid-cols-2 gap-4">
                 <button
                    type="button"
                    onClick={() => handlePaymentChange('cash')}
                    className={`p-4 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all ${
                        formData.paymentMethod === 'cash' 
                        ? 'bg-blue-500/20 border-blue-500 text-white' 
                        : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
                    }`}
                 >
                     <Wallet className="w-6 h-6" />
                     <span className="text-sm font-medium">Tunai</span>
                 </button>
                 <button
                    type="button"
                    onClick={() => handlePaymentChange('qris')}
                    className={`p-4 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all ${
                        formData.paymentMethod === 'qris' 
                        ? 'bg-blue-500/20 border-blue-500 text-white' 
                        : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
                    }`}
                 >
                     <QrCode className="w-6 h-6" />
                     <span className="text-sm font-medium">QRIS</span>
                 </button>
             </div>
             
             {formData.paymentMethod === 'qris' && (
                 <div className="bg-white p-6 rounded-xl flex flex-col items-center justify-center gap-4 animate-in fade-in zoom-in-95 duration-300">
                     <QRCodeSVG value={dynamicQris} size={160} />
                     <p className="text-gray-900 text-xs font-medium text-center">
                         Scan QRIS ini untuk pembayaran.<br/>
                         Total: <b>{formatCurrency(finalTotal)}</b>
                     </p>
                 </div>
             )}
        </div>


        <div className="bg-black/20 p-4 rounded-xl space-y-2 mt-6">
          <div className="flex justify-between text-sm text-gray-400">
            <span>Harga per orang</span>
            <span>{formatCurrency(BASE_PRICE)} x {formData.passengers}</span>
          </div>
          {discount > 0 && (
            <div className="flex justify-between text-sm text-green-400">
              <span>Diskon Group</span>
              <span>- {formatCurrency(discount)}</span>
            </div>
          )}
          <div className="border-t border-white/10 pt-2 mt-2 flex justify-between font-bold text-lg">
            <span>Total</span>
            <span className="text-blue-400">{formatCurrency(finalTotal)}</span>
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-4 rounded-xl shadow-lg hover:shadow-blue-500/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
        >
          {formData.paymentMethod === 'qris' ? 'Konfirmasi Sudah Bayar & Pesan' : 'Pesan via WhatsApp'}
        </button>
      </form>

      {/* Warning Modal */}
      {showWarning && (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-gray-900 border border-white/10 p-6 rounded-2xl max-w-sm w-full space-y-4 shadow-2xl scale-100 animate-in zoom-in-95 duration-300">
            <div className="flex items-center gap-3 text-amber-500">
              <AlertTriangle className="w-8 h-8" />
              <h3 className="text-lg font-bold text-white">Peringatan</h3>
            </div>
            
            <p className="text-gray-300 text-sm leading-relaxed">
              Pastikan jumlah penumpang tidak melebihi kapasitas dan mohon bersiap tepat waktu di lokasi penjemputan.
            </p>

            <div className="flex gap-3 pt-2">
              <button 
                onClick={() => setShowWarning(false)}
                className="flex-1 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 text-sm font-medium transition-colors"
              >
                Batal
              </button>
              <button 
                onClick={handleConfirm}
                className="flex-1 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold transition-colors"
              >
                Lanjut
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AirportForm;
