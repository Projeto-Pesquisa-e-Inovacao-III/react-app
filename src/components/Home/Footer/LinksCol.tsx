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
        <div id="col" className="flex flex-col justify-between">
            <h5 className="font-bold">{title}</h5>
            <a className="underline mt-3" href={firstPage} target={firstPageBlank ? "_blank" : "_self"}>
                {firstPageName}
            </a>
            {secondPage && secondPageName && <a className="underline mt-3 " href={secondPage} target={secondPageBlank ? "_blank" : "_self"}>
                {secondPageName}
            </a>}
            {thirdPage && thirdPageName && <a className="underline mt-3" href={thirdPage} target={thirdPageBlank ? "_blank" : "_self"}>
                {thirdPageName}
            </a>}
        </div>
    );
}
