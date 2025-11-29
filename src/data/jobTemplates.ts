export const JOB_TEMPLATES: Record<string, string> = {
    "Designer": `
        <p>We are looking for a creative <strong>Product Designer</strong> to join our team. You will be responsible for defining the user experience and visual design of our products.</p>
        <h3>Responsibilities</h3>
        <ul>
            <li>Design intuitive and beautiful user interfaces.</li>
            <li>Collaborate with product managers and engineers.</li>
            <li>Conduct user research and usability testing.</li>
            <li>Create wireframes, prototypes, and high-fidelity mockups.</li>
        </ul>
        <h3>Requirements</h3>
        <ul>
            <li>3+ years of experience in product design.</li>
            <li>Proficiency in Figma, Sketch, or Adobe XD.</li>
            <li>Strong portfolio showcasing your design process.</li>
            <li>Excellent communication and teamwork skills.</li>
        </ul>
    `,
    "Manager": `
        <p>We are seeking an experienced <strong>Product Manager</strong> to lead our product development efforts. You will define the product strategy and roadmap.</p>
        <h3>Responsibilities</h3>
        <ul>
            <li>Define product vision, strategy, and roadmap.</li>
            <li>Gather and prioritize product requirements.</li>
            <li>Work closely with engineering, design, and marketing teams.</li>
            <li>Analyze market trends and competitor landscape.</li>
        </ul>
        <h3>Requirements</h3>
        <ul>
            <li>5+ years of experience in product management.</li>
            <li>Proven track record of shipping successful products.</li>
            <li>Strong analytical and problem-solving skills.</li>
            <li>Excellent leadership and communication abilities.</li>
        </ul>
    `,
    "Engineer": `
        <p>We are hiring a skilled <strong>Software Engineer</strong> to build scalable and robust applications. You will work on the full software development lifecycle.</p>
        <h3>Responsibilities</h3>
        <ul>
            <li>Write clean, maintainable, and efficient code.</li>
            <li>Design and implement new features and APIs.</li>
            <li>Troubleshoot and debug production issues.</li>
            <li>Participate in code reviews and technical discussions.</li>
        </ul>
        <h3>Requirements</h3>
        <ul>
            <li>Bachelor's degree in Computer Science or related field.</li>
            <li>Proficiency in JavaScript/TypeScript, Python, or Go.</li>
            <li>Experience with React, Node.js, and SQL/NoSQL databases.</li>
            <li>Familiarity with cloud platforms (AWS, GCP, Azure).</li>
        </ul>
    `,
    "Sales": `
        <p>We are looking for a motivated <strong>Sales Executive</strong> to drive revenue growth. You will identify new business opportunities and build relationships with clients.</p>
        <h3>Responsibilities</h3>
        <ul>
            <li>Identify and qualify potential leads.</li>
            <li>Conduct product demonstrations and presentations.</li>
            <li>Negotiate contracts and close deals.</li>
            <li>Maintain strong relationships with existing clients.</li>
        </ul>
        <h3>Requirements</h3>
        <ul>
            <li>2+ years of experience in B2B sales.</li>
            <li>Strong negotiation and closing skills.</li>
            <li>Excellent communication and interpersonal skills.</li>
            <li>Self-motivated and results-oriented.</li>
        </ul>
    `,
    "Marketing": `
        <p>We are seeking a creative <strong>Marketing Specialist</strong> to execute our marketing campaigns. You will be responsible for increasing brand awareness and driving traffic.</p>
        <h3>Responsibilities</h3>
        <ul>
            <li>Develop and implement marketing strategies.</li>
            <li>Manage social media accounts and content calendar.</li>
            <li>Create engaging content for blog, email, and ads.</li>
            <li>Analyze campaign performance and optimize results.</li>
        </ul>
        <h3>Requirements</h3>
        <ul>
            <li>Bachelor's degree in Marketing or related field.</li>
            <li>Experience with social media marketing and SEO/SEM.</li>
            <li>Strong writing and content creation skills.</li>
            <li>Familiarity with analytics tools (Google Analytics).</li>
        </ul>
    `
};

export const findTemplate = (title: string): { keyword: string, content: string } | null => {
    const lowerTitle = title.toLowerCase();
    for (const keyword of Object.keys(JOB_TEMPLATES)) {
        if (lowerTitle.includes(keyword.toLowerCase())) {
            return { keyword, content: JOB_TEMPLATES[keyword] };
        }
    }
    return null;
};
