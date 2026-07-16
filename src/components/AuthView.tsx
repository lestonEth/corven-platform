import {
  FormEvent,
  useEffect,
  useState,
} from 'react';

import {
  AlertCircle,
  ArrowRight,
  CheckCircle,
  Eye,
  EyeOff,
  Github,
  Lock,
  Mail,
  User as UserIcon,
} from 'lucide-react';

interface AuthViewProps {
  onLogin: (
    email: string,
    password: string,
  ) => Promise<void>;

  onRegister: (
    name: string,
    email: string,
    password: string,
  ) => Promise<void>;
}

export default function AuthView({
  onLogin,
  onRegister,
}: AuthViewProps) {
  const [isLogin, setIsLogin] =
    useState(true);

  const [name, setName] =
    useState('');

  const [email, setEmail] =
    useState('');

  const [password, setPassword] =
    useState('');

  const [showPassword, setShowPassword] =
    useState(false);

  const [error, setError] =
    useState('');

  const [success, setSuccess] =
    useState('');

  const [isLoading, setIsLoading] =
    useState(false);

  useEffect(() => {
    setError('');
    setSuccess('');
  }, [isLogin]);

  const handleSubmit = async (
    event: FormEvent,
  ) => {
    event.preventDefault();

    setError('');
    setSuccess('');

    if (
      !email ||
      !password ||
      (!isLogin && !name)
    ) {
      setError(
        'Please fill in all required fields.',
      );

      return;
    }

    setIsLoading(true);

    try {
      if (isLogin) {
        await onLogin(email, password);

        setSuccess(
          'Welcome back! Signing you in...',
        );
      } else {
        await onRegister(
          name,
          email,
          password,
        );

        setSuccess(
          'Account created successfully!',
        );
      }
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Authentication failed';

      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0d1117] flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <div className="w-full max-w-md rounded-3xl overflow-hidden shadow-2xl relative z-10">
        <div className="px-8 pt-8 pb-6 text-center">
          <h2 className="text-2xl font-black text-white tracking-tight">
            {isLogin
              ? 'Sign in to FiberDev'
              : 'Create an account'}
          </h2>

          <p className="mt-2 text-xs text-gray-500">
            {isLogin
              ? 'Access your cloud Fiber workspaces.'
              : 'Create your Fiber development account.'}
          </p>
        </div>

        <div className="px-8 pb-8">
          <div className="grid grid-cols-2 gap-1 p-1 mb-6 bg-[#161b22] border border-[#30363d] rounded-xl">
            <button
              type="button"
              onClick={() => setIsLogin(true)}
              className={`py-2 rounded-lg text-xs font-semibold transition ${isLogin
                  ? 'bg-[#21262d] text-white'
                  : 'text-gray-500 hover:text-white'
                }`}
            >
              Sign In
            </button>

            <button
              type="button"
              onClick={() => setIsLogin(false)}
              className={`py-2 rounded-lg text-xs font-semibold transition ${!isLogin
                  ? 'bg-[#21262d] text-white'
                  : 'text-gray-500 hover:text-white'
                }`}
            >
              Register
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs rounded-xl flex items-start gap-2">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs rounded-xl flex items-start gap-2">
              <CheckCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <span>{success}</span>
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="space-y-4"
          >
            {!isLogin && (
              <div className="space-y-1.5">
                <label className="block text-[11px] font-mono text-gray-400 uppercase tracking-widest font-bold">
                  Full Name
                </label>

                <div className="relative">
                  <UserIcon className="absolute left-3.5 top-3 h-4 w-4 text-gray-500" />

                  <input
                    type="text"
                    value={name}
                    onChange={(event) =>
                      setName(event.target.value)
                    }
                    placeholder="Jimleston Osoi"
                    autoComplete="name"
                    className="w-full pl-10 pr-4 py-2.5 bg-[#0d1117]/60 border border-[#30363d] rounded-xl text-xs focus:outline-none focus:border-[#1f6feb] focus:ring-1 focus:ring-[#1f6feb] text-white"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="block text-[11px] font-mono text-gray-400 uppercase tracking-widest font-bold">
                Email Address
              </label>

              <div className="relative">
                <Mail className="absolute left-3.5 top-3 h-4 w-4 text-gray-500" />

                <input
                  type="email"
                  value={email}
                  onChange={(event) =>
                    setEmail(event.target.value)
                  }
                  placeholder="name@company.com"
                  autoComplete="email"
                  className="w-full pl-10 pr-4 py-2.5 bg-[#0d1117]/60 border border-[#30363d] rounded-xl text-xs focus:outline-none focus:border-[#1f6feb] focus:ring-1 focus:ring-[#1f6feb] text-white"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-[11px] font-mono text-gray-400 uppercase tracking-widest font-bold">
                Password
              </label>

              <div className="relative">
                <Lock className="absolute left-3.5 top-3 h-4 w-4 text-gray-500" />

                <input
                  type={
                    showPassword
                      ? 'text'
                      : 'password'
                  }
                  value={password}
                  onChange={(event) =>
                    setPassword(
                      event.target.value,
                    )
                  }
                  placeholder="••••••••••••"
                  autoComplete={
                    isLogin
                      ? 'current-password'
                      : 'new-password'
                  }
                  className="w-full pl-10 pr-10 py-2.5 bg-[#0d1117]/60 border border-[#30363d] rounded-xl text-xs focus:outline-none focus:border-[#1f6feb] focus:ring-1 focus:ring-[#1f6feb] text-white"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(
                      (current) => !current,
                    )
                  }
                  className="absolute right-3.5 top-3 text-gray-500 hover:text-gray-300"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#238636] hover:bg-[#2ea043] disabled:opacity-50 text-white font-bold py-3 px-4 rounded-xl text-xs transition-all active:scale-[0.98] shadow-lg shadow-[#238636]/15 flex items-center justify-center gap-1.5"
            >
              {isLoading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <span>
                    {isLogin
                      ? 'Sign In to Studio'
                      : 'Create My Account'}
                  </span>

                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          <div className="relative my-6 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#30363d]/60" />
            </div>

            <span className="relative bg-[#0d1117] px-3 font-mono text-[10px] uppercase text-gray-500 font-semibold tracking-wider">
              Social authentication
            </span>
          </div>

          <button
            type="button"
            disabled
            className="w-full bg-[#21262d] border border-[#30363d] text-gray-500 font-semibold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 cursor-not-allowed opacity-60"
          >
            <Github className="h-4 w-4" />
            GitHub authentication coming soon
          </button>
        </div>
      </div>

      <div className="mt-6 text-center text-gray-600 text-[10px] font-mono">
        FiberDev Studio Core v1.0.0
      </div>
    </div>
  );
}