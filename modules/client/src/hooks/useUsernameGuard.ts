import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import type RoomsLocationState from '../types/RoomsLocationState';

const useUsernameGuard = <T extends RoomsLocationState = RoomsLocationState>(
  locationState: T | null,
): void => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!locationState?.username) {
      navigate('/');
    }
  }, [locationState?.username]);
};

export default useUsernameGuard;
