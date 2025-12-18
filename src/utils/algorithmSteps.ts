import { AlgorithmStep, VisualNode, PointerHighlight } from '../types';

// Java code for LeetCode 138 - Copy List with Random Pointer
export const JAVA_CODE = `public Node copyRandomList(Node head) {
    if (head == null) return null;
    
    // Step 1: Interleave - create copy nodes
    Node cur = head;
    while (cur != null) {
        Node copy = new Node(cur.val);
        copy.next = cur.next;
        cur.next = copy;
        cur = copy.next;
    }
    
    // Step 2: Copy random pointers
    cur = head;
    while (cur != null) {
        if (cur.random != null) {
            cur.next.random = cur.random.next;
        }
        cur = cur.next.next;
    }
    
    // Step 3: Separate the two lists
    cur = head;
    Node copyHead = head.next;
    Node copyCur = copyHead;
    while (cur != null) {
        cur.next = copyCur.next;
        cur = cur.next;
        if (cur != null) {
            copyCur.next = cur.next;
            copyCur = copyCur.next;
        }
    }
    
    return copyHead;
}`;

// Initial linked list data: [7,13,11,10,1] with random pointers
const INITIAL_VALUES = [7, 13, 11, 10, 1];
const RANDOM_INDICES: (number | null)[] = [null, 0, 4, 2, 0]; // random pointer targets

function createInitialNodes(): VisualNode[] {
  return INITIAL_VALUES.map((val, index) => ({
    id: `orig-${index}`,
    val,
    index,
    nextIndex: index < INITIAL_VALUES.length - 1 ? index + 1 : null,
    randomIndex: RANDOM_INDICES[index] ?? null,
    position: { x: 100 + index * 150, y: 100 },
    isOriginal: true,
    isHighlighted: false,
    isProcessed: false,
  }));
}

function createCopyNode(original: VisualNode, copyIndex: number): VisualNode {
  return {
    id: `copy-${original.index}`,
    val: original.val,
    index: copyIndex,
    nextIndex: null,
    randomIndex: null,
    position: { x: original.position.x, y: 250 },
    isOriginal: false,
    isHighlighted: false,
    isProcessed: false,
  };
}

