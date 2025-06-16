
import { ImageAnalysisResult } from './imageAnalysis';

export interface StoryGenerationOptions {
  type: 'story' | 'poem';
  tone: 'cheerful' | 'mysterious' | 'romantic' | 'adventurous' | 'contemplative';
  length: 'short' | 'medium' | 'long';
}

export const generateStory = async (
  analysis: ImageAnalysisResult, 
  options: StoryGenerationOptions = { type: 'story', tone: 'contemplative', length: 'medium' }
): Promise<string> => {
  try {
    // Use a combination of templates and dynamic generation
    const story = await generateFromTemplate(analysis, options);
    return story;
  } catch (error) {
    console.error('Error generating story:', error);
    return generateFallbackStory(analysis, options);
  }
};

const generateFromTemplate = async (
  analysis: ImageAnalysisResult, 
  options: StoryGenerationOptions
): Promise<string> => {
  const templates = getTemplatesForType(options.type, options.tone);
  const template = selectBestTemplate(templates, analysis);
  
  return populateTemplate(template, analysis, options);
};

const getTemplatesForType = (type: string, tone: string) => {
  const storyTemplates = {
    cheerful: [
      "In the {setting} where {colors} paint the world, {description}. The {mood} atmosphere fills every corner with {emotions}, creating a moment where {story_element} unfolds. Here, amidst the {objects}, life reveals its simple joys and {characters} find reasons to smile.",
      "The morning light dances through the {setting}, casting {colors} across everything it touches. {description} captures a moment of pure {emotions}, where {story_element} and the world seems to celebrate {objects} in perfect harmony.",
    ],
    mysterious: [
      "Shadows whisper secrets in this {setting}, where {colors} create an enigmatic tapestry. {description} holds mysteries yet to be unveiled. The {mood} ambiance suggests that {story_element}, while {objects} stand as silent witnesses to untold tales.",
      "In the depths of {setting}, {colors} weave through the {mood} landscape. {description} conceals more than it reveals, where {story_element} and {objects} guard their secrets beneath layers of {emotions}.",
    ],
    romantic: [
      "Love finds its way into this {setting}, painted in hues of {colors}. {description} tells of hearts that {story_element}, where {emotions} bloom like flowers among the {objects}. The {mood} scene whispers of connections that transcend time.",
      "Two souls might have walked through this {setting}, where {colors} frame their story. {description} captures the essence of {emotions}, where {story_element} and {objects} become witnesses to love's gentle touch.",
    ],
    adventurous: [
      "Adventure calls from this {setting}, where {colors} mark the path forward. {description} speaks of journeys yet to begin, where brave hearts {story_element} and {objects} become landmarks in quests for discovery. The {mood} energy pulses with {emotions}.",
      "Beyond the horizon of this {setting}, {colors} paint promises of exploration. {description} captures the spirit of those who {story_element}, where {objects} serve as guideposts for {emotions} and endless possibilities.",
    ],
    contemplative: [
      "In the quiet of this {setting}, {colors} invite reflection. {description} offers a moment to pause, where {story_element} and {objects} become mirrors for {emotions}. The {mood} atmosphere encourages deep thoughts and inner journeys.",
      "Time seems to slow in this {setting}, where {colors} create a canvas for meditation. {description} captures the essence of {emotions}, where {story_element} and {objects} speak to the soul's need for {mood} contemplation.",
    ]
  };

  const poemTemplates = {
    cheerful: [
      "In {setting} bright with {colors} gleaming,\n{description} sets hearts dreaming.\n{Objects} dance with {emotions} flowing,\nWhere {story_element}, joy is growing.",
      "{Colors} paint the {setting} fair,\n{Emotions} floating in the air.\n{Description} captures moments sweet,\nWhere {story_element} and hearts meet.",
    ],
    mysterious: [
      "Through {setting} where {colors} hide,\n{Description} keeps secrets inside.\n{Objects} whisper tales untold,\nOf {emotions} and mysteries old.",
      "In shadows of the {setting} deep,\n{Colors} their vigil keep.\n{Description} holds what eyes can't see,\nWhere {story_element} and secrets be.",
    ],
    romantic: [
      "In {setting} where {colors} entwine,\n{Description} tells of love divine.\n{Objects} witness hearts that {story_element},\nWith {emotions} that forever gleam.",
      "{Colors} bloom in {setting} fair,\n{Emotions} floating through the air.\n{Description} captures love so true,\nWhere {story_element} and dreams come through.",
    ]
  };

  return options.type === 'poem' ? poemTemplates[tone] || poemTemplates.contemplative : storyTemplates[tone] || storyTemplates.contemplative;
};

