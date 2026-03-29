import { invoke } from "@tauri-apps/api/core";

export const NoteService = {
  async getNotes(projectPath) {
    try {
      return await invoke("get_project_notes", { projectPath });
    } catch (error) {
      console.error("Error fetching project notes:", error);
      return [];
    }
  },

  async addNote(projectPath, content, color) {
    try {
      return await invoke("add_project_note", { projectPath, content, color });
    } catch (error) {
      console.error("Error adding project note:", error);
      throw error;
    }
  },

  async updateNote(id, content, color) {
    try {
      await invoke("update_project_note", { id, content, color });
    } catch (error) {
      console.error("Error updating project note:", error);
      throw error;
    }
  },

  async deleteNote(id) {
    try {
      await invoke("delete_project_note", { id });
    } catch (error) {
      console.error("Error deleting project note:", error);
      throw error;
    }
  }
};
