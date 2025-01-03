// src/components/Recaptcha.tsx

import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { gsap } from "gsap";

interface RecaptchaProps {
  onCaptchaVerified: (verified: boolean) => void;
}

const Recaptcha: React.FC<RecaptchaProps> = ({ onCaptchaVerified }) => {
  const [captchaImage, setCaptchaImage] = useState<string>("");
  const [captchaToken, setCaptchaToken] = useState<string>("");
  const [userInput, setUserInput] = useState<string>("");
  const [captchaValidated, setCaptchaValidated] = useState<boolean | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const errorRef = useRef<HTMLParagraphElement | null>(null);
  const messageTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Function to fetch a new CAPTCHA from the server
  const fetchCaptcha = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3001/api/recaptcha/challenge"
      );
      setCaptchaImage(response.data.question); // Set new CAPTCHA question
      setCaptchaToken(response.data.hash); // Set new token
    } catch (error) {
      console.error("Error fetching CAPTCHA", error);
    }
  };

  // Fetch CAPTCHA when component first loads
  useEffect(() => {
    fetchCaptcha();
  }, []);

  // Clear message after a few seconds
  const clearMessage = () => {
    if (messageTimeoutRef.current) {
      clearTimeout(messageTimeoutRef.current);
    }
    messageTimeoutRef.current = setTimeout(() => {
      setMessage(null);
      setCaptchaValidated(null);
    }, 3000); // Clear after 3 seconds
  };

  // Handle CAPTCHA form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitting CAPTCHA verification...");
    try {
      //console.log("CAPTCHA token:", token);
      const response = await axios.post(
        "http://localhost:3001/api/recaptcha/verify",
        {
          answer: userInput,
          hash: captchaToken,
        }
      );
      console.log("CAPTCHA verification response:", response.data);

      if (response.status === 200 && response.data.success) {
        console.log("CAPTCHA verification successful");
        setCaptchaValidated(true);
        setMessage("CAPTCHA successfully passed!");
        onCaptchaVerified(true); // Notify parent component of success
        clearMessage(); // Clear success message after 3 seconds
      } else {
        console.error("CAPTCHA verification failed:", response.data.error);
        // CAPTCHA verification failed
        setCaptchaValidated(false);
        setMessage("CAPTCHA failed. Try again.");
        onCaptchaVerified(false); // Notify parent component of failure
        gsap.fromTo(
          errorRef.current,
          { opacity: 0, y: -20 },
          { opacity: 1, y: 0, duration: 0.5 }
        );

        // Check if a new CAPTCHA challenge is provided in the response
        if (response.data.captcha) {
          setCaptchaImage(response.data.captcha.question);
          setCaptchaToken(response.data.captcha.hash);
        } else {
          // If no new CAPTCHA is provided, fetch a new one
          fetchCaptcha();
        }
        clearMessage(); // Clear error message after 3 seconds
      }
    } catch (error) {
      console.error("Error verifying CAPTCHA", error);
      setCaptchaValidated(false);
      setMessage("Error verifying CAPTCHA.");
      onCaptchaVerified(false);
      fetchCaptcha(); // Refresh CAPTCHA in case of an error
      clearMessage(); // Clear error message after 3 seconds
    }
  };

  return (
    <div>
      <h3>Solve the captcha first before entering email and password</h3>
      {captchaImage && (
        <div>
          <p>{captchaImage}</p> {/* Display the CAPTCHA question */}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <label>
          Enter CAPTCHA answer:
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            required
          />
        </label>
        <button type="submit">Submit</button>
      </form>

      {message && (
        <p
          ref={errorRef}
          className={captchaValidated ? "success-message" : "error-message"}
        >
          {message}
        </p>
      )}
    </div>
  );
};

export default Recaptcha;
