import { MessageSquare } from 'lucide-react';

const WhatsAppButton = ({ phone = '' }) => {
  const handleClick = () => {
    const url = phone
      ? `https://wa.me/${phone.replace(/[^0-9]/g, '')}?text=Hi! I have a query about your products.`
      : '#';
    window.open(url, '_blank');
  };

  return (
    <button
      onClick={handleClick}
      className="fixed bottom-6 left-6 z-50 w-14 h-14 rounded-full bg-green-500 text-white shadow-lg shadow-green-500/30 flex items-center justify-center hover:shadow-xl hover:bg-green-600 hover:scale-110 transition-all duration-300"
      title="Chat on WhatsApp"
    >
      <MessageSquare className="w-6 h-6" />
    </button>
  );
};

export default WhatsAppButton;
