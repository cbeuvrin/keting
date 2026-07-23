import { HomeShell } from "@/components/layout/home-shell";
import { JsonLd, service, breadcrumb } from "@/components/seo/json-ld";

export default function EnHome() {
  return (
    <>
      <JsonLd
        data={[
          service({
            name: "Custom software, web & app development",
            serviceType: "Nearshore software development",
            description:
              "Custom software, web and mobile app development, e-commerce, SaaS platforms and AI automation, built end-to-end from Mexico City for companies in the US and LATAM.",
            path: "/en",
          }),
          breadcrumb("English", "/en"),
        ]}
      />
      <HomeShell />
    </>
  );
}
