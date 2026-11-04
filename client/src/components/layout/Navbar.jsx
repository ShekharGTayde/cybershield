import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowUpRight,
  Bell,
  ChevronDown,
  Layers,
  LogOut,
  Menu,
  Moon,
  Search,
  Shield,
  ShieldCheck,
  Sun,
  X,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { useSync } from '../../context/SyncContext';
import { useTheme } from '../../context/ThemeContext';

export function Navbar() {
  const { user, logout } = useAuth();
  const { unreadCount, setIsDrawerOpen } = useNotifications();
  const { isOnline } = useSync();
  const { theme, toggleTheme } = useTheme();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [navSearch, setNavSearch] = useState('');
  const navigate = useNavigate();
  const isInvestigator = ['INVESTIGATOR', 'ADMIN', 'SUPER_ADMIN'].includes(user?.role);

  const handleNavSearch = (event) => {
    event.preventDefault();
    if (!navSearch.trim()) return;
    const query = navSearch.trim();
    navigate(query.toUpperCase().startsWith('CRF-')
      ? `/track?id=${encodeURIComponent(query)}`
      : `/analyze?q=${encodeURIComponent(query)}`);
    setNavSearch('');
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="reference-navbar">
      <div className="reference-advisory">
        <span><span className="reference-live-dot" /> ADVISORY // OPSEC</span>
        <span className="reference-advisory-message">
          Verify SPARSH portals only at .gov.in domains // Never install unsolicited APKs // National cyber helpline: 1930
        </span>
        <span className="reference-online">{isOnline ? '● SECURE LINK' : '○ OFFLINE MODE'}</span>
      </div>

      <div className="reference-navbar-main">
        <Link to="/" className="reference-navbar-brand">
          <span className="reference-navbar-mark"><Shield size={17} /></span>
          <span>
            <strong>CYBER<span>SHIELD</span></strong>
            <small>DEFENCE PORTAL // 2026</small>
          </span>
        </Link>

        <nav className={`reference-navbar-links ${isMobileMenuOpen ? 'is-open' : ''}`} aria-label="Primary navigation">
          <Link to="/dashboard" onClick={() => setIsMobileMenuOpen(false)}>OVERVIEW</Link>
          <Link to="/report" onClick={() => setIsMobileMenuOpen(false)}>REPORT SCAM</Link>
          <Link to="/track" onClick={() => setIsMobileMenuOpen(false)}>TRACK ID</Link>
          <Link to="/analyze" onClick={() => setIsMobileMenuOpen(false)}>THREAT SCANNER</Link>
          <Link to="/awareness" onClick={() => setIsMobileMenuOpen(false)}>OPSEC GUIDES</Link>
        </nav>

        <div className="reference-navbar-actions">
          <button
            type="button"
            className="reference-icon-button reference-mobile-toggle"
            onClick={() => setIsMobileMenuOpen((open) => !open)}
            aria-label={isMobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? <X size={17} /> : <Menu size={17} />}
          </button>
          <form onSubmit={handleNavSearch} className="reference-navbar-search">
            <Search size={14} />
            <input
              value={navSearch}
              onChange={(event) => setNavSearch(event.target.value)}
              placeholder="SEARCH ID / URL"
              aria-label="Search complaint ID or URL"
            />
          </form>

          <button type="button" className="reference-icon-button" onClick={toggleTheme} aria-label="Toggle theme">
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          {user && (
            <button type="button" className="reference-icon-button reference-notification" onClick={() => setIsDrawerOpen(true)} aria-label="View notifications">
              <Bell size={16} />
              {unreadCount > 0 && <span>{unreadCount}</span>}
            </button>
          )}

          {user ? (
            <div className="reference-profile">
              <button type="button" className="reference-profile-button" onClick={() => setIsProfileOpen((open) => !open)}>
                <span>{user.fullName?.charAt(0) || 'U'}</span>
                <strong>{user.fullName}</strong>
                <ChevronDown size={13} />
              </button>
              {isProfileOpen && (
                <div className="reference-profile-menu">
                  <p>{user.serviceId}</p>
                  <small>{user.role} // {user.organization}</small>
                  <Link to="/dashboard" onClick={() => setIsProfileOpen(false)}><Layers size={14} /> MY DASHBOARD</Link>
                  {isInvestigator && <Link to="/investigator" onClick={() => setIsProfileOpen(false)}><ShieldCheck size={14} /> INVESTIGATOR QUEUE</Link>}
                  <button type="button" onClick={handleLogout}><LogOut size={14} /> SIGN OUT</button>
                </div>
              )}
            </div>
          ) : (
            <div className="reference-auth-links">
              <Link to="/login">SIGN IN</Link>
              <Link to="/register">REGISTER <ArrowUpRight size={13} /></Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
