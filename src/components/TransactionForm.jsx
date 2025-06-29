import React, { useState, useEffect } from 'react';
import '../styles/TransactionForm.css';
import {
  getSites,
  getVendors,
  addSite,
  addVendor
} from '../firebase/sites';

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

  const [errors, setErrors] = useState({});
  const [siteOptions, setSiteOptions] = useState([]);
  const [vendorOptions, setVendorOptions] = useState([]);
  const [customSite, setCustomSite] = useState('');
  const [customVendor, setCustomVendor] = useState('');
  const [addToSiteList, setAddToSiteList] = useState(false);
  const [addToVendorList, setAddToVendorList] = useState(false);

  useEffect(() => {
    getSites().then(setSiteOptions);
    getVendors().then(setVendorOptions);

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
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.amount) newErrors.amount = 'Amount is required';
    if (!formData.type) newErrors.type = 'Type is required';
    if (!formData.date) newErrors.date = 'Date is required';

    const siteValue = formData.site === 'Other' ? customSite.trim() : formData.site;
    const vendorValue = formData.vendor === 'Other' ? customVendor.trim() : formData.vendor;

    if (!siteValue) newErrors.site = 'Site is required';
    if (!vendorValue) newErrors.vendor = 'Vendor is required';

    if (formData.site === 'Other' && !customSite) newErrors.customSite = 'Enter a site name';
    if (formData.vendor === 'Other' && !customVendor) newErrors.customVendor = 'Enter a vendor name';

    if (!formData.paymentMethod) newErrors.paymentMethod = 'Payment method is required';

    if (formData.paymentMethod === 'cheque') {
      if (!formData.chequeNumber) newErrors.chequeNumber = 'Cheque number is required';
      if (!formData.chequeDate) newErrors.chequeDate = 'Cheque date is required';
      if (!formData.bankName) newErrors.bankName = 'Bank name is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const siteValue = formData.site === 'Other' ? customSite.trim() : formData.site;
    const vendorValue = formData.vendor === 'Other' ? customVendor.trim() : formData.vendor;

    if (formData.site === 'Other' && addToSiteList && customSite) {
      await addSite(customSite);
    }
    if (formData.vendor === 'Other' && addToVendorList && customVendor) {
      await addVendor(customVendor);
    }

    onSave({
      ...formData,
      site: siteValue,
      vendor: vendorValue,
      amount: parseFloat(formData.amount),
    });
  };

  const renderError = (field) => errors[field] && <small className="error-text">{errors[field]}</small>;

  return (
    <form className="transaction-form" onSubmit={handleSubmit}>
      <div className="form-row">
        <div className="form-group">
          <label title="Enter the amount in INR">Amount</label>
          <input type="number" name="amount" value={formData.amount} onChange={handleChange} />
          {renderError('amount')}
        </div>

        <div className="form-group">
          <label title="Choose Credit or Debit">Type</label>
          <select name="type" value={formData.type} onChange={handleChange}>
            <option value="">Select Type</option>
            <option value="credit">Credit 🟢</option>
            <option value="debit">Debit 🔴</option>
          </select>
          {renderError('type')}
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label title="Choose a site or add a new one">Site</label>
          <select name="site" value={formData.site} onChange={handleChange}>
            <option value="">Select Site</option>
            {siteOptions.map((site, idx) => (
              <option key={idx} value={site}>{site}</option>
            ))}
            <option value="Other">Other</option>
          </select>
          {formData.site === 'Other' && (
            <>
              <input type="text" value={customSite} onChange={(e) => setCustomSite(e.target.value)} placeholder="Enter new site" />
              {renderError('customSite')}
              <label>
                <input type="checkbox" checked={addToSiteList} onChange={(e) => setAddToSiteList(e.target.checked)} />
                Add to Site list
              </label>
            </>
          )}
          {renderError('site')}
        </div>

        <div className="form-group">
          <label title="Select a vendor or add a new one">Vendor</label>
          <select name="vendor" value={formData.vendor} onChange={handleChange}>
            <option value="">Select Vendor</option>
            {vendorOptions.map((vendor, idx) => (
              <option key={idx} value={vendor}>{vendor}</option>
            ))}
            <option value="Other">Other</option>
          </select>
          {formData.vendor === 'Other' && (
            <>
              <input type="text" value={customVendor} onChange={(e) => setCustomVendor(e.target.value)} placeholder="Enter new vendor" />
              {renderError('customVendor')}
              <label>
                <input type="checkbox" checked={addToVendorList} onChange={(e) => setAddToVendorList(e.target.checked)} />
                Add to Vendor list
              </label>
            </>
          )}
          {renderError('vendor')}
        </div>
      </div>

      <div className="form-group">
        <label title="Optional note about the transaction">Remark</label>
        <input type="text" name="remark" value={formData.remark} onChange={handleChange} />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label title="Choose the transaction date">Date</label>
          <input type="date" name="date" value={formData.date} onChange={handleChange} />
          {renderError('date')}
        </div>

        <div className="form-group">
          <label title="Mode of payment used">Payment Method</label>
          <select name="paymentMethod" value={formData.paymentMethod} onChange={handleChange}>
            <option value="">Select Payment Method</option>
            <option value="cash">Cash</option>
            <option value="cheque">Cheque</option>
            <option value="upi">UPI</option>
            <option value="bank transfer">Bank Transfer</option>
          </select>
          {renderError('paymentMethod')}
        </div>
      </div>

      {formData.paymentMethod === 'cheque' && (
        <>
          <div className="form-row">
            <div className="form-group">
              <label>Cheque Number</label>
              <input type="text" name="chequeNumber" value={formData.chequeNumber} onChange={handleChange} />
              {renderError('chequeNumber')}
            </div>
            <div className="form-group">
              <label>Cheque Date</label>
              <input type="date" name="chequeDate" value={formData.chequeDate} onChange={handleChange} />
              {renderError('chequeDate')}
            </div>
          </div>
          <div className="form-group">
            <label>Bank Name</label>
            <input type="text" name="bankName" value={formData.bankName} onChange={handleChange} />
            {renderError('bankName')}
          </div>
        </>
      )}

      <div className="form-actions">
        <button type="submit" title="Save this transaction">Save</button>
        <button type="button" className="cancel-btn" onClick={onCancel} title="Discard and close">Cancel</button>
      </div>
    </form>
  );
}