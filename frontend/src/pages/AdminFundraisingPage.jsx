import React, { useState, useEffect, useRef } from 'react';
import { Table, Tag, Input, Button, Modal, Form, Select, Space, Progress, message, DatePicker, Spin } from 'antd';
import { FiPlus, FiSearch, FiDollarSign, FiCalendar, FiHeart, FiTrendingUp, FiEdit2, FiTrash2, FiUsers } from 'react-icons/fi';
import dayjs from 'dayjs';
import { AdminLayout } from '../components/admin/AdminLayout';
import api from '../services/api';

// Helper to determine if a donation payment is successful
const isSuccessfulDonation = (status) => {
  const s = String(status || '').toUpperCase();
  return s === 'SUCCESS' || s === 'SUCCESSFUL' || s === 'COMPLETED';
};

const isTransientError = (error) => {
  if (!error) return false;
  const status = error.response?.status;
  if (status === 502 || status === 503 || status === 504) return true;
  if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') return true;
  if (!error.response && (error.code === 'ERR_NETWORK' || error.message?.toLowerCase().includes('network') || error.message?.toLowerCase().includes('timeout'))) return true;
  return false;
};

export const AdminFundraisingPage = () => {
  const [searchText, setSearchText] = useState('');
  const [activeTab, setActiveTab] = useState('campaigns');
  
  // Filtering States
  const [campaignStatusFilter, setCampaignStatusFilter] = useState('ALL');
  const [donationStatusFilter, setDonationStatusFilter] = useState('ALL');

  // Modals
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState(null);
  const [submittingModal, setSubmittingModal] = useState(false);
  
  const [campaignForm] = Form.useForm();
  const [editForm] = Form.useForm();

  // Data States
  const [campaigns, setCampaigns] = useState([]);
  const [donations, setDonations] = useState([]);
  const [loadingData, setLoadingData] = useState(false);

  const retryCountRef = useRef(0);
  const retryTimerRef = useRef(null);
  const campaignsRef = useRef([]);
  const donationsRef = useRef([]);
  const alumniMapRef = useRef({});

  useEffect(() => {
    return () => {
      if (retryTimerRef.current) {
        clearTimeout(retryTimerRef.current);
      }
    };
  }, []);

  const fetchFundraisingData = async (isRetry = false) => {
    if (!isRetry) {
      setLoadingData(true);
      retryCountRef.current = 0;
      if (retryTimerRef.current) {
        clearTimeout(retryTimerRef.current);
      }
    }

    let hasTransientFailure = false;

    try {
      const results = await Promise.allSettled([
        api.get('/fundraising/getall'),
        api.get('/fundraising/donations/all'),
        api.get('/alumni/getall')
      ]);

      const [campResult, donResult, alumniResult] = results;

      let hasNewCamps = false;
      let hasNewDons = false;

      // 1. Process Campaigns
      if (campResult.status === 'fulfilled' && campResult.value?.data) {
        campaignsRef.current = campResult.value.data;
        hasNewCamps = true;
      } else if (campResult.status === 'rejected') {
        if (isTransientError(campResult.reason)) hasTransientFailure = true;
        console.warn("Could not load campaigns (transient/non-fatal):", campResult.reason?.message);
      }

      // 2. Process Donations
      if (donResult.status === 'fulfilled' && donResult.value?.data) {
        donationsRef.current = donResult.value.data;
        hasNewDons = true;
      } else if (donResult.status === 'rejected') {
        if (isTransientError(donResult.reason)) hasTransientFailure = true;
        console.warn("Could not load donations (transient/non-fatal):", donResult.reason?.message);
      }

      // 3. Process Alumni Lookup
      if (alumniResult.status === 'fulfilled' && alumniResult.value?.data) {
        const alumniList = alumniResult.value.data || [];
        const map = {};
        alumniList.forEach(a => { map[a.alumniId] = a; });
        alumniMapRef.current = map;
      } else if (alumniResult.status === 'rejected') {
        console.warn("Could not load alumni list for donor name resolution:", alumniResult.reason?.message);
      }

      const rawCamps = campaignsRef.current || [];
      const rawDons = donationsRef.current || [];
      const alumniMap = alumniMapRef.current || {};

      if (rawCamps.length > 0 || hasNewCamps || rawDons.length > 0 || hasNewDons) {
        // Calculate total completed donation amounts per campaign fundId
        const raisedByCampaign = {};
        rawDons.forEach(d => {
          const fId = d.fundraising?.fundId || d.fundId;
          if (isSuccessfulDonation(d.paymentStatus) && fId) {
            raisedByCampaign[fId] = (raisedByCampaign[fId] || 0) + Number(d.amount || 0);
          }
        });

        // Map campaigns dynamically using real donation totals
        const mappedCamps = rawCamps.map(c => {
          const target = Number(c.targetAmount || 0);
          const donationSum = raisedByCampaign[c.fundId];
          const raised = (donationSum !== undefined && donationSum > 0) ? donationSum : Number(c.collectedAmount || 0);
          const remaining = Math.max(target - raised, 0);
          const progressPct = target > 0 ? Math.min(Math.max(Math.round((raised / target) * 100), 0), 100) : 0;
          const normStatus = String(c.status || 'ACTIVE').toUpperCase();

          return {
            id: c.fundId,
            title: c.title || 'Untitled Campaign',
            description: c.description || '',
            goal: target,
            raised: raised,
            remaining: remaining,
            progress: progressPct,
            startDate: c.startDate ? new Date(c.startDate).toISOString().split('T')[0] : '',
            endDate: c.endDate ? new Date(c.endDate).toISOString().split('T')[0] : '',
            formattedEndDate: c.endDate ? new Date(c.endDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'N/A',
            status: normStatus,
            rawCampaign: c
          };
        });
        setCampaigns(mappedCamps);

        // Create lookup map for campaigns
        const campMap = {};
        mappedCamps.forEach(c => { campMap[c.id] = c; });

        // Map donations with resolved titles
        const mappedDons = rawDons.map(d => {
          const fundId = d.fundraising?.fundId || d.fundId;
          const matchedCamp = campMap[fundId] || d.fundraising;
          const matchedAlumni = alumniMap[d.alumniId] || d.alumni;

          const donorName = matchedAlumni?.name || d.alumni?.name || (d.alumniId ? `Alumni #${d.alumniId}` : 'Anonymous Donor');
          const campaignTitle = matchedCamp?.title || d.fundraising?.title || (fundId ? `Campaign #${fundId}` : 'General Giving Fund');
          const normPayStatus = String(d.paymentStatus || 'SUCCESS').toUpperCase();

          const dateObj = d.donationDate ? new Date(d.donationDate) : new Date();
          const formattedDate = dateObj.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

          return {
            id: d.donationId,
            txnId: d.transactionId || `TXN-${d.donationId}`,
            donorName: donorName,
            donorType: 'Alumni',
            alumniId: d.alumniId,
            campaignTitle: campaignTitle,
            fundId: fundId,
            amount: Number(d.amount || 0),
            dateObj: dateObj,
            dateStr: formattedDate,
            paymentStatus: normPayStatus,
            rawDonation: d
          };
        });
        setDonations(mappedDons);
      }

      if (hasTransientFailure && retryCountRef.current < 3) {
        retryCountRef.current += 1;
        if (retryTimerRef.current) clearTimeout(retryTimerRef.current);
        retryTimerRef.current = setTimeout(() => {
          fetchFundraisingData(true);
        }, 4000);
      } else if (hasTransientFailure && retryCountRef.current >= 3) {
        if (campaignsRef.current.length === 0 && donationsRef.current.length === 0) {
          message.error("Failed to load fundraising records from server.");
        }
        setLoadingData(false);
      } else if (!hasTransientFailure) {
        retryCountRef.current = 0;
        setLoadingData(false);
      }
    } catch (err) {
      console.error("Error loading fundraising details:", err);
      if (retryCountRef.current >= 3 || !isTransientError(err)) {
        if (campaignsRef.current.length === 0 && donationsRef.current.length === 0) {
          message.error("Failed to load fundraising records from server.");
        }
        setLoadingData(false);
      } else {
        retryCountRef.current += 1;
        if (retryTimerRef.current) clearTimeout(retryTimerRef.current);
        retryTimerRef.current = setTimeout(() => {
          fetchFundraisingData(true);
        }, 4000);
      }
    }
  };

  useEffect(() => {
    fetchFundraisingData();
  }, []);

  useEffect(() => {
    if (editingCampaign) {
      editForm.setFieldsValue({
        title: editingCampaign.title,
        description: editingCampaign.description,
        targetAmount: editingCampaign.goal,
        startDate: editingCampaign.startDate ? dayjs(editingCampaign.startDate) : null,
        endDate: editingCampaign.endDate ? dayjs(editingCampaign.endDate) : null,
        status: editingCampaign.status
      });
    }
  }, [editingCampaign, editForm]);

  // ── STATISTIC CARDS CALCULATIONS ──
  // 1. Total Funds Raised: Sum of completed/successful donations
  const completedDonations = donations.filter(d => isSuccessfulDonation(d.paymentStatus));
  const totalFundsRaised = completedDonations.reduce((sum, d) => sum + d.amount, 0);

  // 2. Active Campaigns Count
  const activeCampaignsCount = campaigns.filter(c => String(c.status).toUpperCase() === 'ACTIVE').length;

  // 3. Total Campaigns Count
  const totalCampaignsCount = campaigns.length;

  // 4. Alumni Contributed (This Month): Unique alumni donors in current calendar month
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();

  const thisMonthAlumniDonors = new Set();
  completedDonations.forEach(d => {
    if (d.alumniId && d.dateObj) {
      if (d.dateObj.getFullYear() === currentYear && d.dateObj.getMonth() === currentMonth) {
        thisMonthAlumniDonors.add(d.alumniId);
      }
    }
  });
  const alumniContributedThisMonth = thisMonthAlumniDonors.size;

  // ── HANDLERS ──
  const handleCreateCampaign = async () => {
    try {
      const values = await campaignForm.validateFields();
      setSubmittingModal(true);

      const payload = {
        title: values.title.trim(),
        description: values.description ? values.description.trim() : '',
        targetAmount: Number(values.targetAmount),
        collectedAmount: 0,
        startDate: values.startDate ? values.startDate.format('YYYY-MM-DD') : new Date().toISOString().split('T')[0],
        endDate: values.endDate ? values.endDate.format('YYYY-MM-DD') : '2026-12-31',
        status: values.status || 'ACTIVE'
      };

      await api.post('/fundraising/add', payload);
      message.success(`Campaign "${values.title}" created successfully!`);
      campaignForm.resetFields();
      setIsCreateOpen(false);
      await fetchFundraisingData();
    } catch (err) {
      if (err.errorFields) return;
      console.error("Error creating campaign:", err);
      const errMsg = err.response?.data?.message || err.response?.data || "Failed to create campaign.";
      message.error(typeof errMsg === 'string' ? errMsg : "Failed to create campaign.");
    } finally {
      setSubmittingModal(false);
    }
  };

  const handleUpdateCampaign = async () => {
    try {
      const values = await editForm.validateFields();
      if (!editingCampaign) return;

      setSubmittingModal(true);

      const payload = {
        ...editingCampaign.rawCampaign,
        fundId: editingCampaign.id,
        title: values.title.trim(),
        description: values.description ? values.description.trim() : '',
        targetAmount: Number(values.targetAmount),
        startDate: values.startDate ? values.startDate.format('YYYY-MM-DD') : editingCampaign.startDate,
        endDate: values.endDate ? values.endDate.format('YYYY-MM-DD') : editingCampaign.endDate,
        status: values.status || 'ACTIVE'
      };

      await api.put('/fundraising/update', payload);
      message.success(`Campaign "${values.title}" updated successfully!`);
      setEditingCampaign(null);
      await fetchFundraisingData();
    } catch (err) {
      if (err.errorFields) return;
      console.error("Error updating campaign:", err);
      const errMsg = err.response?.data?.message || err.response?.data || "Failed to update campaign.";
      message.error(typeof errMsg === 'string' ? errMsg : "Failed to update campaign.");
    } finally {
      setSubmittingModal(false);
    }
  };

  const handleDeleteCampaign = (campaignItem) => {
    Modal.confirm({
      title: `Delete Campaign "${campaignItem.title}"?`,
      content: 'Are you sure you want to delete this fundraising campaign? This operation cannot be undone.',
      okText: 'Delete Campaign',
      okType: 'danger',
      async onOk() {
        try {
          await api.delete(`/fundraising/delete/${campaignItem.id}`);
          message.success('Campaign deleted successfully.');
          await fetchFundraisingData();
        } catch (err) {
          console.error("Error deleting campaign:", err);
          const errStr = typeof err.response?.data === 'string' ? err.response.data : (err.response?.data?.message || '');
          if (errStr.toLowerCase().includes('foreign key') || errStr.toLowerCase().includes('constraint') || err.response?.status === 400 || err.response?.status === 500) {
            message.error("This campaign cannot be deleted because donation records are associated with it.");
          } else {
            message.error("Failed to delete campaign.");
          }
        }
      }
    });
  };

  // ── FILTERING LOGIC ──
  const query = searchText.trim().toLowerCase();

  const filteredCampaigns = campaigns.filter(c => {
    const matchesSearch = !query || c.title.toLowerCase().includes(query) || c.description.toLowerCase().includes(query);
    const matchesStatus = campaignStatusFilter === 'ALL' || c.status === campaignStatusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredDonations = donations.filter(d => {
    const matchesSearch = !query ||
                          d.donorName.toLowerCase().includes(query) ||
                          d.campaignTitle.toLowerCase().includes(query) ||
                          d.txnId.toLowerCase().includes(query);

    let matchesStatus = true;
    if (donationStatusFilter === 'SUCCESS' || donationStatusFilter === 'COMPLETED') {
      matchesStatus = isSuccessfulDonation(d.paymentStatus);
    } else if (donationStatusFilter !== 'ALL') {
      matchesStatus = d.paymentStatus === donationStatusFilter;
    }

    return matchesSearch && matchesStatus;
  });

  // ── TABLE COLUMNS ──
  const campaignColumns = [
    { title: 'Campaign Name', dataIndex: 'title', key: 'title', render: (t) => <strong style={{ color: 'var(--ac-text-primary)' }}>{t}</strong> },
    { title: 'Goal Amount', dataIndex: 'goal', key: 'goal', render: (g) => <span style={{ color: 'var(--ac-text-primary)', fontWeight: 600 }}>₹{g.toLocaleString()}</span> },
    { title: 'Amount Raised', dataIndex: 'raised', key: 'raised', render: (r) => <span style={{ color: 'var(--ac-brand)', fontWeight: 700 }}>₹{r.toLocaleString()}</span> },
    { title: 'Remaining Amount', dataIndex: 'remaining', key: 'remaining', render: (rem) => <span style={{ color: rem === 0 ? '#16a34a' : 'var(--ac-text-secondary)', fontWeight: 600 }}>₹{rem.toLocaleString()}</span> },
    {
      title: 'Progress',
      key: 'progress',
      render: (_, record) => (
        <div style={{ width: 140 }}>
          <Progress percent={record.progress} size="small" strokeColor="var(--ac-brand)" />
        </div>
      )
    },
    { title: 'End Date', dataIndex: 'formattedEndDate', key: 'formattedEndDate', render: (d) => <span style={{ color: 'var(--ac-text-secondary)' }}>{d}</span> },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (s) => (
        <Tag color={s === 'ACTIVE' ? 'success' : s === 'COMPLETED' ? 'processing' : 'default'}>
          {s}
        </Tag>
      )
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button
            type="text"
            icon={<FiEdit2 />}
            style={{ color: 'var(--ac-brand)' }}
            onClick={() => setEditingCampaign(record)}
          />
          <Button
            type="text"
            danger
            icon={<FiTrash2 />}
            onClick={() => handleDeleteCampaign(record)}
          />
        </Space>
      )
    }
  ];

  const donationColumns = [
    { title: 'Donor Name', dataIndex: 'donorName', key: 'donorName', render: (t) => <strong style={{ color: 'var(--ac-text-primary)' }}>{t}</strong> },
    { title: 'Donor Type', dataIndex: 'donorType', key: 'donorType', render: (t) => <Tag color="blue">{t}</Tag> },
    { title: 'Campaign Target', dataIndex: 'campaignTitle', key: 'campaignTitle', render: (t) => <span style={{ color: 'var(--ac-text-secondary)' }}>{t}</span> },
    { title: 'Amount Contributed', dataIndex: 'amount', key: 'amount', render: (a) => <span style={{ color: 'var(--ac-text-primary)', fontWeight: 700 }}>₹{a.toLocaleString()}</span> },
    { title: 'Date', dataIndex: 'dateStr', key: 'dateStr', render: (d) => <span style={{ color: 'var(--ac-text-secondary)' }}>{d}</span> },
    { title: 'Transaction Ref ID', dataIndex: 'txnId', key: 'txnId', render: (id) => <code style={{ color: 'var(--ac-text-secondary)' }}>{id}</code> },
    {
      title: 'Payment Status',
      dataIndex: 'paymentStatus',
      key: 'paymentStatus',
      render: (s) => {
        const isSuccess = isSuccessfulDonation(s);
        return (
          <Tag color={isSuccess ? 'success' : s === 'PENDING' ? 'warning' : 'error'}>
            {isSuccess ? 'SUCCESS' : s}
          </Tag>
        );
      }
    }
  ];

  return (
    <AdminLayout onSearch={setSearchText}>
      {/* Header Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: 'var(--ac-text-primary)', margin: '0 0 4px 0' }}>Fundraising Management</h1>
          <p style={{ fontSize: 13.5, color: 'var(--ac-text-secondary)', margin: 0 }}>
            Create and manage fundraising campaigns and monitor alumni donations.
          </p>
        </div>

        <Button
          type="primary"
          icon={<FiPlus />}
          style={{ backgroundColor: 'var(--ac-brand)', border: 'none', height: 42, borderRadius: 8, fontWeight: 600 }}
          onClick={() => setIsCreateOpen(true)}
        >
          Create Campaign
        </Button>
      </div>

      {/* 4 Summary Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20, marginBottom: 24 }}>
        <div style={{ backgroundColor: 'var(--ac-bg-card)', borderRadius: 14, border: '1px solid var(--ac-border)', padding: 20 }}>
          <div style={{ fontSize: 12, color: 'var(--ac-text-secondary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 }}>Total Funds Raised</div>
          <div style={{ fontSize: 26, fontWeight: 800, color: 'var(--ac-brand)', marginTop: 6 }}>
            {loadingData ? <Spin size="small" /> : `₹${totalFundsRaised.toLocaleString()}`}
          </div>
        </div>

        <div style={{ backgroundColor: 'var(--ac-bg-card)', borderRadius: 14, border: '1px solid var(--ac-border)', padding: 20 }}>
          <div style={{ fontSize: 12, color: 'var(--ac-text-secondary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 }}>Active Campaigns</div>
          <div style={{ fontSize: 26, fontWeight: 800, color: 'var(--ac-text-primary)', marginTop: 6 }}>
            {loadingData ? <Spin size="small" /> : activeCampaignsCount}
          </div>
        </div>

        <div style={{ backgroundColor: 'var(--ac-bg-card)', borderRadius: 14, border: '1px solid var(--ac-border)', padding: 20 }}>
          <div style={{ fontSize: 12, color: 'var(--ac-text-secondary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 }}>Total Campaigns</div>
          <div style={{ fontSize: 26, fontWeight: 800, color: 'var(--ac-text-primary)', marginTop: 6 }}>
            {loadingData ? <Spin size="small" /> : totalCampaignsCount}
          </div>
        </div>

        <div style={{ backgroundColor: 'var(--ac-bg-card)', borderRadius: 14, border: '1px solid var(--ac-border)', padding: 20 }}>
          <div style={{ fontSize: 12, color: 'var(--ac-text-secondary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 }}>Alumni Contributed (This Month)</div>
          <div style={{ fontSize: 26, fontWeight: 800, color: '#16a34a', marginTop: 6 }}>
            {loadingData ? <Spin size="small" /> : `${alumniContributedThisMonth} Donors`}
          </div>
        </div>
      </div>

      {/* Main Content Area with Tabs */}
      <div style={{ backgroundColor: 'var(--ac-bg-card)', borderRadius: 16, border: '1px solid var(--ac-border)', padding: 24, marginBottom: 24 }}>
        {/* Tab & Search / Filter Controls */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16, marginBottom: 20 }}>
          <div style={{ display: 'flex', gap: 10 }}>
            <button
              onClick={() => setActiveTab('campaigns')}
              style={{
                padding: '8px 18px',
                borderRadius: 8,
                border: activeTab === 'campaigns' ? '1px solid var(--ac-brand)' : '1px solid var(--ac-border)',
                backgroundColor: activeTab === 'campaigns' ? 'var(--ac-brand)' : 'transparent',
                color: activeTab === 'campaigns' ? '#ffffff' : 'var(--ac-text-primary)',
                fontWeight: 600,
                fontSize: 13.5,
                cursor: 'pointer'
              }}
            >
              Funding Campaigns
            </button>

            <button
              onClick={() => setActiveTab('donations')}
              style={{
                padding: '8px 18px',
                borderRadius: 8,
                border: activeTab === 'donations' ? '1px solid var(--ac-brand)' : '1px solid var(--ac-border)',
                backgroundColor: activeTab === 'donations' ? 'var(--ac-brand)' : 'transparent',
                color: activeTab === 'donations' ? '#ffffff' : 'var(--ac-text-primary)',
                fontWeight: 600,
                fontSize: 13.5,
                cursor: 'pointer'
              }}
            >
              Donation Log
            </button>
          </div>

          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
            <Input
              prefix={<FiSearch style={{ color: 'var(--ac-text-secondary)', marginRight: 6 }} />}
              placeholder={activeTab === 'campaigns' ? "Search campaign name or description..." : "Search donor, campaign, or Txn ID..."}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: 260, borderRadius: 8 }}
            />

            {activeTab === 'campaigns' ? (
              <Select
                value={campaignStatusFilter}
                onChange={setCampaignStatusFilter}
                options={[
                  { value: 'ALL', label: 'All Statuses' },
                  { value: 'ACTIVE', label: 'Active' },
                  { value: 'UPCOMING', label: 'Upcoming' },
                  { value: 'COMPLETED', label: 'Completed' },
                  { value: 'CLOSED', label: 'Closed' },
                  { value: 'CANCELLED', label: 'Cancelled' }
                ]}
                style={{ width: 150 }}
              />
            ) : (
              <Select
                value={donationStatusFilter}
                onChange={setDonationStatusFilter}
                options={[
                  { value: 'ALL', label: 'All Payment Statuses' },
                  { value: 'SUCCESS', label: 'Success / Completed' },
                  { value: 'PENDING', label: 'Pending' },
                  { value: 'FAILED', label: 'Failed' }
                ]}
                style={{ width: 180 }}
              />
            )}
          </div>
        </div>

        {/* Data Tables */}
        {loadingData ? (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <Spin size="large" />
            <p style={{ marginTop: 16, color: 'var(--ac-text-secondary)', fontWeight: 600 }}>Loading fundraising records...</p>
          </div>
        ) : activeTab === 'campaigns' ? (
          <Table
            dataSource={filteredCampaigns}
            columns={campaignColumns}
            rowKey="id"
            pagination={{ pageSize: 8 }}
            locale={{ emptyText: 'No fundraising campaigns found.' }}
          />
        ) : (
          <Table
            dataSource={filteredDonations}
            columns={donationColumns}
            rowKey="id"
            pagination={{ pageSize: 8 }}
            locale={{ emptyText: 'No donation records found.' }}
          />
        )}
      </div>

      {/* Create Campaign Modal */}
      <Modal
        title="Create New Fundraising Campaign"
        open={isCreateOpen}
        onCancel={() => setIsCreateOpen(false)}
        onOk={handleCreateCampaign}
        okText="Create Campaign"
        confirmLoading={submittingModal}
      >
        <Form form={campaignForm} layout="vertical" initialValues={{ status: 'ACTIVE' }}>
          <Form.Item
            name="title"
            label="Campaign Name / Title"
            rules={[{ required: true, message: 'Please enter campaign name' }]}
          >
            <Input placeholder="e.g. Scholarship Support 2026" />
          </Form.Item>

          <Form.Item
            name="targetAmount"
            label="Goal Amount (INR)"
            rules={[
              { required: true, message: 'Please enter goal amount' },
              {
                validator: (_, val) => {
                  if (val && Number(val) <= 0) {
                    return Promise.reject(new Error('Goal amount must be greater than 0'));
                  }
                  return Promise.resolve();
                }
              }
            ]}
          >
            <Input type="number" placeholder="e.g. 50000" />
          </Form.Item>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <Form.Item
              name="startDate"
              label="Start Date"
              rules={[{ required: true, message: 'Please select start date' }]}
            >
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item
              name="endDate"
              label="End Date"
              rules={[{ required: true, message: 'Please select end date' }]}
            >
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>
          </div>

          <Form.Item
            name="status"
            label="Campaign Status"
            rules={[{ required: true }]}
          >
            <Select options={[
              { value: 'ACTIVE', label: 'Active' },
              { value: 'UPCOMING', label: 'Upcoming' },
              { value: 'COMPLETED', label: 'Completed' },
              { value: 'CLOSED', label: 'Closed' },
              { value: 'CANCELLED', label: 'Cancelled' }
            ]} />
          </Form.Item>

          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: 'Please enter campaign description' }]}
          >
            <Input.TextArea rows={3} placeholder="Describe project funding goals, impact, and target outcomes..." />
          </Form.Item>
        </Form>
      </Modal>

      {/* Edit Campaign Modal */}
      <Modal
        title={`Edit Campaign – "${editingCampaign?.title}"`}
        open={!!editingCampaign}
        onCancel={() => setEditingCampaign(null)}
        onOk={handleUpdateCampaign}
        okText="Save Changes"
        confirmLoading={submittingModal}
      >
        <Form form={editForm} layout="vertical">
          <Form.Item
            name="title"
            label="Campaign Name / Title"
            rules={[{ required: true, message: 'Please enter campaign name' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="targetAmount"
            label="Goal Amount (INR)"
            rules={[
              { required: true, message: 'Please enter goal amount' },
              {
                validator: (_, val) => {
                  if (val && Number(val) <= 0) {
                    return Promise.reject(new Error('Goal amount must be greater than 0'));
                  }
                  return Promise.resolve();
                }
              }
            ]}
          >
            <Input type="number" />
          </Form.Item>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <Form.Item name="startDate" label="Start Date" rules={[{ required: true }]}>
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item name="endDate" label="End Date" rules={[{ required: true }]}>
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>
          </div>

          <Form.Item name="status" label="Campaign Status" rules={[{ required: true }]}>
            <Select options={[
              { value: 'ACTIVE', label: 'Active' },
              { value: 'UPCOMING', label: 'Upcoming' },
              { value: 'COMPLETED', label: 'Completed' },
              { value: 'CLOSED', label: 'Closed' },
              { value: 'CANCELLED', label: 'Cancelled' }
            ]} />
          </Form.Item>

          <Form.Item name="description" label="Description" rules={[{ required: true }]}>
            <Input.TextArea rows={3} />
          </Form.Item>
        </Form>
      </Modal>
    </AdminLayout>
  );
};
