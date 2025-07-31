import React, { createContext, useContext, useState, useCallback } from 'react';

// Context to provide validation control globally
const ValidationContext = createContext();

export function ValidationProvider({ children }) {
  // errors keyed by field name
  const [errors, setErrors] = useState({});

  // Validate all required fields inside the container with data-required="true"
  // Optionally limit validation scope by container ref or document by default
  const validateAll = useCallback((container = document) => {
    const requiredFields = container.querySelectorAll('*:required');
    let newErrors = {};
    let hasErrors = false;

    requiredFields.forEach((field) => {
        console.log(field);
      const value = field.value?.toString().trim() || '';
      const name = field.name || null;
      if (!name) return; // skip fields without name

      if (value === '') {
        newErrors[name] = 'This field is required';
        hasErrors = true;
      }
    });

    setErrors(newErrors);
    return !hasErrors;
  }, []);

  // Get MUI props for a field by name
  const getFieldProps = useCallback(
    (name) => {
      if (errors[name]) {
        return { error: true, helperText: errors[name] };
      }
      return { error: false, helperText: '' };
    },
    [errors]
  );

  return (
    <ValidationContext.Provider value={{ validateAll, getFieldProps, errors, setErrors }}>
      {children}
    </ValidationContext.Provider>
  );
}

// Hook to access validation helpers
export function useValidation() {
  return useContext(ValidationContext);
}
