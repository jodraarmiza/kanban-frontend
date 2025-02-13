import { useState, useEffect } from "react";
import {
  Box, Heading, Flex, VStack, Text, IconButton, Avatar, Drawer,
  DrawerBody, DrawerHeader, DrawerOverlay, DrawerContent, Input, 
  Progress, Divider, Tooltip, useToast, Button
} from "@chakra-ui/react";
import { CalendarIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Kanban from "./Kanban";

interface Task {
  id: string;
  content: string;
  status: string;
  createdAt: string;
  deadline: string;
}

interface KanbanBoardProps {
  isAuthenticated: boolean;
}

const KanbanBoard: React.FC<KanbanBoardProps> = ({ isAuthenticated }) => {
  const [tasksByDate, setTasksByDate] = useState<Record<string, Task[]>>({});
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [username, setUsername] = useState("User123");
  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login", { replace: true });
    }
  }, [isAuthenticated, navigate]);
  
  useEffect(() => {
    const currentUser = localStorage.getItem("currentUser") || "User123";
    const storedData = localStorage.getItem("tasksByUser");

    if (storedData) {
        try {
            const parsedData = JSON.parse(storedData);
            setTasksByDate(parsedData[currentUser] || {}); // ✅ Ambil data yang benar
        } catch (error) {
            console.error("Error parsing localStorage data:", error);
        }
    }
}, [username]); // ✅ Jalankan ulang ketika user berubah


  useEffect(() => {
    const currentUser = localStorage.getItem("currentUser") || "User123";
    const storedData = localStorage.getItem("tasksByUser");
    const parsedData = storedData ? JSON.parse(storedData) : {};

    // ✅ Pastikan user memiliki struktur yang benar di localStorage
    if (!parsedData[currentUser]) {
        parsedData[currentUser] = {};
    }

    parsedData[currentUser] = tasksByDate; // ✅ Simpan data yang benar
    localStorage.setItem("tasksByUser", JSON.stringify(parsedData));
}, [tasksByDate]);


  const currentDateKey = selectedDate.toISOString().split("T")[0];

  const tasksForCurrentDate = Array.from(
    new Map(
      Object.values(tasksByDate)
        .flat()
        .filter(task => {
          const taskStart = new Date(task.createdAt);
          const taskEnd = new Date(task.deadline);
          const selected = new Date(currentDateKey);
          return selected >= taskStart && selected <= taskEnd;
        })
        .map(task => [task.id, task])
    ).values()
  );

  useEffect(() => {
    setTasksByDate(prevTasks => {
      if (JSON.stringify(prevTasks[currentDateKey]) !== JSON.stringify(tasksForCurrentDate)) {
        return {
          ...prevTasks,
          [currentDateKey]: tasksForCurrentDate,
        };
      }
      return prevTasks;
    });
  }, [selectedDate]);

  const handleSaveDeadline = (taskId: string, newDeadline: string) => {
    setTasksByDate(prev => {
      const updatedTasks = { ...prev };
      for (const date in updatedTasks) {
        updatedTasks[date] = updatedTasks[date].map(task =>
          task.id === taskId ? { ...task, deadline: newDeadline } : task
        );
      }
      return updatedTasks;
    });

    toast({
      title: "Deadline Disimpan",
      description: "Deadline berhasil diperbarui.",
      status: "success",
      duration: 2000,
      isClosable: true,
    });
  };

  const handleAddTask = (newTask: Task) => {
    setTasksByDate(prev => ({
      ...prev,
      [newTask.deadline]: [...(prev[newTask.deadline] || []), newTask],
    }));

    toast({
      title: "Tugas Ditambahkan",
      description: "Tugas berhasil ditambahkan ke board.",
      status: "success",
      duration: 2000,
      isClosable: true,
    });
  };

  const handleDeleteTask = (taskId: string) => {
    setTasksByDate(prev => {
      const updatedTasks = { ...prev };
      for (const date in updatedTasks) {
        updatedTasks[date] = updatedTasks[date].filter(task => task.id !== taskId);
      }
      return updatedTasks;
    });

    toast({
      title: "Tugas Dihapus",
      description: "Tugas berhasil dihapus dari board.",
      status: "error",
      duration: 2000,
      isClosable: true,
    });
  };

  const handleMoveTask = (taskId: string, newStatus: string) => {
    setTasksByDate(prev => {
      const updatedTasks = { ...prev };
      for (const date in updatedTasks) {
        updatedTasks[date] = updatedTasks[date].map(task =>
          task.id === taskId ? { ...task, status: newStatus } : task
        );
      }
      return updatedTasks;
    });
  };

  const handleDateChange = (date: Date | null) => {
    if (date) {
      setSelectedDate(date);
    }
    setIsDatePickerOpen(false);
  };

  // ✅ **Hitung jumlah tugas selesai**
  const totalTasks = tasksForCurrentDate.length;
  const doneTasks = tasksForCurrentDate.filter(task => task.status === "done").length;
  const progressPercentage = totalTasks > 0 ? (doneTasks / totalTasks) * 100 : 0;

  return (
    <Box p={5} textAlign="center">
      <Flex justify="space-between" alignItems="center" mb={4}>
        <VStack align="start" spacing={1} position="relative" zIndex="10">
          <Flex alignItems="center">
            <IconButton
              icon={<CalendarIcon />}
              aria-label="Pilih tanggal"
              size="sm"
              bg="blue.500"
              color="white"
              _hover={{ bg: "blue.600" }}
              onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
            />
            <Text fontSize="lg" fontWeight="bold" color="blue.600" ml={3}>
              {selectedDate.toLocaleDateString("id-ID", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </Text>
          </Flex>

          <DatePicker
            selected={selectedDate}
            onChange={handleDateChange}
            dateFormat="dd/MM/yyyy"
            popperPlacement="bottom-start"
            open={isDatePickerOpen}
            onClickOutside={() => setIsDatePickerOpen(false)}
            customInput={<input style={{ display: "none" }} />}
          />
        </VStack>

        <Tooltip label="Buka Profile" aria-label="Profile">
          <Avatar name={username} cursor="pointer" onClick={() => setIsProfileOpen(true)} />
        </Tooltip>
      </Flex>

      <Heading mb={5}>Kanban Board</Heading>

      <div className="kanban-container">
        <Kanban
          tasks={tasksForCurrentDate}
          onAddTask={handleAddTask}
          onDeleteTask={handleDeleteTask}
          onMoveTask={handleMoveTask}
          onSaveDeadline={handleSaveDeadline}
        />
      </div>

      <Drawer isOpen={isProfileOpen} placement="right" onClose={() => setIsProfileOpen(false)}>
        <DrawerOverlay />
        <DrawerContent p={4}>
          <DrawerHeader>Profile</DrawerHeader>
          <DrawerBody>
            <Avatar name={username} size="xl" mb={4} />
            <Input value={username}onChange={(e) => {setUsername(e.target.value);localStorage.setItem("currentUser", e.target.value); }} placeholder="Nama Anda"/>
            <Divider my={4} />
            <Text fontSize="md" fontWeight="bold">Progres Tugas</Text>
            <Progress value={progressPercentage} colorScheme="blue" hasStripe isAnimated />
            {/* ✅ **Tambahkan jumlah tugas selesai** */}
            <Text mt={2} fontSize="sm" textAlign="center">
              {doneTasks} dari {totalTasks} tugas selesai dikerjakan
            </Text>
            <Button mt={4} colorScheme="red" onClick={() => {localStorage.removeItem("currentUser"); navigate("/login", { replace: true }); }}>Logout</Button>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Box>
  );
};

export default KanbanBoard;
