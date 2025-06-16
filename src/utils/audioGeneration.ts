
export interface AudioGenerationOptions {
  voice: 'aria' | 'roger' | 'sarah' | 'laura' | 'charlie';
  speed: number;
  pitch: number;
}

export const generateAudio = async (
  text: string, 
  options: AudioGenerationOptions = { voice: 'aria', speed: 1.0, pitch: 1.0 }
): Promise<string> => {
  try {
    // Check if browser supports Speech Synthesis
    if ('speechSynthesis' in window) {
      return await generateWithWebSpeechAPI(text, options);
    } else {
      throw new Error('Speech synthesis not supported');
    }
  } catch (error) {
    console.error('Error generating audio:', error);
    // Return a placeholder audio URL or create a simple beep
    return createSilentAudio();
  }
};

const generateWithWebSpeechAPI = async (
  text: string, 
  options: AudioGenerationOptions
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Configure voice options
    const voices = speechSynthesis.getVoices();
    const selectedVoice = selectVoice(voices, options.voice);
    
    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }
    
    utterance.rate = options.speed;
    utterance.pitch = options.pitch;
    utterance.volume = 0.8;
    
    // Create audio recording
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const mediaStreamDestination = audioContext.createMediaStreamDestination();
    const mediaRecorder = new MediaRecorder(mediaStreamDestination.stream);
    const audioChunks: Blob[] = [];
    
    mediaRecorder.ondataavailable = (event) => {
      audioChunks.push(event.data);
    };
    
    mediaRecorder.onstop = () => {
      const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
      const audioUrl = URL.createObjectURL(audioBlob);
      resolve(audioUrl);
    };
    
    utterance.onend = () => {
      mediaRecorder.stop();
    };
    
    utterance.onerror = (event) => {
      reject(new Error(`Speech synthesis error: ${event.error}`));
    };
    
    // Start recording and speaking
    mediaRecorder.start();
    speechSynthesis.speak(utterance);
  });
};

const selectVoice = (voices: SpeechSynthesisVoice[], preferredVoice: string): SpeechSynthesisVoice | null => {
  // Voice mapping for different preferences
  const voicePreferences = {
    aria: ['Google UK English Female', 'Microsoft Zira', 'Samantha', 'female'],
    roger: ['Google UK English Male', 'Microsoft David', 'Alex', 'male'],
    sarah: ['Google US English Female', 'Microsoft Hazel', 'Victoria', 'female'],
    laura: ['Microsoft Helen', 'Google UK English Female', 'female'],
    charlie: ['Google US English Male', 'Microsoft Mark', 'male']
  };
  
  const preferences = voicePreferences[preferredVoice] || voicePreferences.aria;
  
  // Try to find exact matches first
  for (const preference of preferences) {
    const voice = voices.find(v => 
      v.name.toLowerCase().includes(preference.toLowerCase()) ||
      v.lang.includes('en')
    );
    if (voice) return voice;
  }
  
  // Fallback to any English voice
  return voices.find(v => v.lang.startsWith('en')) || voices[0] || null;
};

const createSilentAudio = (): string => {
  // Create a minimal audio blob for cases where speech synthesis fails
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  const buffer = audioContext.createBuffer(1, audioContext.sampleRate * 0.1, audioContext.sampleRate);
  
  // Convert buffer to blob
  const arrayBuffer = new ArrayBuffer(buffer.length * 2);
  const view = new DataView(arrayBuffer);
  
  for (let i = 0; i < buffer.length; i++) {
    view.setInt16(i * 2, 0, true);
  }
  
  const audioBlob = new Blob([arrayBuffer], { type: 'audio/wav' });
  return URL.createObjectURL(audioBlob);
};

export const getAvailableVoices = (): string[] => {
  if ('speechSynthesis' in window) {
    const voices = speechSynthesis.getVoices();
    return voices
      .filter(voice => voice.lang.startsWith('en'))
      .map(voice => voice.name)
      .slice(0, 10); // Limit to first 10 voices
  }
  return ['Default Voice'];
};

// Ensure voices are loaded
if ('speechSynthesis' in window) {
  speechSynthesis.onvoiceschanged = () => {
    console.log('Voices loaded:', speechSynthesis.getVoices().length);
  };
}
