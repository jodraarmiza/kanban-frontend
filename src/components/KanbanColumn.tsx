import { useState } from "react";
import { Box, Text, VStack, Button, Collapse, Input, useToast } from "@chakra-ui/react";
import { useDroppable } from "@dnd-kit/core";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface Task {
  id: string;
  content: string;
  status: string;
  createdAt: string;
  deadline: string;
}

interface KanbanColumnProps {
  status: string;
  tasks: Task[];
  onUpdateStatus: (taskId: string, newStatus: string) => void;
  onDeleteTask: (taskId: string) => void;
  onSaveDeadline: (taskId: string, newDeadline: string) => void;
}

const statuses = ["todo", "in-progress", "done"]; // Urutan status

// **🎨 Fungsi untuk mendapatkan warna background berdasarkan status**
const getBackgroundColor = (status: string) => {
  switch (status) {
    case "todo":
      return "#FFEBEE"; // 🎀 Pink pastel
    case "in-progress":
      return "#E3F2FD"; // 🔹 Biru muda
    case "done":
      return "#E8F5E9"; // ✅ Hijau pastel
    default:
      return "white";
  }
};

// **🎨 Fungsi untuk mendapatkan warna teks header berdasarkan status**
const getTextColor = (status: string) => {
  switch (status) {
    case "todo":
      return "#D32F2F"; // 🔴 Merah tua
    case "in-progress":
      return "#1976D2"; // 🔵 Biru tua
    case "done":
      return "#388E3C"; // 🟢 Hijau tua
    default:
      return "black";
  }
};

const KanbanColumn: React.FC<KanbanColumnProps> = ({ status, tasks, onUpdateStatus, onDeleteTask, onSaveDeadline }) => {
  const { setNodeRef } = useDroppable({ id: status });
  const toast = useToast();
  const currentIndex = statuses.indexOf(status);
  const [openTaskId, setOpenTaskId] = useState<string | null>(null);
  const [tempDeadlines, setTempDeadlines] = useState<Record<string, Date | null>>({});

  return (
    <VStack
      ref={setNodeRef}
      width="100%"
      minHeight="100%"
      spacing={0}
      align="stretch"
      flex="1"
    >
      {/* 🔹 Header Kolom */}
      <Box 
        bg="white" 
        p={3} 
        borderTopRadius="md" 
        border="1px solid gray" 
        textAlign="center"
      >
        <Text fontSize="xl" fontWeight="bold" color={getTextColor(status)}>
          {status.toUpperCase()}
        </Text>
      </Box>

      {/* 🔹 Body Kolom */}
      <VStack
        bg={getBackgroundColor(status)}
        p={4}
        borderBottomRadius="md"
        border="1px solid gray"
        width="100%"
        flex="1"
        minHeight="500px"
        align="start"
        spacing={3}
      >
        {tasks.length === 0 && (
          <Text color="gray.500" fontSize="lg" textAlign="center">Fill me</Text>
        )}

        <VStack width="100%" align="start">
          {tasks.map(task => (
            <Box 
              key={task.id} 
              p={3} 
              bg="white" 
              borderRadius="md" 
              shadow="md" 
              width="100%" 
              display="flex" 
              flexDirection="column"
              _hover={{ shadow: "lg", transform: "scale(1.02)", transition: "0.2s ease-in-out" }}
            >
              {/* 🏷️ Tugas - Bisa diklik untuk buka/tutup detail */}
              <Text
                fontSize="md"
                fontWeight="bold"
                cursor="pointer"
                onClick={() => setOpenTaskId(openTaskId === task.id ? null : task.id)}
              >
                {task.content}
              </Text>

              <Collapse in={openTaskId === task.id} animateOpacity>
                {/* 🕒 Tampilkan Tanggal Pembuatan & Deadline */}
                <Text fontSize="xs" color="gray.600">📅 Dibuat: {new Date(task.createdAt).toLocaleDateString()}</Text>
                <Text fontSize="xs" color="red.500">⏳ Deadline:</Text>

                <DatePicker
                  selected={tempDeadlines[task.id] || (task.deadline ? new Date(task.deadline) : null)}
                  onChange={(date) => setTempDeadlines(prev => ({ ...prev, [task.id]: date }))}
                  dateFormat="dd/MM/yyyy"
                  customInput={<Input size="sm" />}
                />
                <Button
                  mt={2}
                  size="xs"
                  colorScheme="green"
                  onClick={() => {
                    if (tempDeadlines[task.id]) {
                      const formattedDeadline = tempDeadlines[task.id]!.toISOString().split("T")[0];

                      // **Hanya update jika deadline benar-benar berubah**
                      if (formattedDeadline !== task.deadline) {
                        onSaveDeadline(task.id, formattedDeadline);
                        setTempDeadlines(prev => ({ ...prev, [task.id]: null }));

                        // 🔔 **Tampilkan alert setelah menyimpan deadline**
                        toast({
                          title: "Deadline Disimpan",
                          description: `Deadline berhasil disimpan untuk tugas "${task.content}".`,
                          status: "success",
                          duration: 2000,
                          isClosable: true,
                        });
                      }
                    }
                  }}
                  isDisabled={!tempDeadlines[task.id] || tempDeadlines[task.id]?.toISOString().split("T")[0] === task.deadline}
                >
                  Simpan Deadline
                </Button>
              </Collapse>

              {/* 🔹 Tombol Navigasi */}
              <Box display="flex" gap={2} mt={2} justifyContent="center">
                {/* Tombol Kembali, dinonaktifkan jika di "todo" */}
                <Button 
                  size="xs" 
                  colorScheme="gray" 
                  onClick={() => onUpdateStatus(task.id, statuses[currentIndex - 1])}
                  isDisabled={currentIndex === 0}
                >
                  ←
                </Button>

                {/* Tombol Hapus */}
                <Button size="xs" colorScheme="red" onClick={() => onDeleteTask(task.id)}>X</Button>

                {/* Tombol Maju, dinonaktifkan jika di "done" */}
                <Button 
                  size="xs" 
                  colorScheme="blue" 
                  onClick={() => onUpdateStatus(task.id, statuses[currentIndex + 1])}
                  isDisabled={currentIndex === statuses.length - 1}
                >
                  →
                </Button>
              </Box>
            </Box>
          ))}
        </VStack>
      </VStack>
    </VStack>
  );
};

export default KanbanColumn;
