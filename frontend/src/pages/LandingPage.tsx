import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Brain, Sparkles, BookOpen } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <header className="px-6 py-4 flex justify-between items-center border-b border-border/40 backdrop-blur-md fixed top-0 w-full z-50">
        <div className="flex items-center gap-2 font-bold text-xl">
          <Brain className="h-6 w-6 text-primary" />
          <span>MyNotes</span>
        </div>
        <nav className="flex gap-4">
          <Button variant="ghost" asChild>
            <Link to="/login">Log in</Link>
          </Button>
          <Button asChild>
            <Link to="/register">Get Started</Link>
          </Button>
        </nav>
      </header>

      <main className="flex-1 pt-32 px-6 flex flex-col items-center text-center relative overflow-hidden">
        {/* Abstract animated background elements */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl -z-10 animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/30 rounded-full blur-3xl -z-10 animate-pulse delay-1000"></div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl"
        >
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6">
            Your Second Brain, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-500">
              Beautifully Organized
            </span>
          </h1>
          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            A premium personal knowledge management tool designed for students, researchers, and lifelong learners.
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" asChild className="h-12 px-8 text-lg">
              <Link to="/register">
                Start For Free <Sparkles className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="h-12 px-8 text-lg">
              View Demo
            </Button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-20 w-full max-w-5xl rounded-xl border border-border/50 shadow-2xl overflow-hidden glassmorphism"
        >
          <div className="bg-secondary/50 h-10 border-b border-border/50 flex items-center px-4 gap-2">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
            </div>
          </div>
          <div className="h-[500px] bg-background/50 flex items-center justify-center p-8">
            <div className="w-full h-full border border-dashed border-muted-foreground/30 rounded-lg flex flex-col items-center justify-center text-muted-foreground gap-4">
              <BookOpen className="h-12 w-12 opacity-50" />
              <p>Rich Text Editor & Markdown Support Preview</p>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
