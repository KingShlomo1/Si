export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden" style={{ background: 'var(--surface)' }}>
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 60% 40%, rgba(124,58,237,0.35) 0%, transparent 65%), radial-gradient(ellipse at 30% 70%, rgba(236,72,153,0.2) 0%, transparent 60%)' }} />
        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg" style={{ background: 'var(--grad)' }} />
            <span className="font-bold text-lg" style={{ color: 'var(--text)' }}>Creator Studio</span>
          </div>
          <div>
            <h1 className="text-4xl font-black mb-4 leading-tight" style={{ color: 'var(--text)' }}>
              Your AI-powered<br />
              <span className="gradient-text">social media command center.</span>
            </h1>
            <p className="text-base" style={{ color: 'var(--text2)' }}>
              Queue posts, approve content, and let AI draft in your brand voice — all in one place.
            </p>
            <div className="mt-8 flex flex-col gap-3">
              {['Connect all your platforms in one place', 'AI drafts posts in your exact brand voice', 'Approve queue before anything goes live'].map(f => (
                <div key={f} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(124,58,237,0.2)' }}>
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                      <path d="M2 5l2 2 4-4" stroke="#8b5cf6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <span className="text-sm" style={{ color: 'var(--text2)' }}>{f}</span>
                </div>
              ))}
            </div>
          </div>
          <p className="text-xs" style={{ color: 'var(--text3)' }}>© 2025 Creator Studio. All rights reserved.</p>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6" style={{ background: 'var(--bg)' }}>
        {children}
      </div>
    </div>
  );
}
