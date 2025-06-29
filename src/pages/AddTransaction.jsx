import React, { useState } from 'react';
import { addTransaction } from '../firebase/transactions';
import '../styles/AddTransaction.css'; // if needed

export default function AddTransaction() {
  const [form, setForm] = useState({
    amount: '',
    site: '',
    vendor: '',
    type: 'credit',
    remark: '',
    date: new Date().toISOString().substring(0, 10),
    paymentMethod: '',
    chequeNumber: '',
    chequeDate: '',
    bankName: '',
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    if (
      !form.amount ||
      !form.site ||
      !form.vendor ||
      !form.type ||
      !form.date ||
      !form.paymentMethod
    ) {
      setMessage('❌ Please fill all required fields.');
      setLoading(false);
      return;
    }

    if (form.paymentMethod === 'cheque') {
      if (!form.chequeNumber || !form.chequeDate || !form.bankName) {
        setMessage('❌ Please fill all cheque details.');
        setLoading(false);
        return;
      }
    }

    const payload = {
      ...form,
      amount: Number(form.amount),
      date: new Date(form.date + 'T00:00:00'),
    };

    try {
      const id = await addTransaction(payload);
      console.log("✅ Transaction added with ID:", id);
      setMessage('✅ Transaction added successfully!');
      setForm({
        amount: '',
        site: '',
        vendor: '',
        type: 'credit',
        remark: '',
        date: new Date().toISOString().substring(0, 10),
        paymentMethod: '',
        chequeNumber: '',
        chequeDate: '',
        bankName: '',
      });
    } catch (err) {
      console.error("🔥 Error adding transaction:", err);
      setMessage('❌ Failed to add transaction.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: 'auto', padding: '2rem' }}>
      <h2>Add Transaction</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Amount:</label>
          <input
            type="number"
            name="amount"
            value={form.amount}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Site:</label>
          <input
            type="text"
            name="site"
            value={form.site}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Vendor:</label>
          <input
            type="text"
            name="vendor"
            value={form.vendor}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Type:</label>
          <div>
            <label style={{ color: 'green' }}>
              <input
                type="radio"
                name="type"
                value="credit"
                checked={form.type === 'credit'}
                onChange={handleChange}
              />
              Credit
            </label>
            <label style={{ color: 'red', marginLeft: '1rem' }}>
              <input
                type="radio"
                name="type"
                value="debit"
                checked={form.type === 'debit'}
                onChange={handleChange}
              />
              Debit
            </label>
          </div>
        </div>

        <div>
          <label>Remark:</label>
          <textarea
            name="remark"
            value={form.remark}
            onChange={handleChange}
          ></textarea>
        </div>

        <div>
          <label>Date:</label>
          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Payment Method:</label>
          <select
            name="paymentMethod"
            value={form.paymentMethod}
            onChange={handleChange}
            required
          >
            <option value="">Select Method</option>
            <option value="cash">Cash</option>
            <option value="cheque">Cheque</option>
            <option value="upi">UPI</option>
            <option value="bank transfer">Bank Transfer</option>
          </select>
        </div>

        {/* Show cheque details only if cheque is selected */}
        {form.paymentMethod === 'cheque' && (
          <>
            <div>
              <label>Cheque Number:</label>
              <input
                type="text"
                name="chequeNumber"
                value={form.chequeNumber}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label>Cheque Date:</label>
              <input
                type="date"
                name="chequeDate"
                value={form.chequeDate}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label>Bank Name:</label>
              <input
                type="text"
                name="bankName"
                value={form.bankName}
                onChange={handleChange}
                required
              />
            </div>
          </>
        )}

        <button type="submit" disabled={loading}>
          {loading ? 'Saving...' : 'Add Transaction'}
        </button>
      </form>

      {message && <p style={{ marginTop: '1rem' }}>{message}</p>}
    </div>
  );
}