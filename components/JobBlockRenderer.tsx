import React from 'react';
import { ContentBlock } from './ContentBuilder';
import { MapPin, Briefcase, ArrowRight } from 'lucide-react';

interface Job {
    id: number;
    title: string;
    location: string;
    employment_type: string;
    department: string;
    content_blocks: string | null;
}

interface ThemeConfig {
    font: string;
    primaryColor: string;
    bg: string;
    buttonShape?: string;
}

interface JobBlockRendererProps {
    blocks: ContentBlock[];
    jobs?: Job[];
    onJobClick?: (job: Job) => void;
    theme?: ThemeConfig;
}

const RenderHeroCollage = ({ block }: { block: ContentBlock }) => {
    const images = block.images || [];
    return (
        <div
            className="relative min-h-[500px] md:min-h-[600px] flex items-center justify-center overflow-hidden py-12 md:py-20"
            style={{ backgroundColor: block.bgColor || '#FDFBF7' }}
        >
            {/* Central Text */}
            <div className="relative z-10 text-center max-w-3xl px-4">
                <h1
                    className="text-5xl md:text-8xl font-serif font-black text-edluar-dark dark:text-edluar-cream mb-4 md:mb-6 leading-tight tracking-tight"
                    style={{ color: block.titleColor }}
                >
                    {block.value}
                </h1>
                <p
                    className="text-lg md:text-2xl text-edluar-dark/60 dark:text-edluar-cream/60 font-light"
                    style={{ color: block.subtitleColor }}
                >
                    {block.subtitle}
                </p>
            </div>

            {/* Floating Images (Absolute Positioning with rotation) */}
            <div className="absolute inset-0 pointer-events-none opacity-50 md:opacity-100 hidden md:block">
                {/* Top Left */}
                {images[0] && <img src={images[0]} className="absolute top-10 left-[5%] w-64 h-48 object-cover rounded-2xl shadow-xl -rotate-6 hover:rotate-0 transition-all duration-500" />}

                {/* Bottom Right */}
                {images[1] && <img src={images[1]} className="absolute bottom-20 right-[10%] w-56 h-64 object-cover rounded-2xl shadow-xl rotate-3 hover:rotate-0 transition-all duration-500" />}

                {/* Top Right (Small) */}
                {images[2] && <img src={images[2]} className="absolute top-20 right-[15%] w-40 h-40 object-cover rounded-full shadow-lg rotate-12 hover:rotate-0 transition-all duration-500" />}

                {/* Bottom Left */}
                {images[3] && <img src={images[3]} className="absolute bottom-10 left-[15%] w-72 h-56 object-cover rounded-2xl shadow-xl -rotate-3 hover:rotate-0 transition-all duration-500" />}
            </div>
        </div>
    );
};

const RenderBentoGrid = ({ block }: { block: ContentBlock }) => {
    const items = block.bentoItems || [];

    return (
        <div className="max-w-7xl mx-auto px-4 py-12 md:py-16">
            <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-2 gap-4 h-auto md:h-[600px]">
                {items.map((item, i) => {
                    // 1. Determine Wrapper: Use <a> if it's a link, otherwise <div>
                    const Wrapper = item.type === 'link' || (item.type === 'social' && item.content?.startsWith('http')) ? 'a' : 'div';
                    const wrapperProps = Wrapper === 'a' ? { href: item.content, target: '_blank', rel: 'noopener noreferrer' } : {};

                    return (
                        // @ts-ignore
                        <Wrapper
                            key={i}
                            {...wrapperProps}
                            className={`relative rounded-3xl overflow-hidden p-5 md:p-6 group transition-all hover:scale-[1.02] cursor-pointer
                 ${i === 0 ? 'md:col-span-2 md:row-span-2' : ''} 
                 ${i === 3 ? 'md:col-span-2' : ''}
                 ${item.type === 'stat' ? 'bg-edluar-moss text-white flex flex-col justify-center items-center' : 'bg-gray-100'}
               `}
                            style={{
                                backgroundColor: item.type !== 'stat' && item.type !== 'image' ? item.color : undefined,
                                color: item.textColor
                            }}
                        >
                            {/* --- TYPE: IMAGE --- */}
                            {item.type === 'image' && (
                                <>
                                    {item.content && <img src={item.content} className="absolute inset-0 w-full h-full object-cover" alt={item.title} />}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-6">
                                        <h3 className="text-white font-bold text-xl leading-tight">{item.title}</h3>
                                        {/* FIX: Show Subtitle for Image */}
                                        {item.subtitle && <p className="text-white/80 text-sm mt-1">{item.subtitle}</p>}
                                    </div>
                                </>
                            )}

                            {/* --- TYPE: STAT --- */}
                            {item.type === 'stat' && (
                                <>
                                    <span className="text-4xl md:text-6xl font-black">{item.content}</span>
                                    <span className="uppercase tracking-widest text-xs md:text-sm font-bold opacity-80 mt-2">{item.title}</span>
                                    {/* FIX: Show Subtitle for Stat */}
                                    {item.subtitle && <p className="text-white/60 text-xs mt-1">{item.subtitle}</p>}
                                </>
                            )}

                            {/* --- TYPE: SOCIAL --- */}
                            {item.type === 'social' && (
                                <div className="flex flex-col items-center justify-center h-full text-center">
                                    <div className="w-12 h-12 bg-black/10 rounded-full flex items-center justify-center text-gray-700 mb-3">
                                        <span className="font-bold text-lg">@</span>
                                    </div>
                                    <h3 className="font-bold text-lg">{item.title}</h3>
                                    <p className="text-sm text-gray-500">{item.content}</p>
                                    {/* FIX: Show Subtitle for Social */}
                                    {item.subtitle && <p className="text-xs text-gray-400 mt-2 uppercase tracking-wide">{item.subtitle}</p>}
                                </div>
                            )}

                            {/* --- TYPE: LINK (Default) --- */}
                            {(!item.type || item.type === 'link') && (
                                <div className="h-full flex flex-col justify-between relative z-10">
                                    <div>
                                        <h3 className="font-bold text-xl md:text-2xl mb-1">{item.title}</h3>
                                        {/* FIX: Show Subtitle for Link */}
                                        {item.subtitle && <p className="text-gray-500 font-medium text-sm md:text-base">{item.subtitle}</p>}
                                    </div>
                                    <div className="flex items-center text-sm font-bold mt-4 group-hover:underline">
                                        Read more <ArrowRight className="w-4 h-4 ml-1" />
                                    </div>
                                </div>
                            )}
                        </Wrapper>
                    );
                })}
            </div>
        </div>
    );
};

