import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useClerk, useUser } from '@clerk/clerk-react';
import { motion } from 'framer-motion';
import { MenuIcon, X, LogOut, User as UserIcon } from 'lucide-react';
import { Button } from '../ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const { user, isSignedIn } = useUser();
  const { signOut } = useClerk();
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <header className="bg-white dark:bg-card shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <motion.div
            whileHover={{ rotate: 10 }}
            className="text-primary text-2xl font-bold"
          >
            🧠
          </motion.div>
          <motion.span 
            className="text-xl font-bold bg-gradient-to-r from-primary-600 to-primary-500 bg-clip-text text-transparent"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            QuizMaster
          </motion.span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link to="/events" className="text-foreground hover:text-primary transition-colors">
            Events
          </Link>
          <Link to="/leaderboard" className="text-foreground hover:text-primary transition-colors">
            Leaderboard
          </Link>
          {isSignedIn && (
            <>
              <Link to="/profile" className="text-foreground hover:text-primary transition-colors">
                Profile
              </Link>
              {user?.publicMetadata?.role === 'admin' && (
                <Link to="/admin" className="text-foreground hover:text-primary transition-colors">
                  Admin
                </Link>
              )}
            </>
          )}
          
          {isSignedIn ? (
            <div className="flex items-center space-x-4">
              <Link to="/profile" className="flex items-center space-x-2">
                <Avatar>
                  <AvatarImage src={user?.imageUrl} />
                  <AvatarFallback>{user?.firstName?.[0] || user?.username?.[0] || 'U'}</AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium">{user?.username}</span>
              </Link>
              <Button variant="ghost" size="sm" onClick={handleSignOut}>
                <LogOut className="h-4 w-4 mr-2" />
                Sign out
              </Button>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Button variant="ghost" onClick={() => navigate('/sign-in')}>
                Sign in
              </Button>
              <Button onClick={() => navigate('/sign-up')}>
                Sign up
              </Button>
            </div>
          )}
        </nav>

        {/* Mobile Menu Toggle */}
        <button 
          className="md:hidden text-foreground"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <motion.div 
          className="md:hidden px-4 py-2 bg-white dark:bg-card border-t"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
        >
          <nav className="flex flex-col space-y-3 py-3">
            <Link 
              to="/events" 
              className="text-foreground hover:text-primary px-2 py-1 rounded transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Events
            </Link>
            <Link 
              to="/leaderboard" 
              className="text-foreground hover:text-primary px-2 py-1 rounded transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Leaderboard
            </Link>
            {isSignedIn && (
              <>
                <Link 
                  to="/profile" 
                  className="text-foreground hover:text-primary px-2 py-1 rounded transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Profile
                </Link>
                {user?.publicMetadata?.role === 'admin' && (
                  <Link 
                    to="/admin" 
                    className="text-foreground hover:text-primary px-2 py-1 rounded transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Admin
                  </Link>
                )}
                <button 
                  className="flex items-center text-destructive hover:bg-red-50 px-2 py-1 rounded text-left transition-colors"
                  onClick={() => {
                    handleSignOut();
                    setIsMenuOpen(false);
                  }}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign out
                </button>
              </>
            )}
            
            {!isSignedIn && (
              <div className="flex flex-col space-y-2 pt-2 border-t">
                <Button variant="ghost" onClick={() => {
                  navigate('/sign-in');
                  setIsMenuOpen(false);
                }}>
                  Sign in
                </Button>
                <Button onClick={() => {
                  navigate('/sign-up');
                  setIsMenuOpen(false);
                }}>
                  Sign up
                </Button>
              </div>
            )}
          </nav>
        </motion.div>
      )}
    </header>
  );
};

export default Header;