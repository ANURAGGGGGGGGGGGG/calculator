'use client';
import { useState, useEffect } from 'react';

export default function Calculator() {
  const [display, setDisplay] = useState('0');
  const [firstOperand, setFirstOperand] = useState(null);
  const [operator, setOperator] = useState(null);
  const [waitingForSecondOperand, setWaitingForSecondOperand] = useState(false);
  const [equation, setEquation] = useState('');
  const [hasFocus, setHasFocus] = useState(false);

  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (!hasFocus) return;

      if (
        /[0-9+\-*/=.]/.test(event.key) || 
        event.key === 'Enter' || 
        event.key === 'Escape' || 
        event.key === 'Backspace'
      ) {
        event.preventDefault();
      }

      // Handle numeric inputs
      if (/[0-9]/.test(event.key)) {
        inputDigit(parseInt(event.key, 10));
      }
      // Handle operators
      else if (event.key === '+') {
        performOperation('+');
      }
      else if (event.key === '-') {
        performOperation('-');
      }
      else if (event.key === '*') {
        performOperation('*');
      }
      else if (event.key === '/') {
        performOperation('/');
      }
      // Handle decimal
      else if (event.key === '.') {
        inputDecimal();
      }
      // Handle equals and Enter
      else if (event.key === '=' || event.key === 'Enter') {
        handleEquals();
      }
      // Handle clear with Escape
      else if (event.key === 'Escape') {
        clearDisplay();
      }
      // Handle backspace
      else if (event.key === 'Backspace') {
        handleBackspace();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    
    // Cleanup
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [display, firstOperand, operator, waitingForSecondOperand, hasFocus]);

  const handleBackspace = () => {
    if (display.length > 1) {
      setDisplay(display.slice(0, -1));
    } else {
      setDisplay('0');
    }
  };

  const inputDigit = (digit) => {
    if (waitingForSecondOperand) {
      setDisplay(String(digit));
      setWaitingForSecondOperand(false);
    } else {
      setDisplay(display === '0' ? String(digit) : display + digit);
    }
  };

  const inputDecimal = () => {
    if (waitingForSecondOperand) {
      setDisplay('0.');
      setWaitingForSecondOperand(false);
      return;
    }

    if (!display.includes('.')) {
      setDisplay(display + '.');
    }
  };

  const clearDisplay = () => {
    setDisplay('0');
    setFirstOperand(null);
    setOperator(null);
    setWaitingForSecondOperand(false);
    setEquation('');
  };

  const performOperation = (nextOperator) => {
    const inputValue = parseFloat(display);
    
    let operatorSymbol;
    switch(nextOperator) {
      case '+': operatorSymbol = ' + '; break;
      case '-': operatorSymbol = ' - '; break;
      case '*': operatorSymbol = ' × '; break;
      case '/': operatorSymbol = ' ÷ '; break;
      default: operatorSymbol = '';
    }

    if (firstOperand === null) {
      setFirstOperand(inputValue);
      setEquation(display + operatorSymbol);
    } else if (operator) {
      const result = calculate(firstOperand, inputValue, operator);
      setDisplay(String(result));
      setFirstOperand(result);
      setEquation(String(result) + operatorSymbol);
    }

    setWaitingForSecondOperand(true);
    setOperator(nextOperator);
  };

  const calculate = (firstOperand, secondOperand, operator) => {
    switch (operator) {
      case '+':
        return firstOperand + secondOperand;
      case '-':
        return firstOperand - secondOperand;
      case '*':
        return firstOperand * secondOperand;
      case '/':
        return secondOperand === 0 ? 'Error' : firstOperand / secondOperand;
      default:
        return secondOperand;
    }
  };

  const handleEquals = () => {
    if (operator === null || waitingForSecondOperand) {
      return;
    }

    const inputValue = parseFloat(display);
    const result = calculate(firstOperand, inputValue, operator);
    
    const operatorSymbol = operator === '+' ? ' + ' : 
                          operator === '-' ? ' - ' : 
                          operator === '*' ? ' × ' : ' ÷ ';
    
    setEquation(String(firstOperand) + operatorSymbol + display + ' = ');
    setDisplay(String(result));
    setFirstOperand(result);
    setOperator(null);
    setWaitingForSecondOperand(false);
  };

  // Helper function to determine button styles for operators
  const getOperatorButtonClass = (op) => {
    const baseClass = "p-4 rounded-md text-xl";
    if (operator === op && !waitingForSecondOperand) {
      return `${baseClass} bg-blue-700 text-white font-bold`;
    }
    return `${baseClass} bg-blue-500 hover:bg-blue-600 text-white`;
  };

  return (
    <div 
      className="flex flex-col items-center justify-center min-h-screen bg-gray-100"
      tabIndex={0}
      onFocus={() => setHasFocus(true)}
      onBlur={() => setHasFocus(false)}
    >
      <div className={`w-80 bg-white rounded-lg shadow-lg overflow-hidden ${hasFocus ? 'ring-2 ring-blue-500' : ''}`}>
        <div className="p-4">
          <h1 className="text-2xl font-bold text-center mb-4">Next.js Calculator</h1>
          <div className="bg-gray-800 p-4 rounded-md mb-4">
            <div className="text-right text-gray-400 font-mono text-sm h-6 flex items-center justify-end overflow-hidden">
              {equation}
            </div>
            <div className="text-right text-white font-mono text-2xl h-10 flex items-center justify-end overflow-hidden">
              {display}
            </div>
          </div>
          
          <div className="grid grid-cols-4 gap-2">
            <button 
              className="bg-red-500 hover:bg-red-600 text-white p-4 rounded-md text-xl"
              onClick={clearDisplay}
            >
              C
            </button>
            <button 
              className="bg-gray-300 text-black hover:bg-gray-400 p-4 rounded-md text-xl col-span-2"
              onClick={handleBackspace}
            >
              ⌫
            </button>
            <button 
              className={getOperatorButtonClass('/')}
              onClick={() => performOperation('/')}
            >
              ÷
            </button>
            
            {/* Numbers */}
            <button 
              className="bg-gray-200 text-black hover:bg-gray-300 p-4 rounded-md text-xl"
              onClick={() => inputDigit(7)}
            >
              7
            </button>
            <button 
              className="bg-gray-200 text-black hover:bg-gray-300 p-4 rounded-md text-xl"
              onClick={() => inputDigit(8)}
            >
              8
            </button>
            <button 
              className="bg-gray-200 text-black hover:bg-gray-300 p-4 rounded-md text-xl"
              onClick={() => inputDigit(9)}
            >
              9
            </button>
            <button 
              className={getOperatorButtonClass('*')}
              onClick={() => performOperation('*')}
            >
              ×
            </button>
            
            <button 
              className="bg-gray-200 text-black hover:bg-gray-300 p-4 rounded-md text-xl"
              onClick={() => inputDigit(4)}
            >
              4
            </button>
            <button 
              className="bg-gray-200 text-black hover:bg-gray-300 p-4 rounded-md text-xl"
              onClick={() => inputDigit(5)}
            >
              5
            </button>
            <button 
              className="bg-gray-200 text-black hover:bg-gray-300 p-4 rounded-md text-xl"
              onClick={() => inputDigit(6)}
            >
              6
            </button>
            <button 
              className={getOperatorButtonClass('-')}
              onClick={() => performOperation('-')}
            >
              -
            </button>
            
            <button 
              className="bg-gray-200 text-black hover:bg-gray-300 p-4 rounded-md text-xl"
              onClick={() => inputDigit(1)}
            >
              1
            </button>
            <button 
              className="bg-gray-200 text-black hover:bg-gray-300 p-4 rounded-md text-xl"
              onClick={() => inputDigit(2)}
            >
              2
            </button>
            <button 
              className="bg-gray-200 text-black hover:bg-gray-300 p-4 rounded-md text-xl"
              onClick={() => inputDigit(3)}
            >
              3
            </button>
            <button 
              className={getOperatorButtonClass('+')}
              onClick={() => performOperation('+')}
            >
              +
            </button>
            
            <button 
              className="bg-gray-200 text-black hover:bg-gray-300 p-4 rounded-md text-xl col-span-2"
              onClick={() => inputDigit(0)}
            >
              0
            </button>
            <button 
              className="bg-gray-200 text-black hover:bg-gray-300 p-4 rounded-md text-xl"
              onClick={inputDecimal}
            >
              .
            </button>
            <button 
              className="bg-green-500 hover:bg-green-600 text-white p-4 rounded-md text-xl"
              onClick={handleEquals}
            >
              =
            </button>
          </div>
          
          <div className="mt-4 p-2 bg-gray-100 rounded-md text-sm text-gray-600">
            <p className="font-medium">Keyboard Shortcuts:</p>
            <p>Numbers (0-9), Operators (+, -, *, /)</p>
            <p>Decimal (.), Equals (= or Enter)</p>
            <p>Clear (Esc), Backspace (⌫)</p>
          </div>
        </div>
      </div>
      <p className="mt-4 text-gray-600 text-sm">Created with Next.js</p>
    </div>
  );
}