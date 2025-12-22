'use client';

import { useState, useEffect, useRef } from 'react';

type TocItem = {
  id: string;
  text: string;
  level: number;
};

type TocProps = {
  headings: TocItem[];
};

const Toc = ({ headings }: TocProps) => {
  const [activeId, setActiveId] = useState<string>('');
  const observer = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const handleObserver = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry?.isIntersecting) {
          setActiveId(entry.target.getAttribute('id') || '');
        }
      });
    };

    observer.current = new IntersectionObserver(handleObserver, {
      rootMargin: '-20% 0% -80% 0px', // 调整阈值以更好地检测活动标题
    });

    const headingElements = headings.map(heading => 
      document.getElementById(heading.id)
    ).filter(Boolean) as HTMLElement[];

    headingElements.forEach(element => {
      observer.current?.observe(element);
    });

    return () => {
      headingElements.forEach(element => {
        observer.current?.unobserve(element);
      });
    };
  }, [headings]);

  if (headings.length === 0) {
    return null; // 如果没有标题，则不显示目录
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 h-fit sticky top-6">
      <h3 className="font-bold text-gray-800 dark:text-white mb-4">文章目录</h3>
      <nav>
        <ul className="space-y-2">
          {headings.map((heading) => (
            <li key={heading.id} style={{ paddingLeft: `${(heading.level - 2) * 16}px` }}>
              <a
                href={`#${heading.id}`}
                className={`block py-1 text-sm transition-colors ${
                  activeId === heading.id
                    ? 'text-blue-600 dark:text-blue-400 font-medium'
                    : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  const element = document.getElementById(heading.id);
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                    window.location.hash = heading.id;
                  }
                }}
              >
                {heading.text}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Toc;