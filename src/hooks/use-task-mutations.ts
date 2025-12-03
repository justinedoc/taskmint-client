import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { API } from "@/api/axios";
import { parseAxiosError } from "@/lib/parse-axios-error";
import { analyticsKeys, taskKeys } from "@/lib/query-keys";
import { queryClient } from "@/main";

// Types matching backend Zod Schema
type CreateTaskPayload = {
  title: string;
  priority: string;
  status?: string;
  startTime: Date | string;
  endTime: Date | string;
  description?: string;
  completed?: boolean;
};

type UpdateTaskPayload = Partial<CreateTaskPayload> & { _id: string };

// Helper to invalidate everything related to tasks and analytics
const invalidateAllTaskData = () => {
  queryClient.invalidateQueries({ queryKey: taskKeys.all });
  queryClient.invalidateQueries({ queryKey: analyticsKeys.all });
};

// --- DELETE ---
export function useDeleteTaskMutation() {
  return useMutation({
    mutationFn: async (taskId: string) => {
      await API.delete(`/tasks/${taskId}`);
    },
    onSuccess: () => {
      toast.success("Task deleted");
      invalidateAllTaskData();
    },
    onError: (error) => {
      const { message } = parseAxiosError(error);
      toast.error(message);
    },
  });
}

// --- CREATE ---
export function useCreateTaskMutation() {
  return useMutation({
    mutationFn: async (data: CreateTaskPayload) => {
      const res = await API.post("/tasks", data);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Task created");
      invalidateAllTaskData();
    },
    onError: (error) => {
      const { message } = parseAxiosError(error);
      toast.error(message);
    },
  });
}

// --- UPDATE ---
export function useUpdateTaskMutation() {
  return useMutation({
    mutationFn: async ({ _id, ...data }: UpdateTaskPayload) => {
      const res = await API.patch(`/tasks/${_id}`, data);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Task updated");
      invalidateAllTaskData();
    },
    onError: (error) => {
      const { message } = parseAxiosError(error);
      toast.error(message);
    },
  });
}

// --- TOGGLE COMPLETE (Specialized Mutation for UI snappiness) ---
export function useToggleTaskCompleteMutation() {
  return useMutation({
    mutationFn: async ({
      _id,
      completed,
    }: {
      _id: string;
      completed: boolean;
    }) => {
      const res = await API.patch(`/tasks/${_id}`, {
        completed,
        status: completed ? "completed" : "in progress",
      });
      return res.data;
    },
    onSuccess: (_, variables) => {
      const msg = variables.completed ? "Task completed!" : "Task re-opened";
      toast.success(msg);
      invalidateAllTaskData();
    },
    onError: (error) => {
      const { message } = parseAxiosError(error);
      toast.error(message);
    },
  });
}
