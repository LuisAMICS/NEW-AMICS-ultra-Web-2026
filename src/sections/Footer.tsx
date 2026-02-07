import { Linkedin, Instagram } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative py-12 px-6 lg:px-[6vw] border-t border-[#2E6EFF]/10">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Logo */}
          <div className="flex items-center">
            <img src="amics-logo.png" alt="AMICS" className="h-10 w-auto object-contain" />
          </div>

          {/* Links */}
          <div className="flex items-center gap-8">
            <a href="#" className="text-[#A7B0C8] hover:text-[#F0F4FF] transition-colors text-sm">Privacy</a>
            <a href="#" className="text-[#A7B0C8] hover:text-[#F0F4FF] transition-colors text-sm">Terms</a>
            <a href="#" className="text-[#A7B0C8] hover:text-[#F0F4FF] transition-colors text-sm">Cookies</a>
          </div>

          {/* Social */}
          <div className="flex items-center gap-4">
            <a
              href="https://www.linkedin.com/in/dannysilverio/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-xl bg-[#0A0A0F] flex items-center justify-center text-[#A7B0C8] hover:text-[#00F0FF] hover:bg-[#00F0FF]/10 transition-all"
            >
              <Linkedin size={18} />
            </a>
            <a
              href="https://www.instagram.com/formerlyknownashashtag/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-xl bg-[#0A0A0F] flex items-center justify-center text-[#A7B0C8] hover:text-[#00F0FF] hover:bg-[#00F0FF]/10 transition-all"
            >
              <Instagram size={18} />
            </a>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-[#2E6EFF]/10 text-center">
          <p className="text-[#A7B0C8] text-sm">
            © {currentYear} Amics Consulting Group. All rights reserved.
          </p>
          <p className="text-[#A7B0C8]/60 text-xs mt-2">
            New York
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
