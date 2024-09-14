import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Order {
  confirmation: string;
  deliveryDate: string;
  status: string;
}

interface OrderContextType {
  orders: Order[];
  addOrder: (order: Order) => void;
  cancelOrder: (confirmation: string) => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

interface OrderProviderProps {
  children: ReactNode;
}

export const OrderProvider: React.FC<OrderProviderProps> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>([]);

  const addOrder = (order: Order) => {
    setOrders([...orders, order]);
  };

  const cancelOrder = (confirmation: string) => {
    setOrders(orders.filter(order => order.confirmation !== confirmation));
  };

  return (
    <OrderContext.Provider value={{ orders, addOrder, cancelOrder }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrder = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrder must be used within an OrderProvider');
  }
  return context;
};