import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';

interface DocumentUploadProps {
  label: string;
  description: string;
  file: File | null;
  onFileChange: (file: File | null) => void;
}

const DocumentUpload: React.FC<DocumentUploadProps> = ({ label, description, file, onFileChange }) => {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    onFileChange(selectedFile);
    if (selectedFile) {
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result as string);
      reader.readAsDataURL(selectedFile);
    } else {
      setPreview(null);
    }
  };

  const handleRemove = () => {
    onFileChange(null);
    setPreview(null);
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <Card variant="default">
      <CardContent className="p-4">
        <Label className="font-semibold">{label}</Label>
        <p className="text-sm text-muted-foreground mb-3">{description}</p>
        
        <input
          ref={inputRef}
          type="file"
          accept="image/*,.pdf"
          onChange={handleChange}
          className="hidden"
        />
        
        {!file ? (
          <div
            onClick={() => inputRef.current?.click()}
            className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-all"
          >
            <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">Click to upload or drag and drop</p>
            <p className="text-xs text-muted-foreground mt-1">PNG, JPG or PDF (max. 5MB)</p>
          </div>
        ) : (
          <div className="flex items-center gap-4 p-3 bg-muted rounded-lg">
            {preview && (
              <img src={preview} alt="Preview" className="w-16 h-16 object-cover rounded" />
            )}
            <div className="flex-1">
              <p className="font-medium text-sm">{file.name}</p>
              <p className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(1)} KB</p>
            </div>
            <div className="flex gap-2">
              <Button size="icon" variant="ghost" onClick={() => inputRef.current?.click()}>
                <Upload className="w-4 h-4" />
              </Button>
              <Button size="icon" variant="ghost" onClick={handleRemove}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

interface UploadDocumentsProps {
  documents: {
    aadhaar: File | null;
    collegeId: File | null;
    photo: File | null;
  };
  onFileChange: (type: 'aadhaar' | 'collegeId' | 'photo', file: File | null) => void;
}

const UploadDocuments: React.FC<UploadDocumentsProps> = ({ documents, onFileChange }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <DocumentUpload
        label="Aadhaar Card / Government ID *"
        description="Upload clear scan or photo of your Aadhaar card (front and back)"
        file={documents.aadhaar}
        onFileChange={(file) => onFileChange('aadhaar', file)}
      />
      <DocumentUpload
        label="College ID Card / Admission Letter *"
        description="Upload your current college ID or admission letter"
        file={documents.collegeId}
        onFileChange={(file) => onFileChange('collegeId', file)}
      />
      <DocumentUpload
        label="Passport Size Photo *"
        description="Upload a recent passport size photo with white background"
        file={documents.photo}
        onFileChange={(file) => onFileChange('photo', file)}
      />
    </motion.div>
  );
};

export default UploadDocuments;
