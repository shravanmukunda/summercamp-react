export const CATEGORIES = [
    { id: 'music', name: 'Music', icon: '🎵', color: 'purple' },
    { id: 'art', name: 'Art', icon: '🎨', color: 'pink' },
    { id: 'tuition', name: 'Tuition', icon: '📚', color: 'blue' },
    { id: 'dance', name: 'Dance', icon: '💃', color: 'green' },
    { id: 'sports', name: 'Sports', icon: '⚽', color: 'orange' },
  ];
  
  export const CITIES = [
    'Bangalore',
    'Mumbai',
    'Delhi',
    'Chennai',
    'Hyderabad',
    'Pune',
    'Kolkata',
  ];
  
  export const API_ENDPOINTS = {
    INSTITUTIONS: '/data/institutions.json',
    INSTITUTION_DETAIL: (id) => `/data/institutions/${id}.json`,
  };
  