const selectBestTemplate = (templates: string[], analysis: ImageAnalysisResult): string => {
  // Select template based on analysis characteristics
  if (analysis.people && analysis.people > 0) {
    return templates.find(t => t.includes('hearts') || t.includes('souls')) || templates[0];
  }
  
  if (analysis.setting === 'nature' || analysis.setting === 'forest') {
    return templates.find(t => t.includes('dance') || t.includes('whisper')) || templates[0];
  }
  
  return templates[Math.floor(Math.random() * templates.length)];
};

const populateTemplate = (template: string, analysis: ImageAnalysisResult, options: StoryGenerationOptions): string => {
  const storyElements = generateStoryElements(analysis, options);
  
  let story = template
    .replace(/{setting}/g, analysis.setting)
    .replace(/{colors}/g, analysis.colors.slice(0, 2).join(' and '))
    .replace(/{description}/g, analysis.description)
    .replace(/{mood}/g, analysis.mood)
    .replace(/{objects}/g, analysis.objects.slice(0, 2).join(' and '))
    .replace(/{emotions}/g, analysis.emotions?.slice(0, 2).join(' and ') || 'wonder')
    .replace(/{story_element}/g, storyElements.action)
    .replace(/{characters}/g, storyElements.characters);

  // Capitalize first letters after periods and line breaks
  story = story.replace(/(^|\. |\n)([a-z])/g, (match, prefix, letter) => prefix + letter.toUpperCase());
  
  return expandStory(story, analysis, options);
};

const generateStoryElements = (analysis: ImageAnalysisResult, options: StoryGenerationOptions) => {
  const actions = {
    cheerful: ['celebrate life', 'discover joy', 'embrace happiness', 'find wonder'],
    mysterious: ['unveil secrets', 'explore the unknown', 'seek hidden truths', 'wander through enigmas'],
    romantic: ['fall in love', 'cherish moments', 'write love letters', 'dance together'],
    adventurous: ['embark on quests', 'chase horizons', 'conquer fears', 'explore new worlds'],
    contemplative: ['reflect deeply', 'ponder existence', 'seek understanding', 'find peace']
  };

  const characters = analysis.people && analysis.people > 0 
    ? analysis.people === 1 ? 'the solitary figure' : 'the companions'
    : 'wandering spirits';

  return {
    action: actions[options.tone][Math.floor(Math.random() * actions[options.tone].length)],
    characters
  };
};

const expandStory = (baseStory: string, analysis: ImageAnalysisResult, options: StoryGenerationOptions): string => {
  if (options.length === 'short') return baseStory;

  const expansions = generateExpansions(analysis, options);
  
  if (options.length === 'medium') {
    return baseStory + ' ' + expansions.slice(0, 1).join(' ');
  }
  
  return baseStory + ' ' + expansions.join(' ');
};

const generateExpansions = (analysis: ImageAnalysisResult, options: StoryGenerationOptions): string[] => {
  const expansions: string[] = [];
  
  // Add environmental details
  if (analysis.setting === 'nature') {
    expansions.push(`The natural world seems to breathe with life, where every ${analysis.objects[0] || 'element'} tells its own story of growth and renewal.`);
  }
  
  // Add emotional depth
  if (analysis.emotions && analysis.emotions.length > 0) {
    expansions.push(`These moments of ${analysis.emotions[0]} remind us that beauty exists in the simplest observations, waiting to be discovered by those who pause to truly see.`);
  }
  
  // Add sensory details
  expansions.push(`The interplay of ${analysis.colors.join(', ')} creates a visual symphony that speaks to something deeper than mere sight, touching the very essence of human experience.`);
  
  return expansions;
};

const generateFallbackStory = (analysis: ImageAnalysisResult, options: StoryGenerationOptions): string => {
  const fallbackTemplates = [
    `In this captured moment, the essence of ${analysis.mood} permeates every detail. The ${analysis.colors.join(' and ')} tones create a ${analysis.setting} that invites contemplation and wonder.`,
    `Here, where ${analysis.objects.join(' and ')} meet the eye, a story unfolds of ${analysis.emotions?.join(' and ') || 'mystery and beauty'}. This image captures more than a moment—it preserves a feeling.`,
    `The ${analysis.description} speaks to the heart in ways that words can barely capture. In this ${analysis.setting}, we find a reflection of life's infinite complexity and simple truths.`
  ];
  
  return fallbackTemplates[Math.floor(Math.random() * fallbackTemplates.length)];
};
