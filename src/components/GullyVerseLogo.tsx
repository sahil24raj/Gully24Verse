'use client';

import React from 'react';
import { MastiverseLogo, MastiverseLogoProps } from '@/components/MastiverseLogo';

export type GullyVerseLogoProps = MastiverseLogoProps;

/**
 * Backward compatibility wrapper: GullyVerseLogo now renders the unified Mastiverse brand identity.
 */
export const GullyVerseLogo: React.FC<GullyVerseLogoProps> = (props) => {
  return <MastiverseLogo {...props} />;
};

export default GullyVerseLogo;