const RenderGallery = ({ block }: { block: ContentBlock }) => (
    <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
            {block.images?.map((img, i) => (
                <div key={i} className={`rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all ${i % 3 === 0 ? 'col-span-2 row-span-2' : ''}`}>
                    <img src={img} className="w-full h-full object-cover min-h-[150px] md:min-h-[200px]" />
                </div>
            ))}
        </div>
    </div>
);

const RenderSteps = ({ block }: { block: ContentBlock }) => (
    <div className="max-w-4xl mx-auto px-4 py-8 md:py-12">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 md:mb-10">Hiring Process</h2>
        <div className="space-y-6 md:space-y-8">
            {block.steps?.map((step, i) => (
                <div key={i} className="flex gap-4 md:gap-6 items-start">
                    <div
                        className="flex-shrink-0 w-8 h-8 md:w-10 md:h-10 rounded-full text-white flex items-center justify-center font-bold text-sm md:text-base"
                        style={{ backgroundColor: 'var(--brand-color)' }}
                    >
                        {i + 1}
                    </div>
                    <div>
                        <h3 className="text-lg md:text-xl font-bold" style={{ color: step.textColor }}>{step.title}</h3>
                        <p className="text-sm md:text-base text-gray-500 mt-1" style={{ color: step.textColor, opacity: step.textColor ? 0.8 : 1 }}>{step.description}</p>
                    </div>
                </div>
            ))}
        </div>
    </div>
);

