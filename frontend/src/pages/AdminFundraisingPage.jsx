import React, { useState } from 'react';
import { Table, Tag, Input, Button, Modal, Form, Select, Space, Progress, message } from 'antd';
import { FiPlus, FiSearch, FiDollarSign, FiCalendar, FiHeart, FiTrendingUp } from 'react-icons/fi';
import { AdminLayout } from '../components/admin/AdminLayout';
import { useAppContext } from '../context/AppContext';

export const AdminFundraisingPage = () => {
  const { alumniDonations } = useAppContext();
  const [searchText, setSearchText] = useState('');
  const [isCampaignModalOpen, setIsCampaignModalOpen] = useState(false);
  const [campaignForm] = Form.useForm();
  const [activeTab, setActiveTab] = useState('campaigns');

  // Campaigns list state
  const [campaigns, setCampaigns] = useState([
    { id: 1, name: 'AI Innovation Lab Fund', description: 'Upgrading the institutional AI lab with high-end workstation GPUs for advanced research.', goal: 500000, raised: 320000, startDate: '2026-06-01', endDate: '2026-09-30', status: 'Active' },
    { id: 2, name: 'Student Scholarship Program 2026', description: 'Financial aid support for meritorious students from economically weaker sections.', goal: 1000000, raised: 650000 + alumniDonations, startDate: '2026-05-15', endDate: '2026-12-31', status: 'Active' },
    { id: 3, name: 'New Sports Complex Construction', description: 'Funding the extension of the campus indoor badminton court and gymnasium.', goal: 800000, raised: 800000, startDate: '2026-01-10', endDate: '2026-07-30', status: 'Completed' }
  ]);

  // Donations list state
  const [donations, setDonations] = useState([
    { id: 'TXN100234', donorName: 'Rahul Kumar', donorType: 'Alumni', campaign: 'Student Scholarship Program 2026', amount: 15000, date: '2026-08-05', status: 'Completed' },
    { id: 'TXN100235', donorName: 'Arun Kumar', donorType: 'Alumni', campaign: 'AI Innovation Lab Fund', amount: 35000, date: '2026-08-04', status: 'Completed' },
    { id: 'TXN100236', donorName: 'Priya Sankar', donorType: 'Alumni', campaign: 'Student Scholarship Program 2026', amount: 20000, date: '2026-08-01', status: 'Completed' },
    { id: 'TXN100237', donorName: 'Dr. Sarah Jenkins', donorType: 'Corporate Partner', campaign: 'AI Innovation Lab Fund', amount: 100000, date: '2026-07-28', status: 'Completed' }
  ]);

  const handleCreateCampaign = async () => {
    try {
      const values = await campaignForm.validateFields();
      const newCampaign = {
        id: Date.now(),
        name: values.name,
        description: values.description,
        goal: Number(values.goal),
        raised: 0,
        startDate: values.startDate || '2026-08-09',
        endDate: values.endDate || '2026-12-31',
        status: 'Active'
      };
      setCampaigns([newCampaign, ...campaigns]);
      message.success(`Campaign "${values.name}" created successfully!`);
      campaignForm.resetFields();
      setIsCampaignModalOpen(false);
    } catch (err) {
      console.log(err);
    }
  };

  const query = searchText.trim().toLowerCase();
  const filteredCampaigns = campaigns.filter(c => c.name.toLowerCase().includes(query));
  const filteredDonations = donations.filter(d => d.donorName.toLowerCase().includes(query) || d.campaign.toLowerCase().includes(query));

  const campaignColumns = [
    { title: 'Campaign Name', dataIndex: 'name', key: 'name', render: (t) => <strong style={{ color: 'var(--ac-text-primary)' }}>{t}</strong> },
    { title: 'Goal Amount', dataIndex: 'goal', key: 'goal', render: (g) => <span style={{ color: 'var(--ac-text-primary)', fontWeight: 600 }}>₹{g.toLocaleString()}</span> },
    { title: 'Amount Raised', dataIndex: 'raised', key: 'raised', render: (r) => <span style={{ color: 'var(--ac-brand)', fontWeight: 700 }}>₹{r.toLocaleString()}</span> },
    {
      title: 'Progress',
      key: 'progress',
      render: (_, record) => {
        const pct = Math.min(Math.round((record.raised / record.goal) * 100), 100);
        return (
          <div style={{ width: 140 }}>
            <Progress percent={pct} size="small" strokeColor="var(--ac-brand)" />
          </div>
        );
      }
    },
    { title: 'End Date', dataIndex: 'endDate', key: 'endDate', render: (d) => <span style={{ color: 'var(--ac-text-secondary)' }}>{d}</span> },
    { title: 'Status', dataIndex: 'status', key: 'status', render: (s) => <Tag color={s === 'Active' ? 'success' : 'default'}>{s.toUpperCase()}</Tag> }
  ];

  const donationColumns = [
    { title: 'Donor Name', dataIndex: 'donorName', key: 'donorName', render: (t) => <strong style={{ color: 'var(--ac-text-primary)' }}>{t}</strong> },
    { title: 'Donor Type', dataIndex: 'donorType', key: 'donorType', render: (t) => <Tag color={t === 'Alumni' ? 'blue' : 'green'}>{t}</Tag> },
    { title: 'Campaign Target', dataIndex: 'campaign', key: 'campaign', render: (t) => <span style={{ color: 'var(--ac-text-secondary)' }}>{t}</span> },
    { title: 'Amount Contributed', dataIndex: 'amount', key: 'amount', render: (a) => <span style={{ color: 'var(--ac-text-primary)', fontWeight: 700 }}>₹{a.toLocaleString()}</span> },
    { title: 'Date', dataIndex: 'date', key: 'date', render: (d) => <span style={{ color: 'var(--ac-text-secondary)' }}>{d}</span> },
    { title: 'Transaction Ref ID', dataIndex: 'id', key: 'id', render: (id) => <code style={{ color: 'var(--ac-text-secondary)' }}>{id}</code> },
    { title: 'Payment Status', dataIndex: 'status', key: 'status', render: (s) => <Tag color="success">SUCCESS</Tag> }
  ];

  const totalRaisedSum = campaigns.reduce((acc, c) => acc + c.raised, 0);

  return (
    <AdminLayout onSearch={setSearchText}>
      {/* Title Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: 'var(--ac-text-primary)', margin: '0 0 4px 0' }}>Fundraising & Campaigns</h1>
          <p style={{ fontSize: 13.5, color: 'var(--ac-text-secondary)', margin: 0 }}>
            Create institutional funding campaigns, set goals, track donation receipts, and monitor network contributions.
          </p>
        </div>

        <Button
          type="primary"
          icon={<FiPlus />}
          style={{ backgroundColor: 'var(--ac-brand)', border: 'none', height: 42, borderRadius: 8, fontWeight: 600 }}
          onClick={() => setIsCampaignModalOpen(true)}
        >
          Create Campaign
        </Button>
      </div>

      {/* Summary Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20, marginBottom: 24 }}>
        <div style={{ backgroundColor: 'var(--ac-bg-card)', borderRadius: 12, border: '1px solid var(--ac-border)', padding: 20 }}>
          <div style={{ fontSize: 12, color: 'var(--ac-text-secondary)', fontWeight: 700, textTransform: 'uppercase' }}>Total Funds Raised</div>
          <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--ac-brand)', marginTop: 4 }}>₹{totalRaisedSum.toLocaleString()}</div>
        </div>
        <div style={{ backgroundColor: 'var(--ac-bg-card)', borderRadius: 12, border: '1px solid var(--ac-border)', padding: 20 }}>
          <div style={{ fontSize: 12, color: 'var(--ac-text-secondary)', fontWeight: 700, textTransform: 'uppercase' }}>Active Campaigns</div>
          <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--ac-text-primary)', marginTop: 4 }}>{campaigns.filter(c => c.status === 'Active').length} Active</div>
        </div>
        <div style={{ backgroundColor: 'var(--ac-bg-card)', borderRadius: 12, border: '1px solid var(--ac-border)', padding: 20 }}>
          <div style={{ fontSize: 12, color: 'var(--ac-text-secondary)', fontWeight: 700, textTransform: 'uppercase' }}>Alumni Contributed (Month)</div>
          <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--ac-text-primary)', marginTop: 4 }}>₹{alumniDonations.toLocaleString()}</div>
        </div>
      </div>

      {/* Section Selection Tabs */}
      <div style={{ backgroundColor: 'var(--ac-bg-card)', borderRadius: 14, border: '1px solid var(--ac-border)', padding: 20, marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16, marginBottom: 20 }}>
          <div style={{ display: 'flex', gap: 8 }}>
            <Button
              type={activeTab === 'campaigns' ? 'primary' : 'default'}
              onClick={() => setActiveTab('campaigns')}
              style={activeTab === 'campaigns' ? { backgroundColor: 'var(--ac-brand)', border: 'none' } : {}}
            >
              Funding Campaigns
            </Button>
            <Button
              type={activeTab === 'donations' ? 'primary' : 'default'}
              onClick={() => setActiveTab('donations')}
              style={activeTab === 'donations' ? { backgroundColor: 'var(--ac-brand)', border: 'none' } : {}}
            >
              Donations Log
            </Button>
          </div>
          <Input
            prefix={<FiSearch style={{ color: 'var(--ac-text-secondary)', marginRight: 6 }} />}
            placeholder="Search campaigns or donors..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 280, borderRadius: 8 }}
          />
        </div>

        {activeTab === 'campaigns' ? (
          <Table dataSource={filteredCampaigns} columns={campaignColumns} rowKey="id" pagination={{ pageSize: 5 }} />
        ) : (
          <Table dataSource={filteredDonations} columns={donationColumns} rowKey="id" pagination={{ pageSize: 5 }} />
        )}
      </div>

      {/* Create Campaign Modal */}
      <Modal
        title="Create New Fundraising Campaign"
        open={isCampaignModalOpen}
        onCancel={() => setIsCampaignModalOpen(false)}
        onOk={handleCreateCampaign}
        okText="Create Campaign"
      >
        <Form form={campaignForm} layout="vertical">
          <Form.Item name="name" label="Campaign Name" rules={[{ required: true }]}>
            <Input placeholder="e.g. AI Innovation Lab Fund" />
          </Form.Item>
          <Form.Item name="goal" label="Goal Amount (INR)" rules={[{ required: true }]}>
            <Input type="number" placeholder="e.g. 500000" />
          </Form.Item>
          <Form.Item name="startDate" label="Start Date (YYYY-MM-DD)">
            <Input placeholder="e.g. 2026-08-09" />
          </Form.Item>
          <Form.Item name="endDate" label="End Date (YYYY-MM-DD)">
            <Input placeholder="e.g. 2026-12-31" />
          </Form.Item>
          <Form.Item name="description" label="Description" rules={[{ required: true }]}>
            <Input.TextArea rows={3} placeholder="Provide details on project funding goals and how contributions will be allocated..." />
          </Form.Item>
        </Form>
      </Modal>
    </AdminLayout>
  );
};
