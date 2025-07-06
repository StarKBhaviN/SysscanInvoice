import CustomAlert from "@/components/ui/CustomAlert";
import React, {
  createContext,
  FC,
  ReactNode,
  useContext,
  useState,
} from "react";

type AlertContextType = {
  showAlert: (
    title: string,
    message: string,
    confirmText?: string,
    onConfirm?: () => void
  ) => void;
  hideAlert: () => void;
};

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export const useAlert = (): AlertContextType => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error("useAlert must be used within an AlertProvider");
  }
  return context;
};

type Alert = {
  visible: boolean;
  title: string;
  message: string;
  confirmText: string;
  onConfirm: () => void;
};

type AlertProviderProps = {
  children: ReactNode;
};

export const AlertProvider: FC<AlertProviderProps> = ({ children }) => {
  const [alert, setAlert] = useState<Alert>({
    visible: false,
    title: "",
    message: "",
    confirmText: "OK",
    onConfirm: () => {},
  });

  const showAlert = (
    title: string,
    message: string,
    confirmText: string = "OK",
    onConfirm: () => void = () => {}
  ) => {
    setAlert({
      visible: true,
      title,
      message,
      confirmText,
      onConfirm,
    });
  };

  const hideAlert = () => {
    setAlert((prev) => ({ ...prev, visible: false }));
  };

  return (
    <AlertContext.Provider value={{ showAlert, hideAlert }}>
      {children}
      {alert.visible && (
        <CustomAlert
          visible={alert.visible}
          title={alert.title}
          message={alert.message}
          confirmText={alert.confirmText}
          onConfirm={() => {
            alert.onConfirm();
            hideAlert();
          }}
        />
      )}
    </AlertContext.Provider>
  );
};
