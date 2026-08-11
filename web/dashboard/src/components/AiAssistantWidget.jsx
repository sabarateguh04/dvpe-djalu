import React from 'react';
import { Sparkles, X } from 'lucide-react';

// Floating, dismissible - fixed to the viewport corner so it survives any
// amount of scrolling, but collapsible to a small bubble so it never
// permanently blocks content underneath it. Controlled from Layout.jsx so
// the sidebar's "Pusat Bantuan" button can also open it.
export default function AiAssistantWidget({ open, onOpen, onClose }) {
  if (!open) {
    return (
      <button className="ai-fab" onClick={onOpen} title="Buka AI Assistant" aria-label="Buka AI Assistant">
        <Sparkles size={20} />
      </button>
    );
  }

  return (
    <div className="ai-card">
      <button className="ai-card-close" onClick={onClose} title="Sembunyikan" aria-label="Sembunyikan AI Assistant">
        <X size={14} />
      </button>
      <div className="ai-card-avatar"><Sparkles size={20} /></div>
      <div className="ai-card-title">Hai, saya Alesha 👋</div>
      <div className="ai-sub">AI Assistant siap membantu anda</div>
      <button className="dvpe-btn ai-card-btn">Chat Sekarang</button>
    </div>
  );
}
