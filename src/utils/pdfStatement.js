import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { fmt, monthKey } from "./finance";

const formatDate = (date) => {
  if (!date) return "-";
  return date;
};

const safeAmount = (value) => Number(value || 0);

export function downloadStatementPDF({
  expenses = [],
  incomes = [],
  budget = 0,
  selectedMonth,
}) {
  const doc = new jsPDF();

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

  const netBalance = totalIncome - totalExpense;
  const budgetLeft = Number(budget || 0) - totalExpense;

  doc.setFontSize(20);
  doc.text("Personal Finance Statement", 14, 18);

  doc.setFontSize(11);
  doc.text(`Month: ${month}`, 14, 28);
  doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 35);

  autoTable(doc, {
    startY: 45,
    head: [["Summary", "Amount"]],
    body: [
      ["Monthly Budget", fmt(Number(budget || 0))],
      ["Total Income", fmt(totalIncome)],
      ["Total Expense", fmt(totalExpense)],
      ["Net Balance", fmt(netBalance)],
      ["Budget Left", fmt(budgetLeft)],
    ],
    theme: "grid",
    headStyles: {
      fillColor: [30, 41, 59],
      textColor: [255, 255, 255],
    },
    styles: {
      fontSize: 10,
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
            income.note || "-",
            fmt(safeAmount(income.amount)),
          ])
        : [["-", "No income found", "-", fmt(0)]],
    theme: "grid",
    headStyles: {
      fillColor: [22, 163, 74],
      textColor: [255, 255, 255],
    },
    styles: {
      fontSize: 9,
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
            expense.note || "-",
            fmt(safeAmount(expense.amount)),
          ])
        : [["-", "No expense found", "-", fmt(0)]],
    theme: "grid",
    headStyles: {
      fillColor: [239, 68, 68],
      textColor: [255, 255, 255],
    },
    styles: {
      fontSize: 9,
    },
  });

  doc.save(`finance-statement-${month}.pdf`);
}