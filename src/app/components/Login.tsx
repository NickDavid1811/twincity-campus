import { useState } from 'react';
import { motion } from 'motion/react';
import { Building2, Lock, Mail, ShieldAlert, User as UserIcon } from 'lucide-react';
import type { User } from '../types/auth';

interface LoginProps {
  onLogin: (user: User) => void;
}

export function Login({ onLogin }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Default fallback if someone submits the form normally
    onLogin({
      id: 'usr-1',
      name: 'Admin Usuario',
      email: email || 'admin@campus.edu',
      role: 'admin',
      initials: 'AU'
    });
  };

  const handleMockLogin = (role: 'admin' | 'user') => {
    if (role === 'admin') {
      onLogin({
        id: 'usr-admin',
        name: 'Admin Principal',
        email: 'admin@campus.edu',
        role: 'admin',
        initials: 'AP'
      });
    } else {
      onLogin({
        id: 'usr-common',
        name: 'Estudiante Común',
        email: 'estudiante@campus.edu',
        role: 'user',
        initials: 'EC'
      });
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#0a0e1a] via-[#0f172a] to-[#1a1d29] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-card border border-border rounded-lg shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-primary to-[#0052cc] p-8 text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl">
                <Building2 className="w-12 h-12 text-white" />
              </div>
            </div>
            <h1 className="text-2xl text-white mb-2">TwinCity Campus</h1>
            <p className="text-white/80 text-sm">Plataforma de Gestión Operativa</p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            <div className="space-y-2">
              <label className="text-sm text-foreground">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-input-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
                  placeholder="usuario@campus.edu"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-foreground">Contraseña</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-input-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded border-input" />
                <span className="text-muted-foreground">Recordarme</span>
              </label>
              <a href="#" className="text-primary hover:underline">
                ¿Olvidaste tu contraseña?
              </a>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-3 rounded-lg transition-colors"
            >
              Iniciar Sesión
            </motion.button>
            <div className="flex gap-2 pt-2 border-t border-border mt-4">
              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleMockLogin('admin')}
                className="flex-1 flex items-center justify-center gap-2 bg-secondary hover:bg-secondary/80 text-foreground py-2 rounded-lg transition-colors text-xs"
              >
                <ShieldAlert className="w-4 h-4" />
                Ingresar como Admin
              </motion.button>
              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleMockLogin('user')}
                className="flex-1 flex items-center justify-center gap-2 bg-secondary hover:bg-secondary/80 text-foreground py-2 rounded-lg transition-colors text-xs"
              >
                <UserIcon className="w-4 h-4" />
                Ingresar como Usuario
              </motion.button>
            </div>
          </form>

          <div className="px-8 pb-8 pt-4 border-t border-border">
            <p className="text-center text-sm text-muted-foreground">
              Sistema de Gemelo Digital v2.0
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
