"use client";

import { useState } from "react";
import { MessageCircle, X } from "lucide-react";

const WHATSAPP_NUMBER = "254726639789";
const DEFAULT_MESSAGE =
  "Hello Pepea Radio Studio! 👋 I'm reaching out from your website. I'd like to connect with you.";

export default function WhatsAppButton() {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpenWhatsApp = () => {
    const encodedMessage = encodeURIComponent(DEFAULT_MESSAGE);
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
    setIsOpen(false);
  };

  return (
    <>
      {/* Floating WhatsApp Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-28 right-6 z-50 flex items-center justify-center w-14 h-14 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 group"
        aria-label="Chat with Pepea Radio on WhatsApp"
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <MessageCircle className="w-7 h-7" />
        )}
        
        {/* Pulse Animation Ring */}
        <span className="absolute inset-0 rounded-full bg-green-500 opacity-30 animate-ping" />
        
        {/* Tooltip */}
        <span className="absolute right-16 bg-gray-900 text-white text-sm px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none">
          Chat with Studio
        </span>
      </button>

      {/* Chat Popup */}
      {isOpen && (
        <div className="fixed bottom-44 right-6 z-50 w-80 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden animate-in slide-in-from-bottom-2 fade-in duration-300">
          {/* Header */}
          <div className="bg-green-500 px-5 py-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-white font-semibold text-sm">
                  Pepea Radio Studio
                </h3>
                <p className="text-green-100 text-xs flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-300 rounded-full animate-pulse" />
                  Typically replies instantly
                </p>
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="px-5 py-4 bg-gray-50">
            <p className="text-gray-600 text-sm mb-4">
              👋 Hi there! Connect with our studio team directly on WhatsApp.
              We're here to take your requests, shoutouts, and feedback!
            </p>

            <button
              onClick={handleOpenWhatsApp}
              className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-3 px-4 rounded-xl transition-colors duration-200 flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-5 h-5" />
              Start WhatsApp Chat
            </button>

            <p className="text-gray-400 text-xs text-center mt-3">
              Powered by WhatsApp Business
            </p>
          </div>
        </div>
      )}
    </>
  );
}
