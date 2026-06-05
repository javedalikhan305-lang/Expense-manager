import { Search, User } from 'lucide-react';

const Navbar = () => {
  return (
    <header className="fixed top-0 left-72 right-0 z-10 flex h-16 items-center justify-between border-b border-fintech-border bg-fintech-card/95 px-6 backdrop-blur-xl">
      <div className="relative w-full max-w-xl">
        <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-fintech-muted">
          <Search size={18} />
        </span>
        <input
          type="text"
          placeholder="Search transactions, budgets, insights..."
          className="w-full bg-[#10243b] text-fintech-text rounded-2xl border border-fintech-border pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-fintech-primary transition"
        />
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3 pl-4 border-l border-fintech-border">
          <div className="w-10 h-10 bg-[#1d3658] rounded-full flex items-center justify-center text-fintech-primary">
            <User size={18} />
          </div>
          <div className="hidden md:block text-sm">
            <p className="text-fintech-text font-semibold">User Name</p>
            <p className="text-fintech-muted">Professional Plan</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
