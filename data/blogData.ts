export interface BlogPost {
    id: number;
    title: string;
    excerpt: string;
    content: string;
    category: string;
    author: {
        name: string;
        role: string;
        image: string;
        bio: string;
    };
    date: string;
    readTime: string;
    image: string;
}

export const blogPosts: BlogPost[] = [
    {
        id: 1,
        title: "Cultivating top engineering talent from the ground up",
        excerpt: "How Sprout used Edluar to build a world-class engineering team by focusing on potential over pedigree.",
        category: "Case Studies",
        author: {
            name: "Sarah Chen",
            role: "VP of Engineering at Sprout",
            image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
            bio: "Sarah has scaled engineering teams from 5 to 500 at multiple startups. She believes in organic growth and mentorship."
        },
        date: "Nov 15, 2025",
        readTime: "5 min read",
        image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1600&q=80",
        content: `
      <h2>David vs. The Goliaths</h2>
      <p class="lead">We were a seed-stage startup trying to bloom in the shadow of redwoods like Google and Meta. We couldn't match their shade (salaries), so we had to offer better soil (mission and growth).</p>
      <p>Our challenge was attracting senior engineering talent who had their pick of the forest. We knew standard job descriptions and generic promises of "changing the world" would wither on the vine.</p>
      
      <h2>Radical Transparency as Fertilizer</h2>
      <p>We used Edluar to build a <strong>Transparency-First</strong> pipeline. We decided to show candidates the weeds, not just the flowers.</p>
      <ul>
        <li><strong>Real Codebase Challenges:</strong> Using Edluar AI, we generated problem sets based on our <em>actual</em> current engineering blockers. Candidates weren't solving abstract puzzles; they were working on our real mission.</li>
        <li><strong>Open-Source Rubric:</strong> We published our interview scoring criteria. No hidden traps. We wanted candidates to succeed, and we gave them the map.</li>
      </ul>
      
      <blockquote>"Engineers crave honesty. When you show them the thorny problems, the right ones don't run away—they grab their shears."</blockquote>
      
      <h2>Rooting the Founding Team</h2>
      <p>The approach attracted exactly the kind of builders we needed. We hired <strong>12 Founding Engineers in just 6 weeks</strong>. fast-forward to year one, and we have had <strong>zero churn</strong>. By being honest about the climb, we found the climbers who were ready for the ascent.</p>
    `
    },
    {
        id: 2,
        title: "Scaling to the summit: Hiring 50 devs in 3 months",
        excerpt: "A behind-the-scenes look at how Summit achieved hyper-growth without compromising on quality using Edluar's automated workflows.",
        category: "Hiring Tips",
        author: {
            name: "Marcus Rodriguez",
            role: "Head of Talent at Summit",
            image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
            bio: "Marcus specializes in high-velocity recruiting for Series B+ startups. He's passionate about efficiency and candidate experience."
        },
        date: "Nov 10, 2025",
        readTime: "7 min read",
        image: "https://images.unsplash.com/photo-1519681393784-d120267933ba?ixlib=rb-1.2.1&auto=format&fit=crop&w=1600&q=80",
        content: `
      <h2>The Avalanche of Growth</h2>
      <p class="lead">Raising a Series B is like reaching a base camp—the celebration is short because the real climb begins. We needed to triple our headcount immediately, hiring 50 developers in a single quarter.</p>
      <p>Our HR team was buried under an avalanche of logistics. Scheduling interviews manually was like trying to shovel snow with a spoon. We were drowning in calendar invites while talent slipped away.</p>
      
      <h2>Automated Orchestration</h2>
      <p>We activated Edluar's <strong>Automated Orchestration</strong> to clear the path. We needed speed without slipping.</p>
      <ul>
        <li><strong>Self-Scheduling:</strong> We integrated Google Calendar, allowing candidates to book their own slots based on real-time team availability. The friction of "does Tuesday work?" vanished.</li>
        <li><strong>DNA Scoring:</strong> Edluar's AI scored incoming resumes instantly against our "Summit DNA" rubric, highlighting the profiles that matched our altitude and pace.</li>
      </ul>
      
      <blockquote>"You can move fast without breaking things, provided your infrastructure is rooted in solid software. Edluar was our crampons and ropes."</blockquote>
      
      <h2>Reaching the Peak</h2>
      <p>The metrics speak for themselves. We hired <strong>50 developers in 88 days</strong>. We reduced our 'Time-to-Schedule' by a staggering <strong>95%</strong>. We proved that hyper-growth doesn't have to be chaotic; it just needs to be engineered.</p>
    `
    },
    {
        id: 3,
        title: "Flora Fin's organic approach to high-stakes financial hiring",
        excerpt: "In the cutthroat world of fintech, Flora Fin uses Edluar to bring a human touch to hiring, resulting in better cultural alignment.",
        category: "Culture",
        author: {
            name: "Elena Fisher",
            role: "Chief People Officer at Flora Fin",
            image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
            bio: "Elena is redefining HR in finance, moving away from transactional hiring to relationship-based recruitment."
        },
        date: "Nov 05, 2025",
        readTime: "6 min read",
        image: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?ixlib=rb-1.2.1&auto=format&fit=crop&w=1600&q=80",
        content: `
      <h2>The High-Frequency Burnout Trap</h2>
      <p class="lead">In the high-stakes ecosystem of fintech, speed is usually the only metric that matters. But at Flora Fin, we realized that treating humans like high-frequency trading algorithms was yielding diminishing returns.</p>
      <p>Our problem was stark: we are a high-frequency trading firm, and our acceptance rate was a withering 30%. Candidates described our interview process as an "interrogation." They felt dissected, not understood. Burnout was high, and our talent soil was becoming toxic.</p>
      
      <h2>Planting a New Seed with Edluar</h2>
      <p>We turned to Edluar to re-engineer our hiring DNA. We didn't just want to fill seats; we wanted to cultivate a garden of sustainable talent. The solution was two-fold:</p>
      <ul>
        <li><strong>Blind Skill Assessments:</strong> We stripped away the pedigree bias. No more judging a sapling by the prestige of its nursery. We looked at raw coding capability, allowing hidden talent to shine through the canopy.</li>
        <li><strong>Async Culture Videos:</strong> We used Edluar to showcase our softer side. Candidates could see the humans behind the algorithms, understanding that while our code runs fast, our culture runs deep.</li>
      </ul>
      
      <blockquote>"We stopped hiring calculators and started hiring cultivators. The difference in our office climate is palpable."</blockquote>
      
      <h2>A Harvest of Retention</h2>
      <p>The results were nothing short of a super-bloom. Our offer acceptance rate shot up to <strong>85%</strong>. Even more critically, our retention rate climbed by <strong>40%</strong>. By using Edluar to humanize a mechanical process, we proved a vital thesis: even in the coldest financial climates, warmth is the most valuable currency.</p>
    `
    },
    {
        id: 4,
        title: "Keeping candidate relationships fresh with automated nurturing",
        excerpt: "How Evergreen uses Edluar's CRM features to maintain a warm pool of talent, reducing time-to-hire by 50%.",
        category: "Product Updates",
        author: {
            name: "David Park",
            role: "Recruiting Manager at Evergreen",
            image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
            bio: "David is a recruitment operations geek who loves building systems that work for people, not against them."
        },
        date: "Oct 28, 2025",
        readTime: "4 min read",
        image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?ixlib=rb-1.2.1&auto=format&fit=crop&w=1600&q=80",
        content: `
      <h2>The Dormant Database Dilemma</h2>
      <p class="lead">Imagine a forest where 90% of the trees are ignored until you need wood. That was our candidate database. We had 50,000 profiles, but they were effectively dead leaves on the ground.</p>
      <p>Our recruiters were operating in transactional bursts—only calling when they had a specific role to fill. It felt extractive, not collaborative. We were burning bridges before we even crossed them.</p>
      
      <h2>Watering the Roots with Nurture Streams</h2>
      <p>We implemented Edluar's <strong>Nurture Streams</strong> to change the weather. Instead of cold calls, we set up automated, personalized ecosystems of communication.</p>
      <p>Every three months, candidates received a check-in. Not a sales pitch, but a genuine inquiry into their career growth and goals. It was like a gentle rain rather than a firehose.</p>
      <ul>
        <li><strong>Automated Consistency:</strong> The system never forgot a birthday or a work anniversary.</li>
        <li><strong>Value-First Content:</strong> We shared industry insights, not just job reqs.</li>
      </ul>
      
      <blockquote>"Automation didn't replace our connection; it reminded us to connect. It turned our database from a graveyard into a garden."</blockquote>
      
      <h2>The Season of Plenty</h2>
      <p>When harvest time came—Q4—the difference was undeniable. Because the soil was warm and moist, our response rates tripled. We placed <strong>200 candidates</strong> directly from our previously 'dormant' pool. We learned that in recruitment, as in nature, you cannot harvest what you do not water.</p>
    `
    }
];
