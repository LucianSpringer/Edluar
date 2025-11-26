// server/src/scripts/seed.ts
import { PostRepository } from '../repositories/PostRepository';
import { DatabaseManager } from '../database/Database';

// Initialize DB Connection
DatabaseManager.getInstance();

const allPosts = [
  // --- ID 1: Legacy Post ---
  {
    title: "The Death of the Resume: Why Skills-Based Hiring is the Future",
    excerpt: "Traditional CVs are failing both recruiters and candidates. Here is how focusing on tangible skills creates a more diverse and capable workforce.",
    category: "Hiring Tips",
    date: "Oct 24, 2023",
    read_time: "10 min read",
    image_url: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3",
    author_name: "Elena Rostova",
    author_role: "CEO & Founder",
    author_image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2",
    author_bio: "Elena is a former HR Director.",
    is_featured: true,
    content: `
      <p class="lead">The CV is a relic of the industrial age. It reduces a human being's complex potential into a linear timeline of job titles.</p>
      <h2>The Pedigree Problem</h2>
      <p>For decades, hiring managers have used the resume as a proxy for competence. Went to a top university? Must be smart. But this approach measures privilege, not capability.</p>
    `
  },

  // --- ID 2: NIMBUS (Matches App.tsx) ---
  {
    title: "How Nimbus Reduced Time-to-Hire by 40%",
    excerpt: "A deep dive into how Nimbus utilized Edluar's AI descriptions to streamline their pipeline.",
    category: "Tech", // Matches Landing Page Category
    date: "Oct 18, 2023",
    read_time: "5 min read",
    image_url: "https://images.unsplash.com/photo-1551434678-e076c223a692",
    author_name: "Sarah Jenkins",
    author_role: "CPO",
    author_image: "https://images.unsplash.com/photo-1580489944761-15a19d654956",
    author_bio: "Sarah is a Psychology PhD.",
    is_featured: false,
    content: `
      <p class="lead">Nimbus was facing a crisis: they had the budget to hire, but couldn't get people through the door fast enough.</p>
      <h2>The Solution: Automated Empathy</h2>
      <p>Nimbus implemented Edluar to tackle two specific areas: Instant Job Descriptions and Automated Nurturing. By letting AI handle the first draft, recruiters saved 15 hours a week.</p>
      <h2>The Result</h2>
      <p>Time-to-hire dropped from 45 days to 27 days, while candidate satisfaction scores went up.</p>
    `
  },

  // --- ID 3: Legacy ---
  {
    title: "Cultivating Psychological Safety in Remote Teams",
    excerpt: "Remote work requires intentionality. Learn how to build trust without sharing an office.",
    category: "Culture",
    date: "Oct 12, 2023",
    read_time: "8 min read",
    image_url: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f",
    author_name: "Marcus Chen",
    author_role: "Head of Product",
    author_image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e",
    author_bio: "Marcus is an architect turned product designer.",
    is_featured: false,
    content: "<p>When you can't see your colleagues' faces, silence can be deafening...</p>"
  },

  // --- ID 4: Legacy ---
  {
    title: "Introducing Edluar 2.0: The Organic Engine",
    excerpt: "See what's new in our latest major release, from dark mode to advanced analytics.",
    category: "Product Updates",
    date: "Sep 29, 2023",
    read_time: "4 min read",
    image_url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f",
    author_name: "Elena Rostova",
    author_role: "CEO",
    author_image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2",
    author_bio: "Elena is founder.",
    is_featured: false,
    content: "<p>We built Edluar on the premise that recruitment software should feel natural...</p>"
  },

  // --- ID 5: Legacy ---
  {
    title: "5 Signs Your Interview Process is Broken",
    excerpt: "Are you losing great candidates at the offer stage? Here are the red flags to look for.",
    category: "Hiring Tips",
    date: "Sep 15, 2023",
    read_time: "6 min read",
    image_url: "https://images.unsplash.com/photo-1573497620053-ea5300f94f21",
    author_name: "Sarah Jenkins",
    author_role: "CPO",
    author_image: "https://images.unsplash.com/photo-1580489944761-15a19d654956",
    author_bio: "Sarah is a Psychology PhD.",
    is_featured: false,
    content: "<p>Hiring is a two-way street. A broken process actively repels the best candidates...</p>"
  },

  // --- ID 6: CANOPY CORP (Matches App.tsx) ---
  {
    title: "How Canopy Corp grew their remote team by 200% sustainably",
    excerpt: "Scaling a remote team requires more than just Zoom links. It requires a root system of trust.",
    category: "Agencies", // Matches Landing Page
    date: "Oct 28, 2023",
    read_time: "6 min read",
    image_url: "https://images.unsplash.com/photo-1522071820081-009f0129c71c",
    author_name: "Marcus Chen",
    author_role: "Head of Product",
    author_image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e",
    author_bio: "Marcus is an architect.",
    is_featured: false,
    content: `
      <p class="lead">Canopy Corp needed to double their size in 6 months without losing their soul.</p>
      <h2>The Challenge: Speed vs. Culture</h2>
      <p>Most companies break when they double in size. Processes crumble, culture dilutes, and 'who does what' becomes a mystery.</p>
      <h2>The Edluar Approach</h2>
      <p>Canopy used Edluar's <strong>Culture Sequencer</strong> to map soft skills before technical interviews. This ensured every new hire added to the culture rather than diluting it.</p>
    `
  },

  // --- ID 7: SPROUT LABS (Matches App.tsx) ---
  {
    title: "Cultivating top engineering talent from the ground up",
    excerpt: "Sprout Labs couldn't compete on salary, so they competed on transparency.",
    category: "Product", // Matches Landing Page
    date: "Nov 01, 2023",
    read_time: "7 min read",
    image_url: "https://images.unsplash.com/photo-1531482615713-2afd69097998",
    author_name: "Elena Rostova",
    author_role: "CEO",
    author_image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2",
    author_bio: "Elena is founder.",
    is_featured: false,
    content: `
      <p class="lead">Sprout Labs was a seed-stage startup fighting for talent against FAANG giants.</p>
      <h2>Transparency as a Weapon</h2>
      <p>Using Edluar, Sprout Labs published their entire interview rubric and codebase challenges upfront. No gotchas. No whiteboard hazing.</p>
      <h2>The Result</h2>
      <p>They hired 12 Founding Engineers who specifically cited 'Respect for my time' as the reason they signed.</p>
    `
  },

  // --- ID 8: FLORA FIN (Matches App.tsx) ---
  {
    title: "Flora Fin's organic approach to high-stakes financial hiring",
    excerpt: "Reducing burnout in high-frequency trading by testing for resilience, not just speed.",
    category: "Tech", // Matches Landing Page
    date: "Nov 05, 2023",
    read_time: "5 min read",
    image_url: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7",
    author_name: "Sarah Jenkins",
    author_role: "CPO",
    author_image: "https://images.unsplash.com/photo-1580489944761-15a19d654956",
    author_bio: "Sarah is a Psychology PhD.",
    is_featured: false,
    content: `
      <p class="lead">Finance is usually cutthroat. Flora Fin wanted to be different.</p>
      <h2>The Burnout Problem</h2>
      <p>With an attrition rate of 40%, Flora Fin was bleeding talent. The problem wasn't the work; it was the hiring filter.</p>
      <h2>Filtering for Resilience</h2>
      <p>Flora switched to Edluar's 'Blind Skill Assessment' to remove pedigree bias. They found that candidates from non-target schools often had higher grit scores and stayed 2x longer.</p>
    `
  },

  // --- ID 9: EVERGREEN (Matches App.tsx) ---
  {
    title: "Keeping candidate relationships fresh with automated nurturing",
    excerpt: "Evergreen Recruitment turned their dormant database into a thriving community.",
    category: "Agencies", // Matches Landing Page
    date: "Nov 10, 2023",
    read_time: "4 min read",
    image_url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f",
    author_name: "Marcus Chen",
    author_role: "Head of Product",
    author_image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e",
    author_bio: "Marcus is an architect.",
    is_featured: false,
    content: `
      <p class="lead">Evergreen had 50,000 candidates in their database, but 90% were 'cold'.</p>
      <h2>The Re-Engagement Campaign</h2>
      <p>They used Edluar to send personalized, value-add content (not just job alerts) to their pool. Career advice, market trends, and salary guides.</p>
      <h2>The Harvest</h2>
      <p>When they finally posted a role, they got a 60% response rate from their 'cold' pool because the relationship was warm.</p>
    `
  },

  // --- ID 10: SUMMIT SYSTEMS (Matches App.tsx) ---
  {
    title: "Scaling to the summit: Hiring 50 devs in 3 months",
    excerpt: "Summit Systems used Automated Orchestration to hyper-scale without breaking their HR team.",
    category: "Tech", // Matches Landing Page
    date: "Nov 12, 2023",
    read_time: "9 min read",
    image_url: "https://images.unsplash.com/photo-1504384308090-c54be3855463",
    author_name: "Elena Rostova",
    author_role: "CEO",
    author_image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2",
    author_bio: "Elena is founder.",
    is_featured: false,
    content: `
      <p class="lead">Summit raised Series B and needed to triple headcount immediately.</p>
      <h2>The Bottleneck: Scheduling</h2>
      <p>The HR team was drowning in calendar invites. Summit turned on Edluar's 'Automated Orchestration'. Candidates self-scheduled based on real-time team availability.</p>
      <h2>The Climb</h2>
      <p>They hired 50 developers in 88 days, reducing 'Time-to-Schedule' by 95%.</p>
    `
  }
];

const runSeed = async () => {
  console.log('🌱 Seeding Knowledge Graph...');
  try {
    await PostRepository.seed(allPosts);
    console.log('✅ Seeding Complete. 10 Articles Inserted.');
  } catch (e) {
    console.error('❌ Seeding Failed:', e);
  }
};

runSeed();
