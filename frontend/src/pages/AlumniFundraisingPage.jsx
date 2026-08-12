import React, { useState, useEffect } from 'react';
import { Tag, Button, Modal, Form, Input, Select, Spin, Empty, message } from 'antd';
import { FiHeart, FiShare2, FiShield } from 'react-icons/fi';
import { AlumniLayout } from '../components/alumni/AlumniLayout';
import { useAppContext } from '../context/AppContext';
import { authService } from '../services/authService';
import api from '../services/api';

// Dynamic script loader for Razorpay Checkout SDK
const loadRazorpayScript = () => {
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

export const AlumniFundraisingPage = () => {
  const [isContributeOpen, setIsContributeOpen] = useState(false);
  const [contributeForm] = Form.useForm();

  // Summary state from AppContext
  const { alumniDonations: totalDonations, setAlumniDonations: setTotalDonations } = useAppContext();
  const [supportedCount, setSupportedCount] = useState(0);
  const [campaigns, setCampaigns] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCamp, setSelectedCamp] = useState(null);
  const [submittingPayment, setSubmittingPayment] = useState(false);

  const user = authService.getCurrentUser();
  const alumniId = user?.alumniId;

  // Active Campaign Filter Helper
  const isActiveCampaign = (c) => {
    if (!c) return false;
    const statusUpper = (c.status || '').toUpperCase();
    if (statusUpper === 'CLOSED' || statusUpper === 'COMPLETED') return false;
    
    const target = Number(c.targetAmount || 0);
    const raised = Number(c.collectedAmount || 0);
    if (target > 0 && raised >= target) return false;
    
    if (c.endDate) {
      const end = new Date(c.endDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (end < today) return false;
    }
    return true;
  };

  const fetchFundraisingData = async () => {
    if (!alumniId) return;
    setLoading(true);
    try {
      // 1. Fetch campaigns
      const campRes = await api.get('/fundraising/getall');
      const camps = campRes.data || [];
      const mappedCamps = camps
        .map(c => ({
          id: c.fundId,
          title: c.title,
          target: Number(c.targetAmount || 0),
          raised: Number(c.collectedAmount || 0),
          category: 'Institutional',
          description: c.description,
          status: c.status,
          endDate: c.endDate
        }))
        .filter(isActiveCampaign);

      setCampaigns(mappedCamps);

      // 2. Fetch logged-in alumni's donations
      const histRes = await api.get(`/fundraising/donations/alumni/${alumniId}`);
      const list = histRes.data || [];
      const mappedHistory = list.map(d => ({
        id: d.donationId,
        campaign: d.fundraising?.title || 'Giving Contribution',
        amount: Number(d.amount || 0),
        date: d.donationDate ? new Date(d.donationDate).toLocaleDateString() : 'N/A',
        status: d.paymentStatus || 'SUCCESS',
        fundId: d.fundraising?.fundId
      }));

      setHistory(mappedHistory);

      // Filter successful donations for stats
      const successfulDonations = mappedHistory.filter(
        d => d.status.toUpperCase() === 'SUCCESS' || d.status.toLowerCase() === 'completed'
      );

      // Calculate unique campaigns supported
      const uniqueCampaigns = new Set(
        successfulDonations.filter(d => d.fundId).map(d => d.fundId)
      ).size;
      setSupportedCount(uniqueCampaigns);

      // Calculate total donations amount
      const total = successfulDonations.reduce((sum, d) => sum + d.amount, 0);
      setTotalDonations(total);
    } catch (err) {
      console.error("Error loading fundraising details:", err);
      message.error("Failed to load fundraising details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFundraisingData();
  }, [alumniId]);

  const handleOpenContribute = (campToDonate = null) => {
    if (campToDonate) {
      setSelectedCamp(campToDonate);
      contributeForm.setFieldsValue({ campaignId: campToDonate.id, amount: 5000 });
    } else if (campaigns.length > 0) {
      setSelectedCamp(campaigns[0]);
      contributeForm.setFieldsValue({ campaignId: campaigns[0].id, amount: 5000 });
    } else {
      setSelectedCamp(null);
      contributeForm.resetFields();
    }
    setIsContributeOpen(true);
  };

  const handleCampaignSelectChange = (fundId) => {
    const found = campaigns.find(c => c.id === fundId);
    setSelectedCamp(found || null);
  };

  // Step 1: Create Razorpay Order & Launch Real Razorpay Checkout Modal
  const handleProceedToPayment = async () => {
    try {
      const values = await contributeForm.validateFields();
      const amountNum = parseFloat(values.amount);
      const fundId = values.campaignId;

      const targetCamp = campaigns.find(c => c.id === fundId);
      if (!targetCamp) {
        message.error("Please select a valid active campaign.");
        return;
      }

      if (amountNum <= 0) {
        message.error("Donation amount must be greater than 0.");
        return;
      }

      const remaining = targetCamp.target - targetCamp.raised;
      if (targetCamp.target > 0 && amountNum > remaining) {
        message.error(`Donation amount exceeds remaining target of ₹${remaining.toLocaleString()}.`);
        return;
      }

      setSubmittingPayment(true);

      // 1. Call Backend API to Create Razorpay Order
      const orderPayload = {
        fundId: fundId,
        amount: amountNum,
        alumniId: alumniId
      };

      const orderRes = await api.post('/fundraising/payment/create-order', orderPayload);
      const orderData = orderRes.data;

      // 2. Load Razorpay Checkout SDK script
      const isLoaded = await loadRazorpayScript();
      if (!isLoaded || !window.Razorpay) {
        message.error("Unable to load Razorpay Checkout SDK. Please check your internet connection.");
        setSubmittingPayment(false);
        return;
      }

      // 3. Configure Razorpay Test Mode Options
      const options = {
        key: orderData.keyId || 'rzp_test_5173AlumniKCE',
        amount: orderData.amountInPaise,
        currency: orderData.currency || 'INR',
        name: 'AlumniConnect Institutional Giving',
        description: targetCamp.title,
        order_id: orderData.orderId,
        handler: async function (response) {
          // Razorpay payment completed! Send response to backend for signature verification
          try {
            const verifyPayload = {
              razorpayPaymentId: response.razorpay_payment_id,
              razorpayOrderId: response.razorpay_order_id,
              razorpaySignature: response.razorpay_signature,
              fundId: targetCamp.id,
              amount: amountNum,
              alumniId: alumniId
            };

            await api.post('/fundraising/payment/verify', verifyPayload);
            message.success(`Payment Successful! Your contribution of ₹${amountNum.toLocaleString()} to "${targetCamp.title}" has been verified and recorded.`);
            contributeForm.resetFields();
            setIsContributeOpen(false);
            fetchFundraisingData();
          } catch (verifyErr) {
            console.error("Payment verification error:", verifyErr);
            const errorMsg = verifyErr.response?.data || "Payment verification failed. Please try again.";
            message.error(typeof errorMsg === 'string' ? errorMsg : "Payment verification failed.");
          } finally {
            setSubmittingPayment(false);
          }
        },
        prefill: {
          name: user?.name || 'Alumni Donor',
          email: user?.email || 'alumni@kce.ac.in'
        },
        theme: { color: '#1b62d4' },
        modal: {
          ondismiss: function () {
            message.info('Payment was cancelled.');
            setSubmittingPayment(false);
          }
        }
      };

      // 4. Open native Razorpay Checkout Modal
      setIsContributeOpen(false);
      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (resp) {
        console.error("Razorpay Payment Failed Full Diagnostic Log:", {
          code: resp.error?.code,
          description: resp.error?.description,
          source: resp.error?.source,
          step: resp.error?.step,
          reason: resp.error?.reason,
          metadata: resp.error?.metadata
        });
        message.error(resp.error?.description || "Payment failed. Please try again.");
        setSubmittingPayment(false);
      });
      rzp.open();
    } catch (err) {
      console.error("Order creation error:", err);
      const errorMsg = err.response?.data || "Failed to create payment order.";
      message.error(typeof errorMsg === 'string' ? errorMsg : "Failed to create payment order.");
      setSubmittingPayment(false);
    }
  };

  const handleShare = (campaignTitle) => {
    navigator.clipboard.writeText(`Check out "${campaignTitle}" on AlumniConnect: https://alumniconnect.kce.ac.in/fundraising`);
    message.success(`Share link for "${campaignTitle}" copied to clipboard!`);
  };

  return (
    <AlumniLayout>
      {/* Title Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: 'var(--ac-text-primary)', margin: '0 0 4px 0' }}>Institutional Fundraising & Giving</h1>
          <p style={{ fontSize: 13.5, color: 'var(--ac-text-secondary)', margin: 0 }}>
            Support student scholarships, campus infrastructure, and alumni-sponsored research initiatives.
          </p>
        </div>

        {campaigns.length > 0 && (
          <Button
            type="primary"
            icon={<FiHeart />}
            style={{ backgroundColor: 'var(--ac-brand)', borderColor: 'var(--ac-brand)', height: 42, borderRadius: 8, fontWeight: 600 }}
            onClick={() => handleOpenContribute()}
          >
            Contribute More
          </Button>
        )}
      </div>

      {/* Summary Cards Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20, marginBottom: 24 }}>
        <div style={{ backgroundColor: 'var(--ac-bg-card)', borderRadius: 16, border: '1px solid var(--ac-border)', padding: 20 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--ac-text-muted)', textTransform: 'uppercase' }}>TOTAL DONATIONS</div>
          <div style={{ fontSize: 26, fontWeight: 800, color: 'var(--ac-brand)', margin: '4px 0 0 0' }}>₹{totalDonations.toLocaleString()}</div>
          <span style={{ fontSize: 12, color: 'var(--ac-text-secondary)' }}>Lifetime Contributions</span>
        </div>

        <div style={{ backgroundColor: 'var(--ac-bg-card)', borderRadius: 16, border: '1px solid var(--ac-border)', padding: 20 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--ac-text-muted)', textTransform: 'uppercase' }}>CAMPAIGNS SUPPORTED</div>
          <div style={{ fontSize: 26, fontWeight: 800, color: '#1b62d4', margin: '4px 0 0 0' }}>{supportedCount} Campaigns</div>
          <span style={{ fontSize: 12, color: 'var(--ac-text-secondary)' }}>Active Contributions</span>
        </div>
      </div>

      <Spin spinning={loading}>
        {/* 2-Column Main Layout */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: 24 }}>
          {/* Active Campaigns List */}
          <div>
            <h3 style={{ fontSize: 18, fontWeight: 800, color: 'var(--ac-text-primary)', margin: '0 0 16px 0' }}>Active Fundraising Campaigns</h3>
            {campaigns.length === 0 ? (
              <div style={{ backgroundColor: 'var(--ac-bg-card)', borderRadius: 16, border: '1px solid var(--ac-border)', padding: 40, textAlign: 'center' }}>
                <Empty description="No active fundraising campaigns available." />
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                {campaigns.map(camp => {
                  const pct = camp.target > 0 ? Math.min(100, Math.round((camp.raised / camp.target) * 100)) : 0;
                  const remaining = Math.max(0, camp.target - camp.raised);

                  return (
                    <div key={camp.id} style={{ backgroundColor: 'var(--ac-bg-card)', borderRadius: 16, border: '1px solid var(--ac-border)', padding: 24 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                        <Tag color="blue" style={{ fontWeight: 700 }}>{camp.category}</Tag>
                        <span style={{ fontSize: 13, fontWeight: 700, color: '#16a34a' }}>{pct}% Raised</span>
                      </div>

                      <h4 style={{ fontSize: 17, fontWeight: 800, color: 'var(--ac-text-primary)', margin: '0 0 8px 0' }}>{camp.title}</h4>
                      <p style={{ fontSize: 13, color: 'var(--ac-text-secondary)', margin: '0 0 16px 0', lineHeight: 1.5 }}>{camp.description}</p>

                      <div style={{ height: 8, background: '#f1f5f9', borderRadius: 4, overflow: 'hidden', marginBottom: 12 }}>
                        <div style={{ height: '100%', width: `${pct}%`, background: 'var(--ac-brand)', borderRadius: 4 }} />
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, fontWeight: 600, color: 'var(--ac-text-primary)', marginBottom: 18, flexWrap: 'wrap', gap: 8 }}>
                        <span>Raised: <strong>₹{camp.raised.toLocaleString()}</strong></span>
                        <span>Target: <strong>₹{camp.target.toLocaleString()}</strong></span>
                        <span>Remaining: <strong style={{ color: '#16a34a' }}>₹{remaining.toLocaleString()}</strong></span>
                      </div>

                      <div style={{ display: 'flex', gap: 10 }}>
                        <Button
                          type="primary"
                          icon={<FiHeart />}
                          style={{ backgroundColor: 'var(--ac-brand)', borderColor: 'var(--ac-brand)', borderRadius: 8, fontWeight: 600, flex: 1 }}
                          onClick={() => handleOpenContribute(camp)}
                        >
                          Donate Now
                        </Button>
                        <Button
                          icon={<FiShare2 />}
                          style={{ borderRadius: 8, fontWeight: 600 }}
                          onClick={() => handleShare(camp.title)}
                        >
                          Share
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Contribution History Column */}
          <div>
            <h3 style={{ fontSize: 18, fontWeight: 800, color: 'var(--ac-text-primary)', margin: '0 0 16px 0' }}>Your Contribution History</h3>
            <div style={{ backgroundColor: 'var(--ac-bg-card)', borderRadius: 16, border: '1px solid var(--ac-border)', padding: 24 }}>
              {history.length === 0 ? (
                <Empty description="You haven't made any donations yet." />
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {history.map(item => (
                    <div key={item.id} style={{ padding: 14, backgroundColor: 'var(--ac-bg-input)', borderRadius: 12, border: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <strong style={{ fontSize: 14, color: 'var(--ac-text-primary)', display: 'block' }}>{item.campaign}</strong>
                        <span style={{ fontSize: 12, color: 'var(--ac-text-secondary)' }}>{item.date}</span>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <span style={{ fontSize: 16, fontWeight: 800, color: '#16a34a' }}>+₹{item.amount.toLocaleString()}</span>
                        <div style={{ fontSize: 11, fontWeight: 700, color: '#16a34a' }}>{item.status}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </Spin>

      {/* Razorpay Test Mode Amount Input Modal */}
      <Modal
        title="Make a Contribution"
        open={isContributeOpen}
        onCancel={() => setIsContributeOpen(false)}
        footer={null}
        width={520}
      >
        <Form form={contributeForm} layout="vertical">
          <Form.Item name="campaignId" label="Select Campaign" rules={[{ required: true, message: 'Please select a campaign' }]}>
            <Select
              onChange={handleCampaignSelectChange}
              options={campaigns.map(c => ({
                value: c.id,
                label: `${c.title} (Target: ₹${c.target.toLocaleString()})`
              }))}
            />
          </Form.Item>

          {selectedCamp && (
            <div style={{ padding: 12, backgroundColor: 'var(--ac-bg-input)', borderRadius: 8, marginBottom: 16, fontSize: 13, color: 'var(--ac-text-primary)' }}>
              <div>Target Amount: <strong>₹{selectedCamp.target.toLocaleString()}</strong></div>
              <div>Current Collected: <strong>₹{selectedCamp.raised.toLocaleString()}</strong></div>
              <div>Remaining Capacity: <strong style={{ color: '#16a34a' }}>₹{(selectedCamp.target - selectedCamp.raised).toLocaleString()}</strong></div>
            </div>
          )}

          <Form.Item name="amount" label="Donation Amount (₹)" rules={[{ required: true, message: 'Please enter donation amount' }]}>
            <Input type="number" placeholder="e.g. 5000" />
          </Form.Item>

          <div style={{ padding: '10px 12px', backgroundColor: '#f0fdf4', borderRadius: 8, border: '1px solid #bbf7d0', marginBottom: 20, fontSize: 12.5, color: '#166534', display: 'flex', alignItems: 'center', gap: 8 }}>
            <FiShield size={16} />
            <span>Payments are processed securely via <strong>Razorpay Test Sandbox</strong>.</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
            <Button onClick={() => setIsContributeOpen(false)}>Cancel</Button>
            <Button
              type="primary"
              loading={submittingPayment}
              style={{ backgroundColor: 'var(--ac-brand)', borderColor: 'var(--ac-brand)', fontWeight: 600 }}
              onClick={handleProceedToPayment}
            >
              Continue to Razorpay Payment →
            </Button>
          </div>
        </Form>
      </Modal>
    </AlumniLayout>
  );
};
