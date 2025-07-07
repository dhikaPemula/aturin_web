import { useDataRefresh } from '../context/DataRefreshContext';

export const useGlobalActivityRefresh = () => {
  const { triggerActivityRefresh } = useDataRefresh();

  return {
    triggerActivityRefresh
  };
};