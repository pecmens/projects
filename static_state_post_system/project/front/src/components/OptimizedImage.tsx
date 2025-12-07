import Image from 'next/image';
import type { ImageProps } from 'next/image';

// 扩展Next.js的Image组件，提供默认配置
const OptimizedImage = ({ src, alt, width, height, ...props }: ImageProps) => {
  // 如果没有指定宽高，提供默认值以避免布局偏移
  const defaultWidth = width || 800;
  const defaultHeight = height || 600;

  return (
    <Image
      src={src}
      alt={alt}
      width={defaultWidth}
      height={defaultHeight}
      {...props}
      // 优化加载策略
      loading={props.loading || 'lazy'}
      // 优化优先级，对于首屏内容可以设置为eager
      priority={props.priority || false}
      // 优化质量
      quality={props.quality || 75}
      // 响应式图片支持
      sizes={props.sizes || '100vw'}
    />
  );
};

export default OptimizedImage;