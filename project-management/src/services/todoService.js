import { invoke } from "@tauri-apps/api/core";

export const TodoService = {
  async getTodos(projectPath) {
    try {
      return await invoke("get_todos", { projectPath });
    } catch (error) {
      console.error("Error fetching todos:", error);
      return [];
    }
  },

  async addTodo(projectPath, task) {
    try {
      return await invoke("add_todo", { projectPath, task });
    } catch (error) {
      console.error("Error adding todo:", error);
      throw error;
    }
  },

  async toggleTodo(id, isCompleted) {
    try {
      await invoke("toggle_todo", { id, isCompleted });
    } catch (error) {
      console.error("Error toggling todo:", error);
      throw error;
    }
  },

  async updateTodoOrder(id, newOrder) {
    try {
      await invoke("update_todo_order", { id, newOrder });
    } catch (error) {
      console.error("Error updating todo order:", error);
      throw error;
    }
  },

  async deleteTodo(id) {
    try {
      await invoke("delete_todo", { id });
    } catch (error) {
      console.error("Error deleting todo:", error);
      throw error;
    }
  }
};
