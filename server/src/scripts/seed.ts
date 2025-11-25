import { PostRepository } from '../repositories/PostRepository';
import { DatabaseManager } from '../database/Database';

// Initialize DB
DatabaseManager.getInstance();

const legacyPosts = [
  // --- ORIGINAL 5 POSTS (IDs 1-5) ---
  {
    title: "The Death of the Resume: Why Skills-Based Hiring is the Future",
    excerpt: "Traditional CVs are failing. Here is how focusing on tangible skills creates a more diverse workforce.",
    category: "Hiring Tips",
    date: "Oct 24, 2023",
    read_time: "10 min read",
    image_url: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3",
    author_name: "Elena Rostova",
    author_role: "CEO & Founder",
    author_image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2",
    author_bio: "Elena is a former HR Director.",
    is_featured: true,
    content: "<p>The CV is a relic...</p>"
  },
  {
    title: "How Nimbus Reduced Time-to-Hire by 40%",
    excerpt: "A deep dive into how Nimbus utilized Edluar's AI descriptions to streamline their pipeline.",
    category: "Case Studies",
    date: "Oct 18, 2023",
    read_time: "5 min read",
    image_url: "https://images.unsplash.com/photo-1551434678-e076c223a692",
    author_name: "Sarah Jenkins",
    author_role: "CPO",
    author_image: "https://images.unsplash.com/photo-1580489944761-15a19d654956",
    author_bio: "Sarah is a Psychology PhD.",
    is_featured: false,
    content: "<h2>The Bottleneck</h2><p>Nimbus was facing a crisis...</p>"
    // ^^^ THIS WILL BE ID: 2 (NIMBUS)
  },
  {
    title: "Cultivating Psychological Safety",
    excerpt: "Remote work requires intentionality.",
    category: "Culture",
    date: "Oct 12, 2023",
    read_time: "8 min read",
    image_url: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f",
    author_name: "Marcus Chen",
    author_role: "Head of Product",
    author_image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e",
    author_bio: "Marcus is an architect.",
    is_featured: false,
    content: "<p>Safety is key...</p>"
  },
  {
    title: "Edluar 2.0: The Organic Engine",
    excerpt: "See what's new in our latest major release.",
    category: "Product Updates",
    date: "Sep 29, 2023",
    read_time: "4 min read",
    image_url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f",
    author_name: "Elena Rostova",
    author_role: "CEO",
    author_image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2",
    author_bio: "Elena is a former HR Director.",
    is_featured: false,
    content: "<p>Dark mode is here...</p>"
  },
  {
    title: "5 Signs Your Interview Process is Broken",
    excerpt: "Are you losing great candidates?",
    category: "Hiring Tips",
    date: "Sep 15, 2023",
    read_time: "6 min read",
    image_url: "https://images.unsplash.com/photo-1573497620053-ea5300f94f21",
    author_name: "Sarah Jenkins",
    author_role: "CPO",
    author_image: "https://images.unsplash.com/photo-1580489944761-15a19d654956",
    author_bio: "Sarah is a Psychology PhD.",
    is_featured: false,
    content: "<p>Hiring is a two-way street...</p>"
  },

  // --- NEW CASE STUDIES (IDs 6-10) ---
  {
    title: "How Canopy Corp grew their remote team by 200% sustainably",
    excerpt: "Scaling a remote team requires more than just Zoom links.",
    category: "Case Studies",
    date: "Oct 28, 2023",
    read_time: "6 min read",
    image_url: "https://images.unsplash.com/photo-1522071820081-009f0129c71c",
    author_name: "Marcus Chen",
    author_role: "Head of Product",
    author_image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e",
    author_bio: "Marcus is an architect.",
    is_featured: false,
    content: "<h2>The Challenge</h2><p>Canopy Corp needed to double size...</p>"
    // ^^^ THIS WILL BE ID: 6 (CANOPY)
  },
  {
    title: "Cultivating top engineering talent from the ground up",
    excerpt: "Sprout Labs shares their transparency-first pipeline.",
    category: "Case Studies",
    date: "Nov 01, 2023",
    read_time: "7 min read",
    image_url: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f",
    author_name: "Elena Rostova",
    author_role: "CEO",
    author_image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2",
    author_bio: "Elena is founder.",
    is_featured: false,
    content: "<h2>The Seed Stage</h2><p>Sprout Labs couldn't match FAANG salaries...</p>"
    // ^^^ THIS WILL BE ID: 7 (SPROUT)
  },
  {
    title: "Flora Fin's organic approach to high-stakes financial hiring",
    excerpt: "Reducing burnout in high-frequency trading.",
    category: "Case Studies",
    date: "Nov 05, 2023",
    read_time: "5 min read",
    image_url: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7",
    author_name: "Sarah Jenkins",
    author_role: "CPO",
    author_image: "https://images.unsplash.com/photo-1580489944761-15a19d654956",
    author_bio: "Sarah is a Psychology PhD.",
    is_featured: false,
    content: "<h2>The Burnout</h2><p>Finance is usually cutthroat...</p>"
    // ^^^ THIS WILL BE ID: 8 (FLORA)
  },
  {
    title: "Keeping candidate relationships fresh with automated nurturing",
    excerpt: "Evergreen Recruitment turned their database into a community.",
    category: "Case Studies",
    date: "Nov 10, 2023",
    read_time: "4 min read",
    image_url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f",
    author_name: "Marcus Chen",
    author_role: "Head of Product",
    author_image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e",
    author_bio: "Marcus is an architect.",
    is_featured: false,
    content: "<h2>The Dormant Pool</h2><p>Evergreen had 50k candidates...</p>"
    // ^^^ THIS WILL BE ID: 9 (EVERGREEN)
  },
  {
    title: "Scaling to the summit: Hiring 50 devs in 3 months",
    excerpt: "Summit Systems used Automated Orchestration to hyper-scale.",
    category: "Case Studies",
    date: "Nov 12, 2023",
    read_time: "9 min read",
    image_url: "https://images.unsplash.com/photo-1504384308090-c54be3855463",
    author_name: "Elena Rostova",
    author_role: "CEO",
    author_image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2",
    author_bio: "Elena is founder.",
    is_featured: false,
    content: "<h2>The Climb</h2><p>Summit raised Series B...</p>"
    // ^^^ THIS WILL BE ID: 10 (SUMMIT)
  }
];

const runSeed = async () => {
  console.log('🌱 Seeding Content...');
  try {
    await PostRepository.seed(legacyPosts);
    console.log('✅ Migration Complete. All Articles Restored.');
  } catch (e) {
    console.error('❌ Seeding Failed:', e);
  }
};

runSeed();
