import React from "react";
import Container from "@components/container";

export default function Navbar() {
  return (
    <Container>
      <nav>
        <div className="flex flex-wrap justify-between border border-pink-200 md:gap-10 md:flex-nowrap">
          <div className="flex flex-col justify-start order-1 w-full border border-red-400 md:flex-row md:justify-end md:w-auto md:order-none md:flex-1">
            <a href="#">One</a>
            <a href="#">Two</a>
            <a href="#">Threee</a>
          </div>
          <div className="flex justify-between w-full md:w-auto">
            <span className="border border-red-400 ">Stablo</span>
            <button className="md:hidden">Menu</button>
          </div>

          <div className="flex flex-col justify-start order-2 w-full border border-red-400 md:flex-row md:w-auto md:flex-1 md:order-none">
            <a href="#">Four</a>
            <a href="#">Five</a>
            <a href="#">Six</a>
          </div>
        </div>
      </nav>
    </Container>
  );
}
