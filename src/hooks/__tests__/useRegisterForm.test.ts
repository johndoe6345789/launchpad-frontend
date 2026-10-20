const registerMock = jest.fn();
const validateMock = jest.fn(() => true);
const pushMock = jest.fn();

jest.mock('@/hooks', () => ({
  useAuth: () => ({
    register: registerMock, isLoading: false,
  }),
  useFormValidation: () => ({
    validate: validateMock, errors: {},
  }),
}));
jest.mock('@/components/organisms/registerRules', () => ({
  REG_RULES: {
    username: {}, email: {}, displayName: {},
    password: {}, confirmPassword: {},
  },
}));
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: pushMock }),
}));

import { renderHook, act } from '@testing-library/react';
import { useRegisterForm } from '../useRegisterForm';

const fakeEvent = {
  preventDefault: jest.fn(),
} as unknown as React.FormEvent;

const fakeChangeEvent = (v: string) =>
  ({ target: { value: v } } as unknown as React.ChangeEvent<HTMLInputElement>);

describe('useRegisterForm', () => {
  beforeEach(() => {
    registerMock.mockResolvedValue({});
    validateMock.mockReturnValue(true);
    pushMock.mockClear();
  });

  it('initialises with empty fields', () => {
    const { result } = renderHook(
      () => useRegisterForm(),
    );
    expect(result.current.f.email).toBe('');
    expect(result.current.f.username).toBe('');
    expect(result.current.apiError).toBeNull();
  });

  it('set() updates a field by key', () => {
    const { result } = renderHook(
      () => useRegisterForm(),
    );
    act(() => {
      result.current.set('email')(fakeChangeEvent('a@b.com'));
    });
    expect(result.current.f.email).toBe('a@b.com');
  });

  it('submit navigates to /dashboard on success', async () => {
    const { result } = renderHook(
      () => useRegisterForm(),
    );
    act(() => {
      result.current.set('password')(
        fakeChangeEvent('pass'),
      );
      result.current.set('confirmPassword')(
        fakeChangeEvent('pass'),
      );
    });
    await act(async () => {
      await result.current.submit(fakeEvent);
    });
    expect(registerMock).toHaveBeenCalled();
    expect(pushMock).toHaveBeenCalledWith('/login');
  });

  it('sets apiError on register failure', async () => {
    registerMock.mockRejectedValue({
      data: { message: 'Email taken' },
    });
    const { result } = renderHook(
      () => useRegisterForm(),
    );
    act(() => {
      result.current.set('password')(
        fakeChangeEvent('pass'),
      );
      result.current.set('confirmPassword')(
        fakeChangeEvent('pass'),
      );
    });
    await act(async () => {
      await result.current.submit(fakeEvent);
    });
    expect(result.current.apiError).toBe('Email taken');
  });
});
