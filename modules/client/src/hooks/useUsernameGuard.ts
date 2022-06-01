import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface LocationState {
  username: string;
}

const useUsernameGuard = <T extends LocationState = LocationState>(
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
