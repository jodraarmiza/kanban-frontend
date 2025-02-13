import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Box, Heading, Input, Button, VStack, Text, useToast, Container 
} from "@chakra-ui/react";

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const toast = useToast();

  const handleRegister = () => {
    if (!username.trim() || !password.trim()) {
      toast({
        title: "Registrasi Gagal",
        description: "Username dan password harus diisi!",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
      return;
    }

    // Cek apakah username sudah ada di localStorage
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const userExists = users.some((user: any) => user.username === username);

    if (userExists) {
      toast({
        title: "Registrasi Gagal",
        description: "Username sudah terdaftar!",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
      return;
    }

    // Simpan user baru ke localStorage
    users.push({ username, password });
    localStorage.setItem("users", JSON.stringify(users));

    toast({
      title: "Registrasi Berhasil",
      description: "Silakan login dengan akun Anda.",
      status: "success",
      duration: 2000,
      isClosable: true,
    });

    // Redirect ke halaman login setelah 1 detik
    setTimeout(() => {
      navigate("/login");
    }, 1000);
  };

  // ✅ Fungsi untuk menangani tekan tombol Enter
  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleRegister();
    }
  };

  return (
    <Container maxW="400px" mt="10%" p={6} boxShadow="lg" borderRadius="md" bg="white">
      <Box textAlign="center">
        <Heading mb={5}>Register</Heading>
      </Box>

      <VStack spacing={4}>
        <Input
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          onKeyDown={handleKeyPress} // ✅ Dapat menekan Enter untuk register
        />
        <Input
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={handleKeyPress} // ✅ Dapat menekan Enter untuk register
        />
        <Button onClick={handleRegister} colorScheme="blue" width="100%">Register</Button>

        {/* ✅ Tambahkan tombol kembali ke login */}
        <Text fontSize="sm" mt={3}>
          Sudah punya akun?{" "}
          <Text as="span" color="blue.500" cursor="pointer" fontWeight="bold" onClick={() => navigate("/login")}>
            Login
          </Text>
        </Text>
      </VStack>
    </Container>
  );
};

export default Register;
