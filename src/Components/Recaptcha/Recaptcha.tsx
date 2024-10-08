import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface RecaptchaProps {
  onCaptchaVerified: (verified: boolean) => void; // Define the prop type
}

const Recaptcha: React.FC<RecaptchaProps> = ({ onCaptchaVerified }) => {
  const [captchaImage, setCaptchaImage] = useState<string>('');
  const [captchaToken, setCaptchaToken] = useState<string>('');
  const [userInput, setUserInput] = useState<string>('');
  const [captchaValidated, setCaptchaValidated] = useState<boolean | null>(null);
  const [captchaVerified, setCaptchaVerified] = useState<boolean>(false); // Track CAPTCHA verification

  // Fetch the CAPTCHA challenge from the backend when the component loads
  useEffect(() => {
    const fetchCaptcha = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/recaptcha/challenge'); // Correct endpoint
        setCaptchaImage(response.data.question); // Set the CAPTCHA image/question
        setCaptchaToken(response.data.hash); // Set the token to send back
      } catch (error) {
        console.error('Error fetching CAPTCHA', error);
      }
    };

    fetchCaptcha();
  }, []);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3001/api/recaptcha/verify', {
        answer: userInput,  // Send the user's input to be verified
        hash: captchaToken,  // Send the hash provided by the server
      });

      if (response.data.success) {
        setCaptchaValidated(true);
        setCaptchaVerified(true);  // CAPTCHA successfully verified
        onCaptchaVerified(true); // Notify parent component that CAPTCHA is verified
        alert('CAPTCHA passed!');
      } else {
        setCaptchaValidated(false);
        setCaptchaVerified(false);  // CAPTCHA verification failed
        alert('CAPTCHA failed. Please try again.');
      }
    } catch (error) {
      console.error('Error verifying CAPTCHA', error);
      setCaptchaValidated(false);
      setCaptchaVerified(false);  // CAPTCHA verification failed
    }
  };

  return (
    <div>
      <h3>Verify CAPTCHA</h3>
      {captchaImage && (
        <div>
          <p>{captchaImage}</p> {/* Display the CAPTCHA question here */}
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

      {/* CAPTCHA validation status */}
      {captchaValidated === true && <p>CAPTCHA passed!</p>}
      {captchaValidated === false && <p>CAPTCHA failed. Try again.</p>}

      {/* Notify when CAPTCHA is not verified */}
      {!captchaVerified && <p>Please complete the CAPTCHA to enable Sign Up/Login</p>}
    </div>
  );
};

export default Recaptcha;
