"use client";

import { useState, useCallback } from "react";
import { Upload, FileText, X, Loader2, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  progress: number;
  status: "uploading" | "processing" | "complete" | "error";
}

export function DropZone() {
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState<UploadedFile[]>([]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const simulateUpload = (file: File) => {
    const uploadedFile: UploadedFile = {
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: file.size,
      progress: 0,
      status: "uploading",
    };

    setFiles((prev) => [...prev, uploadedFile]);

    // Simulate upload progress
    const interval = setInterval(() => {
      setFiles((prev) =>
        prev.map((f) => {
          if (f.id === uploadedFile.id) {
            const newProgress = Math.min(f.progress + 15, 100);
            if (newProgress === 100 && f.status === "uploading") {
              return { ...f, progress: newProgress, status: "processing" };
            }
            return { ...f, progress: newProgress };
          }
          return f;
        })
      );
    }, 200);

    // Complete processing after delay
    setTimeout(() => {
      clearInterval(interval);
      setFiles((prev) =>
        prev.map((f) =>
          f.id === uploadedFile.id ? { ...f, status: "complete", progress: 100 } : f
        )
      );
    }, 3500);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFiles = Array.from(e.dataTransfer.files);
    droppedFiles.forEach(simulateUpload);
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    selectedFiles.forEach(simulateUpload);
  };

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  return (
    <div className="space-y-6">
      {/* Drop Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          "relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-12 transition-all duration-300 cursor-pointer",
          isDragging
            ? "border-primary bg-accent scale-[1.02] shadow-glow-primary"
            : "border-border bg-card hover:border-primary/50 hover:bg-accent/50"
        )}
      >
        <input
          type="file"
          multiple
          accept=".pdf,.jpg,.jpeg,.png"
          onChange={handleFileSelect}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        
        <div className={cn(
          "flex h-16 w-16 items-center justify-center rounded-2xl mb-6 transition-all duration-300",
          isDragging ? "bg-primary scale-110" : "bg-secondary"
        )}>
          <Upload className={cn(
            "h-8 w-8 transition-colors",
            isDragging ? "text-primary-foreground" : "text-muted-foreground"
          )} />
        </div>

        <h3 className="text-lg font-semibold text-foreground mb-2">
          Drop your documents here
        </h3>
        <p className="text-muted-foreground text-center mb-4">
          or click to select files
        </p>
        <div className="flex gap-2">
          <Badge variant="secondary" className="text-xs">PDF</Badge>
          <Badge variant="secondary" className="text-xs">JPG</Badge>
          <Badge variant="secondary" className="text-xs">PNG</Badge>
        </div>
      </div>

      {/* Uploaded Files */}
      {files.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-muted-foreground">
            Uploaded files
          </h4>
          {files.map((file, index) => (
            <div
              key={file.id}
              className="flex items-center gap-4 rounded-lg border bg-card p-4 animate-slide-up"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                <FileText className="h-5 w-5 text-muted-foreground" />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-foreground truncate">
                    {file.name}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {formatSize(file.size)}
                  </span>
                </div>
                
                {file.status !== "complete" && (
                  <Progress value={file.progress} className="h-1.5" />
                )}
              </div>

              <div className="flex items-center gap-3">
                {file.status === "uploading" && (
                  <Badge variant="secondary" className="gap-1.5">
                    <Loader2 className="h-3 w-3 animate-spin" />
                    Uploading...
                  </Badge>
                )}
                {file.status === "processing" && (
                  <Badge className="gap-1.5 bg-primary text-primary-foreground animate-pulse-soft">
                    <Sparkles className="h-3 w-3" />
                    Processing with AI...
                  </Badge>
                )}
                {file.status === "complete" && (
                  <Badge className="bg-success-light text-success">
                    Complete
                  </Badge>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-destructive"
                  onClick={() => removeFile(file.id)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}