import { renderHook, act } from '@testing-library/react';

const saveMock = jest.fn();

jest.mock('@/store/api/marketResearchBmcApi', () => ({
  useSaveBmcMutation: () => [
    saveMock, { isLoading: false },
  ],
}));

import { useBmcAutosave } from '../useBmcAutosave';
import type { BmcCanvas } from '@/types/marketResearch';

const CANVAS: BmcCanvas = {
  problem: 'p', solution: 's', uvp: 'u',
  channels: 'c', customerSegments: 'cs',
  costStructure: 'co', revenueStreams: 'r',
  keyMetrics: 'km', unfairAdvantage: 'ua',
};

describe('useBmcAutosave', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    saveMock.mockReset();
  });
  afterEach(() => {
    jest.useRealTimers();
  });

  it('does not call save before timer fires', () => {
    const { result } = renderHook(() => useBmcAutosave());
    act(() => { result.current.scheduleAutosave(CANVAS); });
    expect(saveMock).not.toHaveBeenCalled();
  });

  it('calls save after 1000ms', () => {
    const { result } = renderHook(() => useBmcAutosave());
    act(() => { result.current.scheduleAutosave(CANVAS); });
    act(() => { jest.advanceTimersByTime(1000); });
    expect(saveMock).toHaveBeenCalledWith(CANVAS);
  });

  it('debounces: only saves once on rapid calls', () => {
    const { result } = renderHook(() => useBmcAutosave());
    act(() => {
      result.current.scheduleAutosave(CANVAS);
      result.current.scheduleAutosave(CANVAS);
      result.current.scheduleAutosave(CANVAS);
    });
    act(() => { jest.advanceTimersByTime(1000); });
    expect(saveMock).toHaveBeenCalledTimes(1);
  });

  it('uses latest canvas when debouncing', () => {
    const canvas2: BmcCanvas = { ...CANVAS, problem: 'new' };
    const { result } = renderHook(() => useBmcAutosave());
    act(() => { result.current.scheduleAutosave(CANVAS); });
    act(() => { jest.advanceTimersByTime(500); });
    act(() => { result.current.scheduleAutosave(canvas2); });
    act(() => { jest.advanceTimersByTime(1000); });
    expect(saveMock).toHaveBeenCalledWith(canvas2);
  });

  it('saves a pending edit straight away when the page is left', () => {
    const { result, unmount } = renderHook(() => useBmcAutosave());
    act(() => { result.current.scheduleAutosave(CANVAS); });
    expect(saveMock).not.toHaveBeenCalled();
    unmount();
    expect(saveMock).toHaveBeenCalledTimes(1);
    expect(saveMock).toHaveBeenCalledWith(CANVAS);
    act(() => { jest.advanceTimersByTime(2000); });
    expect(saveMock).toHaveBeenCalledTimes(1);
  });

  it('flush() saves now and does not save twice', () => {
    const { result } = renderHook(() => useBmcAutosave());
    act(() => { result.current.scheduleAutosave(CANVAS); });
    act(() => { result.current.flush(); });
    expect(saveMock).toHaveBeenCalledTimes(1);
    act(() => { jest.advanceTimersByTime(2000); });
    expect(saveMock).toHaveBeenCalledTimes(1);
  });

  it('flush() with nothing pending does nothing', () => {
    const { result } = renderHook(() => useBmcAutosave());
    act(() => { result.current.flush(); });
    expect(saveMock).not.toHaveBeenCalled();
  });

  it('sends a keepalive request when the page is hidden or closed', () => {
    const fetchMock = jest.fn().mockResolvedValue({});
    (global as unknown as { fetch: unknown }).fetch = fetchMock;
    const { result } = renderHook(() => useBmcAutosave());
    act(() => { result.current.scheduleAutosave(CANVAS); });
    act(() => { window.dispatchEvent(new Event('pagehide')); });
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toContain('/api/market-research/bmc');
    expect(init.method).toBe('PUT');
    expect(init.keepalive).toBe(true);
    expect(JSON.parse(init.body)).toEqual(CANVAS);
    expect(saveMock).not.toHaveBeenCalled();
    act(() => { jest.advanceTimersByTime(2000); });
    expect(saveMock).not.toHaveBeenCalled();
  });

  it('exposes isSaving as false', () => {
    const { result } = renderHook(() => useBmcAutosave());
    expect(result.current.isSaving).toBe(false);
  });
});
