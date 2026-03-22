import { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

export default function EMICalculator() {
  const [loanAmount, setLoanAmount] = useState(5000000);
  const [interestRate, setInterestRate] = useState(8.5);
  const [tenure, setTenure] = useState(20);
  const [emi, setEmi] = useState(0);
  const [totalInterest, setTotalInterest] = useState(0);
  const [totalPayment, setTotalPayment] = useState(0);

  useEffect(() => {
    const r = interestRate / 12 / 100;
    const n = tenure * 12;
    const emiValue = (loanAmount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    
    setEmi(Math.round(emiValue));
    const totalPay = emiValue * n;
    setTotalPayment(Math.round(totalPay));
    setTotalInterest(Math.round(totalPay - loanAmount));
  }, [loanAmount, interestRate, tenure]);

  const data = [
    { name: 'Principal', value: loanAmount, color: '#0A192F' },
    { name: 'Interest', value: totalInterest, color: '#C5A059' },
  ];

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="bg-white p-8 card-shadow">
      <h3 className="text-2xl font-serif mb-8 text-navy">EMI Calculator</h3>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="space-y-8">
          <div className="space-y-4">
            <div className="flex justify-between">
              <label className="text-xs uppercase tracking-widest font-bold text-ink/60">Loan Amount</label>
              <span className="text-navy font-bold">{formatCurrency(loanAmount)}</span>
            </div>
            <input 
              type="range" 
              min="1000000" 
              max="100000000" 
              step="100000"
              value={loanAmount}
              onChange={(e) => setLoanAmount(Number(e.target.value))}
              className="w-full h-1 bg-ink/10 rounded-lg appearance-none cursor-pointer accent-gold"
            />
          </div>

          <div className="space-y-4">
            <div className="flex justify-between">
              <label className="text-xs uppercase tracking-widest font-bold text-ink/60">Interest Rate (%)</label>
              <span className="text-navy font-bold">{interestRate}%</span>
            </div>
            <input 
              type="range" 
              min="5" 
              max="15" 
              step="0.1"
              value={interestRate}
              onChange={(e) => setInterestRate(Number(e.target.value))}
              className="w-full h-1 bg-ink/10 rounded-lg appearance-none cursor-pointer accent-gold"
            />
          </div>

          <div className="space-y-4">
            <div className="flex justify-between">
              <label className="text-xs uppercase tracking-widest font-bold text-ink/60">Tenure (Years)</label>
              <span className="text-navy font-bold">{tenure} Years</span>
            </div>
            <input 
              type="range" 
              min="1" 
              max="30" 
              step="1"
              value={tenure}
              onChange={(e) => setTenure(Number(e.target.value))}
              className="w-full h-1 bg-ink/10 rounded-lg appearance-none cursor-pointer accent-gold"
            />
          </div>

          <div className="pt-8 border-t border-ink/5 grid grid-cols-2 gap-4">
            <div className="p-4 bg-paper rounded-sm">
              <span className="text-[10px] uppercase tracking-widest text-ink/40 font-bold block mb-1">Monthly EMI</span>
              <span className="text-xl font-bold text-navy">{formatCurrency(emi)}</span>
            </div>
            <div className="p-4 bg-paper rounded-sm">
              <span className="text-[10px] uppercase tracking-widest text-ink/40 font-bold block mb-1">Total Interest</span>
              <span className="text-xl font-bold text-gold">{formatCurrency(totalInterest)}</span>
            </div>
          </div>
        </div>

        <div className="h-[300px] relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => formatCurrency(value)} />
              <Legend verticalAlign="bottom" height={36}/>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
            <span className="text-[10px] uppercase tracking-widest text-ink/40 font-bold block">Total Pay</span>
            <span className="text-sm font-bold text-navy">{formatCurrency(totalPayment)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
