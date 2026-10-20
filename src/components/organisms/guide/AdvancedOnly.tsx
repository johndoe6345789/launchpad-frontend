'use client';

import React from 'react';
import { useGuideSelector } from './useGuideSelector';

/** Shows its children only when advanced tools are switched on. */
export const AdvancedOnly: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const advanced = useGuideSelector((s) => s.guide.advanced);
  return advanced ? <>{children}</> : null;
};

export default AdvancedOnly;
