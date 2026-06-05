import React, { useRef, useEffect, useState } from 'react';
import { SomaticNode, SomaticLink, Domain, World, PulseParticle } from '../types';
import { Play, Flame, RefreshCw, ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';

interface MyceliumGraphProps {
  nodes: SomaticNode[];
  links: SomaticLink[];
  currentWorld: World;
  language: 'ru' | 'en';
  onNodeSelect: (node: SomaticNode) => void;
  selectedNodeId: string | null;
  themeColor: string; // ambient glow color
  overlayUser: string | null; // Profile name to overlay with
  onNodeResonate?: (nodeId: string) => void;
}

// Colors representing the somatically minded domains
const DOMAIN_COLORS: Record<Domain, string> = {
  body: '#E8A95C',      // Warm Amber / Тёплый янтарь
  science: '#5C9BE8',   // Cold Blue / Холодный синий
  philosophy: '#9B5CE8',// Purple / Фиолетовый
  movement: '#5CE87A',  // Green / Зелёный
  cognition: '#EAEAEA',  // White/Silver / Серебряно-белый
  hybrid: '#E85C7A'     // Coral Red / Розово-красный
};

const DOMAIN_NAMES = {
  ru: {
    body: 'Тело / Соматика',
    science: 'Наука / Физика',
    philosophy: 'Философия / Мышление',
    movement: 'Движение / Практика',
    cognition: 'Язык / Когниция',
    hybrid: 'Пересечение'
  },
  en: {
    body: 'Body / Somatics',
    science: 'Science / Physics',
    philosophy: 'Philosophy / Mind',
    movement: 'Movement / Practice',
    cognition: 'Language / Cognition',
    hybrid: 'Intersection'
  }
};

export default function MyceliumGraph({
  nodes,
  links,
  currentWorld,
  language,
  onNodeSelect,
  selectedNodeId,
  overlayUser,
  onNodeResonate
}: MyceliumGraphProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  
  // Interaction states
  const [zoom, setZoom] = useState<number>(1.0);
  const [panX, setPanX] = useState<number>(0);
  const [panY, setPanY] = useState<number>(0);
  const [draggedNodeId, setDraggedNodeId] = useState<string | null>(null);
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [isLiveActive, setIsLiveActive] = useState<boolean>(true);
  const [isFilterHot, setIsFilterHot] = useState<boolean>(false);

  // Maintain internal copy of nodes/links with physics variables to avoid resetting on render
  const graphStateRef = useRef<{
    nodes: SomaticNode[];
    links: SomaticLink[];
    particles: Record<string, PulseParticle[]>; // linkId -> particles list
    lastWorld: World | null;
    transitionProgress: number; // For transitioning coordinate positions
  }>({
    nodes: [],
    links: [],
    particles: {},
    lastWorld: null,
    transitionProgress: 1.0,
  });

  // Re-sync nodes and initialize positions
  useEffect(() => {
    const internalNodes = [...graphStateRef.current.nodes];
    const newNodes = nodes.map(n => {
      const existing = internalNodes.find(ex => ex.id === n.id);
      
      // Keep position if it already existed
      let x = existing?.x;
      let y = existing?.y;
      
      if (x === undefined || y === undefined) {
        // Distribute nicely near center on spawning
        const angle = Math.random() * Math.PI * 2;
        const radius = 100 + Math.random() * 200;
        x = Math.cos(angle) * radius;
        y = Math.sin(angle) * radius;
      }

      return {
        ...n,
        x,
        y,
        vx: existing?.vx || 0,
        vy: existing?.vy || 0,
        targetX: existing?.targetX ?? x,
        targetY: existing?.targetY ?? y,
        breathPhase: existing?.breathPhase ?? Math.random() * Math.PI * 2,
        breathSpeed: existing?.breathSpeed ?? (0.3 + Math.random() * 0.4),
        baseRadius: n.world === 'atlas' ? 14 : 10,
        currentRadius: existing?.currentRadius ?? (n.world === 'atlas' ? 14 : 10)
      };
    });

    graphStateRef.current.nodes = newNodes;
    graphStateRef.current.links = links.map(lnk => {
      const existing = graphStateRef.current.links.find(l => l.id === lnk.id);
      return { ...lnk, activity: existing?.activity ?? lnk.activity };
    });

    // Setup flowing pulse particles along links
    const newParticles: Record<string, PulseParticle[]> = { ...graphStateRef.current.particles };
    links.forEach(link => {
      if (!newParticles[link.id]) {
        // Spawn particles
        const particleCount = Math.max(1, Math.min(5, Math.ceil(link.activity / 2)));
        newParticles[link.id] = Array.from({ length: particleCount }, () => ({
          progress: Math.random(),
          speed: 0.002 + Math.random() * 0.003,
          opacity: 0.4 + Math.random() * 0.6,
          color: nodes.find(n => n.id === link.source)?.domain 
            ? DOMAIN_COLORS[nodes.find(n => n.id === link.source)!.domain] 
            : '#FFFFFF'
        }));
      }
    });
    graphStateRef.current.particles = newParticles;

  }, [nodes, links]);

  // Handle zooming & panning with mouse / touch
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // Convert screen coordinates to graph coordinates
    const graphX = (mouseX - rect.width / 2 - panX) / zoom;
    const graphY = (mouseY - rect.height / 2 - panY) / zoom;

    // Find if clicked on any node (scaled collision target 30px)
    let clickedNode: SomaticNode | null = null;
    const activeWorldNodes = getFilteredNodes();
    
    for (const node of activeWorldNodes) {
      const dx = (node.x || 0) - graphX;
      const dy = (node.y || 0) - graphY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < Math.max(25, (node.currentRadius || 12))) {
        clickedNode = node;
        break;
      }
    }

    if (clickedNode) {
      setDraggedNodeId(clickedNode.id);
    } else {
      // Dragging background to Pan
      setDraggedNodeId(null);
      
      const startX = e.clientX;
      const startY = e.clientY;
      const initialPanX = panX;
      const initialPanY = panY;

      const handleMouseMovePan = (moveEvent: MouseEvent) => {
        setPanX(initialPanX + (moveEvent.clientX - startX));
        setPanY(initialPanY + (moveEvent.clientY - startY));
      };

      const handleMouseUpPan = () => {
        window.removeEventListener('mousemove', handleMouseMovePan);
        window.removeEventListener('mouseup', handleMouseUpPan);
      };

      window.addEventListener('mousemove', handleMouseMovePan);
      window.addEventListener('mouseup', handleMouseUpPan);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const graphX = (mouseX - rect.width / 2 - panX) / zoom;
    const graphY = (mouseY - rect.height / 2 - panY) / zoom;

    // Support dragging active node
    if (draggedNodeId) {
      const gState = graphStateRef.current;
      const nodeObj = gState.nodes.find(n => n.id === draggedNodeId);
      if (nodeObj) {
        nodeObj.x = graphX;
        nodeObj.y = graphY;
        nodeObj.vx = 0;
        nodeObj.vy = 0;
      }
      return;
    }

    // Support hovering nodes
    let currentHover: SomaticNode | null = null;
    const activeWorldNodes = getFilteredNodes();

    for (const node of activeWorldNodes) {
      const dx = (node.x || 0) - graphX;
      const dy = (node.y || 0) - graphY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < Math.max(20, (node.currentRadius || 12))) {
        currentHover = node;
        break;
      }
    }

    if (currentHover) {
      if (hoveredNodeId !== currentHover.id) {
        setHoveredNodeId(currentHover.id);
      }
    } else {
      if (hoveredNodeId !== null) {
        setHoveredNodeId(null);
      }
    }
  };

  const handleMouseUp = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (draggedNodeId) {
      const node = graphStateRef.current.nodes.find(n => n.id === draggedNodeId);
      if (node) {
        onNodeSelect(node);
      }
      setDraggedNodeId(null);
      return;
    }

    // Clicked empty background
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const graphX = (mouseX - rect.width / 2 - panX) / zoom;
    const graphY = (mouseY - rect.height / 2 - panY) / zoom;

    let clicked = false;
    const activeWorldNodes = getFilteredNodes();
    for (const node of activeWorldNodes) {
      const dx = (node.x || 0) - graphX;
      const dy = (node.y || 0) - graphY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < Math.max(25, (node.currentRadius || 12))) {
        clicked = true;
        break;
      }
    }

    if (!clicked) {
      // Close side sheets or reset selected focus
    }
  };

  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const scaleFactor = 1.1;
    const nextZoom = e.deltaY < 0 ? zoom * scaleFactor : zoom / scaleFactor;
    // Bounds between 0.25x and 6x zoom levels
    setZoom(Math.max(0.2, Math.min(6.0, nextZoom)));
  };

  // Switch physics engine positions dynamically when transitioning worlds
  // Atlas nodes reside more organized, Field is sprawling etc.
  useEffect(() => {
    const gState = graphStateRef.current;
    if (gState.lastWorld !== currentWorld) {
      gState.lastWorld = currentWorld;
      gState.transitionProgress = 0.0;

      // Arrange nodes beautifully based on current perspective
      gState.nodes.forEach(node => {
        let tx = 0;
        let ty = 0;
        
        if (currentWorld === 'atlas') {
          // Semi-concentric or structured grid layout based on domains
          const idx = nodes.indexOf(node);
          const domainIdx = ['body', 'philosophy', 'movement', 'science', 'cognition', 'hybrid'].indexOf(node.domain);
          const angle = (domainIdx * (Math.PI * 2 / 6)) + (Math.random() * 0.4 - 0.2);
          const dist = 140 + (idx % 3) * 60;
          tx = Math.cos(angle) * dist;
          ty = Math.sin(angle) * dist;
        } else if (currentWorld === 'field') {
          // Biological sprawling forest
          const angle = Math.random() * Math.PI * 2;
          const dist = 50 + Math.random() * 320;
          tx = Math.cos(angle) * dist;
          ty = Math.sin(angle) * dist;
        } else {
          // ME: USER CENTRAL NODE WITH MOLECULAR SHELLS ORBITING IT
          if (node.id === 'central-me') {
            tx = 0;
            ty = 0;
          } else {
            // Circle shells
            const seed = Math.sin(nodes.indexOf(node) * 1.5);
            const dist = 120 + Math.abs(seed) * 150;
            const angle = nodes.indexOf(node) * 1.2;
            tx = Math.cos(angle) * dist;
            ty = Math.sin(angle) * dist;
          }
        }

        // Apply target
        node.targetX = tx;
        node.targetY = ty;
      });
    }
  }, [currentWorld, nodes]);

  // Filter which nodes should render based on active world and heat setting
  const getFilteredNodes = () => {
    const gState = graphStateRef.current;
    
    // Add temporary Central 'ME' node if in My Universe ('me') mode
    let baseList = gState.nodes;
    const hasMeNode = baseList.some(n => n.id === 'central-me');

    if (currentWorld === 'me' && !hasMeNode) {
      const meNode: SomaticNode = {
        id: 'central-me',
        nameRu: 'Я (Периферия Наблюдений)',
        nameEn: 'Centred Self / Me',
        domain: 'hybrid',
        world: 'me',
        status: 'rooted',
        resonances: 450,
        descriptionRu: 'Золотой центр моей личной вселенной. Отсюда прорастают мои смыслы, резонансы и связи с Атласом.',
        descriptionEn: 'The golden core of your personal somatic universe. The root of your meanings, resonance echoes, and bridges.',
        stories: [],
        x: 0,
        y: 0,
        vx: 0,
        vy: 0,
        targetX: 0,
        targetY: 0,
        baseRadius: 18,
        currentRadius: 18,
        breathPhase: 0,
        breathSpeed: 0.5
      };
      baseList = [meNode, ...baseList];
      gState.nodes = baseList;
    }

    return baseList.filter(n => {
      // Hot filter limits to active/pulsing items
      if (isFilterHot && n.resonances < 50 && n.id !== 'central-me') return false;

      if (currentWorld === 'atlas') {
        return n.world === 'atlas';
      } else if (currentWorld === 'field') {
        return true; // All nodes visible in organic Field
      } else {
        // ME: Central user, seed nodes they added, resonated or temporary bridges
        if (n.id === 'central-me') return true;
        // Simulating matching user node relationships: nodes they resonated with or added:
        const idx = nodes.indexOf(n);
        return idx % 2 === 0 || n.world === 'me'; // include even indices to populate "Me" space
      }
    });
  };

  // Draw cycle running on animation frames
  useEffect(() => {
    let animationFrameId: number;
    let time = 0;

    const render = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Ensure full screen canvas fit
      if (canvas.width !== canvas.parentElement?.clientWidth || canvas.height !== canvas.parentElement?.clientHeight) {
        canvas.width = canvas.parentElement?.clientWidth || 800;
        canvas.height = canvas.parentElement?.clientHeight || 500;
      }

      const width = canvas.width;
      const height = canvas.height;

      // 1. CLEAR AND FILL DEEP VEIL AMBIENT
      ctx.fillStyle = '#050505'; // Elegant "Elegant Dark" deepest black-brown charcoal
      ctx.fillRect(0, 0, width, height);

      // Subtle ambient overlay grid to emphasize depth
      drawBackgroundMilieu(ctx, width, height, time);

      // PHYSICS loop: apply somatic custom bio-forces if active
      if (isLiveActive) {
        applyOrganicPhysics(time);
      }

      // Convert view context (translate to center & zoom & pans)
      ctx.save();
      ctx.translate(width / 2 + panX, height / 2 + panY);
      ctx.scale(zoom, zoom);

      // Render comparative Split Screen Layout if Graph Overlay active
      if (overlayUser) {
        drawOverlayDivider(ctx, height);
      }

      const activeNodes = getFilteredNodes();
      const activeNodeIds = new Set(activeNodes.map(n => n.id));

      // Filter active links
      const activeLinks = graphStateRef.current.links.filter(lnk => {
        if (currentWorld === 'me') {
          // Link some nodes to central-me
          return activeNodeIds.has(lnk.source) && activeNodeIds.has(lnk.target);
        }
        return activeNodeIds.has(lnk.source) && activeNodeIds.has(lnk.target);
      });

      // Inject custom procedural Links connecting Me Node to somatic shells
      const meNode = activeNodes.find(n => n.id === 'central-me');
      let customMeLinks: { sourceNode: SomaticNode; targetNode: SomaticNode }[] = [];
      if (meNode) {
        activeNodes.forEach(n => {
          if (n.id !== 'central-me' && nodes.indexOf(n) % 2 === 0) {
            customMeLinks.push({ sourceNode: meNode, targetNode: n });
          }
        });
      }

      // 2. DRAW BEZIER LINKS (THE MYCELAL NET)
      ctx.shadowBlur = 0;
      activeLinks.forEach(link => {
        const sourceNode = activeNodes.find(n => n.id === link.source);
        const targetNode = activeNodes.find(n => n.id === link.target);
        if (!sourceNode || !targetNode) return;

        drawMyceliumThread(ctx, sourceNode, targetNode, link, false);
      });

      // Draw custom Me Links
      customMeLinks.forEach(lnk => {
        drawMyceliumThread(ctx, lnk.sourceNode, lnk.targetNode, { id: 'me-lnk-' + lnk.targetNode.id, source: lnk.sourceNode.id, target: lnk.targetNode.id, resonanceWeight: 4, activity: 6 }, true);
      });

      // 3. DRAW SHINING ENERGY PARTICLES ON ROADS
      drawFlowingParticles(ctx, activeNodes, activeLinks, customMeLinks);

      // 4. DRAW NODES (BIO-CELL SPHERES WITH CHOSEN LEVEL OF DETAIL)
      activeNodes.forEach(node => {
        // Evaluate level of detail
        const isHovered = hoveredNodeId === node.id;
        const isSelected = selectedNodeId === node.id;
        const radius = node.currentRadius || 12;

        ctx.save();
        
        // Soft glowing cell core
        const glowColor = DOMAIN_COLORS[node.domain] || '#FFFFFF';
        ctx.shadowColor = glowColor;
        ctx.shadowBlur = (isHovered || isSelected) ? 22 : 8;

        // Custom organic cell contours (slightly non-perfect sphere based on sine phase)
        ctx.beginPath();
        const baseAngleStep = Math.PI / 15;
        const cellPhase = (node.breathPhase || 0) + time * 0.05;
        
        for (let a = 0; a <= Math.PI * 2; a += baseAngleStep) {
          // Organic shape variance: add 4% bumpiness
          const rOffset = Math.sin(a * 5 + cellPhase) * (radius * 0.08);
          const currentR = radius + rOffset;
          const cx = (node.x || 0) + Math.cos(a) * currentR;
          const cy = (node.y || 0) + Math.sin(a) * currentR;
          if (a === 0) {
            ctx.moveTo(cx, cy);
          } else {
            ctx.lineTo(cx, cy);
          }
        }
        ctx.closePath();

        // Node fill (bioluminescent translucent gradient)
        const radGrad = ctx.createRadialGradient(
          (node.x || 0) - radius * 0.2, (node.y || 0) - radius * 0.2, radius * 0.1,
          node.x || 0, node.y || 0, radius
        );
        radGrad.addColorStop(0, '#FFFFFF'); // core light
        radGrad.addColorStop(0.3, glowColor);
        radGrad.addColorStop(1, '#0c111c'); // fading margins

        ctx.fillStyle = radGrad;
        ctx.fill();

        // Cell boundary
        ctx.strokeStyle = isSelected ? '#DFB757' : isHovered ? '#FFFFFF' : glowColor;
        ctx.shadowBlur = 0; // disable shadow for sharp outline
        ctx.lineWidth = isSelected ? 3 : isHovered ? 2 : 1;
        ctx.stroke();

        // Inner glowing dot if seed or active
        if (node.status === 'seed' && currentWorld === 'field') {
          ctx.beginPath();
          ctx.arc(node.x || 0, node.y || 0, radius * 0.2, 0, Math.PI * 2);
          ctx.fillStyle = '#FFFFFF';
          ctx.shadowColor = '#FFFFFF';
          ctx.shadowBlur = 6;
          ctx.fill();
        }

        // Draw level of detail labeling (LOD levels)
        if (zoom > 0.45) {
          const title = language === 'ru' ? node.nameRu : node.nameEn;
          ctx.fillStyle = isSelected ? '#DFB757' : isHovered ? '#FFFFFF' : '#D1D7E0';
          
          if (zoom > 1.8) {
            // High Detail: Under-labels, meta sources
            ctx.font = isHovered || isSelected ? 'bold 11px Inter, sans-serif' : '10px Inter, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(title, node.x || 0, (node.y || 0) + radius + 15);
            
            // Subtitle metadata
            ctx.fillStyle = '#718096';
            ctx.font = '8px monospace';
            const meta = node.authorRu ? (language === 'ru' ? node.authorRu : node.authorEn) : node.addedBy ? `Field: ${node.addedBy}` : '';
            if (meta) {
              ctx.fillText(meta as string, node.x || 0, (node.y || 0) + radius + 26);
            }
          } else {
            // Medium Detail: Simple title
            ctx.font = isHovered || isSelected ? 'bold 10px Inter, sans-serif' : '9px Inter, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(title, node.x || 0, (node.y || 0) + radius + 14);
          }
        }

        ctx.restore();
      });

      // 5. DRAW GOLDEN OVERLAY BRIDGES IN CASE COMPARATIVE OVERLAY REQUESTED
      if (overlayUser) {
        drawGoldenOverlayBridges(ctx, activeNodes, time);
      }

      // 6. ZOOM < 0.45: RENDER DOMAIN CLUSTERS AS COLOR CLOUDS
      if (zoom <= 0.45) {
        drawDomainClustersLabeling(ctx, activeNodes);
      }

      ctx.restore();

      // Mini-map index or instructions overlay (ambiently at bottom-left corner)
      drawCanvasWatermark(ctx, width, height);

      time += 0.05;
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [nodes, zoom, panX, panY, draggedNodeId, hoveredNodeId, isLiveActive, currentWorld, language, selectedNodeId, isFilterHot, overlayUser]);

  // Render a subtle holographic background matrix
  const drawBackgroundMilieu = (ctx: CanvasRenderingContext2D, width: number, height: number, time: number) => {
    ctx.strokeStyle = 'rgba(25, 35, 55, 0.2)';
    ctx.lineWidth = 1;
    const size = 60;
    
    // Smooth matrix panning matching layout center shifts
    const startX = panX % size;
    const startY = panY % size;

    ctx.beginPath();
    for (let x = startX; x < width; x += size) {
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
    }
    for (let y = startY; y < height; y += size) {
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
    }
    ctx.stroke();

    // Center focal circular grids
    ctx.beginPath();
    ctx.arc(width / 2 + panX, height / 2 + panY, 200 * zoom, 0, Math.PI * 2);
    ctx.arc(width / 2 + panX, height / 2 + panY, 400 * zoom, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(25, 45, 75, 0.12)';
    ctx.stroke();
  };

  // Organic physics calculation using Euler verlet integration
  const applyOrganicPhysics = (time: number) => {
    const gState = graphStateRef.current;
    if (!gState.nodes.length) return;

    const gravityStrength = 0.04;
    const repulsionStrength = 2200;
    const attractionStrength = 0.035;
    const damping = 0.75; // high damping so things don't go crazy or oscillate indefinitely

    // Transitioning targets smoothly
    if (gState.transitionProgress < 1.0) {
      gState.transitionProgress += 0.04; // 1 second total
      gState.nodes.forEach(node => {
        if (node.targetX !== undefined && node.targetY !== undefined) {
          node.x = (node.x || 0) + (node.targetX - (node.x || 0)) * 0.15;
          node.y = (node.y || 0) + (node.targetY - (node.y || 0)) * 0.15;
        }
      });
    }

    // 1. REPULSION loop between nodes (preventing overlaps)
    for (let i = 0; i < gState.nodes.length; i++) {
      const n1 = gState.nodes[i];
      for (let j = i + 1; j < gState.nodes.length; j++) {
        const n2 = gState.nodes[j];
        if (n1.id === 'central-me' || n2.id === 'central-me') continue; // keep centre anchored

        let dx = (n2.x || 0) - (n1.x || 0);
        let dy = (n2.y || 0) - (n1.y || 0);
        if (dx === 0 && dy === 0) { dx = 0.1; dy = 0.1; }

        const distSq = dx * dx + dy * dy;
        const dist = Math.sqrt(distSq);

        if (dist < 310) {
          // Coulomb like force
          const force = repulsionStrength / (distSq + 120);
          const forceX = (dx / dist) * force;
          const forceY = (dy / dist) * force;

          n1.vx = (n1.vx || 0) - forceX;
          n1.vy = (n1.vy || 0) - forceY;
          n2.vx = (n2.vx || 0) + forceX;
          n2.vy = (n2.vy || 0) + forceY;
        }
      }
    }

    // 2. ATTRACTION along links (logarithmic springs!)
    gState.links.forEach(link => {
      const sourceNode = gState.nodes.find(n => n.id === link.source);
      const targetNode = gState.nodes.find(n => n.id === link.target);
      if (!sourceNode || !targetNode) return;

      const dx = (targetNode.x || 0) - (sourceNode.x || 0);
      const dy = (targetNode.y || 0) - (sourceNode.y || 0);
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist === 0) return;

      // Spring rest length is 140px
      const restLength = 145;
      const stretch = dist - restLength;
      
      // Logarithmic attraction
      const pull = stretch * attractionStrength * Math.log(link.resonanceWeight + 1);
      const fx = (dx / dist) * pull;
      const fy = (dy / dist) * pull;

      if (sourceNode.id !== 'central-me') {
        sourceNode.vx = (sourceNode.vx || 0) + fx;
        sourceNode.vy = (sourceNode.vy || 0) + fy;
      }
      if (targetNode.id !== 'central-me') {
        targetNode.vx = (targetNode.vx || 0) - fx;
        targetNode.vy = (targetNode.vy || 0) - fy;
      }
    });

    // 3. APPLY FORCES & BREATHE
    gState.nodes.forEach(node => {
      if (node.id === 'central-me') {
        node.x = 0;
        node.y = 0;
        node.vx = 0;
        node.vy = 0;
      } else {
        // Gravity attraction back to target origin centers
        const originX = node.targetX || 0;
        const originY = node.targetY || 0;
        
        node.vx = (node.vx || 0) + (originX - (node.x || 0)) * gravityStrength;
        node.vy = (node.vy || 0) + (originY - (node.y || 0)) * gravityStrength;

        // Apply velocities with damping decay
        node.x = (node.x || 0) + (node.vx || 0);
        node.y = (node.y || 0) + (node.vy || 0);
        node.vx = (node.vx || 0) * damping;
        node.vy = (node.vy || 0) * damping;

        // Add small Brownian organic drift (micro-vibration)
        node.x += (Math.random() * 0.4 - 0.2);
        node.y += (Math.random() * 0.4 - 0.2);
      }

      // Soma breathing sine modulation
      const breathPhase = (node.breathPhase || 0) + time * (node.breathSpeed || 0.4) * 0.03;
      const breathModulation = Math.sin(breathPhase);
      node.currentRadius = (node.baseRadius || 12) * (1.0 + breathModulation * 0.08);
    });
  };

  // Draw mycelial spline links
  const drawMyceliumThread = (
    ctx: CanvasRenderingContext2D,
    source: SomaticNode,
    target: SomaticNode,
    link: SomaticLink,
    isMeConnection: boolean
  ) => {
    // Determine link colors
    let strokeColor = 'rgba(74, 85, 104, 0.22)'; // pale grey default
    let strokeWidth = 1.2;

    const isHoveredLnk = hoveredNodeId === source.id || hoveredNodeId === target.id;
    const isSelectedLnk = selectedNodeId === source.id || selectedNodeId === target.id;

    if (isMeConnection) {
      strokeColor = 'rgba(215, 169, 74, 0.35)'; // gold shimmer thread
      strokeWidth = 1.4;
    } else if (isSelectedLnk) {
      strokeColor = DOMAIN_COLORS[source.domain] || '#FFFFFF';
      strokeWidth = 2.0;
    } else if (isHoveredLnk) {
      strokeColor = DOMAIN_COLORS[source.domain] || '#FFFFFF';
      strokeWidth = 1.6;
    } else {
      // Color coded translucent strands
      strokeColor = `rgba(${hexToRgb(DOMAIN_COLORS[source.domain])}, 0.16)`;
    }

    // Curved Bezier Line (Mycelium filaments must have organic curves!)
    // Calculate control point shifted perpendicular to midpoint
    const sx = source.x || 0;
    const sy = source.y || 0;
    const tx = target.x || 0;
    const ty = target.y || 0;

    const midX = (sx + tx) / 2;
    const midY = (sy + ty) / 2;
    const dx = tx - sx;
    const dy = ty - sy;
    const len = Math.sqrt(dx * dx + dy * dy);

    // Dynamic wave curves using sine of length
    const offset = Math.sin(len * 0.015) * 22;
    const nx = -dy / len;
    const ny = dx / len;
    const cpX = midX + nx * offset;
    const cpY = midY + ny * offset;

    ctx.beginPath();
    ctx.moveTo(sx, sy);
    ctx.quadraticCurveTo(cpX, cpY, tx, ty);
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = strokeWidth;
    ctx.stroke();
  };

  // Render the glowing particles running over mycelium paths
  const drawFlowingParticles = (
    ctx: CanvasRenderingContext2D,
    activeNodes: SomaticNode[],
    activeLinks: SomaticLink[],
    customMeLinks: { sourceNode: SomaticNode; targetNode: SomaticNode }[]
  ) => {
    const gState = graphStateRef.current;

    // Standard active links paths
    activeLinks.forEach(link => {
      const source = activeNodes.find(n => n.id === link.source);
      const target = activeNodes.find(n => n.id === link.target);
      if (!source || !target) return;

      const particlesList = gState.particles[link.id] || [];
      particlesList.forEach(p => {
        // Increment progress on thread
        p.progress += p.speed;
        if (p.progress >= 1.0) {
          p.progress = 0.0;
          p.opacity = 0.4 + Math.random() * 0.6;
        }

        // Project coordinate on Bezier
        const sx = source.x || 0;
        const sy = source.y || 0;
        const tx = target.x || 0;
        const ty = target.y || 0;

        const midX = (sx + tx) / 2;
        const midY = (sy + ty) / 2;
        const dx = tx - sx;
        const dy = ty - sy;
        const len = Math.sqrt(dx * dx + dy * dy);
        const offset = Math.sin(len * 0.015) * 22;
        const nx = -dy / len;
        const ny = dx / len;
        const cpX = midX + nx * offset;
        const cpY = midY + ny * offset;

        // Quadratic Bezier interpolation
        const t = p.progress;
        const px = (1 - t) * (1 - t) * sx + 2 * (1 - t) * t * cpX + t * t * tx;
        const py = (1 - t) * (1 - t) * sy + 2 * (1 - t) * t * cpY + t * t * ty;

        // Draw particle dot
        ctx.beginPath();
        ctx.arc(px, py, 2.0, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0;
      });
    });
  };

  // Draw golden comparative lines when "Show Intersections" is triggered
  const drawGoldenOverlayBridges = (ctx: CanvasRenderingContext2D, activeNodes: SomaticNode[], time: number) => {
    // We trigger golden spark bridges between nodes on left vs right sides
    ctx.save();
    ctx.shadowBlur = 10;
    ctx.shadowColor = '#DFB757';
    ctx.strokeStyle = `rgba(223, 183, 87, ${0.45 + Math.sin(time * 3) * 0.15})`;
    ctx.lineWidth = 1.8;

    // Drawing a visual overlay line connecting items that highlight alignment
    const somaticsNode = activeNodes.find(n => n.id === 'soma-hanna');
    const batesonNode = activeNodes.find(n => n.id === 'pattern-bateson');
    const gazeNode = activeNodes.find(n => n.id === 'field-gaze');

    if (somaticsNode && batesonNode) {
      ctx.beginPath();
      ctx.moveTo(somaticsNode.x || 0, somaticsNode.y || 0);
      ctx.lineTo(batesonNode.x || 0, batesonNode.y || 0);
      ctx.stroke();
    }

    if (batesonNode && gazeNode) {
      ctx.beginPath();
      ctx.moveTo(batesonNode.x || 0, batesonNode.y || 0);
      ctx.lineTo(gazeNode.x || 0, gazeNode.y || 0);
      ctx.stroke();
    }

    // Sprinkle golden sparks flowing directly along these overlay intersections
    ctx.restore();
  };

  // Renders zoomed-out color fields representing domains (Dilation of visual space)
  const drawDomainClustersLabeling = (ctx: CanvasRenderingContext2D, activeNodes: SomaticNode[]) => {
    const domains: Domain[] = ['body', 'science', 'philosophy', 'movement', 'cognition', 'hybrid'];
    
    domains.forEach(dom => {
      const domNodes = activeNodes.filter(n => n.domain === dom);
      if (!domNodes.length) return;

      // Find average centroid point
      let sumX = 0, sumY = 0;
      domNodes.forEach(n => {
        sumX += n.x || 0;
        sumY += n.y || 0;
      });
      const avgX = sumX / domNodes.length;
      const avgY = sumY / domNodes.length;

      // Draw massive soft radiant cloud behind
      const radiusCloud = 120;
      const grad = ctx.createRadialGradient(avgX, avgY, 10, avgX, avgY, radiusCloud);
      grad.addColorStop(0, `rgba(${hexToRgb(DOMAIN_COLORS[dom])}, 0.22)`);
      grad.addColorStop(1, 'rgba(5, 5, 5, 0)');

      ctx.save();
      ctx.beginPath();
      ctx.arc(avgX, avgY, radiusCloud, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();

      // Display high quality domain cluster banner
      ctx.fillStyle = DOMAIN_COLORS[dom];
      ctx.font = 'bold 15px Clash Display, Space Grotesk, sans-serif';
      ctx.textAlign = 'center';
      const labelText = DOMAIN_NAMES[language][dom];
      ctx.fillText(labelText.toUpperCase(), avgX, avgY);
      
      ctx.font = '10px Roboto Mono, monospace';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.fillText(`${domNodes.length} NODES`, avgX, avgY + 18);
      ctx.restore();
    });
  };

  // Custom Split line divider for Dual Overlay comparative universe
  const drawOverlayDivider = (ctx: CanvasRenderingContext2D, height: number) => {
    ctx.save();
    // Glowing laser division line
    ctx.strokeStyle = 'rgba(223, 183, 87, 0.15)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(0, -9999);
    ctx.lineTo(0, 9999);
    ctx.stroke();

    // Side headers
    ctx.fillStyle = 'rgba(215, 169, 74, 0.4)';
    ctx.font = '8px monospace';
    ctx.textAlign = 'right';
    ctx.fillText(language === 'ru' ? 'МОЯ ВСЕЛЕННАЯ' : 'KINDRED SELF', -20, -180);
    ctx.textAlign = 'left';
    ctx.fillText(`${overlayUser?.toUpperCase()}`, 20, -180);
    ctx.restore();
  };

  // Watermarks, controls help
  const drawCanvasWatermark = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.save();
    ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.font = '9px monospace';
    ctx.textAlign = 'left';
    
    const scaleTxt = `${(zoom * 100).toFixed(0)}%`;
    const worldTxt = `${currentWorld === 'atlas' ? 'ATLAS' : currentWorld === 'field' ? 'FIELD' : 'MY UNIVERSE'}`;
    
    ctx.fillText(`SYSTEM: ${worldTxt} // SCALE: ${scaleTxt}`, 20, height - 20);

    // Quick visual legend of keys at bottom right
    ctx.textAlign = 'right';
    const legend = language === 'ru' 
      ? 'Вращение: Свайп/Перетаскивание • Приближение: Колесо • Тап: Карточка' 
      : 'Pan: Drag canvas • Zoom: Scroll • Click node: Detail info';
    ctx.fillText(legend, width - 20, height - 20);
    ctx.restore();
  };

  // Helper utility converting HEX theme colors to RGB formatted integers
  const hexToRgb = (hex: string): string => {
    const cleaned = hex.replace('#', '');
    const r = parseInt(cleaned.substring(0, 2), 16);
    const g = parseInt(cleaned.substring(2, 4), 16);
    const b = parseInt(cleaned.substring(4, 6), 16);
    return `${r}, ${g}, ${b}`;
  };

  // Triggering manual zoom configurations
  const handleZoomIn = () => setZoom(prev => Math.min(6.0, prev * 1.3));
  const handleZoomOut = () => setZoom(prev => Math.max(0.2, prev / 1.3));
  const handleRecenter = () => {
    setPanX(0);
    setPanY(0);
    setZoom(1.0);
  };

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center select-none overflow-hidden" id="mycelium-viewport">
      
      {/* 2D High Performance Somatic Mycelium Workspace Canvas */}
      <canvas
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onWheel={handleWheel}
        className="w-full h-full cursor-grab active:cursor-grabbing block"
      />

      {/* Floating Graph Toolbar HUD at bottom-left */}
      <div className="absolute bottom-16 left-4 flex gap-1 z-20 bg-[#0C111D]/80 backdrop-blur-md p-1.5 rounded-xl border border-white/5 shadow-xl">
        <button
          onClick={handleZoomIn}
          className="p-2 text-gray-400 hover:text-white hover:bg-white/5 active:scale-95 transition-all rounded-lg"
          title={language === 'ru' ? 'Приблизить' : 'Zoom In'}
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={handleZoomOut}
          className="p-2 text-gray-400 hover:text-white hover:bg-white/5 active:scale-95 transition-all rounded-lg"
          title={language === 'ru' ? 'Отдалить' : 'Zoom Out'}
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <button
          onClick={handleRecenter}
          className="p-2 text-gray-400 hover:text-white hover:bg-white/5 active:scale-95 transition-all rounded-lg"
          title={language === 'ru' ? 'Центрировать' : 'Recenter Graph'}
        >
          <Maximize2 className="w-4 h-4" />
        </button>
        <div className="w-[1px] h-6 bg-white/10 self-center mx-1"></div>
        <button
          onClick={() => setIsLiveActive(!isLiveActive)}
          className={`p-2 rounded-lg transition-all active:scale-95 flex items-center gap-1.5 px-3 text-xs ${
            isLiveActive 
              ? 'text-emerald-400 bg-emerald-500/10' 
              : 'text-gray-400 bg-white/5'
          }`}
          title={language === 'ru' ? 'Остановить/Запустить физику дыхания' : 'Pause/Play somatic breath physics'}
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLiveActive ? 'animate-spin' : ''}`} style={{ animationDuration: isLiveActive ? '15s' : '0s' }} />
          <span>{isLiveActive ? (language === 'ru' ? 'ЖИВОЙ' : 'LIVE') : (language === 'ru' ? 'ПАУЗА' : 'PAUSED')}</span>
        </button>

        <button
          onClick={() => setIsFilterHot(!isFilterHot)}
          className={`p-2 rounded-lg transition-all active:scale-95 flex items-center gap-1.5 px-3 text-xs ${
            isFilterHot 
              ? 'text-amber-400 bg-amber-500/15' 
              : 'text-gray-400 bg-white/5'
          }`}
          title={language === 'ru' ? 'Показать горячие смыслы сообщества' : 'Filter hot community resonances'}
        >
          <Flame className="w-3.5 h-3.5" />
          <span>{isFilterHot ? (language === 'ru' ? 'ГОРЯЧИЕ' : 'HOT') : (language === 'ru' ? 'ВСЁ' : 'ALL')}</span>
        </button>
      </div>
    </div>
  );
}
