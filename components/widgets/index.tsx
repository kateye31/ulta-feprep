import type { WidgetId } from "@/lib/types";
import PointerPlayground from "./PointerPlayground";
import LinkedListTrain from "./LinkedListTrain";
import PancakeStack from "./PancakeStack";
import PostfixLab from "./PostfixLab";
import CafeLine from "./CafeLine";
import TreeGarden from "./TreeGarden";
import HeapPlayground from "./HeapPlayground";
import HashTable from "./HashTable";
import TrieBuilder from "./TrieBuilder";
import GrowthRace from "./GrowthRace";
import TimingCalc from "./TimingCalc";
import GaussStairs from "./GaussStairs";
import RecurrenceTree from "./RecurrenceTree";
import Hanoi from "./Hanoi";
import SortStepper from "./SortStepper";
import BitPlayground from "./BitPlayground";
import NQueens from "./NQueens";
import BaseConverter from "./BaseConverter";

export function Widget({ id }: { id: WidgetId }) {
  switch (id) {
    case "pointers": return <PointerPlayground />;
    case "linkedlist": return <LinkedListTrain />;
    case "stack": return <PancakeStack />;
    case "postfix": return <PostfixLab />;
    case "queue": return <CafeLine />;
    case "bst": return <TreeGarden mode="bst" />;
    case "avl": return <TreeGarden mode="avl" />;
    case "heap": return <HeapPlayground />;
    case "hash": return <HashTable />;
    case "trie": return <TrieBuilder />;
    case "bigo": return <GrowthRace />;
    case "timing": return <TimingCalc />;
    case "summation": return <GaussStairs />;
    case "recurrence": return <RecurrenceTree />;
    case "hanoi": return <Hanoi />;
    case "sorting": return <SortStepper />;
    case "bitwise": return <BitPlayground />;
    case "nqueens": return <NQueens />;
    case "base": return <BaseConverter />;
  }
}
