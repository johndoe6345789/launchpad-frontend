import authReducer from '@/store/slices/authSlice';

const init = () => authReducer(undefined, { type: '@@init' });
const fulfilled = (endpointName: string, payload: unknown) => ({
  type: 'api/executeMutation/fulfilled',
  payload,
  meta: { arg: { endpointName } },
});

describe('auth slice and registration', () => {
  it('registering (no tokens back) neither throws nor signs in', () => {
    let state = init();
    expect(() => {
      state = authReducer(
        state, fulfilled('register', { success: true, loginUrl: '/login' }),
      );
    }).not.toThrow();
    expect(state.isAuthenticated).toBe(false);
    expect(state.user).toBeNull();
    expect(state.isLoading).toBe(false);
  });

  it('a successful login still stores the credentials', () => {
    const state = authReducer(init(), fulfilled('login', {
      user: { id: 'u1' },
      tokens: { accessToken: 'a', refreshToken: 'r' },
    }));
    expect(state.isAuthenticated).toBe(true);
    expect(state.accessToken).toBe('a');
  });
});
