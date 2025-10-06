import { Accordion, AccordionDetails, AccordionSummary, Typography } from "@mui/material";
import Card from "../../../components/Home/Cards/CardServicesMobile";
import PlansCard from "../../../components/Home/PlansCard";
import { ChevronDown } from "lucide-react";
import HeaderDesktop from "../../../components/Home/Header/HeaderDesktop";
import CardServicesDesktop from "../../../components/Home/Cards/CardServicesDesktop";
import { useState } from "react";
import PlansSection from "../../../components/Home/PlansSection";
import FAQSection from "../../../components/Home/FAQSection";
import Footer from "../../../components/Home/Footer";

export default function HomeDesktop() {

    return (
        <>
            <HeaderDesktop />
            <div>
                {/* main */}
                <section className={"flex flex-col justify-center p-5 h-dvh  bg-[url('/Home/bgImage.png')] bg-cover bg-center"}>
                    <div className="w-fit flex flex-col justify-center items-start gap-5 mt-64 ml-20 mr-20">
                        <h1 className={"text-5xl w-[53.2%] font-poppins font-bold uppercase text-center text-white"}>
                            Bem-vindo a csf Treinamentos
                        </h1>
                        <button className="bg-white w-[53.2%] mt-10 min-h-12 text-black font-semibold rounded-md">Entre em contato</button>
                    </div>
                </section>

                {/* about */}
                <section className="bg-oxford-blue flex justify-center p-5 pb-20 pt-20">
                    <div className="font-poppins w-full flex ml-20 mr-20">
                        <div>
                            <img className="w-full" src="https://placehold.co/500x500" alt="" />
                        </div>

                        <div className="ml-20 text-white flex flex-col justify-evenly max-w-lg">
                            <h1 className="text-3xl font-bold mb-5 mt-3 uppercase">Quem sou?</h1>
                            <p className="text-lg w-lg-">A Consultoria Saúde Fitness é especializada em oferecer atendimento personalizado em academias, residências e também ao ar livre para pessoas todas as idades. Desde 2000, nos dedicamos a promover a saúde integral, proporcionando orientação técnica e planos de treino adaptados a diferentes idades.</p>
                            <button className="bg-white mt-3 min-h-12 w-96 text-black font-semibold rounded-md">Conheça os planos</button>

                        </div>
                    </div>
                </section>

                <section className="mt-10 mb-10 p-5">
                    <div className="ml-20 mr-20">
                        <div className="flex justify-center items-center uppercase border-amber-600 wrapper-content mb-10">
                            <h1 className="ml-auto mr-auto mt-0 mb-0 text-center border-b-8 text-8xl line-clamp-1 text-oxford-blue font-bebas leading-none">Bora treinar com quem entende e se importa</h1>
                        </div>
                        <CardServicesDesktop title="Muito além do físico: um treinador que cuida de você" content="Lorem ipsum, dolor sit amet consectetur adipisicing elit. Perferendis voluptatum, beatae nihil dicta suscipit expedita rerum aliquid libero eum voluptates voluptate deleniti unde ullam ex!" image="https://placehold.co/650x430" isReverse={true} />
                        <CardServicesDesktop title="Um guia para a saúde em todas as idades" content="Lorem ipsum, dolor sit amet consectetur adipisicing elit. Perferendis voluptatum, beatae nihil dicta suscipit expedita rerum aliquid libero eum voluptates voluptate deleniti unde ullam ex!" image="https://placehold.co/650x430" />
                        <CardServicesDesktop title="Cuidando da sua saúde e inspirando sua família a fazer o mesmo" content="Lorem ipsum, dolor sit amet consectetur adipisicing elit. Perferendis voluptatum, beatae nihil dicta suscipit expedita rerum aliquid libero eum voluptates voluptate deleniti unde ullam ex!" image="https://placehold.co/650x430" isReverse={true} />
                    </div>
                </section >

                <PlansSection isMobile={false} />

                <FAQSection isMobile={false} />

                <Footer />
            </div >
        </>
    );
}
