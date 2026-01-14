
import React, { useState } from 'react';
import { 
  ShoppingCart, 
  Wallet, 
  ChevronRight, 
  ChevronLeft, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  AlertTriangle 
} from 'lucide-react';
import { FlowType, Urgency, PurchaseData, DiaryData, Beneficiary } from './types';

const DIARY_VALUE = 380;

// --- Sub-componentes Utilitários ---

const Layout = ({ children, title, onBack }: { children: React.ReactNode, title?: string, onBack?: () => void }) => (
  <div className="min-h-screen flex items-center justify-center p-4 md:p-8">
    {/* Decorative Elements */}
    <div className="fixed top-0 left-0 w-full h-full pointer-events-none opacity-20">
      <div className="absolute top-10 left-10 w-64 h-64 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
      <div className="absolute top-0 right-10 w-64 h-64 bg-emerald-300 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-64 h-64 bg-amber-300 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
    </div>

    <div className="w-full max-w-2xl glass-card rounded-[2.5rem] shadow-2xl shadow-indigo-200/40 border border-white overflow-hidden relative transition-all duration-300">
      {/* Top Accent Bar */}
      <div className="h-2 w-full bg-gradient-to-r from-indigo-600 via-emerald-500 to-amber-500"></div>
      
      {onBack && (
        <button 
          onClick={onBack} 
          className="absolute top-8 left-8 p-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-all z-10 border border-slate-100 bg-white/50"
        >
          <ChevronLeft size={24} />
        </button>
      )}
      <div className="p-8 md:p-14">
        {title && <h2 className="text-3xl font-extrabold text-slate-800 mb-10 text-center tracking-tight">{title}</h2>}
        {children}
      </div>
    </div>
  </div>
);

const InputField = ({ label, value, onChange, type = "text", placeholder, required = false }: any) => (
  <div className="mb-4 group">
    <label className="block text-xs font-bold text-slate-500 mb-1.5 ml-1 uppercase tracking-widest transition-colors group-focus-within:text-indigo-600">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <div className="relative">
      <input 
        type={type} 
        value={value} 
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-5 py-3.5 bg-white border-2 border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 transition-all text-base shadow-sm"
      />
    </div>
  </div>
);

const SelectField = ({ label, value, onChange, options, required = false }: any) => (
  <div className="mb-4 group">
    <label className="block text-xs font-bold text-slate-500 mb-1.5 ml-1 uppercase tracking-widest transition-colors group-focus-within:text-indigo-600">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <select 
      value={value} 
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-5 py-3.5 bg-white border-2 border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 transition-all text-base shadow-sm appearance-none"
    >
      {options.map((opt: string) => (
        <option key={opt} value={opt}>{opt}</option>
      ))}
    </select>
  </div>
);

const TextAreaField = ({ label, value, onChange, placeholder }: any) => (
  <div className="mb-6 group">
    <label className="block text-sm font-bold text-slate-600 mb-2 ml-1 uppercase tracking-widest transition-colors group-focus-within:text-indigo-600">{label}</label>
    <textarea 
      value={value} 
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={4}
      className="w-full px-6 py-4 bg-white border-2 border-slate-200 rounded-2xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 transition-all text-lg resize-none shadow-sm"
    />
  </div>
);

const StepAction = ({ onNext, disabled, label = "Continuar" }: { onNext: () => void, disabled?: boolean, label?: string }) => (
  <button
    onClick={onNext}
    disabled={disabled}
    className={`w-full py-5 rounded-2xl font-bold text-xl flex items-center justify-center gap-3 transition-all transform ${
      disabled 
        ? 'bg-slate-200 text-slate-400 cursor-not-allowed opacity-60' 
        : 'bg-slate-900 text-white hover:bg-indigo-600 active:scale-95 shadow-xl shadow-indigo-100 hover:shadow-indigo-200'
    }`}
  >
    {label}
    <ChevronRight size={24} />
  </button>
);

