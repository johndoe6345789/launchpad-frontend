'use client';

import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { switchBusiness } from '@/store/switchBusiness';
import {
  useListBusinessesQuery,
  useCreateBusinessMutation,
  useRenameBusinessMutation,
  useDeleteBusinessMutation,
  type Business,
} from '@/store/api/businessesApi';

/** Error text from an RTK Query failure, for showing to the user. */
export function businessError(err: unknown): string {
  const data = (err as { data?: { error?: string } })?.data;
  return data?.error ?? 'Something went wrong. Please try again.';
}

/**
 * The person's businesses and the one that is open. Opening another
 * switches everything the planning tools show.
 */
export function useBusinesses() {
  const dispatch = useAppDispatch();
  const activeId = useAppSelector((s) => s.business?.activeId ?? null);
  const { data: businesses = [], isLoading } = useListBusinessesQuery();
  const [createMut] = useCreateBusinessMutation();
  const [renameMut] = useRenameBusinessMutation();
  const [deleteMut] = useDeleteBusinessMutation();

  // No stored id, or one that no longer exists (deleted elsewhere),
  // means the oldest business: what the server opens without an id.
  const active: Business | undefined =
    businesses.find((b) => b.id === activeId) ?? businesses[0];

  const open = useCallback(
    (b: Business) => dispatch(switchBusiness(b.id)),
    [dispatch],
  );
  const create = useCallback(
    async (name: string) => {
      const b = await createMut({ name }).unwrap();
      dispatch(switchBusiness(b.id));
      return b;
    },
    [createMut, dispatch],
  );
  const rename = useCallback(
    (id: string, name: string) => renameMut({ id, name }).unwrap(),
    [renameMut],
  );
  const remove = useCallback(
    async (b: Business) => {
      if (b.id === activeId) dispatch(switchBusiness(null));
      await deleteMut(b.id).unwrap();
    },
    [deleteMut, dispatch, activeId],
  );

  return {
    businesses, active, isLoading, open, create, rename, remove,
  };
}
