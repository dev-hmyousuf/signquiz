import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SignIn, SignUp } from '@clerk/clerk-react';
import { motion } from 'framer-motion';

interface AuthPageProps {
  type: 'sign-in' | 'sign-up';
}

const AuthPage: React.FC<AuthPageProps> = ({ type }) => {
  const navigate = useNavigate();
  
  // When successfully signed in/up, redirect to home
  const handleComplete = () => {
    navigate('/');
  };
  
  return (
    <div className="container mx-auto px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="max-w-md mx-auto"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">
            {type === 'sign-in' ? 'Welcome Back' : 'Create an Account'}
          </h1>
          <p className="text-muted-foreground">
            {type === 'sign-in'
              ? 'Sign in to access your account and join quiz events.'
              : 'Sign up to participate in quizzes and track your progress.'}
          </p>
        </div>
        
        <div className="bg-white dark:bg-card rounded-xl shadow-sm overflow-hidden">
          {type === 'sign-in' ? (
            <SignIn 
              signUpUrl="/sign-up" 
              afterSignInUrl="/"
              redirectUrl="/"
              appearance={{
                elements: {
                  rootBox: "w-full",
                  card: "shadow-none",
                  headerTitle: "text-xl font-semibold",
                  headerSubtitle: "text-muted-foreground text-sm",
                  socialButtonsBlockButton: "border-muted hover:bg-secondary",
                  formButtonPrimary: "bg-primary hover:bg-primary-600 text-white",
                  footerActionLink: "text-primary hover:text-primary-600"
                }
              }}
            />
          ) : (
            <SignUp 
              signInUrl="/sign-in" 
              afterSignUpUrl="/"
              redirectUrl="/"
              appearance={{
                elements: {
                  rootBox: "w-full",
                  card: "shadow-none",
                  headerTitle: "text-xl font-semibold",
                  headerSubtitle: "text-muted-foreground text-sm",
                  socialButtonsBlockButton: "border-muted hover:bg-secondary",
                  formButtonPrimary: "bg-primary hover:bg-primary-600 text-white",
                  footerActionLink: "text-primary hover:text-primary-600"
                }
              }}
            />
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default AuthPage;