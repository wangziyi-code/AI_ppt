export interface PPTStyle {
  id: string;
  nameKey: string;
  descKey: string;
  previewGradient: string;
  previewBg: string;
  textColor: string;
}

export const PPT_STYLES: PPTStyle[] = [
  {
    id: 'glassmorphism',
    nameKey: 'glassmorphism',
    descKey: 'glassmorphismDesc',
    previewGradient: 'from-blue-400/60 via-purple-400/60 to-pink-400/60',
    previewBg: 'bg-gradient-to-br from-indigo-500 to-purple-600',
    textColor: 'text-white',
  },
  {
    id: 'dark-premium',
    nameKey: 'dark-premium',
    descKey: 'dark-premiumDesc',
    previewGradient: 'from-amber-400/80 via-yellow-300/80 to-orange-400/80',
    previewBg: 'bg-gradient-to-br from-gray-900 to-gray-800',
    textColor: 'text-amber-300',
  },
  {
    id: 'gradient-modern',
    nameKey: 'gradient-modern',
    descKey: 'gradient-modernDesc',
    previewGradient: 'from-pink-500 via-purple-500 to-cyan-500',
    previewBg: 'bg-gradient-to-br from-pink-500 via-purple-500 to-cyan-500',
    textColor: 'text-white',
  },
  {
    id: 'neo-brutalist',
    nameKey: 'neo-brutalist',
    descKey: 'neo-brutalistDesc',
    previewGradient: 'from-yellow-400 to-lime-400',
    previewBg: 'bg-yellow-400',
    textColor: 'text-black',
  },
  {
    id: '3d-isometric',
    nameKey: '3d-isometric',
    descKey: '3d-isometricDesc',
    previewGradient: 'from-teal-400 via-cyan-400 to-blue-400',
    previewBg: 'bg-gradient-to-br from-teal-400 to-blue-500',
    textColor: 'text-white',
  },
  {
    id: 'editorial',
    nameKey: 'editorial',
    descKey: 'editorialDesc',
    previewGradient: 'from-gray-900 via-gray-700 to-red-600',
    previewBg: 'bg-gradient-to-br from-gray-900 to-red-900',
    textColor: 'text-white',
  },
  {
    id: 'minimal-swiss',
    nameKey: 'minimal-swiss',
    descKey: 'minimal-swissDesc',
    previewGradient: 'from-gray-100 to-gray-300',
    previewBg: 'bg-white',
    textColor: 'text-gray-900',
  },
  {
    id: 'keynote',
    nameKey: 'keynote',
    descKey: 'keynoteDesc',
    previewGradient: 'from-blue-600 via-blue-500 to-indigo-600',
    previewBg: 'bg-gradient-to-br from-blue-900 to-indigo-900',
    textColor: 'text-white',
  },
];
