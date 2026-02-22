import { ArrowRight, CalendarIcon } from "lucide-react"

type Props = {
    actualPlan?: string | null;
}

export default function OverviewCardPackageStatus({ actualPlan }: Props) {
    return (
        <section className="bg-indigo rounded-xl shadow-lg p-6 text-white relative overflow-hidden group w-full">
            <div className="absolute right-0 top-0 text-white/10 transition-transform duration-500">
                <span className="material-icons-outlined text-9xl">
                    <svg width="83" height="99" viewBox="0 0 83 99" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M30.5 49L42.75 39.75L55 49L50.5 33.75L62.75 24H47.5L42.75 9L38 24H22.75L35 33.75L30.5 49ZM85.5 29.25C85.5 5.75 66.25 -13.25 42.75 -13.25C19.25 -13.25 0 5.75 0 29.25C0 40.25 4.25 50 10.75 57.5V98.75L42.75 88L74.75 98.75V57.5C81.25 50 85.5 40.25 85.5 29.25ZM42.75 -2.75C60.5 -2.75 74.75 11.75 74.75 29.25C74.75 47 60.5 61.25 42.75 61.25C25 61.25 10.75 47 10.75 29.25C10.75 11.75 25 -2.75 42.75 -2.75ZM42.75 77.25L21.5 82.75V66.25C27.75 69.75 35 72 42.75 72C50.5 72 57.75 69.75 64 66.25V82.75L42.75 77.25Z" fill="white" fill-opacity="0.1" />
                    </svg>
                </span>
            </div>
            <div className="relative z-10">
                <span className="bg-white/20 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest mb-4 inline-block">Plano Ativo</span>
                <h3 className="text-2xl font-black mb-1">{actualPlan}</h3>
                <p className="text-white/70 text-sm mb-6 flex items-center gap-2">
                    <span className="material-icons-outlined text-sm"><CalendarIcon size={17} /></span>
                    Expira em 24/11/2026
                </p>
                <div className="bg-white/10 backdrop-blur-md rounded-lg p-3 mb-6 border border-white/10">
                    <div className="flex justify-between items-center text-sm mb-1">
                        <span>Progresso restante</span>
                        <span className="font-bold">80%</span>
                    </div>
                    <div className="w-full bg-white/20 rounded-full h-1.5 overflow-hidden">
                        <div className="bg-white h-full w-[80%]"></div>
                    </div>
                </div>
                <button className="h-11! text-indigo cursor-pointer w-full py-3 bg-white font-bold rounded-xl shadow-md hover:bg-slate-50 transition-all flex items-center justify-center gap-2">
                    Histórico de compras
                    <span className="material-icons-outlined text-sm"><ArrowRight size={17} /></span>
                </button>
            </div>
        </section>
    )
}
