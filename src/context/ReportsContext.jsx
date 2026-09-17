/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import api from "../api/client";

const ReportsContext = createContext(null);

export function ReportsProvider({ children }) {
  const [reports, setReports] = useState([]);
  const [isLoadingReports, setIsLoadingReports] = useState(true);

  const fetchReports = useCallback(async () => {
    try {
      const { data } = await api.get("/reports");
      if (data?.success && Array.isArray(data?.data?.reports)) {
        setReports(data.data.reports);
      }
    } catch (err) {
      console.warn("Could not fetch reports from backend:", err.message);
    } finally {
      setIsLoadingReports(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    api
      .get("/reports")
      .then(({ data }) => {
        if (isMounted && data?.success && Array.isArray(data?.data?.reports)) {
          setReports(data.data.reports);
        }
      })
      .catch((err) => {
        console.warn("Could not fetch reports from backend:", err.message);
      })
      .finally(() => {
        if (isMounted) setIsLoadingReports(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const createReport = async (reportData) => {
    const { data } = await api.post("/reports", reportData);
    if (data?.success && data?.data?.report) {
      const newReport = data.data.report;
      setReports((prev) => [
        newReport,
        ...prev.filter((r) => r.id !== newReport.id),
      ]);
      return newReport;
    }
    throw new Error(data?.message || "Failed to submit report.");
  };

  const voteReport = async (id) => {
    try {
      const { data } = await api.post(`/reports/${id}/vote`);
      if (data?.success && data?.data?.report) {
        const updated = data.data.report;
        setReports((prev) => prev.map((r) => (r.id === id ? updated : r)));
        return updated;
      }
    } catch (err) {
      console.error("Failed to vote:", err);
      throw err;
    }
  };

  const addCommentToReport = async (id, text) => {
    try {
      const { data } = await api.post(`/reports/${id}/comments`, { text });
      if (data?.success && data?.data?.report) {
        const updated = data.data.report;
        setReports((prev) => prev.map((r) => (r.id === id ? updated : r)));
        return updated;
      }
    } catch (err) {
      console.error("Failed to add comment:", err);
      throw err;
    }
  };

  return (
    <ReportsContext.Provider
      value={{
        reports,
        setReports,
        createReport,
        voteReport,
        addCommentToReport,
        fetchReports,
        isLoadingReports,
      }}
    >
      {children}
    </ReportsContext.Provider>
  );
}

export function useReports() {
  const context = useContext(ReportsContext);
  if (!context)
    throw new Error("useReports must be used within ReportsProvider");
  return context;
}