const App: React.FC = () => {
  const [flow, setFlow] = useState<FlowType>(FlowType.HOME);
  const [step, setStep] = useState(0);

  // --- Purchase State ---
  const [purchase, setPurchase] = useState<PurchaseData>({
    requesterName: '',
    contact: '',
    group: '',
    subgroup: '',
    itemName: '',
    technicalDescription: '',
    quantity: 1,
    links: ['', '', ''],
    justification: '',
    urgency: Urgency.LOW,
    limitDate: ''
  });

  // --- Diary State ---
  const [diary, setDiary] = useState<DiaryData>({
    requesterName: '',
    contact: '',
    group: '',
    subgroup: '',
    startDate: '',
    endDate: '',
    beneficiaries: []
  });

  const [currentB, setCurrentB] = useState<Beneficiary>({
    id: '', name: '', quantity: 1, bank: '', agency: '', account: '', accountType: 'Corrente', cpf: ''
  });

  const resetAll = () => {
    setFlow(FlowType.HOME);
    setStep(0);
    setPurchase({
      requesterName: '', contact: '', group: '', subgroup: '', itemName: '', technicalDescription: '',
      quantity: 1, links: ['', '', ''], justification: '', urgency: Urgency.LOW, limitDate: ''
    });
    setDiary({
      requesterName: '', contact: '', group: '', subgroup: '', startDate: '', endDate: '', beneficiaries: []
    });
    setCurrentB({ id: '', name: '', quantity: 1, bank: '', agency: '', account: '', accountType: 'Corrente', cpf: '' });
  };

  const handleExportCSV = (data: any[], filename: string) => {
    const csvRows = [];
    if (data.length === 0) return;
    const headers = Object.keys(data[0]);
    csvRows.push(headers.join(';'));
    for (const row of data) {
      const values = headers.map(header => `"${row[header]}"`);
      csvRows.push(values.join(';'));
    }
    const csvContent = "\uFEFF" + csvRows.join('\n'); // Add BOM for Excel compatibility
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
  };

  const generatePurchaseExcel = () => {
    const data = [{
      'Data da Solicitação': new Date().toLocaleDateString('pt-BR'),
      'Pesquisador': purchase.requesterName,
      'Contato': purchase.contact,
      'Grupo': purchase.group,
      'Subgrupo': purchase.subgroup,
      'Item': purchase.itemName,
      'Descrição Técnica': purchase.technicalDescription,
      'Quantidade': purchase.quantity,
      'Justificativa': purchase.justification,
      'Urgência': purchase.urgency,
      'Status': 'Pendente'
    }];
    handleExportCSV(data, 'solicitacao_compra.csv');
    setFlow(FlowType.SUCCESS);
  };

  const generateDiaryExcel = () => {
    const data = diary.beneficiaries.map(b => ({
      'Responsável': diary.requesterName,
      'Contato': diary.contact,
      'Beneficiário': b.name,
      'Qtd Diárias': b.quantity,
      'Valor Total': b.quantity * DIARY_VALUE,
      'Banco': b.bank,
      'Agência': b.agency,
      'Conta': b.account,
      'Tipo': b.accountType,
      'CPF': b.cpf,
      'Status': 'Pendente'
    }));
    handleExportCSV(data, 'solicitacao_diarias.csv');
    setFlow(FlowType.SUCCESS);
  };

  // --- Home ---
  if (flow === FlowType.HOME) {
    return (
      <Layout>
        <div className="text-center">
          <div className="inline-flex items-center justify-center p-8 bg-indigo-50 rounded-[2rem] mb-10 shadow-inner">
            <ShoppingCart className="text-indigo-600 w-16 h-16" />
          </div>
          <h1 className="text-4xl font-black text-slate-900 mb-3 tracking-tight">Solicitações PELD</h1>
          <p className="text-slate-500 text-lg mb-14">Portal oficial de solicitações administrativas</p>
          
          <div className="grid gap-6">
            <button 
              onClick={() => setFlow(FlowType.DIARIES)} 
              className="group relative flex items-center justify-between p-8 bg-white border-2 border-slate-100 rounded-3xl hover:border-amber-400 hover:shadow-2xl transition-all overflow-hidden"
            >
              <div className="flex items-center gap-8 relative z-10">
                <div className="p-5 bg-amber-50 rounded-2xl group-hover:bg-amber-100 transition-colors">
                  <Wallet className="w-8 h-8 text-amber-600" />
                </div>
                <div className="text-left">
                  <span className="block text-2xl font-black text-slate-800">Solicitar Diárias</span>
                  <span className="text-slate-500 font-medium">Viagens e reembolsos</span>
                </div>
              </div>
              <ChevronRight className="text-slate-300 group-hover:text-amber-500 transition-all transform group-hover:translate-x-1" />
              <div className="absolute top-0 right-0 w-24 h-full bg-amber-50/30 -skew-x-12 transform translate-x-full group-hover:translate-x-12 transition-transform"></div>
            </button>

            <button 
              onClick={() => setFlow(FlowType.PURCHASES)} 
              className="group relative flex items-center justify-between p-8 bg-white border-2 border-slate-100 rounded-3xl hover:border-emerald-400 hover:shadow-2xl transition-all overflow-hidden"
            >
              <div className="flex items-center gap-8 relative z-10">
                <div className="p-5 bg-emerald-50 rounded-2xl group-hover:bg-emerald-100 transition-colors">
                  <ShoppingCart className="w-8 h-8 text-emerald-600" />
                </div>
                <div className="text-left">
                  <span className="block text-2xl font-black text-slate-800">Solicitar Compra</span>
                  <span className="text-slate-500 font-medium">Materiais de pesquisa</span>
                </div>
              </div>
              <ChevronRight className="text-slate-300 group-hover:text-emerald-500 transition-all transform group-hover:translate-x-1" />
              <div className="absolute top-0 right-0 w-24 h-full bg-emerald-50/30 -skew-x-12 transform translate-x-full group-hover:translate-x-12 transition-transform"></div>
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  // --- Purchase ---
  if (flow === FlowType.PURCHASES) {
    const screens = [
      <div key="p0" className="animate-in fade-in slide-in-from-bottom-4">
        <InputField label="Nome do Pesquisador" value={purchase.requesterName} onChange={(val: string) => setPurchase(p => ({...p, requesterName: val}))} required placeholder="Seu nome completo" />
        <InputField label="Contato (WhatsApp ou E-mail)" value={purchase.contact} onChange={(val: string) => setPurchase(p => ({...p, contact: val}))} required placeholder="Como podemos falar com você?" />
        <InputField label="Grupo de Pesquisa" value={purchase.group} onChange={(val: string) => setPurchase(p => ({...p, group: val}))} required placeholder="Ex: Ecologia Aquática" />
        <InputField label="Subgrupo" value={purchase.subgroup} onChange={(val: string) => setPurchase(p => ({...p, subgroup: val}))} required placeholder="Ex: Ictiologia" />
        <StepAction onNext={() => setStep(1)} disabled={!purchase.requesterName || !purchase.contact || !purchase.group || !purchase.subgroup} />
      </div>,
      <div key="p1" className="animate-in fade-in slide-in-from-bottom-4">
        <InputField label="Nome do Item" value={purchase.itemName} onChange={(val: string) => setPurchase(p => ({...p, itemName: val}))} required placeholder="Ex: Microscópio Binocular" />
        <TextAreaField label="Descrição Técnica" value={purchase.technicalDescription} onChange={(val: string) => setPurchase(p => ({...p, technicalDescription: val}))} placeholder="Marca, modelo, especificações, voltagem..." />
        <div className="mb-10">
           <label className="block text-sm font-bold text-slate-600 mb-3 ml-1 uppercase tracking-widest">Quantidade</label>
           <div className="flex items-center gap-6 bg-slate-100 p-3 rounded-2xl border-2 border-slate-200">
             <button onClick={() => setPurchase(p => ({...p, quantity: Math.max(1, p.quantity - 1)}))} className="w-14 h-14 bg-white rounded-xl shadow-md flex items-center justify-center text-3xl font-black text-slate-700 hover:text-indigo-600 hover:bg-slate-50 transition-all">-</button>
             <span className="flex-1 text-center text-3xl font-black text-slate-800">{purchase.quantity}</span>
             <button onClick={() => setPurchase(p => ({...p, quantity: p.quantity + 1}))} className="w-14 h-14 bg-white rounded-xl shadow-md flex items-center justify-center text-3xl font-black text-slate-700 hover:text-indigo-600 hover:bg-slate-50 transition-all">+</button>
           </div>
        </div>
        <StepAction onNext={() => setStep(2)} disabled={!purchase.itemName} />
      </div>,
      <div key="p2" className="animate-in fade-in slide-in-from-bottom-4">
        <InputField label="Link 1 (Obrigatório)" value={purchase.links[0]} onChange={(val: string) => setPurchase(p => {const l = [...p.links]; l[0] = val; return {...p, links: l}})} required placeholder="http://..." />
        <InputField label="Link 2 (Opcional)" value={purchase.links[1]} onChange={(val: string) => setPurchase(p => {const l = [...p.links]; l[1] = val; return {...p, links: l}})} placeholder="http://..." />
        <StepAction onNext={() => setStep(3)} disabled={!purchase.links[0]} />
      </div>,
      <div key="p3" className="animate-in fade-in slide-in-from-bottom-4">
        <TextAreaField label="Justificativa de Uso" value={purchase.justification} onChange={(val: string) => setPurchase(p => ({...p, justification: val}))} required placeholder="Como este item contribuirá para a pesquisa?" />
        <div className="mb-12">
          <label className="block text-sm font-bold text-slate-600 mb-4 ml-1 uppercase tracking-widest text-center">Grau de Urgência</label>
          <div className="grid grid-cols-3 gap-3">
            {[Urgency.LOW, Urgency.MEDIUM, Urgency.HIGH].map(u => (
              <button 
                key={u} 
                onClick={() => setPurchase(p => ({...p, urgency: u}))} 
                className={`py-4 rounded-2xl font-bold text-sm transition-all border-2 ${
                  purchase.urgency === u 
                    ? 'bg-indigo-600 border-indigo-600 text-white shadow-xl shadow-indigo-100 scale-105' 
                    : 'bg-white border-slate-200 text-slate-500 hover:border-indigo-300'
                }`}
              >
                {u}
              </button>
            ))}
          </div>
        </div>
        <StepAction onNext={() => setStep(4)} disabled={!purchase.justification} />
      </div>,
      <div key="p4" className="animate-in fade-in slide-in-from-bottom-4">
        <InputField type="date" label="Data Limite de Entrega" value={purchase.limitDate} onChange={(val: string) => setPurchase(p => ({...p, limitDate: val}))} required />
        <div className="p-4 bg-indigo-50 rounded-2xl border border-indigo-100 flex items-start gap-4 mb-10">
          <AlertTriangle className="text-indigo-600 shrink-0" size={24} />
          <p className="text-sm text-indigo-900 leading-relaxed font-medium">Esta data será usada para priorização do fluxo logístico e cotações.</p>
        </div>
        <StepAction onNext={() => setStep(5)} disabled={!purchase.limitDate} />
      </div>,
      <div key="p5" className="animate-in fade-in slide-in-from-bottom-4">
        <div className="space-y-4 mb-10 bg-slate-50/80 p-8 rounded-[2rem] border-2 border-slate-100 shadow-inner">
          <div className="flex justify-between border-b border-slate-200 pb-4">
            <span className="text-slate-500 font-bold uppercase text-xs tracking-widest">Requerente</span>
            <span className="text-slate-900 font-black">{purchase.requesterName}</span>
          </div>
          <div className="flex justify-between border-b border-slate-200 pb-4">
            <span className="text-slate-500 font-bold uppercase text-xs tracking-widest">Item</span>
            <span className="text-slate-900 font-black">{purchase.itemName}</span>
          </div>
          <div className="flex justify-between border-b border-slate-200 pb-4">
            <span className="text-slate-500 font-bold uppercase text-xs tracking-widest">Qtd</span>
            <span className="text-slate-900 font-black">{purchase.quantity}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500 font-bold uppercase text-xs tracking-widest">Prioridade</span>
            <span className={`font-black uppercase text-xs px-3 py-1 rounded-full ${
              purchase.urgency === Urgency.HIGH ? 'bg-red-100 text-red-700' : 'bg-indigo-100 text-indigo-700'
            }`}>{purchase.urgency}</span>
          </div>
        </div>
        <div className="flex gap-4">
          <button onClick={() => setStep(0)} className="flex-1 py-5 rounded-2xl border-2 border-slate-300 text-slate-600 font-bold hover:bg-slate-50 transition-all">Editar</button>
          <button onClick={generatePurchaseExcel} className="flex-[2] py-5 rounded-2xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 transition-all shadow-2xl shadow-indigo-200">Finalizar Envio</button>
        </div>
      </div>
    ];

    return (
      <Layout title={step === 5 ? "Confirmar Dados" : "Solicitação de Compra"} onBack={step === 0 ? resetAll : () => setStep(step - 1)}>
        {screens[step]}
      </Layout>
    );
  }

  // --- Diaries ---
  if (flow === FlowType.DIARIES) {
    const addBeneficiary = () => {
      setDiary(d => ({...d, beneficiaries: [...d.beneficiaries, {...currentB, id: Date.now().toString()}]}));
      setCurrentB({ id: '', name: '', quantity: 1, bank: '', agency: '', account: '', accountType: 'Corrente', cpf: '' });
    };

    const isBeneficiaryComplete = currentB.name && currentB.bank && currentB.agency && currentB.account && currentB.cpf;

    const screens = [
      <div key="d0" className="animate-in fade-in slide-in-from-bottom-4">
        <InputField label="Nome do Responsável" value={diary.requesterName} onChange={(v: string) => setDiary(d => ({...d, requesterName: v}))} required placeholder="Quem está solicitando?" />
        <InputField label="Contato (WhatsApp ou E-mail)" value={diary.contact} onChange={(v: string) => setDiary(d => ({...d, contact: v}))} required placeholder="Como podemos falar com você?" />
        <InputField label="Grupo de Pesquisa" value={diary.group} onChange={(v: string) => setDiary(d => ({...d, group: v}))} required placeholder="Ex: Zoologia de Invertebrados" />
        <StepAction onNext={() => setStep(1)} disabled={!diary.requesterName || !diary.contact || !diary.group} />
      </div>,
      <div key="d1" className="animate-in fade-in slide-in-from-bottom-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField type="date" label="Início" value={diary.startDate} onChange={(v: string) => setDiary(d => ({...d, startDate: v}))} required />
          <InputField type="date" label="Término" value={diary.endDate} onChange={(v: string) => setDiary(d => ({...d, endDate: v}))} required />
        </div>
        <StepAction onNext={() => setStep(2)} disabled={!diary.startDate || !diary.endDate} />
      </div>,
      <div key="d2" className="animate-in fade-in slide-in-from-bottom-4">
        <div className="space-y-4 mb-6 bg-slate-50/50 p-6 rounded-[2rem] border-2 border-slate-100">
          <InputField label="Beneficiário" value={currentB.name} onChange={(v: string) => setCurrentB({...currentB, name: v})} required placeholder="Nome completo" />
          
          <div className="bg-white rounded-2xl p-6 border-2 border-amber-200 flex items-center justify-between shadow-sm mb-4">
            <div className="flex items-center gap-4">
              <button onClick={() => setCurrentB({...currentB, quantity: Math.max(1, currentB.quantity - 1)})} className="w-12 h-12 bg-amber-50 rounded-xl font-black text-amber-600 hover:bg-amber-100 transition-colors">-</button>
              <span className="text-2xl font-black text-slate-800">{currentB.quantity}</span>
              <button onClick={() => setCurrentB({...currentB, quantity: currentB.quantity + 1})} className="w-12 h-12 bg-amber-50 rounded-xl font-black text-amber-600 hover:bg-amber-100 transition-colors">+</button>
            </div>
            <div className="text-right">
              <span className="block text-[10px] font-black uppercase text-amber-600 tracking-widest mb-1">Total Diária</span>
              <span className="text-2xl font-black text-slate-900">R$ {(currentB.quantity * DIARY_VALUE).toLocaleString('pt-BR')}</span>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] ml-1">Dados para Pagamento</h4>
            <div className="grid grid-cols-2 gap-3">
              <InputField label="Banco" value={currentB.bank} onChange={(v: string) => setCurrentB({...currentB, bank: v})} required placeholder="Ex: BB, Bradesco..." />
              <InputField label="Agência" value={currentB.agency} onChange={(v: string) => setCurrentB({...currentB, agency: v})} required placeholder="Ex: 0001-2" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <InputField label="Conta" value={currentB.account} onChange={(v: string) => setCurrentB({...currentB, account: v})} required placeholder="Ex: 12345-6" />
              <SelectField 
                label="Tipo de Conta" 
                value={currentB.accountType} 
                onChange={(v: string) => setCurrentB({...currentB, accountType: v})} 
                required 
                options={['Corrente', 'Poupança']} 
              />
            </div>
            <InputField label="CPF" value={currentB.cpf} onChange={(v: string) => setCurrentB({...currentB, cpf: v})} required placeholder="000.000.000-00" />
          </div>

          <button 
            onClick={addBeneficiary} 
            disabled={!isBeneficiaryComplete} 
            className={`w-full py-4 border-2 rounded-2xl font-black transition-all flex items-center justify-center gap-2 mt-4 ${
              isBeneficiaryComplete ? 'border-indigo-600 text-indigo-600 bg-white hover:bg-indigo-50' : 'border-slate-200 text-slate-300'
            }`}
          >
            <Plus size={20} /> Adicionar Beneficiário
          </button>
        </div>

        {diary.beneficiaries.length > 0 && (
          <div className="mb-10 space-y-3">
            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest ml-2 mb-2">Solicitados ({diary.beneficiaries.length})</h4>
            {diary.beneficiaries.map(b => (
              <div key={b.id} className="flex items-center justify-between p-5 bg-white rounded-2xl border-2 border-slate-100 hover:border-indigo-100 transition-colors shadow-sm">
                <div>
                  <span className="block font-black text-slate-800">{b.name}</span>
                  <span className="text-xs font-bold text-slate-500 uppercase">{b.quantity} diárias • CPF: {b.cpf} • {b.bank} AG: {b.agency}</span>
                </div>
                <button onClick={() => setDiary(d => ({...d, beneficiaries: d.beneficiaries.filter(x => x.id !== b.id)}))} className="text-red-400 p-2 hover:bg-red-50 rounded-xl transition-colors"><Trash2 size={20}/></button>
              </div>
            ))}
          </div>
        )}
        <StepAction onNext={() => setStep(3)} disabled={diary.beneficiaries.length === 0} label="Gerar Revisão" />
      </div>,
      <div key="d3" className="animate-in fade-in slide-in-from-bottom-4 text-center">
        <div className="bg-slate-900 text-white rounded-[2rem] p-10 mb-10 shadow-2xl relative overflow-hidden">
          <div className="relative z-10">
            <span className="block text-xs font-black uppercase text-indigo-400 tracking-[0.3em] mb-4">Total da Solicitação</span>
            <span className="text-5xl font-black tabular-nums">R$ {diary.beneficiaries.reduce((acc, b) => acc + (b.quantity * DIARY_VALUE), 0).toLocaleString('pt-BR')}</span>
          </div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500 opacity-20 -translate-y-10 translate-x-10 rounded-full blur-3xl"></div>
        </div>
        <div className="flex gap-4">
          <button onClick={() => setStep(2)} className="flex-1 py-5 rounded-2xl border-2 border-slate-300 text-slate-600 font-bold hover:bg-slate-50">Voltar</button>
          <button onClick={generateDiaryExcel} className="flex-[2] py-5 rounded-2xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 shadow-xl shadow-indigo-100">Emitir Relatório</button>
        </div>
      </div>
    ];

    return (
      <Layout title="Diárias e Auxílios" onBack={step === 0 ? resetAll : () => setStep(step - 1)}>
        {screens[step]}
      </Layout>
    );
  }

  // --- Success ---
  if (flow === FlowType.SUCCESS) {
    return (
      <Layout>
        <div className="text-center py-10 animate-in zoom-in duration-500">
          <div className="inline-flex items-center justify-center w-32 h-32 bg-emerald-50 text-emerald-500 rounded-full mb-10 shadow-inner">
            <CheckCircle2 size={80} />
          </div>
          <h1 className="text-4xl font-black text-slate-900 mb-6 tracking-tight">Solicitação enviada!</h1>
          <p className="text-slate-500 text-lg mb-14 max-w-sm mx-auto leading-relaxed">
            Sua solicitação foi enviada com sucesso, nosso setor de projetos irá iniciar o processo e logo entrará em contato com você.
          </p>
          <button onClick={resetAll} className="w-full py-6 bg-slate-900 text-white rounded-3xl font-black text-2xl hover:bg-indigo-600 transition-all shadow-2xl shadow-slate-200">
            Nova Solicitação
          </button>
        </div>
      </Layout>
    );
  }

  return null;
};

export default App;
