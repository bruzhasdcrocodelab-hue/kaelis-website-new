import SiteProviders from "@/components/SiteProviders";
import NotFoundPageView from "@/components/not-found/NotFoundPageView";
import { dictionaries } from "@/lang";

export default function RootNotFound() {
  return <SiteProviders locale="en">
    <NotFoundPageView locale="en" dictionary={dictionaries.en} />
  </SiteProviders>;
}
