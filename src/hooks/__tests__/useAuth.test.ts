const dispatchMock = jest.fn();
const selectorMock = jest.fn();
const loginMutMock = jest.fn();
const registerMutMock = jest.fn();
const logoutMutMock = jest.fn();

jest.mock('react-redux', () => ({
  useDispatch: () => dispatchMock,
  useSelector: (fn: (s: unknown) => unknown) =>
    selectorMock(fn),
}));
jest.mock('@/store/api/authApi', () => ({
  useLoginMutation: () => [loginMutMock],
  useRegisterMutation: () => [registerMutMock],
  useLogoutMutation: () => [logoutMutMock],
}));
jest.mock('@/store/slices/authSlice', () => ({
  setCredentials: (p: unknown) => ({
    type: 'auth/setCredentials', payload: p,
  }),
  clearCredentials: () => ({
    type: 'auth/clearCredentials',
  }),
}));

import { renderHook, act } from '@testing-library/react';
import { useAuth } from '../useAuth';

describe('useAuth', () => {
  beforeEach(() => {
    selectorMock.mockReturnValue({
      user: null, isAuthenticated: false, isLoading: false,
    });
    loginMutMock.mockReturnValue({
      unwrap: () => Promise.resolve({
        user: { id: 'u1', email: 'a@b.com', role: 'user' },
        tokens: {
          accessToken: 'tok', refreshToken: 'ref',
        },
      }),
    });
    logoutMutMock.mockReturnValue({
      unwrap: () => Promise.resolve({}),
    });
    registerMutMock.mockReturnValue({
      unwrap: () => Promise.resolve({
        success: true, message: 'ok', loginUrl: '/login',
      }),
    });
  });

  it('returns auth state from redux', () => {
    const { result } = renderHook(() => useAuth());
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBeNull();
  });

  it('login calls mutation and dispatches setCredentials', async () => {
    const { result } = renderHook(() => useAuth());
    await act(async () => {
      await result.current.login({
        email: 'a@b.com', password: 'pw',
      });
    });
    expect(loginMutMock).toHaveBeenCalled();
    expect(dispatchMock).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'auth/setCredentials',
      }),
    );
  });

  it('register creates the login but does not sign in', async () => {
    dispatchMock.mockClear();
    const { result } = renderHook(() => useAuth());
    await act(async () => {
      await result.current.register({
        email: 'a@b.com', username: 'a', password: 'long enough pw',
      });
    });
    expect(registerMutMock).toHaveBeenCalled();
    expect(dispatchMock).not.toHaveBeenCalled();
  });

  it('logout calls mutation and dispatches clearCredentials', async () => {
    const { result } = renderHook(() => useAuth());
    await act(async () => {
      await result.current.logout();
    });
    expect(logoutMutMock).toHaveBeenCalled();
    expect(dispatchMock).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'auth/clearCredentials',
      }),
    );
  });
});
