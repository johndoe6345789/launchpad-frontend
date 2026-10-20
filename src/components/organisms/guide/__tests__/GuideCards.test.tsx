import React from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { fireEvent, render, screen } from '@testing-library/react';
import messages from '@/messages/en.json';
import guideReducer from '@/store/slices/guideSlice';
import { IdeaRiskCard } from '../IdeaRiskCard';
import { LaunchGateCard } from '../LaunchGateCard';
import { AdvancedToggle } from '../AdvancedToggle';
import { AdvancedOnly } from '../AdvancedOnly';

jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => {
    const v = key.split('.').reduce(
      (o: unknown, k) => (o as Record<string, unknown>)?.[k],
      messages.guide as unknown,
    );
    return typeof v === 'string' ? v : key;
  },
}));
jest.mock('@/i18n/navigation', () => ({
  Link: ({ href, children }: { href: string; children: React.ReactNode }) =>
    <a href={href}>{children}</a>,
}));

const wrap = (ui: React.ReactElement) => render(
  <Provider store={configureStore({ reducer: { guide: guideReducer } })}>
    {ui}
  </Provider>,
);

describe('guide cards', () => {
  it('scores the idea once everything is answered', () => {
    wrap(<IdeaRiskCard />);
    expect(screen.queryByTestId('idea-verdict')).toBeNull();
    for (const q of ['fixedScope', 'upfront', 'noPerJobCost', 'repeat',
      'cheapStart', 'sayNo']) {
      fireEvent.click(screen.getByTestId(`idea-${q}-yes`));
    }
    expect(screen.getByTestId('idea-verdict').textContent)
      .toContain('low risk');
  });

  it('says what to fix for a no', () => {
    wrap(<IdeaRiskCard />);
    for (const q of ['fixedScope', 'upfront', 'noPerJobCost', 'repeat',
      'cheapStart']) {
      fireEvent.click(screen.getByTestId(`idea-${q}-yes`));
    }
    fireEvent.click(screen.getByTestId('idea-sayNo-no'));
    expect(screen.getByTestId('idea-verdict').textContent)
      .toContain('Add a limit');
  });

  it('holds back customers until every launch box is ticked', () => {
    wrap(<LaunchGateCard />);
    const verdict = () => screen.getByTestId('launch-verdict').textContent;
    expect(verdict()).toContain('Not yet');
    for (const c of ['worksEndToEnd', 'writtenScope', 'paymentPlan',
      'costsCapped', 'incomeChecked']) {
      fireEvent.click(screen.getByTestId(`launch-check-${c}`));
    }
    expect(verdict()).toContain('first customer');
  });

  it('shows advanced content only after the switch', () => {
    wrap(<><AdvancedToggle /><AdvancedOnly><p>secret</p></AdvancedOnly></>);
    expect(screen.queryByText('secret')).toBeNull();
    fireEvent.click(screen.getByRole('checkbox'));
    expect(screen.getByText('secret')).toBeTruthy();
  });
});
