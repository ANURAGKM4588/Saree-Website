/**
 * Utility helper to load Razorpay SDK dynamically and trigger the Checkout Window
 */

export const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export const triggerRazorpayCheckout = async ({
  amount,
  items = [],
  customerInfo = {},
  onSuccess,
  onFailure,
}) => {
  const isLoaded = await loadRazorpayScript();
  if (!isLoaded) {
    alert('Failed to load Razorpay SDK. Please check your internet connection.');
    if (onFailure) onFailure('Razorpay SDK load failed');
    return;
  }

  // Use Razorpay Key ID from env variable or live merchant key
  const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_live_TFrgh6oiJs5RNn';

  const options = {
    key: razorpayKey,
    amount: Math.round(amount * 100), // amount in paise (1 INR = 100 paise)
    currency: 'INR',
    name: 'KADHA Silk Sarees',
    description: `Purchase of ${items.length} item(s)`,
    image: '/logo/herologo.png',
    handler: function (response) {
      const paymentDetails = {
        razorpay_payment_id: response.razorpay_payment_id,
        razorpay_order_id: response.razorpay_order_id || `ORD-${Date.now()}`,
        razorpay_signature: response.razorpay_signature || 'sig_demo',
        amount: amount,
        items: items,
        customer: customerInfo,
        status: 'Paid',
        method: 'Razorpay',
        createdAt: new Date().toISOString(),
      };
      if (onSuccess) onSuccess(paymentDetails);
    },
    prefill: {
      name: customerInfo.name || 'Valued Customer',
      email: customerInfo.email || 'customer@kadha.shop',
      contact: customerInfo.phone || '9876543210',
    },
    notes: {
      address: customerInfo.address || 'KADHA Showroom Network',
    },
    theme: {
      color: '#031c15', // Brand Dark Forest Green
    },
    modal: {
      ondismiss: function () {
        if (onFailure) onFailure('Payment window closed');
      },
    },
  };

  try {
    const paymentObject = new window.Razorpay(options);
    paymentObject.on('payment.failed', function (response) {
      if (onFailure) onFailure(response.error.description || 'Payment Failed');
    });
    paymentObject.open();
  } catch (err) {
    console.error('Razorpay Error:', err);
    if (onFailure) onFailure('Failed to launch Razorpay checkout modal.');
  }
};
