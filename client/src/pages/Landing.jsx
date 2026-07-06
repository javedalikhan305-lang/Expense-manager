import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

const AnimatedCounter = ({ target, suffix = '', prefix = '' }) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const duration = 2000;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [target]);
  return <span>{prefix}{count.toLocaleString()}{suffix}</span>;
};

const features = [
  {
    icon: '📊',
    label: 'Smart Analytics',
    copy: 'AI-powered insights that reveal your spending patterns and help you save more every month.',
    gradient: 'from-yellow-500/20 to-yellow-500/5',
  },
  {
    icon: '💳',
    label: 'Expense Tracking',
    copy: 'Instantly categorize every transaction. Never lose track of where your money goes.',
    gradient: 'from-emerald-500/20 to-emerald-500/5',
  },
  {
    icon: '📈',
    label: 'Income Monitor',
    copy: 'Visualize all revenue streams with beautiful charts and real-time trend comparisons.',
    gradient: 'from-blue-500/20 to-blue-500/5',
  },
  {
    icon: '🔔',
    label: 'Budget Alerts',
    copy: 'Set custom budgets and get notified before you overspend. Stay in control always.',
    gradient: 'from-purple-500/20 to-purple-500/5',
  },
  {
    icon: '🔒',
    label: 'Bank-Level Security',
    copy: '256-bit encryption and multi-factor authentication keeps your financial data safe.',
    gradient: 'from-red-500/20 to-red-500/5',
  },
  {
    icon: '⚡',
    label: 'Instant Reports',
    copy: 'Generate detailed financial reports in one click. Export to PDF or Excel anytime.',
    gradient: 'from-orange-500/20 to-orange-500/5',
  },
];

const stats = [
  { value: 50000, suffix: '+', label: 'Active Users' },
  { value: 2, suffix: 'M+', label: 'Transactions Tracked' },
  { value: 98, suffix: '%', label: 'Customer Satisfaction' },
  { value: 4, suffix: '.9★', label: 'Average Rating' },
];

const testimonials = [
  {
    name: 'Ayesha Raza',
    role: 'Freelance Designer',
    text: 'FinTrack completely changed how I manage my business expenses. The AI insights are incredible!',
    avatar: 'A',
  },
  {
    name: 'Rahul Sharma',
    role: 'Small Business Owner',
    text: 'I saved ₹40,000 in the first 3 months just by following the budget recommendations.',
    avatar: 'R',
  },
  {
    name: 'Zara Khan',
    role: 'Finance Manager',
    text: 'The reports feature is a game-changer. My team loves the clean dashboard and real-time data.',
    avatar: 'Z',
  },
];

