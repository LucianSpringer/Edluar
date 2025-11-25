export interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  content: string; // HTML-like string for the demo
  category: string;
  date: string;
  readTime: string;
  image: string;
  author: {
    name: string;
    role: string;
    image: string;
    bio: string;
  };
  isFeatured?: boolean;
}

export const blogPosts: BlogPost[] = [
  {
    id: 1,
    title: "The Death of the Resume: Why Skills-Based Hiring is the Future",
    excerpt: "Traditional CVs are failing both recruiters and candidates. Here is how focusing on tangible skills creates a more diverse and capable workforce.",
    category: "Hiring Tips",
    date: "Oct 24, 2023",
    readTime: "10 min read",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
    author: {
      name: "Elena Rostova",
      role: "CEO & Founder",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80",
      bio: "Elena is a former HR Director who founded Edluar to bring human connection back to recruitment. She writes about the intersection of empathy and technology."
    },
    isFeatured: true,
    content: `
      <p class="lead">The CV is a relic of the industrial age. It reduces a human being's complex potential into a linear timeline of job titles and universities. In the organic age of recruitment, this just doesn't cut it anymore.</p>

      <h2>The Pedigree Problem</h2>
      <p>For decades, hiring managers have used the resume as a proxy for competence. Went to a top university? Must be smart. Worked at a Big Tech company? Must be skilled. But this approach—pedigree hiring—is fundamentally flawed. It measures privilege and history, not actual capability and future potential.</p>
      
      <p>When we prioritize where someone came from over what they can actually do, we miss out on:</p>
      <ul>
        <li>Self-taught developers who write cleaner code than CS graduates.</li>
        <li>Creative marketers who learned their trade building their own businesses, not in a classroom.</li>
        <li>Resilient leaders who took a non-linear career path.</li>
      </ul>

      <h2>Enter Skills-Based Hiring</h2>
      <p>Skills-based hiring flips the script. Instead of asking "Where did you work?", we ask "What can you do?". By using practical assessments, work sample tests, and AI-driven skill parsing (like Edluar's engine), we can identify talent that traditional filters screen out.</p>

      <blockquote>"We stopped looking at university degrees for our engineering roles. Our retention went up 40%, and the diversity of thought in the room skyrocketed."</blockquote>

      <h2>How to make the shift</h2>
      <p>Transitioning to a skills-first approach doesn't happen overnight. Here is a roadmap to get started:</p>
      <ol>
        <li><strong>Rewrite Job Descriptions:</strong> Focus on outcomes and competencies, not years of experience. Does a Junior Designer really need 3-5 years of experience? Probably not.</li>
        <li><strong>Implement Work Samples:</strong> Ask candidates to solve a real problem they would face in the role. Pay them for their time if it's a lengthy task.</li>
        <li><strong>Structured Interviewing:</strong> Ask every candidate the same questions and score them on specific criteria to reduce affinity bias.</li>
      </ol>

      <h2>The Organic Outcome</h2>
      <p>When you strip away the biases inherent in the resume, you find people who are genuinely passionate and capable. You build teams that are diverse not just in demographics, but in thought and experience. That is the future of work—and it looks a lot more human than a PDF file.</p>
    `
  },
  {
    id: 2,
    title: "How Nimbus Reduced Time-to-Hire by 40%",
    excerpt: "A deep dive into how Nimbus utilized Edluar's AI descriptions to streamline their pipeline.",
    category: "Case Studies",
    date: "Oct 18, 2023",
    readTime: "5 min read",
    image: "https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
    author: {
      name: "Sarah Jenkins",
      role: "Chief People Officer",
      image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80",
      bio: "Sarah is a Psychology PhD passionate about organizational behavior. She specializes in building teams that are resilient, diverse, and psychologically safe."
    },
    content: `
      <p class="lead">Nimbus, a cloud infrastructure startup, was facing a crisis common to high-growth tech companies: they had the budget to hire, but they couldn't get people through the door fast enough.</p>

      <h2>The Bottleneck</h2>
      <p>The problem wasn't a lack of applicants. It was the "black hole" of their hiring pipeline. Hiring managers were taking days to draft job descriptions, and weeks to screen resumes. By the time they reached out to top candidates, those candidates had already accepted offers elsewhere.</p>

      <h2>The Solution: Automated Empathy</h2>
      <p>Nimbus implemented Edluar to tackle two specific areas:</p>
      <ol>
        <li><strong>Instant Job Descriptions:</strong> Using Edluar's Generative AI, managers could input a rough list of requirements and get a polished, inclusive job description in seconds. This reduced the "drafting phase" from 3 days to 3 minutes.</li>
        <li><strong>Automated Nurturing:</strong> Instead of silence, candidates received personalized updates at every stage of the process.</li>
      </ol>

      <h2>The Results</h2>
      <p>The impact was immediate and measurable.</p>
      <ul>
        <li><strong>Time-to-Hire:</strong> Dropped from 45 days to 27 days (40% reduction).</li>
        <li><strong>Candidate Satisfaction:</strong> Net Promoter Score (NPS) for the interview process rose from 12 to 68.</li>
        <li><strong>Manager Satisfaction:</strong> 95% of hiring managers reported feeling "more supported" and "less burdened" by administrative tasks.</li>
      </ul>

      <p>By automating the administrative heavy lifting, Nimbus freed their team to do what humans do best: build relationships.</p>
    `
  },
  {
    id: 3,
    title: "Cultivating Psychological Safety in Remote Teams",
    excerpt: "Remote work requires intentionality. Learn how to build trust without sharing an office.",
    category: "Culture",
    date: "Oct 12, 2023",
    readTime: "8 min read",
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
    author: {
      name: "Marcus Chen",
      role: "Head of Product",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80",
      bio: "Marcus is an architect turned product designer. He believes software structure should feel as natural as a building and writes about product philosophy."
    },
    content: `
      <p class="lead">When you can't see your colleagues' faces across a desk, silence can be deafening. Is my manager angry? Did my joke land? Is my work good enough? In remote teams, the absence of feedback is often interpreted as negativity.</p>

      <h2>What is Psychological Safety?</h2>
      <p>Coined by Harvard professor Amy Edmondson, psychological safety is the belief that you won't be punished or humiliated for speaking up with ideas, questions, concerns, or mistakes. It is the soil in which innovation grows.</p>

      <h2>The Remote Challenge</h2>
      <p>In an office, you see people smile, you hear the tone of voice in the hallway. Remote work strips away these micro-signals. To build safety remotely, you must be aggressively explicit about trust.</p>

      <h3>1. Default to Transparency</h3>
      <p>Keep communication channels open. Avoid private DMs for work discussions; use public channels so everyone has context. This reduces paranoia and gatekeeping.</p>

      <h3>2. The "User Manual" Exercise</h3>
      <p>At Edluar, every new hire writes a "User Manual" of themselves. <em>How do I like to receive feedback? What are my working hours? What stresses me out?</em> Sharing this upfront removes the guesswork from collaboration.</p>

      <h3>3. Blameless Retrospectives</h3>
      <p>When things go wrong (and they will), focus on the <em>process</em>, not the <em>person</em>. Ask "How did our system allow this to happen?" rather than "Who messed up?".</p>

      <h2>Growing Together</h2>
      <p>Psychological safety isn't a policy you write; it's a habit you practice. It requires leaders to be vulnerable first. When a leader says "I don't know" or "I made a mistake," it gives permission for everyone else to be human too.</p>
    `
  },
  {
    id: 4,
    title: "Introducing Edluar 2.0: The Organic Engine",
    excerpt: "See what's new in our latest major release, from dark mode to advanced analytics.",
    category: "Product Updates",
    date: "Sep 29, 2023",
    readTime: "4 min read",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
    author: {
      name: "Elena Rostova",
      role: "CEO & Founder",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80",
      bio: "Elena is a former HR Director who founded Edluar to bring human connection back to recruitment. She writes about the intersection of empathy and technology."
    },
    content: `
      <p class="lead">We built Edluar on the premise that recruitment software should feel natural. Today, we are taking a massive step forward in that mission.</p>

      <h2>Dark Mode (Finally!)</h2>
      <p>You asked, we listened. Recruiters stare at screens for 8+ hours a day. Our new Dark Mode isn't just an inverted color palette; it's a carefully crafted deep-green environment designed to reduce eye strain and look beautiful in low light.</p>

      <h2>The Organic Engine</h2>
      <p>Under the hood, we've rebuilt our matching algorithm. We call it the "Organic Engine". Unlike traditional keyword matchers, it understands semantic context.</p>
      <ul>
        <li>It knows that "React" and "React.js" are the same.</li>
        <li>It understands that a "Product Manager" needs empathy as much as Jira skills.</li>
        <li>It highlights potential, flagging candidates who have transferable skills even if they lack the exact job title.</li>
      </ul>

      <h2>Analytics that Tell a Story</h2>
      <p>Data without context is just noise. Our new dashboards focus on narrative. Instead of just showing "Time to Hire," we show you <em>where</em> the delays are happening and suggest actionable fixes.</p>

      <p>Edluar 2.0 is live today for all users. We can't wait to see what you grow with it.</p>
    `
  },
  {
    id: 5,
    title: "5 Signs Your Interview Process is Broken",
    excerpt: "Are you losing great candidates at the offer stage? Here are the red flags to look for.",
    category: "Hiring Tips",
    date: "Sep 15, 2023",
    readTime: "6 min read",
    image: "https://images.unsplash.com/photo-1573497620053-ea5300f94f21?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
    author: {
      name: "Sarah Jenkins",
      role: "Chief People Officer",
      image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80",
      bio: "Sarah is a Psychology PhD passionate about organizational behavior. She specializes in building teams that are resilient, diverse, and psychologically safe."
    },
    content: `
      <p class="lead">Hiring is a two-way street. While you are evaluating candidates, they are evaluating you. A broken process doesn't just annoy candidates; it actively repels the best ones.</p>

      <h2>1. The "Homework" is Excessive</h2>
      <p>If you're asking candidates to do 10 hours of unpaid work for a take-home assignment, you are signaling that you don't value their time. Keep assessments under 2 hours, or pay them for it.</p>

      <h2>2. You're Ghosting Candidates</h2>
      <p>Silence is not a rejection; it's an insult. If a candidate took the time to apply, they deserve a response, even if it's an automated one. If they interviewed, they deserve personal feedback.</p>

      <h2>3. 7+ Rounds of Interviews</h2>
      <p>If you can't decide after 4 interviews, the problem isn't the candidate—it's your decision-making framework. More interviews rarely lead to better data; they just lead to fatigue.</p>

      <h2>4. The "Culture Fit" Vibe Check</h2>
      <p>"Culture fit" is often code for "people just like us." It breeds homogeneity. Look for "Culture Add"—people who bring something new to your team's DNA.</p>

      <h2>5. Low Offer Acceptance Rate</h2>
      <p>If people are turning down your offers, something is wrong. Is your compensation below market? Did the interview process leave a bad taste? Treat every rejection as a data point to investigate.</p>
    `
  },
  {
    id: 101,
    title: "How Canopy Corp grew their remote team by 200% sustainably",
    excerpt: "Scaling a remote team requires more than just Zoom links. Canopy Corp shares their blueprint for maintaining culture while doubling headcount.",
    category: "Case Studies",
    date: "Oct 28, 2023",
    readTime: "6 min read",
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
    author: {
      name: "Marcus Chen",
      role: "Head of Product",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80",
      bio: "Marcus is an architect turned product designer. He believes software structure should feel as natural as a building and writes about product philosophy."
    },
    content: `
      <p class="lead">Canopy Corp, a sustainable energy provider, faced a massive challenge: they needed to double their engineering team in 6 months to meet grid demand, but they refused to compromise on their tight-knit culture.</p>
      
      <h2>The Challenge: Speed vs. Quality</h2>
      <p>Rapid scaling usually breaks culture. New hires don't get properly onboarded, processes break under the load, and the original mission gets diluted.</p>

      <h2>The Strategy</h2>
      <p>Canopy Corp used Edluar to build a "values-first" hiring funnel.</p>
      
      <h3>1. Automated Screening for Values</h3>
      <p>They configured Edluar to screen not just for Python skills, but for alignment with their mission. Custom screening questions asked candidates to describe a time they prioritized sustainability in their personal lives.</p>

      <h3>2. The Buddy System</h3>
      <p>Every new hire was paired with a "Culture Buddy" from a different department. This wasn't a mentor for work tasks, but a guide for social integration. Edluar's org chart features helped automate these pairings.</p>

      <h3>3. Async-First Documentation</h3>
      <p>To support a global team, they moved from "meetings" to "documents." All decisions were written down. This allowed new hires to self-serve information without feeling like a burden.</p>

      <h2>The Outcome</h2>
      <p>Canopy Corp successfully hired 45 engineers in 6 months. Their employee engagement score actually <em>increased</em> during this period of rapid growth—a rarity in the tech world.</p>
    `
  }
];