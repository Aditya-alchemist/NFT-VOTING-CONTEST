// src/utils/shorten.js
export function short(addr = '') {
    if (!addr) return '';
    if (addr.length <= 12) return addr;
    return `${addr.slice(0,6)}…${addr.slice(-4)}`;
  }
  export default short;
  