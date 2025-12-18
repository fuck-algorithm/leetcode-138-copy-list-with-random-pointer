import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { VisualNode, PointerHighlight } from '../types';
import './LinkedListCanvas.css';

interface LinkedListCanvasProps {
  originalNodes: VisualNode[];
  copiedNodes: VisualNode[];
  activePointers: PointerHighlight[];
  highlightedNodeId: string | null;
  stepDescription: string;
  phase?: string;
}

const NODE_WIDTH = 70;
const NODE_HEIGHT = 45;
const NODE_SPACING = 130;
const ROW_SPACING = 140;
const MARGIN = { top: 100, left: 100 };

export function LinkedListCanvas({
  originalNodes,
  copiedNodes,
  activePointers,
  highlightedNodeId,
  phase,
}: LinkedListCanvasProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const defs = svg.append('defs');
    
    // Next pointer arrow (blue)
    defs.append('marker')
      .attr('id', 'arrow-next')
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', 8)
      .attr('refY', 0)
      .attr('markerWidth', 6)
      .attr('markerHeight', 6)
      .attr('orient', 'auto')
      .append('path')
      .attr('d', 'M0,-5L10,0L0,5')
      .attr('fill', '#1890ff');

    // Random pointer arrow (red)
    defs.append('marker')
      .attr('id', 'arrow-random')
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', 8)
      .attr('refY', 0)
      .attr('markerWidth', 6)
      .attr('markerHeight', 6)
      .attr('orient', 'auto')
      .append('path')
      .attr('d', 'M0,-5L10,0L0,5')
      .attr('fill', '#ff4d4f');

    // Animated arrow (yellow)
    defs.append('marker')
      .attr('id', 'arrow-animated')
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', 8)
      .attr('refY', 0)
      .attr('markerWidth', 7)
      .attr('markerHeight', 7)
      .attr('orient', 'auto')
      .append('path')
      .attr('d', 'M0,-5L10,0L0,5')
      .attr('fill', '#faad14');

    const allNodes = new Map<string, { x: number; y: number }>();
    
    originalNodes.forEach((node, i) => {
      allNodes.set(node.id, { x: MARGIN.left + i * NODE_SPACING, y: MARGIN.top });
    });

    copiedNodes.forEach((node, i) => {
      allNodes.set(node.id, { x: MARGIN.left + i * NODE_SPACING, y: MARGIN.top + ROW_SPACING });
    });

    // Draw pointers
    const pointerGroup = svg.append('g').attr('class', 'pointers');
    
    activePointers.forEach((pointer) => {
      const from = allNodes.get(pointer.from);
      const to = allNodes.get(pointer.to);
      if (!from || !to) return;

      const isNext = pointer.type === 'next';
      const isSameRow = Math.abs(from.y - to.y) < 10;
      
      let path: string;
      if (isNext && isSameRow) {
        path = `M${from.x + NODE_WIDTH},${from.y + NODE_HEIGHT / 2} L${to.x},${to.y + NODE_HEIGHT / 2}`;
      } else if (isNext && !isSameRow) {
        const midY = (from.y + to.y) / 2;
        path = `M${from.x + NODE_WIDTH / 2},${from.y + NODE_HEIGHT} L${from.x + NODE_WIDTH / 2},${midY} L${to.x + NODE_WIDTH / 2},${midY} L${to.x + NODE_WIDTH / 2},${to.y}`;
      } else {
        const fromX = from.x + NODE_WIDTH / 2;
        const fromY = from.y + NODE_HEIGHT;
        const toX = to.x + NODE_WIDTH / 2;
        const toY = to.y + NODE_HEIGHT;
        const dx = toX - fromX;
        const curveHeight = Math.min(Math.abs(dx) * 0.3, 60);
        path = `M${fromX},${fromY} Q${fromX},${fromY + curveHeight} ${(fromX + toX) / 2},${fromY + curveHeight} Q${toX},${fromY + curveHeight} ${toX},${toY}`;
      }

      const strokeColor = pointer.isAnimating ? '#faad14' : (isNext ? '#1890ff' : '#ff4d4f');
      const markerId = pointer.isAnimating ? 'arrow-animated' : `arrow-${pointer.type}`;

      pointerGroup.append('path')
        .attr('d', path)
        .attr('class', `pointer-line ${pointer.type} ${pointer.isAnimating ? 'animating' : ''}`)
        .attr('marker-end', `url(#${markerId})`)
        .attr('fill', 'none')
        .attr('stroke', strokeColor)
        .attr('stroke-width', pointer.isAnimating ? 3 : 2)
        .attr('stroke-dasharray', isNext ? 'none' : '5,5');
    });

    // Draw nodes
    const originalGroup = svg.append('g').attr('class', 'original-nodes');
    drawNodes(originalGroup, originalNodes, allNodes, highlightedNodeId, true);

    const copyGroup = svg.append('g').attr('class', 'copy-nodes');
    drawNodes(copyGroup, copiedNodes, allNodes, highlightedNodeId, false);

    // Labels
    svg.append('text')
      .attr('x', 20)
      .attr('y', MARGIN.top + NODE_HEIGHT / 2)
      .attr('fill', '#1890ff')
      .attr('font-size', '13px')
      .attr('font-weight', '600')
      .text('原链表 →');

    if (copiedNodes.length > 0) {
      svg.append('text')
        .attr('x', 20)
        .attr('y', MARGIN.top + ROW_SPACING + NODE_HEIGHT / 2)
        .attr('fill', '#52c41a')
        .attr('font-size', '13px')
        .attr('font-weight', '600')
        .text('复制链表 →');
    }

    // Title
    svg.append('text')
      .attr('x', MARGIN.left)
      .attr('y', 30)
      .attr('fill', '#333')
      .attr('font-size', '16px')
      .attr('font-weight', '600')
      .text('链表可视化');

  }, [originalNodes, copiedNodes, activePointers, highlightedNodeId]);

  const getPhaseText = (p: string | undefined) => {
    switch (p) {
      case 'init': return '初始化';
      case 'interleave': return '第一阶段：交织复制';
      case 'copyRandom': return '第二阶段：复制随机指针';
      case 'separate': return '第三阶段：分离链表';
      default: return '准备中';
    }
  };

  return (
    <div className="canvas-wrapper">
      <svg ref={svgRef} className="linked-list-svg" />
      
      <div className="canvas-legend">
        <div className="legend-title">图例说明</div>
        <div className="legend-item">
          <div className="legend-line next" />
          <span className="legend-text">next 指针</span>
        </div>
        <div className="legend-item">
          <div className="legend-line random" />
          <span className="legend-text">random 指针</span>
        </div>
        <div className="legend-item">
          <div className="legend-node original" />
          <span className="legend-text">原节点</span>
        </div>
        <div className="legend-item">
          <div className="legend-node copy" />
          <span className="legend-text">复制节点</span>
        </div>
        <div className="legend-item">
          <div className="legend-node highlighted" />
          <span className="legend-text">当前操作节点</span>
        </div>
      </div>

      <div className="phase-indicator">
        <div className="phase-label">当前阶段</div>
        <div className="phase-name">{getPhaseText(phase)}</div>
      </div>
    </div>
  );
}

