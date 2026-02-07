import { useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Check, X } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface ComparisonRow {
  feature: string;
  traditional: string;
  techPlatform: string;
  caas: string;
  amics: string;
}

interface ComparisonTableProps {
  rows: ComparisonRow[];
}

const ComparisonTable = ({ rows }: ComparisonTableProps) => {
  const tableRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const rows = tableRef.current?.querySelectorAll('.table-row');
      if (rows) {
        gsap.fromTo(rows,
          { opacity: 0, x: -30 },
          {
            opacity: 1, x: 0,
            stagger: 0.08,
            scrollTrigger: {
              trigger: tableRef.current,
              start: 'top 80%',
              end: 'top 40%',
              scrub: 0.5
            }
          }
        );
      }
    }, tableRef);

    return () => ctx.revert();
  }, []);

  const renderCell = (content: string) => {
    if (content === '✓') return <Check size={16} className="text-[#00F0FF]" />;
    if (content === '✗') return <X size={16} className="text-[#FF2E8C]" />;
    return content;
  };

  return (
    <div ref={tableRef} className="overflow-x-auto">
      <table className="w-full min-w-[800px]">
        <thead>
          <tr className="border-b border-[#2E6EFF]/20">
            <th className="text-left py-4 px-4 font-mono text-xs text-[#A7B0C8] uppercase tracking-wider">Feature</th>
            <th className="text-left py-4 px-4 font-mono text-xs text-[#A7B0C8] uppercase tracking-wider">Traditional Agency</th>
            <th className="text-left py-4 px-4 font-mono text-xs text-[#A7B0C8] uppercase tracking-wider">Tech Platform</th>
            <th className="text-left py-4 px-4 font-mono text-xs text-[#A7B0C8] uppercase tracking-wider">CaaS (Superside)</th>
            <th className="text-left py-4 px-4 font-mono text-xs text-[#00F0FF] uppercase tracking-wider">Amics</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr 
              key={i} 
              className="table-row border-b border-[#2E6EFF]/10 hover:bg-[#2E6EFF]/5 transition-colors"
            >
              <td className="py-4 px-4 text-[#F0F4FF] font-medium">{row.feature}</td>
              <td className="py-4 px-4 text-[#A7B0C8] text-sm">{renderCell(row.traditional)}</td>
              <td className="py-4 px-4 text-[#A7B0C8] text-sm">{renderCell(row.techPlatform)}</td>
              <td className="py-4 px-4 text-[#A7B0C8] text-sm">{renderCell(row.caas)}</td>
              <td className="py-4 px-4 text-[#00F0FF] text-sm font-medium">{renderCell(row.amics)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ComparisonTable;
