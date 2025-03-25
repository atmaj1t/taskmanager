import express, { type Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { ZodError } from "zod";
import { insertTaskSchema } from "@shared/schema";
import { fromZodError } from "zod-validation-error";
import path from "path";
import fs from "fs";
import { exec } from "child_process";

export async function registerRoutes(app: Express): Promise<Server> {
  const router = express.Router();
  
  // Get all tasks
  router.get("/tasks", async (req, res) => {
    try {
      const tasks = await storage.getTasks();
      res.json(tasks);
    } catch (error) {
      console.error("Failed to get tasks:", error);
      res.status(500).json({ message: "Failed to get tasks" });
    }
  });
  
  // Get a specific task
  router.get("/tasks/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid task ID" });
      }
      
      const task = await storage.getTask(id);
      if (!task) {
        return res.status(404).json({ message: "Task not found" });
      }
      
      res.json(task);
    } catch (error) {
      console.error("Failed to get task:", error);
      res.status(500).json({ message: "Failed to get task" });
    }
  });
  
  // Create a new task
  router.post("/tasks", async (req, res) => {
    try {
      const validatedData = insertTaskSchema.parse(req.body);
      const newTask = await storage.createTask(validatedData);
      res.status(201).json(newTask);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      
      console.error("Failed to create task:", error);
      res.status(500).json({ message: "Failed to create task" });
    }
  });
  
  // Update a task
  router.patch("/tasks/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid task ID" });
      }
      
      // Check if task exists
      const existingTask = await storage.getTask(id);
      if (!existingTask) {
        return res.status(404).json({ message: "Task not found" });
      }
      
      // Update the task
      const updatedTask = await storage.updateTask(id, req.body);
      res.json(updatedTask);
    } catch (error) {
      console.error("Failed to update task:", error);
      res.status(500).json({ message: "Failed to update task" });
    }
  });
  
  // Delete a task
  router.delete("/tasks/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid task ID" });
      }
      
      // Check if task exists before deletion
      const existingTask = await storage.getTask(id);
      if (!existingTask) {
        return res.status(404).json({ message: "Task not found" });
      }
      
      // Delete the task
      await storage.deleteTask(id);
      res.status(204).send();
    } catch (error) {
      console.error("Failed to delete task:", error);
      res.status(500).json({ message: "Failed to delete task" });
    }
  });
  
  // Download project route
  router.get("/download-project", (req, res) => {
    try {
      const zipFilePath = '/tmp/project_export/task-manager.zip';
      const zipFileName = 'task-manager-project.zip';
      
      // Check if the pre-created zip file exists
      if (!fs.existsSync(zipFilePath)) {
        console.error('Pre-created ZIP file not found at', zipFilePath);
        return res.status(500).json({ message: 'Project download file not found' });
      }

      // Set headers
      res.setHeader('Content-Disposition', `attachment; filename=${zipFileName}`);
      res.setHeader('Content-Type', 'application/zip');
      
      // Stream the file
      const fileStream = fs.createReadStream(zipFilePath);
      fileStream.on('error', (err) => {
        console.error('Error reading zip file:', err);
        if (!res.headersSent) {
          res.status(500).json({ message: 'Failed to read project file' });
        }
      });
      
      fileStream.pipe(res);
    } catch (error) {
      console.error('Failed to download project:', error);
      res.status(500).json({ message: 'Failed to download project' });
    }
  });

  // Register the router
  app.use("/api", router);
  
  const httpServer = createServer(app);
  return httpServer;
}
