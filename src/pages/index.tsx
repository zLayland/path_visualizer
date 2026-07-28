import { Header } from "@/components/header";
import { Map } from "@/components/map";
import { Selection } from "@/components/selection";

export default function Home() {
  return (
    <div>
      <section>
        <Header/>
      </section>
      <section className="flex justify-center items-center">
        <Map/>
      </section>
      <section className="flex justify-center items-center">
        <Selection/>
      </section>
    </div>
  );
}
