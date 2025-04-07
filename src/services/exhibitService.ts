
// Mock database for demo purposes
// In production, this would use Firebase, Supabase, or another backend
interface Purchase {
  id: string;
  userId: number;
  username: string;
  size: number; // in meters
  date: Date;
  referredBy?: string;
}

let purchases: Purchase[] = [
  {
    id: 'mock1',
    userId: 12345,
    username: 'batman_fan',
    size: 42,
    date: new Date('2023-05-15')
  },
  {
    id: 'mock2',
    userId: 67890,
    username: 'super_collector',
    size: 65,
    date: new Date('2023-06-10')
  },
  {
    id: 'mock3',
    userId: 13579,
    username: 'origami_master',
    size: 78,
    date: new Date('2023-06-20')
  }
];

// Get top purchases by size
export const getTopPurchases = (limit: number = 10): Purchase[] => {
  return [...purchases]
    .sort((a, b) => b.size - a.size)
    .slice(0, limit);
};

// Record a new purchase
export const recordPurchase = (purchase: Omit<Purchase, 'id' | 'date'>): Purchase => {
  const newPurchase = {
    ...purchase,
    id: Date.now().toString(36) + Math.random().toString(36).substring(2),
    date: new Date()
  };
  
  purchases = [...purchases, newPurchase];
  return newPurchase;
};

// Validate exhibit access
export const validateExhibitAccess = (exhibitId: string, userId: number): boolean => {
  const purchase = purchases.find(p => p.id === exhibitId && p.userId === userId);
  return !!purchase;
};

// Get exhibit details by ID
export const getExhibitById = (exhibitId: string): Purchase | undefined => {
  return purchases.find(p => p.id === exhibitId);
};
