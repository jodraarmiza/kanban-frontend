import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Box, Heading, Input, Button, VStack, useToast, Text, Container 
} from "@chakra-ui/react";

interface LoginProps {
  setIsAuthenticated: (auth: boolean) => void;
}

const Login: React.FC<LoginProps> = ({ setIsAuthenticated }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const toast = useToast();

  const handleLogin = () => {
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const user = users.find(
      (user: any) => user.username === username && user.password === password
    );

    if (user) {
      localStorage.setItem("isAuthenticated", "true");
      setIsAuthenticated(true);

      toast({
        title: "Login Berhasil",
        description: "Selamat datang!",
        status: "success",
        duration: 2000,
        isClosable: true,
      });

      setTimeout(() => {
        navigate("/kanban");
      }, 1000);
    } else {
      toast({
        title: "Login Gagal",
        description: "Username atau password salah.",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    }
  };

  // ✅ Fungsi untuk menangani tekan tombol Enter
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
          onKeyDown={handleKeyPress} // ✅ Dapat menekan Enter untuk login
        />
        <Input
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={handleKeyPress} // ✅ Dapat menekan Enter untuk login
        />
        <Button onClick={handleLogin} colorScheme="blue" width="100%">Login</Button>

        {/* ✅ Tambahkan teks dan tombol Register */}
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
