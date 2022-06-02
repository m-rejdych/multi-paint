import { type FC, useState } from 'react';
import { VStack, Box, Input, Text, Button } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

const Login: FC = () => {
  const [username, setUsername] = useState('');
  const [touched, setTouched] = useState(false);
  const navigate = useNavigate();

  const isInvalid = touched && !username;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (!touched) setTouched(true);
    setUsername(e.target.value);
  };

  const handleBlur = (): void => {
    if (!touched) setTouched(true);
  };

  const handleSubmit = (): void => {
    navigate('/rooms', { state: { username } });
  };

  return (
    <Box h="100vh" display="flex" alignItems="center" justifyContent="center">
      <VStack
        spacing={3}
        w="30%"
        p={6}
        bgColor="gray.100"
        boxShadow="md"
        borderRadius="md"
      >
        <Text as="h1" fontSize="lg" fontWeight="bold">
          Enter username
        </Text>
        <Input
          value={username}
          colorScheme="teal"
          placeholder={isInvalid ? 'Username is required' : ''}
          _placeholder={{ color: 'red.500' }}
          isInvalid={isInvalid}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        <Button
          colorScheme="teal"
          disabled={!touched || isInvalid}
          onClick={handleSubmit}
        >
          Enter
        </Button>
      </VStack>
    </Box>
  );
};

export default Login;
