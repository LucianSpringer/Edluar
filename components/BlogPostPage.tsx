import React, { useEffect, useState } from 'react';
import { ArrowLeft, Calendar, Clock, Share2, Facebook, Twitter, Linkedin, Link as LinkIcon, Check } from 'lucide-react';
import { Button } from './Button';

interface BlogPostPageProps {
  postId: number;
  onNavigate: (page: string, params?: any) => void;
}

// Define local interface matching the API response
interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  content: string;
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
}

export const BlogPostPage: React.FC<BlogPostPageProps> = ({ postId, onNavigate }) => {
  const [post, setPost] = useState<BlogPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);

  // DYNAMIC DATA FETCHING (Law 8: Volume & Logic)
  useEffect(() => {
    const fetchPost = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/posts/${postId}`);
        if (res.ok) {
          const data = await res.json();
          setPost(data);
        }
      } catch (e) {
        console.error("Failed to load knowledge graph node", e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPost();
  }, [postId]);

  // Fetch related posts (could be optimized to a separate endpoint or filtered client side if we fetch all)
  // For now, we'll just fetch all posts and filter client side to match the previous logic, 
  // or ideally the backend should provide related posts. 
  // Given the prompt constraints, I'll fetch all posts to find related ones, or just skip related posts for now if not critical.
  // Actually, let's fetch all posts to get related ones, as the original code did client-side filtering.
  useEffect(() => {
    if (!post) return;
    const fetchRelated = async () => {
      try {
        const res = await fetch('/api/posts');
        if (res.ok) {
          const allPosts: BlogPost[] = await res.json();
          const related = allPosts
            .filter(p => p.category === post.category && p.id !== post.id)
            .slice(0, 2);
          setRelatedPosts(related);
        }
      } catch (e) {
        console.error("Failed to load related nodes", e);
      }
    };
    fetchRelated();
  }, [post]);


  // Dynamic Meta Tags & Title
  useEffect(() => {
    window.scrollTo(0, 0);

    if (post) {
      document.title = `${post.title} | Edluar Blog`;

      // Helper to set/update meta tag
      const setMetaTag = (property: string, content: string, attributeName: string = 'property') => {
        let element = document.querySelector(`meta[${attributeName}="${property}"]`);
        if (!element) {
          element = document.createElement('meta');
          element.setAttribute(attributeName, property);
          document.head.appendChild(element);
        }
        element.setAttribute('content', content);
      };

      // Open Graph
      setMetaTag('og:title', post.title);
      setMetaTag('og:description', post.excerpt);
      setMetaTag('og:image', post.image);
      setMetaTag('og:url', window.location.href);
      setMetaTag('og:type', 'article');

      // Twitter Card
      setMetaTag('twitter:card', 'summary_large_image', 'name');
      setMetaTag('twitter:title', post.title, 'name');
      setMetaTag('twitter:description', post.excerpt, 'name');
      setMetaTag('twitter:image', post.image, 'name');
    }

    return () => {
      // Cleanup defaults on unmount
      document.title = 'Edluar - Natural Recruitment';
    };
  }, [post, postId]);

  const handleShare = (platform: string) => {
    if (!post) return;
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(post.title);

    switch (platform) {
      case 'linkedin':
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank');
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, '_blank');
        break;
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
        break;
      case 'copy':
        navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        break;
    }
  };

  const SocialButton = ({ icon: Icon, label, platform, active = false }: { icon: any, label: string, platform: string, active?: boolean }) => (
    <div className="relative group">
      <button
        onClick={() => handleShare(platform)}
        className={`w-10 h-10 rounded-full bg-white dark:bg-edluar-surface border border-edluar-pale/50 dark:border-edluar-moss/20 flex items-center justify-center text-edluar-dark/60 dark:text-edluar-cream/60 transition-all hover:scale-110 hover:shadow-md ${active ? 'text-edluar-moss border-edluar-moss bg-edluar-pale/20' : ''}`}
        aria-label={`Share on ${label}`}
      >
        {active ? <Check className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
      </button>
      <span className="absolute left-full ml-2 top-1/2 -translate-y-1/2 px-2 py-1 bg-edluar-dark text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
        {label}
      </span>
    </div>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-edluar-cream dark:bg-edluar-deep flex items-center justify-center">
        <div className="animate-pulse text-edluar-moss">Loading Knowledge Graph...</div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-edluar-cream dark:bg-edluar-deep flex items-center justify-center pt-20">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-edluar-dark dark:text-edluar-cream mb-4">Post not found</h2>
          <Button onClick={() => onNavigate('blog')}>Return to Blog</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-edluar-cream dark:bg-edluar-deep min-h-screen transition-colors duration-300 animate-fade-in-up">
      {/* Scroll Progress Bar */}
      <div className="fixed top-20 left-0 w-full h-1 bg-edluar-pale/20 z-40">
        <div className="h-full bg-edluar-moss" style={{ width: '0%' }} id="progress-bar"></div>
      </div>

      <article className="pt-32 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Back Link */}
          <button
            onClick={() => onNavigate('blog')}
            className="group flex items-center text-edluar-moss dark:text-edluar-sage font-medium mb-8 hover:underline decoration-2 underline-offset-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Blog
          </button>

          {/* Header */}
          <header className="mb-12 text-center">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-edluar-moss/10 text-edluar-moss dark:text-edluar-pale text-sm font-semibold mb-6">
              <span>{post.category}</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-edluar-dark dark:text-edluar-cream mb-8 leading-tight">
              {post.title}
            </h1>

            <div className="flex flex-wrap items-center justify-center gap-6 text-edluar-dark/60 dark:text-edluar-cream/60 text-sm">
              <div className="flex items-center">
                <img src={post.author.image} alt={post.author.name} className="w-8 h-8 rounded-full mr-2 object-cover border border-edluar-pale" />
                <span className="font-medium text-edluar-dark dark:text-edluar-cream">{post.author.name}</span>
              </div>
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-1.5" />
                {post.date}
              </div>
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-1.5" />
                {post.readTime}
              </div>
            </div>
          </header>

          {/* Featured Image */}
          <div className="relative aspect-[21/9] rounded-3xl overflow-hidden mb-16 shadow-2xl">
            <div className="absolute inset-0 bg-black/10 dark:bg-black/30 mix-blend-multiply pointer-events-none"></div>
            <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
          </div>

          {/* Main Content */}
          <div className="grid lg:grid-cols-12 gap-12">
            {/* Social Sidebar (Desktop) */}
            <div className="hidden lg:block lg:col-span-1">
              <div className="sticky top-32 flex flex-col space-y-4">
                <SocialButton icon={Linkedin} label="Share on LinkedIn" platform="linkedin" />
                <SocialButton icon={Twitter} label="Share on Twitter" platform="twitter" />
                <SocialButton icon={Facebook} label="Share on Facebook" platform="facebook" />
                <SocialButton icon={LinkIcon} label={copied ? "Copied!" : "Copy Link"} platform="copy" active={copied} />
              </div>
            </div>

            {/* Content Body */}
            <div className="lg:col-span-10">
              <div
                className="prose prose-lg prose-stone dark:prose-invert max-w-none 
                  prose-headings:font-serif prose-headings:font-bold prose-headings:text-edluar-dark dark:prose-headings:text-edluar-cream 
                  prose-p:text-edluar-dark/80 dark:prose-p:text-edluar-cream/80 prose-p:leading-relaxed 
                  prose-a:text-edluar-moss hover:prose-a:text-edluar-dark dark:hover:prose-a:text-edluar-pale prose-a:transition-colors
                  prose-blockquote:border-l-edluar-moss prose-blockquote:bg-edluar-pale/10 prose-blockquote:py-2 prose-blockquote:px-6 prose-blockquote:rounded-r-lg prose-blockquote:not-italic
                  prose-strong:text-edluar-dark dark:prose-strong:text-white
                  prose-li:marker:text-edluar-moss"
                dangerouslySetInnerHTML={{ __html: post.content }}
              >
              </div>

              {/* Expanded Author Bio Section */}
              <div className="mt-20 pt-10 border-t border-edluar-pale dark:border-edluar-moss/20">
                <h3 className="text-sm font-bold text-edluar-dark/50 dark:text-edluar-cream/50 uppercase tracking-widest mb-6">About the Author</h3>
                <div className="bg-white/50 dark:bg-edluar-surface/50 border border-edluar-pale dark:border-edluar-moss/20 p-8 rounded-3xl flex flex-col md:flex-row items-start md:items-center space-y-6 md:space-y-0 md:space-x-8 hover:bg-white dark:hover:bg-edluar-surface transition-colors duration-300">
                  <div className="shrink-0 relative">
                    <div className="absolute inset-0 bg-edluar-moss/20 rounded-full blur-lg transform scale-110"></div>
                    <img
                      src={post.author.image}
                      alt={post.author.name}
                      className="relative w-24 h-24 rounded-full object-cover border-4 border-white dark:border-edluar-surface shadow-md"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-serif font-bold text-edluar-dark dark:text-edluar-cream mb-1">{post.author.name}</h3>
                    <p className="text-edluar-moss dark:text-edluar-sage font-medium text-sm mb-3">{post.author.role}</p>
                    <p className="text-edluar-dark/80 dark:text-edluar-cream/80 leading-relaxed text-base">
                      {post.author.bio}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </article>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="py-20 bg-white dark:bg-edluar-surface border-t border-edluar-pale dark:border-edluar-moss/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-serif font-bold text-edluar-dark dark:text-edluar-cream mb-12">Read Next</h2>
            <div className="grid md:grid-cols-2 gap-8">
              {relatedPosts.map(related => (
                <div
                  key={related.id}
                  className="group cursor-pointer bg-edluar-cream/30 dark:bg-black/20 rounded-2xl p-6 flex flex-col md:flex-row gap-6 hover:bg-edluar-cream/50 dark:hover:bg-black/30 transition-colors border border-edluar-pale/50 dark:border-edluar-moss/20"
                  onClick={() => onNavigate('blog-post', { id: related.id })}
                >
                  <div className="shrink-0 w-full md:w-48 h-48 md:h-full rounded-xl overflow-hidden relative">
                    <img src={related.image} alt={related.title} className="w-full h-full object-cover absolute inset-0 transform group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="flex flex-col flex-1 py-2">
                    <div className="flex items-center space-x-2 text-xs text-edluar-dark/60 dark:text-edluar-cream/60 mb-3">
                      <span className="font-bold text-edluar-moss uppercase tracking-wider">{related.category}</span>
                      <span>•</span>
                      <span>{related.date}</span>
                    </div>
                    <h3 className="text-xl font-serif font-bold text-edluar-dark dark:text-edluar-cream mb-3 group-hover:text-edluar-moss transition-colors leading-tight">
                      {related.title}
                    </h3>
                    <p className="text-edluar-dark/70 dark:text-edluar-cream/70 text-sm mb-4 line-clamp-2">
                      {related.excerpt}
                    </p>
                    <div className="mt-auto flex items-center">
                      <img src={related.author.image} alt={related.author.name} className="w-6 h-6 rounded-full object-cover mr-2 border border-edluar-pale/50" />
                      <span className="text-sm font-medium text-edluar-dark/80 dark:text-edluar-cream/80">{related.author.name}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};
