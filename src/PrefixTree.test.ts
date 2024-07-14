import { PrefixTree } from './PrefixTree';

test("testing prefix tree", () => {
    const prefixTree = new PrefixTree();
    prefixTree.insert("a", "a");
    prefixTree.insert("ab", "ab");
    prefixTree.insert("ab", "ab");
    prefixTree.insert("ac", "ac");
    prefixTree.insert("b", "b");

    expect(prefixTree.isPrefix("a")).toBeTruthy();
    expect(prefixTree.isTerminal("a")).toBeFalsy();
    expect(prefixTree.isTerminal("ab")).toBeTruthy();
});

test("terminal test", () => {
    const prefixTree = new PrefixTree();
    prefixTree.insert("b", "b");

    expect(prefixTree.isTerminal("b")).toBeTruthy();
    expect(prefixTree.isTerminal("ba")).toBeFalsy();
    expect(prefixTree.isTerminal("bb")).toBeFalsy();
});
