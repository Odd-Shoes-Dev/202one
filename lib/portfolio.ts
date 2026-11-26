export const categories = {
  'videography-photography': {
    title: 'Videography & Photography',
    description: 'Creative direction, camera work and finishing for film and photography.',
    image: 'film',
    sections: [
      { id: 'visual-arts', title: 'Visual Arts', description: 'Visual concepts, art direction and photography that establish how a project looks and feels.' },
      { id: 'production', title: 'Production', description: 'On-set filming, photography and lighting to capture the material a project needs.' },
      { id: 'post-production', title: 'Post Production', description: 'Editing, colour grading and photo retouching that bring the finished work together.' },
    ],
  },
  graphics: {
    title: 'Graphics',
    description: 'Graphic design and animation for screens, campaigns and creative projects.',
    image: 'graphics',
    sections: [
      { id: 'still-motion', title: 'Still Motion', description: 'Graphic compositions built around typography, colour and imagery for brands and campaigns.' },
      { id: 'motion-graphics', title: 'Motion Graphics', description: 'Animated titles, logos and graphics for video, social media and live production.' },
    ],
  },
  audio: {
    title: 'Audio',
    description: 'Recording, sound design and music production from the first take to the final mix.',
    image: 'audio',
    sections: [
      { id: 'sound-engineering', title: 'Sound Engineering', description: 'Recording, editing and mixing for vocals, instruments and live performances.' },
      { id: 'sound-design', title: 'Sound Design', description: 'Sound effects, textures and atmospheres shaped for film, motion and live experiences.' },
      { id: 'music-production', title: 'Music Production', description: 'Song development, arrangement and production with artists and creative teams.' },
    ],
  },
  'audio-video-services': {
    title: 'Audio & Video Services',
    description: 'Audio production and event coverage for parties, performances and other functions.',
    image: 'events',
    sections: [
      { id: 'audio-production', title: 'Audio Production', description: 'Recording and post production for spoken word, performances and other audio projects.' },
      { id: 'event-videography', title: 'Videography for Parties and Other Functions', description: 'Film coverage for parties, celebrations and other functions, from the key moments to the details in between.' },
      { id: 'event-photography', title: 'Photography for Any Function', description: 'Event photography that captures the people, the setting and the moments worth keeping.' },
    ],
  },
} as const

export type CategorySlug = keyof typeof categories
type SectionId = (typeof categories)[CategorySlug]['sections'][number]['id']

type PortfolioImage = {
  src: `/${string}`
  alt: string
  width: number
  height: number
}

type PortfolioMedia =
  | { type: 'gallery'; images: readonly [PortfolioImage, ...PortfolioImage[]] }
  | { type: 'video'; src: `/${string}`; poster?: `/${string}`; captions: `/${string}` }
  | { type: 'audio'; src: `/${string}`; transcript?: string }

export interface PortfolioProject {
  id: string
  title: string
  description: string
  sections: readonly SectionId[]
  media: PortfolioMedia
}

// Add approved project files under public and list their site-relative URLs here.
export const projects: readonly PortfolioProject[] = []
