'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
    Bot,
    Sparkles,
    Zap,
    Cpu,
    ChevronDown,
    Send,
    MessageSquare,
    Clock,
} from 'lucide-react';

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
}

interface AIModel {
    id: string;
    name: string;
    provider: string;
    icon: React.ReactNode;
    description: string;
    available: boolean;
    comingSoon?: boolean;
}

const AVAILABLE_MODELS: AIModel[] = [
    {
        id: 'claude-3-opus',
        name: 'Claude 3 Opus',
        provider: 'Anthropic',
        icon: <Bot className="h-4 w-4" />,
        description: 'Most powerful model for complex tasks',
        available: false,
        comingSoon: true,
    },
    {
        id: 'claude-3-sonnet',
        name: 'Claude 3 Sonnet',
        provider: 'Anthropic',
        icon: <Bot className="h-4 w-4" />,
        description: 'Balanced performance and speed',
        available: false,
        comingSoon: true,
    },
    {
        id: 'claude-3-haiku',
        name: 'Claude 3 Haiku',
        provider: 'Anthropic',
        icon: <Bot className="h-4 w-4" />,
        description: 'Fastest model for quick responses',
        available: false,
        comingSoon: true,
    },
    {
        id: 'gpt-4-turbo',
        name: 'GPT-4 Turbo',
        provider: 'OpenAI',
        icon: <Cpu className="h-4 w-4" />,
        description: 'Advanced reasoning and creativity',
        available: false,
        comingSoon: true,
    },
    {
        id: 'gpt-3.5-turbo',
        name: 'GPT-3.5 Turbo',
        provider: 'OpenAI',
        icon: <Cpu className="h-4 w-4" />,
        description: 'Fast and efficient for most tasks',
        available: false,
        comingSoon: true,
    },
    {
        id: 'gemini-pro',
        name: 'Gemini Pro',
        provider: 'Google',
        icon: <Sparkles className="h-4 w-4" />,
        description: 'Multimodal capabilities',
        available: false,
        comingSoon: true,
    },
];

