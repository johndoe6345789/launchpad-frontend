'use client';

import React from 'react';
import { GuideFab } from './GuideFab';
import { TourOverlay } from './TourOverlay';

/** Everything the beginner guide draws on top of the page. */
export const GuideLayer: React.FC = () => (
  <>
    <GuideFab />
    <TourOverlay />
  </>
);

export default GuideLayer;
