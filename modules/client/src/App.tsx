import { type FC, useEffect } from 'react';
import { Box } from '@chakra-ui/react';

let socket = new WebSocket(process.env.WS_URL as string);

const App: FC = () => {
  useEffect(() => {
    const handleOpen = (): void => {
      console.log('connection opened');
    };

    socket.addEventListener('open', handleOpen);

    return () => {
      socket.close();
      socket.removeEventListener('open', handleOpen);
    };
  }, []);

  return <Box>Hi</Box>;
};

export default App;
