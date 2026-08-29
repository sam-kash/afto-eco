import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-[#143823] text-[#e2ebd4] border-t border-[#235235] pt-12 pb-8 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Col */}
          <div className="space-y-3 md:col-span-1">
            <span className="font-serif text-2xl font-black text-white block">
              AFTO-ECO
            </span>
            <p className="text-xs text-[#a8bba8] leading-relaxed font-normal">
              Your neighborhood organic market. Delivering fresh produce, gourmet prepared foods, and artisanal bakery items daily.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Categories</h4>
            <ul className="space-y-1.5 text-xs text-[#a8bba8]">
              <li><Link href="/products?category=fruits" className="hover:text-white transition-colors">Fresh Produce</Link></li>
              <li><Link href="/products?category=bakery" className="hover:text-white transition-colors">Artisanal Bakery</Link></li>
              <li><Link href="/products?category=prepared-foods" className="hover:text-white transition-colors">Prepared Meals</Link></li>
              <li><Link href="/products?category=beverages" className="hover:text-white transition-colors">Cold Drinks & Juices</Link></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Customer Support</h4>
            <ul className="space-y-1.5 text-xs text-[#a8bba8]">
              <li><Link href="#" className="hover:text-white transition-colors">Delivery FAQs</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Store Locations</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Refund Policy</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          {/* Store Hours & Location */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Store Hours</h4>
            <p className="text-xs text-[#a8bba8]">Mon – Sun: 7:00 AM – 9:00 PM</p>
            <p className="text-xs text-[#a8bba8]">123 Market Street, Toronto, ON</p>
          </div>
        </div>

        {/* Bottom copyright bar */}
        <div className="pt-6 border-t border-[#235235] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#8ca48c]">
          <p>© {new Date().getFullYear()} AFTO-ECO Organic Market. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="#" className="hover:text-white">Privacy Policy</Link>
            <Link href="#" className="hover:text-white">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
