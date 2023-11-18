"use client"
import { ChakraProvider, Box, Button, Flex, Heading, Text } from '@chakra-ui/react';
import ThreeJSComponent from '@/app/components/starfield/starfield'; // Make sure to import ThreeJSComponent correctly

const Home = () => {
  const handleLogin = () => {
    // Handle login functionality
    console.log('Login clicked');
  };

  const handleSignup = () => {
    // Handle signup functionality
    console.log('Signup clicked');
  };

  return (
    <ChakraProvider>
      <Box position="relative" height="100vh" overflow="hidden">
        <ThreeJSComponent />
        <Flex direction="column" justify="center" align="center" position="absolute" top="0" left="0" width="100%" height="100%">
          <Box textAlign="center">
            <Heading as="h1" mb={4}>
              Welcome to AstroAlgorithm
            </Heading>
            <Text mb={8} fontSize="lg">
              Explore the cosmos through code!
            </Text>
            <Flex justify="center">
              <Button colorScheme='white' variant='outline' mr={4} onClick={handleLogin}>
                Login
              </Button>
              <Button colorScheme="teal" onClick={handleSignup}>
                Signup
              </Button>
            </Flex>
          </Box>
        </Flex>
      </Box>
    </ChakraProvider>
  );
};

export default Home;
