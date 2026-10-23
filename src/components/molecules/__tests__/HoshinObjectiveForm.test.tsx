import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';

jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}));

import { HoshinObjectiveForm } from '../HoshinObjectiveForm';
import HoshinObjectiveRow from '../HoshinObjectiveRow';

const input = (id: string) =>
  (screen.getByTestId(id).querySelector('input')
    ?? screen.getByTestId(id)) as HTMLInputElement;

describe('HoshinObjectiveForm', () => {
  it('will not add an objective without a title', () => {
    render(<HoshinObjectiveForm onAdd={jest.fn()} />);
    expect((screen.getByTestId('hoshin-add-btn') as HTMLButtonElement)
      .disabled).toBe(true);
  });

  it('adds an objective with its horizon and date, then clears', async () => {
    const onAdd = jest.fn().mockResolvedValue(true);
    render(<HoshinObjectiveForm onAdd={onAdd} />);
    fireEvent.change(input('hoshin-title-input'),
      { target: { value: '  First 10 customers ' } });
    fireEvent.change(screen.getByTestId('hoshin-horizon-select'),
      { target: { value: 'breakthrough' } });
    fireEvent.change(screen.getByTestId('hoshin-date-input'),
      { target: { value: '2027-06-30' } });
    fireEvent.click(screen.getByTestId('hoshin-add-btn'));
    await waitFor(() => expect(onAdd).toHaveBeenCalledWith({
      title: 'First 10 customers', description: '',
      horizon: 'breakthrough', target_date: '2027-06-30',
    }));
    await waitFor(() => expect(input('hoshin-title-input').value).toBe(''));
  });

  it('keeps what was typed when saving fails', async () => {
    const onAdd = jest.fn().mockResolvedValue(false);
    render(<HoshinObjectiveForm onAdd={onAdd} />);
    fireEvent.change(input('hoshin-title-input'), { target: { value: 'Keep' } });
    fireEvent.click(screen.getByTestId('hoshin-add-btn'));
    await waitFor(() => expect(onAdd).toHaveBeenCalled());
    expect(input('hoshin-title-input').value).toBe('Keep');
  });
});

describe('HoshinObjectiveRow actions', () => {
  const obj = { id: 'o1', user_id: 'u', title: 'Grow', description: '',
    horizon: 'annual' as const, target_date: null, sort_order: 0,
    created_at: '', updated_at: '' };
  const org = (id: string, name: string) => ({ id, name } as never);

  it('links a company with a strength, and can remove a link', () => {
    const onLink = jest.fn(); const onUnlink = jest.fn(); const onDelete = jest.fn();
    const row = { objective: obj, links: [{
      link: { id: 'l1', objective_id: 'o1', organisation_id: 'a', strength: 'weak' as const },
      org: org('a', 'Acme'),
    }] };
    render(<HoshinObjectiveRow row={row}
      organisations={[org('a', 'Acme'), org('b', 'Beta')]}
      onLink={onLink} onUnlink={onUnlink} onDelete={onDelete} />);
    fireEvent.change(screen.getByTestId('hoshin-link-org-o1'),
      { target: { value: 'b' } });
    fireEvent.change(screen.getByTestId('hoshin-link-strength-o1'),
      { target: { value: 'medium' } });
    fireEvent.click(screen.getByTestId('hoshin-link-add-o1'));
    expect(onLink).toHaveBeenCalledWith('o1', 'b', 'medium');
    fireEvent.click(screen.getByTestId('link-remove-l1'));
    expect(onUnlink).toHaveBeenCalledWith('l1');
    fireEvent.click(screen.getByTestId('hoshin-delete-o1'));
    expect(onDelete).toHaveBeenCalledWith('o1');
  });
});
