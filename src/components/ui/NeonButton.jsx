import { motion } from 'framer-motion';

export default function NeonButton({
  children,
  onClick,
  color = '#FF2D78',
  size = 'md',
  disabled = false,
  className = '',
  id,
  type = 'button',
}) {
  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
    xl: 'px-10 py-5 text-xl',
  };

  return (
    <motion.button
      id={id}
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        relative font-display font-bold rounded-xl
        ${sizes[size]}
        ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
      style={{
        background: `linear-gradient(135deg, ${color}22, ${color}44)`,
        border: `2px solid ${color}`,
        color: '#F0F0FF',
        boxShadow: disabled ? 'none' : `0 0 20px ${color}40, inset 0 0 20px ${color}10`,
      }}
      whileHover={disabled ? {} : {
        scale: 1.05,
        boxShadow: `0 0 30px ${color}60, inset 0 0 30px ${color}20`,
      }}
      whileTap={disabled ? {} : { scale: 0.92 }}
      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
    >
      {children}
    </motion.button>
  );
}
