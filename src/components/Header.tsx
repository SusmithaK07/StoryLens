
import React from 'react';
import { Sparkles, Menu, Home, Image, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const Header = () => {
  return (
    <header className="bg-white/90 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <Sparkles className="h-8 w-8 text-purple-600" />
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                StoryLens
              </h1>
              <p className="text-xs text-gray-500 -mt-1">Transform Photos into Stories</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="/" className="text-gray-700 hover:text-purple-600 font-medium transition-colors duration-200">
              Home
            </a>
            <a href="/gallery" className="text-gray-700 hover:text-purple-600 font-medium transition-colors duration-200">
              Gallery
            </a>
            <a href="/about" className="text-gray-700 hover:text-purple-600 font-medium transition-colors duration-200">
              About
            </a>
            <Button variant="outline" className="border-purple-200 text-purple-600 hover:bg-purple-50">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
          </nav>

          {/* Mobile Navigation */}
          <div className="md:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Menu className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem>
                  <Home className="h-4 w-4 mr-2" />
                  Home
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Image className="h-4 w-4 mr-2" />
                  Gallery
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