export function generateAlgorithmSteps(): AlgorithmStep[] {
  const steps: AlgorithmStep[] = [];
  let stepId = 0;

  const originalNodes = createInitialNodes();
  let copiedNodes: VisualNode[] = [];

  // Step 0: Initial state - explain the problem
  steps.push({
    id: stepId++,
    phase: 'init',
    description: '【问题说明】给定一个链表，每个节点有两个指针：next（指向下一个节点）和 random（可以指向任意节点或 null）。我们需要创建这个链表的深拷贝。',
    codeLineStart: 1,
    codeLineEnd: 2,
    variables: [
      { name: 'head', value: '→ 节点[0] (值=7)', line: 1, type: 'reference' },
    ],
    visualState: {
      originalNodes: JSON.parse(JSON.stringify(originalNodes)),
      copiedNodes: [],
      activePointers: createInitialPointers(originalNodes),
      highlightedNodeId: null,
    },
  });

  // Explain the algorithm approach
  steps.push({
    id: stepId++,
    phase: 'init',
    description: '【算法思路】使用"交织法"：1️⃣ 在每个原节点后插入复制节点 2️⃣ 利用交织结构复制 random 指针 3️⃣ 分离两个链表',
    codeLineStart: 1,
    codeLineEnd: 2,
    variables: [
      { name: 'head', value: '→ 节点[0] (值=7)', line: 1, type: 'reference' },
    ],
    visualState: {
      originalNodes: JSON.parse(JSON.stringify(originalNodes)),
      copiedNodes: [],
      activePointers: createInitialPointers(originalNodes),
      highlightedNodeId: null,
    },
  });

  // Phase 1: Interleave - create copy nodes
  steps.push({
    id: stepId++,
    phase: 'interleave',
    description: '【第一阶段开始】遍历原链表，在每个原节点后面插入一个复制节点。这样原节点和复制节点交替排列。',
    codeLineStart: 5,
    codeLineEnd: 5,
    variables: [
      { name: 'cur', value: '→ 节点[0] (值=7)', line: 5, type: 'reference' },
    ],
    visualState: {
      originalNodes: JSON.parse(JSON.stringify(originalNodes)),
      copiedNodes: [],
      activePointers: createInitialPointers(originalNodes),
      highlightedNodeId: 'orig-0',
    },
  });

  // Create copy nodes one by one
  for (let i = 0; i < INITIAL_VALUES.length; i++) {
    const origNode = originalNodes[i];
    if (!origNode) continue;
    const newCopy = createCopyNode(origNode, i);
    copiedNodes.push(newCopy);

    const currentOriginals = JSON.parse(JSON.stringify(originalNodes));
    currentOriginals[i].isHighlighted = true;
    currentOriginals[i].isProcessed = true;

    const currentCopies = JSON.parse(JSON.stringify(copiedNodes));
    currentCopies[currentCopies.length - 1].isHighlighted = true;

    const randomInfo = RANDOM_INDICES[i] !== null 
      ? `random→[${RANDOM_INDICES[i]}]` 
      : 'random→null';

    steps.push({
      id: stepId++,
      phase: 'interleave',
      description: `创建节点[${i}]的复制：原节点值=${INITIAL_VALUES[i]}，${randomInfo}。复制节点插入到原节点后面，形成：原[${i}]→复制[${i}]→原[${i+1}]`,
      codeLineStart: 7,
      codeLineEnd: 10,
      variables: [
        { name: 'cur', value: `→ 节点[${i}] (值=${INITIAL_VALUES[i]})`, line: 6, type: 'reference' },
        { name: 'copy', value: `→ 复制[${i}] (值=${INITIAL_VALUES[i]})`, line: 7, type: 'reference' },
        { name: 'cur.next', value: `→ 复制[${i}]`, line: 9, type: 'reference' },
      ],
      visualState: {
        originalNodes: currentOriginals,
        copiedNodes: currentCopies,
        activePointers: createInterleavePointers(currentOriginals, currentCopies, i),
        highlightedNodeId: `copy-${i}`,
      },
    });
  }

  // Phase 1 complete
  steps.push({
    id: stepId++,
    phase: 'interleave',
    description: '【第一阶段完成】所有复制节点已插入。现在链表结构为：原[0]→复制[0]→原[1]→复制[1]→...→原[4]→复制[4]',
    codeLineStart: 11,
    codeLineEnd: 11,
    variables: [],
    visualState: {
      originalNodes: JSON.parse(JSON.stringify(originalNodes)),
      copiedNodes: JSON.parse(JSON.stringify(copiedNodes)),
      activePointers: createInterleavePointers(originalNodes, copiedNodes, INITIAL_VALUES.length - 1),
      highlightedNodeId: null,
    },
  });

  // Phase 2: Copy random pointers
  steps.push({
    id: stepId++,
    phase: 'copyRandom',
    description: '【第二阶段开始】复制 random 指针。关键技巧：如果原节点的 random 指向某节点 X，那么复制节点的 random 应该指向 X 的下一个节点（即 X 的复制节点）',
    codeLineStart: 13,
    codeLineEnd: 13,
    variables: [
      { name: 'cur', value: '→ 节点[0] (值=7)', line: 13, type: 'reference' },
    ],
    visualState: {
      originalNodes: JSON.parse(JSON.stringify(originalNodes)),
      copiedNodes: JSON.parse(JSON.stringify(copiedNodes)),
      activePointers: createInterleavePointers(originalNodes, copiedNodes, INITIAL_VALUES.length - 1),
      highlightedNodeId: 'orig-0',
    },
  });

  // Copy random pointers for each node
  for (let i = 0; i < INITIAL_VALUES.length; i++) {
    const currentCopies = JSON.parse(JSON.stringify(copiedNodes));
    if (RANDOM_INDICES[i] !== null) {
      currentCopies[i].randomIndex = RANDOM_INDICES[i];
    }
    copiedNodes = currentCopies;

    const currentOriginals = JSON.parse(JSON.stringify(originalNodes));
    currentOriginals[i].isHighlighted = true;

    const randomTarget = RANDOM_INDICES[i];
    let randomDesc: string;
    if (randomTarget !== null) {
      randomDesc = `原节点[${i}].random→原节点[${randomTarget}]，所以复制[${i}].random = 原节点[${randomTarget}].next = 复制[${randomTarget}]`;
    } else {
      randomDesc = `原节点[${i}].random = null，所以复制[${i}].random 也设为 null`;
    }

    steps.push({
      id: stepId++,
      phase: 'copyRandom',
      description: randomDesc,
      codeLineStart: 14,
      codeLineEnd: 17,
      variables: [
        { name: 'cur', value: `→ 节点[${i}] (值=${INITIAL_VALUES[i]})`, line: 13, type: 'reference' },
        { name: 'cur.random', value: randomTarget !== null ? `→ 节点[${randomTarget}]` : 'null', line: 15, type: randomTarget !== null ? 'reference' : 'null' },
        { name: 'cur.next.random', value: randomTarget !== null ? `→ 复制[${randomTarget}]` : 'null', line: 16, type: randomTarget !== null ? 'reference' : 'null' },
      ],
      visualState: {
        originalNodes: currentOriginals,
        copiedNodes: currentCopies,
        activePointers: createRandomPhasePointers(currentOriginals, currentCopies, i),
        highlightedNodeId: `orig-${i}`,
      },
    });
  }

  // Phase 2 complete
  steps.push({
    id: stepId++,
    phase: 'copyRandom',
    description: '【第二阶段完成】所有复制节点的 random 指针已正确设置。现在需要分离两个链表。',
    codeLineStart: 18,
    codeLineEnd: 18,
    variables: [],
    visualState: {
      originalNodes: JSON.parse(JSON.stringify(originalNodes)),
      copiedNodes: JSON.parse(JSON.stringify(copiedNodes)),
      activePointers: createRandomPhasePointers(originalNodes, copiedNodes, INITIAL_VALUES.length - 1),
      highlightedNodeId: null,
    },
  });

  // Phase 3: Separate the two lists
  steps.push({
    id: stepId++,
    phase: 'separate',
    description: '【第三阶段开始】分离原链表和复制链表。恢复原链表的 next 指针，同时建立复制链表的 next 指针。',
    codeLineStart: 21,
    codeLineEnd: 23,
    variables: [
      { name: 'cur', value: '→ 节点[0] (值=7)', line: 21, type: 'reference' },
      { name: 'copyHead', value: '→ 复制[0] (值=7)', line: 22, type: 'reference' },
      { name: 'copyCur', value: '→ 复制[0] (值=7)', line: 23, type: 'reference' },
    ],
    visualState: {
      originalNodes: JSON.parse(JSON.stringify(originalNodes)),
      copiedNodes: JSON.parse(JSON.stringify(copiedNodes)),
      activePointers: createRandomPhasePointers(originalNodes, copiedNodes, INITIAL_VALUES.length - 1),
      highlightedNodeId: 'orig-0',
    },
  });

  // Separate nodes one by one
  for (let i = 0; i < INITIAL_VALUES.length; i++) {
    const currentOriginals = JSON.parse(JSON.stringify(originalNodes));
    const currentCopies = JSON.parse(JSON.stringify(copiedNodes));
    
    currentOriginals[i].isHighlighted = true;
    if (i < currentCopies.length) {
      currentCopies[i].isHighlighted = true;
    }

    // Update next pointers for separation
    for (let j = 0; j <= i; j++) {
      currentCopies[j].nextIndex = j < INITIAL_VALUES.length - 1 ? j + 1 : null;
    }

    const nextOrigDesc = i < INITIAL_VALUES.length - 1 
      ? `原[${i}].next = 原[${i+1}]` 
      : `原[${i}].next = null`;
    const nextCopyDesc = i < INITIAL_VALUES.length - 1 
      ? `复制[${i}].next = 复制[${i+1}]` 
      : `复制[${i}].next = null`;

    steps.push({
      id: stepId++,
      phase: 'separate',
      description: `分离节点[${i}]：${nextOrigDesc}，${nextCopyDesc}`,
      codeLineStart: 24,
      codeLineEnd: 30,
      variables: [
        { name: 'cur', value: i < INITIAL_VALUES.length - 1 ? `→ 节点[${i}]` : 'null', line: 21, type: i < INITIAL_VALUES.length - 1 ? 'reference' : 'null' },
        { name: 'copyCur', value: `→ 复制[${i}]`, line: 23, type: 'reference' },
      ],
      visualState: {
        originalNodes: currentOriginals,
        copiedNodes: currentCopies,
        activePointers: createSeparatePhasePointers(currentOriginals, currentCopies, i),
        highlightedNodeId: `copy-${i}`,
      },
    });
  }

  // Final step: return copyHead
  const finalOriginals = JSON.parse(JSON.stringify(originalNodes));
  const finalCopies = JSON.parse(JSON.stringify(copiedNodes));
  finalCopies.forEach((node: VisualNode, idx: number) => {
    node.nextIndex = idx < INITIAL_VALUES.length - 1 ? idx + 1 : null;
  });

  steps.push({
    id: stepId++,
    phase: 'separate',
    description: '【算法完成】✅ 成功创建了原链表的深拷贝！复制链表的每个节点都有正确的 next 和 random 指针。返回 copyHead 作为结果。',
    codeLineStart: 32,
    codeLineEnd: 32,
    variables: [
      { name: 'copyHead', value: '→ 复制[0] (值=7)', line: 22, type: 'reference' },
      { name: '返回值', value: '复制链表头节点', line: 32, type: 'reference' },
    ],
    visualState: {
      originalNodes: finalOriginals,
      copiedNodes: finalCopies,
      activePointers: createFinalPointers(finalOriginals, finalCopies),
      highlightedNodeId: 'copy-0',
    },
  });

  return steps;
}

