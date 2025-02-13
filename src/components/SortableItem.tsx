import { Box, HStack, Text, IconButton } from "@chakra-ui/react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react"; // Ikon drag

interface Task {
  id: string;
  content: string;
  status: string;
}

interface SortableItemProps {
  task: Task;
  onUpdateStatus: (taskId: string, newStatus: string) => void;
}

const statuses = ["todo", "in-progress", "done"];

const SortableItem: React.FC<SortableItemProps> = ({ task, onUpdateStatus }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: task.id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform) || undefined,
    transition: transition || "transform 0.2s ease",
    userSelect: "none",
    cursor: "grab",
    opacity: transform ? 0.9 : 1, // Efek transparan saat dragging
    backgroundColor: "#FFF9C4", // 🟡 Sticky Note warna kuning pastel
    padding: "16px",
    borderRadius: "8px",
    boxShadow: "4px 4px 10px rgba(0, 0, 0, 0.15)",
    fontFamily: "'Comic Sans MS', cursive, sans-serif",
    fontSize: "16px",
    fontWeight: "bold",
    transformOrigin: "top left",
    rotate: "-2deg", // Efek miring seperti sticky note
    width: "100%", // Agar sticky note full lebar column
    minHeight: "100px", // Supaya lebih lebar
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  };

  // 🔹 Handler untuk mengubah status ketika teks diklik
  const handleDoubleClick = () => {
    const currentIndex = statuses.indexOf(task.status);
    const newStatus = statuses[(currentIndex + 1) % statuses.length];
    onUpdateStatus(task.id, newStatus);
  };

  return (
    <Box ref={setNodeRef} style={style}>
      <HStack spacing={3} align="center">
        {/* ✅ Ikon Drag dengan `listeners` */}
        <IconButton
          aria-label="Drag"
          icon={<GripVertical size={20} />}
          {...listeners}
          {...attributes}
          cursor="grab"
          variant="ghost"
          color="gray.600"
        />

        {/* ✅ Teks bisa diklik untuk ubah status */}
        <Text flex="1" onClick={handleDoubleClick} cursor="pointer">
          {task.content}
        </Text>
      </HStack>
    </Box>
  );
};

export default SortableItem;
