
import React from 'react';
import { X, Twitter, Facebook, Linkedin, Link, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  story: string;
  image: string;
}

const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, story, image }) => {
  const { toast } = useToast();
  const shareUrl = window.location.href;
  const shareText = `Check out this amazing AI-generated story: "${story.substring(0, 100)}..."`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl);
    toast({
      title: "Link copied!",
      description: "Share link has been copied to your clipboard.",
    });
  };

  const shareLinks = [
    {
      name: 'Twitter',
      icon: Twitter,
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
      color: 'bg-blue-500 hover:bg-blue-600'
    },
    {
      name: 'Facebook',
      icon: Facebook,
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      color: 'bg-blue-700 hover:bg-blue-800'
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
      color: 'bg-blue-600 hover:bg-blue-700'
    },
    {
      name: 'Email',
      icon: Mail,
      url: `mailto:?subject=Amazing AI Story&body=${encodeURIComponent(shareText + '\n\n' + shareUrl)}`,
      color: 'bg-gray-600 hover:bg-gray-700'
    }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            Share Your Story
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Share Link */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Share Link</label>
            <div className="flex space-x-2">
              <Input value={shareUrl} readOnly className="flex-1" />
              <Button onClick={copyToClipboard} className="shrink-0">
                <Link className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Social Media Buttons */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Share on Social Media</label>
            <div className="grid grid-cols-2 gap-3">
              {shareLinks.map((platform) => {
                const Icon = platform.icon;
                return (
                  <Button
                    key={platform.name}
                    onClick={() => window.open(platform.url, '_blank')}
                    className={`${platform.color} text-white justify-start`}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {platform.name}
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Story Preview */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Story Preview</label>
            <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-600 max-h-32 overflow-y-auto">
              {story}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShareModal;
