// src/pages/transactions/TransactionsPage.jsx
import React, { useEffect, useState } from 'react';
import TransactionForm from '../../components/TransactionForm';
import Modal from '../../components/Modal';
import ExportButtons from '../../components/ExportButtons';
import { getAllTransactions, deleteTransaction, addTransaction } from '../../firebase/transactions';
import { db } from '../../firebase/config';
import { doc, updateDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';
import '../../styles/TransactionForm.css';
import '../../styles/TransactionsPage.css';

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState([]);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filters, setFilters] = useState({ site: '', type: '', vendor: '', month: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchTransactions = async () => {
    try {
      const data = await getAllTransactions();
      setTransactions(data);
    } catch (err) {
      toast.error('Error fetching transactions');
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleSave = async (formData) => {
    try {
      if (editingTransaction) {
        const docRef = doc(db, 'transactions', editingTransaction.id);
        await updateDoc(docRef, {
          ...formData,
          date: new Date(formData.date + 'T00:00:00'),
        });
        toast.success('Transaction updated successfully');
      } else {
        await addTransaction({
          ...formData,
          date: new Date(formData.date + 'T00:00:00'),
        });
        toast.success('Transaction added successfully');
      }

      setEditingTransaction(null);
      setIsModalOpen(false);
      fetchTransactions();
    } catch (err) {
      toast.error('Failed to save transaction.');
      console.error('🔥 Save Error:', err);
    }
  };

  const handleDelete = async (id) => {
    const confirm = window.confirm('Are you sure you want to delete this transaction?');
    if (!confirm) return;

    try {
      await deleteTransaction(id);
      toast.success('Transaction deleted successfully');
      fetchTransactions();
    } catch (err) {
      toast.error('Failed to delete transaction.');
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
    setCurrentPage(1);
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

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentTransactions = filteredTransactions.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);

  const summary = filteredTransactions.reduce(
    (acc, txn) => {
      if (txn.type === 'credit') acc.credit += txn.amount;
      else if (txn.type === 'debit') acc.debit += txn.amount;
      return acc;
    },
    { credit: 0, debit: 0 }
  );
  const net = summary.credit - summary.debit;

  return (
    <div className="dashboard-container">
      <h2>All Transactions</h2>

      <button onClick={() => {
        setEditingTransaction(null);
        setIsModalOpen(true);
      }}>
        + Add Transaction
      </button>

      {/* Filters */}
      <div className="filters">
        <input type="text" name="site" placeholder="Filter by Site" value={filters.site} onChange={handleFilterChange} />
        <input type="text" name="vendor" placeholder="Filter by Vendor" value={filters.vendor} onChange={handleFilterChange} />
        <select name="type" value={filters.type} onChange={handleFilterChange}>
          <option value="">All Types</option>
          <option value="credit">Credit 🟢</option>
          <option value="debit">Debit 🔴</option>
        </select>
        <input type="month" name="month" value={filters.month} onChange={handleFilterChange} />
      </div>

      <ExportButtons
        data={filteredTransactions}
        filters={filters}
        onEdit={setEditingTransaction}
        onDelete={(txn) => handleDelete(txn.id)}
      />

      <div className="summary-box">
        <p><strong>Total Credit:</strong> ₹{summary.credit.toLocaleString()}</p>
        <p><strong>Total Debit:</strong> ₹{summary.debit.toLocaleString()}</p>
        <p><strong>Net Balance:</strong> ₹{net.toLocaleString()}</p>
      </div>

      {isModalOpen && (
        <Modal title={editingTransaction ? 'Edit Transaction' : 'Add Transaction'} onClose={() => setIsModalOpen(false)}>
          <TransactionForm
            initialData={editingTransaction || {}}
            onSave={handleSave}
            onCancel={() => setIsModalOpen(false)}
          />
        </Modal>
      )}

      <div className="table-wrapper">
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
            {currentTransactions.length === 0 ? (
              <tr>
                <td colSpan="9">No transactions found.</td>
              </tr>
            ) : (
              currentTransactions.map((txn) => {
                const txnDate = new Date(txn.date.seconds * 1000);
                const formattedDate = txnDate.toLocaleDateString();
                return (
                  <tr key={txn.id}>
                    <td>₹{txn.amount}</td>
                    <td>{txn.site}</td>
                    <td>{txn.vendor}</td>
                    <td><span className={txn.type === 'credit' ? 'credit' : 'debit'}>{txn.type}</span></td>
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
                      ) : ('-')}
                    </td>
                    <td>
                      <button onClick={() => {
                        setEditingTransaction(txn);
                        setIsModalOpen(true);
                      }}>Edit</button>
                      <button onClick={() => handleDelete(txn.id)} className="cancel-btn" style={{ marginLeft: '8px' }}>
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

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination-controls">
          <button disabled={currentPage === 1} onClick={() => setCurrentPage((prev) => prev - 1)}>Prev</button>
          <span>Page {currentPage} of {totalPages}</span>
          <button disabled={currentPage === totalPages} onClick={() => setCurrentPage((prev) => prev + 1)}>Next</button>
        </div>
      )}
    </div>
  );
}