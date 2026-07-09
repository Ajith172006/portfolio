import { ChangeEvent, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { PortfolioConfig } from "../config";
import { usePortfolio } from "../context/PortfolioProvider";
import "./AdminPanel.css";

type Project = PortfolioConfig["projects"][number];
type Experience = PortfolioConfig["experiences"][number];
type TechItem = PortfolioConfig["techStack"][number][number];

const emptyProject = (id: number): Project => ({
  id,
  title: "New Project",
  category: "Full Stack",
  technologies: "React, Node.js",
  image: "/images/placeholder.webp",
  description: "Describe this project.",
});

const emptyExperience = (): Experience => ({
  position: "New Education / Experience",
  company: "Institution or Company",
  period: "2026",
  location: "Location",
  description: "Describe this entry.",
  responsibilities: [],
  technologies: [],
});

const emptyTechItem = (): TechItem => ({
  name: "New Tech",
  icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
  url: "https://react.dev",
});

const readFileAsDataUrl = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

const toList = (value: string) =>
  value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

const AdminPanel = () => {
  const { portfolio, setPortfolio, resetPortfolio, importPortfolio } = usePortfolio();
  const [importText, setImportText] = useState("");
  const exportedJson = useMemo(() => JSON.stringify(portfolio, null, 2), [portfolio]);

  const updateDeveloper = (
    field: keyof PortfolioConfig["developer"],
    value: string
  ) => {
    setPortfolio((current) => ({
      ...current,
      developer: {
        ...current.developer,
        [field]: value,
      },
    }));
  };

  const [portraitUploaded, setPortraitUploaded] = useState(false);

  const updatePortraitImage = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const image = await readFileAsDataUrl(file);
    updateDeveloper("portraitImage", image);
    setPortraitUploaded(true);
    setTimeout(() => setPortraitUploaded(false), 3000);
  };

  const updateContact = (
    field: keyof PortfolioConfig["contact"],
    value: string
  ) => {
    setPortfolio((current) => ({
      ...current,
      contact: { ...current.contact, [field]: value },
      social: field === "email" ? { ...current.social, email: value } : current.social,
    }));
  };

  const updateSocial = (field: keyof PortfolioConfig["social"], value: string) => {
    setPortfolio((current) => ({
      ...current,
      social: { ...current.social, [field]: value },
    }));
  };

  const updateAbout = (field: keyof PortfolioConfig["about"], value: string) => {
    setPortfolio((current) => ({
      ...current,
      about: { ...current.about, [field]: value },
    }));
  };

  const updateSkill = (
    group: keyof PortfolioConfig["skills"],
    field: "title" | "description" | "details" | "tools",
    value: string
  ) => {
    setPortfolio((current) => ({
      ...current,
      skills: {
        ...current.skills,
        [group]: {
          ...current.skills[group],
          [field]: field === "tools" ? toList(value) : value,
        },
      },
    }));
  };

  const updateProject = (
    index: number,
    field: keyof Project,
    value: string | number
  ) => {
    setPortfolio((current) => ({
      ...current,
      projects: current.projects.map((project, projectIndex) =>
        projectIndex === index ? { ...project, [field]: value } : project
      ),
    }));
  };

  const updateProjectImage = async (
    index: number,
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const image = await readFileAsDataUrl(file);
    updateProject(index, "image", image);
  };

  const updateExperience = (
    index: number,
    field: keyof Experience,
    value: string
  ) => {
    setPortfolio((current) => ({
      ...current,
      experiences: current.experiences.map((experience, experienceIndex) =>
        experienceIndex === index
          ? {
              ...experience,
              [field]:
                field === "responsibilities" || field === "technologies"
                  ? toList(value)
                  : value,
            }
          : experience
      ),
    }));
  };

  const updateTechItem = (
    rowIndex: number,
    itemIndex: number,
    field: keyof TechItem,
    value: string
  ) => {
    setPortfolio((current) => ({
      ...current,
      techStack: current.techStack.map((row, currentRowIndex) =>
        currentRowIndex === rowIndex
          ? row.map((item, currentItemIndex) =>
              currentItemIndex === itemIndex ? { ...item, [field]: value } : item
            )
          : row
      ),
    }));
  };

  const addProject = () => {
    setPortfolio((current) => ({
      ...current,
      projects: [
        ...current.projects,
        emptyProject(Math.max(0, ...current.projects.map((item) => item.id)) + 1),
      ],
    }));
  };

  const addExperience = () => {
    setPortfolio((current) => ({
      ...current,
      experiences: [...current.experiences, emptyExperience()],
    }));
  };

  const addTechRow = () => {
    setPortfolio((current) => ({
      ...current,
      techStack: [...current.techStack, [emptyTechItem()]],
    }));
  };

  const addTechItem = (rowIndex: number) => {
    setPortfolio((current) => ({
      ...current,
      techStack: current.techStack.map((row, currentRowIndex) =>
        currentRowIndex === rowIndex ? [...row, emptyTechItem()] : row
      ),
    }));
  };

  const removeProject = (index: number) => {
    setPortfolio((current) => ({
      ...current,
      projects: current.projects.filter((_, projectIndex) => projectIndex !== index),
    }));
  };

  const removeExperience = (index: number) => {
    setPortfolio((current) => ({
      ...current,
      experiences: current.experiences.filter((_, expIndex) => expIndex !== index),
    }));
  };

  const removeTechItem = (rowIndex: number, itemIndex: number) => {
    setPortfolio((current) => ({
      ...current,
      techStack: current.techStack
        .map((row, currentRowIndex) =>
          currentRowIndex === rowIndex
            ? row.filter((_, currentItemIndex) => currentItemIndex !== itemIndex)
            : row
        )
        .filter((row) => row.length > 0),
    }));
  };

  const handleImport = () => {
    try {
      importPortfolio(JSON.parse(importText) as PortfolioConfig);
      setImportText("");
    } catch {
      window.alert("Invalid portfolio JSON.");
    }
  };

  return (
    <div className="admin-page">
      <aside className="admin-sidebar">
        <div>
          <p className="admin-kicker">Portfolio</p>
          <h1>Admin Panel</h1>
        </div>
        <nav>
          <a href="#profile">Profile</a>
          <a href="#education">Education</a>
          <a href="#projects">Projects</a>
          <a href="#tech">Tech Stack</a>
          <a href="#data">Data</a>
        </nav>
        <Link to="/" className="admin-home-link">
          View Portfolio
        </Link>
      </aside>

      <main className="admin-content">
        <section className="admin-section" id="profile">
          <div className="admin-section-title">
            <h2>Profile</h2>
            <p>Name, position, objective, and links.</p>
          </div>
          <div className="admin-grid two">
            <label>
              Full name
              <input
                value={portfolio.developer.fullName}
                onChange={(event) => updateDeveloper("fullName", event.target.value)}
              />
            </label>
            <label>
              Short name
              <input
                value={portfolio.developer.name}
                onChange={(event) => updateDeveloper("name", event.target.value)}
              />
            </label>
            <label>
              Position
              <input
                value={portfolio.developer.title}
                onChange={(event) => updateDeveloper("title", event.target.value)}
              />
            </label>
            <div className="portrait-admin-card wide">
              <p className="portrait-card-label">Portfolio Image</p>
              <div className="portrait-upload-zone">
                <div className="portrait-preview-wrap">
                  <img
                    src={portfolio.developer.portraitImage}
                    alt={portfolio.developer.fullName}
                    className="portrait-preview-img"
                  />
                  {portraitUploaded && (
                    <span className="portrait-success-badge">✓ Uploaded!</span>
                  )}
                </div>
                <div className="portrait-upload-actions">
                  <p className="portrait-hint">
                    Upload a PNG / JPG of yourself (no background recommended).
                  </p>
                  <label className="portrait-upload-btn">
                    {portraitUploaded ? "✓ Image Updated" : "↑ Upload Photo"}
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/webp,image/*"
                      onChange={updatePortraitImage}
                    />
                  </label>
                  <label className="wide portrait-url-label">
                    Or paste an image URL
                    <input
                      value={portfolio.developer.portraitImage.startsWith("data:") ? "" : portfolio.developer.portraitImage}
                      placeholder="https://example.com/photo.png"
                      onChange={(event) => updateDeveloper("portraitImage", event.target.value)}
                    />
                  </label>
                </div>
              </div>
            </div>
            <label className="wide">
              Objective
              <textarea
                value={portfolio.developer.description}
                onChange={(event) => updateDeveloper("description", event.target.value)}
              />
            </label>
            <label className="wide">
              About section
              <textarea
                value={portfolio.about.description}
                onChange={(event) => updateAbout("description", event.target.value)}
              />
            </label>
            <label>
              Email
              <input
                value={portfolio.contact.email}
                onChange={(event) => updateContact("email", event.target.value)}
              />
            </label>
            <label>
              Location
              <input
                value={portfolio.social.location}
                onChange={(event) => updateSocial("location", event.target.value)}
              />
            </label>
            <label>
              GitHub link
              <input
                value={portfolio.contact.github}
                onChange={(event) => updateContact("github", event.target.value)}
              />
            </label>
            <label>
              LinkedIn link
              <input
                value={portfolio.contact.linkedin}
                onChange={(event) => updateContact("linkedin", event.target.value)}
              />
            </label>
          </div>
        </section>

        <section className="admin-section">
          <div className="admin-section-title">
            <h2>Skill Cards</h2>
            <p>Controls the What I Do section.</p>
          </div>
          <div className="admin-grid two">
            {(["develop", "design"] as const).map((group) => (
              <div className="admin-subpanel" key={group}>
                <h3>{group === "develop" ? "Primary Skill" : "Secondary Skill"}</h3>
                <label>
                  Title
                  <input
                    value={portfolio.skills[group].title}
                    onChange={(event) => updateSkill(group, "title", event.target.value)}
                  />
                </label>
                <label>
                  Subtitle
                  <input
                    value={portfolio.skills[group].description}
                    onChange={(event) =>
                      updateSkill(group, "description", event.target.value)
                    }
                  />
                </label>
                <label>
                  Details
                  <textarea
                    value={portfolio.skills[group].details}
                    onChange={(event) => updateSkill(group, "details", event.target.value)}
                  />
                </label>
                <label>
                  Tools, comma separated
                  <textarea
                    value={portfolio.skills[group].tools.join(", ")}
                    onChange={(event) => updateSkill(group, "tools", event.target.value)}
                  />
                </label>
              </div>
            ))}
          </div>
        </section>

        <section className="admin-section" id="education">
          <div className="admin-section-title with-action">
            <div>
              <h2>Education & Experience</h2>
              <p>Add or update education, certifications, and roles.</p>
            </div>
            <button onClick={addExperience}>Add Entry</button>
          </div>
          <div className="admin-list">
            {portfolio.experiences.map((experience, index) => (
              <div className="admin-item" key={`${experience.position}-${index}`}>
                <div className="admin-item-head">
                  <h3>{experience.position}</h3>
                  <button onClick={() => removeExperience(index)}>Remove</button>
                </div>
                <div className="admin-grid two">
                  <label>
                    Position / Degree
                    <input
                      value={experience.position}
                      onChange={(event) =>
                        updateExperience(index, "position", event.target.value)
                      }
                    />
                  </label>
                  <label>
                    Institution / Company
                    <input
                      value={experience.company}
                      onChange={(event) =>
                        updateExperience(index, "company", event.target.value)
                      }
                    />
                  </label>
                  <label>
                    Period
                    <input
                      value={experience.period}
                      onChange={(event) =>
                        updateExperience(index, "period", event.target.value)
                      }
                    />
                  </label>
                  <label>
                    Location
                    <input
                      value={experience.location}
                      onChange={(event) =>
                        updateExperience(index, "location", event.target.value)
                      }
                    />
                  </label>
                  <label className="wide">
                    Description
                    <textarea
                      value={experience.description}
                      onChange={(event) =>
                        updateExperience(index, "description", event.target.value)
                      }
                    />
                  </label>
                  <label>
                    Responsibilities, comma separated
                    <textarea
                      value={experience.responsibilities.join(", ")}
                      onChange={(event) =>
                        updateExperience(index, "responsibilities", event.target.value)
                      }
                    />
                  </label>
                  <label>
                    Technologies, comma separated
                    <textarea
                      value={experience.technologies.join(", ")}
                      onChange={(event) =>
                        updateExperience(index, "technologies", event.target.value)
                      }
                    />
                  </label>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="admin-section" id="projects">
          <div className="admin-section-title with-action">
            <div>
              <h2>Projects</h2>
              <p>Upload images and manage every project card.</p>
            </div>
            <button onClick={addProject}>Add Project</button>
          </div>
          <div className="admin-list">
            {portfolio.projects.map((project, index) => (
              <div className="admin-item project-editor" key={project.id}>
                <div className="admin-item-head">
                  <h3>{project.title}</h3>
                  <button onClick={() => removeProject(index)}>Remove</button>
                </div>
                <div className="project-editor-grid">
                  <div className="project-image-preview">
                    <img src={project.image} alt={project.title} />
                    <label className="file-control">
                      Upload image
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(event) => updateProjectImage(index, event)}
                      />
                    </label>
                  </div>
                  <div className="admin-grid two">
                    <label>
                      Title
                      <input
                        value={project.title}
                        onChange={(event) =>
                          updateProject(index, "title", event.target.value)
                        }
                      />
                    </label>
                    <label>
                      Category
                      <input
                        value={project.category}
                        onChange={(event) =>
                          updateProject(index, "category", event.target.value)
                        }
                      />
                    </label>
                    <label className="wide">
                      Technologies
                      <input
                        value={project.technologies}
                        onChange={(event) =>
                          updateProject(index, "technologies", event.target.value)
                        }
                      />
                    </label>
                    <label className="wide">
                      Image URL
                      <input
                        value={project.image}
                        onChange={(event) =>
                          updateProject(index, "image", event.target.value)
                        }
                      />
                    </label>
                    <label className="wide">
                      Description
                      <textarea
                        value={project.description}
                        onChange={(event) =>
                          updateProject(index, "description", event.target.value)
                        }
                      />
                    </label>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="admin-section" id="tech">
          <div className="admin-section-title with-action">
            <div>
              <h2>Tech Stack</h2>
              <p>Edit the icon pyramid rows.</p>
            </div>
            <button onClick={addTechRow}>Add Row</button>
          </div>
          <div className="tech-editor">
            {portfolio.techStack.map((row, rowIndex) => (
              <div className="tech-editor-row" key={rowIndex}>
                <div className="tech-row-head">
                  <h3>Row {rowIndex + 1}</h3>
                  <button onClick={() => addTechItem(rowIndex)}>Add Tech</button>
                </div>
                {row.map((tech, itemIndex) => (
                  <div className="tech-editor-item" key={`${tech.name}-${itemIndex}`}>
                    <img src={tech.icon} alt="" />
                    <input
                      value={tech.name}
                      onChange={(event) =>
                        updateTechItem(rowIndex, itemIndex, "name", event.target.value)
                      }
                      aria-label="Tech name"
                    />
                    <input
                      value={tech.icon}
                      onChange={(event) =>
                        updateTechItem(rowIndex, itemIndex, "icon", event.target.value)
                      }
                      aria-label="Tech icon"
                    />
                    <input
                      value={tech.url}
                      onChange={(event) =>
                        updateTechItem(rowIndex, itemIndex, "url", event.target.value)
                      }
                      aria-label="Tech URL"
                    />
                    <button onClick={() => removeTechItem(rowIndex, itemIndex)}>
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </section>

        <section className="admin-section" id="data">
          <div className="admin-section-title">
            <h2>Data</h2>
            <p>Export, import, or reset your portfolio content.</p>
          </div>
          <div className="admin-data-actions">
            <button onClick={() => navigator.clipboard.writeText(exportedJson)}>
              Copy Export JSON
            </button>
            <button onClick={resetPortfolio}>Reset Defaults</button>
          </div>
          <label>
            Current JSON
            <textarea className="json-box" readOnly value={exportedJson} />
          </label>
          <label>
            Paste JSON to import
            <textarea
              className="json-box"
              value={importText}
              onChange={(event) => setImportText(event.target.value)}
            />
          </label>
          <button onClick={handleImport}>Import JSON</button>
        </section>
      </main>
    </div>
  );
};

export default AdminPanel;
