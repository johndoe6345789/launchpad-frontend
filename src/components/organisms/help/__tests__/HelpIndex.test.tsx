import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import messages from '@/messages/en.json';
import { HELP_TOPICS } from '../helpArticles';
import { HelpIndex } from '../HelpIndex';

jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => {
    const v = key.split('.').reduce(
      (o: unknown, k) => (o as Record<string, unknown>)?.[k],
      messages.help as unknown,
    );
    return typeof v === 'string' ? v : key;
  },
}));
jest.mock('@/i18n/navigation', () => ({
  Link: ({ href, children, ...rest }: {
    href: string; children: React.ReactNode;
  }) => <a href={href} {...rest}>{children}</a>,
}));

/** The text input, whether the test id is on it or on its wrapper. */
function searchBox(): HTMLElement {
  const el = screen.getByTestId('help-search');
  return el.tagName === 'INPUT' ? el : el.querySelector('input')!;
}

describe('HelpIndex', () => {
  it('lists every topic', () => {
    render(<HelpIndex />);
    for (const t of HELP_TOPICS) {
      expect(screen.getByTestId(`help-card-${t.slug}`)).toBeTruthy();
    }
  });

  it('filters topics by the search text', () => {
    render(<HelpIndex />);
    const box = searchBox();
    fireEvent.change(box, { target: { value: 'xero' } });
    expect(screen.getByTestId('help-card-accounting')).toBeTruthy();
    expect(screen.queryByTestId('help-card-faq')).toBeNull();
  });

  it('says so when nothing matches', () => {
    render(<HelpIndex />);
    const box = searchBox();
    fireEvent.change(box, { target: { value: 'zzzzqqq' } });
    expect(screen.getByRole('status')).toBeTruthy();
  });
});
