// Chess Calculation Tree Application
// Explores move possibilities up to 12 moves deep

class ChessCalculationTree {
    constructor() {
        this.chess = new Chess();
        this.board = null;
        this.moveTree = null;
        this.currentNode = null;
        this.maxDepth = 12;
        this.totalNodesGenerated = 0;

        this.init();
    }

    init() {
        // Initialize chessboard
        const config = {
            draggable: true,
            position: 'start',
            onDragStart: this.onDragStart.bind(this),
            onDrop: this.onDrop.bind(this),
            onSnapEnd: this.onSnapEnd.bind(this)
        };

        this.board = Chessboard('chessboard', config);

        // Bind event listeners
        this.bindEvents();

        // Update UI
        this.updatePositionInfo();
    }

    bindEvents() {
        $('#startBtn').on('click', () => this.loadStartPosition());
        $('#clearBtn').on('click', () => this.clearBoard());
        $('#flipBtn').on('click', () => this.board.flip());
        $('#loadFenBtn').on('click', () => this.loadFen());
        $('#generateTreeBtn').on('click', () => this.generateMoveTree());
        $('#collapseAllBtn').on('click', () => this.collapseAll());
        $('#expandAllBtn').on('click', () => this.expandAll());

        // Load FEN on Enter key
        $('#fenInput').on('keypress', (e) => {
            if (e.which === 13) this.loadFen();
        });
    }

    // Chessboard drag handlers
    onDragStart(source, piece, position, orientation) {
        // Don't allow moves if game is over
        if (this.chess.game_over()) return false;

        // Only allow picking up pieces for the side to move
        if ((this.chess.turn() === 'w' && piece.search(/^b/) !== -1) ||
            (this.chess.turn() === 'b' && piece.search(/^w/) !== -1)) {
            return false;
        }
    }

    onDrop(source, target) {
        // Try to make the move
        const move = this.chess.move({
            from: source,
            to: target,
            promotion: 'q' // always promote to queen for simplicity
        });

        // Illegal move
        if (move === null) return 'snapback';

        this.updatePositionInfo();
    }

    onSnapEnd() {
        this.board.position(this.chess.fen());
    }

    // Position management
    loadStartPosition() {
        this.chess.reset();
        this.board.start();
        this.updatePositionInfo();
        this.clearTree();
    }

    clearBoard() {
        this.chess.clear();
        this.board.clear();
        this.updatePositionInfo();
        this.clearTree();
    }

    loadFen() {
        const fen = $('#fenInput').val().trim();
        if (!fen) return;

        const success = this.chess.load(fen);
        if (success) {
            this.board.position(fen);
            this.updatePositionInfo();
            this.clearTree();
            $('#fenInput').val('');
        } else {
            alert('Invalid FEN string');
        }
    }

    updatePositionInfo() {
        // Update turn indicator
        const turn = this.chess.turn() === 'w' ? 'White' : 'Black';
        $('#turnIndicator').text(turn).removeClass('white black').addClass(turn.toLowerCase());

        // Update move number
        const moveNumber = this.chess.moveNumber();
        $('#moveNumber').text(moveNumber);

        // Update FEN placeholder
        $('#fenInput').attr('placeholder', this.chess.fen());
    }

    // Move tree generation
    generateMoveTree() {
        // Show loading state
        $('#moveTree').html('<div class="loading">Generating move tree</div>');

        // Use setTimeout to allow UI to update
        setTimeout(() => {
            this.totalNodesGenerated = 0;
            const startTime = Date.now();

            // Generate tree from current position
            this.moveTree = this.buildTreeNode(this.chess.fen(), 0, null);

            const endTime = Date.now();
            console.log(`Tree generated in ${endTime - startTime}ms with ${this.totalNodesGenerated} nodes`);

            // Render tree
            this.renderTree();
            this.updateTreeStats();
        }, 50);
    }

