import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Box, Heading, Input, Button, VStack, Text, Container, useToast
} from "@chakra-ui/react";

interface LoginProps {
  setIsAuthenticated: (auth: boolean) => void;
}

const Login: React.FC<LoginProps> = ({ setIsAuthenticated }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const toast = useToast(); 

  const handleLogin = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) throw new Error("Login gagal");

      const data = await response.json();
      localStorage.setItem("currentUser", data.username);
      localStorage.setItem("isAuthenticated", "true");
      setIsAuthenticated(true); // ✅ Menandakan user sudah login

      toast({
        title: "Login Berhasil",
        description: `Selamat datang, ${username}!`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      navigate("/kanban");
    } catch (error) {
      console.error("Error saat login:", error);

      toast({
        title: "Login Gagal",
        description: "Periksa kembali username atau password Anda.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });

      setIsAuthenticated(false); // ✅ Tetap false jika login gagal
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleLogin();
    }
  };

  return (
    <Container maxW="400px" mt="10%" p={6} boxShadow="lg" borderRadius="md" bg="white">
      <Box textAlign="center">
        <Heading mb={5}>Login</Heading>
      </Box>

      <VStack spacing={4}>
        <Input
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          onKeyDown={handleKeyPress} 
        />
        <Input
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={handleKeyPress} 
        />
        <Button onClick={handleLogin} colorScheme="blue" width="100%">Login</Button>

        <Text fontSize="sm" mt={3}>
          Belum punya akun?{" "}
          <Text as="span" color="blue.500" cursor="pointer" fontWeight="bold" onClick={() => navigate("/register")}>
            Register
          </Text>
        </Text>
      </VStack>
    </Container>
  );
};

export default Login;
