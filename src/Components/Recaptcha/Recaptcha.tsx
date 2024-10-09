import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { gsap } from 'gsap';

interface RecaptchaProps {
  onCaptchaVerified: (verified: boolean) => void;
}

const Recaptcha: React.FC<RecaptchaProps> = ({ onCaptchaVerified }) => {
  const [captchaImage, setCaptchaImage] = useState<string>('');
  const [captchaToken, setCaptchaToken] = useState<string>('');
  const [userInput, setUserInput] = useState<string>('');
  const [captchaValidated, setCaptchaValidated] = useState<boolean | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const errorRef = useRef<HTMLParagraphElement | null>(null);

  // Function to fetch a new CAPTCHA from the server
  const fetchCaptcha = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/recaptcha/challenge');
      setCaptchaImage(response.data.question); // Set new CAPTCHA question
      setCaptchaToken(response.data.hash); // Set new token
    } catch (error) {
      console.error('Error fetching CAPTCHA', error);
    }
  };

  // Fetch CAPTCHA when component first loads
  useEffect(() => {
    fetchCaptcha();
  }, []);

  // Handle CAPTCHA form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3001/api/recaptcha/verify', {
        answer: userInput,
        hash: captchaToken,
      });

      if (response.data.success) {
        setCaptchaValidated(true);
        setMessage('CAPTCHA successfully passed!');
        onCaptchaVerified(true); // Notify parent component of success
      } else {
        setCaptchaValidated(false);
        setMessage('CAPTCHA failed. Try again.');
        onCaptchaVerified(false); // Notify parent component of failure
        gsap.fromTo(
          errorRef.current,
          { opacity: 0, y: -20 },
          { opacity: 1, y: 0, duration: 0.5 }
        );
        fetchCaptcha(); // Fetch a new CAPTCHA without page reload
      }
    } catch (error) {
      console.error('Error verifying CAPTCHA', error);
      setCaptchaValidated(false);
      setMessage('Error verifying CAPTCHA.');
      onCaptchaVerified(false);
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
        <p ref={errorRef} className={captchaValidated ? 'success-message' : 'error-message'}>
          {message}
        </p>
      )}
    </div>
  );
};

export default Recaptcha;
