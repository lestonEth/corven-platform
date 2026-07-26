'use client';

import React, {
    CSSProperties,
    useCallback,
    useEffect,
    useState,
} from 'react';

import {
    AlertCircle,
    CheckCircle,
    Copy,
    Loader2,
    LogOut,
    Wallet,
} from 'lucide-react';

import { ccc } from '@ckb-ccc/connector-react';

import { authApi } from '../features/auth/api/auth.api';
import { useAuth } from '../features/auth/hooks/useAuth';

interface AuthViewProps {
    onAuthenticated?: () => void;
}

const connectorStyles = {
    '--background': '#121417',
    '--divider': 'rgba(231, 228, 220, 0.08)',
    '--btn-primary': '#3E63DD',
    '--btn-primary-hover': '#527AF0',
    '--btn-secondary': '#1B1E23',
    '--btn-secondary-hover': '#262A30',
    '--icon-primary': '#ffffff',
    '--icon-secondary': 'rgba(231, 228, 220, 0.6)',
    '--tip-color': '#8A8F98',
    color: '#F5F3EE',
} as CSSProperties;

function shortenAddress(address?: string): string {
    if (!address) {
        return '';
    }

    if (address.length <= 20) {
        return address;
    }

    return `${address.slice(0, 10)}...${address.slice(-8)}`;
}

