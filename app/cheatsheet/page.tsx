import type { Metadata } from "next";
import PrintButton from "@/components/PrintButton";
import { Tofu } from "@/components/characters";

export const metadata: Metadata = { title: "🧾 Cheat Sheet", description: "Every formula and rule for the Foundation Exam on recipe cards." };

function Recipe({ icon, title, children }: { icon: string; title: string; children: React.ReactNode }) {
  return (
    <div className="recipe">
      <h3>
        <span aria-hidden>{icon}</span> {title}
      </h3>
      {children}
    </div>
  );
}

export default function CheatSheet() {
  return (
    <div className="wrap" style={{ padding: "40px 0 80px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap", marginBottom: 28 }}>
        <Tofu size={90} className="bob" />
        <div style={{ flex: 1, minWidth: 240 }}>
          <span className="eyebrow">Tofu&apos;s recipe box</span>
          <h1 style={{ margin: 0 }}>🧾 The Cheat Sheet</h1>
          <p className="muted" style={{ margin: 0 }}>Every formula and rule on one page. Great for a 10-minute review before bed or exam morning.</p>
        </div>
        <PrintButton />
      </div>

      <div className="recipes">
        <Recipe icon="🏁" title="Big-O ladder">
          <p className="mono" style={{ fontWeight: 800 }}>1 &lt; log n &lt; n &lt; n log n &lt; n² &lt; n³ &lt; 2ⁿ &lt; n!</p>
          <ul>
            <li>Sequential → add, keep the biggest</li>
            <li>Nested → multiply</li>
            <li><code>i *= 2</code> / <code>i /= 2</code> → log n</li>
            <li>Inner var never resets → add, not multiply</li>
          </ul>
        </Recipe>

        <Recipe icon="🧱" title="Summations">
          <table className="cozy mono">
            <tbody>
              <tr><td>Σ₁ⁿ c</td><td>cn</td></tr>
              <tr><td>Σ₁ⁿ i</td><td>n(n+1)/2</td></tr>
              <tr><td>Σ₁ⁿ i²</td><td>n(n+1)(2n+1)/6</td></tr>
              <tr><td>Σ₀ⁿ 2ⁱ</td><td>2ⁿ⁺¹ − 1</td></tr>
              <tr><td>Σ₀ⁿ rⁱ</td><td>(rⁿ⁺¹ − 1)/(r − 1)</td></tr>
              <tr><td>Σₐᵇ</td><td>Σ₁ᵇ − Σ₁ᵃ⁻¹</td></tr>
              <tr><td># terms a..b</td><td>b − a + 1</td></tr>
            </tbody>
          </table>
        </Recipe>

        <Recipe icon="🪆" title="Recurrences">
          <table className="cozy mono">
            <tbody>
              <tr><td>T(n/2) + 1</td><td>O(log n)</td></tr>
              <tr><td>T(n/2) + n</td><td>O(n)</td></tr>
              <tr><td>2T(n/2) + 1</td><td>O(n)</td></tr>
              <tr><td>2T(n/2) + n</td><td>O(n log n)</td></tr>
              <tr><td>T(n−1) + 1</td><td>O(n)</td></tr>
              <tr><td>T(n−1) + n</td><td>O(n²)</td></tr>
              <tr><td>2T(n−1) + 1</td><td>O(2ⁿ)</td></tr>
            </tbody>
          </table>
          <p style={{ marginTop: 8 }}>Iteration: unroll 3×, find the k-th step, set n/2ᵏ = 1 → k = log₂n.</p>
        </Recipe>

        <Recipe icon="⏱" title="Timing problems">
          <p className="mono">T(n) = c · f(n)</p>
          <p className="mono">T₂ = T₁ · f(n₂) / f(n₁)</p>
          <p>Use powers of 2 for logs: log₂(2ᵏ) = k.</p>
        </Recipe>

        <Recipe icon="📦" title="Dynamic memory">
          <ul>
            <li><code>malloc(n * sizeof(T))</code>: garbage values</li>
            <li><code>calloc(n, sizeof(T))</code>: zeros</li>
            <li><code>p = realloc(p, newBytes)</code>: may move</li>
            <li>Strings: <code>malloc(strlen(s) + 1)</code></li>
            <li>Free <b>inside-out</b>: rows/fields first, then the container</li>
          </ul>
        </Recipe>

        <Recipe icon="🚂" title="Linked lists">
          <ul>
            <li>Insert after temp: <code>n-&gt;next = temp-&gt;next; temp-&gt;next = n;</code></li>
            <li>Always handle: empty list, new head, last node</li>
            <li>Return the head if it can change</li>
            <li>Save <code>next</code> before <code>free</code></li>
          </ul>
        </Recipe>

        <Recipe icon="🥞" title="Stacks & postfix">
          <ul>
            <li>LIFO. Array top starts at −1</li>
            <li>Infix → postfix: operands out; <code>(</code> push; <code>)</code> pop to <code>(</code>; operator: pop ≥ precedence, then push; end: pop all</li>
            <li>Eval: operator → pop <b>right</b>, pop <b>left</b>, push left op right</li>
          </ul>
        </Recipe>

        <Recipe icon="🧋" title="Queues">
          <ul>
            <li>FIFO. Enqueue at the back, dequeue at the front</li>
            <li>Next open slot: <code>(front + size) % cap</code></li>
            <li>After dequeue: <code>front = (front + 1) % cap</code></li>
          </ul>
        </Recipe>

        <Recipe icon="🌳" title="Binary trees">
          <ul>
            <li>Pre: Root L R · In: L Root R (sorted!) · Post: L R Root</li>
            <li>height(NULL) = −1, leaf = 0</li>
            <li>Delete with 2 kids: max of left (or min of right)</li>
            <li>Max nodes, height h: 2ʰ⁺¹ − 1</li>
          </ul>
        </Recipe>

        <Recipe icon="⚖️" title="AVL">
          <ul>
            <li>|h(L) − h(R)| ≤ 1 everywhere</li>
            <li>LL → right rotate · RR → left rotate</li>
            <li>LR / RL → double rotation</li>
            <li>Shortcut: sort the 3 nodes A &lt; B &lt; C, B becomes the parent</li>
          </ul>
        </Recipe>

        <Recipe icon="🍡" title="Heaps (1-indexed)">
          <ul>
            <li>Kids of i: 2i, 2i+1 · parent: i/2</li>
            <li>Insert: add at the end, percolate up</li>
            <li>Delete-min: last → root, percolate down (swap with the smaller kid)</li>
            <li>Heapify O(n) · heapsort O(n log n)</li>
          </ul>
        </Recipe>

        <Recipe icon="🧥" title="Hashing">
          <ul>
            <li>Linear: (h + i) % m</li>
            <li>Quadratic: (h + i²) % m, needs prime m &amp; α ≤ ½</li>
            <li>Chaining: linked list per slot</li>
            <li>α = n / m. Average O(1), worst O(n)</li>
          </ul>
        </Recipe>

        <Recipe icon="🌸" title="Tries">
          <ul>
            <li>Node: <code>isWord</code> + <code>next[26]</code></li>
            <li>Index: <code>c - &apos;a&apos;</code></li>
            <li>Insert/search: O(length of the word)</li>
          </ul>
        </Recipe>

        <Recipe icon="🧁" title="Sorting">
          <div className="table-scroll">
            <table className="cozy">
              <thead><tr><th>Sort</th><th>Best</th><th>Worst</th></tr></thead>
              <tbody>
                <tr><td>Bubble</td><td>n²/n*</td><td>n²</td></tr>
                <tr><td>Selection</td><td>n²</td><td>n²</td></tr>
                <tr><td>Insertion</td><td>n</td><td>n²</td></tr>
                <tr><td>Merge</td><td>n log n</td><td>n log n</td></tr>
                <tr><td>Quick</td><td>n log n</td><td>n²</td></tr>
                <tr><td>Heap</td><td>n log n</td><td>n log n</td></tr>
              </tbody>
            </table>
          </div>
          <p className="muted" style={{ fontSize: "0.85rem", margin: "6px 0 0" }}>* with an early-exit check</p>
        </Recipe>

        <Recipe icon="🍰" title="Recursion">
          <ul>
            <li>Base case first. Recursive case shrinks toward it</li>
            <li>Print before the call → countdown; after → count up</li>
            <li>Hanoi: 2ⁿ − 1 moves</li>
            <li>Fast exp: b^e = (b^(e/2))². Compute the half ONCE</li>
          </ul>
        </Recipe>

        <Recipe icon="💡" title="Bits">
          <table className="cozy mono">
            <tbody>
              <tr><td>check i</td><td>(x &gt;&gt; i) &amp; 1</td></tr>
              <tr><td>set i</td><td>x | (1 &lt;&lt; i)</td></tr>
              <tr><td>clear i</td><td>x &amp; ~(1 &lt;&lt; i)</td></tr>
              <tr><td>flip i</td><td>x ^ (1 &lt;&lt; i)</td></tr>
              <tr><td>x &lt;&lt; k</td><td>x · 2ᵏ</td></tr>
              <tr><td>subsets</td><td>mask = 0 … (1&lt;&lt;n) − 1</td></tr>
            </tbody>
          </table>
        </Recipe>

        <Recipe icon="🧭" title="Backtracking">
          <ul>
            <li>Choose → explore → un-choose</li>
            <li>Permutations: n! (use <code>used[]</code>)</li>
            <li>Subsets: 2ⁿ (in / out)</li>
            <li>Prune invalid partial answers early</li>
          </ul>
        </Recipe>

        <Recipe icon="🔢" title="Bases">
          <ul>
            <li>→ decimal: Σ digit · bᵖᵒˢ</li>
            <li>← decimal: divide by b, read remainders bottom-up</li>
            <li>1 hex digit = 4 bits</li>
          </ul>
        </Recipe>
      </div>
    </div>
  );
}