    buildTreeNode(fen, depth, parentMove) {
        if (depth >= this.maxDepth) return null;

        // Create a temporary chess instance for this position
        const tempChess = new Chess(fen);

        // Get all legal moves
        const legalMoves = tempChess.moves({ verbose: true });

        if (legalMoves.length === 0) return null; // No moves available

        const node = {
            fen: fen,
            depth: depth,
            move: parentMove,
            children: [],
            turn: tempChess.turn(),
            moveNumber: tempChess.moveNumber()
        };

        this.totalNodesGenerated++;

        // Generate children for each legal move
        for (const move of legalMoves) {
            // Make the move
            tempChess.move(move);
            const newFen = tempChess.fen();

            // Recursively build child node
            const childNode = this.buildTreeNode(newFen, depth + 1, move);

            if (childNode) {
                node.children.push(childNode);
            } else {
                // Leaf node - still add it even if it has no children
                this.totalNodesGenerated++;
                node.children.push({
                    fen: newFen,
                    depth: depth + 1,
                    move: move,
                    children: [],
                    turn: tempChess.turn(),
                    moveNumber: tempChess.moveNumber()
                });
            }

            // Undo the move for next iteration
            tempChess.undo();
        }

        return node;
    }

    renderTree() {
        if (!this.moveTree) {
            $('#moveTree').html('<div class="tree-placeholder">No tree generated</div>');
            return;
        }

        const treeHtml = this.renderTreeNode(this.moveTree);
        $('#moveTree').html(treeHtml);

        // Bind click events for moves
        $('.move-item').on('click', (e) => {
            const fen = $(e.currentTarget).data('fen');
            this.loadPosition(fen);

            // Update active state
            $('.move-item').removeClass('active');
            $(e.currentTarget).addClass('active');
        });

        // Bind expand/collapse toggles
        $('.expand-toggle').on('click', (e) => {
            e.stopPropagation();
            const $toggle = $(e.currentTarget);
            const $children = $toggle.closest('.tree-node').children('.children');

            if ($children.hasClass('collapsed')) {
                $children.removeClass('collapsed');
                $toggle.text('−');
            } else {
                $children.addClass('collapsed');
                $toggle.text('+');
            }
        });
    }

    renderTreeNode(node, isRoot = true) {
        if (!node) return '';

        let html = '';

        if (isRoot) {
            html += '<div class="tree-node depth-0">';
            html += '<div class="move-item" data-fen="' + node.fen + '">';
            html += '<span class="move-notation">Starting Position</span>';
            html += '</div>';

            if (node.children.length > 0) {
                html += '<div class="children">';
                for (const child of node.children) {
                    html += this.renderTreeNode(child, false);
                }
                html += '</div>';
            }
            html += '</div>';
        } else {
            const hasChildren = node.children && node.children.length > 0;
            const moveNotation = this.formatMoveNotation(node);

            html += '<div class="tree-node depth-' + node.depth + '">';
            html += '<div class="move-item" data-fen="' + node.fen + '">';

            if (hasChildren) {
                html += '<span class="expand-toggle">−</span>';
            } else {
                html += '<span style="width: 20px;"></span>';
            }

            html += '<span class="move-notation">' + moveNotation + '</span>';
            html += '<span class="move-info">';
            html += 'Depth: ' + node.depth;
            if (hasChildren) {
                html += ' | ' + node.children.length + ' replies';
            }
            html += '</span>';
            html += '</div>';

            if (hasChildren) {
                html += '<div class="children">';
                for (const child of node.children) {
                    html += this.renderTreeNode(child, false);
                }
                html += '</div>';
            }

            html += '</div>';
        }

        return html;
    }

    formatMoveNotation(node) {
        if (!node.move) return '';

        const move = node.move;
        let notation = '';

        // Add move number for white moves
        if (node.turn === 'b') {
            notation = node.moveNumber + '. ';
        } else if (node.depth > 0) {
            notation = node.moveNumber + '... ';
        }

        // Add the move in SAN notation
        notation += move.san;

        return notation;
    }

    loadPosition(fen) {
        const success = this.chess.load(fen);
        if (success) {
            this.board.position(fen);
            this.updatePositionInfo();
        }
    }

    clearTree() {
        this.moveTree = null;
        $('#moveTree').html('<div class="tree-placeholder">Click "Generate Tree" to explore move possibilities</div>');
        this.updateTreeStats();
    }

    updateTreeStats() {
        const depth = this.moveTree ? this.maxDepth : 0;
        $('#currentDepth').text(depth);
        $('#totalNodes').text(this.totalNodesGenerated);
    }

    collapseAll() {
        $('.children').addClass('collapsed');
        $('.expand-toggle').text('+');
    }

    expandAll() {
        $('.children').removeClass('collapsed');
        $('.expand-toggle').text('−');
    }
}

// Initialize app when DOM is ready
$(document).ready(() => {
    const app = new ChessCalculationTree();

    // Make it globally accessible for debugging
    window.chessApp = app;
});
