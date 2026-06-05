import React, { useState } from 'react';
import { SomaticNode, SomaticLink, Story, Domain, NodeStatus } from '../types';
import { 
  X, Heart, Share2, Link2, BookOpen, MapPin, 
  Play, Pause, Award, User, HelpCircle, Flame, Plus, Check 
} from 'lucide-react';

interface NodeCardProps {
  node: SomaticNode | null;
  allNodes: SomaticNode[];
  onClose: () => void;
  language: 'ru' | 'en';
  onSelectNode: (node: SomaticNode) => void;
  onResonate: (nodeId: string) => void;
  onConnectNodes: (sourceId: string, targetId: string) => void;
  onCarryOver: (nodeId: string) => void;
  onAddStory: (nodeId: string, text: string) => void;
  onPlayAudio?: (nodeId: string) => void;
  playingNodeId?: string | null;
}

const DOMAIN_STYLES: Record<Domain, { color: string; bg: string; border: string; text: string }> = {
  body: { color: '#E8A95C', bg: 'bg-[#E8A95C]/10', border: 'border-[#E8A95C]/20', text: 'text-[#E8A95C]' },
  science: { color: '#5C9BE8', bg: 'bg-[#5C9BE8]/10', border: 'border-[#5C9BE8]/20', text: 'text-[#5C9BE8]' },
  philosophy: { color: '#9B5CE8', bg: 'bg-[#9B5CE8]/10', border: 'border-[#9B5CE8]/20', text: 'text-[#9B5CE8]' },
  movement: { color: '#5CE87A', bg: 'bg-[#5CE87A]/10', border: 'border-[#5CE87A]/20', text: 'text-[#5CE87A]' },
  cognition: { color: '#EAEAEA', bg: 'bg-white/5', border: 'border-white/10', text: 'text-white' },
  hybrid: { color: '#E85C7A', bg: 'bg-[#E85C7A]/10', border: 'border-[#E85C7A]/20', text: 'text-[#E85C7A]' }
};

const STATUS_LABELS = {
  ru: {
    seed: 'Семья (Поле)',
    sprout: 'Росток (Поле)',
    alive: 'Живая нода',
    rooted: 'Укоренившаяся',
    atlas: 'Атлас (Верифицировано)'
  },
  en: {
    seed: 'Seed (Field)',
    sprout: 'Sprout (Field)',
    alive: 'Active Cell',
    rooted: 'Rooted Node',
    atlas: 'Atlas Approved'
  }
};

