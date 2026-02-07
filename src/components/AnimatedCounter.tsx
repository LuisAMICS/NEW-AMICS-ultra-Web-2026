import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface AnimatedCounterProps {
  value: string;
  suffix?: string;
  prefix?: string;
  duration?: number;
  className?: string;
}

const AnimatedCounter = ({ 
  value, 
  suffix = '', 
  prefix = '', 
  duration = 2,
  className = '' 
}: AnimatedCounterProps) => {
  const counterRef = useRef<HTMLSpanElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const el = counterRef.current;
    if (!el || hasAnimated) return;

    // Extract numeric value
    const numericValue = parseFloat(value.replace(/[^0-9.]/g, ''));
    const isDecimal = value.includes('.');

    ScrollTrigger.create({
      trigger: el,
      start: 'top 85%',
      onEnter: () => {
        if (hasAnimated) return;
        setHasAnimated(true);

        const obj = { val: 0 };
        gsap.to(obj, {
          val: numericValue,
          duration: duration,
          ease: 'power2.out',
          onUpdate: () => {
            let displayValue: string;
            if (isDecimal) {
              displayValue = obj.val.toFixed(1);
            } else {
              displayValue = Math.round(obj.val).toString();
            }
            el.textContent = prefix + displayValue + suffix;
          }
        });
      }
    });
  }, [value, suffix, prefix, duration, hasAnimated]);

  return (
    <span ref={counterRef} className={className}>
      {prefix}0{suffix}
    </span>
  );
};

export default AnimatedCounter;
