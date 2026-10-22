import React from 'react';
import { render, screen } from '@testing-library/react';
import HoshinXMatrix
  from '../HoshinXMatrix';

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

jest.mock('@/hooks/useHoshinMatrix', () => ({
  useHoshinMatrix: jest.fn(),
}));
jest.mock('@/hooks/useHoshinActions', () => ({
  useHoshinActions: () => ({
    addObjective: jest.fn().mockResolvedValue(true),
    removeObjective: jest.fn(), addLink: jest.fn(),
    removeLink: jest.fn(), error: null,
  }),
}));

const { useHoshinMatrix } =
  jest.requireMock('@/hooks/useHoshinMatrix');

const MOCK_OBJ = {
  id: 'obj-1', user_id: 'u1',
  title: 'Financial Independence',
  description: 'Replace benefit income.',
  horizon: 'vision' as const,
  target_date: '2031-01-01',
  sort_order: 0,
  created_at: '', updated_at: '',
};

const MOCK_ORG = {
  id: 'org-1', name: 'Dog Walking Daily',
  initial_investment_gbp: 50, monthly_revenue_gbp: 600,
  weeks_to_bootstrap: 1, parent_org_id: null, user_id: 'u1',
  website: '', description: '', entity_types: [],
  tags: [], notes: '', created_at: '', updated_at: '',
};

const MOCK_LINK = {
  id: 'link-1', objective_id: 'obj-1',
  organisation_id: 'org-1',
  strength: 'strong' as const,
};

beforeEach(() => jest.clearAllMocks());

describe('HoshinXMatrix', () => {
  it('renders nothing while loading', () => {
    useHoshinMatrix.mockReturnValue({
      vision: [], breakthrough: [], annual: [],
      isLoading: true,
    });
    const { container } = render(<HoshinXMatrix />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders three section headings', () => {
    useHoshinMatrix.mockReturnValue({
      vision: [], breakthrough: [], annual: [],
      isLoading: false,
    });
    render(<HoshinXMatrix />);
    expect(screen.getByTestId('hoshin-xmatrix'))
      .toBeInTheDocument();
    expect(screen.getByTestId(
      'hoshin-section-5-Year Vision'))
      .toBeInTheDocument();
    expect(screen.getByTestId(
      'hoshin-section-Breakthrough Objectives'))
      .toBeInTheDocument();
    expect(screen.getByTestId(
      'hoshin-section-Annual Objectives'))
      .toBeInTheDocument();
  });

  it('renders an objective row', () => {
    useHoshinMatrix.mockReturnValue({
      vision: [{
        objective: MOCK_OBJ,
        links: [{ link: MOCK_LINK, org: MOCK_ORG }],
      }],
      breakthrough: [], annual: [],
      isLoading: false,
    });
    render(<HoshinXMatrix />);
    expect(screen.getByTestId('hoshin-row-obj-1'))
      .toBeInTheDocument();
    expect(
      screen.getByText('Financial Independence'),
    ).toBeInTheDocument();
  });

  it('renders linked startup chip', () => {
    useHoshinMatrix.mockReturnValue({
      vision: [{
        objective: MOCK_OBJ,
        links: [{ link: MOCK_LINK, org: MOCK_ORG }],
      }],
      breakthrough: [], annual: [],
      isLoading: false,
    });
    render(<HoshinXMatrix />);
    expect(screen.getByTestId('link-chip-link-1'))
      .toBeInTheDocument();
    expect(screen.getByText('Dog Walking Daily'))
      .toBeInTheDocument();
  });
});
