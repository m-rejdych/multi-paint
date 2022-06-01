import { type FC } from 'react';
import { Box } from '@chakra-ui/react';
import { Outlet } from 'react-router-dom';

const App: FC = () => {
  return (
    <Box> 
      <Outlet />
    </Box>
  );
};

export default App;
