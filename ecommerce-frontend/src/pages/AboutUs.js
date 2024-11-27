import React from 'react';

const AboutUs = () => {
  // Team data
  const leadership = [
    {
      name: "John Smith",
      role: "Founder & CEO",
      image: "https://randomuser.me/api/portraits/men/1.jpg",
      description: "With over 15 years of experience in e-commerce, John founded our company with a vision to revolutionize online shopping."
    },
    {
      name: "Sarah Johnson",
      role: "Co-Founder & COO",
      image: "https://randomuser.me/api/portraits/women/1.jpg",
      description: "Sarah brings extensive operational expertise and ensures smooth functioning of all departments."
    }
  ];

  const departments = [
    {
      name: "Development Team",
      members: [
        {
          name: "Mike Wilson",
          role: "Lead Developer",
          image: "https://randomuser.me/api/portraits/men/2.jpg",
          description: "Frontend and backend architecture specialist"
        },
        {
          name: "Emily Chen",
          role: "Full Stack Developer",
          image: "https://randomuser.me/api/portraits/women/2.jpg",
          description: "Expert in React and Node.js development"
        }
      ]
    },
    {
      name: "Design Team",
      members: [
        {
          name: "David Kim",
          role: "UI/UX Lead",
          image: "https://randomuser.me/api/portraits/men/3.jpg",
          description: "Creating intuitive and beautiful user experiences"
        },
        {
          name: "Lisa Wang",
          role: "Graphic Designer",
          image: "https://randomuser.me/api/portraits/women/3.jpg",
          description: "Brand identity and visual design specialist"
        }
      ]
    },
    {
      name: "Marketing Team",
      members: [
        {
          name: "Alex Thompson",
          role: "Marketing Director",
          image: "https://randomuser.me/api/portraits/men/4.jpg",
          description: "Digital marketing strategist and brand developer"
        },
        {
          name: "Maria Garcia",
          role: "Social Media Manager",
          image: "https://randomuser.me/api/portraits/women/4.jpg",
          description: "Managing brand presence across social platforms"
        }
      ]
    },
    {
      name: "Customer Support",
      members: [
        {
          name: "James Brown",
          role: "Support Manager",
          image: "https://randomuser.me/api/portraits/men/5.jpg",
          description: "Leading customer satisfaction initiatives"
        },
        {
          name: "Sophie Turner",
          role: "Customer Relations",
          image: "https://randomuser.me/api/portraits/women/5.jpg",
          description: "Ensuring excellent customer experience"
        }
      ]
    }
  ];

  return (
    <div className="about-page">
      {/* Hero Section */}
      <div className="about-hero">
        <h1>About Us</h1>
        <p>Meet the team behind your favorite e-commerce platform</p>
      </div>

      {/* Company Overview */}
      <section className="company-overview">
        <div className="container">
          <h2>Our Story</h2>
          <p>
            Founded in 2020, our e-commerce platform has grown from a small startup
            to a leading online marketplace. We're dedicated to providing the best
            shopping experience for our customers through innovation, quality, and
            exceptional service.
          </p>
        </div>
      </section>

      {/* Leadership Section */}
      <section className="team-section leadership-section">
        <div className="container">
          <h2>Leadership Team</h2>
          <div className="team-grid">
            {leadership.map((leader, index) => (
              <div key={index} className="team-member leadership">
                <div className="member-image">
                  <img src={leader.image} alt={leader.name} />
                </div>
                <div className="member-info">
                  <h3>{leader.name}</h3>
                  <h4>{leader.role}</h4>
                  <p>{leader.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Department Sections */}
      {departments.map((dept, index) => (
        <section key={index} className="team-section">
          <div className="container">
            <h2>{dept.name}</h2>
            <div className="team-grid">
              {dept.members.map((member, memberIndex) => (
                <div key={memberIndex} className="team-member">
                  <div className="member-image">
                    <img src={member.image} alt={member.name} />
                  </div>
                  <div className="member-info">
                    <h3>{member.name}</h3>
                    <h4>{member.role}</h4>
                    <p>{member.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      ))}

      {/* Mission & Values */}
      <section className="mission-section">
        <div className="container">
          <h2>Our Mission & Values</h2>
          <div className="values-grid">
            <div className="value-item">
              <i className="fas fa-star"></i>
              <h3>Excellence</h3>
              <p>Striving for excellence in everything we do</p>
            </div>
            <div className="value-item">
              <i className="fas fa-heart"></i>
              <h3>Customer First</h3>
              <p>Putting our customers at the heart of every decision</p>
            </div>
            <div className="value-item">
              <i className="fas fa-handshake"></i>
              <h3>Integrity</h3>
              <p>Operating with honesty and transparency</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
