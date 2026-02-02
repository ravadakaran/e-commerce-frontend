import { ArrowLeft, CreditCard, Tag, Wallet } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Payment = () => {
  const navigate = useNavigate();
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [message, setMessage] = useState('');
  const [summary, setSummary] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('COD'); // COD | Razorpay | Card | PayPal
  const [razorpayKey, setRazorpayKey] = useState('');

  useEffect(() => {
    fetch('/api/payments/razorpay/config')
      .then((r) => r.json())
      .then((c) => setRazorpayKey(c.keyId || ''))
      .catch(() => {});
  }, []);

  useEffect(() => {
    const userId = localStorage.getItem('userEmail');
    const delivery = localStorage.getItem('deliveryDetails');
    if (!userId) {
      navigate('/login');
      return;
    }
    if (!delivery) {
      navigate('/delivery');
      return;
    }

    // Fetch order summary
    fetch(`/api/checkout/${userId}`)
      .then((res) => res.json())
      .then((data) => {
        if (!data.items || data.items.length === 0) {
          navigate('/cart');
          return;
        }
        setSummary(data);
      })
      .catch(() => {
        setMessage('Error loading order summary');
      });
  }, [navigate]);

  const applyCoupon = async () => {
    try {
      const res = await fetch(`/api/coupons/apply?code=${couponCode}`);
      const data = await res.json();
      if (res.ok) {
        setDiscount(data.discountAmount);
        setMessage(`Coupon applied: €${data.discountAmount.toLocaleString()} off`);
      } else {
        setDiscount(0);
        setMessage('Invalid coupon.');
      }
    } catch {
      setMessage('Error applying coupon');
    }
  };

  const doConfirmPayment = async (transactionId = null) => {
    const userId = localStorage.getItem('userEmail');
    const delivery = JSON.parse(localStorage.getItem('deliveryDetails'));

    if (!userId || !delivery) {
      setMessage('Missing delivery or user info');
      return;
    }

    try {
      const payload = { userId, delivery, discount, paymentMethod, transactionId };
      const res = await fetch('/api/checkout/confirm-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        setMessage(data.message || 'Payment failed');
        return;
      }

      localStorage.setItem('invoice', JSON.stringify(data));
      navigate('/success');
    } catch {
      setMessage('Something went wrong');
    }
  };

  const handleRazorpayPay = async () => {
    if (!razorpayKey) {
      setMessage('Razorpay is not configured. Use Cash on Delivery.');
      return;
    }
    try {
      const res = await fetch('/api/payments/razorpay/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: finalTotal, currency: 'INR' }),
      });
      const orderData = await res.json();
      if (!res.ok || !orderData.orderId) {
        setMessage(orderData.error || 'Could not create Razorpay order');
        return;
      }
      const options = {
        key: razorpayKey,
        amount: orderData.amount * 100,
        currency: orderData.currency,
        name: 'Dangly Dreams',
        description: 'Order Payment',
        order_id: orderData.orderId,
        handler: (response) => {
          doConfirmPayment(response.razorpay_payment_id);
        },
      };
      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', () => setMessage('Payment failed'));
      rzp.open();
    } catch (err) {
      setMessage('Payment error: ' + (err.message || 'Unknown'));
    }
  };

  const confirmPayment = () => {
    if (paymentMethod === 'Razorpay') {
      handleRazorpayPay();
    } else {
      doConfirmPayment();
    }
  };

  const handleBack = () => {
    navigate('/delivery');
  };

  if (!summary) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-amber-50/30">
        <div className="animate-spin h-12 w-12 border-b-2 border-amber-600 rounded-full"></div>
      </div>
    );
  }

  const finalTotal = summary.totalAmount - discount;

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 via-white to-amber-50/30">
      <section className="max-w-6xl mx-auto px-6 py-12 flex-grow">
        <div className="flex items-center mb-8">
          <button
            onClick={handleBack}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Go back to delivery"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <h1 className="text-4xl md:text-5xl font-light tracking-wide text-gray-900 ml-4">
            Complete Your Payment
          </h1>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 max-w-2xl mx-auto w-full">
          <div>
              <h2 className="text-xl font-medium text-gray-900 mb-4">Apply Coupon</h2>
              <div className="space-y-4">
                <div className="relative">
                  <Tag className="w-5 h-5 text-gray-500 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="Enter coupon code"
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#EBD6FB] text-gray-700"
                    aria-label="Coupon code"
                  />
                </div>
                <button
                  onClick={applyCoupon}
                  className="max-w-xs w-full bg-gradient-to-r from-amber-500 to-amber-600 text-white py-2 px-6 rounded-xl text-sm font-medium tracking-wider hover:from-amber-600 hover:to-amber-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  aria-label="Apply coupon"
                >
                  Apply Coupon
                </button>
                {message && (
                  <div
                    className={`p-4 border rounded-xl ${
                      message.includes('applied')
                        ? 'border-green-200 bg-green-50 text-green-800'
                        : 'border-red-200 bg-red-50 text-red-800'
                    } flex items-center gap-3`}
                  >
                    <svg
                      className={`w-4 h-4 ${message.includes('applied') ? 'text-green-600' : 'text-red-600'}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d={message.includes('applied') ? 'M5 13l4 4L19 7' : 'M6 18L18 6M6 6l12 12'}
                      />
                    </svg>
                    <p className="text-sm font-medium">{message}</p>
                  </div>
                )}
              </div>

              <div className="mt-6">
                <h2 className="text-xl font-medium text-gray-900 mb-4">Your Order</h2>
                <div className="space-y-3">
                  {summary.items.map((item) => (
                    <div
                      key={item.productId}
                      className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0 text-sm text-gray-600"
                    >
                      <div>
                        <p className="font-medium text-gray-900">{item.productName}</p>
                        <p>Quantity: {item.quantity}</p>
                      </div>
                      <p className="text-amber-600">€{item.itemTotal.toLocaleString()}</p>
                    </div>
                  ))}
                  <div className="space-y-3 text-sm text-gray-600 pt-4">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span className="text-amber-600">€{summary.totalAmount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Discount</span>
                      <span className="text-amber-600">€{discount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between font-medium pt-2 border-t border-gray-100">
                      <span>Total</span>
                      <span className="text-amber-600">€{finalTotal.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <h3 className="text-sm font-medium text-gray-700">Payment Method</h3>
                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('COD')}
                    className={`px-4 py-2 rounded-xl text-sm font-medium border-2 transition-all ${
                      paymentMethod === 'COD' ? 'border-amber-500 bg-amber-50 text-amber-700' : 'border-gray-200 text-gray-600 hover:border-gray-300'
                    }`}
                  >
                    Cash on Delivery
                  </button>
                  {razorpayKey && (
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('Razorpay')}
                      className={`px-4 py-2 rounded-xl text-sm font-medium border-2 transition-all flex items-center gap-2 ${
                        paymentMethod === 'Razorpay' ? 'border-amber-500 bg-amber-50 text-amber-700' : 'border-gray-200 text-gray-600 hover:border-gray-300'
                      }`}
                    >
                      <Wallet className="w-4 h-4" /> Razorpay
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('Card')}
                    className={`px-4 py-2 rounded-xl text-sm font-medium border-2 transition-all flex items-center gap-2 ${
                      paymentMethod === 'Card' ? 'border-amber-500 bg-amber-50 text-amber-700' : 'border-gray-200 text-gray-600 hover:border-gray-300'
                    }`}
                  >
                    <CreditCard className="w-4 h-4" /> Card
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('PayPal')}
                    className={`px-4 py-2 rounded-xl text-sm font-medium border-2 transition-all ${
                      paymentMethod === 'PayPal' ? 'border-amber-500 bg-amber-50 text-amber-700' : 'border-gray-200 text-gray-600 hover:border-gray-300'
                    }`}
                  >
                    PayPal
                  </button>
                </div>
                <p className="text-xs text-gray-500">
                  {paymentMethod === 'COD' && 'Pay when your order is delivered.'}
                  {paymentMethod === 'Razorpay' && 'Pay securely via Razorpay (UPI, cards, netbanking).'}
                  {paymentMethod === 'Card' && 'Credit/Debit card payment via Razorpay.'}
                  {paymentMethod === 'PayPal' && 'PayPal integration coming soon. Use Razorpay or COD for now.'}
                </p>
                <button
                  onClick={confirmPayment}
                  className="max-w-sm w-full bg-gradient-to-r from-amber-500 to-amber-600 text-white py-2.5 px-6 rounded-xl text-sm font-medium tracking-wider hover:from-amber-600 hover:to-amber-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  aria-label="Confirm payment"
                >
                  {paymentMethod === 'COD' ? 'Place Order (Pay on Delivery)' : paymentMethod === 'Razorpay' ? 'Pay with Razorpay' : 'Place Order'}
                </button>
              </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Payment;