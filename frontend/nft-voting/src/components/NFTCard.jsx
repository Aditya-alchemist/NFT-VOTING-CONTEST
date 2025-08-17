// src/components/NFTCard.jsx
import React from 'react';

export default function NFTCard({ tokenId, name, image, owner, votes, onVote, onDetails, disabled }) {
  return (
    <article className={`card-neo ${disabled ? 'selected-neo' : ''}`}  aria-labelledby={`nft-${tokenId}`}>
      <img className="img-neo" src={image} alt={name || `NFT ${tokenId}`} />
      <div style={{marginTop:12}}>
        <h2 id={`nft-${tokenId}`} style={{fontSize:18, margin:'6px 0'}}>{name || `Token #${tokenId}`}</h2>
        <div style={{display:'flex', gap:10, alignItems:'center', flexWrap:'wrap'}}>
          <span className="badge-neo">Votes: {votes ?? 0}</span>
          <span className="badge-neo" style={{background:'#fff'}}>Owner: {owner ? `${owner.slice(0,6)}…${owner.slice(-4)}` : '—'}</span>
        </div>

        <div style={{display:'flex', gap:10, marginTop:12}}>
          <button
            className="btn-neo"
            onClick={() => onVote?.(tokenId)}
            disabled={disabled}
            aria-disabled={disabled}
          >
            Vote
          </button>

          <button
            className="btn-neo btn-neo--secondary"
            onClick={() => onDetails?.(tokenId)}
          >
            Details
          </button>
        </div>
      </div>
    </article>
  );
}