// Helper functions to create pointer highlights
function createInitialPointers(nodes: VisualNode[]): PointerHighlight[] {
  const pointers: PointerHighlight[] = [];
  
  nodes.forEach((node) => {
    if (node.nextIndex !== null) {
      pointers.push({
        from: node.id,
        to: `orig-${node.nextIndex}`,
        type: 'next',
        isAnimating: false,
      });
    }
    if (node.randomIndex !== null) {
      pointers.push({
        from: node.id,
        to: `orig-${node.randomIndex}`,
        type: 'random',
        isAnimating: false,
      });
    }
  });
  
  return pointers;
}

function createInterleavePointers(originals: VisualNode[], copies: VisualNode[], currentIndex: number): PointerHighlight[] {
  const pointers: PointerHighlight[] = [];
  
  originals.forEach((node, i) => {
    if (i <= currentIndex) {
      pointers.push({
        from: node.id,
        to: `copy-${i}`,
        type: 'next',
        isAnimating: i === currentIndex,
      });
    } else if (node.nextIndex !== null) {
      pointers.push({
        from: node.id,
        to: `orig-${node.nextIndex}`,
        type: 'next',
        isAnimating: false,
      });
    }
    if (node.randomIndex !== null) {
      pointers.push({
        from: node.id,
        to: `orig-${node.randomIndex}`,
        type: 'random',
        isAnimating: false,
      });
    }
  });
  
  copies.forEach((copy, i) => {
    if (i < originals.length - 1) {
      pointers.push({
        from: copy.id,
        to: `orig-${i + 1}`,
        type: 'next',
        isAnimating: false,
      });
    }
  });
  
  return pointers;
}

