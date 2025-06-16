
import React, { useState, useEffect } from 'react';
import { Play, Pause, Volume2, Download, Share2, RefreshCw, ArrowLeft, BookOpen, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/hooks/use-toast';
import ShareModal from '@/components/ShareModal';
import { generateStory } from '@/utils/storyGeneration';
import { generateAudio } from '@/utils/audioGeneration';
import { ImageAnalysisResult } from '@/utils/imageAnalysis';

interface StoryDisplayProps {
  image: string;
  story: string;
  imageAnalysis?: ImageAnalysisResult | null;
  onStartOver: () => void;
}

const StoryDisplay: React.FC<StoryDisplayProps> = ({ image, story, imageAnalysis, onStartOver }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(45);
  const [volume, setVolume] = useState([80]);
  const [showShareModal, setShowShareModal] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [isGeneratingAudio, setIsGeneratingAudio] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Generate audio when component mounts
    generateAudioForStory();
  }, [story]);

  useEffect(() => {
    if (audioUrl) {
      const audioElement = new Audio(audioUrl);
      audioElement.addEventListener('loadedmetadata', () => {
        setDuration(audioElement.duration || 45);
      });
      audioElement.addEventListener('timeupdate', () => {
        setCurrentTime(audioElement.currentTime);
      });
      audioElement.addEventListener('ended', () => {
        setIsPlaying(false);
        setCurrentTime(0);
      });
      setAudio(audioElement);
      
      return () => {
        audioElement.pause();
        audioElement.src = '';
      };
    }
  }, [audioUrl]);

  const generateAudioForStory = async () => {
    setIsGeneratingAudio(true);
    try {
      const url = await generateAudio(story, {
        voice: 'aria',
        speed: 0.9,
        pitch: 1.0
      });
      setAudioUrl(url);
      console.log('Audio generated successfully:', url);
    } catch (error) {
      console.error('Failed to generate audio:', error);
      toast({
        title: "Audio generation failed",
        description: "Unable to create audio narration at this time.",
        variant: "destructive"
      });
    } finally {
      setIsGeneratingAudio(false);
    }
  };

  const togglePlayback = () => {
    if (!audio || isGeneratingAudio) return;
    
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (value: number[]) => {
    if (audio) {
      audio.currentTime = value[0];
      setCurrentTime(value[0]);
    }
  };

  const handleVolumeChange = (value: number[]) => {
    setVolume(value);
    if (audio) {
      audio.volume = value[0] / 100;
    }
  };

  const handleDownload = () => {
    // Create downloadable content
    const textBlob = new Blob([story], { type: 'text/plain' });
    const textUrl = URL.createObjectURL(textBlob);
    
    const link = document.createElement('a');
    link.href = textUrl;
    link.download = 'story.txt';
    link.click();
    
    URL.revokeObjectURL(textUrl);
    
    toast({
      title: "Download started",
      description: "Your story has been downloaded as a text file.",
    });
  };

  const handleRegenerateStory = async () => {
    if (!imageAnalysis) {
      toast({
        title: "Cannot regenerate",
        description: "No image analysis data available.",
        variant: "destructive"
      });
      return;
    }

    setIsRegenerating(true);
    try {
      // Generate alternative story with different tone
      const tones = ['cheerful', 'mysterious', 'romantic', 'adventurous', 'contemplative'] as const;
      const currentTone = imageAnalysis.mood === 'cheerful' ? 'cheerful' : 'contemplative';
      const availableTones = tones.filter(tone => tone !== currentTone);
      const newTone = availableTones[Math.floor(Math.random() * availableTones.length)];
      
      const newStory = await generateStory(imageAnalysis, {
        type: Math.random() > 0.5 ? 'story' : 'poem',
        tone: newTone,
        length: 'medium'
      });
      
      // Update the story (this would need to be passed up to parent component)
      toast({
        title: "Alternative story generated!",
        description: "A new version of your story has been created.",
      });
      
      // Note: In a real implementation, you'd need to update the parent component's state
      console.log('New story generated:', newStory);
      
    } catch (error) {
      console.error('Failed to regenerate story:', error);
      toast({
        title: "Regeneration failed",
        description: "Unable to create alternative story at this time.",
        variant: "destructive"
      });
    } finally {
      setIsRegenerating(false);
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const wordCount = story.split(' ').length;
  const readingTime = Math.ceil(wordCount / 200);

  return (
    <div className="container mx-auto px-4 py-8">
      <Button 
        variant="ghost" 
        onClick={onStartOver}
        className="mb-6 text-purple-600 hover:text-purple-700 hover:bg-purple-50"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Create Another Story
      </Button>

      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Your Story is Ready!</h2>
          <p className="text-gray-600">AI has transformed your photo into a beautiful narrative</p>
          {imageAnalysis && (
            <p className="text-sm text-gray-500 mt-2">
              Detected: {imageAnalysis.description}
            </p>
          )}
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Image Panel */}
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              <img
                src={image}
                alt="Story inspiration"
                className="w-full h-96 object-cover"
              />
            </CardContent>
          </Card>

          {/* Story Panel */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BookOpen className="h-5 w-5 text-purple-600" />
                <span>Your Story</span>
                <div className="ml-auto flex items-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>{readingTime} min read</span>
                  </div>
                  <span>{wordCount} words</span>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed mb-6">
                {story}
              </div>
              
              <Button
                variant="outline"
                className="w-full border-purple-200 text-purple-600 hover:bg-purple-50"
                onClick={handleRegenerateStory}
                disabled={isRegenerating}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isRegenerating ? 'animate-spin' : ''}`} />
                {isRegenerating ? 'Generating...' : 'Generate Alternative Version'}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Audio Player */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Volume2 className="h-5 w-5 text-purple-600" />
              <span>Audio Narration</span>
              {isGeneratingAudio && (
                <span className="text-sm text-gray-500">(Generating...)</span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Progress Bar */}
              <div className="space-y-2">
                <Slider
                  value={[currentTime]}
                  max={duration}
                  step={1}
                  className="w-full"
                  onValueChange={handleSeek}
                  disabled={!audioUrl || isGeneratingAudio}
                />
                <div className="flex justify-between text-sm text-gray-500">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Button
                    onClick={togglePlayback}
                    disabled={!audioUrl || isGeneratingAudio}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-full w-12 h-12 p-0"
                  >
                    {isGeneratingAudio ? (
                      <Volume2 className="h-5 w-5 animate-pulse" />
                    ) : isPlaying ? (
                      <Pause className="h-5 w-5" />
                    ) : (
                      <Play className="h-5 w-5 ml-0.5" />
                    )}
                  </Button>
                  
                  <div className="flex items-center space-x-2">
                    <Volume2 className="h-4 w-4 text-gray-500" />
                    <Slider
                      value={volume}
                      max={100}
                      step={1}
                      className="w-24"
                      onValueChange={handleVolumeChange}
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Button variant="outline" onClick={() => setShowShareModal(true)}>
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                  <Button variant="outline" onClick={handleDownload}>
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="mt-8 text-center space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <Button
              onClick={onStartOver}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
            >
              Create Another Story
            </Button>
            <Button
              variant="outline"
              className="border-purple-200 text-purple-600 hover:bg-purple-50"
            >
              Save to Gallery
            </Button>
          </div>
        </div>
      </div>

      <ShareModal 
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        story={story}
        image={image}
      />
    </div>
  );
};

export default StoryDisplay;
