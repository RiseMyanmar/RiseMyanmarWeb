import React from "react";
import DonationCard from "./DonationCard";

function DonationSection() {
  const donationLinks = [
    {
      title: "Myanmar Earthquake Relief by Global Aid",
      description: "Supports emergency food, medical supplies, and shelter distribution in the hardest-hit areas.",
      link: "https://www.gofundme.com/f/myanmar-earthquake-relief"
    },
    {
      title: "Shelter for Displaced Families",
      description: "Helps build temporary housing for families who lost their homes in the Mandalay region.",
      link: "https://www.some-org.org/donate"
    },
    {
      title: "Support Local Rescuers",
      description: "Fund fuel, gear, and safety kits for community-based rescue teams working in dangerous zones.",
      link: "https://rescuemyanmar.org/donate"
    }
  ];

  return (
    <div style={{ marginTop: "2rem" }}>
      <h2>💸 Donate to Trusted Campaigns</h2>
      <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginTop: "1rem" }}>
        {donationLinks.map((item, index) => (
          <DonationCard
            key={index}
            title={item.title}
            description={item.description}
            link={item.link}
          />
        ))}
      </div>
    </div>
  );
}

export default DonationSection;
