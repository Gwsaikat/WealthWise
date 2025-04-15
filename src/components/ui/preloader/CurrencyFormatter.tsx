import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useUser } from '../../../context/UserContext';
import { formatCurrency } from '../../../lib/utils';

interface CurrencyFormatterProps {
  value: number;
  className?: string;
  showSymbol?: boolean;
  animated?: boolean;
  bold?: boolean;
}

const CurrencyFormatter: React.FC<CurrencyFormatterProps> = ({
  value,
  className = "",
  showSymbol = true,
  animated = true,
  bold = false
}) => {
  const { currency } = useUser();
  const [isHovered, setIsHovered] = useState(false);
  
  const formattedValue = formatCurrency(value, currency);
  
  // Handle cases where the currency is still being detected
  if (!currency.code) {
    return <span className={className}>{value.toFixed(2)}</span>;
  }
  
  if (!animated) {
    return (
      <span className={`${className} ${bold ? 'font-bold' : ''}`}>
        {formattedValue}
      </span>
    );
  }

  return (
    <motion.span
      className={`${className} ${bold ? 'font-bold' : ''} inline-block`}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      animate={isHovered ? {
        scale: 1.05,
        color: '#FACC15',
        transition: { duration: 0.3 }
      } : {}}
    >
      {formattedValue}
      {isHovered && (
        <motion.span
          className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-yellow-400 to-amber-600"
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: '100%', opacity: 1 }}
          exit={{ width: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
        />
      )}
    </motion.span>
  );
};

export default CurrencyFormatter; 