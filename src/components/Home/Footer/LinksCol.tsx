type LinksColProps = {
    title: string;
    firstPage: string;
    firstPageBlank?: boolean;
    firstPageName: string;
    secondPage?: string;
    secondPageBlank?: boolean;
    secondPageName?: string;
    thirdPage?: string;
    thirdPageBlank?: boolean;
    thirdPageName?: string;
};

export default function LinksCol({ title, firstPage, firstPageBlank, firstPageName, secondPage, secondPageName, secondPageBlank, thirdPage, thirdPageName, thirdPageBlank }: LinksColProps) {
    return (
        <div id="col" className="flex flex-col gap-4">
            <h5 className="font-bold text-lg text-white">{title}</h5>
            <div className="flex flex-col gap-2">
                <a className="text-gray-400 hover:text-gigant-orange transition-colors" href={firstPage} target={firstPageBlank ? "_blank" : "_self"}>
                    {firstPageName}
                </a>
                {secondPage && secondPageName && <a className="text-gray-400 hover:text-gigant-orange transition-colors" href={secondPage} target={secondPageBlank ? "_blank" : "_self"}>
                    {secondPageName}
                </a>}
                {thirdPage && thirdPageName && <a className="text-gray-400 hover:text-gigant-orange transition-colors" href={thirdPage} target={thirdPageBlank ? "_blank" : "_self"}>
                    {thirdPageName}
                </a>}
            </div>
        </div>
    );
}