export default function NodeCard({
  node,
  allNodes,
  onClose,
  language,
  onSelectNode,
  onResonate,
  onConnectNodes,
  onCarryOver,
  onAddStory,
  onPlayAudio,
  playingNodeId
}: NodeCardProps) {
  const [activeTab, setActiveTab] = useState<'essence' | 'stories' | 'minimap'>('essence');
  const [isConnectingMode, setIsConnectingMode] = useState<boolean>(false);
  const [selectedTargetId, setSelectedTargetId] = useState<string>('');
  const [newStoryText, setNewStoryText] = useState<string>('');
  const [showAddStoryForm, setShowAddStoryForm] = useState<boolean>(false);
  const [hasResonated, setHasResonated] = useState<boolean>(false);
  const [hasCarried, setHasCarried] = useState<boolean>(false);

  if (!node) return null;

  const style = DOMAIN_STYLES[node.domain] || DOMAIN_STYLES.hybrid;

  // Determine scoring and progression metrics for field nodes
  const nextStatusLabel = () => {
    if (node.status === 'atlas') return '';
    if (node.resonances < 10) return language === 'ru' ? 'до статуса Росток: 10 р.' : 'to Sprout: 10 r.';
    if (node.resonances < 50) return language === 'ru' ? 'до статуса Живая: 50 р.' : 'to Active: 50 r.';
    if (node.resonances < 100) return language === 'ru' ? 'до Укоренения: 100 р.' : 'to Rooted: 100 r.';
    return language === 'ru' ? 'готово к восхождению в Атлас' : 'Ready for Atlas Ascension';
  };

  const getProgressionPercent = () => {
    if (node.status === 'atlas') return 100;
    if (node.resonances >= 100) return 95;
    return Math.min(100, Math.max(10, (node.resonances / 100) * 100));
  };

  // Find linked neighbor nodes (mocked/pre-computed from database references)
  const getLinkedNodes = () => {
    // Return surrounding related nodes
    const relatedList = allNodes.filter(n => n.id !== node.id && n.domain === node.domain);
    // Take up to 4 items
    return relatedList.slice(0, 4);
  };

  const handleResonateClick = () => {
    onResonate(node.id);
    setHasResonated(true);
    setTimeout(() => setHasResonated(false), 2000);
  };

  const handleCarryClick = () => {
    onCarryOver(node.id);
    setHasCarried(true);
    setTimeout(() => setHasCarried(false), 2000);
  };

  const handleConnectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTargetId) return;
    onConnectNodes(node.id, selectedTargetId);
    setIsConnectingMode(false);
    setSelectedTargetId('');
  };

  const handleStorySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStoryText.trim()) return;
    onAddStory(node.id, newStoryText.trim());
    setNewStoryText('');
    setShowAddStoryForm(false);
  };

  const linkedNeighbors = getLinkedNodes();

  return (
    <div 
      className="fixed md:top-24 top-auto bottom-0 right-0 md:w-[460px] w-full md:h-[calc(100vh-120px)] h-[82vh] bg-[#090D16]/95 border-t md:border-t-0 md:border-l border-white/10 backdrop-blur-md text-gray-200 z-40 shadow-2xl flex flex-col overflow-hidden animate-slide-in rounded-t-3xl md:rounded-t-none"
      id="somatic-node-board"
    >
      {/* Drawer Header Drag Handle (visual touch for mobile) */}
      <div className="md:hidden w-12 h-1 bg-white/20 mx-auto my-3 rounded-full shrink-0"></div>

      {/* Primary Header Section */}
      <div className="p-5 pb-4 border-b border-white/5 relative bg-[#0C1220]/75 shrink-0">
        <button 
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg active:scale-95 transition-all"
          id="close-card-btn"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Domain Badge */}
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono tracking-widest uppercase mb-2 ${style.bg} ${style.border} ${style.text}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
          {node.domain.toUpperCase()}
        </span>

        {/* Real-time title of Node */}
        <h2 className="text-xl font-bold font-sans tracking-tight text-white mb-1 pr-8">
          {language === 'ru' ? node.nameRu : node.nameEn}
        </h2>

        {/* Context metadata details */}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-400 font-mono mb-3">
          {node.authorRu && (
            <span className="flex items-center gap-1">
              <User className="w-3.5 h-3.5 opacity-60 text-amber-400" />
              {language === 'ru' ? node.authorRu : node.authorEn}
            </span>
          )}
          {node.epochRu && (
            <span className="px-1.5 py-0.5 bg-white/5 rounded text-[10px]">
              {language === 'ru' ? node.epochRu : node.epochEn}
            </span>
          )}
          {node.addedBy && (
            <span className="text-gray-500">
              {language === 'ru' ? `Добавил: ${node.addedBy}` : `Added by: ${node.addedBy}`}
            </span>
          )}
          <span className="flex items-center gap-1 text-purple-400">
            <Flame className="w-3.5 h-3.5 shrink-0 text-amber-500" />
            {node.resonances} {language === 'ru' ? 'резонансов' : 'resonances'}
          </span>
        </div>

        {/* Evolution Status and Metrics Bar */}
        <div className="bg-white/5 rounded-lg p-2.5 border border-white/5 flex flex-col gap-1.5">
          <div className="flex justify-between items-center text-xs">
            <span className="text-gray-400 font-sans flex items-center gap-1">
              <Award className="w-3.5 h-3.5 text-indigo-400" />
              {STATUS_LABELS[language][node.status]}
            </span>
            <span className="text-[10px] text-gray-500 font-mono">{nextStatusLabel()}</span>
          </div>
          {node.status !== 'atlas' && (
            <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
              <div 
                className="bg-gradient-to-r from-purple-500 via-indigo-400 to-emerald-400 h-full transition-all duration-1000"
                style={{ width: `${getProgressionPercent()}%` }}
              ></div>
            </div>
          )}
        </div>
      </div>

      {/* Tabs navigation panel */}
      <div className="flex bg-[#070B13] border-b border-white/5 text-xs font-semibold shrink-0">
        <button 
          onClick={() => setActiveTab('essence')}
          className={`flex-1 py-3 text-center border-b-2 transition-all ${
            activeTab === 'essence' ? 'border-[#DFB757] text-[#DFB757] bg-white/20 font-bold' : 'border-transparent text-gray-400 hover:text-white hover:bg-white/5'
          }`}
          id="essence-tab"
        >
          {language === 'ru' ? 'СУТЬ' : 'ESSENCE'}
        </button>
        <button 
          onClick={() => setActiveTab('stories')}
          className={`flex-1 py-3 text-center border-b-2 transition-all ${
            activeTab === 'stories' ? 'border-[#DFB757] text-[#DFB757] bg-white/20 font-bold' : 'border-transparent text-gray-400 hover:text-white hover:bg-white/5'
          }`}
          id="stories-tab"
        >
          {language === 'ru' ? 'ИСТОРИИ' : 'NARRATIVES'}
        </button>
        <button 
          onClick={() => setActiveTab('minimap')}
          className={`flex-1 py-3 text-center border-b-2 transition-all ${
            activeTab === 'minimap' ? 'border-[#DFB757] text-[#DFB757] bg-white/20 font-bold' : 'border-transparent text-gray-400 hover:text-white hover:bg-white/5'
          }`}
          id="minimap-tab"
        >
          {language === 'ru' ? 'ЛОКАЛЬНАЯ КАРТА' : 'LATTICE MAP'}
        </button>
      </div>

      {/* Scrollable Tabs Viewport */}
      <div className="flex-1 overflow-y-auto p-5 custom-scrollbar">
        
        {/* TAB 1: ESSENCE (СУТЬ) */}
        {activeTab === 'essence' && (
          <div className="flex flex-col gap-5 animate-fade-in">
            {/* The semantic digest */}
            <div className="bg-[#0C1220]/50 border border-white/5 p-4 rounded-xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-[#DFB757]"></div>
              <p className="text-sm font-sans text-gray-300 leading-relaxed italic">
                "{language === 'ru' ? node.descriptionRu : node.descriptionEn}"
              </p>
            </div>

            {/* Clickable links topology references */}
            <div>
              <h4 className="text-[10px] font-mono tracking-widest text-[#DFB757] uppercase mb-2.5">
                {language === 'ru' ? 'ПЕРЕСЕКАЕТСЯ С СЕМЕЙСТВАМИ:' : 'INTERSECTS WITH:'}
              </h4>
              <div className="grid grid-cols-1 gap-2">
                {linkedNeighbors.map(neighbor => {
                  const nStyle = DOMAIN_STYLES[neighbor.domain] || DOMAIN_STYLES.hybrid;
                  return (
                    <button
                      key={neighbor.id}
                      onClick={() => onSelectNode(neighbor)}
                      className="w-full text-left p-2.5 bg-white/5 border border-white/5 hover:border-white/25 active:bg-white/10 rounded-xl transition-all flex items-center justify-between text-xs cursor-pointer group"
                    >
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full`} style={{ backgroundColor: DOMAIN_STYLES[neighbor.domain].color }} />
                        <span className="font-sans text-gray-300 group-hover:text-white transition-colors">
                          {language === 'ru' ? neighbor.nameRu : neighbor.nameEn}
                        </span>
                      </div>
                      <span className="text-[10px] text-gray-500 font-mono flex items-center gap-1">
                        <Link2 className="w-3 h-3 group-hover:text-white transition-colors" />
                        {neighbor.resonances}
                      </span>
                    </button>
                  );
                })}
                {linkedNeighbors.length === 0 && (
                  <p className="text-xs text-gray-500 font-mono">
                    {language === 'ru' ? 'Связей пока нет. Постройте первую!' : 'No links established yet. Create some!'}
                  </p>
                )}
              </div>
            </div>

            {/* Dynamic visual node details card helper info */}
            <div className="bg-white/5 border border-white/5 p-3.5 rounded-xl flex items-start gap-3">
              <HelpCircle className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
              <div className="text-xs text-gray-400 space-y-1 leading-relaxed">
                <p className="font-sans font-semibold text-white">
                  {language === 'ru' ? 'Как устроен Атлас?' : 'What is the Atlas?'}
                </p>
                <p>
                  {language === 'ru' 
                    ? 'Атлас хранит проверенное годами ручное знание. Пользовательские ноды в «Поле» эволюционируют укоренением за счёт ваших резонансов и растут в Атлас!'
                    : 'The Atlas stands for verified systemic somatic knowledge. User nodes proposed in the "Field" can blossom into full Atlas recognition once and for all!'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: STORIES (ИСТОРИИ) */}
        {activeTab === 'stories' && (
          <div className="flex flex-col gap-4 animate-fade-in">
            <div className="flex items-center justify-between">
              <h4 className="text-[10px] font-mono tracking-widest text-[#DFB757] uppercase">
                {language === 'ru' ? 'ИСТОРИИ И СОЧЕТАНИЯ СВЯЗЕЙ:' : 'DO YOU KNOW THAT...:'}
              </h4>
              <button 
                onClick={() => setShowAddStoryForm(!showAddStoryForm)}
                className="text-xs font-sans text-indigo-400 hover:text-white flex items-center gap-1 active:scale-95 transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                {language === 'ru' ? 'Добавить историю' : 'Add Narrative'}
              </button>
            </div>

            {/* Story input form overlay inside cards */}
            {showAddStoryForm && (
              <form onSubmit={handleStorySubmit} className="bg-white/5 border border-white/10 p-3.5 rounded-xl flex flex-col gap-2 animate-fade-in">
                <p className="text-xs text-[#DFB757] font-mono">
                  {language === 'ru' ? 'РАССКАЖИТЕ НЕОБЫЧНЫЙ СИНТЕЗ СМЫСЛОВ:' : 'SHARE THE ANECDOTE LINK:'}
                </p>
                <textarea
                  value={newStoryText}
                  onChange={(e) => setNewStoryText(e.target.value)}
                  placeholder={language === 'ru' ? 'Вы знаете, что метод Фельденкрайза...' : 'Did you know that...'}
                  rows={3}
                  className="w-full text-xs bg-[#070B13] border border-white/10 p-2 rounded-lg text-white focus:outline-none focus:border-[#DFB757]"
                  required
                />
                <div className="flex justify-end gap-2 text-xs">
                  <button 
                    type="button" 
                    onClick={() => setShowAddStoryForm(false)}
                    className="px-2.5 py-1 text-gray-400 hover:text-white"
                  >
                    {language === 'ru' ? 'Отмена' : 'Cancel'}
                  </button>
                  <button 
                    type="submit" 
                    className="px-3 py-1 bg-indigo-500/80 hover:bg-indigo-600 rounded text-white font-semibold transition-all active:scale-95"
                  >
                    {language === 'ru' ? 'Опубликовать' : 'Submit'}
                  </button>
                </div>
              </form>
            )}

            {/* The archive narratives loop */}
            <div className="space-y-3">
              {node.stories.map((story) => (
                <div key={story.id} className="bg-white/5 border border-white/5 p-4 rounded-xl flex flex-col gap-2">
                  <div className="flex items-center justify-between text-[10px] text-gray-500 font-mono">
                    <span className="flex items-center gap-1">
                      <User className="w-3 h-3 text-indigo-400" />
                      @{story.author}
                    </span>
                    <span className="flex items-center gap-1">
                      <Flame className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
                      {story.rating} {language === 'ru' ? 'раз.' : 'res.'}
                    </span>
                  </div>
                  <p className="text-xs text-gray-300 font-sans leading-relaxed">
                    {language === 'ru' ? story.textRu : story.textEn}
                  </p>
                </div>
              ))}

              {node.stories.length === 0 && (
                <div className="p-8 text-center border-2 border-dashed border-white/5 rounded-2xl flex flex-col items-center justify-center text-gray-500 gap-1.5 bg-black/10">
                  <BookOpen className="w-8 h-8 opacity-40 text-[#DFB757]" />
                  <p className="text-xs">
                    {language === 'ru' ? 'Историй пока нет.' : 'No stories registered.'}
                  </p>
                  <p className="text-[10px] text-gray-500">
                    {language === 'ru' ? 'Коллективный разум спит...' : 'Be the first investigator to tell one!'}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: LOCAL GRID NAVIGATION LATTICE MAP (КАРТА) */}
        {activeTab === 'minimap' && (
          <div className="flex flex-col gap-3 animate-fade-in h-[320px]">
            <h4 className="text-[10px] font-mono tracking-widest text-[#DFB757] uppercase">
              {language === 'ru' ? 'СЕМАНТИЧЕСКИЕ ПАУТИНЫ РАССТОЯНИЙ:' : 'THE SEMANTIC RADIAL SPHERE (1-LEVEL OUT):'}
            </h4>
            <p className="text-[11px] text-gray-500">
              {language === 'ru' ? 'Все соседние укорененные ноды и мосты. Кликните на любую ноду, чтобы войти в неё.' : 'Radial navigation map of near neighbors. Jump between somatic states inside the cards!'}
            </p>

            {/* Interactive local graph container */}
            <div className="relative flex-1 bg-[#060A12] border border-white/5 rounded-2xl flex items-center justify-center overflow-hidden">
              
              {/* Draw animated circular nodes in a constellation orbiter layout */}
              <div className="absolute w-[220px] h-[220px] border border-white/5 rounded-full animate-spin flex items-center justify-center opacity-30" style={{ animationDuration: '40s' }}>
                <div className="absolute top-0 w-2 h-2 rounded-full bg-indigo-400"></div>
                <div className="absolute bottom-0 w-1.5 h-1.5 rounded-full bg-[#E8A95C]"></div>
              </div>

              {/* Central Primary Node */}
              <div className="relative z-10 w-24 h-24 rounded-full border-2 border-[#DFB757] bg-[#0E1528] flex flex-col items-center justify-center p-2 text-center shadow-xl animate-pulse">
                <span className="text-[9px] font-mono text-[#DFB757]">CENTER</span>
                <span className="text-[10px] font-bold text-white leading-tight line-clamp-2">
                  {language === 'ru' ? node.nameRu.replace(/\(.*\)/, '') : node.nameEn.replace(/\(.*\)/, '')}
                </span>
                <div className="absolute -inset-1 rounded-full border border-dashed border-[#DFB757]/30"></div>
              </div>

              {/* Orbiting related links */}
              {linkedNeighbors.map((neighbor, idx) => {
                const angle = (idx * (Math.PI * 2)) / Math.max(1, linkedNeighbors.length);
                const radius = 95;
                const tx = Math.cos(angle) * radius;
                const ty = Math.sin(angle) * radius;

                return (
                  <button
                    key={neighbor.id}
                    onClick={() => onSelectNode(neighbor)}
                    className="absolute p-2 bg-[#0C1221] hover:bg-white/5 border border-white/10 hover:border-[#DFB757] text-white rounded-xl shadow-lg text-[9px] flex flex-col items-center justify-center cursor-pointer transition-all active:scale-95 z-20 text-center w-20 truncate"
                    style={{
                      transform: `translate(${tx}px, ${ty}px)`,
                    }}
                  >
                    <span 
                      className="w-1.5 h-1.5 rounded-full mb-1" 
                      style={{ backgroundColor: DOMAIN_STYLES[neighbor.domain].color }} 
                    />
                    <span className="line-clamp-2 leading-tight">
                      {language === 'ru' ? neighbor.nameRu.replace(/\(.*\)/, '') : neighbor.nameEn.replace(/\(.*\)/, '')}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

      </div>

      {/* FIXED action panels always visible at bottom */}
      <div className="p-4 border-t border-white/10 bg-[#0E1424] shrink-0 space-y-3.5">
        
        {/* Toggle dynamic connect modal form */}
        {isConnectingMode && (
          <form onSubmit={handleConnectSubmit} className="bg-white/5 border border-white/10 p-3 rounded-xl flex flex-col gap-2 text-xs">
            <span className="text-[10px] font-mono text-[#DFB757] uppercase">
              {language === 'ru' ? 'СОБРАТЬ НОВОЕ РЕБРО (УСТАНОВИТЬ СВЯЗЬ):' : 'ESTABLISH NEW SOMATIC CONNECTOR EMBRYO:'}
            </span>
            <div className="flex gap-2">
              <select
                value={selectedTargetId}
                onChange={(e) => setSelectedTargetId(e.target.value)}
                className="flex-1 bg-black/40 border border-white/10 text-white rounded-lg p-1.5 focus:outline-none"
                required
              >
                <option value="">{language === 'ru' ? '-- Выберите ноду --' : '-- Choose target --'}</option>
                {allNodes
                  .filter(n => n.id !== node.id)
                  .map(n => (
                    <option key={n.id} value={n.id}>
                      {language === 'ru' ? n.nameRu : n.nameEn}
                    </option>
                  ))
                }
              </select>
              <button 
                type="submit" 
                className="px-3 bg-indigo-500 hover:bg-indigo-600 rounded-lg text-white font-bold transition-all active:scale-95"
              >
                {language === 'ru' ? 'ОК' : 'Connect'}
              </button>
            </div>
          </form>
        )}

        {/* Primary Interactive Somatic Command Pad (♦ Резонирую • ⟷ Связываю • ↗ Несу дальше) */}
        <div className="grid grid-cols-3 gap-2 text-xs">
          {/* Action 1: Resonate */}
          <button
            onClick={handleResonateClick}
            className={`py-3 px-2 rounded-xl transition-all duration-300 flex flex-col items-center justify-center gap-1.5 border active:scale-95 cursor-pointer ${
              hasResonated 
                ? 'bg-rose-500/20 border-rose-500/50 text-rose-400' 
                : 'bg-white/5 border-white/5 hover:border-rose-500/30 text-gray-300 hover:text-white'
            }`}
          >
            <Heart className={`w-4 h-4 ${hasResonated ? 'fill-current animate-ping scale-110' : 'text-rose-400'}`} />
            <span className="font-sans font-bold tracking-tight text-[10px]">
              {hasResonated ? (language === 'ru' ? 'РЕЗОНАНС +1!' : 'RESONATED!') : (language === 'ru' ? '♦ РЕЗОНИРУЮ' : '♦ RESONATE')}
            </span>
          </button>

          {/* Action 2: Connect */}
          <button
            onClick={() => setIsConnectingMode(!isConnectingMode)}
            className={`py-3 px-2 rounded-xl transition-all duration-300 flex flex-col items-center justify-center gap-1.5 border active:scale-95 cursor-pointer ${
              isConnectingMode 
                ? 'bg-indigo-500/20 border-indigo-500/50 text-indigo-400' 
                : 'bg-white/5 border-white/5 hover:border-indigo-500/30 text-gray-300 hover:text-white'
            }`}
          >
            <Link2 className="w-4 h-4 text-indigo-400" />
            <span className="font-sans font-bold tracking-tight text-[10px]">
              {language === 'ru' ? '⟷ СВЯЗЫВАЮ' : '⟷ CONNECT'}
            </span>
          </button>

          {/* Action 3: Carry Further / Pocket it */}
          <button
            onClick={handleCarryClick}
            className={`py-3 px-2 rounded-xl transition-all duration-300 flex flex-col items-center justify-center gap-1.5 border active:scale-95 cursor-pointer ${
              hasCarried 
                ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400' 
                : 'bg-white/5 border-white/5 hover:border-emerald-500/30 text-gray-300 hover:text-white'
            }`}
          >
            {hasCarried ? (
              <Check className="w-4 h-4 text-emerald-400 animate-bounce" />
            ) : (
              <Share2 className="w-4 h-4 text-emerald-400" />
            )}
            <span className="font-sans font-bold tracking-tight text-[10px]">
              {hasCarried ? (language === 'ru' ? 'ПРИНЯТО В Я' : 'POCKETED') : (language === 'ru' ? '↗ НЕСУ ДАЛЬШЕ' : '↗ CARRY OVER')}
            </span>
          </button>
        </div>

        {/* Embedded quick Audio Player Deck (if play support) */}
        {onPlayAudio && (
          <div className="bg-[#070B13] border border-white/5 rounded-xl p-2.5 flex items-center justify-between text-xs transition-all hover:bg-black">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0">
                <Play className="w-3.5 h-3.5 fill-current" />
              </div>
              <div className="truncate max-w-[200px]">
                <p className="font-semibold text-white leading-normal truncate">
                  {language === 'ru' ? 'Лекционные материалы по ноде' : 'Archive audio lecture materials'}
                </p>
                <p className="text-[10px] text-gray-500">
                  {language === 'ru' ? 'Доступно 45 минут разбора' : 'Stream high fidelity somatic analysis'}
                </p>
              </div>
            </div>
            <button
              onClick={() => onPlayAudio(node.id)}
              className="px-2.5 py-1 text-[10px] bg-indigo-500 hover:bg-indigo-600 hover:text-white text-white font-bold rounded-lg transition-all active:scale-95 cursor-pointer flex items-center gap-1"
            >
              <Play className="w-3 h-3" />
              {language === 'ru' ? 'СЛУШАТЬ' : 'PLAY'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
