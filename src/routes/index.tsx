import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import App from "@/App";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      {
        title: "ADAM ATIA | متجر الألعاب الرقمية",
      },
      {
        name: "description",
        content:
          "ADAM ATIA - متجرك الأول لشراء الألعاب الرقمية في مصر بأفضل الأسعار بالجنيه المصري",
      },
      { property: "og:title", content: "ADAM ATIA | متجر الألعاب الرقمية" },
      {
        property: "og:description",
        content:
          "متجرك الأول لشراء الألعاب الرقمية في مصر بأفضل الأسعار بالجنيه المصري",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      {
        name: "twitter:title",
        content: "ADAM ATIA | متجر الألعاب الرقمية",
      },
    ],
  }),
  component: Index,
});

function Index() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="min-h-screen bg-primary-c" />;
  }

  return <App />;
}
