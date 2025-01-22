import React, { useState } from "react";
import {
  MDBBtn,
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBInput,
} from "mdb-react-ui-kit";
import { useNavigate } from "react-router-dom";
import "./login.scss";

const Login = () => {
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async () => {
    setError(null);

    // Client-side validation
    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    try {
      // Backend API call
      const response = await fetch(BASE_URL + "/api/users/loginAdminUser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Navigate to dashboard on success
        navigate("/");
      } else {
        // Show error message
        setError(data.message || "Invalid email or password.");
      }
    } catch (err) {
      setError("An error occurred while connecting to the server.");
    }
  };

  return (
    <MDBContainer className="my-5 gradient-form">
      <MDBRow>
        <MDBCol col="6" className="mb-5">
          <div className="d-flex flex-column ms-5">
            <div className="text-center">
              <img
                src="/img/logo.png"
                style={{ width: "185px", borderRadius: "10%" }}
                alt="dt"
              />
              <h4 className="mt-1 mb-5 pb-1">
                Make your village more visible to the world!
              </h4>
            </div>

            <p>Please login to your account</p>

            {error && <div className="alert alert-danger">{error}</div>}

            <MDBInput
              wrapperClass="mb-4"
              label="Email address"
              id="form1"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <MDBInput
              wrapperClass="mb-4"
              label="Password"
              id="form2"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <div className="text-center pt-1 mb-5 pb-1">
              <MDBBtn
                className="mb-4 w-100 gradient-custom-2"
                onClick={handleLogin}
              >
                Sign in
              </MDBBtn>
            </div>
          </div>
        </MDBCol>

        <MDBCol col="6" className="mb-5 border-radius-lg">
          <div className="d-flex flex-column  justify-content-center gradient-custom-2 h-100 mb-4 border-radius-lg">
            <div className="text-white px-3 py-4 p-md-5 mx-md-4">
              <h4 className="mb-4">हामी केवल कम्पनी मात्र होइनौँ।</h4>
              {/* <p className="small mb-0 font-weight-light">
                ड्रीमसफ्ट टेक्नोलोजी एउटा गतिशील र नवीनतापूर्ण सफ्टवेयर कम्पनी
                हो, जसले विश्वभरका व्यवसायहरूको विकसित आवश्यकताहरूलाई सम्बोधन
                गर्न अत्याधुनिक प्रविधि समाधानहरू प्रदान गर्दछ। सफ्टवेयर विकास,
                क्लाउड कम्प्युटिङ, कृत्रिम बुद्धिमत्ता, र कस्टम इन्टरप्राइज
                समाधानमा केन्द्रित, ड्रीमसफ्ट टेक्नोलोजीले संगठनहरूलाई उनीहरूको
                सञ्चालनलाई सुव्यवस्थित गर्न र उत्पादकत्व बढाउन सहयोग गर्दछ।
                गुणस्तरप्रति प्रतिबद्धता र ग्राहक-केंद्रित दृष्टिकोणका लागि
                प्रख्यात, कम्पनीले प्रविधि विशेषज्ञतालाई उद्योग प्रवृत्तिहरूको
                गहिरो बुझाइसँग संयोजन गरी मापनयोग्य, भरपर्दो, र किफायती सफ्टवेयर
                समाधानहरू प्रदान गर्दछ। उच्च दक्षता भएका पेशेवरहरूको टोलीद्वारा
                समर्थित, ड्रीमसफ्ट टेक्नोलोजी व्यवसायहरूलाई वृद्धि, कार्यक्षमता,
                र डिजिटल परिवर्तनको दिशामा अघि बढाउनका लागि आवश्यक उपकरणहरू
                उपलब्ध गराउन समर्पित छ।
              </p> */}
              <h4 className="mb-4">We are more than just a company</h4>
              <p className="small mb-0 font-weight-light">
                Dreamsoft Technology is a dynamic and innovative software
                company specializing in delivering cutting-edge technology
                solutions tailored to meet the evolving needs of businesses
                worldwide. With a focus on software development, cloud
                computing, artificial intelligence, and custom enterprise
                solutions, Dreamsoft Technology helps organizations streamline
                their operations and enhance productivity. Known for its
                commitment to quality and customer-centric approach, the company
                combines technical expertise with a deep understanding of
                industry trends to provide scalable, reliable, and
                cost-effective software solutions. Backed by a team of highly
                skilled professionals, Dreamsoft Technology is dedicated to
                empowering businesses with tools that drive growth, efficiency,
                and digital transformation.
              </p>
            </div>
          </div>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
};

export default Login;
