import React, { useEffect, useState } from "react";
import DonationCard from "./DonationCard";
import { translateText } from "./translate";
import { useLanguage } from "./LanguageContext";

function DonationSection() {
  const { lang } = useLanguage();

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

  const [translatedLinks, setTranslatedLinks] = useState(donationLinks);
  const [sectionTitle, setSectionTitle] = useState("💸 Donate to Trusted Campaigns");

  useEffect(() => {
    async function translateAll() {
      if (lang === "my") {
        const title = await translateText("Donate to Trusted Campaigns", "my");
        const translations = await Promise.all(
          donationLinks.map(async (item) => ({
            ...item,
            title: await translateText(item.title, "my"),
            description: await translateText(item.description, "my")
          }))
        );
        setTranslatedLinks(translations);
        setSectionTitle("💸 " + title);
      } else {
        setTranslatedLinks(donationLinks);
        setSectionTitle("💸 Donate to Trusted Campaigns");
      }
    }

    translateAll();
  }, [lang]);

  return (
    <div style={{ marginTop: "2rem" }}>
      <h2>{sectionTitle}</h2>
      <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginTop: "1rem" }}>
        {translatedLinks.map((item, index) => (
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
