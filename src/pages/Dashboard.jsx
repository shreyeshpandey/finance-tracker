import React, { useEffect, useState } from 'react';
import { getAllTransactions } from '../firebase/transactions';
import '../styles/Dashboard.css';
import ExportButtons from '../components/ExportButtons';
import { doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import TransactionForm from '../components/TransactionForm';
import '../styles/Modal.css';
import { toast } from 'react-toastify';
import Modal from '../components/Modal';

export default function Dashboard() {
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [filters, setFilters] = useState({
    site: '',
    type: '',
    vendor: '',
    month: '',
  });

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    const data = await getAllTransactions();
    setTransactions(data);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const filteredTransactions = transactions.filter((txn) => {
    const txnDate = new Date(txn.date.seconds * 1000);
    const txnMonth = `${txnDate.getFullYear()}-${String(txnDate.getMonth() + 1).padStart(2, '0')}`;
    return (
      (filters.site === '' || txn.site.toLowerCase().includes(filters.site.toLowerCase())) &&
      (filters.type === '' || txn.type === filters.type) &&
      (filters.vendor === '' || txn.vendor.toLowerCase().includes(filters.vendor.toLowerCase())) &&
      (filters.month === '' || txnMonth === filters.month)
    );
  });

  const summary = filteredTransactions.reduce(
    (acc, txn) => {
      if (txn.type === 'credit') acc.credit += txn.amount;
      else if (txn.type === 'debit') acc.debit += txn.amount;
      return acc;
    },
    { credit: 0, debit: 0 }
  );

  const net = summary.credit - summary.debit;

  const handleEdit = (txn) => {
    setEditingTransaction(txn);
  };

  const handleDelete = async (id) => {
    const confirm = window.confirm('Are you sure you want to delete this transaction?');
    if (!confirm) return;

    try {
      await deleteDoc(doc(db, 'transactions', id));
      setTransactions((prev) => prev.filter((t) => t.id !== id));
      toast.success('Transaction deleted successfully');
    } catch (err) {
      toast.error('Failed to delete transaction.');
    }
  };

  return (
    <div className="dashboard-container">
      <h2>Transaction Dashboard</h2>

      {/* Filters */}
      <div className="filters">
        <input
          type="text"
          name="site"
          placeholder="Filter by Site"
          value={filters.site}
          onChange={handleFilterChange}
        />
        <input
          type="text"
          name="vendor"
          placeholder="Filter by Vendor"
          value={filters.vendor}
          onChange={handleFilterChange}
        />
        <select name="type" value={filters.type} onChange={handleFilterChange}>
          <option value="">All Types</option>
          <option value="credit">Credit 🟢</option>
          <option value="debit">Debit 🔴</option>
        </select>
        <input
          type="month"
          name="month"
          value={filters.month}
          onChange={handleFilterChange}
        />
      </div>

      <ExportButtons data={filteredTransactions} filters={filters} onEdit={handleEdit} onDelete={handleDelete} />

      <div className="summary-box">
        <p><strong>Total Credit:</strong> ₹{summary.credit.toLocaleString()}</p>
        <p><strong>Total Debit:</strong> ₹{summary.debit.toLocaleString()}</p>
        <p><strong>Net Balance:</strong> ₹{net.toLocaleString()}</p>
      </div>

      {/* Edit Form */}
      {editingTransaction && (
        <Modal title="Edit Transaction" onClose={() => setEditingTransaction(null)}>
          <TransactionForm
            initialData={editingTransaction}
            onSave={async (updatedData) => {
              try {
                const docRef = doc(db, 'transactions', editingTransaction.id);
                await updateDoc(docRef, {
                  ...updatedData,
                  date: new Date(updatedData.date + 'T00:00:00'),
                });
                toast.success('Transaction updated successfully');
                setEditingTransaction(null);
                fetchTransactions();
              } catch (err) {
                toast.error('Failed to update transaction.');
              }
            }}
            onCancel={() => setEditingTransaction(null)}
          />
        </Modal>
      )}

      {/* Table */}
      <table className="txn-table">
        <thead>
          <tr>
            <th>Amount</th>
            <th>Site</th>
            <th>Vendor</th>
            <th>Type</th>
            <th>Remark</th>
            <th>Date</th>
            <th>Payment</th>
            <th>Cheque Details</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredTransactions.length === 0 ? (
            <tr>
              <td colSpan="9">No transactions found.</td>
            </tr>
          ) : (
            filteredTransactions.map((txn) => {
              const txnDate = new Date(txn.date.seconds * 1000);
              const formattedDate = txnDate.toLocaleDateString();

              return (
                <tr key={txn.id}>
                  <td>₹{txn.amount}</td>
                  <td>{txn.site}</td>
                  <td>{txn.vendor}</td>
                  <td>
                    <span className={txn.type === 'credit' ? 'credit' : 'debit'}>
                      {txn.type}
                    </span>
                  </td>
                  <td>{txn.remark}</td>
                  <td>{formattedDate}</td>
                  <td>{txn.paymentMethod || '-'}</td>
                  <td>
                    {txn.paymentMethod === 'cheque' ? (
                      <>
                        <div><strong>No:</strong> {txn.chequeNumber || '-'}</div>
                        <div><strong>Date:</strong> {txn.chequeDate || '-'}</div>
                        <div><strong>Bank:</strong> {txn.bankName || '-'}</div>
                      </>
                    ) : (
                      '-'
                    )}
                  </td>
                  <td>
                    <button onClick={() => handleEdit(txn)}>Edit</button>
                    <button onClick={() => handleDelete(txn.id)} style={{ marginLeft: '8px' }}>
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}