function createRandomPhasePointers(originals: VisualNode[], copies: VisualNode[], currentIndex: number): PointerHighlight[] {
  const pointers: PointerHighlight[] = [];
  
  originals.forEach((node, i) => {
    pointers.push({
      from: node.id,
      to: `copy-${i}`,
      type: 'next',
      isAnimating: false,
    });
    if (node.randomIndex !== null) {
      pointers.push({
        from: node.id,
        to: `orig-${node.randomIndex}`,
        type: 'random',
        isAnimating: false,
      });
    }
  });
  
  copies.forEach((copy, i) => {
    if (i < originals.length - 1) {
      pointers.push({
        from: copy.id,
        to: `orig-${i + 1}`,
        type: 'next',
        isAnimating: false,
      });
    }
    if (i <= currentIndex && copy.randomIndex !== null) {
      pointers.push({
        from: copy.id,
        to: `copy-${copy.randomIndex}`,
        type: 'random',
        isAnimating: i === currentIndex,
      });
    }
  });
  
  return pointers;
}

function createSeparatePhasePointers(originals: VisualNode[], copies: VisualNode[], currentIndex: number): PointerHighlight[] {
  const pointers: PointerHighlight[] = [];
  
  originals.forEach((node, i) => {
    if (i <= currentIndex) {
      if (i < originals.length - 1) {
        pointers.push({
          from: node.id,
          to: `orig-${i + 1}`,
          type: 'next',
          isAnimating: i === currentIndex,
        });
      }
    } else {
      pointers.push({
        from: node.id,
        to: `copy-${i}`,
        type: 'next',
        isAnimating: false,
      });
    }
    if (node.randomIndex !== null) {
      pointers.push({
        from: node.id,
        to: `orig-${node.randomIndex}`,
        type: 'random',
        isAnimating: false,
      });
    }
  });
  
  copies.forEach((copy, i) => {
    if (i <= currentIndex && i < copies.length - 1) {
      pointers.push({
        from: copy.id,
        to: `copy-${i + 1}`,
        type: 'next',
        isAnimating: i === currentIndex,
      });
    } else if (i > currentIndex && i < originals.length - 1) {
      pointers.push({
        from: copy.id,
        to: `orig-${i + 1}`,
        type: 'next',
        isAnimating: false,
      });
    }
    if (copy.randomIndex !== null) {
      pointers.push({
        from: copy.id,
        to: `copy-${copy.randomIndex}`,
        type: 'random',
        isAnimating: false,
      });
    }
  });
  
  return pointers;
}

function createFinalPointers(originals: VisualNode[], copies: VisualNode[]): PointerHighlight[] {
  const pointers: PointerHighlight[] = [];
  
  originals.forEach((node) => {
    if (node.nextIndex !== null) {
      pointers.push({
        from: node.id,
        to: `orig-${node.nextIndex}`,
        type: 'next',
        isAnimating: false,
      });
    }
    if (node.randomIndex !== null) {
      pointers.push({
        from: node.id,
        to: `orig-${node.randomIndex}`,
        type: 'random',
        isAnimating: false,
      });
    }
  });
  
  copies.forEach((copy) => {
    if (copy.nextIndex !== null) {
      pointers.push({
        from: copy.id,
        to: `copy-${copy.nextIndex}`,
        type: 'next',
        isAnimating: false,
      });
    }
    if (copy.randomIndex !== null) {
      pointers.push({
        from: copy.id,
        to: `copy-${copy.randomIndex}`,
        type: 'random',
        isAnimating: false,
      });
    }
  });
  
  return pointers;
}

// Export for testing
export { createInitialNodes, INITIAL_VALUES, RANDOM_INDICES };
