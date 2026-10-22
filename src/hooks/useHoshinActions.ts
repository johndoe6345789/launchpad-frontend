/**
 * @file useHoshinActions.ts
 * @brief Add and remove X-matrix objectives and links, with a
 *        plain error message when a change does not save.
 */
import { useCallback, useState } from 'react';
import {
  useCreateObjectiveMutation,
  useDeleteObjectiveMutation,
  useCreateLinkMutation,
  useDeleteLinkMutation,
} from '@/store/api/hoshinApi';
import type {
  CreateObjectiveInput, HoshinStrength,
} from '@/types/hoshin';

/** What the X-matrix can do. */
export interface HoshinActions {
  addObjective: (input: CreateObjectiveInput) => Promise<boolean>;
  removeObjective: (id: string) => Promise<void>;
  addLink: (
    objectiveId: string, organisationId: string,
    strength: HoshinStrength,
  ) => Promise<void>;
  removeLink: (id: string) => Promise<void>;
  /** The last error, or null. */
  error: string | null;
}

/** Error text from an RTK Query failure. */
function message(e: unknown): string {
  const data = (e as { data?: { error?: string } })?.data;
  return data?.error ?? 'That did not save. Please try again.';
}

/** Actions for the X-matrix. */
export function useHoshinActions(): HoshinActions {
  const [createObjective] = useCreateObjectiveMutation();
  const [deleteObjective] = useDeleteObjectiveMutation();
  const [createLink] = useCreateLinkMutation();
  const [deleteLink] = useDeleteLinkMutation();
  const [error, setError] = useState<string | null>(null);

  const run = useCallback(
    async (fn: () => Promise<unknown>): Promise<boolean> => {
      setError(null);
      try { await fn(); return true; } catch (e) {
        setError(message(e));
        return false;
      }
    }, [],
  );

  return {
    error,
    addObjective: (input) =>
      run(() => createObjective(input).unwrap()),
    removeObjective: async (id) => {
      await run(() => deleteObjective(id).unwrap());
    },
    addLink: async (objective_id, organisation_id, strength) => {
      await run(() => createLink({
        objective_id, organisation_id, strength,
      }).unwrap());
    },
    removeLink: async (id) => {
      await run(() => deleteLink(id).unwrap());
    },
  };
}
