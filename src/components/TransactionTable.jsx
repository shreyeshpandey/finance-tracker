import React from 'react';

export default function TransactionTable({ data, onEdit, onDelete }) {
  return (
    <table className="transaction-table">
      <thead>
        <tr>
          <th>Amount</th>
          <th>Site</th>
          <th>Vendor</th>
          <th>Type</th>
          <th>Remark</th>
          <th>Date</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {data.map((txn) => (
          <tr key={txn.id}>
            <td>{txn.amount}</td>
            <td>{txn.site}</td>
            <td>{txn.vendor}</td>
            <td>{txn.type}</td>
            <td>{txn.remark}</td>
            <td>{new Date(txn.date.seconds * 1000).toLocaleDateString()}</td>
            <td>
              <button onClick={() => onEdit(txn)}>Edit</button>
              <button onClick={() => onDelete(txn.id)} style={{ marginLeft: '8px' }}>Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}