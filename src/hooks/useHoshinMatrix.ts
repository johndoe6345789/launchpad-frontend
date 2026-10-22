/**
 * @file useHoshinMatrix.ts
 * @brief Aggregates objectives, links, and orgs
 *        into grouped X-matrix rows.
 */

import { useMemo } from 'react';
import {
  useListObjectivesQuery,
} from '@/store/api/hoshinApi';
import {
  useListLinksQuery,
} from '@/store/api/hoshinApi';
import {
  useListOrganisationsQuery,
} from '@/store/api/organisationsApi';
import type { HoshinObjective, HoshinLink }
  from '@/types/hoshin';
import type { Organisation } from '@/types/organisations';

/** One row in the X-matrix display. */
export interface XMatrixRow {
  objective: HoshinObjective;
  links: Array<{
    link: HoshinLink;
    org: Organisation;
  }>;
}

/** Grouped X-matrix data keyed by horizon. */
export interface HoshinMatrix {
  vision:       XMatrixRow[];
  breakthrough: XMatrixRow[];
  annual:       XMatrixRow[];
  /** Companies a person can link an objective to. */
  organisations: Organisation[];
  isLoading:    boolean;
}

/**
 * @brief Builds a grouped X-matrix from API data.
 * @returns HoshinMatrix grouped by horizon level.
 */
export function useHoshinMatrix(): HoshinMatrix {
  const { data: objectives = [], isLoading: lo } =
    useListObjectivesQuery();
  const { data: links = [], isLoading: ll } =
    useListLinksQuery();
  const { data: orgs = [], isLoading: la } =
    useListOrganisationsQuery(undefined);

  const matrix = useMemo((): HoshinMatrix => {
    const orgMap = new Map<string, Organisation>(
      orgs.map((o) => [o.id, o]),
    );
    const rows: XMatrixRow[] = objectives.map(
      (obj) => ({
        objective: obj,
        links: links
          .filter((l) => l.objective_id === obj.id)
          .map((l) => ({
            link: l,
            org: orgMap.get(l.organisation_id)!,
          }))
          .filter((l) => l.org !== undefined),
      }),
    );
    return {
      vision:       rows.filter(
        (r) => r.objective.horizon === 'vision'),
      breakthrough: rows.filter(
        (r) => r.objective.horizon === 'breakthrough'),
      annual:       rows.filter(
        (r) => r.objective.horizon === 'annual'),
      organisations: orgs,
      isLoading: lo || ll || la,
    };
  }, [objectives, links, orgs, lo, ll, la]);

  return matrix;
}
