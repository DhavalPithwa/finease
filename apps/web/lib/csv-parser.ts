// CSV Parser logic for financial statements

export interface ParsedTransaction {
  date: string;
  description: string;
  amount: number;
  category: string;
  type: "income" | "expense";
}

/**
 * A robust CSV parser for Indian bank statements (HDFC, ICICI, etc. common patterns)
 */
export function parseFinancialCSV(csvText: string): ParsedTransaction[] {
  const lines = csvText.split(/\r?\n/).filter(line => line.trim().length > 0);
  if (lines.length < 2) return [];

  // Basic heuristic to find the header row
  // Most bank statements have "Date", "Description/Narration", "Amount"
  const headerIndex = lines.findIndex(line => 
    line.toLowerCase().includes("date") && 
    (line.toLowerCase().includes("amount") || line.toLowerCase().includes("debit"))
  );

  const startIdx = headerIndex === -1 ? 0 : headerIndex + 1;
  const dataLines = lines.slice(startIdx);

  return dataLines.map((line) => {
    // Split by comma but respect quotes
    const columns = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
    
    // Fallback mapping - this would be refined based on specific bank formats
    // Typical pattern: Date, Description, Reference, Debit, Credit, Balance
    const date = columns[0]?.replace(/"/g, "") || new Date().toISOString();
    const description = columns[1]?.replace(/"/g, "") || "Unknown Transaction";
    
    const debitStr = columns[3] || "0";
    const creditStr = columns[4] || "0";
    
    const debit = parseFloat(debitStr.replace(/[",]/g, "")) || 0;
    const credit = parseFloat(creditStr.replace(/[",]/g, "")) || 0;
    
    const amount = credit > 0 ? credit : debit;
    const type = credit > 0 ? "income" : "expense";

    return {
      date: new Date(date).toISOString(),
      description,
      amount: Math.abs(amount),
      category: "Uncategorized", // AI categorization would happen later
      type: type as "income" | "expense",
    };
  }).filter(tx => !isNaN(tx.amount) && tx.amount !== 0);
}
