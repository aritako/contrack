import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { diffWords } from "diff"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function computeSHA256(file: File) {
  const buffer = await file.arrayBuffer()
  const hashBuffer = await crypto.subtle.digest('SHA-256', buffer)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const hashHex = hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('')
  return hashHex
}

export function differences(in1: string, in2: string) {
  const diff = diffWords(in1, in2);
  const parts = diff.map(
    (part: { added?: boolean; removed?: boolean; value: string }, index: number) => {
      return (
        part.added ? <span key={index} className="text-green-500">{part.value}</span> :
        part.removed ? <span key={index} className="text-red-400">{part.value}</span> :
        <span key={index}>{part.value}</span>
      );
    }
  );
  return <div> {parts} </div>;
}
