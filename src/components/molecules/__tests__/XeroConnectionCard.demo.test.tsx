import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';

const connect = jest.fn();
let status: Record<string, unknown> = {};

jest.mock('next-intl', () => ({ useTranslations: () => (k: string) => k }));
jest.mock('@/store/api/xeroApi', () => ({
  useXeroStatusQuery: () => ({ data: status, isLoading: false }),
  useXeroDisconnectMutation: () => [jest.fn()],
  useXeroConnectMutation: () => [connect, { isLoading: false }],
}));
jest.mock('@shared/m3', () => ({
  Card: (p: { children: React.ReactNode }) => <div>{p.children}</div>,
  CardContent: (p: { children: React.ReactNode }) => <div>{p.children}</div>,
  CardActions: (p: { children: React.ReactNode }) => <div>{p.children}</div>,
  Typography: (p: { children: React.ReactNode }) => <p>{p.children}</p>,
  Chip: (p: { label: string }) => <span>{p.label}</span>,
  Button: (p: { children: React.ReactNode; onClick?: () => void;
    disabled?: boolean }) => (
    <button disabled={p.disabled} onClick={p.onClick}
      data-testid="xero-connect-btn">{p.children}</button>),
}));

import XeroConnectionCard from '../XeroConnectionCard';

const assign = jest.fn();
beforeAll(() => {
  Object.defineProperty(window, 'location', {
    value: { assign }, writable: true,
  });
});
beforeEach(() => {
  jest.clearAllMocks();
  status = { connected: false, available: true, demo: true };
  connect.mockReturnValue({
    unwrap: () => Promise.resolve({ url: 'https://xero.example/auth?s=1' }),
  });
});

describe('XeroConnectionCard', () => {
  it('starts the sign-in with an authenticated request, then goes to Xero', async () => {
    render(<XeroConnectionCard />);
    fireEvent.click(screen.getByTestId('xero-connect-btn'));
    await waitFor(() => expect(assign)
      .toHaveBeenCalledWith('https://xero.example/auth?s=1'));
  });

  it('says plainly when it is a demo', () => {
    render(<XeroConnectionCard />);
    expect(screen.getByTestId('xero-demo-note')).toBeInTheDocument();
  });

  it('cannot connect when the server has no Xero set up', () => {
    status = { connected: false, available: false };
    render(<XeroConnectionCard />);
    expect(screen.getByTestId('xero-connect-btn')).toBeDisabled();
  });
});