function BrandStyles() {
    return (
        <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap');

      .cv-display {
        font-family: 'Space Grotesk', ui-sans-serif, system-ui, sans-serif;
      }

      .cv-mono {
        font-family: 'JetBrains Mono', ui-monospace, SFMono-Regular, monospace;
      }

      .cv-grid-bg {
        background-image:
          linear-gradient(
            to right,
            rgba(231, 228, 220, 0.045) 1px,
            transparent 1px
          ),
          linear-gradient(
            to bottom,
            rgba(231, 228, 220, 0.045) 1px,
            transparent 1px
          );

        background-size: 42px 42px;
      }

      .cv-logo-glow {
        filter:
          drop-shadow(0 0 12px rgba(139, 92, 246, 0.28))
          drop-shadow(0 0 24px rgba(59, 130, 246, 0.2));
      }
    `}</style>
    );
}

interface CorvenLogoProps {
    size?: number;
    showName?: boolean;
}

function CorvenLogo({
    size = 88,
    showName = true,
}: CorvenLogoProps) {
    return (
        <div className="flex flex-col items-center">
            <img
                src="/assets/corven-icon.png"
                alt="Corven IDE logo"
                width={size}
                height={size}
                className="cv-logo-glow object-contain"
            />

            {showName && (
                <div className="mt-4">
                    <h2 className="cv-display text-2xl font-bold tracking-[0.18em] text-[#F5F3EE]">
                        CORVEN
                    </h2>

                    <p className="mt-1 cv-mono text-[10px] tracking-[0.16em] text-[#5C6169]">
                        CKB CLOUD IDE
                    </p>
                </div>
            )}
        </div>
    );
}

function WalletAuthContent({
    onAuthenticated,
}: AuthViewProps) {
    const {
        open,
        close,
        isOpen,
    } = ccc.useCcc();

    const signer = ccc.useSigner();

    const {
        user,
        isAuthenticated,
        walletLogin,
        logout,
    } = useAuth();

    const [walletAddress, setWalletAddress] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isAuthenticating, setIsAuthenticating] = useState(false);
    const [isCopying, setIsCopying] = useState(false);
    const [isConnecting, setIsConnecting] = useState(false);

    useEffect(() => {
        let cancelled = false;

        async function loadWalletAddress() {
            if (!signer) {
                setWalletAddress('');
                return;
            }

            try {
                const address = await signer.getRecommendedAddress();

                if (!cancelled) {
                    setWalletAddress(address);
                }
            } catch (caughtError) {
                if (!cancelled) {
                    const message =
                        caughtError instanceof Error
                            ? caughtError.message
                            : 'Unable to read the wallet address.';

                    setError(message);
                    setWalletAddress('');
                }
            }
        }

        void loadWalletAddress();

        return () => {
            cancelled = true;
        };
    }, [signer]);

    useEffect(() => {
        if (!isOpen && isConnecting) {
            setIsConnecting(false);
        }
    }, [isOpen, isConnecting]);

    const handleConnectWallet = useCallback(async () => {
        setError('');
        setSuccess('');
        setIsConnecting(true);

        try {
            await open();
        } catch (caughtError) {
            const message =
                caughtError instanceof Error
                    ? caughtError.message
                    : 'Failed to connect wallet.';

            setError(message);
            setIsConnecting(false);
        }
    }, [open]);

    const handleWalletLogin = useCallback(async () => {
        if (!signer || !walletAddress) {
            setError('Please connect a wallet first.');
            return;
        }

        setIsAuthenticating(true);
        setError('');
        setSuccess('');

        try {
            const challenge = await authApi.createWalletChallenge({
                walletAddress,
            });

            const signature = await signer.signMessage(
                challenge.message,
            );

            await walletLogin({
                walletAddress,
                challengeId: challenge.challengeId,
                signature,
            });

            setSuccess('Wallet authenticated successfully.');

            onAuthenticated?.();

            if (isOpen) {
                close();
            }
        } catch (caughtError) {
            const message =
                caughtError instanceof Error
                    ? caughtError.message
                    : 'Wallet authentication failed.';

            setError(message);
        } finally {
            setIsAuthenticating(false);
        }
    }, [
        signer,
        walletAddress,
        walletLogin,
        onAuthenticated,
        isOpen,
        close,
    ]);

    const handleCopyAddress = async () => {
        if (!walletAddress) {
            return;
        }

        setError('');
        setSuccess('');

        try {
            setIsCopying(true);

            await navigator.clipboard.writeText(walletAddress);

            setSuccess('Wallet address copied.');
        } catch {
            setError('Unable to copy the wallet address.');
        } finally {
            setIsCopying(false);
        }
    };

    const handleLogout = useCallback(() => {
        logout();
        setWalletAddress('');
        setError('');
        setSuccess('Logged out successfully.');
    }, [logout]);

    if (isAuthenticated && user) {
        const authenticatedAddress =
            walletAddress ||
            user.walletAddress ||
            '';

        return (
            <div
                className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#0A0B0D] p-4"
                style={connectorStyles}
            >
                <BrandStyles />

                <div className="pointer-events-none absolute inset-0 cv-grid-bg [mask-image:radial-gradient(ellipse_60%_50%_at_50%_30%,black,transparent)]" />

                <div className="pointer-events-none absolute left-1/2 top-[-160px] h-[380px] w-[380px] -translate-x-1/2 rounded-full bg-[#3E63DD]/10 blur-[120px]" />

                <div className="relative w-full max-w-md rounded-xl border border-[#262A30] bg-[#0D0F12]/95 px-8 pb-8 pt-8 shadow-2xl backdrop-blur">
                    <div className="mb-7 text-center">
                        <CorvenLogo
                            size={76}
                            showName={false}
                        />

                        <h1 className="mt-5 cv-display text-xl font-semibold text-[#F5F3EE]">
                            Welcome back
                        </h1>

                        <p className="mt-2 cv-mono text-xs text-[#8A8F98]">
                            {user.email ||
                                shortenAddress(authenticatedAddress) ||
                                'Authenticated user'}
                        </p>
                    </div>

                    {success && (
                        <div className="mb-4 flex items-start gap-2 rounded border border-[#4FD1C5]/25 bg-[#4FD1C5]/10 p-3 text-xs text-[#4FD1C5]">
                            <CheckCircle className="mt-0.5 h-4 w-4 shrink-0" />

                            <span>{success}</span>
                        </div>
                    )}

                    {error && (
                        <div className="mb-4 flex items-start gap-2 rounded border border-[#E5697A]/25 bg-[#E5697A]/10 p-3 text-xs text-[#E5697A]">
                            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />

                            <span>{error}</span>
                        </div>
                    )}

                    <div className="space-y-4">
                        {authenticatedAddress && (
                            <div className="rounded border border-[#1B1E23] bg-[#121417] p-4">
                                <p className="mb-2 cv-mono text-[11px] tracking-wide text-[#5C6169]">
                                    CONNECTED WALLET
                                </p>

                                <div className="flex items-center justify-between gap-3">
                                    <code
                                        className="min-w-0 truncate cv-mono text-sm text-[#E7E4DC]"
                                        title={authenticatedAddress}
                                    >
                                        {shortenAddress(authenticatedAddress)}
                                    </code>

                                    <button
                                        type="button"
                                        onClick={handleCopyAddress}
                                        disabled={
                                            !walletAddress ||
                                            isCopying
                                        }
                                        className="rounded p-2 text-[#5C6169] transition hover:bg-[#1B1E23] hover:text-[#F5F3EE] disabled:cursor-not-allowed disabled:opacity-50"
                                        aria-label="Copy wallet address"
                                    >
                                        {isCopying ? (
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                        ) : (
                                            <Copy className="h-4 w-4" />
                                        )}
                                    </button>
                                </div>
                            </div>
                        )}

                        <button
                            type="button"
                            onClick={handleLogout}
                            className="flex w-full items-center justify-center gap-2 rounded border border-[#262A30] bg-[#121417] px-4 py-3 text-sm font-semibold text-[#C7C4BC] transition hover:border-[#3E63DD]/40 hover:bg-[#1B1E23] hover:text-[#F5F3EE]"
                        >
                            <LogOut className="h-4 w-4" />

                            Sign out
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div
            className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#0A0B0D] p-4"
            style={connectorStyles}
        >
            <BrandStyles />

            <div className="pointer-events-none absolute inset-0 cv-grid-bg [mask-image:radial-gradient(ellipse_60%_50%_at_50%_30%,black,transparent)]" />

            <div className="pointer-events-none absolute left-1/2 top-[-150px] h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-[#3E63DD]/10 blur-[130px]" />

            <div className="pointer-events-none absolute bottom-[-220px] right-[-120px] h-[420px] w-[420px] rounded-full bg-[#7C3AED]/10 blur-[150px]" />

            <div className="relative w-full max-w-md rounded-xl border border-[#262A30] bg-[#0D0F12]/95 px-8 pb-8 pt-8 shadow-2xl backdrop-blur">
                <div className="mb-7 text-center">
                    <CorvenLogo size={200} showName={false} />

                    <div className="mt-7 border-t border-[#1B1E23] pt-6">
                        <h1 className="cv-display text-xl font-semibold text-[#F5F3EE]">
                            Sign in with your wallet
                        </h1>

                        <p className="mt-2 text-sm leading-6 text-[#8A8F98]">
                            Connect a CKB wallet and sign a secure
                            authentication message.
                        </p>
                    </div>
                </div>

                {error && (
                    <div className="mb-4 flex items-start gap-2 rounded border border-[#E5697A]/25 bg-[#E5697A]/10 p-3 text-xs text-[#E5697A]">
                        <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />

                        <span>{error}</span>
                    </div>
                )}

                {success && (
                    <div className="mb-4 flex items-start gap-2 rounded border border-[#4FD1C5]/25 bg-[#4FD1C5]/10 p-3 text-xs text-[#4FD1C5]">
                        <CheckCircle className="mt-0.5 h-4 w-4 shrink-0" />

                        <span>{success}</span>
                    </div>
                )}

                {!signer ? (
                    <button
                        type="button"
                        onClick={handleConnectWallet}
                        disabled={isConnecting}
                        className="flex w-full items-center justify-center gap-2 rounded bg-[#3E63DD] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#527AF0] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {isConnecting ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin" />

                                Connecting...
                            </>
                        ) : (
                            <>
                                <Wallet className="h-4 w-4" />

                                Connect wallet
                            </>
                        )}
                    </button>
                ) : (
                    <div className="space-y-4">
                        <div className="rounded border border-[#1B1E23] bg-[#121417] p-4">
                            <p className="mb-2 cv-mono text-[11px] tracking-wide text-[#5C6169]">
                                CONNECTED WALLET
                            </p>

                            <div className="flex items-center justify-between gap-3">
                                <code
                                    className="min-w-0 truncate cv-mono text-sm text-[#E7E4DC]"
                                    title={walletAddress}
                                >
                                    {walletAddress
                                        ? shortenAddress(walletAddress)
                                        : 'Loading address...'}
                                </code>

                                <button
                                    type="button"
                                    onClick={handleCopyAddress}
                                    disabled={
                                        !walletAddress ||
                                        isCopying
                                    }
                                    className="rounded p-2 text-[#5C6169] transition hover:bg-[#1B1E23] hover:text-[#F5F3EE] disabled:cursor-not-allowed disabled:opacity-50"
                                    aria-label="Copy wallet address"
                                >
                                    {isCopying ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                        <Copy className="h-4 w-4" />
                                    )}
                                </button>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={handleWalletLogin}
                            disabled={
                                !walletAddress ||
                                isAuthenticating
                            }
                            className="flex w-full items-center justify-center gap-2 rounded bg-[#3E63DD] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#527AF0] disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {isAuthenticating ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin" />

                                    Waiting for signature...
                                </>
                            ) : (
                                <>
                                    <Wallet className="h-4 w-4" />

                                    Sign in with wallet
                                </>
                            )}
                        </button>

                        <button
                            type="button"
                            onClick={handleConnectWallet}
                            disabled={isConnecting}
                            className="flex w-full items-center justify-center gap-2 rounded border border-[#262A30] bg-[#121417] px-4 py-2.5 text-xs font-semibold text-[#C7C4BC] transition hover:border-[#3E63DD]/40 hover:bg-[#1B1E23] hover:text-[#F5F3EE] disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {isConnecting ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <Wallet className="h-4 w-4" />
                            )}

                            Change wallet
                        </button>
                    </div>
                )}

                <p className="mt-6 text-center cv-mono text-[10px] leading-5 text-[#5C6169]">
                    Your wallet remains under your control.
                    <br />
                    Corven never stores private keys.
                </p>
            </div>
        </div>
    );
}

export default function AuthView(
    props: AuthViewProps,
) {
    return (
        <WalletAuthContent {...props} />
    );
}