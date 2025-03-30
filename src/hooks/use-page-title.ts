import { TITLE_LOGO } from '@/constants/constants';
import { useEffect } from 'react';

export const usePageTitle = (title?: string) => {
  useEffect(() => {
    document.title = title ? `${title} - ${TITLE_LOGO}` : TITLE_LOGO;
  }, [title]);
};
