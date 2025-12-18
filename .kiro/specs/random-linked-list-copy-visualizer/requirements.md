# Requirements Document

## Introduction

本项目是一个基于 TypeScript + React + D3.js 的算法演示教学网站，专门用于可视化展示 LeetCode 138 题「随机链表的复制」算法的执行过程。网站支持分步骤演示、代码高亮、变量值展示等功能，帮助用户深入理解算法原理。

## Glossary

- **Algorithm_Visualizer**: 算法可视化演示系统，负责展示算法执行的每个步骤
- **Step_Controller**: 步骤控制器，管理算法演示的前进、后退、播放、暂停等操作
- **Code_Debugger**: 代码调试展示组件，显示带行号的代码并高亮当前执行行
- **Variable_Inspector**: 变量检查器，在代码行后展示当前变量的内存值
- **Linked_List_Canvas**: 链表画布，使用 D3.js 绘制链表节点和指针的可视化图形
- **Random_Pointer**: 随机指针，链表节点中指向任意节点或空节点的额外指针

## Requirements

### Requirement 1

**User Story:** As a learner, I want to see the algorithm visualization with proper page layout, so that I can focus on learning the algorithm in a professional environment.

#### Acceptance Criteria

1. WHEN the page loads THEN the Algorithm_Visualizer SHALL display a title matching LeetCode problem 138 with a clickable link to the original problem page
2. WHEN a user clicks the GitHub icon in the top-right corner THEN the Algorithm_Visualizer SHALL navigate to the project repository page
3. WHEN the page renders THEN the Algorithm_Visualizer SHALL display all content within a single screen without scrolling for standard desktop resolutions
4. WHEN a user hovers over the floating ball in the bottom-right corner THEN the Algorithm_Visualizer SHALL display a WeChat QR code image with instructions to scan and send "leetcode" to join the algorithm discussion group
5. WHEN displaying the QR code image THEN the Algorithm_Visualizer SHALL preserve the original aspect ratio of the image

### Requirement 2

**User Story:** As a learner, I want to control the algorithm execution step by step, so that I can understand each phase of the algorithm at my own pace.

#### Acceptance Criteria

1. WHEN a user clicks the "Previous Step" button or presses the Left Arrow key THEN the Step_Controller SHALL move the visualization to the previous algorithm step
2. WHEN a user clicks the "Next Step" button or presses the Right Arrow key THEN the Step_Controller SHALL advance the visualization to the next algorithm step
3. WHEN a user clicks the "Play/Pause" button or presses the Space key THEN the Step_Controller SHALL toggle between automatic playback and paused state
4. WHEN displaying control buttons THEN the Step_Controller SHALL show keyboard shortcut hints on each button (← for previous, → for next, Space for play/pause)
5. WHEN the visualization reaches the first step THEN the Step_Controller SHALL disable the "Previous Step" button
6. WHEN the visualization reaches the last step THEN the Step_Controller SHALL disable the "Next Step" button

### Requirement 3

**User Story:** As a learner, I want to see the Java code with debug-like features, so that I can follow along with the algorithm execution in the code.

#### Acceptance Criteria

1. WHEN displaying the algorithm code THEN the Code_Debugger SHALL show Java code with syntax highlighting and line numbers
2. WHEN the algorithm advances to a new step THEN the Code_Debugger SHALL highlight the currently executing line with a distinct background color
3. WHEN a variable value changes during execution THEN the Variable_Inspector SHALL display the current value inline after the corresponding code line
4. WHEN rendering code THEN the Code_Debugger SHALL maintain proper indentation and alignment without visual distortion
5. WHEN displaying variable values THEN the Variable_Inspector SHALL show memory addresses or object references for pointer variables

### Requirement 4

**User Story:** As a learner, I want to see a rich visualization of the linked list on the canvas, so that I can understand the data structure and pointer relationships clearly.

#### Acceptance Criteria

1. WHEN rendering the linked list THEN the Linked_List_Canvas SHALL display each node with its value clearly visible
2. WHEN rendering pointers THEN the Linked_List_Canvas SHALL draw next pointers as solid arrows and random pointers as dashed arrows with distinct colors
3. WHEN the algorithm creates new nodes THEN the Linked_List_Canvas SHALL animate the node creation with visual feedback
4. WHEN pointer relationships change THEN the Linked_List_Canvas SHALL animate the pointer updates to show the transition
5. WHEN displaying the canvas THEN the Linked_List_Canvas SHALL show sufficient information density including node indices, pointer labels, and step descriptions
6. WHEN a node is being processed THEN the Linked_List_Canvas SHALL highlight the current node distinctly from other nodes

### Requirement 5

**User Story:** As a developer, I want the project to be automatically deployed to GitHub Pages, so that the visualization is always accessible online.

#### Acceptance Criteria

1. WHEN code is pushed to the main branch THEN the GitHub_Action SHALL trigger an automatic build and deployment process
2. WHEN the build process runs THEN the GitHub_Action SHALL verify that there are no TypeScript compilation errors
3. WHEN the build process runs THEN the GitHub_Action SHALL verify that there are no ESLint errors
4. WHEN the build succeeds THEN the GitHub_Action SHALL deploy the built artifacts to GitHub Pages
5. WHEN the deployment completes THEN the GitHub_Action SHALL make the site accessible at the configured GitHub Pages URL

### Requirement 6

**User Story:** As a learner, I want to see the algorithm steps synchronized between the code and visualization, so that I can understand how each line of code affects the data structure.

#### Acceptance Criteria

1. WHEN the algorithm step changes THEN the Algorithm_Visualizer SHALL synchronize the code highlight, variable values, and canvas visualization simultaneously
2. WHEN displaying a step THEN the Algorithm_Visualizer SHALL show a description of what the current step accomplishes
3. WHEN the algorithm processes a node THEN the Algorithm_Visualizer SHALL indicate which original node corresponds to which copied node