export const JobBlockRenderer: React.FC<JobBlockRendererProps> = ({ blocks, jobs, onJobClick, theme }) => {
    if (!blocks || blocks.length === 0) return null;

    const primaryColor = theme?.primaryColor || '#10B981';
    const font = theme?.font || 'Inter';

    const containerStyle = {
        fontFamily: font,
        '--brand-color': primaryColor,
    } as React.CSSProperties;

    return (
        <div className="space-y-0 text-edluar-dark dark:text-edluar-cream" style={containerStyle}>
            {blocks.map((block) => {
                const content = (() => {
                    switch (block.type) {
                        case 'header':
                            const isDisplay = block.variant === 'display';
                            return (
                                <div className="text-center px-4">
                                    <h2
                                        className={`
                                            ${isDisplay ? 'text-5xl md:text-9xl font-black tracking-tighter leading-[0.9] uppercase py-8 md:py-12' : 'text-2xl md:text-3xl font-bold mt-6 md:mt-8 mb-3 md:mb-4'}
                                            text-edluar-dark dark:text-edluar-cream
                                        `}
                                        style={{ fontFamily: block.font, color: block.textColor }}
                                    >
                                        {block.value}
                                    </h2>
                                </div>
                            );
                        case 'paragraph':
                            return (
                                <p className="text-base md:text-lg leading-relaxed opacity-90 whitespace-pre-wrap max-w-4xl mx-auto px-4 py-3 md:py-4">
                                    {block.value}
                                </p>
                            );
                        case 'list':
                            return (
                                <ul className="list-disc list-inside space-y-2 ml-4 max-w-4xl mx-auto px-4 py-3 md:py-4">
                                    {block.items?.map((item, idx) => (
                                        <li key={idx} className="text-base md:text-lg opacity-90">{item}</li>
                                    ))}
                                </ul>
                            );
                        case 'image':
                            if (!block.src) return null;
                            return (
                                <div className="my-6 md:my-8 max-w-6xl mx-auto px-4">
                                    <img
                                        src={block.src}
                                        alt="Content"
                                        className="w-full rounded-xl shadow-lg border border-gray-100 dark:border-white/10"
                                        loading="lazy"
                                    />
                                </div>
                            );
                        case 'hero':
                            return (
                                <div className="py-12 md:py-20 text-center px-4">
                                    <h1 className="text-4xl md:text-7xl font-serif font-bold mb-4 md:mb-6" style={{ color: block.titleColor, fontFamily: block.font }}>{block.value}</h1>
                                    <p className="text-lg md:text-2xl opacity-70 max-w-3xl mx-auto mb-8 md:mb-10" style={{ color: block.subtitleColor }}>{block.subtitle}</p>
                                    {block.ctaText && (
                                        <a
                                            href={block.ctaLink || '#'}
                                            className={`inline-block px-6 py-3 md:px-8 md:py-4 text-sm md:text-base text-white font-bold hover:opacity-90 transition-colors ${theme?.buttonShape || 'rounded-lg'}`}
                                            style={{ backgroundColor: 'var(--brand-color)' }}
                                        >
                                            {block.ctaText}
                                        </a>
                                    )}
                                </div>
                            );
                        case 'hero_collage':
                            return <RenderHeroCollage block={block} />;
                        case 'bento_grid':
                            return <RenderBentoGrid block={block} />;
                        case 'features':
                            return (
                                <div className="grid md:grid-cols-3 gap-6 md:gap-8 py-8 md:py-12 max-w-7xl mx-auto px-4">
                                    {block.features?.map((feature, idx) => (
                                        <div key={idx} className="p-5 md:p-6 bg-white dark:bg-white/5 rounded-xl border border-gray-100 dark:border-white/10">
                                            <h4 className="text-lg md:text-xl font-bold mb-2 md:mb-3" style={{ color: feature.textColor }}>{feature.title}</h4>
                                            <p className="opacity-70 text-sm md:text-base" style={{ color: feature.textColor, opacity: feature.textColor ? 0.8 : 0.7 }}>{feature.description}</p>
                                        </div>
                                    ))}
                                </div>
                            );
                        case 'steps':
                            return <RenderSteps block={block} />;
                        case 'gallery':
                            return <RenderGallery block={block} />;
                        case 'job_list':
                            return (
                                <div className="py-8 md:py-12 max-w-7xl mx-auto px-4">
                                    <div className="grid gap-4 md:gap-6 md:grid-cols-2 lg:grid-cols-3">
                                        {jobs?.map((job) => (
                                            <div
                                                key={job.id}
                                                onClick={() => onJobClick?.(job)}
                                                className="group bg-white dark:bg-white/5 rounded-2xl p-5 md:p-6 border border-gray-100 dark:border-white/10 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                                            >
                                                <div className="flex justify-between items-start mb-4">
                                                    <div className="p-3 bg-edluar-moss/10 rounded-xl text-edluar-moss group-hover:scale-110 transition-transform">
                                                        <Briefcase className="w-5 h-5 md:w-6 md:h-6" />
                                                    </div>
                                                    <span className="px-3 py-1 bg-gray-100 dark:bg-white/10 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-wider opacity-70">
                                                        {job.employment_type}
                                                    </span>
                                                </div>

                                                <h3 className="text-lg md:text-xl font-bold mb-2 group-hover:text-edluar-moss transition-colors">{job.title}</h3>

                                                <div className="flex items-center gap-4 text-xs md:text-sm opacity-60 mb-6">
                                                    <span className="flex items-center gap-1">
                                                        <MapPin className="w-3 h-3 md:w-4 md:h-4" /> {job.location}
                                                    </span>
                                                    <span>•</span>
                                                    <span>{job.department}</span>
                                                </div>

                                                <div className="flex items-center text-edluar-moss font-bold text-xs md:text-sm group-hover:translate-x-2 transition-transform">
                                                    View Role <ArrowRight className="w-3 h-3 md:w-4 md:h-4 ml-1" />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    {(!jobs || jobs.length === 0) && (
                                        <div className="text-center py-12 opacity-50">
                                            <p>No open positions at the moment.</p>
                                        </div>
                                    )}
                                    {block.ctaText && (
                                        <a
                                            href={block.ctaLink || '#'}
                                            className={`inline-block px-6 py-3 md:px-8 md:py-4 text-sm md:text-base text-white font-bold hover:opacity-90 transition-colors ${theme?.buttonShape || 'rounded-lg'}`}
                                            style={{ backgroundColor: 'var(--brand-color)' }}
                                        >
                                            {block.ctaText}
                                        </a>
                                    )}
                                </div>
                            );
                        default:
                            return null;
                    }
                })();

                if (!content) return null;

                return (
                    <div key={block.id} style={{ backgroundColor: block.bgColor || 'transparent', color: block.textColor, fontFamily: block.font }}>
                        {content}
                    </div>
                );
            })}
        </div>
    );
};
