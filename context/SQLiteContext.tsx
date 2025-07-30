import { openDatabase } from "@/db";
import { Controllers } from "@/db/controllers";
import * as SQLite from "expo-sqlite";
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

interface SQLiteContextType {
  db: SQLite.SQLiteDatabase | null;
  isLoading: boolean;
  error: string | null;
  controllers: {
    Home: typeof Controllers.Home;
    Company: typeof Controllers.Company;
  };
}

const SQLiteContext = createContext<SQLiteContextType | undefined>(undefined);

interface SQLiteProviderProps {
  children: ReactNode;
}

export const SQLiteProvider: React.FC<SQLiteProviderProps> = ({ children }) => {
  const [db, setDb] = useState<SQLite.SQLiteDatabase | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeDatabase = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const databaseInstance = await openDatabase();
        setDb(databaseInstance);

        console.log("Database initialized successfully");
      } catch (err) {
        console.error("Database initialization failed:", err);
        setError(
          err instanceof Error ? err.message : "Database initialization failed"
        );
      } finally {
        setIsLoading(false);
      }
    };

    initializeDatabase();

    return () => {
      if (db) {
        db.closeSync();
        console.log("Database connection closed");
      }
    };
  }, []);

  const createControllerGroupProxy = (controllerGroup: any) => {
    const proxy = {} as any;

    Object.keys(controllerGroup).forEach((functionName) => {
      const originalFunction = controllerGroup[functionName];

      if (typeof originalFunction === "function") {
        proxy[functionName] = (async (...args: any[]) => {
          if (!db) {
            throw new Error("Database not initialized");
          }
          return await originalFunction(db, ...args);
        }) as any;
      }
    });

    return proxy;
  };

  const contextValue: SQLiteContextType = {
    db,
    isLoading,
    error,
    controllers: {
      Home: createControllerGroupProxy(Controllers.Home),
      Company: createControllerGroupProxy(Controllers.Company),
    },
  };

  return (
    <SQLiteContext.Provider value={contextValue}>
      {children}
    </SQLiteContext.Provider>
  );
};

// Custom hook to use the SQLite context
export const useSQLite = (): SQLiteContextType => {
  const context = useContext(SQLiteContext);
  if (context === undefined) {
    throw new Error("useSQLite must be used within a SQLiteProvider");
  }
  return context;
};

// Optional: Hook for direct database access (if you need the raw db instance)
export const useSQLiteDB = (): SQLite.SQLiteDatabase | null => {
  const { db } = useSQLite();
  return db;
};

// Optional: Hook that throws if database is not ready
export const useSQLiteReady = (): SQLite.SQLiteDatabase => {
  const { db, isLoading, error } = useSQLite();

  if (isLoading) {
    throw new Error("Database is still loading");
  }

  if (error) {
    throw new Error(`Database error: ${error}`);
  }

  if (!db) {
    throw new Error("Database is not available");
  }

  return db;
};
