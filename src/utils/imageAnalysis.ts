
export interface ImageAnalysisResult {
  description: string;
  objects: string[];
  colors: string[];
  mood: string;
  setting: string;
  people?: number;
  emotions?: string[];
}

export const analyzeImage = async (imageDataUrl: string): Promise<ImageAnalysisResult> => {
  // Convert data URL to blob for processing
  const response = await fetch(imageDataUrl);
  const blob = await response.blob();
  
  // Create a canvas to analyze the image
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  const img = new Image();
  
  return new Promise((resolve) => {
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      
      // Analyze image data
      const imageData = ctx?.getImageData(0, 0, canvas.width, canvas.height);
      const analysis = performImageAnalysis(imageData, img);
      resolve(analysis);
    };
    img.src = imageDataUrl;
  });
};

const performImageAnalysis = (imageData: ImageData | undefined, img: HTMLImageElement): ImageAnalysisResult => {
  if (!imageData) {
    return {
      description: "A beautiful image",
      objects: ["unknown"],
      colors: ["mixed"],
      mood: "neutral",
      setting: "unknown"
    };
  }

  const { data, width, height } = imageData;
  const colors = analyzeColors(data);
  const brightness = analyzeBrightness(data);
  const contrast = analyzeContrast(data);
  
  // Determine mood based on color analysis and brightness
  const mood = determineMood(colors, brightness, contrast);
  
  // Analyze composition
  const setting = analyzeSetting(width, height, brightness, colors);
  
  // Generate description based on analysis
  const description = generateDescription(colors, mood, setting, brightness);
  
  return {
    description,
    objects: detectObjects(colors, brightness, contrast),
    colors: colors.dominantColors,
    mood,
    setting,
    people: estimatePeopleCount(imageData),
    emotions: deriveEmotions(mood, colors)
  };
};

const analyzeColors = (data: Uint8ClampedArray) => {
  const colorCounts: { [key: string]: number } = {};
  const colorSamples: { r: number; g: number; b: number }[] = [];
  
  // Sample every 10th pixel for performance
  for (let i = 0; i < data.length; i += 40) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    
    colorSamples.push({ r, g, b });
    
    const colorName = getColorName(r, g, b);
    colorCounts[colorName] = (colorCounts[colorName] || 0) + 1;
  }
  
  const dominantColors = Object.entries(colorCounts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 3)
    .map(([color]) => color);
  
  const avgColor = colorSamples.reduce(
    (acc, color) => ({
      r: acc.r + color.r,
      g: acc.g + color.g,
      b: acc.b + color.b
    }),
    { r: 0, g: 0, b: 0 }
  );
  
  avgColor.r /= colorSamples.length;
  avgColor.g /= colorSamples.length;
  avgColor.b /= colorSamples.length;
  
  return { dominantColors, avgColor };
};

const getColorName = (r: number, g: number, b: number): string => {
  if (r > 200 && g > 200 && b > 200) return 'white';
  if (r < 50 && g < 50 && b < 50) return 'black';
  if (r > g && r > b) return 'red';
  if (g > r && g > b) return 'green';
  if (b > r && b > g) return 'blue';
  if (r > 150 && g > 150 && b < 100) return 'yellow';
  if (r > 150 && g < 100 && b > 150) return 'purple';
  if (r < 100 && g > 150 && b > 150) return 'cyan';
  if (r > 100 && g > 100 && b > 100) return 'gray';
  return 'brown';
};

const analyzeBrightness = (data: Uint8ClampedArray): number => {
  let totalBrightness = 0;
  let pixelCount = 0;
  
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    
    const brightness = (r * 0.299 + g * 0.587 + b * 0.114) / 255;
    totalBrightness += brightness;
    pixelCount++;
  }
  
  return totalBrightness / pixelCount;
};

