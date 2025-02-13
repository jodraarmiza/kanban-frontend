import { Flex, Box, VStack, Input, Button } from "@chakra-ui/react";
import { DndContext, closestCorners } from "@dnd-kit/core";
import { SortableContext } from "@dnd-kit/sortable";
import { useState } from "react";
import KanbanColumn from "./KanbanColumn";

interface Task {
  id: string;
  content: string;
  status: string;
  createdAt: string;
  deadline: string;
}

interface KanbanProps {
  tasks: Task[];
  onAddTask: (newTask: Task) => void;
  onDeleteTask: (taskId: string) => void;
  onMoveTask: (taskId: string, newStatus: string) => void;
  onSaveDeadline: (taskId: string, newDeadline: string) => void;
}

const statuses = ["todo", "in-progress", "done"];

const Kanban: React.FC<KanbanProps> = ({ tasks, onAddTask, onDeleteTask, onMoveTask, onSaveDeadline }) => {
  const [newTask, setNewTask] = useState("");

  // ✅ **Fungsi untuk menyimpan deadline tanpa mengubah status**
  const handleSaveDeadline = (taskId: string, newDeadline: string) => {
    if (tasks.some(task => task.id === taskId)) {
      onSaveDeadline(taskId, newDeadline); // ✅ Langsung panggil tanpa perlu variabel `updatedTasks`
    }
  };

  const addTask = () => {
    if (newTask.trim() === "") return;
    const today = new Date().toISOString().split("T")[0];

    const taskObject: Task = {
      id: Date.now().toString(),
      content: newTask,
      status: "todo",
      createdAt: today,
      deadline: today,
    };

    onAddTask(taskObject);
    setNewTask("");
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      addTask();
    }
  };

  return (
    <VStack spacing={4} align="center" width="100%">
      <Flex gap={2} mb={4}>
        <Input
          placeholder="Tambah tugas..."
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          onKeyDown={handleKeyPress}
          width="300px"
        />
        <Button onClick={addTask} colorScheme="blue">Tambah</Button>
      </Flex>

      <DndContext
        collisionDetection={closestCorners}
        onDragEnd={(event) => {
          const { active, over } = event;
          if (!over || !active) return;

          const activeTask = tasks.find(task => task.id === active.id);
          if (!activeTask) return;

          const newStatus = over.data.current?.status ?? activeTask.status;

          if (activeTask.status !== newStatus) {
            onMoveTask(activeTask.id, newStatus);
          }
        }}
      >
        <Flex justify="center" gap={5} width="100%" alignItems="stretch">
          {statuses.map((status) => (
            <Box
              key={status}
              id={status}
              data-status={status}
              flex="1"
              border="2px solid gray"
              borderRadius="md"
              p={4}
              display="flex"
              flexDirection="column"
              alignItems="stretch"
            >
              <SortableContext items={tasks.filter(task => task.status === status).map(task => task.id)}>
                <KanbanColumn
                  status={status}
                  tasks={tasks.filter(task => task.status === status)}
                  onUpdateStatus={onMoveTask}
                  onDeleteTask={onDeleteTask}
                  onSaveDeadline={handleSaveDeadline} // ✅ DITERUSKAN KE KOMPONEN
                />
              </SortableContext>
            </Box>
          ))}
        </Flex>
      </DndContext>
    </VStack>
  );
};

export default Kanban;
