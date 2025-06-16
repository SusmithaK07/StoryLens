
import React, { useRef, useState } from 'react';
import { Upload, X, ArrowLeft, Sparkles, Camera, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { analyzeImage } from '@/utils/imageAnalysis';

interface PhotoUploadProps {
  onImageUpload: (imageUrl: string) => void;
  uploadedImage: string | null;
  onGenerateStory: () => void;
  onBack: () => void;
}

const PhotoUpload: React.FC<PhotoUploadProps> = ({
  onImageUpload,
  uploadedImage,
  onGenerateStory,
  onBack
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileSelect = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file (JPG, PNG, WEBP)",
        variant: "destructive"
      });
      return;
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      toast({
        title: "File too large",
        description: "Please select an image smaller than 10MB",
        variant: "destructive"
      });
      return;
    }

    setIsAnalyzing(true);
    
    const reader = new FileReader();
    reader.onload = async (e) => {
      if (e.target?.result) {
        const imageUrl = e.target.result as string;
        
        try {
          // Analyze the image
          console.log('Starting image analysis...');
          const analysis = await analyzeImage(imageUrl);
          console.log('Image analysis complete:', analysis);
          
          onImageUpload(imageUrl);
          
          toast({
            title: "Image uploaded and analyzed!",
            description: `Detected: ${analysis.description}`,
          });
        } catch (error) {
          console.error('Error analyzing image:', error);
          onImageUpload(imageUrl); // Still upload even if analysis fails
          
          toast({
            title: "Image uploaded successfully!",
            description: "Your photo is ready for story generation.",
          });
        } finally {
          setIsAnalyzing(false);
        }
      }
    };
    reader.readAsDataURL(file);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const clearImage = () => {
    onImageUpload('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Button 
        variant="ghost" 
        onClick={onBack}
        className="mb-6 text-purple-600 hover:text-purple-700 hover:bg-purple-50"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Home
      </Button>

      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Upload Your Photo</h2>
          <p className="text-gray-600">Choose a photo that tells a story, and let our AI bring it to life</p>
        </div>

        {!uploadedImage ? (
          <Card className="border-2 border-dashed border-gray-300 hover:border-purple-400 transition-colors duration-300">
            <CardContent className="p-12">
              <div
                className={`text-center cursor-pointer transition-all duration-300 ${
                  isDragging ? 'scale-105 bg-purple-50 rounded-lg p-8' : ''
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="mb-6">
                  <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-4">
                    {isAnalyzing ? (
                      <Sparkles className="h-12 w-12 text-purple-600 animate-spin" />
                    ) : (
                      <Upload className="h-12 w-12 text-purple-600" />
                    )}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    {isAnalyzing ? 'Analyzing your image...' : 'Drop your image here, or click to browse'}
                  </h3>
                  <p className="text-gray-500 mb-4">
                    Supports JPG, PNG, WEBP up to 10MB
                  </p>
                </div>

                <Button 
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                  disabled={isAnalyzing}
                >
                  <Camera className="h-4 w-4 mr-2" />
                  {isAnalyzing ? 'Processing...' : 'Choose Photo'}
                </Button>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileInputChange}
                  className="hidden"
                  disabled={isAnalyzing}
                />
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 gap-8">
            {/* Image Preview */}
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <div className="relative">
                  <img
                    src={uploadedImage}
                    alt="Uploaded photo"
                    className="w-full h-80 object-cover"
                  />
                  <Button
                    variant="secondary"
                    size="sm"
                    className="absolute top-4 right-4 bg-white/90 hover:bg-white"
                    onClick={clearImage}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <div className="p-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <ImageIcon className="h-4 w-4 mr-2" />
                    Image analyzed and ready for processing
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Generation Controls */}
            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <Sparkles className="h-8 w-8 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">
                    Ready to Create Magic?
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Our AI has analyzed your photo and is ready to craft a unique story that captures its essence and emotion.
                  </p>
                  
                  <div className="space-y-4">
                    <Button
                      onClick={onGenerateStory}
                      className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-3 text-lg font-semibold"
                    >
                      <Sparkles className="h-5 w-5 mr-2" />
                      Generate Story
                    </Button>
                    
                    <Button
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full border-purple-200 text-purple-600 hover:bg-purple-50"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Different Photo
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Tips Section */}
        <div className="mt-12 text-center">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Tips for Better Stories</h3>
          <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-600">
            <div className="bg-white/60 rounded-lg p-4">
              <strong>Clear Images:</strong> Well-lit photos with clear subjects generate more detailed stories
            </div>
            <div className="bg-white/60 rounded-lg p-4">
              <strong>Emotional Moments:</strong> Photos with people, animals, or interesting scenes create richer narratives
            </div>
            <div className="bg-white/60 rounded-lg p-4">
              <strong>Unique Perspectives:</strong> Unusual angles or compositions inspire more creative stories
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhotoUpload;