export function AIPanel() {
    const [selectedModel, setSelectedModel] = useState<string>(AVAILABLE_MODELS[0].id);
    const [isModelDropdownOpen, setIsModelDropdownOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            id: 'welcome',
            role: 'assistant',
            content: '👋 Welcome! AI assistance is coming soon. We\'re integrating powerful models like Claude, GPT-4, and Gemini to help you code faster. Stay tuned!',
            timestamp: new Date(),
        },
    ]);
    const [inputMessage, setInputMessage] = useState('');

    const selectedModelData = AVAILABLE_MODELS.find(m => m.id === selectedModel);

    const handleSendMessage = () => {
        if (!inputMessage.trim()) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: inputMessage,
            timestamp: new Date(),
        };

        setMessages(prev => [...prev, userMessage]);
        setInputMessage('');

        // Simulate AI response (coming soon)
        setTimeout(() => {
            const assistantMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: `🚀 Thanks for your message! Full AI integration is coming soon. We're working on integrating ${selectedModelData?.name} and other models to provide you with the best coding assistance.`,
                timestamp: new Date(),
            };
            setMessages(prev => [...prev, assistantMessage]);
        }, 1000);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    return (
        <div className="flex h-full flex-col bg-[#161b22]">
            {/* Header */}
            <div className="shrink-0 border-b border-[#30363d] px-4 py-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-yellow-500" />
                        <span className="text-sm font-semibold text-gray-200">
                            AI
                        </span>

                    </div>
                    <div className="relative">
                        <button
                            type="button"
                            onClick={() => setIsModelDropdownOpen(!isModelDropdownOpen)}
                            className="flex items-center gap-2 rounded-md border border-[#30363d] bg-[#0d1117] px-3 py-1.5 text-xs text-gray-300 transition hover:border-[#58a6ff] hover:bg-[#1c2333]"
                        >
                            {selectedModelData?.icon}
                            <span>{selectedModelData?.name}</span>
                            <ChevronDown className="h-3 w-3" />
                        </button>

                        {isModelDropdownOpen && (
                            <div className="absolute right-0 top-full z-50 mt-1 w-64 rounded-md border border-[#30363d] bg-[#0d1117] shadow-xl">
                                <div className="max-h-80 overflow-y-auto p-1">
                                    {AVAILABLE_MODELS.map((model) => (
                                        <button
                                            key={model.id}
                                            type="button"
                                            onClick={() => {
                                                setSelectedModel(model.id);
                                                setIsModelDropdownOpen(false);
                                            }}
                                            className={`flex w-full items-start gap-3 rounded-md px-3 py-2 text-left transition ${selectedModel === model.id
                                                ? 'bg-[#1c2333]'
                                                : 'hover:bg-[#161b22]'
                                                }`}
                                        >
                                            <div className="mt-0.5 text-gray-400">
                                                {model.icon}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs font-medium text-gray-200">
                                                        {model.name}
                                                    </span>
                                                    {model.comingSoon && (
                                                        <span className="rounded-full bg-yellow-500/10 px-1.5 py-0.5 text-[8px] font-medium text-yellow-500">
                                                            Soon
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[10px] text-gray-500">
                                                        {model.provider}
                                                    </span>
                                                    <span className="text-[10px] text-gray-600">•</span>
                                                    <span className="text-[10px] text-gray-500">
                                                        {model.description}
                                                    </span>
                                                </div>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                    <div
                        key={message.id}
                        className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''
                            }`}
                    >
                        <div
                            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${message.role === 'user'
                                ? 'bg-blue-500/20 text-blue-400'
                                : 'bg-yellow-500/20 text-yellow-400'
                                }`}
                        >
                            {message.role === 'user' ? (
                                <span className="text-xs font-medium">U</span>
                            ) : (
                                <Sparkles className="h-4 w-4" />
                            )}
                        </div>
                        <div
                            className={`max-w-[85%] rounded-lg px-4 py-2 ${message.role === 'user'
                                ? 'bg-[#1c2333] text-gray-200'
                                : 'bg-[#0d1117] text-gray-300'
                                }`}
                        >
                            <div className="text-sm whitespace-pre-wrap">
                                {message.content}
                            </div>
                            <div className="mt-1 flex items-center gap-2">
                                <Clock className="h-3 w-3 text-gray-600" />
                                <span className="text-[10px] text-gray-600">
                                    {message.timestamp.toLocaleTimeString()}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}

                {/* Coming Soon Banner */}
                <div className="rounded-lg border border-dashed border-yellow-500/30 bg-yellow-500/5 p-4">
                    <div className="flex items-center gap-2">
                        <Zap className="h-4 w-4 text-yellow-500" />
                        <span className="text-xs text-gray-400">
                            🚀 Full AI integration coming soon! Support for Claude, GPT-4, Gemini, and more.
                        </span>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2">
                        {AVAILABLE_MODELS.slice(0, 3).map((model) => (
                            <span
                                key={model.id}
                                className="rounded-full bg-[#1c2333] px-2 py-0.5 text-[10px] text-gray-400"
                            >
                                {model.name}
                            </span>
                        ))}
                        <span className="rounded-full bg-[#1c2333] px-2 py-0.5 text-[10px] text-gray-400">
                            +{AVAILABLE_MODELS.length - 3} more
                        </span>
                    </div>
                </div>
            </div>

            {/* Input */}
            <div className="shrink-0 border-t border-[#30363d] p-3">
                <div className="flex items-end gap-2">
                    <div className="flex-1">
                        <input
                            type="text"
                            value={inputMessage}
                            onChange={(e) => setInputMessage(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Ask about your code (coming soon)..."
                            disabled
                            className="w-full rounded-md border border-[#30363d] bg-[#0d1117] px-3 py-2 text-sm text-gray-200 placeholder-gray-500 outline-none transition focus:border-[#58a6ff] disabled:cursor-not-allowed disabled:opacity-50"
                        />
                    </div>
                    <button
                        type="button"
                        onClick={handleSendMessage}
                        disabled={!inputMessage.trim()}
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-[#1c2333] text-gray-400 transition hover:bg-[#2d3748] hover:text-gray-200 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <Send className="h-4 w-4" />
                    </button>
                </div>
                <div className="mt-2 flex items-center gap-2">
                    <MessageSquare className="h-3 w-3 text-gray-600" />
                    <span className="text-[10px] text-gray-600">
                        AI features currently in development
                    </span>
                </div>
            </div>
        </div>
    );
}