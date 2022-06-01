import { type FC, useState } from 'react';
import { VStack, Box, Input, Text, Button } from '@chakra-ui/react';

const Login: FC = () => {
  const [value, setValue] = useState('');
  const [touched, setTouched] = useState(false);

  const isInvalid = touched && !value;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setValue(e.target.value);
  };

  const handleBlur = (_: React.FocusEvent<HTMLInputElement>): void => {
    if (!touched) setTouched(true);
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
          value={value}
          colorScheme="teal"
          placeholder={isInvalid ? 'Username is required' : ''}
          _placeholder={{ color: 'red.500' }}
          isInvalid={isInvalid}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        <Button
          variant="solid"
          colorScheme="teal"
          disabled={!touched || isInvalid}
        >
          Enter
        </Button>
      </VStack>
    </Box>
  );
};

export default Login;
