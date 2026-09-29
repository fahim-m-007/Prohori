/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import api from "../api/client";
import { useAuth } from "./AuthContext";

const SavedAreasContext = createContext(null);

export function SavedAreasProvider({ children }) {
  const { user } = useAuth();
  const [savedAreas, setSavedAreas] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchSavedAreas = useCallback(async () => {
    if (!user) {
      setSavedAreas([]);
      return;
    }
    try {
      const { data } = await api.get("/saved-areas");
      if (data?.success && Array.isArray(data?.data?.savedAreas)) {
        setSavedAreas(data.data.savedAreas);
      }
    } catch (err) {
      console.warn("Could not fetch saved areas from backend:", err.message);
    }
  }, [user]);

  useEffect(() => {
    let isMounted = true;

    if (!user) {
      Promise.resolve().then(() => {
        if (isMounted) setSavedAreas([]);
      });
      return () => {
        isMounted = false;
      };
    }

    api
      .get("/saved-areas")
      .then(({ data }) => {
        if (
          isMounted &&
          data?.success &&
          Array.isArray(data?.data?.savedAreas)
        ) {
          setSavedAreas(data.data.savedAreas);
        }
      })
      .catch((err) => {
        console.warn("Could not fetch saved areas from backend:", err.message);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [user]);

  const createSavedArea = async (areaData) => {
    const { data } = await api.post("/saved-areas", areaData);
    if (data?.success && data?.data?.savedArea) {
      const newArea = data.data.savedArea;
      setSavedAreas((prev) => [
        newArea,
        ...prev.filter((a) => a.id !== newArea.id),
      ]);
      return newArea;
    }
    throw new Error(data?.message || "Failed to save location.");
  };

  const updateSavedArea = async (id, areaData) => {
    const { data } = await api.patch(`/saved-areas/${id}`, areaData);
    if (data?.success && data?.data?.savedArea) {
      const updatedArea = data.data.savedArea;
      setSavedAreas((prev) => prev.map((a) => (a.id === id ? updatedArea : a)));
      return updatedArea;
    }
    throw new Error(data?.message || "Failed to update saved location.");
  };

  const deleteSavedArea = async (id) => {
    const { data } = await api.delete(`/saved-areas/${id}`);
    if (data?.success) {
      setSavedAreas((prev) => prev.filter((a) => a.id !== id));
      return true;
    }
    throw new Error(data?.message || "Failed to remove saved location.");
  };

  return (
    <SavedAreasContext.Provider
      value={{
        savedAreas,
        setSavedAreas,
        isLoading,
        fetchSavedAreas,
        createSavedArea,
        updateSavedArea,
        deleteSavedArea,
      }}
    >
      {children}
    </SavedAreasContext.Provider>
  );
}

export function useSavedAreas() {
  const context = useContext(SavedAreasContext);
  if (!context)
    throw new Error("useSavedAreas must be used within SavedAreasProvider");
  return context;
}