const Landing = () => {
  const [scrolled, setScrolled] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen overflow-x-hidden" style={{ background: '#0a0a0a', color: '#e8e8e8', fontFamily: "'Inter', sans-serif" }}>
      {/* Google Fonts */}
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />

      {/* BG Glows */}
      <div style={{
        position: 'fixed', top: '-100px', left: '50%', transform: 'translateX(-50%)',
        width: '800px', height: '500px', background: 'radial-gradient(ellipse, rgba(245,197,24,0.08) 0%, transparent 70%)',
        pointerEvents: 'none', zIndex: 0,
      }} />
      <div style={{
        position: 'fixed', bottom: '0', right: '-200px',
        width: '600px', height: '600px', background: 'radial-gradient(ellipse, rgba(52,211,153,0.05) 0%, transparent 70%)',
        pointerEvents: 'none', zIndex: 0,
      }} />

      {/* ── NAVBAR ── */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        padding: '0 2rem',
        background: scrolled ? 'rgba(10,10,10,0.95)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? '1px solid #1f1f1f' : '1px solid transparent',
        transition: 'all 0.3s ease',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        height: '72px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '38px', height: '38px', borderRadius: '10px',
            background: '#f5c518', display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: '900', color: '#000', fontSize: '18px',
          }}>F</div>
          <span style={{ fontWeight: '800', fontSize: '20px', color: '#fff', letterSpacing: '-0.5px' }}>FinTrack</span>
        </div>
        <div style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
          {['Features', 'Pricing', 'About'].map((item) => (
            <a key={item} href="#" style={{
              color: '#888', textDecoration: 'none', fontSize: '14px', fontWeight: '500',
              transition: 'color 0.2s',
            }}
              onMouseEnter={e => e.target.style.color = '#f5c518'}
              onMouseLeave={e => e.target.style.color = '#888'}
            >{item}</a>
          ))}
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <Link to="/login" style={{
            padding: '9px 20px', borderRadius: '10px', fontSize: '14px', fontWeight: '600',
            color: '#e8e8e8', textDecoration: 'none', border: '1px solid #2a2a2a',
            background: 'transparent', transition: 'all 0.2s',
          }}
            onMouseEnter={e => { e.target.style.borderColor = '#f5c518'; e.target.style.color = '#f5c518'; }}
            onMouseLeave={e => { e.target.style.borderColor = '#2a2a2a'; e.target.style.color = '#e8e8e8'; }}
          >Sign In</Link>
          <Link to="/register" style={{
            padding: '9px 20px', borderRadius: '10px', fontSize: '14px', fontWeight: '700',
            color: '#000', textDecoration: 'none', background: '#f5c518',
            boxShadow: '0 0 20px rgba(245,197,24,0.3)', transition: 'all 0.2s',
          }}
            onMouseEnter={e => { e.target.style.background = '#e0b000'; e.target.style.boxShadow = '0 0 30px rgba(245,197,24,0.5)'; }}
            onMouseLeave={e => { e.target.style.background = '#f5c518'; e.target.style.boxShadow = '0 0 20px rgba(245,197,24,0.3)'; }}
          >Get Started Free</Link>
        </div>
      </nav>

      {/* ── HERO SECTION ── */}
      <section style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '100px 2rem 60px', position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: '900px', textAlign: 'center' }}>
          {/* Badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            background: '#111', border: '1px solid #2a2a2a', borderRadius: '50px',
            padding: '8px 20px', marginBottom: '32px', fontSize: '13px', color: '#888',
          }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#34d399', display: 'inline-block', animation: 'pulse 2s infinite' }} />
            🚀 Trusted by 50,000+ users across India &amp; worldwide
          </div>

          {/* Headline */}
          <h1 style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)', fontWeight: '900', lineHeight: '1.1', marginBottom: '24px', letterSpacing: '-2px', color: '#fff' }}>
            Take Control of Your
            <br />
            <span style={{
              background: 'linear-gradient(135deg, #f5c518 0%, #ffed4e 50%, #e0b000 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>Financial Future</span>
          </h1>

          {/* Subheadline */}
          <p style={{ fontSize: '1.2rem', lineHeight: '1.8', color: '#888', maxWidth: '600px', margin: '0 auto 48px', fontWeight: '400' }}>
            A beautifully designed expense manager that gives you clarity, control, and confidence over every rupee you earn and spend.
          </p>

          {/* CTA Buttons */}
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '64px' }}>
            <Link to="/register" style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '16px 36px', borderRadius: '14px', fontSize: '16px', fontWeight: '700',
              color: '#000', textDecoration: 'none', background: '#f5c518',
              boxShadow: '0 0 40px rgba(245,197,24,0.35)', transition: 'all 0.3s',
            }}>
              Start for Free →
            </Link>
            <Link to="/login" style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '16px 36px', borderRadius: '14px', fontSize: '16px', fontWeight: '600',
              color: '#e8e8e8', textDecoration: 'none',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid #2a2a2a', transition: 'all 0.3s',
            }}>
              View Demo
            </Link>
          </div>

          {/* Dashboard Preview Card */}
          <div style={{
            background: 'linear-gradient(135deg, #111 0%, #161616 100%)',
            border: '1px solid #2a2a2a', borderRadius: '24px',
            padding: '32px', boxShadow: '0 40px 80px rgba(0,0,0,0.6)',
            textAlign: 'left',
          }}>
            {/* Top bar */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
              {['#ff5f57', '#febc2e', '#28c840'].map(c => (
                <div key={c} style={{ width: '12px', height: '12px', borderRadius: '50%', background: c }} />
              ))}
              <div style={{ flex: 1, height: '8px', background: '#1f1f1f', borderRadius: '4px', marginLeft: '12px' }}>
                <div style={{ width: '40%', height: '100%', background: '#2a2a2a', borderRadius: '4px' }} />
              </div>
            </div>
            {/* Stats Row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '20px' }}>
              {[
                { label: 'Total Balance', value: '₹1,24,580', change: '+8.2%', color: '#34d399' },
                { label: 'This Month', value: '₹32,450', change: '-2.1%', color: '#fb7185' },
                { label: 'Savings Goal', value: '₹80,000', change: '74% done', color: '#f5c518' },
              ].map(stat => (
                <div key={stat.label} style={{
                  background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: '14px',
                  padding: '16px',
                }}>
                  <p style={{ fontSize: '11px', color: '#666', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>{stat.label}</p>
                  <p style={{ fontSize: '22px', fontWeight: '800', color: '#fff', marginBottom: '4px' }}>{stat.value}</p>
                  <p style={{ fontSize: '12px', color: stat.color, fontWeight: '600' }}>{stat.change}</p>
                </div>
              ))}
            </div>
            {/* Chart Bar Preview */}
            <div style={{ background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: '14px', padding: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                <span style={{ fontSize: '13px', color: '#888' }}>Monthly Overview</span>
                <span style={{ fontSize: '12px', color: '#f5c518' }}>View all →</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', height: '60px' }}>
                {[40, 65, 45, 80, 55, 70, 90, 60, 75, 85, 50, 95].map((h, i) => (
                  <div key={i} style={{
                    flex: 1, height: `${h}%`, borderRadius: '4px',
                    background: i === 11 ? '#f5c518' : '#2a2a2a',
                    transition: 'all 0.3s',
                  }} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section style={{ padding: '60px 2rem', position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '2px', background: '#1a1a1a', borderRadius: '20px',
            border: '1px solid #2a2a2a', overflow: 'hidden',
          }}>
            {stats.map((s, i) => (
              <div key={i} style={{
                padding: '32px 20px', textAlign: 'center',
                background: '#111', borderRight: i < 3 ? '1px solid #1f1f1f' : 'none',
              }}>
                <p style={{ fontSize: '2.2rem', fontWeight: '900', color: '#f5c518', marginBottom: '8px' }}>
                  <AnimatedCounter target={s.value} suffix={s.suffix} />
                </p>
                <p style={{ fontSize: '13px', color: '#666', fontWeight: '500' }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section style={{ padding: '80px 2rem', position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <p style={{ fontSize: '13px', color: '#f5c518', fontWeight: '700', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '12px' }}>
              EVERYTHING YOU NEED
            </p>
            <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: '800', color: '#fff', letterSpacing: '-1px', marginBottom: '16px' }}>
              Powerful features, simple interface
            </h2>
            <p style={{ color: '#666', fontSize: '16px', maxWidth: '500px', margin: '0 auto' }}>
              From tracking to forecasting, FinTrack has every tool you need to master your finances.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
            {features.map((f) => (
              <div key={f.label} style={{
                background: '#111', border: '1px solid #2a2a2a', borderRadius: '20px',
                padding: '28px', cursor: 'pointer', transition: 'all 0.3s',
                position: 'relative', overflow: 'hidden',
              }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = '#f5c518';
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 20px 40px rgba(245,197,24,0.1)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = '#2a2a2a';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div style={{
                  fontSize: '32px', marginBottom: '16px',
                  width: '56px', height: '56px', borderRadius: '14px',
                  background: '#1a1a1a', border: '1px solid #2a2a2a',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>{f.icon}</div>
                <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#fff', marginBottom: '10px' }}>{f.label}</h3>
                <p style={{ fontSize: '14px', color: '#666', lineHeight: '1.7' }}>{f.copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section style={{ padding: '80px 2rem', position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: '700px', margin: '0 auto', textAlign: 'center' }}>
          <p style={{ fontSize: '13px', color: '#f5c518', fontWeight: '700', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '12px' }}>
            TESTIMONIALS
          </p>
          <h2 style={{ fontSize: '2.5rem', fontWeight: '800', color: '#fff', marginBottom: '48px', letterSpacing: '-1px' }}>
            Loved by thousands
          </h2>

          {/* Active Testimonial */}
          <div style={{
            background: '#111', border: '1px solid #2a2a2a', borderRadius: '24px',
            padding: '40px', marginBottom: '24px', minHeight: '180px',
            transition: 'all 0.4s',
          }}>
            <p style={{ fontSize: '18px', color: '#ccc', lineHeight: '1.8', marginBottom: '24px', fontStyle: 'italic' }}>
              "{testimonials[activeTestimonial].text}"
            </p>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
              <div style={{
                width: '44px', height: '44px', borderRadius: '50%',
                background: '#f5c518', color: '#000', fontWeight: '800',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px',
              }}>{testimonials[activeTestimonial].avatar}</div>
              <div style={{ textAlign: 'left' }}>
                <p style={{ color: '#fff', fontWeight: '700', fontSize: '15px' }}>{testimonials[activeTestimonial].name}</p>
                <p style={{ color: '#666', fontSize: '13px' }}>{testimonials[activeTestimonial].role}</p>
              </div>
            </div>
          </div>

          {/* Dots */}
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
            {testimonials.map((_, i) => (
              <button key={i} onClick={() => setActiveTestimonial(i)} style={{
                width: i === activeTestimonial ? '24px' : '8px', height: '8px',
                borderRadius: '4px', border: 'none', cursor: 'pointer',
                background: i === activeTestimonial ? '#f5c518' : '#2a2a2a',
                transition: 'all 0.3s',
              }} />
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA SECTION ── */}
      <section style={{ padding: '80px 2rem 100px', position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{
            background: 'linear-gradient(135deg, #1a1500 0%, #111 50%, #0a0a0a 100%)',
            border: '1px solid #3a3000', borderRadius: '28px', padding: '60px 40px',
            boxShadow: '0 0 60px rgba(245,197,24,0.08)',
          }}>
            <div style={{
              display: 'inline-block', background: '#f5c518', color: '#000',
              borderRadius: '50px', padding: '8px 20px', fontSize: '13px',
              fontWeight: '700', marginBottom: '24px', letterSpacing: '1px',
            }}>
              🎉 FREE FOREVER • NO CREDIT CARD NEEDED
            </div>
            <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: '900', color: '#fff', lineHeight: '1.2', marginBottom: '16px', letterSpacing: '-1px' }}>
              Start managing your money
              <br />
              <span style={{ color: '#f5c518' }}>smarter today</span>
            </h2>
            <p style={{ color: '#666', fontSize: '16px', marginBottom: '40px', lineHeight: '1.8' }}>
              Join 50,000+ people who've already taken control of their finances with FinTrack.
            </p>
            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/register" style={{
                padding: '16px 40px', borderRadius: '14px', fontSize: '16px', fontWeight: '700',
                color: '#000', textDecoration: 'none', background: '#f5c518',
                boxShadow: '0 0 30px rgba(245,197,24,0.4)', transition: 'all 0.3s', display: 'inline-block',
              }}>
                Create Free Account →
              </Link>
            </div>
            <p style={{ color: '#444', fontSize: '13px', marginTop: '20px' }}>
              ✓ No credit card &nbsp; ✓ Free forever plan &nbsp; ✓ Cancel anytime
            </p>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{
        borderTop: '1px solid #1a1a1a', padding: '40px 2rem',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        maxWidth: '1100px', margin: '0 auto', flexWrap: 'wrap', gap: '16px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '32px', height: '32px', borderRadius: '8px',
            background: '#f5c518', display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: '900', color: '#000', fontSize: '14px',
          }}>F</div>
          <span style={{ fontWeight: '700', color: '#fff', fontSize: '16px' }}>FinTrack</span>
        </div>
        <p style={{ color: '#444', fontSize: '13px' }}>© 2026 FinTrack. Built for financial clarity.</p>
        <div style={{ display: 'flex', gap: '24px' }}>
          {['Privacy', 'Terms', 'Support'].map(item => (
            <a key={item} href="#" style={{ color: '#444', fontSize: '13px', textDecoration: 'none', transition: 'color 0.2s' }}
              onMouseEnter={e => e.target.style.color = '#f5c518'}
              onMouseLeave={e => e.target.style.color = '#444'}
            >{item}</a>
          ))}
        </div>
      </footer>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        * { margin: 0; padding: 0; box-sizing: border-box; }
        html { scroll-behavior: smooth; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #0a0a0a; }
        ::-webkit-scrollbar-thumb { background: #2a2a2a; border-radius: 3px; }
        ::-webkit-scrollbar-thumb:hover { background: #f5c518; }
      `}</style>
    </div>
  );
};

export default Landing;
