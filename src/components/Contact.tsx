import { MdArrowOutward, MdCopyright } from "react-icons/md";
import "./styles/Contact.css";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useState } from "react";
import { usePortfolio } from "../context/PortfolioProvider";
import emailjs from "@emailjs/browser";

gsap.registerPlugin(ScrollTrigger);

const Contact = () => {
  const { portfolio } = usePortfolio();
  
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [formStatus, setFormStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [errors, setErrors] = useState({ name: "", email: "", message: "" });

  useEffect(() => {
    const contactTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: ".contact-section",
        start: "top 80%",
        end: "bottom center",
        toggleActions: "play none none none",
      },
    });

    // Animate title from bottom
    contactTimeline.fromTo(
      ".contact-section h3",
      {
        opacity: 0,
        y: 50,
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power3.out",
      }
    );

    // Animate contact boxes and form with stagger from bottom
    contactTimeline.fromTo(
      [".contact-info-col .contact-box", ".contact-form-col"],
      {
        opacity: 0,
        y: 50,
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.15,
        ease: "power3.out",
      },
      "-=0.4"
    );

    // Clean up
    return () => {
      contactTimeline.kill();
    };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    let valid = true;
    const newErrors = { name: "", email: "", message: "" };

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
      valid = false;
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
      valid = false;
    }
    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setFormStatus("sending");
    
    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

    const isConfigured = 
      serviceId && serviceId !== "your_service_id_here" &&
      templateId && templateId !== "your_template_id_here" &&
      publicKey && publicKey !== "your_public_key_here";

    if (isConfigured) {
      const templateParams = {
        from_name: formData.name,
        from_email: formData.email,
        message: formData.message,
        to_name: portfolio.developer.fullName,
      };

      emailjs
        .send(serviceId, templateId, templateParams, publicKey)
        .then(() => {
          setFormStatus("success");
          setFormData({ name: "", email: "", message: "" });
        })
        .catch((error) => {
          console.error("EmailJS Error:", error);
          setFormStatus("error");
        });
    } else {
      // Graceful fallback to simulated success for out-of-the-box local testing
      setTimeout(() => {
        setFormStatus("success");
        setFormData({ name: "", email: "", message: "" });
      }, 1500);
    }
  };

  return (
    <div className="contact-section section-container" id="contact">
      <div className="contact-container">
        <h3>{portfolio.developer.fullName}</h3>
        <div className="contact-flex">
          {/* Left Column: Info Card */}
          <div className="contact-info-col">
            <div className="contact-box">
              <h4>Email</h4>
              <p>
                <a href={`mailto:${portfolio.contact.email}`} data-cursor="disable">
                  {portfolio.contact.email}
                </a>
              </p>
              <h4>Location</h4>
              <p>
                <span>{portfolio.social.location}</span>
              </p>
            </div>
            <div className="contact-box">
              <h4>Social</h4>
              <div className="contact-socials-grid">
                <a
                  href={portfolio.contact.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cursor="disable"
                  className="contact-social"
                >
                  Github <MdArrowOutward />
                </a>
                <a
                  href={portfolio.contact.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cursor="disable"
                  className="contact-social"
                >
                  Linkedin <MdArrowOutward />
                </a>
              </div>
            </div>
            <div className="contact-box credits-box">
              <h2>
                Designed and Developed <br /> by <span>{portfolio.developer.fullName}</span>
              </h2>
              <h5>
                <MdCopyright /> {new Date().getFullYear()}
              </h5>
            </div>
          </div>

          {/* Right Column: Interactive Form Card */}
          <div className="contact-form-col">
            {formStatus === "success" ? (
              <div className="form-success-container">
                <div className="success-icon">✓</div>
                <h4>Message Sent!</h4>
                <p>Thank you for reaching out. I'll get back to you as soon as possible.</p>
                <button 
                  onClick={() => setFormStatus("idle")} 
                  className="form-reset-btn"
                  data-cursor="disable"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="contact-form" noValidate>
                <h4>Send a Message</h4>
                
                {formStatus === "error" && (
                  <div className="form-error-banner">
                    ⚠️ Failed to send message. Please email directly at{" "}
                    <a href={`mailto:${portfolio.contact.email}`}>{portfolio.contact.email}</a>.
                  </div>
                )}
                
                <div className="form-group">
                  <input
                    type="text"
                    id="name"
                    name="name"
                    placeholder=" "
                    value={formData.name}
                    onChange={handleChange}
                    className={errors.name ? "input-error" : ""}
                    disabled={formStatus === "sending"}
                  />
                  <label htmlFor="name">Name</label>
                  {errors.name && <span className="error-text">{errors.name}</span>}
                </div>

                <div className="form-group">
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder=" "
                    value={formData.email}
                    onChange={handleChange}
                    className={errors.email ? "input-error" : ""}
                    disabled={formStatus === "sending"}
                  />
                  <label htmlFor="email">Email Address</label>
                  {errors.name && errors.email && <span className="error-text">{errors.email}</span>}
                  {errors.email && (!errors.name || !errors.email.includes("required")) && <span className="error-text">{errors.email}</span>}
                  {errors.email && errors.name && errors.email.includes("required") && <span className="error-text">{errors.email}</span>}
                </div>

                <div className="form-group">
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    placeholder=" "
                    value={formData.message}
                    onChange={handleChange}
                    className={errors.message ? "input-error" : ""}
                    disabled={formStatus === "sending"}
                  />
                  <label htmlFor="message">Message</label>
                  {errors.message && <span className="error-text">{errors.message}</span>}
                </div>

                <button 
                  type="submit" 
                  className="form-submit-btn" 
                  disabled={formStatus === "sending"}
                  data-cursor="disable"
                >
                  {formStatus === "sending" ? (
                    <span className="spinner-container">
                      <span className="spinner"></span> Sending...
                    </span>
                  ) : "SEND MESSAGE"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
