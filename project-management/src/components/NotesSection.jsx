import { useState, useEffect, useRef } from "react";
import { Plus, Trash2, StickyNote, Palette, Loader2 } from "lucide-react";
import { NoteService } from "../services/noteService";
import { motion, AnimatePresence } from "framer-motion";

const COLORS = [
  { name: "Yellow", value: "#fef08a", border: "#fde047" },
  { name: "Blue", value: "#bfdbfe", border: "#93c5fd" },
  { name: "Pink", value: "#fbcfe8", border: "#f9a8d4" },
  { name: "Green", value: "#bbf7d0", border: "#86efac" },
  { name: "Purple", value: "#e9d5ff", border: "#d8b4fe" },
];

export const NotesSection = ({ projectPath }) => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotes = async () => {
      setLoading(true);
      const data = await NoteService.getNotes(projectPath);
      setNotes(data || []);
      setLoading(false);
    };
    fetchNotes();
  }, [projectPath]);

  const handleAddNote = async () => {
    try {
      const color = COLORS[Math.floor(Math.random() * COLORS.length)].value;
      const newNote = await NoteService.addNote(projectPath, "", color);
      setNotes(prev => [newNote, ...prev]);
    } catch (err) {
      console.error(err);
    }
  };

  const handleNoteUpdate = (id, newContent, newColor) => {
    setNotes(prev => prev.map(n => n.id === id ? { ...n, content: newContent, color: newColor } : n));
  };

  const handleDeleteNote = async (id) => {
    try {
      await NoteService.deleteNote(id);
      setNotes(prev => prev.filter(n => n.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2 px-1">
          <StickyNote size={15} /> Yeni Not Ekle
        </h3>
        <button
          onClick={handleAddNote}
          className="p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl text-zinc-500 hover:text-blue-500 transition-all cursor-pointer shadow-sm bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800"
          title="Yeni Not Ekle"
        >
          <Plus size={18} />
        </button>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto pr-2 custom-scrollbar mask-fade-bottom">
        <div className="grid grid-cols-1 gap-5 pb-4">
          {loading ? (
            <div className="py-12 text-center text-zinc-400 text-[11px] animate-pulse font-bold uppercase tracking-widest">
              <Loader2 className="mx-auto mb-2 animate-spin" size={20} /> Yükleniyor...
            </div>
          ) : !notes || notes.length === 0 ? (
            <div className="py-16 border-2 border-dashed border-zinc-100 dark:border-zinc-800/30 rounded-3xl flex flex-col items-center justify-center text-zinc-300 dark:text-zinc-700">
              <StickyNote size={40} className="mb-3 opacity-20" />
              <p className="text-[11px] font-bold uppercase tracking-widest">Henüz bir not eklenmedi</p>
            </div>
          ) : (
            <AnimatePresence mode="popLayout">
              {notes.map((note) => (
                <NoteCard
                  key={note.id}
                  note={note}
                  onUpdate={handleNoteUpdate}
                  onDelete={handleDeleteNote}
                />
              ))}
            </AnimatePresence>
          )}
        </div>
      </div>
    </div>
  );
};

const NoteCard = ({ note, onUpdate, onDelete }) => {
  const [content, setContent] = useState(note.content);
  const [color, setColor] = useState(note.color);
  const [showColors, setShowColors] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const timerRef = useRef(null);

  // Sync internal state if external updates (rare but possible)
  useEffect(() => {
    setContent(note.content);
    setColor(note.color);
  }, [note.id]);

  const triggerSave = (newContent, newColor) => {
    setIsSaving(true);
    if (timerRef.current) clearTimeout(timerRef.current);

    timerRef.current = setTimeout(async () => {
      try {
        await NoteService.updateNote(note.id, newContent, newColor);
        onUpdate(note.id, newContent, newColor);
      } catch (err) {
        console.error("Save error:", err);
      } finally {
        setIsSaving(false);
      }
    }, 800);
  };

  const handleContentChange = (e) => {
    const value = e.target.value;
    setContent(value);
    triggerSave(value, color);
  };

  const handleColorChange = (newColor) => {
    setColor(newColor);
    triggerSave(content, newColor);
    setShowColors(false);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      style={{ backgroundColor: color }}
      className="group relative p-5 rounded-3xl shadow-sm border border-black/5 flex flex-col min-h-[160px] transition-all duration-300 hover:shadow-md hover:-translate-y-1"
    >
      {/* Post-it "Folded" visual cue */}
      <div className="absolute top-0 right-0 w-8 h-8 bg-black/5 rounded-bl-3xl pointer-events-none" />

      <textarea
        value={content}
        onChange={handleContentChange}
        placeholder="Bir şeyler yaz..."
        className="flex-1 w-full bg-transparent resize-none outline-none text-zinc-800 text-[14px] font-semibold tracking-tight placeholder:text-black/10 leading-relaxed font-sans"
      />

      <div className="mt-4 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-all duration-200">
        <div className="flex items-center gap-2">
          <div className="relative">
            <button
              onClick={() => setShowColors(!showColors)}
              className="p-1.5 hover:bg-black/10 rounded-xl text-black/40 hover:text-black/60 transition-colors"
            >
              <Palette size={16} />
            </button>
            {showColors && (
              <div className="absolute top-full left-0 mt-2 p-2 bg-white dark:bg-zinc-950 shadow-2xl border border-zinc-200/50 dark:border-zinc-800/50 rounded-2xl flex gap-2.5 z-50">
                {COLORS.map((c) => (
                  <button
                    key={c.name}
                    onClick={() => handleColorChange(c.value)}
                    style={{ backgroundColor: c.value }}
                    className={`w-6 h-6 rounded-full border border-black/5 hover:scale-125 transition-transform ${color === c.value ? 'ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-zinc-950' : ''}`}
                  />
                ))}
              </div>
            )}
          </div>
          {isSaving && <Loader2 size={12} className="text-black/20 animate-spin" />}
        </div>

        <button
          onClick={() => onDelete(note.id)}
          className="p-1.5 hover:bg-red-500/10 rounded-xl text-black/30 hover:text-red-600 transition-colors"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </motion.div>
  );
};
