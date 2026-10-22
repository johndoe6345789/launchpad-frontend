import React from 'react';
import { render, screen } from '@testing-library/react';
import BowlingChartTab from '../BowlingChartTab';

import messages from '@/messages/en.json';

jest.mock('next-intl', () => ({
  useTranslations: (ns?: string) => (key: string) => {
    const root = ns ? ns.split('.').reduce(
      (o: unknown, k) => (o as Record<string, unknown>)?.[k],
      messages as unknown,
    ) : messages;
    const v = key.split('.').reduce(
      (o: unknown, k) => (o as Record<string, unknown>)?.[k], root);
    return typeof v === 'string' ? v : key;
  },
}));

jest.mock('@/hooks/useBowlingChart', () => ({
  useBowlingChart: jest.fn(),
}));
const { useBowlingChart } =
  jest.requireMock('@/hooks/useBowlingChart');

const noop = jest.fn();
const BASE = {
  objectives: [], isLoading: false,
  year: 2026, setYear: noop,
  createObjective: noop, deleteObjective: noop,
  upsertMonth: noop,
};

const OBJ = {
  id: 'b1', title: 'Monthly Revenue',
  sort_order: 0, months: [],
};

beforeEach(() => {
  jest.clearAllMocks();
  useBowlingChart.mockReturnValue(BASE);
});

describe('BowlingChartTab', () => {
  it('renders bowling chart container', () => {
    render(<BowlingChartTab />);
    expect(screen.getByTestId('bowling-chart-tab'))
      .toBeInTheDocument();
  });

  it('shows empty state when no objectives', () => {
    render(<BowlingChartTab />);
    expect(
      screen.getByTestId('bowling-empty-prompt'),
    ).toBeInTheDocument();
  });

  it('renders bowling table when data present', () => {
    useBowlingChart.mockReturnValue(
      { ...BASE, objectives: [OBJ] });
    render(<BowlingChartTab />);
    expect(screen.getByTestId('bowling-table'))
      .toBeInTheDocument();
    expect(screen.getByTestId('bowling-row-b1'))
      .toBeInTheDocument();
  });

  it('renders year input', () => {
    render(<BowlingChartTab />);
    expect(screen.getByTestId('bowling-year-input'))
      .toBeInTheDocument();
  });

  it('renders add button', () => {
    render(<BowlingChartTab />);
    expect(screen.getByTestId('bowling-add-btn'))
      .toBeInTheDocument();
  });
});
