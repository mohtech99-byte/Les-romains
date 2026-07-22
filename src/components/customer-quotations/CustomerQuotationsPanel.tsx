import React, { useState } from 'react';
import { CustomerQuotation } from '../../types';
import { CustomerQuotationsList } from './CustomerQuotationsList.tsx';
import { CustomerQuotationForm } from './CustomerQuotationForm.tsx';
import { CustomerQuotationView } from './CustomerQuotationView.tsx';

type SubView = { mode: 'list' } | { mode: 'create' } | { mode: 'edit'; quotation: CustomerQuotation } | { mode: 'view'; quotation: CustomerQuotation };

export const CustomerQuotationsPanel: React.FC = () => {
  const [view, setView] = useState<SubView>({ mode: 'list' });

  if (view.mode === 'create') {
    return (
      <CustomerQuotationForm
        onSaved={(q) => setView({ mode: 'view', quotation: q })}
        onCancel={() => setView({ mode: 'list' })}
      />
    );
  }

  if (view.mode === 'edit') {
    return (
      <CustomerQuotationForm
        existing={view.quotation}
        onSaved={(q) => setView({ mode: 'view', quotation: q })}
        onCancel={() => setView({ mode: 'view', quotation: view.quotation })}
      />
    );
  }

  if (view.mode === 'view') {
    return (
      <CustomerQuotationView
        quotation={view.quotation}
        onBack={() => setView({ mode: 'list' })}
        onEdit={() => setView({ mode: 'edit', quotation: view.quotation })}
        onDeleted={() => setView({ mode: 'list' })}
        onDuplicated={(copy) => setView({ mode: 'view', quotation: copy })}
      />
    );
  }

  return (
    <CustomerQuotationsList
      onCreate={() => setView({ mode: 'create' })}
      onView={(q) => setView({ mode: 'view', quotation: q })}
      onEdit={(q) => setView({ mode: 'edit', quotation: q })}
    />
  );
};
