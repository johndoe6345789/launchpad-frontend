import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';

jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}));
jest.mock('@/components/organisms/HoshinXMatrix', () => ({
  __esModule: true, default: () => <div data-testid="x-matrix-stub" />,
}));
jest.mock('@/components/organisms/BowlingChartTab', () => ({
  __esModule: true, default: () => <div data-testid="bowling-stub" />,
}));

import HoshinTabView from '../HoshinTabView';

describe('HoshinTabView', () => {
  it('starts on the X-matrix', () => {
    render(<HoshinTabView />);
    expect(screen.getByTestId('x-matrix-stub')).toBeTruthy();
    expect(screen.queryByTestId('bowling-stub')).toBeNull();
  });

  it('opens the bowling chart when its tab is clicked, and back again', () => {
    render(<HoshinTabView />);
    fireEvent.click(screen.getByTestId('hoshin-tab-bowling'));
    expect(screen.getByTestId('bowling-stub')).toBeTruthy();
    expect(screen.queryByTestId('x-matrix-stub')).toBeNull();
    fireEvent.click(screen.getByTestId('hoshin-tab-xmatrix'));
    expect(screen.getByTestId('x-matrix-stub')).toBeTruthy();
  });
});
