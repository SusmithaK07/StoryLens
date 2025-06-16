
import React, { useState } from 'react';
import { Upload, Sparkles, Play, Share2, Download, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Header from '@/components/Header';
import PhotoUpload from '@/components/PhotoUpload';
import StoryDisplay from '@/components/StoryDisplay';
import ProcessingState from '@/components/ProcessingState';
import { analyzeImage, ImageAnalysisResult } from '@/utils/imageAnalysis';
import { generateStory } from '@/utils/storyGeneration';
import { generateAudio } from '@/utils/audioGeneration';

const Index = () => {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedStory, setGeneratedStory] = useState<string | null>(null);
  const [showUpload, setShowUpload] = useState(false);
  const [imageAnalysis, setImageAnalysis] = useState<ImageAnalysisResult | null>(null);

  const handleImageUpload = async (imageUrl: string) => {
    setUploadedImage(imageUrl);
    setShowUpload(false);
    
    if (imageUrl) {
      try {
        console.log('Analyzing uploaded image...');
        const analysis = await analyzeImage(imageUrl);
        setImageAnalysis(analysis);
        console.log('Image analysis stored:', analysis);
      } catch (error) {
        console.error('Failed to analyze image:', error);
      }
    }
  };

  const handleGenerateStory = async () => {
    if (!uploadedImage) return;
    
    setIsGenerating(true);
    
    try {
      let analysis = imageAnalysis;
      
      // If we don't have analysis, analyze the image now
      if (!analysis) {
        console.log('No existing analysis, analyzing image...');
        analysis = await analyzeImage(uploadedImage);
        setImageAnalysis(analysis);
      }
      
      console.log('Generating story with analysis:', analysis);
      
      // Generate story based on image analysis
      const story = await generateStory(analysis, {
        type: 'story',
        tone: analysis.mood === 'cheerful' ? 'cheerful' : 
              analysis.mood === 'mysterious' ? 'mysterious' :
              analysis.mood === 'peaceful' ? 'contemplative' : 'contemplative',
        length: 'medium'
      });
      
      console.log('Generated story:', story);
      
      // Generate audio narration
      const audioUrl = await generateAudio(story, {
        voice: 'aria',
        speed: 0.9,
        pitch: 1.0
      });
      
      console.log('Generated audio URL:', audioUrl);
      
      setGeneratedStory(story);
    } catch (error) {
      console.error('Error generating story:', error);
      // Fallback story if generation fails
      setGeneratedStory("In this captured moment, beauty and emotion intertwine to create something truly special. The image tells a story of life's precious moments, where every detail contributes to a narrative that speaks to the heart. This scene invites us to pause, reflect, and appreciate the stories that surround us every day.");
    } finally {
      setIsGenerating(false);
    }
  };

  if (isGenerating) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
        <Header />
        <ProcessingState />
      </div>
    );
  }

  if (generatedStory && uploadedImage) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
        <Header />
        <StoryDisplay 
          image={uploadedImage} 
          story={generatedStory}
          imageAnalysis={imageAnalysis}
          onStartOver={() => {
            setUploadedImage(null);
            setGeneratedStory(null);
            setImageAnalysis(null);
            setShowUpload(false);
          }}
        />
      </div>
    );
  }

  if (showUpload || uploadedImage) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
        <Header />
        <PhotoUpload 
          onImageUpload={handleImageUpload}
          uploadedImage={uploadedImage}
          onGenerateStory={handleGenerateStory}
          onBack={() => {
            setShowUpload(false);
            setUploadedImage(null);
            setImageAnalysis(null);
          }}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      <Header />
      
      {/* Hero Section */}
      <main className="container mx-auto px-4 py-12">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <Sparkles className="h-12 w-12 text-purple-600 mr-3" />
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              StoryLens
            </h1>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
            Turn Your Photos into Creative Stories
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Upload any photo and watch AI create a unique story or poem, complete with voice narration
          </p>
          <Button 
            size="lg" 
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            onClick={() => setShowUpload(true)}
          >
            <Upload className="mr-2 h-5 w-5" />
            Upload Photo & Start Creating
          </Button>
        </div>

        {/* Process Steps */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="text-center p-6 hover:shadow-lg transition-shadow duration-300 border-0 bg-white/80 backdrop-blur-sm">
            <CardContent>
              <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Upload className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800">1. Upload</h3>
              <p className="text-gray-600">Choose any photo from your device or drag and drop it here</p>
            </CardContent>
          </Card>
          
          <Card className="text-center p-6 hover:shadow-lg transition-shadow duration-300 border-0 bg-white/80 backdrop-blur-sm">
            <CardContent>
              <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Sparkles className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800">2. Generate</h3>
              <p className="text-gray-600">Our AI analyzes your photo and crafts a unique creative story</p>
            </CardContent>
          </Card>
          
          <Card className="text-center p-6 hover:shadow-lg transition-shadow duration-300 border-0 bg-white/80 backdrop-blur-sm">
            <CardContent>
              <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Play className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800">3. Listen & Share</h3>
              <p className="text-gray-600">Enjoy AI voice narration and share your story with the world</p>
            </CardContent>
          </Card>
        </div>

        {/* Sample Examples */}
        <div className="text-center mb-12">
          <h3 className="text-2xl font-bold text-gray-800 mb-8">See the Magic in Action</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 border-0 bg-white/80 backdrop-blur-sm">
              <div className="aspect-square bg-gradient-to-br from-blue-200 to-purple-300 flex items-center justify-center">
                <ImageIcon className="h-16 w-16 text-white" />
              </div>
              <CardContent className="p-4">
                <p className="text-sm text-gray-600 italic">"A sunset beach walk becomes a tale of reflection and dreams..."</p>
              </CardContent>
            </Card>
            
            <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 border-0 bg-white/80 backdrop-blur-sm">
              <div className="aspect-square bg-gradient-to-br from-green-200 to-blue-300 flex items-center justify-center">
                <ImageIcon className="h-16 w-16 text-white" />
              </div>
              <CardContent className="p-4">
                <p className="text-sm text-gray-600 italic">"A cozy coffee shop moment transforms into poetry..."</p>
              </CardContent>
            </Card>
            
            <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 border-0 bg-white/80 backdrop-blur-sm">
              <div className="aspect-square bg-gradient-to-br from-orange-200 to-pink-300 flex items-center justify-center">
                <ImageIcon className="h-16 w-16 text-white" />
              </div>
              <CardContent className="p-4">
                <p className="text-sm text-gray-600 italic">"City lights inspire an urban adventure story..."</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Features */}
        <div className="text-center">
          <h3 className="text-2xl font-bold text-gray-800 mb-8">Why Choose StoryLens?</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex flex-col items-center">
              <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-full w-12 h-12 flex items-center justify-center mb-3">
                <Sparkles className="h-6 w-6 text-purple-600" />
              </div>
              <h4 className="font-semibold text-gray-800 mb-2">AI-Powered</h4>
              <p className="text-sm text-gray-600">Advanced AI creates unique stories from any image</p>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-full w-12 h-12 flex items-center justify-center mb-3">
                <Play className="h-6 w-6 text-purple-600" />
              </div>
              <h4 className="font-semibold text-gray-800 mb-2">Voice Narration</h4>
              <p className="text-sm text-gray-600">Professional voice AI brings stories to life</p>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-full w-12 h-12 flex items-center justify-center mb-3">
                <Share2 className="h-6 w-6 text-purple-600" />
              </div>
              <h4 className="font-semibold text-gray-800 mb-2">Easy Sharing</h4>
              <p className="text-sm text-gray-600">Share your stories across all platforms instantly</p>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-full w-12 h-12 flex items-center justify-center mb-3">
                <Download className="h-6 w-6 text-purple-600" />
              </div>
              <h4 className="font-semibold text-gray-800 mb-2">Download Options</h4>
              <p className="text-sm text-gray-600">Save stories as text, audio, or combined formats</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
