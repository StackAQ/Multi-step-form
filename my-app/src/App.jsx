import React, { useState } from "react";

export default function App() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    plan: "Arcade",
    billingCycle: "Monthly",
    addOns: [],
  });

  const [errors, setErrors] = useState({
    name: false,
    email: false,
    phone: false,
  });

  const plans = [
    { name: "Arcade", monthly: 9, yearly: 90 },
    { name: "Advanced", monthly: 12, yearly: 120 },
    { name: "Pro", monthly: 15, yearly: 150 },
  ];

  const addOnsList = [
    {
      name: "Online services",
      description: "Access to multiplayer games",
      monthly: 1,
      yearly: 10,
    },
    {
      name: "Larger storage",
      description: "Extra 1TB of cloud save",
      monthly: 2,
      yearly: 20,
    },
    {
      name: "Customizable Profile",
      description: "Custom theme on your profile",
      monthly: 2,
      yearly: 20,
    },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (name in errors) {
      setErrors((prev) => ({
        ...prev,
        [name]: false,
      }));
    }
  };

  const handleAddOnChange = (addOnName) => {
    setFormData((prev) => {
      const newAddOns = prev.addOns.includes(addOnName)
        ? prev.addOns.filter((name) => name !== addOnName)
        : [...prev.addOns, addOnName];
      return { ...prev, addOns: newAddOns };
    });
  };

  const handleBillingToggle = () => {
    setFormData((prev) => ({
      ...prev,
      billingCycle: prev.billingCycle === "Monthly" ? "Yearly" : "Monthly",
    }));
  };

  const validateStep1 = () => {
    const newErrors = {
      name: formData.name.trim() === "",
      email:
        formData.email.trim() === "" ||
        !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(formData.email),
      phone: formData.phone.trim() === "",
    };
    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error);
  };

  const getTotalCost = () => {
    const plan = plans.find((p) => p.name === formData.plan);
    const planCost =
      formData.billingCycle === "Monthly" ? plan.monthly : plan.yearly;
    const addOnsCost = formData.addOns.reduce((acc, addOnName) => {
      const addOn = addOnsList.find((add) => add.name === addOnName);
      const cost =
        formData.billingCycle === "Monthly" ? addOn.monthly : addOn.yearly;
      return acc + cost;
    }, 0);
    return planCost + addOnsCost;
  };

  const handleNextStep = () => {
    if (currentStep === 1 && !validateStep1()) return;
    setCurrentStep((prev) => prev + 1);
  };

  const handlePreviousStep = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const handleConfirm = () => {
    console.log("Final Form Data:", formData);
    alert("Form submitted successfully!");
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div>
            <h2 className="text-2xl lg:text-3xl font-bold text-sky-950">
              Personal Info
            </h2>
            <p className="text-gray-500">
              Please provide your name, email address, and phone number.
            </p>
            <form className="space-y-4">
              {[
                {
                  name: "name",
                  label: "Name",
                  type: "text",
                  placeholder: "e.g. Mason Mount",
                },
                {
                  name: "email",
                  label: "Email Address",
                  type: "email",
                  placeholder: "e.g. masonMount23@gmail.com",
                },
                {
                  name: "phone",
                  label: "Phone Number",
                  type: "text",
                  placeholder: "e.g. +1 234 567 890",
                },
              ].map((field) => (
                <div key={field.name} className="grid gap-2">
                  <label htmlFor={field.name}>{field.label}</label>
                  <input
                    id={field.name}
                    name={field.name}
                    type={field.type}
                    value={formData[field.name]}
                    onChange={handleChange}
                    placeholder={field.placeholder}
                    className={`p-2 border rounded-lg w-full ${
                      errors[field.name] ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors[field.name] && (
                    <span className="text-red-500 text-sm">
                      This field is required
                    </span>
                  )}
                </div>
              ))}
            </form>
          </div>
        );
      case 2:
        return (
          <div>
            <h2 className="text-2xl lg:text-3xl font-bold text-sky-950">
              Select Plan
            </h2>
            <p className="text-gray-500">Choose your plan and billing cycle.</p>
            <div className="grid gap-4">
              {plans.map((plan) => (
                <div
                  key={plan.name}
                  className={`p-4 border rounded-lg ${
                    formData.plan === plan.name
                      ? "border-blue-500 bg-sky-50"
                      : "border-gray-300"
                  }`}
                  onClick={() => setFormData({ ...formData, plan: plan.name })}
                >
                  <h3 className="text-lg font-bold">{plan.name}</h3>
                  <p className="text-sm">
                    {formData.billingCycle === "Monthly"
                      ? `$${plan.monthly}/mo`
                      : `$${plan.yearly}/yr`}
                  </p>
                </div>
              ))}
            </div>
            <button
              onClick={handleBillingToggle}
              className="mt-4 text-blue-500"
            >
              Toggle Billing ({formData.billingCycle})
            </button>
          </div>
        );
      case 3:
        return (
          <div>
            <h2 className="text-2xl lg:text-3xl font-bold text-sky-950">
              Pick Add-ons
            </h2>
            <p className="text-gray-500">
              Enhance your experience with add-ons.
            </p>
            <div className="grid gap-4">
              {addOnsList.map((addOn) => (
                <div
                  key={addOn.name}
                  className={`p-4 border rounded-lg ${
                    formData.addOns.includes(addOn.name)
                      ? "border-blue-500 bg-sky-50"
                      : "border-gray-300"
                  }`}
                >
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.addOns.includes(addOn.name)}
                      onChange={() => handleAddOnChange(addOn.name)}
                    />
                    <span className="font-bold">{addOn.name}</span>
                  </label>
                  <p className="text-sm text-gray-500">{addOn.description}</p>
                  <p className="text-sm">
                    {formData.billingCycle === "Monthly"
                      ? `+$${addOn.monthly}/mo`
                      : `+$${addOn.yearly}/yr`}
                  </p>
                </div>
              ))}
            </div>
          </div>
        );
      case 4:
        return (
          <div>
            <h2 className="text-2xl lg:text-3xl font-bold text-sky-950">
              Finishing Up
            </h2>
            <p className="text-gray-500">
              Review your selections before confirming.
            </p>
            <div className="p-4 bg-sky-50 rounded-lg">
              <h3 className="font-bold">{`${formData.plan} (${formData.billingCycle})`}</h3>
              <ul className="mt-2">
                {formData.addOns.map((addOn) => (
                  <li key={addOn} className="text-gray-500">
                    {addOn}
                  </li>
                ))}
              </ul>
              <p className="mt-4 font-bold">Total: ${getTotalCost()}</p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-sky-100 h-screen">
      <div className="max-w-4xl mx-auto flex justify-center items-center flex-col lg:flex-row w-full h-screen">
        {/* Sidebar */}
        <div className="flex items-center flex-row lg:flex-col bg-[url('bg-sidebar-desktop.svg')] bg-cover bg-no-repeat bg-center text-white rounded-lg p-8 w-full lg:w-2/5 lg:h-screen">
          {[1, 2, 3, 4].map((step) => (
            <div key={step} className="mb-6 flex items-center justify-center gap-6 w-full">
              <span
                className={`w-8 h-8 flex items-center justify-center rounded-full ${
                  step === currentStep
                    ? "bg-blue-400"
                    : "bg-transparent border border-white"
                }`}
              >
                {step}
              </span>
              <div className="hidden lg:flex flex-col justify-center">
                <p className="text-sm">{`STEP ${step}`}</p>
                <p className="font-bold">
                  {step === 1 && "YOUR INFO"}
                  {step === 2 && "SELECT PLAN"}
                  {step === 3 && "ADD-ONS"}
                  {step === 4 && "SUMMARY"}
                </p>
              </div>
            </div>
          ))}
        </div>
        {/* Main Content */}
        <div className="col-span-3 bg-white rounded-lg p-6 w-full h-screen">
          {renderStepContent()}
          <div className="mt-8 flex justify-between">
            {currentStep > 1 && (
              <button onClick={handlePreviousStep} className="text-gray-500">
                Back
              </button>
            )}
            {currentStep < 4 ? (
              <button
                onClick={handleNextStep}
                className="text-white bg-blue-500 px-4 py-2 rounded-lg"
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleConfirm}
                className="text-white bg-green-500 px-4 py-2 rounded-lg"
              >
                Confirm
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