function drawNodes(
  group: d3.Selection<SVGGElement, unknown, null, undefined>,
  nodes: VisualNode[],
  positions: Map<string, { x: number; y: number }>,
  highlightedNodeId: string | null,
  isOriginal: boolean
) {
  nodes.forEach((node) => {
    const pos = positions.get(node.id);
    if (!pos) return;

    const isHighlighted = node.id === highlightedNodeId || node.isHighlighted;
    const nodeGroup = group.append('g')
      .attr('class', 'node-group')
      .attr('transform', `translate(${pos.x}, ${pos.y})`);

    // Shadow
    nodeGroup.append('rect')
      .attr('x', 2)
      .attr('y', 2)
      .attr('width', NODE_WIDTH)
      .attr('height', NODE_HEIGHT)
      .attr('rx', 8)
      .attr('ry', 8)
      .attr('fill', 'rgba(0,0,0,0.1)');

    // Node rectangle
    nodeGroup.append('rect')
      .attr('width', NODE_WIDTH)
      .attr('height', NODE_HEIGHT)
      .attr('rx', 8)
      .attr('ry', 8)
      .attr('fill', isHighlighted ? '#fff3cd' : (isOriginal ? '#e6f7ff' : '#f6ffed'))
      .attr('stroke', isHighlighted ? '#faad14' : (isOriginal ? '#1890ff' : '#52c41a'))
      .attr('stroke-width', isHighlighted ? 3 : 2);

    // Node value
    nodeGroup.append('text')
      .attr('x', NODE_WIDTH / 2)
      .attr('y', NODE_HEIGHT / 2)
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'middle')
      .attr('font-size', '18px')
      .attr('font-weight', '700')
      .attr('fill', '#333')
      .text(node.val);

    // Node index label
    nodeGroup.append('text')
      .attr('x', NODE_WIDTH / 2)
      .attr('y', -10)
      .attr('text-anchor', 'middle')
      .attr('font-size', '11px')
      .attr('fill', '#666')
      .text(`索引: ${node.index}`);

    // Random pointer target info
    if (node.randomIndex !== null) {
      nodeGroup.append('text')
        .attr('x', NODE_WIDTH / 2)
        .attr('y', NODE_HEIGHT + 14)
        .attr('text-anchor', 'middle')
        .attr('font-size', '10px')
        .attr('fill', '#ff4d4f')
        .text(`random→[${node.randomIndex}]`);
    } else {
      nodeGroup.append('text')
        .attr('x', NODE_WIDTH / 2)
        .attr('y', NODE_HEIGHT + 14)
        .attr('text-anchor', 'middle')
        .attr('font-size', '10px')
        .attr('fill', '#999')
        .text('random→null');
    }
  });
}
