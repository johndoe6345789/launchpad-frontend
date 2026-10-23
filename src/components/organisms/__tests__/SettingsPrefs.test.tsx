import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import messages from '@/messages/en.json';

const save = jest.fn();
let data: { leaderboardOptIn: boolean; emailSequences: boolean } | undefined;

jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => {
    const v = (messages.settings as Record<string, unknown>)[key];
    return typeof v === 'string' ? v : key;
  },
}));
jest.mock('@/store/api/accountPrefsApi', () => ({
  useGetAccountPrefsQuery: () => ({ data }),
  useSetAccountPrefsMutation: () => [
    (body: unknown) => ({ unwrap: () => save(body) }),
    { isLoading: false },
  ],
}));

import SettingsEmailPrefs from '../SettingsEmailPrefs';
import SettingsLeaderboardPrefs from '../SettingsLeaderboardPrefs';

beforeEach(() => {
  save.mockReset().mockResolvedValue({});
  data = { leaderboardOptIn: true, emailSequences: true };
});

const toggle = (id: string) =>
  screen.getByTestId(id).querySelector('input') ?? screen.getByTestId(id);

describe('settings preferences are real', () => {
  it('turns the leaderboard off and on again', () => {
    const { rerender } = render(<SettingsLeaderboardPrefs />);
    fireEvent.click(toggle('leaderboard-opt-in-toggle'));
    expect(save).toHaveBeenLastCalledWith({ leaderboardOptIn: false });
    data = { leaderboardOptIn: false, emailSequences: true };
    rerender(<SettingsLeaderboardPrefs />);
    fireEvent.click(toggle('leaderboard-opt-in-toggle'));
    expect(save).toHaveBeenLastCalledWith({ leaderboardOptIn: true });
  });

  it('shows the saved email choice and can switch it back on', () => {
    data = { leaderboardOptIn: true, emailSequences: false };
    render(<SettingsEmailPrefs />);
    fireEvent.click(toggle('email-drip-toggle'));
    expect(save).toHaveBeenCalledWith({ emailSequences: true });
  });

  it('says so when a change does not save', async () => {
    save.mockRejectedValue(new Error('no'));
    render(<SettingsEmailPrefs />);
    fireEvent.click(toggle('email-drip-toggle'));
    expect(await screen.findByRole('alert')).toBeTruthy();
  });
});
