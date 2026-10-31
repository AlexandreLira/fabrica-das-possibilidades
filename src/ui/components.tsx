import type { ButtonHTMLAttributes, PropsWithChildren } from 'react';
import bot from '../assets/bot.svg';
export function PixelButton({ className = '', ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button {...props} className={`pixel-button ${className}`} />;
}
export function Panel({ children, className = '' }: PropsWithChildren<{ className?: string }>) {
  return <section className={`panel ${className}`}>{children}</section>;
}
export function BotPortrait({ className = '' }: { className?: string }) {
  return <img src={bot} width="96" height="112" alt="" className={`bot-portrait ${className}`} />;
}
export function BotBubble({ children }: PropsWithChildren) {
  return <div className="bot-bubble"><span className="eyebrow">B.O.T. · seu guia</span><p>{children}</p></div>;
}
