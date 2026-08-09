import React, { useState } from 'react';
import { Tag, Button, Modal, Form, Input, Select, InputNumber, message } from 'antd';
import { FiHeart, FiAward, FiShare2, FiDollarSign, FiCheckCircle, FiClock } from 'react-icons/fi';
import { AlumniLayout } from '../components/alumni/AlumniLayout';
import { useAppContext } from '../context/AppContext';

export const AlumniFundraisingPage = () => {
  const [isContributeOpen, setIsContributeOpen] = useState(false);
  const [contributeForm] = Form.useForm();

  // Summary state from AppContext
  const { alumniDonations: totalDonations, setAlumniDonations: setTotalDonations } = useAppContext();
  const [supportedCount, setSupportedCount] = useState(3);
  const [volunteerHours, setVolunteerHours] = useState(28);

  const [campaigns, setCampaigns] = useState([
    {
      id: 1,
      title: 'Student Need-Based Excellence Scholarship 2026',
      target: 500000,
      raised: 380000,
      donorsCount: 142,
      category: 'Scholarship',
      description: 'Funding full tuition scholarships for 10 high-achieving underprivileged computer science & engineering students.'
    },
    {
      id: 2,
      title: 'Campus High-Performance AI Innovation Lab',
      target: 1200000,
      raised: 920000,
      donorsCount: 88,
      category: 'Infrastructure',
      description: 'Procuring 8 GPU workstations (NVIDIA RTX 4090) for campus AI research and student hackathons.'
    },
    {
      id: 3,
      title: 'Alumni Student Emergency Relief Fund',
      target: 300000,
      raised: 240000,
      donorsCount: 65,
      category: 'Relief',
      description: 'Providing immediate medical and financial assistance to students facing emergency family hardship.'
    }
  ]);

  const [history, setHistory] = useState([
    { id: 101, campaign: 'Student Need-Based Excellence Scholarship', amount: 20000, date: 'June 15, 2026', status: 'Completed' },
    { id: 102, campaign: 'Campus High-Performance AI Innovation Lab', amount: 15000, date: 'May 04, 2026', status: 'Completed' },
    { id: 103, campaign: 'Alumni Student Emergency Relief Fund', amount: 10000, date: 'March 18, 2026', status: 'Completed' }
  ]);

  const handleContributeSubmit = async () => {
    try {
      const values = await contributeForm.validateFields();
      const amountNum = parseFloat(values.amount);
      setTotalDonations(prev => prev + amountNum);

      const newHistoryItem = {
        id: Date.now(),
        campaign: values.campaign,
        amount: amountNum,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        status: 'Completed'
      };

      setHistory([newHistoryItem, ...history]);
      message.success(`Thank you! Your contribution of ₹${amountNum.toLocaleString()} was successful!`);
      contributeForm.resetFields();
      setIsContributeOpen(false);
    } catch (err) {
      console.log(err);
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

        <Button
          type="primary"
          icon={<FiHeart />}
          style={{ backgroundColor: 'var(--ac-brand)', borderColor: 'var(--ac-brand)', height: 42, borderRadius: 8, fontWeight: 600 }}
          onClick={() => setIsContributeOpen(true)}
        >
          Contribute More
        </Button>
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

      {/* 2-Column Main Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: 24 }}>
        {/* Active Campaigns List */}
        <div>
          <h3 style={{ fontSize: 18, fontWeight: 800, color: 'var(--ac-text-primary)', margin: '0 0 16px 0' }}>Active Fundraising Campaigns</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {campaigns.map(camp => {
              const pct = Math.round((camp.raised / camp.target) * 100);
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

                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, fontWeight: 600, color: 'var(--ac-text-primary)', marginBottom: 18 }}>
                    <span>Raised: <strong>₹{camp.raised.toLocaleString()}</strong></span>
                    <span>Target: <strong>₹{camp.target.toLocaleString()}</strong></span>
                  </div>

                  <div style={{ display: 'flex', gap: 10 }}>
                    <Button
                      type="primary"
                      icon={<FiHeart />}
                      style={{ backgroundColor: 'var(--ac-brand)', borderColor: 'var(--ac-brand)', borderRadius: 8, fontWeight: 600, flex: 1 }}
                      onClick={() => {
                        contributeForm.setFieldsValue({ campaign: camp.title, amount: 5000 });
                        setIsContributeOpen(true);
                      }}
                    >
                      Contribute Now
                    </Button>
                    <Button
                      icon={<FiShare2 />}
                      style={{ borderRadius: 8, fontWeight: 600 }}
                      onClick={() => handleShare(camp.title)}
                    >
                      Share Links
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Contribution History Column */}
        <div>
          <h3 style={{ fontSize: 18, fontWeight: 800, color: 'var(--ac-text-primary)', margin: '0 0 16px 0' }}>Your Contribution History</h3>
          <div style={{ backgroundColor: 'var(--ac-bg-card)', borderRadius: 16, border: '1px solid var(--ac-border)', padding: 24 }}>
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
          </div>
        </div>
      </div>

      {/* Contribute Modal */}
      <Modal
        title="Make a Contribution"
        open={isContributeOpen}
        onCancel={() => setIsContributeOpen(false)}
        onOk={handleContributeSubmit}
        okText="Confirm & Donate"
      >
        <Form form={contributeForm} layout="vertical">
          <Form.Item name="campaign" label="Select Campaign" rules={[{ required: true }]}>
            <Select options={[
              { value: 'Student Need-Based Excellence Scholarship 2026', label: 'Student Excellence Scholarship 2026' },
              { value: 'Campus High-Performance AI Innovation Lab', label: 'Campus AI Innovation Lab' },
              { value: 'Alumni Student Emergency Relief Fund', label: 'Student Emergency Relief Fund' }
            ]} />
          </Form.Item>

          <Form.Item name="amount" label="Contribution Amount (₹)" rules={[{ required: true, message: 'Please enter amount' }]}>
            <Input type="number" placeholder="e.g. 5000" />
          </Form.Item>

          <Form.Item name="paymentMethod" label="Payment Method" initialValue="UPI / Net Banking">
            <Select options={[
              { value: 'UPI / Net Banking', label: 'UPI / GPay / PhonePe / Net Banking' },
              { value: 'Credit / Debit Card', label: 'Credit or Debit Card' }
            ]} />
          </Form.Item>
        </Form>
      </Modal>
    </AlumniLayout>
  );
};
