import { useState, useEffect } from "react";
import { CheckCircle2, Circle, Plus, Trash2, GripVertical, CheckCheck } from "lucide-react";
import { TodoService } from "../services/todoService";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { restrictToVerticalAxis, restrictToParentElement } from "@dnd-kit/modifiers";

export const TodoSection = ({ projectPath }) => {
  const [todos, setTodos] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [loading, setLoading] = useState(true);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    const fetchTodos = async () => {
      setLoading(true);
      const data = await TodoService.getTodos(projectPath);
      setTodos(data);
      setLoading(false);
    };
    fetchTodos();
  }, [projectPath]);

  const handleAddTodo = async (e) => {
    if (e.key !== "Enter" || !newTask.trim()) return;
    try {
      const added = await TodoService.addTodo(projectPath, newTask.trim());
      setTodos(prev => [...prev, added]);
      setNewTask("");
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggle = async (id, currentStatus) => {
    try {
      await TodoService.toggleTodo(id, !currentStatus);
      setTodos(prev => prev.map(t => t.id === id ? { ...t, is_completed: !currentStatus } : t));
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await TodoService.deleteTodo(id);
      setTodos(prev => prev.filter(t => t.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;

    if (active && over && active.id !== over.id) {
      const oldIndex = todos.findIndex((i) => i.id === active.id);
      const newIndex = todos.findIndex((i) => i.id === over.id);

      const newArray = arrayMove(todos, oldIndex, newIndex);
      setTodos(newArray);

      // Update database orders
      newArray.forEach((todo, index) => {
        TodoService.updateTodoOrder(todo.id, index).catch(err => console.error("Order error", err));
      });
    }
  };

  const completedCount = todos.filter(t => t.is_completed).length;

  return (
    <div className="flex flex-col h-full bg-zinc-50/50 dark:bg-zinc-900/20 p-3 rounded-2xl border border-zinc-100 dark:border-zinc-800/10 shadow-inner-sm overflow-hidden">
      {/* Input */}
      <div className="mb-3 shrink-0">
        <div className="relative rounded-xl overflow-hidden shadow-sm">
          <Plus className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={14} />
          <input
            type="text"
            placeholder="Yapılacak ekle..."
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            onKeyDown={handleAddTodo}
            className="w-full bg-white dark:bg-zinc-800 border-none py-2.5 pl-9 pr-3 text-xs outline-none transition-all dark:text-zinc-100 placeholder:text-zinc-500 font-medium focus:ring-1 focus:ring-blue-500/20"
          />
        </div>
      </div>

      {/* Counter */}
      {todos.length > 0 && (
        <div className="mb-3 px-1 flex items-center justify-between shrink-0">
          <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-1.5 opacity-60">
            <CheckCheck size={12} className="text-emerald-500" /> Tamamlanan: {completedCount}/{todos.length}
          </p>
        </div>
      )}

      {/* List Container - This is the parent for restricted DnD */}
      <div className="flex-1 min-h-0 overflow-y-auto pr-1 custom-scrollbar">
        {loading ? (
          <div className="py-6 text-center text-zinc-400 text-[10px] font-bold uppercase tracking-widest opacity-20">Açılıyor...</div>
        ) : todos.length === 0 ? (
          <div className="py-12 border border-dashed border-zinc-100 dark:border-zinc-800/20 rounded-xl flex flex-col items-center justify-center text-zinc-300 dark:text-zinc-700">
            <CheckCircle2 size={30} className="mb-2 opacity-10" />
            <p className="text-[9px] font-bold uppercase tracking-widest">Henüz görev eklenmedi</p>
          </div>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
            modifiers={[restrictToVerticalAxis, restrictToParentElement]}
          >
            <SortableContext
              items={todos.map(t => t.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-1.5 pb-2">
                {todos.map((todo) => (
                  <SortableTodoItem
                    key={todo.id}
                    todo={todo}
                    onToggle={handleToggle}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}
      </div>
    </div>
  );
};

const SortableTodoItem = ({ todo, onToggle, onDelete }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: todo.id });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group flex items-center gap-1.5 p-2 rounded-xl border transition-all duration-150 ${isDragging
        ? "bg-white dark:bg-zinc-800 border-blue-500/50 shadow-xl opacity-100 scale-[1.01]"
        : "bg-white dark:bg-zinc-900 border-zinc-50 dark:border-zinc-800/30 hover:border-zinc-200 dark:hover:border-zinc-800 hover:shadow-sm"
        }`}
    >
      <button
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing p-1 text-zinc-300 dark:text-zinc-700 hover:text-zinc-500 transition-colors shrink-0"
      >
        <GripVertical size={14} />
      </button>

      <div
        className="flex items-center gap-2.5 flex-1 cursor-pointer select-none py-0.5"
        onClick={() => onToggle(todo.id, todo.is_completed)}
      >
        <div className="relative flex items-center justify-center shrink-0">
          {todo.is_completed ? (
            <CheckCircle2 size={16} className="text-emerald-500" />
          ) : (
            <Circle size={16} className="text-zinc-300 dark:text-zinc-600" />
          )}
        </div>
        <span className={`text-[12px] font-bold tracking-tight truncate ${todo.is_completed ? 'text-zinc-400 line-through' : 'text-zinc-700 dark:text-zinc-200'}`}>
          {todo.task}
        </span>
      </div>

      <button
        onClick={() => onDelete(todo.id)}
        className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-red-500/10 text-red-500 rounded-lg transition-all"
      >
        <Trash2 size={14} />
      </button>
    </div>
  );
};
