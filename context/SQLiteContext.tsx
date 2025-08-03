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
  controllers: ReturnType<typeof Controllers> | null;
}

const SQLiteContext = createContext<SQLiteContextType | undefined>(undefined);

interface SQLiteProviderProps {
  children: ReactNode;
}

export const SQLiteProvider: React.FC<SQLiteProviderProps> = ({ children }) => {
  const [db, setDb] = useState<SQLite.SQLiteDatabase | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [controllers, setControllers] = useState<any>(null);

  useEffect(() => {
    const initializeDatabase = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const databaseInstance = await openDatabase();
        setDb(databaseInstance);

        const instantiatedControllers = Controllers(databaseInstance);
        setControllers(instantiatedControllers);
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

  const contextValue: SQLiteContextType = {
    db,
    isLoading,
    error,
    controllers,
  };

  return (
    <SQLiteContext.Provider value={contextValue}>
      {children}
    </SQLiteContext.Provider>
  );
};

export const useSQLite = (): SQLiteContextType => {
  const context = useContext(SQLiteContext);
  if (context === undefined) {
    throw new Error("useSQLite must be used within a SQLiteProvider");
  }
  return context;
};

export const useSQLiteDB = (): SQLite.SQLiteDatabase | null => {
  const { db } = useSQLite();
  return db;
};

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
