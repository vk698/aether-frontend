

import React, { useState } from 'react';
import { X } from 'lucide-react';

const CancelOrderModal = ({ isOpen, onClose, onConfirm, loading }) => {
  const [selectedReason, setSelectedReason] = useState('');
  const [otherReason, setOtherReason] = useState('');

  const reasons = [
    'Changed my mind',
    'Found a better price elsewhere',
    'Ordered by mistake',
    'Delivery time is too long',
    'Product not needed anymore',
    'Other'
  ];

  const handleSubmit = () => {
    let finalReason = selectedReason;
    if (selectedReason === 'Other') {
      finalReason = otherReason.trim() || 'Other (no details provided)';
    }
    if (!finalReason) {
      alert('Please select or provide a cancellation reason.');
      return;
    }
    onConfirm(finalReason);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in">
      {/* Glassmorphism Modal */}
      <div className="glass-royal rounded-2xl max-w-md w-full p-6 border border-[#d4af37]/30 shadow-2xl shadow-[#d4af37]/10 transform transition-all scale-95 animate-scale-up">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-serif text-2xl font-bold text-gold-royal tracking-wide">
            Cancel Order
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gold-royal transition rounded-full p-1 hover:bg-[#d4af37]/10"
          >
            <X size={22} />
          </button>
        </div>

        <p className="text-sm text-gray-300 mb-4 font-light">
          Please let us know why you’re cancelling this order. This helps us improve.
        </p>

        {/* Reason Options */}
        <div className="space-y-3">
          {reasons.map((reason) => (
            <label key={reason} className="flex items-start gap-3 cursor-pointer group">
              <input
                type="radio"
                name="cancelReason"
                value={reason}
                checked={selectedReason === reason}
                onChange={() => setSelectedReason(reason)}
                className="mt-0.5 w-4 h-4 text-gold-royal border-[#d4af37]/40 bg-transparent focus:ring-gold-royal focus:ring-2 focus:ring-offset-0"
              />
              <span className={`text-sm font-light ${selectedReason === reason ? 'text-gold-royal' : 'text-gray-300'} group-hover:text-gold-royal transition-colors duration-200`}>
                {reason}
              </span>
            </label>
          ))}
        </div>

        {/* Other Reason Text Input */}
        {selectedReason === 'Other' && (
          <div className="mt-4">
            <textarea
              value={otherReason}
              onChange={(e) => setOtherReason(e.target.value)}
              placeholder="Please describe your reason in detail..."
              className="w-full px-4 py-2 bg-black/40 border border-[#d4af37]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-royal text-gray-200 placeholder-gray-500 text-sm min-h-[80px] resize-y transition"
            />
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-full border border-[#d4af37]/40 text-sm font-medium text-gray-300 hover:bg-[#d4af37]/10 hover:text-gold-royal transition-all duration-300"
          >
            Go Back
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className={`flex-1 py-2.5 rounded-full text-sm font-semibold text-black transition-all duration-300 ${
              loading
                ? 'bg-gray-500 cursor-not-allowed opacity-50'
                : 'bg-gradient-to-r from-gold-royal to-gold-champagne hover:shadow-lg hover:shadow-[#d4af37]/30 hover:scale-[1.02]'
            }`}
          >
            {loading ? 'Cancelling...' : 'Confirm Cancel'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CancelOrderModal;