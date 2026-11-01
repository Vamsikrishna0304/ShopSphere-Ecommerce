import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', marginTop: '2.5rem' }}>
      <button
        className="btn btn-secondary btn-sm"
        disabled={currentPage === 0}
        onClick={() => onPageChange(currentPage - 1)}
        style={{ padding: '6px 12px' }}
      >
        <ChevronLeft size={16} /> Prev
      </button>

      <span style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: 600, padding: '0 8px' }}>
        Page {currentPage + 1} of {totalPages}
      </span>

      <button
        className="btn btn-secondary btn-sm"
        disabled={currentPage >= totalPages - 1}
        onClick={() => onPageChange(currentPage + 1)}
        style={{ padding: '6px 12px' }}
      >
        Next <ChevronRight size={16} />
      </button>
    </div>
  );
}
