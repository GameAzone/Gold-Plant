import React, { createContext, useContext, useState, ReactNode } from "react";

export interface Transaction {
  id: string;
  type: "buy" | "sell";
  metal: "gold" | "silver";
  amount: number;
  pricePerUnit: number;
  total: number;
  date: Date;
  pointsEarned?: number;
}

export interface Holdings {
  gold: number;
  silver: number;
}

export interface AccumulationPoints {
  gold: number;
  silver: number;
}

export interface PhysicalProduct {
  id: string;
  name: string;
  category: "latest" | "collection";
  price: number;
  image: string;
  weight: string;
  purity: string;
  description: string;
}

export interface PhysicalOrder {
  id: string;
  product: PhysicalProduct;
  quantity: number;
  total: number;
  paymentType: "full" | "bnpl" | "gsap";
  bnplMonths?: number;
  monthlyPayment?: number;
  gsapUsed?: number;
  status: "pending" | "paid" | "shipped" | "delivered";
  date: Date;
}

export interface RedemptionProduct {
  id: string;
  name: string;
  weightGrams: number;
  metal: "gold" | "silver";
  pointsRequired: number;
  image: string;
  description: string;
}

interface AppContextType {
  balance: number;
  holdings: Holdings;
  accumulationPoints: AccumulationPoints;
  transactions: Transaction[];
  physicalOrders: PhysicalOrder[];
  goldPrice: number;
  silverPrice: number;
  addTransaction: (transaction: Omit<Transaction, "id" | "date">) => void;
  updateBalance: (amount: number) => void;
  addPhysicalOrder: (order: Omit<PhysicalOrder, "id" | "date">) => void;
  redeemGSAP: (metal: "gold" | "silver", points: number) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [balance, setBalance] = useState(50000);
  const [holdings, setHoldings] = useState<Holdings>({ gold: 10, silver: 50 });
  const [accumulationPoints, setAccumulationPoints] = useState<AccumulationPoints>({ 
    gold: 250, 
    silver: 180 
  });
  const [goldPrice] = useState(737);
  const [silverPrice] = useState(24.35);
  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: "1",
      type: "buy",
      metal: "gold",
      amount: 5,
      pricePerUnit: 2040.00,
      total: 10200.00,
      date: new Date("2026-02-20"),
    },
    {
      id: "2",
      type: "buy",
      metal: "silver",
      amount: 30,
      pricePerUnit: 24.10,
      total: 723.00,
      date: new Date("2026-02-21"),
    },
    {
      id: "3",
      type: "buy",
      metal: "gold",
      amount: 5,
      pricePerUnit: 2038.50,
      total: 10192.50,
      date: new Date("2026-02-22"),
    },
    {
      id: "4",
      type: "buy",
      metal: "silver",
      amount: 20,
      pricePerUnit: 24.25,
      total: 485.00,
      date: new Date("2026-02-22"),
    },
  ]);
  const [physicalOrders, setPhysicalOrders] = useState<PhysicalOrder[]>([]);

  const addTransaction = (transaction: Omit<Transaction, "id" | "date">) => {
    // Calculate GSAP: 1 point = 1 gram of metal purchased (amount is already in grams)
    const pointsEarned = transaction.type === "buy" ? Math.floor(transaction.amount) : 0;
    
    const newTransaction: Transaction = {
      ...transaction,
      id: Date.now().toString(),
      date: new Date(),
      pointsEarned,
    };

    setTransactions((prev) => [newTransaction, ...prev]);

    // Update holdings
    setHoldings((prev) => ({
      ...prev,
      [transaction.metal]:
        transaction.type === "buy"
          ? prev[transaction.metal] + transaction.amount
          : prev[transaction.metal] - transaction.amount,
    }));

    // Update balance
    const balanceChange =
      transaction.type === "buy"
        ? -transaction.total
        : transaction.total;
    setBalance((prev) => prev + balanceChange);

    // Update accumulation points for buy transactions (GSAP)
    if (transaction.type === "buy" && pointsEarned > 0) {
      setAccumulationPoints((prev) => ({
        ...prev,
        [transaction.metal]: prev[transaction.metal] + pointsEarned,
      }));
    }
  };

  const updateBalance = (amount: number) => {
    setBalance((prev) => prev + amount);
  };

  const addPhysicalOrder = (order: Omit<PhysicalOrder, "id" | "date">) => {
    const newOrder: PhysicalOrder = {
      ...order,
      id: Date.now().toString(),
      date: new Date(),
    };

    setPhysicalOrders((prev) => [newOrder, ...prev]);

    // Deduct balance if full payment
    if (order.paymentType === "full") {
      setBalance((prev) => prev - order.total);
    }
    
    // Deduct GSAP if gsap payment
    if (order.paymentType === "gsap" && order.gsapUsed) {
      // Get metal type from product name
      const metal = order.product.name.toLowerCase().includes("gold") ? "gold" : "silver";
      setAccumulationPoints((prev) => ({
        ...prev,
        [metal]: prev[metal as "gold" | "silver"] - order.gsapUsed!,
      }));
    }
  };

  const redeemGSAP = (metal: "gold" | "silver", points: number) => {
    // Deduct points
    setAccumulationPoints((prev) => ({
      ...prev,
      [metal]: prev[metal] - points,
    }));
  };

  return (
    <AppContext.Provider
      value={{
        balance,
        holdings,
        accumulationPoints,
        transactions,
        physicalOrders,
        goldPrice,
        silverPrice,
        addTransaction,
        updateBalance,
        addPhysicalOrder,
        redeemGSAP,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}