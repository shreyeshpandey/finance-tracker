import React, { useEffect, useState } from 'react';
import { getAllTransactions } from '../../firebase/transactions';
import '../../styles/Dashboard.css';
import {
  PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Legend, ResponsiveContainer
} from 'recharts';

const COLORS = [
  '#4CAF50', '#F44336', '#2196F3', '#FF9800', '#9C27B0',
  '#00BCD4', '#E91E63', '#795548', '#3F51B5', '#CDDC39'
];

export default function Dashboard() {
  const [transactions, setTransactions] = useState([]);
  const [filters, setFilters] = useState({ site: '', type: '', vendor: '', month: '' });

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

  const typeData = [
    { name: 'Credit', value: summary.credit },
    { name: 'Debit', value: summary.debit }
  ];

  const siteData = Object.values(
    filteredTransactions.reduce((acc, txn) => {
      acc[txn.site] = acc[txn.site] || { site: txn.site, amount: 0 };
      acc[txn.site].amount += txn.amount;
      return acc;
    }, {})
  );

  const monthlyData = Object.values(
    filteredTransactions.reduce((acc, txn) => {
      const date = new Date(txn.date.seconds * 1000);
      const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      acc[month] = acc[month] || { month, credit: 0, debit: 0 };
      if (txn.type === 'credit') acc[month].credit += txn.amount;
      else if (txn.type === 'debit') acc[month].debit += txn.amount;
      return acc;
    }, {})
  );

  const vendorData = Object.values(
    filteredTransactions.reduce((acc, txn) => {
      acc[txn.vendor] = acc[txn.vendor] || { vendor: txn.vendor, amount: 0 };
      acc[txn.vendor].amount += txn.amount;
      return acc;
    }, {})
  ).sort((a, b) => b.amount - a.amount).slice(0, 5);

  const paymentData = Object.values(
    filteredTransactions.reduce((acc, txn) => {
      acc[txn.paymentMethod] = acc[txn.paymentMethod] || { name: txn.paymentMethod, value: 0 };
      acc[txn.paymentMethod].value += txn.amount;
      return acc;
    }, {})
  );

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h2>Finance Dashboard</h2>
      </div>

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

      <div className="summary-box">
        <p><strong>Total Credit:</strong> ₹{summary.credit.toLocaleString()}</p>
        <p><strong>Total Debit:</strong> ₹{summary.debit.toLocaleString()}</p>
        <p><strong>Net Balance:</strong> ₹{net.toLocaleString()}</p>
      </div>

      <div className="charts-container">

        <div className="chart-box">
          <h4>Type Distribution</h4>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={typeData} dataKey="value" cx="50%" cy="50%" outerRadius={100} label>
                {typeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-box">
          <h4>Monthly Credit & Debit</h4>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="credit" fill="#4CAF50" name="Credit" />
              <Bar dataKey="debit" fill="#F44336" name="Debit" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-box">
          <h4>Amount by Site</h4>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={siteData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="site" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="amount" name="Amount">
                {siteData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-box">
          <h4>Top Vendors</h4>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={vendorData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="vendor" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="amount" name="Amount">
                {vendorData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-box">
          <h4>Payment Methods</h4>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={paymentData} dataKey="value" cx="50%" cy="50%" outerRadius={100} label>
                {paymentData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

      </div>

      <div className="recent-transactions">
        <h3>Recent Transactions</h3>
        <table className="recent-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Amount</th>
              <th>Type</th>
              <th>Site</th>
              <th>Vendor</th>
            </tr>
          </thead>
          <tbody>
            {transactions.slice(0, 5).map((txn) => {
              const txnDate = new Date(txn.date.seconds * 1000).toLocaleDateString();
              return (
                <tr key={txn.id}>
                  <td>{txnDate}</td>
                  <td>₹{txn.amount}</td>
                  <td className={txn.type === 'credit' ? 'credit' : 'debit'}>{txn.type}</td>
                  <td>{txn.site}</td>
                  <td>{txn.vendor}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <div className="view-all-link">
          <a href="/transactions">View All Transactions →</a>
        </div>
      </div>
    </div>
  );
}