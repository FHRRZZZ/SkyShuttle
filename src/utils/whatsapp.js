export const openWhatsApp = (phoneNumber, message) => {
  const encodedMessage = encodeURIComponent(message);
  const waLink = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
  window.open(waLink, "_blank");
};

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
};