const analyzeContrast = (data: Uint8ClampedArray): number => {
  const brightnesses: number[] = [];
  
  for (let i = 0; i < data.length; i += 40) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    
    const brightness = (r * 0.299 + g * 0.587 + b * 0.114) / 255;
    brightnesses.push(brightness);
  }
  
  const sorted = brightnesses.sort((a, b) => a - b);
  const q1 = sorted[Math.floor(sorted.length * 0.25)];
  const q3 = sorted[Math.floor(sorted.length * 0.75)];
  
  return q3 - q1;
};

const determineMood = (colors: any, brightness: number, contrast: number): string => {
  const { dominantColors } = colors;
  
  if (brightness > 0.7 && dominantColors.includes('yellow')) return 'cheerful';
  if (brightness < 0.3) return 'mysterious';
  if (dominantColors.includes('blue') && brightness > 0.5) return 'peaceful';
  if (dominantColors.includes('red')) return 'passionate';
  if (dominantColors.includes('green')) return 'natural';
  if (contrast > 0.4) return 'dramatic';
  if (brightness > 0.6) return 'bright';
  
  return 'contemplative';
};

const analyzeSetting = (width: number, height: number, brightness: number, colors: any): string => {
  const { dominantColors } = colors;
  
  if (dominantColors.includes('blue') && dominantColors.includes('white')) return 'sky';
  if (dominantColors.includes('green') && brightness > 0.4) return 'nature';
  if (dominantColors.includes('brown') && dominantColors.includes('green')) return 'forest';
  if (brightness < 0.4 && dominantColors.includes('black')) return 'night';
  if (dominantColors.includes('gray') && dominantColors.includes('white')) return 'urban';
  if (brightness > 0.7) return 'bright daylight';
  
  return 'indoor';
};

const generateDescription = (colors: any, mood: string, setting: string, brightness: number): string => {
  const { dominantColors } = colors;
  const colorDesc = dominantColors.slice(0, 2).join(' and ');
  const lightDesc = brightness > 0.6 ? 'bright' : brightness < 0.3 ? 'dim' : 'softly lit';
  
  return `A ${mood} scene with ${colorDesc} tones, ${lightDesc} and set in a ${setting} environment`;
};

const detectObjects = (colors: any, brightness: number, contrast: number): string[] => {
  const objects: string[] = [];
  const { dominantColors } = colors;
  
  if (dominantColors.includes('green')) objects.push('vegetation');
  if (dominantColors.includes('blue') && brightness > 0.5) objects.push('sky');
  if (dominantColors.includes('brown')) objects.push('earth', 'wood');
  if (dominantColors.includes('gray')) objects.push('stone', 'concrete');
  if (contrast > 0.5) objects.push('distinct shapes');
  
  return objects.length > 0 ? objects : ['various elements'];
};

const estimatePeopleCount = (imageData: ImageData): number => {
  // Simple heuristic based on skin tone detection
  const { data } = imageData;
  let skinPixels = 0;
  let totalPixels = 0;
  
  for (let i = 0; i < data.length; i += 40) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    
    // Simple skin tone detection
    if (r > 95 && g > 40 && b > 20 && 
        r > g && r > b && 
        Math.abs(r - g) > 15) {
      skinPixels++;
    }
    totalPixels++;
  }
  
  const skinRatio = skinPixels / totalPixels;
  
  if (skinRatio > 0.1) return Math.ceil(skinRatio * 10);
  if (skinRatio > 0.05) return 1;
  return 0;
};

const deriveEmotions = (mood: string, colors: any): string[] => {
  const emotions: string[] = [];
  const { dominantColors } = colors;
  
  switch (mood) {
    case 'cheerful':
      emotions.push('joy', 'happiness');
      break;
    case 'mysterious':
      emotions.push('intrigue', 'wonder');
      break;
    case 'peaceful':
      emotions.push('calm', 'serenity');
      break;
    case 'passionate':
      emotions.push('intensity', 'energy');
      break;
    case 'dramatic':
      emotions.push('tension', 'excitement');
      break;
    default:
      emotions.push('contemplation', 'reflection');
  }
  
  return emotions;
};
