import { Search, User } from 'lucide-react';

const Navbar = () => {
  return (
    <header className="fixed top-0 left-72 right-0 z-10 flex h-16 items-center justify-between border-b border-[#2a2a2a] bg-[#0a0a0a]/95 px-6 backdrop-blur-xl">
      <div className="relative w-full max-w-xl">
        <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-fintech-muted">
          <Search size={18} />
        </span>
        <input
          type="text"
          placeholder="Search transactions, budgets, insights..."
          className="w-full bg-[#1a1a1a] text-fintech-text rounded-xl border border-[#2a2a2a] pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-fintech-primary/40 focus:border-fintech-primary transition"
        />
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3 pl-4 border-l border-[#2a2a2a]">
          <div className="w-10 h-10 bg-fintech-primary rounded-full flex items-center justify-center text-black font-bold">
            <User size={18} />
          </div>
          <div className="hidden md:block text-sm">
            <p className="text-fintech-text font-semibold">User Name</p>
            <p className="text-fintech-muted text-xs">Professional Plan</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
