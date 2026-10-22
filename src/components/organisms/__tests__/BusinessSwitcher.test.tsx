import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';

const open = jest.fn();
const create = jest.fn();
const rename = jest.fn();
const remove = jest.fn();
let vmState: Record<string, unknown>;

jest.mock('next-intl', () => ({
  useTranslations: () => (k: string, v?: { name?: string }) =>
    v?.name ? `${k}:${v.name}` : k,
}));
jest.mock('@/hooks/useBusinesses', () => ({
  businessError: () => 'nope',
  useBusinesses: () => vmState,
}));

import { BusinessSwitcher } from '../BusinessSwitcher';

const first = { id: 'm', name: 'My business', createdAt: '' };
const second = { id: 's', name: 'Acme', createdAt: '' };

beforeEach(() => {
  jest.clearAllMocks();
  create.mockResolvedValue(second);
  vmState = {
    businesses: [first, second], active: first, isLoading: false,
    open, create, rename, remove,
  };
});

describe('BusinessSwitcher', () => {
  it('shows the open business and lists them all', () => {
    render(<BusinessSwitcher />);
    expect(screen.getByTestId('business-switcher'))
      .toHaveTextContent('My business');
    fireEvent.click(screen.getByTestId('business-switcher'));
    expect(screen.getByTestId('business-option-s')).toBeInTheDocument();
  });

  it('opens another business when chosen', () => {
    render(<BusinessSwitcher />);
    fireEvent.click(screen.getByTestId('business-switcher'));
    fireEvent.click(screen.getByTestId('business-option-s'));
    expect(open).toHaveBeenCalledWith(second);
  });

  it('creates a business from the dialog', async () => {
    render(<BusinessSwitcher />);
    fireEvent.click(screen.getByTestId('business-switcher'));
    fireEvent.click(screen.getByTestId('business-new'));
    fireEvent.change(screen.getByLabelText('nameLabel'), {
      target: { value: 'Acme' },
    });
    fireEvent.click(screen.getByTestId('business-create'));
    await waitFor(() => expect(create).toHaveBeenCalledWith('Acme'));
  });

  it('asks before deleting, and any business can be deleted', async () => {
    render(<BusinessSwitcher />);
    fireEvent.click(screen.getByTestId('business-switcher'));
    fireEvent.click(screen.getByTestId('business-manage'));
    expect(screen.getAllByText('delete')).toHaveLength(2);
    fireEvent.click(screen.getAllByText('delete')[0]);
    expect(remove).not.toHaveBeenCalled();
    fireEvent.click(screen.getByTestId('business-delete-confirm'));
    await waitFor(() => expect(remove).toHaveBeenCalledWith(first));
  });

  it('renders nothing until the list has loaded', () => {
    vmState = { ...vmState, isLoading: true, active: undefined };
    const { container } = render(<BusinessSwitcher />);
    expect(container).toBeEmptyDOMElement();
  });
});
