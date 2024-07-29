"use client";
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

const ErrorHandler = ({ children }) => {
  const [hasError, setHasError] = useState(false);

  // Simulate catching an error in a functional component
  const handleError = (error) => {
    console.error("Error caught in ErrorHandler:", error);
    setHasError(true);
  };

  // Example function to simulate error
  const simulateError = () => {
    throw new Error("Simulated error");
  };

  useEffect(() => {
    try {
      simulateError(); // Example usage of error simulation
    } catch (error) {
      handleError(error);
    }
  }, []);

  if (hasError) {
    // Render fallback UI if an error has occurred
    return <h1>Something went wrong.</h1>;
  }

  return children;
};

ErrorHandler.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ErrorHandler;
