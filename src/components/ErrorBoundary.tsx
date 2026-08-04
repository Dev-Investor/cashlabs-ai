import * as React from 'react';
import { AlertCircle, RefreshCcw } from 'lucide-react';
import { Button } from './ui/button';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      let message = "Algo salió mal. Por favor, intenta de nuevo.";
      
      try {
        if (this.state.error?.message) {
          const parsed = JSON.parse(this.state.error.message);
          if (parsed.error?.includes('permission-denied')) {
            message = "No tienes permisos para realizar esta acción. Por favor, inicia sesión de nuevo.";
          }
        }
      } catch (e) {
        // Not a JSON error
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-deep-black p-4">
          <div className="max-w-md w-full bg-card-bg rounded-2xl shadow-2xl p-8 text-center border border-border">
            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-red-500/20">
              <AlertCircle className="w-8 h-8 text-red-500" />
            </div>
            <h1 className="text-2xl font-black text-white mb-2 tracking-tight">¡Ups! Algo falló</h1>
            <p className="text-slate-400 mb-8 text-sm leading-relaxed">{message}</p>
            <Button 
              onClick={this.handleReset}
              className="w-full bg-neon-green hover:bg-bright-green text-deep-black font-bold h-12 gap-2"
            >
              <RefreshCcw className="w-4 h-4" />
              Recargar aplicación
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
