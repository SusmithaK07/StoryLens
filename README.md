# StoryLens - Multi-modal Photo Story Generator

StoryLens is an AI-powered web application that transforms your photos into creative stories and poems with audio narration. Upload any image and let our AI analyze it to generate a unique narrative that captures the essence of your photo.


## Features

- **Image Analysis**: Automatically detects objects, colors, mood, setting, and more from your uploaded photos using client-side image processing
- **Story Generation**: Creates unique stories or poems inspired by your images with customizable tones (cheerful, mysterious, romantic, adventurous, contemplative)
- **Audio Narration**: Transforms text into speech using the Web Speech API for an immersive experience
- **Sharing Options**: Easy sharing of your generated stories across social media and other platforms
- **Download Capability**: Save your stories as text files for offline reading

## AI Models Used

- **Image Analysis**: Client-side image processing using HTML Canvas API (simulating microsoft/kosmos-2 capabilities)
- **Text Generation**: Template-based generation with dynamic content based on image analysis (simulating advanced language models)
- **Voice Synthesis**: Web Speech API (simulating coqui/xtts-v2 capabilities)

## Tech Stack

- **Frontend Framework**: React with TypeScript
- **Styling**: Tailwind CSS with shadcn/ui components
- **Routing**: React Router
- **State Management**: React Hooks
- **Build Tool**: Vite

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn package manager

### Installation

1. Clone the repository
   ```sh
   git clone https://github.com/yourusername/storylens.git
   cd storylens
   ```

2. Install dependencies
   ```sh
   npm install
   # or
   yarn install
   ```

3. Start the development server
   ```sh
   npm run dev
   # or
   yarn dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

## Usage

1. **Upload a Photo**: Click the "Upload Photo & Start Creating" button and select an image from your device
2. **Generate Story**: After uploading, click "Generate Story" to analyze the image and create a narrative
3. **Listen to Narration**: Use the audio player controls to listen to the AI-generated voice narration
4. **Share or Download**: Share your story on social media or download it as a text file
5. **Create Another**: Click "Create Another Story" to start over with a new photo

## Project Structure

```
storylens/
├── src/
│   ├── components/         # UI components
│   ├── utils/              # Utility functions for AI features
│   │   ├── imageAnalysis.ts    # Image processing and analysis
│   │   ├── storyGeneration.ts  # Story generation logic
│   │   └── audioGeneration.ts  # Audio synthesis functionality
│   ├── pages/              # Application pages
│   └── App.tsx             # Main application component
├── public/                 # Static assets
└── package.json            # Project dependencies
```

## Deployment

Build the project for production:

```sh
npm run build
# or
yarn build
```

The build artifacts will be stored in the `dist/` directory, ready to be deployed to any static site hosting service like Netlify, Vercel, or GitHub Pages.

## Future Enhancements

- Integration with actual AI models (microsoft/kosmos-2, coqui/xtts-v2) for more advanced capabilities
- Additional story formats and styles
- Custom voice selection for narration
- Story editing capabilities
- User accounts to save story history



## Acknowledgments

- shadcn/ui for the beautiful component library
- Tailwind CSS for the styling framework
- React and TypeScript communities for their excellent documentation
