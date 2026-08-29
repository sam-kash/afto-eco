import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-[#1a3c2a] text-white mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* About */}
        <div>
          <h4 style={{ fontFamily: "'Playfair Display', serif" }} className="text-lg font-semibold mb-4">About</h4>
          <ul className="space-y-2 text-sm text-[#b5c9bc]">
            <li><a href="#" className="hover:text-white transition-colors">Manifesto</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Locations</a></li>
          </ul>
        </div>

        {/* Connect */}
        <div>
          <h4 style={{ fontFamily: "'Playfair Display', serif" }} className="text-lg font-semibold mb-4">Connect With Us</h4>
          <ul className="space-y-2 text-sm text-[#b5c9bc]">
            <li><a href="https://www.instagram.com/summerhillmarket/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Instagram</a></li>
            <li><a href="https://www.facebook.com/SummerhillMarket/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Facebook</a></li>
          </ul>
        </div>

        {/* Help */}
        <div>
          <h4 style={{ fontFamily: "'Playfair Display', serif" }} className="text-lg font-semibold mb-4">Get Help</h4>
          <ul className="space-y-2 text-sm text-[#b5c9bc]">
            <li><a href="#" className="hover:text-white transition-colors">Contact &amp; Hours</a></li>
            <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Orders &amp; Returns</a></li>
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-[#2d5a3d] py-5">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-2 text-xs text-[#7da98a]">
          <span>©{new Date().getFullYear()} AFTO-ECO. All Rights Reserved.</span>
          <div className="flex gap-4">
            <a href="#" className="hover:text-white transition-colors">Terms &amp; Conditions</a>
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
