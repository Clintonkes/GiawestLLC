import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Globe, Zap, Mail, Phone, MapPin, Linkedin, Twitter, Facebook } from "lucide-react";

export function Footer() {
  const pathname = usePathname();
  const router = useRouter();

  const handleNavClick = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    if (pathname !== "/") {
      window.location.href = `/?section=${id}`;
      return;
    }

    if (id === "hero") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      const element = document.getElementById(id);
      if (element) {
        const offset = 80;
        const bodyRect = document.body.getBoundingClientRect().top;
        const elementRect = element.getBoundingClientRect().top;
        const elementPosition = elementRect - bodyRect;
        const offsetPosition = elementPosition - offset;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth"
        });
      }
    }
    window.history.replaceState(null, "", "/");
  };

  return (
    <footer className="bg-primary text-white pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 border-b border-slate-800 pb-12">
        <div className="col-span-1 md:col-span-1">
          <div className="flex items-center space-x-2 mb-6">
            <div className="relative p-2 bg-gradient-to-br from-accent to-blue-600 rounded-lg">
              <Globe className="h-5 w-5 text-white" />
              <Zap className="h-2 w-2 text-white absolute -top-0.5 -right-0.5 fill-white" />
            </div>
            <span className="text-xl font-heading font-bold">Florida Prod Market LLC</span>
          </div>
          <p className="text-slate-400 text-sm leading-relaxed mb-6">
            Redefining global logistics with precision, speed, and reliability. 
            Empowering businesses to grow through seamless supply chain solutions.
          </p>
          <div className="flex space-x-4">
            <a href="https://twitter.com" target="_blank" className="p-2 bg-slate-800 rounded-full hover:bg-accent transition-colors">
              <Twitter className="h-4 w-4" />
            </a>
            <a href="https://linkedin.com" target="_blank" className="p-2 bg-slate-800 rounded-full hover:bg-accent transition-colors">
              <Linkedin className="h-4 w-4" />
            </a>
            <a href="https://facebook.com" target="_blank" className="p-2 bg-slate-800 rounded-full hover:bg-accent transition-colors">
              <Facebook className="h-4 w-4" />
            </a>
          </div>
        </div>

        <div>
          <h4 className="font-heading font-bold mb-6 text-lg">Quick Links</h4>
          <ul className="space-y-4 text-sm text-slate-400">
            <li><button onClick={(e) => handleNavClick(e, "hero")} className="hover:text-white transition-colors text-left uppercase tracking-tighter font-bold">Home</button></li>
            <li><button onClick={(e) => handleNavClick(e, "services")} className="hover:text-white transition-colors text-left">Services</button></li>
            <li><button onClick={(e) => handleNavClick(e, "about")} className="hover:text-white transition-colors text-left">About Us</button></li>
            <li><button onClick={(e) => handleNavClick(e, "fleet")} className="hover:text-white transition-colors text-left font-bold text-accent">Our Fleet</button></li>
            <li><button onClick={(e) => handleNavClick(e, "contact")} className="hover:text-white transition-colors text-left">Contact</button></li>
          </ul>
        </div>

        <div>
          <h4 className="font-heading font-bold mb-6 text-lg">Admin</h4>
          <ul className="space-y-4 text-sm text-slate-400">
            <li><Link href="/admin/login" className="hover:text-white transition-colors group flex items-center">
              Admin Login 
              <span className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity">→</span>
            </Link></li>
            <li><Link href="/quote" className="hover:text-white transition-colors">Get Started</Link></li>
            <li><Link href="/legal" className="hover:text-white transition-colors">Legal & Privacy</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-heading font-bold mb-6 text-lg">Contact</h4>
          <ul className="space-y-4 text-sm text-slate-400">
            <li className="flex items-start space-x-3">
              <MapPin className="h-5 w-5 text-accent shrink-0" />
              <span>235 Apollo Beach Blvd Num 305, Apollo Beach, FL 33572</span>
            </li>
            <li className="flex items-center space-x-3">
              <Phone className="h-5 w-5 text-accent shrink-0" />
              <span>863-286-4824</span>
            </li>
            <li className="flex items-center space-x-3">
              <Mail className="h-5 w-5 text-accent shrink-0" />
              <span>floridaprod@proton.me</span>
            </li>
          </ul>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-6 pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 uppercase tracking-widest">
        <span>© 2026 Florida Prod Market LLC. All rights reserved.</span>
        <div className="flex space-x-6 mt-4 md:mt-0">
          <Link href="/privacy" className="hover:text-white">Privacy Policy</Link>
          <Link href="/terms" className="hover:text-white">Terms of Service</Link>
          <Link href="/cookies" className="hover:text-white">Cookies</Link>
        </div>
      </div>
    </footer>
  );
}
