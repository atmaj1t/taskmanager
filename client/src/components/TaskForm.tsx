import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { insertTaskSchema } from "@shared/schema";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

// Extend the insertTaskSchema to add client-side validation
const taskFormSchema = insertTaskSchema.extend({
  title: z.string().min(1, "Task title is required"),
});

type TaskFormValues = z.infer<typeof taskFormSchema>;

interface TaskFormProps {
  onAddTask: (task: TaskFormValues) => void;
  isSubmitting: boolean;
}

export default function TaskForm({ onAddTask, isSubmitting }: TaskFormProps) {
  const today = new Date().toISOString().split('T')[0];
  
  const form = useForm<TaskFormValues>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: {
      title: "",
      description: "",
      dueDate: today,
    },
  });

  const onSubmit = (data: TaskFormValues) => {
    onAddTask(data);
    form.reset({
      title: "",
      description: "",
      dueDate: today,
    });
  };

  return (
    <Card className="bg-white rounded-lg shadow-sm mb-8">
      <CardContent className="pt-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Add New Task</h2>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">Task Title</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter task title"
                      className="rounded-md border-gray-300 focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-sm text-danger" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter task description"
                      className="rounded-md border-gray-300 focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="dueDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">Due Date</FormLabel>
                  <FormControl>
                    <Input
                      type="date"
                      className="rounded-md border-gray-300 focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="flex justify-end">
              <Button 
                type="submit" 
                className="bg-primary hover:bg-blue-700 text-white" 
                disabled={isSubmitting}
              >
                Add Task
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
