import React, { useState, useEffect } from 'react';
import '../styles/TransactionForm.css';

export default function TransactionForm({ initialData = {}, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    amount: '',
    site: '',
    vendor: '',
    type: '',
    remark: '',
    date: '',
    paymentMethod: '',
    chequeNumber: '',
    chequeDate: '',
    bankName: '',
  });

  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      const txnDate = initialData.date?.seconds
        ? new Date(initialData.date.seconds * 1000)
        : new Date(initialData.date);

      const formattedDate = txnDate.toISOString().split('T')[0];

      setFormData({
        amount: initialData.amount || '',
        site: initialData.site || '',
        vendor: initialData.vendor || '',
        type: initialData.type || '',
        remark: initialData.remark || '',
        date: formattedDate || '',
        paymentMethod: initialData.paymentMethod || '',
        chequeNumber: initialData.chequeNumber || '',
        chequeDate: initialData.chequeDate || '',
        bankName: initialData.bankName || '',
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.amount || !formData.site || !formData.vendor || !formData.type || !formData.date) {
      alert('Please fill all required fields.');
      return;
    }

    onSave({
      ...formData,
      amount: parseFloat(formData.amount),
    });
  };

  return (
    <form className="transaction-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label>Amount</label>
        <input
          type="number"
          name="amount"
          value={formData.amount}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label>Site</label>
        <input
          type="text"
          name="site"
          value={formData.site}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label>Vendor</label>
        <input
          type="text"
          name="vendor"
          value={formData.vendor}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label>Type</label>
        <select
          name="type"
          value={formData.type}
          onChange={handleChange}
          required
        >
          <option value="">Select Type</option>
          <option value="credit">Credit 🟢</option>
          <option value="debit">Debit 🔴</option>
        </select>
      </div>

      <div className="form-group">
        <label>Remark</label>
        <input
          type="text"
          name="remark"
          value={formData.remark}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label>Date</label>
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label>Payment Method</label>
        <select
          name="paymentMethod"
          value={formData.paymentMethod}
          onChange={handleChange}
          required
        >
          <option value="">Select Payment Method</option>
          <option value="cash">Cash</option>
          <option value="cheque">Cheque</option>
          <option value="upi">UPI</option>
          <option value="bank transfer">Bank Transfer</option>
        </select>
      </div>

      {formData.paymentMethod === 'cheque' && (
        <>
          <div className="form-group">
            <label>Cheque Number</label>
            <input
              type="text"
              name="chequeNumber"
              value={formData.chequeNumber}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Cheque Date</label>
            <input
              type="date"
              name="chequeDate"
              value={formData.chequeDate}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Bank Name</label>
            <input
              type="text"
              name="bankName"
              value={formData.bankName}
              onChange={handleChange}
              required
            />
          </div>
        </>
      )}

      <div className="form-actions">
        <button type="submit">Save</button>
        <button type="button" onClick={onCancel} className="cancel-btn">Cancel</button>
      </div>
    </form>
  );
}