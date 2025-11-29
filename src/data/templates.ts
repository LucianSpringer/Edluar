export const SITE_TEMPLATES = [
    {
        id: 'blank',
        name: 'Start Fresh',
        thumbnail: 'https://placehold.co/600x400/ffffff/e2e8f0?text=Blank+Page',
        config: {
            font: 'Inter',
            primaryColor: '#10B981',
            bg: '#ffffff',
            textColor: '#111827',
            buttonShape: 'rounded-md',
            blocks: []
        }
    },
    {
        id: 'studio-minimal',
        name: 'Studio Minimal',
        thumbnail: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?fit=crop&w=600&q=80',
        config: {
            font: 'Inter',
            primaryColor: '#000000',
            bg: '#ffffff',
            textColor: '#111827',
            buttonShape: 'rounded-none',
            blocks: [
                {
                    id: 'sm-1',
                    type: 'header',
                    variant: 'display',
                    value: "WE SHAPE FUTURE.",
                    textColor: '#000000'
                },
                {
                    id: 'sm-2',
                    type: 'paragraph',
                    value: "We are a digital product studio building the next generation of software. Join our team of creators, thinkers, and builders.",
                    textColor: '#4B5563'
                },
                {
                    id: 'sm-3',
                    type: 'image',
                    src: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1200&q=80'
                },
                {
                    id: 'sm-4',
                    type: 'job_list',
                    bgColor: '#ffffff',
                    ctaText: "View All Positions",
                    ctaLink: "#jobs"
                }
            ]
        }
    },
    {
        id: 'cyber-future',
        name: 'Cyber Future',
        thumbnail: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?fit=crop&w=600&q=80',
        config: {
            font: 'Oswald',
            primaryColor: '#6366F1', // Indigo
            bg: '#0F172A', // Slate 900
            textColor: '#F8FAFC',
            buttonShape: 'rounded-lg',
            blocks: [
                {
                    id: 'cf-1',
                    type: 'hero_collage',
                    value: "BUILD THE IMPOSSIBLE",
                    subtitle: "Remote-first engineering team pushing the boundaries of AI.",
                    titleColor: '#F8FAFC',
                    subtitleColor: '#94A3B8',
                    bgColor: '#0F172A',
                    images: [
                        'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80',
                        'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
                        'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80',
                        'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80'
                    ]
                },
                {
                    id: 'cf-2',
                    type: 'bento_grid',
                    bentoItems: [
                        { title: 'Stack', subtitle: 'Modern Tech', type: 'stat', content: 'TS/Rust', color: '#1E293B', textColor: '#6366F1' },
                        { title: 'Culture', subtitle: 'Remote First', type: 'image', content: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c', color: '#000000' },
                        { title: 'Perks', subtitle: 'Full Benefits', type: 'link', content: '#', color: '#6366F1', textColor: '#ffffff' },
                        { title: 'Team', subtitle: 'Global', type: 'social', content: '20+ Countries', color: '#1E293B', textColor: '#ffffff' }
                    ]
                },
                {
                    id: 'cf-3',
                    type: 'job_list',
                    bgColor: '#0F172A'
                }
            ]
        }
    },
    {
        id: 'enterprise-pro',
        name: 'Enterprise Pro',
        thumbnail: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?fit=crop&w=600&q=80',
        config: {
            font: 'Merriweather',
            primaryColor: '#1E3A8A', // Blue 900
            bg: '#F8FAFC', // Slate 50
            textColor: '#1E293B',
            buttonShape: 'rounded-md',
            blocks: [
                {
                    id: 'ep-1',
                    type: 'hero',
                    value: "Global Leadership",
                    subtitle: "Join a Fortune 500 company dedicated to sustainable innovation.",
                    titleColor: '#1E3A8A',
                    subtitleColor: '#475569',
                    bgColor: '#FFFFFF',
                    ctaText: "Explore Careers",
                    ctaLink: "#"
                },
                {
                    id: 'ep-2',
                    type: 'features',
                    features: [
                        { title: 'Health & Wellness', description: 'Comprehensive medical, dental, and vision coverage for you and your family.', textColor: '#1E293B' },
                        { title: 'Retirement', description: '401(k) matching up to 6% to help you plan for your future.', textColor: '#1E293B' },
                        { title: 'Learning', description: 'Annual stipend for conferences, courses, and professional development.', textColor: '#1E293B' }
                    ]
                },
                {
                    id: 'ep-3',
                    type: 'job_list',
                    bgColor: '#F8FAFC'
                }
            ]
        }
    },
    {
        id: 'creative-pulse',
        name: 'Creative Pulse',
        thumbnail: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?fit=crop&w=600&q=80',
        config: {
            font: 'Poppins', // Assuming Poppins is available, or fallback to sans
            primaryColor: '#F97316', // Orange 500
            bg: '#FFFBEB', // Amber 50
            textColor: '#1F2937',
            buttonShape: 'rounded-full',
            blocks: [
                {
                    id: 'cp-1',
                    type: 'header',
                    variant: 'display',
                    value: "WORK HAPPY.",
                    textColor: '#F97316'
                },
                {
                    id: 'cp-2',
                    type: 'gallery',
                    images: [
                        'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80',
                        'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=800&q=80',
                        'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80',
                        'https://images.unsplash.com/photo-1531545514256-b1400bc00f31?auto=format&fit=crop&w=800&q=80'
                    ]
                },
                {
                    id: 'cp-3',
                    type: 'paragraph',
                    value: "We're a team of dreamers and doers. No suits, no egos, just great work.",
                    textColor: '#4B5563'
                },
                {
                    id: 'cp-4',
                    type: 'job_list',
                    bgColor: '#FFFBEB'
                }
            ]
        }
    },
    {
        id: 'eco-zen',
        name: 'Eco Zen',
        thumbnail: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?fit=crop&w=600&q=80',
        config: {
            font: 'Merriweather',
            primaryColor: '#059669', // Emerald 600
            bg: '#ECFDF5', // Emerald 50
            textColor: '#064E3B', // Emerald 900
            buttonShape: 'rounded-2xl',
            blocks: [
                {
                    id: 'ez-1',
                    type: 'hero',
                    value: "Grow With Us",
                    subtitle: "Cultivating a better future for our planet and our people.",
                    titleColor: '#064E3B',
                    subtitleColor: '#047857',
                    bgColor: '#ECFDF5',
                    ctaText: "Join Our Mission",
                    ctaLink: "#"
                },
                {
                    id: 'ez-2',
                    type: 'image',
                    src: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1200&q=80'
                },
                {
                    id: 'ez-3',
                    type: 'features',
                    features: [
                        { title: 'Remote First', description: 'Work from anywhere in the world.', textColor: '#064E3B' },
                        { title: 'Sustainable', description: '100% Carbon neutral operations.', textColor: '#064E3B' },
                        { title: 'Balanced', description: '4-day work week for everyone.', textColor: '#064E3B' }
                    ]
                }
            ]
        }
    },
    {
        id: 'bold-brutalism',
        name: 'Bold Brutalism',
        thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?fit=crop&w=600&q=80',
        config: {
            font: 'Oswald',
            primaryColor: '#000000',
            bg: '#FEF08A', // Yellow 200
            textColor: '#000000',
            buttonShape: 'rounded-none',
            blocks: [
                {
                    id: 'bb-1',
                    type: 'header',
                    variant: 'display',
                    value: "WE HIRE.",
                    textColor: '#000000'
                },
                {
                    id: 'bb-2',
                    type: 'paragraph',
                    value: "NO FLUFF. JUST CODE. JOIN THE REVOLUTION.",
                    textColor: '#000000'
                },
                {
                    id: 'bb-3',
                    type: 'bento_grid',
                    bentoItems: [
                        { title: 'PAY', subtitle: 'Top 1%', type: 'stat', content: '$200k+', color: '#ffffff', textColor: '#000000' },
                        { title: 'WORK', subtitle: 'Remote', type: 'stat', content: '100%', color: '#000000', textColor: '#FEF08A' },
                        { title: 'SHIP', subtitle: 'Daily', type: 'link', content: '#', color: '#ffffff', textColor: '#000000' },
                        { title: 'GROW', subtitle: 'Fast', type: 'social', content: '🚀', color: '#000000', textColor: '#FEF08A' }
                    ]
                },
                {
                    id: 'bb-4',
                    type: 'job_list',
                    bgColor: '#FEF08A'
                }
            ]
        }
    },
    {
        id: 'soft-saas',
        name: 'Soft SaaS',
        thumbnail: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?fit=crop&w=600&q=80',
        config: {
            font: 'Inter',
            primaryColor: '#4F46E5', // Indigo 600
            bg: '#F5F3FF', // Violet 50
            textColor: '#1E1B4B', // Indigo 950
            buttonShape: 'rounded-xl',
            blocks: [
                {
                    id: 'ss-1',
                    type: 'hero',
                    value: "Simplify Your Work",
                    subtitle: "Join the team building the world's most intuitive productivity platform.",
                    titleColor: '#1E1B4B',
                    subtitleColor: '#4338CA',
                    bgColor: '#F5F3FF',
                    ctaText: "See Open Roles",
                    ctaLink: "#"
                },
                {
                    id: 'ss-2',
                    type: 'features',
                    features: [
                        { title: 'Flexible Hours', description: 'Work when you feel most productive.', textColor: '#1E1B4B' },
                        { title: 'Great Gear', description: 'Latest MacBook Pro and accessories.', textColor: '#1E1B4B' },
                        { title: 'Wellness', description: 'Monthly budget for gym and health.', textColor: '#1E1B4B' }
                    ]
                },
                {
                    id: 'ss-3',
                    type: 'job_list',
                    bgColor: '#F5F3FF'
                }
            ]
        }
    },
    {
        id: 'retro-pop',
        name: 'Retro Pop',
        thumbnail: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?fit=crop&w=600&q=80',
        config: {
            font: 'Poppins',
            primaryColor: '#EC4899', // Pink 500
            bg: '#FCE7F3', // Pink 100
            textColor: '#831843', // Pink 900
            buttonShape: 'rounded-md',
            blocks: [
                {
                    id: 'rp-1',
                    type: 'hero_collage',
                    value: "Retro Vibes",
                    subtitle: "Building the future with a blast from the past.",
                    titleColor: '#831843',
                    subtitleColor: '#BE185D',
                    bgColor: '#FCE7F3',
                    images: [
                        'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80',
                        'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=800&q=80',
                        'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80',
                        'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80'
                    ]
                },
                {
                    id: 'rp-2',
                    type: 'paragraph',
                    value: "We are bringing back the fun in software development. Join our colorful team!",
                    textColor: '#831843'
                },
                {
                    id: 'rp-3',
                    type: 'job_list',
                    bgColor: '#FCE7F3'
                }
            ]
        }
    },
    {
        id: 'luxury-dark',
        name: 'Luxury Dark',
        thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?fit=crop&w=600&q=80',
        config: {
            font: 'Merriweather',
            primaryColor: '#D4AF37', // Gold
            bg: '#000000', // Black
            textColor: '#F5F5F4', // Stone 100
            buttonShape: 'rounded-none',
            blocks: [
                {
                    id: 'ld-1',
                    type: 'hero',
                    value: "Excellence Defined",
                    subtitle: "A career for those who demand the very best.",
                    titleColor: '#D4AF37',
                    subtitleColor: '#A8A29E',
                    bgColor: '#000000',
                    ctaText: "Inquire Within",
                    ctaLink: "#"
                },
                {
                    id: 'ld-2',
                    type: 'image',
                    src: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80'
                },
                {
                    id: 'ld-3',
                    type: 'job_list',
                    bgColor: '#000000'
                }
            ]
        }
    },
    {
        id: 'newsroom',
        name: 'Newsroom',
        thumbnail: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?fit=crop&w=600&q=80',
        config: {
            font: 'Inter',
            primaryColor: '#DC2626', // Red 600
            bg: '#F5F5F4', // Stone 100
            textColor: '#1C1917', // Stone 900
            buttonShape: 'rounded-none',
            blocks: [
                {
                    id: 'nr-1',
                    type: 'header',
                    variant: 'display',
                    value: "BREAKING NEWS",
                    textColor: '#DC2626'
                },
                {
                    id: 'nr-2',
                    type: 'paragraph',
                    value: "We are expanding our global coverage. Seeking truth-seekers and storytellers.",
                    textColor: '#1C1917'
                },
                {
                    id: 'nr-3',
                    type: 'features',
                    features: [
                        { title: 'Global Reach', description: 'Bureaus in 50+ major cities.', textColor: '#1C1917' },
                        { title: 'Impact', description: 'Journalism that changes laws and lives.', textColor: '#1C1917' },
                        { title: 'Integrity', description: 'Uncompromising commitment to the truth.', textColor: '#1C1917' }
                    ]
                },
                {
                    id: 'nr-4',
                    type: 'job_list',
                    bgColor: '#F5F5F4'
                }
            ]
        }
    }
];
