import { File, UploadCloud, X } from 'lucide-react';
import React, { useRef, useState } from 'react';
import { Button } from './button';

interface FileInputProps {
    id?: string;
    className?: string;
    name?: string;
    tabIndex?: number;
    accept?: string; // e.g., "image/*" or ".pdf,.doc"
    maxSizeInMB?: number; // Maximum file size validation
    onFileSelect?: (file: File | null) => void; // Callback to send file to parent form
}

const FileInput = ({
    id,
    className = "",
    name = "",
    tabIndex,
    accept,
    maxSizeInMB = 2,
    onFileSelect
}: FileInputProps) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isDragging, setIsDragging] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    // Trigger native file picker hidden input
    const handleContainerClick = () => {
        fileInputRef.current?.click();
    };

    // Process and validate files
    const processFile = (file: File) => {
        setError(null);

        // Size validation
        if (file.size > maxSizeInMB * 1024 * 1024) {
            setError(`File size exceeds the ${maxSizeInMB}MB limit.`);
            return;
        }

        // Type validation (basic wildcard match)
        if (accept) {
            const acceptedTypes = accept.split(',').map(t => t.trim());
            const fileType = file.type;
            const fileName = file.name;
            
            const isValid = acceptedTypes.some(type => {
                if (type.startsWith('.')) {
                    return fileName.endsWith(type);
                }
                if (type.endsWith('/*')) {
                    return fileType.startsWith(type.replace('/*', ''));
                }
                return fileType === type;
            });

            if (!isValid) {
                setError(`Invalid file type. Allowed: ${accept}`);
                return;
            }
        }

        setSelectedFile(file);
        if (onFileSelect) onFileSelect(file);
    };

    // Input change event
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            processFile(e.target.files[0]);
        }
    };

    // Drag and drop event handlers
    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);

        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            processFile(e.dataTransfer.files[0]);
        }
    };

    // Clear file selection
    const handleClearFile = (e: React.MouseEvent) => {
        e.stopPropagation(); // Avoid triggering container click
        setSelectedFile(null);
        setError(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
        if (onFileSelect) onFileSelect(null);
    };

    // Helper to format bytes to human-readable text
    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    return (
        <div className="w-full space-y-2">
            {/* Hidden Native File Input */}
            <input
                type="file"
                id={id}
                ref={fileInputRef}
                name={name}
                accept={accept}
                tabIndex={tabIndex}
                className="hidden"
                onChange={handleFileChange}
            />

            {!selectedFile ? (
                /* Empty Upload Zone State */
                <div
                    onClick={handleContainerClick}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`p-6 bg-primary/5 hover:bg-primary/10 border-2 border-dashed rounded-md flex flex-col items-center justify-center gap-4 h-full min-h-[180px] cursor-pointer transition-colors select-none
                        ${isDragging ? 'border-primary bg-primary/20 scale-[0.99]' : 'border-primary/40 hover:border-primary'} 
                        ${className}`}
                >
                    <UploadCloud className="text-primary animate-bounce duration-1000" size={44} />
                    <div className="text-center space-y-1">
                        <p className="text-sm font-medium text-primary">
                            Click to upload or drag & drop
                        </p>
                        <p className="text-xs text-muted-foreground">
                            {accept ? `Accepted formats: ${accept}` : 'Any format'} (Max {maxSizeInMB}MB)
                        </p>
                    </div>
                </div>
            ) : (
                /* Selected File Preview State */
                <div className={`p-4 bg-secondary/40 border border-border rounded-md flex items-center justify-between gap-4 ${className}`}>
                    <div className="flex items-center gap-3 overflow-hidden">
                        <div className="p-2 bg-primary/10 rounded text-primary shrink-0">
                            <File size={28} />
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-sm font-medium truncate text-foreground pr-2">
                                {selectedFile.name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                                {formatFileSize(selectedFile.size)}
                            </p>
                        </div>
                    </div>
                    <Button
                        type="button"
                        onClick={handleClearFile}
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive shrink-0 cursor-pointer"
                    >
                        <X size={16} />
                    </Button>
                </div>
            )}

            {/* Error Message Display */}
            {error && (
                <p className="text-xs text-destructive font-medium animate-pulse">
                    {error}
                </p>
            )}
        </div>
    );
};

export default FileInput;
