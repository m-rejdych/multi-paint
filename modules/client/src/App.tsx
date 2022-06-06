import { type FC, useEffect } from 'react';
import { Box, useColorMode } from '@chakra-ui/react';
import { Outlet } from 'react-router-dom';

const App: FC = () => {
  const { setColorMode } = useColorMode();

  useEffect(() => {
    setColorMode('dark');
  }, []);

  return (
    <Box px={16} py={12} height="100vh">
      <Outlet />
    </Box>
  );
};

export default App;
