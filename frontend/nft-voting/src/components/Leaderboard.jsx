// src/components/Leaderboard.jsx
import React from 'react';

export default function Leaderboard({ items = [] }) {
  return (
    <section className="card-neo" aria-label="Leaderboard">
      <h2 style={{marginBottom:12}}>Leaderboard</h2>
      <table className="table-neo">
        <thead>
          <tr>
            <th>Rank</th>
            <th>Token</th>
            <th>Owner</th>
            <th>Votes</th>
          </tr>
        </thead>
        <tbody>
          {items.length === 0 && (
            <tr>
              <td colSpan="4" className="center muted">No votes yet</td>
            </tr>
          )}
          {items.map((it, idx) => (
            <tr key={it.tokenId}>
              <td>{idx + 1}</td>
              <td>{it.tokenId}</td>
              <td>{it.owner ? `${it.owner.slice(0,6)}…${it.owner.slice(-4)}` : '—'}</td>
              <td>{it.votes}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
