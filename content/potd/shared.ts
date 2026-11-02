import type { Potd } from "@/lib/potd/types";

type Draft = Omit<Potd, "explain" | "source"> & {
  slip: string;
  secret: string;
  steps: string;
  solution: string;
  tip: string;
  source?: Potd["source"];
};

export const FE = { label: "UCF past Foundation Exams", url: "https://www.cs.ucf.edu/registration/exm/" };
export const COP = { label: "UCF COP 3502 course material", url: "https://www.cs.ucf.edu/courses/cop3502/sum2020/material/" };

export function problem({ slip, secret, steps, solution, tip, source = COP, ...rest }: Draft): Potd {
  return {
    ...rest,
    source,
    explain: `${slip}\n\n🧠 The big secret: ${secret}\n\n${steps}\n\n🏁 Answer: ${solution}\n\n💡 Guha-style tip: ${tip}`,
  };
}
