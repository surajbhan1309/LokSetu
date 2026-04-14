import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { QRCodeSVG } from 'qrcode.react';
import { updatePaymentStatus } from '../services/api';
import Navigation from '../components/Navigation';
import Button from '../components/Button';
import Input from '../components/Input';

const PaymentScreen = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  
  const { amount, requestId, purpose, department } = location.state || {
    amount: 500,
    requestId: 'REQ' + Math.floor(Math.random() * 10000),
    purpose: 'Service Request',
    department: 'electricity'
  };

  const [method, setMethod] = useState(''); // 'upi' or 'qr'
  const [vpa, setVpa] = useState('');
  const [status, setStatus] = useState('idle'); // 'idle', 'processing', 'success', 'failed'

  const handleProcessPayment = () => {
    if (method === 'upi' && !vpa) return;
    setStatus('processing');
  };

  const handleSimulateSuccess = async () => {
    setStatus('success');
    
    try {
      // Update payment status in backend
      const response = await updatePaymentStatus(requestId, 'SUCCESS');
      
      setTimeout(() => {
        // Navigate to confirmation with the updated request
        navigate('/confirmation', { 
          state: { 
            request: response.request
          }
        });
      }, 2000);
    } catch (error) {
      console.error('Failed to update payment status:', error);
      setStatus('failed');
    }
  };

  const handleSimulateFailure = () => {
    setStatus('failed');
  };

  const renderIdle = () => (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <p className="text-kiosk-xl font-bold text-gray-900 mb-2">
          Amount to Pay: <span className="text-primary-600">₹{amount}</span>
        </p>
        <p className="text-kiosk-base text-gray-600">
          Ref: {requestId} | {purpose}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <button
          onClick={() => setMethod('upi')}
          className={`p-8 rounded-kiosk-lg border-4 flex flex-col items-center gap-4 transition-all ${
            method === 'upi' ? 'border-primary-500 bg-primary-50' : 'border-gray-200 hover:border-primary-200'
          }`}
        >
          <span className="text-5xl">📱</span>
          <span className="text-kiosk-lg font-bold">UPI Pay</span>
        </button>
        <button
          onClick={() => setMethod('qr')}
          className={`p-8 rounded-kiosk-lg border-4 flex flex-col items-center gap-4 transition-all ${
            method === 'qr' ? 'border-primary-500 bg-primary-50' : 'border-gray-200 hover:border-primary-200'
          }`}
        >
          <span className="text-5xl">🔳</span>
          <span className="text-kiosk-lg font-bold">Scan QR</span>
        </button>
      </div>

      {method === 'upi' && (
        <div className="space-y-6 animate-in fade-in slide-in-from-top-4 duration-300">
          <Input
            label="Enter UPI ID (VPA)"
            value={vpa}
            onChange={(e) => setVpa(e.target.value)}
            placeholder="example@upi"
          />
          <Button
            variant="primary"
            size="large"
            onClick={handleProcessPayment}
            disabled={!vpa}
            fullWidth
          >
            Pay Now
          </Button>
        </div>
      )}

      {method === 'qr' && (
        <div className="flex flex-col items-center gap-6 animate-in fade-in zoom-in duration-300">
          <div className="bg-white p-6 rounded-kiosk-lg shadow-kiosk-lg border-2 border-gray-100">
            <QRCodeSVG value={`upi://pay?pa=loksetu@bank&am=${amount}&tr=${requestId}`} size={200} />
          </div>
          <p className="text-kiosk-base text-gray-600 font-medium text-center">
            Scan using any UPI App (GPay, PhonePe, Paytm)
          </p>
          <Button
            variant="primary"
            size="large"
            onClick={handleProcessPayment}
            fullWidth
          >
            Proceed after Scanning
          </Button>
        </div>
      )}
    </div>
  );

  const renderProcessing = () => (
    <div className="text-center py-12 space-y-8 animate-in fade-in duration-500">
      <div className="relative w-32 h-32 mx-auto">
        <div className="absolute inset-0 border-8 border-primary-100 rounded-full"></div>
        <div className="absolute inset-0 border-8 border-primary-500 rounded-full border-t-transparent animate-spin"></div>
      </div>
      <div>
        <h2 className="text-kiosk-2xl font-bold text-gray-900">Processing Payment</h2>
        <p className="text-kiosk-lg text-gray-600 mt-2">Please do not close this window</p>
      </div>
      
      {/* Simulation Controls for Demo */}
      <div className="pt-8 border-t border-gray-200">
        <p className="text-kiosk-sm text-gray-500 mb-4">Demo Controls</p>
        <div className="flex gap-4 justify-center">
          <Button variant="primary" onClick={handleSimulateSuccess}>
            ✓ Simulate Success
          </Button>
          <Button variant="secondary" onClick={handleSimulateFailure}>
            ✕ Simulate Failure
          </Button>
        </div>
      </div>
    </div>
  );

  const renderSuccess = () => (
    <div className="text-center py-12 space-y-6 animate-in zoom-in duration-500">
      <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto">
        <span className="text-5xl text-green-600">✓</span>
      </div>
      <h2 className="text-kiosk-2xl font-bold text-green-600">Payment Successful!</h2>
      <p className="text-kiosk-lg text-gray-600">Redirecting to confirmation...</p>
    </div>
  );

  const renderFailed = () => (
    <div className="text-center py-12 space-y-6">
      <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto">
        <span className="text-5xl text-red-600">✕</span>
      </div>
      <h2 className="text-kiosk-2xl font-bold text-red-600">Payment Failed</h2>
      <p className="text-kiosk-lg text-gray-600">Transaction could not be completed.</p>
      <Button variant="primary" size="large" onClick={() => setStatus('idle')} fullWidth>
        Try Again
      </Button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation showBack={status === 'idle'} showHome={status === 'idle'} />
      
      <div className="pt-32 pb-12 px-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-kiosk-lg shadow-kiosk-xl p-12">
            <h1 className="text-kiosk-2xl font-bold text-gray-900 mb-8 text-center border-b pb-6">
              💳 Payment Gateway
            </h1>

            {status === 'idle' && renderIdle()}
            {status === 'processing' && renderProcessing()}
            {status === 'success' && renderSuccess()}
            {status === 'failed' && renderFailed()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentScreen;
