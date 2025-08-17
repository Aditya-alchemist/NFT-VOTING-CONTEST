// src/components/Navbar.jsx
import React from 'react';
import short from '../utils/shorten';

export default function Navbar({ address, onConnect, onDisconnect }) {
  return (
    <header className="card-neo navbar-neo" role="banner" aria-label="Main navigation">
      <div style={{display:'flex', gap:16, alignItems:'center'}}>
        <div className="logo-neo" aria-hidden="true">NV</div>
        <div>
          <h1 style={{margin:0}}>NFT VOTING</h1>
          <small className="muted">Retro Contest</small>
        </div>
      </div>

      <div style={{marginLeft:'auto', display:'flex', gap:12, alignItems:'center'}}>
        <nav aria-label="primary actions">
          <button className="btn-neo btn-neo--secondary" onClick={()=>window.scrollTo({top:0, behavior:'smooth'})}>Home</button>
          <button className="btn-neo btn-neo--secondary" onClick={()=>document.getElementById('mint')?.scrollIntoView({behavior:'smooth'})}>Mint</button>
        </nav>

        {address ? (
          <>
            <span className="badge-neo" title={address}>{short(address)}</span>
            <button className="btn-neo btn-neo--secondary" onClick={onDisconnect}>Disconnect</button>
          </>
        ) : (
          <button className="btn-neo" onClick={onConnect}>Connect Wallet</button>
        )}
      </div>
    </header>
  );
}
