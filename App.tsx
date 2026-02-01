
import React, { useState } from 'react';
import { 
  Layers, AlignCenter, AlignLeft, AlignRight, 
  Maximize, Check, Palette, Type, Eye, EyeOff,
  Grid, Download, Move
} from 'lucide-react';
import { BRAND } from './constants';

const App: React.FC = () => {
  // --- Brand State ---
  const [text1, setText1] = useState('PROMOTIONAL');
  const [text2, setText2] = useState('HEADING STYLE');
  const [style, setStyle] = useState<'standard' | 'overlapping'>('overlapping');
  const [composition, setComposition] = useState<'range' | 'offset'>('range');
  const [stacking, setStacking] = useState<'box1' | 'box2'>('box2');
  const [alignment, setAlignment] = useState<'left' | 'center' | 'right'>('center');
  const [theme, setTheme] = useState('primary'); 
  const [canvasBg, setCanvasBg] = useState('white');
  const [fontSize, setFontSize] = useState(100);
  const [assetScale, setAssetScale] = useState(1);
  const [showGrid, setShowGrid] = useState(false);
  const [toast, setToast] = useState('');
  const [isExporting, setIsExporting] = useState(false);

  // --- Brand Logic Constants ---
  const capHeight = fontSize * BRAND.metrics.capHeightRatio;
  const brandPadding = capHeight * BRAND.metrics.paddingRatio;
  const totalBoxHeight = capHeight + (brandPadding * 2);
  const distUnit = capHeight * BRAND.metrics.offsetRatio;
  const shiftPx = capHeight * BRAND.metrics.shiftRatio;

  // Geometry: 1.5 degree rotation impacts the gap
  const rotationComp = Math.abs(Math.sin(BRAND.metrics.angle * Math.PI / 180) * 400); 
  const boxStackOffset = style === 'standard' 
    ? (distUnit + rotationComp) 
    : (-distUnit + rotationComp);
  
  let horizontalShift = 0;
  if (composition === 'offset') {
    if (alignment === 'left') horizontalShift = shiftPx;
    if (alignment === 'right') horizontalShift = -shiftPx;
  }

  const getThemeColors = (boxNum: number) => {
    if (theme === 'alt') return boxNum === 1 ? { bg: BRAND.colors.navy, text: BRAND.colors.white } : { bg: BRAND.colors.orange, text: BRAND.colors.navy };
    if (theme === 'blue') return boxNum === 1 ? { bg: BRAND.colors.blue, text: BRAND.colors.white } : { bg: BRAND.colors.navy, text: BRAND.colors.white };
    if (theme === 'grey') return boxNum === 1 ? { bg: BRAND.colors.grey, text: BRAND.colors.navy } : { bg: BRAND.colors.white, text: BRAND.colors.navy };
    return boxNum === 1 ? { bg: BRAND.colors.orange, text: BRAND.colors.navy } : { bg: BRAND.colors.navy, text: BRAND.colors.white };
  };

  const showNotification = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  /**
   * HIGH-FIDELITY HD EXPORT ENGINE
   */
  const exportAsset = async () => {
    if (isExporting) return;
    setIsExporting(true);
    showNotification("Synthesizing HD Master...");

    const canvas = document.createElement("canvas");
    canvas.width = 1920;
    canvas.height = 1080;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // 1. Background (Clear if transparent)
    ctx.clearRect(0, 0, 1920, 1080);
    if (canvasBg !== 'transparent') {
      ctx.fillStyle = BRAND.colors[canvasBg as keyof typeof BRAND.colors] || '#ffffff';
      ctx.fillRect(0, 0, 1920, 1080);
    }

    const centerX = 1920 / 2;
    const centerY = 1080 / 2;

    // 2. Draw Branding Elements
    const drawHeading = (num: number) => {
      const colors = getThemeColors(num);
      const rot = (num === 1 ? BRAND.metrics.angle : -BRAND.metrics.angle) * (Math.PI / 180);
      const text = (num === 1 ? text1 : text2) || ' ';
      
      const scaledFS = fontSize * assetScale;
      const scaledBH = totalBoxHeight * assetScale;
      const scaledPad = brandPadding * assetScale;
      const hShift = (num === 1 ? 0 : horizontalShift) * assetScale;
      
      const groupHeight = (totalBoxHeight * 2 + boxStackOffset) * assetScale;
      const vBase = num === 1 
        ? centerY - (groupHeight / 2) + (scaledBH / 2)
        : centerY + (groupHeight / 2) - (scaledBH / 2);

      ctx.save();
      ctx.translate(centerX + hShift, vBase);
      ctx.rotate(rot);

      ctx.font = `900 ${scaledFS}px Poppins, sans-serif`;
      const charWidths = [...text].map(c => ctx.measureText(c).width);
      const tracking = -0.04 * scaledFS;
      const totalTextWidth = charWidths.reduce((a, b) => a + b + tracking, 0) - tracking;
      const boxWidth = totalTextWidth + (scaledPad * 2);

      // Box
      ctx.fillStyle = colors.bg;
      ctx.shadowColor = 'rgba(0,0,0,0.1)';
      ctx.shadowBlur = 40;
      ctx.shadowOffsetY = 15;
      ctx.fillRect(-boxWidth/2, -scaledBH/2, boxWidth, scaledBH);

      // Text
      ctx.shadowColor = 'transparent';
      ctx.fillStyle = colors.text;
      ctx.textBaseline = 'middle';
      ctx.textAlign = 'left';
      
      let cursorX = -boxWidth/2 + scaledPad;
      for (let i = 0; i < text.length; i++) {
        ctx.fillText(text[i], cursorX, scaledFS * 0.05);
        cursorX += charWidths[i] + tracking;
      }

      ctx.restore();
    };

    if (stacking === 'box1') { drawHeading(2); drawHeading(1); }
    else { drawHeading(1); drawHeading(2); }

    // Finalize
    setTimeout(() => {
      const link = document.createElement('a');
      link.download = `bionic-${Date.now()}.png`;
      link.href = canvas.toDataURL('image/png', 1.0);
      link.click();
      setIsExporting(false);
      showNotification("Asset Saved to Downloads");
    }, 200);
  };

  // Helper for checkerboard style
  const checkerboardStyle = {
    backgroundImage: `linear-gradient(45deg, #ccc 25%, transparent 25%), 
                      linear-gradient(-45deg, #ccc 25%, transparent 25%), 
                      linear-gradient(45deg, transparent 75%, #ccc 75%), 
                      linear-gradient(-45deg, transparent 75%, #ccc 75%)`,
    backgroundSize: '8px 8px',
    backgroundPosition: '0 0, 0 4px, 4px 4px, 4px 0',
    backgroundColor: '#fff'
  };

  return (
    <div className="flex h-screen bg-[#060a14] text-slate-200 overflow-hidden font-sans">
      
      {/* --- SIDEBAR --- */}
      <aside className="w-[420px] bg-[#0c1226] border-r border-white/5 flex flex-col z-30 shadow-2xl overflow-y-auto">
        <header className="p-8 border-b border-white/5 bg-[#182865]">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-lg">
              <Layers size={28} fill="#ff6741" stroke="#ff6741" />
            </div>
            <div>
              <h1 className="text-[10px] font-black tracking-[0.4em] text-orange-400 uppercase leading-none mb-1">Bionic HD</h1>
              <p className="text-xl font-black text-white">Asset Builder V1.8</p>
            </div>
          </div>
        </header>

        <div className="p-6 space-y-8 flex-1">
          {/* Messaging */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2"><Type size={14} className="text-[#ff6741]" /><h2 className="text-[11px] font-bold uppercase tracking-widest text-slate-400">Typography</h2></div>
              <span className="text-[10px] font-black text-slate-500 uppercase">{fontSize}PX</span>
            </div>
            <div className="space-y-2">
              <input type="text" value={text1} onChange={(e) => setText1(e.target.value.toUpperCase())} className="w-full p-4 bg-white/5 border border-white/10 focus:border-[#ff6741] rounded-xl text-sm font-black outline-none transition-all" placeholder="LINE 1" />
              <input type="text" value={text2} onChange={(e) => setText2(e.target.value.toUpperCase())} className="w-full p-4 bg-white/5 border border-white/10 focus:border-[#ff6741] rounded-xl text-sm font-black outline-none transition-all" placeholder="LINE 2" />
            </div>
            <input type="range" min="40" max="160" value={fontSize} onChange={(e) => setFontSize(parseInt(e.target.value))} className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#ff6741]" />
          </section>

          {/* Background Selection - HIGHER VISIBILITY */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 text-slate-400"><Palette size={14} className="text-[#ff6741]" /><h2 className="text-[11px] font-bold uppercase tracking-widest">Master Background</h2></div>
            <div className="grid grid-cols-4 gap-2">
              {['white', 'navy', 'orange', 'transparent'].map(color => (
                <button 
                  key={color} 
                  onClick={() => setCanvasBg(color)} 
                  className={`group relative h-14 rounded-xl border-2 transition-all flex items-center justify-center overflow-hidden
                    ${canvasBg === color ? 'border-[#ff6741] ring-2 ring-[#ff6741]/20' : 'border-white/5 hover:border-white/20'}`}
                >
                  {color === 'transparent' ? (
                    <div className="w-full h-full flex flex-col items-center justify-center" style={checkerboardStyle}>
                       <EyeOff size={16} className="text-slate-800" />
                       <span className="text-[8px] font-black text-slate-800 uppercase mt-1">None</span>
                    </div>
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center" style={{ backgroundColor: BRAND.colors[color as keyof typeof BRAND.colors] }}>
                       <span className={`text-[8px] font-black uppercase ${color === 'white' ? 'text-slate-400' : 'text-white/50'}`}>{color}</span>
                    </div>
                  )}
                  {canvasBg === color && <div className="absolute top-1 right-1 bg-[#ff6741] rounded-full p-0.5"><Check size={8} className="text-white" /></div>}
                </button>
              ))}
            </div>
          </section>

          {/* Architecture */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 text-slate-400"><Layers size={14} className="text-[#ff6741]" /><h2 className="text-[11px] font-bold uppercase tracking-widest">Architecture</h2></div>
            <div className="grid grid-cols-2 gap-2">
              <button onClick={() => setStyle('overlapping')} className={`p-4 rounded-xl border transition-all flex flex-col items-center gap-2 ${style === 'overlapping' ? 'border-[#ff6741] bg-[#ff6741]/10 text-[#ff6741]' : 'border-white/5 text-slate-500 bg-white/5'}`}>
                <Layers size={18} /><span className="text-[9px] font-black uppercase">Overlap</span>
              </button>
              <button onClick={() => setStyle('standard')} className={`p-4 rounded-xl border transition-all flex flex-col items-center gap-2 ${style === 'standard' ? 'border-[#ff6741] bg-[#ff6741]/10 text-[#ff6741]' : 'border-white/5 text-slate-500 bg-white/5'}`}>
                <Maximize size={18} /><span className="text-[9px] font-black uppercase">Standard</span>
              </button>
            </div>
            <div className="bg-white/5 p-1 rounded-xl flex border border-white/5">
              <button onClick={() => setStacking('box1')} className={`flex-1 py-2 text-[9px] font-black rounded-lg transition-all ${stacking === 'box1' ? 'bg-[#182865] text-white' : 'text-slate-500'}`}>BOX 1 TOP</button>
              <button onClick={() => setStacking('box2')} className={`flex-1 py-2 text-[9px] font-black rounded-lg transition-all ${stacking === 'box2' ? 'bg-[#182865] text-white' : 'text-slate-500'}`}>BOX 2 TOP</button>
            </div>
          </section>

          {/* Composition */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 text-slate-400"><Move size={14} className="text-[#ff6741]" /><h2 className="text-[11px] font-bold uppercase tracking-widest">Composition</h2></div>
            <div className="grid grid-cols-2 gap-2">
              <button onClick={() => setComposition('offset')} className={`p-4 rounded-xl border transition-all flex flex-col items-center gap-2 ${composition === 'offset' ? 'border-[#182865] bg-[#182865]/30 text-white' : 'border-white/5 text-slate-500 bg-white/5'}`}>
                <Move size={18} /><span className="text-[9px] font-black uppercase">Bionic Shift</span>
              </button>
              <button onClick={() => setComposition('range')} className={`p-4 rounded-xl border transition-all flex flex-col items-center gap-2 ${composition === 'range' ? 'border-[#182865] bg-[#182865]/30 text-white' : 'border-white/5 text-slate-500 bg-white/5'}`}>
                <AlignCenter size={18} /><span className="text-[9px] font-black uppercase">Centered</span>
              </button>
            </div>
            <div className="flex bg-white/5 p-1 rounded-xl border border-white/5">
              {(['left', 'center', 'right'] as const).map(align => (
                <button key={align} onClick={() => setAlignment(align)} className={`flex-1 py-2 flex justify-center rounded-lg transition-all ${alignment === align ? 'bg-white/10 text-[#ff6741]' : 'text-slate-500 hover:text-slate-300'}`}>
                  {align === 'left' ? <AlignLeft size={16} /> : align === 'center' ? <AlignCenter size={16} /> : <AlignRight size={16} />}
                </button>
              ))}
            </div>
          </section>

          {/* Palette */}
          <section className="space-y-4">
             <div className="flex items-center gap-2 text-slate-400"><Palette size={14} className="text-[#ff6741]" /><h2 className="text-[11px] font-bold uppercase tracking-widest">Brand Themes</h2></div>
             <div className="grid grid-cols-2 gap-2">
                {['primary', 'alt', 'blue', 'grey'].map(t => (
                  <button key={t} onClick={() => setTheme(t)} className={`px-4 py-3 rounded-xl border text-[10px] font-black uppercase text-left transition-all ${theme === t ? 'border-[#ff6741] bg-[#ff6741]/5 text-[#ff6741]' : 'border-white/5 text-slate-500 bg-white/5'}`}>
                    {t === 'primary' ? 'Promo (Org/Nav)' : t === 'alt' ? 'Secondary (Nav/Org)' : t === 'blue' ? 'Product (Blu/Nav)' : 'Editorial (Gry/Wht)'}
                  </button>
                ))}
             </div>
          </section>

          {/* Zoom Control */}
          <section className="space-y-3">
             <div className="flex items-center gap-2 text-slate-400"><Maximize size={14} className="text-[#ff6741]" /><h2 className="text-[11px] font-bold uppercase tracking-widest">Frame fit</h2></div>
             <input type="range" min="0.4" max="2" step="0.05" value={assetScale} onChange={(e) => setAssetScale(parseFloat(e.target.value))} className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#ff6741]" />
          </section>
        </div>

        {/* Footer Actions */}
        <div className="p-8 border-t border-white/5 bg-[#0a0f1e]/50 space-y-3">
          <div className="flex items-center justify-between mb-2">
             <button onClick={() => setShowGrid(!showGrid)} className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all ${showGrid ? 'bg-white/10 border-[#ff6741] text-[#ff6741]' : 'bg-white/5 border-white/5 text-slate-600'}`}>
                <Grid size={16} /><span className="text-[10px] font-black uppercase">Grid</span>
             </button>
             <span className="text-[9px] font-black uppercase text-slate-500 tracking-[0.2em]">HD 1080P Export</span>
          </div>
          <button 
            disabled={isExporting} 
            onClick={exportAsset} 
            className="w-full py-5 bg-[#ff6741] hover:bg-[#ff7a5a] text-white font-black uppercase text-xs rounded-2xl shadow-2xl shadow-orange-900/40 transition-all flex items-center justify-center gap-3 disabled:opacity-50 active:scale-95"
          >
            <Download size={20} /> {isExporting ? 'GENERATING...' : 'EXPORT 1920x1080 MASTER'}
          </button>
        </div>
      </aside>

      {/* --- PREVIEW STAGE --- */}
      <main className="flex-1 relative flex flex-col items-center justify-center p-12 bg-[#060a14] overflow-hidden">
        
        {/* Stage Status */}
        <div className="absolute top-8 left-8 flex gap-4 pointer-events-none z-40">
           <div className="bg-white/5 backdrop-blur-md border border-white/10 px-6 py-4 rounded-2xl flex items-center gap-4">
              <div className="w-2 h-2 rounded-full bg-[#ff6741] shadow-[0_0_10px_#ff6741]" />
              <div className="flex flex-col">
                <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest leading-tight">Workspace</span>
                <span className="text-[11px] font-bold text-white uppercase">HD Live Canvas</span>
              </div>
           </div>
        </div>

        {/* Workspace Frame */}
        <div 
          className={`relative shadow-[0_120px_240px_-80px_rgba(0,0,0,1)] transition-all duration-1000 ease-out`}
          style={{ 
            width: '1920px', 
            height: '1080px', 
            transform: `scale(${Math.min(0.4, (window.innerWidth - 480) / 1920)})`,
            backgroundColor: canvasBg === 'transparent' ? 'transparent' : (BRAND.colors[canvasBg as keyof typeof BRAND.colors] || 'white'),
            ...(canvasBg === 'transparent' ? checkerboardStyle : {}),
            cursor: 'default'
          }}
        >
          {/* Grid Overlay */}
          {showGrid && (
            <div className="absolute inset-0 z-10 pointer-events-none opacity-10" style={{ backgroundImage: `linear-gradient(#ff6741 1px, transparent 1px), linear-gradient(90deg, #ff6741 1px, transparent 1px)`, backgroundSize: '100px 100px' }}>
              <div className="absolute top-1/2 left-0 right-0 h-px bg-[#ff6741] scale-y-4" />
              <div className="absolute left-1/2 top-0 bottom-0 w-px bg-[#ff6741] scale-x-4" />
            </div>
          )}

          <div 
            className="w-full h-full relative flex items-center justify-center transition-all duration-500"
            style={{ transform: `scale(${assetScale})` }}
          >
            {/* Headline Group */}
            <div 
              className="relative flex flex-col z-20"
              style={{ 
                alignItems: alignment === 'left' ? 'flex-start' : alignment === 'right' ? 'flex-end' : 'center'
              }}
            >
              
              {/* Line 1 */}
              <div 
                className="relative transition-all duration-700 ease-out"
                style={{ 
                  zIndex: stacking === 'box1' ? 40 : 20,
                  transform: `rotate(${BRAND.metrics.angle}deg)`,
                  transformOrigin: 'center'
                }}
              >
                <div 
                  className="px-12 flex items-center justify-center font-[Poppins] font-[900] tracking-[-0.04em] whitespace-nowrap shadow-2xl transition-all duration-500"
                  style={{ 
                    background: getThemeColors(1).bg, 
                    color: getThemeColors(1).text,
                    height: `${totalBoxHeight}px`,
                    fontSize: `${fontSize}px`,
                    borderRadius: '2px'
                  }}
                >
                  <span className="translate-y-[0.05em]">{text1 || ' '}</span>
                </div>
              </div>

              {/* Line 2 */}
              <div 
                className="relative transition-all duration-700 ease-out"
                style={{ 
                  zIndex: stacking === 'box2' ? 40 : 20,
                  marginTop: `${boxStackOffset}px`,
                  transform: `rotate(-${BRAND.metrics.angle}deg) translateX(${horizontalShift}px)`,
                  transformOrigin: 'center'
                }}
              >
                <div 
                  className="px-12 flex items-center justify-center font-[Poppins] font-[900] tracking-[-0.04em] whitespace-nowrap shadow-2xl transition-all duration-500"
                  style={{ 
                    background: getThemeColors(2).bg, 
                    color: getThemeColors(2).text,
                    height: `${totalBoxHeight}px`,
                    fontSize: `${fontSize}px`,
                    borderRadius: '2px'
                  }}
                >
                  <span className="translate-y-[0.05em]">{text2 || ' '}</span>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Labels Overlay */}
        <div className="absolute bottom-12 flex gap-4">
           <div className="bg-white/5 border border-white/10 px-4 py-2 rounded-lg text-[9px] font-black text-slate-500 uppercase tracking-widest">Format: PNG-24</div>
           <div className="bg-white/5 border border-white/10 px-4 py-2 rounded-lg text-[9px] font-black text-slate-500 uppercase tracking-widest">Background: {canvasBg.toUpperCase()}</div>
        </div>

        {toast && (
          <div className="fixed bottom-12 right-12 bg-[#ff6741] text-white px-10 py-5 rounded-2xl shadow-2xl text-sm font-black flex items-center gap-4 animate-in fade-in slide-in-from-bottom-8 duration-300 z-50">
            <Check size={20} className="text-white" /> {toast}
          </div>
        )}

      </main>
    </div>
  );
};

export default App;
