import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { monthKey } from "./finance";

const formatDate = (date) => {
  if (!date) return "-";
  return date;
};

const safeAmount = (value) => Number(value || 0);

const fmtTK = (value) => {
  const amount = safeAmount(value);

  return `TK ${amount.toLocaleString("en-US", {
    maximumFractionDigits: 0,
  })}`;
};

const getNote = (note) => {
  const cleanNote = String(note || "").trim();
  return cleanNote || "-";
};

export function downloadStatementPDF({
  expenses = [],
  incomes = [],
  budget = 0,
  selectedMonth,
}) {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const month = selectedMonth || monthKey(new Date().toISOString());

  const monthExpenses = expenses.filter(
    (expense) => monthKey(expense.date) === month
  );

  const monthIncomes = incomes.filter(
    (income) => monthKey(income.date) === month
  );

  const totalIncome = monthIncomes.reduce(
    (sum, income) => sum + safeAmount(income.amount),
    0
  );

  const totalExpense = monthExpenses.reduce(
    (sum, expense) => sum + safeAmount(expense.amount),
    0
  );

  const safeBudget = safeAmount(budget);
  const netBalance = totalIncome - totalExpense;
  const budgetLeft = safeBudget - totalExpense;

  doc.setFontSize(20);
  doc.text("Personal Finance Statement", 14, 18);

  doc.setFontSize(11);
  doc.text(`Month: ${month}`, 14, 28);
  doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 35);

  autoTable(doc, {
    startY: 45,
    head: [["Summary", "Amount"]],
    body: [
      ["Monthly Budget", fmtTK(safeBudget)],
      ["Total Income", fmtTK(totalIncome)],
      ["Total Expense", fmtTK(totalExpense)],
      ["Net Balance", fmtTK(netBalance)],
      ["Budget Left", fmtTK(budgetLeft)],
    ],
    theme: "grid",
    margin: { left: 14, right: 14 },
    headStyles: {
      fillColor: [30, 41, 59],
      textColor: [255, 255, 255],
    },
    styles: {
      fontSize: 10,
      cellPadding: 2,
      overflow: "linebreak",
      valign: "top",
    },
    columnStyles: {
      1: {
        halign: "right",
        cellWidth: 45,
      },
    },
  });

  let nextY = doc.lastAutoTable.finalY + 12;

  doc.setFontSize(14);
  doc.text("Income Details", 14, nextY);

  autoTable(doc, {
    startY: nextY + 6,
    head: [["Date", "Source", "Note", "Amount"]],
    body:
      monthIncomes.length > 0
        ? monthIncomes.map((income) => [
            formatDate(income.date),
            income.source || "-",
            getNote(income.note),
            fmtTK(income.amount),
          ])
        : [["-", "No income found", "-", fmtTK(0)]],
    theme: "grid",
    margin: { left: 14, right: 14 },
    headStyles: {
      fillColor: [22, 163, 74],
      textColor: [255, 255, 255],
    },
    styles: {
      fontSize: 8,
      cellPadding: 2,
      overflow: "linebreak",
      valign: "top",
    },
    columnStyles: {
      2: {
        cellWidth: 80,
      },
      3: {
        halign: "right",
        overflow: "linebreak",
      },
    },
  });

  nextY = doc.lastAutoTable.finalY + 12;

  doc.setFontSize(14);
  doc.text("Expense Details", 14, nextY);

  autoTable(doc, {
    startY: nextY + 6,
    head: [["Date", "Category", "Note", "Amount"]],
    body:
      monthExpenses.length > 0
        ? monthExpenses.map((expense) => [
            formatDate(expense.date),
            expense.category || "-",
            getNote(expense.note),
            fmtTK(expense.amount),
          ])
        : [["-", "No expense found", "-", fmtTK(0)]],
    theme: "grid",
    margin: { left: 14, right: 14 },
    headStyles: {
      fillColor: [239, 68, 68],
      textColor: [255, 255, 255],
    },
    styles: {
      fontSize: 8,
      cellPadding: 2,
      overflow: "linebreak",
      valign: "top",
    },
    columnStyles: {
      2: {
        cellWidth: 80,
      },
      3: {
        halign: "right",
        overflow: "linebreak",
      },
    },
  });

  doc.save(`finance-statement-${month}.pdf`);
}