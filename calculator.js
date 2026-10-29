/**
 * Eli 🌸 | High-Precision Scientific Calculator Engine
 * Full Scientific Functionality, Degree/Radian, Memory, History & Keyboard Support
 */

class ScientificCalculator {
  constructor(options = {}) {
    this.expression = '';
    this.currentValue = '0';
    this.lastResult = null;
    this.angleMode = 'DEG'; // 'DEG' or 'RAD'
    this.isSecond = false;  // 2nd function active
    this.isHyp = false;     // Hyperbolic functions active
    this.memory = 0;
    this.justCalculated = false;
    this.history = this.loadHistory();

    // Callbacks
    this.onUpdate = options.onUpdate || (() => {});
    this.onCalculate = options.onCalculate || (() => {});
    this.onHistoryChange = options.onHistoryChange || (() => {});
    this.onMemoryChange = options.onMemoryChange || (() => {});
    this.playAudio = options.playAudio || (() => {});
  }

  loadHistory() {
    try {
      const saved = localStorage.getItem('eli_calc_history');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  }

  saveHistory() {
    try {
      localStorage.setItem('eli_calc_history', JSON.stringify(this.history.slice(0, 50)));
    } catch (e) {
      console.warn('Could not save history to localStorage', e);
    }
  }

  clearHistory() {
    this.history = [];
    this.saveHistory();
    this.onHistoryChange(this.history);
  }

  toggleAngleMode() {
    this.angleMode = this.angleMode === 'DEG' ? 'RAD' : 'DEG';
    this.playAudio('pop');
    this.onUpdate();
  }

  toggleSecond() {
    this.isSecond = !this.isSecond;
    this.playAudio('soft');
    this.updateFunctionKeyLabels();
    this.onUpdate();
  }

  toggleHyp() {
    this.isHyp = !this.isHyp;
    this.playAudio('soft');
    this.updateFunctionKeyLabels();
    this.onUpdate();
  }

  updateFunctionKeyLabels() {
    const btnSin = document.getElementById('btn-sin');
    const btnCos = document.getElementById('btn-cos');
    const btnTan = document.getElementById('btn-tan');
    const btnLn = document.getElementById('btn-ln');
    const btnLog = document.getElementById('btn-log');
    const btnSqrt = document.getElementById('btn-sqrt');
    const btnSqr = document.getElementById('btn-sqr');

    if (btnSin) {
      if (this.isHyp) {
        btnSin.textContent = this.isSecond ? 'asinh' : 'sinh';
      } else {
        btnSin.textContent = this.isSecond ? 'asin' : 'sin';
      }
    }

    if (btnCos) {
      if (this.isHyp) {
        btnCos.textContent = this.isSecond ? 'acosh' : 'cosh';
      } else {
        btnCos.textContent = this.isSecond ? 'acos' : 'cos';
      }
    }

    if (btnTan) {
      if (this.isHyp) {
        btnTan.textContent = this.isSecond ? 'atanh' : 'tanh';
      } else {
        btnTan.textContent = this.isSecond ? 'atan' : 'tan';
      }
    }

    if (btnLn) btnLn.textContent = this.isSecond ? 'eˣ' : 'ln';
    if (btnLog) btnLog.textContent = this.isSecond ? '10ˣ' : 'log';
    if (btnSqrt) btnSqrt.textContent = this.isSecond ? '³√x' : '√x';
    if (btnSqr) btnSqr.textContent = this.isSecond ? 'x³' : 'x²';

    const badge2nd = document.getElementById('badge-2nd');
    const badgeHyp = document.getElementById('badge-hyp');
    if (badge2nd) badge2nd.className = `calc-mode-pill ${this.isSecond ? 'active' : 'inactive'}`;
    if (badgeHyp) badgeHyp.className = `calc-mode-pill ${this.isHyp ? 'active' : 'inactive'}`;
  }

  // --- Digit & Decimal Input ---
  inputDigit(digit) {
    this.playAudio('click');
    if (this.justCalculated) {
      this.currentValue = String(digit);
      this.expression = '';
      this.justCalculated = false;
    } else {
      if (this.currentValue === '0' || this.currentValue === 'Erro') {
        this.currentValue = String(digit);
      } else {
        this.currentValue += String(digit);
      }
    }
    this.onUpdate();
  }

  inputDot() {
    this.playAudio('click');
    if (this.justCalculated) {
      this.currentValue = '0.';
      this.expression = '';
      this.justCalculated = false;
    } else {
      if (!this.currentValue.includes('.')) {
        this.currentValue += '.';
      }
    }
    this.onUpdate();
  }

  // --- Operators (+, -, *, /, ^, mod) ---
  inputOperator(op) {
    this.playAudio('pop');
    let symbol = op;
    if (op === '*') symbol = '×';
    if (op === '/') symbol = '÷';
    if (op === '-') symbol = '−';

    if (this.justCalculated) {
      this.expression = `${this.currentValue} ${symbol} `;
      this.currentValue = '0';
      this.justCalculated = false;
    } else {
      if (this.currentValue !== '0' || this.expression === '') {
        this.expression += `${this.currentValue} ${symbol} `;
        this.currentValue = '0';
      } else if (this.expression.length > 0) {
        // Replace last operator if already ended in operator
        this.expression = this.expression.replace(/[\+\−\×\÷\^]\s*$/, `${symbol} `);
      }
    }
    this.onUpdate();
  }

  // --- Clear & Backspace ---
  clearAll() {
    this.playAudio('clear');
    this.expression = '';
    this.currentValue = '0';
    this.justCalculated = false;
    this.onUpdate();
  }

  backspace() {
    this.playAudio('click');
    if (this.justCalculated) {
      this.expression = '';
      this.justCalculated = false;
      this.onUpdate();
      return;
    }

    if (this.currentValue.length > 1) {
      this.currentValue = this.currentValue.slice(0, -1);
    } else {
      this.currentValue = '0';
    }
    this.onUpdate();
  }

  negate() {
    this.playAudio('click');
    if (this.currentValue === '0' || this.currentValue === 'Erro') return;
    if (this.currentValue.startsWith('-')) {
      this.currentValue = this.currentValue.slice(1);
    } else {
      this.currentValue = '-' + this.currentValue;
    }
    this.onUpdate();
  }

  // --- Constants (pi, e, Ans) ---
  inputConstant(name) {
    this.playAudio('pop');
    let val = 0;
    if (name === 'pi') val = Math.PI;
    if (name === 'e') val = Math.E;
    if (name === 'ans') {
      if (this.lastResult === null) return;
      val = this.lastResult;
    }
    this.currentValue = String(this.formatNumber(val));
    this.justCalculated = false;
    this.onUpdate();
  }

  inputRandom() {
    this.playAudio('pop');
    const rnd = Math.random();
    this.currentValue = String(this.formatNumber(rnd));
    this.justCalculated = false;
    this.onUpdate();
  }

  inputParenthesis(p) {
    this.playAudio('pop');
    if (p === '(') {
      if (this.justCalculated) {
        this.expression = '( ';
        this.currentValue = '0';
        this.justCalculated = false;
      } else {
        this.expression += '( ';
      }
    } else if (p === ')') {
      this.expression += `${this.currentValue} ) `;
      this.currentValue = '0';
    }
    this.onUpdate();
  }

  // --- Scientific Unary Functions ---
  executeFunction(funcName) {
    this.playAudio('chime');
    let val = parseFloat(this.currentValue);
    if (isNaN(val)) return;

    let res = 0;
    let desc = '';

    try {
      switch (funcName) {
        case 'sin':
          if (this.isHyp) {
            res = this.isSecond ? Math.asinh(val) : Math.sinh(val);
            desc = this.isSecond ? `asinh(${val})` : `sinh(${val})`;
          } else {
            if (this.isSecond) {
              if (val < -1 || val > 1) throw new Error('Domínio inválido');
              res = Math.asin(val);
              if (this.angleMode === 'DEG') res = (res * 180) / Math.PI;
              desc = `asin(${val})`;
            } else {
              const rad = this.angleMode === 'DEG' ? (val * Math.PI) / 180 : val;
              // Clean zero for sin(180 deg)
              res = Math.abs(Math.sin(rad)) < 1e-15 ? 0 : Math.sin(rad);
              desc = `sin(${val}${this.angleMode === 'DEG' ? '°' : ''})`;
            }
          }
          break;

        case 'cos':
          if (this.isHyp) {
            res = this.isSecond ? Math.acosh(val) : Math.cosh(val);
            desc = this.isSecond ? `acosh(${val})` : `cosh(${val})`;
          } else {
            if (this.isSecond) {
              if (val < -1 || val > 1) throw new Error('Domínio inválido');
              res = Math.acos(val);
              if (this.angleMode === 'DEG') res = (res * 180) / Math.PI;
              desc = `acos(${val})`;
            } else {
              const rad = this.angleMode === 'DEG' ? (val * Math.PI) / 180 : val;
              res = Math.abs(Math.cos(rad)) < 1e-15 ? 0 : Math.cos(rad);
              desc = `cos(${val}${this.angleMode === 'DEG' ? '°' : ''})`;
            }
          }
          break;

        case 'tan':
          if (this.isHyp) {
            res = this.isSecond ? Math.atanh(val) : Math.tanh(val);
            desc = this.isSecond ? `atanh(${val})` : `tanh(${val})`;
          } else {
            if (this.isSecond) {
              res = Math.atan(val);
              if (this.angleMode === 'DEG') res = (res * 180) / Math.PI;
              desc = `atan(${val})`;
            } else {
              const rad = this.angleMode === 'DEG' ? (val * Math.PI) / 180 : val;
              if (this.angleMode === 'DEG' && Math.abs(val % 180) === 90) {
                throw new Error('Indefinido');
              }
              res = Math.tan(rad);
              desc = `tan(${val}${this.angleMode === 'DEG' ? '°' : ''})`;
            }
          }
          break;

        case 'ln':
          if (this.isSecond) {
            res = Math.exp(val);
            desc = `e^(${val})`;
          } else {
            if (val <= 0) throw new Error('Domínio inválido');
            res = Math.log(val);
            desc = `ln(${val})`;
          }
          break;

        case 'log':
          if (this.isSecond) {
            res = Math.pow(10, val);
            desc = `10^(${val})`;
          } else {
            if (val <= 0) throw new Error('Domínio inválido');
            res = Math.log10(val);
            desc = `log(${val})`;
          }
          break;

        case 'sqr':
          if (this.isSecond) {
            res = Math.pow(val, 3);
            desc = `(${val})³`;
          } else {
            res = Math.pow(val, 2);
            desc = `(${val})²`;
          }
          break;

        case 'sqrt':
          if (this.isSecond) {
            res = Math.cbrt(val);
            desc = `³√(${val})`;
          } else {
            if (val < 0) throw new Error('Número negativo');
            res = Math.sqrt(val);
            desc = `√(${val})`;
          }
          break;

        case 'cbrt':
          res = Math.cbrt(val);
          desc = `³√(${val})`;
          break;

        case 'inv-x':
          if (val === 0) throw new Error('Divisão por 0');
          res = 1 / val;
          desc = `1/(${val})`;
          break;

        case 'fact':
          if (val < 0 || !Number.isInteger(val)) throw new Error('Inteiro positivo!');
          if (val > 170) throw new Error('Infinito');
          res = this.factorial(val);
          desc = `${val}!`;
          break;

        case 'pct':
          res = val / 100;
          desc = `${val}%`;
          break;

        case 'abs':
          res = Math.abs(val);
          desc = `|${val}|`;
          break;

        case 'pow':
          // Set binary power operator
          this.inputOperator('^');
          return;

        default:
          return;
      }

      this.currentValue = String(this.formatNumber(res));
      this.expression = desc;
      this.lastResult = res;
      this.justCalculated = true;
      this.addHistory(desc, this.currentValue);
      this.onCalculate(res);
      this.onUpdate();

    } catch (err) {
      this.currentValue = err.message || 'Erro';
      this.justCalculated = true;
      this.onUpdate();
    }
  }

  factorial(n) {
    if (n === 0 || n === 1) return 1;
    let r = 1;
    for (let i = 2; i <= n; i++) r *= i;
    return r;
  }

  // --- Calculate (=) Full Expression ---
  calculate() {
    this.playAudio('celebrate');
    let exprToEval = this.expression;
    if (this.currentValue !== '0' || exprToEval === '' || !exprToEval.trim().endsWith(this.currentValue)) {
      exprToEval += this.currentValue;
    }

    exprToEval = exprToEval.trim();
    if (!exprToEval) return;

    try {
      const fullDisplay = exprToEval;
      const result = this.evaluateExpression(exprToEval);
      const formatted = this.formatNumber(result);

      this.currentValue = String(formatted);
      this.expression = `${fullDisplay} =`;
      this.lastResult = result;
      this.justCalculated = true;

      this.addHistory(fullDisplay, this.currentValue);
      this.onCalculate(result);
      this.onUpdate();

    } catch (e) {
      this.currentValue = 'Erro';
      this.justCalculated = true;
      this.onUpdate();
    }
  }

  evaluateExpression(raw) {
    // Replace visual tokens
    let sanitized = raw
      .replace(/×/g, '*')
      .replace(/÷/g, '/')
      .replace(/−/g, '-')
      .replace(/π/g, `${Math.PI}`)
      .replace(/\be\b/g, `${Math.E}`);

    // Handle powers: a ^ b -> Math.pow(a, b)
    sanitized = sanitized.replace(/(\d+(\.\d+)?)\s*\^\s*(\d+(\.\d+)?)/g, 'Math.pow($1, $3)');

    // Simple security validation: only numbers, Math, basic operators, parens, spaces
    if (!/^[0-9\.\+\-\*\/\(\)\s\,MathpowsqrtcbrtabslogEPI]+$/.test(sanitized)) {
      throw new Error('Expressão inválida');
    }

    // Evaluate in safe function context
    const fn = new Function(`return (${sanitized});`);
    const res = fn();

    if (!isFinite(res) || isNaN(res)) {
      throw new Error('Resultado indefinido');
    }

    return res;
  }

  formatNumber(num) {
    if (typeof num !== 'number') return num;
    if (!isFinite(num) || isNaN(num)) return 'Erro';

    // Round away floating point precision quirks like 0.1 + 0.2 = 0.30000000000000004
    const rounded = parseFloat(num.toPrecision(12));
    
    // Check if exponent is needed
    if (Math.abs(rounded) > 1e12 || (Math.abs(rounded) < 1e-6 && rounded !== 0)) {
      return rounded.toExponential(6);
    }
    return rounded;
  }

  // --- Memory Operations ---
  memoryAction(action) {
    this.playAudio('pop');
    const val = parseFloat(this.currentValue) || 0;

    switch (action) {
      case 'mc':
        this.memory = 0;
        break;
      case 'mr':
        this.currentValue = String(this.formatNumber(this.memory));
        this.justCalculated = false;
        break;
      case 'm+':
        this.memory += val;
        break;
      case 'm-':
        this.memory -= val;
        break;
      case 'ms':
        this.memory = val;
        break;
      case 'ans':
        this.inputConstant('ans');
        return;
    }

    const badgeMem = document.getElementById('badge-memory');
    if (badgeMem) {
      badgeMem.className = `calc-mode-pill ${this.memory !== 0 ? 'active' : 'inactive'}`;
    }

    const memValEl = document.getElementById('memory-current-val');
    if (memValEl) {
      memValEl.textContent = this.formatNumber(this.memory);
    }

    this.onMemoryChange(this.memory);
    this.onUpdate();
  }

  // --- History Management ---
  addHistory(expr, result) {
    const item = {
      id: Date.now() + Math.random().toString(36).substring(2, 6),
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      expr: expr,
      result: result
    };
    this.history.unshift(item);
    if (this.history.length > 50) this.history.pop();
    this.saveHistory();
    this.onHistoryChange(this.history);
  }

  recallHistory(item) {
    this.playAudio('pop');
    this.expression = item.expr + ' =';
    this.currentValue = String(item.result);
    this.lastResult = parseFloat(item.result);
    this.justCalculated = true;
    this.onUpdate();
  }
}

window.ScientificCalculator = ScientificCalculator;
