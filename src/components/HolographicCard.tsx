import { useRef, useState } from 'react';
import type { LucideIcon } from 'lucide-react';

interface HolographicCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  index: number;
}

const HolographicCard = ({ icon: Icon, title, description, index }: HolographicCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState({ rotateX: 0, rotateY: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -15;
    const rotateY = ((x - centerX) / centerX) * 15;

    setTransform({ rotateX, rotateY });
  };

  const handleMouseLeave = () => {
    setTransform({ rotateX: 0, rotateY: 0 });
    setIsHovered(false);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const colors = [
    'from-[#2E6EFF] to-[#00F0FF]',
    'from-[#00F0FF] to-[#B829DD]',
    'from-[#B829DD] to-[#FF2E8C]',
    'from-[#FF2E8C] to-[#2E6EFF]',
  ];

  return (
    <div
      ref={cardRef}
      className="relative group perspective-container"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
      style={{ perspective: '1000px' }}
    >
      <div
        className={`tilt-card relative p-8 rounded-3xl transition-all duration-200 ${isHovered ? 'glass-strong' : 'glass'
          }`}
        style={{
          transform: `rotateX(${transform.rotateX}deg) rotateY(${transform.rotateY}deg)`,
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Holographic shine effect */}
        <div
          className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{
            background: `linear-gradient(
              ${135 + transform.rotateY * 2}deg,
              transparent 40%,
              rgba(46, 110, 255, 0.1) 50%,
              transparent 60%
            )`,
          }}
        />

        {/* Neon border glow */}
        <div
          className={`absolute -inset-[1px] rounded-3xl bg-gradient-to-r ${colors[index % colors.length]} opacity-0 group-hover:opacity-50 transition-opacity duration-500 blur-sm -z-10`}
        />

        {/* Icon */}
        <div
          className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${colors[index % colors.length]} p-[1px] mb-6`}
          style={{ transform: 'translateZ(30px)' }}
        >
          <div className="w-full h-full rounded-2xl bg-[#0A0A0F] flex items-center justify-center">
            <Icon size={28} className="text-white" />
          </div>
        </div>

        {/* Title */}
        <h3
          className="font-display font-bold text-xl text-[#F0F4FF] mb-3"
          style={{ transform: 'translateZ(20px)' }}
        >
          {title}
        </h3>

        {/* Description */}
        <p
          className="text-[#A7B0C8] text-sm leading-relaxed"
          style={{ transform: 'translateZ(10px)' }}
        >
          {description}
        </p>

        {/* Corner accents */}
        <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[#2E6EFF] rounded-tl-xl opacity-50" />
        <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-[#2E6EFF] rounded-tr-xl opacity-50" />
        <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-[#2E6EFF] rounded-bl-xl opacity-50" />
        <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[#2E6EFF] rounded-br-xl opacity-50" />
      </div>
    </div>
  );
};

export default HolographicCard;
