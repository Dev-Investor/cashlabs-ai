import React, { useState } from 'react';
import { auth, db, OperationType, handleFirestoreError } from '../../lib/firebase';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  updateProfile,
  sendPasswordResetEmail,
  GoogleAuthProvider,
signInWithRedirect,
getRedirectResult
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { UserPlan } from '../../types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { toast } from 'sonner';
import { Loader2, Mail, Lock, User, Globe, TrendingUp, Check, X, Zap, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { motion } from 'motion/react';
import { BrandLogo } from '../ui/BrandLogo';

interface Props {
  onBack?: () => void;
}

export function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    country: ''
  });

React.useEffect(() => {
  getRedirectResult(auth).then(async (result) => {
    if (result) {
      const user = result.user;
      const docRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        const userProfile = {
          uid: user.uid,
          fullName: user.displayName || 'Usuario de Google',
          email: user.email || '',
          country: 'No especificado',
          experienceLevel: 'No especificado',
          plan: 'START',
          createdAt: Date.now()
        };
        await setDoc(docRef, userProfile);
      }
      toast.success('¡Bienvenido!');
    }
  }).catch((error) => {
    console.error(error);
    if (error.code) {
      toast.error(error.message || 'Error al iniciar sesión con Google');
    }
  });
}, []);

  const passwordRequirements = {
    hasUppercase: /[A-Z]/.test(formData.password),
    hasLowercase: /[a-z]/.test(formData.password),
    hasNumber: /[0-9]/.test(formData.password),
    hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(formData.password),
    isMinLength: formData.password.length >= 8
  };

  const isPasswordValid = Object.values(passwordRequirements).every(Boolean);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isForgotPassword) {
      if (!formData.email) {
        toast.error('Por favor ingresa tu correo electrónico');
        return;
      }
      setLoading(true);
      try {
        await sendPasswordResetEmail(auth, formData.email);
        toast.success('Se ha enviado un correo para restablecer tu contraseña');
        setIsForgotPassword(false);
        setIsLogin(true);
      } catch (error: any) {
        console.error(error);
        toast.error(error.message || 'Error al enviar el correo de restablecimiento');
      } finally {
        setLoading(false);
      }
      return;
    }

    if (!isLogin) {
      if (!isPasswordValid) {
        toast.error('La contraseña no cumple con todos los requisitos');
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        toast.error('Las contraseñas no coinciden');
        return;
      }
    }

    setLoading(true);

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, formData.email, formData.password);
        toast.success('¡Bienvenido de nuevo!');
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
        const user = userCredential.user;

        await updateProfile(user, { displayName: formData.fullName });

        const userProfile = {
          uid: user.uid,
          fullName: formData.fullName,
          email: formData.email,
          country: formData.country,
          experienceLevel: 'No especificado',
          plan: 'START',
          createdAt: Date.now()
        };

        try {
          await setDoc(doc(db, 'users', user.uid), userProfile);
        } catch (error) {
          handleFirestoreError(error, OperationType.CREATE, `users/${user.uid}`);
        }

        toast.success('Cuenta creada exitosamente');
      }
    } catch (error: any) {
      console.error(error);
      let message = 'Error en la autenticación';
      
      if (error.code === 'auth/email-already-in-use') {
        message = 'Este correo ya está registrado';
      } else if (error.code === 'auth/invalid-credential' || error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        message = 'Correo o contraseña incorrectos';
      } else if (error.code === 'auth/weak-password') {
        message = 'La contraseña es muy débil';
      } else if (error.message) {
        message = error.message;
      }
      
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
  setLoading(true);
  try {
    const provider = new GoogleAuthProvider();
    await signInWithRedirect(auth, provider);
    // La página se redirige aquí, el resultado se procesa en el useEffect de abajo
  } catch (error: any) {
    console.error(error);
    toast.error(error.message || 'Error al iniciar sesión con Google');
    setLoading(false);
  }
};
  return (
    <div className="min-h-screen flex bg-deep-black">
      {/* Left Side: Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-card-bg items-center justify-center p-12 border-r border-border">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-neon-green/5 blur-[120px] rounded-full" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-bright-green/5 blur-[120px] rounded-full" />
        </div>
        
        <div className="relative z-10 max-w-lg">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <BrandLogo size="lg" className="mb-8" />
            <h2 className="text-3xl font-bold text-slate-400 leading-tight">
              Infraestructura de ingresos con Inteligencia Artificial
            </h2>
            <div className="mt-12 space-y-6">
              <div className="flex items-center gap-4 text-slate-300">
                <div className="w-10 h-10 rounded-xl bg-neon-green/10 flex items-center justify-center text-neon-green border border-neon-green/20">
                  <Zap className="w-6 h-6" />
                </div>
                <p className="font-medium">Monetización estratégica real</p>
              </div>
              <div className="flex items-center gap-4 text-slate-300">
                <div className="w-10 h-10 rounded-xl bg-neon-green/10 flex items-center justify-center text-neon-green border border-neon-green/20">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <p className="font-medium">Escalamiento modular por Labs</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right Side: Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md relative z-10"
        >
          <Card className="bg-card-bg border-border shadow-2xl backdrop-blur-xl">
            <CardHeader className="space-y-1 pb-8 relative">
              <CardTitle className="text-3xl font-black text-white tracking-tight pt-6">
                {isForgotPassword ? 'Recuperar Cuenta' : isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}
              </CardTitle>
              <CardDescription className="text-slate-500 font-medium">
                {isForgotPassword 
                  ? 'Ingresa tu email para recibir instrucciones' 
                  : isLogin 
                    ? 'Ingresa tus credenciales para continuar' 
                    : 'Únete al Ecosistema y Convierte AI en Dinero Real'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-5">
                {!isLogin && !isForgotPassword && (
                  <div className="space-y-2">
                    <Label className="text-slate-400 font-bold text-xs uppercase tracking-widest">Nombre Completo</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3.5 h-5 w-5 text-slate-600" />
                      <Input
                        placeholder="Tu nombre"
                        className="pl-10 h-12 bg-slate-800/30 border-border text-white focus:border-neon-green"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <Label className="text-slate-400 font-bold text-xs uppercase tracking-widest">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3.5 h-5 w-5 text-slate-600" />
                    <Input
                      type="email"
                      placeholder="nombre@ejemplo.com"
                      className="pl-10 h-12 bg-slate-800/30 border-border text-white focus:border-neon-green"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>
                </div>

                {!isForgotPassword && (
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Label className="text-slate-400 font-bold text-xs uppercase tracking-widest">Contraseña</Label>
                      {isLogin && (
                        <button 
                          type="button"
                          onClick={() => setIsForgotPassword(true)}
                          className="text-xs text-neon-green hover:text-bright-green font-bold"
                        >
                          ¿Olvidaste tu contraseña?
                        </button>
                      )}
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3.5 h-5 w-5 text-slate-600" />
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder={isLogin ? "Escribir contraseña" : "Crea una contraseña segura"}
                        className="pl-10 pr-10 h-12 bg-slate-800/30 border-border text-white focus:border-neon-green"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3.5 text-slate-600 hover:text-slate-400 transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
                )}

                {!isLogin && !isForgotPassword && (
                  <>
                    <div className="space-y-2">
                      <Label className="text-slate-400 font-bold text-xs uppercase tracking-widest">Confirmar Contraseña</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3.5 h-5 w-5 text-slate-600" />
                        <Input
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Repite tu contraseña"
                          className="pl-10 pr-10 h-12 bg-slate-800/30 border-border text-white focus:border-neon-green"
                          value={formData.confirmPassword}
                          onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-3.5 text-slate-600 hover:text-slate-400 transition-colors"
                        >
                          {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>

                    <div className="p-4 bg-slate-800/30 rounded-xl border border-border space-y-3">
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Requisitos de Seguridad</p>
                      <RequirementItem met={passwordRequirements.isMinLength} label="Mínimo 8 caracteres" />
                      <RequirementItem met={passwordRequirements.hasUppercase} label="Al menos una mayúscula" />
                      <RequirementItem met={passwordRequirements.hasLowercase} label="Al menos una minúscula" />
                      <RequirementItem met={passwordRequirements.hasNumber} label="Al menos un número" />
                      <RequirementItem met={passwordRequirements.hasSpecial} label="Al menos un signo especial" />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-slate-400 font-bold text-xs uppercase tracking-widest">País</Label>
                      <div className="relative">
                        <Globe className="absolute left-3 top-3.5 h-5 w-5 text-slate-600" />
                        <Input
                          placeholder="Ej: México"
                          className="pl-10 h-12 bg-slate-800/30 border-border text-white focus:border-neon-green"
                          value={formData.country}
                          onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                  </>
                )}

                <Button 
                  type="submit" 
                  className="w-full bg-neon-green hover:bg-bright-green text-deep-black h-14 text-lg font-black shadow-lg shadow-neon-green/10 transition-all hover:scale-[1.02]"
                  disabled={loading}
                >
                  {loading ? (
                    <Loader2 className="h-6 w-6 animate-spin" />
                  ) : (
                    isForgotPassword ? 'Enviar Instrucciones' : isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'
                  )}
                </Button>

                {!isForgotPassword && (
                  <>
                    <div className="relative my-6">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-border"></div>
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-card-bg px-2 text-slate-500 font-bold tracking-widest">O continuar con</span>
                      </div>
                    </div>

                    <Button
                      type="button"
                      variant="outline"
                      className="w-full h-12 bg-slate-800/30 border-border text-white hover:bg-slate-800 hover:border-neon-green/30 font-bold"
                      onClick={handleGoogleSignIn}
                      disabled={loading}
                    >
                      {loading ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        <div className="flex items-center justify-center gap-3">
                          <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path
                              fill="currentColor"
                              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            />
                            <path
                              fill="#34A853"
                              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            />
                            <path
                              fill="#FBBC05"
                              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                            />
                            <path
                              fill="#EA4335"
                              d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                            />
                          </svg>
                          Google
                        </div>
                      )}
                    </Button>
                  </>
                )}

                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => {
                      if (isForgotPassword) {
                        setIsForgotPassword(false);
                        setIsLogin(true);
                      } else {
                        setIsLogin(!isLogin);
                      }
                    }}
                    className="text-sm text-slate-500 hover:text-white transition-colors font-medium"
                  >
                    {isForgotPassword 
                      ? 'Volver al inicio de sesión' 
                      : isLogin 
                        ? '¿No tienes cuenta? Crear cuenta' 
                        : '¿Ya tienes cuenta? Iniciar sesión'}
                  </button>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

function RequirementItem({ met, label }: { met: boolean; label: string }) {
  return (
    <div className={`flex items-center gap-2 text-[11px] transition-colors ${met ? 'text-neon-green' : 'text-slate-500'}`}>
      {met ? <Check className="w-3 h-3" /> : <X className="w-3 h-3 opacity-50" />}
      <span>{label}</span>
    </div>
  );
}
