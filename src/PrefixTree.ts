class PrefixTreeNode<T> {
    char: string;
    value: T | null;
    children: Map<string, PrefixTreeNode<T>>;

    constructor(char: string, value: T | null) {
        this.char = char;
        this.value = value;
        this.children = new Map<string, PrefixTreeNode<T>>();
    }

    // adds a child, will overwrite if a child for a key already exists
    addChild(char: string, value: T | null) {
        let child = new PrefixTreeNode<T>(char, value);
        this.children.set(char, child);
        return child;
    }

    // gets child based on character of next tree node
    getChild(char: string) {
        return this.children.get(char);
    }

    // a tree node is terminal if has no children
    isTerminal() {
        return this.children.size === 0;
    }
}

export class PrefixTree<T> {
    head: PrefixTreeNode<T>;

    constructor() {
        this.head = new PrefixTreeNode<T>("", null);
    }

    // TODO: add an error when you add a key that overwrite another key??
    insert(key: string, value: T) {
        let node = this.head;
        [...key].forEach((char, i) => {
            if (i !== key.length - 1) {
                let nextNode = node.getChild(char);
                if (!nextNode) {
                    nextNode = node.addChild(char, null);
                }
                node = nextNode;
            }
            else {
                node.addChild(char, value);
            }
        });
    }

    getNode(key: string) {
        let node = this.head;
        for (let i = 0; i < key.length; i++) {
            let char = key.charAt(i);
            let nextNode = node.getChild(char);
            if (!nextNode) {
                return null;
            }
            node = nextNode;
        }
        return node;
    }

    get(key: string) {
        return this.getNode(key).value;
    }

    isTerminal(key: string) {
        let node = this.getNode(key);
        if (!node) {
            return false;
        }
        return node.isTerminal();
    }

    isPrefix(key: string) {
        let node = this.getNode(key);
        if (!node) {
            return false;
        }
        return !node.isTerminal();
    }
}
