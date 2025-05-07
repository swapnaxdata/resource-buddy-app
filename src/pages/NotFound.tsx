
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import MainLayout from "@/components/layout/MainLayout";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <MainLayout>
      <div className="min-h-[70vh] flex flex-col items-center justify-center">
        <h1 className="text-7xl font-bold text-primary-purple mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-6">Oops! This page doesn't exist</p>
        <div className="flex gap-4">
          <Button
            variant="default"
            className="bg-primary-purple hover:bg-primary-purple/90"
            onClick={() => navigate("/")}
          >
            Back to Home
          </Button>
          <Button variant="outline" onClick={() => navigate(-1)}>
            Go Back
          </Button>
        </div>
      </div>
    </MainLayout>
  );
};

export default NotFound;
