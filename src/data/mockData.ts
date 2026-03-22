export interface Project {
  id: string;
  title: string;
  type: 'Flat' | 'Villa' | 'Commercial';
  location: string;
  priceRange: string;
  status: 'Ongoing' | 'Completed' | 'Upcoming';
  image: string;
  description: string;
  amenities: string[];
  features: string[];
  gallery: string[];
  floorPlan?: string;
  mapUrl?: string;
}

export const projects: Project[] = [
  {
    id: 'vanguard-heights',
    title: 'Vanguard Heights',
    type: 'Flat',
    location: 'Worli, Mumbai',
    priceRange: '₹4.5 Cr - ₹12 Cr',
    status: 'Ongoing',
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80',
    description: 'Experience the pinnacle of luxury living in the heart of Mumbai. Vanguard Heights offers breathtaking views of the Arabian Sea and world-class amenities.',
    amenities: ['Infinity Pool', 'Sky Lounge', 'Private Cinema', '24/7 Concierge', 'Smart Home Automation'],
    features: ['Sea View Apartments', 'Italian Marble Flooring', 'Double Height Lobby', 'Vastu Compliant'],
    gallery: [
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1600607687940-4e2003e25c2f?auto=format&fit=crop&w=800&q=80'
    ]
  },
  {
    id: 'royal-villas',
    title: 'Royal Villas',
    type: 'Villa',
    location: 'Lonavala, Maharashtra',
    priceRange: '₹8 Cr - ₹25 Cr',
    status: 'Completed',
    image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=800&q=80',
    description: 'A sanctuary of peace and luxury. Our Royal Villas are designed for those who seek privacy and elegance amidst nature.',
    amenities: ['Private Garden', 'Personal Gym', 'Temperature Controlled Pool', 'Staff Quarters', 'Organic Kitchen Garden'],
    features: ['Sustainable Design', 'Natural Stone Architecture', 'High Ceilings', 'Panoramic Mountain Views'],
    gallery: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=800&q=80'
    ]
  },
  {
    id: 'skyline-plaza',
    title: 'Skyline Plaza',
    type: 'Commercial',
    location: 'Gachibowli, Hyderabad',
    priceRange: '₹2 Cr - ₹15 Cr',
    status: 'Ongoing',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80',
    description: 'The future of business in Hyderabad. Skyline Plaza offers state-of-the-art office spaces and retail outlets in a prime location.',
    amenities: ['High Speed Elevators', 'Business Center', 'Food Court', 'Ample Parking', 'Fiber Optic Connectivity'],
    features: ['LEED Gold Certified', 'Glass Facade', 'Flexible Floor Plates', 'Centralized AC'],
    gallery: [
      'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=800&q=80'
    ]
  },
  {
    id: 'emerald-gardens',
    title: 'Emerald Gardens',
    type: 'Flat',
    location: 'Whitefield, Bangalore',
    priceRange: '₹1.5 Cr - ₹3.5 Cr',
    status: 'Upcoming',
    image: 'https://images.unsplash.com/photo-1567684014761-b618b6983527?auto=format&fit=crop&w=800&q=80',
    description: 'Eco-friendly luxury apartments designed for the modern family. Emerald Gardens focuses on green living without compromising on comfort.',
    amenities: ['Jogging Track', 'Children Play Area', 'Clubhouse', 'Rainwater Harvesting', 'Solar Lighting'],
    features: ['70% Open Space', 'Cross Ventilation', 'Energy Efficient Fixtures', 'Pet Friendly'],
    gallery: [
      'https://images.unsplash.com/photo-1515263487990-61b07816b324?auto=format&fit=crop&w=800&q=80'
    ]
  }
];
