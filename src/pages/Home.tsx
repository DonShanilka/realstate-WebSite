import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { ContactAgentSection } from "../components/home/ContactAgentSection";
import { DiscoverSection } from "../components/home/DiscoverSection";
import { DreamHomeSection } from "../components/home/DreamHomeSection";
import { FAQSection } from "../components/home/FAQSection";
import { HomeHero } from "../components/home/HomeHero";
import { LatestProjectsSection } from "../components/home/LatestProjectsSection";
import { PropertiesSection } from "../components/home/PropertiesSection";
import { TestimonialsSection } from "../components/home/TestimonialsSection";
import { fetchProperties } from "../features/properties/property.thunks";
import { useAppDispatch, useAppSelector } from "../hooks/redux";

export default function Home() {

  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { items, status, error } = useAppSelector((state) => state.properties);
  const [query, setQuery] = useState("");
  const loading = status === "idle" || status === "loading";
  const featuredProperties = items.slice(0, 6);
  
  const latestProjects = [...items]
    .sort((left, right) => right.id - left.id)
    .slice(0, 3);

  const heroImage = featuredProperties.find(
    (property) => property.image_url,
  )?.image_url;

  useEffect(() => {
    if (status === "idle") void dispatch(fetchProperties());
  }, [dispatch, status]);

  function handleSearch(event: FormEvent) {
    event.preventDefault();
    if (query.trim().length >= 3)
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
  }

  return (
    <>
      <HomeHero
        image={heroImage}
        loading={loading}
        propertyCount={items.length}
      />
      <DiscoverSection
        query={query}
        onQueryChange={setQuery}
        onSubmit={handleSearch}
      />
      <PropertiesSection
        properties={featuredProperties}
        loading={loading}
        error={error}
      />
      <LatestProjectsSection projects={latestProjects} loading={loading} />
      <ContactAgentSection />
      <TestimonialsSection />
      <FAQSection />
      <DreamHomeSection />
    </>
  );
}
